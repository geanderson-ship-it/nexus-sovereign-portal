'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, Trash2, Package, Search, X, Edit2, Upload, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LegalSafeguard } from '@/components/nexus/LegalSafeguard';
import { useVendas, type Produto, type MaterialProduto } from '@/lib/vendas/store';

const materialVazio = (): MaterialProduto => ({
  id: crypto.randomUUID(), descricao: '', quantidade: 0, unidade: 'UN',
});

const produtoVazio = (): Omit<Produto, 'id'> => ({
  codigo: '', nome: '', descricao: '', imagem: '', preco: 0, unidade: 'UN', materiais: [materialVazio()], ativo: true,
});

const PLACEHOLDER_IMG = 'https://i.postimg.cc/658CJQzk/Nexus-Empresas-prata.png';

// Auxiliar para separar por vírgula/ponto-e-vírgula respeitando aspas
function parseCSVLine(line: string, separator: string): string[] {
  const parts: string[] = [];
  let inQuotes = false;
  let current = '';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);
  
  return parts.map(p => p.replace(/^"|"$/g, '').trim());
}

function parseCSV(text: string): Omit<Produto, 'id'>[] {
  const lines = text.split('\n');
  const result: Omit<Produto, 'id'>[] = [];
  
  if (lines.length <= 1) return [];
  
  const headerLine = lines[0];
  const separator = headerLine.includes(';') ? ';' : ',';
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = parseCSVLine(line, separator);
    if (parts.length < 2) continue;
    
    const codigo = parts[0]?.trim() || '';
    const nome = parts[1]?.trim() || '';
    const descricao = parts[2]?.trim() || '';
    const preco = parseFloat(parts[3]?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    const unidade = parts[4]?.trim() || 'UN';
    
    if (codigo && nome) {
      result.push({
        codigo: codigo.toUpperCase(),
        nome,
        descricao,
        preco,
        unidade: unidade.toUpperCase(),
        imagem: '',
        ativo: true,
        materiais: []
      });
    }
  }
  return result;
}

