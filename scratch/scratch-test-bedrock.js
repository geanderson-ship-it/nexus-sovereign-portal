const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const models = [
  "us.anthropic.claude-sonnet-4-6",
  "global.anthropic.claude-sonnet-4-6",
  "us.anthropic.claude-haiku-4-5-20251001-v1:0",
  "global.anthropic.claude-haiku-4-5-20251001-v1:0",
  "us.anthropic.claude-3-5-haiku-20241022-v1:0"
];

async function testCreds(label, accessKeyId, secretAccessKey, region) {
  console.log(`\n==========================================`);
  console.log(`TESTING CREDENTIALS: ${label}`);
  console.log(`==========================================`);
  
  const client = new BedrockRuntimeClient({
    region: region || "us-east-1",
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  for (const modelId of models) {
    try {
      console.log(`Trying ${modelId}...`);
      const command = new ConverseCommand({
        modelId: modelId,
        messages: [{ role: "user", content: [{ text: "Hello" }] }],
        inferenceConfig: { maxTokens: 10 }
      });
      const res = await client.send(command);
      console.log(`✅ SUCCESS! ${modelId} works. Response:`, res.output?.message?.content?.[0]?.text);
    } catch (e) {
      console.log(`❌ FAILED! ${modelId} -> ${e.name}: ${e.message}`);
    }
  }
}

async function main() {
  // Test NEXUS credentials
  await testCreds(
    "NEXUS KEYS",
    env.NEXUS_ACCESS_KEY_ID,
    env.NEXUS_SECRET_ACCESS_KEY,
    env.NEXUS_REGION
  );

  // Test AWS credentials
  await testCreds(
    "AWS KEYS",
    env.AWS_ACCESS_KEY_ID,
    env.AWS_SECRET_ACCESS_KEY,
    env.AWS_REGION
  );
}

main();
