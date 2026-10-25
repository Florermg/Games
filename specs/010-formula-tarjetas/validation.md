# Validación: Fórmula de la oración en las tarjetas de gramática (GAMES-12)

**Fecha**: 2026-10-25 · **Rama**: `010-formula-tarjetas`

## Línea base (antes de cambiar código)

- `npm test` en `main` `b882409`: `tests 235 · pass 233 · fail 0 · todo 2`.

## Pruebas automáticas

- `npm test`, 3 ejecuciones: `tests 240 · pass 238 · fail 0 · todo 2` (los 2 `todo` son de GAMES-2).
- 5 pruebas nuevas en `grammar-cards.test.mjs`; fallaron antes del contenido y pasan después:
  - las 30 fórmulas de tiempos y las 12 de temas contra la lista revisada (FR-001 a FR-003);
  - cada auxiliar de la fórmula aparece en su línea con sujetos (FR-004);
  - el HTML trae la fórmula antes de los sujetos y el renglón "Structure:" con un renglón por parte (FR-005).
- Las pruebas de GAMES-6, 7 y 8 siguen pasando: las líneas con sujetos y el resto del contenido no cambiaron (FR-006).
- `npm run versions`: cambiaron `css/quiz.css` y `js/grammar-cards.js` (FR-008).

## Navegador (Chrome, `http://127.0.0.1:8765`)

- Grammar Cards con "All tenses": 22 tarjetas y 42 fórmulas; la fórmula en negritas y color, arriba de los sujetos. Consola sin errores.
- 390 px: sin scroll horizontal.
- **Huella de GAMES-1**: `f1 b9 82 7e 2c 76` (4,817), sin cambios.

## Impresión

- **Chrome**: `specs/004-gramatica-verbos/validate-print/run.sh` en "All checks passed" (6 casos: gramática y verbos, 1 y 2 columnas). Las 22 tarjetas con todas las fórmulas ocupan 7 páginas carta.
- **WebKit (FR-009)**:
  - En `main`, antes del cambio, ya se partían tarjetas: 6 de 22 en 2 columnas y 4 en 1 columna.
  - Después de pasar las tarjetas a bloques en línea: 0 tarjetas partidas en 6 casos (22 de gramática con todos los tiempos en 2 y 1 columnas, 22 con los de 3.º, 6 verbos con los de 5.º, 8 verbos con todos en 2 y 1 columnas).
  - Las hojas de WebKit se generaron como HTML estático con `buildCardsPrintHtml`, porque la impresora de prueba no ejecuta los scripts del arnés.
- Revisión a ojo de la primera página en Chrome y WebKit: fórmulas en negritas, sujetos debajo, sin cortes.

## Pendiente para el usuario

- Imprimir unas tarjetas desde el iPhone o iPad para confirmar FR-009 en un equipo real (GAMES-4).
