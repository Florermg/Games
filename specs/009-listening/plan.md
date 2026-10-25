# Implementation Plan: Nueva opción Listening

**Branch**: `009-listening` (desde `main` `b882409`) | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-11 (Historia)

## Summary

Una tarjeta nueva **🎧 Listening** genera una guía `kind: "listening"` con tres secciones en etapas: (1) escuchar con subtítulos, (2) escuchar sin subtítulos y (3) un quiz `choice`.

- **Audio type** (aclaración 1c): "Story or dialogue" usa `LISTENING_STORIES`, 18 textos escritos a mano con preguntas propias (R5), y "Facts" usa Wikipedia.
- En Facts, el texto sale de Simple English Wikipedia con los filtros de la guía Reading. El número de oraciones y la velocidad de la voz dependen del grado.
- El quiz reutiliza `readingQuestions` con un "vocabulario" de audio (R2).
- La voz del navegador lee oración por oración en cola, y cada `onstart` cambia el subtítulo (R1).
- La impresión agrega un renderer `listen`: el texto solo va en la hoja de respuestas (R4).

## Technical Context

**Language/Version**: JavaScript clásico del juego (sin build); Node 24 para las pruebas.

**Primary Dependencies**: ninguna. Web Speech API (`speechSynthesis`), que ya usa el juego.

**Storage**: N/A.

**Testing**:
- `English/tests/listening.test.mjs` (nuevo) con un fixture grabado `listening-space-g5`.
- Las pruebas de impresión de GAMES-10 recorren el escenario nuevo automáticamente.
- Se revalidan la huella de GAMES-1 y las versiones.

**Target Platform**: PC, iPhone, iPad y Android; doble clic (`file://`).

**Project Type**: aplicación web estática.

**Performance Goals**: la actividad se genera en el mismo tiempo que una guía Reading (unos segundos).

**Constraints**:
- Las guías existentes no cambian (huella `f1 b9 82 7e 2c 76`).
- Nada se descarga.
- La voz solo arranca al tocar un botón (iOS).

**Scale/Scope**: 1 generador, 1 tipo de sección en pantalla y en impresión, 1 función de voz en cola, 1 tarjeta de menú con selector, 18 textos escritos a mano, CSS de subtítulos, 1 archivo de pruebas y 1 fixture.

## Constitution Check

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | La spec está aprobada, con 3 aclaraciones del usuario registradas. | ✅ |
| II. Simplicidad | Sin librerías ni archivos de audio; reutiliza el motor, las preguntas y la impresión. | ✅ |
| III. Jira (GAMES-11) | Comentario por fase. Modo continuo autorizado por el usuario. | ✅ |
| IV. Quality gate | Pruebas nuevas en `npm test` y `Tests`; `npm run versions`. | ✅ |
| V. Commits | Commit, push, PR y merge, cada uno con autorización. | ✅ |
| VI. Contenido y fuentes | Simple English Wikipedia (CC BY-SA) con la fuente citada; filtros de oraciones fáciles y `UNSAFE`. | ✅ |

**Re-check post-diseño**: sin violaciones.

## Project Structure

```text
specs/009-listening/    spec · plan · research · data-model · quickstart · checklists · tasks · validation
English/js/api.js        CAMBIA: GRADE_LEVELS (+listeningSentences, +speechRate), Speech.speakSequence y token de cancelación
English/js/generators.js CAMBIA: readingQuestions(…, wording), LISTENING_WORDING, generateListeningGuide
English/js/engine.js     CAMBIA: renderListenSection, etapas (showStage), audio en el quiz, resultados sin etapas
English/js/listening-stories.js NUEVO: 18 historias y diálogos con sus preguntas (R5)
English/tools/versions.mjs, tests/helpers/game-context.mjs, tests/versions.test.mjs  CAMBIAN: el script nuevo (14 referencias)
English/js/print.js      CAMBIA: PRINT_RENDERERS.listen
English/css/quiz.css     CAMBIA: .subtitles, .stage-actions
English/QuizA.html       CAMBIA: tarjeta 🎧 Listening y versiones
English/tests/listening.test.mjs, tests/fixtures/listening-space-g5.json, fixtures/record.mjs (+escenario), fixtures/README.md
README.md                CAMBIA: mención de la opción Listening
```

## Complexity Tracking

No aplica.
