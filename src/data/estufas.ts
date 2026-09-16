import type { Estufas, Reserva, StatusInfo } from '../types';
import { getCasasVegetacao, getReservas as apiGetReservas } from '../services/api';

export const ESTUFAS: Estufas = {};
export const reservas: Reserva[] = [];
export const RESERVA_ID_REAL: Record<string, number> = {};

export const STATUS_MAP: Record<string, StatusInfo> = {
  livre: { label: 'Livre', cls: 'pill-green', icon: 'fa-circle-check' },
  ocupada: { label: 'Ocupada', cls: 'pill-warn', icon: 'fa-house-leaf' },
  reservada: { label: 'Reservada', cls: 'pill-info', icon: 'fa-calendar' },
  manutencao: { label: 'Manutenção', cls: 'pill-danger', icon: 'fa-wrench' },
  ativa: { label: 'Ativa', cls: 'pill-green', icon: 'fa-circle-check' },
  pendente: { label: 'Pendente', cls: 'pill-warn', icon: 'fa-clock' },
  cancelada: { label: 'Cancelada', cls: 'pill-danger', icon: 'fa-xmark' },
};

function calcularStatus(casaId: string, ativa: boolean): Estufas[string]['status'] {
  if (!ativa) return 'manutencao';
  const hoje = new Date().toISOString().slice(0, 10);
  const temReservaHoje = reservas.some(
    (r) => r.estufaId === casaId && r.status !== 'cancelada' && r.data === hoje
  );
  return temReservaHoje ? 'ocupada' : 'livre';
}

export const CASA_ID_REAL: Record<string, number> = {};

export async function loadState(): Promise<void> {
  try {
    const [casasResponse, reservasResponse] = await Promise.all([
      getCasasVegetacao(),
      apiGetReservas(),
    ]);

    Object.keys(ESTUFAS).forEach((k) => delete ESTUFAS[k]);
    reservas.length = 0;

    const casasData = (casasResponse.data ?? casasResponse)
      .slice()
      .sort((a: any, b: any) => a.id - b.id);

    const idParaChave: Record<number, string> = {};
    casasData.forEach((c: any, index: number) => {
      const chave = `E${String(index + 1).padStart(2, '0')}`;
      idParaChave[c.id] = chave;
      CASA_ID_REAL[chave] = c.id; // guarda o id real pra usar depois no POST de reserva

      ESTUFAS[chave] = {
        nome: c.descricao,
        tipo: 'Casa de vegetação',
        setor: c.localizacao ?? '—',
        status: calcularStatus(chave, c.ativa),
        area: c.area_m2 ? `${c.area_m2} m²` : '—',
        cap: c.capacidade ?? 0,
        icon: 'fa-leaf',
        desc: c.obs ?? '',
      };
    });

    const reservasData = reservasResponse.data ?? reservasResponse;
    reservasData.forEach((r: any) => {
      const chaveLocal = `R${String(r.id).padStart(3, '0')}`;
      RESERVA_ID_REAL[chaveLocal] = r.id;

      reservas.push({
        id: chaveLocal,
        estufaId: idParaChave[r.casa_vegetacao_id] ?? `E${String(r.casa_vegetacao_id).padStart(2, '0')}`,
        data: r.data_inicio?.slice(0, 10) ?? '',
        dataFim: r.data_fim?.slice(0, 10) ?? '',
        qtd: 0,
        projeto: r.projeto?.codigo ?? String(r.projeto_id ?? ''),
        pesquisador: r.funcionario?.nome ?? '—',
        finalidade: r.finalidade ?? '',
        status: String(r.status ?? 'ATIVA').toLowerCase() === 'cancelada' ? 'cancelada' : 'ativa',
      });
    });
  } catch (e) {
    console.error('[Cenargen] Erro ao carregar dados da API:', e);
  }
}

export function saveState(): void {
  console.warn('[Cenargen] saveState() está obsoleto — os dados agora vêm da API.');
}

window.ESTUFAS = ESTUFAS;
window.reservas = reservas;
window.STATUS_MAP = STATUS_MAP;
window.saveState = saveState;