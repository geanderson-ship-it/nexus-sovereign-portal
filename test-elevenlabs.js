require("dotenv").config({ path: ".env.local" });

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY || "sk_80e5d5e59f678869d5d564d4fcdcb3ed6f0fbf119ae7bd98";
  
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey }
    });
    const data = await res.json();
    
    if (res.ok) {
      console.log("ElevenLabs OK! Status da assinatura:", data.subscription.status);
      console.log("Caracteres restantes:", data.subscription.character_limit - data.subscription.character_count);
    } else {
      console.error("Erro ElevenLabs:", data.detail?.message || data);
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
}

main();
