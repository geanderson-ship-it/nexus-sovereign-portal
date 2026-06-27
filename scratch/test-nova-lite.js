const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const region = process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.BEDROCK_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

console.log(`Connecting to region: ${region}`);
console.log(`Access Key ID: ${accessKeyId ? accessKeyId.slice(0, 8) + '...' : 'NONE'}`);

const client = new BedrockRuntimeClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
});

async function run() {
  const modelId = "us.amazon.nova-2-lite-v1:0";
  console.log(`Testing model: ${modelId} via ConverseCommand...`);
  
  try {
    const command = new ConverseCommand({
      modelId,
      messages: [
        {
          role: "user",
          content: [{ text: "Olá! Responda apenas com a palavra 'FUNCIONANDO' se você estiver me ouvindo." }]
        }
      ],
      inferenceConfig: {
        maxTokens: 50,
        temperature: 0.1
      }
    });

    const response = await client.send(command);
    console.log("SUCCESS!");
    console.log("Response status:", response.$metadata.httpStatusCode);
    console.log("Response text:", response.output.message.content[0].text);
  } catch (error) {
    console.error("FAILED:", error.name, "-", error.message);
  }
}

run();
