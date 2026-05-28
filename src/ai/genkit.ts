
import { genkit } from 'genkit';
import { awsBedrock } from 'genkitx-aws-bedrock';

// VIX: Protocolo de "Unificação AWS" ativado.
// Os créditos do AWS Activate garantem o uso dos modelos Claude 3 via Bedrock.
if (!process.env.AWS_REGION && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ [NEXUS COMPONENT] Warning: AWS Region not found. Bedrock calls might fail.");
}

export const NEXUS_MODEL = 'aws-bedrock/us.anthropic.claude-sonnet-4-6';

export const ai = genkit({
  plugins: [
    awsBedrock({
      region: process.env.AWS_REGION || 'us-east-1',
    }),
  ],
  // Otimização Platinum: Por padrão, usamos o Claude 3 Haiku para a agilidade da Nexus.
  model: NEXUS_MODEL,
});

console.log("VIX DIAGNOSTIC: Genkit initialized with model:", NEXUS_MODEL);
