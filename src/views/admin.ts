/**
 * View: Admin
 * Gestão completa: métricas, estufas, reservas e usuários.
 */
import { ESTUFAS, STATUS_MAP, reservas, saveState } from '../data/estufas';
import { updateEstufaOnMap } from './mapa';
import type { Estufa, PerfilUsuario } from '../types';

const $ = (id: string): HTMLElement | null => document.getElementById(id);

// ─── Estado de filtros/busca ───────────────────────────────
let estufaQuery = '';
let reservaQuery = '';
let reservaStatus: 'todas' | 'pendente' | 'ativa' = 'todas';

function renderAdmin(): void {
  // Acesso restrito
  if (!window.currentUser || window.currentUser.role !== 'admin') {
    window.showToast('Acesso restrito a administradores', 'error');
    window.showView('mapa');
    return;
  }
  _renderAdminMetrics();
  _renderAdminEstufas();
  _renderAdminReservas();
  _renderAdminUsers();
}

// ─── Métricas ──────────────────────────────────────────────

function _renderAdminMetrics(): void {
  const vals = Object.values(ESTUFAS);
  const total = vals.length;
  const livres = vals.filter((e) => e.status === 'livre').length;
  const ocup = vals.filter((e) => e.status === 'ocupada' || e.status === 'reservada').length;
  const manut = vals.filter((e) => e.status === 'manutencao').length;
  const ativos = reservas.filter((r) => r.status === 'ativa' || r.status === 'pendente').length;
  const taxa = total > 0 ? Math.round((ocup / total) * 100) : 0;

  _set('adm-total', total);
  _set('adm-livres', livres);
  _set('adm-reservas', ativos);
  _set('adm-taxa', taxa + '%');
  _set('adm-manut', manut);

  const bar = $('adm-taxa-bar');
  if (bar) {
    bar.style.width = taxa + '%';
    const gauge = bar.parentElement;
    if (gauge) {
      gauge.setAttribute('role', 'progressbar');
      gauge.setAttribute('aria-valuenow', String(taxa));
      gauge.setAttribute('aria-valuemin', '0');
      gauge.setAttribute('aria-valuemax', '100');
      gauge.setAttribute('aria-label', `Taxa de ocupação: ${taxa}%`);
    }
  }
}

function _set(id: string, val: string | number): void {
  const el = $(id);
  if (el) el.textContent = String(val);
}

/** Navegação a partir dos cards de métrica (clicáveis). */
function adminGoto(target: 'estufas' | 'reservas' | 'reservas-ativa' | 'reservas-pendente'): void {
  if (target === 'reservas-ativa' || target === 'reservas-pendente') {
    const status = target === 'reservas-ativa' ? 'ativa' : 'pendente';
    const chip = document.querySelector(`.adm-chip[data-status="${status}"]`) as HTMLElement | null;
    adminFiltrarReservas(status, chip || undefined);
    _scrollTo('adm-sec-reservas');
  } else if (target === 'reservas') {
    _scrollTo('adm-sec-reservas');
  } else {
    _scrollTo('adm-sec-estufas');
  }
}

