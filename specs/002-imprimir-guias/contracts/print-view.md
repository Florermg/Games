# Contract: vista de impresión

**Feature**: `002-imprimir-guias` · Cubre FR-001 a FR-018

## Función pura (English/js/print.js)

```text
buildPrintHtml(guide, version) → string
  guide:   Guide (data-model de GAMES-1 §1), demo o generada
  version: "student" | "key"   (otro valor → Error)
```

Garantías (las verifica `English/tests/print.test.mjs`):

- **Pura**: no lee ni escribe el DOM, no usa red y no modifica `guide`. La misma entrada produce el mismo HTML.
- **Escape**: todo texto que viene de la guía se escapa con `escapeHtml`, salvo `section.title` (HTML propio del juego con `<i>`, igual que en pantalla).
- **Estructura**: un bloque `print-item` por reactivo; los marcadores de data-model.md §5.
- `version: "student"` no tiene ningún `class="key"` y nunca contiene `explanation`, `tip`, `script`, las palabras del dictado ni las oraciones-respuesta de reescritura. En banco, completar y opción múltiple, los espacios salen vacíos y la opción correcta no se marca; esas palabras pueden aparecer solo donde ya estaban (el banco, las opciones o el texto de lectura).

## Interfaz en la hoja (English/QuizA.html + English/js/engine.js)

| Elemento | Comportamiento |
|---|---|
| Botón `🖨 Print` en `.sheet-top` | Visible en toda hoja abierta (demo o generada). Abre o cierra el panel de versiones. No existe en el menú ni en resultados. |
| Panel de versiones | Dos botones: `Student sheet` y `Answer key`. Elegir uno cierra el panel e imprime esa versión. |
| Imprimir | `#print-area.innerHTML = buildPrintHtml(currentGuide, version)` y luego `window.print()`. La tutora dice qué versión se está imprimiendo. |
| Estado | No cambia `sectionStates`, las respuestas, los puntos ni la pantalla visible (FR-016). |
| `#print-area` | Oculto en pantalla; en impresión es lo único visible. |

## Estilos de impresión (English/css/quiz.css)

| Regla | Contrato |
|---|---|
| Página | `@page { size: letter; margin: 15mm }` |
| Visibilidad | En `@media print` solo se ve `#print-area`; en pantalla, `#print-area` no se ve. |
| Saltos | `.print-item`, el encabezado de cada sección con su primer reactivo y la lectura con su título: `break-inside: avoid`. |
| Color | Negro sobre blanco; los espacios son líneas (borde inferior), no campos de formulario. |
