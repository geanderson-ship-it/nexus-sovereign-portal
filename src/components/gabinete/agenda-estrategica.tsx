'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, BookOpen, Plus, MoreHorizontal, FileText, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const MOCK_AGENDA = [
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
  const [agendamentos, setAgendamentos] = useState(MOCK_AGENDA);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-headline text-white">Agenda Estratégica</h2>
          <p className="text-slate-400">Gerenciamento de compromissos e visitas prospectadas</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
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
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Confirmado' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.status === 'Confirmado' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status}
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
    </div>
  );
}
