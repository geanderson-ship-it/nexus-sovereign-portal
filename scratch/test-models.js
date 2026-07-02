const { BedrockClient, ListFoundationModelsCommand } = require("@aws-sdk/client-bedrock");
require("dotenv").config({ path: ".env.local" });

const client = new BedrockClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function main() {
  try {
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    
    // Filtra apenas modelos ativos da Anthropic ou Amazon
    const activeModels = response.modelSummaries
      .filter(m => m.modelLifecycle.status === "ACTIVE")
      .map(m => m.modelId);
      
    console.log("Modelos Ativos:", activeModels.join("\n"));
  } catch (error) {
    console.error("Erro:", error.message);
  }
}

main();
