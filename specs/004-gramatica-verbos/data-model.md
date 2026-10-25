# Data Model: Secciones de gramática y de verbos

**Feature**: `004-gramatica-verbos` · **Date**: 2026-10-24

Todo está en memoria; nada se guarda (Principio VI).

## 1. Tense (fijo, en `conjugation.js`)

| Campo | Ejemplo | Regla |
|---|---|---|
| `id` | `"pastSimple"` | Uno de 10, en el orden de FR-003. |
| `label` | `"Past simple"` | |
| `minGrade` | `3` | 3: presentSimple, presentContinuous, pastSimple · 4: futureWill, futureGoingTo · 5: pastContinuous, presentPerfect · 6: pastPerfect, futureContinuous, presentPerfectContinuous. |
| `timeEn` / `timeEs` | `"yesterday"` / `"ayer"` | Expresión de tiempo del ejemplo. |

`tensesForGrade(g)` devuelve los tiempos con `minGrade ≤ g`, en el orden de FR-003 (SC-003).

## 2. Verb (lista propia, `verbs-data.js`)

| Campo | Ejemplo | Regla |
|---|---|---|
| `base` | `"eat"` | Inglés, en minúsculas; puede ser frasal (`"wake up"`). Único en la lista. |
| `es` | `["comer"]` | 1 o más infinitivos en español (los reflexivos con `-se`). |
| `past` / `participle` | `"ate"` / `"eaten"` | Solo si son irregulares; pueden ser listas (`["learned","learnt"]`). |
| `objEn` / `objEs` | `"an apple"` / `"una manzana"` | Complemento del ejemplo; puede estar vacío. |
| `stative` | `true` | Opcional: nota "rare in continuous" (*know*, *like*). |
| `esForms` | `{ present: "come", preterite: "comió", future: "comerá", gerund: "comiendo", participle: "comido" }` | Opcional: solo las formas españolas irregulares; las demás se calculan (research R3). |
| `reviewed` | `true` | `false` para resultados de la fuente pública. |

## 3. ConjugatedTense (calculado, `conjugate(verb, tenseId)`)

`{ tense, formEn, exampleEn, exampleEs, note? }`. Por ejemplo, para *eat* en past simple: `{ formEn: "ate", exampleEn: "She ate an apple yesterday.", exampleEs: "Ella comió una manzana ayer." }`. En verbos no revisados, `exampleEs` es `null` y se muestra el infinitivo.

## 4. GrammarCard (escritas a mano, `grammar-cards.js`)

| Campo | Regla |
|---|---|
| `id`, `title`, `group` | `group` ∈ `tenses` (10), `guides` (4), `basics` (8): 22 en total. |
| `explanation` | Hasta 3 líneas, en inglés. |
| `structure` | Solo en `tenses`: `{ affirmative, negative, question }`. |
| `keywords` | Solo en `tenses`: palabras clave. |
| `changesWithTense` | `false` → `examples` fijos (2); `true` → `examplesByTense[tenseId]` (1 o 2). |
| `tenses` | Opcional: los tiempos que admite el tema (*can*: presente, pasado, futuro). |
| ejemplos | `{ en, es }`. |

## 5. PrintSelection (en pantalla, no se guarda)

`{ kind: "grammar" | "verbs", items: [cardId | verbBase], tenses: [tenseId] }` → `buildCardsPrintHtml(selection)`. Reglas: al menos 1 elemento y al menos 1 tiempo; el orden es el de la pantalla.
