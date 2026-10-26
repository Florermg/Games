# Implementation Plan: Premios de accesorios para las mascotas

**Branch**: `012-premios-mascotas` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-14

## Summary

Un catálogo de 43 accesorios en SVG (19 de todo el año y 24 de 8 temporadas) que se dibujan dentro de las mascotas de GAMES-9. Al terminar una guía generada con 100%, se sortea uno que el alumno no tenga y se guarda en `localStorage` por alumno. La nueva sección **🐾 My Pets** permite ponerlos y quitarlos; lo puesto se ve también en las mascotas de abajo de la ventana.

## Technical Context

- JavaScript clásico sin build, CSS en `English/css/quiz.css`; abre con doble clic. Sin red ni archivos nuevos de imagen.
- Pruebas: `node:test` + `node:vm`; `Math.random` con semilla; `storage` falso.
- Validación: Chrome con la extensión; hoja con todas las combinaciones de accesorio × mascota para revisar a ojo.

## Constitution Check

- Spec y aclaraciones antes del plan; pruebas antes del código; `npm test` + workflow `Tests`: ✔.
- Principio V: commit, push, PR y merge con autorización por acción: ✔.
- Sin dependencias, sin red, sin datos personales fuera del equipo (solo el nombre, en el navegador): ✔.

## Design

- **`English/js/pet-rewards.js`** (puro; entra en `GAME_SCRIPTS` antes de `pets.js`): `SEASONS`, `activeSeasons(date)`, `PET_ACCESSORIES`, `availableAccessories(date)`, `pickAccessory(ownedIds, date)`, `studentKey(name)`, `loadPetRewards/savePetRewards`, `studentRecord`, `guideKey(guide)`, `awardForGuide(...)`, `toggleAccessory(...)`, `takeEverythingOff(...)`, `accessoryLayers(kind, outfit, uid)`.
- **`English/js/pets.js`**: `petSvg(kind, outfit, uid)` agrega las capas y el sufijo de ids; `dressPets()` vuelve a dibujar las mascotas de abajo con lo puesto del alumno actual.
- **`English/js/my-pets.js`** (DOM): pantalla My Pets y caja del premio en los resultados (`showPetReward`), llamada desde `finishGuide` en `engine.js`.
- **`English/QuizA.html`**: tarjeta del menú, `#pets-screen` (clase `reference-screen`), `#reward-box` en resultados, scripts con versión.

## Project Structure

```text
English/js/pet-rewards.js     # catálogo, temporadas, sorteo, guardado (puro)
English/js/my-pets.js         # pantalla My Pets y premio en resultados
English/js/pets.js            # petSvg con accesorios, dressPets
English/js/engine.js          # finishGuide → showPetReward
English/tests/pet-rewards.test.mjs
```
