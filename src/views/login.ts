/**
 * View: Login
 * Autenticação front-end com dois perfis (pesquisador / admin).
 */
import type { Usuario, PerfilUsuario } from '../types';

/** Senha padrão atribuída a usuários cadastrados pelo admin. */
const DEFAULT_SENHA = 'embrapa123';

const SEED_USERS: Usuario[] = [
  { id: 'U01', name: 'Dr. Rafael Lima',   role: 'pesquisador', login: 'pesquisador', senha: 'embrapa123' },
  { id: 'U02', name: 'Admin Cenargen',    role: 'admin',       login: 'admin',       senha: 'admin123'   },
  { id: 'U03', name: 'Dra. Ana Oliveira', role: 'pesquisador', login: 'ana',         senha: 'embrapa123' },
];

/** Carrega usuários persistidos (seed + cadastrados pelo admin). */
function loadUsers(): Usuario[] {
  try {
    const saved = localStorage.getItem('cenargen_users');
    if (saved) {
      const arr = JSON.parse(saved) as Usuario[];
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch {
    /* ignora dados corrompidos */
  }
  return [...SEED_USERS];
}

function saveUsers(): void {
  try {
    localStorage.setItem('cenargen_users', JSON.stringify(USERS));
  } catch {
    /* storage indisponível */
  }
}

const USERS: Usuario[] = loadUsers();

function _nextUserId(): string {
  let max = 0;
  USERS.forEach((u) => {
    const n = parseInt(u.id.replace(/\D/g, ''), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return 'U' + String(max + 1).padStart(2, '0');
}

function _nameFromEmail(email: string): string {
  const local = email.split('@')[0];
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ') || email;
}

interface AddUserResult {
  ok: boolean;
  error?: string;
  user?: Usuario;
  senha?: string;
}

/** Máximo de administradores permitidos no sistema. */
const MAX_ADMINS = 2;

function _adminCount(): number {
  return USERS.filter((u) => u.role === 'admin').length;
}

/**
 * Cadastra um usuário a partir do e-mail (login) e perfil.
 * O acesso é feito com o próprio e-mail e a senha padrão.
 */
function addUser(emailRaw: string, role: PerfilUsuario = 'pesquisador'): AddUserResult {
  const email = (emailRaw || '').trim().toLowerCase();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { ok: false, error: 'Informe um e-mail válido.' };
  if (USERS.some((u) => u.login.toLowerCase() === email)) {
    return { ok: false, error: 'Já existe um usuário com este e-mail.' };
  }
  if (role === 'admin' && _adminCount() >= MAX_ADMINS) {
    return { ok: false, error: `Limite de ${MAX_ADMINS} administradores atingido.` };
  }
  const user: Usuario = {
    id: _nextUserId(),
    name: _nameFromEmail(email),
    role,
    login: email,
    senha: DEFAULT_SENHA,
  };
  USERS.push(user);
  saveUsers();
  return { ok: true, user, senha: DEFAULT_SENHA };
}

interface RemoveUserResult {
  ok: boolean;
  error?: string;
  wasSelf?: boolean;
}

/**
 * Remove um usuário. Um admin pode excluir pesquisadores e a si próprio,
 * mas o sistema exige ao menos um administrador.
 */
function removeUser(id: string): RemoveUserResult {
  const idx = USERS.findIndex((u) => u.id === id);
  if (idx === -1) return { ok: false, error: 'Usuário não encontrado.' };
  const u = USERS[idx];
  if (u.role === 'admin' && _adminCount() <= 1) {
    return { ok: false, error: 'É necessário manter ao menos um administrador.' };
  }
  const wasSelf = !!currentUser && currentUser.id === id;
  USERS.splice(idx, 1);
  saveUsers();
  return { ok: true, wasSelf };
}

let currentUser: Usuario | null = null;

// ─── Seleção rápida de perfil ─────────────────────────────

function selectProfile(role: string): void {
  document.querySelectorAll('.login-profile-btn').forEach((b) => b.classList.remove('selected'));
  const btn = document.querySelector(`.login-profile-btn[data-role="${role}"]`);
  if (btn) btn.classList.add('selected');

  const u = document.getElementById('login-user') as HTMLInputElement | null;
  const p = document.getElementById('login-pass') as HTMLInputElement | null;
  if (!u || !p) return;
  if (role === 'admin') {
    u.value = 'admin';
    p.value = 'admin123';
  } else {
    u.value = 'pesquisador';
    p.value = 'embrapa123';
  }
}

// ─── Login ────────────────────────────────────────────────

function doLogin(): void {
  const userEl = document.getElementById('login-user') as HTMLInputElement | null;
  const passEl = document.getElementById('login-pass') as HTMLInputElement | null;
  const err = document.getElementById('login-error');

  const login = (userEl?.value || '').trim();
  const senha = (passEl?.value || '').trim();

  const user = USERS.find((u) => u.login === login && u.senha === senha);

  if (!user) {
    if (err) {
      err.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Usuário ou senha inválidos.';
      err.classList.add('show');
    }
    if (passEl) passEl.value = '';
    return;
  }

  err?.classList.remove('show');
  currentUser = user;
  window.currentUser = user;
  localStorage.setItem('cenargen_user', JSON.stringify(user));
  _mountApp();
}

function loginKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') doLogin();
}

// ─── Logoff ───────────────────────────────────────────────

function doLogoff(): void {
  currentUser = null;
  window.currentUser = null;
  localStorage.removeItem('cenargen_user');

  const appWrap = document.getElementById('app-wrap');
  const loginScreen = document.getElementById('login-screen');
  if (appWrap) appWrap.style.display = 'none';
  if (loginScreen) loginScreen.style.display = '';
  document.getElementById('user-dropdown')?.classList.remove('open');

  // Reset form
  const userEl = document.getElementById('login-user') as HTMLInputElement | null;
  const passEl = document.getElementById('login-pass') as HTMLInputElement | null;
  if (userEl) userEl.value = '';
  if (passEl) passEl.value = '';
  document.querySelectorAll('.login-profile-btn').forEach((b) => b.classList.remove('selected'));
  document.getElementById('login-error')?.classList.remove('show');
}

// ─── Montar app após login ────────────────────────────────

function _mountApp(): void {
  const loginScreen = document.getElementById('login-screen');
  const appWrap = document.getElementById('app-wrap');
  if (loginScreen) loginScreen.style.display = 'none';
  if (appWrap) appWrap.style.display = '';

  // Atualiza info do usuário no dropdown
  const nameEl = document.getElementById('user-name-display');
  const roleEl = document.getElementById('user-role-display');
  if (nameEl) nameEl.textContent = currentUser!.name;
  if (roleEl) roleEl.textContent = currentUser!.role === 'admin' ? 'Administrador' : 'Pesquisador';

  // Mostra / oculta botão admin
  const adminBtn = document.getElementById('btn-nav-admin');
  if (adminBtn) adminBtn.style.display = currentUser!.role === 'admin' ? '' : 'none';

  // Inicia mapa e vai para view inicial
  window.initMapState?.();
  window.showView?.('mapa');
}

// ─── Restaurar sessão do localStorage ────────────────────

function initAuth(): void {
  const saved = localStorage.getItem('cenargen_user');
  if (saved) {
    try {
      const u = JSON.parse(saved) as Usuario;
      if (USERS.find((x) => x.id === u.id)) {
        currentUser = u;
        window.currentUser = u;
        _mountApp();
        return;
      }
    } catch {
      localStorage.removeItem('cenargen_user');
    }
  }
  // Sem sessão: mostra tela de login
  const loginScreen = document.getElementById('login-screen');
  if (loginScreen) loginScreen.style.display = '';
}

// Expõe globalmente
window.USERS = USERS;
window.currentUser = currentUser;
window.doLogin = doLogin;
window.doLogoff = doLogoff;
window.initAuth = initAuth;
window.selectProfile = selectProfile;
window.loginKeydown = loginKeydown;
window.addUser = addUser;
window.removeUser = removeUser;

export { USERS, addUser, removeUser, doLogin, doLogoff, initAuth, selectProfile, loginKeydown };
