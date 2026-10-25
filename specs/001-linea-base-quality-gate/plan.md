# Implementation Plan: Línea base y quality gate del juego de inglés

**Branch**: `001-linea-base-quality-gate` | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-1

**Input**: Feature specification from `specs/001-linea-base-quality-gate/spec.md`

## Summary

Proteger el comportamiento actual del juego de inglés (línea base del commit `9ae5667`, FR-001 a FR-030) con pruebas automáticas que corren sin red y con el mismo resultado en cada ejecución (US1), y conectarlas a un quality gate de GitHub Actions que marca cada push y PR a `main` como aprobado o fallido, con bloqueo de proceso según FR-037 (US2).

Enfoque técnico, según research.md:
- El runner integrado de Node (`node:test`), sin dependencias.
- Los scripts del juego se cargan sin cambios dentro de contextos `node:vm`.
- `Math.random` lleva una semilla fija para que los generadores sean repetibles.
- Un `fetch` falso responde desde respuestas grabadas de las fuentes reales.
- El único cambio al código del juego es extraer las funciones puras de calificación de `engine.js` a `grading.js`, sin cambio visible (FR-038).

## Technical Context

**Language/Version**: JavaScript (ES2020, scripts clásicos de navegador) para el juego; Node 24 LTS para las pruebas y CI.

**Primary Dependencies**: ninguna en tiempo de ejecución. Para desarrollo, solo módulos integrados de Node: `node:test`, `node:assert`, `node:vm` y `node:fs`.

**Storage**: N/A. El juego no guarda datos; las pruebas leen respuestas grabadas en JSON (`English/tests/fixtures/`).

**Testing**: `node --test` (unitarias y de integración de generadores con fuentes simuladas). La capa visual y el audio se validan a mano (quickstart §4).

**Target Platform**: PC (Chrome, Edge, Safari), celulares (Android con Chrome, iPhone con Safari) e iPad (Safari), abriendo `English/QuizA.html` desde un archivo, un hosting estático o la red local; CI en `ubuntu-latest`. Las brechas táctiles conocidas se documentan con pruebas pendientes y se corrigen en GAMES-2 (research R9).

**Project Type**: aplicación web estática (single project), con pruebas de su lógica.

**Performance Goals**: la suite completa termina en menos de 1 minuto (SC-001); el resultado de CI aparece en menos de 5 minutos (SC-005).

**Constraints**:
- Las pruebas no hacen ninguna petición real (FR-032) y son deterministas (FR-033).
- El juego se abre con doble clic sin Node (FR-035).
- No hay cambios visibles (FR-038).
- Las grabaciones de CC BY-SA llevan atribución (Principio VI).

**Scale/Scope**:
- 5 archivos JavaScript (unas 2,100 líneas).
- 3 demos con 49 reactivos (38 en Grammar, Vocabulary & Spelling y 11 en Reading & Listening) y 1 texto libre.
- 3 generadores.
- Grabaciones estimadas en menos de 1.5 MB.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | Spec aprobada, con su clarificación (FR-037) resuelta antes del plan. Esta historia es precisamente la spec de línea base que el Principio I exige antes de modificar `English/`. El único cambio de código de producción (extraer `grading.js`) está previsto en FR-038 y documentado en research R3. | ✅ |
| II. Simplicidad | No hay dependencias npm ni build. Se eligió `node:test` sobre Vitest (R1) y `vm` sobre convertir a módulos (R2). `package.json` contiene solo *scripts* de desarrollo. No se agrega jsdom ni mutation testing (R3, R8). | ✅ |
| III. Jira (GAMES-1) | Paso 1 cumplido: "En curso" y comentario de specify. Este plan se cierra con el comentario del paso 2 antes de `/speckit-tasks`. Modo `in-all-process`: se preguntará "¿continúo?" antes de tasks. | ✅ |
| IV. Quality gate | Esta historia lo crea: `npm test` y el workflow `Tests` (contracts/). El bloqueo es de proceso por la clarificación de FR-037; el TODO(QUALITY_GATE_SETUP) de la constitución se resuelve al cerrar la historia. | ✅ (en construcción) |
| V. Commits | Cada commit, el push, la creación del PR y la integración se autorizan por separado (R7, quickstart §5). | ✅ |
| Alcance de dispositivos | PC, celulares e iPad son plataformas objetivo (FR-030a). Las 4 brechas táctiles quedan documentadas y con pruebas pendientes; su arreglo va en GAMES-2, sin cambios visibles aquí (FR-038). | ✅ |
| VI. Contenido y fuentes | Las pruebas de filtros refuerzan el principio (FR-028). Las grabaciones con texto CC BY-SA llevan `README.md` con atribución y fecha (R5). Ninguna prueba ni el CI envían datos del alumno. La brecha conocida (mensaje sin conexión en Reading) queda documentada en la spec, fuera de alcance. | ✅ |

