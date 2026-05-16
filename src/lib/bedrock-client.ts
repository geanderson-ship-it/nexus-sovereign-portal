import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.NEXUS_REGION || process.env.AMPLIFY_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXUS_ACCESS_KEY_ID || process.env.AMPLIFY_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXUS_SECRET_ACCESS_KEY || process.env.AMPLIFY_SECRET_ACCESS_KEY || '',
  },
});
