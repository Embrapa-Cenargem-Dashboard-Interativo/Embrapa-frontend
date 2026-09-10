/**
 * Augmentacao do objeto `window`.
 * O app mantem o padrao original de expor funcoes/estado globalmente para os
 * handlers `onclick` inline do index.html e para chamadas entre modulos.
 */
import type { Calendar } from './components/Calendar';
import type { Dashboard } from './components/Dashboard';
import type { Estufas, Reserva, Usuario, StatusInfo } from './types';

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
  }
}

export {};
