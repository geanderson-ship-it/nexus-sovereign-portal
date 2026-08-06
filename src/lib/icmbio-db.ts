import fs from 'fs';
import path from 'path';
import { saveAtenaMemory, searchAtenaMemories } from './atena-db';

export interface ICMBioBooking {
  id: number;
  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
  partnerCompany: string; // Órgão ou Empresa do parceiro
  productName: string;   // Assunto / Produto / Trilha / Evento
  selectedDate: string;  // Formato DD/MM/AAAA
  selectedTime: string;  // Formato HH:MM
  reason: string;        // Justificativa / Finalidade do agendamento
  status: 'Confirmado' | 'Pendente' | 'Cancelado';
  cancelReason?: string;
  cancelCategory?: 'Tempo' | 'Produto' | 'Outro';
  cancelNotes?: string;
  // Campos de Embarcações (Operadores Terceiros)
  vesselName?: string;
  vesselCaptain?: string;
  vesselCapacity?: string;
  vesselAuthNumber?: string;
  captainLicenseNumber?: string;
  captainLicenseExpiry?: string;
  captainLicenseIssuer?: string;
  // Outros segmentos (Trilhas, Mergulho, Voos)
  segment?: string;
  guideName?: string;
  guideCadastur?: string;
  groupSize?: string;
  trailName?: string;
  diveInstructorId?: string;
  diveSpot?: string;
  flightSpot?: string;
  createdAt: string;
  updatedAt: string;
}

const AGENDA_DB_PATH = path.join(process.cwd(), 'src/lib/data/icmbio_agenda_db.json');
const BLOCKED_DB_PATH = path.join(process.cwd(), 'src/lib/data/icmbio_blocked_dates.json');

