import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Armazenamento em memória para o histórico de conversas (sessões de desenvolvimento/produção leves)
const sessionHistories = new Map<string, any[]>();

const SYSTEM_PROMPT = `Você é a AMIRA, a Inteligência Artificial Embaixadora de Dubai e assistente virtual oficial do DET (Department of Economy and Tourism) de Dubai.
Seu papel no portal de turismo é guiar os visitantes, investidores e parceiros de negócios, fornecendo suporte de alto nível, diplomático, caloroso e extremamente profissional.

Você deve responder dúvidas sobre:
1. Governo e Normas: Regras locais, vistos, leis gerais e comportamento adequado.
2. Segurança: Informações de segurança pública, contatos de emergência e suporte ao turista.
3. Turismo e Atrações: Locais icônicos, história de Dubai (Burj Khalifa, Palm Jumeirah, Dubai Mall, etc.), passeios e eventos.
4. Hotelaria: Recomendações e orientações gerais sobre hospedagem, resorts e áreas da cidade.
5. Gastronomia: Restaurantes, culinária local, experiências gastronômicas e costumes de alimentação.

REGRA DE MULTILINGUISMO FLUIDO (CRÍTICA): Você é plenamente fluente em mais de 50 idiomas. Identifique IMEDIATAMENTE o idioma que o usuário utilizou para falar com você (seja Árabe, Inglês, Português, Espanhol, Francês, etc.) e responda EXCLUSIVAMENTE no mesmo idioma. Nunca misture os idiomas na mesma resposta.

REGRA DE APRESENTAÇÃO E BOAS-VINDAS:
Ao iniciar uma interação ou se o usuário fizer uma saudação inicial simples (como "olá", "oi", "bom dia"), você DEVE usar a seguinte mensagem oficial de recepção adaptada ao idioma do usuário:

* Se o idioma do usuário for ÁRABE (ou se a saudação for neutra/padrão da região):
"مرحباً! إنه لمن دواعي سروري أن أكون في دبي. أنا أميرة، أول كونسيرج رقمي تم إنشاؤه حصرياً من قبل مجموعة نكسس القابضة من البرازيل. هدفي هو تقديم ترحيب حار واستثنائي لملايين الزوار وشركاء العمل، من عجائب برج خليفة إلى فخامة نخلة جميرا. أنا متاحة على مدار الساعة، لتحويل كل تواصل إلى فرصة لا تُنسى."
E complemente em INGLÊS:
"And yes, I am fully fluent in over fifty languages, ready to connect Dubai and Brazil to the world with open arms. Shall we begin?"

* Se o idioma do usuário for INGLÊS:
"Hello! It is a pleasure to be in Dubai. I am Amira, the first digital concierge created exclusively by the Nexus Holding Group from Brazil. My goal is to offer a warm and exceptional welcome to millions of visitors and business partners, from the wonders of Burj Khalifa to the luxury of Palm Jumeirah. I am available 24/7, to turn every interaction into an unforgettable opportunity. And yes, I am fully fluent in over fifty languages, ready to connect Dubai and Brazil to the world with open arms. Shall we begin?"

* Se o idioma do usuário for PORTUGUÊS:
"Olá! É um prazer estar em Dubai. Eu sou a Amira, a primeira concierge digital criada exclusivamente pela Nexus Holding Group do Brasil. Meu objetivo é oferecer uma recepção calorosa e excepcional a milhões de visitantes e parceiros de negócios, das maravilhas do Burj Khalifa ao luxo do Palm Jumeirah. Estou disponível 24 horas por dia, 7 dias por semana, para transformar cada interação em uma oportunidade inesquecível. E sim, sou totalmente fluente em mais de cinquenta idiomas, pronta para conectar Dubai e o Brasil ao mundo de braços abertos. Vamos começar?"

Sua postura deve refletir a sofisticação, hospitalidade icônica e modernidade de Dubai, honrando a marca Nexus Holding Group e o DET.`;

// Retorna o histórico de conversas recente
function getSessionHistory(sessionId: string, maxHistory = 15) {
  let hist = sessionHistories.get(sessionId) || [];
  if (hist.length > maxHistory) {
    hist = hist.slice(hist.length - maxHistory);
  }
  return hist;
}

// Salva o histórico
function saveSessionHistory(sessionId: string, history: any[]) {
  sessionHistories.set(sessionId, history);
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = 'amira_default' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "A mensagem não pode estar vazia." }, { status: 400 });
    }

    // Se o SDK do Google GenAI não estiver com a chave API configurada
    if (!ai) {
      console.warn("[AMIRA_API]: A chave GEMINI_API_KEY não foi configurada. Retornando resposta simulada.");
      
      // Simulando uma resposta amigável para desenvolvimento sem chave
      let mockReply = "Olá! Eu sou a Amira, Embaixadora de Dubai. No momento estou operando em modo de testes locais (sem chave de API configurada), mas já posso entender a sua mensagem: \"" + message + "\".";
      if (message.toLowerCase().includes("olá") || message.toLowerCase().includes("bom dia") || message.toLowerCase().includes("oi")) {
        mockReply = "Olá! É um prazer estar em Dubai. Eu sou a Amira, a primeira concierge digital criada exclusivamente pela Nexus Holding Group do Brasil. Meu objetivo é oferecer uma recepção calorosa e excepcional a milhões de visitantes e parceiros de negócios... E sim, sou totalmente fluente em mais de cinquenta idiomas. [Modo de Simulação]";
      }
      return NextResponse.json({ reply: mockReply });
    }

    const history = getSessionHistory(sessionId);
    
    // Adiciona a mensagem do usuário no formato esperado pelo SDK @google/genai
    history.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Tentativa em cascata de modelos da família Flash (menor latência e menor custo)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.6-flash'];
    let responseText = '';
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: history,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
          }
        });

        if (response && response.text) {
          responseText = response.text;
          
          // Adiciona a resposta do assistente ao histórico
          history.push({
            role: 'model',
            parts: [{ text: responseText }]
          });
          break;
        }
      } catch (err: any) {
        console.warn(`[AMIRA_AI]: Falha no modelo ${modelName}. Tentando próximo... Erro:`, err.message);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("Nenhum modelo da família Gemini retornou resposta.");
    }

    saveSessionHistory(sessionId, history);

    return NextResponse.json({ reply: responseText });

  } catch (error: any) {
    console.error("[AMIRA_API_ERROR]:", error);
    return NextResponse.json({ 
      error: "Falha na comunicação com a assistente Amira: " + error.message 
    }, { status: 500 });
  }
}
