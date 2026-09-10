/**
 * Componente Dashboard
 * Renderiza os cards de métricas (KPIs) do painel.
 */
import type { DashboardCardData } from '../types';

export class Dashboard {
  container: HTMLElement | null;
  cards: DashboardCardData[];

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    this.cards = [];
  }

  addCard(card: DashboardCardData): this {
    this.cards.push(card);
    return this;
  }

  render(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="dashboard-grid">
        ${this.cards.map((c) => this._renderCard(c)).join('')}
      </div>`;
  }

  private _renderCard(card: DashboardCardData): string {
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
