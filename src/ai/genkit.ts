
import { genkit } from 'genkit';
import { awsBedrock } from 'genkitx-aws-bedrock';

// VIX: Protocolo de "Unificação AWS" ativado.
// Os créditos do AWS Activate garantem o uso dos modelos Claude 3 via Bedrock.
if (!process.env.AWS_REGION && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ [NEXUS COMPONENT] Warning: AWS Region not found. Bedrock calls might fail.");
}

export const ai = genkit({
  plugins: [
    awsBedrock({
      region: process.env.AWS_REGION || 'us-east-1',
    }),
  ],
  // Otimização Platinum: Por padrão, usamos o Claude 3 Sonnet para a profundidade da Nexus.
  model: 'aws-bedrock/anthropic.claude-3-sonnet-20240229-v1:0', 
});
