import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.BEDROCK_REGION || process.env.AWS_REGION || process.env.REGIÃO_AWS || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ID_DA_CHAVE_DE_ACESSO_AWS || process.env['ID_DA_CHAVE_DE_ACESSO_AWS'] || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'Nexus_Atena_Memories';

export interface AtenaMemory {
  id: string; // Um ID único, ex: uuid
  userId: string; // Para quem é essa memória (ex: "geanderson")
  timestamp: string; // Data e hora
  categoria: string; // Ex: "estratégia", "pessoal", "projeto"
  conteudo: string; // O que ela deve lembrar
}

/**
 * Salva uma nova memória no cérebro de longo prazo da Atena
 */
export async function saveAtenaMemory(memory: Omit<AtenaMemory, 'id' | 'timestamp'>) {
  try {
    const newMemory: AtenaMemory = {
      ...memory,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newMemory,
    });

    await docClient.send(command);
    return true;
  } catch (error) {
    console.error(`[Atena DB] Erro ao salvar memória:`, error);
    return false;
  }
}

/**
 * Busca memórias relevantes no cérebro de longo prazo
 */
export async function searchAtenaMemories(userId: string, termoBusca?: string): Promise<AtenaMemory[]> {
  try {
    // Usamos Scan para buscar no banco. 
    // Em produção com milhões de dados, usaríamos Query com Global Secondary Index (GSI)
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });

    const response = await docClient.send(command);
    let memories = (response.Items as AtenaMemory[]) || [];

    // Se a Atena passou um termo de busca, filtramos pelo termo no conteúdo ou categoria
    if (termoBusca && termoBusca.trim() !== '') {
      const termo = termoBusca.toLowerCase();
      memories = memories.filter(m => 
        m.conteudo.toLowerCase().includes(termo) || 
        m.categoria.toLowerCase().includes(termo)
      );
    }

    // Ordenamos das mais recentes para as mais antigas
    memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return memories;
  } catch (error) {
    console.error(`[Atena DB] Erro ao buscar memórias:`, error);
    return [];
  }
}
