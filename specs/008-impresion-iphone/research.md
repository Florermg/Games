# Research: títulos al pie de la hoja y franja transparente

**Feature**: `008-impresion-iphone` · **Jira**: GAMES-10

## R1. Mantener el título con su primer bloque, también en Safari (FR-001 a FR-003)

- **Decision**:
  - `printSection` envuelve en un `<div class="print-keep">` el título de grupo (si la sección abre un grupo), el título de la sección y el **primer bloque** de su contenido. En `@media print`, `.print-keep { break-inside: avoid; page-break-inside: avoid; }`. El resto de la sección sigue igual, fuera del envoltorio.
  - Para saber cuál es el primer bloque, cada *renderer* de `PRINT_RENDERERS` devuelve una **lista de bloques** en vez de un texto. `printSection` une `[grupo, título, bloques[0]]` en el envoltorio y concatena después el resto. El HTML de cada bloque no cambia (FR-004).
  - El título de grupo pasa de `buildPrintHtml` a `printSection`, como un parámetro `groupLabel`, para que quede dentro del envoltorio.
- **Rationale**:
  - El PDF del usuario muestra que WebKit sí respeta `break-inside: avoid` (ningún renglón se parte) y no respeta `break-after: avoid`. Un envoltorio con `break-inside: avoid` mueve el título y su primer bloque juntos en Chrome y en Safari.
  - Devolver bloques evita "adivinar" el primer elemento analizando el HTML.
- **Alternatives considered**:
  - `break-inside: avoid` en toda la sección: deja huecos grandes cuando una sección larga no cabe.
  - Solo `break-after: avoid` y `orphans`/`widows`: es lo que ya hay y Safari lo ignora.
  - Analizar el HTML del cuerpo para separar el primer elemento: frágil.

## R2. Franja sólida y botón compacto (FR-005)

- **Decision**: en `@media (max-width: 1159.98px)`:
  - `#pets` con fondo sólido `#fce4ec` (el fondo del juego) y `box-shadow: 0 -4px 12px rgba(0,0,0,0.08)`, en lugar del degradado transparente.
  - En el botón, el texto va en `<span class="pets-toggle-text">`, que se oculta en pantallas angostas. El botón lleva `aria-label` ("Hide pets" / "Show pets"), y `togglePets` actualiza el texto y el `aria-label`.
- **Rationale**: un fondo sólido no deja ver lo que pasa por debajo; es el mismo patrón de una barra de herramientas.

## R3. Validación (FR-006, SC-001)

- **Decision**:
  - **Prueba en Node** (`print.test.mjs`): en las 6 versiones de las demos y en las guías generadas de prueba (las *fixtures* de GAMES-1), cada `.print-section-title` y cada `.print-group` está dentro de un `.print-keep` junto con el primer bloque de su sección. Además, el texto visible de cada versión es **idéntico** al de antes del cambio, quitando etiquetas (FR-004).
  - **PDFs**: `validate-print/` de esta historia imprime con Chrome las guías generadas de prueba (hoja y clave) y verifica, página por página, que cada título está en la misma página que el texto de su primer bloque.
  - `run.sh` de GAMES-3 y de GAMES-6 deben seguir pasando.
  - **Safari**: el usuario lo confirma en su iPhone (SC-004).
