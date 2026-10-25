# Feature Specification: Secciones de gramática (tarjetas imprimibles) y de verbos con búsqueda en español e inglés

**Feature Branch**: `004-gramatica-verbos`

**Created**: 2026-10-24

**Status**: Draft

**Jira**: GAMES-6 (Historia) · **Modo de ejecución**: `in-all-process`

**Input**: User description: "Como usuario quiero una sección de gramática y otra de verbos en sus diferentes tiempos. En la sección de verbos debes poder buscar en español y en inglés el verbo, y debe mostrarlo en sus diferentes tiempos dando un ejemplo. La sección de gramática debe tener la opción de poder imprimir; se me ocurre que se vean como tarjetas, aunque se imprima en tamaño carta, por lo tanto la página puede llevar varias tarjetas, las que entren en el formato carta. Cada tarjeta debe llevar la gramática con uno o dos ejemplos y en sus diferentes tiempos verbales. Los tiempos deben ser de acuerdo al grado que selecciono, pero debe haber una opción de todos los tiempos o de poder seleccionar qué tiempos incluir en la tarjeta, que además se debe poder imprimir."

## Contexto y decisiones de diseño

- **Origen**: hoy el juego solo tiene guías para contestar. La maestra quiere además material de **consulta**: una referencia de gramática en tarjetas que pueda imprimir y repartir, y un buscador de verbos para que los alumnos vean cómo cambia un verbo en cada tiempo.
- **Decisiones del usuario** (2026-10-24, antes de escribir la spec):
  - **Tiempos según el grado**. Al elegir el grado se marcan por defecto sus tiempos, y siempre se puede elegir "todos" o escoger cuáles incluir:
    - 3°: present simple, present continuous, past simple
    - 4°: los de 3° + future (*will*), future (*going to*)
    - 5°: los de 4° + past continuous, present perfect
    - 6°: los de 5° + past perfect, future continuous, present perfect continuous
  - **Se imprimen las dos clases de tarjetas**: las de gramática (una por tema) y las de verbos (una por verbo, con los tiempos elegidos). Van en papel carta con varias tarjetas por hoja, tantas como quepan.
  - **Verbos**: una lista propia del juego (verbos comunes con su traducción al español y sus formas irregulares, revisadas). Si un verbo no está en la lista, se consulta una fuente pública sin clave.
  - **Temas de gramática**: los tiempos verbales, los temas que ya practican las guías y otros temas básicos.
- **Relación con lo existente**: las secciones nuevas son de consulta; no tienen puntos, intentos ni resultados. Reutilizan la impresión de GAMES-3 (impresión del sistema, "Guardar como PDF", tamaño carta), y conviven con las guías en el mismo menú.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Buscar un verbo y verlo en sus tiempos (Priority: P1) 🎯 MVP

Como alumno o maestra, quiero escribir un verbo en español ("comer") o en inglés ("eat") y ver ese verbo en los tiempos de mi grado, con un ejemplo en cada tiempo, para entender cómo se usa.

**Why this priority**: es la consulta más frecuente y no depende de las tarjetas ni de la impresión.

**Independent Test**: en la sección Verbs con 5° seleccionado, buscar "comer", "eat", "ir" y "study", y comprobar que cada uno muestra los 7 tiempos de 5°, cada uno con su forma y un ejemplo correcto.

**Acceptance Scenarios**:

1. **Given** la sección Verbs con 5° seleccionado, **When** se busca "comer", **Then** aparece "eat (comer)" con sus 7 tiempos de 5°. Cada tiempo muestra el nombre del tiempo, la forma del verbo (por ejemplo, past simple: *ate*) y una oración de ejemplo con su traducción al español.
2. **Given** la búsqueda "eat", **Then** el resultado es el mismo que con "comer".
3. **Given** un verbo irregular ("go", "ir"), **Then** sus formas son las correctas (*went*, *gone*), no "goed".
4. **Given** un verbo regular con cambio ortográfico ("study", "stop"), **Then** sus formas son correctas (*studied*, *stopped*, *studying*).
5. **Given** que se elige "All tenses" o se marcan otros tiempos, **Then** el verbo se muestra exactamente en los tiempos elegidos, en un orden fijo (del presente al futuro).
6. **Given** que se escribe parte de un verbo o una palabra con más de una traducción ("jugar" → *play*; "tocar" → *play* y *touch*), **Then** aparecen las coincidencias para elegir.
7. **Given** un verbo que no está en la lista propia, **When** se busca, **Then** se consulta la fuente pública. Si se encuentra, se muestra marcado como "not reviewed". Si no, aparece un mensaje claro ("We couldn't find that verb") con sugerencias parecidas de la lista.

---

### User Story 2 - Ver e imprimir tarjetas de gramática (Priority: P2)

Como maestra, quiero ver los temas de gramática como tarjetas (explicación breve, estructura y uno o dos ejemplos en los tiempos elegidos) e imprimir las que necesite en hojas carta, con varias tarjetas por hoja, para repartirlas o pegarlas en el cuaderno.

**Why this priority**: es el material imprimible que pidió el usuario. Depende de los mismos tiempos y ejemplos de la US1.

