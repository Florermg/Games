---

description: "Task list for 013-ambiente"
---

# Tasks: Ambiente según la hora, el clima y la estación

**Input**: `specs/013-ambiente/`

**Jira**: GAMES-15 (Historia) · **Modo**: continuo · **Rama**: `013-ambiente` (desde `012-premios-mascotas` `e8e1b14`)

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Phase 1: Setup

- [X] T001 Línea base: `npm test` en la rama (`301 · pass 299 · fail 0 · todo 2`) en `specs/013-ambiente/validation.md`
- [X] T002 Crear `English/js/environment.js` y agregarlo a `GAME_SCRIPTS` y a `English/QuizA.html` después de `pet-rewards.js`

## Phase 2: US1 + US3 + US4 - Momento del día, estación y modo de prueba (P1) 🎯 MVP

- [X] T003 [US1] Pruebas en `English/tests/environment.test.mjs` (antes del código): `periodOf` en los bordes (5:59, 6:00, 11:59, 12:00, 18:59, 19:00), `seasonOf` (incluye invierno que cruza el año), `envOverrides` (español, inglés, `otoño`, valores inválidos), `environmentState`, `environmentClasses`, `environmentSummary`
- [X] T004 [US1] Implementar la parte pura en `English/js/environment.js`
- [X] T005 [US1] Dibujo: `environmentSceneSvg` y `backgroundParticles` con pruebas (un elemento por tipo de clima, suelo por estación, ids con sufijo, sin `Math.random`)

## Phase 3: US2 - Clima y lugar (P1)

- [X] T006 [US2] Pruebas: `weatherKind` (todos los códigos de R2), `weatherUrl` (2 decimales), `parseWeather`, `fetchWeather` con `fetch` falso (bien, error HTTP, JSON roto, sin red), `ENV_CITIES` (CDMX por omisión, coordenadas dentro de México), guardado y clima vigente 30 min
- [X] T007 [US2] Implementar clima, ciudades y guardado en `English/js/environment.js`
- [X] T008 [US2] DOM: panel del menú, fondo `#env-scene`, clases en `body`, ubicación del navegador con plan B, cada minuto / cada 30 min, en `English/js/environment.js`, `English/QuizA.html` y `English/css/quiz.css`

## Phase 4: Polish

- [X] T009 `npm run versions` (y conteo de archivos en `versions.test.mjs`), `npm test` 3 veces
- [X] T010 Validar y registrar en `validation.md`: hoja con todas las combinaciones, Chrome con internet real, modo de prueba, sin internet, ciudad recordada, impresión, movimiento reducido, 390 px, consola, huella de GAMES-1
- [X] T011 README: sección "Ambiente: hora, clima y estación" con el modo de prueba
