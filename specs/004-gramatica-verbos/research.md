# Research: Secciones de gramática y de verbos

**Feature**: `004-gramatica-verbos` · **Date**: 2026-10-24 · **Jira**: GAMES-6

## R1. Dónde viven las secciones nuevas

- **Decision**: en la misma página `English/QuizA.html`, como dos pantallas nuevas (`#grammar-screen` y `#verbs-screen`) a las que se entra desde dos tarjetas nuevas del menú. Se agregan cuatro archivos:
  - `js/verbs-data.js`: los datos de la lista propia de verbos.
  - `js/conjugation.js`: funciones puras para conjugar, buscar y armar ejemplos.
  - `js/grammar-cards.js`: los datos de las tarjetas y las funciones puras que arman sus HTML de pantalla e impresión.
  - `js/reference.js`: la interfaz de las dos pantallas.
- **Rationale**: comparte la tutora, el grado, la impresión de GAMES-3 (`#print-area` y la impresión del sistema) y la apertura con doble clic (Principio II). Separar datos (`*-data`), lógica pura y pantalla deja todo lo verificable en Node, como en GAMES-1 y GAMES-3.
- **Alternatives considered**: una página aparte (`Reference.html`): duplicaría la tutora, los estilos y la impresión, y la maestra tendría dos direcciones.

## R2. Lista propia de verbos (FR-005)

- **Decision**: unos 200 verbos en `verbs-data.js`, cada uno con:
  - la forma base en inglés;
  - sus traducciones al español en infinitivo (las reflexivas con *-se*);
  - el pasado y el participio solo cuando son irregulares, más variantes (*learned/learnt*);
  - un complemento corto para los ejemplos en inglés y en español (*eat* → "an apple" / "una manzana");
  - una marca para los verbos que casi no se usan en continuo (*know*, *like*);
  - las formas españolas irregulares que hagan falta (ver R3).
- **Rationale**: es contenido revisado y apto para niños (Principio VI), funciona sin internet (SC-001) y cubre los verbos de primaria, incluidos todos los irregulares comunes. Las formas regulares se calculan con las reglas que ya están probadas en `banks.js` (`regularPast`, cambios *-ied*, consonante doble), ampliadas a *-s* y *-ing*.
- **Alternatives considered**: depender solo de una fuente pública. Sus traducciones tienen ruido (R4) y no dan las formas irregulares de forma confiable.

## R3. Ejemplos con traducción al español (FR-006)

- **Decision**: cada ejemplo usa el sujeto "She" / "Ella", el complemento del verbo y una expresión de tiempo típica de cada tiempo verbal (*now* / *ahora*, *yesterday* / *ayer*, *already* / *ya*, *tomorrow* / *mañana*…). Por ejemplo: "She ate an apple yesterday." / "Ella comió una manzana ayer."

  La forma española se arma con 6 formas base por verbo: infinitivo, presente (3.ª persona), pretérito (3.ª persona), futuro (3.ª persona), gerundio y participio. Los tiempos compuestos salen de esas formas con sus auxiliares:

  | Tiempo | Forma española |
  |---|---|
  | present continuous | *está* + gerundio |
  | present perfect | *ha* + participio |
  | present perfect continuous | *ha estado* + gerundio |
  | past continuous | *estaba* + gerundio |
  | past perfect | *había* + participio |
  | future (*going to*) | *va a* + infinitivo |
  | future continuous | *estará* + gerundio |

  Las 6 formas base se calculan con las reglas de *-ar/-er/-ir*. Solo se guardan las excepciones: irregulares (*ser, ir, tener, hacer, poder, decir, venir, poner*…), cambios de raíz (*juega, duerme, quiere, pide*), gerundios y participios irregulares (*leyendo, hecho, dicho, visto, escrito*). Los reflexivos llevan *se* antes del verbo conjugado: "Ella se despertó temprano ayer."
- **Rationale**: con un solo sujeto en tercera persona se practica la *-s* del inglés, y en español basta con 6 formas por verbo en lugar de 6 personas × 10 tiempos. Las excepciones se prueban contra una tabla revisada a mano (SC-002).
- **Alternatives considered**: (a) escribir a mano los 10 ejemplos de cada verbo: son unas 2,000 oraciones, inviable de revisar. (b) Mostrar el ejemplo sin traducción: no cumple FR-006.

## R4. Fuente pública para verbos que no están en la lista (FR-007)

- **Decision**: **MyMemory** (`api.mymemory.translated.net`), gratuita, sin clave y con CORS (`access-control-allow-origin: *`, verificado), para traducir el verbo buscado (es → en o en → es). La respuesta se limpia:
  1. se reúnen la traducción principal y sus alternativas;
  2. se quitan "to" y "para";
  3. el candidato inglés debe ser una sola palabra que Datamuse marque como verbo (`tags` con `v`; verificado con *whisper*);
  4. el candidato español debe ser una palabra terminada en *-ar/-er/-ir(se)*;
  5. todo pasa por el filtro `UNSAFE` de `api.js`.

  El verbo encontrado se conjuga en inglés con las reglas regulares y se muestra con la marca "not reviewed". Sus ejemplos van en inglés, con el infinitivo español entre paréntesis en lugar de una traducción conjugada que podría salir mal.
