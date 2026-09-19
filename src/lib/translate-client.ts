import { TranslateClient } from "@aws-sdk/client-translate";

/**
 * Cliente do Amazon Translate.
 *
 * Segue o mesmo padrão do bedrock-client.ts: região e credenciais lidas de
 * variáveis de ambiente somente-servidor. Reaproveita as mesmas credenciais
 * usadas pelo Bedrock (a role/usuário do Amplify), então basta garantir a
 * permissão IAM `translate:TranslateText` para funcionar.
 *
 * O serviço roda dentro da própria conta AWS (mesma infra/soberania), com
 * latência baixa (~200-500ms) e alta capacidade de tradução.
 */
export const translateClient = new TranslateClient({
  region:
    process.env.TRANSLATE_REGION ||
    process.env.BEDROCK_REGION ||
    process.env.AWS_REGION ||
    'us-east-1',
  credentials: {
    accessKeyId:
      process.env.BEDROCK_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID ||
      process.env.AMPLIFY_ACCESS_KEY_ID ||
      process.env.NEXUS_ACCESS_KEY_ID ||
      '',
    secretAccessKey:
      process.env.BEDROCK_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      process.env.AMPLIFY_SECRET_ACCESS_KEY ||
      process.env.NEXUS_SECRET_ACCESS_KEY ||
      '',
  },
});
