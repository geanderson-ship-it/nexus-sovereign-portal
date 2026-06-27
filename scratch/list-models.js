const { execSync } = require("child_process");
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

function runList(label, accessKey, secretKey, region) {
  console.log(`\n==========================================`);
  console.log(`LISTING INFERENCE PROFILES FOR: ${label}`);
  console.log(`==========================================`);

  try {
    const customEnv = {
      ...process.env,
      AWS_ACCESS_KEY_ID: accessKey,
      AWS_SECRET_ACCESS_KEY: secretKey,
      AWS_DEFAULT_REGION: region || "us-east-1"
    };

    const output = execSync("aws bedrock list-inference-profiles", {
      env: customEnv,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024
    });

    const parsed = JSON.parse(output);
    console.log(`Found ${parsed.inferenceProfileSummaries.length} inference profiles:`);
    parsed.inferenceProfileSummaries.forEach(p => {
      console.log(`- ID: ${p.inferenceProfileId} (${p.inferenceProfileName})`);
      console.log(`  Status: ${p.status}`);
      console.log(`  Models:`, p.models ? p.models.map(m => m.modelArn) : 'none');
    });
  } catch (e) {
    console.error(`Error listing inference profiles:`, e.message);
  }
}

// Run for NEXUS keys
runList(
  "NEXUS KEYS",
  env.NEXUS_ACCESS_KEY_ID,
  env.NEXUS_SECRET_ACCESS_KEY,
  env.NEXUS_REGION
);

// Run for AWS keys
runList(
  "AWS KEYS",
  env.AWS_ACCESS_KEY_ID,
  env.AWS_SECRET_ACCESS_KEY,
  env.AWS_REGION
);