- **Rationale**: verificado el 2026-10-24. "comer" → *eat* y "nadar" → *swim* salen bien directamente. "despertarse" → "despuerte" (mal), pero la alternativa *wake up* es correcta. "tocar" → "Sense of Touch" (mal), con *touch* entre las alternativas. "to whisper" → "Para susurrar", que se limpia a *susurrar*. Por eso hay que filtrar, y por eso la marca "not reviewed".
- **Privacidad (Principio VI)**: solo se envía la palabra buscada, nunca el nombre ni las respuestas del alumno.
- **Alternatives considered**: (a) Wiktionary: sus traducciones solo vienen en el HTML de cada página y son difíciles de extraer de forma confiable. (b) No consultar nada fuera de la lista: contradice la decisión del usuario.

## R5. Contenido de las tarjetas de gramática (FR-008 a FR-010)

- **Decision**: 22 tarjetas escritas a mano en `grammar-cards.js`:
  - **10 de tiempos verbales**: uso; estructura afirmativa, negativa y pregunta; palabras clave; y 2 ejemplos (inglés y español).
  - **4 de temas de las guías**: quantifiers, causative, past simple + *ago* y comparatives.
  - **8 de temas básicos**.

  Cada tema lleva una marca de si **cambia con el tiempo**:
  - **Sí cambian**: quantifiers, causative, comparatives, *there is/are* y *can*. Llevan un ejemplo escrito a mano por cada tiempo que tenga sentido. *Can* solo tiene present (*can*), past (*could*) y future (*will be able to*).
  - **No cambian**: pronombres, posesivos, artículos, plurales, preposiciones y *ago* (este último es solo de pasado). Llevan 2 ejemplos fijos, y la tarjeta lo indica: "This rule works the same in every tense."
- **Rationale**: escribir los ejemplos a mano garantiza oraciones naturales y apropiadas (Principio VI), y el volumen es revisable (unas 80 oraciones). Las pruebas verifican que cada tarjeta tenga sus elementos (FR-009) y que cada tiempo elegido tenga ejemplo cuando el tema cambia.

## R6. Impresión de tarjetas en hoja carta (FR-011, FR-012)

- **Decision**:
  - Una función pura `buildCardsPrintHtml(cards, options)` arma una cuadrícula de 2 columnas de tarjetas (cada una con borde y `break-inside: avoid`), dentro del mismo `#print-area` de GAMES-3.
  - La impresión reutiliza `window.print()` y el bloque `@media print` existente, más estilos `.print-cards`.
  - Una tarjeta muy alta (por ejemplo, un verbo con los 10 tiempos) ocupa las dos columnas (`grid-column: span 2`).
- **Rationale**: con cuadrícula y `break-inside: avoid`, Chrome reparte las tarjetas por hojas sin partirlas (comportamiento verificado en GAMES-3 R3). Dos columnas en carta dan entre 2 y 6 tarjetas por hoja, según su contenido (SC-004). Se valida con PDFs generados como en GAMES-3.
- **Alternatives considered**: columnas de CSS (`columns: 2`): reparten mejor el espacio, pero el orden de lectura va de arriba hacia abajo por columna, y con `break-inside` Safari se comporta distinto.

## R7. Pruebas (FR-014, Principio IV)

- **Decision**: tres archivos nuevos en `English/tests/`:
  - `conjugation.test.mjs`: los 10 tiempos de todos los verbos de la lista, sin formas inventadas (por ejemplo, ningún "goed"); una tabla de 30 verbos revisada a mano en inglés y en español; y la *-s* de tercera persona.
  - `verb-search.test.mjs`: español, inglés, acentos, mayúsculas, formas conjugadas en inglés (*went* → *go*), varias traducciones, y la fuente pública simulada (traducción limpia, filtro, sin conexión).
  - `grammar-cards.test.mjs`: los 22 temas, sus elementos, los tiempos por grado, ejemplos para cada tiempo elegido y el armado de la impresión.

  Las 146 pruebas de GAMES-1 y GAMES-3 no se modifican (FR-015).
- **Rationale**: las mismas herramientas de GAMES-1 (`node:test`, `node:vm`, `fetch` falso), sin red ni dependencias.

## R8. Ramas y relación con GAMES-5

- **Decision**: la rama `004-gramatica-verbos` sale de `main`. GAMES-5 (versión en las URLs, en pausa) también cambia las etiquetas `<script>` de `QuizA.html`. La historia que se integre segunda agrega sus archivos al esquema de la primera:
  - si GAMES-5 entra antes, los 4 archivos nuevos de GAMES-6 se piden con su versión;
  - si entra después, su comando de versiones los incluye.
- **Rationale**: evita bloquear GAMES-6. El posible conflicto se limita a las líneas de `<script>`, y se resuelve al rebasar, con autorización.
