# Implementation Plan: Fórmula de la oración en las tarjetas de gramática

**Branch**: `010-formula-tarjetas` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-12

## Summary

Agregar a `GRAMMAR_CARDS` un campo `formula` escrito a mano: un objeto `{ affirmative, negative, question }` en las 10 tarjetas de tiempos y un texto en las otras 12. `grammarCardHtml` lo pinta: en las de tiempos, como primer renglón de cada celda de la tabla `card-structure`; en las demás, como un párrafo "Structure:" antes de los ejemplos. Como la pantalla (`reference.js`) y la impresión usan el mismo `grammarCardHtml`, ambas cambian a la vez.

## Technical Context

- **Lenguaje**: JavaScript clásico sin build (igual que el resto del juego); CSS en `English/css/quiz.css`.
- **Pruebas**: `node:test` con `node:vm` (`English/tests/grammar-cards.test.mjs`).
- **Validación de impresión**: `specs/004-gramatica-verbos/validate-print/run.sh` (Chrome) y la impresora WebKit de GAMES-10.
- **Restricciones**: abrir con doble clic (`file://`); sin descargas; versiones `?v=` (GAMES-5).

## Constitution Check

- Spec antes del código, pruebas antes del contenido, quality gate `npm test` + workflow `Tests`: ✔.
- Principio V: commit, push, PR y merge con autorización explícita por acción: ✔.
- Sin dependencias nuevas, sin red: ✔.

## Design

- **Datos** (`English/js/grammar-cards.js`): `formula` junto a `structure` (tiempos) o junto a `explanation` (temas). `grammarCardsFor` copia `formula` a la vista de todas las tarjetas.
- **HTML**: `<div class="card-formula">…</div>` al inicio del `<td>` de cada renglón; `<p class="card-formula"><b>Structure:</b> …</p>` con `<br>` entre partes " · ".
- **CSS**: `.card-formula` en negritas con el color de acento en pantalla y en negro al imprimir (sin depender de colores de fondo).
- **Impresión en WebKit (FR-009)**: `.print-cards` deja de ser `display: grid`; cada `.print-card` es `inline-block` (50 % menos el espacio, o 100 % si es ancha o con 1 columna). WebKit nunca parte un bloque en línea entre páginas.
- **Pruebas**: lista revisada de las 42 fórmulas (FR-003), forma de cada fórmula (Subject, "+", "?"), auxiliares de la fórmula presentes en la línea con sujetos (FR-004), HTML con `card-formula` (FR-005).

## Project Structure

```text
English/js/grammar-cards.js        # datos y HTML de las tarjetas
English/css/quiz.css               # .card-formula
English/tests/grammar-cards.test.mjs
English/QuizA.html                 # versiones ?v=
specs/010-formula-tarjetas/        # esta historia
```
