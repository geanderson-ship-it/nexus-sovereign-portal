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

// Load the base system prompt from flow file
const flowFile = path.join(__dirname, "../src/ai/flows/dante-safra-flow.ts");
const flowContent = fs.readFileSync(flowFile, "utf-8");
const promptMatch = flowContent.match(/const DANTE_SYSTEM_PROMPT = `([\s\S]*?)`;/);
const basePrompt = promptMatch[1];

const artifactsDir = "C:/Users/geand/.gemini/antigravity/brain/1eb4755e-0f74-46e1-9080-7b2963e4dfec";
const filesToTest = [
  "leticia_braga_1780676166575.png",
  "media__1780681304401.png",
  "media__1780709120085.png",
  "media__1780759495219.png",
  "media__1780794961982.jpg"
];

function detectImageFormat(buffer) {
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'png';
  }
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    return 'jpeg';
  }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return 'gif';
  }
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return 'webp';
    }
  }
  return 'jpeg';
}

async function testImage(filename) {
  const filePath = path.join(artifactsDir, filename);
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  console.log(`\n---------------------------------------\nTesting Dante Safra on: ${filename}`);
  const imageBuffer = fs.readFileSync(filePath);
  const format = detectImageFormat(imageBuffer);
  
  try {
    const command = new ConverseCommand({
      modelId: "us.anthropic.claude-sonnet-4-6",
      system: [{ text: basePrompt }],
      messages: [
        {
          role: "user",
          content: [
            {
              image: {
                format,
                source: {
                  bytes: imageBuffer
                }
              }
            },
            { 
              text: "MENSAGEM: Analisando e Gerando..." 
            }
          ]
        }
      ],
      inferenceConfig: {
        maxTokens: 300,
        temperature: 0.1
      }
    });

    const response = await client.send(command);
    console.log("Dante Response:\n", response.output.message.content[0].text);
  } catch (error) {
    console.error("FAILED for", filename, ":", error.name, "-", error.message);
  }
}

async function run() {
  for (const file of filesToTest) {
    await testImage(file);
  }
}

run();
