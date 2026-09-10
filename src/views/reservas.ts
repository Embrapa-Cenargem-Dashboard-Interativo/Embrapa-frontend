/**
 * View: Reservas
 * Modal de criar reserva, modal de ver reserva, lista de reservas.
 */
import { ESTUFAS, STATUS_MAP, reservas, saveState } from '../data/estufas';
import { getActiveEstufaId, updateEstufaOnMap, closePopup } from './mapa';

let activeReservaId: string | null = null;

const $ = (id: string): HTMLElement | null => document.getElementById(id);

// ─── Helper ───────────────────────────────────────────────

function _pill(statusKey: string): string {
  const s = STATUS_MAP[statusKey] || { label: statusKey, cls: 'pill-muted', icon: 'fa-circle' };
  return `<span class="pill ${s.cls}"><i class="fa-solid ${s.icon}" style="font-size:8px"></i>${s.label}</span>`;
}

// ─── Modal: Reservar ──────────────────────────────────────

function openReservarModal(): void {
  const activeEstufaId = getActiveEstufaId();
  if (!activeEstufaId) return;

  const estufa = ESTUFAS[activeEstufaId];
  if (estufa.status !== 'livre') {
    window.showToast('Este espaço não está disponível', 'error');
    return;
  }

  const status = STATUS_MAP[estufa.status];
  const setHtml = (id: string, html: string) => { const el = $(id); if (el) el.innerHTML = html; };
  const setText = (id: string, text: string) => { const el = $(id); if (el) el.textContent = text; };
  const setValue = (id: string, value: string) => { const el = $(id) as HTMLInputElement | null; if (el) el.value = value; };

  setHtml('reservar-img-icon', `<i class="fa-solid ${estufa.icon}"></i>`);
  const badge = $('reservar-badge');
  if (badge) {
    badge.innerHTML = `<i class="fa-solid ${status.icon}" style="font-size:8px"></i> ${status.label}`;
    badge.className = `pill ${status.cls}`;
  }
  setText('reservar-title', estufa.nome);
  setText('reservar-desc', estufa.desc);
  setText('reservar-area', estufa.area);
  setText('reservar-cap', `${estufa.cap} bancadas`);
  setText('reservar-limite', `Limite: ${estufa.cap}`);
  setValue('reservar-data', '');
  setValue('reservar-qtd', '');
  setValue('reservar-proj', '');

  $('overlay-reservar')?.classList.add('open');
  closePopup();
}

function confirmarReserva(): void {
  const activeEstufaId = getActiveEstufaId();
  if (!activeEstufaId) return;

  const data = ($('reservar-data') as HTMLInputElement | null)?.value || '';
  const qtd = ($('reservar-qtd') as HTMLInputElement | null)?.value || '';
  const proj = ($('reservar-proj') as HTMLInputElement | null)?.value || '';

  if (!data || !qtd || !proj) {
    window.showToast('Preencha todos os campos', 'error');
    return;
  }

  const estufa = ESTUFAS[activeEstufaId];
  if (+qtd > estufa.cap) {
    window.showToast(`Limite máximo é ${estufa.cap} vasos/estantes`, 'error');
    return;
  }

  const newId = 'R' + String(reservas.length + 1).padStart(3, '0');
  reservas.push({ id: newId, estufaId: activeEstufaId, data, qtd: +qtd, projeto: proj, status: 'pendente' });

  estufa.status = 'reservada';
  updateEstufaOnMap(activeEstufaId);
  saveState();
  window.refreshDashboard?.();

  window.closeAll();
  window.showToast('Reserva realizada com sucesso!', 'success');
}

// ─── Modal: Ver Reserva ───────────────────────────────────

function verReserva(id: string): void {
  activeReservaId = id;
  const reserva = reservas.find((r) => r.id === id);
  if (!reserva) return;

  const estufa = ESTUFAS[reserva.estufaId];
  const status = STATUS_MAP[reserva.status] || { label: reserva.status, cls: 'pill-muted', icon: 'fa-circle' };
  const setHtml = (elId: string, html: string) => { const el = $(elId); if (el) el.innerHTML = html; };
  const setText = (elId: string, text: string) => { const el = $(elId); if (el) el.textContent = text; };

  setHtml('ver-img-icon', `<i class="fa-solid ${estufa.icon}"></i>`);
  const badge = $('ver-badge');
  if (badge) {
    badge.innerHTML = `<i class="fa-solid ${status.icon}" style="font-size:8px"></i> ${status.label}`;
    badge.className = `pill ${status.cls}`;
  }
  setText('ver-title', estufa.nome);
  setText('ver-desc', estufa.desc);
  setText('ver-data', _fmtDate(reserva.data));
  setText('ver-qtd', `${reserva.qtd} vasos/estantes`);
  setText('ver-proj', reserva.projeto);

  $('overlay-ver-reserva')?.classList.add('open');
}

function cancelarReservaModal(): void {
  const reserva = reservas.find((r) => r.id === activeReservaId);
  if (reserva) {
    reserva.status = 'cancelada';
    ESTUFAS[reserva.estufaId].status = 'livre';
    updateEstufaOnMap(reserva.estufaId);
    saveState();
  }
  window.closeAll();
  if (typeof window.refreshDashboard === 'function') window.refreshDashboard();
  else renderReservasList();
  window.showToast('Reserva cancelada', 'info');
}

// ─── Lista de Reservas ────────────────────────────────────

function renderReservasList(): void {
  const list = $('reservas-list');
  if (!list) return;
  const ativos = reservas.filter((r) => r.status !== 'cancelada');

  if (!ativos.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-calendar-check"></i></div>
        <div class="empty-text">Nenhuma reserva encontrada.<br>
          Clique em uma estufa no mapa para reservar.</div>
      </div>`;
    return;
  }

  const THUMB_BG: Record<string, string> = {
    livre:      'var(--accent-lt)',
    ocupada:    'var(--warn-lt)',
    reservada:  'var(--info-lt)',
    manutencao: 'var(--danger-lt)',
  };

  list.innerHTML = ativos.map((r) => {
    const estufa = ESTUFAS[r.estufaId];
    return `
      <div class="reserva-card" onclick="verReserva('${r.id}')">
        <div class="reserva-thumb" style="background:${THUMB_BG[estufa.status] || 'var(--accent-lt)'}">
          <i class="fa-solid ${estufa.icon}"></i>
        </div>
        <div class="reserva-info">
          <div class="reserva-name">${estufa.nome}</div>
          <div class="reserva-sub">
            <i class="fa-solid fa-flask" style="margin-right:4px;color:var(--muted2)"></i>${r.projeto}
          </div>
          <div class="reserva-sub" style="margin-top:3px">
            <i class="fa-solid fa-calendar" style="margin-right:4px;color:var(--muted2)"></i>${_fmtDate(r.data)} · ${r.qtd} vasos/estantes
          </div>
        </div>
        <div class="reserva-right">
          ${_pill(r.status)}
          <span style="font-size:11px;color:var(--muted)">${r.id}</span>
        </div>
      </div>`;
  }).join('');
}

// ─── Helpers ──────────────────────────────────────────────

function _fmtDate(d: string): string {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// Expõe globalmente
window.openReservarModal = openReservarModal;
window.confirmarReserva = confirmarReserva;
window.verReserva = verReserva;
window.cancelarReservaModal = cancelarReservaModal;
window.renderReservasList = renderReservasList;

export { openReservarModal, confirmarReserva, verReserva, cancelarReservaModal, renderReservasList };
