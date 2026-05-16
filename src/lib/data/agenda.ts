/**
 * Mock data for the user's (Diretoria) daily agenda.
 * In a real production environment, this would be fetched from an API (Google Calendar, Outlook, etc.)
 */

export interface AgendaItem {
  id: string;
  title: string;
  startTime: string; // ISO format
  endTime: string;   // ISO format
  location?: string;
  description?: string;
  type: 'work' | 'personal' | 'strategic' | 'meeting';
}

export const dailyAgenda: AgendaItem[] = [
  {
    id: 'appt-001',
    title: 'Reunião Estratégica com Empresa X',
    startTime: '2026-05-13T09:00:00Z',
    endTime: '2026-05-13T10:30:00Z',
    location: 'Sala de Comando Nexus',
    description: 'Discussão sobre expansão da infraestrutura e parcerias tecnológicas.',
    type: 'meeting'
  },
  {
    id: 'appt-002',
    title: 'Análise de KPIs de Produção',
    startTime: '2026-05-13T11:00:00Z',
    endTime: '2026-05-13T12:00:00Z',
    description: 'Revisão dos índices de mérito e eficiência das células.',
    type: 'work'
  },
  {
    id: 'appt-003',
    title: 'Visita Técnica ao Setor de Pintura',
    startTime: '2026-05-13T14:00:00Z',
    endTime: '2026-05-13T15:30:00Z',
    description: 'Acompanhamento do gargalo identificado pelo Dante.',
    type: 'strategic'
  },
  {
    id: 'appt-004',
    title: 'Alinhamento com Diretoria Financeira',
    startTime: '2026-05-13T16:00:00Z',
    endTime: '2026-05-13T17:00:00Z',
    type: 'meeting'
  }
];

export function getFormattedAgenda(): string {
  if (dailyAgenda.length === 0) return "Nenhum compromisso agendado para hoje.";
  
  return dailyAgenda
    .map(item => {
      const start = new Date(item.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const end = new Date(item.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `- [${start} - ${end}] ${item.title} (${item.type})${item.description ? `: ${item.description}` : ''}`;
    })
    .join('\n');
}
