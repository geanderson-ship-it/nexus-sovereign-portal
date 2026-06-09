'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAlmoxarifado } from '@/lib/almoxarifado/store';
import { ArrowLeft, ScanLine, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SovereignShowcase } from '@/components/nexus/SovereignShowcase';

type LogBip = {
  id: string;
  time: string;
  code: string;
  status: 'success' | 'error';
  message: string;
  qtd: number;
};

export default function TerminalBipagem() {
  const { itens, aplicarMovimento } = useAlmoxarifado();
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<LogBip[]>([]);
  const [tipoMovimento, setTipoMovimento] = useState<'saida' | 'entrada'>('saida');
  const [flash, setFlash] = useState<'none' | 'success' | 'error'>('none');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus no terminal
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    focus();
    window.addEventListener('click', focus);
    return () => window.removeEventListener('click', focus);
  }, []);

  const triggerFlash = (type: 'success' | 'error') => {
    setFlash(type);
    setTimeout(() => setFlash('none'), 300); // flash rapido
  };

  const processBip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    let code = inputVal.trim().toUpperCase();
    let qtd = 1;

    // Permitir formato 5*CODIGO
    if (code.includes('*')) {
      const parts = code.split('*');
      const possibleQtd = parseInt(parts[0], 10);
      if (!isNaN(possibleQtd) && possibleQtd > 0) {
        qtd = possibleQtd;
        code = parts[1];
      }
    }

    const itemEncontrado = itens.find(i => i.codigo === code || i.id === code);

    const timeStr = new Date().toLocaleTimeString('pt-BR');
    const newLog: LogBip = {
      id: crypto.randomUUID(),
      time: timeStr,
      code,
      qtd,
      status: 'error',
      message: 'Item não localizado no inventário'
    };

    if (itemEncontrado) {
      // Validação de saída sem saldo
      if (tipoMovimento === 'saida' && itemEncontrado.estoqueAtual < qtd) {
        newLog.status = 'error';
        newLog.message = `Saldo Insuficiente (Atual: ${itemEncontrado.estoqueAtual})`;
        triggerFlash('error');
      } else {
        // Sucesso
        aplicarMovimento(itemEncontrado.id, tipoMovimento, qtd, newLog.time, 'Terminal Coletor', 'Bipagem Rápida');
        newLog.status = 'success';
        newLog.message = `${itemEncontrado.descricao} (${tipoMovimento.toUpperCase()})`;
        triggerFlash('success');
      }
    } else {
      triggerFlash('error');
    }

    setLogs(prev => [newLog, ...prev].slice(0, 50)); // manter ultimos 50 logs
    setInputVal('');
  };

  return (
    <SovereignShowcase moduleName="Terminal Coletor" imagePath="/Nexus Empresas/Dante almoxarife.png">
      <div className={cn(
        "min-h-screen font-mono p-6 transition-colors duration-150 flex flex-col items-center justify-center relative overflow-hidden",
        flash === 'success' ? 'bg-emerald-950/80' : flash === 'error' ? 'bg-rose-950/80' : 'bg-[#050505]'
      )}>
        
        {/* HEADER DE SAÍDA DE EMERGÊNCIA */}
        <div className="absolute top-6 left-6 z-50">
          <Link href="/intelligence/almoxarifado">
            <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
              <ArrowLeft className="h-4 w-4" /> 
              <span className="text-[10px] uppercase font-black tracking-widest">Sair do Terminal</span>
            </button>
          </Link>
        </div>

        <div className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-black/50 border border-white/10 rounded-full p-1 backdrop-blur-md">
           <button 
             type="button"
             onClick={(e) => { e.stopPropagation(); setTipoMovimento('saida'); inputRef.current?.focus(); }}
             className={cn("px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all", tipoMovimento === 'saida' ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'text-gray-500 hover:text-white')}
           >
             Baixa (Saída)
           </button>
           <button 
             type="button"
             onClick={(e) => { e.stopPropagation(); setTipoMovimento('entrada'); inputRef.current?.focus(); }}
             className={cn("px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all", tipoMovimento === 'entrada' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-gray-500 hover:text-white')}
           >
             Reposição (Entrada)
           </button>
        </div>

        {/* CONTAINER CENTRAL */}
        <div className="w-full max-w-4xl relative z-10 flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* LADO ESQUERDO: INPUT */}
          <div className="flex-1 bg-black/60 border border-white/5 rounded-[40px] p-8 shadow-2xl backdrop-blur-md flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 border-2 border-transparent group-focus-within:border-emerald-500/30 rounded-[40px] transition-colors pointer-events-none" />
            
            <div className="text-center mb-8">
              <div className={cn(
                "mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl transition-colors duration-300",
                tipoMovimento === 'saida' ? "bg-rose-500/10 text-rose-500 shadow-rose-500/20" : "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20"
              )}>
                <ScanLine className="h-10 w-10 animate-pulse" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-white">
                Modo Coletor
              </h1>
              <p className={cn("text-xs font-bold tracking-widest uppercase mt-2", tipoMovimento === 'saida' ? 'text-rose-400' : 'text-emerald-400')}>
                Aguardando Leitura de {tipoMovimento === 'saida' ? 'Saída' : 'Entrada'}...
              </p>
            </div>

            <form onSubmit={processBip} className="relative">
              <ChevronRight className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-emerald-500 animate-pulse" />
              <input
                ref={inputRef}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                autoFocus
                autoComplete="off"
                placeholder="Escaneie o Código de Barras"
                className="w-full bg-zinc-950/80 border border-emerald-500/20 h-24 rounded-3xl pl-20 pr-8 text-3xl font-black text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 uppercase tracking-widest placeholder:text-gray-800 transition-all"
              />
              <div className="absolute -bottom-8 left-0 w-full text-center">
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Dica: Digite 5*CODIGO para dar baixa em 5 peças</span>
              </div>
            </form>
          </div>

          {/* LADO DIREITO: LOGS */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-[40px] p-6 shadow-2xl backdrop-blur-md flex flex-col h-[500px]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 border-b border-white/10 pb-4">
              Histórico da Sessão
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                  <ScanLine className="h-12 w-12 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-widest">Nenhuma leitura ainda</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all animate-in slide-in-from-top-2",
                    log.status === 'success' 
                      ? tipoMovimento === 'saida' ? "bg-rose-950/20 border-rose-500/20" : "bg-emerald-950/20 border-emerald-500/20"
                      : "bg-rose-950/40 border-rose-500/50"
                  )}>
                    {log.status === 'success' ? (
                      <CheckCircle2 className={cn("h-6 w-6 shrink-0", tipoMovimento === 'saida' ? 'text-rose-400' : 'text-emerald-400')} />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-rose-500 shrink-0" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-white uppercase truncate">{log.code}</span>
                        <span className="text-[9px] text-gray-500 font-bold">{log.time}</span>
                      </div>
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-widest truncate mt-0.5",
                        log.status === 'success' ? "text-gray-400" : "text-rose-400"
                      )}>
                        {log.message}
                      </p>
                    </div>

                    <div className={cn(
                      "text-xl font-black shrink-0",
                      log.status === 'success' 
                        ? tipoMovimento === 'saida' ? 'text-rose-400' : 'text-emerald-400'
                        : "text-rose-500"
                    )}>
                      {tipoMovimento === 'saida' ? '-' : '+'}{log.qtd}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </SovereignShowcase>
  );
}