**Independent Test**: en la sección Grammar con 5° seleccionado, elegir tres tarjetas e imprimir; en la vista previa o el PDF, las tres caben en tamaño carta, ninguna tarjeta queda partida entre páginas y no aparecen elementos de la pantalla.

**Acceptance Scenarios**:

1. **Given** la sección Grammar, **Then** se ven tarjetas de tres grupos:
   - **tiempos verbales**: una por cada tiempo de la lista del grado;
   - **temas de las guías**: quantifiers, causative verbs, past simple + *ago* y comparatives;
   - **temas básicos**: subject pronouns, possessive adjectives, articles (*a/an/the*), plurals, *there is / there are*, prepositions of place, prepositions of time y *can / can't*.
2. **Given** una tarjeta de un tiempo verbal, **Then** muestra para qué se usa, su estructura en afirmativa, negativa y pregunta, sus palabras clave (*yesterday*, *now*, *already*…) y uno o dos ejemplos.
3. **Given** una tarjeta de otro tema, **Then** muestra la regla en pocas líneas y uno o dos ejemplos en cada uno de los tiempos elegidos, cuando el tema lo permite (por ejemplo, *there is / there was / there will be*). Si un tema no cambia con el tiempo, lo indica.
4. **Given** que se eligen tarjetas y tiempos, **When** se imprime, **Then** sale en papel carta con tantas tarjetas por hoja como quepan, cada tarjeta completa en una sola hoja y en blanco y negro.
5. **Given** que no se elige ninguna tarjeta, **When** se intenta imprimir, **Then** se pide elegir al menos una, sin abrir la impresión.

---

### User Story 3 - Imprimir tarjetas de verbos (Priority: P3)

Como maestra, quiero juntar varios verbos que busqué e imprimirlos como tarjetas (una por verbo, con los tiempos elegidos y sus ejemplos), varias por hoja carta, para armar material de repaso.

**Why this priority**: amplía la impresión a la sección de verbos; el valor de consulta (US1) ya existe sin ella.

**Independent Test**: buscar y agregar 6 verbos a la selección, imprimir y comprobar que salen 6 tarjetas completas, repartidas en las hojas necesarias.

**Acceptance Scenarios**:

1. **Given** un verbo mostrado, **When** se agrega a la selección para imprimir, **Then** se ve en la lista de seleccionados y se puede quitar.
2. **Given** varios verbos seleccionados, **When** se imprime, **Then** sale una tarjeta por verbo con los tiempos elegidos, sus formas y ejemplos, varias por hoja carta y sin partir tarjetas.
3. **Given** que se cambian los tiempos elegidos antes de imprimir, **Then** las tarjetas impresas usan esos tiempos.

---

### Edge Cases

- **Mayúsculas, acentos y espacios en la búsqueda**: "Comér", "  comer " y "COMER" encuentran "comer".
- **Formas conjugadas en la búsqueda** ("went", "comí"): se intenta reconocer el verbo base (*went* → *go*). Si no se reconoce, se muestran sugerencias.
- **Verbos con varias traducciones** (*play*: jugar / tocar un instrumento) o con varias formas válidas (*learned / learnt*): se muestran todas, con la forma principal primero.
- **Verbos que casi no se usan en continuo** (*know*, *like*): se muestran, con una nota de que esa forma es poco común.
- **Sin internet**: la lista propia, las tarjetas de gramática y la impresión funcionan. Solo la búsqueda en la fuente pública muestra un mensaje claro de que no hay conexión.
- **Resultado de la fuente pública**: pasa por los filtros de contenido para niños (Principio VI). Si un resultado no pasa el filtro, no se muestra.
- **Tarjeta más grande que media hoja** (por ejemplo, un verbo con los 10 tiempos): se imprime completa en una hoja, aunque ocupe la hoja entera.
- **Ningún tiempo marcado**: se pide marcar al menos uno.

## Requirements *(mandatory)*

### Functional Requirements

**Menú y grado**

- **FR-001**: El menú DEBE ofrecer dos secciones nuevas, **Grammar** y **Verbs**, además de las guías actuales, sin cambiar el funcionamiento de estas.
- **FR-002**: Las dos secciones DEBEN usar el grado elegido (3° a 6°) para marcar por defecto sus tiempos, según la tabla del Contexto. DEBEN permitir elegir "All tenses" o marcar y desmarcar tiempos uno por uno, y DEBEN pedir al menos un tiempo marcado.
- **FR-003**: Los tiempos DEBEN mostrarse siempre en el mismo orden: present simple, present continuous, present perfect, present perfect continuous, past simple, past continuous, past perfect, future (*will*), future (*going to*), future continuous.

**Verbos**

