---

description: "Task list for 002-imprimir-guias"
---

# Tasks: Imprimir guías (hoja para el alumno y clave de respuestas)

**Input**: Design documents from `specs/002-imprimir-guias/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/print-view.md, quickstart.md

**Jira**: GAMES-3 · **Modo**: `in-all-process` · **Rama**: `002-imprimir-guias` (a partir de `001-linea-base-quality-gate`)

**Tests**: FR-019 exige pruebas automáticas del contenido impreso; por eso hay tareas de prueba, escritas **antes** de la implementación de cada historia.

**Organization**: tareas agrupadas por user story. Rutas relativas a la raíz del repo (`Games/`).

**Principio III**: después de cada historia completada se agrega un comentario de checkpoint en GAMES-3 (tareas `Jira`).

**Principio V**: toda tarea de commit, push, PR o merge **se detiene a pedir autorización explícita** para esa acción.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

- [X] T001 Antes de cambiar código, ejecutar en el navegador el recorrido de GAMES-1 (quickstart §4 de `specs/001-linea-base-quality-gate/`, misma semilla 12345) sobre la rama `002-imprimir-guias` y registrar la huella en `specs/002-imprimir-guias/validation.md` (sección "Línea base"); debe ser `f1 b9 82 7e 2c 76`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: ninguna historia empieza antes de terminar esta fase.

- [X] T002 Crear `English/js/print.js` con `buildPrintHtml(guide, version)` (contracts/print-view.md): validar `version` (`"student"` o `"key"`; otro valor → `Error`), encabezado según data-model.md §2 (escuela si existe, título, subtítulo, campos `Name / Group / R.N / Date / Average / Teacher` en blanco, salvo `guide.teacher`), etiqueta de grupo cuando cambia, título de cada sección (su HTML de `<i>` tal cual) y un bloque `print-item` por reactivo. Helpers internos: `blank()`, `keyText()`, `readAloud()`. Todo texto de la guía pasa por `escapeHtml`. Los renderizadores por tipo quedan como pendientes (devuelven solo el bloque vacío) hasta T007/T014
- [X] T003 Agregar `print.js` a `GAME_SCRIPTS` en `English/tests/helpers/game-context.mjs` (después de `grading.js`) y `<script src="js/print.js"></script>` en `English/QuizA.html` entre `grading.js` y `engine.js`
- [X] T004 Agregar `<div id="print-area" aria-hidden="true"></div>` al final de `.main-wrapper` en `English/QuizA.html` y, en `English/css/quiz.css`, la base de impresión: `#print-area { display: none }` en pantalla y un bloque `@media print` con `@page { size: letter; margin: 15mm }`, todo oculto excepto `#print-area` (visible), fondo blanco, texto negro y `break-inside: avoid` en `.print-item`
- [X] T005 Verificar que `npm test` sigue en `pass 80 · fail 0 · todo 2` y que la huella del recorrido no cambió (FR-016)

**Checkpoint**: `buildPrintHtml` existe y carga en Node y en el navegador, y el juego no cambió.

---

## Phase 3: User Story 1 - Imprimir la hoja en blanco para el alumno (Priority: P1) 🎯 MVP

**Goal**: el botón 🖨 Print → "Student sheet" imprime cualquier guía abierta con el formato de los PDFs, sin respuestas (FR-001 a FR-008, FR-014 a FR-017).

**Independent Test**: en la vista previa o el PDF de la hoja de cada demo y de una guía generada de cada tipo, salen encabezado, instrucciones y ejercicios con espacios, y ninguna respuesta.

- [X] T006 [P] [US1] Escribir en `English/tests/print.test.mjs` las pruebas de la hoja del alumno (deben fallar antes de T007). Para cada demo (`DEMO_GUIDES.gvs/rl/writing`) y cada guía generada de los fixtures de GAMES-1 (reproducidas como en `generators.test.mjs`), verificar:
  - (a) 0 `class="key"` y 0 `class="read-aloud"`.
  - (b) un `print-item` por reactivo y al menos un `class="blank"` por reactivo que no sea `choice`.
  - (c) que no contiene ninguna palabra del dictado, ninguna oración del `script`, ningún `tip`, ninguna `explanation` de más de 3 palabras ni ninguna respuesta de `rewrite`.
  - (d) el encabezado: título, subtítulo, escuela solo si existe y los 6 campos; Name vacío aunque se pase una guía de un alumno con nombre; Teacher "Aurora Corante" en demos y en blanco en generadas.
  - (e) que las opciones de `choice` salen como `a) … b) … c) …` y los textos de lectura antes de sus preguntas.
  - (f) la fuente CC BY-SA en las guías generadas que la tienen.
  - (g) "Remember", criterios con puntos y "Total ____ / 10" en writing.
  - (h) que `buildPrintHtml` no modifica la guía (copia profunda antes y después).
  - (i) error con una versión inválida.
