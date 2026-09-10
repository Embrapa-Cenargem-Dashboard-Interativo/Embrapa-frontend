# Migração do front-end para TypeScript

O front vanilla JS foi migrado para **TypeScript + Vite**, preservando o comportamento
e o HTML/CSS existentes.

## O que mudou

- `js/*.js` → `src/*.ts` (tipados). Estrutura equivalente:
  - `src/types.ts` — tipos compartilhados (Estufa, Reserva, Usuario, StatusInfo, etc.)
  - `src/data/estufas.ts` — dados + localStorage (saveState/loadState)
  - `src/components/Calendar.ts`, `src/components/Dashboard.ts`
  - `src/views/login.ts`, `mapa.ts`, `reservas.ts`, `admin.ts`
  - `src/app.ts` — navegação, toast, dashboard, calendário
  - `src/main.ts` — ponto de entrada (importa os módulos na ordem original)
  - `src/global.d.ts` — tipagem das funções/estado expostos em `window`
- Módulos ES reais (import/export) no lugar de scripts globais soltos.
- As funções continuam expostas em `window` (ex.: `window.showView`), então os
  handlers `onclick` inline do `index.html` seguem funcionando sem alteração.
- `index.html`: os 8 `<script src="js/...">` viraram um único
  `<script type="module" src="/src/main.ts">`. Favicon ajustado para caminho relativo.
- Ferramental: `tsconfig.json` (strict), `vite.config.ts`, `package.json` com Vite/TS.

## Rodar

```bash
cd Embrapa-frontend
npm install
npm run dev        # servidor de desenvolvimento (Vite) em http://localhost:5173
npm run build      # typecheck + build de produção em dist/
npm run preview    # serve o build
npm run typecheck  # só checagem de tipos
```

## Observação

A pasta antiga `js/` não é mais usada (o `index.html` agora carrega `src/main.ts`)
e pode ser removida. Foi mantida por segurança para você conferir a equivalência.
