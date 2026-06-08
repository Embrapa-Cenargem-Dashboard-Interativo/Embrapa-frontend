/**
 * View: Reservas
 * Modal de criar reserva, modal de ver reserva, lista de reservas.
 */

let activeReservaId = null;

// ─── Helper ───────────────────────────────────────────────

function _pill(statusKey) {
  const s = STATUS_MAP[statusKey] || { label: statusKey, cls: 'pill-muted', icon: 'fa-circle' };
  return `<span class="pill ${s.cls}"><i class="fa-solid ${s.icon}" style="font-size:8px"></i>${s.label}</span>`;
}

// ─── Modal: Reservar ──────────────────────────────────────

function openReservarModal() {
  if (!activeEstufaId) return;

  const estufa = ESTUFAS[activeEstufaId];
  if (estufa.status !== 'livre') {
    showToast('Este espaço não está disponível', 'error');
    return;
  }

  const status = STATUS_MAP[estufa.status];

  document.getElementById('reservar-img-icon').innerHTML =
    `<i class="fa-solid ${estufa.icon}"></i>`;
  document.getElementById('reservar-badge').innerHTML =
    `<i class="fa-solid ${status.icon}" style="font-size:8px"></i> ${status.label}`;
  document.getElementById('reservar-badge').className = `pill ${status.cls}`;
  document.getElementById('reservar-title').textContent  = estufa.nome;
  document.getElementById('reservar-desc').textContent   = estufa.desc;
  document.getElementById('reservar-area').textContent   = estufa.area;
  document.getElementById('reservar-cap').textContent    = `${estufa.cap} bancadas`;
  document.getElementById('reservar-limite').textContent = `Limite: ${estufa.cap}`;
  document.getElementById('reservar-data').value  = '';
  document.getElementById('reservar-qtd').value   = '';
  document.getElementById('reservar-proj').value  = '';

  document.getElementById('overlay-reservar').classList.add('open');
  closePopup();
}

function confirmarReserva() {
  const data = document.getElementById('reservar-data').value;
  const qtd  = document.getElementById('reservar-qtd').value;
  const proj = document.getElementById('reservar-proj').value;

  if (!data || !qtd || !proj) {
    showToast('Preencha todos os campos', 'error');
    return;
  }

  const estufa = ESTUFAS[activeEstufaId];
  if (+qtd > estufa.cap) {
    showToast(`Limite máximo é ${estufa.cap} vasos/estantes`, 'error');
    return;
  }

  const newId = 'R' + String(reservas.length + 1).padStart(3, '0');
  reservas.push({ id: newId, estufaId: activeEstufaId, data, qtd: +qtd, projeto: proj, status: 'pendente' });

  estufa.status = 'reservada';
  updateEstufaOnMap(activeEstufaId);
  saveState();
  if (typeof refreshDashboard === 'function') refreshDashboard();

  closeAll();
  showToast('Reserva realizada com sucesso!', 'success');
}

// ─── Modal: Ver Reserva ───────────────────────────────────

function verReserva(id) {
  activeReservaId = id;
  const reserva = reservas.find(r => r.id === id);
  if (!reserva) return;

  const estufa = ESTUFAS[reserva.estufaId];
  const status = STATUS_MAP[reserva.status] || { label: reserva.status, cls: 'pill-muted', icon: 'fa-circle' };

  document.getElementById('ver-img-icon').innerHTML =
    `<i class="fa-solid ${estufa.icon}"></i>`;
  document.getElementById('ver-badge').innerHTML =
    `<i class="fa-solid ${status.icon}" style="font-size:8px"></i> ${status.label}`;
  document.getElementById('ver-badge').className  = `pill ${status.cls}`;
  document.getElementById('ver-title').textContent = estufa.nome;
  document.getElementById('ver-desc').textContent  = estufa.desc;
  document.getElementById('ver-data').textContent  = _fmtDate(reserva.data);
  document.getElementById('ver-qtd').textContent   = `${reserva.qtd} vasos/estantes`;
  document.getElementById('ver-proj').textContent  = reserva.projeto;

  document.getElementById('overlay-ver-reserva').classList.add('open');
}

function cancelarReservaModal() {
  const reserva = reservas.find(r => r.id === activeReservaId);
  if (reserva) {
    reserva.status = 'cancelada';
    ESTUFAS[reserva.estufaId].status = 'livre';
    updateEstufaOnMap(reserva.estufaId);
    saveState();
  }
  closeAll();
  if (typeof refreshDashboard === 'function') refreshDashboard();
  else renderReservasList();
  showToast('Reserva cancelada', 'info');
}

// ─── Lista de Reservas ────────────────────────────────────

function renderReservasList() {
  const list   = document.getElementById('reservas-list');
  const ativos = reservas.filter(r => r.status !== 'cancelada');

  if (!ativos.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-calendar-check"></i></div>
        <div class="empty-text">Nenhuma reserva encontrada.<br>
          Clique em uma estufa no mapa para reservar.</div>
      </div>`;
    return;
  }

  const THUMB_BG = {
    livre:      'var(--accent-lt)',
    ocupada:    'var(--warn-lt)',
    reservada:  'var(--info-lt)',
    manutencao: 'var(--danger-lt)',
  };

  list.innerHTML = ativos.map(r => {
    const estufa = ESTUFAS[r.estufaId];
    return `
      <div class="reserva-card" onclick="verReserva('${r.id}')">
        <div class="reserva-thumb" style="background:${THUMB_BG[estufa.status] || 'var(--accent-lt)'}">
          <i class="fa-solid ${estufa.icon}"></i>
        </div>
        <div class="reserva-info">
          <div class="reserva-name">${estufa.nome}</div>
          <div class="reserva-sub">
            <i class="fa-solid fa-flask" style="margin-right:4px;color:var(--muted2)"></i>${r.projeto}
          </div>
          <div class="reserva-sub" style="margin-top:3px">
            <i class="fa-solid fa-calendar" style="margin-right:4px;color:var(--muted2)"></i>${_fmtDate(r.data)} · ${r.qtd} vasos/estantes
          </div>
        </div>
        <div class="reserva-right">
          ${_pill(r.status)}
          <span style="font-size:11px;color:var(--muted)">${r.id}</span>
        </div>
      </div>`;
  }).join('');
}

// ─── Helpers ──────────────────────────────────────────────

function _fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// Expõe globalmente
window.openReservarModal   = openReservarModal;
window.confirmarReserva    = confirmarReserva;
window.verReserva          = verReserva;
window.cancelarReservaModal = cancelarReservaModal;
window.renderReservasList  = renderReservasList;
