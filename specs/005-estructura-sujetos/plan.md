# Implementation Plan: Sujetos en la estructura de las tarjetas de tiempos verbales

**Branch**: `005-estructura-sujetos` (desde `main` `d9bf891`) | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-7 (Error)

## Summary

Se reescriben las 30 líneas de estructura (10 tarjetas × afirmativa, negativa y pregunta) de `English/js/grammar-cards.js` con los 7 sujetos agrupados por forma y el verbo *play*. Una prueba exige sujetos y *play* en cada línea y compara el texto con una tabla revisada a mano. La impresión no cambia de código; se revalidan los PDFs y se actualiza la versión del archivo (research R1–R4).

## Technical Context

**Language/Version**: JavaScript (datos de `GRAMMAR_CARDS`); Node 24 para las pruebas.

**Primary Dependencies**: ninguna.

**Storage**: N/A.

**Testing**: `grammar-cards.test.mjs` (pruebas nuevas), `versions.test.mjs` (GAMES-5) y PDFs con `validate-print` de GAMES-6.

**Target Platform**: la misma de GAMES-6: pantalla e impresión en PC, iPhone, iPad y Android.

**Project Type**: aplicación web estática.

**Performance Goals**: N/A.

**Constraints**:
- Solo cambia contenido.
- Las guías siguen iguales (huella de GAMES-1).
- Ninguna tarjeta se parte en la impresión.

**Scale/Scope**: 30 líneas de texto en 1 archivo JS, 1 o 2 pruebas y la versión en `QuizA.html`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | La spec está aprobada y el formato lo decidió el usuario; sin clarificaciones pendientes. | ✅ |
| II. Simplicidad | Solo cambian datos; el código de pantalla e impresión queda igual. | ✅ |
| III. Jira (GAMES-7) | Error creado, con comentario por fase. Modo `in-all-process`. | ✅ |
| IV. Quality gate | Prueba nueva en `npm test` y `Tests`. El gate de versiones exige `npm run versions`. | ✅ |
| V. Commits | Cada commit, push, PR y merge con autorización. | ✅ |
| VI. Contenido | Contenido escrito y revisado a mano (30 líneas), apto para primaria. | ✅ |

**Re-check post-diseño**: sin violaciones. En T005 se agregó un cambio mínimo de presentación (research R5): un renglón por grupo de sujetos en `grammarCardHtml`.

## Project Structure

```text
specs/005-estructura-sujetos/   spec · plan · research · quickstart · checklists · tasks · validation
English/js/grammar-cards.js     CAMBIA: structure de las 10 tarjetas de tiempos
English/tests/grammar-cards.test.mjs   CAMBIA: pruebas de sujetos y tabla de 30 líneas
English/QuizA.html              CAMBIA: ?v= de grammar-cards.js (npm run versions)
```

No hay data-model ni contratos nuevos: la forma de `structure` es la de GAMES-6 (`specs/004-gramatica-verbos/data-model.md` §4).

## Complexity Tracking

No aplica.
