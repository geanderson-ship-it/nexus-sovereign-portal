'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Briefcase, Lock, CheckCircle2, Send, ChevronLeft, 
  Search, Plus, Trash2, Calculator, Info, Calendar, Building2, User 
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/auth';
import { isAdminUser } from '@/lib/constants';

interface Product {
  id: string;
  name: string;
  category: string;
  startup: number;
  monthly: number;
  description: string;
}

const PRODUCTS_CATALOG: Product[] = [
  // Premium
  { id: 'egide', name: 'Nexus Intelligence Égide', category: 'premium', startup: 150000, monthly: 9999, description: 'Cerco Eletrônico, LPR, Aegis Biometria & Dante\'s Safe' },
  { id: 'pactum', name: 'Nexus Pactum', category: 'premium', startup: 150000, monthly: 9999, description: 'Deal war room e detecção biométrica de blefes' },
  { id: 'atlas', name: 'Nexus Atlas (Logística/Portos)', category: 'premium', startup: 150000, monthly: 9999, description: 'Logística Global, Roteamento Neural e Telemetria Portuária' },
  { id: 'vulcan', name: 'Nexus Vulcan (Indústria)', category: 'premium', startup: 150000, monthly: 9999, description: 'Mineração e Manutenção Preditiva com IoT' },
  { id: 'orion', name: 'Nexus Governança (Orion)', category: 'premium', startup: 150000, monthly: 9999, description: 'Gestão de Conselhos e Compliance' },
  { id: 'magadot', name: 'Nexus Auditoria (Magadot)', category: 'premium', startup: 150000, monthly: 9999, description: 'Auditoria de Estado e Rastreamento Financeiro' },

  // Empresas
  { id: 'vendas', name: 'Nexus Vendas', category: 'empresas', startup: 13500, monthly: 550, description: 'Catálogo, Pedidos e Ordens de Produção' },
  { id: 'compras', name: 'Nexus Compras', category: 'empresas', startup: 15000, monthly: 600, description: 'IA de Intermediação e Auditoria de Suprimentos' },
  { id: 'projetos', name: 'Nexus Projetos', category: 'empresas', startup: 18000, monthly: 750, description: 'Orçamentos Técnicos Automatizados por IA' },
  { id: 'ppcp', name: 'Nexus PPCP', category: 'empresas', startup: 18000, monthly: 750, description: 'Planejamento e Controle da Produção' },
  { id: 'auditor', name: 'Nexus Auditor', category: 'empresas', startup: 13500, monthly: 550, description: 'Auditoria de Processos e Bloqueio de Desvios' },
  { id: 'cronoanalise', name: 'Nexus Cronoanálise', category: 'empresas', startup: 10500, monthly: 450, description: 'Tempos Padrão e Medição de Eficiência' },
  { id: 'almoxarifado', name: 'Nexus Almoxarifado', category: 'empresas', startup: 10500, monthly: 450, description: 'Gestão de Estoque em Real-Time' },
  { id: 'expedicao', name: 'Nexus Expedição', category: 'empresas', startup: 10500, monthly: 450, description: 'Controle de Saídas de Carga e Romaneio' },
  { id: 'rh', name: 'RH & Pessoas (Djeny RH)', category: 'empresas', startup: 10500, monthly: 450, description: 'Gestão de talentos com IA' },
  { id: 'advisor', name: 'Estratégia & Liderança (Career Advisor)', category: 'empresas', startup: 21000, monthly: 850, description: 'Mentoria executiva e career advisor' },
  { id: 'processos', name: 'Engenharia de Processos', category: 'empresas', startup: 16000, monthly: 650, description: 'Banco de tempos auditados' },

  // Segmentos
  { id: 'dante-safra', name: 'Agronegócio (Dante Safra)', category: 'segmentos', startup: 1499, monthly: 149, description: 'Inteligência de safra em tempo real' },
  { id: 'studio', name: 'Nexus Studio', category: 'segmentos', startup: 1499, monthly: 199, description: 'Cockpit de broadcast e automação' },
  { id: 'health', name: 'Nexus Health', category: 'segmentos', startup: 0, monthly: 199, description: 'Monitoramento clínico e IA preventiva' },


];

