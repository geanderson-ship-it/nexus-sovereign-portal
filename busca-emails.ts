import googleIt from 'google-it';
import fs from 'fs';

const capitais = [
  "São Paulo (SP)", "Rio de Janeiro (RJ)", "Brasília (DF)", "Belo Horizonte (MG)", "Salvador (BA)",
  "Fortaleza (CE)", "Curitiba (PR)", "Manaus (AM)", "Recife (PE)", "Goiânia (GO)"
]; // Apenas as 10 primeiras para teste rápido

const extractEmails = (text: string) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const found = text.match(emailRegex) || [];
  return [...new Set(found)].filter(e => e.includes('.gov.br') || e.includes('prefeitura'));
};

async function run() {
  console.log("Iniciando caça aos e-mails para as capitais...");
  const results: any = {};

  for (const cidade of capitais) {
    console.log(`\n🔎 Vasculhando: ${cidade}`);
    results[cidade] = { turismo: [], egide: [] };

    try {
      // Turismo
      const resTurismo = await googleIt({ query: `"secretaria de turismo" "prefeitura" "${cidade}" email`, limit: 5, disableConsole: true });
      let textTurismo = resTurismo.map((r:any) => r.snippet).join(' ');
      results[cidade].turismo = extractEmails(textTurismo);
      console.log(`Turismo: ${results[cidade].turismo.length > 0 ? results[cidade].turismo.join(', ') : 'Não encontrado na 1ª varredura'}`);

      // Egide (Segurança/Gabinete)
      const resEgide = await googleIt({ query: `"secretaria de segurança" OR "gabinete do prefeito" "${cidade}" email`, limit: 5, disableConsole: true });
      let textEgide = resEgide.map((r:any) => r.snippet).join(' ');
      results[cidade].egide = extractEmails(textEgide);
      console.log(`Égide: ${results[cidade].egide.length > 0 ? results[cidade].egide.join(', ') : 'Não encontrado na 1ª varredura'}`);
      
    } catch (e: any) {
      console.error(`Erro na busca por ${cidade}: ${e.message}`);
    }
    
    // Pequeno delay para não levar block do Google
    await new Promise(r => setTimeout(r, 1500));
  }
  
  fs.writeFileSync('emails_prospeccao.json', JSON.stringify(results, null, 2));
  console.log("\n✅ Busca finalizada (Amostra salva em emails_prospeccao.json)");
}

run();
