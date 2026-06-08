/**
 * Componente Dashboard
 * Renderiza os cards de métricas (KPIs) do painel.
 */
class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cards = [];
  }

  addCard(card) { this.cards.push(card); return this; }

  render() {
    this.container.innerHTML = `
      <div class="dashboard-grid">
        ${this.cards.map(c => this._renderCard(c)).join('')}
      </div>`;
  }

  _renderCard(card) {
    const color = card.color || 'var(--accent)';
    const trendHtml = card.trend
      ? `<div class="card-trend">
           <i class="fa-solid fa-arrow-trend-${card.trend.direction}"></i> ${card.trend.value}%
         </div>`
      : '';

    return `
      <div class="dashboard-card" style="--card-accent:${color}">
        <div class="card-header">
          <div class="card-icon" style="background:${color}22; color:${color}">
            <i class="fa-solid ${card.icon || 'fa-chart-bar'}"></i>
          </div>
          ${trendHtml}
        </div>
        <div class="card-body">
          <div class="card-value">${card.value}</div>
          <div class="card-label">${card.label}</div>
        </div>
      </div>`;
  }
}

window.Dashboard = Dashboard;
