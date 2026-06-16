'use client';

import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock, Coins, Search, Filter, ArrowUpRight, ChevronLeft, Download, Eye, Calendar, User, DollarSign, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Link from 'next/link';

interface SaleRecord {
  id: string;
  date: string;
  client: string;
  tradeName?: string;
  cnpj?: string;
  product: string;
  value: string; // "R$ X.XXX,XX"
  monthly?: string; // "R$ X.XXX,XX/mês"
  status: string;
  method: string;
  seller: string;
  commission?: string;
  netSignature?: string;
  netSecondInstallment?: string;
  notes?: string;
}

// Mock data base
const MOCK_SALES: SaleRecord[] = [
  { id: 'NX-001', date: '16/06/2026', client: 'Prefeitura de São José', product: 'Cidades do Futuro', value: 'R$ 450.000,00', status: 'Pago', method: 'Licitação', seller: 'Carlos Eduardo' },
  { id: 'NX-002', date: '15/06/2026', client: 'AgroSul Cooperativa', product: 'Dante Safra Axis Elite', value: 'R$ 14.990,00', status: 'Pago', method: 'PIX', seller: 'Carla Silva' },
  { id: 'NX-003', date: '14/06/2026', client: 'TechCorp Solutions', product: 'Nexus Empresas', value: 'R$ 25.000,00', status: 'Parcelado', method: 'Boleto', seller: 'Geanderson' },
  { id: 'NX-004', date: '12/06/2026', client: 'Fazenda Rio Grande', product: 'Dante Safra (Agro)', value: 'R$ 999,00', status: 'Pago', method: 'PIX', seller: 'Carlos Eduardo' },
  { id: 'NX-005', date: '10/06/2026', client: 'Governo do Estado', product: 'Sovereign Premium', value: 'R$ 1.200.000,00', status: 'Aguardando', method: 'Empenho', seller: 'Geanderson' },
];

