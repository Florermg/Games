# Validación: Cuaderno con revisión de gramática (GAMES-13)

**Fecha**: 2026-10-25 · **Rama**: `011-cuaderno` (desde `main` `b882409`)

## Línea base

- `npm test` en `main`: `tests 235 · pass 233 · fail 0 · todo 2`.

## Pruebas automáticas

- `npm test`, 3 ejecuciones: `tests 256 · pass 254 · fail 0 · todo 2` (los 2 `todo` son de GAMES-2).
- 21 pruebas nuevas en `tests/notebook.test.mjs`:
  - **SC-001**: 29 oraciones con un error típico cada una; en todas se encuentra exactamente ese error, con su regla, lo marcado y la sugerencia.
  - **SC-002 / FR-011**: más de 1,000 oraciones correctas del juego sin ninguna marca: los ejemplos de las tarjetas de gramática, los ejemplos de todos los verbos en los 10 tiempos, la carta de la demo Writing y 29 casos límite (*Does she play?*, *If I were*, *an hour*, *a university*, *I read a book yesterday*…). Se excluye solo "two boxes, three babies, five children", que es una lista sin punto a propósito.
  - "Use" aplicado uno tras otro deja el texto sin errores: `Yesterday I went to the park and she played with an orange ball.`
  - LanguageTool con dos respuestas reales grabadas, el texto en el cuerpo de un POST y no en la URL, 429, error 500 y sin internet; las reglas del juego no hacen ninguna petición.
  - Guardado con un `storage` falso, con uno que lanza errores (modo privado) y con un JSON roto; impresión.
- **Orden de trabajo**: las pruebas de las reglas se escribieron justo después del primer borrador de `notebook-check.js`, no antes. Al correrlas fallaron 3, por errores de las propias pruebas (*rain* y *like* no estaban en la lista de verbos, y dos conteos). Para *like* se agregó una lista corta de verbos propia del cuaderno (`NOTEBOOK_EXTRA_VERBS`), sin tocar la de las tarjetas de verbos.
- `npm run versions`: 15 archivos con versión (1 CSS, 14 JS), incluidos `notebook-check.js` y `notebook.js`.

## Navegador (Chrome, `http://127.0.0.1:8765`)

- Sin la revisión en línea: el texto del quickstart da 6 errores con sus sugerencias, en pantalla y en la lista. "Use “went”" corrige el texto y deja 5 marcas en su lugar.
- **En línea, en vivo**: `I like playing footbal with my freinds. Yesterday we go to the beach` → *football*, *friends* (marcados "online"), *go → went* y el punto final, en **0.8 s** (SC-003). El aviso de languagetool.org se ve con la casilla encendida.
- **Sin internet** (fetch que falla): aparece "The online check is not available (no internet?)…" y se quedan las sugerencias del juego.
- **Guardado (SC-004)**: después de recargar, la página sigue; "➕ New page" agrega otra a la lista; "🗑 Delete page" pide un segundo toque ("⚠️ Tap again to delete") y luego la borra.
- 390 px: sin scroll horizontal. Consola sin errores.
- **Huella de GAMES-1**: `f1 b9 82 7e 2c 76` (4,817), sin cambios.

## Impresión (Chrome y WebKit, hoja carta)

| Página | Errores | Chrome | WebKit |
|---|---|---|---|
| Corta (quickstart + una línea correcta) | 6 | 1 hoja | 1 hoja |
| Larga (14 líneas) | 70 | 5 hojas | 5 hojas |
| Sin errores | 0 | 1 hoja, "No mistakes found" | 1 hoja |

- En ninguna hoja aparece nada de la pantalla.
- Revisión a ojo: nombre, fecha, título, texto con los números, la lista con las sugerencias y la nota de la revisión usada.

## Pendiente para el usuario

- Probar el cuaderno en iPhone y iPad (teclado, guardado y la impresión desde Safari) (GAMES-4).
- Que una maestra revise los mensajes de las reglas.
