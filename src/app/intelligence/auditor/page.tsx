'use client';

import React, { useState } from 'react';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Activity, FileText, Plus } from 'lucide-react';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const mockRegras = [
  { id: '1', modulo: 'COMPRAS', nome: 'Divergência de Preço', condicao: 'Preço > 10% da média', acao: 'Alerta' },
  { id: '2', modulo: 'PPCP', nome: 'Início sem Saldo', condicao: 'OP iniciada sem material', acao: 'Bloqueio' },
  { id: '3', modulo: 'EXPEDIÇÃO', nome: 'Despacho sem OP', condicao: 'Saída manual sem vínculo', acao: 'Alerta' },
  { id: '4', modulo: 'VENDAS', nome: 'Desconto Excessivo', condicao: 'Desconto > 15%', acao: 'Bloqueio' },
  { id: '5', modulo: 'ALMOXARIFADO', nome: 'Ajuste Manual de Saldo', condicao: 'Movimentação sem OP/NF', acao: 'Alerta' },
  { id: '6', modulo: 'FINANCEIRO', nome: 'Pagamento sem NF', condicao: 'Liberação de pgto sem vínculo XML', acao: 'Bloqueio' },
  { id: '7', modulo: 'RH', nome: 'Hora Extra Não Prevista', condicao: 'Banco de horas estourando cota 10h', acao: 'Alerta' },
  { id: '8', modulo: 'ENGENHARIA', nome: 'Alteração de Ficha Técnica', condicao: 'Mudança de componente sem revisão', acao: 'Bloqueio' },
  { id: '9', modulo: 'SEGURANÇA', nome: 'Compra Prematura de EPI', condicao: 'Solicitação de compra antes do estoque mínimo', acao: 'Bloqueio' },
];

const mockDesvios = [
  { id: 'D1', datahora: '14:32 - 08/06/2026', modulo: 'COMPRAS', regra: 'Divergência de Preço', detalhe: 'Fornecedor (Metalúrgica Sul) com preço 12% acima da média de mercado.', status: 'Pendente' },
  { id: 'D2', datahora: '13:15 - 08/06/2026', modulo: 'PPCP', regra: 'Início sem Saldo', detalhe: 'Tentativa de iniciar OP-1234 sem saldo de Chapa de Aço no Almoxarifado.', status: 'Bloqueado' },
  { id: 'D3', datahora: '11:10 - 08/06/2026', modulo: 'EXPEDIÇÃO', regra: 'Despacho sem OP', detalhe: 'Saída manual de 50un do item PAR-444 sem romaneio vinculado.', status: 'Pendente' },
  { id: 'D4', datahora: '10:42 - 08/06/2026', modulo: 'VENDAS', regra: 'Desconto Excessivo', detalhe: 'Vendedor aplicou 18% de desconto no Ped-089 (limite é 15%).', status: 'Bloqueado' },
  { id: 'D5', datahora: '09:45 - 08/06/2026', modulo: 'ALMOXARIFADO', regra: 'Ajuste Manual de Saldo', detalhe: 'Adição de 120kg de resina ao estoque de matéria prima por [Usuário: almoxarifado_02].', status: 'Em Análise' },
  { id: 'D6', datahora: '09:12 - 08/06/2026', modulo: 'FINANCEIRO', regra: 'Pagamento sem NF', detalhe: 'Tentativa de baixa no contas a pagar R$ 4.500 sem XML de nota fiscal anexado.', status: 'Bloqueado' },
  { id: 'D7', datahora: '08:05 - 08/06/2026', modulo: 'RH', regra: 'Hora Extra Não Prevista', detalhe: 'Célula de Usinagem: 4 operadores ultrapassaram 10h mensais de banco de horas.', status: 'Pendente' },
  { id: 'D8', datahora: '07:30 - 08/06/2026', modulo: 'ENGENHARIA', regra: 'Alteração de Ficha Técnica', detalhe: 'Substituição do Componente X pelo Componente Y na BOM do Produto Alpha sem revisão.', status: 'Bloqueado' },
  { id: 'D9', datahora: '07:15 - 08/06/2026', modulo: 'SEGURANÇA', regra: 'Compra Prematura de EPI', detalhe: 'Requisição de 500 pares de luvas enquanto saldo atual (800) atende 4 meses.', status: 'Bloqueado' },
];

