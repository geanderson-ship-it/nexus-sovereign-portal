const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");
const fs = require("fs");
const path = require("path");

// Load .env.local manually from parent directory
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

// Read DANTE_SYSTEM_PROMPT from the parent source file
const flowFile = path.join(__dirname, "..", "src", "ai", "flows", "dante-safra-flow.ts");
const flowContent = fs.readFileSync(flowFile, "utf-8");
const promptMatch = flowContent.match(/const DANTE_SYSTEM_PROMPT = `([\s\S]*?)`;/);
const DANTE_SYSTEM_PROMPT = promptMatch[1];

const client = new BedrockRuntimeClient({
  region: env.NEXUS_REGION || "us-east-1",
  credentials: {
    accessKeyId: env.NEXUS_ACCESS_KEY_ID || env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.NEXUS_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY
  }
});

const schemaInstruction = `\n\nCRITICAL INSTRUCTION: You must respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json. The JSON must contain the keys: "response" (string), "newNickname" (optional string), "nextStage" (optional string, one of 'PROPRIEDADE', 'MUNICIPIO', 'NOME', 'CONCLUSAO', 'ANALISE'), "propertyDetails" (optional object with tamanho, culturas, animais, municipio), "voiceProfile" (optional string).`;

async function runTurn(history, userMessage) {
  console.log(`\n--- RUNNING TURN ---`);
  console.log(`User: "${userMessage}"`);

  // Construct messages array exactly as in the flow
  const messages = [];
  
  // Reconstruct history
  for (const h of history) {
    if (h.role === 'model') {
      // Reconstruct as JSON
      const dummyJSON = JSON.stringify({ response: h.text });
      messages.push({
        role: 'assistant',
        content: [{ text: dummyJSON }]
      });
    } else {
      messages.push({
        role: 'user',
        content: [{ text: h.text }]
      });
    }
  }

  messages.push({
    role: "user",
    content: [{ text: `IDIOMA OBRIGATÓRIO DE RESPOSTA: pt-BR\nMENSAGEM: ${userMessage}` }]
  });

  try {
    const command = new ConverseCommand({
      modelId: "us.anthropic.claude-sonnet-4-6",
      messages: messages,
      system: [{ text: DANTE_SYSTEM_PROMPT + schemaInstruction }],
      inferenceConfig: {
        temperature: 0.1,
        maxTokens: 4096
      }
    });

    const start = Date.now();
    const res = await client.send(command);
    console.log(`Responded in ${Date.now() - start}ms.`);

    const textOutput = res.output?.message?.content?.[0]?.text || "";
    console.log("Raw Response:", textOutput);

    let output;
    try {
      const cleanText = textOutput.replace(/```json|```/g, "").trim();
      output = JSON.parse(cleanText);
      console.log("✅ PARSED SUCCESSFUL JSON!");
    } catch (e) {
      console.log("❌ PARSE FAILED! Using fallback...");
      output = {
        response: textOutput.trim()
      };
    }
    console.log("Output response:", output.response);
    return output;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function testConversation() {
  const history = [];

  // Turn 1
  const out1 = await runTurn(history, "tenho 20 hectares de terra planta o fumo milho e cria o gado galinhas e porcos em Venâncio Aires");
  history.push({ role: 'user', text: "tenho 20 hectares de terra planta o fumo milho e cria o gado galinhas e porcos em Venâncio Aires" });
  history.push({ role: 'model', text: out1.response });

  // Turn 2
  await runTurn(history, "mas Dante o pessoal por aqui cada vez tá plantando mais cedo tem alguns plantando em junho julho já tem fumo plantado isso vai dar uma qualidade aceitável na empresa depois ou vai dar problema para o qualidade");
}

testConversation();
