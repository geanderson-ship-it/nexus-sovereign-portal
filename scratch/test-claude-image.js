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

const client = new BedrockRuntimeClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
});

// A tiny 1x1 transparent PNG base64
const dummyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

async function run() {
  const modelId = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";
  console.log(`Testing image processing with model: ${modelId}...`);
  
  try {
    const command = new ConverseCommand({
      modelId,
      messages: [
        {
          role: "user",
          content: [
            {
              image: {
                format: "png",
                source: {
                  bytes: Buffer.from(dummyPngBase64, 'base64')
                }
              }
            },
            { text: "Diga apenas a palavra 'OK' se você conseguir ver esta imagem sem erros." }
          ]
        }
      ],
      inferenceConfig: {
        maxTokens: 50,
        temperature: 0.1
      }
    });

    const response = await client.send(command);
    console.log("SUCCESS!");
    console.log("Response text:", response.output.message.content[0].text);
  } catch (error) {
    console.error("FAILED:", error.name, "-", error.message);
  }
}

run();
