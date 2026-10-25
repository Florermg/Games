# Implementation Plan: Secciones de gramática (tarjetas imprimibles) y de verbos

**Branch**: `004-gramatica-verbos` (desde `main`) | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-6

**Input**: Feature specification from `specs/004-gramatica-verbos/spec.md`

## Summary

Dos pantallas de consulta nuevas en `English/QuizA.html`: **Verbs** y **Grammar**.

- **Verbs**: busca un verbo en español o inglés y lo muestra en los tiempos elegidos, con un ejemplo traducido en cada uno.
- **Grammar**: muestra 22 tarjetas con ejemplos en los tiempos elegidos.
- **Impresión**: las dos secciones imprimen tarjetas en papel carta, varias por hoja, reutilizando la impresión de GAMES-3.

Enfoque técnico (research.md):
- Lista propia de unos 200 verbos.
- Conjugación inglesa por reglas más irregulares de la lista; en español, 6 formas base calculadas con sus excepciones, más auxiliares.
- 22 tarjetas escritas a mano.
- MyMemory y Datamuse filtrados para los verbos que no están en la lista ("not reviewed").
- Funciones puras probadas en Node.

## Technical Context

**Language/Version**: JavaScript (ES2020, scripts clásicos) y CSS; Node 24 para pruebas.

**Primary Dependencies**: ninguna nueva. Fuentes públicas sin clave: MyMemory (nueva, verificada con CORS) y Datamuse (ya en uso).

**Storage**: N/A (en memoria).

**Testing**: `npm test` con 3 archivos nuevos (R7) y la fuente pública simulada. Validación visual con PDFs, como en GAMES-3.

**Target Platform**: PC, iPhone, iPad y Android (como GAMES-1); impresión con la del sistema.

**Project Type**: aplicación web estática (single project).

**Performance Goals**: búsqueda y muestra de un verbo de la lista en menos de 1 s sin red (SC-001); armado de la impresión instantáneo.

**Constraints**:
- Sin dependencias y doble clic (Principio II).
- Contenido apto para niños y fuentes sin clave (Principio VI).
- Las guías no cambian (FR-015).
- La validación con dispositivos sigue pendiente en GAMES-4.

**Scale/Scope**:
- Unos 200 verbos.
- 10 tiempos.
- 22 tarjetas, con unas 80 oraciones de ejemplo escritas a mano.
- 4 archivos JS nuevos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | La spec está aprobada, sin clarificaciones pendientes; las decisiones del usuario están registradas en el Contexto. | ✅ |
| II. Simplicidad | Sin frameworks ni dependencias. Son pantallas nuevas en la misma página y reutilizan la impresión de GAMES-3 (R1, R6). La conjugación española usa 6 formas base en lugar de tablas completas (R3). | ✅ |
| III. Jira (GAMES-6) | Paso 1 cumplido; este plan cierra con el comentario del paso 2. Modo `in-all-process`. | ✅ |
| IV. Quality gate | 3 archivos de prueba nuevos entran a `npm test` y a `Tests`. Las pruebas existentes no cambian. | ✅ |
| V. Commits | Cada commit, push, PR y merge con autorización. | ✅ |
| VI. Contenido y fuentes | La lista y las tarjetas están revisadas. Se agrega **una fuente pública nueva sin clave** (MyMemory); el principio la admite (solo prohíbe fuentes con clave) y sus resultados pasan por los filtros y se marcan "not reviewed" (R4). Solo se envía la palabra buscada, sin datos del alumno. Sin internet, la lista propia funciona. | ✅ (con fuente nueva documentada) |

**Re-check post-diseño**: sin violaciones. Agregar MyMemory no requiere enmendar la constitución, porque el Principio VI lista las fuentes como "hoy" y solo prohíbe las que piden clave. Al cerrar la historia se puede actualizar esa lista con un PATCH, de redacción.

## Project Structure

### Documentation (this feature)

```text
specs/004-gramatica-verbos/
├── plan.md · research.md · data-model.md · quickstart.md
├── contracts/reference.md
├── checklists/requirements.md
└── tasks.md                   # /speckit-tasks
```

### Source Code (repository root)

```text
English/
├── QuizA.html                 # CAMBIA: 2 tarjetas en el menú, #grammar-screen, #verbs-screen y 4 <script> nuevos
├── css/quiz.css               # CAMBIA: estilos de tarjetas (pantalla) y .print-cards (impresión)
├── js/
│   ├── verbs-data.js          # NUEVO: lista propia de ~200 verbos
│   ├── conjugation.js         # NUEVO: tiempos, conjugación (en/es), búsqueda, fuente pública (puro)
│   ├── grammar-cards.js       # NUEVO: 22 tarjetas y buildCardsPrintHtml (puro)
│   ├── reference.js           # NUEVO: interfaz de Grammar y Verbs
│   └── engine.js              # CAMBIA mínimo: abrir las pantallas nuevas desde el menú y volver
└── tests/
    ├── helpers/game-context.mjs   # CAMBIA: GAME_SCRIPTS incluye los 3 archivos puros nuevos
    ├── conjugation.test.mjs       # NUEVO
    ├── verb-search.test.mjs       # NUEVO
    └── grammar-cards.test.mjs     # NUEVO
```

Una herramienta de validación de PDFs de tarjetas, como la de GAMES-3, vive en `specs/004-gramatica-verbos/validate-print/`.

**Structure Decision**: misma página y mismos patrones de GAMES-1 y GAMES-3, con datos, lógica pura y pantalla en archivos separados. `reference.js` se carga después de `engine.js`, porque usa `tutor`, `backToMenu` y `#print-area`.

## Complexity Tracking

No aplica: sin violaciones.
