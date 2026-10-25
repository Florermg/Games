# Feature Specification: Línea base y quality gate del juego de inglés

**Feature Branch**: `001-linea-base-quality-gate`

**Created**: 2026-10-24

**Status**: Draft

**Jira**: GAMES-1 (Historia) · **Modo de ejecución**: `in-all-process`

**Input**: User description: "Línea base y quality gate del juego de inglés (English/). Modo de ejecución: in-all-process. Documentar como especificación el comportamiento actual de las tres guías de estudio (Grammar, Vocabulary & Spelling; Reading & Listening; Writing): las demos tal cual los PDFs de English/documentacion, la generación de guías nuevas por grado y tema desde APIs públicas (Datamuse, Wiktionary, Simple English Wikipedia), la revisión con 2 intentos por sección, un punto por reactivo, pistas, respuestas correctas, autoevaluación de writing y resultados con promedio sobre 10. Además, establecer una red de seguridad: pruebas automáticas de la lógica del juego (validación de respuestas, reglas gramaticales, generadores y filtros de contenido, con las APIs externas simuladas para no depender de la red) y un quality gate en GitHub Actions que bloquee cambios si las pruebas fallan. Sin cambiar el comportamiento visible del juego."

## Clarifications

### Session 2026-10-24

- Q: ¿Qué tan duro es el bloqueo del quality gate, dado que la cuenta gratuita de GitHub no permite reglas de protección de rama en repos privados? → A: Bloqueo de proceso (opción A): el fallo queda visible en el cambio y el Principio IV impide cerrar la historia en Jira; el repositorio sigue privado y sin costo.
- Q: El juego debe funcionar en PC, celulares e iPads; ¿se arregla en esta historia? → A: No. Esta historia agrega las tres plataformas como objetivo, documenta las brechas encontradas y deja pruebas pendientes que las describen; los arreglos visibles van en la siguiente historia (GAMES-2). La validación incluye un recorrido en dispositivos reales (iPhone, iPad, Android y PC), que el usuario tiene disponibles.
- Q: Las pruebas encontraron que una respuesta con espacio después del punto final ("…two years ago. ") se marca como incorrecta, lo que contradice FR-016; ¿se arregla aquí? → A: Sí. Es la única excepción a FR-038 en esta historia: el código pasa a cumplir FR-016 tal como ya estaba especificado.

## Contexto y decisiones de diseño

- **Origen**: el juego de `English/` se construyó antes de adoptar Spec Kit. La constitución 1.0.0 lo trata como *línea base heredada* (Principio I): su comportamiento se documenta en una spec antes de modificarlo de forma no trivial. Además, el Principio IV quedó con `TODO(QUALITY_GATE_SETUP)` porque aún no hay pruebas ni CI. Esta historia resuelve ambas cosas.
- **Comportamiento verificado, no supuesto**: los requisitos de "Comportamiento de la línea base" (FR-001 a FR-030) describen lo que el juego hace hoy (commit `9ae5667`), verificado en el navegador el 2026-10-24. No se agrega ni cambia comportamiento visible en esta historia.
- **Contenido de las demos que no viene en los PDFs**: el PDF de Reading & Listening no incluye el guion del audio, y el de Grammar no incluye las palabras del dictado. Hoy el juego usa contenido provisional: un guion escrito para el ejercicio (respuestas *school*, *bake sale*, *Friday*, *cakes or cookies*) y, como dictado, las mismas cinco palabras de "Circle the correct spelling". Esta historia lo documenta como provisional; reemplazarlo por el contenido real de la maestra queda fuera de alcance.
- **Plataformas objetivo**: PC (Chrome, Edge, Safari), celulares (Android con Chrome, iPhone con Safari) e iPad (Safari). Revisión de la línea base en Chrome emulando 375 px (celular) y 805 px (iPad), 2026-10-24: ninguna pantalla se sale horizontalmente en el menú ni en las tres demos. **Brechas encontradas** (se corrigen en GAMES-2, no en esta historia):
  1. Los campos de texto y las listas usan letra menor a 16 px (33 campos solo en la demo de gramática); en iPhone/iPad Safari hace zoom al tocarlos.
  2. Varios controles táctiles miden menos de 44 px de alto (botones de 30–34 px, campos de 32–34 px, casillas de gramática de 13 px).
  3. En celular, las definiciones de "Match" quedan debajo de las 9 palabras y obligan a subir y bajar para relacionar.
  4. En celular, la burbuja fija de la tutora ocupa 12–14% de la pantalla y tapa el reactivo superior.
  No se pudo verificar en esa revisión Safari real (lectura en voz alta en iOS/iPadOS y selectores nativos); se verifica en el recorrido en dispositivos reales.
