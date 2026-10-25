---

description: "Task list for 001-linea-base-quality-gate"
---

# Tasks: Línea base y quality gate del juego de inglés

**Input**: Design documents from `specs/001-linea-base-quality-gate/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Jira**: GAMES-1 · **Modo**: `in-all-process`

**Tests**: en esta historia las pruebas automáticas **son el entregable** de la US1 (FR-031 a FR-034, FR-039); por eso aparecen como tareas de implementación, no como pruebas opcionales.

**Organization**: tareas agrupadas por user story. Todas las rutas son relativas a la raíz del repo (`Games/`).

**Principio V**: toda tarea que crea un commit, hace push, abre o integra un PR **se detiene a pedir autorización explícita** para esa acción específica. Ninguna tarea la da por concedida.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: rama de trabajo, registro de la línea base antes de tocar código y estructura del proyecto de pruebas.

- [X] T001 Crear la rama local `001-linea-base-quality-gate` desde `main` (`git checkout -b 001-linea-base-quality-gate`), llevando los archivos sin commit de `specs/001-linea-base-quality-gate/`
- [X] T002 Antes de cambiar código, hacer el recorrido de quickstart §4 paso 2 sobre `English/QuizA.html` (commit `9ae5667`) en el navegador, y registrar puntos, pistas y mensajes por demo en `specs/001-linea-base-quality-gate/validation.md` (sección "Línea base")
- [X] T003 [P] Crear `package.json` en la raíz con `"private": true`, `"engines": { "node": ">=24" }`, sin `dependencies` ni `devDependencies`, y los scripts `test` (`node --test "English/tests/**/*.test.mjs"`), `test:coverage` (el mismo comando con `--experimental-test-coverage`) y `fixtures:record` (`node English/tests/fixtures/record.mjs`), según contracts/test-commands.md
- [X] T004 [P] Crear las carpetas `English/tests/helpers/` y `English/tests/fixtures/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: separar la lógica de calificación del DOM (research R3) y crear el helper que carga el juego en Node (R2, R4, R5). Todas las pruebas dependen de esto.

**⚠️ CRITICAL**: ninguna tarea de pruebas empieza antes de completar esta fase.

- [X] T005 Crear `English/js/grading.js` moviendo desde `English/js/engine.js`, sin cambiar su comportamiento: `normalizeAnswer`, `isCorrect`, `correctAnswerText`, una función nueva `scoreSection(section, state)` (lógica actual de `sectionScore`) y `computeAverage(score, max)` (hoy inline en `finishGuide`: `Math.round(score / max * 100) / 10`, 0 si `max` es 0), según data-model.md §5
- [X] T006 Actualizar `English/js/engine.js`: borrar las funciones movidas, hacer que `sectionScore(index)` llame a `scoreSection(currentGuide.sections[index], sectionStates[index])` y que `finishGuide` use `computeAverage`
- [X] T007 Agregar `<script src="js/grading.js"></script>` en `English/QuizA.html`, inmediatamente antes de `<script src="js/engine.js"></script>`
- [X] T008 Verificar en el navegador que `English/QuizA.html` abre con doble clic y que las tres demos revisan y puntúan igual que en T002, sin errores en la consola (FR-038)
- [X] T009 Crear `English/tests/helpers/game-context.mjs`, que exporta `createGameContext({ seed, fixture, offline, rateLimited })`. Debe: crear un contexto `node:vm` con `console` y `URLSearchParams`; reemplazar `Math.random` por mulberry32 con la semilla dada (por defecto 1); inyectar un `fetch` falso que responda desde `fixture.responses[url]` (`{ ok, status, json() }`), que registre en `missingUrls` cada URL no grabada y la rechace con un error que incluya la URL, que falle siempre si `offline` (como `TypeError('Failed to fetch')`) y que responda 429 si `rateLimited`; cargar en orden `api.js`, `banks.js`, `demos.js`, `generators.js` y `grading.js` desde `English/js/`; y exponer `run(expression)`, `call(name, ...args)` y `missingUrls`. También debe exportar `loadFixture(name)`, que lee `English/tests/fixtures/<name>.json`

