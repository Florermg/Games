---

description: "Task list for 011-cuaderno"
---

# Tasks: Cuaderno con revisión de gramática y sugerencias

**Input**: `specs/011-cuaderno/` (spec, plan, research, data-model, quickstart)

**Jira**: GAMES-13 (Historia) · **Modo**: continuo · **Rama**: `011-cuaderno` (desde `main` `b882409`)

**Tests**: se escriben **antes** del código de cada historia.

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Phase 1: Setup

- [X] T001 Línea base: `npm test` en `main` (`235 · pass 233 · fail 0 · todo 2`) en `specs/011-cuaderno/validation.md`
- [X] T002 Crear `English/js/notebook-check.js` vacío, agregarlo a `GAME_SCRIPTS` en `English/tests/helpers/game-context.mjs` y a `English/QuizA.html`

## Phase 2: User Story 1 - Reglas del juego (P1) 🎯 MVP

- [X] T003 [US1] Pruebas en `English/tests/notebook.test.mjs`: 20+ oraciones con errores típicos y su regla y sugerencia esperadas (SC-001); las oraciones correctas del juego sin marcas (FR-011, SC-002); casos límite (*Does she play?*, *an hour*, *a university*, *If I were*, *I'm*); `applySuggestion` y `markedTextHtml`
- [X] T004 [US1] Implementar `checkNotebookText`, `applySuggestion` y `markedTextHtml` en `English/js/notebook-check.js`
- [X] T005 [US1] Pantalla en `English/js/notebook.js`, `English/QuizA.html` y `English/css/quiz.css`: tarjeta del menú, área de escritura, título, fecha, palabras, "✔ Check my writing", texto marcado, lista de sugerencias con "Use this"

## Phase 3: User Story 2 - LanguageTool (P2)

- [X] T006 [US2] Grabar respuestas reales de LanguageTool en `English/tests/fixtures/languagetool-*.json` y probar `languageToolIssues`, `mergeIssues` y `checkOnline` (POST con el texto en el cuerpo, 429, sin internet, casilla apagada sin peticiones)
- [X] T007 [US2] Implementar en `English/js/notebook-check.js` y conectar la casilla "Also check online" con su aviso en `English/js/notebook.js`

## Phase 4: User Story 3 - Páginas guardadas (P2)

- [X] T008 [US3] Probar `loadNotebook`, `saveNotebook`, `newNotebookPage` y `pageLabel` con un `storage` falso (incluido uno que lanza errores)
- [X] T009 [US3] Implementarlas y conectar la lista de páginas, "➕ New page", "🗑 Delete page" con doble toque y el guardado al escribir

## Phase 5: User Story 4 - Imprimir (P3)

- [X] T010 [US4] Probar `buildNotebookPrintHtml` (nombre, fecha, título, marcas numeradas, sugerencias, "No mistakes found", revisión usada)
- [X] T011 [US4] Implementarla, el botón "🖨 Print" y los estilos de impresión

## Phase 6: Polish

- [X] T012 `npm run versions`, `npm test` 3 veces en verde; versiones 13 → 15 en `English/tests/versions.test.mjs`
- [X] T013 Validar y registrar en `validation.md`: flujo en Chrome con y sin internet, recarga, 390 px, consola sin errores, PDFs en Chrome y WebKit, huella de GAMES-1
- [X] T014 README: sección "My Notebook" con el aviso de privacidad