- **Bug encontrado durante la implementación** (prueba de `grading.test.mjs`, 2026-10-24): el juego quitaba la puntuación final *antes* de quitar los espacios, así que una respuesta correcta terminada en punto y espacio (algo que el teclado de celular y de iPad agrega solo) se marcaba como incorrecta. FR-016 ya especificaba el comportamiento correcto; el código se corrige en esta historia (ver Clarifications).
- **Restricción encontrada al especificar**: el repositorio es privado en una cuenta de GitHub gratuita, y GitHub no permite reglas de protección de rama en ese caso (verificado: la API responde "Upgrade to GitHub Pro or make this repository public"). Por eso "bloquear un cambio" no puede significar, hoy, que GitHub impida técnicamente integrarlo (ver FR-037).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Detectar automáticamente si un cambio rompe el juego (Priority: P1) 🎯 MVP

Como desarrollador del juego, quiero un conjunto de pruebas automáticas que verifique el comportamiento actual de las guías sin depender de internet, para saber en minutos si un cambio rompió algo que los alumnos usan (que una respuesta correcta se marque como incorrecta, que una regla gramatical cambie o que un filtro de contenido deje pasar algo no apto).

**Why this priority**: es la red de seguridad que habilita todo el trabajo futuro. Sin ella, cada cambio al juego se valida a mano en el navegador y las regresiones llegan al aula.

**Independent Test**: ejecutar las pruebas en una computadora sin conexión a internet: deben terminar en verde. Luego introducir a propósito una regresión en cada área cubierta (por ejemplo, que "a few" deje de aceptarse o que el filtro de contenido no rechace una palabra prohibida) y comprobar que al menos una prueba falla y señala el área afectada.

**Acceptance Scenarios**:

1. **Given** el juego en su estado actual, **When** se ejecutan las pruebas sin conexión, **Then** todas pasan y el resultado indica cuántas pruebas se ejecutaron.
2. **Given** un cambio que hace que una respuesta válida de una demo (por ejemplo, "Yesterday, I had my car washed") deje de aceptarse, **When** se ejecutan las pruebas, **Then** al menos una falla e identifica la regla de validación afectada.
3. **Given** un cambio que altera una regla gramatical (por ejemplo, el pasado de "stop" deja de ser "stopped"), **When** se ejecutan las pruebas, **Then** al menos una falla.
4. **Given** un cambio que debilita el filtro de contenido no apto, **When** se ejecutan las pruebas, **Then** al menos una falla.
5. **Given** respuestas simuladas de las fuentes externas, **When** se prueban los generadores de guías, **Then** las guías generadas cumplen el formato de su tipo (secciones, número de reactivos, una sola respuesta correcta por reactivo, sin opciones duplicadas) sin hacer ninguna petición real a internet.

---

### User Story 2 - Quality gate en cada cambio publicado (Priority: P2)

Como responsable del proyecto, quiero que cada cambio que se sube al repositorio ejecute las pruebas automáticamente y quede marcado como aprobado o fallido, para no depender de que alguien se acuerde de correrlas antes de dar una historia por terminada.

**Why this priority**: convierte la red de seguridad de la US1 en un gate del proceso (Principio IV). Depende de la US1: sin pruebas no hay nada que ejecutar.

**Independent Test**: subir un cambio con las pruebas en verde y comprobar que el repositorio lo marca como aprobado; subir un cambio con una prueba rota a propósito y comprobar que lo marca como fallido y que el fallo es visible en el cambio propuesto y en la rama principal.

**Acceptance Scenarios**:

