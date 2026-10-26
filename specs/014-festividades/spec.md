# Feature Specification: Festividades

**Feature Branch**: `014-festividades`

**Created**: 2026-10-25

**Status**: Draft

**Jira**: GAMES-16 (Historia) · **Modo de ejecución**: continuo (solo se pide autorización para commit, push, PR y merge)

**Input**: User description: "necesitamos que usemos holly days, como por ejemplo viene el día de muertos, halloween, navidad, las posadas en México etc y mostremos algo alusivo a estas temporadas".

## Clarifications

### Session 2026-10-25

- Q: ¿Qué festividades se incluyen? → A: **c**. Las de México y de la escuela, más algunas del mundo inglés que se ven en clase: Año Nuevo, Día de Reyes, Día del Amor y la Amistad, Día de la Bandera, St. Patrick's Day, Easter, Día del Niño, Día de las Madres, Día del Maestro, Independencia, Halloween, Día de Muertos, Día de la Revolución, Thanksgiving, Posadas y Navidad.
- Q: ¿Qué se muestra? → A: **c**. Decoración, un saludo de la tutora al abrir el juego y una tarjeta de vocabulario en inglés de la festividad.
- Q: ¿Desde cuándo se ve cada una? → A: **b**. Unos días antes y el día mismo (tabla de fechas en FR-001).
- Q: ¿Qué pasa cuando coinciden dos? → A: **a**. Se mezclan las decoraciones.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - El juego se decora para la festividad (Priority: P1) 🎯 MVP

Como alumno, quiero que el juego se vea de fiesta cuando se acerca una festividad.

**Independent Test**: abrir el juego el 20 de diciembre (o con `?festividad=posadas`): papel picado de colores y una piñata en la ventana del menú, una guirnalda arriba de la hoja y adornos en el fondo.

**Acceptance Scenarios**:

1. **Given** una fecha dentro de una festividad, **Then** se ven su guirnalda arriba de la hoja (en todas las pantallas), sus adornos en la ventana del menú y algo que flota en el fondo.
2. **Given** dos festividades al mismo tiempo (Halloween y Día de Muertos el 25 de octubre), **Then** se mezclan: media guirnalda de cada una y los adornos de las dos.
3. **Given** una fecha sin festividad, **Then** el juego se ve como en GAMES-15.
4. **Given** las fiestas que cambian de fecha (Easter, Thanksgiving), **Then** se calculan para cada año.

### User Story 2 - La tutora saluda (Priority: P1)

**Acceptance Scenarios**:

1. **Given** que se abre el juego en una festividad, **Then** la tutora saluda ("🎃 Happy Halloween! …") e invita a ver las palabras.
2. **Given** dos festividades, **Then** el saludo nombra las dos.
3. **Given** cualquier otro momento (guías, resultados), **Then** la tutora habla como siempre.

### User Story 3 - Vocabulario en inglés de la festividad (Priority: P1)

Como alumno, quiero aprender las palabras en inglés de la festividad.

**Independent Test**: en el menú, la tarjeta "🎃 Halloween words" muestra 8 o más palabras con su dibujo (emoji), su significado en español y una oración de ejemplo; al tocar una palabra se escucha.

**Acceptance Scenarios**:

1. **Given** una festividad, **Then** el menú muestra su tarjeta de vocabulario.
2. **Given** dos festividades, **Then** la tarjeta tiene una pestaña por festividad.
3. **When** toca una palabra, **Then** se lee en voz alta la palabra y su oración (si el navegador tiene voz).

### User Story 4 - Probar cualquier festividad (Priority: P1)

**Acceptance Scenarios**:

1. **Given** `?festividad=posadas` (o `navidad`, `muertos`, `halloween`, etc.), **Then** se ve esa festividad, sin importar la fecha, con "test mode".
2. **Given** `?festividad=halloween,muertos`, **Then** se ven las dos mezcladas.
3. **Given** `?festividad=ninguna`, **Then** no se ve ninguna.
4. **Given** un nombre que no existe, **Then** se ignora y se usa la fecha real.

### Edge Cases

- Tres festividades juntas (por ejemplo Easter, Día del Niño y otra): guirnalda de las dos más cercanas y adornos de las tres.
- Movimiento reducido: lo del fondo se queda quieto. Impresión: no se imprime nada de esto.
- Celular: la guirnalda y la tarjeta siempre se ven; el fondo, donde haya espacio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El juego DEBE reconocer 16 festividades, cada una visible "unos días antes y el día":

| Festividad | Se ve |
|---|---|
| New Year (Año Nuevo) | 28 dic – 1 ene |
| Three Kings' Day (Reyes) | 2 – 6 ene |
| Valentine's Day (Amor y Amistad) | 7 – 14 feb |
| Flag Day (Bandera) | 17 – 24 feb |
| St. Patrick's Day | 10 – 17 mar |
| Easter | domingo de Pascua − 7 días – domingo de Pascua |
| Children's Day (Día del Niño) | 23 – 30 abr |
| Mother's Day (Madres) | 3 – 10 may |
| Teacher's Day (Maestro) | 11 – 15 may |
| Independence Day | 1 – 16 sep |
| Halloween | 15 – 31 oct |
| Day of the Dead (Muertos) | 25 oct – 2 nov |
| Revolution Day | 14 – 20 nov |
| Thanksgiving | 4.º jueves de noviembre − 6 días – ese jueves |
| Las Posadas | 16 – 24 dic |
| Christmas (Navidad) | 1 – 25 dic |

- **FR-002**: Cuando coinciden, se ordenan por cercanía de su día principal (el último de la tabla) y se mezclan (US1-2).
- **FR-003**: Cada festividad DEBE tener una guirnalda, adornos para la ventana del menú, algo que flota en el fondo, un saludo y 8 o más palabras en inglés (emoji, palabra, significado en español y oración de ejemplo con la palabra).
- **FR-004**: El saludo de la tutora DEBE aparecer solo al abrir el juego en el menú.
- **FR-005**: Al tocar una palabra se lee con la voz del navegador; sin voz, no pasa nada malo.
- **FR-006**: Modo de prueba `?festividad=` con nombres en español o en inglés, varias separadas por coma, y `ninguna`.
- **FR-007**: No cambian las guías ni el resto del juego (la huella de GAMES-1 sigue igual); nada de esto se imprime; los archivos llevan su versión (GAMES-5); abre con doble clic y sin internet.

### Key Entities

- **Festividad**: id, nombre en inglés y en español, emoji, fechas (fijas o calculadas), colores, dibujos, saludo y vocabulario.
- **Palabra**: emoji, palabra en inglés, significado en español, oración de ejemplo.

## Success Criteria *(mandatory)*

- **SC-001**: Para cada día de un año, las festividades activas coinciden con la tabla de FR-001 (incluye Easter y Thanksgiving de 2025 a 2030).
- **SC-002**: Las 16 festividades y las mezclas que pueden ocurrir se dibujan sin errores y se reconocen a ojo (hoja con todas).
- **SC-003**: Las 16 tarjetas tienen 8+ palabras correctas y apropiadas para 5.º de primaria (revisión de un maestro recomendada).
- **SC-004**: `npm test` en verde; huella de GAMES-1 sin cambios; 390 px sin scroll horizontal.

## Assumptions

- Fechas con el reloj del equipo; los textos para los alumnos van en inglés, con el significado en español en el vocabulario.
- Las festividades religiosas (Reyes, Posadas, Navidad, Easter) se presentan por sus tradiciones (rosca, piñatas, árbol, huevos de colores).
