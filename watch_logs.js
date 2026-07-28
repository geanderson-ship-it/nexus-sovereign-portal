const fs = require('fs');
const path = require('path');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.NEXUS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXUS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'Nexus_Atena_Memories';

let lastSeenTimestamp = new Date(Date.now() - 3 * 60 * 1000).toISOString();

async function pollLogs() {
  try {
    const response = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'userId = :userId AND #ts > :lastTs',
      ExpressionAttributeNames: {
        '#ts': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':userId': 'vision-telemetry',
        ':lastTs': lastSeenTimestamp
      }
    }));

    const items = response.Items || [];
    if (items.length > 0) {
      items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      for (const item of items) {
        lastSeenTimestamp = item.timestamp;
        
        let payload;
        try {
          payload = JSON.parse(item.conteudo);
        } catch {
          payload = { message: item.conteudo, type: 'info' };
        }

        const dateStr = new Date(item.timestamp).toLocaleTimeString();
        if (payload.type === 'error') {
          console.log(`\x1b[31m[🚨 ERRO] [${dateStr}] ${payload.message}\x1b[0m`);
          if (payload.detail) console.log(`   └─ \x1b[90m${payload.detail}\x1b[0m`);
        } else {
          console.log(`\x1b[32m[❇️ INFO] [${dateStr}] ${payload.message}\x1b[0m`);
        }
      }
    }
  } catch (err) {
    // Silencioso
  }
}

console.log('\x1b[36m%s\x1b[0m', '🌐 Nexus Vision — Monitor de Telemetria Ativo!');
console.log('\x1b[90m%s\x1b[0m', 'Aguardando eventos em tempo real do site publicado...\n');

setInterval(pollLogs, 3000);
pollLogs();
