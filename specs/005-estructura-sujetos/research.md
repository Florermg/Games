# Research: Sujetos en la estructura de las tarjetas de tiempos verbales

**Feature**: `005-estructura-sujetos` · **Jira**: GAMES-7

## R1. Dónde cambia el contenido

- **Decision**: solo el campo `structure` (`affirmative`, `negative`, `question`) de las 10 tarjetas `group: "tenses"` en `English/js/grammar-cards.js`. `grammarCardHtml` ya pinta esas tres líneas en pantalla y en la impresión, así que no cambia.
- **Rationale**: el defecto es de contenido. El mismo HTML sirve para la pantalla y para el papel (GAMES-6, T017–T019).

## R2. Formato de cada línea (decisión del usuario)

- **Decision**: grupos de sujetos separados por " · ", cada uno con su forma de *play*:
  - Si el auxiliar cambia con el sujeto, un grupo por forma: "I am playing · you / we / they are playing · he / she / it is playing".
  - Si es igual para todos, un solo grupo con los 7 sujetos: "I / you / he / she / it / we / they will play".
  - Las negativas, con contracciones (*'m not, aren't, isn't*…).
  - *Past simple* agrega "(irregular: went, ate)" en la afirmativa.
- **Rationale**: es el formato que el usuario aprobó. Una línea por sujeto quedó descartada por el alto de la tarjeta impresa.

## R3. Prueba (FR-004)

- **Decision**: en `English/tests/grammar-cards.test.mjs`, una prueba recorre las 10 tarjetas × 3 líneas y exige:
  - que mencionen los 7 sujetos, como palabras completas: *I, you, he, she, it, we, they*;
  - que incluyan *play*, *plays*, *playing* o *played*.

  Además, una tabla de 30 líneas esperadas, revisada a mano, compara el texto exacto para cubrir la concordancia (FR-003, SC-002).
- **Rationale**: la búsqueda de sujetos atrapa el defecto reportado. La tabla exacta atrapa errores de concordancia (*he have*) que una búsqueda de palabras no ve.

## R4. Impresión y versión

- **Decision**: volver a correr `specs/004-gramatica-verbos/validate-print/run.sh` (SC-003) y `npm run versions` (FR-007, GAMES-5).
- **Rationale**: las líneas más largas hacen más altas las tarjetas; el verificador de GAMES-6 ya comprueba que ninguna se parta.

## R5. Un renglón por grupo de sujetos (hallado en T005)

- **Decision**: al mostrar la estructura, cada grupo separado por " · " va en su propio renglón (`<br>`), en pantalla y en la impresión. Los datos y la tabla de la prueba no cambian.
- **Rationale**: en la revisión del PDF (T005), las líneas largas se partían a la mitad de un grupo ("he / she / it has" / "played"), difícil de leer en primaria. Con un renglón por grupo, cada sujeto queda junto a su forma.
- **Alternatives considered**: tarjetas de tiempos a todo el ancho (span 2): duplica las hojas impresas.
