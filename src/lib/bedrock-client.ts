import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

// Configuração otimizada para o Amplify Hosting da Nexus
export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AMPLIFY_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY || '',
  },
});