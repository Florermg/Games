# Research: Festividades (GAMES-16)

## R1. Fechas que cambian

- **Easter**: algoritmo gregoriano anónimo (Meeus/Jones/Butcher). Comprobado: 2025-04-20, 2026-04-05, 2027-03-28, 2028-04-16, 2029-04-01, 2030-04-21.
- **Thanksgiving**: 4.º jueves de noviembre. 2025-11-27, 2026-11-26, 2027-11-25, 2028-11-23, 2029-11-22, 2030-11-28.

## R2. Mezcla (aclaración 4a)

- Se ordenan por días que faltan para su día principal. La ventana del menú lleva media guirnalda de las 2 primeras y los adornos de hasta 3 en lugares fijos del suelo (x = 135, 185, 290), lejos del árbol (x 70) y del muñeco de nieve (x 232) de GAMES-15.
- Coincidencias posibles: Halloween + Muertos, Revolución + Thanksgiving, Posadas + Navidad, Año Nuevo con nada, Easter + Día del Niño (cuando Easter cae tarde), Independencia con nada.

## R3. Dónde se ve

- **Guirnalda**: arriba de la hoja blanca (`#holiday-garland`), en todas las pantallas; 28 px de alto; SVG con `preserveAspectRatio="none"` para estirarse al ancho.
- **Ventana del menú**: una capa SVG encima del dibujo de GAMES-15 (`#holiday-window`, mismo `viewBox` 320 × 120), para no tocar `environment.js`.
- **Fondo**: capa fija `#holiday-scene` sobre el cielo, con 8 adornos que flotan (corazones, confeti, murciélagos, pétalos de cempasúchil, estrellas…), posiciones por fórmula.
- **Tarjeta de vocabulario** (`#holiday-card`) en el menú, con pestañas si hay varias; las palabras se leen con `Speech.speak` (GAMES-11).
- **Saludo**: `tutor()` una vez al abrir; la huella de GAMES-1 no lo captura porque el recorrido escribe nuevos mensajes.

## R4. Modo de prueba

`?festividad=` acepta ids en español e inglés (`muertos`, `dayofthedead`, `navidad`, `christmas`, `posadas`, `reyes`, `anonuevo`/`año nuevo`, `amor`, `valentine`, `bandera`, `sanpatricio`, `pascua`, `easter`, `nino`, `madres`, `maestro`, `independencia`, `halloween`, `revolucion`, `thanksgiving`/`acciondegracias`), separados por coma; `ninguna`/`none` apaga todo. Se combina con los parámetros de GAMES-15.
