# Validation: Ejercicios por tema (GAMES-21)

Fecha: 2026-10-31 · Rama `018-ejercicios-por-tema`

| Criterio | Resultado |
|---|---|
| Pruebas nuevas antes del código | Las 3 pruebas de `buildTemaGuide` y la numeración fallaron; la de mínimos por tema pasó con el contenido nuevo |
| SC-001 `npm test` | 384 pruebas: 382 pasan, 0 fallan, 2 marcadas como pendientes (todo), como en `main` |
| SC-001 los 21 temas | Cada uno abre sus 6 tipos de ejercicio, de 21 a 33 puntos por tema |
| Navegador (Chrome, `127.0.0.1:8765/campos/Guia5.html`) | Lista de 21 temas numerados; "2. Clases de palabras: variables e invariables" abre 6 secciones, 27 puntos; hoja y clave para imprimir; resultados; se guarda en el avance; 21 botones en las tarjetas de repaso; consola sin errores |
| SC-002 390 px | Sin scroll horizontal (ancho 371 px) en el menú, los ejercicios y las tarjetas |
| SC-003 juego de inglés | `English/js`, `English/css`, `Ingles.html` y `QuizA.html` no cambian respecto a `main`. No se corrió la huella de GAMES-1 porque el script ya no está en la carpeta temporal; no hace falta porque ningún archivo del juego cambió |

Pendiente para la escuela: que un maestro revise las preguntas nuevas.
