/**
 * Componente Calendar
 * Renderiza um calendário mensal interativo.
 */
class Calendar {
  constructor(containerId, options = {}) {
    this.container   = document.getElementById(containerId);
    this.currentDate = new Date();
    this.selectedDate = null;
    this.events       = options.events || {};
    this.onDateSelect = options.onDateSelect || null;
    this.render();
  }

  // ─── Navegação ────────────────────────────────────────────

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }

  goToToday() {
    this.currentDate = new Date();
    this.render();
  }

  selectDate(day) {
    this.selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    this.render();
    this.onDateSelect?.(this.selectedDate);
  }

  // ─── Eventos ──────────────────────────────────────────────

  addEvent(date, event) {
    const key = this._key(date);
    (this.events[key] ??= []).push(event);
    this.render();
  }

  _key(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  // ─── Helpers ──────────────────────────────────────────────

  _isToday(day) {
    const t = new Date();
    return day === t.getDate()
      && this.currentDate.getMonth() === t.getMonth()
      && this.currentDate.getFullYear() === t.getFullYear();
  }

  _isSelected(day) {
    return this.selectedDate
      && day === this.selectedDate.getDate()
      && this.currentDate.getMonth() === this.selectedDate.getMonth()
      && this.currentDate.getFullYear() === this.selectedDate.getFullYear();
  }

  _hasEvents(day) {
    return !!this.events[`${this.currentDate.getFullYear()}-${this.currentDate.getMonth()}-${day}`]?.length;
  }

  // ─── Render ───────────────────────────────────────────────

  render() {
    const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const DAYS   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

    const month      = this.currentDate.getMonth();
    const year       = this.currentDate.getFullYear();
    const firstDay   = new Date(year, month, 1).getDay();
    const totalDays  = new Date(year, month + 1, 0).getDate();

    const emptySlots = Array(firstDay).fill('<div class="calendar-day empty"></div>').join('');

    const daySlots = Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const cls = [
        'calendar-day',
        this._isToday(day)     ? 'today'    : '',
        this._isSelected(day)  ? 'selected' : '',
      ].filter(Boolean).join(' ');
      const dot = this._hasEvents(day)
        ? '<div class="calendar-event-indicator"></div>' : '';
      return `<div class="${cls}" onclick="window.calendarInstance.selectDate(${day})">
                <div class="calendar-day-number">${day}</div>${dot}
              </div>`;
    }).join('');

    this.container.innerHTML = `
      <div class="calendar-header">
        <div class="calendar-nav">
          <button class="calendar-nav-btn" onclick="window.calendarInstance.previousMonth()" title="Mês anterior">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <h3 class="calendar-month">${MONTHS[month]} ${year}</h3>
          <button class="calendar-nav-btn" onclick="window.calendarInstance.nextMonth()" title="Próximo mês">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <button class="calendar-today-btn" onclick="window.calendarInstance.goToToday()">
          <i class="fa-solid fa-calendar-day"></i> Hoje
        </button>
      </div>
      <div class="calendar-weekdays">
        ${DAYS.map(d => `<div class="weekday">${d}</div>`).join('')}
      </div>
      <div class="calendar-days">
        ${emptySlots}${daySlots}
      </div>`;
  }
}

window.Calendar = Calendar;
