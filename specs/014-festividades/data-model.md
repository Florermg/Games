# Data Model: Festividades (GAMES-16)

## Holiday (`HOLIDAYS`)

| Campo | Ejemplo |
|---|---|
| `id` | `"muertos"` |
| `name` / `nameEs` | `"Day of the Dead"` / `"Día de Muertos"` |
| `emoji` | `"💀"` |
| `from`, `to` | `[10, 25]`, `[11, 2]` (mes, día) o `range(year)` para Easter y Thanksgiving |
| `colors` | colores de la guirnalda |
| `greeting` | `"Happy Day of the Dead! …"` |
| `words` | 8+ `{ emoji, word, es, example }` |
| `drawGarland(x0, x1, uid)`, `drawItem(x, uid)`, `floater` | dibujos |

## Estado activo

`activeHolidays(date)` → ids ordenados por días que faltan para `to`. `holidayOverrides(search)` → `null` (sin modo de prueba), `[]` (`ninguna`) o lista de ids.
