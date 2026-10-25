# Contract: comandos de prueba

**Feature**: `001-linea-base-quality-gate` · Cubre FR-031 a FR-035

Interfaz que el proyecto expone a quien desarrolla, y que también usa CI. Se ejecuta desde la raíz del repo (`Games/`). Requiere Node 24 y no requiere `npm install`.

| Comando | Qué hace | Red | Resultado esperado |
|---|---|---|---|
| `npm test` | Ejecuta todas las pruebas de `English/tests/**/*.test.mjs` | **Nunca** | Código de salida 0 si todo pasa y ≠ 0 si algo falla; el reporte indica el número de pruebas y el nombre de cada prueba fallida. Duración < 1 min (SC-001). |
| `npm run test:coverage` | Igual que `npm test`, con reporte de cobertura de líneas por archivo | Nunca | Informativo; no bloquea ningún umbral (research R6). |
| `npm run fixtures:record` | Regenera las grabaciones de `English/tests/fixtures/` contra las fuentes reales | **Sí** | Solo para desarrollo. Escribe un JSON por escenario y reporta cada escenario como grabado, sin cambios o fallido (por ejemplo, con 429). No borra un escenario ya grabado si falla. |

## Garantías

- `npm test` es determinista: 10 ejecuciones seguidas dan el mismo resultado (SC-004).
- Una URL no grabada durante `npm test` es un fallo de la prueba que la pidió, con la URL en el mensaje. Nunca se cae a la red real.
- Las pruebas no modifican archivos del repo.
- Una prueba pendiente (`todo`) que falla aparece en el reporte como `todo` y no cambia el código de salida; GAMES-2 quita la marca al corregir la brecha.
- Abrir `English/QuizA.html` con doble clic sigue funcionando sin Node (FR-035): `package.json` no contiene dependencias de ejecución del juego.

## Organización de las pruebas (un archivo por área de SC-003)

| Archivo | Área | Requisitos |
|---|---|---|
| `grading.test.mjs` | Comparación de respuestas, puntos y promedio | FR-015, FR-016, FR-017, FR-022 |
| `grammar.test.mjs` | Pasado simple, comparativos, causativos y plantillas de gramática | FR-017, FR-026 |
| `demos.test.mjs` | Integridad de las tres demos contra el modelo de datos | FR-005 a FR-008, SC-002 |
| `writing.test.mjs` | Reglas de autoevaluación con textos de ejemplo | FR-019 a FR-021 |
| `content-filters.test.mjs` | Filtros de contenido no apto, definiciones, oraciones y textos | FR-028 |
| `generators.test.mjs` | Las tres guías generadas con fuentes simuladas | FR-025, FR-027, FR-029 |
| `responsive.test.mjs` | Brechas táctiles revisadas en `quiz.css`, marcadas como **pendientes** (`todo: 'GAMES-2'`): se reportan pero no hacen fallar `npm test` | FR-039 |
