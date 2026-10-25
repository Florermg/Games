# Feature Specification: Sujetos en la estructura de las tarjetas de tiempos verbales

**Feature Branch**: `005-estructura-sujetos`

**Created**: 2026-10-24

**Status**: Draft

**Jira**: GAMES-7 (Error) · **Modo de ejecución**: `in-all-process`

**Input**: User description: "algunas tarjetas como la de Present perfect no están completas ya que en la gramática no ponen el I/we, etc. en la estructura de oraciones"

## Contexto y decisiones de diseño

- **Origen**: defecto de contenido de GAMES-6, reportado por el usuario el 2026-10-24, después de integrarla.
- **Situación verificada**: de las 10 tarjetas de tiempos verbales, solo *Present simple* muestra los sujetos en su estructura ("I / you / we / they play · he / she / it plays"). Las otras 9 dan solo la fórmula, sin sujeto ni verbo de ejemplo. Por ejemplo, *Present perfect* dice "have / has + past participle", y el alumno no ve que *have* va con *I / you / we / they* y *has* con *he / she / it*.
- **Decisiones del usuario**:
  - Formato: los sujetos agrupados por forma, con un verbo de ejemplo (*play*), en afirmativa, negativa y pregunta. Por ejemplo: "I / you / we / they have played · he / she / it has played".
  - Se descartó una línea por sujeto, porque haría las tarjetas impresas mucho más altas.
  - Se registra como un Error nuevo (GAMES-7), no reabriendo GAMES-6.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver con qué sujeto va cada forma (Priority: P1) 🎯 MVP

Como alumno o maestra, quiero que la estructura de cada tarjeta de tiempo verbal diga qué sujetos van con cada forma del verbo, en afirmativa, negativa y pregunta, para construir oraciones correctas sin adivinar (por ejemplo, *she has eaten* y no *she have eaten*).

**Why this priority**: es el defecto reportado; sin los sujetos, la estructura de 9 de las 10 tarjetas está incompleta para un alumno de primaria.

**Independent Test**: abrir Grammar Cards con "All tenses" y revisar las 10 tarjetas de tiempos: cada línea de estructura muestra los sujetos y una forma de *play*. Imprimir las 10 y revisar lo mismo en el papel.

**Acceptance Scenarios**:

1. **Given** la tarjeta *Present perfect*, **Then** su afirmativa dice "I / you / we / they have played · he / she / it has played", su negativa usa *haven't / hasn't* con los mismos sujetos y su pregunta dice "Have I / you / we / they played? · Has he / she / it played?".
2. **Given** cualquiera de las 10 tarjetas de tiempos, **Then** las tres líneas de la estructura mencionan los 7 sujetos (*I, you, he, she, it, we, they*) y una forma del verbo de ejemplo *play*.
3. **Given** un tiempo cuyo auxiliar cambia con el sujeto (*am / is / are*, *was / were*, *have / has*, *do / does*), **Then** la línea agrupa los sujetos por la forma que les corresponde.
4. **Given** un tiempo con la misma forma para todos (*will*, *had*, *did*), **Then** la línea muestra los 7 sujetos juntos ("I / you / he / she / it / we / they will play").
5. **Given** que se imprimen las tarjetas, **Then** la estructura completa aparece en el papel y ninguna tarjeta queda partida entre páginas.

### Edge Cases

- **Past simple**: la forma afirmativa de *play* es regular (*played*); la tarjeta recuerda que hay pasados irregulares (*went, ate*).
- **Contracciones**: las negativas usan contracciones (*don't, isn't, haven't, won't*), igual que hoy en las tarjetas.
- **I + am**: *I* va solo con *am / 'm not* en los tiempos con *be* en presente.
- **Largo de la tarjeta**: la estructura es más larga. En la impresión, las tarjetas pueden ocupar más espacio, pero ninguna se parte.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada una de las 10 tarjetas de tiempos verbales DEBE mostrar, en su estructura afirmativa, negativa y de pregunta, los sujetos *I, you, he, she, it, we, they*, agrupados según la forma del verbo o del auxiliar que les corresponde.
- **FR-002**: Cada línea de estructura DEBE incluir el verbo de ejemplo *play* en la forma del tiempo (*play / plays, playing, played*).
- **FR-003**: Las formas DEBEN ser gramaticalmente correctas para cada grupo de sujetos (*I am, he is, they are; I was, they were; I have, she has; I don't, he doesn't*).
- **FR-004**: Una prueba automática DEBE fallar si alguna línea de estructura de las 10 tarjetas no menciona los 7 sujetos o no incluye una forma de *play*.
- **FR-005**: El resto del contenido de las tarjetas no cambia: explicación, palabras clave, ejemplos y las otras 12 tarjetas. Tampoco cambian las guías: la huella del recorrido de GAMES-1 sigue igual.
- **FR-006**: La impresión de tarjetas DEBE seguir sin partir ninguna tarjeta entre páginas.
- **FR-007**: Los archivos modificados DEBEN llevar su versión actualizada (GAMES-5), para que la publicación llegue a todos los navegadores.

### Key Entities

- **Estructura de una tarjeta de tiempo**: tres líneas (afirmativa, negativa, pregunta). Cada una lista grupos de sujetos con su forma del verbo de ejemplo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Las 30 líneas de estructura (10 tarjetas × 3) mencionan los 7 sujetos y una forma de *play*.
- **SC-002**: Una revisión manual de las 30 líneas no encuentra errores de concordancia sujeto-verbo.
- **SC-003**: La validación de PDFs de tarjetas sigue en "All checks passed": ninguna tarjeta partida y nada de la pantalla.
- **SC-004**: La huella del recorrido de GAMES-1 no cambia (`f1 b9 82 7e 2c 76`).

## Assumptions

- El verbo de ejemplo es *play* en todas las tarjetas, porque es regular y conocido por los alumnos de primaria. Los pasados irregulares se mencionan en *Past simple*.
- Las estructuras siguen en inglés, sin traducción, igual que hoy. Las traducciones están en los ejemplos.
- No se agregan sujetos plurales con nombre (*Ana and Tom*); basta con los pronombres.
