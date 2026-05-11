/**
 * Componente de Calendário
 * Gerencia exibição e interação com calendários
 */

class Calendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.currentDate = new Date();
    this.selectedDate = null;
    this.events = options.events || {};
    this.onDateSelect = options.onDateSelect || null;
    this.render();
  }

  /**
   * Obtém os dias do mês atual
   */
  getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  /**
   * Obtém o dia da semana do primeiro dia do mês
   */
  getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  /**
   * Vai para o mês anterior
   */
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  }

  /**
   * Vai para o próximo mês
   */
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }

  /**
   * Vai para o mês/ano atual
   */
  goToToday() {
    this.currentDate = new Date();
    this.render();
  }

  /**
   * Seleciona uma data
   */
  selectDate(day) {
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    this.render();
    
    if (this.onDateSelect) {
      this.onDateSelect(this.selectedDate);
    }
  }

  /**
   * Adiciona um evento a uma data
   */
  addEvent(date, event) {
    const key = this.getDateKey(date);
    if (!this.events[key]) {
      this.events[key] = [];
    }
    this.events[key].push(event);
    this.render();
  }

  /**
   * Remove um evento de uma data
   */
  removeEvent(date, index) {
    const key = this.getDateKey(date);
    if (this.events[key]) {
      this.events[key].splice(index, 1);
      if (this.events[key].length === 0) {
        delete this.events[key];
      }
      this.render();
    }
  }

  /**
   * Obtém a chave para armazenar eventos
   */
  getDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  /**
   * Verifica se uma data é hoje
   */
  isToday(day) {
    const today = new Date();
    return day === today.getDate() && 
           this.currentDate.getMonth() === today.getMonth() &&
           this.currentDate.getFullYear() === today.getFullYear();
  }

  /**
   * Verifica se uma data está selecionada
   */
  isSelected(day) {
    return this.selectedDate && 
           day === this.selectedDate.getDate() &&
           this.currentDate.getMonth() === this.selectedDate.getMonth() &&
           this.currentDate.getFullYear() === this.selectedDate.getFullYear();
  }

  /**
   * Verifica se uma data tem eventos
   */
  hasEvents(day) {
    const key = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth()}-${day}`;
    return this.events[key] && this.events[key].length > 0;
  }

  /**
   * Renderiza o calendário
   */
  render() {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const firstDay = this.getFirstDayOfMonth(this.currentDate);
    const daysInMonth = this.getDaysInMonth(this.currentDate);

    let html = `
      <div class="calendar-header">
        <div class="calendar-nav">
          <button class="calendar-nav-btn" onclick="window.calendarInstance.previousMonth()" title="Mês anterior">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <h3 class="calendar-month">${monthNames[month]} ${year}</h3>
          <button class="calendar-nav-btn" onclick="window.calendarInstance.nextMonth()" title="Próximo mês">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <button class="calendar-today-btn" onclick="window.calendarInstance.goToToday()" title="Ir para hoje">
          <i class="fa-solid fa-calendar-day"></i> Hoje
        </button>
      </div>

      <div class="calendar-weekdays">
        ${dayNames.map(day => `<div class="weekday">${day}</div>`).join('')}
      </div>

      <div class="calendar-days">
    `;

    // Adiciona dias vazios no início
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    // Adiciona os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = this.isToday(day);
      const isSelected = this.isSelected(day);
      const hasEvents = this.hasEvents(day);

      html += `
        <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" 
             onclick="window.calendarInstance.selectDate(${day})">
          <div class="calendar-day-number">${day}</div>
          ${hasEvents ? '<div class="calendar-event-indicator"></div>' : ''}
        </div>
      `;
    }

    html += `
      </div>
    `;

    this.container.innerHTML = html;
  }
}

// Exportar para uso global
window.Calendar = Calendar;
