# Data Model: Imprimir guías

**Feature**: `002-imprimir-guias` · **Date**: 2026-10-24

No hay datos nuevos guardados. La impresión es una **vista** de la guía abierta, cuya estructura (Guide, Section, Item) está en `specs/001-linea-base-quality-gate/data-model.md` §1–§3.

## 1. PrintVersion

| Valor | Para | Regla |
|---|---|---|
| `"student"` | Alumno | Ningún dato de respuesta (R5). |
| `"key"` | Maestra | Todo lo del alumno + respuestas + "Read aloud" + rúbrica; encabezado con "ANSWER KEY". |

## 2. Encabezado impreso (de `Guide`)

| Elemento | Fuente | Alumno | Clave |
|---|---|---|---|
| Escuela | `guide.school` | si no está vacío | igual |
| Marca | fijo | — | etiqueta "ANSWER KEY" en su propio renglón, arriba del título (si se agrega al título, uno largo la parte en dos renglones; hallazgo de T020) |
| Título | `guide.title` | sí | igual |
| Subtítulo | `guide.subtitle` | sí | igual |
| Campos | fijo | `Name: ____ Group: ___ R.N: ___ Date: ____ Average: ___ Teacher: <guide.teacher o ____>` | igual |

El nombre que el alumno escribió en el menú **no** se usa (FR-004).

## 3. Sección impresa (de `Section`)

Común: etiqueta del grupo (cuando cambia, como en pantalla), `title` (con su HTML de cursivas) y los reactivos en orden. Cada reactivo va en un bloque que no se parte entre páginas.

| `type` | Hoja del alumno | Clave |
|---|---|---|
| `bank` | recuadro con `bank` (separado por " / "); cada `item.text` con `___` → espacio (`blank`), letrado a., b., c. | el espacio muestra `answers[0]` (`key`) |
| `rewrite` | `a. item.text` + una línea completa (`blank line`) | la línea muestra `answers[0]` (`key`) + "Also accepted: …" con hasta 2 de `answers[1..]` |
| `fill` | `item.text` con el espacio (los del *listening* ya vienen letrados) | el espacio muestra `answers[0]` + "Also accepted: …" si hay más; si la sección tiene `script`, recuadro "Read aloud (listening)" con el `script` completo |
| `match` | dos columnas: `n. item.text ____` (espacio para la letra) y la lista `letter. text` de `definitions` en orden | el espacio muestra la letra; además, la tabla resuelta "word → letter. definition" |
| `choice` | `passage` (párrafos) + `source`, antes de las preguntas; `item.text` (si no está vacío) y `options` como "a) … b) … c) …" | la opción `answer` marcada (`key`, por ejemplo con un círculo y en negrita) |
| `dictation` | renglones numerados en blanco (`1. ________`), uno por reactivo | recuadro "Read aloud (dictation)" con las palabras en orden; los renglones muestran cada palabra |
| `writing` | consigna (`title`), "Remember" (lista), recuadro de `usefulWords` y `fact` + `source` si existen, `lines` renglones en blanco, "Criteria" con `text (points)` y "Total ____ / suma" | igual, con los renglones reemplazados por la nota "Students write here (8 lines)" y "Criteria" presentada como rúbrica de calificación |

## 4. Pie

Las fuentes CC BY-SA (`section.source`) van junto al texto que atribuyen (lectura, *listening* en la clave, dato del writing). No hay pie adicional.

## 5. Marcadores para las pruebas

| Marcador | Significado | Regla verificable |
|---|---|---|
| `class="key"` | respuesta impresa | 0 en la hoja del alumno; ≥ 1 por reactivo en la clave |
| `class="blank"` | espacio o línea para contestar | ≥ 1 por reactivo no `choice` en la hoja del alumno |
| `class="read-aloud"` | texto para leer en voz alta | 0 en la hoja del alumno; 1 por sección `dictation`/`fill` con `script` en la clave |
| `class="print-item"` | bloque de un reactivo (no se parte) | uno por `item` en ambas versiones |
