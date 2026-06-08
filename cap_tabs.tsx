        const linhasCorte = linhas.filter((l: any) => l.setor === 'CORTE');
        const linhasProducao = linhas.filter((l: any) => l.setor !== 'CORTE');
        const linhasExibir = activeCapTab === 'corte' ? linhasCorte : linhasProducao;

        const setorColor: Record<string, string> = {
          CORTE:       'text-red-400 bg-red-950/30 border-red-500/30',
          ACABAMENTO:  'text-amber-400 bg-amber-950/30 border-amber-500/30',
          SOLDA:       'text-blue-400 bg-blue-950/30 border-blue-500/30',
          MONTAGEM:    'text-emerald-400 bg-emerald-950/30 border-emerald-500/30',
        };

        return (
          <div className="space-y-8">
            {/* HEADER */}
            <div className="bg-zinc-950/60 border border-violet-500/10 rounded-[40px] p-8 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white italic flex items-center gap-3">
                    <Activity className="h-6 w-6 text-violet-400" />
                    Capacidade Produtiva Analítica
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Alimentada automaticamente pelo Módulo Cronoanálise</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-black/40 border border-violet-500/20 rounded-xl p-1">
                    <button
                      onClick={() => setActiveCapTab('corte')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeCapTab === 'corte' ? "bg-violet-600 text-white" : "text-gray-500 hover:text-white"
                      )}
                    >
                      Corte - Pacotes
                    </button>
                    <button
                      onClick={() => setActiveCapTab('producao')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeCapTab === 'producao' ? "bg-violet-600 text-white" : "text-gray-500 hover:text-white"
                      )}
                    >
                      Produção - Peças
                    </button>
                  </div>
                  <Button onClick={sincronizarPPCP} className="bg-violet-600 hover:bg-violet-500 text-white h-9 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <Activity className="mr-2 h-4 w-4 animate-pulse" /> Sincronizar
                  </Button>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Estudos na Aba', value: linhasExibir.length, color: 'text-violet-400' },
                  { label: 'Produtos Únicos', value: new Set(linhasExibir.map((e: any) => e.codigo || e.operacao)).size, color: 'text-amber-400' },
                  { label: 'Setores Mapeados', value: new Set(linhasExibir.map((e: any) => e.setor)).size, color: 'text-emerald-400' },
                  { label: activeCapTab === 'corte' ? 'Maior Cap/h (Pacotes)' : 'Maior Cap/h (Peças)', value: linhasExibir.length ? Math.round(Math.max(...linhasExibir.map((l: any) => activeCapTab === 'corte' ? (l.capHora / l.pecasPorCiclo) : l.capHora))) : 0, color: 'text-cyan-400' },
                ].map((k, i) => (
                  <div key={i} className="bg-black/30 border border-violet-500/10 rounded-2xl p-4 text-center">
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">{k.label}</p>
                    <p className={	ext-2xl font-black italic mt-1 \}>{k.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TABELA */}
            {linhasExibir.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 border-2 border-dashed border-violet-500/20 rounded-[32px]">
                <Activity className="h-16 w-16 text-violet-500/20" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Nenhum estudo encontrado para {activeCapTab === 'corte' ? 'Corte' : 'Produção'}</p>
              </div>
            ) : (
              <div className="bg-zinc-950/60 border border-violet-500/10 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-violet-950/30 border-b border-violet-500/10">
                      <tr>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400">Produto / Peça</th>
                        <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 text-center">Código</th>
                        <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 text-center">Setor</th>
                        <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 text-center">Tempo Base<br/><span className="text-[8px] text-gray-600 normal-case font-normal">(min/ciclo)</span></th>
                        <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 text-center">Cap. / Hora<br/><span className="text-[8px] text-gray-600 normal-case font-normal">{activeCapTab === 'corte' ? '(pacotes)' : '(peças)'}</span></th>
                        <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 text-center">Cap. / Turno<br/><span className="text-[8px] text-gray-600 normal-case font-normal">{activeCapTab === 'corte' ? '(pacotes)' : '(peças)'}</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {linhasExibir.map((linha: any, idx: number) => (
                        <tr key={linha.id} className={cn(
                          "border-b border-violet-500/5 hover:bg-violet-950/10 transition-colors",
                          idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                        )}>
                          <td className="px-6 py-4">
                            <p className="font-black text-white text-sm uppercase leading-tight">{linha.operacao}</p>
