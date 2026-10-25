# Implementation Plan: títulos de sección solos al pie de la hoja y franja transparente

**Branch**: `008-impresion-iphone` (desde `main` `4984156`) | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-10 (Error)

## Summary

- **Impresión**: cada *renderer* devuelve bloques, y `printSection` envuelve el título de grupo, el título de la sección y el primer bloque en `.print-keep` (`break-inside: avoid`), que Safari sí respeta.
- **Franja**: en celular, la franja de las mascotas es sólida y el botón es compacto ("🐾", con nombre accesible).
- **Validación**: pruebas en Node (estructura y texto idéntico), PDFs con verificación por página de las guías generadas de prueba, y confirmación del usuario en el iPhone (research R1–R3).

## Technical Context

**Language/Version**: JavaScript (scripts clásicos) y CSS; Node 24 para las pruebas.

**Primary Dependencies**: ninguna.

**Storage**: N/A.

**Testing**: `print.test.mjs` y `pets.test.mjs` (ampliados); `validate-print/` nuevo, sobre las *fixtures*; `run.sh` de GAMES-3 y de GAMES-6; huella de GAMES-1.

**Target Platform**: impresión en Chrome y Safari (PC, iPhone, iPad); franja en celular.

**Project Type**: aplicación web estática.

**Constraints**:
- El texto impreso queda idéntico (FR-004).
- Las guías en pantalla quedan iguales.
- `npm run versions`.

**Scale/Scope**: `print.js` (los *renderers* devuelven listas), unas 20 líneas de CSS, `pets.js` (el texto del botón), pruebas y un *harness*.

## Constitution Check

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | La spec tiene la evidencia del usuario y el alcance fijado por él. | ✅ |
| II. Simplicidad | Un envoltorio y una regla CSS que ya funcionan en Safari. Sin dependencias. | ✅ |
| III. Jira (GAMES-10) | Error creado, con comentario por fase. | ✅ |
| IV. Quality gate | Pruebas nuevas en `npm test`, y el gate de versiones. | ✅ |
| V. Commits | Cada commit, push, PR y merge con autorización. | ✅ |
| VI. Contenido | El contenido no cambia. | ✅ |

**Re-check post-diseño**: sin violaciones.

## Project Structure

```text
specs/008-impresion-iphone/   spec · plan · research · tasks · validation · checklists · evidence/ (PDF y captura del usuario) · validate-print/
English/js/print.js           CAMBIA: renderers devuelven bloques; printSection con .print-keep y groupLabel
English/css/quiz.css          CAMBIA: .print-keep (impresión); franja sólida y botón compacto (pantalla)
English/js/pets.js            CAMBIA: texto del botón en <span> + aria-label
English/QuizA.html            CAMBIA: versiones (npm run versions)
English/tests/print.test.mjs  CAMBIA: títulos con su primer bloque y texto idéntico
English/tests/pets.test.mjs   CAMBIA: franja sólida y botón compacto
```

## Complexity Tracking

No aplica.
