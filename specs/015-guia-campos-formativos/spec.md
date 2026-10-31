# Feature Specification: Guía 5.º Campos formativos

**Feature Branch**: `015-guia-campos-formativos`

**Created**: 2026-10-31

**Status**: Draft

**Jira**: GAMES-17 (Historia) · **Modo de ejecución**: continuo (solo se pide autorización para commit, push, PR y merge)

**Input**: User description: "esta es la Guía de estudio, agreguemos una opción nueva, debe ser otro HTML porque es otra materia, analízalo y debe seguir el mismo estándar". Fuente: *5to - Guía de estudio - 1er trim 26-27.pdf* (14 páginas, en español; no se guarda en el repositorio).

## Clarifications

### Session 2026-10-31

- Q: ¿Dónde vive el nuevo HTML y cómo se llega? → A: **a**. Página propia en una carpeta nueva; el menú de inglés tiene una tarjeta que la abre y la página tiene un botón para regresar. La carpeta va dentro de lo que se publica (`English/campos/Guia5.html` → `nutritrack.mx/quiz/campos/Guia5.html`), para no cambiar la forma de publicar y compartir los archivos del juego.
- Q: ¿En qué idioma? → A: **a**. Todo en español: botones, tutora y voz (es-MX).
- Q: ¿Qué se comparte con el juego de inglés? → A: **a**. Mascotas con premios y My Pets (mismo nombre = mismos accesorios), ambiente (hora, clima, estación) y festividades, con sus textos en español en esta página.
- Q: ¿Qué ejercicios? → A: **todos**: opción múltiple, verdadero o falso, relacionar columnas, completar con banco de palabras, clasificar y respuesta abierta corta.

## Contenido de la guía (21 temas en 4 campos formativos)

| Campo formativo | Temas |
|---|---|
| Lenguajes | Tipos de sustantivos · Palabras variables e invariables · Artículos determinados e indeterminados · Sustantivos y adjetivos · Palabras polisémicas · Prefijos y sufijos |
| Saberes y pensamiento científico | Huella hídrica y agua virtual · Contaminación del agua, aire y suelo · Sistema respiratorio · Sistema circulatorio · Impacto de nuestras acciones en el ambiente y la salud · Acciones para cuidar el ambiente |
| Ética, naturaleza y sociedades | Sustentabilidad y las 5 R · Energías renovables y no renovables · Las capas (esferas) de la Tierra · Independencia de México |
| De lo humano y lo comunitario | Escuchar activamente · Tomar decisiones en grupo · Resolución de conflictos · Comunicación en grupo · Reuniones para llegar a acuerdos |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contestar la guía demo (Priority: P1) 🎯 MVP

Como alumno, quiero contestar una guía con preguntas de los 4 campos formativos y saber mi promedio.

**Independent Test**: abrir `campos/Guia5.html`, ▶ Demo, contestar todo y terminar: resultados con puntos, promedio sobre 10, tabla por sección y repaso de lo que faltó.

**Acceptance Scenarios**:

1. **Given** la demo, **Then** tiene una sección de cada tipo (opción múltiple, verdadero o falso, relacionar, banco de palabras, clasificar y respuesta abierta) con preguntas de los 4 campos, tomadas del contenido de la guía.
2. **When** revisa una sección, **Then** cada respuesta mal tiene una pista; hay 2 intentos por sección; al terminar se ve la respuesta correcta con su explicación.
3. **Given** una respuesta abierta, **Then** se califica por ideas clave (sin importar acentos ni mayúsculas) y al final se muestra la respuesta modelo.
4. **When** termina, **Then** ve los resultados como en el juego de inglés, en español.

### User Story 2 - Guías nuevas (Priority: P1)

**Independent Test**: elegir "Lenguajes" y 🎲 Generar: guía nueva solo con temas de Lenguajes; otra vez: preguntas distintas.

**Acceptance Scenarios**:

1. **Given** uno o varios campos elegidos, **Then** la guía toma preguntas solo de esos campos, sin repetir preguntas dentro de la guía.
2. **Given** un campo sin suficientes preguntas de un tipo, **Then** esa sección lleva las que haya (o no aparece si no hay ninguna).
3. **Given** una guía generada con 100%, **Then** se gana un accesorio para las mascotas (GAMES-14); la demo no da premio.

### User Story 3 - Tarjetas de repaso (Priority: P1)

**Independent Test**: abrir "📚 Tarjetas de repaso", filtrar por campo, escuchar una tarjeta e imprimir las elegidas.

**Acceptance Scenarios**:

1. **Given** la pantalla de tarjetas, **Then** hay una tarjeta por tema (21) con el resumen de la guía (definiciones, ejemplos y "Recuerda").
2. **When** toca 🔊, **Then** la tarjeta se lee en voz alta en español (si el navegador tiene voz).
3. **When** imprime, **Then** salen solo las tarjetas elegidas, en 1 o 2 columnas.

