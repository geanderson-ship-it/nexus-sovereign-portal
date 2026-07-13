import googleIt from 'google-it';

export async function pesquisarInternet(query: string): Promise<string> {
  console.log(`[Atena Web Search] Realizando busca por: "${query}"`);
  
  try {
    const options = {
      query,
      limit: 7, // Traz os top 7 resultados
      disableConsole: true, // Evita spam no terminal
    };
    
    // Promise.race para evitar que a busca congele a API caso o Google peça CAPTCHA
    const timeoutPromise = new Promise<any[]>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout de 10s atingido na busca do Google')), 10000);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = await Promise.race([
      googleIt(options),
      timeoutPromise
    ]);
    
    if (!results || results.length === 0) {
      return `Não foram encontrados resultados na internet para a pesquisa: "${query}".`;
    }

    const formattedResults = results.map((r, index) => {
      return `[Resultado ${index + 1}]\nTítulo: ${r.title}\nURL: ${r.link}\nResumo: ${r.snippet}\n`;
    }).join('\n');

    return `Resultados da Pesquisa Web para "${query}":\n\n${formattedResults}`;
  } catch (error: any) {
    console.error('[Atena Web Search] Erro ao pesquisar:', error);
    return `Ocorreu um erro técnico ao acessar a internet. Detalhes: ${error.message}`;
  }
}
