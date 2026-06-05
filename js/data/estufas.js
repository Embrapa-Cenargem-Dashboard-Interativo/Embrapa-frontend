/**
 * Dados das Estufas e Reservas
 * Embrapa Cenargen
 */

const ESTUFAS = {
  E01: { nome: 'Casa de Vegetação 1',    tipo: 'Casa de Vegetação',    status: 'livre',       area: '200 m²', cap: 12, icon: 'fa-leaf',   desc: 'Espaço climatizado com sistema de irrigação automatizado, ideal para experimentos em condições controladas de temperatura e umidade.' },
  E02: { nome: 'Casa de Vegetação 2',    tipo: 'Casa de Vegetação',    status: 'ocupada',     area: '180 m²', cap: 10, icon: 'fa-sprout', desc: 'Casa de vegetação com estrutura de alumínio e cobertura em policarbonato. Equipada com bancadas e sistema de nebulização.' },
  E03: { nome: 'Campo Experimental 3',   tipo: 'Campo Experimental',   status: 'ocupada',     area: '500 m²', cap: 20, icon: 'fa-wheat',  desc: 'Área a céu aberto com solo preparado para cultivos experimentais em larga escala. Possui sistema de irrigação por gotejamento.' },
  E04: { nome: 'Casa de Vegetação 4',    tipo: 'Casa de Vegetação',    status: 'reservada',   area: '150 m²', cap: 8,  icon: 'fa-flower', desc: 'Espaço compacto para experimentos de pequeno porte, com controle preciso de iluminação e ventilação.' },
  E05: { nome: 'Câmara de Crescimento 5',tipo: 'Câmara de Crescimento',status: 'livre',       area: '60 m²',  cap: 4,  icon: 'fa-flask',  desc: 'Câmara com controle total de temperatura, umidade e fotoperíodo. Ideal para experimentos que exigem condições muito precisas.' },
  E06: { nome: 'Campo Experimental 6',   tipo: 'Campo Experimental',   status: 'livre',       area: '800 m²', cap: 30, icon: 'fa-tree',   desc: 'Maior área experimental do Cenargen. Subdividida em parcelas para múltiplos experimentos simultâneos com isolamento adequado.' },
  E07: { nome: 'Casa de Vegetação 7',    tipo: 'Casa de Vegetação',    status: 'manutencao',  area: '180 m²', cap: 10, icon: 'fa-wrench', desc: 'Temporariamente indisponível. Sistema de irrigação em manutenção corretiva. Previsão de retorno: 15/05/2026.' },
  E08: { nome: 'Campo Experimental 8',   tipo: 'Campo Experimental',   status: 'livre',       area: '400 m²', cap: 16, icon: 'fa-clover', desc: 'Campo com solo de cerrado nativo. Especialmente indicado para estudos de adaptação e melhoramento genético.' },
};

let reservas = [
  { id: 'R001', estufaId: 'E02', data: '2026-04-01', qtd: 7,  projeto: 'CRISPR-Soja: Resistência a Nematódeos', status: 'ativa'   },
  { id: 'R002', estufaId: 'E03', data: '2026-03-15', qtd: 12, projeto: 'Biofortificação em Feijão',              status: 'ativa'   },
  { id: 'R003', estufaId: 'E04', data: '2026-05-10', qtd: 5,  projeto: 'CRISPR-Soja: Resistência a Nematódeos', status: 'pendente'},
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
  reservas: 'cenargen_reservas',
  statuses: 'cenargen_estufas_status',
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
