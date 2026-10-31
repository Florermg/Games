# Data Model: Guía 5.º Campos formativos (GAMES-17)

## CAMPOS

`{ id: "lenguajes" | "saberes" | "etica" | "humano", name, emoji }`

## TEMAS (21)

| Campo | Ejemplo |
|---|---|
| `id`, `campo`, `title` | `"prefijos"`, `"lenguajes"`, `"Prefijos y sufijos"` |
| `card` | `{ points: [html…], remember? }` |
| `choice` | `[{ text, options, answer, tip, explanation }]` (la primera opción no tiene que ser la correcta; el generador mezcla) |
| `truefalse` | `[{ text, answer: true/false, explanation }]` |
| `pairs` | `[[término, definición]]` para relacionar |
| `bank` | `[{ text: "… ___ …", answer, tip }]` |
| `open` | `[{ text, ideas: [[sinónimos]], need, model, tip }]` |

## CLASIFICA

`{ id, campo, tema, prompt, categories: [..], items: [[texto, índice]] }`

## Guía (igual que en inglés)

`{ kind: "campos", demo?, title, subtitle, sections: [{ group, type, title, items, bank?, definitions?, categories? }] }`
