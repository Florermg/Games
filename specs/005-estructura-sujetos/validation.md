# Validation: Sujetos en la estructura de las tarjetas de tiempos verbales

**Feature**: `005-estructura-sujetos` · **Jira**: GAMES-7

## Línea base (T001)

- **Rama**: `005-estructura-sujetos`, desde `main` `d9bf891`. `git diff main -- English` está vacío.
- `npm test` → `214 · pass 212 · fail 0 · todo 2`.
- Huella del recorrido de GAMES-1: **`f1 b9 82 7e 2c 76`** (4,817). Se midió en GAMES-5 (T006) sobre este mismo código, porque `English/` es idéntico a `main`.
- Estado del defecto: de las 30 líneas de estructura, solo las 3 de *Present simple* traen sujetos, y solo su afirmativa trae los 7.

## US1 (T002–T005)

- **T002**: 2 pruebas nuevas en `grammar-cards.test.mjs`. Antes de T003 fallaban las 2 (`13 · pass 11 · fail 2`):
  - las 30 líneas deben mencionar los 7 sujetos y una forma de *play*;
  - una tabla de 30 líneas revisadas a mano para la concordancia (*I am, he is, they are; I was, they were; I have, she has; I don't, he doesn't*).
- **T003**: `structure` de las 10 tarjetas reescrito con el texto de esa tabla. Se pasó de la tabla al archivo con un *script* para no copiar a mano, así que la prueba exacta protege el contenido revisado contra cambios futuros. Pasan las 13.
- **T004**: `npm run versions` → solo `js/grammar-cards.js`. `npm test` → `216 · pass 214 · fail 0 · todo 2`.
- **T005**, hallazgo al revisar el PDF a ojo: en la tarjeta de 2 columnas, las líneas largas se partían a la mitad de un grupo ("he / she / it has" / "played").
  - Se agregó un renglón por grupo de sujetos en `grammarCardHtml` (research R5), con su prueba (`… have played<br>he / she / it has played`), y se volvió a correr `npm run versions`.
  - `npm test` → `217 · pass 215 · fail 0 · todo 2`.
  - `validate-print/run.sh` → "All checks passed": las 22 tarjetas siguen en 5 hojas, 4 tarjetas en 1 hoja y ninguna partida. En la revisión a ojo, cada sujeto queda junto a su forma.
  - Navegador (Grammar con "All tenses"): las 10 tarjetas muestran sus tres líneas por grupos; `grammar-cards.js` con su `?v=` nuevo; consola sin errores.
  - **SC-004**: huella del recorrido de GAMES-1 **`f1 b9 82 7e 2c 76`** (4,817), sin cambios.
