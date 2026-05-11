/**
 * Componente de Sidebar
 * Gerencia menu lateral e navegação
 */

class Sidebar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.items = options.items || [];
    this.isOpen = options.isOpen !== undefined ? options.isOpen : false;
    this.onItemClick = options.onItemClick || null;
    this.render();
  }

  /**
   * Adiciona um item ao menu
   */
  addItem(item) {
    this.items.push(item);
    this.render();
    return this;
  }

  /**
   * Remove um item do menu
   */
  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.render();
    return this;
  }

  /**
   * Define o item ativo
   */
  setActive(id) {
    this.items.forEach(item => {
      item.active = item.id === id;
    });
    this.render();
  }

  /**
   * Abre/fecha a sidebar
   */
  toggle() {
    this.isOpen = !this.isOpen;
    this.render();
  }

  /**
   * Renderiza a sidebar
   */
  render() {
    let html = `
      <aside class="sidebar ${this.isOpen ? 'open' : ''}">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Menu</h2>
          <button class="sidebar-close" onclick="window.sidebarInstance?.toggle()">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <nav class="sidebar-nav">
          ${this.items.map(item => this.renderItem(item)).join('')}
        </nav>

        ${this.renderFooter()}
      </aside>
    `;

    this.container.innerHTML = html;
  }

  /**
   * Renderiza um item individual
   */
  renderItem(item) {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = item.active ? 'active' : '';

    let submenuHtml = '';
    if (hasSubmenu && item.active) {
      submenuHtml = `
        <div class="sidebar-submenu">
          ${item.submenu.map(sub => `
            <a href="#" class="sidebar-subitem" onclick="event.preventDefault(); window.sidebarInstance?.onItemClick?.(sub)">
              <i class="fa-solid ${sub.icon}"></i> ${sub.label}
            </a>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="sidebar-item ${isActive}" onclick="window.sidebarInstance?.handleItemClick('${item.id}')">
        <a href="#" class="sidebar-link" onclick="event.preventDefault()">
          <span class="sidebar-icon">
            <i class="fa-solid ${item.icon}"></i>
          </span>
          <span class="sidebar-label">${item.label}</span>
          ${hasSubmenu ? '<i class="fa-solid fa-chevron-right sidebar-arrow"></i>' : ''}
        </a>
        ${submenuHtml}
      </div>
    `;
  }

  /**
   * Renderiza o rodapé da sidebar
   */
  renderFooter() {
    return `
      <div class="sidebar-footer">
        <button class="sidebar-footer-item" title="Configurações">
          <i class="fa-solid fa-cog"></i>
          <span>Configurações</span>
        </button>
        <button class="sidebar-footer-item" title="Ajuda">
          <i class="fa-solid fa-question-circle"></i>
          <span>Ajuda</span>
        </button>
      </div>
    `;
  }

  /**
   * Manipula clique em item
   */
  handleItemClick(id) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      this.setActive(id);
      if (this.onItemClick) {
        this.onItemClick(item);
      }
    }
  }
}

// Exportar para uso global
window.Sidebar = Sidebar;
