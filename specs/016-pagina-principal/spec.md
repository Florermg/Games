# Feature Specification: Página principal para elegir materia

**Feature Branch**: `016-pagina-principal`

**Created**: 2026-10-31

**Status**: Draft

**Jira**: GAMES-18 (Historia) · **Modo de ejecución**: continuo (solo se pide autorización para commit, push, PR y merge) · **Depende de**: GAMES-17

**Input**: User description: "genera una página donde pueda seleccionar qué materia estudiar, ya que además de inglés, español, habrá matemáticas, de preferencia usa el nombre de QuizA.html como la principal y realiza una copia de QuizA.html a Ingles.html; en la página principal debemos de poder seleccionar la ciudad en donde estamos, capturar nuestro nombre y un campo adicional: un resumen de los exámenes del alumno y no poner calificación, pero sí, con base en el promedio, poner frases alentadoras y comunicar de manera genial dónde tiene que mejorar".

## Clarifications

### Session 2026-10-31

- Q: ¿Cómo aparece Matemáticas? → A: **a**. Tarjeta "🔢 Matemáticas — próximamente", que no se abre.
- Q: ¿Idioma de la página principal? → A: se puede **elegir inglés o español**; **inglés por omisión**; se recuerda la elección en el equipo.
- Q: ¿Qué exámenes cuentan para el resumen? → A: **a**. Demos y guías nuevas terminadas, de inglés y de campos formativos, por alumno (nombre), las últimas 50.
- Q: ¿El nombre se escribe una vez? → A: **a**. Se escribe en la página principal, se recuerda y aparece en cada materia; se puede cambiar.
- Q: ¿Dónde no hay calificación? → A: **solo en el resumen de la página principal** (es el resumen de su actividad reciente); los resultados de cada guía siguen igual.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Elegir la materia (Priority: P1) 🎯 MVP

**Independent Test**: abrir `QuizA.html`: tarjetas English → `Ingles.html`, Español (Campos formativos) → `campos/Guia5.html` y Matemáticas "próximamente"; cada materia tiene un botón para volver.

**Acceptance Scenarios**:

1. **Given** la página principal, **Then** se ven las 3 materias; Matemáticas no se puede abrir y dice "próximamente".
2. **Given** `Ingles.html`, **Then** es el juego de inglés de siempre (huella de GAMES-1 igual), con "⬅ All subjects" para volver.
3. **Given** `campos/Guia5.html`, **Then** "⬅ Materias" vuelve a la página principal.

### User Story 2 - Nombre, ciudad e idioma (Priority: P1)

**Acceptance Scenarios**:

1. **When** escribe su nombre en la página principal, **Then** aparece ya escrito en inglés y en campos formativos (y se puede cambiar ahí).
2. **Given** la ventana del clima, **When** elige su ciudad, **Then** el clima es de esa ciudad en todas las páginas.
3. **Given** la primera vez, **Then** la página está en inglés; **When** elige "Español", **Then** todo cambia a español (textos, clima, saludo, mascotas) y se recuerda al volver.

### User Story 3 - Resumen alentador de su actividad (Priority: P1)

**Independent Test**: Ana termina 3 guías (inglés y campos) con distintos resultados; en la página principal ve su resumen sin números: una frase alentadora según su promedio, lo que domina y qué reforzar con una sugerencia concreta.

**Acceptance Scenarios**:

1. **Given** guías terminadas, **Then** cada guía se guarda para ese alumno con la materia, el nombre de la guía, la fecha y los aciertos por área (inglés: Grammar, Vocabulary, Spelling, Reading, Listening, Writing; campos: cada tema).
2. **Given** el resumen, **Then** no muestra calificaciones, puntos, porcentajes ni promedios; muestra una frase según su nivel (4 niveles), por materia y en general.
3. **Given** áreas con buen resultado, **Then** se celebran ("Dominas…"); **Given** áreas con resultado bajo, **Then** se dicen de forma positiva con qué hacer (por ejemplo, "Repasa la tarjeta «Sistema circulatorio» y genera una guía de Saberes").
4. **Given** su actividad reciente, **Then** ve la lista de sus últimas guías con fecha, materia y un emoji de logro, sin números.
5. **Given** un alumno sin guías, **Then** se le invita a empezar.
7. **Given** premios ganados antes de esta versión, **Then** el resumen dice cuántos accesorios ya ganó y cuál fue el último (es un logro, no una calificación).
6. **Given** otro nombre, **Then** se ve el resumen de ese alumno.

### Edge Cases

- Sin nombre: las guías se guardan como "Guest/Invitado" (como los premios).
- Navegador que no deja guardar: todo funciona, pero el resumen avisa que no se puede guardar.
- Más de 50 guías: se conservan las 50 más recientes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `QuizA.html` DEBE ser la página principal con las materias; `Ingles.html` DEBE ser el juego de inglés (copia del `QuizA.html` anterior) con un enlace a la principal.
- **FR-002**: La página principal DEBE tener nombre, ciudad del clima (GAMES-15) e idioma (inglés por omisión, recordado).
- **FR-003**: El nombre DEBE guardarse en el equipo y llenarse solo en todas las páginas.
- **FR-004**: Cada guía terminada (inglés y campos) DEBE registrarse por alumno: materia, título, si es demo, fecha, puntos por área; se guardan las últimas 50.
- **FR-005**: El resumen DEBE mostrar, sin números: frase general y por materia según el nivel (4 niveles), fortalezas (hasta 3) y áreas a reforzar (hasta 3) con una sugerencia concreta, y la actividad reciente (hasta 8) con emoji de logro.
- **FR-006**: Lo demás no cambia: huella de GAMES-1 en `Ingles.html`, mascotas, premios, ambiente y festividades en las 3 páginas; versiones (GAMES-5) en las 3 páginas; abre con doble clic.

### Key Entities

- **Examen**: `{ date, subject: "english" | "campos", title, demo, areas: [{ id, label, score, max }] }`.
- **Historial de un alumno**: nombre y sus exámenes (máx. 50).

## Success Criteria *(mandatory)*

- **SC-001**: El resumen nunca muestra dígitos de calificación (prueba automática sobre todos los niveles y combinaciones).
- **SC-002**: Para cualquier historial, las áreas a reforzar son las de menor resultado y las fortalezas las de mayor.
- **SC-003**: `npm test` en verde; huella de GAMES-1 sin cambios en `Ingles.html`; 390 px sin scroll horizontal en la principal.

## Assumptions

- Los niveles por promedio: ≥ 90 % "estrella", ≥ 75 % "muy bien", ≥ 60 % "en camino", < 60 % "creciendo".
- Las fechas de la actividad reciente se muestran como día y mes (no son calificaciones).
- `nutritrack.mx/quiz/QuizA.html` sigue siendo la dirección de entrada; hay que subir `Ingles.html`.