1. **Given** un cambio subido a la rama principal o propuesto para integrarse a ella, **When** termina la verificación automática, **Then** el cambio queda marcado como aprobado si todas las pruebas pasan, o como fallido si alguna falla.
2. **Given** un cambio marcado como fallido, **When** alguien revisa el cambio propuesto, **Then** ve cuál prueba falló sin tener que ejecutar nada en su computadora.
3. **Given** una historia cuyo último cambio está marcado como fallido, **When** se intenta cerrarla en Jira, **Then** el proceso del Principio IV impide cerrarla hasta corregir el fallo (bloqueo de proceso, FR-037).

---

### User Story 3 - Saber exactamente qué hace hoy el juego (Priority: P3)

Como maestra o responsable del proyecto, quiero una descripción clara y verificable de lo que hacen hoy las tres guías (demos, guías generadas, revisión, puntuación y resultados), para decidir los siguientes cambios sobre una base conocida y para que las pruebas tengan una referencia contra la cual comparar.

**Why this priority**: la descripción en sí es esta spec. Su valor es servir de contrato para la US1 y para las historias futuras; no entrega funcionalidad nueva al alumno.

**Independent Test**: recorrer en el navegador cada requisito FR-001 a FR-030 sobre las tres demos y una guía generada de cada tipo, y confirmar que el juego se comporta como está descrito.

**Acceptance Scenarios**:

1. **Given** esta spec y el juego en el commit de línea base, **When** una persona recorre cada requisito de comportamiento en el navegador, **Then** todos se cumplen tal como están escritos.
2. **Given** que esta historia está terminada, **When** se comparan las tres demos antes y después de la historia, **Then** el contenido, la revisión, la puntuación y los resultados son idénticos.

---

### Edge Cases

- **Sin conexión a internet**: las demos funcionan. Generar una guía de gramática muestra "Could not reach the dictionary API. Check your internet connection."; generar una de writing continúa sin palabras útiles ni dato del tema. **Brecha conocida**: generar una de reading muestra el error técnico del navegador (por ejemplo, "Failed to fetch") en lugar de un mensaje claro, lo que incumple el Principio VI. Se registra para una historia posterior porque esta no cambia comportamiento visible (FR-038).
- **Fuente externa saturada** (límite de peticiones): se muestra "The online dictionary is busy right now. Please wait a minute and try again." y se puede reintentar.
- **Tema sin suficiente material** (pocas palabras o texto corto): se muestra un mensaje pidiendo otro tema; un texto corto produce una lectura más corta (mínimo 5 oraciones) en lugar de fallar.
- **Navegador sin lectura en voz alta**: el dictado y el *listening* muestran un aviso recomendando otro navegador; el resto de la guía funciona.
- **Revisar con reactivos vacíos**: no se revisa ni se consume un intento; Anya-chan pide responder todo.
- **Terminar con secciones sin revisar**: el primer intento de terminar avisa cuántas faltan; el segundo muestra los resultados contando esas secciones con 0 puntos.
- **Pruebas y aleatoriedad**: los generadores eligen al azar; las pruebas no deben fallar de forma intermitente por eso (deben ser repetibles).

## Requirements *(mandatory)*

### Functional Requirements

#### Comportamiento de la línea base (lo que el juego hace hoy y debe seguir haciendo)

**Menú**

- **FR-001**: El menú DEBE mostrar un campo opcional para el nombre del alumno y tres tarjetas de guía (Grammar, Vocabulary & Spelling; Reading & Listening; Writing), cada una con una acción para abrir su demo y otra para generar una guía nueva.
- **FR-002**: Para las guías nuevas, el menú DEBE permitir elegir el grado (3°, 4°, 5° o 6°; 5° por defecto) y un tema de una lista de 18 temas, o escribir un tema libre en inglés que tiene prioridad sobre la lista.
- **FR-003**: Para la guía de gramática nueva, el menú DEBE permitir elegir los puntos gramaticales (quantifiers, causative verbs, past simple + ago, comparatives; los tres primeros marcados por defecto) y no generar la guía si no hay ninguno marcado.
- **FR-004**: Para la guía de writing nueva, el menú DEBE permitir elegir el tipo de texto (carta sobre un evento comunitario, email a un amigo, cuento corto, párrafo de opinión, invitación) o uno aleatorio.

