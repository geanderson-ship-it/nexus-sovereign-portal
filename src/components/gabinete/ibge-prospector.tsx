'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Map, ExternalLink, Phone, ShieldCheck, TrendingUp, Loader2, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UF {
  id: number;
  sigla: string;
  nome: string;
}

interface Municipio {
  id: number;
  nome: string;
}

export function IbgeProspector() {
  const [ufs, setUfs] = useState<UF[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPossibilidade, setFilterPossibilidade] = useState<string>('todos');

  // Fetch UFs on mount
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(res => res.json())
      .then(data => {
        // Sort alphabetically by name
        const sorted = data.sort((a: UF, b: UF) => a.nome.localeCompare(b.nome));
        setUfs(sorted);
      })
      .catch(err => console.error('Erro ao buscar UFs:', err));
  }, []);

  // Fetch Municipios when UF changes
  useEffect(() => {
    if (!selectedUf) {
      setMunicipios([]);
      return;
    }
    
    setLoading(true);
    const url = selectedUf === 'BR'
      ? 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios'
      : `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // If BR, data comes with microrregiao.mesorregiao.UF.sigla, we could map it, but for now we just use nome
        setMunicipios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar municípios:', err);
        setLoading(false);
      });
  }, [selectedUf]);

  // Função para simular o "Grau de Possibilidade" (Nexus Target Score)
  // Como não temos a população real na API básica, vamos gerar um score determinístico baseado no ID para visualização,
  // ou priorizar cidades médias. Na vida real, conectaríamos a um banco com censo IBGE completo.
  const getNexusScore = (id: number) => {
    // Lógica fictícia para gerar um score entre 60 e 98 baseado no ID
    const base = (id % 40) + 55; 
    if (base > 95) return { score: base, level: 'Altíssimo', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (base > 80) return { score: base, level: 'Alto', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    return { score: base, level: 'Médio', color: 'text-amber-400', bg: 'bg-amber-500/10' };
  };

  const filteredMunicipios = useMemo(() => {
    let result = municipios;
    if (searchTerm) {
      result = result.filter(m => m.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterPossibilidade !== 'todos') {
      result = result.filter(m => getNexusScore(m.id).level === filterPossibilidade);
    }
    
    // Sort by descending score
    result = [...result].sort((a, b) => getNexusScore(b.id).score - getNexusScore(a.id).score);
    
    // Limit to 200 to prevent browser lag when tracking entire Brazil
    return result.slice(0, 200);
  }, [municipios, searchTerm, filterPossibilidade]);

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Prospector de Expansão Global</CardTitle>
              <CardDescription>Mapeie cidades com perfil estratégico para implantação da Nexus</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="w-full md:w-1/3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Estado (UF)</label>
              <Select value={selectedUf} onValueChange={setSelectedUf}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 h-12">
                  <SelectValue placeholder="Selecione um Estado" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200 max-h-[300px]">
                  <SelectItem value="BR" className="hover:bg-slate-700 cursor-pointer font-bold text-emerald-400">🇧🇷 Brasil Inteiro (Rastreio Total)</SelectItem>
                  {ufs.map(uf => (
                    <SelectItem key={uf.id} value={uf.sigla} className="hover:bg-slate-700 cursor-pointer">
                      {uf.nome} ({uf.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Grau de Possibilidade</label>
              <Select value={filterPossibilidade} onValueChange={setFilterPossibilidade}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 h-12">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="todos" className="hover:bg-slate-700 cursor-pointer">Todos</SelectItem>
                  <SelectItem value="Altíssimo" className="hover:bg-slate-700 cursor-pointer text-emerald-400 font-bold">Altíssimo</SelectItem>
                  <SelectItem value="Alto" className="hover:bg-slate-700 cursor-pointer text-blue-400 font-bold">Alto</SelectItem>
                  <SelectItem value="Médio" className="hover:bg-slate-700 cursor-pointer text-amber-400 font-bold">Médio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Buscar Cidade</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input 
                  placeholder="Ex: Passo do Sobrado" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-primary/50"
                  disabled={!selectedUf}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-primary">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Buscando dados no IBGE...</p>
            </div>
          ) : filteredMunicipios.length > 0 ? (
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#020617]/50">
              <Table>
                <TableHeader className="bg-slate-900/80">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-bold">Município</TableHead>
                    <TableHead className="text-slate-400 font-bold text-center">Grau de Possibilidade</TableHead>
                    <TableHead className="text-slate-400 font-bold text-right">Ações de Prospecção</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMunicipios.map((cidade) => {
                    const scoreData = getNexusScore(cidade.id);
                    const searchQuery = encodeURIComponent(`Prefeitura de ${cidade.nome} ${selectedUf} telefone contato email gabinete do prefeito`);
                    
                    return (
                      <TableRow key={cidade.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <TableCell className="font-medium text-slate-200 py-4">
                          {cidade.nome}
                        </TableCell>
                        <TableCell className="text-center py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${scoreData.bg} border border-${scoreData.color.replace('text-', 'border-')}/30`}>
                            <Activity className={`w-3 h-3 ${scoreData.color}`} />
                            <span className={`text-xs font-bold ${scoreData.color}`}>{scoreData.score}% ({scoreData.level})</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                            onClick={() => window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank')}
                          >
                            <Phone className="w-4 h-4 mr-2 text-primary" />
                            Buscar Contato
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {municipios.length > 200 && (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-900/50 border-t border-slate-800">
                  Mostrando os 200 primeiros resultados para otimização. Refine a busca ou use o filtro de possibilidade.
                </div>
              )}
            </div>
          ) : selectedUf ? (
            <div className="py-12 text-center text-slate-500">
              Nenhuma cidade encontrada com esse nome.
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <Map className="w-16 h-16 text-slate-800 mb-4" />
              <p className="text-slate-500 font-medium">Selecione um Estado para iniciar a prospecção.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
