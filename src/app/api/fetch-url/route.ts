import { NextRequest, NextResponse } from 'next/server';

// Strip HTML tags and clean up text content
function htmlToText(html: string): string {
  return html
    // Remove script and style blocks entirely
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    // Replace block elements with newlines
    .replace(/<\/?(p|div|section|article|header|footer|h[1-6]|li|tr|br)[^>]*>/gi, '\n')
    // Remove all remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Clean up excess whitespace and blank lines
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL inválida.' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Formato de URL inválido.' }, { status: 400 });
    }

    // Only allow http/https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Apenas URLs http/https são suportadas.' }, { status: 400 });
    }

    console.log(`[fetch-url] Buscando: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NexusAI/1.0; +https://nexustreinamento.com.br)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `A página retornou erro ${response.status}: ${response.statusText}` },
        { status: 400 }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return NextResponse.json(
        { error: `Tipo de conteúdo não suportado: ${contentType}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const text = htmlToText(html);

    // Extract page title for better context
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;

    // Limit content to avoid overwhelming the AI (max ~4000 chars)
    const maxLength = 4000;
    const truncated = text.length > maxLength;
    const content = truncated ? text.slice(0, maxLength) + '\n\n[... conteúdo truncado ...]' : text;

    console.log(`[fetch-url] Sucesso: "${title}" (${content.length} chars)`);

    return NextResponse.json({ title, content, url, truncated });

  } catch (error: any) {
    console.error('[API /fetch-url] Erro:', error);
    const message = error.name === 'TimeoutError'
      ? 'A página demorou muito para responder (timeout de 10s).'
      : error.message || 'Erro ao acessar a URL.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
