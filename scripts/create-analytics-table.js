const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

async function createTable() {
  try {
    await client.send(new CreateTableCommand({
      TableName: 'nexus-page-events',
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'timestamp', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'timestamp', KeyType: 'RANGE' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }));
    console.log('Tabela nexus-page-events criada com sucesso!');
  } catch (e) {
    if (e.name === 'ResourceInUseException') {
      console.log('Tabela ja existe!');
    } else {
      console.error('Erro:', e.message);
    }
  }
}

createTable();
