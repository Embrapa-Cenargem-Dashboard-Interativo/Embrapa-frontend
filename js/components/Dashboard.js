/**
 * Componente Dashboard
 * Renderiza cards de métricas e widgets de conteúdo.
 */
class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cards   = [];
    this.widgets = [];
  }

  addCard(card)     { this.cards.push(card);   return this; }
  addWidget(widget) { this.widgets.push(widget); return this; }

  render() {
    const cardsHtml = `
      <div class="dashboard-grid">
        ${this.cards.map(c => this._renderCard(c)).join('')}
      </div>`;

    const widgetsHtml = this.widgets.length
      ? `<div class="dashboard-widgets">
           ${this.widgets.map(w => this._renderWidget(w)).join('')}
         </div>`
      : '';

    this.container.innerHTML = cardsHtml + widgetsHtml;
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

  _renderWidget(widget) {
    const actionHtml = widget.action
      ? `<button class="widget-action">${widget.action}</button>` : '';
    return `
      <div class="dashboard-widget">
        <div class="widget-header">
          <h3 class="widget-title">
            <i class="fa-solid ${widget.icon}"></i> ${widget.title}
          </h3>
          ${actionHtml}
        </div>
        <div class="widget-content">${widget.content}</div>
      </div>`;
  }
}

window.Dashboard = Dashboard;
