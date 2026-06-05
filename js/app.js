/**
 * App — Inicialização e orquestração geral
 * Embrapa Cenargen
 */

// ─── Navegação ────────────────────────────────────────────────

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.getElementById('btn-nav-' + viewId);
  if (navBtn) navBtn.classList.add('active');

  if (viewId === 'reservas') renderReservasList();
  if (viewId === 'admin')    renderAdmin();
  closePopup();
}

// ─── User Dropdown ────────────────────────────────────────

function toggleDropdown() {
  document.getElementById('user-dropdown').classList.toggle('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#user-btn') && !e.target.closest('#user-dropdown'))
    document.getElementById('user-dropdown').classList.remove('open');
});

// ─── Modais ───────────────────────────────────────────────

function closeAll() {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('open'));
}

// ─── Toast ────────────────────────────────────────────────

function showToast(msg, type = 'info') {
  const ICONS = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const wrap  = document.getElementById('toast-wrap');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${ICONS[type] || ICONS.info}"></i> ${msg}`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; }, 3000);
  setTimeout(() => toast.remove(), 3300);
}

// ─── Init: Dashboard ──────────────────────────────────────

function initDashboard() {
  const dash = new Dashboard('dashboard-container');

  dash
    .addCard({ label: 'Espaços Livres',   value: '4',   icon: 'fa-circle-check', color: '#007A3D', trend: { direction: 'up', value: '12' } })
    .addCard({ label: 'Reservas Ativas',  value: '3',   icon: 'fa-calendar',     color: '#003DA5', trend: { direction: 'up', value: '8'  } })
    .addCard({ label: 'Em Manutenção',    value: '1',   icon: 'fa-wrench',       color: '#c42828' })
    .addCard({ label: 'Taxa de Ocupação', value: '55%', icon: 'fa-chart-pie',    color: '#b86b00' })
    .addWidget({ title: 'Atividades Recentes', icon: 'fa-clock',          content: _renderActivities() })
    .addWidget({ title: 'Próximas Reservas',   icon: 'fa-calendar-check', content: _renderUpcoming()   })
    .render();
}

function _renderActivities() {
  const items = [
    { title: 'Reserva confirmada',    desc: 'Casa de Vegetação 2',     icon: 'fa-calendar-check', time: '2 horas atrás' },
    { title: 'Manutenção programada', desc: 'Campo Experimental 3',    icon: 'fa-wrench',         time: '5 horas atrás' },
    { title: 'Reserva liberada',      desc: 'Câmara de Crescimento 5', icon: 'fa-circle-check',   time: '1 dia atrás'   },
  ];
  return `<div class="activity-list">${items.map(a => `
    <div class="activity-item">
      <div class="activity-icon" style="background:var(--accent-lt);color:var(--accent)">
        <i class="fa-solid ${a.icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${a.title}</div>
        <div class="activity-time">${a.desc} · ${a.time}</div>
      </div>
    </div>`).join('')}</div>`;
}

function _renderUpcoming() {
  const items = [
    { estufa: 'Casa de Vegetação 2',     data: '12/05/2026', projeto: 'CRISPR-Soja'        },
    { estufa: 'Campo Experimental 3',    data: '15/05/2026', projeto: 'Biofortificação'     },
    { estufa: 'Câmara de Crescimento 5', data: '18/05/2026', projeto: 'Resistência Fúngica' },
  ];
  return `<div class="activity-list">${items.map(r => `
    <div class="activity-item">
      <div class="activity-icon" style="background:var(--info-lt);color:var(--info)">
        <i class="fa-solid fa-calendar"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${r.estufa}</div>
        <div class="activity-time">${r.data} · ${r.projeto}</div>
      </div>
    </div>`).join('')}</div>`;
}

// ─── Init: Calendário ─────────────────────────────────────

function initCalendar() {
  window.calendarInstance = new Calendar('calendar-container', {
    onDateSelect(date) {
      document.getElementById('calendar-events').innerHTML =
        `<div style="text-align:center;color:var(--muted);font-size:12px;padding:20px 0">
           <i class="fa-solid fa-calendar-day" style="color:var(--accent);margin-bottom:6px;display:block"></i>
           ${date.toLocaleDateString('pt-BR')}
         </div>`;
    }
  });

  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  window.calendarInstance.addEvent(today,    { title: 'Hoje'   });
  window.calendarInstance.addEvent(tomorrow, { title: 'Amanhã' });
}

// ─── Init: Restaurar estado visual do mapa ───────────────

function initMapState() {
  Object.keys(ESTUFAS).forEach(id => updateEstufaOnMap(id));
}

// ─── Init geral ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  initCalendar();

  // Data mínima no formulário de reserva
  const dateInput = document.getElementById('reservar-data');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  // Fecha modal ao clicar fora
  document.querySelectorAll('.overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) closeAll(); });
  });

  // Inicia autenticação (login.js carregado após este script)
  if (typeof initAuth === 'function') initAuth();
});

// Expõe globalmente
window.showView       = showView;
window.toggleDropdown = toggleDropdown;
window.closeAll       = closeAll;
window.showToast      = showToast;
window.initMapState   = initMapState;
