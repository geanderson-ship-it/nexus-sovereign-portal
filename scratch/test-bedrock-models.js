const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
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
      process.env[key] = value;
    }
  });
}

const bedrockRegion = process.env.AWS_REGION || 'us-east-1';
const bedrockAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const bedrockSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const client = new BedrockRuntimeClient({
  region: bedrockRegion,
  credentials: {
    accessKeyId: bedrockAccessKeyId,
    secretAccessKey: bedrockSecretAccessKey,
  }
});

async function testModel(modelId, payload) {
  console.log(`\nTesting model: ${modelId}...`);
  try {
    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });
    const response = await client.send(command);
    console.log(`SUCCESS for ${modelId}! Status code: ${response.$metadata.httpStatusCode}`);
    return true;
  } catch (error) {
    console.error(`FAILED for ${modelId}:`, error.name, "-", error.message);
    return false;
  }
}

async function run() {
  const sdPayload = {
    text_prompts: [{ text: "A yellow industrial pump, high detail blueprint" }],
    cfg_scale: 7,
    height: 512,
    width: 512,
    steps: 30,
  };

  await testModel("stability.stable-diffusion-xl-v1:0", sdPayload);
}

run();
