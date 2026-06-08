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

const imagePath = "C:/Users/geand/.gemini/antigravity/brain/1eb4755e-0f74-46e1-9080-7b2963e4dfec/media__1780794961982.jpg";
const imageBuffer = fs.readFileSync(imagePath);

async function run() {
  console.log("Asking Claude to compare the plant in media__1780794961982.jpg...");
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
              text: "The user states that this plant is a Zamioculca (Zamioculcas zamiifolia). However, in previous tests, the AI identified it as a Citrus seedling. Please examine the image extremely closely. Identify any features that match a young Zamioculca sprout or cutting (e.g., succulent base, leaflet connection, natural white spots/markings on the stem, leaf shape and thickness) vs a Citrus seedling. Tell me if it is indeed a Zamioculca, and explain the exact visual features that confirm it so we can write a perfect system prompt rule." 
            }
          ]
        }
      ],
      inferenceConfig: {
        maxTokens: 1000,
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
