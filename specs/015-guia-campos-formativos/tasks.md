---

description: "Task list for 015-guia-campos-formativos"
---

# Tasks: Guía 5.º Campos formativos

**Input**: `specs/015-guia-campos-formativos/`

**Jira**: GAMES-17 (Historia) · **Modo**: continuo · **Rama**: `015-guia-campos-formativos` (desde `main` `d798963`)

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Phase 1: Setup

- [X] T001 Línea base: `npm test` en `main` (`331 · pass 329 · fail 0 · todo 2`) en `validation.md`
- [X] T002 Carpeta `English/campos/` (HTML, `js/`, `css/`), `English/js/lang.js`, contexto de pruebas `English/tests/helpers/campos-context.mjs`

## Phase 2: US1 + US2 - Contenido, calificación y guías (P1) 🎯 MVP

- [X] T003 [US1] Pruebas (antes del código): contenido (4 campos, 21 temas, tarjetas, preguntas válidas por tipo), calificación en español (normalizar, ideas clave), demo fija y guías generadas (200 semillas, solo campos elegidos, sin repetir)
- [X] T004 [US1] `campos-data.js` con el contenido de la guía
- [X] T005 [US1] `campos-grading.js` y `campos-guides.js`
- [X] T006 [US4] Pruebas e implementación de `campos-print.js` (hoja, clave y tarjetas)

## Phase 3: US1–US5 - Página (P1)

- [X] T007 [US5] Pruebas e implementación del español en lo compartido: `lang.js`, `Speech.lang`, mascotas, premios y My Pets, ambiente, festividades; `guide.demo`
- [X] T008 [US1] `campos-engine.js`, `Guia5.html`, `campos.css`: menú, guía, revisión, resultados, tarjetas, impresión, voz
- [X] T009 [US5] Tarjeta en el menú de `QuizA.html`; versiones con rutas `../` y dos páginas (`versions.mjs`, `stamp-versions.mjs`, `versions.test.mjs`)

## Phase 4: Polish

- [X] T010 `npm run versions`, `npm test` 3 veces
- [X] T011 Validar y registrar en `validation.md`: demo y guía generada en Chrome, premio, tarjetas, impresión (Chrome y WebKit), lo compartido en español, 390 px, consola, huella de GAMES-1
- [X] T012 README: sección "Guía 5.º Campos formativos" y publicación de `campos/`
