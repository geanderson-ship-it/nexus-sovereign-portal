const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const fs = require("fs");
const path = require("path");

// Carrega .env.local de Gitclone manualmente
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/(^['"]|['"]$)/g, '');
      process.env[key] = val;
    }
  });
}

const client = new DynamoDBClient({
  region: process.env.NEXUS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXUS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXUS_SECRET_ACCESS_KEY || '',
  }
});
const docClient = DynamoDBDocumentClient.from(client);

async function run() {
  const systemTime = new Date().toISOString();
  console.log("Hora atual do sistema (UTC):", systemTime);
  
  const command = new ScanCommand({
    TableName: "Nexus_Atena_Memories"
  });
  const res = await docClient.send(command);
  console.log("Quantidade total de registros no banco:", res.Count);
  if (res.Items && res.Items.length > 0) {
    const telemetry = res.Items.filter(item => item.userId === 'vision-telemetry');
    const sorted = telemetry.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    console.log("20 logs de telemetria mais recentes:");
    sorted.slice(0, 20).forEach(item => {
      const payload = JSON.parse(item.conteudo);
      console.log(`- [${item.timestamp}] Tipo: ${payload.type} | Mensagem: ${payload.message} | Detalhe: ${JSON.stringify(payload.detail)}`);
    });
  } else {
    console.log("Nenhum registro encontrado na tabela.");
  }
}
run().catch(console.error);
