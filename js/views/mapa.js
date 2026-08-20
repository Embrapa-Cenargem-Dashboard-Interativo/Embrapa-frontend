/**
 * View: Mapa
 * Marcadores minimalistas (pontos) sobre a foto aérea + painel lateral de
 * detalhes que desliza da direita ao clicar numa estufa.
 */

let activeEstufaId = null;

const _HS_STATUSES = ['livre', 'ocupada', 'reservada', 'manutencao'];

// ─── Helpers ──────────────────────────────────────────────

// Valores "ambientais" plausíveis e estáveis por estufa (só para exibição).
function _seed(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}
function _envFor(id) {
  const h = _seed(id);
  return { temp: 24 + (h % 7), umid: 55 + ((h >> 3) % 20) };
}
// Setor derivado do nome ("Casa de Vegetação A1" → "Setor A").
function _setorFor(estufa) {
  if (estufa.setor) return estufa.setor;
  const m = (estufa.nome.match(/([A-Z])\s*\d+\s*$/) || [])[1];
  return m ? ('Setor ' + m) : estufa.tipo;
}
function _fmtDataBR(d) {
  if (!d) return '—';
  const p = d.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
}

// ─── Abrir / preencher painel ─────────────────────────────

function openPanel(id) {
  const estufa = ESTUFAS[id];
  if (!estufa) return;
  activeEstufaId = id;

  const status = STATUS_MAP[estufa.status] ||
    { label: estufa.status, cls: 'pill-muted', icon: 'fa-circle' };

  // Marcador selecionado
  document.querySelectorAll('.estufa-hotspot.selected')
    .forEach(h => h.classList.remove('selected'));
  const hs = document.querySelector(`.estufa-hotspot[data-id="${id}"]`);
  if (hs) hs.classList.add('selected');

  const panel = document.getElementById('estufa-panel');
  const wasOpen = panel.classList.contains('open');

  // Classe de status controla a cor do painel (banner, ícones, tipo)
  panel.className = 'estufa-panel st-' + estufa.status + (wasOpen ? ' open' : '');

  // Banner
  document.getElementById('panel-icon').className = 'fa-solid ' + estufa.icon;
  document.getElementById('panel-code').textContent = id;
  document.getElementById('panel-status').innerHTML =
    `<i class="fa-solid ${status.icon}"></i> ${status.label}`;

  // Cabeçalho
  document.getElementById('panel-name').textContent = estufa.nome;
  document.getElementById('panel-type').textContent = estufa.tipo;
  document.getElementById('panel-desc').textContent = estufa.desc;

  // Info
  const env = _envFor(id);
  document.getElementById('panel-loc').textContent  = _setorFor(estufa) + ' · Cenargen';
  document.getElementById('panel-area').textContent = estufa.area;
  document.getElementById('panel-cap').textContent  = `${estufa.cap} bancadas`;
  document.getElementById('panel-cult').textContent = 'Hortaliças, grãos e ornamentais';
  document.getElementById('panel-cond').textContent = `${env.temp} °C · ${env.umid}% UR`;
  document.getElementById('panel-disp').textContent =
    estufa.status === 'livre'      ? 'Disponível agora' :
    estufa.status === 'manutencao' ? 'Em manutenção'    :
    estufa.status === 'ocupada'    ? 'Em uso'           : 'Sob reserva';

  // Reserva vinculada (se houver)
  const reserva = (typeof reservas !== 'undefined')
    ? reservas.find(r => r.estufaId === id && r.status !== 'cancelada')
    : null;
  const rbox = document.getElementById('panel-reserva');
  if (reserva) {
    rbox.style.display = '';
    document.getElementById('panel-reserva-proj').textContent = reserva.projeto;
    const rs = STATUS_MAP[reserva.status];
    document.getElementById('panel-reserva-meta').textContent =
      `${_fmtDataBR(reserva.data)} · ${reserva.qtd} vasos/estantes · ${rs ? rs.label : reserva.status}`;
  } else {
    rbox.style.display = 'none';
  }

  // Botão de ação
  const btn = document.getElementById('panel-action-btn');
  btn.style.cssText = 'width:100%;justify-content:center';
  btn.disabled = false;

  if (estufa.status === 'livre') {
    btn.innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Reservar esta estufa';
    btn.className = 'btn btn-primary';
    btn.onclick = openReservarModal;
  } else if (estufa.status === 'reservada' && reserva) {
    btn.innerHTML = '<i class="fa-solid fa-eye"></i> Ver detalhes da reserva';
    btn.className = 'btn btn-ghost';
    btn.onclick = () => verReserva(reserva.id);
  } else if (estufa.status === 'manutencao') {
    btn.innerHTML = '<i class="fa-solid fa-wrench"></i> Em manutenção';
    btn.className = 'btn btn-ghost';
    btn.disabled = true;
    btn.onclick = null;
  } else {
    // ocupada, ou reservada sem registro vinculado
    btn.innerHTML = `<i class="fa-solid ${status.icon}"></i> ${status.label}`;
    btn.className = 'btn btn-ghost';
    btn.disabled = true;
    btn.onclick = null;
  }

  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

function closePanel() {
  const panel = document.getElementById('estufa-panel');
  if (panel) {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
  document.querySelectorAll('.estufa-hotspot.selected')
    .forEach(h => h.classList.remove('selected'));
  activeEstufaId = null;
}

// Aliases de compatibilidade (onclick nos hotspots e chamadas antigas)
function openPopup(id) { openPanel(id); }
function closePopup()  { closePanel(); }

// ─── Atualização visual do marcador ──────────────────────

function updateEstufaOnMap(id) {
  const hs = document.querySelector(`.estufa-hotspot[data-id="${id}"]`);
  if (!hs) return;
  const st = ESTUFAS[id].status;
  _HS_STATUSES.forEach(s => hs.classList.remove('st-' + s));
  hs.classList.add('st-' + st);

  // Se o painel estiver aberto nesta estufa, reflete a mudança
  if (activeEstufaId === id &&
      document.getElementById('estufa-panel').classList.contains('open')) {
    openPanel(id);
  }
}

// ─── Layer de hotspots cobre a imagem ────────────────────

function syncHotspots() {
  const img     = document.getElementById('map-photo');
  const overlay = document.getElementById('map-hotspots');
  if (!img || !overlay || !img.naturalWidth) return;
  overlay.style.left = '0px';
  overlay.style.top  = '0px';
  overlay.style.width  = '100%';
  overlay.style.height = '100%';
}
window.addEventListener('resize', syncHotspots);

// ─── Fechar ao clicar fora / Esc ─────────────────────────

document.addEventListener('click', (e) => {
  if (e.target.closest('.estufa-hotspot')) return;   // o marcador abre/troca
  if (e.target.closest('#estufa-panel'))   return;   // clique dentro do painel
  const panel = document.getElementById('estufa-panel');
  if (panel && panel.classList.contains('open')) closePanel();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel();
});

// ─── Expõe globalmente ───────────────────────────────────

window.openPanel         = openPanel;
window.closePanel        = closePanel;
window.openPopup         = openPopup;
window.closePopup        = closePopup;
window.updateEstufaOnMap = updateEstufaOnMap;
window.syncHotspots      = syncHotspots;
