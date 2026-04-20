
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// VIX: Protocolo de "Injeção Forçada com Verificação" ativado.
if (!process.env.GOOGLE_GENAI_API_KEY && !process.env.GEMINI_API_KEY && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ [NEXUS COMPONENT] Warning: No AI API keys found. Build may be unstable if pre-rendering hits these components.");
}

export const ai = genkit({
  plugins: [
    googleAI(), // Remova configurações extras daqui se houver
  ],
  // Manobra de Elite: Forçamos o modelo padrão aqui se necessário
  model: 'googleai/gemini-3-flash-preview', 
});