- [X] T007 [US1] Implementar en `English/js/print.js` la versión `"student"` de cada tipo de sección según data-model.md §3: `bank`, `rewrite`, `fill`, `match` (dos columnas: palabra + espacio para la letra; definiciones en orden), `choice` (lectura + fuente + preguntas con a/b/c), `dictation` (renglones numerados) y `writing` (consigna, Remember, palabras útiles y dato del tema si existen, renglones según `lines`, criterios y Total). T006 debe pasar
- [X] T008 [P] [US1] Estilos de papel en `English/css/quiz.css`, dentro de `@media print`: tipografía de 11–12 pt, líneas de respuesta con borde inferior, recuadro del banco de palabras, columnas de "relacionar", opciones en línea, renglones del dictado y del writing, encabezado de sección con `break-after: avoid`, y lectura sin partirse de su título
- [X] T009 [US1] Agregar el botón `🖨 Print` y su panel en `.sheet-top` de `English/QuizA.html` (botones `Student sheet` y `Answer key`; el segundo se habilita en T016), con sus estilos de pantalla en `English/css/quiz.css` (el panel oculto por defecto)
- [X] T010 [US1] En `English/js/engine.js`: `togglePrintPanel()`; `printGuide(version)`, que pone `buildPrintHtml(currentGuide, version)` en `#print-area`, cierra el panel, avisa con la tutora ("Printing the student sheet…") y llama a `window.print()`; y cerrar el panel en `startGuide` y `backToMenu`. No toca `sectionStates` (FR-016)
- [X] T011 [US1] Validar US1 en el navegador:
  - Contestar dos secciones de una demo, imprimir la hoja del alumno, cancelar y confirmar que respuestas, intentos y puntos siguen igual (SC-007), y que el recorrido de GAMES-1 mantiene su huella.
  - Revisar la vista previa de una demo y de una guía generada.
  - Registrar en `validation.md`.
- [X] T012 [US1] Jira: comentario de checkpoint en GAMES-3 (US1 completada, resultados de `npm test` y de T011)

**Checkpoint**: la US1 se puede usar sola: se imprimen hojas para el alumno.

---

## Phase 4: User Story 2 - Imprimir la clave de respuestas para la maestra (Priority: P2)

**Goal**: "Answer key" imprime la misma guía con respuestas, "Also accepted", "Read aloud" y rúbrica (FR-009 a FR-013).

**Independent Test**: con la misma guía abierta, cada respuesta de la clave coincide con la que el juego acepta en pantalla.

- [X] T013 [P] [US2] Agregar a `English/tests/print.test.mjs` las pruebas de la clave (deben fallar antes de T014). Para las mismas guías, verificar:
  - (a) el encabezado lleva la marca "ANSWER KEY" (en su propio renglón, arriba del título; ver data-model §2, ajustado en T020).
  - (b) cada `print-item` no `writing` tiene un `class="key"` cuyo texto es `answers[0]` (o `options[answer]` en `choice`, o la letra en `match`), y ese texto es aceptado por `isCorrect` de `grading.js`.
  - (c) "Also accepted" con hasta 2 de `answers[1..]` cuando existen.
  - (d) un `read-aloud` con las palabras del dictado en orden y otro con el `script` completo del *listening*.
  - (e) la tabla resuelta de "relacionar".
  - (f) la rúbrica de writing sin `blank`.
  - (g) mismo orden de secciones, reactivos y opciones que la hoja del alumno (FR-013).
- [X] T014 [US2] Implementar en `English/js/print.js` la versión `"key"` de cada tipo de sección según data-model.md §3. T013 debe pasar
- [X] T015 [P] [US2] Estilos de la clave en `English/css/quiz.css` (`@media print`): respuestas en negrita, opción correcta encerrada en un círculo, recuadros "Read aloud" y marca "ANSWER KEY" visible en el encabezado
- [X] T016 [US2] Habilitar `Answer key` en el panel (`English/QuizA.html`, `English/js/engine.js` → `printGuide('key')`, con el aviso de la tutora "Printing the answer key…")
- [X] T017 [US2] Validar US2 en el navegador: para una guía generada de cada tipo, imprimir la hoja y la clave sin cerrar la guía y confirmar que coinciden (FR-013); contestar en pantalla con las respuestas de la clave y confirmar que se aceptan. Registrar en `validation.md`
- [X] T018 [US2] Jira: comentario de checkpoint en GAMES-3 (US2 completada)

**Checkpoint**: la US2 está completa: hoja y clave de cualquier guía.

