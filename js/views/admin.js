/**
 * View: Admin
 * Gestão completa: métricas, estufas, reservas e usuários.
 */

function renderAdmin() {
  // Acesso restrito
  if (!window.currentUser || window.currentUser.role !== 'admin') {
    showToast('Acesso restrito a administradores', 'error');
    showView('mapa');
    return;
  }
  _renderAdminMetrics();
  _renderAdminEstufas();
  _renderAdminReservas();
  _renderAdminUsers();
}

// ─── Métricas ──────────────────────────────────────────────

function _renderAdminMetrics() {
  const vals = Object.values(ESTUFAS);
  const total  = vals.length;
  const livres = vals.filter(e => e.status === 'livre').length;
  const ocup   = vals.filter(e => e.status === 'ocupada' || e.status === 'reservada').length;
  const manut  = vals.filter(e => e.status === 'manutencao').length;
  const ativos = reservas.filter(r => r.status === 'ativa' || r.status === 'pendente').length;
  const taxa   = total > 0 ? Math.round((ocup / total) * 100) : 0;

  _set('adm-total',    total);
  _set('adm-livres',   livres);
  _set('adm-reservas', ativos);
  _set('adm-taxa',     taxa + '%');
  _set('adm-manut',    manut);
}

function _set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── Estufas ───────────────────────────────────────────────

function _renderAdminEstufas() {
  const tbody = document.getElementById('adm-estufas-tbody');
  if (!tbody) return;

  tbody.innerHTML = Object.entries(ESTUFAS).map(([id, e]) => {
    const s = STATUS_MAP[e.status] || { label: e.status, cls: 'pill-muted', icon: 'fa-circle' };
    return `
      <tr>
        <td class="td-id">${id}</td>
        <td><strong>${e.nome}</strong></td>
        <td style="color:var(--muted)">${e.tipo}</td>
        <td>${e.area}</td>
        <td>${e.cap}</td>
        <td><span class="pill ${s.cls}"><i class="fa-solid ${s.icon}" style="font-size:8px"></i> ${s.label}</span></td>
        <td>
          <div class="actions">
            <select class="status-select" onchange="adminSetStatus('${id}', this.value)">
              <option value="livre"      ${e.status === 'livre'      ? 'selected' : ''}>Livre</option>
              <option value="ocupada"    ${e.status === 'ocupada'    ? 'selected' : ''}>Ocupada</option>
              <option value="reservada"  ${e.status === 'reservada'  ? 'selected' : ''}>Reservada</option>
              <option value="manutencao" ${e.status === 'manutencao' ? 'selected' : ''}>Manutenção</option>
            </select>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function adminSetStatus(id, status) {
  ESTUFAS[id].status = status;
  updateEstufaOnMap(id);
  saveState();
  _renderAdminMetrics();
  _renderAdminEstufas();
  showToast(`${ESTUFAS[id].nome}: status atualizado para ${STATUS_MAP[status]?.label || status}`, 'success');
}

// ─── Reservas ──────────────────────────────────────────────

function _renderAdminReservas() {
  const tbody = document.getElementById('adm-reservas-tbody');
  if (!tbody) return;

  const all = reservas.filter(r => r.status !== 'cancelada');

  if (!all.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:28px">
      <i class="fa-solid fa-calendar-xmark" style="margin-right:6px"></i>Nenhuma reserva ativa</td></tr>`;
    return;
  }

  tbody.innerHTML = all.map(r => {
    const e = ESTUFAS[r.estufaId];
    const s = STATUS_MAP[r.status] || { label: r.status, cls: 'pill-muted', icon: 'fa-circle' };
    const canApprove = r.status === 'pendente';
    const canCancel  = r.status !== 'cancelada';
    return `
      <tr>
        <td class="td-id">${r.id}</td>
        <td>${e ? e.nome : r.estufaId}</td>
        <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.projeto}">${r.projeto}</td>
        <td style="white-space:nowrap">${_fmtDateAdmin(r.data)}</td>
        <td>${r.qtd}</td>
        <td><span class="pill ${s.cls}"><i class="fa-solid ${s.icon}" style="font-size:8px"></i> ${s.label}</span></td>
        <td>
          <div class="actions">
            ${canApprove ? `<button class="btn btn-primary btn-sm btn-xs" title="Aprovar" onclick="adminAprovarReserva('${r.id}')"><i class="fa-solid fa-check"></i> Aprovar</button>` : ''}
            ${canCancel  ? `<button class="btn btn-danger  btn-sm btn-xs" title="Cancelar" onclick="adminCancelarReserva('${r.id}')"><i class="fa-solid fa-xmark"></i></button>` : ''}
          </div>
        </td>
      </tr>`;
  }).join('');
}

function adminAprovarReserva(id) {
  const r = reservas.find(r => r.id === id);
  if (!r) return;
  r.status = 'ativa';
  ESTUFAS[r.estufaId].status = 'ocupada';
  updateEstufaOnMap(r.estufaId);
  saveState();
  renderAdmin();
  showToast('Reserva aprovada com sucesso!', 'success');
}

function adminCancelarReserva(id) {
  const r = reservas.find(r => r.id === id);
  if (!r) return;
  r.status = 'cancelada';
  // Só libera estufa se não tiver mais reservas ativas
  const outras = reservas.filter(x => x.estufaId === r.estufaId && (x.status === 'ativa' || x.status === 'pendente') && x.id !== id);
  if (!outras.length) {
    ESTUFAS[r.estufaId].status = 'livre';
    updateEstufaOnMap(r.estufaId);
  }
  saveState();
  renderAdmin();
  showToast('Reserva cancelada', 'info');
}

// ─── Usuários ──────────────────────────────────────────────

function _renderAdminUsers() {
  const grid = document.getElementById('adm-users-grid');
  if (!grid) return;

  grid.innerHTML = (window.USERS || []).map(u => {
    const isAdmin = u.role === 'admin';
    const bg      = isAdmin ? 'var(--info)' : 'var(--accent)';
    const icon    = isAdmin ? 'fa-user-shield' : 'fa-user';
    const label   = isAdmin ? 'Administrador' : 'Pesquisador';
    const isMe    = window.currentUser && window.currentUser.id === u.id;
    return `
      <div class="admin-user-card">
        <div class="admin-user-avatar" style="background:${bg}">
          <i class="fa-solid ${icon}"></i>
        </div>
        <div class="admin-user-info">
          <div class="admin-user-name">${u.name}${isMe ? ' <span style="font-size:9px;color:var(--accent);font-weight:700">(você)</span>' : ''}</div>
          <div class="admin-user-role">${label} · <code>${u.login}</code></div>
        </div>
      </div>`;
  }).join('');
}

// ─── Helper de data ────────────────────────────────────────

function _fmtDateAdmin(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// Expõe globalmente
window.renderAdmin          = renderAdmin;
window.adminSetStatus       = adminSetStatus;
window.adminAprovarReserva  = adminAprovarReserva;
window.adminCancelarReserva = adminCancelarReserva;
