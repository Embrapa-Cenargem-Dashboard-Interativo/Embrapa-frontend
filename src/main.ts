/**
 * Ponto de entrada da aplicação (Vite).
 * Importa os módulos na ordem original de carregamento, garantindo que cada um
 * registre suas funções em `window` (usadas pelos handlers onclick inline).
 */
import './data/estufas';
import './components/Calendar';
import './components/Dashboard';
import './views/mapa';
import './views/reservas';
import './views/admin';
import './app';
import './views/login';