---

## Phase 5: User Story 3 - Imprimir desde cualquier dispositivo y guardar como PDF (Priority: P3)

**Goal**: impresión correcta en papel carta desde PC, iPad, iPhone y Android (FR-015, FR-018).

**Independent Test**: los 6 PDFs de las demos y los recorridos en los 4 dispositivos.

- [X] T019 [P] [US3] Crear `specs/002-imprimir-guias/validate-print/print-harness.html` (carga `../../../English/css/quiz.css` y los scripts de `English/js/` sin `engine.js`, y pone en `#print-area` `buildPrintHtml(DEMO_GUIDES[kind], version)` según `?kind=&version=`) y `specs/002-imprimir-guias/validate-print/run.sh`. El script genera con Chrome sin ventana (`--print-to-pdf --no-pdf-header-footer`) los 6 PDFs en una carpeta temporal y revisa con `pdfinfo`/`pdftotext` el tamaño carta, la ausencia de textos de pantalla ("Check answers", "Finish", "Menu", "Anya-chan", "pts") y, en la hoja del alumno, la ausencia de palabras del dictado y de oraciones del guion
- [X] T020 [US3] Ejecutar `validate-print/run.sh` y revisar a ojo los 6 PDFs: ningún reactivo partido entre páginas (SC-004) y cada hoja del alumno reconocible frente a su PDF de `English/documentacion/` (SC-005); ajustar estilos si hace falta y registrar en `validation.md`
- [ ] T021 [US3] ⏸ **PENDIENTE, aplazada por decisión del usuario (2026-10-24); se sigue en GAMES-4** — Recorrido en dispositivos reales (quickstart §4) con el usuario: imprimir o guardar como PDF la hoja y la clave en PC, iPad, iPhone y Android; registrar por dispositivo en `validation.md` (SC-006) y comentar en GAMES-2 toda brecha táctil nueva del botón o del panel
- [X] T022 [US3] Jira: comentario de checkpoint en GAMES-3 (US3 completada)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T023 [P] Documentar en `README.md` (raíz) el botón 🖨 Print y sus dos versiones
- [X] T024 Ejecutar `npm test` (10 veces, mismo resultado), confirmar que las pruebas pendientes de GAMES-2 siguen como `todo` y que la huella del recorrido de GAMES-1 no cambió; registrar en `validation.md`
- [X] T025 **Pedir autorización** y crear el commit de la historia en `002-imprimir-guias`
- [ ] T026 Cuando el PR #1 (GAMES-1) esté integrado en `main`: **con autorización**, rebasar `002-imprimir-guias` sobre `main` si hace falta; **con autorización aparte**, hacer push de la rama; **con autorización aparte**, abrir el PR hacia `main` referenciando GAMES-3. Confirmar el check `Tests` en ✅
- [ ] T027 Cierre en Jira (Principio III, paso 5): verificar que `tasks.md` no tiene tareas eliminadas ni alteradas en su alcance respecto al checklist comentado en GAMES-3; **pedir autorización** para integrar el PR; confirmar ✅ en `main`; actualizar la descripción de GAMES-3 con "**Implementado**" y transicionarla a "Listo"

---

## Dependencies & Execution Order

- **Setup**: T001 antes de cualquier cambio de código.
- **Foundational**: T002 → T003 → T004 → T005.
- **US1**: T006 (pruebas primero) → T007. T008 es paralela a T006/T007 (otro archivo). T009 → T010 → T011 → T012.
- **US2**: depende de T007 (reutiliza los renderizadores). T013 (pruebas primero) → T014. T015 es paralela. T016 → T017 → T018.
- **US3**: T019 puede empezar después de T007 (la hoja ya imprime) y es paralela a la US2. T020 necesita T014 (las 6 versiones). T021 necesita al usuario y sus dispositivos.
- **Polish**: T023 en cualquier momento después de T016. T024 → T025. T026 depende de que GAMES-1 (PR #1) esté integrada. T027 al final.

### Parallel Opportunities

- T006 ∥ T008 (pruebas vs. estilos).
- T013 ∥ T015.
- T019 ∥ US2.
- T023 desde la US2.

## Implementation Strategy

1. **MVP**: Phases 1–3. La maestra ya puede imprimir hojas para el alumno.
2. **US2**: la clave de respuestas.
3. **US3**: PDFs de validación y dispositivos reales.
4. **Polish**: README, verificación final, commit, PR (después del PR #1) y cierre.

## Notes

- `print.js` es puro: toda la lógica de "qué se imprime" se prueba en Node; el navegador solo inserta el HTML e imprime.
- Si una tarea descubre que la spec está mal, se corrige `spec.md` primero (Principio I) y se documenta en GAMES-3.
