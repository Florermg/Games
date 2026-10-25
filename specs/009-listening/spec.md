# Feature Specification: Nueva opción Listening — audio con subtítulos, luego sin subtítulos y quiz de opciones

**Feature Branch**: `009-listening`

**Created**: 2026-10-25

**Status**: Draft

**Jira**: GAMES-11 (Historia, prioridad alta) · **Modo de ejecución**: continuo (como GAMES-10): todas las fases sin detenerse; autorización para commit, push, PR y merge

**Input**: User description: "Hay una nueva us urgente, vamos a crear una nueva opción Listening, que en esta opción debes generar audios con subtítulos en inglés, acorde al nivel, y posterior sin subtítulos. Y al final un quiz de opciones"

## Contexto y decisiones de diseño

- **Situación actual**: la guía *Reading & Listening* ya tiene una sección de listening: el navegador lee un texto en voz alta y el alumno completa espacios. No hay subtítulos, no hay escucha guiada en etapas y no es una opción propia del menú.
- **Lo que pide el usuario**: una tarjeta nueva **🎧 Listening** en el menú, con tres etapas en orden:
  1. **Escuchar con subtítulos** en inglés: el texto aparece en pantalla al ritmo del audio.
  2. **Escuchar sin subtítulos**: el mismo audio, sin texto en pantalla.
  3. **Quiz de opción múltiple** sobre lo que se escuchó.
- **"Acorde al nivel"**: el audio y las preguntas se adaptan al grado elegido en *Settings for new guides* (3.º a 6.º). Cambian la longitud del texto, la dificultad de las palabras y la velocidad de la voz.
- **Audio sin descargas** (Principios II y VI): lo lee la voz en inglés del navegador, como el listening y el dictado de hoy. No hay archivos de audio ni servicios nuevos.
- **Texto (decisión del usuario: ambos)**: la tarjeta tiene un selector **Audio type** con dos opciones:
  - **📖 Story or dialogue**: una historia o un diálogo corto escrito dentro del juego, uno por cada uno de los 18 temas, con vocabulario de primaria. En los diálogos cada personaje tiene su propia entonación y su nombre aparece en el subtítulo. Sus preguntas también están escritas a mano.
  - **🌐 Facts about the topic**: un texto informativo generado en vivo desde Simple English Wikipedia (CC BY-SA), con los filtros de oraciones fáciles de la guía *Reading & Listening* y la fuente citada. Las preguntas se generan como en la guía Reading.

## Clarifications

### Session 2026-10-25

- Q: ¿Qué tipo de texto se escucha: informativo de Wikipedia, diálogos escritos en el juego, o ambos? → A: (c) Ambos: el alumno elige "Story or dialogue" (escritos en el juego) o "Facts about the topic" (Wikipedia).
- Q: ¿La maestra también la puede imprimir (hoja del alumno y hoja de respuestas con el texto)? → A: (a) Sí, igual que las otras guías.
- Q: ¿Se avanza preguntando en cada fase o sin detenerse? → A: (a) Sin detenerse, como GAMES-10; solo se pide autorización para commit, push, PR y merge.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escuchar con subtítulos y luego sin ellos (Priority: P1) 🎯 MVP

Como alumno de 5.º, quiero escuchar un audio en inglés sobre un tema mientras leo los subtítulos, y después escucharlo sin subtítulos, para entrenar mi oído paso a paso.

**Why this priority**: es el núcleo de la petición; sin las dos escuchas no hay opción Listening.

**Independent Test**: en el menú, elegir tema y grado, abrir 🎧 Listening, reproducir la etapa 1 y comprobar que cada oración aparece en pantalla mientras se escucha; pasar a la etapa 2 y comprobar que suena el mismo audio sin texto visible.

**Acceptance Scenarios**:

