# Research: Guía 5.º Campos formativos (GAMES-17)

## R1. Dónde vive la página

- **Decision**: `English/campos/Guia5.html`, con `../js/*.js` y `../css/quiz.css` compartidos y `js/*.js` propios en `English/campos/js/`.
- **Rationale**: lo que se publica es el contenido de `English/` en `nutritrack.mx/quiz/`. Con la página dentro, las rutas relativas funcionan igual con doble clic, en la red local y en el servidor (`/quiz/campos/Guia5.html`), y la tarjeta de inglés enlaza a `campos/Guia5.html`. El mismo origen comparte `localStorage`: premios, conjuntos y ciudad del clima.
- **Alternatives**: carpeta `Campos/` junto a `English/` (las rutas `../English/js` no existen en el servidor); copias de los archivos compartidos (se desincronizan).

## R2. Idioma de los archivos compartidos

- `English/js/lang.js` (nuevo, primero en las dos páginas): `pageLang()` devuelve `"es"` si `<html lang="es">`, si no `"en"` (también en Node).
- Las funciones puras con texto reciben el idioma como parámetro opcional (`environmentSummary(state, lang)`, `holidayGreeting(ids, lang)`), con `pageLang()` por omisión; así las pruebas cubren los dos idiomas y la página de inglés produce exactamente lo mismo que antes.
- Textos en español para: mascotas (frases, botón), My Pets y premio (pantalla, avisos, 43 nombres de accesorios, temporadas), ambiente (resumen, avisos, "Donde estoy") y festividades (saludo; la tarjeta de vocabulario en inglés no se pone en esta página).
- `Speech.lang` (`"en-US"` por omisión) y la elección de voz siguen ese idioma; la página nueva usa `"es-MX"` (o la voz en español que haya).
- `showPetReward`: la guía demo se reconoce también por `guide.demo === true`, porque esta página no tiene `DEMO_GUIDES`.

## R3. Motor de la guía

- **Decision**: motor propio en español (`campos/js/campos-engine.js`) con las mismas clases de CSS y el mismo comportamiento (2 intentos, un punto por pregunta, promedio sobre 10), y calificación pura aparte (`campos-grading.js`).
- **Rationale**: el motor de inglés tiene sus textos dentro y su huella (GAMES-1) no debe cambiar.
- Tipos: `choice`, `truefalse` (opciones Verdadero/Falso en línea), `match`, `bank`, `classify` (categorías en línea) y `open` (ideas clave).

## R4. Calificación de respuestas abiertas

- Normalizar: minúsculas, sin acentos (NFD), sin signos; buscar cada grupo de sinónimos como palabra o frase completa dentro de la respuesta. Correcta si encuentra al menos `need` ideas. Pista: la idea que faltó, sin dar la respuesta; al final: la respuesta modelo.

## R5. Versiones

- `tools/versions.mjs`: las referencias pueden empezar con `../` (`../js/pets.js`) y se leen relativas a la carpeta de la página.
- `npm run versions` sella `QuizA.html` y `campos/Guia5.html`; `versions.test.mjs` revisa las dos.
