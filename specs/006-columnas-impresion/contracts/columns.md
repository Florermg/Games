# Contract: columnas de la hoja de tarjetas

| Elemento | Contrato |
|---|---|
| `buildCardsPrintHtml({ kind, items, tenses, columns })` | `columns` ∈ `{1, 2}`, `2` si falta. Con `2`, el HTML es idéntico al de GAMES-7. Con `1`, `.print-cards` lleva además la clase `one-column`. Otro valor lanza un error. El resto del contrato de GAMES-6 no cambia. |
| CSS `@media print` | `.print-cards.one-column` tiene 1 columna y su `.print-card.wide` no ocupa 2. |
| Pantallas Grammar y Verbs | Junto a 🖨 Print selected hay dos opciones, "2 columns" (marcada al abrir el juego) y "1 column". La elección se conserva mientras la página siga abierta; al recargar, vuelve a 2. Al imprimir se usa la opción marcada. |
