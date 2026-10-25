# Validation: Imprimir guías

**Feature**: `002-imprimir-guias` · **Jira**: GAMES-3

## Línea base (T001)

- **Fecha**: 2026-10-24 · **Rama**: `002-imprimir-guias` (sin cambios de código; mismo código que `7144b90` de la 001).
- Recorrido de GAMES-1 (quickstart §4 de `specs/001-linea-base-quality-gate/`, semilla 12345) en Chrome: **huella `f1 b9 82 7e 2c 76`** (4,817 caracteres), idéntica a la de GAMES-1. Sin errores en consola.

## US1: hoja del alumno (T006–T011)

- **Pruebas** (`English/tests/print.test.mjs`): antes de los renderizadores, 37 pruebas con 27 pasando y 10 fallando; después de T007, 37 de 37 pasan. Cubren las 3 demos y las 3 guías generadas de los fixtures de GAMES-1.
- **Navegador** (Chrome, demo de Grammar con 2 secciones contestadas y revisadas; `window.print` reemplazado por un registro para no abrir el diálogo del sistema durante la automatización):
  - El menú no tiene botón de imprimir. En la hoja, el panel empieza oculto, se abre con 🖨 Print y "Answer key" está deshabilitado hasta T016.
  - "Student sheet": 1 llamada a `window.print()`, el panel se cierra y la tutora dice "Printing the student sheet...". `#print-area` tiene 38 bloques `print-item`, 0 marcas de clave y ninguna respuesta del alumno, y sigue oculto en pantalla.
  - **FR-016 / SC-007**: estados de las secciones, valores de los campos, marcas rojas y marcador (`8 / 38 pts`) idénticos antes y después de imprimir.
  - Volver al menú cierra el panel. Sin errores en consola.
- La revisión visual del papel se hace con los PDFs de T019–T020, en lugar de la vista previa del diálogo.

## US2: clave de respuestas (T013–T017)

- **Pruebas**: con las de la clave, `print.test.mjs` llegó a 64 pruebas; antes de T014 fallaban 6 (justo "Also accepted", "Read aloud", la tabla resuelta y la rúbrica) y después pasan todas. Suite completa: `146 · pass 144 · fail 0 · todo 2`.
- **Navegador, guías generadas en vivo** (tema Weather, 5°, con internet; `window.print` reemplazado por un registro):

| Guía | Reactivos (hoja / clave) | Marcas de clave en la hoja | Título "ANSWER KEY" | Contestando en pantalla con la clave impresa |
|---|---|---|---|---|
| Grammar, Vocabulary & Spelling | 39 / 39 | 0 | ✅ | **39 / 39 aceptadas** |
| Reading & Listening | 11 / 11 | 0 | ✅ | **11 / 11 aceptadas** |
| Writing | 0 / 0 (texto libre) | 0 | ✅ | — (rúbrica) |

- La hoja y la clave salieron de la misma guía abierta, sin regenerarla (FR-013).

## US3: PDFs de las demos (T019–T020)

`sh specs/002-imprimir-guias/validate-print/run.sh <carpeta>` genera las 6 versiones con Chrome sin ventana y las revisa con `pdfinfo`/`pdftotext`. **Resultado final: todas las revisiones pasan.**

| Versión | Páginas | Carta | Sin textos de pantalla | Revisión de contenido |
|---|---|---|---|---|
| gvs / student | 3 | ✅ | ✅ | sin respuestas de causativos ni de *ago* |
| gvs / key | 3 | ✅ | ✅ | "ANSWER KEY", respuesta de causativos, "Read aloud (dictation)" |
| rl / student | 2 | ✅ | ✅ | sin el guion del *listening* |
| rl / key | 2 | ✅ | ✅ | "ANSWER KEY", "Read aloud (listening)" |
| writing / student | 1 | ✅ | ✅ | 8 renglones y "Total" |
| writing / key | 1 | ✅ | ✅ | "ANSWER KEY", "Grading rubric" |

**Revisión a ojo** (gvs hoja y clave, rl hoja, writing hoja): ningún reactivo partido entre páginas (SC-004). Cada hoja del alumno se reconoce frente a su PDF de `English/documentacion/`: mismo encabezado (con "Colegio Reims…" en Reading y Writing), mismas instrucciones con "(one point each)", espacios y líneas, opciones a) b) c), lectura antes de sus preguntas, y en Writing "Remember", 8 renglones, "Criteria" y "Total ____ / 10" (SC-005).

### Hallazgos de la revisión, corregidos

1. **"ANSWER KEY" partido en dos renglones** con títulos largos ("…GUIDE — ANSWER" / "KEY"): la marca pasó a una etiqueta propia arriba del título. Se actualizaron data-model §2 y T013(a), y la prueba ahora verifica que la marca existe (sin ella, fallan 6 pruebas).
2. **Colisión de clases CSS**: la clase de sección `print-<tipo>` coincidía con `print-bank` y `print-match`, así que la sección completa del banco salía con borde y en cursiva, y el título de "relacionar" quedaba en una columna. Se renombró a `print-type-<tipo>`; los PDFs regenerados se ven bien.
3. El espacio de la letra junto a "undergraduate" bajaba de renglón: ahora no se parte (`white-space: nowrap`).

## Verificación final (T024)

- `npm test` 10 veces seguidas: **10/10 con `tests 146 · pass 144 · fail 0 · todo 2`**. Las 2 pendientes siguen siendo las de GAMES-2 ("form controls use a font of at least 16px…" y "touch controls are at least 44px tall").
- Recorrido de GAMES-1 sobre el código final de la rama: **huella `f1 b9 82 7e 2c 76`** (4,817 caracteres), idéntica a la línea base. Agregar la impresión no cambió nada del juego en pantalla. Sin errores en consola.
- **Pendiente**: T021, el recorrido en dispositivos reales (PC, iPad, iPhone y Android) con el usuario.

## Recorrido en dispositivos reales (T021): aplazado

- **Decisión del usuario (2026-10-24)**: "subamos la versión así como está y deja las pruebas como pendientes". Se integra GAMES-3 sin probar la impresión en PC, iPad, iPhone y Android reales.
- **Qué sí está validado**: la impresión en Chrome de escritorio, con los 6 PDFs de las demos revisados (T019–T020), y que imprimir no cambia la hoja en pantalla (T011).
- **Qué queda pendiente**: abrir la impresión del sistema y "Guardar como PDF" en Safari de iOS/iPadOS y en Chrome de Android (FR-018, SC-006). Se sigue en **GAMES-4**, junto con el T027 de GAMES-1.
- **Cambio de alcance documentado** (Principio III, paso 5): T021 no se elimina; queda abierta y marcada como aplazada. T022 (checkpoint de US3) se cubre con el comentario de cierre en Jira.
