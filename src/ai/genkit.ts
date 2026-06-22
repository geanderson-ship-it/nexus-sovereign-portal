
import { genkit } from 'genkit';
import { awsBedrock } from 'genkitx-aws-bedrock';

// VIX: Protocolo de "Unificação AWS" ativado.
// Os créditos do AWS Activate garantem o uso dos modelos Claude 3 via Bedrock.
if (!process.env.AWS_REGION && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ [NEXUS COMPONENT] Warning: AWS Region not found. Bedrock calls might fail.");
}

export const NEXUS_MODEL = 'aws-bedrock/us.anthropic.claude-sonnet-4-6';

const bedrockRegion = process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1';
const bedrockAccessKeyId = process.env.BEDROCK_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const bedrockSecretAccessKey = process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

export const ai = genkit({
  plugins: [
    awsBedrock({
      region: bedrockRegion,
      ...(bedrockAccessKeyId && bedrockSecretAccessKey ? {
        credentials: {
          accessKeyId: bedrockAccessKeyId,
          secretAccessKey: bedrockSecretAccessKey,
        }
      } : {})
    }),
  ],
  // Otimização Platinum: Por padrão, usamos o Claude 3.5 Haiku (CRIS) para a agilidade da Nexus.
  model: NEXUS_MODEL,
});

console.log("VIX DIAGNOSTIC: Genkit initialized with model:", NEXUS_MODEL);
