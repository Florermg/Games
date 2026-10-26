---

description: "Task list for 014-festividades"
---

# Tasks: Festividades

**Input**: `specs/014-festividades/`

**Jira**: GAMES-16 (Historia) · **Modo**: continuo · **Rama**: `014-festividades` (desde `main` `bd89726`)

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Phase 1: Setup

- [X] T001 Línea base: `npm test` en `main` (`319 · pass 317 · fail 0 · todo 2`) en `specs/014-festividades/validation.md`
- [X] T002 Crear `English/js/holidays.js` y agregarlo a `GAME_SCRIPTS` y a `English/QuizA.html` después de `environment.js`

## Phase 2: US1 + US4 - Fechas, mezcla y modo de prueba (P1) 🎯 MVP

- [X] T003 [US1] Pruebas en `English/tests/holidays.test.mjs` (antes del código): Easter y Thanksgiving 2025–2030, tabla de FR-001 día por día, orden por cercanía, `holidayOverrides`
- [X] T004 [US1] Implementar fechas y modo de prueba en `English/js/holidays.js`
- [X] T005 [US1] Pruebas y dibujos: guirnalda (1 y 2 festividades), ventana (1–3), fondo; ids con sufijo, sin `Math.random`

## Phase 3: US2 + US3 - Saludo y vocabulario (P1)

- [X] T006 [US3] Pruebas: 16 festividades con 8+ palabras (campos, ejemplo con la palabra, sin repetidas), saludo de 1 y 2, tarjeta con pestañas
- [X] T007 [US3] Vocabulario, saludos y tarjeta en `English/js/holidays.js`
- [X] T008 DOM: `#holiday-scene`, `#holiday-garland`, `#holiday-window`, `#holiday-card`, saludo al abrir, voz, en `English/QuizA.html`, `English/js/holidays.js` y `English/css/quiz.css`

## Phase 4: Polish

- [X] T009 `npm run versions` (conteo en `versions.test.mjs`), `npm test` 3 veces
- [X] T010 Validar y registrar en `validation.md`: hoja de las 16 y mezclas, hoy real, modo de prueba, voz, 390 px, consola, impresión, huella de GAMES-1
- [X] T011 README: sección "Festividades"
