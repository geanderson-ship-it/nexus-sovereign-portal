import { z } from 'genkit';

export const DanteBuilderChatInputSchema = z.object({
  userMessage: z.string().describe("A solicitação do usuário para o construtor."),
  historyContext: z.string().optional().describe("Contexto do projeto anterior para realizar ajustes e refinamentos."),
});
export type DanteBuilderChatInput = z.infer<typeof DanteBuilderChatInputSchema>;

export const DanteBuilderChatOutputSchema = z.object({
  response: z.string().describe("A descrição narrativa do conceito, detalhando a pesquisa de mercado feita mentalmente e a proposta de inovação."),
  specifications: z.object({
    line: z.string().optional().describe("Linha de excelência adotada ou material principal."),
    dimensions: z.string().optional().describe("Dimensões confirmadas ou sugeridas."),
    finish: z.string().optional().describe("Acabamentos sugeridos (gerais)."),
    glass: z.string().optional().describe("Tecnologia de vidro/composição."),
  }).optional().describe("Detalhes técnicos rápidos."),
  materialList: z.array(z.object({
    item: z.string().describe("Nome do componente (ex: Perfil de Quadro Oculto, Dobradiça Inox)."),
    quantity: z.string().describe("Quantidade estimada."),
    reason: z.string().describe("Por que este material premium foi escolhido em detrimento aos comuns.")
  })).optional().describe("Lista de componentes essenciais."),
  proposals: z.array(z.object({
    title: z.string().describe("Título majestoso do modelo."),
    conceptDescription: z.string().describe("Breve explicação do porquê deste design ser inovador."),
    imagePrompt: z.string().describe("Prompt técnico em inglês para gerar a imagem deste modelo."),
    technicalArsenal: z.object({
      engineeringNotes: z.string().describe("Notas de engenharia profunda para o fornecedor."),
      preciseSpecs: z.array(z.string()).describe("Lista de especificações técnicas (ex: Ligas, tratamentos, espessuras)."),
      billOfMaterials: z.array(z.object({
        item: z.string().describe("Nome do componente (ex: Parafuso Inox A4, Bucha Nylon S8)."),
        quantity: z.string().describe("Quantidade exata."),
        details: z.string().describe("Especificações exatas: rosca, comprimento, material, etc."),
        category: z.string().describe("Categoria: Fixação, Vedação, Ferragem, etc.")
      })).optional().describe("Lista exaustiva de componentes para execução."),
      supplierTip: z.string().describe("Dica de ouro para o fornecedor garantir a felicidade do cliente."),
      complexity: z.enum(['Standard', 'Advanced', 'Masterpiece']).describe("Nível de complexidade de execução.")
    }).describe("Arsenal de informações técnicas para o fornecedor.")
  })).optional().describe("Array com exatamente 1 proposta completa ultra-paramétrica."),
  imageUris: z.array(z.string()).optional().describe("Array com as URIs das imagens geradas, caso disponíveis."),
});
export type DanteBuilderChatOutput = z.infer<typeof DanteBuilderChatOutputSchema>;

