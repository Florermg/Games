---

description: "Task list for 003-cache-versionada"
---

# Tasks: Versión de los archivos para que cada publicación llegue a todos los navegadores

**Input**: Design documents from `specs/003-cache-versionada/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/versions.md, quickstart.md

**Jira**: GAMES-5 (Error) · **Modo**: `in-all-process` · **Rama**: `003-cache-versionada` (avanzada a `main` `a025408`)

**Tests**: FR-004 exige pruebas automáticas; se escriben **antes** del módulo.

**Principio III**: un comentario de checkpoint en GAMES-5 por cada historia completada. **Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Línea base, antes de cambiar código: medir en el navegador la huella del recorrido de GAMES-1 (semilla 12345; debe ser `f1 b9 82 7e 2c 76`) y `npm test` (`207 · pass 205 · fail 0 · todo 2`), y registrarlas en `specs/003-cache-versionada/validation.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T002 Escribir `English/tests/versions.test.mjs` (debe fallar antes de T003–T005). Debe cubrir:
  - Con HTML de ejemplo:
    - `fileVersion` da 8 caracteres hex, es igual para el mismo texto, distinto si cambia un carácter, e igual con `CRLF` o `LF`.
    - `listReferences` encuentra `src="js/…"` y `href="css/…"` (con y sin `?v=`) e ignora URLs `https://`.
    - `stampVersions` es idempotente, no toca URLs externas, reporta en `changed` solo lo que cambió y lanza un error si falta un archivo.
    - `checkVersions` detecta `missing-version`, `outdated` y `missing-file`.
  - El gate real: `checkVersions` sobre `English/QuizA.html` devuelve `[]`. Si no, el mensaje nombra cada archivo y dice "run `npm run versions`".
  - Que `QuizA.html` tiene las 12 referencias locales, todas con versión (SC-002).
- [X] T003 Crear `English/tools/versions.mjs` con `fileVersion`, `listReferences`, `stampVersions` y `checkVersions` (contracts/versions.md; research R1, R3, R4). Las pruebas de HTML de ejemplo de T002 deben pasar

**Checkpoint**: el módulo está probado. El gate real sigue en rojo hasta T005, porque `QuizA.html` todavía no tiene versiones.

---

## Phase 3: User Story 1 - Después de una publicación, todos ven la versión nueva (Priority: P1) 🎯 MVP

**Goal**: la página pide cada archivo con `?v=<hash>` y un navegador con caché vieja descarga lo que cambió (FR-001, FR-002, FR-005, FR-006, FR-008).

**Independent Test**: quickstart §2 y §3.

- [X] T004 [US1] Crear `English/tools/stamp-versions.mjs` (lee y escribe `English/QuizA.html` con `stampVersions` e imprime los archivos cambiados o "All versions are up to date"; termina con código 1 si falta un archivo) y agregar `"versions": "node English/tools/stamp-versions.mjs"` a `package.json`
- [X] T005 [US1] Ejecutar `npm run versions` para versionar las 12 referencias de `English/QuizA.html` (el orden no cambia) y confirmar que T002 pasa completa y que una segunda ejecución dice "All versions are up to date"
- [X] T006 [US1] Validar (quickstart §2–§3) y registrar en `validation.md`:
  - doble clic en Chrome y en Safari, con menú, guías, 🖨 Print, Grammar y Verbs sin errores en consola;
  - con servidor local: un archivo cambiado + `npm run versions` + recarga normal → se descarga solo ese archivo; sin cambios, nada nuevo (SC-004);
  - huella de GAMES-1 sin cambios (SC-005).
- [X] T007 [US1] Jira: comentario de checkpoint en GAMES-5 (US1)

---

## Phase 4: User Story 2 - No se puede publicar un cambio sin su versión (Priority: P2)

**Goal**: `npm test` (y `Tests`) falla si un archivo cambió sin actualizar su versión (FR-004, SC-003).

**Independent Test**: quickstart §1.

- [X] T008 [US2] Probar el gate de punta a punta (quickstart §1) y registrar en `validation.md`:
  - una línea cambiada en `js/engine.js` y otra en `css/quiz.css` sin el comando → `npm test` falla y nombra los dos archivos;
  - `npm run versions` → pasa;
  - revertir y volver a correr el comando → las versiones regresan a las anteriores (FR-002).

  Al terminar, el árbol de trabajo queda sin esos cambios.
- [X] T009 [US2] Jira: comentario de checkpoint en GAMES-5 (US2)

---

## Phase 5: User Story 3 - Publicar siguiendo un procedimiento claro (Priority: P3)

**Goal**: el procedimiento de publicación está documentado (FR-003, FR-007).

- [X] T010 [US3] Agregar a `README.md` la sección "Publicar una versión":
  - correr `npm run versions` y `npm test`;
  - subir `QuizA.html`, `css/` y `js/` (no `tests/` ni `tools/`);
  - comprobar en el navegador con `[...document.scripts].map(s => s.src)` y en la pestaña Network;
  - recordar que todo cambio a `js/` o `css/` necesita el comando antes del commit.

  Mencionar `npm run versions` también en la tabla de comandos de "Pruebas".
- [X] T011 [US3] Jira: comentario de checkpoint en GAMES-5 (US3)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T012 Verificación final y registro en `validation.md`:
  - `npm test` 10 veces con el mismo resultado;
  - la huella de GAMES-1;
  - `run.sh` de GAMES-3 y de GAMES-6 en "All checks passed".
- [ ] T013 **Pedir autorización** para el commit en `003-cache-versionada`; **con autorización aparte**, push; **con autorización aparte**, PR hacia `main`; confirmar el check `Tests` en ✅
- [ ] T014 Cierre en Jira (Principio III, paso 5): verificar el alcance; **pedir autorización** para integrar el PR; confirmar ✅ en `main`; comentar "**Implementado**" en GAMES-5 y pasarla a "Listo". La validación en producción (SC-001) queda para el usuario al publicar, con las instrucciones del quickstart §4

---

## Dependencies & Execution Order

- **Setup → Foundational**: T001 → T002 → T003.
- **US1**: T004 → T005 → T006 → T007.
- **US2**: depende de T005. T008 → T009.
- **US3**: T010 puede escribirse desde T004; T011 al final.
- **Polish**: T012 → T013 → T014.

### Parallel Opportunities

T010 ∥ T006–T008: el README es otro archivo.

## Implementation Strategy

1. **MVP**: Phases 1–3. Con eso, la siguiente publicación ya rompe la caché.
2. **US2**: confirmar que el gate atrapa los olvidos.
3. **US3**: documentar la publicación.
4. **Polish**: verificación, commit, PR y cierre.

## Notes

- Toda historia futura que cambie `js/` o `css/` debe correr `npm run versions`; la prueba lo exige.
- Si una tarea descubre un error en la spec, se corrige `spec.md` primero (Principio I) y se documenta en GAMES-5.
