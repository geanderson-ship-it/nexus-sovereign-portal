import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

// AWS_ credentials have Bedrock permissions; NEXUS_ credentials are scoped to DynamoDB only.
// Priority: AWS_ (Bedrock) > AMPLIFY_ > NEXUS_ (DynamoDB)
const region = process.env.AWS_REGION || process.env.AMPLIFY_REGION || process.env.NEXUS_REGION || 'us-east-1';

const config: any = { region };

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AMPLIFY_ACCESS_KEY_ID || process.env.NEXUS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AMPLIFY_SECRET_ACCESS_KEY || process.env.NEXUS_SECRET_ACCESS_KEY;

if (accessKeyId && secretAccessKey) {
  config.credentials = {
    accessKeyId,
    secretAccessKey,
  };
  console.log(`VIX DIAGNOSTIC: Bedrock credenciais carregadas. KeyId: ${accessKeyId?.slice(0, 8)}... Região: ${region}`);
} else {
  console.log(`VIX DIAGNOSTIC: Nenhuma credencial encontrada. Tentando IAM Role para Bedrock na região ${region}.`);
}

export const bedrockClient = new BedrockRuntimeClient(config);

export const BEDROCK_NEXUS_MODEL = 'us.anthropic.claude-sonnet-4-6';
