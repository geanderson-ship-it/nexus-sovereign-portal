import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

const region = process.env.NEXUS_REGION || process.env.AMPLIFY_REGION || process.env.AWS_REGION || 'us-east-1';

const config: any = { region };

const accessKeyId = process.env.NEXUS_ACCESS_KEY_ID || process.env.AMPLIFY_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXUS_SECRET_ACCESS_KEY || process.env.AMPLIFY_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

if (accessKeyId && secretAccessKey) {
  config.credentials = {
    accessKeyId,
    secretAccessKey,
  };
} else {
  console.log(`VIX DIAGNOSTIC: Usando credenciais padrão do ambiente (IAM Role) para o Bedrock Runtime na região ${region}.`);
}

export const bedrockClient = new BedrockRuntimeClient(config);

export const BEDROCK_NEXUS_MODEL = 'anthropic.claude-3-haiku-20240307-v1:0';
