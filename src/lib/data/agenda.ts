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

export function parseClientAgenda(clientItems: any[]): AgendaItem[] {
  return clientItems.map(item => {
    try {
      const [day, month, year] = item.data.split('/');
      const [hour, minute] = item.horario.split(':');
      // Format as ISO in America/Sao_Paulo timezone
      const isoStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00-03:00`;
      return {
        id: String(item.id),
        title: item.evento || item.assunto || 'Compromisso',
        startTime: isoStr,
        endTime: isoStr,
        location: item.local,
        description: `${item.assunto || ''} | Anfitrião: ${item.anfitriao || ''} | Status: ${item.status || ''}`,
        type: 'strategic'
      };
    } catch {
      return null;
    }
  }).filter((x): x is AgendaItem => x !== null);
}

export function getFormattedAgenda(customAgenda?: AgendaItem[]): string {
  const agendaToUse = customAgenda || dailyAgenda;
  if (agendaToUse.length === 0) return "Nenhum compromisso agendado.";
  
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

  const getLocalDateString = (d: Date) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(d);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = getLocalDateString(today);
  const tomorrowStr = getLocalDateString(tomorrow);

  const todayEvents = agendaToUse.filter(item => {
    const itemDate = getLocalDateString(new Date(item.startTime));
    return itemDate === todayStr;
  });
  
  const tomorrowEvents = agendaToUse.filter(item => {
    const itemDate = getLocalDateString(new Date(item.startTime));
    return itemDate === tomorrowStr;
  });

  const upcomingEvents = agendaToUse.filter(item => {
    const itemDate = getLocalDateString(new Date(item.startTime));
    return itemDate > tomorrowStr;
  });

  const formatDateLabel = (dStr: string) => {
    const [year, month, day] = dStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return `${formatList(todayEvents, `AGENDA DE HOJE (${formatDateLabel(todayStr)})`)}

${formatList(tomorrowEvents, `AGENDA DE AMANHÃ (${formatDateLabel(tomorrowStr)})`)}

${formatList(upcomingEvents, 'COMPROMISSOS FUTUROS')}`;
}
