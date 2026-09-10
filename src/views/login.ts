/**
 * View: Login
 * Autenticação front-end com dois perfis (pesquisador / admin).
 */
import type { Usuario } from '../types';

const USERS: Usuario[] = [
  { id: 'U01', name: 'Dr. Rafael Lima',   role: 'pesquisador', login: 'pesquisador', senha: 'embrapa123' },
  { id: 'U02', name: 'Admin Cenargen',    role: 'admin',       login: 'admin',       senha: 'admin123'   },
  { id: 'U03', name: 'Dra. Ana Oliveira', role: 'pesquisador', login: 'ana',         senha: 'embrapa123' },
];

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

export { USERS, doLogin, doLogoff, initAuth, selectProfile, loginKeydown };
