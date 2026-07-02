const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
require("dotenv").config({ path: ".env.local" });

const client = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function main() {
  try {
    const command = new SynthesizeSpeechCommand({
      Engine: "neural",
      LanguageCode: "pt-BR",
      VoiceId: "Camila",
      OutputFormat: "mp3",
      Text: "Teste de voz da Atena",
      TextType: "text"
    });
    
    const response = await client.send(command);
    console.log("Sucesso! AWS Polly está funcionando e autorizado. Bytes recebidos:", response.AudioStream ? "Sim" : "Não");
  } catch (error) {
    console.error("Erro no AWS Polly:", error.message);
  }
}

main();
