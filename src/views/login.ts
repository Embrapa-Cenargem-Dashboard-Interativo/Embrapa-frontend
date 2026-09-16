import { loadState } from '../data/estufas';
import { login as apiLogin } from '../services/api';

let currentUser: { id: number; nome: string; tipo: string; super_usuario: boolean } | null = null;

// ─── Seleção rápida de perfil (mantém como atalho de preenchimento) ──

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
    u.value = 'rafael.lima';
    p.value = '123456';
  }
}

// ─── Login ────────────────────────────────────────────────

async function doLogin(): Promise<void> {
  const userEl = document.getElementById('login-user') as HTMLInputElement | null;
  const passEl = document.getElementById('login-pass') as HTMLInputElement | null;
  const err = document.getElementById('login-error');

  const nick = (userEl?.value || '').trim();
  const senha = (passEl?.value || '').trim();

  try {
    const resultado = await apiLogin(nick, senha);

    localStorage.setItem('token', resultado.token);
    localStorage.setItem('cenargen_user', JSON.stringify(resultado.funcionario));

    err?.classList.remove('show');
    currentUser = resultado.funcionario;
    window.currentUser = resultado.funcionario;

    await _mountApp();
  } catch (e) {
    if (err) {
      err.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Usuário ou senha inválidos.';
      err.classList.add('show');
    }
    if (passEl) passEl.value = '';
  }
}

function loginKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') doLogin();
}

// ─── Logoff ───────────────────────────────────────────────

function doLogoff(): void {
  currentUser = null;
  window.currentUser = null;
  localStorage.removeItem('cenargen_user');
  localStorage.removeItem('token');

  const appWrap = document.getElementById('app-wrap');
  const loginScreen = document.getElementById('login-screen');
  if (appWrap) appWrap.style.display = 'none';
  if (loginScreen) loginScreen.style.display = '';
  document.getElementById('user-dropdown')?.classList.remove('open');

  const userEl = document.getElementById('login-user') as HTMLInputElement | null;
  const passEl = document.getElementById('login-pass') as HTMLInputElement | null;
  if (userEl) userEl.value = '';
  if (passEl) passEl.value = '';
  document.querySelectorAll('.login-profile-btn').forEach((b) => b.classList.remove('selected'));
  document.getElementById('login-error')?.classList.remove('show');
}

// ─── Montar app após login ────────────────────────────────

async function _mountApp(): Promise<void> {
  const loginScreen = document.getElementById('login-screen');
  const appWrap = document.getElementById('app-wrap');
  if (loginScreen) loginScreen.style.display = 'none';
  if (appWrap) appWrap.style.display = '';

  const nameEl = document.getElementById('user-name-display');
  const roleEl = document.getElementById('user-role-display');
  if (nameEl) nameEl.textContent = currentUser!.nome;
  if (roleEl) roleEl.textContent = currentUser!.tipo === 'SU' ? 'Administrador' : (currentUser as any).cargo || 'Funcionário';

  const adminBtn = document.getElementById('btn-nav-admin');
  if (adminBtn) adminBtn.style.display = currentUser!.super_usuario ? '' : 'none';

  await loadState();

  window.initMapState?.();
  window.showView?.('mapa');
}

// ─── Restaurar sessão do localStorage ────────────────────

async function initAuth(): Promise<void> {
  const savedUser = localStorage.getItem('cenargen_user');
  const savedToken = localStorage.getItem('token');

  if (savedUser && savedToken) {
    try {
      currentUser = JSON.parse(savedUser);
      window.currentUser = currentUser;
      await _mountApp();
      return;
    } catch {
      localStorage.removeItem('cenargen_user');
      localStorage.removeItem('token');
    }
  }

  const loginScreen = document.getElementById('login-screen');
  if (loginScreen) loginScreen.style.display = '';
}

// Expõe globalmente
window.currentUser = currentUser;
window.doLogin = doLogin;
window.doLogoff = doLogoff;
window.initAuth = initAuth;
window.selectProfile = selectProfile;
window.loginKeydown = loginKeydown;

export { doLogin, doLogoff, initAuth, selectProfile, loginKeydown };