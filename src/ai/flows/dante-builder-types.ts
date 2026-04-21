import { z } from 'genkit';

export const DanteBuilderChatInputSchema = z.object({
  userMessage: z.string().describe("A solicitaÃ§Ã£o do usuÃ¡rio para o construtor."),
  historyContext: z.string().optional().describe("Contexto do projeto anterior para realizar ajustes e refinamentos."),
});
export type DanteBuilderChatInput = z.infer<typeof DanteBuilderChatInputSchema>;

export const DanteBuilderChatOutputSchema = z.object({
  response: z.string().describe("A descriÃ§Ã£o narrativa do conceito, detalhando a pesquisa de mercado feita mentalmente e a proposta de inovaÃ§Ã£o."),
  specifications: z.object({
    line: z.string().optional().describe("Linha de excelÃªncia adotada ou material principal."),
    dimensions: z.string().optional().describe("DimensÃµes confirmadas ou sugeridas."),
    finish: z.string().optional().describe("Acabamentos sugeridos (gerais)."),
    glass: z.string().optional().describe("Tecnologia de vidro/composiÃ§Ã£o."),
  }).optional().describe("Detalhes tÃ©cnicos rÃ¡pidos."),
  materialList: z.array(z.object({
    item: z.string().describe("Nome do componente (ex: Perfil de Quadro Oculto, DobradiÃ§a Inox)."),
    quantity: z.string().describe("Quantidade estimada."),
    reason: z.string().describe("Por que este material premium foi escolhido em detrimento aos comuns.")
  })).optional().describe("Lista de componentes essenciais."),
  proposals: z.array(z.object({
    title: z.string().describe("TÃ­tulo majestoso do modelo."),
    conceptDescription: z.string().describe("Breve explicaÃ§Ã£o do porquÃª deste design ser inovador."),
    imagePrompt: z.string().describe("Prompt tÃ©cnico em inglÃªs para gerar a imagem deste modelo."),
    technicalArsenal: z.object({
      engineeringNotes: z.string().describe("Notas de engenharia profunda para o fornecedor."),
      preciseSpecs: z.array(z.string()).describe("Lista de especificaÃ§Ãµes tÃ©cnicas (ex: Ligas, tratamentos, espessuras)."),
      billOfMaterials: z.array(z.object({
        item: z.string().describe("Nome do componente (ex: Parafuso Inox A4, Bucha Nylon S8)."),
        quantity: z.string().describe("Quantidade exata."),
        details: z.string().describe("EspecificaÃ§Ãµes exatas: rosca, comprimento, material, etc."),
        category: z.string().describe("Categoria: FixaÃ§Ã£o, VedaÃ§Ã£o, Ferragem, etc.")
      })).optional().describe("Lista exaustiva de componentes para execuÃ§Ã£o."),
      supplierTip: z.string().describe("Dica de ouro para o fornecedor garantir a felicidade do cliente."),
      complexity: z.enum(['Standard', 'Advanced', 'Masterpiece']).describe("NÃ­vel de complexidade de execuÃ§Ã£o.")
    }).describe("Arsenal de informaÃ§Ãµes tÃ©cnicas para o fornecedor.")
  })).optional().describe("Array com exatamente 1 proposta completa ultra-paramÃ©trica."),
  imageUris: z.array(z.string()).optional().describe("Array com as URIs das imagens geradas, caso disponÃ­veis."),
});
export type DanteBuilderChatOutput = z.infer<typeof DanteBuilderChatOutputSchema>;

