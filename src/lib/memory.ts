import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

// Inicializando o Client do DynamoDB usando as credenciais que já temos do Bedrock
const client = new DynamoDBClient({
  region: process.env.BEDROCK_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Nome da Tabela no DynamoDB (precisará ser criada no console da AWS)
const TABLE_NAME = 'Nexus_Isadora_Memory';
const MAX_HISTORY_LENGTH = 15; // Guarda apenas as últimas 15 mensagens para economizar tokens

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function getChatHistory(phone: string): Promise<ChatMessage[]> {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        phone: phone,
      },
    });

    const response = await docClient.send(command);
    
    if (response.Item && response.Item.history) {
      return response.Item.history as ChatMessage[];
    }
    
    return [];
  } catch (error) {
    console.error(`Erro ao buscar histórico do número ${phone}:`, error);
    // Em caso de erro (ex: tabela não existe), retornamos array vazio para não quebrar o fluxo
    return [];
  }
}

export async function saveChatHistory(phone: string, history: ChatMessage[]) {
  try {
    // Garante que o histórico não cresça infinitamente
    const trimmedHistory = history.slice(-MAX_HISTORY_LENGTH);

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        phone: phone,
        history: trimmedHistory,
        lastInteraction: new Date().toISOString(),
      },
    });

    await docClient.send(command);
  } catch (error) {
    console.error(`Erro ao salvar histórico do número ${phone}:`, error);
  }
}
