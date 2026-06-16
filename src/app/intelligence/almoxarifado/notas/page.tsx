'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, FileText, Plus, ExternalLink, Image as ImageIcon, Truck, Calculator, Calendar, Trash2, CheckCircle } from 'lucide-react';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { useNotasFiscais, type NotaFiscal } from '@/lib/almoxarifado/nf-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function ArquivoNotasFiscaisPage() {
  const { notas, salvarNota, excluirNota } = useNotasFiscais();
  const [busca, setBusca] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [notaAtiva, setNotaAtiva] = useState<NotaFiscal | null>(null);
  
  const [novoModalOpen, setNovoModalOpen] = useState(false);
  const [form, setForm] = useState({
    numero: '', fornecedor: '', valorTotal: '', transportadora: '', impostos: '', dataEmissao: '', imagemUrl: ''
  });

  const notasFiltradas = useMemo(() => {
    if (!busca) return notas;
    const t = busca.toLowerCase();
    return notas.filter(n => 
      n.numero.toLowerCase().includes(t) || 
      n.fornecedor.toLowerCase().includes(t) ||
      n.transportadora.toLowerCase().includes(t)
    );
  }, [notas, busca]);

  const abrirVisualizador = (nota: NotaFiscal) => {
    setNotaAtiva(nota);
    setModalOpen(true);
  };

  const salvarNovaNota = () => {
    if (!form.numero || !form.fornecedor || !form.valorTotal) return;
    salvarNota({
      numero: form.numero,
      fornecedor: form.fornecedor,
      valorTotal: parseFloat(form.valorTotal.replace(',', '.')),
      transportadora: form.transportadora,
      impostos: form.impostos,
      dataEmissao: form.dataEmissao || new Date().toISOString().split('T')[0],
      imagemUrl: form.imagemUrl || "https://i.postimg.cc/85zK2hZJ/Nexus-Empresas-black.png"
    });
    setNovoModalOpen(false);
    setForm({ numero: '', fornecedor: '', valorTotal: '', transportadora: '', impostos: '', dataEmissao: '', imagemUrl: '' });
  };

  return (
    <SovereignShowcase moduleName="Nexus GED Fiscal" imagePath="/Nexus Empresas/Dante Almoxarifado.png">
      <div className="min-h-screen bg-black text-white p-6 space-y-12 font-sans selection:bg-emerald-500/30">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-8 gap-4">
          <div className="flex items-center gap-6">
            <Link href="/intelligence/almoxarifado">
              <div className="h-12 w-12 rounded-full border border-white/10 bg-black/50 flex items-center justify-center hover:bg-white/5 hover:scale-110 transition-all cursor-pointer group">
                <ArrowLeft className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </Link>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                  Arquivo Digital de NFs
                </span>
              </h1>
              <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">
                Consulta e Visualização de Notas Fiscais e DANFEs Originais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500/50" />
              <Input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Busque pelo número da nota (ex: nf1234)..."
                className="w-full bg-emerald-950/20 border-emerald-500/30 text-emerald-100 placeholder:text-emerald-500/50 pl-12 h-12 rounded-2xl focus-visible:ring-emerald-500/50 uppercase"
              />
            </div>
            <Button 
              onClick={() => setNovoModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white h-12 px-6 rounded-2xl font-black tracking-widest uppercase shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="h-5 w-5 mr-2" /> Anexar NF
            </Button>
          </div>
        </div>

        {/* GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notasFiltradas.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-emerald-500/20 rounded-[40px] bg-emerald-950/10">
              <FileText className="h-16 w-16 mx-auto text-emerald-500/20 mb-4" />
              <p className="text-emerald-500/50 font-bold tracking-widest uppercase">Nenhuma Nota Fiscal Encontrada.</p>
            </div>
          )}

          {notasFiltradas.map(nota => (
            <div 
              key={nota.id}
              onClick={() => abrirVisualizador(nota)}
              className="group relative bg-zinc-950/60 border border-emerald-500/10 hover:border-emerald-500/40 rounded-[30px] p-6 cursor-pointer transition-all hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)] hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all">
                <FileText className="h-24 w-24 text-emerald-500" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm font-black uppercase tracking-wider">
                    {nota.numero}
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-black/40 px-2 py-1 rounded-md border border-white/5">
                    {nota.dataEmissao}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white line-clamp-1">{nota.fornecedor}</h3>
                  <div className="flex items-center gap-2 mt-2 text-emerald-400/80">
                    <Calculator className="h-4 w-4" />
                    <span className="font-bold tracking-wider">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nota.valorTotal)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-500/10 grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                   <div className="flex items-center gap-2">
                     <Truck className="h-3 w-3 text-emerald-500/50" />
                     <span className="truncate" title={nota.transportadora}>{nota.transportadora || '-'}</span>
                   </div>
                   <div className="flex items-center gap-2 justify-end group-hover:text-emerald-400 transition-colors">
                     <ExternalLink className="h-3 w-3" />
                     Abrir DANFE
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LegalSafeguard module="GED FISCAL INTELIGENTE" protocol="NX-DOC-99" />

      {/* MODAL VISUALIZADOR DE DANFE */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-zinc-950 border-emerald-500/30 text-white max-w-7xl w-[95vw] h-[90vh] rounded-[40px] p-0 overflow-hidden flex flex-col lg:flex-row shadow-[0_0_150px_rgba(16,185,129,0.15)]">
          {notaAtiva && (
            <>
              {/* Lado Esquerdo: Metadados da Nota */}
              <div className="w-full lg:w-1/3 bg-black/80 p-8 border-r border-emerald-500/20 flex flex-col h-full overflow-y-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">DANFE Original</h2>
                  <p className="text-emerald-400 font-mono text-xl font-black mt-2 tracking-widest">{notaAtiva.numero}</p>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/60 font-black">Fornecedor</Label>
                    <p className="text-lg font-black uppercase text-white">{notaAtiva.fornecedor}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/60 font-black flex items-center gap-2"><Calculator className="h-3 w-3" /> Valor Total</Label>
                    <p className="text-3xl font-black text-emerald-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(notaAtiva.valorTotal)}
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black flex items-center gap-2"><Truck className="h-3 w-3" /> Transportadora</Label>
                      <p className="text-sm font-bold text-gray-300 uppercase">{notaAtiva.transportadora || 'NÃO INFORMADA'}</p>
                    </div>
                    <div className="space-y-1 pt-3 border-t border-emerald-500/10">
                      <Label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black">Impostos Relacionados</Label>
                      <p className="text-sm font-bold text-gray-300 uppercase leading-relaxed">{notaAtiva.impostos || 'ISENTO'}</p>
                    </div>
                    <div className="space-y-1 pt-3 border-t border-emerald-500/10">
                      <Label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black flex items-center gap-2"><Calendar className="h-3 w-3" /> Data Emissão</Label>
                      <p className="text-sm font-bold text-gray-300 uppercase">{notaAtiva.dataEmissao}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="destructive" 
                  className="w-full mt-6 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-400 border border-rose-500/20 font-black tracking-widest uppercase rounded-xl"
                  onClick={() => {
                    if(confirm('Tem certeza que deseja excluir este documento?')) {
                      excluirNota(notaAtiva.id);
                      setModalOpen(false);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir Arquivo
                </Button>
              </div>

              {/* Lado Direito: Scanner da Imagem */}
              <div className="w-full lg:w-2/3 bg-zinc-900/80 relative flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_70%)]"></div>
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                
                <div className="relative z-10 w-[90%] h-[90%] bg-white rounded-xl shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 flex items-center justify-center border-4 border-black/50">
                   {notaAtiva.imagemUrl ? (
                     <img src={notaAtiva.imagemUrl} alt="Scanner NF" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
                   ) : (
                     <div className="text-center space-y-4">
                       <ImageIcon className="h-24 w-24 text-gray-200 mx-auto" />
                       <p className="text-gray-400 font-black uppercase tracking-widest">Scanner Não Anexado</p>
                     </div>
                   )}
                </div>

                <div className="absolute top-6 right-6 flex gap-2">
                   <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-black uppercase tracking-widest px-4 py-1">
                     <CheckCircle className="h-3 w-3 mr-2" />
                     Documento Autenticado
                   </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL NOVA NOTA */}
      <Dialog open={novoModalOpen} onOpenChange={setNovoModalOpen}>
        <DialogContent className="bg-zinc-950 border-emerald-500/30 text-white max-w-xl rounded-[40px] p-8 shadow-[0_0_100px_rgba(16,185,129,0.1)]">
          <DialogHeader className="mb-6">
             <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-emerald-400 flex items-center gap-3">
               <Plus className="h-6 w-6" /> Anexar Nova NF
             </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Número NF</Label>
                 <Input value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} placeholder="Ex: NF1234" className="bg-black/40 border-emerald-500/20 text-white font-mono uppercase" />
               </div>
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Valor Total (R$)</Label>
                 <Input value={form.valorTotal} onChange={e => setForm({...form, valorTotal: e.target.value})} placeholder="Ex: 195000.00" type="number" className="bg-black/40 border-emerald-500/20 text-emerald-400 font-black" />
               </div>
             </div>

             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Fornecedor</Label>
               <Input value={form.fornecedor} onChange={e => setForm({...form, fornecedor: e.target.value})} placeholder="Razão Social" className="bg-black/40 border-emerald-500/20 text-white uppercase" />
             </div>

             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Transportadora</Label>
               <Input value={form.transportadora} onChange={e => setForm({...form, transportadora: e.target.value})} placeholder="Nome da Logística" className="bg-black/40 border-emerald-500/20 text-white uppercase" />
             </div>

             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Impostos (ICMS, IPI, etc)</Label>
               <Input value={form.impostos} onChange={e => setForm({...form, impostos: e.target.value})} placeholder="Ex: ICMS: 18%, IPI: 5%" className="bg-black/40 border-emerald-500/20 text-white uppercase" />
             </div>

             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">URL do Scanner (Imagem)</Label>
               <Input value={form.imagemUrl} onChange={e => setForm({...form, imagemUrl: e.target.value})} placeholder="https://..." className="bg-black/40 border-emerald-500/20 text-gray-400 font-mono text-xs" />
             </div>
          </div>

          <DialogFooter className="mt-8">
            <Button variant="ghost" onClick={() => setNovoModalOpen(false)} className="text-gray-400 hover:text-white uppercase font-black tracking-widest text-[10px]">Cancelar</Button>
            <Button onClick={salvarNovaNota} className="bg-emerald-600 hover:bg-emerald-500 text-white uppercase font-black tracking-widest text-[10px] rounded-xl px-8">Salvar no Arquivo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SovereignShowcase>
  );
}
