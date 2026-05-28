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

function getLocalISOString(date: Date, hours: number, minutes: number): string {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  
  // Calculate timezone offset
  const offsetMinutes = d.getTimezoneOffset();
  const offsetSign = offsetMinutes > 0 ? '-' : '+';
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, '0');
  const offsetMins = String(absOffsetMinutes % 60).padStart(2, '0');
  
  // Format local parts
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = '00';
  
  return `${year}-${month}-${day}T${hh}:${mm}:${ss}${offsetSign}${offsetHours}:${offsetMins}`;
}

function getDynamicAgendaInternal() {
  const today = new Date();
  
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const inThreeDays = new Date();
  inThreeDays.setDate(today.getDate() + 3);

  const todayEvents: AgendaItem[] = [
    {
      id: 'appt-today-1',
      title: 'Reunião Estratégica com Empresa X',
      startTime: getLocalISOString(today, 9, 0),
      endTime: getLocalISOString(today, 10, 30),
      location: 'Sala de Comando Nexus',
      description: 'Discussão sobre expansão da infraestrutura e parcerias tecnológicas',
      type: 'meeting'
    },
    {
      id: 'appt-today-2',
      title: 'Análise de KPIs de Produção',
      startTime: getLocalISOString(today, 11, 0),
      endTime: getLocalISOString(today, 12, 0),
      location: 'Sala de Análise',
      description: 'Revisão dos índices de mérito e eficiência das células',
      type: 'work'
    }
  ];

  const tomorrowEvents: AgendaItem[] = [
    {
      id: 'appt-tomorrow-1',
      title: 'Apresentação Cidades do Futuro',
      startTime: getLocalISOString(tomorrow, 14, 0),
      endTime: getLocalISOString(tomorrow, 15, 30),
      location: 'Prefeitura de Vale Verde, RS',
      description: 'Apresentação do ecossistema e ferramentas de saúde',
      type: 'strategic'
    }
  ];

  const upcomingEvents: AgendaItem[] = [
    {
      id: 'appt-upcoming-1',
      title: 'Reunião Secretariado',
      startTime: getLocalISOString(inThreeDays, 9, 30),
      endTime: getLocalISOString(inThreeDays, 11, 0),
      location: 'Prefeitura de Passo do Sobrado, RS',
      description: 'Pilar Educação - Retenção de Jovens',
      type: 'meeting'
    }
  ];

  return { todayEvents, tomorrowEvents, upcomingEvents };
}

// Generate once at module load
const { todayEvents, tomorrowEvents, upcomingEvents } = getDynamicAgendaInternal();

export const dailyAgenda: AgendaItem[] = [...todayEvents, ...tomorrowEvents, ...upcomingEvents];

export function getFormattedAgenda(): string {
  if (dailyAgenda.length === 0) return "Nenhum compromisso agendado para hoje, amanhã ou futuro próximo.";
  
  const formatList = (items: AgendaItem[], label: string) => {
    if (items.length === 0) return `${label}: Nenhum compromisso agendado.`;
    const lines = items.map(item => {
      const dateObj = new Date(item.startTime);
      const dayStr = String(dateObj.getDate()).padStart(2, '0') + '/' + String(dateObj.getMonth() + 1).padStart(2, '0');
      const start = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const end = new Date(item.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `- [${dayStr} às ${start} - ${end}] ${item.title} (${item.type}) no local "${item.location || 'Não especificado'}": ${item.description || ''}`;
    });
    return `${label}:\n${lines.join('\n')}`;
  };

  return `${formatList(todayEvents, 'AGENDA DE HOJE')}

${formatList(tomorrowEvents, 'AGENDA DE AMANHÃ')}

${formatList(upcomingEvents, 'COMPROMISSOS FUTUROS')}`;
}
