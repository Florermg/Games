# Validation: Elegir 1 o 2 columnas de tarjetas por hoja

**Feature**: `006-columnas-impresion` · **Jira**: GAMES-8

## Línea base (T001)

- **Rama**: `006-columnas-impresion`, desde `main` `0f8ad98`, sin cambios de código.
- `npm test` → `217 · pass 215 · fail 0 · todo 2`.
- Huella del recorrido de GAMES-1: **`f1 b9 82 7e 2c 76`** (4,817). Se midió en GAMES-7 (T005) sobre este mismo código.
- Referencia de SC-002: se guardó el HTML impreso actual de dos casos, para compararlo en T008:
  - 4 tarjetas de gramática (*articles, presentSimple, canCant, quantifiers*) con los tiempos de 3°;
  - 2 verbos (*eat, go*) con los 7 tiempos de 5°, que dan tarjeta ancha.

## US1 (T002–T008)

- **T002**: 3 pruebas nuevas en `grammar-cards.test.mjs`. Antes de T003, fallaban 2 (`17 · pass 15 · fail 2`): la de 1 columna y la de valor inválido. La de "2 por defecto, igual que antes" ya pasaba, porque describe la hoja de hoy.
- **T003–T004**:
  - `buildCardsPrintHtml` acepta `columns` (1 o 2, 2 por defecto; otro valor lanza un error).
  - En el CSS de impresión, `.print-cards.one-column` tiene 1 columna y su tarjeta ancha no ocupa 2.
  - En pantalla, el control usa el estilo `.chip`.
  - Pasan las 17.
- **T005**: control "Print in: 2 columns / 1 column" junto a 🖨 Print selected en Grammar y Verbs (`referenceColumns`, radios con `autocomplete="off"`).
- **T006**: el *harness* acepta `&columns=`, y `run.sh` tiene 2 casos de 1 columna.
- **T007**: `npm run versions` → `css/quiz.css`, `js/grammar-cards.js` y `js/reference.js`. `npm test` → `220 · pass 218 · fail 0 · todo 2`.
- **T008**:
  - **SC-002**: el HTML impreso sin `columns` y con `columns: 2` es **idéntico** al de referencia de T001, en gramática y en verbos (tarjeta ancha incluida).
  - **PDFs** (`run.sh`) → "All checks passed" en los 6 casos:
    - 1 columna: 4 tarjetas de gramática en 1 hoja; 6 verbos con 7 tiempos en 3 hojas.
    - En la revisión a ojo, cada tarjeta ocupa todo el ancho y ninguna se parte (SC-001, SC-004).
    - Los 4 casos de 2 columnas no cambiaron (1, 5, 3 y 1 hojas).
  - **Navegador** (Chrome):
    - las dos pantallas abren con "2 columns" marcada;
    - Grammar con 4 tarjetas → `print-cards`; con "1 column" → `print-cards one-column`, con 4 tarjetas;
    - al volver al menú y entrar otra vez, sigue "1 column";
    - Verbs con 3 verbos, igual (`one-column`, 3 tarjetas); se abrió la impresión 4 veces;
    - **al recargar, las dos vuelven a "2 columns"** (FR-005);
    - consola sin errores.
  - **Teléfono** (iframe de 390 px): la barra se acomoda en varios renglones, sin scroll horizontal, y las opciones miden 32 px de alto.
  - **FR-008**: huella del recorrido de GAMES-1 **`f1 b9 82 7e 2c 76`** (4,817), sin cambios.
