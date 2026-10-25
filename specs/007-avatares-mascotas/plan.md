# Implementation Plan: Avatares 3D de un gatito negro y un pastor alemán en las orillas de la pantalla

**Branch**: `007-avatares-mascotas` (desde `main` `05c2b3c`) | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-9

## Summary

- `English/js/pets.js` dibuja en SVG en línea un gatito negro y un cachorro pastor alemán con aspecto 3D (degradados, brillos y sombra) y los coloca fijos abajo: en las orillas en pantallas anchas, y en una franja inferior en las angostas.
- Animación en CSS, con soporte para reducir movimiento. Un botón "🐾 Hide / Show pets" las oculta hasta recargar. Son botones accesibles: al tocarlos saltan y la tutora dice una de 5 frases.
- `npm run versions` detecta imágenes propias opcionales (`English/img/pet-cat.png`, `pet-dog.png`) y las versiona.
- No se imprimen (research R1–R6).

## Technical Context

**Language/Version**: JavaScript (ES2020, scripts clásicos), SVG en línea y CSS; Node 24 para pruebas y herramientas.

**Primary Dependencies**: ninguna.

**Storage**: N/A. Las imágenes propias son opcionales y van en `English/img/`.

**Testing**:
- `pets.test.mjs` (nuevo) y `versions.test.mjs` (ampliado);
- PDFs de GAMES-3 y GAMES-6;
- navegador en PC, en 390 px y con reducir movimiento;
- huella de GAMES-1.

**Target Platform**: PC, iPhone, iPad y Android; `file://` y servidor.

**Project Type**: aplicación web estática.

**Performance Goals**: reacción al toque en menos de 0.5 s (SC-003). La animación es solo de CSS (`transform`).

**Constraints**:
- Sin archivos ni librerías nuevas (Principio II).
- No tapar contenido.
- No imprimir.
- Las guías iguales.
- `npm run versions`.

**Scale/Scope**:
- 1 archivo JS nuevo (unas 250 líneas, sobre todo SVG);
- CSS (unas 120 líneas);
- 1 contenedor en `QuizA.html`;
- la ampliación de `versions.mjs` y sus pruebas;
- 1 archivo de prueba;
- una nota en el README.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | La spec está aprobada; las decisiones del usuario (estilo, celular, interacción e imágenes propias) están registradas. | ✅ |
| II. Simplicidad | SVG y CSS en línea, sin librerías ni archivos. El 3D es de aspecto, no WebGL (R1). Las imágenes propias usan el comando que ya existe (R4). | ✅ |
| III. Jira (GAMES-9) | Historia creada, con comentario por fase. Modo `in-all-process`. | ✅ |
| IV. Quality gate | Pruebas nuevas en `npm test` y `Tests`, y el gate de versiones cubre las imágenes. | ✅ |
| V. Commits | Cada commit, push, PR y merge con autorización. | ✅ |
| VI. Contenido | 10 frases escritas a mano, aptas para niños y probadas con el filtro de contenido. Ningún dato sale del navegador. | ✅ |

**Re-check post-diseño**: sin violaciones. Tras `/speckit-clarify` (2026-10-24) se agregaron: reacción sin sonido, el botón "🐾 Hide / Show pets" sin persistencia y la confirmación de "siempre visibles" (research R7).

## Project Structure

```text
specs/007-avatares-mascotas/    spec · plan · research · contracts/pets.md · quickstart · checklists · tasks · validation
English/js/pets.js              NUEVO: PETS, petSvg, petImageHtml, nextPetPhrase, mountPets
English/QuizA.html              CAMBIA: <div id="pets" data-cat-image="" data-dog-image="">, <script> de pets.js y versiones
English/css/quiz.css            CAMBIA: posición, franja, animaciones, reducir movimiento e impresión
English/tools/versions.mjs      CAMBIA: imágenes propias opcionales (R4)
English/tests/pets.test.mjs     NUEVO
English/tests/versions.test.mjs CAMBIA: imágenes propias
English/tests/helpers/game-context.mjs  CAMBIA: GAME_SCRIPTS incluye pets.js
README.md                       CAMBIA: cómo poner imágenes propias de las mascotas
```

`pets.js` se carga al final, después de `engine.js`, porque usa `tutor()`.

## Complexity Tracking

No aplica.