**Checkpoint**: la lógica pura carga en Node con semilla y red simulada; el juego sigue igual en el navegador.

---

## Phase 3: User Story 1 - Detectar automáticamente si un cambio rompe el juego (Priority: P1) 🎯 MVP

**Goal**: un conjunto de pruebas sin red y determinista que cubra las 7 áreas de SC-003 (FR-031 a FR-034) y documente las brechas móviles como pendientes (FR-039).

**Independent Test**: `npm test` sin internet termina en verde en menos de 1 minuto; cada mutación de quickstart §3 hace fallar el archivo indicado.

### Pruebas sin fuentes externas (paralelizables)

- [X] T010 [P] [US1] Crear `English/tests/grading.test.mjs`. Debe cubrir:
  - `normalizeAnswer`: mayúsculas, comas, espacios repetidos, puntuación final, espacio antes de puntuación y apóstrofos curvos.
  - `isCorrect`: los tipos `choice`, `bank`, `rewrite` y `fill`, con variantes aceptadas y rechazadas.
  - `correctAnswerText` en `choice` y `match`.
  - `scoreSection`: sección normal (aciertos en el intento 1 y 2 valen igual, FR-015) y writing.
  - `computeAverage`: 36/38 → 9.5, 0/0 → 0 y redondeo a un decimal (FR-022).
- [X] T011 [P] [US1] Crear `English/tests/grammar.test.mjs`. Debe cubrir:
  - `pastSimple`: todos los irregulares de `IRREGULAR_PAST`, más los regulares por regla ("play" → "played", "dance" → "danced", "study" → "studied", "stop" → "stopped", "visit" → "visited") y `pastTip` por regla.
  - `causativeAnswers`: had/got en pasado; have/get con "I", "We" y "My parents"; has/gets con "My aunt"; tiempo al frente solo si no es una oración subordinada (FR-017); y las 5 variantes de las demos.
  - `COMPARATIVE_BANK`: cada `text` tiene un `___` y un adjetivo entre paréntesis, y las respuestas no se repiten.
  - `QUANTIFIER_BANK`: 3 oraciones por cuantificador.
  - `quantifierSection`, `causativeSection`, `agoSection` y `comparativeSection` con semilla: 5 reactivos, la explicación aceptada como respuesta y, en *quantifiers*, cada cuantificador una sola vez.
  - `generateMisspellings`: nunca devuelve la palabra original y solo devuelve letras a–z.
- [X] T012 [P] [US1] Crear `English/tests/demos.test.mjs`, con una prueba por sección de cada demo (7 + 2 + 1, SC-002). Debe cubrir:
  - Orden y número de reactivos según FR-005 a FR-007.
  - Las reglas por tipo de data-model.md §2.
  - Que `isCorrect` acepte `answers[0]`, o la opción correcta, de cada reactivo.
  - Que los causativos y las oraciones con *ago* acepten su `explanation`.
  - Que el guion del *listening* y el dictado sigan siendo el contenido provisional de FR-008.
  - Que los criterios de writing sumen 10 y que cada `check` exista en `WRITING_CHECKS`.
- [X] T013 [P] [US1] Crear `English/tests/writing.test.mjs`. Debe cubrir:
  - Cada regla de `WRITING_CHECKS`, con un texto que obtiene 2, uno que obtiene 1 (si la regla lo permite) y uno que obtiene 0. Por ejemplo: `practicalInfo` reconoce "at Central Park"; `parentheses` da 2 con dos paréntesis; `length` cuenta palabras.
  - La carta de ejemplo de la verificación del 2026-10-24 ("Dear neighbors… Central Park… Sincerely, Ana"), que obtiene 10/10 con los criterios de la demo.
  - Que cada tarea de `WRITING_TASKS` tenga 5 criterios con un `check` válido y un `{topic}` en su consigna.
