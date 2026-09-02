import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export const dynamic = 'force-dynamic';

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

// Nova tabela dedicada para WebRTC com PK: roomId e SK: timestamp
const TABLE_NAME = 'Nexus_Vision_Signals';
const SIGNAL_TTL_MS = 60000;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return NextResponse.json({ error: 'roomId é obrigatório.' }, { status: 400 });
    }

    const now = Date.now();
    const cutoffIso = new Date(now - SIGNAL_TTL_MS).toISOString();

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'roomId = :rid AND #ts >= :cutoff',
      ExpressionAttributeNames: {
        '#ts': 'timestamp', // "timestamp" é palavra reservada no DynamoDB
      },
      ExpressionAttributeValues: {
        ':rid': roomId,
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
            type: m.type,
            timestamp: m.timestamp,
            payload: m.payload,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    // Ordena do mais antigo para o mais recente
    signals.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({ signals, serverTime: Date.now() });
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
      return NextResponse.json({ error: 'Parâmetros incompletos.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const signalId = crypto.randomUUID();

    const item = {
      roomId,        // Partition Key
      timestamp: now, // Sort Key
      id: signalId,
      type,
      payload: { sender, data },
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    // Auto-limpeza assíncrona (best effort)
    try {
      const cutoff = new Date(Date.now() - SIGNAL_TTL_MS).toISOString();
      const expiredRes = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'roomId = :rid AND #ts < :cutoff',
        ExpressionAttributeNames: { '#ts': 'timestamp' },
        ExpressionAttributeValues: { ':rid': roomId, ':cutoff': cutoff }
      }));
      const itemsToDelete = expiredRes.Items || [];
      if (itemsToDelete.length > 0) {
        await Promise.all(itemsToDelete.map(expiredItem => 
          docClient.send(new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { roomId: expiredItem.roomId, timestamp: expiredItem.timestamp }
          }))
        ));
      }
    } catch (e) {
      console.warn('[Vision TTL Cleanup Error]', e);
    }

    return NextResponse.json({ success: true, id: signalId });
  } catch (error: any) {
    console.error('[Vision Signal POST Error]', error);
    return NextResponse.json({ error: error.message || 'Erro ao salvar sinal.' }, { status: 500 });
  }
}
