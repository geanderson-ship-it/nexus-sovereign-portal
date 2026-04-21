import { z } from 'genkit';

export const QuotationAnalysisInputSchema = z.object({
  itemName: z.string().describe('Nome do item ou matÃ©ria-prima a ser cotada.'),
  itemSpec: z.string().describe('EspecificaÃ§Ã£o tÃ©cnica do item (ex: peso, volume, quantidade).'),
  desiredDelivery: z.string().describe('Prazo de entrega desejado pelo comprador (ex: "15 dias", "urgente").'),
  desiredPayment: z.string().describe('CondiÃ§Ã£o de pagamento desejada (ex: "30/60 dias").'),
});
export type QuotationAnalysisInput = z.infer<typeof QuotationAnalysisInputSchema>;

export const SupplierItemSchema = z.object({
    item: z.string().describe('Nome do material (ex: AlumÃ­nio, Parafuso).'),
    quantity: z.string().describe('Quantidade com unidade (ex: 20kg, 100un).'),
    unitPrice: z.number().describe('PreÃ§o unitÃ¡rio simbÃ³lico.'),
    totalPrice: z.number().describe('PreÃ§o total para este item especÃ­fico.'),
});

export const SupplierSchema = z.object({
    name: z.string().describe('Nome do fornecedor.'),
    consultantName: z.string().describe('Nome do consultor/vendedor de contato.'),
    phone: z.string().describe('NÃºmero de telefone para contato direto (chamada).'),
    email: z.string().email().describe('EndereÃ§o de e-mail para contato formal.'),
    price: z.number().describe('PreÃ§o ofertado pelo fornecedor para o item/especificaÃ§Ã£o.'),
    deliveryDays: z.number().describe('Prazo de entrega em dias.'),
    paymentTerms: z.string().describe('CondiÃ§Ãµes de pagamento oferecidas (ex: "30 dias", "60/90 dias").'),
    reliability: z.number().min(0).max(100).describe('Ãndice de confiabilidade do fornecedor (0-100), baseado em histÃ³rico.'),
    summary: z.string().describe('Breve resumo dos prÃ³s e contras deste fornecedor.'),
    itemBreakdown: z.array(SupplierItemSchema).optional().describe('Detalhamento opcional dos itens que compÃµem a cotaÃ§Ã£o total.'),
});
export type Supplier = z.infer<typeof SupplierSchema>;


export const QuotationAnalysisOutputSchema = z.object({
  analysis: z.string().describe('AnÃ¡lise de mercado geral e contexto da cotaÃ§Ã£o feita por Dante.'),
  recommendedSupplierName: z.string().describe('Nome do fornecedor recomendado por Dante.'),
  recommendationReason: z.string().describe('Justificativa detalhada de Dante para a recomendaÃ§Ã£o, baseada em uma anÃ¡lise multicritÃ©rio (preÃ§o, prazo, pagamento, confiabilidade).'),
  suppliers: z.array(SupplierSchema).describe('Lista de 4 fornecedores simulados com suas respectivas ofertas.'),
});
export type QuotationAnalysisOutput = z.infer<typeof QuotationAnalysisOutputSchema>;

