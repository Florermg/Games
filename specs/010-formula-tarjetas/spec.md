# Feature Specification: Fórmula de la oración en las tarjetas de gramática

**Feature Branch**: `010-formula-tarjetas`

**Created**: 2026-10-25

**Status**: Draft

**Jira**: GAMES-12 (Historia) · **Modo de ejecución**: continuo (solo se pide autorización para commit, push, PR y merge)

**Input**: User description: "en las tarjetas de la gramatica, debes poner la estructura de la sentencia algo asi como subject + verb in prsent tence etc etc"

## Contexto y decisiones de diseño

- **Situación actual**: desde GAMES-7, la estructura de las 10 tarjetas de tiempos muestra los sujetos con el verbo *play* ("I / you / we / they have played · he / she / it has played"), pero no la regla general que el alumno puede aplicar a cualquier verbo. Las 12 tarjetas de los otros temas no tienen estructura; solo explicación y ejemplos.
- **Qué pide el usuario**: la fórmula de la oración, del tipo "Subject + verb in present simple".
- **Decisiones (por defecto razonable, sin preguntar)**:
  - La fórmula se **agrega** arriba de las líneas con sujetos de GAMES-7, que se quedan. Así se ve la regla y luego cómo queda con cada sujeto.
  - Se agrega a las **22 tarjetas**: las 10 de tiempos (una fórmula para afirmativa, negativa y pregunta) y las 12 de los otros temas (una fórmula del tema).
  - Las fórmulas van en inglés, como el resto de la estructura, con palabras sencillas para primaria: *Subject*, *verb in base form*, *verb-ing*, *past participle*.
- **Hallazgo durante la validación**: al imprimir con WebKit (el motor de Safari en iPhone y iPad), algunas tarjetas se partían entre dos páginas. Ya pasaba en `main` antes de este cambio (6 tarjetas partidas de 22 en 2 columnas y 4 en 1 columna), porque WebKit no respeta "no partir" en las tarjetas acomodadas en cuadrícula. Como las tarjetas crecen con la fórmula y el usuario imprime desde el iPhone, se corrige aquí (FR-009).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver la regla para formar la oración en cada tiempo (Priority: P1) 🎯 MVP

Como alumno o maestra, quiero ver en cada tarjeta de tiempo verbal la fórmula de la oración afirmativa, negativa y de pregunta (por ejemplo "Subject + have / has + past participle"), para formar oraciones con cualquier verbo y no solo con el ejemplo.

**Why this priority**: es lo que pidió el usuario y las tarjetas de tiempos son las más usadas.

**Independent Test**: abrir Grammar Cards con "All tenses": cada tarjeta de tiempo muestra en sus tres renglones (+, −, ?) la fórmula y debajo los sujetos con *play*. Imprimir y revisar lo mismo.

**Acceptance Scenarios**:

1. **Given** la tarjeta *Present simple*, **Then** sus fórmulas son "Subject + verb in base form (he / she / it: verb + -s)", "Subject + don't / doesn't + verb in base form" y "Do / Does + subject + verb in base form?".
2. **Given** cualquiera de las 10 tarjetas de tiempos, **Then** cada renglón empieza con su fórmula, que contiene "Subject" o "subject" y al menos un "+", y la pregunta termina en "?".
3. **Given** las líneas con sujetos de GAMES-7, **Then** siguen iguales, debajo de la fórmula.

### User Story 2 - Ver la estructura de los otros temas (Priority: P2)

Como alumno, quiero que las tarjetas de *Quantifiers*, *Causative*, *Ago*, *Comparatives* y los temas básicos muestren también su fórmula (por ejemplo "Subject + have / get + object + past participle").

**Why this priority**: completa la petición para todas las tarjetas.

**Independent Test**: en Grammar Cards, las 12 tarjetas que no son de tiempos muestran un renglón "Structure:" con su fórmula, en pantalla y al imprimir.

**Acceptance Scenarios**:

1. **Given** la tarjeta *Causative*, **Then** muestra "Structure: Subject + have / get + object + past participle".
2. **Given** una fórmula con varias partes (por ejemplo *Prepositions of time*: at / on / in), **Then** cada parte va en su propio renglón.

### Edge Cases

- **Present simple**: la *-s* de *he / she / it* se indica en la misma fórmula.
- **Past simple**: la afirmativa dice "verb in past (-ed or irregular)" y la negativa y la pregunta usan *didn't / did* + base form.
- **Ejemplos de la tarjeta**: cada fórmula de un tema debe corresponder a sus ejemplos (revisión manual).
- **Largo de la tarjeta**: las tarjetas crecen un renglón por forma; al imprimir ninguna se parte entre páginas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada tarjeta de tiempo DEBE tener una fórmula para afirmativa, negativa y pregunta, mostrada al inicio de su renglón (+, −, ?) de la estructura, antes de las líneas con sujetos.
- **FR-002**: Cada una de las 12 tarjetas que no son de tiempos DEBE mostrar una fórmula del tema con la etiqueta "Structure:"; las partes separadas por " · " van en renglones distintos.
- **FR-003**: Las 22 fórmulas DEBEN estar escritas a mano y ser gramaticalmente correctas; una prueba automática las compara con la lista revisada.
- **FR-004**: Las fórmulas de tiempos DEBEN usar los mismos auxiliares que las líneas con sujetos (por ejemplo, *have / has* en *Present perfect*); la prueba revisa que cada auxiliar de la fórmula aparezca en su línea con sujetos.
- **FR-005**: La fórmula se ve igual en la pantalla de Grammar Cards y en la hoja impresa, con un estilo que la distinga de los ejemplos.
- **FR-006**: No cambia nada más: explicaciones, palabras clave, ejemplos, líneas con sujetos, tarjetas de verbos y guías (la huella de GAMES-1 sigue igual).
- **FR-007**: La impresión de tarjetas DEBE seguir sin partir ninguna tarjeta, en Chrome y en Safari (WebKit).
- **FR-008**: Los archivos modificados llevan su versión actualizada (GAMES-5).
- **FR-009**: En la hoja impresa, las tarjetas se acomodan de forma que WebKit tampoco las parta entre páginas, en 1 y 2 columnas, para tarjetas de gramática y de verbos.

### Key Entities

- **Fórmula de tiempo**: tres textos (afirmativa, negativa, pregunta).
- **Fórmula de tema**: un texto, con partes separadas por " · ".

## Success Criteria *(mandatory)*

- **SC-001**: Las 22 tarjetas muestran su fórmula en pantalla y en papel (10 × 3 + 12 = 42 fórmulas).
- **SC-002**: Una revisión manual de las 42 fórmulas no encuentra errores y cada una corresponde a los ejemplos de su tarjeta.
- **SC-003**: La validación de PDFs de tarjetas de GAMES-6 sigue en "All checks passed", y en WebKit ninguna tarjeta se parte.
- **SC-004**: `npm test` en verde y la huella de GAMES-1 sin cambios (`f1 b9 82 7e 2c 76`).

## Assumptions

- Se usa la palabra *Subject* (no *Pronoun*) porque el sujeto puede ser un nombre (*My dog*).
- No se traducen las fórmulas; las traducciones están en los ejemplos.
- Las tarjetas de verbos (Verb Cards) no cambian.
