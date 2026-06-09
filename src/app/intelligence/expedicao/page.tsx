'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Truck,
  Package,
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  Send,
  Box,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { useToast } from '@/hooks/use-toast';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

// Mock data - substituir por dados reais depois
const mockOrders = [
  {
    id: 'PED-001',
    cliente: 'João Silva Construções',
    origem: 'Vendas',
    produtos: [
      { nome: 'Porta Premium 2.10x0.90', qtd: 5, un: 'un' },
      { nome: 'Janela Maxim-Ar 1.20x1.00', qtd: 10, un: 'un' },
    ],
    status: 'aguardando',
    prioridade: 'alta',
    dataEntrega: '2024-01-15',
    endereco: 'Rua das Flores, 123 - Porto Alegre/RS',
  },
  {
    id: 'OP-1234',
    cliente: 'Construtora Horizonte',
    origem: 'PPCP',
    produtos: [
      { nome: 'Estrutura Metálica Modular', qtd: 20, un: 'm' },
      { nome: 'Parafusos Inox A4', qtd: 500, un: 'un' },
    ],
    status: 'separacao',
    prioridade: 'media',
    dataEntrega: '2024-01-16',
    endereco: 'Av. Industrial, 456 - Canoas/RS',
  },
  {
    id: 'PED-002',
    cliente: 'Metalúrgica Sul',
    origem: 'Vendas',
    produtos: [
      { nome: 'Dispositivo IoT Sensor', qtd: 50, un: 'un' },
    ],
    status: 'pronto',
    prioridade: 'baixa',
    dataEntrega: '2024-01-17',
    endereco: 'Rua da Indústria, 789 - Novo Hamburgo/RS',
  },
  {
    id: 'OP-1235',
    cliente: 'Empresa ABC Ltda',
    origem: 'PPCP',
    produtos: [
      { nome: 'Móvel Corporativo Modular', qtd: 15, un: 'un' },
    ],
    status: 'despachado',
    prioridade: 'alta',
    dataEntrega: '2024-01-14',
    endereco: 'Av. Central, 321 - São Leopoldo/RS',
    rastreio: 'BR123456789',
  },
];

const mockEstoqueExpedicao = [
  { id: '1', item: 'Porta Premium 2.10x0.90', codigo: 'PRT-001', cor: 'Branco', quantidade: 15 },
  { id: '2', item: 'Janela Maxim-Ar 1.20x1.00', codigo: 'JAN-002', cor: 'Preto Fosco', quantidade: 8 },
  { id: '3', item: 'Parafuso Inox A4', codigo: 'PAR-444', cor: 'N/A', quantidade: 1200 },
  { id: '4', item: 'Estrutura Metálica', codigo: 'EST-999', cor: 'Cinza', quantidade: 2 },
  { id: '5', item: 'Fechadura Eletrônica', codigo: 'FEC-101', cor: 'Prata', quantidade: 5 },
];

