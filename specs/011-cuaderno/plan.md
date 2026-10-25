# Implementation Plan: Cuaderno con revisión de gramática y sugerencias

**Branch**: `011-cuaderno` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-13

## Summary

Nueva pantalla "📓 My Notebook": un `<textarea>` para escribir libremente, páginas guardadas en `localStorage` y un botón que revisa el texto con reglas propias del juego (sin internet) y, si el alumno lo deja encendido, con la API pública de LanguageTool. Los errores se muestran marcados y numerados en una vista del texto, con explicación y sugerencias aplicables. La página revisada se imprime como las guías.

## Technical Context

- **Lenguaje**: JavaScript clásico sin build, CSS en `English/css/quiz.css`; abre con doble clic (`file://`).
- **Dependencias externas**: LanguageTool (`api.languagetool.org/v2/check`), opcional y apagable (research R1).
- **Guardado**: `localStorage` con `try/catch` (R3).
- **Pruebas**: `node:test` + `node:vm` con `tests/helpers/game-context.mjs`; un `fetch` falso con respuestas grabadas de LanguageTool para las pruebas en línea; un `storage` falso para el guardado.
- **Validación**: Chrome con la extensión; impresión en Chrome (`--print-to-pdf`) y WebKit (`webkit-print`, GAMES-10).

## Constitution Check

- Spec y aclaraciones antes del plan; pruebas antes del código; quality gate `npm test` + workflow `Tests`: ✔.
- Principio V (commit, push, PR y merge con autorización por acción): ✔.
- Datos públicos sin clave, nada se descarga; el texto del alumno solo sale del equipo si la casilla está encendida y con aviso: ✔.

## Design

- **`English/js/notebook-check.js`** (puro, sin DOM; entra en `GAME_SCRIPTS`):
  - `checkNotebookText(text)` → `Issue[]` con las reglas del juego (R2).
  - `languageToolIssues(json, text)` → `Issue[]` (filtra reglas de tipografía, máximo 3 sugerencias, sin `UNSAFE`).
  - `mergeIssues(gameIssues, onlineIssues)` → lista ordenada, sin encimarse, prefiriendo las del juego.
  - `checkOnline(text)` → `Promise<Issue[]>` con `fetch` POST; 429 y fallos de red → error con mensaje para el alumno.
  - `applySuggestion(text, issues, index, replacement)` → `{ text, issues }` (R4).
  - `markedTextHtml(text, issues)` → HTML con `<mark class="nb-mark nb-<kind>" data-n>` y saltos de línea.
  - `loadNotebook(storage)`, `saveNotebook(storage, store)`, `newNotebookPage(now, pages)`, `pageLabel(page)`.
  - `buildNotebookPrintHtml({ name, page, issues, checkedWith })`.
- **`English/js/notebook.js`** (DOM): `openNotebook()`, lista de páginas, guardado al escribir, botón de revisión con estado, sugerencias con "Use this", borrar con doble toque, imprimir.
- **`English/QuizA.html`**: tarjeta en el menú, `#notebook-screen` (clase `reference-screen`, así `backToMenu` la oculta), los dos scripts con versión.
- **`English/css/quiz.css`**: estilos de pantalla y de impresión (`.nb-*`).

## Project Structure

```text
English/js/notebook-check.js        # reglas, LanguageTool, guardado, impresión (puro)
English/js/notebook.js              # pantalla
English/tests/notebook.test.mjs     # pruebas
English/tests/fixtures/languagetool-*.json   # respuestas grabadas de LanguageTool
English/tests/helpers/game-context.mjs       # + notebook-check.js
English/QuizA.html, English/css/quiz.css, README.md
```