- [X] T014 [P] [US1] Crear `English/tests/content-filters.test.mjs`. Debe cubrir:
  - `UNSAFE` rechaza una muestra de palabras prohibidas y acepta palabras comunes.
  - `isCleanWord` y `cleanDefinition`: etiquetas no aptas ("(slang)", "(obsolete)"), inicios prohibidos ("Plural of", "A surname"), definiciones que revelan la palabra, longitud, corte en ";" y quitar ", especially".
  - `pickDefinition` solo mira los 3 primeros sentidos.
  - `decodeEntities`.
  - `articleSentences`: descarta siglas, números largos, comillas, palabras de 12 letras o más y texto no ASCII, y corrige "Ocean.The".
  - `isEasySentence` y `exampleSentence` con un `fetch` falso mínimo, sin fixture grande.
- [X] T015 [P] [US1] Crear `English/tests/responsive.test.mjs` (FR-039). Debe contener:
  - Una prueba normal: `English/QuizA.html` tiene `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
  - Pruebas **pendientes** con `{ todo: 'GAMES-2' }` que leen `English/css/quiz.css` de forma estática y fallan hoy: (a) toda regla que aplica a `input`, `select` o `textarea` deja la letra en al menos 16 px, considerando las reglas `.item select`/`.item input` de 0.95em; (b) `.option`, `.small-btn`, `.speak-btn`, `select`, `input[type="text"]` y las casillas de `.chip` declaran un alto mínimo de 44 px.

### Fuentes externas grabadas y generadores

- [X] T016 [US1] Crear `English/tests/fixtures/record.mjs` (research R5). Debe:
  - Definir los escenarios `gvs-recycling-g5` (semilla 7, puntos gramaticales quantifiers, causative, ago y comparatives), `rl-space-g5` (semilla 11) y `writing-animals-g5` (semilla 13, tarea `letter`).
  - Ejecutar cada uno con `createGameContext` y un `fetch` real con el `User-Agent` `GamesTestRecorder/1.0 (https://github.com/Florermg/Games; educational project)`.
  - Guardar `{ scenario, seed, recordedAt, responses }` en `English/tests/fixtures/<scenario>.json`.
  - Si un escenario falla (por ejemplo, con 429), reportarlo y conservar el archivo anterior.
  - Imprimir por escenario: grabado, sin cambios o fallido.
- [X] T017 [P] [US1] Crear `English/tests/fixtures/README.md` con la atribución CC BY-SA (Wiktionary y Simple English Wikipedia; Datamuse), la fecha de captura, qué escenario usa qué fuente, cómo regrabar (`npm run fixtures:record`) y la advertencia de que regrabar con las mismas semillas cambia los fixtures si las fuentes cambiaron
- [X] T018 [US1] Ejecutar `npm run fixtures:record` (con red) y comprobar que se crean los 3 JSON y que pesan menos de 1.5 MB en total. Si Simple English Wikipedia responde 429, reintentar más tarde; si persiste, grabar `rl-space-g5` desde el navegador (abrir `English/QuizA.html` en el servidor local con un `fetch` envuelto que acumule las respuestas y copiarlas al JSON) y documentar el método usado en `English/tests/fixtures/README.md`
- [X] T019 [US1] Crear `English/tests/generators.test.mjs`. Por cada escenario grabado:
  - Reproducirlo con su semilla y exigir `missingUrls` vacío.
  - Verificar la estructura de FR-025 por tipo de guía: secciones y número de reactivos dentro de los rangos, `source` CC BY-SA en *reading*, y 5 criterios de 2 puntos en *writing*.
  - Verificar FR-029: una sola respuesta correcta presente en `options`, opciones distintas sin importar mayúsculas, y faltas de ortografía distintas de la palabra correcta.
  - Verificar que cada respuesta del banco de palabras esté en `bank`.

  Además, con la respuesta grabada del pool de Datamuse:
  - FR-027: `buildWordPool` con grado 3 da una frecuencia media mayor que con grado 6.
  - Sin red: `generateGrammarGuide` rechaza con "Could not reach the dictionary API…".
  - Con 429: el mensaje "busy".
  - `generateReadingGuide` sin red rechaza, documentando con un comentario la brecha conocida del mensaje técnico.
- [X] T020 [US1] Validar US1: `npm test` sin internet pasa en menos de 1 minuto y muestra las pruebas de `responsive.test.mjs` como `todo` (SC-001, FR-039); 10 ejecuciones seguidas dan el mismo resultado (SC-004); y `git status` queda limpio después de correr las pruebas (contracts/test-commands.md). Registrar el resultado en `specs/001-linea-base-quality-gate/validation.md`

**Checkpoint**: la US1 está completa y es usable sola: hay una red de seguridad local.

---

## Phase 4: User Story 2 - Quality gate en cada cambio publicado (Priority: P2)

**Goal**: el workflow `Tests` marca cada push y PR a `main` como ✅/❌ (FR-036), con bloqueo de proceso (FR-037).

**Independent Test**: un PR con las pruebas en verde muestra ✅ en menos de 5 minutos; un commit con una mutación muestra ❌ y la prueba que falló.

- [X] T021 [US2] Crear `.github/workflows/tests.yml` según contracts/ci-workflow.md: workflow `Tests`, disparadores `push` y `pull_request` a `main`, job `tests` en `ubuntu-latest` con `timeout-minutes: 5`, `actions/checkout@v4`, `actions/setup-node@v4` con `node-version: 24`, y el paso `npm test`
- [X] T022 [US2] **Pedir autorización** y crear el commit de la implementación (Phases 1–4) en la rama `001-linea-base-quality-gate`; **pedir autorización aparte** para el push de la rama (`git push -u origin 001-linea-base-quality-gate`); **pedir autorización aparte** para abrir el PR hacia `main` con `gh pr create`, referenciando GAMES-1
- [X] T023 [US2] Verificar en el PR que el check `Tests / tests` aparece y termina en ✅ en menos de 5 minutos (SC-005); anotar el tiempo en `specs/001-linea-base-quality-gate/validation.md`
- [X] T024 [US2] Prueba del fallo (quickstart §6.3): **con autorización**, hacer commit y push de una mutación de quickstart §3 (por ejemplo, la de `demos.js`), confirmar ❌ y que el PR muestra la prueba fallida, y **con autorización** revertir el commit, hacer push y confirmar ✅

**Checkpoint**: la US2 está completa: el gate es visible en cada cambio.

---

## Phase 5: User Story 3 - Saber exactamente qué hace hoy el juego (Priority: P3)

**Goal**: confirmar que la spec describe el juego real y que no hubo cambios visibles (SC-006), en PC, celulares e iPad (FR-030a, SC-007).

**Independent Test**: recorrido de FR-001 a FR-030a en el navegador y en dispositivos reales, comparado con el registro de T002.

- [X] T025 [US3] Repetir el recorrido de quickstart §4 sobre la rama, comparar con la sección "Línea base" de `specs/001-linea-base-quality-gate/validation.md` y registrar el resultado (SC-006). Si aparece una diferencia, corregir el código o, si la spec estaba mal, corregir primero `spec.md` (Principio I)
- [X] T026 [US3] Recorrer FR-001 a FR-030 en `specs/001-linea-base-quality-gate/spec.md` contra el juego (menú, demos, una guía generada de cada tipo con internet) y marcar en `validation.md` cada requisito como confirmado o corregido
- [ ] T027 [US3] Recorrido en dispositivos reales (quickstart §5): servir `English/` en la red local y, con el usuario, recorrer menú, tres demos y resultados en iPhone, iPad, Android y PC. Registrar en `validation.md` el resultado por dispositivo (FR-030a, SC-007) y agregar un comentario en GAMES-2 con toda brecha nueva (por ejemplo, la lectura en voz alta en Safari de iOS)

**Checkpoint**: las tres historias están completas.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T028 [P] Documentar en `README.md` (raíz) cómo abrir el juego, cómo correr `npm test`, `npm run test:coverage` y `npm run fixtures:record`, y qué hace el check `Tests` (FR-034)
- [X] T029 Ejecutar la tabla de mutaciones de quickstart §3 (7 áreas): aplicar cada cambio, confirmar que falla el archivo indicado, revertir con `git checkout -- <archivo>` y registrar el resultado en `validation.md` (SC-003)
- [X] T030 Enmendar `.specify/memory/constitution.md` a 1.0.1 (PATCH): resolver `TODO(QUALITY_GATE_SETUP)` en el Principio IV (el gate existe: workflow `Tests` + `npm test`, con bloqueo de proceso) y en el Sync Impact Report, y actualizar `Last Amended`
- [ ] T031 **Pedir autorización** para el commit de T025–T030 y **autorización aparte** para su push a la rama del PR; confirmar ✅ en el PR
- [ ] T032 Cierre en Jira (Principio III, paso 5): verificar que `tasks.md` no tiene tareas eliminadas ni alteradas en su alcance respecto al checklist comentado en GAMES-1; **pedir autorización** para integrar el PR a `main`; confirmar ✅ en `main`; actualizar la descripción de GAMES-1 con "**Implementado**" (archivos, pruebas, cobertura informativa de `npm run test:coverage`, rama, PR y commit) y transicionar GAMES-1 a "Listo"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 primero (la rama). T002 debe hacerse **antes de T005**, porque registra la línea base sin cambios. T003 y T004 son independientes.
- **Foundational (Phase 2)**: depende de T001–T004. T005 → T006 → T007 → T008. T009 depende de T005 (carga `grading.js`) y de T004.
- **US1 (Phase 3)**: depende de la Phase 2. T010–T015 son paralelas entre sí. T016 → T018 → T019. T017 es paralela a T016. T020 cierra la US1.
- **US2 (Phase 4)**: depende de la US1 (sin pruebas no hay gate). T021 → T022 → T023 → T024.
- **US3 (Phase 5)**: T025 y T026 dependen de la Phase 2 (código cambiado) y pueden hacerse en paralelo con la US2. T027 necesita al usuario y sus dispositivos.
- **Polish (Phase 6)**: T028 es paralela desde el inicio de la US2. T029 depende de la US1. T030 depende de T023 (el gate funciona). T031 → T032 al final.

### User Story Dependencies

- **US1 (P1)**: depende solo de las fases 1 y 2. Es el MVP.
- **US2 (P2)**: depende de la US1.
- **US3 (P3)**: independiente de la US1 y la US2 para el recorrido (T025–T027); usa el registro de T002.

### Parallel Opportunities

- T003 ∥ T004.
- T010 ∥ T011 ∥ T012 ∥ T013 ∥ T014 ∥ T015: seis archivos de prueba distintos, todos sobre `game-context.mjs` ya terminado.
- T016 ∥ T017.
- T025 ∥ T026 mientras corre CI en T023.
- T028 en cualquier momento después de T021.

---

## Parallel Example: User Story 1

```text
# Una vez lista la Phase 2 (T009), lanzar juntas:
T010 grading.test.mjs
T011 grammar.test.mjs
T012 demos.test.mjs
T013 writing.test.mjs
T014 content-filters.test.mjs
T015 responsive.test.mjs

# En paralelo con ellas:
T016 record.mjs  y  T017 fixtures/README.md
# Después: T018 (grabar, con red) → T019 generators.test.mjs → T020 validación
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (con T002 antes de cualquier cambio de código).
2. Phase 2: extraer `grading.js` y el helper.
3. Phase 3: las 7 áreas más las pruebas pendientes de móviles.
4. **STOP and VALIDATE**: T020. Hay red de seguridad local aunque aún no exista CI.

### Incremental Delivery

1. US1 → red de seguridad local (`npm test`).
2. US2 → gate visible en GitHub (cada commit, push y PR con su autorización).
3. US3 → spec confirmada contra el juego y los dispositivos reales.
4. Polish → mutaciones (SC-003), constitución 1.0.1 y cierre de GAMES-1.

---

## Notes

- [P] tasks = archivos distintos, sin dependencias pendientes.
- `validation.md` reúne la evidencia de SC-001 a SC-007 para el comentario de cierre en Jira.
- Si una tarea descubre que la spec está mal, se corrige `spec.md` primero (Principio I) y se documenta en GAMES-1.
- Cualquier cambio de alcance respecto a este checklist (tareas nuevas, eliminadas o modificadas) se documenta explícitamente antes del cierre (Principio III, paso 5).
