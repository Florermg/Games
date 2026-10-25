---

description: "Task list for 005-estructura-sujetos"
---

# Tasks: Sujetos en la estructura de las tarjetas de tiempos verbales

**Input**: `specs/005-estructura-sujetos/` (spec, plan, research, quickstart)

**Jira**: GAMES-7 (Error) · **Modo**: `in-all-process` · **Rama**: `005-estructura-sujetos` (desde `main` `d9bf891`)

**Tests**: FR-004 exige una prueba; se escribe **antes** del contenido.

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Línea base, antes de cambiar código: `npm test` (`214 · pass 212 · fail 0 · todo 2`) y la huella del recorrido de GAMES-1 (`f1 b9 82 7e 2c 76`), registradas en `specs/005-estructura-sujetos/validation.md`

---

## Phase 2: User Story 1 - Ver con qué sujeto va cada forma (Priority: P1) 🎯 MVP

**Goal**: las 30 líneas de estructura muestran los 7 sujetos agrupados por forma, con *play* (FR-001 a FR-003).

**Independent Test**: quickstart §1–§3.

- [X] T002 [US1] Agregar a `English/tests/grammar-cards.test.mjs` (debe fallar antes de T003):
  - Cada una de las 30 líneas menciona *I, you, he, she, it, we, they* como palabras completas y una forma de *play* (FR-001, FR-002, FR-004).
  - Una tabla de las 30 líneas esperadas, revisada a mano, contra el texto exacto (FR-003, SC-002).
  - Las tarjetas que no son de tiempos siguen sin `structure` (FR-005).
- [X] T003 [US1] Reescribir `structure` de las 10 tarjetas de tiempos en `English/js/grammar-cards.js` con el formato de research R2. T002 debe pasar
- [X] T004 [US1] `npm run versions` (solo debe cambiar `js/grammar-cards.js`) y `npm test` completo en verde (FR-007)
- [X] T005 [US1] Validar y registrar en `validation.md`:
  - navegador → Grammar Cards con "All tenses": las 10 tarjetas con sus tres líneas completas, sin errores en consola;
  - `validate-print/run.sh` de GAMES-6 en "All checks passed", con el PDF de las 22 tarjetas revisado a ojo (FR-006, SC-003);
  - la huella de GAMES-1 sin cambios (SC-004).
- [X] T006 [US1] Jira: comentario de checkpoint en GAMES-7

---

## Phase 3: Polish & Cross-Cutting Concerns

- [ ] T007 **Pedir autorización** para el commit en `005-estructura-sujetos`; **con autorización aparte**, push; **con autorización aparte**, PR hacia `main`; confirmar el check `Tests` en ✅
- [ ] T008 Cierre: **pedir autorización** para integrar el PR; confirmar ✅ en `main`; comentar "**Implementado**" en GAMES-7 y pasarla a "Listo"

---

## Dependencies & Execution Order

T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 (secuencial: todo toca los mismos dos archivos).
