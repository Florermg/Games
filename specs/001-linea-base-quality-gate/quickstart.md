# Quickstart: validar la línea base y el quality gate

**Feature**: `001-linea-base-quality-gate` · **Jira**: GAMES-1

Guía para comprobar que la historia cumple la spec. Los comandos están en [contracts/test-commands.md](contracts/test-commands.md) y el workflow en [contracts/ci-workflow.md](contracts/ci-workflow.md).

## Requisitos previos

- Node 24 (`node --version` → `v24.x`). No hace falta `npm install`.
- Estar en la raíz del repo: `Games/`.

## 1. Pruebas en verde sin red (US1, SC-001, SC-004)

1. Desconectar internet (o activar el modo avión).
2. Ejecutar `npm test`.
3. **Esperado**: todas las pruebas pasan, en menos de 1 minuto, y el reporte muestra el total.
4. Ejecutar `for i in $(seq 10); do npm test --silent >/dev/null || echo FALLO; done`.
5. **Esperado**: no se imprime ningún `FALLO`.

## 2. Las demos están completas (SC-002)

En el reporte de `npm test`, la suite `demos` debe incluir una prueba por sección de cada demo (7 de Grammar, Vocabulary & Spelling; 2 de Reading & Listening; 1 de Writing), y todas deben pasar.

## 3. Las pruebas detectan regresiones (SC-003)

Para cada fila: aplicar el cambio, ejecutar `npm test`, confirmar que falla el archivo indicado y luego revertir con `git checkout -- <archivo>`. Anotar el resultado en el comentario de cierre de GAMES-1.

| Área | Cambio deliberado | Debe fallar |
|---|---|---|
| Validación de respuestas | En `grading.js`, quitar `.replace(/,/g, " ")` de `normalizeAnswer` | `grading.test.mjs` |
| Puntos y promedio | En `grading.js`, cambiar `* 100) / 10` por `* 10) / 10` en `computeAverage` | `grading.test.mjs` |
| Gramática | En `banks.js`, en `regularPast`, cambiar `base.length <= 4 && endsWithCVC(base)` por `false` ("stop" → "stoped") | `grammar.test.mjs` |
| Demos | En `demos.js`, cambiar la respuesta `"a few"` por `"few"` | `demos.test.mjs` |
| Writing | En `banks.js`, cambiar `found >= 2 ? 2` por `found >= 3 ? 2` en `parentheses` | `writing.test.mjs` |
| Filtros de contenido | En `api.js`, quitar `kill\w*\|` de `UNSAFE` | `content-filters.test.mjs` |
| Generadores | En `generators.js`, en `quantifierSection`, agregar `.slice(0, 4)` después de `shuffle(Object.keys(QUANTIFIER_BANK))` (4 reactivos en vez de 5) | `generators.test.mjs` |

## 4. El juego no cambió (US3, SC-006)

1. Abrir `English/QuizA.html` con doble clic, sin servidor.
2. **Antes de cambiar código** (sobre el commit `9ae5667`), recorrer las tres demos con este guion y anotar los puntos y mensajes. Repetir el mismo recorrido al final de la historia:
   - Grammar: fallar *e* de *quantifiers* y corregirlo; escribir "Yesterday, I had my car washed" en causativos; fallar dos veces "My brother waked up…".
   - Reading: contestar las 7 bien; *listening*: "School", "bake sale", "friday", "cakes".
   - Writing: pegar la carta de ejemplo de la prueba `writing.test.mjs` (la que menciona "Central Park").
3. **Esperado**: los mismos puntos, pistas y mensajes en ambos recorridos; las secciones no mencionadas en el guion se contestan bien en los dos recorridos. En la consola del navegador no debe haber errores.
4. Generar una guía de cada tipo (con internet) y confirmar que se abre.

## 5. PC, celulares e iPad (FR-030a, SC-007)

1. En la Mac, desde `Games/English/`: `python3 -m http.server 8765 --bind 0.0.0.0`. Obtener la IP local con `ipconfig getifaddr en0`.
2. Con el iPhone, el iPad y el celular Android en la misma red Wi-Fi, abrir `http://<IP>:8765/QuizA.html`. En la PC se puede abrir con doble clic.
3. En cada dispositivo, recorrer: menú → demo de gramática (incluido el 🔊 del dictado) → demo de reading (incluidos ▶ Play y 🐢 Slow) → demo de writing (escribir con el teclado del dispositivo) → resultados.
4. **Esperado**: en los cuatro se puede completar todo sin desplazamiento horizontal (FR-030a). Las 4 brechas conocidas de la spec pueden aparecer; cualquier otra (por ejemplo, que Safari no lea en voz alta) se anota como brecha nueva en GAMES-2.
5. `npm test` muestra las pruebas de `responsive.test.mjs` como `todo` (pendientes), no como fallidas.
6. Detener el servidor al terminar (Ctrl+C).

## 6. Quality gate en GitHub (US2, SC-005)

1. Con la autorización del commit, del push y de la creación del PR (Principio V), subir la rama `001-linea-base-quality-gate` y abrir un PR hacia `main`.
2. **Esperado**: el check `Tests / tests` aparece en el PR y termina en ✅ en menos de 5 minutos.
3. Prueba del fallo: en un commit temporal de la rama, aplicar una mutación de la tabla anterior y hacer push. **Esperado**: el check termina en ❌ y el PR muestra qué prueba falló. Después se revierte el commit temporal (también requiere autorización).
4. Después de integrar el PR: el commit en `main` muestra el check ✅.
