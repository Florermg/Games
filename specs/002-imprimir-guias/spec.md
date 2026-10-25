# Feature Specification: Imprimir guías (hoja para el alumno y clave de respuestas)

**Feature Branch**: `002-imprimir-guias` (creada a partir de `001-linea-base-quality-gate`)

**Created**: 2026-10-24

**Status**: Draft

**Jira**: GAMES-3 (Historia) · **Modo de ejecución**: `in-all-process` · **Depende de**: GAMES-1

**Input**: User description: "Imprimir guías del juego de inglés (English/). Modo de ejecución: in-all-process. Rama: crear 002 a partir de 001-linea-base-quality-gate. Debe existir un botón "Print" dentro de cada guía abierta (demos o guías generadas, de los tres tipos: Grammar, Vocabulary & Spelling; Reading & Listening; Writing) que permita imprimir dos versiones: (1) la hoja en blanco para el alumno, con el formato de los PDFs de English/documentacion (encabezado Name, Group, R.N, Date, Average, Teacher; instrucciones con "(one point each)"; espacios y líneas para contestar a mano; banco de palabras; tabla de relacionar; opciones a/b/c para encerrar; renglones del dictado y del writing con su "Remember" y criterios), y (2) la clave de respuestas para la maestra, con las respuestas correctas. Lo que el alumno haya contestado en pantalla no se imprime. Sin botón en el menú."

## Contexto y decisiones de diseño

- **Origen**: la maestra quiere llevar al aula, en papel, tanto las guías del 1er trimestre como las guías nuevas que genera el juego, y tener con qué calificarlas a mano. Hoy el juego solo se puede usar en pantalla.
- **Decisiones del usuario** (2026-10-24, antes de escribir esta spec): se imprimen dos versiones, la **hoja en blanco para el alumno** y la **clave de respuestas para la maestra**. No se imprime lo que el alumno contestó en pantalla, y el botón vive **dentro de la hoja abierta**, no en el menú.
- **Referencia de formato**: los tres PDFs de `English/documentacion/`. Su encabezado es "Name: ___ Group: ___ R.N: ___ Date: ___ Average: ___ Teacher: …"; Reading & Listening y Writing llevan además la línea "Colegio Reims School year 2026-2027". Las instrucciones van numeradas y con "(one point each)"; los espacios para contestar son líneas (`_________`); las opciones son "a) b) c)", para encerrar; el dictado tiene renglones numerados; y el writing tiene "Remember", 8 renglones, "Criteria" y "Total ____ / 10".
- **Relacionar palabras**: en el PDF la tabla "Término / Definición" aparece con cada palabra junto a su definición correcta, es decir, resuelta. En la hoja para el alumno las definiciones se imprimen en el orden de sus letras (a, b, c…), con un espacio junto a cada palabra para escribir la letra, como en pantalla. La versión resuelta va en la clave.
- **Contenido que la maestra lee en voz alta**: el dictado y el *listening* dependen de que alguien lea. En papel no hay audio, así que esos textos (las palabras del dictado y el guion del *listening*) van en la clave de la maestra y **nunca** en la hoja del alumno.
- **Guías generadas**: la guía existe solo mientras está abierta (el juego no guarda guías; comportamiento de la línea base de GAMES-1). Por eso la hoja y la clave se imprimen de la misma guía abierta, sin volver a generarla.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Imprimir la hoja en blanco para el alumno (Priority: P1) 🎯 MVP

Como maestra, quiero imprimir cualquier guía que tenga abierta (una demo o una guía que acabo de generar) como una hoja en blanco con el formato de mis guías en papel, para que mis alumnos la contesten a mano en el salón.

**Why this priority**: es el uso principal: llevar la guía al aula. Sin la hoja del alumno, la clave no sirve de nada.

**Independent Test**: abrir cada una de las tres demos y una guía generada de cada tipo, elegir imprimir la hoja del alumno y comprobar, en la vista previa de impresión o en un PDF guardado, que se ven el encabezado, las instrucciones y todos los ejercicios con espacios para contestar, y ninguna respuesta.

**Acceptance Scenarios**:

