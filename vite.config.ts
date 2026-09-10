import { defineConfig } from 'vite';

// Front-end estático (Vanilla TS). O index.html na raiz é o ponto de entrada e
// referencia /src/main.ts como módulo.
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
