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

## US2: quality gate en GitHub (T023)

- PR [#1](https://github.com/Florermg/Games/pull/1) (`001-linea-base-quality-gate` → `main`), commit `516df6c`.
- Check `Tests / tests` (run `40146441557`, evento `pull_request`): **✅ success**. Creado 2026-10-25T00:22:31Z y terminado 00:22:44Z: **13 s** de punta a punta, 9 s el job (SC-005: < 5 min).
- Log de CI: Node v24.21.0, `node --test "English/tests/**/*.test.mjs"` → `tests 82 · pass 80 · fail 0 · todo 2`, el mismo resultado que en local.

## Las pruebas detectan regresiones (T029, SC-003)

Cada mutación de quickstart §3 se aplicó sola, se ejecutó `npm test` y se revirtió con `git checkout -- <archivo>`. Al terminar, `git status` solo muestra los documentos de la historia, y `npm test` vuelve a `pass 80 · fail 0 · todo 2`.

| Área | Mutación | `npm test` | Pruebas fallidas | Archivo esperado falla |
|---|---|---|---|---|
| Validación de respuestas | quitar `.replace(/,/g, " ")` de `normalizeAnswer` | exit 1 | 3 (`grading`, `grammar`) | ✅ `grading.test.mjs` |
| Puntos y promedio | `* 100) / 10` → `* 10) / 10` en `computeAverage` | exit 1 | 1 (`grading`) | ✅ `grading.test.mjs` |
| Gramática | en `regularPast`, `base.length <= 4 && endsWithCVC(base)` → `false` | exit 1 | 1 (`grammar`) | ✅ `grammar.test.mjs` |
| Demos | `answers: ["a few"]` → `["few"]` | exit 1 | 1 (`demos`) | ✅ `demos.test.mjs` |
| Writing | en `parentheses`, `found >= 2 ? 2` → `found >= 3 ? 2` | exit 1 | 2 (`writing`) | ✅ `writing.test.mjs` |
| Filtros de contenido | quitar `kill\w*\|` de `UNSAFE` | exit 1 | 2 (`content-filters`) | ✅ `content-filters.test.mjs` |
| Generadores | `.slice(0, 4)` en `quantifierSection` | exit 1 | 7 (`generators`, `grammar`) | ✅ `generators.test.mjs` |

Nota: el reporte de Node lista también `responsive.test.mjs` en cada corrida, pero son sus 2 pruebas pendientes (`todo`), no fallos nuevos.

## US3: el juego no cambió (T025, SC-006)

- Mismo recorrido y misma semilla que en T002, sobre la rama (commit `516df6c`): **huella idéntica** `f1 b9 82 7e 2c 76` (4,817 caracteres), sin errores en la consola.
- Única diferencia visible, la que se buscaba (FR-016): en *ago*, "I went to Paris two years ago. " (con espacio final) ahora se acepta (`correct 1,1,1,1,1`).
- **Doble clic (`file://`)**: `English/QuizA.html` abierto con Chrome sin ventana desde `file://`. El menú que arma el JavaScript aparece completo: 18 temas, los 6 tipos de writing y las 4 casillas de gramática, y la página carga `js/grading.js`.

## US3: FR-001 a FR-030 contra el juego (T026)

Evidencia: **N** = recorrido en navegador del 2026-10-24 sobre la rama · **P** = prueba automática (`English/tests/`) · **R** = recorrido de T002/T025.

| Requisito | Evidencia | Resultado |
|---|---|---|
| FR-001 menú (nombre, 3 tarjetas, demo + generar) | N | ✅ confirmado |
| FR-002 grados 3–6 (5 por defecto), 18 temas, tema libre con prioridad | N | ✅ confirmado |
| FR-003 puntos gramaticales (3 marcados por defecto); sin ninguno → "Choose at least one grammar topic." | N | ✅ confirmado |
| FR-004 tipos de writing (5 + aleatorio) | N, P (`writing`) | ✅ confirmado |
| FR-005 a FR-008 demos y contenido provisional | P (`demos`), R | ✅ confirmado |
| FR-009 encabezado (nombre, fecha, promedio, maestra), grupos y marcador de puntos | N | ✅ confirmado |
| FR-010 tipos de ejercicio | P (`demos`), R | ✅ confirmado |
| FR-011 *listening* ▶/🐢/⏹, texto visible solo al terminar; 🔊 por palabra en el dictado | N | ✅ confirmado (el audio en sí se valida en T027) |
| FR-012 a FR-014 revisión, 2 intentos, vacíos no consumen intento, pistas y respuestas | R, P (`grading`) | ✅ confirmado |
| FR-015 1 punto por reactivo en cualquier intento | P (`grading`), R | ✅ confirmado |
| FR-016 comparación tolerante | P (`grading`), R | ✅ **corregido** (espacio después del punto final; ver US1) |
| FR-017 variantes de causativos | P (`grammar`), R | ✅ confirmado |
| FR-018 la marca roja se quita al cambiar la respuesta | N | ✅ confirmado |
| FR-019 a FR-021 writing (criterios, repetible, estimación, mínimo 5 palabras) | P (`writing`), R | ✅ confirmado |
| FR-022 resultados (puntos, promedio, mensaje, tabla, repaso) | R, P (`grading`) | ✅ confirmado |
| FR-023 terminar con secciones pendientes avisa primero | N ("You still have 7 section(s) to check…") | ✅ confirmado |
| FR-024 repetir la guía / volver al menú | N | ✅ confirmado |
| FR-025 formato de las guías generadas | P (`generators`); N: Ocean Life, 5° → gvs `bank:5 rewrite:5 rewrite:5 match:9 bank:5 dictation:5 choice:5`, rl `choice:7 fill:4`, writing ✅ | ✅ confirmado |
| FR-026 gramática de plantillas; el resto en vivo | P (`grammar`, `generators`), N | ✅ confirmado |
| FR-027 dificultad por grado | P (`generators`) | ✅ confirmado |
| FR-028 filtros y atribución CC BY-SA | P (`content-filters`, `generators`); N: "Text from Simple English Wikipedia: "Ocean" (CC BY-SA)." | ✅ confirmado |
| FR-029 una respuesta correcta y opciones distintas | P (`generators`); N: 0 opciones duplicadas en las 3 guías generadas | ✅ confirmado |
| FR-030 ningún dato del alumno sale del navegador | N: nombre de prueba "Zyxwq" escrito y guía generada; no aparece en ninguna petición (`performance.getEntriesByType('resource')`) | ✅ confirmado |
| FR-030a PC, celulares e iPad | revisión con emulación (spec, Contexto) | ⏳ pendiente del recorrido en dispositivos reales (T027) |

## US2: el check en ❌ y su reversión (T024)

| Commit | Cambio | Run | Resultado | Duración |
|---|---|---|---|---|
| `60dbb8f` | mutación temporal en `demos.js` (`answers: ["a few"]` → `["few"]`) | `40146756144` | **❌ failure** — el PR muestra `✖ gvs section 1: quantifiers with the 5-word bank` (`actual: [... 'few' ...]`, `expected: [... 'a few' ...]`); `pass 79 · fail 1` | 12 s |
| `6e5c4fa` | `git revert` de `60dbb8f` | `40146785574` | **✅ success** | 10 s |

Los dos commits quedan en el historial del PR como evidencia del gate (autorizados por el usuario, Principio V).
