---

description: "Task list for 004-gramatica-verbos"
---

# Tasks: Secciones de gramática (tarjetas imprimibles) y de verbos

**Input**: Design documents from `specs/004-gramatica-verbos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reference.md, quickstart.md

**Jira**: GAMES-6 · **Modo**: `in-all-process` · **Rama**: `004-gramatica-verbos` (desde `main`)

**Tests**: FR-014 exige pruebas automáticas; se escriben **antes** de la implementación de cada historia.

**Principio III**: un comentario de checkpoint en GAMES-6 por cada historia completada. **Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Antes de cambiar código, ejecutar en el navegador el recorrido de GAMES-1 (semilla 12345) sobre la rama y registrar la huella en `specs/004-gramatica-verbos/validation.md` (debe ser `f1 b9 82 7e 2c 76`)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T002 Crear `English/js/conjugation.js` con la tabla de los 10 tiempos (`TENSES`: `id`, `label`, `minGrade`, `timeEn`, `timeEs`; data-model §1) y `tensesForGrade(grade)`, más funciones vacías de `conjugate`, `spanishForm`, `searchVerbs` y `lookupVerbOnline`, para completarlas en la US1
- [X] T003 Crear `English/js/verbs-data.js` con `VERBS = []` y `English/js/grammar-cards.js` con `GRAMMAR_CARDS = []`, `grammarCardsFor` y `buildCardsPrintHtml` vacías; agregar `conjugation.js`, `verbs-data.js` y `grammar-cards.js` a `GAME_SCRIPTS` en `English/tests/helpers/game-context.mjs` (después de `print.js`, con `verbs-data.js` antes de `conjugation.js`)
- [X] T004 En `English/QuizA.html`: agregar dos tarjetas al menú ("📗 Grammar cards" y "🔤 Verbs"), las pantallas `#grammar-screen` y `#verbs-screen` (ocultas, cada una con "⬅ Menu", selector de grado, casillas de los 10 tiempos y "All tenses") y los `<script>` de `verbs-data.js`, `conjugation.js`, `grammar-cards.js` (antes de `engine.js`) y `reference.js` (después). Crear `English/js/reference.js` con `openReference(kind)`, que muestra la pantalla y oculta las demás, y con el selector de tiempos según el grado (FR-002); `backToMenu` de `engine.js` también oculta las pantallas nuevas
- [X] T005 Verificar que `npm test` sigue en `146 · pass 144 · fail 0 · todo 2` y que la huella del recorrido de GAMES-1 no cambió (FR-015)

**Checkpoint**: las pantallas abren y cierran desde el menú, los tiempos responden al grado y las guías siguen igual.

---

## Phase 3: User Story 1 - Buscar un verbo y verlo en sus tiempos (Priority: P1) 🎯 MVP

**Goal**: búsqueda en español e inglés y conjugación correcta en los tiempos elegidos, con ejemplos traducidos (FR-003 a FR-007).

**Independent Test**: quickstart §2.

- [X] T006 [P] [US1] Escribir `English/tests/conjugation.test.mjs` (debe fallar antes de T008–T010). Debe cubrir:
  - `tensesForGrade` para 3°–6° según data-model §1 (SC-003) y el orden de FR-003.
  - Una tabla revisada a mano de **30 verbos** (regulares, irregulares y con cambios *-ied*, consonante doble, *-e* final, *-ie* → *-ying*, frasales y reflexivos), con su forma inglesa en los 10 tiempos y sus 6 formas españolas base. Incluye *eat, go, be, have, do, study, stop, play, make, write, swim, run, lie, dance, watch, fix, try, cry, wake up, get up, know, want, see, read, put, buy, teach, sleep, open, travel* (*want* en lugar de *like*; ver validation.md, decisiones de contenido).
  - Que todos los verbos de `VERBS` se conjugan en los 10 tiempos sin formas vacías ni regularizaciones de irregulares (ningún "goed", "eated"…).
  - La *-s* de tercera persona (*watches, studies, has, goes, does*).
  - Que los ejemplos empiezan con "She" / "Ella" y terminan en punto, con el complemento y la expresión de tiempo.
  - La nota de los verbos `stative` en los tiempos continuos.
- [X] T007 [P] [US1] Escribir `English/tests/verb-search.test.mjs` (debe fallar antes de T011). Debe cubrir:
  - "comer", "Comér", "  COMER ", "eat" y "EAT" → *eat*.
  - Formas conjugadas inglesas: *went, gone, eaten, studied, swimming* → su base.
  - Varias traducciones: "tocar" → *play* y *touch*; "jugar" → *play*.
  - Prefijos ("estud" → *study*) y un máximo de 8 resultados.
  - Sin coincidencias → `[]`.
  - `lookupVerbOnline` con `fetch` simulado, sin red: "susurrar" → *whisper* (`reviewed: false`) limpiando "Para susurrar"; "tocar" toma la alternativa *touch* y descarta "Sense of Touch"; un resultado inseguro (filtro `UNSAFE`) → `null`; sin conexión → `null`.
