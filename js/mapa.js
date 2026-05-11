/**
 * Lógica de Mapa e Reservas
 * Gerencia estufas, reservas e interações do mapa
 */

// ─── DATA ──────────────────────────────────────────────
const estufas = {
  E01: { nome: 'Casa de Vegetação 1', tipo: 'Casa de Vegetação', status: 'livre', area: '200 m²', cap: 12, icon: 'fa-leaf', desc: 'Espaço climatizado com sistema de irrigação automatizado, ideal para experimentos em condições controladas de temperatura e umidade.' },
  E02: { nome: 'Casa de Vegetação 2', tipo: 'Casa de Vegetação', status: 'ocupada', area: '180 m²', cap: 10, icon: 'fa-sprout', desc: 'Casa de vegetação com estrutura de alumínio e cobertura em policarbonato. Equipada com bancadas e sistema de nebulização.' },
  E03: { nome: 'Campo Experimental 3', tipo: 'Campo Experimental', status: 'ocupada', area: '500 m²', cap: 20, icon: 'fa-wheat', desc: 'Área a céu aberto com solo preparado para cultivos experimentais em larga escala. Possui sistema de irrigação por gotejamento.' },
  E04: { nome: 'Casa de Vegetação 4', tipo: 'Casa de Vegetação', status: 'reservada', area: '150 m²', cap: 8, icon: 'fa-flower', desc: 'Espaço compacto para experimentos de pequeno porte, com controle preciso de iluminação e ventilação.' },
  E05: { nome: 'Câmara de Crescimento 5', tipo: 'Câmara de Crescimento', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-flask', desc: 'Câmara com controle total de temperatura, umidade e fotoperíodo. Ideal para experimentos que exigem condições muito precisas.' },
  E06: { nome: 'Campo Experimental 6', tipo: 'Campo Experimental', status: 'livre', area: '800 m²', cap: 30, icon: 'fa-tree', desc: 'Maior área experimental do Cenargen. Subdividida em parcelas para múltiplos experimentos simultâneos com isolamento adequado.' },
  E07: { nome: 'Casa de Vegetação 7', tipo: 'Casa de Vegetação', status: 'manutencao', area: '180 m²', cap: 10, icon: 'fa-wrench', desc: 'Temporariamente indisponível. Sistema de irrigação em manutenção corretiva. Previsão de retorno: 15/05/2026.' },
  E08: { nome: 'Campo Experimental 8', tipo: 'Campo Experimental', status: 'livre', area: '400 m²', cap: 16, icon: 'fa-clover', desc: 'Campo com solo de cerrado nativo. Especialmente indicado para estudos de adaptação e melhoramento genético.' },
};

let reservas = [
  { id: 'R001', estufaId: 'E02', data: '2026-04-01', qtd: 7, projeto: 'CRISPR-Soja: Resistência a Nematódeos', status: 'ativa' },
  { id: 'R002', estufaId: 'E03', data: '2026-03-15', qtd: 12, projeto: 'Biofortificação em Feijão', status: 'ativa' },
  { id: 'R003', estufaId: 'E04', data: '2026-05-10', qtd: 5, projeto: 'CRISPR-Soja: Resistência a Nematódeos', status: 'pendente' },
];

let activeEstufaId = null;
let activeReservaId = null;

// ─── STATUS HELPERS ────────────────────────────────────
const statusMap = {
  livre: { label: 'Livre', cls: 'pill-green', icon: 'fa-circle-check' },
  ocupada: { label: 'Ocupada', cls: 'pill-warn', icon: 'fa-house-leaf' },
  reservada: { label: 'Reservada', cls: 'pill-info', icon: 'fa-calendar' },
  manutencao: { label: 'Manutenção', cls: 'pill-danger', icon: 'fa-wrench' },
  ativa: { label: 'Ativa', cls: 'pill-green', icon: 'fa-circle-check' },
  pendente: { label: 'Pendente', cls: 'pill-warn', icon: 'fa-clock' },
  cancelada: { label: 'Cancelada', cls: 'pill-danger', icon: 'fa-xmark' },
};

/**
 * Cria badge de status com ícone
 */
function pill(s) {
  const m = statusMap[s] || { label: s, cls: 'pill-muted', icon: 'fa-circle' };
  return `<span class="pill ${m.cls}"><i class="fa-solid ${m.icon}" style="font-size:8px"></i>${m.label}</span>`;
}

// ─── NAVIGATION ────────────────────────────────────────
/**
 * Alterna entre views
 */
function showView(v) {
  document.querySelectorAll('.view').forEach(x => x.classList.remove('active'));
  document.getElementById('view-' + v).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-nav-' + v).classList.add('active');
  if (v === 'reservas') renderReservasList();
  closePopup();
}

// ─── USER DROPDOWN ─────────────────────────────────────
/**
 * Alterna dropdown do usuário
 */
function toggleDropdown() {
  document.getElementById('user-dropdown').classList.toggle('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#user-btn') && !e.target.closest('#user-dropdown'))
    document.getElementById('user-dropdown').classList.remove('open');
});

