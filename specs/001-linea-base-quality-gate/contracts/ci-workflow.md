# Contract: quality gate de CI

**Feature**: `001-linea-base-quality-gate` · Cubre FR-036, FR-037 y SC-005

Archivo: `.github/workflows/tests.yml` en `Florermg/Games`.

| Aspecto | Contrato |
|---|---|
| Disparadores | `push` a `main` y `pull_request` con destino `main`. |
| Entorno | `ubuntu-latest`, Node 24. |
| Pasos | Checkout del repo → Node 24 → `npm test`. Sin `npm install` (no hay dependencias). |
| Duración máxima | 5 minutos (`timeout-minutes: 5`). |
| Nombre visible del check | `tests` (job), dentro del workflow `Tests`. |
| Resultado | ✅ si `npm test` termina con 0; ❌ en cualquier otro caso (incluye *timeout*). Se ve en la lista de checks del PR y junto a cada commit de `main`. |
| Red | El workflow no hace peticiones a las fuentes del juego (lo garantiza `npm test`). |

## Bloqueo (clarificación de FR-037)

Es un bloqueo **de proceso**, no técnico:

- El check no se configura como obligatorio en GitHub, porque la cuenta gratuita no lo permite en repos privados.
- Una historia no se transiciona a "Listo" en Jira si el último commit de su rama, o de `main` después de integrarla, tiene el check en ❌ (Principio IV, paso 5 del Principio III).
- Integrar un PR con el check en ❌ requiere una excepción documentada explícitamente en el issue de Jira.
