# Feature Specification: Elegir 1 o 2 columnas de tarjetas por hoja al imprimir

**Feature Branch**: `006-columnas-impresion`

**Created**: 2026-10-24

**Status**: Draft

**Jira**: GAMES-8 (Historia) · **Modo de ejecución**: `in-all-process`

**Input**: User description: "tenemos una adecuación a la pantalla de impresión de tarjetas, se debe poder seleccionar si se requiere dos columnas de tarjetas o una columna de tarjetas por hoja"

## Contexto y decisiones de diseño

- **Situación actual** (GAMES-6, GAMES-7): las tarjetas de Grammar Cards y de Verbs se imprimen siempre en 2 columnas por hoja carta. Solo las tarjetas de verbo con más de 6 tiempos ocupan las dos columnas.
- **Decisiones del usuario**:
  - La opción está en las **dos** pantallas de tarjetas, Grammar Cards y Verbs, junto a 🖨 Print selected.
  - Por defecto, **2 columnas**, como hoy.
  - Modo `in-all-process`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Elegir cuántas columnas tiene la hoja impresa (Priority: P1) 🎯 MVP

Como maestra, quiero elegir antes de imprimir si las tarjetas salen en dos columnas (más tarjetas por hoja) o en una columna (tarjetas a todo el ancho, más grandes y fáciles de leer), para adaptar el material a lo que voy a hacer con él: repartirlo, pegarlo en el cuaderno o ponerlo en el pizarrón.

**Why this priority**: es toda la historia.

**Independent Test**: en Grammar Cards, marcar 4 tarjetas, elegir "1 column" e imprimir. En la vista previa o el PDF, cada tarjeta ocupa todo el ancho de la hoja y ninguna queda partida. Repetir con "2 columns" y comprobar que sale como hoy. Hacer lo mismo en Verbs con 3 verbos.

**Acceptance Scenarios**:

1. **Given** que se abre Grammar Cards o Verbs, **Then** junto a 🖨 Print selected hay una opción para elegir entre "2 columns" y "1 column", con "2 columns" marcada.
2. **Given** que está marcada "2 columns", **When** se imprime, **Then** la hoja sale igual que hoy: dos tarjetas por renglón, y las tarjetas de verbo con más de 6 tiempos ocupan todo el ancho.
3. **Given** que está marcada "1 column", **When** se imprime, **Then** cada tarjeta ocupa todo el ancho de la hoja carta, una debajo de otra.
4. **Given** cualquiera de las dos opciones, **When** se imprime, **Then** ninguna tarjeta queda partida entre páginas, la hoja sale en blanco y negro y no aparecen elementos de la pantalla (botones, tutora, la opción de columnas).
5. **Given** que se cambia la opción en una pantalla, **When** se vuelve al menú y se abre otra vez esa pantalla en la misma sesión, **Then** se conserva la elección. Al recargar la página, vuelve a "2 columns".

### Edge Cases

- **Sin selección**: con cualquier opción, la tutora pide elegir al menos una tarjeta y no se abre la impresión, igual que hoy.
- **Una sola tarjeta**: con 2 columnas ocupa media hoja, como hoy; con 1 columna, todo el ancho.
- **Tarjeta alta**, como un verbo con los 10 tiempos: con 1 columna cabe completa en una hoja y no se parte.
- **Sin internet**: imprimir sigue funcionando (FR-006).
- **Celulares y iPad**: la opción se puede tocar con el dedo, igual que los demás controles.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Las pantallas Grammar Cards y Verbs DEBEN ofrecer, junto a 🖨 Print selected, una opción de dos valores, "2 columns" y "1 column", con "2 columns" marcada al abrir el juego.
- **FR-002**: Con "2 columns", la hoja impresa DEBE ser igual a la de hoy (GAMES-6 y GAMES-7), incluida la tarjeta ancha de los verbos con más de 6 tiempos.
- **FR-003**: Con "1 column", cada tarjeta impresa DEBE ocupar todo el ancho útil de la hoja carta.
- **FR-004**: En las dos opciones, ninguna tarjeta DEBE partirse entre páginas, y la hoja NO DEBE incluir elementos de la pantalla, la opción de columnas incluida.
- **FR-005**: Cada pantalla DEBE conservar su elección mientras la página siga abierta. No se guarda entre sesiones.
- **FR-006**: Imprimir DEBE seguir funcionando sin internet y con doble clic.
- **FR-007**: Las pruebas automáticas DEBEN cubrir que la hoja impresa refleja la opción elegida en las dos pantallas, y que "2 columns" produce lo mismo que hoy.
- **FR-008**: Las guías no cambian: la huella del recorrido de GAMES-1 sigue igual. Los archivos modificados llevan su versión actualizada (GAMES-5).

### Key Entities

- **Opción de columnas**: 1 o 2, una por pantalla (Grammar, Verbs), y 2 por defecto.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con "1 column", el 100% de las tarjetas impresas ocupa todo el ancho de la hoja y ninguna queda partida, en Grammar y en Verbs.
- **SC-002**: Con "2 columns", la hoja impresa es idéntica a la de antes del cambio para las mismas tarjetas.
- **SC-003**: Elegir la opción e imprimir agrega a lo sumo un toque o clic al flujo actual.
- **SC-004**: La validación de PDFs de tarjetas pasa con las dos opciones, y la huella del recorrido de GAMES-1 no cambia (`f1 b9 82 7e 2c 76`).

## Assumptions

- La opción afecta solo a la impresión; las tarjetas en pantalla se ven como hoy.
- "Todo el ancho útil" es el ancho de la hoja carta menos los márgenes de impresión actuales.
- La elección no se recuerda entre sesiones, porque el usuario eligió "2 columns" por defecto y no "recordar la última".