1. **Given** la demo de Grammar, Vocabulary & Spelling abierta, **When** la maestra imprime la hoja del alumno, **Then** salen el encabezado (Name, Group, R.N, Date, Average y Teacher: Aurora Corante) y las 7 secciones en el orden de la demo: *quantifiers* con su banco de palabras y espacios; causativos y *ago* con una línea de respuesta por reactivo; la tabla para relacionar con un espacio para la letra; el banco de 9 palabras con espacios; el dictado con 5 renglones numerados; y "Circle the correct Spelling word" con sus opciones a) b) c).
2. **Given** la demo de Reading & Listening abierta, **When** imprime la hoja del alumno, **Then** salen la línea de la escuela, el texto completo de Jordan Jacobs, las 7 preguntas con opciones a) b) c), y "Listen. Complete the information" con sus espacios, **sin** el guion del audio.
3. **Given** la demo de Writing abierta, **When** imprime la hoja del alumno, **Then** salen la consigna, "Remember", 8 renglones para escribir, los 5 criterios con sus puntos y "Total ____ / 10".
4. **Given** una guía generada abierta, **When** imprime la hoja del alumno, **Then** sale con el mismo formato que la demo de su tipo, con el grado y el tema en el subtítulo, y con la fuente del texto cuando es de Wikipedia (CC BY-SA).
5. **Given** que el alumno ya contestó secciones en pantalla, **When** se imprime la hoja del alumno, **Then** no aparece ninguna de sus respuestas, marcas de correcto o incorrecto, pistas ni puntos.

---

### User Story 2 - Imprimir la clave de respuestas para la maestra (Priority: P2)

Como maestra, quiero imprimir la clave de respuestas de la misma guía, para calificar a mano y para leer en voz alta el dictado y el *listening*.

**Why this priority**: completa el uso en papel. Sin la clave, la maestra tendría que resolver cada guía generada antes de calificarla, y no tendría el texto del dictado ni del audio.

**Independent Test**: con la misma guía abierta del escenario anterior, imprimir la clave y comprobar, reactivo por reactivo, que cada respuesta coincide con la que el juego acepta en pantalla.

**Acceptance Scenarios**:

1. **Given** cualquier guía abierta, **When** la maestra imprime la clave, **Then** el encabezado la identifica claramente como "ANSWER KEY" (para no confundirla con la hoja del alumno) y cada reactivo muestra su respuesta correcta en el lugar donde el alumno escribiría o encerraría.
2. **Given** una sección de reescritura (causativos o *ago*), **When** se imprime la clave, **Then** cada reactivo muestra la respuesta principal y menciona que hay otras formas válidas cuando las hay (por ejemplo, "had/got" o el tiempo al inicio).
3. **Given** el dictado y el *listening*, **When** se imprime la clave, **Then** aparecen las palabras del dictado en orden y el guion completo del audio, marcados como texto para leer en voz alta.
4. **Given** la sección de writing, **When** se imprime la clave, **Then** aparecen los 5 criterios con sus puntos como rúbrica para calificar, sin un texto "correcto".
5. **Given** que la maestra imprimió la hoja del alumno de una guía generada, **When** imprime la clave sin cerrar la guía, **Then** la clave corresponde exactamente a esa hoja (mismas preguntas, mismo orden de opciones y mismas letras).

---

### User Story 3 - Imprimir desde cualquier dispositivo y guardar como PDF (Priority: P3)

Como maestra, quiero poder imprimir (o guardar como PDF para imprimir después) desde la PC, el celular o el iPad, para preparar las guías donde me quede más cómodo.

**Why this priority**: amplía dónde se usa la impresión. El valor principal (US1 y US2) existe aunque al inicio solo se use desde la PC.

**Independent Test**: desde una PC, un iPad y un celular, abrir una guía, imprimir la hoja del alumno y la clave con la impresión del sistema (o "Guardar como PDF") y revisar que el resultado sea legible y completo.

**Acceptance Scenarios**:

1. **Given** una guía abierta en PC, iPad o celular, **When** la maestra toca el botón de imprimir y elige una versión, **Then** se abre la impresión del sistema, desde la que también se puede guardar como PDF.
2. **Given** el documento impreso, **When** se revisa en papel tamaño carta, **Then** no aparecen elementos de la pantalla (botones, tutora, marcador de puntos ni menú), ningún reactivo queda partido entre dos páginas y el texto se lee sin zoom.
3. **Given** que la maestra canceló la impresión o terminó de imprimir, **When** vuelve a la pantalla, **Then** la hoja sigue exactamente como estaba (respuestas, intentos y puntos sin cambios).

---

### Edge Cases