### User Story 4 - Imprimir la guía (Priority: P1)

**Acceptance Scenarios**:

1. **Given** una guía abierta, **When** 🖨 → "Hoja del alumno", **Then** se imprime en blanco para contestar a mano (Nombre, Grupo, N.L., Fecha, Promedio, Maestra/o).
2. **When** "Clave de respuestas", **Then** la misma hoja con las respuestas y, en las abiertas, la respuesta modelo.

### User Story 5 - Lo compartido con el juego de inglés, en español (Priority: P2)

**Acceptance Scenarios**:

1. **Given** la página nueva, **Then** se ven el gatito y el perrito, el cielo con el clima y las festividades, todo con textos en español.
2. **Given** un alumno con accesorios ganados en inglés, **When** escribe el mismo nombre aquí, **Then** sus mascotas traen lo mismo, y en 🐾 Mis mascotas puede vestirlas.
3. **Given** el menú de inglés, **Then** tiene la tarjeta "📚 Guía 5.º — Campos formativos" que abre la página nueva; la página nueva tiene "⬅ Inglés" para regresar.
4. **Given** el juego de inglés, **Then** sigue igual (huella de GAMES-1 sin cambios).

### Edge Cases

- Respuesta abierta vacía o de una palabra: se pide contestar antes de revisar (como las demás secciones).
- Navegador sin voz en español: se usa la voz que haya y, si no hay ninguna, el botón 🔊 avisa.
- Las preguntas no deben depender del orden de las opciones: las opciones se mezclan en las guías generadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La página `English/campos/Guia5.html` DEBE estar en español (`lang="es"`), abrir con doble clic y no necesitar internet (salvo el clima opcional).
- **FR-002**: El banco de contenido DEBE cubrir los 21 temas con: una tarjeta de repaso por tema y preguntas de 6 tipos; cada pregunta indica su campo y su tema, su pista y su explicación.
- **FR-003**: La demo DEBE ser fija (siempre igual), con una sección de cada tipo y preguntas de los 4 campos.
- **FR-004**: Las guías generadas DEBEN tomar preguntas al azar de los campos elegidos, sin repetir, mezclando las opciones; secciones: opción múltiple (8), verdadero o falso (8), relacionar (5), banco de palabras (5), clasificar (6) y respuesta abierta (2), o menos si no alcanzan.
- **FR-005**: La revisión DEBE ser como en el juego de inglés: un punto por pregunta, 2 intentos por sección, pistas, respuesta correcta con explicación, promedio sobre 10, tabla y repaso.
- **FR-006**: Las respuestas abiertas DEBEN calificarse por ideas clave (cada idea acepta sinónimos; sin acentos ni mayúsculas) con un mínimo de ideas por pregunta, y mostrar la respuesta modelo.
- **FR-007**: La impresión (hoja del alumno y clave) y las tarjetas impresas DEBEN seguir el estándar de GAMES-3, GAMES-8 y GAMES-10, en español.
- **FR-008**: Mascotas, premios, My Pets, ambiente y festividades DEBEN funcionar en la página nueva con textos en español; en inglés no cambia nada.
- **FR-009**: Los archivos de la página nueva DEBEN llevar su versión (GAMES-5), también los compartidos (`../js`, `../css`).
- **FR-010**: El menú de inglés DEBE enlazar a la página nueva y la página nueva al menú de inglés.

### Key Entities

- **Campo formativo**: id, nombre, emoji.
- **Tema**: id, campo, título, tarjeta (puntos del resumen), preguntas por tipo.
- **Conjunto para clasificar**: tema, instrucción, categorías y elementos.
- **Pregunta abierta**: texto, ideas clave (grupos de sinónimos), mínimo de ideas, respuesta modelo y pista.

## Success Criteria *(mandatory)*

- **SC-001**: Los 21 temas de la guía tienen tarjeta y preguntas; ninguna pregunta contradice la guía (revisión de un maestro recomendada).
- **SC-002**: 200 guías generadas con distintas semillas son válidas: solo de los campos elegidos, sin preguntas repetidas y con respuestas válidas.
- **SC-003**: Se puede contestar la demo completa y terminar en menos de 20 minutos.
- **SC-004**: `npm test` en verde; huella de GAMES-1 sin cambios; 390 px sin scroll horizontal en las dos páginas.

## Assumptions

- La escuela se deja en blanco en los encabezados, como en las demos de inglés; la fuente se cita como "Guía 5.º Primer trimestre 2026-2027".
- Las imágenes propias de las mascotas (GAMES-9) solo aplican a la página de inglés; aquí se usan los dibujos.
- La tarjeta de vocabulario en inglés de las festividades no se muestra en esta página; sí la decoración y el saludo en español.
