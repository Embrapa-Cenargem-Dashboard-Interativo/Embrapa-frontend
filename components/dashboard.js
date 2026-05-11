/**
 * Componente de Dashboard
 * Gerencia cards, gráficos e widgets do dashboard
 */

class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cards = [];
    this.widgets = [];
  }

  /**
   * Adiciona um card ao dashboard
   */
  addCard(card) {
    this.cards.push(card);
    return this;
  }

  /**
   * Adiciona um widget ao dashboard
   */
  addWidget(widget) {
    this.widgets.push(widget);
    return this;
  }

  /**
   * Renderiza o dashboard
   */
  render() {
    let html = '<div class="dashboard-grid">';

    // Renderiza cards
    this.cards.forEach((card, index) => {
      html += this.renderCard(card);
    });

    html += '</div>';

    // Renderiza widgets
    if (this.widgets.length > 0) {
      html += '<div class="dashboard-widgets">';
      this.widgets.forEach(widget => {
        html += this.renderWidget(widget);
      });
      html += '</div>';
    }

    this.container.innerHTML = html;
  }

  /**
   * Renderiza um card individual
   */
  renderCard(card) {
    const icon = card.icon || 'fa-chart-bar';
    const color = card.color || 'var(--accent)';
    const trend = card.trend || null;

    let trendHtml = '';
    if (trend) {
      const trendIcon = trend.direction === 'up' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
      const trendColor = trend.direction === 'up' ? 'var(--accent)' : 'var(--danger)';
      trendHtml = `<div class="card-trend" style="color: ${trendColor};">
        <i class="fa-solid ${trendIcon}"></i> ${trend.value}%
      </div>`;
    }

    return `
      <div class="dashboard-card">
        <div class="card-header">
          <div class="card-icon" style="background: linear-gradient(135deg, ${color}20, ${color}40); color: ${color};">
            <i class="fa-solid ${icon}"></i>
          </div>
          ${trendHtml}
        </div>
        <div class="card-body">
          <div class="card-value">${card.value}</div>
          <div class="card-label">${card.label}</div>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza um widget individual
   */
  renderWidget(widget) {
    return `
      <div class="dashboard-widget">
        <div class="widget-header">
          <h3 class="widget-title">
            <i class="fa-solid ${widget.icon}"></i> ${widget.title}
          </h3>
          ${widget.action ? `<button class="widget-action">${widget.action}</button>` : ''}
        </div>
        <div class="widget-content">
          ${widget.content}
        </div>
      </div>
    `;
  }

  /**
   * Limpa o dashboard
   */
  clear() {
    this.cards = [];
    this.widgets = [];
    this.container.innerHTML = '';
  }
}

// Exportar para uso global
window.Dashboard = Dashboard;
