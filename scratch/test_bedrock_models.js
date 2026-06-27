const { BedrockClient, ListFoundationModelsCommand } = require("@aws-sdk/client-bedrock");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const region = process.env.BEDROCK_REGION || process.env.AWS_REGION || process.env.AMPLIFY_REGION || process.env.NEXUS_REGION || 'us-east-1';

const accessKeyId = 
  process.env.BEDROCK_ACCESS_KEY_ID || 
  process.env.AWS_ACCESS_KEY_ID || 
  process.env.AMPLIFY_ACCESS_KEY_ID || 
  process.env.NEXUS_ACCESS_KEY_ID;

const secretAccessKey = 
  process.env.BEDROCK_SECRET_ACCESS_KEY || 
  process.env.AWS_SECRET_ACCESS_KEY || 
  process.env.AMPLIFY_SECRET_ACCESS_KEY || 
  process.env.NEXUS_SECRET_ACCESS_KEY;

const client = new BedrockClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

async function listModels() {
  try {
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    const models = response.modelSummaries
        .filter(m => m.providerName === 'Anthropic' && m.modelId.includes('haiku'))
        .map(m => m.modelId);
    console.log("Haiku models available:", models);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