- [X] T008 [US1] Llenar `English/js/verbs-data.js` con **al menos 200 verbos** de primaria (data-model §2): traducciones, irregulares (con variantes), complementos `objEn`/`objEs` aptos para niños, `stative` cuando aplique y las excepciones españolas `esForms`
- [X] T009 [US1] Implementar en `English/js/conjugation.js` las formas inglesas:
  - presente (3.ª persona);
  - *-ing*;
  - pasado y participio, reutilizando las reglas de `regularPast` y `IRREGULAR_PAST` de `banks.js` cuando coinciden;
  - auxiliares por tiempo (*is/was/has/had/will/is going to/will be/has been*);
  - verbos frasales (la partícula al final: *wakes up, woke up*).
- [X] T010 [US1] Implementar en `English/js/conjugation.js`:
  - `spanishForm`: reglas de *-ar/-er/-ir* para presente, pretérito, futuro, gerundio y participio de 3.ª persona, más `esForms`.
  - Los tiempos compuestos españoles con auxiliares (research R3) y los reflexivos con *se*.
  - `conjugate(verb, tenseId)`, que devuelve `{ tense, formEn, exampleEn, exampleEs, note }`.

  T006 debe pasar.
- [X] T011 [US1] Implementar en `English/js/conjugation.js` `searchVerbs(query)` (normalización sin acentos ni mayúsculas, exacta → forma conjugada → prefijo) y `lookupVerbOnline(query)` (MyMemory + Datamuse + filtros; research R4). T007 debe pasar
- [X] T012 [US1] Pantalla Verbs en `English/js/reference.js` y `English/css/quiz.css`:
  - campo de búsqueda con sugerencias mientras se escribe;
  - tarjeta del verbo elegido con los tiempos marcados (forma, ejemplo y traducción) y la marca "not reviewed" cuando aplique;
  - mensajes de "no encontrado" y "sin conexión" con sugerencias;
  - todo el texto de la fuente pública se escapa.
- [X] T013 [US1] Validar la US1 en el navegador (quickstart §2) y registrar el resultado en `validation.md`
- [X] T014 [US1] Jira: comentario de checkpoint en GAMES-6 (US1)

**Checkpoint**: la US1 se puede usar sola: el buscador de verbos.

---

## Phase 4: User Story 2 - Ver e imprimir tarjetas de gramática (Priority: P2)

**Goal**: 22 tarjetas con ejemplos en los tiempos elegidos, imprimibles en carta (FR-008 a FR-013).

**Independent Test**: quickstart §3 y §4.1.

- [X] T015 [P] [US2] Escribir `English/tests/grammar-cards.test.mjs` (debe fallar antes de T016–T018). Debe cubrir:
  - Que hay 22 tarjetas: 10 de `tenses`, 4 de `guides` y 8 de `basics`, con los ids de la US2.
  - Los elementos de FR-009 en cada tarjeta: explicación de 3 líneas o menos; en las de tiempos, estructura y palabras clave; y 1 o 2 ejemplos con `en` y `es`.
  - Que, en los temas que cambian con el tiempo, cada tiempo que el tema admite tiene ejemplo.
  - Que `grammarCardsFor(tenseIds)` filtra los ejemplos por tiempo.
  - Que `buildCardsPrintHtml`: crea una `.print-card` por elemento; usa la tarjeta ancha en verbos con más de 6 tiempos; falla sin elementos o sin tiempos; escapa el texto; y no cambia la selección.