**Re-check post-diseño (Phase 1)**: sin cambios. El diseño no agrega dependencias, servicios ni abstracciones más allá de un archivo de funciones puras y un helper de pruebas. No hay violaciones que justificar en *Complexity Tracking*.

## Project Structure

### Documentation (this feature)

```text
specs/001-linea-base-quality-gate/
├── plan.md              # Este archivo
├── research.md          # Fase 0: decisiones R1–R8
├── data-model.md        # Fase 1: estructuras de guía, estado, fixtures
├── quickstart.md        # Fase 1: validación de punta a punta
├── contracts/
│   ├── test-commands.md # npm test / test:coverage / fixtures:record
│   └── ci-workflow.md   # workflow Tests y bloqueo de proceso
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
Games/
├── package.json                    # NUEVO: solo scripts (test, test:coverage, fixtures:record); sin dependencias
├── .github/
│   └── workflows/
│       └── tests.yml               # NUEVO: quality gate (contracts/ci-workflow.md)
└── English/
    ├── QuizA.html                  # CAMBIA: agrega <script src="js/grading.js"> antes de engine.js
    ├── css/quiz.css                # sin cambios
    ├── js/
    │   ├── api.js                  # sin cambios
    │   ├── banks.js                # sin cambios
    │   ├── demos.js                # sin cambios
    │   ├── generators.js           # sin cambios
    │   ├── grading.js              # NUEVO: normalizeAnswer, isCorrect, correctAnswerText, scoreSection, computeAverage
    │   └── engine.js               # CAMBIA: usa grading.js (sin cambio visible)
    └── tests/
        ├── helpers/
        │   └── game-context.mjs    # carga scripts en node:vm con semilla y fetch falso
        ├── fixtures/
        │   ├── README.md           # atribución CC BY-SA, fecha y cómo regrabar
        │   ├── record.mjs          # script de desarrollo (npm run fixtures:record)
        │   ├── gvs-recycling-g5.json
        │   ├── rl-space-g5.json
        │   └── writing-animals-g5.json
        ├── grading.test.mjs
        ├── grammar.test.mjs
        ├── demos.test.mjs
        ├── writing.test.mjs
        ├── content-filters.test.mjs
        ├── generators.test.mjs
        └── responsive.test.mjs     # pruebas PENDIENTES (todo: GAMES-2) sobre quiz.css
```

**Structure Decision**: single project con raíz en `Games/`, porque la constitución fija esa raíz para todos los juegos. Las pruebas viven junto al juego que prueban (`English/tests/`), para que un juego futuro tenga su propia carpeta `tests/`. `package.json` y el workflow quedan en la raíz, porque CI y `npm test` son del repositorio completo. Los escenarios de fixtures (temas Recycling, Space y Animals, grado 5) se eligieron porque ya funcionaron en la verificación en navegador del 2026-10-24; el nombre de cada archivo sigue `<kind>-<tema>-g<grado>.json`.

## Complexity Tracking

No aplica: el Constitution Check no tiene violaciones.
