/**
 * Augmentacao do objeto `window`.
 * O app mantem o padrao original de expor funcoes/estado globalmente para os
 * handlers `onclick` inline do index.html e para chamadas entre modulos.
 */
import type { Calendar } from './components/Calendar';
import type { Dashboard } from './components/Dashboard';
import type { Estufas, Reserva, Usuario, StatusInfo, PerfilUsuario } from './types';

declare global {
  interface Window {
    // Estado / dados
    ESTUFAS: Estufas;
    reservas: Reserva[];
    STATUS_MAP: Record<string, StatusInfo>;
    USERS: Usuario[];
    currentUser: Usuario | null;
    calendarInstance?: Calendar;

    // Classes
    Calendar: typeof Calendar;
    Dashboard: typeof Dashboard;

    // Navegacao / UI (app.ts)
    showView: (viewId: string) => void;
    toggleDropdown: () => void;
    openDocs: () => void;
    closeAll: () => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    initMapState: () => void;
    renderDashboardCards: () => void;
    refreshDashboard: () => void;

    // Auth (login.ts)
    doLogin: () => void;
    doLogoff: () => void;
    initAuth: () => void;
    selectProfile: (role: string) => void;
    loginKeydown: (e: KeyboardEvent) => void;
    addUser: (email: string, role?: PerfilUsuario) => { ok: boolean; error?: string; user?: Usuario; senha?: string };
    removeUser: (id: string) => { ok: boolean; error?: string; wasSelf?: boolean };

    // Mapa (mapa.ts)
    openPanel: (id: string) => void;
    closePanel: () => void;
    openPopup: (id: string) => void;
    closePopup: () => void;
    updateEstufaOnMap: (id: string) => void;
    syncHotspots: () => void;

    // Reservas (reservas.ts)
    openReservarModal: () => void;
    confirmarReserva: () => void;
    verReserva: (id: string) => void;
    cancelarReservaModal: () => void;
    renderReservasList: () => void;
    saveState: () => void;

    // Admin (admin.ts)
    renderAdmin: () => void;
    adminSetStatus: (id: string, status: string) => void;
    adminAprovarReserva: (id: string) => void;
    adminCancelarReserva: (id: string) => void;
    adminBuscarEstufas: (q: string) => void;
    adminBuscarReservas: (q: string) => void;
    adminFiltrarReservas: (status: 'todas' | 'pendente' | 'ativa', el?: HTMLElement) => void;
    adminLimparEstufas: () => void;
    adminLimparReservas: () => void;
    adminGoto: (target: 'estufas' | 'reservas' | 'reservas-ativa' | 'reservas-pendente') => void;
    adminOpenMetrics: () => void;
    adminOpenUsers: () => void;
    adminOpenNewUser: () => void;
    adminSetNewRole: (role: PerfilUsuario, el?: HTMLElement) => void;
    adminCadastrarUsuario: () => void;
    adminExcluirUsuario: (id: string) => void;
  }
}

export {};
