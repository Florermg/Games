# Validación: Nueva opción Listening (GAMES-11)

**Fecha**: 2026-10-25 · **Rama**: `009-listening`

## Pruebas automáticas

- `npm test`, 3 ejecuciones: `tests 260 · pass 258 · fail 0 · todo 2` (los 2 `todo` son de GAMES-2).
  - Hay 16 pruebas nuevas en `listening.test.mjs`.
  - Las de impresión de GAMES-3 y GAMES-10 recorren el escenario nuevo `listening-space-g5`.
- `npm run versions`: QuizA.html pide 14 archivos (1 CSS y 13 JS, incluido `listening-stories.js`), todos al día.
- **Guía Reading sin cambios**: `readingQuestions` ahora recibe sus textos como parámetro (`READING_WORDING`), y las pruebas de `rl-space-g5` (misma guía con la misma semilla) siguen pasando.
- **Contenido escrito a mano (FR-014)**:
  - 18 textos, uno por tema: 8 diálogos y 10 historias, de 8 oraciones y 7 preguntas cada uno.
  - La respuesta correcta se escucha en su oración y las incorrectas no.
  - Texto ASCII, sin palabras `UNSAFE`.
  - La prueba encontró 7 preguntas ambiguas (por ejemplo, "White" en "white lights confuse them"), que se corrigieron.
- **Story mode (SC-001)**: los 18 temas en los 4 grados generan la guía completa sin internet. Se escuchan 5, 6, 7 y 8 oraciones a 0.8, 0.85, 0.9 y 0.95, con 5–6 preguntas, solo sobre lo escuchado.

## Navegador (Chrome, `http://127.0.0.1:8765`)

- **Huella de GAMES-1**: `f1 b9 82 7e 2c 76` (4,817), sin cambios. Consola sin errores.
- **Diálogo "Jobs", 5.º**:
  - Etapa 1: los subtítulos siguen a la voz ("3 / 7", con el nombre del personaje).
  - "Next" lleva a la etapa 2, sin subtítulos y con el audio detenido, y otro "Next" lleva al quiz.
  - El quiz trae su barra de audio, y el texto queda oculto hasta calificar.
  - Al calificar con 1 error y luego corregirlo: `6 / 6 pts`, *Average* 10. La tabla de resultados muestra solo el quiz.
- **Facts en vivo (SC-001)**: los 18 temas en 5.º generaron una actividad, el 100% (7 oraciones y 6 preguntas, de 0.2 a 1.1 s).
- **Celular (390 px)**: sin scroll horizontal y con los subtítulos legibles.

## Impresión (Chrome y WebKit, hoja carta)

- **Hoja del alumno**: las 3 etapas con su instrucción ("🎧 Listen…") y las preguntas, sin el texto del audio.
- **Answer key**: "Read aloud" con el texto (con los nombres de los personajes en los diálogos), la fuente y las respuestas marcadas.
- **WebKit**: ningún título queda solo al pie; los cortes de página caen entre preguntas.

## Observaciones

- En "Facts", algunas opciones incorrectas de "Which sentence is TRUE" no tienen sentido ("a huge *went* of hot gas"). Es el mismo generador de la guía Reading, y entra en la historia pendiente de afinar el vocabulario generado.
- **Pendiente para el usuario**: probar la voz y los subtítulos en iPhone y iPad (GAMES-4), y que una maestra revise las historias.
