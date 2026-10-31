# Implementation Plan: Guía 5.º Campos formativos

**Branch**: `015-guia-campos-formativos` | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-17

## Summary

Una página nueva en español, `English/campos/Guia5.html`, con el contenido de la guía del primer trimestre (21 temas en 4 campos formativos): demo fija, guías generadas por campo, 6 tipos de ejercicios, revisión y resultados como en inglés, impresión de hoja y clave, tarjetas de repaso imprimibles y con voz. Comparte mascotas, premios, My Pets, ambiente y festividades, con sus textos en español.

## Technical Context

- JavaScript clásico sin build; CSS compartido `../css/quiz.css` + `campos/css/campos.css`; sin red (salvo el clima de GAMES-15).
- Pruebas en `English/tests/campos-*.test.mjs` con un contexto `node:vm` propio (`tests/helpers/campos-context.mjs`).

## Constitution Check

- Spec y aclaraciones antes del plan; pruebas antes del código; `npm test` + workflow `Tests`: ✔.
- Principio V: commit, push, PR y merge con autorización por acción: ✔.
- Sin dependencias ni datos fuera del equipo: ✔.

## Design

- `English/js/lang.js` — `pageLang()`.
- `English/campos/js/campos-data.js` — `CAMPOS`, `TEMAS`, `CLASIFICA`.
- `English/campos/js/campos-grading.js` — `normalizeEs`, `openIdeasFound`, `isCorrectCampos`, `correctAnswerTextCampos`, `scoreSectionCampos`.
- `English/campos/js/campos-guides.js` — `buildCamposDemo()`, `generateCamposGuide({ campos })`.
- `English/campos/js/campos-print.js` — `buildCamposPrintHtml(guide, version)`, `buildStudyCardsPrintHtml(ids, columns)`.
- `English/campos/js/campos-engine.js` — pantalla: menú, guía, revisión, resultados, tarjetas, impresión, voz.
- Compartidos con texto en español: `api.js` (`Speech.lang`), `pets.js`, `pet-rewards.js` (`es` de accesorios y temporadas), `my-pets.js`, `environment.js`, `holidays.js`.
- `English/QuizA.html` — tarjeta que abre `campos/Guia5.html`; `lang.js`.
- `English/tools/versions.mjs` + `stamp-versions.mjs` — rutas `../` y dos páginas.
