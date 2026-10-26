# Implementation Plan: Ambiente según la hora, el clima y la estación

**Branch**: `013-ambiente` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-15

## Summary

El juego cambia de cielo con el reloj (día, tarde, noche), con el clima actual de Open-Meteo (sol, nubes, niebla, lluvia, nieve, tormenta) y con la estación. La ubicación sale del navegador o de una ciudad elegida en el menú (Ciudad de México por omisión). El menú muestra una ventana dibujada con el ambiente y una línea de texto; el fondo de la página y las barras toman sus colores. Un modo de prueba en la dirección fija cualquier combinación.

## Technical Context

- JavaScript clásico sin build, CSS en `English/css/quiz.css`; abre con doble clic. Red solo para el clima (opcional, con plan B).
- Pruebas: `node:test` + `node:vm`; `fetch` y `storage` falsos; fechas fijas.
- Validación: Chrome con la extensión; hoja con las 84 combinaciones para revisar a ojo.

## Constitution Check

- Spec y aclaraciones antes del plan; pruebas antes del código; `npm test` + workflow `Tests`: ✔.
- Principio V: commit, push, PR y merge con autorización por acción: ✔.
- Sin dependencias; un servicio público sin clave, con plan B sin internet; solo se envían coordenadas redondeadas: ✔.

## Design

- **`English/js/environment.js`** (puro arriba, DOM abajo con guarda; en `GAME_SCRIPTS` después de `pet-rewards.js`):
  - `periodOf(date)`, `seasonOf(date)` (con `activeSeasons`), `weatherKind(code)`, `ENV_CITIES`, `weatherUrl(lat, lon)`, `parseWeather(json)`, `fetchWeather(lat, lon, fetchFn)`.
  - `envOverrides(search)`, `environmentState({date, weather, overrides, place})`, `environmentClasses(state)`, `environmentSummary(state)`.
  - `environmentSceneSvg(state, uid)` (ventana del menú), `backgroundParticles(state)` (fondo).
  - `loadEnvironment(storage)` / `saveEnvironment(storage, data)`, `cachedWeather(data, lat, lon, now)`.
  - DOM: `setupEnvironment()`, `applyEnvironment()`, `chooseEnvCity()`, `locatePlace()`.
- **`English/QuizA.html`**: `#env-scene` (fondo fijo, `aria-hidden`), panel `.env-panel` en el menú (`#env-window`, `#env-summary`, `#env-note`, `<select id="env-city">`), script con versión.
- **`English/css/quiz.css`**: variables del cielo por clase (`env-day`, `env-afternoon`, `env-night`, `env-w-*`, `env-s-*`) en `body`; `.anime-container` y `#pets` usan `--env-band` / `--env-ground`; partículas; `prefers-reduced-motion`; `@media print`.

## Project Structure

```text
English/js/environment.js        # momento, estación, clima, lugar, dibujo, DOM
English/tests/environment.test.mjs
English/QuizA.html · English/css/quiz.css · README.md
```
