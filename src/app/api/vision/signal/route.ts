import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export const dynamic = 'force-dynamic';

// SINALIZAÇÃO WEBRTC — API DEDICADA PARA O NEXUS VISION
// Separada da tabela Atena_Memories para evitar colisão de dados e garantir performance.
// Usa ScanCommand com FilterExpression duplo (roomId + TTL no servidor) para máxima compatibilidade
// com DynamoDB sem necessidade de GSI adicional.

const client = new DynamoDBClient({
  region: process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId:
      process.env.AMPLIFY_ACCESS_KEY_ID ||
      process.env.BEDROCK_ACCESS_KEY_ID ||
      process.env.NEXUS_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID ||
      '',
    secretAccessKey:
      process.env.AMPLIFY_SECRET_ACCESS_KEY ||
      process.env.BEDROCK_SECRET_ACCESS_KEY ||
      process.env.NEXUS_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// MESMA TABELA — mas com prefixo "vision#" no userId para isolar os dados
const TABLE_NAME = 'Nexus_Atena_Memories';
const SIGNAL_TTL_MS = 60000; // 60 segundos — sinais WebRTC devem ser efêmeros
const VISION_PREFIX = 'vision#';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return NextResponse.json({ error: 'roomId é obrigatório.' }, { status: 400 });
    }

    const now = Date.now();
    const cutoffIso = new Date(now - SIGNAL_TTL_MS).toISOString();
    const scopedUserId = `${VISION_PREFIX}${roomId}`;

    // Busca TODOS os sinais desta sala com filtro de userId e timestamp recente
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'userId = :uid AND #ts >= :cutoff',
      ExpressionAttributeNames: {
        '#ts': 'timestamp', // "timestamp" é palavra reservada no DynamoDB
      },
      ExpressionAttributeValues: {
        ':uid': scopedUserId,
        ':cutoff': cutoffIso,
      },
    });

    const response = await docClient.send(command);
    const items = response.Items || [];

    const signals = items
      .map((m: any) => {
        try {
          return {
            id: m.id,
            type: m.categoria,
            timestamp: m.timestamp,
            payload: JSON.parse(m.conteudo),
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    // Ordena do mais antigo para o mais recente (importante para WebRTC offer/answer ordering)
    signals.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({ signals });
  } catch (error: any) {
    console.error('[Vision Signal GET Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao buscar sinais.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, type, sender, data } = body;

    if (!roomId || !type || !sender) {
      return NextResponse.json({ error: 'Parâmetros incompletos: roomId, type e sender são obrigatórios.' }, { status: 400 });
    }

    const scopedUserId = `${VISION_PREFIX}${roomId}`;
    const now = new Date().toISOString();

    const item = {
      id: crypto.randomUUID(),
      userId: scopedUserId,   // Chave de partição prefixada para isolamento
      timestamp: now,         // Chave de ordenação e filtro de TTL
      categoria: type,        // tipo do sinal: presence, webrtc-offer, webrtc-answer, webrtc-candidate
      conteudo: JSON.stringify({ sender, data }),
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    // EXCLUSÃO AUTOMÁTICA DE SINAIS EXPIRADOS (AUTO-LIMPEZA DYNAMODB)
    // Limpa registros obsoletos da sala em paralelo para manter a tabela leve (<1MB) e evitar lentidão ou paginação no Scan
    try {
      const cutoff = new Date(Date.now() - SIGNAL_TTL_MS).toISOString();
      const expiredRes = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'userId = :uid AND #ts < :cutoff',
        ExpressionAttributeNames: { '#ts': 'timestamp' },
        ExpressionAttributeValues: { ':uid': scopedUserId, ':cutoff': cutoff }
      }));
      const itemsToDelete = expiredRes.Items || [];
      if (itemsToDelete.length > 0) {
        await Promise.all(itemsToDelete.map(expiredItem => 
          docClient.send(new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id: expiredItem.id }
          }))
        ));
      }
    } catch (e) {
      console.warn('[Vision TTL Cleanup Error]', e);
    }

    return NextResponse.json({ success: true, id: item.id });
  } catch (error: any) {
    console.error('[Vision Signal POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao salvar sinal.' }, { status: 500 });
  }
}
