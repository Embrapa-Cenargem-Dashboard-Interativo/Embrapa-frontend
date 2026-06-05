/**
 * Dados das Estufas e Reservas
 * Embrapa Cenargen
 */

const ESTUFAS = {
  E01: { nome: 'Casa de Vegetação A1', tipo: 'Casa de Vegetação', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E02: { nome: 'Casa de Vegetação A2', tipo: 'Casa de Vegetação', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-leaf', desc: 'Espaço compacto para experimentos de pequeno porte com controle de luz e ventilação.' },
  E03: { nome: 'Casa de Vegetação A3', tipo: 'Casa de Vegetação', status: 'ocupada', area: '180 m²', cap: 12, icon: 'fa-leaf', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E04: { nome: 'Casa de Vegetação A4', tipo: 'Casa de Vegetação', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E05: { nome: 'Casa de Vegetação A5', tipo: 'Casa de Vegetação', status: 'reservada', area: '200 m²', cap: 14, icon: 'fa-leaf', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E06: { nome: 'Casa de Vegetação A6', tipo: 'Casa de Vegetação', status: 'livre', area: '120 m²', cap: 8, icon: 'fa-leaf', desc: 'Casa de vegetação climatizada com irrigação automatizada para experimentos em condições controladas.' },
  E07: { nome: 'Casa de Vegetação A7', tipo: 'Casa de Vegetação', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E08: { nome: 'Estufa Leste B1', tipo: 'Estufa Leste', status: 'manutencao', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço compacto para experimentos de pequeno porte com controle de luz e ventilação.' },
  E09: { nome: 'Estufa Leste B2', tipo: 'Estufa Leste', status: 'livre', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E10: { nome: 'Estufa Leste B3', tipo: 'Estufa Leste', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-seedling', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E11: { nome: 'Estufa Leste B4', tipo: 'Estufa Leste', status: 'ocupada', area: '200 m²', cap: 14, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E12: { nome: 'Estufa Leste B5', tipo: 'Estufa Leste', status: 'livre', area: '120 m²', cap: 8, icon: 'fa-seedling', desc: 'Casa de vegetação climatizada com irrigação automatizada para experimentos em condições controladas.' },
  E13: { nome: 'Estufa Leste B6', tipo: 'Estufa Leste', status: 'reservada', area: '150 m²', cap: 10, icon: 'fa-seedling', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E14: { nome: 'Casa de Vegetação C1', tipo: 'Casa de Vegetação', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-sprout', desc: 'Espaço compacto para experimentos de pequeno porte com controle de luz e ventilação.' },
  E15: { nome: 'Casa de Vegetação C2', tipo: 'Casa de Vegetação', status: 'livre', area: '180 m²', cap: 12, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E16: { nome: 'Casa de Vegetação C3', tipo: 'Casa de Vegetação', status: 'manutencao', area: '60 m²', cap: 4, icon: 'fa-sprout', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E17: { nome: 'Casa de Vegetação C4', tipo: 'Casa de Vegetação', status: 'livre', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E18: { nome: 'Casa de Vegetação C5', tipo: 'Casa de Vegetação', status: 'livre', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para experimentos em condições controladas.' },
  E19: { nome: 'Casa de Vegetação C6', tipo: 'Casa de Vegetação', status: 'ocupada', area: '150 m²', cap: 10, icon: 'fa-sprout', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E20: { nome: 'Casa de Vegetação D1', tipo: 'Casa de Vegetação', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-leaf', desc: 'Espaço compacto para experimentos de pequeno porte com controle de luz e ventilação.' },
  E21: { nome: 'Casa de Vegetação D2', tipo: 'Casa de Vegetação', status: 'reservada', area: '180 m²', cap: 12, icon: 'fa-leaf', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E22: { nome: 'Casa de Vegetação D3', tipo: 'Casa de Vegetação', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E23: { nome: 'Casa de Vegetação D4', tipo: 'Casa de Vegetação', status: 'livre', area: '200 m²', cap: 14, icon: 'fa-leaf', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E24: { nome: 'Casa de Vegetação D5', tipo: 'Casa de Vegetação', status: 'manutencao', area: '120 m²', cap: 8, icon: 'fa-leaf', desc: 'Casa de vegetação climatizada com irrigação automatizada para experimentos em condições controladas.' },
  E25: { nome: 'Casa de Vegetação D6', tipo: 'Casa de Vegetação', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E26: { nome: 'Casa de Vegetação D7', tipo: 'Casa de Vegetação', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-leaf', desc: 'Espaço compacto para experimentos de pequeno porte com controle de luz e ventilação.' },
  E27: { nome: 'Casa de Vegetação D8', tipo: 'Casa de Vegetação', status: 'ocupada', area: '180 m²', cap: 12, icon: 'fa-leaf', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
};

let reservas = [
  { id: 'R001', estufaId: 'E03', data: '2026-04-10', qtd: 5, projeto: 'CRISPR-Soja: Resistência a Nematódeos', status: 'ativa' },
  { id: 'R002', estufaId: 'E05', data: '2026-05-11', qtd: 6, projeto: 'Biofortificação em Feijão', status: 'pendente' },
  { id: 'R003', estufaId: 'E11', data: '2026-06-12', qtd: 7, projeto: 'Melhoramento de Milho Tropical', status: 'ativa' },
];

const STATUS_MAP = {
  livre:      { label: 'Livre',       cls: 'pill-green',  icon: 'fa-circle-check'  },
  ocupada:    { label: 'Ocupada',     cls: 'pill-warn',   icon: 'fa-house-leaf'    },
  reservada:  { label: 'Reservada',   cls: 'pill-info',   icon: 'fa-calendar'      },
  manutencao: { label: 'Manutenção',  cls: 'pill-danger', icon: 'fa-wrench'        },
  ativa:      { label: 'Ativa',       cls: 'pill-green',  icon: 'fa-circle-check'  },
  pendente:   { label: 'Pendente',    cls: 'pill-warn',   icon: 'fa-clock'         },
  cancelada:  { label: 'Cancelada',   cls: 'pill-danger', icon: 'fa-xmark'         },
};

// ─── LocalStorage ─────────────────────────────────────────

const _KEYS = {
  reservas: 'cenargen_reservas_v2',
  statuses: 'cenargen_estufas_status_v2',
};

/**
 * Persiste reservas e status das estufas no localStorage.
 */
function saveState() {
  try {
    const statuses = {};
    Object.keys(ESTUFAS).forEach(function(id) { statuses[id] = ESTUFAS[id].status; });
    localStorage.setItem(_KEYS.reservas, JSON.stringify(reservas));
    localStorage.setItem(_KEYS.statuses, JSON.stringify(statuses));
  } catch (e) {
    console.warn('[Cenargen] Erro ao salvar estado:', e);
  }
}

/**
 * Restaura reservas e status do localStorage.
 * Modifica arrays/objetos in-place para preservar referências.
 */
function loadState() {
  try {
    var savedR = localStorage.getItem(_KEYS.reservas);
    var savedS = localStorage.getItem(_KEYS.statuses);

    if (savedR) {
      var loaded = JSON.parse(savedR);
      reservas.length = 0;
      loaded.forEach(function(r) { reservas.push(r); });
    }

    if (savedS) {
      var statuses = JSON.parse(savedS);
      Object.keys(statuses).forEach(function(id) {
        if (ESTUFAS[id]) ESTUFAS[id].status = statuses[id];
      });
    }
  } catch (e) {
    console.warn('[Cenargen] Erro ao carregar estado:', e);
  }
}

// Carrega imediatamente ao iniciar (antes dos outros scripts)
loadState();

// Expõe globalmente
window.ESTUFAS    = ESTUFAS;
window.reservas   = reservas;
window.STATUS_MAP = STATUS_MAP;
window.saveState  = saveState;
