/**
 * View: Mapa
 * Gerencia hotspots sobre foto aérea e popup de estufas.
 */

let activeEstufaId = null;

// ─── Status do marcador ───────────────────────────────────

// Ícone compacto exibido no marcador por status
const _HS_ICON = {
  livre:      'fa-check',
  ocupada:    'fa-user',
  reservada:  'fa-calendar-check',
  manutencao: 'fa-wrench',
};

const _HS_STATUSES = ['livre', 'ocupada', 'reservada', 'manutencao'];

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
  const st     = estufa.status;

  // Classe de status controla cor, textura e animação (ver map.css)
  _HS_STATUSES.forEach(s => hotspot.classList.remove('st-' + s));
  hotspot.classList.add('st-' + st);

  // Ícone do status no marcador
  const badge = hotspot.querySelector('.hs-badge');
  if (badge) badge.innerHTML = `<i class="fa-solid ${_HS_ICON[st] || 'fa-circle'}"></i>`;
}

// ─── Sincroniza layer de hotspots com a imagem real ──────

function syncHotspots() {
  const img       = document.getElementById('map-photo');
  const overlay   = document.getElementById('map-hotspots');
  const container = document.getElementById('map-container');
  if (!img || !overlay || !container || !img.naturalWidth) return;

  // object-fit: fill → a imagem preenche todo o container.
  // O layer de hotspots cobre exatamente o container inteiro.
  overlay.style.left   = '0px';
  overlay.style.top    = '0px';
  overlay.style.width  = '100%';
  overlay.style.height = '100%';
}

// Re-sincroniza ao redimensionar a janela
window.addEventListener('resize', syncHotspots);

// Expõe globalmente
window.openPopup         = openPopup;
window.closePopup        = closePopup;
window.updateEstufaOnMap = updateEstufaOnMap;
window.syncHotspots      = syncHotspots;