**Demos (tal cual los PDFs de `English/documentacion/`)**

- **FR-005**: La demo de Grammar, Vocabulary & Spelling DEBE contener, en este orden y con los textos del PDF: completar con *all/most/some/a few/no* (5), reescribir con causativos (5), oraciones con *ago* (5), relacionar 9 palabras con sus definiciones, completar 4 oraciones con un banco de 9 palabras, dictado (5) y encerrar la ortografía correcta (5, con 3 opciones cada una).
- **FR-006**: La demo de Reading & Listening DEBE contener el texto de Jordan Jacobs con sus 7 preguntas de 3 opciones, y el ejercicio "Listen. Complete the information" con 4 espacios.
- **FR-007**: La demo de Writing DEBE contener la consigna de la carta sobre un evento comunitario, los 4 puntos de "Remember", 8 renglones y los 5 criterios de 2 puntos cada uno (total 10).
- **FR-008**: El guion del *listening* y las palabras del dictado de las demos son contenido provisional (ver Contexto) y DEBEN mantenerse como están en esta historia.

**Hoja de trabajo**

- **FR-009**: Cada guía DEBE mostrarse como una hoja con encabezado (escuela cuando aplica, título, subtítulo, nombre del alumno, fecha, promedio y maestra en las demos), secciones agrupadas (Grammar, Vocabulary, Spelling, Reading, Listening, Writing) y un marcador de puntos en la parte superior que se actualiza con cada revisión.
- **FR-010**: Los tipos de ejercicio DEBEN ser: elegir del banco de palabras en un espacio; escribir una oración completa; escribir una palabra en un espacio; relacionar término con letra de definición; elegir una opción a/b/c; escuchar y escribir una palabra (dictado); y escribir un texto libre (writing).
- **FR-011**: El *listening* DEBE poder reproducirse a velocidad normal y lenta, y detenerse; su texto DEBE poder mostrarse solo cuando la sección ya terminó. El dictado DEBE permitir escuchar cada palabra por separado.

**Revisión y puntuación**

- **FR-012**: Cada sección (excepto writing) DEBE revisarse completa con un botón y tener 2 intentos.
- **FR-013**: Si algún reactivo pendiente está vacío, la revisión NO DEBE ejecutarse ni consumir un intento, y la tutora DEBE pedir que se respondan todos.
- **FR-014**: Un reactivo correcto DEBE quedar marcado como correcto y bloqueado. Tras el primer intento, cada reactivo incorrecto DEBE mostrar su pista; tras el segundo, DEBE mostrar la respuesta correcta y su explicación, y la sección queda terminada. Una sección con todo correcto queda terminada antes.
- **FR-015**: Cada reactivo correcto DEBE valer 1 punto, sin importar si se acertó en el primer o el segundo intento.
- **FR-016**: Las respuestas escritas DEBEN compararse sin distinguir mayúsculas, comas, espacios repetidos, punto/exclamación/interrogación final ni tipo de apóstrofo.
- **FR-017**: Las oraciones con causativos DEBEN aceptar "had" o "got" (o "have/has/get/gets" en presente, según el sujeto), y la expresión de tiempo al inicio o al final cuando es una expresión de tiempo (no cuando es una oración subordinada como "when it gets too long").
- **FR-018**: Cambiar la respuesta de un reactivo marcado como incorrecto DEBE quitar la marca roja.

**Writing**

- **FR-019**: La revisión de writing DEBE estimar cada criterio con 0, 1 o 2 puntos según reglas de texto (saludo y despedida, información práctica, lenguaje persuasivo, uso de paréntesis, extensión, vocabulario del tema, preguntas, título, conectores de secuencia, pasado simple, adjetivos, opinión, razones, conclusión), mostrar una sugerencia en cada criterio incompleto y el total sobre 10.
- **FR-020**: La revisión de writing DEBE poder repetirse después de mejorar el texto; cuenta el último resultado, y la hoja DEBE indicar que es una estimación automática y que la calificación final es de la maestra.
- **FR-021**: La revisión de writing NO DEBE ejecutarse si el texto tiene menos de 5 palabras.

