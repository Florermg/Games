# Tasks: Nueva opción Listening

**Input**: `specs/009-listening/` (spec, plan, research, data-model, quickstart) · **Jira**: GAMES-11

## Phase 1: Setup

- [X] T001 Agregar `listeningSentences` y `speechRate` a `GRADE_LEVELS` en English/js/api.js (R3)

## Phase 2: Foundational

- [X] T002 `Speech.speakSequence(sentences, rate, onSentence, onEnd)` con utterances en cola y token de cancelación en English/js/api.js (R1)
- [X] T003 Parametrizar `readingQuestions` con `READING_WORDING` (mismo texto de hoy) en English/js/generators.js (R2) y comprobar que la guía Reading y la huella no cambian

## Phase 3: User Story 1 - Escuchar con subtítulos y luego sin ellos (P1) 🎯 MVP

- [X] T004 [US1] `LISTENING_WORDING` y `generateListeningGuide` (story y facts) en English/js/generators.js (data-model)
- [X] T004b [US1] 18 historias y diálogos con 7 preguntas cada uno en English/js/listening-stories.js; el script en QuizA.html, GAME_SCRIPTS y el test de versiones (R5)
- [X] T005 [US1] Escenario `listening-space-g5` en English/tests/fixtures/record.mjs, grabar el fixture y documentarlo en English/tests/fixtures/README.md
- [X] T006 [P] [US1] Pruebas del generador, del nivel por grado y de `speakSequence` en English/tests/listening.test.mjs
- [X] T007 [US1] `renderListenSection`, etapas (`showStage`), secciones `listen` sin calificación en English/js/engine.js
- [X] T008 [US1] Tarjeta 🎧 Listening con selector Audio type en English/QuizA.html y estilos `.subtitles` / `.stage-actions` en English/css/quiz.css

## Phase 4: User Story 2 - Quiz de opción múltiple (P2)

- [X] T009 [US2] Barra de audio (sin subtítulos) en el quiz con la velocidad del grado, y resultados sin las etapas de audio en English/js/engine.js
- [X] T010 [P] [US2] Pruebas del quiz (5–6 preguntas, una correcta tomada del audio, calificación) en English/tests/listening.test.mjs

## Phase 5: User Story 3 - Imprimir (P3)

- [X] T011 [US3] `PRINT_RENDERERS.listen` en English/js/print.js
- [X] T012 [P] [US3] Pruebas: la hoja del alumno sin el texto, la de respuestas con "Read aloud" y la fuente, en English/tests/listening.test.mjs

## Phase 6: Polish

- [X] T013 `npm run versions`, `npm test` y huella de GAMES-1
- [X] T014 Validación en el navegador (quickstart 3, 4 y 7) y en vivo con los 18 temas (SC-001), registrada en specs/009-listening/validation.md
- [X] T015 README.md: opción Listening

## Dependencies

T001 → T002, T003 → T004b → T004 → T005 → T006; T004 → T007 → T008 → T009 → T011. Las pruebas [P] pueden escribirse en paralelo con el código de su historia.
