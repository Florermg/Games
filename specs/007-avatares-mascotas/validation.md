# Validation: Avatares 3D de un gatito negro y un pastor alemán

**Feature**: `007-avatares-mascotas` · **Jira**: GAMES-9

## Línea base (T001)

- **Rama**: `007-avatares-mascotas`, desde `main` `05c2b3c`; `git diff main -- English` vacío.
- `npm test` → `220 · pass 218 · fail 0 · todo 2`.
- Huella del recorrido de GAMES-1: **`f1 b9 82 7e 2c 76`** (4,817). Se midió en GAMES-8 sobre este mismo código.

## Base (T002)

- `English/js/pets.js` (esqueleto), `<div id="pets" data-cat-image="" data-dog-image="">` fuera de `.main-wrapper` y su `<script>` después de `reference.js`. `pets.js` se agregó a `GAME_SCRIPTS`.
- Al versionarlo, la prueba de GAMES-5 que contaba **12** archivos falló, como debía: la página ahora pide 13. Se actualizó a 13 (1 CSS y 12 JS), con su comentario.

## US1 (T003–T008)

- **T003**: `pets.test.mjs` (4 pruebas). Antes de T004–T006 fallaban las 4:
  - SVG con degradados radiales de id prefijado y único, párpados y cola, sin cargar nada externo;
  - `#pets` fijo y fuera de la hoja;
  - no se imprime;
  - reducir movimiento y `pets-hidden`.
- **T004–T006**: dibujos, montaje, botón "🐾 Hide / Show pets" y CSS. Pasan las 4.
  - **Revisión del aspecto**, con capturas ampliadas:
    - El gatito negro quedó bien a la primera: pelaje negro azulado con volumen, ojos verde-amarillo con brillo, orejas rosas, bigotes y sombra.
    - El pastor alemán se corrigió dos veces. La máscara se veía como una banda en la frente: se cambió por un capuchón oscuro recortado a la cabeza, con las marcas cafés sobre los ojos. El lomo se veía como una franja delgada: se cambió por un manto oscuro sobre el lomo, recortado al cuerpo.
- **T007**: `npm run versions` → `css/quiz.css` y `js/pets.js`. `npm test` → `224 · pass 222 · fail 0 · todo 2`.
- **T008**, en Chrome con `127.0.0.1:8765`:
  - **PC** (ventana de 1920 × 958): gatito en x 377–497 y perro en x 1409–1529, de 120 px. La hoja va de 503 a 1403, así que las dos mascotas quedan **fuera de la hoja**. Nombres accesibles: "Black kitten" y "German shepherd puppy".
  - **Siempre visibles** (FR-004, SC-001): en la demo GVS (página de 4,220 px), la posición en la ventana fue **idéntica** arriba, a la mitad y al final (`cat 377,826` · `dog 1409,826`).
  - **Hide / Show**: "🐾 Hide pets" las oculta y el botón cambia a "🐾 Show pets"; al tocarlo otra vez, vuelven. Con las mascotas ocultas, la recarga las mostró de nuevo y el botón volvió a "🐾 Hide pets" (FR-006a).
  - **Teléfono** (iframe de 390 px):
    - franja inferior desde y = 706 y mascotas de 56 px;
    - **ningún botón, campo o selector bajo las mascotas ni bajo el botón**, arriba, a la mitad y al final de la demo GVS;
    - el último botón ("Finish & see my results") queda arriba de la franja al final de la página;
    - sin scroll horizontal (373 de 388).
  - **Reducir movimiento**: lo cubre la prueba de CSS (`@media (prefers-reduced-motion: reduce)` → `animation: none`). La emulación en un dispositivo real queda para GAMES-4.
  - Consola sin errores. **FR-010**: huella del recorrido de GAMES-1 **`f1 b9 82 7e 2c 76`** (4,817), sin cambios.

## US2: tocar a las mascotas (T010–T012)