**Resultados**

- **FR-022**: Al terminar DEBE mostrarse el total de puntos, el promedio sobre 10 con un decimal, un mensaje según el promedio (≥9, ≥7 o menor; con el nombre del alumno si lo escribió), una tabla de puntos por sección y un repaso de cada reactivo fallado con su respuesta correcta y explicación.
- **FR-023**: Si hay secciones sin revisar, el primer intento de terminar DEBE avisar cuántas faltan; el segundo DEBE mostrar los resultados.
- **FR-024**: Desde los resultados DEBE poderse repetir la misma guía desde cero o volver al menú.

**Generación de guías nuevas**

- **FR-025**: Las guías generadas DEBEN tener el mismo formato que su demo: la de gramática con las secciones gramaticales elegidas (5 reactivos cada una), relacionar (hasta 9), banco de palabras (3 a 5 oraciones), dictado (hasta 5) y ortografía (hasta 5); la de reading con un texto, hasta 7 preguntas de 3 opciones y hasta 4 espacios de *listening*; la de writing con consigna, "Remember", palabras útiles, un dato del tema y 5 criterios de 2 puntos.
- **FR-026**: La gramática de las guías generadas DEBE salir de plantillas propias combinadas al azar (cada guía es distinta). El vocabulario, la ortografía, los textos y las ideas de writing DEBEN consultarse en vivo en fuentes públicas sin clave, sin descargar archivos.
- **FR-027**: La dificultad del vocabulario y de los textos DEBE depender del grado elegido (palabras más comunes y textos más cortos en grados menores).
- **FR-028**: Todo contenido externo DEBE pasar por filtros de contenido no apto para niños y de definiciones o sentidos inadecuados antes de mostrarse; los textos con licencia CC BY-SA DEBEN mostrar su fuente.
- **FR-029**: Cada reactivo de opción múltiple generado DEBE tener exactamente una respuesta correcta y opciones distintas entre sí; las faltas de ortografía usadas como opciones incorrectas NO DEBEN ser palabras reales en inglés.
- **FR-030**: Ningún dato del alumno (nombre, respuestas, puntos) DEBE enviarse fuera del navegador.
- **FR-030a**: El juego DEBE abrirse y poder completarse (menú, las tres demos y resultados) en PC, celulares Android e iPhone, e iPad, sin desplazamiento horizontal en anchos desde 375 px. Las brechas de usabilidad táctil documentadas en Contexto (letra de campos, tamaño de controles, "Match" en celular, burbuja de la tutora) son conocidas y quedan fuera de esta historia.

#### Red de seguridad (nuevo en esta historia)

- **FR-031**: DEBE existir un conjunto de pruebas automáticas que verifique, como mínimo: la comparación de respuestas (FR-016) y las variantes de causativos (FR-017); las reglas gramaticales (pasado simple regular e irregular, comparativos); que cada reactivo de las tres demos acepte su respuesta correcta y que esta exista entre las opciones o el banco; las reglas de autoevaluación de writing (FR-019) con textos de ejemplo; el cálculo de puntos y promedio (FR-015, FR-022); los filtros de contenido (FR-028); y los generadores (FR-025, FR-029).
- **FR-032**: Las pruebas NO DEBEN hacer peticiones reales a internet: las fuentes externas se reemplazan por respuestas simuladas guardadas junto a las pruebas.
- **FR-033**: Las pruebas DEBEN dar el mismo resultado en cada ejecución aunque los generadores elijan al azar.
- **FR-034**: DEBE poder ejecutarse todo el conjunto de pruebas con un solo comando documentado.
- **FR-035**: El juego DEBE seguir abriéndose con doble clic, sin instalar nada (Principio II): las herramientas de prueba son solo para desarrollo.
- **FR-036**: Cada cambio subido a la rama principal o propuesto para integrarse a ella DEBE ejecutar las pruebas automáticamente en el repositorio y quedar marcado como aprobado o fallido.
- **FR-037**: Un cambio con pruebas fallidas DEBE quedar bloqueado por proceso: el fallo es visible en el cambio y en la rama principal, y la historia correspondiente NO DEBE cerrarse en Jira mientras el último cambio de la historia esté marcado como fallido (Principio IV). En esta historia no se exige un bloqueo técnico de GitHub que impida integrar el cambio (la cuenta gratuita no lo permite en repos privados); activarlo más adelante (repo público o plan de pago) sería una historia aparte.
- **FR-038**: Cualquier ajuste interno necesario para poder probar el código (por ejemplo, separar la lógica de la pantalla) NO DEBE cambiar el comportamiento visible descrito en FR-001 a FR-030. Única excepción: la corrección del bug de FR-016 (espacio después de la puntuación final), que hace que el código cumpla lo ya especificado.
- **FR-039**: Cada brecha de dispositivos móviles que pueda revisarse sin un navegador (tamaño de letra de los campos y tamaño mínimo de los controles táctiles) DEBE quedar descrita como una prueba automática **pendiente**: se ejecuta y reporta, pero no hace fallar el conjunto hasta que GAMES-2 la corrija y la convierta en prueba normal.

