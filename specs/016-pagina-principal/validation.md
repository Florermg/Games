# Validation: GAMES-18 (2026-10-31)

## Pruebas automáticas

- Línea base en la rama de GAMES-17 (`198bfe2`): `353 · pass 351 · fail 0 · todo 2`.
- `hub.test.mjs`: tiene 8 pruebas, que cubren la página principal, los enlaces, el idioma, el nombre compartido, el saludo sin tarjeta de palabras y Mis mascotas sin su pantalla. Las 7 primeras se escribieron antes del código y fallaron (`fail 7`) antes de implementarlo.
- `progress.test.mjs`: tiene 9 pruebas (8 + `prizesLine`), que cubren el registro, los niveles, el resumen sin calificaciones en 4 niveles × 2 idiomas, y las fortalezas y los retos. **Se escribieron antes del código, pero no se corrieron antes de implementarlo**: la primera corrida ya fue con `progress.js` escrito.
- Las pruebas del juego de inglés (`responsive`, `pets`, `versions`, `campos-shared`) ahora leen `Ingles.html`. `versions.test.mjs` espera 23 archivos, porque se agregaron `progress.js` y `student.js`, y revisa las 3 páginas.
- Resultado final, en 3 corridas: `369 · pass 367 · fail 0 · todo 2`.

## Chrome (127.0.0.1:8765)

- **Primera vez**, con `localStorage` vacío: la página sale en inglés ("🌟 My Study Hub 🌟"), con el saludo "🎃💀 Happy Halloween and happy Day of the Dead! Let's have fun studying!".
  - **El clima con la ubicación del navegador sí funcionó**: "Cloudy, 24 °C where you are". Es la parte de GAMES-15 que no se había podido verificar.
- **Idioma**: "Español" cambia todo a español: el título, el clima ("donde estás", "📍 Donde estoy"), el saludo, "Ocultar mascotas" y el resumen. Al recargar se conserva el español. "English" regresa a inglés.
- **Nombre**: "Ana", escrito en la principal, aparece ya escrito en `Ingles.html` y en `campos/Guia5.html`.
  - Con "Luis", que no tiene guías: "👋 Hi, Luis! Choose a subject…".
  - El primer intento decía "Hi, friend!" aunque el nombre ya estaba escrito. Se corrigió.
- **Enlaces**: "⬅ All subjects" (`QuizA.html`) en inglés y "⬅ Materias" (`../QuizA.html`) en campos.
- **Registro de guías**: la demo de inglés (Grammar 15/15, Vocabulary 0/13, Spelling 0/10) y una guía de campos de Lenguajes y Saberes, con Lenguajes bien y Saberes mal, quedaron en `games-progress-v1`.
- **Resumen**, sin números:
  - frase general por nivel y una frase por materia;
  - "Dominas Tipos de sustantivos / Gramática / Sustantivos y adjetivos";
  - retos de Vocabulario y Ortografía, cada uno con su sugerencia propia, y «Huella hídrica y agua virtual» con su campo;
  - últimas guías con fecha y emoji.
  - Al principio todas las áreas de inglés tenían la misma sugerencia; ahora cada una tiene la suya.
- **Error encontrado y corregido**: en la página principal, `my-pets.js` buscaba `#pets-screen` al cambiar el nombre (`TypeError … classList`). Ahora lo revisa primero, y una prueba lo cubre. Después, la consola quedó sin errores en las 3 páginas.
- **390 px** (iframe) en inglés y en español: `scrollWidth = clientWidth`.
- **Huella de GAMES-1 en `Ingles.html`**: `f1 b9 82 7e 2c 76 · largo 4817`, sin cambios.
- Se borró el `localStorage` de prueba.

Captura del resumen en español: `/var/folders/hs/p759lpwx1gs9xs5bwhh_dy5h0000gn/T/claude-chrome-screenshots-xTwZ7O/screenshot-1793479313133-7.jpg`

## Premios de antes en el resumen (pedido del usuario, 2026-10-31)

- Alumnos con premios ganados **antes** de esta versión: sus datos (`games-pets-v1`, sin cambios de formato) se respetan.
- El resumen agrega una línea **🐾 premios ya ganados**, con el último premio (`prizesLine`). Su prueba se escribió antes del código y falló antes de implementarla.
- Chrome, con los datos de premios tal como los guarda la versión publicada (2 accesorios, nada en `games-progress-v1`, sin nombre guardado):
  - Al escribir "ANA " aparece "🐾 You have already won 2 accessories for your pets. The latest one: Witch hat. Keep it up!" y, en español, "🐾 Ya ganaste 2 accesorios para tus mascotas. El último: Sombrero de bruja. ¡Sigue así!".
  - El gatito trae su sombrero de bruja y el perrito su collar.
- `npm test`: `370 · pass 368 · fail 0 · todo 2`.

## Pendiente

- Publicar: subir `Ingles.html` (nuevo) y la `QuizA.html` nueva (que ahora es la página principal).
- Revisión de los textos del resumen por una maestra o maestro.
