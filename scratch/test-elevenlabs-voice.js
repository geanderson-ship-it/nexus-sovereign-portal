require("dotenv").config({ path: ".env.local" });

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY || "sk_80e5d5e59f678869d5d564d4fcdcb3ed6f0fbf119ae7bd98";
  const voiceId = process.env.ATENA_ELEVENLABS_VOICE_ID || "gX4eTo1XOTTALJXnDro4";
  
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { 
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: "Teste de voz da Atena para validar os créditos.",
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });
    
    if (res.ok) {
      console.log("ElevenLabs SINTETIZOU COM SUCESSO! Você ainda tem créditos.");
    } else {
      const errorData = await res.json();
      console.error("Erro ElevenLabs (Sintetizar):", errorData.detail?.message || errorData);
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
}

main();