- **Guía con secciones ya revisadas en pantalla**: la hoja del alumno sale igualmente en blanco y la clave sale completa (FR-007).
- **Guía generada sin algunas secciones** (por ejemplo, un tema que no dio suficientes palabras para el banco): se imprimen solo las secciones que tiene la guía, con la misma numeración que en pantalla.
- **Textos largos** (lectura de Reading con 11 oraciones en 6° grado, o el banco de palabras de 9): pueden ocupar varias páginas, pero ningún reactivo queda partido entre páginas, y el texto de la lectura se mantiene antes de sus preguntas.
- **Writing generado sin internet** (sin palabras útiles ni dato del tema): se imprime sin esos recuadros.
- **Sin conexión a internet**: imprimir no necesita internet. Funciona igual con una demo o con una guía generada que ya esté abierta.
- **Navegador sin impresión disponible** (por ejemplo, algunos navegadores integrados en otras apps del celular): el botón no debe dejar la pantalla bloqueada; si la impresión no se abre, la hoja sigue usable.
- **Pantalla de resultados**: la impresión se ofrece en la hoja abierta (FR-001); en la pantalla de resultados no hay botón (fuera de alcance).

## Requirements *(mandatory)*

### Functional Requirements

**Botón y versiones**

- **FR-001**: Toda guía abierta (las tres demos y las guías generadas de los tres tipos) DEBE mostrar un botón para imprimir, visible sin tener que bajar hasta el final de la hoja. El menú NO DEBE tener botón de imprimir.
- **FR-002**: Al usar el botón, la maestra DEBE poder elegir entre dos versiones: "Student sheet" (hoja del alumno) y "Answer key" (clave). Cada elección abre la impresión del sistema con esa versión.
- **FR-003**: La impresión DEBE abrirse con la función de impresión del dispositivo, que también permite guardar como PDF. El juego no genera ni descarga archivos (Principio VI).

**Hoja para el alumno**

- **FR-004**: El encabezado DEBE seguir el de los PDFs: línea de la escuela cuando la guía la tiene, título, subtítulo, y "Name: ___ Group: ___ R.N: ___ Date: ___ Average: ___ Teacher: ___", con el nombre de la maestra cuando la guía lo tiene (demos) o un espacio en blanco (guías generadas). Name, Date y Average siempre salen en blanco, aunque el alumno haya escrito su nombre en pantalla.
- **FR-005**: Cada sección DEBE imprimirse con su instrucción tal como en pantalla (numeración, palabras en cursiva y "(one point each)") y en el mismo orden, con su grupo (Grammar, Vocabulary, Spelling, Reading, Listening, Writing).
- **FR-006**: Cada tipo de ejercicio DEBE imprimirse así:
  - **Banco de palabras**: el banco completo y cada oración con una línea en el espacio.
  - **Reescribir u oración con *ago***: el enunciado y una línea completa debajo.
  - **Completar (incluido el *listening*)**: la oración con una línea en el espacio.
  - **Relacionar**: cada palabra numerada con un espacio para la letra, y la lista de definiciones con sus letras en orden.
  - **Opción múltiple**: la pregunta, si existe, y sus opciones como "a) … b) … c) …"; con el texto de lectura completo antes de las preguntas cuando la sección lo tiene.
  - **Dictado**: renglones numerados en blanco, uno por palabra.
  - **Writing**: la consigna, "Remember", el recuadro de palabras útiles y dato del tema cuando existen, 8 renglones, "Criteria" con los puntos de cada criterio y "Total ____ / 10".
- **FR-007**: La hoja del alumno NO DEBE contener nada de lo hecho en pantalla (respuestas, opciones elegidas, marcas de correcto o incorrecto, pistas, respuestas mostradas, puntos ni resultados de la autoevaluación de writing) ni ningún contenido que revele respuestas (las palabras del dictado, el guion del *listening* ni las explicaciones).
- **FR-008**: Las fuentes CC BY-SA de los textos generados DEBEN aparecer en la hoja impresa, junto al texto que atribuyen (Principio VI).

**Clave de respuestas**

