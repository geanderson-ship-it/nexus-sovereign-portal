import { z } from 'genkit';

export const QuotationAnalysisInputSchema = z.object({
  itemName: z.string().describe('Nome do item ou matéria-prima a ser cotada.'),
  itemSpec: z.string().describe('Especificação técnica do item (ex: peso, volume, quantidade).'),
  desiredDelivery: z.string().describe('Prazo de entrega desejado pelo comprador (ex: "15 dias", "urgente").'),
  desiredPayment: z.string().describe('Condição de pagamento desejada (ex: "30/60 dias").'),
});
export type QuotationAnalysisInput = z.infer<typeof QuotationAnalysisInputSchema>;

export const SupplierItemSchema = z.object({
    item: z.string().describe('Nome do material (ex: Alumínio, Parafuso).'),
    quantity: z.string().describe('Quantidade com unidade (ex: 20kg, 100un).'),
    unitPrice: z.number().describe('Preço unitário simbólico.'),
    totalPrice: z.number().describe('Preço total para este item específico.'),
});

export const SupplierSchema = z.object({
    name: z.string().describe('Nome do fornecedor.'),
    consultantName: z.string().describe('Nome do consultor/vendedor de contato.'),
    phone: z.string().describe('Número de telefone para contato direto (chamada).'),
    email: z.string().email().describe('Endereço de e-mail para contato formal.'),
    price: z.number().describe('Preço ofertado pelo fornecedor para o item/especificação.'),
    deliveryDays: z.number().describe('Prazo de entrega em dias.'),
    paymentTerms: z.string().describe('Condições de pagamento oferecidas (ex: "30 dias", "60/90 dias").'),
    reliability: z.number().min(0).max(100).describe('Índice de confiabilidade do fornecedor (0-100), baseado em histórico.'),
    summary: z.string().describe('Breve resumo dos prós e contras deste fornecedor.'),
    itemBreakdown: z.array(SupplierItemSchema).optional().describe('Detalhamento opcional dos itens que compõem a cotação total.'),
});
export type Supplier = z.infer<typeof SupplierSchema>;


export const QuotationAnalysisOutputSchema = z.object({
  analysis: z.string().describe('Análise de mercado geral e contexto da cotação feita por Dante.'),
  recommendedSupplierName: z.string().describe('Nome do fornecedor recomendado por Dante.'),
  recommendationReason: z.string().describe('Justificativa detalhada de Dante para a recomendação, baseada em uma análise multicritério (preço, prazo, pagamento, confiabilidade).'),
  suppliers: z.array(SupplierSchema).describe('Lista de 4 fornecedores simulados com suas respectivas ofertas.'),
});
export type QuotationAnalysisOutput = z.infer<typeof QuotationAnalysisOutputSchema>;

