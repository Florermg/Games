# Research: Ambiente según la hora, el clima y la estación (GAMES-15)

## R1. Servicio del clima

- **Decision**: Open-Meteo `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,weather_code&timezone=auto`.
- **Rationale**: gratuito, sin clave ni registro, con CORS abierto (`access-control-allow-origin: *`, verificado el 2026-10-25), así que funciona desde `file://`, la red local y nutritrack.mx. Da el código de clima de la OMM (WMO) y la temperatura.
- **Alternatives**: OpenWeatherMap o WeatherAPI (piden clave, que quedaría expuesta en el código del juego); wttr.in (sin CORS confiable).
- **Privacidad**: solo se envían latitud y longitud redondeadas a 2 decimales (≈1 km). Sin nombre del alumno ni otros datos.

## R2. Códigos de clima (WMO) → 6 tipos

| Códigos | Tipo | Texto |
|---|---|---|
| 0, 1 | `clear` | ☀️ Sunny (de noche: 🌙 Clear) |
| 2, 3 | `cloudy` | ☁️ Cloudy |
| 45, 48 | `fog` | 🌫 Foggy |
| 51–67, 80–82 | `rain` | 🌧 Rain |
| 71–77, 85, 86 | `snow` | ❄️ Snow |
| 95–99 | `storm` | ⛈ Storm |

Otro código → sin clima (como sin internet).

## R3. Ubicación (aclaración 5c)

- `navigator.geolocation.getCurrentPosition` con `timeout` de 8 s y `maximumAge` de 30 min. Solo funciona en contextos seguros: `https://` (nutritrack.mx), `localhost` y, según el navegador, `file://`. Desde `http://192.168…` falla siempre, y entonces se usa la ciudad.
- Lista fija de 38 ciudades de México (capitales de los estados y ciudades grandes) con su latitud y longitud: no hace falta otro servicio para buscar ciudades.
- La elección se guarda en `localStorage` (`games-env-v1`). La primera opción, "📍 Where I am", es la que viene por omisión. Si el navegador niega el permiso, se usa Ciudad de México y se avisa; al elegir una ciudad ya no se pide la ubicación.

## R4. Momento del día y estación

- Horas fijas: día 6–11, tarde 12–18, noche 19–5 (FR-001). Se revisa cada minuto con `setInterval`.
- Estación: se reutiliza `activeSeasons(date)` de `pet-rewards.js` (GAMES-14) y se toma la de las cuatro astronómicas, para que las fechas sean las mismas.

## R5. Dibujo

- **Menú**: una "ventana" SVG de 320 × 120 hecha en código (sin imágenes): cielo con degradado por momento y clima, sol / sol bajo / luna con estrellas, nubes, gotas o copos, rayo, bandas de niebla, y el suelo de la estación (flores, pasto con girasol, árbol naranja con hojas, nieve con pino). Siempre visible, también en el celular.
- **Fondo**: degradado de CSS por momento del día, oscurecido con nubes, lluvia o tormenta; capa fija detrás de la hoja con partículas de CSS (lluvia, nieve, hojas en otoño y pétalos en primavera). Las posiciones salen de una fórmula con el índice (no `Math.random`), para que las pruebas sean estables.
- La barra de la tutora y la franja de las mascotas toman los colores del cielo con variables de CSS (`--env-band`, `--env-ground`).
- `prefers-reduced-motion: reduce` → sin animaciones. `@media print` → sin ambiente.

## R6. Modo de prueba

- `?ambiente=dia|tarde|noche`, `?clima=sol|nubes|niebla|lluvia|nieve|tormenta`, `?estacion=primavera|verano|otono|otoño|invierno`. También en inglés (`day`, `afternoon`, `night`, `clear`, `cloudy`, `fog`, `rain`, `snow`, `storm`, `spring`, `summer`, `autumn`, `winter`). Con `clima`, no se pide la ubicación ni el clima a internet.
