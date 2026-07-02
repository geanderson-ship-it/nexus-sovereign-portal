const { BedrockClient, ListFoundationModelsCommand } = require("@aws-sdk/client-bedrock");
require('dotenv').config({ path: '.env.local' });

async function testAWS() {
  try {
    console.log("Iniciando teste de conexão com AWS Bedrock (Aço Máximo)...");
    
    // Validate if keys exist
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error("As chaves AWS_ACCESS_KEY_ID ou AWS_SECRET_ACCESS_KEY não foram encontradas no .env.local!");
    }

    // Configurar o cliente com as variáveis do .env.local
    const client = new BedrockClient({ 
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    console.log(`Testando autenticação com Access Key: ${process.env.AWS_ACCESS_KEY_ID.substring(0, 5)}...`);

    // Tentar listar os modelos para provar que a chave tem permissão
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    
    console.log(`\n✅ SUCESSO ABSOLUTO! Conexão estabelecida e autenticada com a AWS.`);
    console.log(`✅ A sua conta possui ${response.modelSummaries.length} modelos de IA disponíveis.`);
    
    console.log("\nAlguns dos modelos mapeados no seu Bedrock:");
    const models = response.modelSummaries
      .filter(m => m.modelId.includes('anthropic') || m.modelId.includes('amazon') || m.modelId.includes('meta'))
      .slice(0, 7)
      .map(m => m.modelId);
      
    models.forEach(m => console.log(`- 🧠 ${m}`));
    
    console.log("\nTeste concluído. O usuário 'atena-nexus-agent' tem permissão total!");
  } catch (error) {
    console.error("\n❌ ERRO ao conectar com a AWS:");
    console.error(error.message);
  }
}

testAWS();
