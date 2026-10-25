# Validation: Versión de los archivos en sus URLs

**Feature**: `003-cache-versionada` · **Jira**: GAMES-5

## Línea base (T001)

- **Rama**: `003-cache-versionada`, avanzada a `main` `a025408` (con GAMES-6), sin cambios de código.
- Huella del recorrido de GAMES-1 (Chrome, semilla 12345): **`f1 b9 82 7e 2c 76`** (4,817 caracteres).
- `npm test` → `207 · pass 205 · fail 0 · todo 2`.
- `QuizA.html` pide 12 archivos propios sin versión: `css/quiz.css` y 11 `js/*.js`.

## Base (T002–T003)

- `versions.test.mjs` (7 pruebas): antes de T003, no cargaba (`ERR_MODULE_NOT_FOUND`).
- Con `English/tools/versions.mjs`, pasan las 5 pruebas del módulo con HTML de ejemplo, y las 2 del gate real siguen en rojo hasta T005. El mensaje lista cada archivo con su problema (`css/quiz.css: missing-version`, …) y termina con "Run `npm run versions` and commit QuizA.html."

## US1 (T004–T006)

- `npm run versions` (`English/tools/stamp-versions.mjs`, script `versions` en `package.json`):
  - la primera vez versionó las 12 referencias y listó los 12 archivos;
  - la segunda dijo "All versions are up to date." (idempotente).
  - El diff de `QuizA.html` son 12 líneas, una por referencia, en el mismo orden.
- `npm test` → `214 · pass 212 · fail 0 · todo 2`, con las 7 de `versions.test.mjs`.
- **Doble clic** (`file://`, Chrome sin ventana, sobre el `QuizA.html` real): los 11 scripts cargan con su `?v=` (`togglePrintPanel`, `openReference`, `buildCardsPrintHtml` y los 215 verbos) y el CSS se aplica. **Safari con doble clic no se pudo automatizar**: queda para el usuario, con la prueba en dispositivos (GAMES-4) o al validar la publicación.
- **Caché**, en Chrome con el servidor local `127.0.0.1:8765` y navegación normal, sin recarga forzada:
  - **Segunda visita sin cambios**: los 12 archivos salen de la caché (`transferSize = 0`) (SC-004).
  - **Escenario del bug**: se cambió `js/reference.js` y se corrió `npm run versions`, que reportó solo `js/reference.js`. En la visita siguiente se descargó **solo** `reference.js?v=76277383` (13,422 bytes), su código nuevo se ejecutó (`window.__games5Probe = "new version"`) y los otros 11 siguieron saliendo de la caché (FR-001, FR-002, US1 escenarios 1 y 3).
  - **Al revertir** el cambio y volver a correr el comando, la versión regresó a `28d3ed28` (FR-002).
- Con las URLs versionadas, abren el panel 🖨 Print, Verbs (*went* → *go*) y Grammar (22 tarjetas), y la consola no muestra errores.
- **SC-005**: huella del recorrido de GAMES-1 **`f1 b9 82 7e 2c 76`** (4,817), sin cambios.

## US2: el gate atrapa el olvido (T008)

Línea base: `quiz.css?v=19a452a4` y `engine.js?v=efa6704a`.

1. Se agregó un comentario al final de `js/engine.js` y otro al final de `css/quiz.css`, **sin** correr el comando. `npm test` → **exit 1**, `pass 211 · fail 1`, con este mensaje:
   ```
   QuizA.html asks for files with a wrong version:
     css/quiz.css: outdated
     js/engine.js: outdated
   Run `npm run versions` and commit QuizA.html.
   ```
2. `npm run versions` → reportó `css/quiz.css` y `js/engine.js`; `npm test` → `pass 212 · fail 0`.
3. Se revirtieron los dos archivos y se corrió `npm run versions` → `quiz.css?v=19a452a4` y `engine.js?v=efa6704a`. `QuizA.html` quedó **idéntico byte a byte** al de antes del cambio (FR-002), y `npm test` → `pass 212 · fail 0`.

Los casos "sin versión" y "archivo inexistente" los cubren las pruebas del módulo con HTML de ejemplo (T002). El árbol de trabajo quedó sin los cambios de prueba.

## US3: procedimiento de publicación (T010)

- `README.md`, sección "Publicar una versión":
  - por qué existe la versión;
  - los pasos `npm run versions` y `npm test`;
  - qué subir (`QuizA.html`, `css/`, `js/`) y qué no (`tests/`, `tools/`, `documentacion/`);
  - cómo comprobarlo en el navegador (consola y pestaña Network);
  - qué pasa si se olvida.
- `npm run versions` también aparece en la tabla de comandos de "Pruebas".
- Recorrido del procedimiento, siguiendo el texto del README: es el mismo que se ejecutó en T006 (cambio → comando → recarga normal → solo baja el archivo cambiado) y en T008 (olvido → ❌ con el archivo nombrado).

## Verificación final (T012)

- `npm test` 10 veces → las 10 dan `214 · pass 212 · fail 0 · todo 2`.
- `npm run versions` → "All versions are up to date." (el `QuizA.html` final está al día).
- **SC-005**: huella del recorrido de GAMES-1 **`f1 b9 82 7e 2c 76`** (4,817), medida en T006 sobre el código final. Después solo cambiaron `README.md` y `specs/`, y `QuizA.html` quedó idéntico byte a byte tras la prueba de T008.
- `run.sh` de GAMES-3 y de GAMES-6 → "All checks passed". Los *harness* cargan los archivos sin versión; son de desarrollo y no se publican (research R5).
- **Pendiente para el usuario**: SC-001 en producción (quickstart §4) y el doble clic en Safari.
