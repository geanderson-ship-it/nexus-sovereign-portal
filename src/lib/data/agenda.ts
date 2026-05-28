/**
 * Mock data for the user's (Diretoria) daily agenda.
 * In a real production environment, this would be fetched from an API (Google Calendar, Outlook, etc.)
 */

export interface AgendaItem {
  id: string;
  title: string;
  startTime: string; // ISO format with timezone offset
  endTime: string;   // ISO format with timezone offset
  location?: string;
  description?: string;
  type: 'work' | 'personal' | 'strategic' | 'meeting';
}

export const dailyAgenda: AgendaItem[] = [
  {
    id: 'appt-001',
    title: 'Agrocomercial Kist e Hemann',
    startTime: '2026-05-28T08:30:00-03:00',
    endTime: '2026-05-28T10:00:00-03:00',
    location: 'Agrocomercial Kist e Hemann - Unidade Santa Cruz do Sul',
    description: 'Demonstração Dante Safra',
    type: 'strategic'
  },
  {
    id: 'appt-002',
    title: 'Apresentação Cidades do Futuro',
    startTime: '2026-05-28T13:30:00-03:00',
    endTime: '2026-05-28T14:15:00-03:00',
    location: 'Prefeitura de Passo do Sobrado, RS',
    description: 'Apresentação do ecossistema e ferramentas de saúde',
    type: 'strategic'
  },
  {
    id: 'appt-003',
    title: 'Apresentação Cidades do futuro',
    startTime: '2026-05-28T14:30:00-03:00',
    endTime: '2026-05-28T15:30:00-03:00',
    location: 'Prefeitura de Vale Verde, RS',
    description: 'Pilar Educação - Retenção de Jovens',
    type: 'strategic'
  },
  {
    id: 'appt-004',
    title: 'Apresentação Cidades do futuro',
    startTime: '2026-05-29T13:30:00-03:00',
    endTime: '2026-05-29T14:30:00-03:00',
    location: 'Prefeitura de Ipê',
    description: 'Apresentação cidades do futuro',
    type: 'strategic'
  },
  {
    id: 'appt-005',
    title: 'Apresentação Cidades do futuro',
    startTime: '2026-06-01T09:00:00-03:00',
    endTime: '2026-06-01T10:30:00-03:00',
    location: 'Prefeitura de Vanini',
    description: 'Apresentação do ecossistema e ferramentas',
    type: 'strategic'
  }
];

export function getFormattedAgenda(): string {
  if (dailyAgenda.length === 0) return "Nenhum compromisso agendado.";
  
  const formatList = (items: AgendaItem[], label: string) => {
    if (items.length === 0) return `${label}: Nenhum compromisso agendado.`;
    const lines = items.map(item => {
      const dateObj = new Date(item.startTime);
      const dayStr = String(dateObj.getDate()).padStart(2, '0') + '/' + String(dateObj.getMonth() + 1).padStart(2, '0');
      const start = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
      const end = new Date(item.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
      return `- [${dayStr} às ${start} - ${end}] ${item.title} (${item.type}) no local "${item.location || 'Não especificado'}": ${item.description || ''}`;
    });
    return `${label}:\n${lines.join('\n')}`;
  };

  const todayEvents = dailyAgenda.filter(item => {
    const d = new Date(item.startTime);
    return d.getDate() === 27 && d.getMonth() === 4;
  });
  
  const tomorrowEvents = dailyAgenda.filter(item => {
    const d = new Date(item.startTime);
    return d.getDate() === 28 && d.getMonth() === 4;
  });

  const upcomingEvents = dailyAgenda.filter(item => {
    const d = new Date(item.startTime);
    return d.getDate() > 28 || d.getMonth() > 4;
  });

  return `${formatList(todayEvents, 'AGENDA DE HOJE (27/05/2026)')}

${formatList(tomorrowEvents, 'AGENDA DE AMANHÃ (28/05/2026)')}

${formatList(upcomingEvents, 'COMPROMISSOS FUTUROS')}`;
}
