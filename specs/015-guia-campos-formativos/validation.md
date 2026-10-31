# Validation: GAMES-17 (2026-10-31)

## Pruebas automáticas

- Línea base en `main` (`d798963`): `331 · pass 329 · fail 0 · todo 2`.
- Pruebas escritas antes del código: con los archivos vacíos, los 3 archivos nuevos fallaban al cargar; después pasan todas.
  - `campos-guides.test.mjs`: 9 pruebas. Cubren el contenido de los 21 temas, la calificación en español con ideas clave, la demo fija y 200 guías generadas.
  - `campos-print.test.mjs`: 5 pruebas. Cubren la hoja, la clave y las tarjetas.
  - `campos-shared.test.mjs`: 6 pruebas. Cubren el español de lo compartido y que inglés siga igual.
  - `versions.test.mjs`: 2 pruebas nuevas, para las rutas `../` y las dos páginas.
- Se ajustó una prueba de GAMES-10 (`pets.test.mjs`): ahora el nombre accesible del botón sale de `petsToggleLabel`, pero se sigue comprobando "Show pets" / "Hide pets".
- Final, 3 corridas: `353 · pass 351 · fail 0 · todo 2` (los 2 `todo` son de GAMES-2).

## Chrome (127.0.0.1:8765)

- **Inglés**:
  - La tarjeta "📚 Guía 5.º — Campos formativos" abre `campos/Guia5.html`.
  - "⬅ Inglés (English)" regresa al menú de inglés.
  - El juego sigue en inglés.
  - **Huella de GAMES-1**: `f1 b9 82 7e 2c 76 · largo 4817`, sin cambios.
- **Página nueva, todo en español**:
  - Saludo de festividades: "🎃💀 ¡Feliz Halloween y feliz Día de Muertos! ¡Vamos a estudiar con alegría!".
  - Clima: "🌇 Tarde · ☁️ Nublado, 25 °C en Ciudad de México · 🍂 Otoño".
  - El botón de las mascotas dice "Ocultar mascotas".
  - La voz usa `es-MX`.
- **Demo**:
  - Secciones: opción múltiple 8, verdadero o falso 8, relacionar 5, banco 5, clasificar 6 y abierta 2 (34 puntos).
  - Revisar sin contestar pide contestar todo primero.
  - Con respuestas mal aparecen las pistas ("💡 Habla de un ave.") y el botón pasa a "Revisar otra vez ✔ (queda 1 intento)".
  - Las abiertas mal dos veces muestran la respuesta modelo.
  - Resultado con dos abiertas mal: 32 / 34, promedio 9.4, tabla en español, 2 temas en el repaso y sin premio (es la demo).
- **Respuestas abiertas reales**: "porque para cultivar la comida se usa mucha agua" y "por la desigualdad y la pobreza" → correctas.
- **Guía nueva solo de Lenguajes**:
  - Solo trae temas de Lenguajes.
  - Con todo bien: 34 / 34 y premio "Bufanda de hojas de otoño ✨ Especial de otoño".
  - En Mis mascotas, en español: "Mascotas de Ana · 1 de 43 accesorios", "✓ Puesto", "🎁 ¡Gánalo!", "Regresa en Navidad".
  - Las mascotas de abajo traen la bufanda.
  - En la página de inglés, "Ana's pets · 1 of 43 accessories" y "Autumn leaf scarf": los premios se comparten.
- **Tarjetas de repaso**:
  - 21 tarjetas en 4 grupos; con el filtro de Saberes quitado quedan 15.
  - "Elegir todas" marca 15.
  - 🔊 lee "Prefijos y sufijos. Son elementos que…".
- **390 px** (iframe), en modo real y con `?festividad=navidad&ambiente=noche&clima=nieve`: `scrollWidth = clientWidth`, con "🌙 Noche · ❄️ Nieve · 🍂 Otoño · 🧪 modo de prueba".
- **Consola**: sin errores en las dos páginas.
- Se borró `localStorage` de prueba.

## Impresión (`validate-print/run.sh`)

- Chrome y WebKit (Safari): las 21 hojas pasan. Son la demo y 3 guías generadas (hoja del alumno y clave), el barrido de la demo de 0 a 240 mm y las tarjetas en 1 y 2 columnas. Cada título queda en la misma página que el inicio de su primer bloque.
- Revisión a ojo (WebKit):
  - El encabezado de la hoja trae Nombre, Grupo, N.L., Fecha, Promedio y Maestra/o.
  - En la clave, la respuesta va encerrada y aparece la tabla "Resuelto".
  - Las tarjetas salen en 2 columnas, con el campo y "Recuerda".

## Pendiente

- Que una maestra o maestro revise las preguntas y respuestas contra la guía (SC-001).
- Medir con un alumno el tiempo de la demo completa (SC-003, menos de 20 minutos).
- Recorrido en iPhone/iPad (GAMES-4).
