# Research: Cuaderno con revisión de gramática (GAMES-13)

## R1. Revisor en línea

- **Decision**: API pública de LanguageTool, `POST https://api.languagetool.org/v2/check` con `text` y `language=en-US` en el cuerpo (formulario), no en la URL.
- **Rationale**: gratis, sin clave y con CORS abierto (`access-control-allow-origin: *`, verificado el 2026-10-25), así que funciona desde `file://` y desde nutritrack.mx. Ir en el cuerpo evita que el texto del alumno quede en registros de URL. Los desplazamientos de cada error son en unidades UTF-16, igual que las cadenas de JavaScript.
- **Límites**: 20 peticiones por minuto, 20 KB por texto, 75 KB por minuto. Se limita la página a 5,000 caracteres y solo se consulta al tocar el botón.
- **Alternatives considered**: GET con el texto en la URL (rechazado por privacidad); Datamuse para la ortografía (no revisa gramática); un modelo de lenguaje (requiere clave y servidor).

## R2. Reglas del juego

- **Decision**: reglas escritas a mano sobre las palabras del texto, con sus posiciones, en un archivo puro sin DOM (`js/notebook-check.js`), probado en Node.
- **Rationale**: LanguageTool no detecta errores típicos de primaria como "Yesterday I go"; y la opción 1c exige revisión sin internet.
- **Formas de los verbos**: de la lista revisada `VERBS` y `englishForms` (GAMES-6), así que se reconocen sus formas base, con *-s*, en pasado y participio. Se ignoran los verbos cuyo pasado es igual a la forma base (*put, cut, read*), porque no se puede saber el tiempo.
- **Falsos positivos**: se evitan con contexto. No se marca el verbo después de un pronombre si antes del pronombre hay un auxiliar o modal (*Does she play?*, *Can he swim?*) o un verbo de percepción o permiso (*let, make, see, hear, watch, help*). *If I were* y *I wish I were* no se marcan. *an hour* y *a university* son excepciones de *a / an*.
- **Prueba de no falsos positivos**: todas las oraciones correctas del juego (ejemplos de las tarjetas de gramática, ejemplos de los verbos en los 10 tiempos, la carta de la demo Writing).

## R3. Guardado

- **Decision**: `localStorage`, clave `games-notebook-v1`, un JSON con la lista de páginas y la preferencia de la revisión en línea. Cada lectura y escritura va dentro de `try/catch`.
- **Rationale**: no requiere servidor y funciona con doble clic. En modo privado o con el guardado bloqueado, el cuaderno sigue en memoria y lo avisa (FR-009).

## R4. Marcas en el texto y "Use this"

- **Decision**: el texto revisado se pinta en un bloque aparte, debajo del área de escritura, con `<mark>` numerados; el área de escritura sigue siendo un `<textarea>` normal.
- **Rationale**: un `<textarea>` no puede tener marcas por dentro, y un editor `contenteditable` es frágil en iPhone. Al aplicar una sugerencia, una función pura cambia el texto, quita esa marca, recorre las posiciones de las marcas que siguen y descarta las que se encimaban. Así no hace falta volver a consultar LanguageTool.

## R5. Impresión

- **Decision**: la hoja se arma con `buildNotebookPrintHtml` y se pone en `#print-area`, igual que las guías y las tarjetas. Si el texto cambió después de la última revisión, se revisa con las reglas del juego antes de imprimir, y la hoja dice qué revisión se usó.
- **Rationale**: `window.print()` debe llamarse en el mismo toque del usuario (en iPhone, después de esperar una respuesta de red se puede bloquear), así que no se consulta LanguageTool al imprimir.