1. **Given** el menú con un tema y un grado elegidos, **When** el alumno abre 🎧 Listening, **Then** se genera un audio del tema acorde al grado y se muestra la etapa 1 "Listen and read".
2. **Given** la etapa 1, **When** el alumno presiona ▶ Play, **Then** el navegador lee el texto oración por oración y la oración que suena se muestra como subtítulo, con su número ("2 / 7").
3. **Given** la etapa 1 terminada (o el alumno presiona "Next"), **When** pasa a la etapa 2 "Listen again", **Then** escucha el mismo audio y no se muestra ningún texto del audio.
4. **Given** cualquier etapa de audio, **When** el alumno usa ▶ Play, 🐢 Slow o ⏹ Stop, **Then** puede repetir, escuchar más lento o detener el audio cuantas veces quiera.
5. **Given** el selector Audio type en "Story or dialogue", **When** genera la actividad, **Then** escucha la historia o el diálogo del tema elegido; si es un diálogo, cada personaje suena distinto y su nombre aparece en el subtítulo.
6. **Given** el selector en "Facts about the topic", **When** genera la actividad, **Then** escucha un texto de Wikipedia sobre el tema, con la fuente citada.
7. **Given** un navegador sin voz en inglés, **When** abre Listening, **Then** ve un aviso claro (como el de hoy) y puede leer los subtítulos para no quedar bloqueado.

---

### User Story 2 - Quiz de opción múltiple al final (Priority: P2)

Como alumno, quiero responder al final un quiz de opción múltiple sobre lo que escuché, para saber cuánto entendí.

**Why this priority**: cierra la actividad y da puntaje, pero depende de que exista el audio (US1).

**Independent Test**: terminar las dos escuchas, responder el quiz y comprobar que cada pregunta tiene una sola respuesta correcta, que se califica y que el resultado aparece en la pantalla de resultados.

**Acceptance Scenarios**:

1. **Given** la etapa 2 terminada, **When** el alumno pasa a la etapa 3, **Then** ve de 5 a 6 preguntas de opción múltiple (3 o 4 opciones cada una), sin subtítulos.
2. **Given** el quiz, **When** el alumno revisa una pregunta, **Then** recibe la corrección y una pista como en las otras guías, y al terminar ve su puntaje en la pantalla de resultados con el repaso de lo que falló.
3. **Given** el quiz, **When** el alumno necesita volver a oír, **Then** puede reproducir el audio sin subtítulos.
4. **Given** cualquier pregunta, **Then** su respuesta correcta se puede deducir solo de lo que dice el audio.

---

### User Story 3 - Imprimir la actividad (Priority: P3)

Como maestra, quiero imprimir la hoja del alumno (las preguntas) y la hoja de respuestas con el texto del audio, igual que las otras guías.

**Why this priority**: útil para clase, pero la actividad funciona en pantalla sin esto.

**Independent Test**: con una actividad generada, imprimir 📄 Student sheet y 🔑 Answer key y comprobar que la hoja del alumno no trae el texto del audio y la de respuestas sí, con las respuestas marcadas.

**Acceptance Scenarios**:

1. **Given** una actividad Listening, **When** la maestra imprime la hoja del alumno, **Then** salen las preguntas con sus opciones y no sale el texto del audio.
2. **Given** la misma actividad, **When** imprime la hoja de respuestas, **Then** salen el texto del audio (para leerlo en voz alta), la fuente y las respuestas correctas.

---

### Edge Cases

