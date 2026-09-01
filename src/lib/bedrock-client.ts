import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || process.env.AMPLIFY_ACCESS_KEY_ID || process.env.NEXUS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || process.env.AMPLIFY_SECRET_ACCESS_KEY || process.env.NEXUS_SECRET_ACCESS_KEY || '',
  },
});
