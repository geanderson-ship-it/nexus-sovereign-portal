import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string): Promise<string> {
  console.log(`[Atena Web Scraper] Lendo site: "${url}"`);
  
  try {
    // Validação básica de URL para garantir que tem http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10 segundos de timeout máximo
    });

    if (!response.ok) {
      return `Erro: O site bloqueou o acesso ou está fora do ar (Código HTTP ${response.status}).`;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extrai o Título e a Descrição (Meta Tags)
    const title = $('title').text().trim() || 'Sem Título';
    const description = $('meta[name="description"]').attr('content') || 'Sem descrição meta.';
    
    // Removemos elementos visuais que não são texto para limpar o conteúdo lido
    $('script, style, noscript, iframe, svg, video, audio, nav, footer').remove();
    
    // Vamos mapear as imagens para tentar extrair os 'alt' (já que a Atena não enxerga os pixels, ela lê as tags alt)
    const imagens: string[] = [];
    $('img').each((_, el) => {
      const alt = $(el).attr('alt');
      if (alt && alt.trim().length > 3) {
        imagens.push(`[Imagem: ${alt.trim()}]`);
      }
    });

    $('img').remove();
    
    // Extrai o texto limpo do body
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Limitamos a extração para não explodir o tempo de processamento da AWS Bedrock (4000 caracteres é o ideal para leitura ultra rápida)
    const truncatedText = bodyText.substring(0, 4000);
    const imagensEncontradas = imagens.slice(0, 15).join('\n'); // Top 15 imagens

    return `--- ANÁLISE DO SITE: ${url} ---\n\nTÍTULO: ${title}\nDESCRIÇÃO: ${description}\n\nDESCRIÇÃO DAS IMAGENS NA PÁGINA (Tags Alt):\n${imagensEncontradas || 'Nenhuma descrição de imagem encontrada.'}\n\nCONTEÚDO TEXTUAL:\n${truncatedText}`;
    
  } catch (error: any) {
    console.error('[Atena Web Scraper] Erro ao ler site:', error);
    return `Ocorreu um erro técnico ao tentar ler o site ${url}. Detalhes: ${error.message}`;
  }
}