interface SelectedProduct {
  product: Product;
  startupPrice: number;
  monthlyPrice: number;
}

export default function LancamentoVendaPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sellerName, setSellerName] = useState('');
  const [notes, setNotes] = useState('');

  // Product Selection States
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'todos' | 'premium' | 'empresas' | 'segmentos'>('todos');

  useEffect(() => {
    if (!isUserLoading) {
      const isVendasAuth = localStorage.getItem('vendas_auth') === 'true';
      const isSystemAdmin = user && isAdminUser(user);
      
      if (!isVendasAuth && !isSystemAdmin) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center text-primary">
        <Lock className="w-12 h-12 mb-4 animate-pulse text-primary/50" />
        <h2 className="text-xl font-headline tracking-widest text-white/50 uppercase">Verificando Acesso Comercial</h2>
      </div>
    );
  }

  // CNPJ Mask (00.000.000/0000-00)
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    
    if (value.length > 12) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    } else if (value.length > 8) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})$/, "$1.$2.$3/$4");
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{3})(\d{0,3})$/, "$1.$2.$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,3})$/, "$1.$2");
    }
    setCnpj(value);
  };

  // Select/Deselect product handler
  const handleToggleProduct = (product: Product) => {
    const isAlreadySelected = selectedProducts.some(p => p.product.id === product.id);
    if (isAlreadySelected) {
      setSelectedProducts(selectedProducts.filter(p => p.product.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, {
        product,
        startupPrice: product.startup,
        monthlyPrice: product.monthly
      }]);
    }
  };

  const handleUpdatePrice = (productId: string, field: 'startup' | 'monthly', value: number) => {
    setSelectedProducts(selectedProducts.map(p => {
      if (p.product.id === productId) {
        return {
          ...p,
          startupPrice: field === 'startup' ? value : p.startupPrice,
          monthlyPrice: field === 'monthly' ? value : p.monthlyPrice
        };
      }
      return p;
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.product.id !== productId));
  };

  // Financial calculations
  const totalStartup = selectedProducts.reduce((sum, p) => sum + p.startupPrice, 0);
  const totalMonthly = selectedProducts.reduce((sum, p) => sum + p.monthlyPrice, 0);

  // 15% commission calculated on total startup
  const commissionDeduction = totalStartup * 0.15;

  // Split calculations
  const firstInstallmentGross = totalStartup * 0.50; // 50%
  const firstInstallmentNetNexus = firstInstallmentGross - commissionDeduction; // 50% - 15% commission
  const secondInstallment = totalStartup * 0.50; // 50% paid on day 6 (free of deduction)

  const filteredCatalog = PRODUCTS_CATALOG.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'todos' || p.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert('Por favor, selecione pelo menos um produto contratado.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Save to localStorage
    const newSale = {
      id: `NX-${Math.floor(Math.random() * 900) + 100}`,
      date: new Date(acquisitionDate + 'T12:00:00').toLocaleDateString('pt-BR'),
      client: companyName,
      tradeName: tradeName,
      cnpj: cnpj,
      product: selectedProducts.map(p => p.product.name).join(' + '),
      value: `R$ ${totalStartup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      monthly: `R$ ${totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`,
      status: 'Pago',
      method: 'Faturamento Direto',
      seller: sellerName || 'Vendedor Comercial',
      commission: `R$ ${commissionDeduction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      netSignature: `R$ ${firstInstallmentNetNexus.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      netSecondInstallment: `R$ ${secondInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      notes: notes
    };

    const existingSalesRaw = localStorage.getItem('nexus_registered_sales');
    const existingSales = existingSalesRaw ? JSON.parse(existingSalesRaw) : [];
    localStorage.setItem('nexus_registered_sales', JSON.stringify([newSale, ...existingSales]));
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Clear form
      setCompanyName('');
      setTradeName('');
      setCnpj('');
      setSellerName('');
      setNotes('');
      setSelectedProducts([]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/gabinete-vendas" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest text-xs mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Showroom Comercial
        </Link>

        {isSuccess ? (
          <Card className="bg-slate-900/40 border-emerald-500/50 text-center py-16 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-in zoom-in duration-500" />
              <h2 className="text-3xl font-headline font-bold text-white uppercase tracking-wider">Venda Registrada!</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                O contrato comercial foi submetido. As informações financeiras e de comissão foram enviadas para a Central de Faturamento da Diretoria.
              </p>
              <Button 
                onClick={() => setIsSuccess(false)}
                className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 h-auto"
              >
                Lançar Outra Venda
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-900/40 border-emerald-900/50 shadow-[0_0_50px_rgba(16,185,129,0.05)] overflow-hidden">
            <CardHeader className="border-b border-emerald-900/50 pb-6 bg-slate-900/60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Briefcase className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-headline text-white uppercase tracking-wider">Registro de Fechamento de Vendas</CardTitle>
                  <CardDescription className="text-slate-400">Insira as informações oficiais para geração do contrato e faturamento.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. DADOS DA EMPRESA */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-emerald-500 tracking-widest border-b border-emerald-950/80 pb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> 1. Identificação do Cliente
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Nome da Empresa (Razão Social)</Label>
                      <Input 
                        id="companyName" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ex: AgroTech Sul Participações S/A" 
                        required 
                        className="bg-black/50 border-emerald-900/50 focus-visible:ring-emerald-500 text-white" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tradeName" className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Nome Fantasia</Label>
                      <Input 
                        id="tradeName" 
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                        placeholder="Ex: AgroTech Sul" 
                        required 
                        className="bg-black/50 border-emerald-900/50 focus-visible:ring-emerald-500 text-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">CNPJ da Empresa</Label>
                      <Input 
                        id="cnpj" 
                        value={cnpj}
                        onChange={handleCnpjChange}
                        placeholder="00.000.000/0000-00" 
                        required 
                        className="bg-black/50 border-emerald-900/50 focus-visible:ring-emerald-500 text-white font-mono" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Data de Aquisição
                      </Label>
                      <Input 
                        id="date" 
                        type="date"
                        value={acquisitionDate}
                        onChange={(e) => setAcquisitionDate(e.target.value)}
                        required 
                        className="bg-black/50 border-emerald-900/50 focus-visible:ring-emerald-500 text-white font-mono" 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. PRODUTOS ADQUIRIDOS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-emerald-950/80 pb-2">
                    <h3 className="text-xs font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> 2. Módulos & Licenças Adquiridos
                    </h3>
                    <Button 
                      type="button" 
                      onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                      className="bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-300 font-bold uppercase tracking-widest text-[10px] px-3 py-1 h-7 border border-emerald-700/30"
                    >
                      {isSelectorOpen ? 'Fechar Catálogo' : '+ Adicionar Módulos'}
                    </Button>
                  </div>

                  {/* SEARCHABLE SELECTION DROPDOWN/CARD */}
                  {isSelectorOpen && (
                    <Card className="bg-slate-950 border-emerald-800/40 p-4 animate-in fade-in duration-200">
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600" />
                            <Input 
                              placeholder="Buscar módulos no catálogo..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 bg-black/80 border-emerald-900/50 focus-visible:ring-emerald-500 text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* CATEGORY TABS */}
                        <div className="flex gap-1 overflow-x-auto pb-1">
                          {(['todos', 'premium', 'empresas', 'segmentos'] as const).map((tab) => (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setActiveTab(tab)}
                              className={`py-1 px-3 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all border ${
                                activeTab === tab
                                  ? 'bg-emerald-600 border-emerald-500 text-white'
                                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* PRODUCT LIST */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                          {filteredCatalog.map((product) => {
                            const isSelected = selectedProducts.some(p => p.product.id === product.id);
                            return (
                              <div 
                                key={product.id}
                                onClick={() => handleToggleProduct(product)}
                                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'bg-emerald-950/30 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                                    : 'bg-black/40 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                                      {product.name}
                                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono font-bold uppercase">
                                        {product.category}
                                      </span>
                                    </h4>
                                    <p className="text-[10px] text-slate-400 mt-1">{product.description}</p>
                                    <div className="flex gap-3 mt-1.5 text-[10px] font-mono">
                                      <span className="text-emerald-400">Startup: {product.startup > 0 ? `R$ ${product.startup.toLocaleString('pt-BR')}` : 'R$ 0'}</span>
                                      <span className="text-blue-400">Mensal: {product.monthly > 0 ? `R$ ${product.monthly.toLocaleString('pt-BR')}/m` : 'Sem Recorrência'}</span>
                                    </div>
                                  </div>
                                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0 ${
                                    isSelected 
                                      ? 'bg-emerald-500 border-emerald-400 text-white' 
                                      : 'bg-black/50 border-slate-700 text-transparent'
                                  }`}>
                                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* SELECTED PRODUCTS TABLE */}
                  {selectedProducts.length === 0 ? (
                    <div className="border border-dashed border-emerald-950/60 rounded-xl p-8 text-center text-slate-500 text-sm">
                      Nenhum módulo selecionado para esta venda. Clique em "+ Adicionar Módulos" acima para selecionar os produtos contratados.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-emerald-950/40 bg-black/30">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-widest text-[9px] border-b border-emerald-950/40">
                          <tr>
                            <th className="p-3">Módulo / Licença</th>
                            <th className="p-3 w-32">Valor Startup (R$)</th>
                            <th className="p-3 w-32">Valor Mensal (R$)</th>
                            <th className="p-3 w-16 text-center">Remover</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-950/25">
                          {selectedProducts.map(({ product, startupPrice, monthlyPrice }) => (
                            <tr key={product.id} className="hover:bg-emerald-950/5 transition-colors">
                              <td className="p-3">
                                <div className="font-bold text-white">{product.name}</div>
                                <div className="text-[10px] text-slate-400">{product.description}</div>
                              </td>
                              <td className="p-3">
                                <Input 
                                  type="number"
                                  value={startupPrice || ''}
                                  onChange={(e) => handleUpdatePrice(product.id, 'startup', Number(e.target.value))}
                                  className="bg-black/80 border-slate-800 h-8 text-xs font-mono text-emerald-400 focus:border-emerald-500 focus:ring-0 text-white"
                                />
                              </td>
                              <td className="p-3">
                                <Input 
                                  type="number"
                                  value={monthlyPrice || ''}
                                  onChange={(e) => handleUpdatePrice(product.id, 'monthly', Number(e.target.value))}
                                  disabled={product.monthly === 0}
                                  className="bg-black/80 border-slate-800 h-8 text-xs font-mono text-blue-400 focus:border-emerald-500 focus:ring-0 disabled:opacity-40 text-white"
                                />
                              </td>
                              <td className="p-3 text-center">
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveProduct(product.id)}
                                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 3. IDENTIFICAÇÃO DO VENDEDOR E OBSERVAÇÕES */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-emerald-500 tracking-widest border-b border-emerald-950/80 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> 3. Registro do Negócio & Anotações
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="sellerName" className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Representante de Vendas (Seu Nome)</Label>
                    <Input 
                      id="sellerName" 
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo" 
                      required 
                      className="bg-black/50 border-emerald-900/50 focus-visible:ring-emerald-500 text-white" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Observações do Vendedor</Label>
                    <Textarea 
                      id="notes" 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Detalhes específicos da negociação, customizações técnicas, SLA acordado, etc." 
                      className="bg-black/50 border-emerald-900/50 focus-visible:ring-emerald-500 min-h-[80px] text-white text-xs" 
                    />
                  </div>
                </div>

                {/* 4. PLANILHA DE FECHAMENTO FINANCEIRO */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-xs font-black uppercase text-emerald-500 tracking-widest border-b border-emerald-950/80 pb-2 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> 4. Demonstrativo Financeiro de Fechamento
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* SOMA TOTAL */}
                    <div className="bg-black/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soma Total de Produtos</span>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-semibold text-emerald-400 font-mono">
                          Setup/Startup: R$ {totalStartup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-blue-400 font-mono">
                          Recorrência: R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                        </p>
                      </div>
                    </div>

                    {/* COMISSÃO DE VENDAS */}
                    <div className="bg-black/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute right-0 top-0 bg-emerald-500/10 border-l border-b border-emerald-500/20 px-2 py-0.5 rounded-bl text-[8px] font-bold uppercase text-emerald-400 font-mono">
                        Comissão 15%
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dedução de Comissão de Vendas</span>
                      <div className="mt-2">
                        <p className="text-sm font-bold text-amber-400 font-mono">
                          R$ {commissionDeduction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 leading-tight flex items-start gap-1">
                          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>Descontada inteiramente na 1ª parcela do contrato.</span>
                        </p>
                      </div>
                    </div>

                    {/* LIQUIDO TOTAL ESTIMADO */}
                    <div className="bg-black/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faturamento Líquido (Startup)</span>
                      <div className="mt-2">
                        <p className="text-lg font-black text-white font-mono">
                          R$ {(totalStartup - commissionDeduction).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1">Língido creditado à Nexus Holding.</p>
                      </div>
                    </div>
                  </div>

                  {/* DETALHAMENTO DE PARCELAS */}
                  <Card className="bg-[#0b1329]/40 border-emerald-500/20 shadow-md">
                    <CardContent className="p-4 space-y-4">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span>Fluxo de Caixa Acordado (Adesão/Startup)</span>
                        <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-500/10 px-2 py-0.5 rounded text-[8px]">
                          2 Parcelas (Assinatura + 6º Dia)
                        </span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
                        {/* PARCELA 1 */}
                        <div className="space-y-2.5 pb-4 md:pb-0">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-white uppercase tracking-wider text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              1ª Parcela (50% na Assinatura)
                            </span>
                            <span className="font-bold font-mono text-slate-200">
                              R$ {firstInstallmentGross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex justify-between text-slate-400">
                              <span>Valor de Entrada (Bruto)</span>
                              <span className="font-mono">R$ {firstInstallmentGross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-amber-400">
                              <span>(-) Dedução da Comissão (15% da Venda)</span>
                              <span className="font-mono">- R$ {commissionDeduction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="border-t border-slate-800/40 my-1 pt-1 flex justify-between font-bold text-emerald-400 text-xs">
                              <span>Líquido Creditado para Nexus</span>
                              <span className="font-mono">R$ {firstInstallmentNetNexus.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>

                        {/* PARCELA 2 */}
                        <div className="space-y-2.5 pt-4 md:pt-0 md:pl-6">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-white uppercase tracking-wider text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              2ª Parcela (50% no 6º Dia Útil)
                            </span>
                            <span className="font-bold font-mono text-emerald-400">
                              R$ {secondInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex justify-between text-slate-400">
                              <span>Compensação de Saldo</span>
                              <span className="font-mono font-bold text-white">R$ {secondInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Instalação + Homologação técnica</span>
                              <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider">5 dias úteis</span>
                            </div>
                            <div className="border-t border-slate-800/40 my-1 pt-1 flex justify-between font-bold text-emerald-400 text-xs">
                              <span>Líquido Creditado para Nexus</span>
                              <span className="font-mono">R$ {secondInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                          
                          <p className="text-[9px] text-slate-500 leading-tight">
                            * Pagamento no 6º dia pós assinatura (após o prazo de 5 dias úteis para instalação), livre de quaisquer deduções ou comissões comerciais.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* BOTÃO SUBMETER */}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs transition-all border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    'Auditando e Registrando Venda...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Finalizar e Registrar Venda na Nexus
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
