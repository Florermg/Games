---

description: "Task list for 007-avatares-mascotas"
---

# Tasks: Avatares 3D de un gatito negro y un pastor alemán en las orillas de la pantalla

**Input**: `specs/007-avatares-mascotas/` (spec con Clarifications, plan, research R1–R7, contracts/pets.md, quickstart)

**Jira**: GAMES-9 · **Modo**: `in-all-process` · **Rama**: `007-avatares-mascotas` (desde `main` `05c2b3c`)

**Tests**: FR-010 exige pruebas; se escriben **antes** del código de cada historia.

**Principio III**: un comentario de checkpoint en GAMES-9 por historia. **Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Línea base: `npm test` (`220 · pass 218 · fail 0 · todo 2`) y la huella del recorrido de GAMES-1 (`f1 b9 82 7e 2c 76`), registradas en `specs/007-avatares-mascotas/validation.md`

---

## Phase 2: Foundational

- [X] T002 Crear `English/js/pets.js`:
  - `PETS` (nombres accesibles, emoji y 5 frases por mascota, escritas a mano y aptas para niños);
  - `petSvg(kind)`, vacío para la US1;
  - `nextPetPhrase(kind)`;
  - `mountPets()`, que solo corre si existe `document`.

  Agregarlo a `GAME_SCRIPTS` (`English/tests/helpers/game-context.mjs`). En `English/QuizA.html`, agregar `<div id="pets" data-cat-image="" data-dog-image=""></div>` como hijo de `body`, fuera de `.main-wrapper`, y el `<script>` de `pets.js` después de `reference.js`

**Checkpoint**: la página carga igual que antes, con `#pets` vacío.

---

## Phase 3: User Story 1 - Ver al gatito y al perrito siempre en pantalla (Priority: P1) 🎯 MVP

**Goal**: las dos mascotas con aspecto 3D, animadas, fijas en la ventana y sin tapar contenido, más el botón "🐾 Hide / Show pets" (FR-001 a FR-004, FR-006a, FR-007).

**Independent Test**: quickstart §2, §3, §5, §6 y §8.

- [X] T003 [P] [US1] Escribir `English/tests/pets.test.mjs` (debe fallar antes de T004–T006):
  - `petSvg('cat')` y `petSvg('dog')`: SVG con `radialGradient` de id prefijado y único por mascota, `.pet-eyelids` y `.pet-tail`. Con otro `kind`, lanza un error.
  - CSS: `#pets` con `position: fixed`; `@media print` oculta `#pets` y `#pets-toggle`; existe `prefers-reduced-motion: reduce`; `body.pets-hidden #pets` está oculto.
- [X] T004 [US1] Dibujar en `petSvg` (`English/js/pets.js`) el gatito negro y el cachorro pastor alemán con aspecto 3D, según research R1: degradados radiales, brillos, sombra de contacto, párpados y cola animables
- [X] T005 [US1] `mountPets()`: dos `<button class="pet pet-cat|pet-dog" aria-label="…">` con su SVG dentro de `#pets`, y el botón fijo `#pets-toggle` ("🐾 Hide pets" / "🐾 Show pets") con `togglePets()`, que pone o quita `pets-hidden` en `<body>` sin guardar nada (R7)
- [X] T006 [US1] CSS en `English/css/quiz.css`:
  - posición fija de 120 px en las esquinas de abajo desde 1160 px;
  - franja inferior fija de 72 px con mascotas de 56 px y `padding-bottom` del `body` en pantallas angostas;
  - `#pets-toggle`;
  - animaciones (respiración, parpadeo y cola) y `prefers-reduced-motion`;
  - `.pets-hidden`;
  - `@media print` (R2, R3, R5, R7).
- [X] T007 [US1] `npm run versions` y `npm test` en verde
- [X] T008 [US1] Validar y registrar en `validation.md`:
  - PC: a los lados, fuera de la hoja;
  - celular (iframe de 390 px): en la franja, sin superponerse a botones ni campos, con el último botón alcanzable;
  - la misma posición en la ventana arriba, a la mitad y al final de una guía larga (SC-001);
  - "Hide / Show pets" y la recarga;
  - reducir movimiento (emulado);
  - la consola sin errores;
  - la huella de GAMES-1;
  - capturas de pantalla para revisar el aspecto 3D.
