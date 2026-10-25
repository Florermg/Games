# Research: Elegir 1 o 2 columnas de tarjetas por hoja

**Feature**: `006-columnas-impresion` · **Jira**: GAMES-8

## R1. Dónde vive la opción

- **Decision**: `buildCardsPrintHtml(selection)` acepta `selection.columns`, que puede ser `1` o `2` (por defecto `2`):
  - Con `2`, devuelve **exactamente el mismo HTML que hoy** (SC-002).
  - Con `1`, agrega la clase `one-column` a `.print-cards`.
  - Cualquier otro valor lanza un error.
- **Rationale**:
  - La función pura ya decide cómo es la hoja y tiene pruebas en Node.
  - No tocar el HTML de 2 columnas garantiza que la hoja de hoy no cambia.
- **Alternatives considered**:
  - Una clase en `#print-area` puesta desde la pantalla: la prueba en Node no la vería.
  - Dos funciones distintas: duplica código.

## R2. CSS de impresión para 1 columna

- **Decision**: en `@media print`:
  - `.print-cards.one-column { grid-template-columns: 1fr; }`;
  - `.print-cards.one-column .print-card.wide { grid-column: auto; }`.

  El borde, `break-inside: avoid` y el tamaño de letra no cambian.
- **Rationale**: en una cuadrícula de 1 columna, `span 2` crearía una columna implícita y la tarjeta ancha se saldría del ancho. Por eso se reinicia. Las demás reglas ya evitan partir tarjetas.

## R3. Control en pantalla y estado

- **Decision**:
  - `reference.js` guarda `referenceColumns = { grammar: 2, verbs: 2 }`.
  - Al abrir cada pantalla, pinta junto a 🖨 Print selected un par de opciones ("2 columns" / "1 column") con el estilo `.chip` existente, que se puede tocar con el dedo.
  - `printGrammarCards` y `printVerbCards` pasan `columns` a `buildCardsPrintHtml`.
  - El estado vive en memoria: se conserva al volver al menú y regresa a 2 al recargar (FR-005). Las casillas llevan `autocomplete="off"` para que el navegador no restaure una elección vieja al recargar.
- **Rationale**: es el mismo patrón del selector de tiempos (`referenceTenses`). No hay almacenamiento, porque el usuario eligió "2 por defecto" y no "recordar".

## R4. Validación

- **Decision**:
  - Pruebas nuevas en `grammar-cards.test.mjs`:
    - `columns: 1` da la clase `one-column` y el mismo número de tarjetas;
    - sin `columns` y con `columns: 2` el resultado es idéntico;
    - un valor inválido lanza un error.
  - `specs/004-gramatica-verbos/validate-print/` acepta `&columns=1` y agrega 2 casos: 4 tarjetas de gramática y 6 verbos con 7 tiempos, en 1 columna. El verificador de páginas existente comprueba que ninguna se parta.
  - Pantalla: se revisa en el navegador (DOM).
- **Rationale**: se reutilizan las herramientas de GAMES-6.