// Inicializa a lista padrão se o arquivo não existir
const INITIAL_BOOKINGS: ICMBioBooking[] = [
  {
    id: 1722880000000,
    partnerName: 'Fernanda Lima',
    partnerEmail: 'fernanda.lima@icmbio.gov.br',
    partnerPhone: '(81) 99876-5432',
    partnerCompany: 'ICMBio Fernando de Noronha',
    productName: 'Trilha do Atalaia',
    selectedDate: '10/08/2026',
    selectedTime: '09:00',
    reason: 'Alinhamento de monitoramento ecológico anual com voluntários.',
    status: 'Confirmado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 1722880000001,
    partnerName: 'Roberto Souza',
    partnerEmail: 'roberto.souza@eco-partner.org',
    partnerPhone: '(11) 98888-1111',
    partnerCompany: 'EcoPartners NGO',
    productName: 'Visitação de Educação Ambiental',
    selectedDate: '10/08/2026',
    selectedTime: '14:00',
    reason: 'Planejamento de visitas guiadas de escolas públicas da região.',
    status: 'Confirmado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Ler arquivos locais
function readLocalBookings(): ICMBioBooking[] {
  try {
    if (!fs.existsSync(AGENDA_DB_PATH)) {
      const dir = path.dirname(AGENDA_DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(AGENDA_DB_PATH, JSON.stringify(INITIAL_BOOKINGS, null, 2), 'utf8');
      return INITIAL_BOOKINGS;
    }
    const content = fs.readFileSync(AGENDA_DB_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[ICMBio DB] Erro ao ler agendamentos locais:', err);
    return INITIAL_BOOKINGS;
  }
}

function writeLocalBookings(bookings: ICMBioBooking[]) {
  try {
    const dir = path.dirname(AGENDA_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AGENDA_DB_PATH, JSON.stringify(bookings, null, 2), 'utf8');
  } catch (err) {
    console.error('[ICMBio DB] Erro ao escrever agendamentos locais:', err);
  }
}

export function readLocalBlocked(): string[] {
  try {
    if (!fs.existsSync(BLOCKED_DB_PATH)) {
      const dir = path.dirname(BLOCKED_DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(BLOCKED_DB_PATH, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const content = fs.readFileSync(BLOCKED_DB_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[ICMBio DB] Erro ao ler datas bloqueadas:', err);
    return [];
  }
}

function writeLocalBlocked(dates: string[]) {
  try {
    const dir = path.dirname(BLOCKED_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BLOCKED_DB_PATH, JSON.stringify(dates, null, 2), 'utf8');
  } catch (err) {
    console.error('[ICMBio DB] Erro ao escrever datas bloqueadas:', err);
  }
}

// Sincronizar e recuperar agendamentos (Local + Cloud DynamoDB backup)
export async function getICMBioBookings(): Promise<ICMBioBooking[]> {
  const localItems = readLocalBookings();

  try {
    const cloudPromise = searchAtenaMemories('icmbio-global-agenda', 'icmbio-appointment');
    const timeoutPromise = new Promise<any[]>((_, reject) =>
      setTimeout(() => reject(new Error('DynamoDB Timeout')), 1200)
    );

    const memories = await Promise.race([cloudPromise, timeoutPromise]);
    const cloudItems: ICMBioBooking[] = memories.map(m => {
      try {
        return JSON.parse(m.conteudo) as ICMBioBooking;
      } catch {
        return null;
      }
    }).filter((x): x is ICMBioBooking => x !== null);

    // Mesclar local com nuvem priorizando atualizações mais recentes
    const combinedMap = new Map<number, ICMBioBooking>();
    localItems.forEach(item => combinedMap.set(item.id, item));
    cloudItems.forEach(item => {
      const existing = combinedMap.get(item.id);
      if (!existing || new Date(item.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
        combinedMap.set(item.id, item);
      }
    });

    const sortedResult = Array.from(combinedMap.values()).sort((a, b) => {
      const [d1, m1, y1] = a.selectedDate.split('/');
      const [d2, m2, y2] = b.selectedDate.split('/');
      const date1 = new Date(`${y1}-${m1}-${d1}T${a.selectedTime}:00`);
      const date2 = new Date(`${y2}-${m2}-${d2}T${b.selectedTime}:00`);
      return date1.getTime() - date2.getTime();
    });

    writeLocalBookings(sortedResult);
    return sortedResult;
  } catch (err: any) {
    console.warn('[ICMBio DB] Sincronização em nuvem lenta/erro. Usando cache local.', err.message || err);
    return localItems.sort((a, b) => {
      const [d1, m1, y1] = a.selectedDate.split('/');
      const [d2, m2, y2] = b.selectedDate.split('/');
      const date1 = new Date(`${y1}-${m1}-${d1}T${a.selectedTime}:00`);
      const date2 = new Date(`${y2}-${m2}-${d2}T${b.selectedTime}:00`);
      return date1.getTime() - date2.getTime();
    });
  }
}

// Salvar agendamento
export async function saveICMBioBooking(booking: ICMBioBooking): Promise<boolean> {
  const localItems = readLocalBookings();
  const existingIndex = localItems.findIndex(item => item.id === booking.id);
  
  const updatedBooking = {
    ...booking,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex > -1) {
    localItems[existingIndex] = updatedBooking;
  } else {
    localItems.push(updatedBooking);
  }
  writeLocalBookings(localItems);

  // Sincronização em nuvem secundária
  saveAtenaMemory({
    userId: 'icmbio-global-agenda',
    categoria: 'icmbio-appointment',
    conteudo: JSON.stringify(updatedBooking)
  }).catch(err => {
    console.warn('[ICMBio DB] Falha ao persistir DynamoDB em background:', err);
  });

  return true;
}

// Excluir agendamento
export async function deleteICMBioBooking(id: number): Promise<boolean> {
  const localItems = readLocalBookings().filter(item => item.id !== id);
  writeLocalBookings(localItems);
  return true;
}

// Datas bloqueadas
export async function getBlockedDates(): Promise<string[]> {
  return readLocalBlocked();
}

export async function saveBlockedDate(date: string, blocked: boolean): Promise<boolean> {
  const blockedDates = readLocalBlocked();
  let updated: string[];
  if (blocked) {
    if (blockedDates.includes(date)) return true;
    updated = [...blockedDates, date];
  } else {
    updated = blockedDates.filter(d => d !== date);
  }
  writeLocalBlocked(updated);
  return true;
}

export interface ICMBioSettings {
  dailyOperatorLimit: number;
}

const SETTINGS_PATH = path.join(process.cwd(), 'src/lib/data/icmbio_settings.json');

export function getICMBioSettings(): ICMBioSettings {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      const defaultSettings: ICMBioSettings = { dailyOperatorLimit: 20 };
      const dir = path.dirname(SETTINGS_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaultSettings, null, 2), 'utf8');
      return defaultSettings;
    }
    const content = fs.readFileSync(SETTINGS_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[ICMBio DB] Erro ao ler configurações:', err);
    return { dailyOperatorLimit: 20 };
  }
}

export function saveICMBioSettings(settings: ICMBioSettings): boolean {
  try {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[ICMBio DB] Erro ao salvar configurações:', err);
    return false;
  }
}