/**
 * Realiza logout
 */
function doLogoff() {
  showToast('Sessão encerrada', 'info');
  document.getElementById('user-dropdown').classList.remove('open');
}

// ─── MAP POPUP ─────────────────────────────────────────
/**
 * Abre popup de estufa no mapa
 */
function openPopup(id, event) {
  activeEstufaId = id;
  const e = estufas[id];
  const s = statusMap[e.status] || { label: e.status, cls: 'pill-muted' };
  const popup = document.getElementById('map-popup');

  document.getElementById('popup-status').innerHTML = `<span class="pill ${s.cls}"><i class="fa-solid ${e.icon}"></i> ${s.label}</span>`;
  document.getElementById('popup-name').textContent = e.nome;
  document.getElementById('popup-desc').textContent = e.desc.substring(0, 90) + '…';
  document.getElementById('popup-area').textContent = e.area;
  document.getElementById('popup-cap').textContent = e.cap + ' bancadas';

  const btn = document.getElementById('popup-action-btn');
  if (e.status === 'livre') {
    btn.innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Reservar';
    btn.className = 'btn btn-primary';
    btn.style.width = '100%';
    btn.style.justifyContent = 'center';
    btn.onclick = openReservarModal;
  } else if (e.status === 'manutencao') {
    btn.innerHTML = '<i class="fa-solid fa-wrench"></i> Em Manutenção';
    btn.className = 'btn btn-ghost';
    btn.style.width = '100%';
    btn.style.justifyContent = 'center';
    btn.onclick = null;
  } else {
    btn.innerHTML = '<i class="fa-solid fa-eye"></i> Ver Detalhes';
    btn.className = 'btn btn-ghost';
    btn.style.width = '100%';
    btn.style.justifyContent = 'center';
    btn.onclick = null;
  }

  // Posiciona popup próximo ao clique
  const mapRect = document.getElementById('map-container').getBoundingClientRect();
  const svgEl = document.getElementById('map-svg');
  const svgRect = svgEl.getBoundingClientRect();

  // Encontra elemento SVG da estufa
  const shapes = svgEl.querySelectorAll(`[data-id="${id}"] rect`);
  let px = 200, py = 200;
  if (shapes[0]) {
    const r = shapes[0];
    const scaleX = svgRect.width / 900;
    const scaleY = svgRect.height / 520;
    px = (+r.getAttribute('x') + +r.getAttribute('width') / 2) * scaleX;
    py = (+r.getAttribute('y') + +r.getAttribute('height')) * scaleY + 8;
  }

  // Mantém popup dentro dos limites
  const popW = 240, popH = 230;
  let left = px - popW / 2;
  let top = py;
  if (left < 8) left = 8;
  if (left + popW > mapRect.width - 8) left = mapRect.width - popW - 8;
  if (top + popH > mapRect.height - 8) top = py - popH - 28;

  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
  popup.classList.add('open');
}

