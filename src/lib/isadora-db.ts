import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.BEDROCK_REGION || process.env.AWS_REGION || process.env.REGIÃO_AWS || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS || process.env['ID_DA_CHAVE_DE_ACESSO_AWS'] || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'Nexus_Isadora_Conversations';
const MAX_HISTORY_LENGTH = 20;

export interface IsadoraMessage {
  role: 'user' | 'assistant';
  content: any[];
  timestamp?: string;
}

export interface IsadoraSession {
  phone: string;
  history: IsadoraMessage[];
  nicho?: string;
  purchaseIntention?: number;
  lastInteraction: string;
  createdAt: string;
  handoffTriggered?: boolean;
  handoffTime?: string;
}

/**
 * Recupera histórico de conversa de um cliente
 */
export async function getIsadoraHistory(phone: string): Promise<IsadoraMessage[]> {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { phone },
    });

    const response = await docClient.send(command);
    
    if (response.Item && response.Item.history) {
      return response.Item.history as IsadoraMessage[];
    }
    
    return [];
  } catch (error) {
    console.error(`[Isadora DB] Erro ao buscar histórico de ${phone}:`, error);
    return [];
  }
}

/**
 * Salva histórico completo da conversa no DynamoDB
 */
export async function saveIsadoraHistory(
  phone: string,
  history: IsadoraMessage[],
  nicho?: string,
  purchaseIntention?: number
) {
  try {
    const trimmedHistory = history.slice(-MAX_HISTORY_LENGTH);

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { phone },
      UpdateExpression: 'SET #history = :history, lastInteraction = :lastInteraction, #nicho = if_not_exists(#nicho, :nicho), purchaseIntention = :purchaseIntention, createdAt = if_not_exists(createdAt, :createdAt)',
      ExpressionAttributeNames: {
        '#history': 'history',
        '#nicho': 'nicho',
      },
      ExpressionAttributeValues: {
        ':history': trimmedHistory,
        ':lastInteraction': new Date().toISOString(),
        ':nicho': nicho || 'unknown',
        ':purchaseIntention': purchaseIntention || 0,
        ':createdAt': new Date().toISOString(),
      },
    });

    await docClient.send(command);
  } catch (error) {
    console.error(`[Isadora DB] Erro ao salvar histórico de ${phone}:`, error);
  }
}

/**
 * Registra quando uma venda quente foi detectada e handoff acionado
 */
export async function recordHandoff(phone: string, nicho: string, purchaseIntention: number) {
  try {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { phone },
      UpdateExpression: 'SET handoffTriggered = :true, handoffTime = :time, handoffNicho = :nicho, handoffScore = :score',
      ExpressionAttributeValues: {
        ':true': true,
        ':time': new Date().toISOString(),
        ':nicho': nicho,
        ':score': purchaseIntention,
      },
    });

    await docClient.send(command);
    console.log(`[Isadora DB] 🔥 Handoff registrado para ${phone} | Nicho: ${nicho} | Score: ${purchaseIntention}`);
  } catch (error) {
    console.error(`[Isadora DB] Erro ao registrar handoff de ${phone}:`, error);
  }
}

/**
 * Recupera todas as vendas quentes (para notificar Geanderson)
 */
export async function getHotLeads(limit: number = 10): Promise<IsadoraSession[]> {
  try {
    // Nota: Isso seria uma query mais complexa em produção
    // Por enquanto, retornamos um array vazio
    console.log(`[Isadora DB] Buscando últimas ${limit} vendas quentes...`);
    return [];
  } catch (error) {
    console.error(`[Isadora DB] Erro ao buscar vendas quentes:`, error);
    return [];
  }
}

/**
 * Recupera dados da sessão de um cliente
 */
export async function getIsadoraSession(phone: string): Promise<IsadoraSession | null> {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { phone },
    });

    const response = await docClient.send(command);
    return response.Item as IsadoraSession || null;
  } catch (error) {
    console.error(`[Isadora DB] Erro ao buscar sessão de ${phone}:`, error);
    return null;
  }
}

/**
 * Verifica se o messageId do WhatsApp/Z-API já foi processado para evitar duplicidade de envio.
 * Usa gravação condicional no DynamoDB para evitar concorrência.
 * Retorna true se for nova, false se for duplicada.
 */
export async function checkAndRegisterMessage(phone: string, messageId: string): Promise<boolean> {
  try {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { phone },
      UpdateExpression: 'SET lastMessageId = :messageId',
      ConditionExpression: 'attribute_not_exists(lastMessageId) OR lastMessageId <> :messageId',
      ExpressionAttributeValues: {
        ':messageId': messageId,
      },
    });

    await docClient.send(command);
    return true; // Mensagem nova registrada com sucesso
  } catch (error: any) {
    if (error.name === 'ConditionalCheckFailedException') {
      console.log(`[Isadora DB] 🚫 Mensagem duplicada detectada para ${phone}: ${messageId}`);
      return false; // Duplicada
    }
    // Caso ocorra outro erro de banco (ex: tabela não criada), permite continuar para não travar o bot
    console.error(`[Isadora DB] Erro no checkAndRegisterMessage para ${phone}:`, error);
    return true;
  }
}
