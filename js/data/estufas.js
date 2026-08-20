/**
 * Dados das Estufas e Reservas
 * Embrapa Cenargen — 50 estufas (numeradas 1 a 50)
 */

const ESTUFAS = {
  E01: { nome: 'Estufa 01', tipo: 'Casa de vegetação', setor: 'Setor Norte', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E02: { nome: 'Estufa 02', tipo: 'Estufa climatizada', setor: 'Setor Norte', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
  E03: { nome: 'Estufa 03', tipo: 'Telado agrícola', setor: 'Setor Norte', status: 'ocupada', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E04: { nome: 'Estufa 04', tipo: 'Casa de vegetação', setor: 'Setor Norte', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E05: { nome: 'Estufa 05', tipo: 'Estufa climatizada', setor: 'Setor Norte', status: 'reservada', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E06: { nome: 'Estufa 06', tipo: 'Telado agrícola', setor: 'Setor Norte', status: 'livre', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para condições controladas.' },
  E07: { nome: 'Estufa 07', tipo: 'Casa de vegetação', setor: 'Setor Norte', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E08: { nome: 'Estufa 08', tipo: 'Estufa climatizada', setor: 'Setor Norte', status: 'manutencao', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
  E09: { nome: 'Estufa 09', tipo: 'Telado agrícola', setor: 'Setor Norte', status: 'livre', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E10: { nome: 'Estufa 10', tipo: 'Casa de vegetação', setor: 'Setor Norte', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E11: { nome: 'Estufa 11', tipo: 'Estufa climatizada', setor: 'Setor Norte', status: 'ocupada', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E12: { nome: 'Estufa 12', tipo: 'Telado agrícola', setor: 'Setor Norte', status: 'livre', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para condições controladas.' },
  E13: { nome: 'Estufa 13', tipo: 'Casa de vegetação', setor: 'Setor Norte', status: 'reservada', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E14: { nome: 'Estufa 14', tipo: 'Estufa climatizada', setor: 'Setor Norte', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
  E15: { nome: 'Estufa 15', tipo: 'Telado agrícola', setor: 'Setor Norte', status: 'livre', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E16: { nome: 'Estufa 16', tipo: 'Casa de vegetação', setor: 'Setor Norte', status: 'manutencao', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E17: { nome: 'Estufa 17', tipo: 'Estufa climatizada', setor: 'Setor Leste', status: 'livre', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E18: { nome: 'Estufa 18', tipo: 'Telado agrícola', setor: 'Setor Leste', status: 'livre', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para condições controladas.' },
  E19: { nome: 'Estufa 19', tipo: 'Casa de vegetação', setor: 'Setor Leste', status: 'ocupada', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E20: { nome: 'Estufa 20', tipo: 'Estufa climatizada', setor: 'Setor Leste', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
  E21: { nome: 'Estufa 21', tipo: 'Telado agrícola', setor: 'Setor Leste', status: 'reservada', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E22: { nome: 'Estufa 22', tipo: 'Casa de vegetação', setor: 'Setor Central', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E23: { nome: 'Estufa 23', tipo: 'Estufa climatizada', setor: 'Setor Central', status: 'livre', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E24: { nome: 'Estufa 24', tipo: 'Telado agrícola', setor: 'Setor Central', status: 'manutencao', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para condições controladas.' },
  E25: { nome: 'Estufa 25', tipo: 'Casa de vegetação', setor: 'Setor Central', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E26: { nome: 'Estufa 26', tipo: 'Estufa climatizada', setor: 'Setor Central', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
  E27: { nome: 'Estufa 27', tipo: 'Telado agrícola', setor: 'Setor Central', status: 'ocupada', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E28: { nome: 'Estufa 28', tipo: 'Casa de vegetação', setor: 'Setor Central', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E29: { nome: 'Estufa 29', tipo: 'Estufa climatizada', setor: 'Setor Central', status: 'reservada', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E30: { nome: 'Estufa 30', tipo: 'Telado agrícola', setor: 'Setor Central', status: 'livre', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para condições controladas.' },
  E31: { nome: 'Estufa 31', tipo: 'Casa de vegetação', setor: 'Setor Central', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E32: { nome: 'Estufa 32', tipo: 'Estufa climatizada', setor: 'Setor Central', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
  E33: { nome: 'Estufa 33', tipo: 'Telado agrícola', setor: 'Setor Central', status: 'livre', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E34: { nome: 'Estufa 34', tipo: 'Casa de vegetação', setor: 'Setor Central', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E35: { nome: 'Estufa 35', tipo: 'Estufa climatizada', setor: 'Setor Central', status: 'ocupada', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E36: { nome: 'Estufa 36', tipo: 'Telado agrícola', setor: 'Setor Sul', status: 'livre', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para condições controladas.' },
  E37: { nome: 'Estufa 37', tipo: 'Casa de vegetação', setor: 'Setor Sul', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E38: { nome: 'Estufa 38', tipo: 'Estufa climatizada', setor: 'Setor Sul', status: 'manutencao', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
  E39: { nome: 'Estufa 39', tipo: 'Telado agrícola', setor: 'Setor Sul', status: 'livre', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E40: { nome: 'Estufa 40', tipo: 'Casa de vegetação', setor: 'Setor Sul', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E41: { nome: 'Estufa 41', tipo: 'Estufa climatizada', setor: 'Setor Sul', status: 'ocupada', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E42: { nome: 'Estufa 42', tipo: 'Telado agrícola', setor: 'Setor Sul', status: 'livre', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para condições controladas.' },
  E43: { nome: 'Estufa 43', tipo: 'Casa de vegetação', setor: 'Setor Sul', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E44: { nome: 'Estufa 44', tipo: 'Estufa climatizada', setor: 'Setor Sul', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
  E45: { nome: 'Estufa 45', tipo: 'Telado agrícola', setor: 'Setor Sul', status: 'reservada', area: '120 m²', cap: 8, icon: 'fa-sprout', desc: 'Câmara com controle de temperatura, umidade e fotoperíodo para ensaios de precisão.' },
  E46: { nome: 'Estufa 46', tipo: 'Casa de vegetação', setor: 'Setor Sul', status: 'livre', area: '150 m²', cap: 10, icon: 'fa-leaf', desc: 'Casa de vegetação para multiplicação e aclimatação de mudas e plântulas.' },
  E47: { nome: 'Estufa 47', tipo: 'Estufa climatizada', setor: 'Setor Sul', status: 'livre', area: '180 m²', cap: 12, icon: 'fa-seedling', desc: 'Ambiente protegido para estudos de melhoramento e fitossanidade vegetal.' },
  E48: { nome: 'Estufa 48', tipo: 'Telado agrícola', setor: 'Setor Sul', status: 'manutencao', area: '200 m²', cap: 14, icon: 'fa-sprout', desc: 'Casa de vegetação climatizada com irrigação automatizada para condições controladas.' },
  E49: { nome: 'Estufa 49', tipo: 'Casa de vegetação', setor: 'Setor Sul', status: 'livre', area: '60 m²', cap: 4, icon: 'fa-leaf', desc: 'Estrutura em alumínio com cobertura de policarbonato, bancadas e sistema de nebulização.' },
  E50: { nome: 'Estufa 50', tipo: 'Estufa climatizada', setor: 'Setor Sul', status: 'livre', area: '90 m²', cap: 6, icon: 'fa-seedling', desc: 'Espaço para experimentos de pequeno porte com controle de luz e ventilação.' },
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

loadState();

window.ESTUFAS    = ESTUFAS;
window.reservas   = reservas;
window.STATUS_MAP = STATUS_MAP;
window.saveState  = saveState;
