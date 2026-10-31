# Validation: GAMES-19 (2026-10-31)

## Pruebas automáticas

- Línea base en `d62c689` (GAMES-18): `370 · pass 368 · fail 0 · todo 2`.
- `backup.test.mjs`: 9 pruebas escritas antes del código. Con `backup.js` vacío fallaban las 9.
  - Cubren el formato, la verificación de un carácter cambiado (SC-002), lo que no es un respaldo y la versión futura.
  - También el código con y sin compresión (pegado con espacios), el nombre del archivo, juntar en un equipo vacío y en uno con datos sin borrar ni repetir, el máximo de 50 y el cuaderno opcional.
  - Y los textos en los dos idiomas.
- `hub.test.mjs`: una prueba nueva para la tarjeta del respaldo y sus scripts.
- El contexto de prueba agrega Web Crypto, `TextEncoder`/`TextDecoder`, `CompressionStream`/`DecompressionStream`, `Blob`, `Response` y `btoa`/`atob`.
- Final, 3 corridas: `380 · pass 378 · fail 0 · todo 2`.

## Chrome (127.0.0.1:8765)

El "otro equipo" se simuló borrando el `localStorage` del mismo navegador. No hubo descargas reales: la descarga se interceptó dentro de la página para leer el archivo.

- Equipo A: Ana con 2 premios, ropa, 2 guías y 1 página del cuaderno.
  - Sin nombre: "Write your name first…".
  - "Download my backup" genera `backup-ana-2026-10-31.json` (1,444 caracteres).
  - "Copy my code" genera `GAMES1-…` (711 caracteres, comprimido). En la primera prueba el portapapeles del Chrome automatizado no respondió y el código no se veía; ahora el código siempre aparece en pantalla y, a los 2 s sin respuesta, dice "select the code below and copy it".
- Equipo B (vacío):
  - Sin elegir nada: "Choose your backup file or paste your code first."
  - Archivo con un premio cambiado (`witchHat` → `crown`): "incomplete or was changed… Nothing was modified." `games-pets-v1` sigue vacío.
  - "hola maestra": "That is not a backup of the game."
  - El código, pegado con un salto de línea:
    - el nombre cambia a "Ana";
    - el gatito trae su sombrero de bruja;
    - el cuaderno tiene su página;
    - el resumen muestra sus 2 guías, "Ya ganaste 2 accesorios…", la fortaleza y el reto.
  - El archivo otra vez: 0 nuevos. Sigue habiendo 2 guías.
- Se corrigió el mensaje de recuperación ("1 notebook pages"). Ahora dice "premios 2 · guías 2 · páginas del cuaderno 1".
- 390 px (iframe): `scrollWidth = clientWidth`. Consola sin errores.
- Se borraron `localStorage` y `sessionStorage` de prueba.
- Huella de GAMES-1: no se volvió a correr. Esta historia no cambia los scripts del juego de inglés: en `Ingles.html` y `campos/Guia5.html` solo cambia el `?v=` de `css/quiz.css`. Los demás cambios son `js/hub.js`, `js/backup.js`, `QuizA.html`, `css/quiz.css` y las pruebas.

Captura (español): `/var/folders/hs/p759lpwx1gs9xs5bwhh_dy5h0000gn/T/claude-chrome-screenshots-xTwZ7O/screenshot-1793481354962-8.jpg`

## Pendiente

- Probar entre dos equipos reales (por ejemplo, de la PC al iPad), con archivo y con código.
- Fase 2 (servidor y cifrado): GAMES-20.
