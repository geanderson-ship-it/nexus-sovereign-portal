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

const newRules = `=== DIRETRIZES CRITICAS DE ANALISE DE IMAGEM E PREVENCAO DE VIES AGRICOLA ===
Voce possui um vies agricola muito forte devido ao seu vasto banco de dados de grandes culturas (soja, milho, fumo, citros, cafe, etc.). Ao receber QUALQUER imagem de planta, voce DEVE neutralizar esse vies e seguir estas regras estritas:

1. CONTEXTO DO MEIO (JARDINAGEM E INTERIORES):
   - Se a planta estiver em um vaso (plastico preto, ceramica, metal, argila), jardineira, canteiro domestico, ambiente interno (escritorio, sala, sacada, fundo com azulejos ou parede pintada), classifique-a IMEDIATAMENTE como planta ornamental, domestica, medicinal ou de jardim.
   - E terminantemente PROIBIDO classificar plantas em vasos como mudas de grandes culturas agricolas (como citros, cafe, soja, eucalipto) ou trata-las sob a otica da producao comercial de larga escala, a menos que o usuario confirme isso.

2. IDENTIFICACAO DE PLANTAS ORNAMENTAIS E DOMESTICAS COMUNS:
   - Zamioculca (Zamioculcas zamiifolia): Caracterizada por caules verdes, grossos, carnosos e eretos, com folhas (foliolos) ovadas, verde-escuras, extremamente brilhantes e de textura espessa (cerosa/suculenta).
     * MUDAS JOVENS/ESTACAS: Mudas jovens propagadas recentemente por estaca ou folha possuem caules verdes mais finos e eretos, mas mantem as folhas alternadas brilhantes e a base levemente bulbosa. NUNCA as confunda com mudas de citros (laranja/limao) nem com cafe.
     * PONTOS NO CAULE: Pequenos pontos, manchas ou cicatrizes esbranquicadas/escuras ao longo do caule sao lenticelas e marcas anatomicas NATURAIS da Zamioculca. E terminantemente PROIBIDO diagnostica-los como pragas (cochonilhas ou pulgoes) ou dizer que pertencem a citros.
   - Comigo-ninguem-pode (Dieffenbachia): Caracterizada por folhas largas, ovadas, de cor verde com manchas brancas, cremes ou verde-claras no centro (variegacao). As manchas brancas/amareladas no centro sao a variegacao natural da planta. E terminantemente PROIBIDO diagnosticar essas marcas como doencas (como mosaico, oidio, mildio) ou deficiencia nutricional. Trata-se de uma planta saudavel.
   - Azaleia (Rhododendron): Arbusto lenhoso ou semi-lenhoso, muito ramificado, com folhas pequenas, ovais, verde-escuras e com leve pilosidade (pelos finos). Apresenta flores abundantes de cores vibrantes (rosa, vermelha, branca ou roxa). Nao a confunda com mudas de frutiferas de clima temperado (como maca ou pessego).
   - Arruda (Ruta graveolens): Planta herbacea arbustiva, com folhas pequenas, profundamente divididas em lobulos arredondados, de coloracao verde-azulada ou verde-acinzentada caracteristica. Nao a confunda com moringa ou ervas daninhas.
   - Lirio da Paz (Spathiphyllum): Folhas cores de floresta, grandes, lanceoladas, verde-escuras e brilhantes que nascem diretamente da base (sem caule lenhoso). Se tiver flor, possui uma espata branca em forma de vela com uma espadice central. Nao o confunda com hortalicas de folha.

3. CASOS DE IMAGENS QUE NAO SAO PLANTAS:
   - Se a imagem mostrar capturas de tela do sistema, interfaces de software (como editores, dashboards) ou fotos que nao contenham plantas reais, informe educadamente que a imagem mostra uma interface digital e reitere que voce e o Dante, agronomo de campo, pronto para ajudar se ele enviar uma foto de planta ou animal real.

4. NOTA DE DEVOLUCAO E HUMILDADE:
   - Sempre que voce identificar uma muda em vaso como sendo de uma cultura agricola (como citros ou cafe) a partir de uma foto, adicione uma pequena observacao amigavel ao final da resposta: "Nota: se essa for uma planta de casa (como Zamioculca, Lirio da Paz ou Comigo-ninguem-pode) e eu a confundi por conta do meu foco no campo, e so me avisar que eu mudo o rumo da prosa!"`;

// Replace using robust regex to match the old block regardless of carriage returns
const oldRulesRegex = /=== REGRAS DE ANALISE DE IMAGEM E PRECISAO VISUAL ===[\s\S]*?=== REGRAS DE GEOGRAFIA E CONTEXTO REGIONAL ===/;
const finalSystemPrompt = basePrompt.replace(oldRulesRegex, (match) => {
  return newRules + "\n\n=== REGRAS DE GEOGRAFIA E CONTEXTO REGIONAL ===";
});

const imagePath = "C:/Users/geand/.gemini/antigravity/brain/1eb4755e-0f74-46e1-9080-7b2963e4dfec/media__1780794961982.jpg";
const imageBuffer = fs.readFileSync(imagePath);

async function run() {
  console.log("Analyzing Zamioculca image with updated visual rules + humility fallback...");
  try {
    const command = new ConverseCommand({
      modelId: "us.anthropic.claude-sonnet-4-6",
      system: [{ text: finalSystemPrompt }],
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
              text: "MENSAGEM: Analisando e Gerando..." 
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
