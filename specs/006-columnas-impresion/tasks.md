---

description: "Task list for 006-columnas-impresion"
---

# Tasks: Elegir 1 o 2 columnas de tarjetas por hoja al imprimir

**Input**: `specs/006-columnas-impresion/` (spec, plan, research, contracts/columns.md, quickstart)

**Jira**: GAMES-8 · **Modo**: `in-all-process` · **Rama**: `006-columnas-impresion` (desde `main` `0f8ad98`)

**Tests**: FR-007 exige pruebas; se escriben **antes** del código.

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Línea base: `npm test` (`217 · pass 215 · fail 0 · todo 2`) y la huella del recorrido de GAMES-1 (`f1 b9 82 7e 2c 76`), y guardar el HTML impreso actual de 4 tarjetas de gramática y de 2 verbos como referencia de SC-002. Registrar todo en `specs/006-columnas-impresion/validation.md`

---

## Phase 2: User Story 1 - Elegir cuántas columnas tiene la hoja impresa (Priority: P1) 🎯 MVP

**Goal**: "2 columns / 1 column" en Grammar y Verbs, con la impresión correspondiente (FR-001 a FR-006).

**Independent Test**: quickstart §2–§5.

- [X] T002 [US1] Agregar a `English/tests/grammar-cards.test.mjs` (debe fallar antes de T003):
  - Sin `columns` y con `columns: 2`, el HTML es idéntico, y sin la clase `one-column` (SC-002).
  - Con `columns: 1`, `.print-cards` lleva `one-column` y hay el mismo número de `.print-card`, en `kind: "grammar"` y en `kind: "verbs"`.
  - Con `columns: 3` o `"1"`, lanza un error.
- [X] T003 [US1] Implementar `columns` en `buildCardsPrintHtml` (`English/js/grammar-cards.js`), según contracts/columns.md. T002 debe pasar
- [X] T004 [US1] CSS en `English/css/quiz.css`:
  - en `@media print`: `.print-cards.one-column` con 1 columna y `.one-column .print-card.wide` sin `span 2` (research R2);
  - en pantalla: el estilo del control de columnas, con el aspecto de `.chip` y fácil de tocar.
- [X] T005 [US1] En `English/QuizA.html`, un contenedor `.columns-choice` junto a 🖨 Print selected en `#grammar-screen` y en `#verbs-screen`. En `English/js/reference.js`:
  - `referenceColumns = { grammar: 2, verbs: 2 }`;
  - pintar el control al abrir la pantalla, con radios `autocomplete="off"`;
  - `printGrammarCards` y `printVerbCards` pasan `columns`.
- [X] T006 [US1] Agregar a `specs/004-gramatica-verbos/validate-print/` el parámetro `&columns=` (en `print-harness.html`) y 2 casos de 1 columna en `run.sh`: 4 tarjetas de gramática con tiempos de 3°, y 6 verbos con 7 tiempos
- [X] T007 [US1] `npm run versions` y `npm test` completo en verde (FR-008)
- [X] T008 [US1] Validar (quickstart §2–§6) y registrar en `validation.md`:
  - navegador: los dos controles, su valor por defecto, que se conservan al volver al menú y regresan a 2 al recargar, la impresión con cada opción, y la consola sin errores;
  - PDFs, con revisión a ojo (SC-001, SC-004);
  - la hoja de 2 columnas igual a la referencia de T001 (SC-002);
  - la huella de GAMES-1.
- [X] T009 [US1] Jira: comentario de checkpoint en GAMES-8

---

## Phase 3: Polish & Cross-Cutting Concerns

- [ ] T010 **Pedir autorización** para el commit en `006-columnas-impresion`; **con autorización aparte**, push; **con autorización aparte**, PR hacia `main`; confirmar el check `Tests` en ✅
- [ ] T011 Cierre: **pedir autorización** para integrar el PR; confirmar ✅ en `main`; comentar "**Implementado**" en GAMES-8 y pasarla a "Listo"

---

## Dependencies & Execution Order

T001 → T002 → T003 → T004 ∥ T006 → T005 → T007 → T008 → T009 → T010 → T011.

### Parallel Opportunities

T004 (CSS) ∥ T006 (*harness*): son archivos distintos.
