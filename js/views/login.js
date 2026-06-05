/**
 * View: Login
 * Autenticação front-end com dois perfis (pesquisador / admin).
 */

const USERS = [
  { id: 'U01', name: 'Dr. Rafael Lima',   role: 'pesquisador', login: 'pesquisador', senha: 'embrapa123' },
  { id: 'U02', name: 'Admin Cenargen',    role: 'admin',       login: 'admin',       senha: 'admin123'   },
  { id: 'U03', name: 'Dra. Ana Oliveira', role: 'pesquisador', login: 'ana',         senha: 'embrapa123' },
];

let currentUser = null;

// ─── Seleção rápida de perfil ─────────────────────────────

function selectProfile(role) {
  document.querySelectorAll('.login-profile-btn').forEach(b => b.classList.remove('selected'));
  const btn = document.querySelector(`.login-profile-btn[data-role="${role}"]`);
  if (btn) btn.classList.add('selected');

  const u = document.getElementById('login-user');
  const p = document.getElementById('login-pass');
  if (role === 'admin') {
    u.value = 'admin';
    p.value = 'admin123';
  } else {
    u.value = 'pesquisador';
    p.value = 'embrapa123';
  }
}

// ─── Login ────────────────────────────────────────────────

function doLogin() {
  const login = (document.getElementById('login-user').value || '').trim();
  const senha = (document.getElementById('login-pass').value || '').trim();
  const err   = document.getElementById('login-error');

  const user = USERS.find(u => u.login === login && u.senha === senha);

  if (!user) {
    err.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Usuário ou senha inválidos.';
    err.classList.add('show');
    document.getElementById('login-pass').value = '';
    return;
  }

  err.classList.remove('show');
  currentUser = user;
  window.currentUser = user;
  localStorage.setItem('cenargen_user', JSON.stringify(user));
  _mountApp();
}

function loginKeydown(e) {
  if (e.key === 'Enter') doLogin();
}

// ─── Logoff ───────────────────────────────────────────────

function doLogoff() {
  currentUser = null;
  window.currentUser = null;
  localStorage.removeItem('cenargen_user');

  document.getElementById('app-wrap').style.display     = 'none';
  document.getElementById('login-screen').style.display = '';
  document.getElementById('user-dropdown').classList.remove('open');

  // Reset form
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.querySelectorAll('.login-profile-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('login-error').classList.remove('show');
}

// ─── Montar app após login ────────────────────────────────

function _mountApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-wrap').style.display     = '';

  // Atualiza info do usuário no dropdown
  const nameEl = document.getElementById('user-name-display');
  const roleEl = document.getElementById('user-role-display');
  if (nameEl) nameEl.textContent = currentUser.name;
  if (roleEl) roleEl.textContent = currentUser.role === 'admin' ? 'Administrador' : 'Pesquisador';

  // Mostra / oculta botão admin
  const adminBtn = document.getElementById('btn-nav-admin');
  if (adminBtn) adminBtn.style.display = currentUser.role === 'admin' ? '' : 'none';

  // Inicia mapa e vai para view inicial
  if (typeof initMapState === 'function') initMapState();
  if (typeof showView === 'function') showView('mapa');
}

// ─── Restaurar sessão do localStorage ────────────────────

function initAuth() {
  const saved = localStorage.getItem('cenargen_user');
  if (saved) {
    try {
      const u = JSON.parse(saved);
      if (USERS.find(x => x.id === u.id)) {
        currentUser      = u;
        window.currentUser = u;
        _mountApp();
        return;
      }
    } catch (e) {
      localStorage.removeItem('cenargen_user');
    }
  }
  // Sem sessão: mostra tela de login
  document.getElementById('login-screen').style.display = '';
}

// Expõe globalmente
window.USERS         = USERS;
window.currentUser   = currentUser;
window.doLogin       = doLogin;
window.doLogoff      = doLogoff;
window.initAuth      = initAuth;
window.selectProfile = selectProfile;
window.loginKeydown  = loginKeydown;
