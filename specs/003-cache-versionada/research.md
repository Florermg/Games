# Research: Versión de los archivos en sus URLs

**Feature**: `003-cache-versionada` · **Jira**: GAMES-5

## R1. Qué identificador de versión usar (FR-002)

- **Decision**: los **primeros 8 caracteres hexadecimales del SHA-256** del contenido de cada archivo. Antes de calcularlo, los saltos de línea `CRLF` se convierten a `LF`.
- **Rationale**:
  - El identificador cambia solo si cambia el contenido del archivo, y no cambia si el contenido es igual (FR-002). Así se conserva la caché de los archivos que no cambiaron (SC-004).
  - Es determinista: la prueba puede recalcularlo y compararlo (FR-004).
  - Con 8 caracteres hexadecimales (32 bits), una colisión entre dos versiones del mismo archivo es despreciable.
  - Normalizar los saltos de línea evita falsos rojos si alguien clona en Windows con `autocrlf`.
- **Alternatives considered**:
  - Un número de versión global por publicación: cambiaría la URL de todos los archivos aunque no cambien (viola FR-002) y obliga a recordarlo.
  - Fecha u hora de la publicación: no es determinista, así que la prueba no puede verificarla.
  - El hash del commit de git: el servidor no tiene git, y no dice qué archivo cambió.

## R2. Dónde va la versión (FR-001, FR-006, FR-008)

- **Decision**: en la consulta de la URL, `js/engine.js?v=1a2b3c4d`, dentro de `English/QuizA.html`. Los archivos conservan su nombre.
- **Rationale**:
  - Para la caché del navegador, una URL con otra consulta es otro recurso, así que se descarga aunque el archivo viejo siga guardado. No depende del servidor (FR-008).
  - Los archivos que se suben al servidor son los mismos de hoy (supuesto de la spec).
  - **Verificado con doble clic** (`file://`) en Chrome sin ventana: con las 12 URLs versionadas cargan los 11 scripts (`togglePrintPanel`, `openReference` y los 215 verbos) y se aplica el CSS (FR-006). Safari se revisa en el quickstart.
- **Alternatives considered**:
  - Renombrar archivos (`engine.1a2b3c4d.js`): obliga a subir y borrar archivos en el servidor en cada publicación, y rompe las rutas de las pruebas y de los *harness*.
  - Un *service worker*: no funciona con `file://` y agrega complejidad (Principio II).
  - Cabeceras del servidor: fuera de alcance por decisión del usuario.

## R3. El comando que actualiza las versiones (FR-003)

- **Decision**: `npm run versions` ejecuta `English/tools/stamp-versions.mjs`, que hace dos cosas:
  - Reescribe en `QuizA.html` cada `src="js/…"` y `href="css/…"` local con el `?v=` del contenido actual, reemplazando el que tenga o agregándolo si falta.
  - Imprime qué archivos cambiaron de versión.

  La lógica (leer las referencias, calcular y reescribir) vive en un módulo puro, `English/tools/versions.mjs`, que usan el comando y la prueba.
- **Rationale**:
  - Un solo comando, sin dependencias (Node 24, como las pruebas), idempotente: correrlo dos veces no cambia nada.
  - Las URLs externas (`https://…`) no se tocan.
- **Alternatives considered**:
  - Editar las versiones a mano: propenso a errores, y la prueba lo detectaría, pero sin ayuda.
  - Un *hook* de git que lo haga solo: es configuración local de cada clon, invisible y fácil de saltar. Puede agregarse después.

## R4. La prueba que impide publicar sin versión (FR-004, SC-003)

- **Decision**: `English/tests/versions.test.mjs`, dentro de `npm test` y por lo tanto del check `Tests`. Falla en tres casos:
  - La página pide un archivo propio (`js/`, `css/`) sin `?v=`.
  - La página pide un archivo que no existe.
  - El `?v=` de un archivo no coincide con el hash de su contenido actual.

  El mensaje nombra el archivo y dice: "run `npm run versions`". Una prueba aparte comprueba que el comando no cambia nada si ya está todo al día.
- **Rationale**: es el mismo gate que ya bloquea el cierre de historias (Principio IV). Comprueba el contenido, no solo la forma.
- **Alternatives considered**: un paso aparte en el workflow. Es más trabajo, y localmente no correría con `npm test`.

## R5. Qué cuenta como "archivo propio"

- **Decision**: las 12 referencias locales de `QuizA.html` (1 CSS y 11 JS). Los *harness* de `specs/*/validate-print/` y las pruebas cargan los archivos sin versión: son herramientas de desarrollo, no se publican, y quedan fuera.
- **Rationale**: es lo que el navegador del usuario guarda en caché. `QuizA.html` no se versiona, porque el servidor lo entrega sin caché (supuesto de la spec).

## R6. Cómo comprobar en producción que llegó la versión nueva (FR-007, SC-001)

- **Decision**: el README explica dos formas:
  - En la consola del navegador, `[...document.scripts].map(s => s.src)` muestra las URLs con su `?v=`.
  - En la pestaña Network, los archivos cambiados aparecen descargados (200) y los demás *from disk cache*.

  Para SC-001: en el Chrome donde se reprodujo el bug, abrir `https://nutritrack.mx/quiz/QuizA.html` sin recargar a la fuerza, probar 🖨 Print y la pantalla Verbs, y confirmar que la consola no tiene errores.
- **Rationale**: no requiere herramientas extra y sirve igual en PC.

## R7. Impacto en las pruebas y en GAMES-1 a GAMES-6

- **Decision**:
  - `tests/helpers/game-context.mjs` carga los scripts por nombre de archivo, sin URL, así que no cambia.
  - `responsive.test.mjs`, que lee el CSS, y las demás pruebas no se ven afectadas.
  - La huella del recorrido de GAMES-1 no depende de las URLs (SC-005): se vuelve a medir para confirmarlo.
  - Desde esta historia, cualquier cambio a `js/` o `css/` (por ejemplo GAMES-2) debe correr `npm run versions` antes del commit: la prueba lo recuerda.
