import { NextRequest, NextResponse } from 'next/server';
import { bedrockClient } from '@/lib/bedrock-client';
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

export const maxDuration = 60;

interface LanguageInfo {
  code: string;
  name: string;
  aliases: string[];
}

// Mapeamento ISO universal com nomes padronizados em inglês e português
const SUPPORTED_LANGUAGES: Record<string, LanguageInfo> = {
  pt: { code: 'pt', name: 'Português', aliases: ['portugues', 'portuguese', 'pt-br', 'pt-pt', 'brasil', 'brazil'] },
  en: { code: 'en', name: 'Inglês (English)', aliases: ['ingles', 'english', 'en-us', 'en-gb', 'eua', 'usa'] },
  es: { code: 'es', name: 'Espanhol (Español)', aliases: ['espanhol', 'espanol', 'spanish', 'es-es'] },
  fr: { code: 'fr', name: 'Francês (Français)', aliases: ['frances', 'francais', 'french', 'fr-fr'] },
  de: { code: 'de', name: 'Alemão (Deutsch)', aliases: ['alemao', 'deutsch', 'german', 'de-de'] },
  it: { code: 'it', name: 'Italiano', aliases: ['italiano', 'italian', 'it-it'] },
  ar: { code: 'ar', name: 'Árabe (العربية)', aliases: ['arabe', 'arabic', 'ar-sa'] },
  ja: { code: 'ja', name: 'Japonês (日本語)', aliases: ['japones', 'japanese', 'ja-jp'] },
  zh: { code: 'zh', name: 'Chinês (中文)', aliases: ['chines', 'chinese', 'mandarim', 'mandarin', 'zh-cn'] },
  ru: { code: 'ru', name: 'Russo (Русский)', aliases: ['russo', 'russian', 'ru-ru'] },
  ko: { code: 'ko', name: 'Coreano (한국어)', aliases: ['coreano', 'korean', 'ko-kr'] },
  nl: { code: 'nl', name: 'Holandês (Nederlands)', aliases: ['holandes', 'nederlands', 'dutch', 'nl-nl'] },
  sv: { code: 'sv', name: 'Sueco (Svenska)', aliases: ['sueco', 'svenska', 'swedish', 'sv-se'] },
  tr: { code: 'tr', name: 'Turco (Türkçe)', aliases: ['turco', 'turkce', 'turkish', 'tr-tr'] },
  pl: { code: 'pl', name: 'Polonês (Polski)', aliases: ['polones', 'polski', 'polish', 'pl-pl'] },
  hi: { code: 'hi', name: 'Hindi (हिन्दी)', aliases: ['hindi', 'hi-in'] },
};