function exportToCSV(produtosList: Produto[]) {
  const headers = ['Codigo', 'Nome', 'Descricao', 'Preco', 'Unidade'];
  const separator = ';';
  
  const rows = produtosList.map(p => [
    `"${p.codigo.replace(/"/g, '""')}"`,
    `"${p.nome.replace(/"/g, '""')}"`,
    `"${p.descricao.replace(/"/g, '""')}"`,
    p.preco.toString().replace('.', ','),
    `"${p.unidade.replace(/"/g, '""')}"`
  ]);
  
  const csvContent = [
    headers.join(separator),
    ...rows.map(r => r.join(separator))
  ].join('\r\n');
  
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'catalogo-produtos-nexus.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function CatalogoPage() {
  const { produtos, salvarProduto, excluirProduto, importarProdutos, restaurarPadroes } = useVendas();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<string | undefined>();
  const [form, setForm] = useState(produtoVazio());
  const [busca, setBusca] = useState('');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const importados = parseCSV(text);
        if (importados.length === 0) {
          alert("Nenhum produto válido encontrado no arquivo. Verifique se as colunas estão corretas.");
          return;
        }
        
        const substituir = confirm(`Encontrados ${importados.length} produtos. Deseja substituir todo o catálogo atual por estes novos produtos?\n\n(Se escolher "Cancelar", os novos produtos serão mesclados com o catálogo existente)`);
        
        if (substituir) {
          importarProdutos(importados.map(p => ({ id: crypto.randomUUID(), ...p })));
        } else {
          const novosProdutos = [...produtos];
          importados.forEach(imp => {
            const index = novosProdutos.findIndex(p => p.codigo === imp.codigo);
            if (index !== -1) {
              novosProdutos[index] = { ...novosProdutos[index], ...imp };
            } else {
              novosProdutos.push({ id: crypto.randomUUID(), ...imp });
            }
          });
          importarProdutos(novosProdutos);
        }
        alert("Planilha importada com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao ler planilha. Certifique-se de que o arquivo está no formato CSV correto.");
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  const handleExportCSV = () => {
    exportToCSV(produtos);
  };

  const handleRestaurar = () => {
    if (confirm("Deseja mesmo redefinir o catálogo para as esquadrias padrão da Nexus? Todas as suas alterações locais serão apagadas.")) {
      restaurarPadroes();
    }
  };

  const abrirNovo = () => {
    setEditandoId(undefined);
    setForm(produtoVazio());
    setDialogOpen(true);
  };

  const abrirEditar = (p: Produto) => {
    setEditandoId(p.id);
    setForm({ codigo: p.codigo, nome: p.nome, descricao: p.descricao, imagem: p.imagem, preco: p.preco, unidade: p.unidade, materiais: p.materiais, ativo: p.ativo });
    setDialogOpen(true);
  };

  const salvar = () => {
    if (!form.codigo || !form.nome) return;
    salvarProduto({ ...form, materiais: form.materiais.filter(m => m.descricao.trim() !== '') }, editandoId);
    setDialogOpen(false);
  };

  const addMaterial = () => setForm(p => ({ ...p, materiais: [...p.materiais, materialVazio()] }));
  const removeMaterial = (id: string) => setForm(p => ({ ...p, materiais: p.materiais.filter(m => m.id !== id) }));
  const updateMaterial = (id: string, field: keyof MaterialProduto, value: string | number) =>
    setForm(p => ({ ...p, materiais: p.materiais.map(m => m.id === id ? { ...m, [field]: value } : m) }));

  const produtosFiltrados = busca.trim()
    ? produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.toLowerCase().includes(busca.toLowerCase()))
    : produtos;

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8 font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-blue-500/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/intelligence/vendas">
            <div className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
              <ArrowLeft className="h-5 w-5 text-blue-400" />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight text-blue-400 font-headline italic">Catálogo de Produtos</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest italic">{produtos.length} produto(s) cadastrado(s)</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest h-10 px-6 rounded-xl text-[11px]" onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      {/* PAINEL DE BANCO DE DADOS (CSV) */}
      <div className="bg-zinc-950/40 border border-blue-500/10 rounded-[24px] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Banco de Dados do Catálogo</h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
            Importe planilhas Excel (.csv) para alimentar o catálogo ou salve backups locais.
            <span className="text-blue-500/70 block mt-0.5 font-mono">Colunas: Codigo; Nome; Descricao; Preco; Unidade (Separador: ponto-e-vírgula ';')</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-end">
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImportCSV} />
          <Button variant="outline" size="sm" className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 h-9 text-[10px] font-black uppercase rounded-lg" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Anexar Planilha (CSV)
          </Button>
          <Button variant="outline" size="sm" className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 h-9 text-[10px] font-black uppercase rounded-lg" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Exportar Planilha
          </Button>
          <Button variant="outline" size="sm" className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 h-9 text-[10px] font-black uppercase rounded-lg" onClick={handleRestaurar}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Restaurar Padrões
          </Button>
        </div>
      </div>

      {/* BUSCA */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input placeholder="Pesquisar produto..." value={busca} onChange={e => setBusca(e.target.value)}
          className="bg-zinc-950/60 border-white/10 text-white h-11 rounded-2xl pl-11 pr-10 text-sm" />
        {busca && <button onClick={() => setBusca('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X className="h-4 w-4" /></button>}
      </div>

      {/* GRID DE PRODUTOS */}
      {produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border-2 border-dashed border-blue-500/20 rounded-[32px]">
          <Package className="h-16 w-16 text-blue-500/30" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Catálogo vazio.</p>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase" onClick={abrirNovo}>
            <Plus className="mr-2 h-4 w-4" /> Cadastrar Primeiro Produto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {produtosFiltrados.map(produto => (
            <div key={produto.id} className="rounded-[24px] border border-blue-500/20 bg-zinc-950/60 overflow-hidden group hover:border-blue-500/40 transition-all">
              {/* IMAGEM */}
              <div className="relative h-40 bg-zinc-900 flex items-center justify-center overflow-hidden">
                {produto.imagem ? (
                  <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <img src={PLACEHOLDER_IMG} alt="Nexus" className="w-full h-full object-contain p-6 opacity-30" />
                )}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest">{produto.codigo}</Badge>
                </div>
              </div>

              {/* INFO */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-white font-black uppercase text-sm tracking-tight">{produto.nome}</h3>
                  {produto.descricao && <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{produto.descricao}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-black text-lg">{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <Badge className="bg-white/5 text-gray-400 border-white/10 text-[9px]">{produto.materiais.length} mat.</Badge>
                </div>
                <div className="flex gap-2 pt-1 border-t border-white/5">
                  <Button size="sm" variant="ghost" className="flex-1 text-blue-400 hover:bg-blue-500/10 h-7 text-[10px] font-black uppercase" onClick={() => abrirEditar(produto)}>
                    <Edit2 className="h-3 w-3 mr-1" /> Editar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-7 w-7 p-0" onClick={() => excluirProduto(produto.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <LegalSafeguard module="VENDAS — CATÁLOGO" protocol="NX-7741-CAT" />

      {/* DIALOG CADASTRO */}
      <Dialog open={dialogOpen} onOpenChange={o => !o && setDialogOpen(false)}>
        <DialogContent className="bg-zinc-950 border-blue-500/30 text-white max-w-3xl max-h-[90vh] flex flex-col rounded-[40px]">
          <DialogHeader>
            <DialogTitle className="text-blue-400 font-black uppercase flex items-center gap-2 text-xl italic">
              <Package className="h-5 w-5" />
              {editandoId ? 'Editar Produto' : 'Cadastrar Produto'}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 space-y-5 pr-1 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Código</Label>
                <Input placeholder="EX: PRD-001" value={form.codigo} onChange={e => setForm(p => ({ ...p, codigo: e.target.value }))}
                  className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl font-mono uppercase" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Unidade de Venda</Label>
                <Input placeholder="UN / M² / KG" value={form.unidade} onChange={e => setForm(p => ({ ...p, unidade: e.target.value }))}
                  className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl text-center uppercase" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Nome do Produto</Label>
              <Input placeholder="Ex: Porta de Alumínio 210x90" value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl uppercase" />
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Descrição / Especificação</Label>
              <Textarea placeholder="Detalhes técnicos, dimensões, acabamento..." value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                className="bg-black/40 border-blue-500/20 text-white rounded-xl resize-none" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Preço de Venda (R$)</Label>
                <Input type="number" min={0} step={0.01} value={form.preco || ''} onChange={e => setForm(p => ({ ...p, preco: Number(e.target.value) }))}
                  className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl font-black text-lg text-center" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">URL da Imagem (opcional)</Label>
                <Input placeholder="https://..." value={form.imagem || ''} onChange={e => setForm(p => ({ ...p, imagem: e.target.value }))}
                  className="bg-black/40 border-blue-500/20 text-white h-11 rounded-xl text-xs" />
              </div>
            </div>

            {/* MATERIAIS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Lista de Materiais (Produto Explodido)</Label>
                <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/10 text-[10px] font-black uppercase" onClick={addMaterial}>
                  <Plus className="mr-1 h-3 w-3" /> Adicionar
                </Button>
              </div>
              {form.materiais.map(mat => (
                <div key={mat.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border border-blue-500/10 bg-black/30">
                  <div className="col-span-5">
                    <Input placeholder="Descrição do material" value={mat.descricao} onChange={e => updateMaterial(mat.id, 'descricao', e.target.value)}
                      className="bg-black/60 border-white/10 text-white h-9 rounded-xl text-sm uppercase" />
                  </div>
                  <div className="col-span-3">
                    <Input type="number" min={0} step={0.01} placeholder="Qtd" value={mat.quantidade || ''} onChange={e => updateMaterial(mat.id, 'quantidade', Number(e.target.value))}
                      className="bg-black/60 border-white/10 text-blue-400 h-9 rounded-xl text-center font-black" />
                  </div>
                  <div className="col-span-3">
                    <Input placeholder="UN" value={mat.unidade} onChange={e => updateMaterial(mat.id, 'unidade', e.target.value)}
                      className="bg-black/60 border-white/10 text-gray-400 h-9 rounded-xl text-center text-xs uppercase" />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-9 w-9 p-0" onClick={() => removeMaterial(mat.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-blue-500/10">
            <Button variant="outline" className="border-zinc-700 text-gray-400" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-8 rounded-2xl"
              onClick={salvar} disabled={!form.codigo || !form.nome}>
              Salvar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
