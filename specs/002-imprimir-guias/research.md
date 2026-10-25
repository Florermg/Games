# Research: Imprimir guías

**Feature**: `002-imprimir-guias` · **Date**: 2026-10-24 · **Jira**: GAMES-3

## R1. Cómo se arma lo impreso

- **Decision**: una función pura `buildPrintHtml(guide, version)` en un archivo nuevo, `English/js/print.js`, que recibe la guía abierta (el mismo objeto que usa la pantalla) y devuelve el HTML de la versión impresa: `"student"` o `"key"`. La pantalla inserta ese HTML en un contenedor dedicado (`#print-area`), invisible en pantalla, y llama a la impresión del navegador (`window.print()`). Una hoja de estilos de impresión oculta todo lo demás.
- **Rationale**:
  - La versión impresa se arma desde los datos de la guía, no desde la pantalla, así que nunca puede arrastrar lo que el alumno contestó (FR-007) y la clave sale de la misma guía que la hoja (FR-013).
  - Al ser una función pura, se puede probar en Node con el mismo helper de GAMES-1 (FR-019), sin DOM.
  - No toca la hoja en pantalla (FR-016), no necesita red (FR-017) y no descarga archivos (FR-003).
- **Alternatives considered**:
  - (a) Estilos de impresión sobre la hoja interactiva: los campos y los botones de opción se imprimen distinto en cada navegador, y habría que ocultar respuestas, marcas y pistas una por una, con riesgo de que se escape alguna.
  - (b) Abrir una ventana nueva con el documento: los bloqueadores de ventanas emergentes la impiden, y en iPhone/iPad abre una pestaña nueva que complica volver a la guía.
  - (c) Generar un PDF en el juego con una librería: es una dependencia nueva (Principio II) y contradice "no descargar archivos" (Principio VI).

## R2. El botón y la elección de versión

- **Decision**: un botón "🖨 Print" en la barra superior de la hoja, junto a "⬅ Menu" y al marcador de puntos. Al tocarlo se despliega, ahí mismo, un pequeño panel con dos botones: "Student sheet" y "Answer key". Cada uno abre la impresión con su versión (2 toques, SC-001). El panel se cierra al elegir, al volver a tocar "Print" o al salir de la hoja.
- **Rationale**: la barra superior está al inicio de la hoja, así que se ve sin bajar (FR-001). No se usan `alert`, `confirm` ni `prompt`, que bloquean la página y se ven distinto en cada dispositivo.
- **Alternatives considered**: dos botones fijos ("Print student sheet" y "Print answer key"): es un toque menos, pero ocupa más espacio en la barra del celular, que ya es angosta (brechas de GAMES-2).

## R3. Formato en papel

- **Decision**: reglas `@media print` en `English/css/quiz.css`:
  - `@page { size: letter; margin: 15mm }`.
  - Ocultar todo excepto `#print-area`.
  - Letra con serifa o sans de 11–12 pt, en negro sobre blanco.
  - `break-inside: avoid` en cada reactivo, en el encabezado de sección junto con su primer reactivo, y en la lectura junto a su título.
  - En pantalla, `#print-area` no se muestra.
- **Rationale**: verificado en esta máquina con Chrome sin ventana (`--print-to-pdf`). La página sale en tamaño carta (612 × 792 pt), un elemento marcado como solo de pantalla no aparece, y un bloque con `break-inside: avoid` pasa completo a la página siguiente en lugar de partirse (SC-004, FR-014, FR-015).
- **Alternatives considered**: calcular los saltos de página a mano. Es frágil porque depende de los márgenes de cada impresora, y el navegador ya lo resuelve con CSS.

## R4. PC, iPhone, iPad y Android

- **Decision**: usar solo `window.print()`. Es la misma llamada en todos los navegadores: en PC abre la vista previa (con "Guardar como PDF"); en iPhone/iPad Safari abre las opciones de impresión de iOS (AirPrint, y "Guardar en Archivos" como PDF desde compartir); en Chrome de Android abre la impresión del sistema (con "Guardar como PDF").
- **Rationale**: cumple FR-018 sin código por plataforma. El contenido de `#print-area` se deja insertado después de imprimir: como no se ve en pantalla no estorba, y así no depende de que cada navegador avise cuándo termina (`afterprint` no es igual en todos). Cada nueva impresión lo reemplaza.
- **Riesgo**: algunos navegadores integrados en otras apps (por ejemplo, los que abren enlaces dentro de una red social) ignoran `window.print()`. Si no se abre nada, la hoja sigue usable (Edge Case de la spec) y la tutora sugiere abrir el juego en el navegador del dispositivo.
- **Validación**: en dispositivos reales (quickstart §4), igual que en GAMES-1 T027.

## R5. Qué aparece en cada versión

- **Decision**: a partir del modelo de datos de la guía (data-model.md de GAMES-1, §2–§3):
  - **Hoja del alumno**: solo enunciados, bancos, opciones, definiciones, textos de lectura, consignas, "Remember", palabras útiles, dato del tema, criterios y fuentes. Las respuestas de banco y de opción múltiple solo aparecen dentro del banco o de las opciones, sin marcar cuál es la correcta. Nunca salen `explanation`, `tip`, `script`, las palabras del dictado (`item.text` en `dictation`) ni las oraciones-respuesta de reescritura; en completar, el espacio sale vacío.
  - **Clave**: lo mismo, más la respuesta en el lugar del espacio. También las "otras formas válidas" (hasta 2 de `answers[1..]`, FR-010), las palabras del dictado y el `script` en un recuadro "Read aloud" (FR-011), y los criterios como rúbrica (FR-012).
- **Rationale**: la regla es verificable dato por dato en las pruebas. Por ejemplo: ninguna palabra del dictado ni ninguna oración del guion aparece en la hoja del alumno, y cada respuesta aparece en la clave.
- **Alternatives considered**: mostrar todas las variantes aceptadas en la clave. En causativos son hasta 4 y casi iguales ("had/got", el tiempo al inicio); con dos alcanza para que la maestra reconozca el patrón.

## R6. Cómo se prueba (FR-019, Principio IV)

- **Decision**: un archivo nuevo, `English/tests/print.test.mjs`, que carga `print.js` con el helper de GAMES-1 (se agrega a `GAME_SCRIPTS`, después de `grading.js`) y prueba `buildPrintHtml` con las tres demos y con las guías generadas de los fixtures grabados. Las respuestas impresas van marcadas con una clase propia (`class="key"`) y los espacios con otra (`class="blank"`), para que las pruebas verifiquen la estructura sin depender del diseño visual.
- **Rationale**: no hace falta navegador en CI; la suite sigue sin red ni dependencias.
- **Validación visual** (no en CI): un script de desarrollo genera los PDFs de las 6 versiones de las demos con Chrome sin ventana y `pdftotext` (ambos existen en esta Mac; quickstart §3). Comprueba el tamaño carta y la ausencia de textos de pantalla, y deja los PDFs para revisarlos a ojo contra los de `English/documentacion` (SC-004, SC-005). No se agrega a CI porque requiere Chrome y `pdftotext` (Principio II).

## R7. Rama y dependencia con GAMES-1

- **Decision**: la rama `002-imprimir-guias` sale de `001-linea-base-quality-gate`. Su PR se abre contra `main` **después** de integrar el PR #1. Si GAMES-1 cambia antes de integrarse, se rebasa la 002 sobre la 001 (con autorización).
- **Rationale**: la impresión usa `grading.js`, el helper de pruebas y los fixtures de GAMES-1. Un PR contra `main` antes de integrar la 001 mezclaría los cambios de las dos historias.
