import { NextRequest, NextResponse } from 'next/server';
import { bedrockClient } from '@/lib/bedrock-client';
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

export const maxDuration = 60;

// Mapa de nomes de idioma → código ISO para o fallback MyMemory
const LANG_CODE_MAP: Record<string, string> = {
  'Português':        'pt',
  'português':        'pt',
  'Inglês':           'en',
  'inglês':           'en',
  'English':          'en',
  'Espanhol':         'es',
  'espanhol':         'es',
  'Francês':          'fr',
  'francês':          'fr',
  'Alemão':           'de',
  'alemão':           'de',
  'Italiano':         'it',
  'italiano':         'it',
  'Árabe':            'ar',
  'árabe':            'ar',
  'Japonês':          'ja',
  'japonês':          'ja',
  'Chinês':           'zh',
  'chinês':           'zh',
  'Russo':            'ru',
  'russo':            'ru',
  'Detectar Automático': 'auto',
};

function getLangCode(name: string): string {
  return LANG_CODE_MAP[name] || 'auto';
}

async function translateWithMyMemory(text: string, sourceLang: string, targetLang: string): Promise<string> {
  const from = getLangCode(sourceLang) === 'auto' ? 'pt' : getLangCode(sourceLang);
  const to = getLangCode(targetLang) || 'pt';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json();
  const translated: string = data?.responseData?.translatedText;
  if (!translated) throw new Error('MyMemory returned empty translation');
  return translated;
}

export async function POST(req: NextRequest) {
  let text = '';
  let sourceLanguage = 'Detectar Automático';
  let targetLanguage = 'Português';
  
  try {
    const body = await req.json();
    text = body.text;
    sourceLanguage = body.sourceLanguage || 'Detectar Automático';
    targetLanguage = body.targetLanguage || 'Português';
  } catch (err) {
    return NextResponse.json({ error: 'Formato JSON inválido.' }, { status: 400 });
  }

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Texto inválido para tradução.' }, { status: 400 });
  }

  const systemPrompt = `Você é o Tradutor Soberano da Nexus, um sistema de tradução de elite com inteligência artificial de nível profissional.
Seu papel é traduzir o texto fornecido pelo usuário para o idioma: ${targetLanguage}.
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
          content: [{ text: `Idioma de origem sugerido: ${sourceLanguage}\n\nTexto a traduzir:\n${text}` }]
        }
      ],
      system: [{ text: systemPrompt }],
      inferenceConfig: { maxTokens: 4000, temperature: 0.1 }
    });
    const response = await bedrockClient.send(command);
    const translation = response.output?.message?.content?.[0]?.text || '';
    console.log('[API /api/translate] Sucesso via Claude 3.5 Sonnet v2 (cross-region)');
    return NextResponse.json({ translation });

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
          content: [{ text: `Idioma de origem sugerido: ${sourceLanguage}\n\nTexto a traduzir:\n${text}` }]
        }
      ],
      system: [{ text: systemPrompt }],
      inferenceConfig: { maxTokens: 4000, temperature: 0.1 }
    });
    const response = await bedrockClient.send(fallbackCommand);
    const translation = response.output?.message?.content?.[0]?.text || '';
    console.log('[API /api/translate] Sucesso via Claude 3.5 Sonnet v1 (fallback)');
    return NextResponse.json({ translation });

  } catch (err2: any) {
    console.warn('[API /api/translate] Falhou Tentativa 2 (Claude 3.5 v1):', err2?.message);
  }

  // ── TENTATIVA 3: MyMemory (gratuito, sem chave, sempre disponível) ─────────
  try {
    console.log('[API /api/translate] Usando fallback MyMemory...');
    const translation = await translateWithMyMemory(text, sourceLanguage, targetLanguage);
    console.log('[API /api/translate] Sucesso via MyMemory (fallback final)');
    return NextResponse.json({ translation });

  } catch (err3: any) {
    console.error('[API /api/translate] TODOS os provedores falharam:', err3?.message);
    return NextResponse.json({ error: 'Serviço de tradução temporariamente indisponível.' }, { status: 503 });
  }
}
