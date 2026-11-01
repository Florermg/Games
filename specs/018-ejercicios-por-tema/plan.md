# Implementation Plan: Ejercicios por tema

**Branch**: `018-ejercicios-por-tema` · **Spec**: [spec.md](spec.md) · **Jira**: GAMES-21

## Technical Context

Scripts clásicos sin build (constitución). Se cambian solo archivos de `English/campos/`; los compartidos (`../js`, `../css`) no se tocan.

| Archivo | Cambio |
|---|---|
| `campos/js/campos-data.js` | Preguntas nuevas hasta cumplir los mínimos por tema; 11 conjuntos nuevos para clasificar; título del tema 2 como en la guía |
| `campos/js/campos-guides.js` | `temaNumber(id)`, `temaHeading(id)` y `buildTemaGuide(id, random)`. Reusan `SECTION_BUILDERS` con un solo tema y un conjunto de clasificar por sección |
| `campos/js/campos-engine.js` | `playTemaExercises(id)` y `renderTemaList()`; botón en cada tarjeta de repaso |
| `campos/Guia5.html`, `campos/css/campos.css` | Tarjeta "✏️ Ejercicios por tema" con un `<details>` por campo |
| `tests/campos-guides.test.mjs` | Mínimos por tema, numeración y guías por tema |

## Constitution Check

- Doble clic, sin descargas, PC, celular y iPad: sí (sin dependencias nuevas).
- Pruebas antes del código: sí (las 3 pruebas nuevas fallaron antes de `buildTemaGuide`).
- Versiones (GAMES-5): `npm run versions`.
- Commit, push, PR y merge solo con autorización.