const mockEconomias = [
  { id: 'E1', modulo: 'ESTOQUE', acao: 'Diminuição de Estoque', impacto: 'Bloqueio de compras prematuras (EPIs/Insumos) forçando giro de estoque atual', valor: 'R$ 5.200,00' },
  { id: 'E2', modulo: 'VENDAS', acao: 'Política de Parcelamento', impacto: 'Bloqueio de vendas longas s/ juros, enquadrando máx 3x c/ entrada (Fluxo de Caixa)', valor: 'R$ 4.800,00' },
  { id: 'E3', modulo: 'PPCP / QUALIDADE', acao: 'Queda de Retrabalho (8%)', impacto: 'Corte de desvios no apontamento de OP e revisões rígidas da Ficha Técnica', valor: 'R$ 4.500,00' },
];

export default function NexusAuditorPage() {
  const { toast } = useToast();
  const [filtroMenu, setFiltroMenu] = useState<string | null>(null);
  const [regras, setRegras] = useState(mockRegras);
  const [novaRegraOpen, setNovaRegraOpen] = useState(false);
  const [formRegra, setFormRegra] = useState({ modulo: 'COMPRAS', nome: '', condicao: '', acao: 'Alerta' });

  const handleCadastrarRegra = () => {
    if (!formRegra.nome || !formRegra.condicao) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha Nome e Condição.', variant: 'destructive' });
      return;
    }
    const nova = { id: Date.now().toString(), ...formRegra };
    setRegras([nova, ...regras]);
    toast({ title: 'Regra Ativada', description: `A regra ${nova.nome} já está monitorando o módulo ${nova.modulo}.` });
    setNovaRegraOpen(false);
    setFormRegra({ modulo: 'COMPRAS', nome: '', condicao: '', acao: 'Alerta' });
  };

  return (
    <SovereignShowcase moduleName="Módulo Auditor" imagePath="/Nexus Empresas/Dante Auditor.png">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="text-emerald-400 border-emerald-500/50 hover:bg-emerald-950/50"
            onClick={() => window.history.back()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
            Voltar
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold tracking-tighter font-headline text-emerald-400 uppercase">
              Dashboard Nexus Auditor.
            </h1>
            <p className="text-lg text-gray-400">
              Auditoria Inteligente de Processos e Decisões em Tempo Real.
            </p>
          </div>
          <div className="w-[100px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            className="bg-emerald-900/20 border-emerald-700/50 cursor-pointer hover:bg-emerald-900/30 transition-all relative"
            onClick={() => setFiltroMenu(filtroMenu === 'processos' ? null : 'processos')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Processos Auditados
                {filtroMenu === 'processos' && <Badge className="absolute top-4 right-4 bg-emerald-500 text-black text-xs">Ativo</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{regras.length}</p>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-yellow-900/20 border-yellow-700/50 cursor-pointer hover:bg-yellow-900/30 transition-all relative"
            onClick={() => setFiltroMenu(filtroMenu === 'desvios' ? null : 'desvios')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Desvios Detectados
                {filtroMenu === 'desvios' && <Badge className="absolute top-4 right-4 bg-yellow-500 text-black text-xs">Ativo</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{mockDesvios.length}</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-green-900/20 border-green-700/50 cursor-pointer hover:bg-green-900/30 transition-all relative"
            onClick={() => setFiltroMenu(filtroMenu === 'bloqueados' ? null : 'bloqueados')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Bloqueados pela IA
                {filtroMenu === 'bloqueados' && <Badge className="absolute top-4 right-4 bg-green-500 text-black text-xs">Ativo</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{mockDesvios.filter(d => d.status === 'Bloqueado').length}</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-cyan-900/20 border-cyan-700/50 cursor-pointer hover:bg-cyan-900/30 transition-all relative"
            onClick={() => setFiltroMenu(filtroMenu === 'economia' ? null : 'economia')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Economia Retida
                {filtroMenu === 'economia' && <Badge className="absolute top-4 right-4 bg-cyan-500 text-black text-xs">Ativo</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">R$ 14.500</p>
            </CardContent>
          </Card>
        </div>

        {/* MENU: PROCESSOS AUDITADOS */}
        {filtroMenu === 'processos' && (
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-emerald-400 font-headline">
                    <Shield />
                    Processos Auditados pela IA
                  </CardTitle>
                  <CardDescription>Gerenciamento das regras ativas que a inteligência artificial monitora 24/7.</CardDescription>
                </div>
                <Dialog open={novaRegraOpen} onOpenChange={setNovaRegraOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold">
                      <Plus className="mr-2 h-4 w-4" />
                      Cadastrar Regra
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/90 border-emerald-500/50 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-emerald-400 font-headline">Nova Regra de Auditoria</DialogTitle>
                      <DialogDescription>Defina uma condição para a IA monitorar e agir automaticamente.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Módulo Alvo</label>
                        <select value={formRegra.modulo} onChange={e => setFormRegra({...formRegra, modulo: e.target.value})} className="w-full bg-black/50 border border-emerald-900/50 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                          <option value="COMPRAS">Compras</option>
                          <option value="VENDAS">Vendas</option>
                          <option value="PPCP">PPCP</option>
                          <option value="EXPEDIÇÃO">Expedição</option>
                          <option value="ALMOXARIFADO">Almoxarifado / Estoque</option>
                          <option value="FINANCEIRO">Financeiro / Faturamento</option>
                          <option value="ENGENHARIA">Engenharia & Qualidade</option>
                          <option value="RH">RH / Departamento Pessoal</option>
                          <option value="SEGURANÇA">Segurança de Trabalho / EPIs</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Nome da Regra</label>
                        <input type="text" placeholder="Ex: Desconto Excessivo" value={formRegra.nome} onChange={e => setFormRegra({...formRegra, nome: e.target.value})} className="w-full bg-black/50 border border-emerald-900/50 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Condição de Disparo (Trigger)</label>
                        <input type="text" placeholder="Ex: Desconto maior que 15%" value={formRegra.condicao} onChange={e => setFormRegra({...formRegra, condicao: e.target.value})} className="w-full bg-black/50 border border-emerald-900/50 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase">Ação da IA</label>
                        <select value={formRegra.acao} onChange={e => setFormRegra({...formRegra, acao: e.target.value})} className="w-full bg-black/50 border border-emerald-900/50 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                          <option value="Alerta">⚠️ Gerar Alerta no Log</option>
                          <option value="Bloqueio">🛑 Bloquear Ação e Exigir Senha</option>
                        </select>
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold" onClick={handleCadastrarRegra}>Ativar Regra</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-emerald-900/20 hover:bg-transparent">
                    <TableHead className="text-gray-400">Módulo</TableHead>
                    <TableHead className="text-gray-400">Regra</TableHead>
                    <TableHead className="text-gray-400">Condição Monitorada</TableHead>
                    <TableHead className="text-gray-400">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regras.map((regra) => (
                    <TableRow key={regra.id} className="border-emerald-900/10 hover:bg-emerald-950/20">
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-emerald-900 text-emerald-400">
                          {regra.modulo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-bold">{regra.nome}</TableCell>
                      <TableCell className="text-slate-400 text-sm">{regra.condicao}</TableCell>
                      <TableCell>
                        <Badge className={regra.acao === 'Bloqueio' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                          {regra.acao}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* MENU: DESVIOS DETECTADOS */}
        {filtroMenu === 'desvios' && (
          <Card className="bg-yellow-950/20 border-yellow-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-yellow-400 font-headline">
                <AlertTriangle />
                Registro de Desvios Analisados pela IA
              </CardTitle>
              <CardDescription>Eventos classificados como "Alerta" que necessitam de intervenção ou análise humana.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-yellow-900/20 hover:bg-transparent">
                    <TableHead className="text-gray-400 w-32">Data/Hora</TableHead>
                    <TableHead className="text-gray-400">Módulo</TableHead>
                    <TableHead className="text-gray-400">Regra Violada</TableHead>
                    <TableHead className="text-gray-400">Detalhe do Ocorrido</TableHead>
                    <TableHead className="text-gray-400">Ação / Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDesvios.map((desvio) => (
                    <TableRow key={desvio.id} className="border-yellow-900/10 hover:bg-yellow-950/30">
                      <TableCell className="font-mono text-[10px] text-gray-500">{desvio.datahora}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-yellow-900 text-yellow-500">
                          {desvio.modulo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-bold">{desvio.regra}</TableCell>
                      <TableCell className="text-slate-400 text-xs">{desvio.detalhe}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 font-normal">
                            {desvio.status}
                          </Badge>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* MENU: BLOQUEADOS PELA IA */}
        {filtroMenu === 'bloqueados' && (
          <Card className="bg-green-950/20 border-green-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-400 font-headline">
                <CheckCircle />
                Ações Bloqueadas pela IA
              </CardTitle>
              <CardDescription>Eventos classificados como risco alto e que foram barrados proativamente pela inteligência.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-green-900/20 hover:bg-transparent">
                    <TableHead className="text-gray-400 w-32">Data/Hora</TableHead>
                    <TableHead className="text-gray-400">Módulo</TableHead>
                    <TableHead className="text-gray-400">Regra Violada</TableHead>
                    <TableHead className="text-gray-400">Motivo do Bloqueio</TableHead>
                    <TableHead className="text-gray-400">Intervenção</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDesvios.filter(d => d.status === 'Bloqueado').map((desvio) => (
                    <TableRow key={desvio.id} className="border-green-900/10 hover:bg-green-950/30">
                      <TableCell className="font-mono text-[10px] text-gray-500">{desvio.datahora}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-green-900 text-green-500">
                          {desvio.modulo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-bold">{desvio.regra}</TableCell>
                      <TableCell className="text-slate-400 text-xs">{desvio.detalhe}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 font-normal">
                            Bloqueado
                          </Badge>
                          <Button size="sm" variant="outline" className="h-6 text-[10px] border-green-700 text-green-400 hover:bg-green-900/50">
                            Autorizar c/ Senha
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* MENU: ECONOMIA RETIDA */}
        {filtroMenu === 'economia' && (
          <Card className="bg-cyan-950/20 border-cyan-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-cyan-400 font-headline">
                <Activity />
                Composição de Economia Retida Mensal
              </CardTitle>
              <CardDescription>O valor financeiro estimado que o Auditor salvou ao prevenir vazamentos nos processos industriais.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-cyan-900/20 hover:bg-transparent">
                    <TableHead className="text-gray-400 w-32">Setor</TableHead>
                    <TableHead className="text-gray-400">Pilar de Economia</TableHead>
                    <TableHead className="text-gray-400">Impacto Gerado pela IA</TableHead>
                    <TableHead className="text-gray-400 text-right">Valor Estimado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEconomias.map((econ) => (
                    <TableRow key={econ.id} className="border-cyan-900/10 hover:bg-cyan-950/30">
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-cyan-900 text-cyan-500">
                          {econ.modulo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-bold">{econ.acao}</TableCell>
                      <TableCell className="text-slate-400 text-xs">{econ.impacto}</TableCell>
                      <TableCell className="text-right font-mono text-cyan-400 font-bold">{econ.valor}</TableCell>
                    </TableRow>
                  ))}
                  {/* Linha de Total */}
                  <TableRow className="border-t-2 border-cyan-700/50 hover:bg-transparent">
                    <TableCell colSpan={3} className="text-right text-white font-bold uppercase tracking-widest text-sm">Total Retido (Mês Atual)</TableCell>
                    <TableCell className="text-right font-mono text-2xl text-cyan-400 font-black">R$ 14.500,00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {filtroMenu !== 'processos' && filtroMenu !== 'desvios' && filtroMenu !== 'bloqueados' && filtroMenu !== 'economia' && (
          <Card className="bg-gray-900/50 border-emerald-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-300 font-headline">
              <FileText />
              Logs de Auditoria Recentes.
            </CardTitle>
            <CardDescription>Eventos críticos bloqueados ou alertados pelo sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-950/20 border border-yellow-900/30 rounded-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">ALERTA</Badge>
                    <span className="font-mono text-gray-400 text-xs">14:32 - 08/06/2026</span>
                  </div>
                  <p className="text-sm text-white font-bold">Divergência em Cotação de Compras</p>
                  <p className="text-xs text-gray-500">Fornecedor escolhido (Metalúrgica Sul) é 12% mais caro que a média do mercado para o item PAR-444.</p>
                </div>
                <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-400">Ver Detalhes</Button>
              </div>

              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">BLOQUEADO</Badge>
                    <span className="font-mono text-gray-400 text-xs">10:15 - 08/06/2026</span>
                  </div>
                  <p className="text-sm text-white font-bold">Liberação de OP sem Saldo em Estoque</p>
                  <p className="text-xs text-gray-500">A OP-1234 tentou ser iniciada no PPCP sem o saldo necessário de Chapa de Aço (Falta 5 un).</p>
                </div>
                <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-400">Ver Detalhes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        <LegalSafeguard module="NEXUS AUDITOR" protocol="NX-8850-AUD" />
      </div>
    </SovereignShowcase>
  );
}
