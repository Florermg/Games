# Implementation Plan: Elegir 1 o 2 columnas de tarjetas por hoja al imprimir

**Branch**: `006-columnas-impresion` (desde `main` `0f8ad98`) | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-8

## Summary

- `buildCardsPrintHtml` recibe `columns` (1 o 2; 2 por defecto, con el mismo HTML que hoy).
- Un estilo de impresión de 1 columna pone cada tarjeta a todo el ancho.
- Las pantallas Grammar y Verbs muestran "2 columns / 1 column" junto a 🖨 Print selected y recuerdan la elección mientras la página está abierta.
- Se validan las dos opciones con pruebas y PDFs (research R1–R4).

## Technical Context

**Language/Version**: JavaScript (ES2020, scripts clásicos) y CSS; Node 24 para las pruebas.

**Primary Dependencies**: ninguna.

**Storage**: en memoria (`referenceColumns`), sin persistencia (FR-005).

**Testing**:
- `grammar-cards.test.mjs` (columnas), `versions.test.mjs` (GAMES-5);
- PDFs con `validate-print` de GAMES-6, con 2 casos nuevos de 1 columna;
- pantalla validada en el navegador.

**Target Platform**: PC, iPhone, iPad y Android; impresión del sistema.

**Project Type**: aplicación web estática.

**Performance Goals**: N/A.

**Constraints**:
- La hoja de 2 columnas queda idéntica (SC-002).
- Doble clic y sin internet.
- La huella de GAMES-1 no cambia.
- `npm run versions`.

**Scale/Scope**: 4 archivos del juego (`grammar-cards.js`, `reference.js`, `quiz.css`, `QuizA.html` para las versiones), 1 archivo de pruebas y el *harness* de impresión.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | La spec está aprobada y las decisiones del usuario (alcance, valor por defecto, modo) están registradas. | ✅ |
| II. Simplicidad | Un parámetro, una clase CSS y un control con el estilo existente. Sin almacenamiento ni dependencias. | ✅ |
| III. Jira (GAMES-8) | Historia creada, con comentario por fase. Modo `in-all-process`. | ✅ |
| IV. Quality gate | Pruebas nuevas en `npm test` y `Tests`, y el gate de versiones. | ✅ |
| V. Commits | Cada commit, push, PR y merge con autorización. | ✅ |
| VI. Contenido | Sin cambios de contenido ni de fuentes. | ✅ |

**Re-check post-diseño**: sin violaciones.

## Project Structure

```text
specs/006-columnas-impresion/   spec · plan · research · contracts/columns.md · quickstart · checklists · tasks · validation
English/js/grammar-cards.js     CAMBIA: buildCardsPrintHtml acepta columns
English/js/reference.js         CAMBIA: referenceColumns, control en las 2 pantallas y columns al imprimir
English/css/quiz.css            CAMBIA: .print-cards.one-column (impresión) y estilo del control (pantalla)
English/QuizA.html              CAMBIA: contenedor del control junto a 🖨 y las versiones (npm run versions)
English/tests/grammar-cards.test.mjs              CAMBIA: pruebas de columnas
specs/004-gramatica-verbos/validate-print/        CAMBIA: parámetro columns y 2 casos de 1 columna
```

## Complexity Tracking

No aplica.
