'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, BookOpen, Plus, FileText, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AgendaItem {
  id: number;
  evento: string;
  data: string;
  horario: string;
  local: string;
  anfitriao: string;
  assunto: string;
  observacoes: string;
  status: string;
}

const INITIAL_AGENDA: AgendaItem[] = [
  {
    id: 1,
    evento: 'Apresentação Cidades do Futuro',
    data: '28/05/2026',
    horario: '14:00',
    local: 'Prefeitura de Vale Verde, RS',
    anfitriao: 'Prefeito Carlos Silva',
    assunto: 'Apresentação do ecossistema e ferramentas de saúde',
    observacoes: 'Levar material impresso do Dante Safra e folder Health.',
    status: 'Confirmado',
  },
  {
    id: 2,
    evento: 'Reunião Secretariado',
    data: '30/05/2026',
    horario: '09:30',
    local: 'Prefeitura de Passo do Sobrado, RS',
    anfitriao: 'Sec. de Saúde e Educação',
    assunto: 'Pilar Educação - Retenção de Jovens',
    observacoes: 'Destacar o uso de IAs Humanas nos cursos.',
    status: 'Pendente',
  }
];

export function AgendaEstrategica() {
  const [agendamentos, setAgendamentos] = useState<AgendaItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Partial<AgendaItem>>({
    status: 'Pendente'
  });

  // Carregar dados salvos no navegador (localStorage)
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('nexus_agenda_v1');
    if (saved) {
      try {
        setAgendamentos(JSON.parse(saved));
      } catch (e) {
        setAgendamentos(INITIAL_AGENDA);
      }
    } else {
      setAgendamentos(INITIAL_AGENDA);
    }
  }, []);

  // Salvar automaticamente sempre que houver mudança
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('nexus_agenda_v1', JSON.stringify(agendamentos));
    }
  }, [agendamentos, isMounted]);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ status: 'Pendente' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AgendaItem) => {
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja apagar esta reunião do radar?')) {
      setAgendamentos(agendamentos.filter(a => a.id !== id));
    }
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Confirmado' ? 'Pendente' : 'Confirmado';
    setAgendamentos(agendamentos.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleSave = () => {
    if (!formData.evento || !formData.data || !formData.local) {
      alert('Por favor, preencha pelo menos o Evento, Data e Local.');
      return;
    }

    if (editingId) {
      // Edit
      setAgendamentos(agendamentos.map(a => a.id === editingId ? { ...a, ...formData } as AgendaItem : a));
    } else {
      // Create
      const newItem: AgendaItem = {
        ...formData,
        id: Date.now(),
      } as AgendaItem;
      setAgendamentos([...agendamentos, newItem]);
    }
    
    setIsModalOpen(false);
  };

  if (!isMounted) return null; // Previne hidratação incorreta

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-headline text-white">Agenda Estratégica</h2>
          <p className="text-slate-400">Gerenciamento de compromissos e visitas prospectadas</p>
        </div>
        <Button onClick={handleOpenNew} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="rounded-xl overflow-hidden border-0">
            <Table>
              <TableHeader className="bg-slate-900/80">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-bold py-4">Data & Horário</TableHead>
                  <TableHead className="text-slate-400 font-bold">Evento / Assunto</TableHead>
                  <TableHead className="text-slate-400 font-bold">Local & Anfitrião</TableHead>
                  <TableHead className="text-slate-400 font-bold">Observações</TableHead>
                  <TableHead className="text-slate-400 font-bold text-center">Status</TableHead>
                  <TableHead className="text-slate-400 font-bold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendamentos.map((item) => (
                  <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                    
                    <TableCell className="py-4 align-top">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-slate-200 font-semibold">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          {item.data}
                        </div>
                        <div className="flex items-center text-slate-400 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          {item.horario}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 align-top">
                      <div className="flex flex-col space-y-2">
                        <span className="font-bold text-white font-headline text-lg">{item.evento}</span>
                        <div className="flex items-start text-slate-400 text-sm">
                          <BookOpen className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                          <span>{item.assunto}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 align-top">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-start text-slate-300">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-emerald-400" />
                          <span className="font-medium">{item.local}</span>
                        </div>
                        <div className="flex items-start text-slate-400 text-sm">
                          <Users className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                          <span>{item.anfitriao}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 align-top max-w-[250px]">
                      <div className="flex items-start text-slate-400 text-sm italic bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                        <FileText className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-slate-500" />
                        <span>{item.observacoes}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-4 align-top">
                      <button 
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 cursor-pointer ${
                          item.status === 'Confirmado' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status === 'Confirmado' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status}
                      </button>
                    </TableCell>

                    <TableCell className="text-right py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenEdit(item)} className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)} className="bg-transparent border-red-900/50 text-red-400 hover:text-red-300 hover:bg-red-900/30 h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {agendamentos.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center border-t border-slate-800">
              <Calendar className="w-16 h-16 text-slate-800 mb-4" />
              <p className="text-slate-500 font-medium">Nenhum evento agendado.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação / Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-headline">
              {editingId ? 'Editar Agendamento' : 'Novo Agendamento Estratégico'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Evento / Título</label>
              <Input 
                placeholder="Ex: Apresentação Cidades do Futuro" 
                value={formData.evento || ''} 
                onChange={e => setFormData({...formData, evento: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Data</label>
              <Input 
                placeholder="Ex: 15/08/2026" 
                value={formData.data || ''} 
                onChange={e => setFormData({...formData, data: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Horário</label>
              <Input 
                placeholder="Ex: 14:00" 
                value={formData.horario || ''} 
                onChange={e => setFormData({...formData, horario: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Local</label>
              <Input 
                placeholder="Ex: Prefeitura de Vale Verde, RS" 
                value={formData.local || ''} 
                onChange={e => setFormData({...formData, local: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Anfitrião</label>
              <Input 
                placeholder="Ex: Prefeito Carlos" 
                value={formData.anfitriao || ''} 
                onChange={e => setFormData({...formData, anfitriao: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Status Inicial</label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Pendente" className="text-amber-400 font-bold">Pendente</SelectItem>
                  <SelectItem value="Confirmado" className="text-emerald-400 font-bold">Confirmado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Assunto</label>
              <Input 
                placeholder="Ex: Demonstração do Pilar Saúde" 
                value={formData.assunto || ''} 
                onChange={e => setFormData({...formData, assunto: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Observações e Lembretes</label>
              <Textarea 
                placeholder="Ex: Levar folhetos impressos e garantir que o notebook esteja carregado." 
                value={formData.observacoes || ''} 
                onChange={e => setFormData({...formData, observacoes: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              Salvar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
