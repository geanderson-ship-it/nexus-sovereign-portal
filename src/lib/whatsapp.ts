// Módulo de Integração com a Evolution API

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_APIKEY = process.env.EVOLUTION_GLOBAL_APIKEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE_NAME || 'Isadora';

export async function sendWhatsAppMessage(phone: string, text: string) {
  try {
    if (!EVOLUTION_APIKEY) {
      console.warn('[WhatsApp] Chave da Evolution API não configurada. A mensagem não será enviada.');
      console.log(`[Mock Send] Para ${phone}: ${text}`);
      return false;
    }

    // A Evolution API exige que o número venha sem o sinal de +, apenas código país + DDD + número
    // E.g., 5511999999999
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const endpoint = `${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_APIKEY
      },
      body: JSON.stringify({
        number: cleanPhone,
        text: text
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[WhatsApp] Falha ao enviar mensagem para ${cleanPhone}:`, errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`[WhatsApp] Erro crítico ao enviar mensagem para ${phone}:`, error);
    return false;
  }
}
