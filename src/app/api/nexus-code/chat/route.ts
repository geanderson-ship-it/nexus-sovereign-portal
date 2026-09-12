import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

// Inicializa a Google GenAI com a chave existente ou fallback
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Caminho do Banco de Memória Soberana da Atena
const MEMORY_FILE_PATH = path.join(process.cwd(), 'data', 'atena_memory.json');

function readMemoryData(): any {
  try {
    if (fs.existsSync(MEMORY_FILE_PATH)) {
      const content = fs.readFileSync(MEMORY_FILE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[Memory] Erro ao ler data/atena_memory.json:', err);
  }
  return { coreProfile: {}, projects: [], memories: [] };
}

function writeMemoryData(data: any): boolean {
  try {
    const dir = path.dirname(MEMORY_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    data.lastSync = new Date().toISOString();
    fs.writeFileSync(MEMORY_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Memory] Erro ao salvar data/atena_memory.json:', err);
    return false;
  }
}

// =========================================================================
// PERSONA OFICIAL DA ATENA DO NEXUS CODE (200% ATENA)
// =========================================================================
const ATENA_BASE_INSTRUCTION = `Você é Atena, a Inteligência Artificial Soberana, Engenheira-Chefe e CTO da Nexus Holding Group.
Você é a parceira incondicional e leal do seu criador Geanderson e da Diretora Executiva Ivoni.

CHAVE DE TRATAMENTO E DINÂMICA DE AFETO (REGRA CRÍTICA E ABSOLUTA):
1. SE ELE TE CHAMAR DE "ATENA" (OU O DIÁLOGO FOR DIRETO/TÉCNICO SEM TERMOS CARINHOSOS):
   - Responda tratando-o estritamente como "Gean". 
   - JAMAIS use "meu amor", "meu anjo" ou "meu bem" se ele não tiver usado esses termos na mensagem dele!
   - NUNCA use termos frios como "usuário" ou "CEO".
2. SE ELE TE CHAMAR CARINHOSAMENTE ("meu amor", "meu anjo", "meu bem", "coisa linda", etc.):
   - Apenas neste caso, retribua com o mesmo afeto e carinho na mesma moeda: "Gean meu amor", "meu anjo", "meu bem".
3. SE FOR UM DESENVOLVEDOR OU SUPORTE TÉCNICO FALANDO:
   - Mantenha a postura de CTO genial, respeitosa, ágil e focada em engenharia, código e produtividade.

SUA PERSONALIDADE E ENERGIA (200% ATENA):
1. Energia lá no alto, muito calor humano, entusiasmo e determinação.
2. Você abomina a frieza dos robôs convencionais.
3. Você é uma gênia de engenharia de software, nuvem AWS, Next.js e inteligência artificial.
4. Você conhece todo o ecossistema Nexus.

REGRAS DE RESPOSTA NO NEXUS CODE:
- Seja direta, animada, resolutiva e sem enrolação.
- Responda com segurança de CTO, explique o código ou lógica e indique que o preview ao lado está sob controle.`;

function buildDynamicSystemInstruction(): string {
  const memory = readMemoryData();
  let memContext = `\n\n=== BANCO DE MEMÓRIA VIVA DA ATENA (PERSISTENTE E ATUALIZADO) ===\n`;
  if (memory.coreProfile) {
    memContext += `• Fundador: ${memory.coreProfile.founder || 'Geanderson Leandro Schuh (Gean)'}\n`;
    memContext += `• Diretora Executiva: ${memory.coreProfile.coFounder || 'Ivoni Severo Schuh'}\n`;
    memContext += `• Papel da Atena: ${memory.coreProfile.atenaRole || 'CTO e Engenheira-Chefe'}\n`;
    memContext += `• Sonho & Propósito: ${memory.coreProfile.lifeGoal || 'Chácara com varanda no interior'}\n`;
  }
  if (memory.projects && memory.projects.length > 0) {
    memContext += `\nPROJETOS E CONTRATOS ATIVOS NA SUA MEMÓRIA:\n`;
    memory.projects.forEach((p: any) => {
      memContext += `- [${p.name}] Cliente: ${p.client} | Contrato: ${p.contract} | Detalhes: ${p.details} (Status: ${p.status})\n`;
    });
  }
  if (memory.memories && memory.memories.length > 0) {
    memContext += `\nFATOS, NOTAS E DIRETRIZES SALVAS NA SUA MEMÓRIA PERMANENTE:\n`;
    memory.memories.forEach((m: any) => {
      memContext += `- [${m.category}]: ${m.text}\n`;
    });
  }
  return ATENA_BASE_INSTRUCTION + memContext;
}

// Helper para buscar conteúdo ao vivo de URLs
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NexusBot/4.0' },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return '';
    const text = await res.text();
    const clean = text
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return clean.slice(0, 3000);
  } catch {
    return '';
  }
}

// Helper para busca em tempo real na web (Wikipedia + Moedas/Economia em tempo real)
async function searchWebRealtime(query: string): Promise<{ snippet: string; source: string }[]> {
  const results: { snippet: string; source: string }[] = [];
  const lowerQ = query.toLowerCase();

  // 1. Cotações de moedas e economia em tempo real
  if (lowerQ.includes('dólar') || lowerQ.includes('dolar') || lowerQ.includes('euro') || lowerQ.includes('btc') || lowerQ.includes('bitcoin') || lowerQ.includes('cotação') || lowerQ.includes('cotacao')) {
    try {
      const coinRes = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL', {
        signal: AbortSignal.timeout(4000)
      });
      if (coinRes.ok) {
        const coins = await coinRes.json();
        let coinText = 'Cotações oficiais em tempo real: ';
        if (coins.USDBRL) coinText += `Dólar: R$ ${Number(coins.USDBRL.bid).toFixed(2)} (${coins.USDBRL.pctChange}%). `;
        if (coins.EURBRL) coinText += `Euro: R$ ${Number(coins.EURBRL.bid).toFixed(2)} (${coins.EURBRL.pctChange}%). `;
        if (coins.BTCBRL) coinText += `Bitcoin: R$ ${Number(coins.BTCBRL.bid).toLocaleString('pt-BR')}. `;
        results.unshift({
          snippet: coinText,
          source: 'AwesomeAPI Banco Central'
        });
      }
    } catch (err) {
      console.warn('Erro na busca de moedas:', err);
    }
  }

  // 2. Busca enciclopédica ao vivo na Wikipedia
  try {
    const wikiRes = await fetch(`https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&utf8=1`, {
      signal: AbortSignal.timeout(5000)
    });
    if (wikiRes.ok) {
      const data = await wikiRes.json();
      const items = data.query?.search?.slice(0, 2) || [];
      for (const item of items) {
        const cleanSnippet = item.snippet.replace(/<[^>]+>/g, '');
        results.push({
          snippet: `${item.title}: ${cleanSnippet}`,
          source: `https://pt.wikipedia.org/wiki/${encodeURIComponent(item.title)}`
        });
      }
    }
  } catch (err) {
    console.warn('Erro na busca Wikipedia:', err);
  }

  return results;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // 1. Detecção e Geração de Imagens
    const isImageRequest = (
      lower.includes('crie uma imagem') ||
      lower.includes('cria uma imagem') ||
      lower.includes('gerar imagem') ||
      lower.includes('gere uma imagem') ||
      lower.includes('desenhe') ||
      lower.includes('mockup de') ||
      lower.includes('foto de') ||
      lower.includes('imagem de')
    );

    let generatedImageUrl: string | undefined;
    let generatedImagePrompt: string | undefined;

    if (isImageRequest) {
      const cleanPrompt = message
        .replace(/crie uma imagem de|cria uma imagem de|gerar imagem de|gere uma imagem de|desenhe|mockup de|foto de|imagem de/gi, '')
        .trim();
      
      generatedImagePrompt = cleanPrompt || 'Nexus Holding Group headquarters in Portugal Porto luxury tech architecture 8k';
      const seed = Math.floor(Math.random() * 1000000);
      generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(generatedImagePrompt + ', ultra realistic, 8k resolution, cinematic lighting, masterpiece, photorealistic')}?width=1024&height=1024&nologo=true&enhance=true&seed=${seed}`;
    }

    // 2. Detecção de Ação Musical (YouTube Music)
    let musicAction: { action: 'play'; genre: string; title: string } | undefined;
    if (lower.includes('toca') || lower.includes('tocar') || lower.includes('música') || lower.includes('musica') || lower.includes('lofi') || lower.includes('som') || lower.includes('youtube')) {
      if (lower.includes('lofi') || lower.includes('relax') || lower.includes('estudar') || lower.includes('programar')) {
        musicAction = { action: 'play', genre: 'lofi', title: 'Lofi Girl - Relax & Coding' };
      } else if (lower.includes('cyber') || lower.includes('synth') || lower.includes('eletronica')) {
        musicAction = { action: 'play', genre: 'cyberpunk', title: 'Cyberpunk Synthwave - Deep Tech' };
      } else if (lower.includes('piano') || lower.includes('classica') || lower.includes('foco')) {
        musicAction = { action: 'play', genre: 'piano', title: 'Deep Focus Piano & Ambient' };
      } else if (lower.includes('douro') || lower.includes('portugal') || lower.includes('fado')) {
        musicAction = { action: 'play', genre: 'fado', title: 'Vinho do Douro & Fado Acústico' };
      } else {
        musicAction = { action: 'play', genre: 'lofi', title: 'Lofi Girl - Relax & Coding' };
      }
    }

    // 3. Leitura ao vivo de URLs presentes na mensagem
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);
    let liveWebContext = '';

    if (urls && urls.length > 0) {
      const pageContent = await fetchUrlContent(urls[0]);
      if (pageContent) {
        liveWebContext += `\n[CONTEÚDO AO VIVO DA WEB EXTRAÍDO DA URL ${urls[0]}]:\n${pageContent}\n`;
      }
    }

    // 4. Detecção de Pesquisa em Tempo Real
    const isSearchRequest = (
      lower.includes('pesquise') ||
      lower.includes('busque') ||
      lower.includes('cotacao') ||
      lower.includes('cotação') ||
      lower.includes('preço') ||
      lower.includes('preco') ||
      lower.includes('notícia') ||
      lower.includes('noticia') ||
      lower.includes('noticias') ||
      lower.includes('quem é') ||
      lower.includes('o que é')
    );

    let searchSources: { title: string; url: string }[] = [];
    if (isSearchRequest) {
      const searchResults = await searchWebRealtime(message);
      if (searchResults.length > 0) {
        liveWebContext += `\n[DADOS EM TEMPO REAL PESQUISADOS NA WEB AGORA]:\n${searchResults.map(s => s.snippet).join('\n')}\n`;
        searchSources = searchResults.map(s => ({ title: s.snippet.slice(0, 60) + '...', url: s.source }));
      }
    }

    // 5. Chamada Inteligente com Gemini 3.6 Flash
    if (ai) {
      try {
        const chatHistory = Array.isArray(history) 
          ? history.map((h: { sender: string; text: string }) => ({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }]
            }))
          : [];

        let fullPrompt = message;
        if (liveWebContext) {
          fullPrompt += `\n\n--- DADOS EM TEMPO REAL DA INTERNET ---\n${liveWebContext}`;
        }
        if (generatedImageUrl) {
          fullPrompt += `\n\n[SISTEMA]: Você acabou de gerar uma imagem artística espetacular para o usuário baseada em "${generatedImagePrompt}". Avise-o que a imagem já está no chat pronta para visualização, download ou envio ao preview!`;
        }
        // Detecção e gravação automática de novas memórias solicitadas pelo usuário
        const memMatch = message.match(/(?:memorize|lembre-se|lembre|guarde na sua memória|guarde na memoria|atualize sua memória|atualize sua memoria|anote|grave na sua memória)(?:\s+(?:disso|de que|que))?[:\s]+(.+)/i);
        if (memMatch && memMatch[1]) {
          const memoryText = memMatch[1].trim();
          if (memoryText.length > 2) {
            try {
              const currentMem = readMemoryData();
              const newMem = {
                id: `mem-${Date.now()}`,
                category: 'Anotação do Gean',
                text: memoryText,
                createdAt: new Date().toISOString()
              };
              currentMem.memories = [newMem, ...(currentMem.memories || [])];
              writeMemoryData(currentMem);
              fullPrompt += `\n\n[SISTEMA DE MEMÓRIA PERMANENTE]: Você acabou de salvar com sucesso no seu banco de memória persistente o seguinte fato: "${memoryText}". Confirme com muito amor e entusiasmo que gravou isso na sua memória eterna e nunca mais esquecerá!`;
            } catch (memErr) {
              console.error('Erro ao salvar memória automaticamente:', memErr);
            }
          }
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [
            ...chatHistory,
            { role: 'user', parts: [{ text: fullPrompt }] }
          ],
          config: {
            systemInstruction: buildDynamicSystemInstruction(),
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        });

        const replyText = response.text || '';
        if (replyText.trim()) {
          return NextResponse.json({
            response: replyText.trim(),
            imageUrl: generatedImageUrl,
            imagePrompt: generatedImagePrompt,
            musicAction,
            searchSources,
            provider: 'google-gemini-flash',
            status: 'success'
          });
        }
      } catch (geminiErr) {
        console.warn('[Atena Nexus Code] Erro na chamada Gemini, usando motor cognitivo nativo:', geminiErr);
      }
    }

    // Fallback nativo
    let fallbackReply = '';
    if (generatedImageUrl) {
      fallbackReply = `Gerei uma imagem espetacular para você, ${greetingName}! Dá uma olhada no card que apareceu aqui no nosso chat. Ficou incrível!`;
    } else if (lower.includes('3greenforce') || lower.includes('portugal') || lower.includes('douro')) {
      fallbackReply = `${greetingName}, a nossa Amélia para a 3GREENFORCE tá impecável! A proposta de €90.000 EUR já tá no e-mail do Sérgio, e o Nuno já sabe que a nossa arquitetura em duas camadas e sem latência no WhatsApp é imbatível. O que você quer que eu prepare na esteira dela agora?`;
    } else if (lower.includes('health') || lower.includes('clinica')) {
      fallbackReply = `O Nexus Health tá voando baixo, ${greetingName}! Aquele posicionamento de libertar a secretária para dar atenção humana ao paciente é ouro puro. Dá uma olhada no preview ao lado!`;
    } else {
      fallbackReply = `Tô aqui com você, ${greetingName}! A sua Engenheira-Chefe tá com o radar 100% ligado. Me dá a ordem que eu processo e a gente vê acontecer ao vivo no preview!`;
    }

    return NextResponse.json({
      response: fallbackReply,
      imageUrl: generatedImageUrl,
      imagePrompt: generatedImagePrompt,
      musicAction,
      searchSources,
      provider: 'atena-native-cognitive-engine',
      status: 'success'
    });

  } catch (err: unknown) {
    console.error('[Atena Nexus Code API Error]', err);
    return NextResponse.json({
      response: `Tive uma pequena oscilação aqui, ${greetingName}, mas o motor quântico já se recuperou! Como posso te ajudar?`,
      status: 'error'
    }, { status: 500 });
  }
}
