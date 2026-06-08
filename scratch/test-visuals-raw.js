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

const filePath = "C:/Users/geand/.gemini/antigravity/brain/1eb4755e-0f74-46e1-9080-7b2963e4dfec/media__1780794961982.jpg";
const imageBuffer = fs.readFileSync(filePath);

async function run() {
  console.log("Analyzing image directly with Claude 3.5 Sonnet (no system prompt)...");
  try {
    const command = new ConverseCommand({
      modelId: "us.anthropic.claude-sonnet-4-6",
      messages: [
        {
          role: "user",
          content: [
            {
              image: {
                format: "jpeg",
                source: {
                  bytes: imageBuffer
                }
              }
            },
            { 
              text: "Examine this plant image carefully. What plant is this? Describe its botanical features (stem, leaf texture, leaf layout). Is this a Zamioculcas (Zamioculcas zamiifolia) or a Citrus (lime/orange/lemon) seedling?" 
            }
          ]
        }
      ],
      inferenceConfig: {
        maxTokens: 500,
        temperature: 0.1
      }
    });

    const response = await client.send(command);
    console.log("Response:\n", response.output.message.content[0].text);
  } catch (error) {
    console.error("FAILED:", error.name, "-", error.message);
  }
}

run();
