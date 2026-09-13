/**
 * View: Mapa
 * Marcadores minimalistas (pontos) sobre a foto aérea + painel lateral de
 * detalhes que desliza da direita ao clicar numa estufa.
 */
import { ESTUFAS, STATUS_MAP, reservas } from '../data/estufas';
import type { Estufa } from '../types';

let activeEstufaId: string | null = null;

const _HS_STATUSES = ['livre', 'ocupada', 'reservada', 'manutencao'];

// ─── Helpers ──────────────────────────────────────────────

// Valores "ambientais" plausíveis e estáveis por estufa (só para exibição).
function _seed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}
function _envFor(id: string): { temp: number; umid: number } {
  const h = _seed(id);
  return { temp: 24 + (h % 7), umid: 55 + ((h >> 3) % 20) };
}
// Setor derivado do nome ("Casa de Vegetação A1" → "Setor A").
function _setorFor(estufa: Estufa): string {
  if (estufa.setor) return estufa.setor;
  const m = (estufa.nome.match(/([A-Z])\s*\d+\s*$/) || [])[1];
  return m ? ('Setor ' + m) : estufa.tipo;
}
function _fmtDataBR(d: string): string {
  if (!d) return '—';
  const p = d.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
}

const $ = (id: string): HTMLElement | null => document.getElementById(id);

// ─── Abrir / preencher painel ─────────────────────────────

