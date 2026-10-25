# Validation: Línea base y quality gate del juego de inglés

**Feature**: `001-linea-base-quality-gate` · **Jira**: GAMES-1

Evidencia de SC-001 a SC-007 para el cierre de la historia.

## Línea base (T002)

- **Fecha**: 2026-10-24 · **Código**: `English/` idéntico al commit `9ae5667` (`git diff --stat 9ae5667 -- English` vacío) · **Navegador**: Chrome de escritorio, servido en `http://127.0.0.1:8765/`.
- **Método**: el recorrido de quickstart §4 ejecutado con un script en la página. `Math.random` se fija con la semilla 12345, para que las frases de la tutora sean comparables entre recorridos. Se registran el estado de cada sección después de cada revisión, las pistas o respuestas mostradas, los mensajes de la tutora y los resultados.
- **Huella del registro completo** (SHA-256, primeros 6 bytes, 4,817 caracteres de JSON): `f1 b9 82 7e 2c 76`.
- **Consola**: sin errores.

| Demo | Guion | Resultado |
|---|---|---|
| Grammar, Vocabulary & Spelling | *Quantifiers*: revisar con *e* vacío (no consume intento, mensaje "Please answer all the items…"); *e* = "some" (pista mostrada) y luego "no". Causativos con variantes ("Yesterday, I had my car washed", sin punto final). *Ago*: "My brother waked up…" dos veces. El resto, correcto. | **37 / 38 pts · Average 9.7 / 10** · "Super brilliant, Ana!" · tabla 5/5, 5/5, 4/5, 9/9, 4/4, 5/5, 5/5 · repaso: 1 reactivo ("My brother woke up ten minutes ago.") |
| Reading & Listening | 7 respuestas correctas; *listening* "School", "bake sale", "friday", "cakes". | **11 / 11 pts · Average 10 / 10** · tabla 7/7, 4/4 · repaso vacío |
| Writing | Primero "too short" (mensaje "Write your text first…", no revisa); después la carta de ejemplo ("Dear neighbors… at Central Park… Sincerely, Ana"). | Criterios 2/2 ×5 · **Total 10 / 10** (estimación automática) · 81 palabras · Average 10 / 10 |

## Separación de `grading.js` sin cambio visible (T008, FR-038)

- Mismo recorrido y misma semilla sobre el código con `grading.js` separado: **huella idéntica** `f1 b9 82 7e 2c 76` (4,817 caracteres), sin errores en consola. Probado servido por HTTP; el doble clic (`file://`) se confirma en T025.

## US1: red de seguridad local (T020)

- `npm test`: **82 pruebas: 80 pasan, 0 fallan, 2 pendientes** (`responsive.test.mjs`, `todo: 'GAMES-2'`), código de salida 0.
- **Sin red (SC-001, FR-032)**: ejecutado con el `fetch` global reemplazado por uno que bloquea y registra cualquier intento: **0 peticiones de red** y fixtures sin cambios (huella SHA de los 3 JSON idéntica antes y después).
- **Duración (SC-001)**: menos de 1 segundo por ejecución en esta Mac (10 ejecuciones en 2 s).
- **Determinismo (SC-004)**: 10 ejecuciones seguidas con el mismo resultado (`tests 82 · pass 80 · fail 0 · todo 2` en la versión final; antes de corregir el bug, `pass 79 · fail 1` las 10 veces).
- **Repo intacto**: `git status --porcelain` idéntico antes y después de las 10 ejecuciones.
- **Fixtures**: 3 escenarios grabados el 2026-10-24 (54 + 184 + 5 respuestas, todas con estado 200; 1.2 MB en total < 1.5 MB). Simple English Wikipedia respondió normalmente desde Node esta vez, así que no hizo falta grabar desde el navegador.

### Hallazgos durante la implementación

1. **Bug real de la línea base (FR-016)**: una respuesta correcta con espacio después del punto final se marcaba como incorrecta. Se corrigió en `English/js/grading.js` por decisión del usuario (clarificación en la spec; única excepción a FR-038). Lo protege la prueba "normalizeAnswer ignores the final period even with a trailing space".
2. **Bug del propio arnés de pruebas (corregido antes de cerrar la US1)**: `generators.test.mjs` importa `SCENARIOS` de `record.mjs`, que ejecutaba la grabación (con red) al importarse; así se regrabaron dos fixtures durante una corrida. Ahora `record.mjs` solo graba cuando se ejecuta como script, y la verificación con red bloqueada de arriba lo confirma.
