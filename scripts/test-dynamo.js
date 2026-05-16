const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const fs = require('fs');

// Lê o .env.local manualmente
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim();
});

const client = new DynamoDBClient({
  region: process.env.NEXUS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXUS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXUS_SECRET_ACCESS_KEY,
  },
});

client.send(new ListTablesCommand({}))
  .then(r => console.log('Conexao OK! Tabelas:', r.TableNames))
  .catch(e => console.error('Erro:', e.message));
