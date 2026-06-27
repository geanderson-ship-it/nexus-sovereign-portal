const { genkit } = require("genkit");
const { awsBedrock } = require("genkitx-aws-bedrock");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

// Set env vars manually for this test script
process.env.AWS_ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID;
process.env.AWS_SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY;
process.env.AWS_REGION = env.AWS_REGION || "us-east-1";

const ai = genkit({
  plugins: [
    awsBedrock({
      region: process.env.AWS_REGION
    })
  ]
});

async function run() {
  console.log("Calling Genkit with us.anthropic.claude-sonnet-4-6 (no topP)...");
  try {
    const start = Date.now();
    const res = await ai.generate({
      model: "aws-bedrock/us.anthropic.claude-sonnet-4-6",
      system: "Você é a Atena, assistente da Nexus. Responda de forma extremamente elegante e curta.",
      prompt: "Olá Atena, como vai?",
      config: {
        temperature: 0.7,
        maxOutputTokens: 100
      }
    });
    console.log(`✅ Success! Responded in ${Date.now() - start}ms.`);
    console.log("Atena response:", res.text);
  } catch (e) {
    console.error("❌ FAILED!", e);
  }
}

run();
