/**
 * View: Mapa
 * Gerencia hotspots sobre foto aérea e popup de estufas.
 */

let activeEstufaId = null;

// ─── Cores por status ─────────────────────────────────────

const _HS_COLORS = {
  livre:      '#007A3D',
  ocupada:    '#b86b00',
  reservada:  '#003DA5',
  manutencao: '#c42828',
};

const _HS_BG = {
  livre:      'rgba(0,122,61,.20)',
  ocupada:    'rgba(184,107,0,.20)',
  reservada:  'rgba(0,61,165,.20)',
  manutencao: 'rgba(196,40,40,.20)',
};

const _HS_LABELS = {
  livre:      'LIVRE',
  ocupada:    'OCUPADA',
  reservada:  'RESERVADA',
  manutencao: 'MANUTENÇÃO',
};

// ─── Popup ────────────────────────────────────────────────

function openPopup(id) {
  activeEstufaId = id;
  const estufa = ESTUFAS[id];
  const status = STATUS_MAP[estufa.status] || { label: estufa.status, cls: 'pill-muted', icon: 'fa-circle' };
  const popup  = document.getElementById('map-popup');

  document.getElementById('popup-status').innerHTML =
    `<span class="pill ${status.cls}"><i class="fa-solid ${estufa.icon}"></i> ${status.label}</span>`;
  document.getElementById('popup-name').textContent = estufa.nome;
  document.getElementById('popup-desc').textContent = estufa.desc.slice(0, 90) + '…';
  document.getElementById('popup-area').textContent = estufa.area;
  document.getElementById('popup-cap').textContent  = `${estufa.cap} bancadas`;

  const btn = document.getElementById('popup-action-btn');
  btn.style.cssText = 'width:100%;justify-content:center';

  if (estufa.status === 'livre') {
    btn.innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Reservar';
    btn.className = 'btn btn-primary';
    btn.onclick   = openReservarModal;
  } else if (estufa.status === 'manutencao') {
    btn.innerHTML = '<i class="fa-solid fa-wrench"></i> Em Manutenção';
    btn.className = 'btn btn-ghost';
    btn.onclick   = null;
  } else {
    btn.innerHTML = '<i class="fa-solid fa-eye"></i> Ver Detalhes';
    btn.className = 'btn btn-ghost';
    btn.onclick   = null;
  }

  _positionPopup(id, popup);
  popup.classList.add('open');
}

function closePopup() {
  document.getElementById('map-popup').classList.remove('open');
}

function _positionPopup(id, popup) {
  const mapEl   = document.getElementById('map-container');
  const hotspot = mapEl.querySelector(`.estufa-hotspot[data-id="${id}"]`);
  const mapRect = mapEl.getBoundingClientRect();

  let px = mapRect.width / 2;
  let py = 200;

  if (hotspot) {
    const hr = hotspot.getBoundingClientRect();
    px = hr.left - mapRect.left + hr.width / 2;
    py = hr.bottom - mapRect.top + 8;
  }

  const popW = 260, popH = 240;
  let left = px - popW / 2;
  let top  = py;

  if (left < 8)                         left = 8;
  if (left + popW > mapRect.width - 8)  left = mapRect.width - popW - 8;
  if (top  + popH > mapRect.height - 8) {
    const hsH = hotspot ? hotspot.getBoundingClientRect().height : 0;
    top = py - popH - hsH - 16;
  }

  popup.style.left = left + 'px';
  popup.style.top  = top  + 'px';
}

// ─── Atualização visual do hotspot ───────────────────────

function updateEstufaOnMap(id) {
  const hotspot = document.querySelector(`.estufa-hotspot[data-id="${id}"]`);
  if (!hotspot) return;

  const estufa = ESTUFAS[id];
  const c      = _HS_COLORS[estufa.status] || '#607080';
  const bg     = _HS_BG[estufa.status]     || 'rgba(96,112,128,.18)';
  const label  = _HS_LABELS[estufa.status] || estufa.status.toUpperCase();

  hotspot.style.borderColor     = c;
  hotspot.style.backgroundColor = bg;

  const badge = hotspot.querySelector('.hs-badge');
  if (badge) {
    badge.textContent        = label;
    badge.style.background   = c;
  }
}

// Expõe globalmente
window.openPopup         = openPopup;
window.closePopup        = closePopup;
window.updateEstufaOnMap = updateEstufaOnMap;