function openPanel(id: string): void {
  const estufa = ESTUFAS[id];
  if (!estufa) return;
  activeEstufaId = id;

  const status = STATUS_MAP[estufa.status] ||
    { label: estufa.status, cls: 'pill-muted', icon: 'fa-circle' };

  // Marcador selecionado
  document.querySelectorAll('.estufa-hotspot.selected')
    .forEach((h) => h.classList.remove('selected'));
  const hs = document.querySelector(`.estufa-hotspot[data-id="${id}"]`);
  if (hs) hs.classList.add('selected');

  const panel = $('estufa-panel');
  if (!panel) return;
  const wasOpen = panel.classList.contains('open');

  // Classe de status controla a cor do painel (banner, ícones, tipo)
  panel.className = 'estufa-panel st-' + estufa.status + (wasOpen ? ' open' : '');

  // Banner
  const panelIcon = $('panel-icon');
  if (panelIcon) panelIcon.className = 'fa-solid ' + estufa.icon;
  const panelCode = $('panel-code');
  if (panelCode) panelCode.textContent = id;
  const panelStatus = $('panel-status');
  if (panelStatus) panelStatus.innerHTML = `<i class="fa-solid ${status.icon}"></i> ${status.label}`;

  // Cabeçalho
  const setText = (elId: string, value: string) => { const el = $(elId); if (el) el.textContent = value; };
  setText('panel-name', estufa.nome);
  setText('panel-type', estufa.tipo);
  setText('panel-desc', estufa.desc);

  // Info
  const env = _envFor(id);
  setText('panel-loc', _setorFor(estufa) + ' · Cenargen');
  setText('panel-area', estufa.area);
  setText('panel-cap', `${estufa.cap} bancadas`);
  setText('panel-cult', 'Hortaliças, grãos e ornamentais');
  setText('panel-cond', `${env.temp} °C · ${env.umid}% UR`);
  setText('panel-disp',
    estufa.status === 'livre'      ? 'Disponível agora' :
    estufa.status === 'manutencao' ? 'Em manutenção'    :
    estufa.status === 'ocupada'    ? 'Em uso'           : 'Sob reserva');

  // Capacidade teórica de vasos (por tamanho)
  const vbox = $('panel-vasos');
  if (vbox) {
    if (estufa.vasos) {
      vbox.style.display = '';
      setText('panel-vaso3', String(estufa.vasos.c3));
      setText('panel-vaso5', String(estufa.vasos.c5));
      setText('panel-vaso10', String(estufa.vasos.c10));
    } else {
      vbox.style.display = 'none';
    }
  }

  // Reserva vinculada (se houver)
  const reserva = reservas.find((r) => r.estufaId === id && r.status !== 'cancelada') || null;
  const rbox = $('panel-reserva');
  if (rbox) {
    if (reserva) {
      rbox.style.display = '';
      setText('panel-reserva-proj', reserva.projeto);
      const rs = STATUS_MAP[reserva.status];
      setText('panel-reserva-meta',
        `${_fmtDataBR(reserva.data)} · ${reserva.qtd} vasos/estantes · ${rs ? rs.label : reserva.status}`);
    } else {
      rbox.style.display = 'none';
    }
  }

  // Botão de ação
  const btn = $('panel-action-btn') as HTMLButtonElement | null;
  if (btn) {
    btn.style.cssText = 'width:100%;justify-content:center';
    btn.disabled = false;

    if (estufa.status === 'livre') {
      btn.innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Reservar esta estufa';
      btn.className = 'btn btn-primary';
      btn.onclick = () => window.openReservarModal();
    } else if (estufa.status === 'reservada' && reserva) {
      btn.innerHTML = '<i class="fa-solid fa-eye"></i> Ver detalhes da reserva';
      btn.className = 'btn btn-ghost';
      btn.onclick = () => window.verReserva(reserva.id);
    } else if (estufa.status === 'manutencao') {
      btn.innerHTML = '<i class="fa-solid fa-wrench"></i> Em manutenção';
      btn.className = 'btn btn-ghost';
      btn.disabled = true;
      btn.onclick = null;
    } else {
      // ocupada, ou reservada sem registro vinculado
      btn.innerHTML = `<i class="fa-solid ${status.icon}"></i> ${status.label}`;
      btn.className = 'btn btn-ghost';
      btn.disabled = true;
      btn.onclick = null;
    }
  }

  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

function closePanel(): void {
  const panel = $('estufa-panel');
  if (panel) {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
  document.querySelectorAll('.estufa-hotspot.selected')
    .forEach((h) => h.classList.remove('selected'));
  activeEstufaId = null;
}

// Aliases de compatibilidade (onclick nos hotspots e chamadas antigas)
function openPopup(id: string): void { openPanel(id); }
function closePopup(): void { closePanel(); }

// ─── Atualização visual do marcador ──────────────────────

function updateEstufaOnMap(id: string): void {
  const hs = document.querySelector(`.estufa-hotspot[data-id="${id}"]`);
  if (!hs) return;
  const st = ESTUFAS[id].status;
  _HS_STATUSES.forEach((s) => hs.classList.remove('st-' + s));
  hs.classList.add('st-' + st);

  // Se o painel estiver aberto nesta estufa, reflete a mudança
  if (activeEstufaId === id && $('estufa-panel')?.classList.contains('open')) {
    openPanel(id);
  }
}

// ─── Layer de hotspots cobre a imagem ────────────────────

function syncHotspots(): void {
  const img = $('map-photo') as HTMLImageElement | null;
  const overlay = $('map-hotspots');
  if (!img || !overlay || !img.naturalWidth) return;
  overlay.style.left = '0px';
  overlay.style.top = '0px';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
}
window.addEventListener('resize', syncHotspots);

// ─── Fechar ao clicar fora / Esc ─────────────────────────

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('.estufa-hotspot')) return;   // o marcador abre/troca
  if (target.closest('#estufa-panel')) return;     // clique dentro do painel
  const panel = $('estufa-panel');
  if (panel && panel.classList.contains('open')) closePanel();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel();
});

// Acesso interno ao id ativo para outros modulos (reservas.ts)
export function getActiveEstufaId(): string | null {
  return activeEstufaId;
}

// ─── Expõe globalmente ───────────────────────────────────

window.openPanel = openPanel;
window.closePanel = closePanel;
window.openPopup = openPopup;
window.closePopup = closePopup;
window.updateEstufaOnMap = updateEstufaOnMap;
window.syncHotspots = syncHotspots;

export { openPanel, closePanel, openPopup, closePopup, updateEstufaOnMap, syncHotspots };
