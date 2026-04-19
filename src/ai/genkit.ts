
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// VIX: Protocolo de "Injeção Forçada com Verificação" ativado.
// A chave de API agora é lida da variável de ambiente GEMINI_API_KEY.
export const ai = genkit({
  plugins: [
    googleAI(), // Remova configurações extras daqui se houver
  ],
  // Manobra de Elite: Forçamos o modelo padrão aqui se necessário
  model: 'googleai/gemini-3-flash-preview', 
});