const parseCurrency = (valStr: string): number => {
  if (!valStr) return 0;
  const clean = valStr.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

export default function ProdutosVendidosPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [salesList, setSalesList] = useState<SaleRecord[]>([]);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  // Load sales from localstorage and combine with mock data
  useEffect(() => {
    if (!isUserLoading) {
      if (!user || !isAdminUser(user)) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
        
        // Read localstorage
        const localSalesRaw = localStorage.getItem('nexus_registered_sales');
        if (localSalesRaw) {
          try {
            const localSales = JSON.parse(localSalesRaw);
            setSalesList([...localSales, ...MOCK_SALES]);
          } catch (e) {
            setSalesList(MOCK_SALES);
          }
        } else {
          setSalesList(MOCK_SALES);
        }
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-primary/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Verificando Credenciais</h2>
      </div>
    );
  }

  // Calculate dynamic KPIs
  const totalFaturamento = salesList.reduce((sum, sale) => sum + parseCurrency(sale.value), 0);
  const totalContratos = salesList.length;
  const ticketMedio = totalContratos > 0 ? totalFaturamento / totalContratos : 0;

  const filteredSales = salesList.filter(sale => 
    sale.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/gabinete" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold uppercase tracking-widest text-xs mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Command Center
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-emerald-700/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <Coins className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-headline text-white uppercase tracking-wider">Central de Faturamento</h1>
              <p className="text-slate-400">Auditoria e Controle de Contratos Fechados (Nível Diretoria)</p>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              // Limpar registros adicionados no localstorage para resetar o demo se necessário
              if(confirm("Deseja resetar as vendas inseridas de teste e reverter para os dados padrão?")) {
                localStorage.removeItem('nexus_registered_sales');
                setSalesList(MOCK_SALES);
              }
            }}
            variant="outline"
            className="border-slate-800 hover:bg-slate-900 text-slate-450 gap-2 uppercase tracking-widest text-[10px] h-9"
          >
            Resetar Banco Demonstrativo
          </Button>
        </div>

        {/* KPIs Dinâmicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/60 border-slate-850">
            <CardContent className="pt-6">
              <p className="text-slate-450 text-[10px] font-bold uppercase tracking-widest mb-2">Faturamento Total (Adesões)</p>
              <h3 className="text-3xl font-headline font-bold text-white font-mono">
                R$ {totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-emerald-500 flex items-center gap-1 text-[11px] mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" /> +42% vs Mês Anterior
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/60 border-slate-850">
            <CardContent className="pt-6">
              <p className="text-slate-450 text-[10px] font-bold uppercase tracking-widest mb-2">Contratos Fechados</p>
              <h3 className="text-3xl font-headline font-bold text-white font-mono">{totalContratos}</h3>
              <p className="text-emerald-500 flex items-center gap-1 text-[11px] mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" /> Atualização em tempo real
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-850">
            <CardContent className="pt-6">
              <p className="text-slate-450 text-[10px] font-bold uppercase tracking-widest mb-2">Ticket Médio (Setup)</p>
              <h3 className="text-3xl font-headline font-bold text-white font-mono">
                R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-slate-500 text-[11px] mt-2">Calculado com base nas {totalContratos} vendas registradas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Vendas */}
        <Card className="bg-slate-900/40 border-slate-850 overflow-hidden shadow-xl">
          <CardHeader className="border-b border-slate-850 pb-4 bg-slate-900/80">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-white font-headline uppercase tracking-wider">Tabela de Auditoria Comercial</CardTitle>
                <CardDescription className="text-slate-400">Clique em "Auditar" para ver o detalhamento completo do contrato e comissões.</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-550" />
                  <Input 
                    placeholder="Buscar cliente, vendedor, produto..." 
                    className="pl-9 bg-black/50 border-slate-800 text-xs text-white focus-visible:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950/80 border-b border-slate-850">
                  <TableRow className="hover:bg-transparent border-slate-850">
                    <TableHead className="text-slate-450 font-bold uppercase text-[9px] tracking-widest py-4">Data</TableHead>
                    <TableHead className="text-slate-450 font-bold uppercase text-[9px] tracking-widest py-4">Cliente (Razão Social)</TableHead>
                    <TableHead className="text-slate-450 font-bold uppercase text-[9px] tracking-widest py-4">Produtos Contratados</TableHead>
                    <TableHead className="text-slate-450 font-bold uppercase text-[9px] tracking-widest py-4">Representante</TableHead>
                    <TableHead className="text-slate-450 font-bold uppercase text-[9px] tracking-widest py-4">Status</TableHead>
                    <TableHead className="text-slate-450 font-bold uppercase text-[9px] tracking-widest py-4 text-right">Adesão (Startup)</TableHead>
                    <TableHead className="text-slate-450 font-bold uppercase text-[9px] tracking-widest py-4 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-850/50">
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id} className="border-slate-850 hover:bg-slate-900/30 transition-colors">
                      <TableCell className="text-slate-400 font-mono text-[11px] py-4">{sale.date}</TableCell>
                      <TableCell className="font-semibold text-white py-4 text-xs">
                        {sale.client}
                        {sale.tradeName && <span className="block text-[10px] font-normal text-slate-450 mt-0.5">F: {sale.tradeName}</span>}
                      </TableCell>
                      <TableCell className="text-blue-400 font-medium py-4 text-[11px] max-w-xs truncate">{sale.product}</TableCell>
                      <TableCell className="text-slate-300 py-4 text-xs">{sale.seller}</TableCell>
                      <TableCell className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          sale.status === 'Pago' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 
                          sale.status === 'Aguardando' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20' : 
                          'bg-blue-950/40 text-blue-400 border border-blue-500/20'
                        }`}>
                          {sale.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-emerald-400 font-mono font-bold py-4 text-xs">{sale.value}</TableCell>
                      <TableCell className="py-4 text-center">
                        <Button 
                          onClick={() => setSelectedSale(sale)}
                          className="bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 font-bold uppercase tracking-widest text-[9px] h-7 px-3 border border-emerald-800/30"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Auditar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">Nenhum contrato comercial localizado.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* DIALOG DE AUDITORIA DETALHADA */}
        <Dialog open={selectedSale !== null} onOpenChange={() => setSelectedSale(null)}>
          <DialogContent className="bg-[#0b1329] border-emerald-800/40 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
            <DialogHeader className="border-b border-slate-800 pb-4">
              <DialogTitle className="text-lg font-headline font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-500" />
                Auditoria de Fechamento: {selectedSale?.id}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Contrato comercial fechado pelo representante {selectedSale?.seller}.
              </DialogDescription>
            </DialogHeader>

            {selectedSale && (
              <div className="space-y-6 pt-4 text-xs">
                {/* 1. DADOS CADASTRAIS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/30 p-3 rounded-lg border border-slate-850">
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider flex items-center gap-1"><User className="w-3 h-3" /> Contratante</p>
                    <p className="text-white font-bold">{selectedSale.client}</p>
                    {selectedSale.tradeName && <p className="text-[10px] text-slate-400">Fantasia: {selectedSale.tradeName}</p>}
                    {selectedSale.cnpj && <p className="text-[10px] text-slate-400 font-mono">CNPJ: {selectedSale.cnpj}</p>}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Detalhes Gerais</p>
                    <p className="text-slate-350">Data de Aquisição: <span className="font-mono text-white font-semibold">{selectedSale.date}</span></p>
                    <p className="text-slate-350">Vendedor: <span className="text-white font-semibold">{selectedSale.seller}</span></p>
                    <p className="text-slate-350">Método de Pgto: <span className="text-white font-semibold">{selectedSale.method}</span></p>
                  </div>
                </div>

                {/* 2. ITENS CONTRATADOS */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Produtos / Licenças Contratadas</p>
                  <div className="bg-black/20 p-3 rounded-lg border border-slate-850 font-medium text-slate-200">
                    {selectedSale.product}
                  </div>
                </div>

                {/* 3. FLUXO FINANCEIRO E COMISSÕES */}
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider flex items-center gap-1"><DollarSign className="w-3 h-3" /> Demonstrativo Financeiro de Repasses</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-black/40 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-[9px] font-bold text-slate-450 uppercase">Total Adesão (Adesão)</span>
                      <p className="text-sm font-bold text-white font-mono mt-1">{selectedSale.value}</p>
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-[9px] font-bold text-slate-450 uppercase flex items-center gap-0.5"><Percent className="w-3 h-3 text-amber-500" /> Comissão (15%)</span>
                      <p className="text-sm font-bold text-amber-400 font-mono mt-1">
                        {selectedSale.commission || `R$ ${(parseCurrency(selectedSale.value) * 0.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </p>
                    </div>
                    <div className="bg-[#10b981]/5 p-2.5 rounded-lg border border-emerald-500/20">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase">Faturamento Recorrente</span>
                      <p className="text-sm font-bold text-emerald-400 font-mono mt-1">
                        {selectedSale.monthly || "Não se aplica"}
                      </p>
                    </div>
                  </div>

                  {/* PARCELAMENTO E REPASSES LÍQUIDOS */}
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 space-y-2">
                    <p className="font-bold text-white uppercase text-[9px] tracking-wider border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>Cronograma de Recebimentos Líquidos Nexus</span>
                      <span className="text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Acordo Comercial 50/50</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <p className="font-bold text-white text-[10px]">1ª Parcela (Assinatura)</p>
                        <div className="text-[10px] text-slate-400 space-y-0.5">
                          <div className="flex justify-between">
                            <span>Valor Entrada (50%):</span>
                            <span className="font-mono">R$ {(parseCurrency(selectedSale.value) * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-amber-500">
                            <span>(-) Comissão de Venda (15%):</span>
                            <span className="font-mono">- {selectedSale.commission || `R$ ${(parseCurrency(selectedSale.value) * 0.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                          </div>
                          <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800/80 pt-0.5 mt-0.5">
                            <span>Líquido Nexus:</span>
                            <span className="font-mono">{selectedSale.netSignature || `R$ ${(parseCurrency(selectedSale.value) * 0.35).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold text-white text-[10px]">2ª Parcela (6º Dia Útil)</p>
                        <div className="text-[10px] text-slate-400 space-y-0.5">
                          <div className="flex justify-between">
                            <span>Valor Parcela 2 (50%):</span>
                            <span className="font-mono">R$ {(parseCurrency(selectedSale.value) * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800/80 pt-0.5 mt-0.5">
                            <span>Líquido Nexus:</span>
                            <span className="font-mono text-emerald-400">{selectedSale.netSecondInstallment || `R$ ${(parseCurrency(selectedSale.value) * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                          </div>
                        </div>
                        <p className="text-[8px] text-slate-500 leading-tight">* Paga após 5 dias úteis (instalação e homologação concluídas), livre de descontos.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. OBSERVAÇÕES DO CONTRATO */}
                {selectedSale.notes && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Observações Comerciais</p>
                    <div className="bg-black/30 p-2.5 rounded-lg border border-slate-850 italic text-slate-350 leading-relaxed">
                      "{selectedSale.notes}"
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button 
                    onClick={() => setSelectedSale(null)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-[10px] h-8 px-4"
                  >
                    Fechar Auditoria
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
