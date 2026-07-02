const { BedrockClient, ListInferenceProfilesCommand } = require("@aws-sdk/client-bedrock");
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
    const command = new ListInferenceProfilesCommand({});
    const response = await client.send(command);
    
    const activeProfiles = response.inferenceProfileSummaries
      .filter(p => p.status === "ACTIVE")
      .map(p => p.inferenceProfileId);
      
    console.log("Inference Profiles Ativos:", activeProfiles.join("\n"));
  } catch (error) {
    console.error("Erro:", error.message);
  }
}

main();
