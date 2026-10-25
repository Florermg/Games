# Data Model: Cuaderno (GAMES-13)

## NotebookPage

| Campo | Tipo | Regla |
|-------|------|-------|
| `id` | texto | único; `"p" + Date.now()` (+ sufijo si se repite) |
| `created` | texto ISO 8601 | fecha de la página; no cambia |
| `updated` | texto ISO 8601 | cambia al escribir |
| `title` | texto | opcional, hasta 80 caracteres |
| `text` | texto | hasta 5,000 caracteres |

## NotebookStore (localStorage `games-notebook-v1`)

```json
{ "version": 1, "online": true, "pages": [NotebookPage, ...] }
```

- Las páginas se muestran de la más nueva a la más vieja por `created`.
- Si el JSON no se puede leer, se empieza vacío (sin borrar la clave).

## Issue (error encontrado)

| Campo | Tipo | Regla |
|-------|------|-------|
| `start`, `end` | número | posiciones en el texto (UTF-16), `start < end` |
| `found` | texto | `text.slice(start, end)` |
| `rule` | texto | id de la regla del juego (`A_AN`, `PAST_TIME`…) o de LanguageTool |
| `kind` | `grammar` \| `spelling` \| `punctuation` | color de la marca |
| `message` | texto | explicación en inglés sencillo |
| `suggestions` | texto[] | de 1 a 3, sin palabras `UNSAFE` |
| `source` | `game` \| `online` | quién lo encontró |

- La lista va ordenada por `start` y sin encimarse: si dos errores se enciman, se queda el del juego (o el primero).
