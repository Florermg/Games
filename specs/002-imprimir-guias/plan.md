# Implementation Plan: Imprimir guías (hoja para el alumno y clave de respuestas)

**Branch**: `002-imprimir-guias` (a partir de `001-linea-base-quality-gate`) | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-3

**Input**: Feature specification from `specs/002-imprimir-guias/spec.md`

## Summary

Agregar a cada guía abierta un botón "🖨 Print" con dos versiones: la hoja en blanco para el alumno, con el formato de los PDFs de `English/documentacion`, y la clave "ANSWER KEY" para la maestra.

Enfoque técnico (research.md):
- Una función pura `buildPrintHtml(guide, version)` en `English/js/print.js` arma el HTML desde los datos de la guía, nunca desde la pantalla. Así la hoja del alumno no puede arrastrar respuestas, y la clave sale de la misma guía.
- La pantalla inserta ese HTML en un contenedor que solo se ve al imprimir y llama a la impresión del navegador: PC, iPhone, iPad y Android, con "Guardar como PDF".
- Los estilos `@media print` dejan la página en tamaño carta, en negro sobre blanco y sin reactivos partidos.
- Las pruebas de `print.test.mjs` corren en Node con el helper de GAMES-1.

## Technical Context

**Language/Version**: JavaScript (ES2020, scripts clásicos de navegador) y CSS de impresión; Node 24 para las pruebas.

**Primary Dependencies**: ninguna nueva. `window.print()` del navegador; en desarrollo, `node:test`.

**Storage**: N/A. La impresión es una vista de la guía en memoria.

**Testing**: `npm test`, con el nuevo `English/tests/print.test.mjs` que usa las demos y los fixtures grabados de GAMES-1. Validación visual con PDFs generados por Chrome sin ventana y `pdftotext`, en desarrollo y fuera de CI (research R6).

**Target Platform**: PC (Chrome, Edge, Safari), iPhone y iPad (Safari) y Android (Chrome), con la impresión de cada sistema.

**Project Type**: aplicación web estática (single project).

**Performance Goals**: la vista previa aparece en 2 toques (SC-001) y armar la versión impresa es instantáneo (menos de 100 ms para la guía más grande).

**Constraints**:
- Sin red (FR-017) y sin descargar archivos (FR-003).
- No cambia el estado en pantalla (FR-016).
- Tamaño carta y ningún reactivo partido (FR-015).
- El juego sigue abriendo con doble clic.

**Scale/Scope**: 7 tipos de sección × 2 versiones; 3 demos y guías generadas de los 3 tipos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | La spec está aprobada sin clarificaciones pendientes y el plan se deriva de ella. El cambio toca código de la línea base documentada en GAMES-1 solo para agregar el botón y el contenedor; el resto del comportamiento descrito en su FR-001 a FR-030 no cambia. | ✅ |
| II. Simplicidad | Sin dependencias, sin librerías de PDF y sin ventanas nuevas (R1). Un archivo nuevo de funciones puras más estilos de impresión. La validación visual usa herramientas que ya están en la Mac y no se agrega a CI (R6). | ✅ |
| III. Jira (GAMES-3) | Paso 1 cumplido ("En curso" y comentario de specify). Este plan cierra con el comentario del paso 2. Modo `in-all-process`: se preguntará "¿continúo?" antes de tasks. | ✅ |
| IV. Quality gate | `print.test.mjs` entra a `npm test` y al workflow `Tests`. Las pruebas pendientes (`todo`) de GAMES-2 siguen igual; el botón nuevo no se agrega a ellas, porque su tamaño táctil es parte de GAMES-2. | ✅ |
| V. Commits | Cada commit, push y PR se autoriza por separado. El PR de la 002 se abre después de integrar el #1 (R7). | ✅ |
| VI. Contenido y fuentes | Lo impreso conserva las fuentes CC BY-SA (FR-008). No descarga archivos: "Guardar como PDF" es del sistema. El nombre del alumno no se imprime y nada sale del dispositivo. | ✅ |

**Re-check post-diseño (Phase 1)**: sin cambios. El diseño se limita a una función pura, un contenedor oculto y estilos de impresión. No hay violaciones que registrar en *Complexity Tracking*.

## Project Structure

### Documentation (this feature)

```text
specs/002-imprimir-guias/
├── plan.md              # Este archivo
├── research.md          # Fase 0: R1–R7
├── data-model.md        # Fase 1: qué se imprime por tipo de sección y versión
├── quickstart.md        # Fase 1: validación de punta a punta
├── contracts/
│   └── print-view.md    # buildPrintHtml, botón/panel, estilos de impresión
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
Games/
└── English/
    ├── QuizA.html                  # CAMBIA: botón 🖨 Print y panel en .sheet-top, <div id="print-area">, <script src="js/print.js">
    ├── css/quiz.css                # CAMBIA: estilos del panel y bloque @media print (@page carta, solo #print-area)
    ├── js/
    │   ├── print.js                # NUEVO: buildPrintHtml(guide, version) — pura
    │   └── engine.js               # CAMBIA: abrir/cerrar el panel, printGuide(version), cerrar el panel al salir de la hoja
    └── tests/
        ├── helpers/game-context.mjs # CAMBIA: GAME_SCRIPTS incluye print.js
        └── print.test.mjs           # NUEVO: demos + fixtures generados, ambas versiones
```

El script de validación visual (PDFs de las 6 versiones) vive en `specs/002-imprimir-guias/` como herramienta de la historia, no en `English/tests/`, porque no corre en CI.

**Structure Decision**: misma estructura de proyecto único de GAMES-1. `print.js` se carga después de `grading.js` y antes de `engine.js`, porque usa `escapeHtml` de `api.js` y no necesita el DOM. No se tocan `api.js`, `banks.js`, `demos.js`, `generators.js` ni `grading.js`.

## Complexity Tracking

No aplica: el Constitution Check no tiene violaciones.