const statusConfig = {
  aguardando: { label: 'Aguardando Separação', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
  separacao: { label: 'Em Separação', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Box },
  pronto: { label: 'Pronto p/ Despacho', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
  despachado: { label: 'Despachado', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: Truck },
};

const prioridadeConfig = {
  alta: { label: 'Alta', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  media: { label: 'Média', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  baixa: { label: 'Baixa', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

export default function NexusExpedicaoPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [romaneioDialogOpen, setRomaneioDialogOpen] = useState(false);
  const [novoPedidoDialogOpen, setNovoPedidoDialogOpen] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const [novoPedido, setNovoPedido] = useState({
    cliente: '',
    dataEntrega: '',
    rua: '',
    numero: '',
    bairro: '',
    municipio: '',
    estado: '',
    prioridade: 'media',
    produtos: [{ nome: '', qtd: '', un: '' }]
  });

  const [estoqueExpedicao, setEstoqueExpedicao] = useState(mockEstoqueExpedicao);
  const [novoItemEstoqueOpen, setNovoItemEstoqueOpen] = useState(false);
  const [saidaEstoqueOpen, setSaidaEstoqueOpen] = useState(false);
  const [formNovoItem, setFormNovoItem] = useState({ codigo: '', item: '', cor: '', quantidade: 1 });
  const [formSaida, setFormSaida] = useState({ itemId: '', quantidade: 1, observacao: '' });

  const handleCadastrarItemEstoque = () => {
    if (!formNovoItem.codigo || !formNovoItem.item) {
      toast({ title: "Campos obrigatórios", description: "Preencha Código e Item.", variant: "destructive" });
      return;
    }
    const novo = {
      id: Date.now().toString(),
      codigo: formNovoItem.codigo.toUpperCase(),
      item: formNovoItem.item.toUpperCase(),
      cor: formNovoItem.cor || 'N/A',
      quantidade: Number(formNovoItem.quantidade)
    };
    setEstoqueExpedicao([novo, ...estoqueExpedicao]);
    toast({ title: "Item cadastrado", description: `${novo.codigo} adicionado ao estoque da expedição.` });
    setNovoItemEstoqueOpen(false);
    setFormNovoItem({ codigo: '', item: '', cor: '', quantidade: 1 });
  };

  const handleSaidaEstoque = () => {
    if (!formSaida.itemId || !formSaida.quantidade) return;
    const item = estoqueExpedicao.find(i => i.id === formSaida.itemId);
    if (!item) return;
    
    if (item.quantidade < formSaida.quantidade) {
      toast({ title: "Estoque insuficiente", description: `Temos apenas ${item.quantidade} de ${item.codigo}.`, variant: "destructive" });
      return;
    }

    setEstoqueExpedicao(estoqueExpedicao.map(i => 
      i.id === item.id ? { ...i, quantidade: i.quantidade - formSaida.quantidade } : i
    ));

    toast({ title: "Saída registrada", description: `${formSaida.quantidade}x ${item.codigo} removidos do estoque da expedição.` });
    setSaidaEstoqueOpen(false);
    setFormSaida({ itemId: '', quantidade: 1, observacao: '' });
  };

  const handleGerarRomaneio = (order: any) => {
    setSelectedOrder(order);
    setRomaneioDialogOpen(true);
  };

  const handleImprimirRomaneio = () => {
    window.print();
  };

  const handleCadastrarPedido = () => {
    if (!novoPedido.cliente || !novoPedido.dataEntrega) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos Cliente e Data de Entrega.",
        variant: "destructive",
      });
      return;
    }
    
    const produtosValidos = novoPedido.produtos.filter(p => p.nome && p.qtd);
    if (produtosValidos.length === 0) {
      toast({
        title: "Produtos necessários",
        description: "Adicione pelo menos um produto ao pedido.",
        variant: "destructive",
      });
      return;
    }

    const nextId = `PED-${String(orders.filter(o => o.id.startsWith('PED')).length + 1).padStart(3, '0')}`;
    const enderecoCompleto = `${novoPedido.rua}, ${novoPedido.numero} - ${novoPedido.bairro} - ${novoPedido.municipio}/${novoPedido.estado}`;
    
    const novoPedidoObj = {
      id: nextId,
      cliente: novoPedido.cliente,
      origem: 'Vendas Avulso',
      produtos: produtosValidos.map(p => ({
        nome: p.nome,
        qtd: Number(p.qtd),
        un: p.un
      })),
      status: 'aguardando',
      prioridade: novoPedido.prioridade,
      dataEntrega: novoPedido.dataEntrega,
      endereco: enderecoCompleto,
    };
    
    setOrders([novoPedidoObj, ...orders]);

    toast({
      title: "✅ Pedido cadastrado com sucesso!",
      description: `${nextId} - ${novoPedido.cliente} | ${produtosValidos.length} produto(s)`,
    });
    
    setNovoPedido({
      cliente: '',
      dataEntrega: '',
      rua: '',
      numero: '',
      bairro: '',
      municipio: '',
      estado: '',
      prioridade: 'media',
      produtos: [{ nome: '', qtd: '', un: '' }]
    });
    setNovoPedidoDialogOpen(false);
  };

  const handleAdicionarProduto = () => {
    setNovoPedido({
      ...novoPedido,
      produtos: [...novoPedido.produtos, { nome: '', qtd: '', un: '' }]
    });
  };

  const handleRegistrarSaida = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'despachado', rastreio: `BR${Date.now().toString().slice(-9)}` } : o
    ));
    toast({
      title: "🚚 Saída registrada",
      description: `${orderId} despachado. Integração com estoque ativa.`,
    });
  };

  const handleMudarStatus = (orderId: string, novoStatus: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: novoStatus } : o
    ));
    const statusLabels: Record<string, string> = {
      aguardando: 'Aguardando Separação',
      separacao: 'Em Separação',
      pronto: 'Pronto para Despacho',
      despachado: 'Despachado'
    };
    toast({
      title: "✅ Status atualizado",
      description: `${orderId} → ${statusLabels[novoStatus]}`,
    });
  };

  return (
    <SovereignShowcase moduleName="Módulo Expedição" imagePath="/Nexus Empresas/Dante expedição.png">
      <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="text-cyan-400 border-cyan-500/50 hover:bg-cyan-950/50"
          onClick={() => window.history.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
          Voltar
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold tracking-tighter font-headline text-cyan-400">
            Dashboard Nexus Expedição.
          </h1>
          <p className="text-lg text-gray-400">
            Controle de Saída, Romaneio e Entrega Inteligente.
          </p>
        </div>
        <div className="w-[100px]" />
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card 
          className="bg-yellow-900/20 border-yellow-700/50 cursor-pointer hover:bg-yellow-900/30 transition-all"
          onClick={() => setFiltroStatus(filtroStatus === 'aguardando' ? null : 'aguardando')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-400 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Aguardando
              {filtroStatus === 'aguardando' && <Badge className="ml-auto bg-yellow-500 text-black text-xs">Ativo</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {orders.filter(o => o.status === 'aguardando').length}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-blue-900/20 border-blue-700/50 cursor-pointer hover:bg-blue-900/30 transition-all"
          onClick={() => setFiltroStatus(filtroStatus === 'separacao' ? null : 'separacao')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
              <Box className="h-4 w-4" />
              Em Separação
              {filtroStatus === 'separacao' && <Badge className="ml-auto bg-blue-500 text-black text-xs">Ativo</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {orders.filter(o => o.status === 'separacao').length}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-green-900/20 border-green-700/50 cursor-pointer hover:bg-green-900/30 transition-all"
          onClick={() => setFiltroStatus(filtroStatus === 'pronto' ? null : 'pronto')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Prontos
              {filtroStatus === 'pronto' && <Badge className="ml-auto bg-green-500 text-black text-xs">Ativo</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {orders.filter(o => o.status === 'pronto').length}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-cyan-900/20 border-cyan-700/50 cursor-pointer hover:bg-cyan-900/30 transition-all"
          onClick={() => setFiltroStatus(filtroStatus === 'despachado' ? null : 'despachado')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-cyan-400 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Despachados
              {filtroStatus === 'despachado' && <Badge className="ml-auto bg-cyan-500 text-black text-xs">Ativo</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              {orders.filter(o => o.status === 'despachado').length}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-amber-900/20 border-amber-700/50 cursor-pointer hover:bg-amber-900/30 transition-all h-full flex flex-col justify-center"
          onClick={() => setFiltroStatus(filtroStatus === 'estoque' ? null : 'estoque')}
        >
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-medium text-amber-400 flex flex-col items-center justify-center gap-3 relative">
              <Package className="h-8 w-8" />
              <span className="text-center">Estoque Expedição</span>
              {filtroStatus === 'estoque' && <Badge className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs">Ativo</Badge>}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {filtroStatus !== 'estoque' && (
        <>

      {/* FILA DE EXPEDIÇÃO */}
      <Card className="bg-gray-900/50 border-cyan-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-cyan-300 font-headline">
                <Package />
                Fila de Expedição.
              </CardTitle>
              <CardDescription>Pedidos e Ordens aguardando processamento.</CardDescription>
            </div>
            <Dialog open={novoPedidoDialogOpen} onOpenChange={setNovoPedidoDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Novo Pedido Avulso
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/90 border-cyan-500/50 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-cyan-300 font-headline flex items-center gap-2">
                    <Package />
                    Cadastrar Pedido Avulso
                  </DialogTitle>
                  <DialogDescription>Registre vendas diretas que não passaram pelo sistema de vendas.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase">Cliente</label>
                      <input
                        type="text"
                        placeholder="Nome do cliente"
                        value={novoPedido.cliente}
                        onChange={(e) => setNovoPedido({...novoPedido, cliente: e.target.value})}
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase">Data de Entrega</label>
                      <input
                        type="date"
                        value={novoPedido.dataEntrega}
                        onChange={(e) => setNovoPedido({...novoPedido, dataEntrega: e.target.value})}
                        className="w-full bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                        style={{ colorScheme: 'dark' }}
                        lang="pt-BR"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase">Endereço de Entrega</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Rua/Avenida"
                        value={novoPedido.rua}
                        onChange={(e) => setNovoPedido({...novoPedido, rua: e.target.value})}
                        className="col-span-2 bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Número"
                        value={novoPedido.numero}
                        onChange={(e) => setNovoPedido({...novoPedido, numero: e.target.value})}
                        className="bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={novoPedido.bairro}
                        onChange={(e) => setNovoPedido({...novoPedido, bairro: e.target.value})}
                        className="bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Município"
                        value={novoPedido.municipio}
                        onChange={(e) => setNovoPedido({...novoPedido, municipio: e.target.value})}
                        className="bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                      />
                      <select 
                        value={novoPedido.estado}
                        onChange={(e) => setNovoPedido({...novoPedido, estado: e.target.value})}
                        className="bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="">Estado</option>
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase">Prioridade</label>
                    <select 
                      value={novoPedido.prioridade}
                      onChange={(e) => setNovoPedido({...novoPedido, prioridade: e.target.value})}
                      className="w-full bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase">Produtos</label>
                    <div className="space-y-2">
                      {novoPedido.produtos.map((prod, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nome do produto"
                            value={prod.nome}
                            onChange={(e) => {
                              const newProds = [...novoPedido.produtos];
                              newProds[idx].nome = e.target.value;
                              setNovoPedido({...novoPedido, produtos: newProds});
                            }}
                            className="flex-1 bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Qtd"
                            value={prod.qtd}
                            onChange={(e) => {
                              const newProds = [...novoPedido.produtos];
                              newProds[idx].qtd = e.target.value;
                              setNovoPedido({...novoPedido, produtos: newProds});
                            }}
                            className="w-20 bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Un"
                            value={prod.un}
                            onChange={(e) => {
                              const newProds = [...novoPedido.produtos];
                              newProds[idx].un = e.target.value;
                              setNovoPedido({...novoPedido, produtos: newProds});
                            }}
                            className="w-16 bg-black/50 border border-cyan-900/50 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      ))}
                      <Button 
                        type="button"
                        size="sm" 
                        variant="outline" 
                        className="border-cyan-600 text-cyan-400 w-full"
                        onClick={handleAdicionarProduto}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Adicionar Produto
                      </Button>
                      <p className="text-xs text-gray-500 italic">Adicione todos os produtos do pedido</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button"
                      className="flex-1 bg-cyan-600 hover:bg-cyan-500"
                      onClick={handleCadastrarPedido}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Cadastrar Pedido
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-cyan-900/20 hover:bg-transparent">
                <TableHead className="text-gray-400">ID</TableHead>
                <TableHead className="text-gray-400">Cliente</TableHead>
                <TableHead className="text-gray-400">Origem</TableHead>
                <TableHead className="text-gray-400">Produtos</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Prioridade</TableHead>
                <TableHead className="text-gray-400">Entrega</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders
                .filter(order => !filtroStatus || order.status === filtroStatus)
                .map((order) => {
                const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                const prioInfo = prioridadeConfig[order.prioridade as keyof typeof prioridadeConfig];
                const StatusIcon = statusInfo.icon;

                return (
                  <TableRow key={order.id} className="border-cyan-900/10 hover:bg-cyan-950/20">
                    <TableCell className="font-mono text-cyan-400 font-bold">{order.id}</TableCell>
                    <TableCell className="text-white">{order.cliente}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {order.origem}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {order.produtos.length} item(ns)
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs border', statusInfo.color)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs border', prioInfo.color)}>
                        {prioInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-300">{order.dataEntrega}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {order.status === 'aguardando' && (
                          <Button
                            size="sm"
                            className="text-xs bg-blue-600 hover:bg-blue-500"
                            onClick={() => handleMudarStatus(order.id, 'separacao')}
                          >
                            <Box className="h-3 w-3 mr-1" />
                            Iniciar Separação
                          </Button>
                        )}
                        {order.status === 'separacao' && (
                          <Button
                            size="sm"
                            className="text-xs bg-green-600 hover:bg-green-500"
                            onClick={() => handleMudarStatus(order.id, 'pronto')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Marcar Pronto
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-cyan-600 text-cyan-400 hover:bg-cyan-950"
                          onClick={() => handleGerarRomaneio(order)}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Romaneio
                        </Button>
                        {order.status === 'pronto' && (
                          <Button
                            size="sm"
                            className="text-xs bg-green-600 hover:bg-green-500"
                            onClick={() => handleRegistrarSaida(order.id)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Despachar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RASTREAMENTO */}
      <Card className="bg-gray-900/50 border-cyan-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-cyan-300 font-headline">
            <MapPin />
            Rastreamento de Entregas.
          </CardTitle>
          <CardDescription>Acompanhamento em tempo real.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders
              .filter(o => o.status === 'despachado')
              .map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-cyan-950/20 border border-cyan-900/30 rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-cyan-400 font-bold">{order.id}</span>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                        <Truck className="h-3 w-3 mr-1" />
                        Em Trânsito
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{order.cliente}</p>
                    <p className="text-xs text-gray-500">{order.endereco}</p>
                    {order.rastreio && (
                      <p className="text-xs text-cyan-400 mt-2 font-mono">
                        Rastreio: {order.rastreio}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline" className="border-cyan-600 text-cyan-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    Rastrear
                  </Button>
                </div>
              ))}
          </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ESTOQUE DA EXPEDIÇÃO */}
      {filtroStatus === 'estoque' && (
        <Card className="bg-amber-950/20 border-amber-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-amber-400 font-headline">
                  <Package />
                  Estoque da Expedição.
                </CardTitle>
                <CardDescription>Gerenciamento de itens e lotes despacháveis.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={novoItemEstoqueOpen} onOpenChange={setNovoItemEstoqueOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-500 text-black font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      Cadastrar Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/90 border-amber-500/50 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-amber-400 font-headline">Novo Item no Estoque</DialogTitle>
                      <DialogDescription>Adicione peças prontas ao estoque da expedição.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Código</label>
                        <input type="text" value={formNovoItem.codigo} onChange={e => setFormNovoItem({...formNovoItem, codigo: e.target.value})} className="w-full bg-black/50 border border-amber-900/50 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Descrição do Item</label>
                        <input type="text" value={formNovoItem.item} onChange={e => setFormNovoItem({...formNovoItem, item: e.target.value})} className="w-full bg-black/50 border border-amber-900/50 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400 uppercase">Cor/Acabamento</label>
                          <input type="text" value={formNovoItem.cor} onChange={e => setFormNovoItem({...formNovoItem, cor: e.target.value})} className="w-full bg-black/50 border border-amber-900/50 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400 uppercase">Quantidade</label>
                          <input type="number" min="1" value={formNovoItem.quantidade} onChange={e => setFormNovoItem({...formNovoItem, quantidade: Number(e.target.value)})} className="w-full bg-black/50 border border-amber-900/50 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                        </div>
                      </div>
                      <Button className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold" onClick={handleCadastrarItemEstoque}>Confirmar Cadastro</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={saidaEstoqueOpen} onOpenChange={setSaidaEstoqueOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-amber-600 text-amber-500 hover:bg-amber-950">
                      <Send className="h-4 w-4 mr-2" />
                      Registrar Saída
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/90 border-amber-500/50 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-amber-400 font-headline">Saída do Estoque</DialogTitle>
                      <DialogDescription>Dê baixa em um item do estoque da expedição.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Selecione o Item</label>
                        <select value={formSaida.itemId} onChange={e => setFormSaida({...formSaida, itemId: e.target.value})} className="w-full bg-black/50 border border-amber-900/50 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
                          <option value="">Escolha um item...</option>
                          {estoqueExpedicao.filter(i => i.quantidade > 0).map(i => (
                            <option key={i.id} value={i.id}>{i.codigo} - {i.item} (Disp: {i.quantidade})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Quantidade a remover</label>
                        <input type="number" min="1" value={formSaida.quantidade} onChange={e => setFormSaida({...formSaida, quantidade: Number(e.target.value)})} className="w-full bg-black/50 border border-amber-900/50 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Motivo / OS</label>
                        <input type="text" placeholder="Ex: Despacho direto OP-123" value={formSaida.observacao} onChange={e => setFormSaida({...formSaida, observacao: e.target.value})} className="w-full bg-black/50 border border-amber-900/50 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                      </div>
                      <Button className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold" onClick={handleSaidaEstoque}>Confirmar Saída</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-amber-900/20 hover:bg-transparent">
                  <TableHead className="text-gray-400">Código</TableHead>
                  <TableHead className="text-gray-400">Item</TableHead>
                  <TableHead className="text-gray-400">Cor/Acabamento</TableHead>
                  <TableHead className="text-gray-400 text-center">Quantidade Atual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estoqueExpedicao.map((item) => (
                  <TableRow key={item.id} className="border-amber-900/10 hover:bg-amber-950/20">
                    <TableCell className="font-mono text-amber-500 font-bold">{item.codigo}</TableCell>
                    <TableCell className="text-white font-bold">{item.item}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {item.cor}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-black text-amber-400">{item.quantidade}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* DIALOG ROMANEIO */}
      <Dialog open={romaneioDialogOpen} onOpenChange={setRomaneioDialogOpen}>
        <DialogContent className="bg-black/90 border-cyan-500/50 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 font-headline flex items-center gap-2">
              <FileText />
              Romaneio de Expedição
            </DialogTitle>
            <DialogDescription>Documento gerado automaticamente pelo Nexus.</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Pedido/OP</p>
                  <p className="font-mono text-cyan-400 font-bold">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Origem</p>
                  <p className="text-white">{selectedOrder.origem}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Cliente</p>
                  <p className="text-white">{selectedOrder.cliente}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Data Entrega</p>
                  <p className="text-white">{selectedOrder.dataEntrega}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 uppercase mb-2">Endereço de Entrega</p>
                <p className="text-white">{selectedOrder.endereco}</p>
              </div>

              <div className="border border-cyan-900/30 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-cyan-950/30 border-cyan-900/20">
                      <TableHead className="text-cyan-400">Produto</TableHead>
                      <TableHead className="text-cyan-400 text-center">Quantidade</TableHead>
                      <TableHead className="text-cyan-400 text-center">Unidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.produtos.map((prod: any, idx: number) => (
                      <TableRow key={idx} className="border-cyan-900/10">
                        <TableCell className="text-white">{prod.nome}</TableCell>
                        <TableCell className="text-center text-cyan-400 font-mono font-bold">
                          {prod.qtd}
                        </TableCell>
                        <TableCell className="text-center text-gray-400">{prod.un}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500"
                  onClick={handleImprimirRomaneio}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Romaneio
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-500"
                  onClick={() => {
                    handleRegistrarSaida(selectedOrder.id);
                    setRomaneioDialogOpen(false);
                  }}
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Confirmar Separação
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <LegalSafeguard module="NEXUS EXPEDIÇÃO" protocol="NX-7742-EXP" />
      </div>
    </SovereignShowcase>
  );
}