- [X] T016 [US2] Escribir en `English/js/grammar-cards.js` las **22 tarjetas** (research R5): 10 de tiempos con estructura, palabras clave y 2 ejemplos; quantifiers, causative, past simple + *ago* y comparatives; subject pronouns, possessive adjectives, articles, plurals, *there is / there are*, prepositions of place, prepositions of time y *can / can't*, con ejemplos por tiempo en los temas que cambian
- [X] T017 [US2] Implementar `grammarCardsFor` y `buildCardsPrintHtml` en `English/js/grammar-cards.js` (cuadrícula `.print-cards` de 2 columnas). T015 debe pasar
- [X] T018 [P] [US2] Estilos de las tarjetas en `English/css/quiz.css`: en pantalla, cuadrícula responsiva; en `@media print`, `.print-cards` con 2 columnas, borde, `break-inside: avoid` y tarjeta ancha con `grid-column: span 2`, en blanco y negro
- [X] T019 [US2] Pantalla Grammar en `English/js/reference.js`: las 22 tarjetas en 3 grupos con su casilla para imprimir, "Select all" / "Select none", ejemplos según los tiempos marcados y "🖨 Print selected" (`#print-area` + `window.print()`). Sin selección, la tutora pide elegir al menos una
- [X] T020 [US2] Crear `specs/004-gramatica-verbos/validate-print/` (un *harness* y `run.sh`, como en GAMES-3) que genere en PDF: 4 tarjetas de gramática con los tiempos de 3°, las 22 tarjetas con todos los tiempos y 6 tarjetas de verbos. Revisar tamaño carta, ausencia de textos de pantalla y tarjetas completas; revisarlos a ojo y registrar en `validation.md` (SC-004)
- [X] T021 [US2] Jira: comentario de checkpoint en GAMES-6 (US2)

---

## Phase 5: User Story 3 - Imprimir tarjetas de verbos (Priority: P3)

**Goal**: seleccionar varios verbos e imprimirlos como tarjetas (FR-011, FR-012).

- [X] T022 [P] [US3] Agregar a `English/tests/grammar-cards.test.mjs` las pruebas de `buildCardsPrintHtml` con `kind: "verbs"`: una tarjeta por verbo, con los tiempos elegidos, forma y ejemplo, y en el orden de la selección (debe fallar antes de T023)
- [X] T023 [US3] Tarjetas de verbos en `English/js/grammar-cards.js` y la selección en la pantalla Verbs (`English/js/reference.js`): "➕ Add to print", la lista de seleccionados con "✖" y "🖨 Print selected". T022 debe pasar
- [X] T024 [US3] Validar la US3 en el navegador (quickstart §4.2 y §4.3) y con los PDFs de T020; registrar en `validation.md`
- [X] T025 [US3] Jira: comentario de checkpoint en GAMES-6 (US3)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T026 [P] Documentar en `README.md` las secciones Grammar y Verbs, y MyMemory como fuente nueva
- [X] T027 Enmendar `.specify/memory/constitution.md` a 1.0.2 (PATCH): agregar MyMemory a la lista de fuentes del Principio VI, con su Sync Impact Report
- [X] T028 Verificación final: `npm test` 10 veces con el mismo resultado, la huella del recorrido de GAMES-1 sin cambios y la medición de SC-001 (menos de 1 s para buscar y mostrar un verbo) y SC-005 (de abrir el juego a la vista previa de 3 tarjetas en menos de 1 minuto); registrar en `validation.md`
- [ ] T029 **Pedir autorización** para el commit de la historia en `004-gramatica-verbos`; **con autorización aparte**, push de la rama; **con autorización aparte**, abrir el PR hacia `main` (si GAMES-5 ya se integró, rebasar antes con autorización y versionar los archivos nuevos según su esquema). Confirmar el check `Tests` en ✅
- [ ] T030 Cierre en Jira (Principio III, paso 5): verificar el alcance contra el checklist comentado; **pedir autorización** para integrar el PR; confirmar ✅ en `main`; actualizar GAMES-6 con "**Implementado**" y pasarla a "Listo"

---

## Dependencies & Execution Order

- **Setup → Foundational**: T001 → T002 → T003 → T004 → T005.
- **US1**: T006 ∥ T007 (pruebas primero) → T008 → T009 → T010 → T011 → T012 → T013 → T014.
- **US2**: T015 (pruebas primero) ∥ T018; luego T016 → T017 → T019 → T020 → T021. Puede empezar en paralelo con la US1 después de la Phase 2, porque las tarjetas no dependen de los verbos.
- **US3**: depende de la US1 (verbos) y de T017 (impresión de tarjetas). T022 → T023 → T024 → T025.
- **Polish**: T026 desde la US2; T027 en cualquier momento; T028 → T029 → T030.

### Parallel Opportunities

T006 ∥ T007; T015 ∥ T018; T022 ∥ T026; la US2 completa puede ir en paralelo con la US1.

## Implementation Strategy

1. **MVP**: Phases 1–3 (el buscador de verbos).
2. **US2**: tarjetas de gramática imprimibles.
3. **US3**: tarjetas de verbos.
4. **Polish**: README, constitución 1.0.2, verificación, commit, PR y cierre.

## Notes

- Las listas de verbos y tarjetas son contenido para niños: cada complemento y ejemplo se revisa al escribirlo (Principio VI).
- Si una tarea descubre un error en la spec, se corrige `spec.md` primero (Principio I) y se documenta en GAMES-6.
