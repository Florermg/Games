# Data Model: Nueva opción Listening

Guía con la forma de siempre (`specs/001-linea-base-quality-gate/data-model.md`), `kind: "listening"`, `title: "LISTENING GUIDE"`:

| Sección | Campos |
|---|---|
| 1 `listen` | `group: "Listening"`, `stage: 1`, `subtitles: true`, `title`, `sentences: string[]`, `rate`, `source`, `items: []` |
| 2 `listen` | `stage: 2`, `subtitles: false`, `title`, `sentences`, `rate`, `items: []` |
| 3 `choice` | `stage: 3`, `title`, `script` (oraciones unidas), `rate`, `source`, `items`: 5–6 `{ text, options (3), answer, tip, explanation }` |

Además, `audioType: "story"|"facts"` y `speakers: string[]` (paralelo a `sentences`; "" en la narración y en "facts"). En "story", `source` dice "Story written for this game" y `title` es el de la historia.

`LISTENING_STORIES[topicKey]`: `{ title, kind, lines: [{ speaker, text }] (8), questions: [{ text, options[3], answer, line, tip }] (7) }`.

Reglas:
- `sentences.length === GRADE_LEVELS[grade].listeningSentences`.
- `rate === GRADE_LEVELS[grade].speechRate`.
- Cada respuesta correcta sale del texto (la opción verdadera es una oración del texto, y la palabra correcta del cloze reconstruye una oración).
- En story: `options[answer]` aparece (sin mayúsculas) en `lines[line].text`; las preguntas incluidas son las de `line < sentences.length`, máximo 6.