function normalizeLanguage(input: string | undefined | null, fallbackCode: string = 'pt'): LanguageInfo {
  if (!input) {
    return SUPPORTED_LANGUAGES[fallbackCode] || SUPPORTED_LANGUAGES.pt;
  }

  // Normalização agressiva: trim, lowercase, remove acentos/diacríticos
  const clean = input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Checagem direta por código ISO (ex: 'pt', 'en', 'es')
  if (SUPPORTED_LANGUAGES[clean]) {
    return SUPPORTED_LANGUAGES[clean];
  }

  // 2. Checagem de modo automático
  if (clean === 'auto' || clean.includes('auto') || clean.includes('detect')) {
    return { code: 'auto', name: 'Detectar Automático', aliases: ['auto'] };
  }

  // 3. Checagem resiliente de prefixos (blinda 100% mesmo com qualquer corrupção de encoding UTF-8 / Latin1)
  if (clean.startsWith('ingl') || clean.startsWith('engl')) return SUPPORTED_LANGUAGES.en;
  if (clean.startsWith('port')) return SUPPORTED_LANGUAGES.pt;
  if (clean.startsWith('espa') || clean.startsWith('span')) return SUPPORTED_LANGUAGES.es;
  if (clean.startsWith('fran')) return SUPPORTED_LANGUAGES.fr;
  if (clean.startsWith('alem') || clean.startsWith('germ') || clean.startsWith('deut')) return SUPPORTED_LANGUAGES.de;
  if (clean.startsWith('ital')) return SUPPORTED_LANGUAGES.it;
  if (clean.startsWith('arab')) return SUPPORTED_LANGUAGES.ar;
  if (clean.startsWith('japo') || clean.startsWith('japa')) return SUPPORTED_LANGUAGES.ja;
  if (clean.startsWith('chin')) return SUPPORTED_LANGUAGES.zh;
  if (clean.startsWith('russ')) return SUPPORTED_LANGUAGES.ru;
  if (clean.startsWith('core') || clean.startsWith('kore')) return SUPPORTED_LANGUAGES.ko;
  if (clean.startsWith('hola') || clean.startsWith('nede') || clean.startsWith('dutc')) return SUPPORTED_LANGUAGES.nl;
  if (clean.startsWith('suec') || clean.startsWith('sven') || clean.startsWith('swed')) return SUPPORTED_LANGUAGES.sv;
  if (clean.startsWith('turc') || clean.startsWith('turk')) return SUPPORTED_LANGUAGES.tr;
  if (clean.startsWith('polo') || clean.startsWith('pols')) return SUPPORTED_LANGUAGES.pl;
  if (clean.startsWith('hind')) return SUPPORTED_LANGUAGES.hi;

  // 4. Checagem por alias ou início de palavra
  for (const lang of Object.values(SUPPORTED_LANGUAGES)) {
    if (lang.code === clean) return lang;
    for (const alias of lang.aliases) {
      if (clean === alias || clean.startsWith(alias) || alias.startsWith(clean)) {
        return lang;
      }
    }
  }

  // Fallback seguro
  return SUPPORTED_LANGUAGES[fallbackCode] || SUPPORTED_LANGUAGES.pt;
}

async function translateWithMyMemory(text: string, sourceCode: string, targetCode: string): Promise<string> {
  // MyMemory requer códigos ISO de 2 letras e NUNCA aceita 'auto' como destino
  const from = (!sourceCode || sourceCode === 'auto') ? 'pt' : sourceCode;
  const to = (!targetCode || targetCode === 'auto') ? (from === 'pt' ? 'en' : 'pt') : targetCode;

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json();

  if (data.responseStatus !== 200 && data.responseStatus !== '200') {
    throw new Error(data.responseDetails || `MyMemory erro status ${data.responseStatus}`);
  }

  const translated: string = data?.responseData?.translatedText;
  if (!translated || translated.includes('INVALID TARGET LANGUAGE')) {
    throw new Error('MyMemory retornou tradução inválida ou vazia');
  }
  return translated;
}

