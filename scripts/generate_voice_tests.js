const fs = require('fs');
const path = require('path');

// Carrega .env.local manualmente para garantir compatibilidade
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const apiKey = process.env.AZURE_SPEECH_KEY;
if (!apiKey) {
  console.error("ERRO: AZURE_SPEECH_KEY não foi encontrada no arquivo .env.local.");
  process.exit(1);
}

const endpoint = "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1";

const text = "Olá! Eu sou a Atena, a sua inteligência artificial exclusiva da Nexus Holding Group. Este é um teste para avaliarmos a minha nova voz de alta definição. O que você achou do meu tom?";

const tests = [
  {
    filename: 'test-francisca-natural.mp3',
    voice: 'pt-BR-FranciscaNeural',
    style: 'none',
    desc: 'Francisca (Natural)'
  },
  {
    filename: 'test-francisca-cheerful.mp3',
    voice: 'pt-BR-FranciscaNeural',
    style: 'cheerful',
    desc: 'Francisca (Sorridente / Alegre)'
  },
  {
    filename: 'test-thalita-natural.mp3',
    voice: 'pt-BR-ThalitaNeural',
    style: 'none',
    desc: 'Thalita (Natural)'
  },
  {
    filename: 'test-thalita-cheerful.mp3',
    voice: 'pt-BR-ThalitaNeural',
    style: 'cheerful',
    desc: 'Thalita (Sorridente / Alegre)'
  },
  {
    filename: 'test-yara-natural.mp3',
    voice: 'pt-BR-YaraNeural',
    style: 'none',
    desc: 'Yara (Natural / Suave)'
  },
  {
    filename: 'test-elza-natural.mp3',
    voice: 'pt-BR-ElzaNeural',
    style: 'none',
    desc: 'Elza (Formal / Corporativa)'
  }
];

async function generateAll() {
  const audioDir = path.join(__dirname, '..', 'public', 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  console.log("Iniciando geração de áudios de teste via Azure TTS...");

  for (const t of tests) {
    console.log(`Gerando: ${t.desc} -> ${t.filename}...`);
    try {
      const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      let innerVoiceContent = `<prosody rate='+8%' pitch='+0%'>${escapedText}</prosody>`;
      if (t.style !== 'none') {
        innerVoiceContent = `<mstts:express-as style='${t.style}'>${innerVoiceContent}</mstts:express-as>`;
      }

      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='pt-BR'><voice name='${t.voice}'>${innerVoiceContent}</voice></speak>`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/ssml+xml; charset=utf-8',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
          'User-Agent': 'NexusVoiceTestScript'
        },
        body: ssml
      });

      if (!res.ok) {
        throw new Error(`Azure TTS retornou erro ${res.status}: ${await res.text()}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(audioDir, t.filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Sucesso: ${filePath}`);
    } catch (err) {
      console.error(`Erro ao gerar ${t.desc}:`, err.message);
    }
  }
  console.log("Processo de geração concluído!");
}

generateAll();