- [X] T009 [US1] Jira: comentario de checkpoint en GAMES-9 (US1)

---

## Phase 4: User Story 2 - Tocar a las mascotas (Priority: P2)

**Goal**: saltito y frase silenciosa de la tutora, con teclado y sin cambiar la guía (FR-005, FR-006).

- [X] T010 [P] [US2] Agregar a `pets.test.mjs` (debe fallar antes de T011):
  - `PETS` tiene `cat` y `dog`, cada uno con `name` y al menos 4 frases que pasan el filtro de contenido del juego;
  - `nextPetPhrase` recorre las frases en orden y vuelve a la primera.
- [X] T011 [US2] En `mountPets()`, el clic o Enter da el saltito (clase `.jump`, que se quita en `animationend`) y llama `tutor(PETS[kind].emoji, nextPetPhrase(kind))`, sin sonido. Agregar el CSS de `.jump`
- [X] T012 [US2] Validar y registrar: tocar 5 veces cada mascota recorre sus 5 frases; Tab y Enter funcionan; con una guía a medias, `sectionStates` y las respuestas no cambian; la reacción tarda menos de 0.5 s (SC-003)
- [X] T013 [US2] Jira: comentario de checkpoint en GAMES-9 (US2)

---

## Phase 5: User Story 3 - Usar imágenes 3D propias (Priority: P3)

**Goal**: `English/img/pet-cat.png` y `pet-dog.png`, opcionales, con versión (FR-008, FR-009).

- [X] T014 [P] [US3] Pruebas (deben fallar antes de T015–T016):
  - En `versions.test.mjs`:
    - `stampVersions` pone `data-cat-image="img/pet-cat.png?v=<hash>"` si el archivo existe y `""` si no;
    - `checkVersions` reporta `pet-image-outdated`;
    - el `QuizA.html` real está al día.
  - En `pets.test.mjs`: `petImageHtml` escapa la ruta.
- [X] T015 [US3] Ampliar `English/tools/versions.mjs` (`PET_IMAGES`, `stampVersions`, `checkVersions`) según contracts/pets.md
- [X] T016 [US3] En `mountPets()`, si `data-<kind>-image` tiene valor, usar `petImageHtml` y, si falla, volver a `petSvg`. Documentar en `README.md` (sección "Publicar una versión") cómo poner las imágenes propias
- [X] T017 [US3] Validar con una imagen de prueba generada en el *scratchpad* (no se sube al repositorio):
  - con la imagen + `npm run versions` → se ve la imagen;
  - con una imagen dañada → vuelve la ilustración;
  - sin imagen + `npm run versions` → vuelve la ilustración, sin 404 en la consola.

  Registrar en `validation.md`, y luego Jira: comentario de checkpoint (US3).

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T018 Verificación final:
  - `npm test` 10 veces;
  - huella de GAMES-1;
  - `run.sh` de GAMES-3 y de GAMES-6 en "All checks passed", sin mascotas ni botón en los PDFs (SC-002, SC-004);
  - `npm run versions` al día.

  Registrar en `validation.md`.
- [ ] T019 **Pedir autorización** para el commit en `007-avatares-mascotas`; **con autorización aparte**, push; **con autorización aparte**, PR hacia `main`; confirmar el check `Tests` en ✅
- [ ] T020 Cierre: **pedir autorización** para integrar el PR; confirmar ✅ en `main`; comentar "**Implementado**" en GAMES-9 y pasarla a "Listo"

---

## Dependencies & Execution Order

- **Setup → Foundational**: T001 → T002.
- **US1**: T003 → T004 → T005 → T006 → T007 → T008 → T009.
- **US2**: depende de T005. T010 → T011 → T012 → T013.
- **US3**: depende de T005. T014 → T015 → T016 → T017.
- **Polish**: T018 → T019 → T020.

### Parallel Opportunities

T010 y T014 (pruebas) ∥ T004–T006, porque son otros archivos; la US3 puede ir en paralelo con la US2.

## Implementation Strategy

1. **MVP**: Phases 1–3 (mascotas visibles y botón para ocultarlas).
2. **US2**: tocar a las mascotas.
3. **US3**: imágenes propias.
4. **Polish**: verificación, commit, PR y cierre.
