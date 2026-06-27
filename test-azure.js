require("dotenv").config({ path: ".env.local" });

async function main() {
  const apiKey = process.env.AZURE_SPEECH_KEY || "";
  const region = "eastus";
  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  
  const ssml = `
    <speak version='1.0' xml:lang='pt-BR'>
      <voice xml:lang='pt-BR' xml:gender='Female' name='pt-BR-FranciscaNeural'>
        Teste de voz neural da Microsoft Azure.
      </voice>
    </speak>
  `;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'NexusSovereignPortal'
      },
      body: ssml
    });
    
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      console.log("Azure TTS OK! Bytes:", arrayBuffer.byteLength);
    } else {
      const text = await res.text();
      console.error("Erro Azure:", res.status, text);
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
}

main();
