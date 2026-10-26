# Validation: GAMES-15 (2026-10-25)

## Pruebas automáticas

- Línea base en `012-premios-mascotas` (`e8e1b14`): `301 · pass 299 · fail 0 · todo 2`.
- Pruebas escritas antes del código: con `environment.js` vacío, 17 de 18 nuevas fallaban; después pasan todas.
- Final, 3 corridas: `319 · pass 317 · fail 0 · todo 2` (los 2 `todo` son de GAMES-2).
- `versions.test.mjs`: ahora 19 archivos con versión.

## Chrome (127.0.0.1:8765), 18:4x hora local

- **Clima real**: al abrir, "🌇 Afternoon · ☁️ Cloudy, 17 °C in Ciudad de México · 🍂 Autumn", con hojas cayendo en el fondo y el clima guardado en `games-env-v1`.
- **Ubicación**: el Chrome de la extensión no dio la ubicación, así que se usó Ciudad de México con el aviso "I could not get your location…" (plan B de la aclaración 5c). **No verificado**: el camino con permiso concedido ("where you are"); queda para el usuario en nutritrack.mx (https) o en `localhost`.
- **Ciudad**: elegir Monterrey → "☁️ Cloudy, 21 °C in Monterrey". Recargar → sigue Monterrey y usa el clima guardado.
- **Sin internet** (`fetch` que falla): "🌇 Afternoon · 🍂 Autumn" y "No weather right now…", clase `env-w-none`. Al volver el `fetch`, regresa el clima.
- **Modo de prueba**: `?ambiente=noche&clima=lluvia&estacion=invierno` → noche, lluvia en el fondo, ventana con nubes, gotas, pino y muñeco de nieve, "🧪 test mode"; la ciudad queda deshabilitada.
- **Hoja de 84 combinaciones** (3 momentos × 7 climas, incluyendo "sin clima", × 4 estaciones), revisada a ojo: todas se distinguen; sol, luna, estrellas, nubes, gotas, copos, rayo, niebla y suelos correctos.
- **390 px** (iframe), en modo real y en dos modos de prueba: `scrollWidth = clientWidth = 386`; la ventana del menú mide 274 px.
- **Consola**: sin errores.
- **Huella de GAMES-1**: `f1 b9 82 7e 2c 76 · largo 4817`, sin cambios.
- Se borró `localStorage` de prueba al final.

## Decisiones

- La franja de las mascotas en pantallas angostas se queda rosa sólida (prueba de GAMES-10): así el gatito negro se ve también de noche.
- Si nadie contesta la pregunta de ubicación del navegador, a los 12 s se usa la ciudad elegida (el `timeout` del navegador solo empieza después del permiso).
- La impresión y el movimiento reducido se comprueban con una prueba sobre el CSS (`environment.test.mjs`).

Captura (noche, lluvia, invierno): `/var/folders/hs/p759lpwx1gs9xs5bwhh_dy5h0000gn/T/claude-chrome-screenshots-xTwZ7O/screenshot-1792975865986-5.jpg`
