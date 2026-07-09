'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Trash2, Send, Phone, User, Tag, CheckCircle, Clock, XCircle, Search } from 'lucide-react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIPOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type Status = 'Pendente' | 'Enviado' | 'Respondeu' | 'Descartado';

interface Contato {
  id: string;
  nome: string;
  telefone: string;
  segmento: string;
  status: Status;
  dataAdicionado: string;
  dataEnvio?: string;
}

const SEGMENTOS = [
  'Moda / Vestuário',
  'Agronegócio',
  'Automóveis / Revenda',
  'Saúde / Clínica',
  'Rádio / Mídia',
  'Energia',
  'Empresa / Indústria',
  'Governo / Prefeitura',
  'Holding / Diretoria',
  'Tecnologia',
  'Outro',
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: any }> = {
  Pendente:   { label: 'Pendente',   color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',  icon: Clock },
  Enviado:    { label: 'Enviado',    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',     icon: Send },
  Respondeu:  { label: 'Respondeu', color: 'bg-green-500/20 text-green-300 border-green-500/30',  icon: CheckCircle },
  Descartado: { label: 'Descartado',color: 'bg-red-500/20 text-red-300 border-red-500/30',        icon: XCircle },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENTE PRINCIPAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function ContatosIsadoraPage() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<Status | 'Todos'>('Todos');
  const [showForm, setShowForm] = useState(false);
  const [disparando, setDisparando] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form state
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [segmento, setSegmento] = useState(SEGMENTOS[0]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FUNÇÕES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function formatarTelefone(tel: string): string {
    const limpo = tel.replace(/\D/g, '');
    if (limpo.startsWith('55')) return limpo;
    if (limpo.startsWith('0')) return `55${limpo.slice(1)}`;
    return `55${limpo}`;
  }

  function adicionarContato() {
    if (!nome.trim() || !telefone.trim()) return;
    const novo: Contato = {
      id: Date.now().toString(),
      nome: nome.trim(),
      telefone: formatarTelefone(telefone),
      segmento,
      status: 'Pendente',
      dataAdicionado: new Date().toISOString(),
    };
    setContatos(prev => [novo, ...prev]);
    setNome('');
    setTelefone('');
    setSegmento(SEGMENTOS[0]);
    setShowForm(false);
    mostrarFeedback(`✅ ${novo.nome} adicionado à lista!`);
  }

  function removerContato(id: string) {
    setContatos(prev => prev.filter(c => c.id !== id));
  }

  function alterarStatus(id: string, status: Status) {
    setContatos(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }

  function mostrarFeedback(msg: string) {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  }

  async function dispararIsadora(contato: Contato) {
    setDisparando(contato.id);
    try {
      const res = await fetch('/api/isadora/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: contato.telefone,
          nome: contato.nome,
          segmento: contato.segmento,
        }),
      });

      if (res.ok) {
        alterarStatus(contato.id, 'Enviado');
        setContatos(prev => prev.map(c =>
          c.id === contato.id ? { ...c, status: 'Enviado', dataEnvio: new Date().toISOString() } : c
        ));
        mostrarFeedback(`🚀 Isadora abordou ${contato.nome} no WhatsApp!`);
      } else {
        const err = await res.json();
        mostrarFeedback(`❌ Erro: ${err.error || 'Falha ao disparar'}`);
      }
    } catch {
      mostrarFeedback('❌ Erro de conexão. Tente novamente.');
    } finally {
      setDisparando(null);
    }
  }

  async function dispararTodosPendentes() {
    const pendentes = contatosFiltrados.filter(c => c.status === 'Pendente');
    if (pendentes.length === 0) return;
    mostrarFeedback(`🚀 Disparando ${pendentes.length} contatos pendentes...`);
    for (const c of pendentes) {
      await dispararIsadora(c);
      await new Promise(r => setTimeout(r, 1500)); // Intervalo entre disparos
    }
  }

  function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const novosContatos: Contato[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const [nome, cnpj, telefone, email, cidade, estado, situacao, segmento] = line.split(',');
        
        if (nome && telefone) {
          novosContatos.push({
            id: Date.now().toString() + i,
            nome: nome.replace(/["']/g, ''),
            telefone: formatarTelefone(telefone.replace(/["']/g, '')),
            segmento: segmento ? segmento.replace(/["']/g, '') : 'Outro',
            status: 'Pendente',
            dataAdicionado: new Date().toISOString()
          });
        }
      }

      setContatos(prev => [...novosContatos, ...prev]);
      mostrarFeedback(`✅ ${novosContatos.length} contatos importados com sucesso!`);
    };
    reader.readAsText(file);
    e.target.value = ''; // reseta o input
  }

  function carregarLeadsTeste() {
    const leadsTeste: Contato[] = [
      { id: 't1', nome: 'Agropecuária Vale do Sol', telefone: '5561999991111', segmento: 'Agronegócio', status: 'Pendente', dataAdicionado: new Date().toISOString() },
      { id: 't2', nome: 'InovaTech Solutions', telefone: '5511988882222', segmento: 'Tecnologia', status: 'Pendente', dataAdicionado: new Date().toISOString() },
      { id: 't3', nome: 'Clínica Bem Estar', telefone: '5541977773333', segmento: 'Saúde / Clínica', status: 'Pendente', dataAdicionado: new Date().toISOString() },
      { id: 't4', nome: 'Grupo Zogbi Holding', telefone: '5521966664444', segmento: 'Holding / Diretoria', status: 'Pendente', dataAdicionado: new Date().toISOString() },
      { id: 't5', nome: 'Concessionária Apex', telefone: '5531955555555', segmento: 'Automóveis / Revenda', status: 'Pendente', dataAdicionado: new Date().toISOString() },
    ];
    setContatos(prev => [...leadsTeste, ...prev]);
    mostrarFeedback('✅ 5 leads de teste carregados!');
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FILTROS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const contatosFiltrados = contatos.filter(c => {
    const matchBusca = !busca ||
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.includes(busca) ||
      c.segmento.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'Todos' || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const stats = {
    total: contatos.length,
    pendentes: contatos.filter(c => c.status === 'Pendente').length,
    enviados: contatos.filter(c => c.status === 'Enviado').length,
    responderam: contatos.filter(c => c.status === 'Respondeu').length,
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="min-h-screen bg-[#0f0700] text-slate-200 p-6 pt-24 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#eab308_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-amber-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/gabinete/isadora" className="flex items-center gap-1 text-amber-400/70 hover:text-amber-400 transition-colors text-sm">
              <ChevronLeft size={16} /> Isadora
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-amber-400">Lista de Contatos</h1>
              <p className="text-slate-400 text-sm">Leads para prospecção ativa da Isadora</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={carregarLeadsTeste}
              className="text-amber-500/70 hover:text-amber-400 text-xs transition-colors"
            >
              + Dados de Teste
            </button>
            <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-lg transition-all text-sm cursor-pointer">
              <span>Importar CSV</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
            </label>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg transition-all text-sm"
            >
              <Plus size={16} /> Novo Contato
            </button>
          </div>
        </div>

        {/* Feedback Toast */}
        {feedback && (
          <div className="fixed top-6 right-6 z-50 bg-slate-800 border border-amber-500/40 text-amber-300 px-4 py-3 rounded-lg shadow-xl text-sm animate-pulse">
            {feedback}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-300' },
            { label: 'Pendentes', value: stats.pendentes, color: 'text-amber-400' },
            { label: 'Enviados', value: stats.enviados, color: 'text-blue-400' },
            { label: 'Responderam', value: stats.responderam, color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Modal de adicionar contato */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h2 className="text-lg font-bold text-amber-400">Adicionar Contato</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Nome / Empresa</label>
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                    <User size={14} className="text-slate-500" />
                    <input
                      type="text"
                      placeholder="Ex: João Silva / Loja ABC"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1 block">WhatsApp (com DDD)</label>
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                    <Phone size={14} className="text-slate-500" />
                    <input
                      type="tel"
                      placeholder="Ex: 51999123456"
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none flex-1"
                    />
                  </div>
                  <p className="text-slate-600 text-xs mt-1">Não precisa colocar +55, adicionamos automaticamente.</p>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Segmento</label>
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                    <Tag size={14} className="text-slate-500" />
                    <select
                      value={segmento}
                      onChange={e => setSegmento(e.target.value)}
                      className="bg-transparent text-sm text-slate-200 outline-none flex-1"
                    >
                      {SEGMENTOS.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={adicionarContato}
                  disabled={!nome.trim() || !telefone.trim()}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-semibold py-2 rounded-lg text-sm transition-all"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtros e busca */}
        {contatos.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900/60 border border-amber-500/20 rounded-lg px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nome, telefone..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none flex-1"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {(['Todos', 'Pendente', 'Enviado', 'Respondeu', 'Descartado'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFiltroStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    filtroStatus === s
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:border-amber-500/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {stats.pendentes > 0 && (
              <button
                onClick={dispararTodosPendentes}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                <Send size={14} /> Disparar todos os pendentes ({stats.pendentes})
              </button>
            )}
          </div>
        )}

        {/* Lista de contatos */}
        {contatosFiltrados.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="text-5xl">📋</div>
            <p className="text-slate-400">
              {contatos.length === 0
                ? 'Nenhum contato ainda. Adicione o primeiro para a Isadora prospectar!'
                : 'Nenhum contato encontrado com esse filtro.'}
            </p>
            {contatos.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm"
              >
                <Plus size={16} /> Adicionar primeiro contato
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {contatosFiltrados.map(c => {
              const statusCfg = STATUS_CONFIG[c.status];
              const StatusIcon = statusCfg.icon;
              return (
                <div
                  key={c.id}
                  className="bg-slate-900/70 border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-4 flex items-center gap-4 transition-all"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-100">{c.nome}</span>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                        <StatusIcon size={10} /> {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-slate-500 text-sm flex-wrap">
                      <span className="flex items-center gap-1">
                        <Phone size={11} /> {c.telefone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag size={11} /> {c.segmento}
                      </span>
                      {c.dataEnvio && (
                        <span className="text-xs text-slate-600">
                          Enviado {new Date(c.dataEnvio).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={c.status}
                      onChange={e => alterarStatus(c.id, e.target.value as Status)}
                      className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                    >
                      {Object.keys(STATUS_CONFIG).map(s => (
                        <option key={s} value={s} className="bg-slate-800">{s}</option>
                      ))}
                    </select>

                    {c.status === 'Pendente' && (
                      <button
                        onClick={() => dispararIsadora(c)}
                        disabled={disparando === c.id}
                        className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      >
                        {disparando === c.id ? '...' : <><Send size={11} /> Disparar</>}
                      </button>
                    )}

                    <button
                      onClick={() => removerContato(c.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
