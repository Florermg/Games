# Data Model: Línea base y quality gate del juego de inglés

**Feature**: `001-linea-base-quality-gate` · **Date**: 2026-10-24

El juego no guarda datos: todo vive en memoria mientras la hoja está abierta. Este documento describe las estructuras que ya existen (línea base, commit `9ae5667`) y que las pruebas verifican, más las dos estructuras nuevas de esta historia: las grabaciones de respuestas externas y el contexto de prueba.

## 1. Guide (existente)

Objeto plano. Las demos viven en `DEMO_GUIDES.{gvs,rl,writing}` (`English/js/demos.js`) y las guías nuevas las devuelven `generateGrammarGuide`, `generateReadingGuide` y `generateWritingGuide` (`English/js/generators.js`).

| Campo | Tipo | Regla |
|---|---|---|
| `kind` | `"gvs" \| "rl" \| "writing"` | Obligatorio. |
| `school` | string | Vacío en las guías generadas. |
| `title` | string | `"GRAMMAR, VOCABULARY & SPELLING GUIDE"`, `"READING & LISTENING GUIDE"` o `"WRITING GUIDE"`. |
| `subtitle` | string | En demos: `"1st Trimester - 5th Grade"`; en generadas: `"<grado> · <tema>"`. |
| `teacher` | string | `"Aurora Corante"` en demos; vacío en generadas. |
| `sections` | Section[] | Al menos 1; el orden es el de la hoja. |

## 2. Section (existente)

Campos comunes: `group` (Grammar, Vocabulary, Spelling, Reading, Listening o Writing), `type` y `title` (puede contener `<i>`).

| `type` | Campos propios | Reglas que verifican las pruebas |
|---|---|---|
| `bank` | `bank: string[]`, `items: Item[]` | Cada `item.text` tiene exactamente un `___`; `item.answers[0]` está en `bank`. Demo: 5 y 4 reactivos. |
| `rewrite` | `items: Item[]` | `item.answers` no está vacío; la explicación (cuando es la oración) se acepta como respuesta. |
| `fill` | `items: Item[]`, opcional `script: string`, `source: string` | Cada `item.text` tiene un `___`; si hay `script`, al menos una de las respuestas aceptadas de cada reactivo aparece en el `script` (sin distinguir mayúsculas). |
| `match` | `definitions: {letter, text}[]`, `items: Item[]` | Letras únicas `a…`; cada `item.answers[0]` es una letra existente; ninguna letra se usa dos veces. |
| `choice` | `items: Item[]` con `options` y `answer`, opcional `passage: string[]`, `source`, `inline` | `0 ≤ answer < options.length`; opciones distintas sin importar mayúsculas (FR-029); 3 opciones en demos y en ortografía. |
| `dictation` | `items: Item[]` | `item.text` (la palabra que se lee) está en `item.answers`. |
| `writing` | `remember: string[]`, `lines: number`, `criteria: Criterion[]`, opcional `usefulWords`, `fact`, `source` | 5 criterios; cada `criterion.check` existe en `WRITING_CHECKS`; la suma de `points` es 10. |

## 3. Item (existente)

| Campo | Tipo | Regla |
|---|---|---|
| `text` | string | Enunciado; vacío en "Circle the correct spelling". |
| `answers` | string[] | Respuestas aceptadas (todo tipo excepto `choice`). Se comparan con `normalizeAnswer` (FR-016). |
| `options` / `answer` | string[] / number | Solo en `choice`. |
| `tip` | string | Pista después del primer intento (FR-014). Opcional. |
| `explanation` | string | Se muestra con la respuesta correcta. Opcional. |

## 4. Criterion (existente)

`{ check, text, points }`: `check` es el nombre de una regla en `WRITING_CHECKS` (`English/js/banks.js`), que recibe `(text, section)` y devuelve `{ score: 0|1|2, note }`.

## 5. SectionState (existente, en `engine.js`)

| Campo | Tipo | Regla |
|---|---|---|
| `attemptsLeft` | 0..2 | Empieza en 2 y baja solo cuando la revisión se ejecuta (FR-013). |
| `done` | boolean | `true` cuando todo es correcto o `attemptsLeft` llega a 0. |
| `correct` | number[] | Por reactivo: 0 = pendiente o incorrecto; 1 o 2 = intento en que se acertó. |
| `writingScore` | number | Último resultado de la revisión de writing. |

**Transiciones** (sección no writing): `pendiente (2)` → revisar → `todo correcto` ⇒ `done`, o bien `quedan errores (1)` → revisar → `done`. Una revisión con reactivos vacíos no cambia el estado.

**Funciones puras que se extraen a `English/js/grading.js`** (R3), con el mismo comportamiento que hoy:

- `normalizeAnswer(text)` → string
- `isCorrect(section, item, response)` → boolean
- `correctAnswerText(section, item)` → string
- `scoreSection(section, state)` → `{ score, max }` (writing: `writingScore` / suma de puntos; resto: reactivos con `correct > 0` / número de reactivos)
- `computeAverage(score, max)` → número con un decimal (`Math.round(score / max * 100) / 10`; 0 si `max` es 0)

## 6. Fixture: grabación de respuestas externas (nuevo)

Un archivo JSON por escenario en `English/tests/fixtures/`, generado por `record.mjs`:

```json
{
  "scenario": "gvs-recycling-g5",
  "seed": 7,
  "recordedAt": "2026-10-24T00:00:00Z",
  "responses": {
    "<URL completa>": { "status": 200, "body": "<texto de la respuesta tal cual>" }
  }
}
```

Reglas: la clave es la URL exacta que pide el juego; `body` se guarda como texto (se parsea con `JSON.parse` en el `fetch` falso). Un escenario se considera válido solo si reproducirlo con su `seed` no pide ninguna URL ausente.

## 7. TestContext (nuevo, helper de pruebas)

Contexto `node:vm` creado por prueba con: `Math.random` con semilla; un `fetch` falso (desde un fixture o uno que falla siempre); `URLSearchParams` y `console`; y los scripts cargados en el orden de `QuizA.html`, sin `engine.js`, que depende del DOM. Expone una lista de URLs pedidas y no encontradas, que cada prueba de generadores exige vacía.