/**
 * Fecha popup do mapa
 */
function closePopup() {
  document.getElementById('map-popup').classList.remove('open');
}

// ─── MODAL: RESERVAR ──────────────────────────────────
/**
 * Abre modal de reserva
 */
function openReservarModal() {
  if (!activeEstufaId) return;
  const e = estufas[activeEstufaId];
  if (e.status !== 'livre') {
    showToast('Este espaço não está disponível', 'error');
    return;
  }

  const s = statusMap[e.status];
  document.getElementById('reservar-img-icon').innerHTML = `<i class="fa-solid ${e.icon}" style="font-size:48px;"></i>`;
  document.getElementById('reservar-badge').innerHTML = `<i class="fa-solid ${s.icon}" style="font-size:8px"></i> ${s.label}`;
  document.getElementById('reservar-badge').className = `pill ${s.cls}`;
  document.getElementById('reservar-title').textContent = e.nome;
  document.getElementById('reservar-desc').textContent = e.desc;
  document.getElementById('reservar-area').textContent = e.area;
  document.getElementById('reservar-cap').textContent = e.cap + ' bancadas';
  document.getElementById('reservar-limite').textContent = 'Limite: ' + e.cap;
  document.getElementById('reservar-data').value = '';
  document.getElementById('reservar-qtd').value = '';
  document.getElementById('reservar-proj').value = '';
  document.getElementById('overlay-reservar').classList.add('open');
  closePopup();
}

/**
 * Confirma e salva reserva
 */
function confirmarReserva() {
  const data = document.getElementById('reservar-data').value;
  const qtd = document.getElementById('reservar-qtd').value;
  const proj = document.getElementById('reservar-proj').value;

  if (!data || !qtd || !proj) {
    showToast('Preencha todos os campos', 'error');
    return;
  }

  const e = estufas[activeEstufaId];
  if (+qtd > e.cap) {
    showToast(`Limite máximo é ${e.cap} vasos/estantes`, 'error');
    return;
  }

  const newId = 'R00' + (reservas.length + 1);
  reservas.push({ id: newId, estufaId: activeEstufaId, data, qtd: +qtd, projeto: proj, status: 'pendente' });
  closeAll();
  showToast('Reserva realizada com sucesso', 'success');

  // Atualiza status da estufa
  estufas[activeEstufaId].status = 'reservada';
  updateEstufaOnMap(activeEstufaId);
}

/**
 * Atualiza cores e status da estufa no mapa
 */
function updateEstufaOnMap(id) {
  const svgEl = document.getElementById('map-svg');
  const group = svgEl.querySelector(`[data-id="${id}"]`);
  if (!group) return;

  const e = estufas[id];
  const colorMap = { livre: '#2a9a58', ocupada: '#c97810', reservada: '#1a56c4', manutencao: '#c42828' };
  const bgMap = { livre: '#dcf0e3', ocupada: '#fef3e2', reservada: '#e6effe', manutencao: '#fdeaea' };
  const labelMap = { livre: 'LIVRE', ocupada: 'OCUPADA', reservada: 'RESERVADA', manutencao: 'MANUTENÇÃO' };

  const c = colorMap[e.status], bg = bgMap[e.status];
  const rects = group.querySelectorAll('rect');

  if (rects[0]) {
    rects[0].setAttribute('fill', bg);
    rects[0].setAttribute('stroke', c);
  }
  if (rects[1]) {
    rects[1].setAttribute('fill', c);
  }

  const texts = group.querySelectorAll('text');
  if (texts[1]) {
    texts[1].setAttribute('fill', c);
    texts[1].textContent = labelMap[e.status];
  }

  const circles = group.querySelectorAll('circle');
  if (circles[0]) {
    circles[0].setAttribute('fill', c);
  }
}

// ─── MODAL: VER RESERVA ───────────────────────────────
/**
 * Abre modal de reserva existente
 */
