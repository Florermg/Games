# Research: Avatares 3D de un gatito negro y un pastor alemán

**Feature**: `007-avatares-mascotas` · **Jira**: GAMES-9

## R1. Cómo lograr el aspecto 3D sin archivos ni librerías (FR-001, FR-002)

- **Decision**: cada mascota es un **SVG en línea** que arma `English/js/pets.js`. El volumen se logra con cuatro recursos:
  - **Degradados radiales** en cabeza, cuerpo, orejas y patas, con luz arriba a la izquierda y sombra abajo a la derecha.
  - **Brillos**: elipses blancas semitransparentes en la frente y en los ojos.
  - **Sombra de contacto**: una elipse difusa bajo los pies.
  - **Contorno** suave del mismo tono, más oscuro.

  Los dos diseños:
  - **Gatito negro**: pelaje negro azulado y ojos verde-amarillo.
  - **Pastor alemán cachorro**: orejas paradas, manto negro sobre café-dorado y hocico oscuro.

  Los `id` de los degradados llevan el prefijo de la mascota (`pet-cat-…`, `pet-dog-…`), para no chocar entre sí.
- **Rationale**:
  - El SVG en línea no descarga nada, funciona con `file://` y escala sin perder nitidez en pantallas Retina.
  - Los degradados dan el aspecto de "figura 3D" que pidió el usuario sin modelos ni WebGL (Principio II).
- **Alternatives considered**:
  - three.js o un modelo glTF: dependencia externa y modelos que no existen (descartado por el usuario).
  - Emoji (🐈‍⬛, 🐕‍🦺): no hay pastor alemán y no se ven en 3D.
  - Imágenes PNG del repositorio: no hay imágenes con licencia. Quedan como opción del usuario (R4).

## R2. Ubicación sin tapar contenido (FR-004, SC-001)

- **Decision**: un contenedor `#pets` fuera de `.main-wrapper` (hijo de `body`), con dos botones `.pet` en `position: fixed`.
  - **Pantalla ancha** (`min-width: 1160px`, es decir, la hoja de 900 px más 2 × 130 px): mascotas de 120 px abajo, una en cada orilla y fuera de la hoja. Cubre PC e iPad horizontal (1180 px o más).
  - **Pantalla angosta**: una **franja inferior fija** de 72 px, con el mismo degradado de fondo que la barra de la tutora. Lleva a las mascotas de 56 px en las esquinas. El `body` recibe un `padding-bottom` igual a la franja, así que todo el contenido se puede ver encima de ella al final de la página, igual que la barra de la tutora arriba.
- **Rationale**:
  - En pantalla ancha, las orillas están vacías. En angosta, la franja es parte del marco de la pantalla, como la barra de arriba.
  - Es la forma de cumplir "esquinas de abajo" sin dejar botones o texto debajo de las mascotas.
- **Alternatives considered**:
  - Mascotas flotantes sin franja: tapan texto al hacer scroll.
  - Ponerlas en la barra de la tutora: el usuario pidió abajo.

## R3. Animación e interacción (FR-003, FR-005, FR-006)

- **Decision**:
  - **Animación en reposo**, en CSS: respiración leve (`scale` del cuerpo), parpadeo (`scaleY` de los párpados cada ~4 s) y cola (`rotate` desde su base, con `transform-box: fill-box`).
  - **Saltito**: la clase `.jump` se agrega al tocar y se quita en `animationend`.
  - `@media (prefers-reduced-motion: reduce)` desactiva todas las animaciones.
  - Cada mascota es un `<button>` con `aria-label` ("Black kitten", "German shepherd puppy"), así que funciona con Tab, Enter y Espacio.
  - Al tocarla, `tutor(emoji, frase)` con la siguiente frase de su lista. Son 5 por mascota y rotan en orden (determinista, fácil de probar).
  - No toca `#game-container` ni el estado de las guías.
- **Rationale**:
  - `tutor()` ya es como hablan los botones del juego (por ejemplo 🖨 o ➕).
  - Un `<button>` real da accesibilidad sin código extra.

## R4. Imágenes propias y caché (FR-008, FR-009, SC-005)

- **Decision**:
  - **Ubicación fija**: `English/img/pet-cat.png` y `English/img/pet-dog.png`.
  - **En la página**: `QuizA.html` lleva `<div id="pets" data-cat-image="" data-dog-image="">`.
  - **`npm run versions`** (GAMES-5) también revisa esas dos rutas:
    - si el archivo existe, escribe `data-cat-image="img/pet-cat.png?v=<hash>"`;
    - si no existe, deja `""`.
  - **`pets.js`**: si el atributo tiene valor, muestra la imagen (`<img>`), y si falla al cargar, vuelve a la ilustración. Si está vacío, no pide nada, así que no hay 404 ni errores en consola.
  - **`versions.test.mjs`** falla si el atributo no corresponde al archivo: falta, sobra o tiene otra versión.
- **Rationale**:
  - El usuario solo copia la imagen y corre el mismo comando de siempre, sin editar código.
  - La versión en la URL hace que la imagen nueva llegue a todos (GAMES-5).
- **Alternatives considered**:
  - Pedir siempre `img/pet-cat.png` y usar `onerror`: genera un 404 y un error en consola en cada carga cuando no hay imagen.
  - Editar una lista en `pets.js` a mano: es "tocar código".

## R5. Impresión y huella (FR-007, FR-010)

- **Decision**:
  - `@media print { #pets { display: none !important } }`. La regla de impresión actual solo oculta a los hijos de `.main-wrapper`, y `#pets` está fuera.
  - Al imprimir, el `padding-bottom` del `body` vuelve a 0.
  - Las mascotas no tocan la tutora ni la hoja salvo al ser tocadas, así que el recorrido de GAMES-1 (que no las toca) da la misma huella.
- **Rationale**: las validaciones de PDF de GAMES-3 y GAMES-6 confirman que no aparecen ("nothing from the screen" agrega `Black kitten`).

## R6. Pruebas

- **Decision**:
  - `English/tests/pets.test.mjs` cubre:
    - que `PETS` tiene `cat` y `dog`, cada uno con nombre accesible y al menos 4 frases aptas (pasan el filtro de contenido);
    - que `petSvg(kind)` devuelve un SVG con degradados de id único, párpados y cola;
    - que `petImageHtml` escapa la ruta;
    - que la CSS oculta `#pets` al imprimir y tiene la regla `prefers-reduced-motion`.
  - Las funciones nuevas de imágenes se prueban en `versions.test.mjs`.
  - `pets.js` entra a `GAME_SCRIPTS`; su parte DOM solo corre si existe `document`.

## R7. Ajustes de la sesión de clarificación (2026-10-24)

- **Sin sonido** (FR-005): la reacción no reproduce audio ni voz; solo el saltito y `tutor()`.
- **Botón "🐾 Hide pets / Show pets"** (FR-006a):
  - Un `<button id="pets-toggle">` fijo junto a las mascotas, en la esquina inferior derecha, encima de la mascota de la orilla derecha; en celular, al centro de la franja.
  - Pone y quita la clase `pets-hidden` en `<body>`, que oculta `#pets` y, en celular, la franja y el `padding-bottom` del `body`. El botón sigue visible.
  - Al cargar la página, la clase nunca está puesta: no se guarda nada.
  - El botón no se imprime.
- **Siempre visibles** (FR-004): confirmado `position: fixed` en la ventana. La validación mide la posición de las mascotas al inicio, a la mitad y al final de una guía larga, y debe ser la misma.
- **Tamaño**: 120 px desde 1160 px de ancho (R2, sin cambio).
