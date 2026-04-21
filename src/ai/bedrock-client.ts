import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Configuração do Cliente AWS (Usando a região que vimos no seu print anterior)
const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const askClaude = async (prompt: string) => {
  const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0"; // O modelo que você viu no catálogo

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1000,
    messages: [
      { role: "user", content: prompt }
    ],
  };

  try {
    const command = new InvokeModelCommand({
      contentType: "application/json",
      body: JSON.stringify(payload),
      modelId,
    });

    const response = await client.send(command);
    const decodedResponse = JSON.parse(new TextDecoder().decode(response.body));
    return decodedResponse.content[0].text;
  } catch (error) {
    console.error("Erro ao chamar AWS Bedrock:", error);
    return "Erro na consulta de IA.";
  }
};