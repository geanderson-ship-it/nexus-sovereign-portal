const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = env.match(/ELEVENLABS_API_KEY=(.*)/);
const djenyMatch = env.match(/DJENY_ELEVENLABS_VOICE_ID=(.*)/);

async function testElevenLabs() {
  if (!apiKeyMatch || !djenyMatch) { console.log("Missing keys"); return; }
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${djenyMatch[1].trim()}`;
  console.log("Testing:", url);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'audio/mpeg',
      'content-type': 'application/json',
      'xi-api-key': apiKeyMatch[1].trim(),
    },
    body: JSON.stringify({
      text: "Testando a velocidade.",
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.80,
        style: 0.3,
        use_speaker_boost: true,
        speed: 1.15,
      },
    }),
  });
  
  if (!response.ok) {
    console.error("Error:", response.status, await response.text());
  } else {
    console.log("Success! Status:", response.status);
  }
}

testElevenLabs();
