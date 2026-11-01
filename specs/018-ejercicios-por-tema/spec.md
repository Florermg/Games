# Feature Specification: Ejercicios por tema (Guía 5.º Campos formativos)

**Feature Branch**: `018-ejercicios-por-tema`

**Created**: 2026-10-31

**Status**: Implemented

**Jira**: GAMES-21 (Historia) · **Modo de ejecución**: continuo (solo se pide autorización para commit, push, PR y merge)

**Input**: User description: "hay cambios que hacer en la materia de español … necesito que por cada tema pongas ejercicios, por ejemplo 1. Tipos de sustantivos: en las tarjetas está la definición y está perfecto, pero para los ejercicios deben ir por tema: 1. Tipos de sustantivos ejercicios, 2. Clases de palabras: variables e invariables ejemplos, y así todos". Fuente: *5to - Guía de estudio - 1er trim (26-27).pdf* (no se guarda en el repositorio).

## Clarifications

### Session 2026-10-31

No se hicieron preguntas (modo continuo). Decisiones tomadas y anotadas en Assumptions:

- Los ejercicios de un tema se abren desde el menú (lista por campo) y desde su tarjeta de repaso.
- Un tema trae **todas** sus preguntas, no una muestra.
- Los ejercicios por tema cuentan como una guía normal: se guardan en el avance y, con 100%, ganan un accesorio.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Practicar un tema (Priority: P1) 🎯 MVP

Como alumno, quiero elegir un tema de la guía, como "1. Tipos de sustantivos", y contestar ejercicios solo de ese tema.

**Independent Test**: en el menú, abrir "📝 Lenguajes" → "2. Clases de palabras: variables e invariables": se abre una guía con 6 tipos de ejercicio, todos de ese tema.

**Acceptance Scenarios**:

1. **Given** el menú, **Then** la tarjeta "✏️ Ejercicios por tema" muestra los 4 campos y, dentro de cada uno, sus temas numerados como en la guía impresa (del 1 en adelante en cada campo).
2. **When** elige un tema, **Then** la guía trae todas las preguntas del tema: opción múltiple, verdadero o falso, relacionar, banco de palabras, clasificar ejemplos (una sección por cada conjunto) y respuesta abierta, en ese orden.
3. **Then** el subtítulo dice el campo y el tema ("5.º grado · 📝 Lenguajes · 1. Tipos de sustantivos"); la revisión, la impresión y los resultados funcionan igual que en las demás guías.

### User Story 2 - De la tarjeta a los ejercicios (Priority: P1)

**Acceptance Scenarios**:

1. **Given** una tarjeta de repaso, **When** toca "✏️ Ejercicios de este tema", **Then** se abren los ejercicios de ese tema.

### User Story 3 - Todos los temas tienen todos los ejercicios (Priority: P1)

**Acceptance Scenarios**:

1. **Given** cualquiera de los 21 temas, **Then** tiene al menos 4 de opción múltiple, 4 de verdadero o falso, 3 para relacionar, 3 de banco de palabras, 1 conjunto de 6 ejemplos para clasificar y 1 respuesta abierta, todo tomado de la guía.

### Edge Cases

- Un tema con dos conjuntos para clasificar (sustantivos, polisémicas) muestra dos secciones de clasificar.
- Dentro de un tema no se repiten las respuestas del banco ni las columnas de relacionar.

## Requirements *(mandatory)*

- **FR-001**: El menú DEBE listar los 21 temas por campo, con su número de la guía.
- **FR-002**: Cada tema DEBE abrir una guía con todas sus preguntas de los 6 tipos, con las opciones mezcladas.
- **FR-003**: Cada tarjeta de repaso DEBE tener el botón para abrir los ejercicios de su tema.
- **FR-004**: Todos los temas DEBEN cumplir los mínimos de la historia 3; una prueba automática lo revisa.
- **FR-005**: Los ejercicios por tema DEBEN guardarse en el avance (GAMES-18) y dar premio con 100% (GAMES-14), como una guía nueva.
- **FR-006**: El tema 2 de Lenguajes se llama como en la guía: "Clases de palabras: variables e invariables".

## Success Criteria *(mandatory)*

- **SC-001**: Los 21 temas abren sus ejercicios con los 6 tipos; `npm test` en verde.
- **SC-002**: 390 px sin scroll horizontal en el menú, los ejercicios y las tarjetas; consola sin errores.
- **SC-003**: El juego de inglés no cambia (huella de GAMES-1).

## Assumptions

- Al agregar preguntas, la demo (semilla fija) cambia una sola vez: sigue siendo siempre igual entre una vez y otra, pero ya no es idéntica a la de GAMES-17.
- Las preguntas nuevas necesitan la misma revisión de un maestro recomendada en GAMES-17.
