# Data Model: Premios de accesorios (GAMES-14)

## Accessory (catálogo, `PET_ACCESSORIES`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | texto | único, camelCase |
| `name` | texto | en inglés |
| `slot` | `head` \| `eyes` \| `neck` \| `body` \| `feet` | una pieza por parte del cuerpo y por mascota |
| `season` | `null` o id de temporada | `null` = todo el año |
| `draw(a)` | función | SVG con las anclas `a` de la mascota |

## PetRewardsStore (localStorage `games-pets-v1`)

```json
{ "version": 1, "students": { "ana": StudentRecord } }
```

## StudentRecord

| Campo | Tipo | Regla |
|---|---|---|
| `name` | texto | el nombre como lo escribió la última vez |
| `owned` | `{ id, date }[]` | sin repetidos; `date` ISO |
| `guides` | texto[] | claves de las guías ya premiadas |
| `outfits` | `{ cat: { slot: id }, dog: { slot: id } }` | solo ids que el alumno tiene |

## Resultado del premio (`awardForGuide`)

`{ status: "won" | "demo" | "repeat" | "notPerfect" | "complete", accessory?, missing? }`
