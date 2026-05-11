/**
 * App Principal - Gerencia a aplicação e integra todos os componentes
 */

// Inicializa instâncias globais dos componentes
let dashboard = null;
let calendarInstance = null;
let sidebarInstance = null;

/**
 * Inicializa a aplicação
 */
function initApp() {
  // Renderiza o Dashboard na primeira carga
  initDashboard();

  // Renderiza o Calendário
  initCalendar();

  // Inicializa a Sidebar
  initSidebar();

  console.log('App inicializado com sucesso');
}

/**
 * Inicializa o Dashboard
 */
function initDashboard() {
  const container = document.getElementById('dashboard-container');
  if (!container) return;

  dashboard = new Dashboard('dashboard-container');

  // Adiciona cards de estatísticas
  dashboard.addCard({
    label: 'Espaços Livres',
    value: '4',
    icon: 'fa-check-circle',
    color: '#2a9a58',
    trend: { direction: 'up', value: '12' }
  });

  dashboard.addCard({
    label: 'Reservas Ativas',
    value: '3',
    icon: 'fa-calendar',
    color: '#1a56c4',
    trend: { direction: 'up', value: '8' }
  });

  dashboard.addCard({
    label: 'Em Manutenção',
    value: '1',
    icon: 'fa-wrench',
    color: '#c42828'
  });

  dashboard.addCard({
    label: 'Taxa Ocupação',
    value: '55%',
    icon: 'fa-chart-pie',
    color: '#c97810'
  });

  // Adiciona widgets
  dashboard.addWidget({
    title: 'Atividades Recentes',
    icon: 'fa-clock',
    content: renderActivityList()
  });

  dashboard.addWidget({
    title: 'Próximas Reservas',
    icon: 'fa-calendar-check',
    content: renderUpcomingReservations()
  });

  dashboard.render();
}

/**
 * Inicializa o Calendário
 */
function initCalendar() {
  const container = document.getElementById('calendar-container');
  if (!container) return;

  // Salva referência global para acesso de botões inline
  window.calendarInstance = new Calendar('calendar-container', {
    onDateSelect: (date) => {
      console.log('Data selecionada:', date);
      handleDateSelect(date);
    }
  });

  // Adiciona alguns eventos de exemplo
  const today = new Date();
  window.calendarInstance.addEvent(today, { title: 'Hoje', color: 'green' });
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  window.calendarInstance.addEvent(tomorrow, { title: 'Amanhã', color: 'blue' });
}

/**
 * Inicializa a Sidebar
 */
function initSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  window.sidebarInstance = new Sidebar('sidebar-container', {
    isOpen: false,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'fa-chart-line',
        active: false
      },
      {
        id: 'estufas',
        label: 'Estufas',
        icon: 'fa-leaf',
        active: true,
        submenu: [
          { label: 'Mapa', icon: 'fa-map' },
          { label: 'Lista', icon: 'fa-list' },
          { label: 'Filtros', icon: 'fa-filter' }
        ]
      },
      {
        id: 'reservas',
        label: 'Minhas Reservas',
        icon: 'fa-calendar-check',
        active: false,
        submenu: [
          { label: 'Ativas', icon: 'fa-circle-check' },
          { label: 'Pendentes', icon: 'fa-clock' },
          { label: 'Histórico', icon: 'fa-history' }
        ]
      },
      {
        id: 'calendario',
        label: 'Calendário',
        icon: 'fa-calendar-days',
        active: false
      },
      {
        id: 'relatorios',
        label: 'Relatórios',
        icon: 'fa-file-chart-line',
        active: false,
        submenu: [
          { label: 'Uso', icon: 'fa-chart-bar' },
          { label: 'Disponibilidade', icon: 'fa-chart-area' }
        ]
      }
    ],
    onItemClick: (item) => {
      console.log('Item clicado:', item);
      handleSidebarItemClick(item);
    }
  });
}

/**
 * Manipula clique em item da sidebar
 */
function handleSidebarItemClick(item) {
  const viewMap = {
    'dashboard': 'dashboard',
    'estufas': 'mapa',
    'reservas': 'reservas',
    'calendario': 'calendario'
  };

  const view = viewMap[item.id];
  if (view) {
    showView(view);
  }
  // Fecha a sidebar em mobile após seleção
  if (window.innerWidth <= 768) {
    window.sidebarInstance.toggle();
  }
}

/**
 * Manipula seleção de data no calendário
 */
function handleDateSelect(date) {
  const dateStr = Helpers.formatDate(date, 'DD/MM/YYYY');
  console.log('Data selecionada:', dateStr);
  
  // Aqui você pode adicionar lógica para filtrar reservas por data
  // ou executar outras ações baseadas na data selecionada
}

/**
 * Renderiza lista de atividades recentes
 */
function renderActivityList() {
  const activities = [
    {
      title: 'Reserva confirmada',
      desc: 'Casa de Vegetação 2',
      icon: 'fa-calendar-check',
      time: '2 horas atrás'
    },
    {
      title: 'Manutenção programada',
      desc: 'Campo Experimental 3',
      icon: 'fa-wrench',
      time: '5 horas atrás'
    },
    {
      title: 'Reserva liberada',
      desc: 'Câmara de Crescimento 5',
      icon: 'fa-check-circle',
      time: '1 dia atrás'
    }
  ];

  return `
    <div class="activity-list">
      ${activities.map(a => `
        <div class="activity-item">
          <div class="activity-icon" style="background: linear-gradient(135deg, #2a9a5820, #2a9a5840); color: #2a9a58;">
            <i class="fa-solid ${a.icon}"></i>
          </div>
          <div class="activity-content">
            <div class="activity-title">${a.title}</div>
            <div class="activity-time">${a.desc} · ${a.time}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Renderiza próximas reservas
 */
function renderUpcomingReservations() {
  const reservations = [
    {
      estufa: 'Casa de Vegetação 2',
      data: '12/05/2026',
      projeto: 'CRISPR-Soja'
    },
    {
      estufa: 'Campo Experimental 3',
      data: '15/05/2026',
      projeto: 'Biofortificação'
    },
    {
      estufa: 'Câmara de Crescimento 5',
      data: '18/05/2026',
      projeto: 'Resistência Fúngica'
    }
  ];

  return `
    <div class="activity-list">
      ${reservations.map(r => `
        <div class="activity-item">
          <div class="activity-icon" style="background: linear-gradient(135deg, #1a56c420, #1a56c440); color: #1a56c4;">
            <i class="fa-solid fa-calendar"></i>
          </div>
          <div class="activity-content">
            <div class="activity-title">${r.estufa}</div>
            <div class="activity-time">${r.data} · ${r.projeto}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Alterna sidebar em dispositivos móveis
 */
function toggleSidebar() {
  if (window.sidebarInstance) {
    window.sidebarInstance.toggle();
  }
}

/**
 * Inicializa quando o DOM está pronto
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Expõe funções globais para acesso de elementos inline
window.toggleSidebar = toggleSidebar;
window.initApp = initApp;