- **Sin internet o tema sin texto suficiente**: mensaje claro "Try another topic!", como en las otras guías.
- **iPhone/iPad**: la voz solo empieza después de que el alumno toca un botón; el audio nunca arranca solo.
- **Salir a mitad del audio** (Menu, cambiar de etapa): el audio se detiene.
- **Subtítulos sin eventos de la voz**: algunos navegadores no avisan cuándo va cada palabra; los subtítulos avanzan por oración, que sí funciona en todos.
- **Pantalla angosta**: los subtítulos se leen sin scroll horizontal en un celular de 360 px.
- **Tema propio escrito por el alumno con "Story or dialogue"**: no hay historia escrita para ese tema; el juego avisa "Stories are only for the topics in the list. Choose a topic from the list or use Facts about the topic."
- **Repetir la actividad**: "Try again" vuelve a la etapa 1 con el mismo audio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El menú DEBE tener una tarjeta nueva **🎧 Listening** con botón para generar una actividad nueva, que usa el tema y el grado de *Settings for new guides*.
- **FR-002**: La actividad DEBE tener tres etapas en orden: (1) escuchar con subtítulos, (2) escuchar sin subtítulos, (3) quiz de opción múltiple. El alumno avanza con un botón "Next".
- **FR-003**: El audio DEBE leerlo la voz en inglés del navegador, sin archivos de audio ni descargas.
- **FR-004**: En la etapa 1, los subtítulos DEBEN mostrarse oración por oración: se ve la oración que suena en ese momento.
- **FR-005**: En las etapas 2 y 3 NO DEBEN mostrarse los subtítulos ni el texto del audio. Las preguntas del quiz pueden citar una oración (con un espacio o como opción), como en la guía Reading. Al terminar el quiz, el alumno puede ver el texto completo para repasar.
- **FR-006**: El texto y la velocidad DEBEN adaptarse al grado: más oraciones, palabras menos frecuentes y voz más rápida en grados más altos.
- **FR-007**: El quiz DEBE tener entre 5 y 6 preguntas, con 3 o 4 opciones y una sola correcta, que se responda con lo que dice el audio.
- **FR-008**: La calificación y la pantalla de resultados DEBEN funcionar como en las otras guías (puntaje, pistas, repaso).
- **FR-009**: La hoja del alumno y la hoja de respuestas DEBEN poder imprimirse; el texto del audio solo va en la hoja de respuestas.
- **FR-010**: La fuente del texto de Wikipedia DEBE citarse (Simple English Wikipedia, CC BY-SA).
- **FR-013**: La tarjeta DEBE tener el selector **Audio type** (Story or dialogue / Facts about the topic).
- **FR-014**: DEBE existir una historia o un diálogo escrito a mano para cada uno de los 18 temas (al menos 6 diálogos), de 8 oraciones, con 7 preguntas de 3 opciones; cada respuesta correcta aparece en la oración del audio que la respalda.
- **FR-015**: En "Story or dialogue", el grado ajusta cuántas oraciones se escuchan (5 a 8) y la velocidad; solo se incluyen las preguntas sobre las oraciones escuchadas (5 o 6).
- **FR-016**: En los diálogos, cada personaje DEBE sonar con una entonación distinta, y su nombre DEBE aparecer en el subtítulo y en la hoja de respuestas.
- **FR-011**: Debe funcionar en PC, iPhone, iPad y Android, y al abrir con doble clic.
- **FR-012**: Las guías existentes NO DEBEN cambiar (huella del recorrido de GAMES-1 `f1 b9 82 7e 2c 76`).

### Key Entities

- **Actividad Listening**: tema, grado, tipo de audio, texto del audio (oraciones con su personaje, si es diálogo), velocidad, fuente y preguntas.
- **Historia o diálogo**: tema, título, tipo (story/dialogue), 8 oraciones (con personaje en los diálogos) y 7 preguntas con la oración que las respalda.
- **Pregunta del quiz**: enunciado, opciones, índice de la correcta, pista y explicación.

## Success Criteria *(mandatory)*

- **SC-001**: En "Story or dialogue", los 18 temas y los 4 grados generan una actividad completa el 100% de las veces, sin internet. En "Facts about the topic", los 18 temas en 5.º generan una actividad en al menos el 90% de los intentos.
- **SC-002**: En la etapa 1, el 100% de las oraciones del audio aparecen como subtítulo mientras suenan.
- **SC-003**: En las etapas 2 y 3, los subtítulos y el texto del audio no están visibles en pantalla (salvo lo que citan las preguntas) hasta que el quiz se califica.
- **SC-004**: El 100% de las preguntas tienen exactamente una opción correcta y esa opción aparece en el texto del audio.
- **SC-005**: Un alumno completa las tres etapas en menos de 10 minutos.
- **SC-006**: La huella de GAMES-1 no cambia y `npm test` pasa.

## Assumptions

- La voz es la del navegador (la misma de hoy); su calidad depende del dispositivo.
- La actividad usa los temas y grados existentes; no hay temas nuevos.
- En "Facts", las preguntas se generan con las técnicas de la guía Reading, adaptadas a lo escuchado. En "Story or dialogue", están escritas a mano.
- Las historias y diálogos los escribe el equipo (Claude) a nivel primaria; la revisión de una maestra queda recomendada, como en otras historias.
- No se guarda el progreso entre sesiones.
- "Story or dialogue" funciona sin internet, porque el contenido viene en el juego.