function _scrollTo(id: string): void {
  const el = $(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.add('is-flash');
  setTimeout(() => el.classList.remove('is-flash'), 900);
}

// ─── Estufas ───────────────────────────────────────────────

function _renderAdminEstufas(): void {
  const tbody = $('adm-estufas-tbody');
  if (!tbody) return;

  const total = Object.keys(ESTUFAS).length;
  const q = estufaQuery.trim().toLowerCase();
  const rows = Object.entries(ESTUFAS).filter(([id, e]) =>
    !q || id.toLowerCase().includes(q) || e.nome.toLowerCase().includes(q) || e.tipo.toLowerCase().includes(q)
  );

  _setCount('adm-estufas-count', rows.length, total, q);

  if (!rows.length) {
    tbody.innerHTML = _emptyRow(7, 'fa-warehouse', q ? `Nenhum espaço para “${estufaQuery}”` : 'Nenhum espaço cadastrado');
    return;
  }

  tbody.innerHTML = rows.map(([id, e]) => {
    const s = STATUS_MAP[e.status] || { label: e.status, cls: 'pill-muted', icon: 'fa-circle' };
    return `
      <tr>
        <td data-label="ID"><span class="td-id">${id}</span></td>
        <td data-label="Nome" class="cell-name">${e.nome}</td>
        <td data-label="Tipo" class="cell-muted">${e.tipo}</td>
        <td data-label="Área">${e.area}</td>
        <td data-label="Cap.">${e.cap}</td>
        <td data-label="Status"><span class="pill ${s.cls}"><i class="fa-solid ${s.icon}" style="font-size:8px"></i> ${s.label}</span></td>
        <td data-label="Alterar Status">
          <div class="actions">
            <select class="status-select st-${e.status}" aria-label="Alterar status de ${e.nome}" onchange="adminSetStatus('${id}', this.value)">
              <option value="livre"      ${e.status === 'livre' ? 'selected' : ''}>Livre</option>
              <option value="ocupada"    ${e.status === 'ocupada' ? 'selected' : ''}>Ocupada</option>
              <option value="reservada"  ${e.status === 'reservada' ? 'selected' : ''}>Reservada</option>
              <option value="manutencao" ${e.status === 'manutencao' ? 'selected' : ''}>Manutenção</option>
            </select>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function adminSetStatus(id: string, status: string): void {
  ESTUFAS[id].status = status as Estufa['status'];
  updateEstufaOnMap(id);
  saveState();
  _renderAdminMetrics();
  _renderAdminEstufas();
  window.showToast(`${ESTUFAS[id].nome}: status atualizado para ${STATUS_MAP[status]?.label || status}`, 'success');
}

function adminBuscarEstufas(q: string): void {
  estufaQuery = q;
  _toggleClear('adm-estufas-clear', q);
  _renderAdminEstufas();
}

function adminLimparEstufas(): void {
  estufaQuery = '';
  const input = $('adm-estufas-search') as HTMLInputElement | null;
  if (input) { input.value = ''; input.focus(); }
  _toggleClear('adm-estufas-clear', '');
  _renderAdminEstufas();
}

// ─── Reservas ──────────────────────────────────────────────

function _renderAdminReservas(): void {
  const tbody = $('adm-reservas-tbody');
  if (!tbody) return;

  const base = reservas.filter((r) => r.status !== 'cancelada');
  const pendentes = base.filter((r) => r.status === 'pendente').length;
  _updatePendBadge(pendentes);

  const q = reservaQuery.trim().toLowerCase();
  const filtering = q !== '' || reservaStatus !== 'todas';
  const all = base
    .filter((r) => reservaStatus === 'todas' || r.status === reservaStatus)
    .filter((r) => {
      if (!q) return true;
      const e = ESTUFAS[r.estufaId];
      return r.id.toLowerCase().includes(q)
        || r.projeto.toLowerCase().includes(q)
        || (e ? e.nome.toLowerCase().includes(q) : r.estufaId.toLowerCase().includes(q));
    });

  _setCount('adm-reservas-count', all.length, base.length, filtering ? '1' : '');

  if (!all.length) {
    tbody.innerHTML = _emptyRow(7, 'fa-calendar-xmark', q ? `Nenhuma reserva para “${reservaQuery}”` : 'Nenhuma reserva encontrada');
    return;
  }

  tbody.innerHTML = all.map((r) => {
    const e = ESTUFAS[r.estufaId];
    const s = STATUS_MAP[r.status] || { label: r.status, cls: 'pill-muted', icon: 'fa-circle' };
    const canApprove = r.status === 'pendente';
    return `
      <tr class="${canApprove ? 'row-pending' : ''}">
        <td data-label="ID"><span class="td-id">${r.id}</span></td>
        <td data-label="Espaço" class="cell-name">${e ? e.nome : r.estufaId}</td>
        <td data-label="Projeto" class="cell-proj" title="${r.projeto}">${r.projeto}</td>
        <td data-label="Data" style="white-space:nowrap">${_fmtDateAdmin(r.data)}</td>
        <td data-label="Qtd">${r.qtd}</td>
        <td data-label="Status"><span class="pill ${s.cls}"><i class="fa-solid ${s.icon}" style="font-size:8px"></i> ${s.label}</span></td>
        <td data-label="Ações">
          <div class="actions">
            ${canApprove ? `<button class="btn btn-primary btn-sm btn-xs" onclick="adminAprovarReserva('${r.id}')"><i class="fa-solid fa-check"></i> Aprovar</button>` : ''}
            <button class="btn btn-danger btn-sm btn-icon" title="Cancelar reserva" aria-label="Cancelar reserva ${r.id}" onclick="adminCancelarReserva('${r.id}')"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function _updatePendBadge(n: number): void {
  const badge = $('adm-pend-badge');
  if (!badge) return;
  badge.textContent = String(n);
  badge.classList.toggle('is-hidden', n === 0);
}

function adminAprovarReserva(id: string): void {
  const r = reservas.find((x) => x.id === id);
  if (!r) return;
  r.status = 'ativa';
  ESTUFAS[r.estufaId].status = 'ocupada';
  updateEstufaOnMap(r.estufaId);
  saveState();
  renderAdmin();
  window.showToast('Reserva aprovada com sucesso!', 'success');
}

function adminCancelarReserva(id: string): void {
  const r = reservas.find((x) => x.id === id);
  if (!r) return;
  const e = ESTUFAS[r.estufaId];
  const nome = e ? e.nome : r.estufaId;

  _confirm({
    icon: 'fa-calendar-xmark',
    title: 'Cancelar reserva?',
    message: `A reserva <b>${r.id}</b> — ${r.projeto} em <b>${nome}</b> (${_fmtDateAdmin(r.data)}) será cancelada. Esta ação não pode ser desfeita.`,
    confirmLabel: 'Cancelar reserva',
    cancelLabel: 'Voltar',
    danger: true,
  }).then((ok) => {
    if (!ok) return;
    r.status = 'cancelada';
    // Só libera estufa se não tiver mais reservas ativas
    const outras = reservas.filter((x) => x.estufaId === r.estufaId && (x.status === 'ativa' || x.status === 'pendente') && x.id !== id);
    if (!outras.length && e) {
      ESTUFAS[r.estufaId].status = 'livre';
      updateEstufaOnMap(r.estufaId);
    }
    saveState();
    renderAdmin();
    window.showToast('Reserva cancelada', 'info');
  });
}

function adminBuscarReservas(q: string): void {
  reservaQuery = q;
  _toggleClear('adm-reservas-clear', q);
  _renderAdminReservas();
}

function adminLimparReservas(): void {
  reservaQuery = '';
  const input = $('adm-reservas-search') as HTMLInputElement | null;
  if (input) { input.value = ''; input.focus(); }
  _toggleClear('adm-reservas-clear', '');
  _renderAdminReservas();
}

function adminFiltrarReservas(status: 'todas' | 'pendente' | 'ativa', el?: HTMLElement): void {
  reservaStatus = status;
  const chips = document.querySelectorAll('.adm-chip');
  chips.forEach((c) => {
    c.classList.remove('active');
    c.setAttribute('aria-selected', 'false');
  });
  const active = el || document.querySelector(`.adm-chip[data-status="${status}"]`);
  if (active) {
    active.classList.add('active');
    active.setAttribute('aria-selected', 'true');
  }
  _renderAdminReservas();
}

// ─── Usuários ──────────────────────────────────────────────

function _renderAdminUsers(): void {
  const grid = $('adm-users-grid');
  if (!grid) return;

  const users = window.USERS || [];
  _set('adm-users-count', users.length);

  grid.innerHTML = users.map((u) => {
    const isAdmin = u.role === 'admin';
    const bg = isAdmin ? 'var(--info)' : 'var(--accent)';
    const icon = isAdmin ? 'fa-user-shield' : 'fa-user';
    const label = isAdmin ? 'Administrador' : 'Pesquisador';
    const isMe = window.currentUser && window.currentUser.id === u.id;
    // Admin pode excluir pesquisadores e a si próprio (não outros admins).
    const canDelete = !isAdmin || isMe;
    const delBtn = canDelete
      ? `<button class="admin-user-del${isMe ? ' admin-user-del-self' : ''}" title="${isMe ? 'Excluir minha conta' : 'Excluir usuário'}" aria-label="Excluir ${u.name}" onclick="adminExcluirUsuario('${u.id}')"><i class="fa-solid fa-trash-can"></i></button>`
      : '';
    return `
      <div class="admin-user-card ${isAdmin ? 'is-admin' : ''} ${isMe ? 'is-me' : ''}">
        <div class="admin-user-avatar" style="background:${bg}">
          <i class="fa-solid ${icon}"></i>
        </div>
        <div class="admin-user-info">
          <div class="admin-user-name">${u.name}${isMe ? '<span class="admin-user-tag">você</span>' : ''}</div>
          <div class="admin-user-role">${label} <code>${u.login}</code></div>
        </div>
        ${delBtn}
      </div>`;
  }).join('');
}

// ─── Usuários: modais (lista + cadastro) ───────────────────

let newUserRole: PerfilUsuario = 'pesquisador';

function _openOverlay(id: string): void {
  $(id)?.classList.add('open');
}

function adminOpenMetrics(): void {
  _renderAdminMetrics();
  _openOverlay('overlay-metrics');
}

function adminOpenUsers(): void {
  _renderAdminUsers();
  _openOverlay('overlay-users');
}

function adminOpenNewUser(): void {
  newUserRole = 'pesquisador';
  const input = $('new-user-email') as HTMLInputElement | null;
  if (input) input.value = '';
  const err = $('new-user-error');
  if (err) err.style.display = 'none';
  document.querySelectorAll('#overlay-new-user .seg-btn').forEach((b) => {
    const isDefault = b.getAttribute('data-role') === 'pesquisador';
    b.classList.toggle('active', isDefault);
    b.setAttribute('aria-checked', String(isDefault));
  });
  _openOverlay('overlay-new-user');
  setTimeout(() => input?.focus(), 60);
}

function adminSetNewRole(role: PerfilUsuario, el?: HTMLElement): void {
  newUserRole = role;
  document.querySelectorAll('#overlay-new-user .seg-btn').forEach((b) => {
    b.classList.remove('active');
    b.setAttribute('aria-checked', 'false');
  });
  const active = el || document.querySelector(`#overlay-new-user .seg-btn[data-role="${role}"]`);
  if (active) {
    active.classList.add('active');
    active.setAttribute('aria-checked', 'true');
  }
}

function adminCadastrarUsuario(): void {
  const input = $('new-user-email') as HTMLInputElement | null;
  const err = $('new-user-error');
  const email = (input?.value || '').trim();
  const res = window.addUser(email, newUserRole);

  if (!res.ok) {
    if (err) {
      err.textContent = res.error || 'Não foi possível cadastrar.';
      err.style.display = 'block';
    }
    input?.focus();
    return;
  }

  window.closeAll();
  _renderAdminUsers();
  window.showToast(`Usuário ${res.user!.name} cadastrado — acesso com o e-mail e a senha ${res.senha}`, 'success');
  _openOverlay('overlay-users');
}

function adminExcluirUsuario(id: string): void {
  const user = (window.USERS || []).find((u) => u.id === id);
  if (!user) return;
  const isMe = !!window.currentUser && window.currentUser.id === id;

  _confirm({
    icon: 'fa-user-xmark',
    title: isMe ? 'Excluir sua conta?' : 'Excluir usuário?',
    message: isMe
      ? `Sua conta <b>${user.name}</b> será removida e você sairá do sistema. Esta ação não pode ser desfeita.`
      : `O usuário <b>${user.name}</b> (${user.login}) perderá o acesso ao sistema. Esta ação não pode ser desfeita.`,
    confirmLabel: 'Excluir',
    cancelLabel: 'Cancelar',
    danger: true,
  }).then((ok) => {
    if (!ok) return;
    const res = window.removeUser(id);
    if (!res.ok) {
      window.showToast(res.error || 'Não foi possível excluir.', 'error');
      return;
    }
    if (res.wasSelf) {
      window.closeAll();
      window.doLogoff();
      return;
    }
    _renderAdminUsers();
    window.showToast(`${user.name} foi removido do sistema.`, 'info');
  });
}

// ─── Diálogo de confirmação ────────────────────────────────

interface ConfirmOpts {
  icon?: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

function _confirm(opts: ConfirmOpts): Promise<boolean> {
  return new Promise((resolve) => {
    const prev = document.activeElement as HTMLElement | null;
    const overlay = document.createElement('div');
    overlay.className = 'adm-confirm-overlay';
    overlay.innerHTML = `
      <div class="adm-confirm" role="dialog" aria-modal="true" aria-labelledby="adm-cf-title">
        <div class="adm-confirm-icon ${opts.danger ? 'is-danger' : ''}">
          <i class="fa-solid ${opts.icon || 'fa-circle-question'}"></i>
        </div>
        <div class="adm-confirm-title" id="adm-cf-title">${opts.title}</div>
        <div class="adm-confirm-msg">${opts.message}</div>
        <div class="adm-confirm-actions">
          <button class="btn btn-ghost adm-cf-cancel">${opts.cancelLabel || 'Cancelar'}</button>
          <button class="btn ${opts.danger ? 'btn-danger' : 'btn-primary'} adm-cf-ok">${opts.confirmLabel || 'Confirmar'}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    const done = (result: boolean) => {
      overlay.classList.remove('open');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => overlay.remove(), 180);
      if (prev && typeof prev.focus === 'function') prev.focus();
      resolve(result);
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') done(false);
      if (ev.key === 'Enter') done(true);
    };
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) done(false); });
    overlay.querySelector('.adm-cf-cancel')?.addEventListener('click', () => done(false));
    overlay.querySelector('.adm-cf-ok')?.addEventListener('click', () => done(true));
    (overlay.querySelector('.adm-cf-ok') as HTMLElement | null)?.focus();
  });
}

// ─── Helpers ───────────────────────────────────────────────

function _setCount(id: string, shown: number, total: number, filtered: string): void {
  const el = $(id);
  if (!el) return;
  el.textContent = filtered && shown !== total ? `${shown} de ${total}` : String(total);
}

function _toggleClear(id: string, val: string): void {
  const btn = $(id);
  if (btn) btn.classList.toggle('is-hidden', !val);
}

function _emptyRow(cols: number, icon: string, msg: string): string {
  return `<tr class="adm-empty-row"><td colspan="${cols}">
    <i class="fa-solid ${icon}"></i>${msg}</td></tr>`;
}

function _fmtDateAdmin(d: string): string {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// Expõe globalmente
window.renderAdmin = renderAdmin;
window.adminSetStatus = adminSetStatus;
window.adminAprovarReserva = adminAprovarReserva;
window.adminCancelarReserva = adminCancelarReserva;
window.adminBuscarEstufas = adminBuscarEstufas;
window.adminBuscarReservas = adminBuscarReservas;
window.adminFiltrarReservas = adminFiltrarReservas;
window.adminLimparEstufas = adminLimparEstufas;
window.adminLimparReservas = adminLimparReservas;
window.adminGoto = adminGoto;
window.adminOpenMetrics = adminOpenMetrics;
window.adminOpenUsers = adminOpenUsers;
window.adminOpenNewUser = adminOpenNewUser;
window.adminSetNewRole = adminSetNewRole;
window.adminCadastrarUsuario = adminCadastrarUsuario;
window.adminExcluirUsuario = adminExcluirUsuario;

export {
  renderAdmin,
  adminSetStatus,
  adminAprovarReserva,
  adminCancelarReserva,
  adminBuscarEstufas,
  adminBuscarReservas,
  adminFiltrarReservas,
  adminLimparEstufas,
  adminLimparReservas,
  adminGoto,
  adminOpenMetrics,
  adminOpenUsers,
  adminOpenNewUser,
  adminSetNewRole,
  adminCadastrarUsuario,
  adminExcluirUsuario,
};
