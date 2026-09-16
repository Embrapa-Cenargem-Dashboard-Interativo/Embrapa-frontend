/**
 * App — Inicialização e orquestração geral
 * Embrapa Cenargen
 */
import { ESTUFAS, reservas } from './data/estufas';
import { Calendar } from './components/Calendar';
import { Dashboard } from './components/Dashboard';
import { renderHotspots, updateEstufaOnMap, closePopup } from './views/mapa';
import { renderReservasList } from './views/reservas';
import { renderAdmin } from './views/admin';
import { initAuth } from './views/login';

const $ = (id: string): HTMLElement | null => document.getElementById(id);

// ─── Navegação ────────────────────────────────────────────────

function showView(viewId: string): void {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  const target = $('view-' + viewId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  const navBtn = $('btn-nav-' + viewId);
  if (navBtn) navBtn.classList.add('active');

  if (viewId === 'dashboard') refreshDashboard();
  if (viewId === 'admin') renderAdmin();
  closePopup();
}

// ─── User Dropdown ────────────────────────────────────────

function toggleDropdown(): void {
  $('user-dropdown')?.classList.toggle('open');
}

function openDocs(): void {
  $('user-dropdown')?.classList.remove('open');
  $('overlay-docs')?.classList.add('open');
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (!target.closest('#user-btn') && !target.closest('#user-dropdown')) {
    $('user-dropdown')?.classList.remove('open');
  }
});

// ─── Modais ───────────────────────────────────────────────

function closeAll(): void {
  document.querySelectorAll('.overlay').forEach((o) => o.classList.remove('open'));
}

// ─── Toast ────────────────────────────────────────────────

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'info'): void {
  const ICONS: Record<string, string> = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const wrap = $('toast-wrap');
  if (!wrap) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${ICONS[type] || ICONS.info}"></i> ${msg}`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; }, 3000);
  setTimeout(() => toast.remove(), 3300);
}

// ─── Init: Dashboard ──────────────────────────────────────

function initDashboard(): void {
  renderDashboardCards();
  renderReservasList();
}

// Recalcula os KPIs a partir dos dados reais (ESTUFAS + reservas)
function renderDashboardCards(): void {
  const ids = Object.keys(ESTUFAS);
  const total = ids.length;
  const livres = ids.filter((id) => ESTUFAS[id].status === 'livre').length;
  const manut = ids.filter((id) => ESTUFAS[id].status === 'manutencao').length;
  const ativas = reservas.filter((r) => r.status !== 'cancelada').length;
  const taxa = total ? Math.round((total - livres) / total * 100) : 0;

  new Dashboard('dashboard-cards')
    .addCard({ label: 'Espaços Livres',   value: String(livres), icon: 'fa-circle-check', color: '#007A3D' })
    .addCard({ label: 'Reservas Ativas',  value: String(ativas), icon: 'fa-calendar',     color: '#003DA5' })
    .addCard({ label: 'Em Manutenção',    value: String(manut),  icon: 'fa-wrench',       color: '#c42828' })
    .addCard({ label: 'Taxa de Ocupação', value: taxa + '%',     icon: 'fa-chart-pie',    color: '#b86b00' })
    .render();
}

// Atualiza tudo que depende de reservas/estufas (chamado após reservar/cancelar)
function refreshDashboard(): void {
  renderDashboardCards();
  renderReservasList();
  rebuildCalendarEvents();
}

// ─── Init: Calendário ─────────────────────────────────────

function initCalendar(): void {
  window.calendarInstance = new Calendar('calendar-container', {
    onDateSelect(date: Date) { renderDayEvents(date); },
  });
  rebuildCalendarEvents();
}

// Marca no calendário as datas que possuem reservas
function rebuildCalendarEvents(): void {
  if (!window.calendarInstance) return;
  window.calendarInstance.events = {};
  reservas.filter((r) => r.status !== 'cancelada').forEach((r) => {
    const [y, m, d] = r.data.split('-').map(Number);
    const estufa = ESTUFAS[r.estufaId];
    window.calendarInstance!.addEvent(new Date(y, m - 1, d), {
      title: r.projeto,
      estufa: estufa ? estufa.nome : r.estufaId,
      status: r.status,
    });
  });
}

// Lista os eventos do dia selecionado no painel lateral
function renderDayEvents(date: Date): void {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const evs = (window.calendarInstance?.events[key] || []);
  const box = $('calendar-events');
  if (!box) return;

  if (!evs.length) {
    box.innerHTML =
      `<div style="text-align:center;color:var(--muted);font-size:12px;padding:14px 0">
         <i class="fa-solid fa-calendar-day" style="color:var(--accent-md);margin-bottom:6px;display:block;font-size:18px"></i>
         Nenhuma reserva em ${date.toLocaleDateString('pt-BR')}
       </div>`;
    return;
  }

  box.innerHTML = `<div class="activity-list">${evs.map((e) => `
    <div class="activity-item">
      <div class="activity-icon" style="background:var(--accent-lt);color:var(--accent)">
        <i class="fa-solid fa-calendar-day"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${e.estufa}</div>
        <div class="activity-time">${e.title}</div>
      </div>
    </div>`).join('')}</div>`;
}

// ─── Init: Restaurar estado visual do mapa ───────────────

function initMapState(): void {
  renderHotspots();
  Object.keys(ESTUFAS).forEach((id) => updateEstufaOnMap(id));
}

// ─── Init geral ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  initCalendar();

  // Data mínima no formulário de reserva
  const dateInput = $('reservar-data') as HTMLInputElement | null;
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  // Fecha modal ao clicar fora
  document.querySelectorAll('.overlay').forEach((o) => {
    o.addEventListener('click', (e) => { if (e.target === o) closeAll(); });
  });

  // Inicia autenticação
  initAuth();
});

// Expõe globalmente
window.showView = showView;
window.toggleDropdown = toggleDropdown;
window.openDocs = openDocs;
window.closeAll = closeAll;
window.showToast = showToast;
window.initMapState = initMapState;
window.renderDashboardCards = renderDashboardCards;
window.refreshDashboard = refreshDashboard;
