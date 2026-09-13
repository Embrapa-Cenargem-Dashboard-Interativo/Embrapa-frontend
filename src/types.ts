/**
 * Tipos compartilhados do sistema Embrapa Cenargen.
 */

export type EstufaStatus = 'livre' | 'ocupada' | 'reservada' | 'manutencao';

export type ReservaStatus = 'ativa' | 'pendente' | 'cancelada';

/** Chave usada no STATUS_MAP: status de estufa ou de reserva. */
export type StatusKey = EstufaStatus | ReservaStatus;

export type PerfilUsuario = 'admin' | 'pesquisador';

/** Capacidade teórica (aproximada) de vasos por tamanho. */
export interface VasosCapacidade {
  c3: number;   // vasos de 3 cm
  c5: number;   // vasos de 5 cm
  c10: number;  // vasos de 10 cm
}

export interface Estufa {
  nome: string;
  tipo: string;
  setor?: string;
  status: EstufaStatus;
  area: string;
  cap: number;
  icon: string;
  desc: string;
  vasos?: VasosCapacidade;
}

/** Mapa de estufas indexado pelo código (ex.: "E01"). */
export type Estufas = Record<string, Estufa>;

export interface Reserva {
  id: string;
  estufaId: string;
  data: string; // formato YYYY-MM-DD
  qtd: number;
  projeto: string;
  status: ReservaStatus;
}

export interface Usuario {
  id: string;
  name: string;
  role: PerfilUsuario;
  login: string;
  senha: string;
}

export interface StatusInfo {
  label: string;
  cls: string;
  icon: string;
}

export interface CardTrend {
  direction: 'up' | 'down';
  value: number;
}

export interface DashboardCardData {
  label: string;
  value: string;
  icon?: string;
  color?: string;
  trend?: CardTrend;
}

export interface CalendarEvent {
  title: string;
  estufa: string;
  status: ReservaStatus;
}

export interface CalendarOptions {
  events?: Record<string, CalendarEvent[]>;
  onDateSelect?: (date: Date) => void;
}