- **T010**: 3 pruebas nuevas en `pets.test.mjs`. Las de frases (nombres, al menos 4 por mascota, sin repetir, aptas según `UNSAFE`) y la de `nextPetPhrase` **pasaron desde el inicio**, porque `PETS` y `nextPetPhrase` se escribieron en T004. La del saltito sin sonido (`.pet.jump`, `@keyframes pet-jump`, sin `speechSynthesis` ni `Audio`) falló, como debía.
- **T011**: `petTouched` reinicia la clase `.jump` (que se quita en `animationend`) y llama `tutor(emoji, nextPetPhrase(kind))`; además, CSS de `pet-jump`. `npm test` → `227 · pass 225 · fail 0 · todo 2`.
- **T012** (Chrome):
  - 5 toques al gatito → sus 5 frases en orden (avatar 🐱); 5 al perro → las suyas (🐶). La clase `jump` queda puesta al tocar.
  - **Reacción en 3.9 ms como máximo** (SC-003).
  - Con la demo GVS a medias (3 respuestas y una revisión), `sectionStates`, los valores de los campos y la pantalla quedaron **idénticos** después de los 10 toques (FR-005).
  - **Teclado** (teclas reales): con el foco en "Black kitten", Enter activó la reacción; Tab pasó a "German shepherd puppy" y Espacio dio "Woof! Great job!" (FR-006).
  - Consola sin errores.

## US3: imágenes propias (T014–T017)

- **T014**: 5 pruebas nuevas: 4 en `versions.test.mjs` y 1 en `pets.test.mjs` (`petImageHtml` escapa la ruta). Antes de T015 no cargaban (`does not provide an export named 'PET_IMAGES'`).
  - Las imágenes se versionan **por sus bytes**, no como texto: un byte distinto cambia la versión.
  - Se detecta una imagen agregada, cambiada o borrada sin `npm run versions` (`pet-image-outdated`).
  - Si falta, la imagen no es error: el atributo queda en `""`.
- **T015**:
  - `versions.mjs`: `PET_IMAGES`, `readGameFile` (imágenes como bytes, código como texto) y los atributos `data-cat-image` y `data-dog-image` en `stampVersions` y `checkVersions`.
  - `stamp-versions.mjs` usa `readGameFile`.
  - Pasan las 11 de versiones.
- **T016**: `petImageHtml` y el montaje con imagen propia (y la ilustración si falla); CSS de `.pet-image` (respira y respeta reducir movimiento); README: "Imágenes propias de las mascotas" y `English/img/` en la lista de archivos a subir. `npm test` → `232 · pass 230 · fail 0 · todo 2`.
- **T017**, con un PNG de prueba de 240 × 240 (un círculo naranja) generado en el *scratchpad*:
  - copiado a `English/img/pet-cat.png` **sin** el comando → `npm test` falla con `img/pet-cat.png: pet-image-outdated`;
  - `npm run versions` → `data-cat-image="img/pet-cat.png?v=86825d10"`; en Chrome, el gatito mostró la imagen (cargada, 240 px) y el perro siguió con su ilustración;
  - con una imagen **dañada** (texto con extensión `.png`) + el comando → el gatito volvió a la ilustración;
  - imagen borrada + el comando → `data-cat-image=""`, el gatito con ilustración, **0 peticiones a `img/`** y la consola sin errores.
  - Se borraron `English/img/` y la imagen de prueba: no se suben al repositorio.

## Verificación final (T018)

- `npm test` 10 veces → las 10 dan `232 · pass 230 · fail 0 · todo 2`. `npm run versions` → "All versions are up to date."
- `run.sh` de GAMES-3 y de GAMES-6 → "All checks passed". Esos *harness* imprimen sin la página del juego, así que además se imprimió **la página real**:
  - `QuizA.html`, con las 2 mascotas y el botón montados (`data-r="2,true"`) y la demo GVS en `#print-area`, sacado a PDF con Chrome sin ventana;
  - resultado: 3 hojas carta, 0 textos "Hide pets / Show pets", y en la revisión a ojo de la primera hoja, la guía limpia, sin mascotas (FR-007, SC-002).
  - La página de prueba se borró.
- **SC-004**: huella del recorrido de GAMES-1 sobre el código final **`f1 b9 82 7e 2c 76`** (4,817), sin cambios. Consola sin errores.
- **Pendiente para el usuario**: probarlo en dispositivos reales (reducir movimiento, toques en iPhone/iPad) con GAMES-4, y en producción al publicar.
