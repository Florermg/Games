# Validation: títulos solos al pie de la hoja y franja transparente

**Feature**: `008-impresion-iphone` · **Jira**: GAMES-10

## Evidencia del usuario (antes)

En `evidence/`, del iPhone del usuario (iOS 26.6.1, Safari):
- `iphone-guia-gvs-antes.pdf`: títulos solos al pie de las hojas 2 y 3.
- `iphone-franja-antes.png`: la franja deja ver la guía debajo del botón "Hide pets".

## Línea base (T001)

- **Rama**: `008-impresion-iphone`, desde `main` `4984156`, sin cambios.
- `npm test` → `232 · pass 230 · fail 0 · todo 2`. La huella de GAMES-1 es `f1 b9 82 7e 2c 76`, medida en GAMES-9 sobre este código.
- Se guardó el texto visible de las 12 versiones impresas: 3 demos y 3 guías generadas de prueba, cada una con hoja y clave.

## US1 (T002–T005)

- **T002**: 2 pruebas nuevas en `print.test.mjs`, que fallaban antes de T003:
  - cada título de sección y de grupo está en un `.print-keep` con el primer bloque de su sección, en las 12 versiones;
  - `.print-keep` tiene `break-inside: avoid` y `page-break-inside: avoid`.
- **T003**:
  - los *renderers* de `print.js` devuelven bloques;
  - `printSection(section, isKey, groupLabel)` arma `.print-keep`;
  - CSS: `.print-keep`.
  - `npm run versions` → `css/quiz.css` y `js/print.js`. `npm test` → `234 · pass 232 · fail 0 · todo 2`.
  - **FR-004**: el texto visible de las 12 versiones es **idéntico** al de T001 (12/12).
- **T004**: `validate-print/`:
  - `make-pages.mjs` escribe las 12 versiones más un **barrido**: la demo GVS desplazada de 0 a 240 mm, en pasos de 12, para que cada título caiga alguna vez al pie de una hoja.
  - `check-keeps.mjs` verifica en el PDF que cada título esté en la misma página que el inicio de su primer bloque.
  - `run.sh` usa Chrome, o WebKit con `PRINTER=`. `webkit-print.swift` imprime con WebKit, el motor de Safari, en una Mac.
  - El verificador se ajustó 4 veces por falsos negativos, no por fallas de la impresión:
    - los títulos de grupo salen en mayúsculas por el CSS;
    - `pdftotext` cambia espacios y emoji;
    - en la tabla para relacionar, la otra columna se intercala en el texto;
    - la búsqueda empezaba después de palabras del propio bloque.
- **T005**, resultados con las **mismas expectativas** para el antes y el después (el texto impreso es idéntico):

| Motor | Antes (`main`) | Después |
|---|---|---|
| Chrome | 33/33 (Chrome sí respeta `break-after: avoid`, así que no reproduce el error) | 33/33 |
| **WebKit (Safari)** | **20/33**: 13 casos con un título solo al pie, entre ellos "VOCABULARY / 2. Match the…" y "SPELLING / Spelling Dictation", como en el PDF del usuario | **33/33** |

  - Revisión a ojo con el barrido de 156 mm, hoja 2:
    - **antes**, "VOCABULARY / 2. Match the words…" queda solo al pie (`evidence/webkit-antes-pagina2.png`);
    - **después**, baja a la hoja 3 con su tabla (`evidence/webkit-despues-pagina2.png`).
  - `run.sh` de GAMES-3 y de GAMES-6 → "All checks passed".

## US2 (T006–T008)

- **T006**: prueba nueva en `pets.test.mjs`: en pantalla angosta, `#pets` con fondo sólido (sin degradado ni transparencia), `.pets-toggle-text` oculto y `aria-label` en el botón. Antes de T007 falló.
- **T007**:
  - CSS: franja `background: #fce4ec` con una sombra suave arriba, y botón compacto;
  - `pets.js`: el texto en `<span class="pets-toggle-text">` y `aria-label` "Hide pets" / "Show pets";
  - `npm run versions` → `css/quiz.css` y `js/pets.js`;
  - `npm test` → `235 · pass 233 · fail 0 · todo 2`.
- **T008** (Chrome):
  - **Teléfono** (iframe de 390 px), demo GVS con el campo de la respuesta "a." justo debajo de la franja (campo en y = 644, franja desde y = 626):
    - el campo **no se ve a través de la franja**: fondo `rgb(252, 228, 236)` con sombra;
    - el botón muestra solo "🐾" (40 px de ancho), con `aria-label` "Hide pets";
    - al tocarlo, cambia a "Show pets" y las mascotas se ocultan.
  - **PC**: el botón sigue diciendo "🐾 Hide pets" y las mascotas miden 120 px, sin cambios.

## Verificación final (T009)

- `npm test` 10 veces → las 10 dan `235 · pass 233 · fail 0 · todo 2`. `npm run versions` → "All versions are up to date."
- `run.sh` de GAMES-3, de GAMES-6 y de esta historia (con Chrome y con WebKit) → "All checks passed".
- Huella del recorrido de GAMES-1 sobre el código final: **`f1 b9 82 7e 2c 76`** (4,817), sin cambios. Consola sin errores.
- **SC-004, pendiente del usuario**: volver a imprimir desde el iPhone una guía larga y confirmar que no quedan títulos solos al pie.