function verReserva(id) {
  activeReservaId = id;
  const r = reservas.find(x => x.id === id);
  if (!r) return;

  const e = estufas[r.estufaId];
  const rs = statusMap[r.status] || { label: r.status, cls: 'pill-muted', icon: 'fa-circle' };

  document.getElementById('ver-img-icon').innerHTML = `<i class="fa-solid ${e.icon}" style="font-size:48px;"></i>`;
  document.getElementById('ver-badge').innerHTML = `<i class="fa-solid ${rs.icon}" style="font-size:8px"></i> ${rs.label}`;
  document.getElementById('ver-badge').className = `pill ${rs.cls}`;
  document.getElementById('ver-title').textContent = e.nome;
  document.getElementById('ver-desc').textContent = e.desc;
  document.getElementById('ver-data').textContent = fmtDate(r.data);
  document.getElementById('ver-qtd').textContent = r.qtd + ' vasos/estantes';
  document.getElementById('ver-proj').textContent = r.projeto;
  document.getElementById('overlay-ver-reserva').classList.add('open');
}

/**
 * Cancela uma reserva
 */
function cancelarReservaModal() {
  const r = reservas.find(x => x.id === activeReservaId);
  if (r) {
    r.status = 'cancelada';
    estufas[r.estufaId].status = 'livre';
    updateEstufaOnMap(r.estufaId);
  }
  closeAll();
  renderReservasList();
  showToast('Reserva cancelada', 'info');
}

// ─── RENDER RESERVAS LIST ─────────────────────────────
/**
 * Renderiza lista de reservas
 */
function renderReservasList() {
  const list = document.getElementById('reservas-list');
  const ativos = reservas.filter(r => r.status !== 'cancelada');

  if (!ativos.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-calendar-check"></i></div><div class="empty-text">Nenhuma reserva encontrada.<br>Clique em uma estufa no mapa para reservar.</div></div>';
    return;
  }

  const bgMap = { livre: 'var(--accent-lt)', ocupada: 'var(--warn-lt)', reservada: 'var(--info-lt)', manutencao: 'var(--danger-lt)' };

  list.innerHTML = ativos.map(r => {
    const e = estufas[r.estufaId];
    return `
      <div class="reserva-card" onclick="verReserva('${r.id}')">
        <div class="reserva-thumb" style="background:${bgMap[e.status] || 'var(--accent-lt)'}">
          <i class="fa-solid ${e.icon}"></i>
        </div>
        <div class="reserva-info">
          <div class="reserva-name">${e.nome}</div>
          <div class="reserva-sub"><i class="fa-solid fa-flask" style="margin-right:4px;color:var(--muted2)"></i>${r.projeto}</div>
          <div class="reserva-sub" style="margin-top:3px"><i class="fa-solid fa-calendar" style="margin-right:4px;color:var(--muted2)"></i>${fmtDate(r.data)} · ${r.qtd} vasos/estantes</div>
        </div>
        <div class="reserva-right">
          ${pill(r.status)}
          <span style="font-size:11px;color:var(--muted)">${r.id}</span>
        </div>
      </div>`;
  }).join('');
}

// ─── UTILS ────────────────────────────────────────────
/**
 * Formata data de YYYY-MM-DD para DD/MM/YYYY
 */
function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

/**
 * Fecha todos os overlays/modais
 */
function closeAll() {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('open'));
}

/**
 * Fecha modal ao clicar fora
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.overlay').forEach(o => {
    o.addEventListener('click', e => {
      if (e.target === o) closeAll();
    });
  });
});

/**
 * Exibe toast/notificação
 */
function showToast(msg, type = 'info') {
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const c = document.getElementById('toast-wrap');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type] || 'fa-circle-info'}"></i> ${msg}`;
  c.appendChild(t);
  setTimeout(() => t.style.opacity = '0', 3000);
  setTimeout(() => t.remove(), 3300);
}

// ─── INIT ─────────────────────────────────────────────
// Define hoje como data mínima
if (document.getElementById('reservar-data')) {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('reservar-data').min = today;
}
