# Implementation Plan: Página principal

**Branch**: `016-pagina-principal` | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-18

## Design

- `English/Ingles.html`: copia del `QuizA.html` anterior + "⬅ All subjects".
- `English/QuizA.html` (nueva): idioma (EN/ES), nombre, clima, materias, resumen; scripts compartidos + `js/hub.js`.
- `English/js/lang.js`: en una página con `data-lang-choice`, el idioma guardado (`games-lang-v1`) se aplica antes de los demás scripts.
- `English/js/student.js` (nuevo, todas las páginas): guarda y llena el nombre (`games-student-v1`).
- `English/js/progress.js` (nuevo, puro + guardado): `loadProgress`, `saveProgress`, `recordExam`, `englishExamFromGuide`, `camposExamFromGuide`, `summarizeProgress(record, lang)`, `levelOf(ratio)`; DOM `recordFinishedGuide(subject, guide, states)`.
- `engine.js` y `campos-engine.js`: al terminar, `recordFinishedGuide(...)`.
- `holidays.js`: sin tarjeta de palabras en la página, el saludo en inglés no habla de ellas.
- `tools/versions.mjs`: `GAME_PAGES` = QuizA.html, Ingles.html, campos/Guia5.html.
- Pruebas: `progress.test.mjs`, `hub.test.mjs`; las pruebas del juego de inglés leen `Ingles.html`.

## Constitution Check

- Spec y aclaraciones antes del plan; pruebas antes del código; `npm test` + workflow `Tests`: ✔. Principio V: ✔. Sin dependencias ni red: ✔.