- **FR-009**: La clave DEBE tener el mismo contenido y orden que la hoja del alumno de la misma guía, con el encabezado marcado claramente como "ANSWER KEY", y en cada reactivo la respuesta correcta en lugar del espacio: la palabra del banco, la oración, la letra de la definición o la opción correcta marcada.
- **FR-010**: En los reactivos que aceptan varias formas (causativos, *ago*, *listening*), la clave DEBE mostrar la respuesta principal e indicar que hay otras formas válidas, listando al menos una.
- **FR-011**: La clave DEBE incluir, como texto para leer en voz alta, las palabras del dictado en orden y el guion completo del *listening*.
- **FR-012**: En writing, la clave DEBE mostrar los 5 criterios con sus puntos como rúbrica, sin texto modelo.
- **FR-013**: La clave DEBE generarse a partir de la misma guía abierta que la hoja del alumno: imprimir no vuelve a generar ni cambia el orden de reactivos u opciones.

**Formato impreso**

- **FR-014**: Lo impreso NO DEBE incluir elementos de la pantalla: botones, la tutora y su burbuja, el marcador de puntos, el menú ni avisos.
- **FR-015**: Lo impreso DEBE caber en papel tamaño carta, en blanco y negro, con letra legible sin zoom, y ningún reactivo (enunciado con sus opciones o su línea) DEBE quedar partido entre dos páginas.
- **FR-016**: Imprimir (o cancelar la impresión) NO DEBE cambiar el estado de la hoja en pantalla: respuestas, intentos, puntos y resultados siguen igual.
- **FR-017**: Imprimir DEBE funcionar sin internet.
- **FR-018**: La impresión DEBE poder usarse en PC, celulares Android e iPhone, e iPad, desde la impresión de cada sistema (incluido "Guardar como PDF" cuando el sistema lo ofrece).

**Calidad (Principio IV)**

- **FR-019**: El contenido de ambas versiones DEBE estar cubierto por pruebas automáticas para las tres demos y para guías generadas: que la hoja del alumno no revele respuestas (FR-007) y que la clave contenga la respuesta correcta de cada reactivo (FR-009 a FR-011).

### Key Entities

- **Versión impresa**: una de dos vistas de la misma guía abierta: "Student sheet" o "Answer key". Tiene encabezado, secciones en el orden de la guía y pie con las fuentes.
- **Encabezado impreso**: escuela (opcional), título, subtítulo, campos Name, Group, R.N, Date, Average y Teacher; en la clave, además, la marca "ANSWER KEY".
- **Sección impresa**: la instrucción de la sección y sus reactivos en formato de papel (espacios, líneas, opciones o renglones).
- **Texto para leer en voz alta**: palabras del dictado y guion del *listening*, solo en la clave.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde una guía abierta, la maestra llega a la vista previa de impresión de cualquiera de las dos versiones en 2 toques o clics.
- **SC-002**: El 100% de los reactivos de las tres demos aparece en la hoja del alumno impresa, y ninguna de sus respuestas aparece en ella.
- **SC-003**: El 100% de los reactivos de las tres demos y de una guía generada de cada tipo tiene en la clave la misma respuesta que el juego acepta en pantalla.
- **SC-004**: Las versiones impresas de las tres demos en papel carta no muestran elementos de la pantalla ni reactivos partidos entre páginas (revisión de la vista previa o del PDF de las 6 versiones: 3 demos × 2).
- **SC-005**: Una persona que compara la hoja del alumno de cada demo con su PDF de `English/documentacion` reconoce el mismo encabezado, las mismas instrucciones y los mismos ejercicios en el mismo orden.
- **SC-006**: La impresión funciona en una PC, un iPad, un iPhone y un celular Android (vista previa o PDF correctos en los cuatro).
- **SC-007**: Después de imprimir y cancelar, la hoja en pantalla conserva el 100% de sus respuestas, intentos y puntos.

## Assumptions

- "Imprimir" usa la impresión del navegador o del sistema operativo. Elegir impresora, número de copias, márgenes y "Guardar como PDF" lo resuelve ese diálogo; el juego no administra impresoras.
- El papel es tamaño carta (el estándar en México); si la impresora usa A4, el sistema ajusta la página.
- La hoja del alumno no se personaliza por alumno: Name, Group, R.N y Date siempre salen en blanco, para fotocopiarla o imprimir varias copias.
- El botón se ofrece en la hoja abierta y no en la pantalla de resultados ni en el menú (decisión del usuario).
- Las brechas táctiles conocidas de GAMES-2 (tamaño de botones y letra) aplican también al botón nuevo en celular; esta historia no las corrige, pero el botón nuevo no debe empeorarlas.
- Las guías siguen sin guardarse: si la maestra cierra una guía generada sin imprimirla, no se puede recuperar (comportamiento de la línea base, fuera de alcance).
