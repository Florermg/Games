# Research: Nueva opción Listening

## R1. Subtítulos sincronizados con la voz del navegador

- **Decision**: encolar una `SpeechSynthesisUtterance` por oración. El evento `onstart` de cada una muestra su oración y su número, y el `onend` de la última avisa que terminó. Las utterances se guardan en un arreglo para que el recolector de basura de Chrome no pierda sus eventos. Un *token* que cambia en cada `cancel()` invalida los eventos de una lectura detenida.
- **Rationale**: `onstart` por utterance funciona en Chrome, Edge, Safari macOS/iOS y Android. El evento `onboundary` (por palabra) no es confiable en iOS ni con voces de red.
- **Alternatives**: una sola utterance con `onboundary` (iOS no lo dispara de forma consistente); estimar tiempos por longitud (se desincroniza).

## R2. Preguntas del quiz

- **Decision**: parametrizar `readingQuestions(article, passage, keywords, wording)` con un objeto de textos y un máximo de preguntas. `READING_WORDING` reproduce exactamente los textos de hoy, así que la guía Reading no cambia. `LISTENING_WORDING` dice "audio" y da pistas por posición ("near the beginning / in the middle / near the end of the audio"), con un máximo de 6 preguntas.
- **Rationale**: es la misma técnica probada (tema principal, palabra que completa, oración verdadera), con respuestas que salen del texto escuchado, y el mismo orden de llamadas a `Math.random`.
- **Alternatives**: un generador nuevo (duplica lógica).

## R3. Nivel por grado

- **Decision**: en `GRADE_LEVELS`, `listeningSentences` = 5/6/7/8 y `speechRate` = 0.8/0.85/0.9/0.95 para 3.º/4.º/5.º/6.º. Las oraciones pasan el filtro de frecuencia del grado (`minFreq`), igual que en Reading. 🐢 Slow = `speechRate − 0.2`.
- **Rationale**: textos más largos, palabras menos frecuentes y voz más rápida en grados altos (FR-006).

## R4. Etapas en el motor e impresión

- **Decision**: la guía tiene 3 secciones con `stage` 1–3. `renderGuide` muestra solo la etapa actual; cada etapa tiene "Next ▶" (y "⬅ Back" desde la 2). Las secciones `listen` no tienen ítems ni botón de calificar, y nacen `done` para que "Finish" no las cuente como pendientes; la tabla de resultados las omite. El quiz es un `choice` con `script`, así que tiene una barra de audio sin subtítulos y, al calificarse, el botón "📜 Show audio text" que ya existe.
- **Impresión**: `PRINT_RENDERERS.listen` da una instrucción ("🎧 Listen…") en la hoja del alumno. En la hoja de respuestas, la etapa 1 trae el texto "Read aloud" con su fuente. Así la primera pieza siempre es `.print-item` o `.read-aloud` (GAMES-10).
- **Alternatives**: una pantalla nueva fuera del motor (duplica calificación, resultados e impresión).

## R5. Historias y diálogos escritos a mano (aclaración 1c)

- **Decision**: un archivo nuevo `English/js/listening-stories.js` con `LISTENING_STORIES`, uno por clave de `TOPICS`.
  - Cada uno trae `{ title, kind: "story"|"dialogue", lines: [{ speaker?, text }] × 8, questions: [{ text, options (3), answer, line, tip }] × 7 }`.
  - Las preguntas están ordenadas por `line`: 5 sobre las oraciones 0–4 y 2 sobre las 5–7. Así el grado 3 (5 oraciones) tiene 5 preguntas, y los grados 5 y 6, 6.
- **Voces**: en los diálogos, `pitch` 1.2 para el primer personaje y 0.85 para el segundo, con la misma voz en inglés. El nombre se muestra y no se lee.
- **Rationale**: es contenido controlado y apto para primaria (Principio VI), funciona sin internet y es comprobable por pruebas (la respuesta aparece en su oración, ASCII, sin `UNSAFE`).
- **Alternatives**: generar historias con plantillas (suenan artificiales).