- **FR-004**: La búsqueda DEBE aceptar el verbo en español o en inglés, sin distinguir mayúsculas, acentos ni espacios extra, y DEBE mostrar las coincidencias de la lista propia a medida que se escribe.
- **FR-005**: La lista propia DEBE tener al menos 200 verbos comunes del nivel de primaria. Cada uno lleva su traducción o traducciones al español y sus formas irregulares (pasado y participio) cuando las tiene.
- **FR-006**: Para cada tiempo elegido, el verbo DEBE mostrar el nombre del tiempo, la forma del verbo y una oración de ejemplo en inglés con su traducción al español, usando reglas correctas para las formas regulares (incluidos los cambios ortográficos: *-ied*, consonante doble, *-e* final) y las formas de la lista para las irregulares.
- **FR-007**: Si el verbo no está en la lista propia, DEBE consultarse una fuente pública, gratuita y sin clave (Principio VI), y su resultado DEBE mostrarse marcado como "not reviewed" y pasar por los filtros de contenido. Si no se encuentra o no hay conexión, DEBE mostrarse un mensaje claro y sugerencias de la lista propia.

**Gramática**

- **FR-008**: La sección Grammar DEBE mostrar tarjetas de los tres grupos del escenario 1 de la US2: tiempos verbales, temas de las guías y temas básicos.
- **FR-009**: Cada tarjeta DEBE tener título, una explicación breve (no más de 3 líneas) y uno o dos ejemplos. Las de tiempos verbales tienen además estructura (afirmativa, negativa, pregunta) y palabras clave. Las demás muestran sus ejemplos en los tiempos elegidos cuando el tema cambia con el tiempo.
- **FR-010**: El texto de las tarjetas DEBE estar en inglés, con la traducción al español de cada ejemplo, al nivel del grado elegido.

**Impresión**

- **FR-011**: Ambas secciones DEBEN permitir elegir qué tarjetas imprimir (en Grammar, marcándolas; en Verbs, agregando verbos a una selección) e imprimirlas con la impresión del sistema, que permite "Guardar como PDF", igual que en GAMES-3.
- **FR-012**: Lo impreso DEBE estar en tamaño carta, en blanco y negro, con varias tarjetas por hoja (tantas como quepan) y ninguna tarjeta partida entre páginas. No DEBE incluir elementos de la pantalla (botones, tutora, buscador).
- **FR-013**: Imprimir DEBE funcionar sin internet, con el contenido ya mostrado.

**Calidad (Principio IV)**

- **FR-014**: DEBE haber pruebas automáticas que verifiquen:
  - las formas de todos los verbos de la lista en todos los tiempos, con una muestra revisada a mano de regulares, irregulares y cambios ortográficos;
  - la búsqueda en español e inglés, incluidos acentos, mayúsculas y formas conjugadas;
  - los tiempos por grado;
  - que cada tarjeta tiene los elementos de FR-009;
  - el armado de la impresión.

  La fuente pública se simula, sin red.
- **FR-015**: Las guías, su revisión, su impresión y sus pruebas actuales NO DEBEN cambiar de comportamiento.

### Key Entities

- **Verbo**: forma base en inglés, traducciones al español, pasado y participio (cuando es irregular), y si es de la lista propia o de la fuente pública ("not reviewed").
- **Tiempo verbal**: nombre, para qué se usa, estructura (afirmativa, negativa, pregunta), palabras clave y grado mínimo.
- **Tarjeta de gramática**: tema, grupo (tiempos, temas de las guías o temas básicos), explicación, ejemplos (inglés y español) y si el tema cambia con el tiempo.
- **Tarjeta de verbo**: un verbo con los tiempos elegidos, su forma y su ejemplo en cada uno.
- **Selección para imprimir**: las tarjetas (de gramática o de verbos) y los tiempos elegidos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Buscar un verbo de la lista, en español o en inglés, muestra sus tiempos en menos de 1 segundo, sin internet.
- **SC-002**: El 100% de los verbos de la lista tiene formas correctas en todos los tiempos. Se comprueba de forma automática y, para una muestra de al menos 30 verbos (regulares, irregulares y con cambios ortográficos), contra una tabla revisada a mano.
- **SC-003**: En cada grado, los tiempos marcados por defecto son exactamente los de la tabla del Contexto.
- **SC-004**: Una selección de 4 tarjetas de gramática (o de verbos) con los tiempos de 3° cabe en 1–2 hojas carta, sin tarjetas partidas ni elementos de pantalla.
- **SC-005**: Una maestra llega de "abrir el juego" a "vista previa de impresión de 3 tarjetas" en menos de 1 minuto.
- **SC-006**: Las pruebas de las guías existentes siguen pasando sin cambios (146 pruebas: 144 pasan y 2 pendientes de GAMES-2).

## Assumptions

- La lista propia de verbos y los textos de las tarjetas los prepara el proyecto, con un nivel de inglés de primaria. La maestra puede pedir cambios después, en otra historia.
- Los "otros temas básicos" son los 8 listados en la US2. Se pueden agregar más después sin cambiar el diseño.
- El tamaño exacto de cada tarjeta lo decide el plan, para que normalmente quepan entre 2 y 4 por hoja carta según su contenido.
- Las secciones nuevas no tienen puntuación ni guardan nada: son de consulta, igual que el resto del juego, que no guarda datos (Principio VI).
- Las brechas táctiles conocidas de GAMES-2 también aplican a estas pantallas; esta historia no debe empeorarlas.
- La búsqueda en la fuente pública es para inglés → español y español → inglés de verbos sueltos; no traduce frases.
