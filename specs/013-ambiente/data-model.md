# Data Model: Ambiente (GAMES-15)

## EnvironmentState

| Campo | Valores |
|---|---|
| `period` | `day` · `afternoon` · `night` |
| `season` | `spring` · `summer` · `autumn` · `winter` |
| `weather` | `clear` · `cloudy` · `fog` · `rain` · `snow` · `storm` · `null` (sin clima) |
| `temperature` | número (°C, redondeado) o `null` |
| `place` | nombre del lugar o `null` |
| `test` | `true` si algún valor viene del modo de prueba |

## Place

`{ id, name, lat, lon }`. `id = "here"` es la ubicación del navegador; las ciudades están en `ENV_CITIES` (por omisión `cdmx`, Ciudad de México, 19.43, -99.13).

## Saved environment (`localStorage["games-env-v1"]`)

```json
{ "city": "here", "weather": { "kind": "rain", "temperature": 17, "lat": 19.43, "lon": -99.13, "time": 1792971705823 } }
```

- `city`: id elegido en el menú (`"here"` por omisión).
- `weather`: último clima pedido; sirve 30 minutos para el mismo lugar (lat y lon a 2 decimales).
- Datos inválidos o almacenamiento bloqueado → se empieza de cero sin romper nada.

## Transiciones

```text
abrir ─▶ estado con reloj y fecha (sin clima) ─▶ ¿modo de prueba con clima? ─sí▶ listo
                                               └no▶ ¿clima guardado vigente? ─sí▶ listo
                                                    └no▶ lugar (navegador → ciudad → CDMX) ─▶ pedir clima ─▶ listo | sin clima
cada minuto: momento del día · cada 30 min: clima · al cambiar la ciudad: lugar y clima
```
