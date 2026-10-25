# Quickstart: validar la impresión de guías

**Feature**: `002-imprimir-guias` · **Jira**: GAMES-3

Contrato en [contracts/print-view.md](contracts/print-view.md); formato por tipo de sección en [data-model.md](data-model.md).

## 1. Pruebas automáticas (FR-019)

1. Desde la raíz `Games/`: `npm test`.
2. **Esperado**: la suite de GAMES-1 sigue igual (80 pasan, 0 fallan, 2 pendientes) y `print.test.mjs` agrega sus pruebas en verde, sin red.

## 2. En el navegador (US1, US2, SC-001, SC-007)

1. Abrir `English/QuizA.html` y una demo.
2. Contestar dos secciones y revisarlas (para que haya respuestas, marcas y puntos en pantalla).
3. Tocar `🖨 Print` → `Student sheet`. **Esperado**: en 2 toques aparece la vista previa; no hay respuestas, marcas, pistas ni puntos (FR-007).
4. Cancelar. **Esperado**: la hoja en pantalla sigue con las mismas respuestas, intentos y puntos (FR-016).
5. `🖨 Print` → `Answer key`. **Esperado**: el título dice "ANSWER KEY" y cada reactivo muestra su respuesta; el dictado y el *listening* tienen su recuadro "Read aloud".
6. Repetir con una guía generada de cada tipo, y comparar su hoja y su clave: mismas preguntas, mismo orden de opciones (FR-013).
7. Repetir con internet desconectado, con una demo y con una guía ya generada (FR-017).

## 3. PDFs de las demos (SC-004, SC-005)

1. Ejecutar el script de validación de la historia, que genera con Chrome sin ventana las 6 versiones (3 demos × hoja/clave) en PDF y revisa con `pdftotext`:
   - Tamaño carta (612 × 792 pt).
   - Ningún texto de pantalla ("Check answers", "Finish", "Menu", "Anya-chan", el marcador de puntos).
   - En la hoja del alumno, ninguna palabra del dictado ni oración del guion.
2. Revisar a ojo los 6 PDFs:
   - Ningún reactivo partido entre páginas.
   - La hoja del alumno se reconoce como el PDF correspondiente de `English/documentacion/`: mismo encabezado, instrucciones y ejercicios en el mismo orden.
3. Registrar el resultado en `specs/002-imprimir-guias/validation.md`.

## 4. Dispositivos reales (US3, FR-018, SC-006)

Con el juego servido en la red local (como en GAMES-1 T027), en PC, iPad, iPhone y Android:

1. Abrir una demo, imprimir la hoja del alumno y la clave con la impresión del sistema (o "Guardar como PDF").
2. **Esperado**: la vista previa (o el PDF) está completa y legible en los cuatro. Si un navegador integrado de otra app no abre la impresión, la hoja sigue usable (Edge Case).
3. Anotar el resultado por dispositivo en `validation.md`.
