# Feature Specification: En iPhone, títulos de sección solos al pie de la hoja impresa y franja de mascotas transparente

**Feature Branch**: `008-impresion-iphone`

**Created**: 2026-10-25

**Status**: Draft

**Jira**: GAMES-10 (Error) · **Modo de ejecución**: `in-all-process` (el usuario pidió avanzar las fases sin detenerse)

**Input**: User description: "Así queda la impresión, la guardé en PDF" (más una captura de pantalla del iPhone). Luego: "Abre la 10 y continúa", con el alcance recomendado: títulos de sección y franja de mascotas.

## Contexto y evidencia

Evidencia del usuario, en iPhone con iOS 26.6.1 y Safari, por la red local. Está en `evidence/`:

- **`iphone-guia-gvs-antes.pdf`**: una guía GVS generada ("Environment & Nature"), impresa como PDF (4 hojas carta).
  - Al pie de la hoja 2 quedan "VOCABULARY" y "1. Match the words and the definitions", y el ejercicio empieza en la hoja 3.
  - Al pie de la hoja 3 quedan "SPELLING" y "Spelling Dictation:", y las líneas están en la hoja 4.
  - No hay mascotas ni botones, y ningún renglón se parte: lo de GAMES-3 y GAMES-9 funciona.
- **`iphone-franja-antes.png`**: la franja inferior de las mascotas (GAMES-9) deja ver la guía en su parte de arriba. El botón "🐾 Hide pets" queda encima del campo de "a. I have ___ homework" mientras se hace scroll.

**Causa**:
- El CSS de impresión pide `break-after: avoid` en los títulos. Safari (WebKit) no lo respeta en este tipo de contenido, aunque sí respeta `break-inside: avoid`: por eso los renglones no se parten.
- La franja usa un degradado que empieza transparente.

**Fuera de alcance**, por decisión del usuario:
- El pie que agrega Safari (URL, fecha y "Página n de m"): lo pone el navegador, y en iPhone no se puede quitar.
- El vocabulario generado demasiado difícil: va en una historia aparte.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - El título de cada sección queda junto a su ejercicio en el papel (Priority: P1) 🎯 MVP

Como maestra, quiero que al imprimir una guía (desde la PC, el iPhone o el iPad) el título de cada grupo y de cada sección quede en la misma hoja que el inicio de su ejercicio, para que ninguna hoja termine con un título sin contenido.

**Why this priority**: es lo que se ve mal en el papel que se reparte.

**Independent Test**: imprimir a PDF la guía del usuario (o las guías de prueba) y comprobar que cada título de grupo y de sección está en la misma hoja que el primer contenido de su ejercicio.

**Acceptance Scenarios**:

1. **Given** una guía en la que un título caería al pie de una hoja, **When** se imprime, **Then** el título pasa a la hoja siguiente, junto con el primer contenido de su ejercicio (el banco de palabras, el primer renglón, la tabla para relacionar o el primer renglón del dictado).
2. **Given** un título de grupo ("GRAMMAR", "VOCABULARY", "SPELLING"…), **Then** queda en la misma hoja que el título de su primera sección y que el primer contenido de esa sección.
3. **Given** la hoja del alumno y la clave de respuestas, **Then** las dos cumplen lo anterior, y los renglones siguen sin partirse.
4. **Given** las guías que hoy se imprimen bien, **Then** su contenido no cambia; a lo sumo algún título baja a la hoja siguiente.

### User Story 2 - La franja de las mascotas no deja ver la guía debajo (Priority: P2)

Como alumno en celular, quiero que la franja de abajo, donde están las mascotas, sea sólida, para que ningún campo de la guía se vea debajo del botón "Hide pets" mientras hago scroll.

**Why this priority**: es un defecto visual de GAMES-9 en el iPhone, sin pérdida de información (la página se puede recorrer completa).

**Independent Test**: en ancho de celular, hacer scroll por una guía: lo que pasa por debajo de la franja queda oculto por un fondo sólido, y el botón ocupa menos espacio.

**Acceptance Scenarios**:

1. **Given** una pantalla angosta, **Then** la franja inferior tiene fondo sólido, con una sombra suave arriba. Lo que pasa por debajo al hacer scroll no se ve a través de ella.
2. **Given** una pantalla angosta, **Then** el botón de ocultar se muestra compacto ("🐾"), con un nombre accesible ("Hide pets" o "Show pets"). En pantallas anchas sigue diciendo "🐾 Hide pets" o "🐾 Show pets".
3. **Given** que se ocultan las mascotas, **Then** el botón sigue disponible y funciona como en GAMES-9.

### Edge Cases

- **Una sección muy larga**, más que una hoja: el título va con su primer contenido y el resto puede seguir en la hoja siguiente, como hoy.
- **Clave de respuestas** con "Read aloud" antes de los renglones (dictado, *listening*): el título va junto a ese recuadro.
- **Pantallas anchas**: no hay franja, y nada cambia en la ubicación de las mascotas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Al imprimir, cada título de sección DEBE quedar en la misma hoja que el primer bloque de contenido de su sección.
- **FR-002**: Al imprimir, cada título de grupo DEBE quedar en la misma hoja que el título y el primer bloque de su primera sección.
- **FR-003**: FR-001 y FR-002 DEBEN funcionar también en Safari (iPhone, iPad y Mac). Por eso la solución no puede depender solo de reglas que Safari no respeta.
- **FR-004**: El contenido impreso de las guías (textos, respuestas, renglones y orden) NO DEBE cambiar. Ningún renglón se parte, como en GAMES-3.
- **FR-005**: En pantallas angostas, la franja de las mascotas DEBE tener fondo sólido, y el botón de ocultar DEBE ser compacto y conservar su nombre accesible.
- **FR-006**: Una prueba automática DEBE fallar si un título de sección o de grupo puede quedar separado de su primer bloque al imprimir.
- **FR-007**: Las guías en pantalla no cambian: la huella del recorrido de GAMES-1 sigue igual. Los archivos modificados llevan su versión actualizada (GAMES-5).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En las 6 versiones impresas de las demos y en las de las guías generadas de prueba (hoja del alumno y clave), el 100% de los títulos de grupo y de sección quedan en la misma hoja que su primer contenido.
- **SC-002**: La validación de PDFs de GAMES-3 y de GAMES-6 sigue en "All checks passed".
- **SC-003**: En ancho de celular, ningún contenido de la guía se ve a través de la franja de las mascotas.
- **SC-004**: El usuario vuelve a imprimir la guía desde su iPhone y no ve títulos solos al pie de una hoja.

## Assumptions

- "Primer bloque" es el primer elemento del ejercicio: el banco de palabras, el primer renglón, la tabla para relacionar, el recuadro "Read aloud", la lectura o el recuadro "Remember".
- La validación automática usa el motor de impresión de Chrome. El usuario confirma en Safari (iPhone), porque no se puede automatizar aquí.
