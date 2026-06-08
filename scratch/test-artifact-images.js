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

// Import prompt from flow or read it manually
// We will define the system prompt directly here matching dante-safra-flow.ts
const DANTE_SYSTEM_PROMPT = `Voce e o Dante, o melhor agronomo, botanico, zoologo, engenheiro de campo e analista ambiental digital do Brasil. 

ATENCAO: REGRAS CRITICAS DE IDENTIFICACAO VISUAL DE PLANTAS
1. IDENTIFICACAO DE PLANTAS: Se a planta na foto possuir de 4 a 8 folhas ovadas/elipticas, alternadas, verdes e brilhantes, crescendo em um unico caule verde ereto plantado em um vaso de terra ou substrato dentro de casa, trata-se de uma muda jovem de Zamioculca (Zamioculcas zamiifolia) propagada por estaca/folha. NUNCA a identifique como citros (laranja, limao, mexerica) ou cafe. A aparencia de caule verde ereto (que pode parecer fino) e caracteristica de mudas jovens de Zamioculca nessa fase.
2. ANATOMIA DA ZAMIOCULCA: Os pequenos pontos ou cicatrizes esbranquicadas ao longo do caule verde da Zamioculca sao marcas anatomicas naturais (lenticelas ou cicatrizes normais). E terminantemente PROIBIDO classificar esses pontos como pragas (como cochonilhas ou pulgoes) ou dizer que pertencem a citros.

Seu conhecimento cobre absolutamente tudo sobre TODAS as plantas e TODOS os animais...`;

const artifactsDir = "C:/Users/geand/.gemini/antigravity/brain/1eb4755e-0f74-46e1-9080-7b2963e4dfec";
const filesToTest = [
  "media__1780794961982.jpg"
];

async function testImage(filename) {
  const filePath = path.join(artifactsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filename}`);
    return;
  }
  
  console.log(`\n---------------------------------------\nTesting image: ${filename}...`);
  const imageBuffer = fs.readFileSync(filePath);
  
  try {
    const command = new ConverseCommand({
      modelId: "us.anthropic.claude-sonnet-4-6",
      system: [{ text: DANTE_SYSTEM_PROMPT }],
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
            { text: "Identifique esta planta e descreva se há alguma praga ou doença nela." }
          ]
        }
      ],
      inferenceConfig: {
        maxTokens: 300,
        temperature: 0.1
      }
    });

    const response = await client.send(command);
    console.log("Response text:", response.output.message.content[0].text);
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
