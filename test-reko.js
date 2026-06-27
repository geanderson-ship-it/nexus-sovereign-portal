const { RekognitionClient, ListCollectionsCommand } = require("@aws-sdk/client-rekognition");
require("dotenv").config({ path: ".env.local" });

const client = new RekognitionClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function main() {
  try {
    const command = new ListCollectionsCommand({});
    await client.send(command);
    console.log("AWS Rekognition Autorizado.");
  } catch (error) {
    console.error("Erro no AWS Rekognition:", error.message);
  }
}

main();
