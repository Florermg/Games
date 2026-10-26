# Validación: Premios de accesorios para las mascotas (GAMES-14)

**Fecha**: 2026-10-25 · **Rama**: `012-premios-mascotas` (desde `main` `33ffb1c`)

## Línea base

- `npm test` en `main`: `tests 286 · pass 284 · fail 0 · todo 2`.

## Pruebas automáticas

- Las 15 pruebas de `tests/pet-rewards.test.mjs` se escribieron **antes** del código y fallaron al cargar (el catálogo no existía); después del código pasan.
- `npm test`, 3 ejecuciones: `tests 301 · pass 299 · fail 0 · todo 2` (los 2 `todo` son de GAMES-2).
  - Catálogo: 43 accesorios (19 de todo el año, 24 de temporada), ids únicos, las 5 partes del cuerpo y los tipos pedidos (collar, correa, sombrero, lentes, corbata, zapatos).
  - Cada accesorio se dibuja en las dos mascotas, dentro de `.pet-body` y sin cargar nada (SC-004).
  - Temporadas por fecha, incluidas las que cruzan el año (Navidad e invierno).
  - **SC-002**: en 6,000 sorteos del 25 de octubre, la proporción entre uno de temporada y uno de todo el año queda entre 2.5 y 3.5, y no sale ninguno de Navidad.
  - `awardForGuide`: gana, demo, repetida, no perfecta (con los puntos que faltaron), completa; otro alumno con la misma guía sí gana.
  - Nombres normalizados ("ANA " = "ana"; sin nombre = "guest"); guardado normal, bloqueado y roto; accesorios desconocidos o no ganados se descartan.
  - Poner, cambiar y quitar: uno por parte del cuerpo y cada mascota con lo suyo; no se puede poner uno no ganado.
  - El dibujo con accesorios tiene el orden fijo (cuerpo, patas, cuello, ojos, cabeza) y todos sus ids con sufijo; sin accesorios es igual al de GAMES-9.
- `npm run versions`: 18 archivos con versión (1 CSS, 17 JS).

## Revisión de los dibujos (SC-004)

- Hoja con los 43 accesorios en las 2 mascotas (86 combinaciones), revisada a ojo.
- Se corrigió el moño de murciélago, que no se distinguía sobre el gatito negro: ahora tiene un borde morado.

## Navegador (Chrome, `http://127.0.0.1:8765`)

- "Ana" genera una guía de Listening y la contesta toda bien (6/6): "🎁 You won a new accessory for your pets! · Star glasses", con Anya-chan avisando. Queda guardado con su fecha.
- "Try This Guide Again" con 100%: "You already won the prize for this guide…". Una demo: sin premio.
- Segunda guía (Food): *Red collar*. En My Pets: "Ana's pets · 2 of 43 accessories" y 41 bloqueados como silueta ("🎁 Win it!" o "Comes back in …"). Los lentes se le ponen al gatito; el collar y los lentes, al perrito. Las mascotas de abajo de la ventana los traen puestos.
- Recarga: lo puesto sigue. "ANA " ve lo mismo que "Ana"; "Luis" y sin nombre ven las mascotas sin accesorios.
- 390 px: sin scroll horizontal. Consola sin errores.
- **Huella de GAMES-1**: `f1 b9 82 7e 2c 76` (4,817), sin cambios.
- Se borraron del navegador los datos de prueba (`games-pets-v1` y `games-notebook-v1`).

## Pendiente para el usuario

- Ver los accesorios en iPhone y iPad (GAMES-4).
