# Validation: GAMES-16 (2026-10-25)

## Pruebas automáticas

- Línea base en `main` (`bd89726`): `319 · pass 317 · fail 0 · todo 2`.
- Pruebas escritas antes del código: con `holidays.js` vacío, el archivo nuevo fallaba; después pasan las 12.
- Final, 3 corridas: `331 · pass 329 · fail 0 · todo 2` (los 2 `todo` son de GAMES-2).
- Las fechas se comprueban día por día de 2025 a 2030 contra la tabla de FR-001 (escrita otra vez en la prueba), incluyendo Easter y Thanksgiving.
- `versions.test.mjs`: ahora 20 archivos con versión.

## Chrome (127.0.0.1:8765)

- **Hoy, 25 de octubre**:
  - Halloween y Día de Muertos mezclados: media guirnalda de banderines naranja, negro y morado y media de papel picado.
  - Calabaza y altar con calaverita, velas y cempasúchil en la ventana del menú; murciélagos, calabazas y pétalos en el fondo.
  - Saludo "🎃💀 Happy Halloween and happy Day of the Dead! …" y tarjeta con pestañas Halloween / Day of the Dead.
- **Hoja de las 16 festividades y 4 mezclas** (Halloween + Muertos, Posadas + Navidad, Revolución + Thanksgiving, Easter + Niño + Navidad), revisada a ojo. Se corrigieron dos cosas:
  - La guirnalda se estiraba en pantallas angostas: ahora se dibuja al ancho real de la hoja.
  - Las piezas blancas casi no se veían: ahora llevan un borde más oscuro.
- **Modo de prueba**:
  - `?festividad=posadas,navidad&ambiente=noche&clima=nieve&estacion=invierno`: Posadas y Navidad sobre la noche nevada, con "test mode".
  - `?festividad=reyes`: Día de Reyes.
  - `?festividad=ninguna`: sin guirnalda, sin tarjeta y con el saludo normal.
- **Pestañas y voz**: la pestaña Christmas cambia la tarjeta; al tocar "tree", `Speech.speak` recibe "tree. We decorate the Christmas tree."
- **390 px** (iframe) en 3 modos: `scrollWidth = clientWidth = 386`; guirnalda de 346 px de ancho real.
- **Consola**: sin errores.
- **Huella de GAMES-1**: `f1 b9 82 7e 2c 76 · largo 4817`, sin cambios con el saludo de hoy.
- Se borró `localStorage` de prueba.

## Pendiente

- Que una maestra o maestro revise las 149 palabras y oraciones (SC-003).

Captura (Posadas + Navidad, noche con nieve): `/var/folders/hs/p759lpwx1gs9xs5bwhh_dy5h0000gn/T/claude-chrome-screenshots-xTwZ7O/screenshot-1792979222789-6.jpg`