### Key Entities

- **Guía**: una hoja de trabajo de uno de tres tipos (Grammar, Vocabulary & Spelling; Reading & Listening; Writing), demo o generada; tiene encabezado y una lista ordenada de secciones.
- **Sección**: un ejercicio con instrucción, grupo, tipo y reactivos (o, en writing, consigna, recordatorios y criterios); lleva su propio conteo de intentos.
- **Reactivo**: una pregunta o espacio con su respuesta correcta (una o varias variantes aceptadas, o la opción correcta), pista y explicación.
- **Criterio de writing**: una regla de evaluación con su puntaje máximo (2) y una sugerencia de mejora.
- **Resultado**: puntos por sección, total, promedio sobre 10 y reactivos fallados.
- **Fuente externa**: servicio público consultado en vivo (palabras y definiciones; oraciones de ejemplo; textos sencillos), siempre reemplazado por respuestas simuladas en las pruebas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El conjunto de pruebas completo termina en menos de 1 minuto en una computadora normal, sin conexión a internet.
- **SC-002**: El 100% de los reactivos de las tres demos se verifica automáticamente (su respuesta correcta se acepta y existe entre las opciones o el banco).
- **SC-003**: Por cada área cubierta (validación de respuestas, gramática, demos, writing, puntuación, filtros de contenido y generadores), una regresión introducida a propósito hace fallar al menos una prueba.
- **SC-004**: 10 ejecuciones seguidas de las pruebas dan el mismo resultado.
- **SC-005**: El 100% de los cambios subidos a la rama principal después de esta historia muestran su resultado de verificación (aprobado o fallido) en el repositorio en menos de 5 minutos.
- **SC-006**: Un recorrido manual de las tres demos antes y después de la historia no muestra ninguna diferencia visible en contenido, revisión, puntuación ni resultados.
- **SC-007**: Un recorrido de las tres demos en un iPhone, un iPad, un celular Android y una PC confirma FR-030a en los cuatro, y cualquier problema nuevo (por ejemplo, en la lectura en voz alta de Safari) queda registrado como brecha para GAMES-2.

## Assumptions

- Las pruebas cubren la lógica del juego (reglas, validación, generadores, filtros, puntuación). La apariencia visual y la lectura en voz alta del navegador se siguen validando a mano: esa capa es difícil de automatizar y su beneficio no justifica el costo en esta etapa (Principio II).
- Las respuestas simuladas de las fuentes externas se toman de respuestas reales obtenidas una sola vez y se guardan con las pruebas. Si una fuente cambia su formato en el futuro, las pruebas no lo detectan; eso se descubre al usar el juego.
- "Rama principal" es `main` en `Florermg/Games`.
- El trabajo de esta historia no cambia el contenido provisional de las demos (guion del *listening* y palabras del dictado).
- Para el recorrido en dispositivos reales, el juego se sirve en la red local (o en una URL temporal) para abrirlo desde el celular o el iPad; esto es solo para validar, no publica el juego.
- Las guías siguen sin guardar progreso: al recargar la página se pierde la hoja en curso (comportamiento actual, fuera de alcance).
