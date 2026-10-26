---

description: "Task list for 012-premios-mascotas"
---

# Tasks: Premios de accesorios para las mascotas

**Input**: `specs/012-premios-mascotas/`

**Jira**: GAMES-14 (Historia) · **Modo**: continuo · **Rama**: `012-premios-mascotas` (desde `main` `33ffb1c`)

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Phase 1: Setup

- [X] T001 Línea base: `npm test` en `main` (`286 · pass 284 · fail 0 · todo 2`) en `specs/012-premios-mascotas/validation.md`
- [X] T002 Crear `English/js/pet-rewards.js` y agregarlo a `GAME_SCRIPTS` y a `English/QuizA.html` antes de `pets.js`

## Phase 2: US1 + US3 + US4 - Premio, guardado y temporadas (P1) 🎯 MVP

- [X] T003 [US1] Pruebas en `English/tests/pet-rewards.test.mjs` (antes del código): catálogo (≥30, ≥12 de temporada, ids únicos, 5 partes del cuerpo), temporadas por fecha (incluye las que cruzan el año), sorteo con pesos (SC-002), `awardForGuide` (won, demo, repeat, notPerfect, complete), alumnos por nombre normalizado, guardado con `storage` normal, bloqueado y roto
- [X] T004 [US1] Implementar `English/js/pet-rewards.js`
- [X] T005 [US1] Caja del premio en resultados: `#reward-box` en `English/QuizA.html`, `showPetReward` en `English/js/my-pets.js`, llamada desde `finishGuide` en `English/js/engine.js`

## Phase 3: US2 - My Pets (P1)

- [X] T006 [US2] Pruebas de `toggleAccessory`, `takeEverythingOff` y de `petSvg(kind, outfit, uid)` (capas dentro de `.pet-body`, ids con sufijo, una pieza por parte)
- [X] T007 [US2] Dibujos de los 43 accesorios y `accessoryLayers`; `petSvg` y `dressPets` en `English/js/pets.js`
- [X] T008 [US2] Pantalla My Pets en `English/js/my-pets.js`, `English/QuizA.html` y `English/css/quiz.css`; vestir las mascotas de abajo al cambiar el nombre

## Phase 4: Polish

- [X] T009 `npm run versions` (y conteo de archivos en `versions.test.mjs`), `npm test` 3 veces
- [X] T010 Validar y registrar en `validation.md`: flujo completo en Chrome, recarga, dos alumnos, hoja de 43 × 2 combinaciones, 390 px, consola, huella de GAMES-1
- [X] T011 README: sección "My Pets y premios"