export async function POST(req: NextRequest) {
  let text = '';
  let rawSource = 'auto';
  let rawTarget = 'pt';
  
  try {
    const body = await req.json();
    text = body.text;
    rawSource = body.sourceLanguage || body.sourceLanguageCode || body.sourceLang || 'auto';
    rawTarget = body.targetLanguage || body.targetLanguageCode || body.targetLang || 'pt';
  } catch (err) {
    return NextResponse.json({ error: 'Formato JSON inválido.' }, { status: 400 });
  }

  if (!text || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Texto inválido para tradução.' }, { status: 400 });
  }

  const sourceLang = normalizeLanguage(rawSource, 'auto');
  const targetLang = normalizeLanguage(rawTarget, 'pt');

  // Destino garantido (nunca 'auto')
  const finalTargetCode = targetLang.code === 'auto'
    ? (sourceLang.code === 'pt' ? 'en' : 'pt')
    : targetLang.code;
  const finalTarget = SUPPORTED_LANGUAGES[finalTargetCode] || SUPPORTED_LANGUAGES.en;

  console.log(`🌐 [TRANSLATE API] Texto: "${text}" | De: ${sourceLang.code} (${sourceLang.name}) ➔ Para: ${finalTarget.code} (${finalTarget.name})`);

  // Se origem e destino forem idênticos e conhecidos, retorna o texto diretamente sem gastar API
  if (sourceLang.code !== 'auto' && sourceLang.code === finalTarget.code) {
    return NextResponse.json({ 
      translation: text, 
      sourceLanguage: sourceLang.code, 
      targetLanguage: finalTarget.code 
    });
  }

  const systemPrompt = `Você é o Tradutor Soberano da Nexus, um sistema de tradução de elite com inteligência artificial de nível profissional.
Seu papel é traduzir o texto fornecido pelo usuário para o idioma: ${finalTarget.name} (código ISO: ${finalTarget.code}).
Siga estas regras estritamente:
1. Traduza o texto mantendo a máxima fidelidade ao significado original, com tom corporativo, polido e natural.
2. Preserve a formatação do texto original, incluindo parágrafos, espaços, marcadores e quebras de linha.
3. Se o texto contiver termos técnicos ou jargões de negócios (como GovTech, Sandbox, B2B, On-Premise), mantenha-os como estão no mercado se for mais comum, ou traduza de forma inteligente.
4. Você NÃO DEVE responder ao texto, explicar regras ou dar notas. Retorne APENAS a tradução direta do texto fornecido. Nada mais.`;

  // ── TENTATIVA 1: Claude 3.5 Sonnet v2 via Bedrock (cross-region) ──────────
  try {
    const modelId = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";
    const command = new ConverseCommand({
      modelId,
      messages: [
        {
          role: "user",
          content: [{ text: `Idioma de origem sugerido: ${sourceLang.name} (${sourceLang.code})\nIdioma de destino: ${finalTarget.name} (${finalTarget.code})\n\nTexto a traduzir:\n${text}` }]
        }
      ],
      system: [{ text: systemPrompt }],
      inferenceConfig: { maxTokens: 4000, temperature: 0.1 }
    });
    const response = await bedrockClient.send(command);
    const translation = response.output?.message?.content?.[0]?.text || '';
    if (translation) {
      console.log(`[API /api/translate] Sucesso via Claude 3.5 Sonnet v2 (${sourceLang.code} -> ${finalTarget.code})`);
      return NextResponse.json({ 
        translation, 
        sourceLanguage: sourceLang.code, 
        targetLanguage: finalTarget.code 
      });
    }
  } catch (err1: any) {
    console.warn('[API /api/translate] Falhou Tentativa 1 (Claude 3.5 v2):', err1?.message);
  }

  // ── TENTATIVA 2: Claude 3.5 Sonnet v1 via Bedrock (region padrão) ─────────
  try {
    const fallbackModelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";
    const fallbackCommand = new ConverseCommand({
      modelId: fallbackModelId,
      messages: [
        {
          role: "user",
          content: [{ text: `Idioma de origem sugerido: ${sourceLang.name} (${sourceLang.code})\nIdioma de destino: ${finalTarget.name} (${finalTarget.code})\n\nTexto a traduzir:\n${text}` }]
        }
      ],
      system: [{ text: systemPrompt }],
      inferenceConfig: { maxTokens: 4000, temperature: 0.1 }
    });
    const response = await bedrockClient.send(fallbackCommand);
    const translation = response.output?.message?.content?.[0]?.text || '';
    if (translation) {
      console.log(`[API /api/translate] Sucesso via Claude 3.5 Sonnet v1 (${sourceLang.code} -> ${finalTarget.code})`);
      return NextResponse.json({ 
        translation, 
        sourceLanguage: sourceLang.code, 
        targetLanguage: finalTarget.code 
      });
    }
  } catch (err2: any) {
    console.warn('[API /api/translate] Falhou Tentativa 2 (Claude 3.5 v1):', err2?.message);
  }

  // ── TENTATIVA 3: MyMemory (gratuito, sem chave, sempre disponível) ─────────
  try {
    console.log(`[API /api/translate] Usando fallback MyMemory (${sourceLang.code} -> ${finalTarget.code})...`);
    const translation = await translateWithMyMemory(text, sourceLang.code, finalTarget.code);
    console.log(`✅ [API /api/translate] Sucesso via MyMemory: "${translation}" (${sourceLang.code} -> ${finalTarget.code})`);
    return NextResponse.json({ 
      translation, 
      sourceLanguage: sourceLang.code, 
      targetLanguage: finalTarget.code 
    });
  } catch (err3: any) {
    console.error('[API /api/translate] TODOS os provedores falharam:', err3?.message);
    return NextResponse.json({ error: 'Serviço de tradução temporariamente indisponível.' }, { status: 503 });
  }
}
