---

description: "Task list for 010-formula-tarjetas"
---

# Tasks: Fórmula de la oración en las tarjetas de gramática

**Input**: `specs/010-formula-tarjetas/` (spec, plan)

**Jira**: GAMES-12 (Historia) · **Modo**: continuo · **Rama**: `010-formula-tarjetas` (desde `main` `b882409`)

**Tests**: FR-003 y FR-004 exigen prueba; se escribe **antes** del contenido.

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Phase 1: Setup

- [X] T001 Línea base, antes de cambiar código: `npm test` (`235 · pass 233 · fail 0 · todo 2`) y la huella de GAMES-1, registradas en `specs/010-formula-tarjetas/validation.md`

## Phase 2: User Story 1 - Fórmula en las tarjetas de tiempos (Priority: P1) 🎯 MVP

- [X] T002 [US1] Agregar a `English/tests/grammar-cards.test.mjs` (debe fallar antes de T003): las 30 fórmulas de tiempos contra la lista revisada; cada una con "subject" y "+", la pregunta con "?"; cada auxiliar de la fórmula aparece en su línea con sujetos; el HTML de la tarjeta trae `card-formula` antes de las líneas con sujetos
- [X] T003 [US1] Agregar `formula` a las 10 tarjetas de tiempos y pintarla en `grammarCardHtml` en `English/js/grammar-cards.js`; estilo `.card-formula` en `English/css/quiz.css` (pantalla e impresión)

## Phase 3: User Story 2 - Fórmula en los otros temas (Priority: P2)

- [X] T004 [US2] Agregar a la prueba las 12 fórmulas de temas contra la lista revisada y el renglón "Structure:" con un `<br>` por parte
- [X] T005 [US2] Agregar `formula` a las 12 tarjetas de temas en `English/js/grammar-cards.js` y pasarla en `grammarCardsFor`

## Phase 4: Polish

- [X] T006 `npm run versions` y `npm test` completo en verde, 3 veces (FR-008)
- [X] T007 Validar y registrar en `validation.md`: navegador (las 22 tarjetas, consola sin errores, 390 px sin scroll horizontal), `validate-print/run.sh` en "All checks passed", PDF de WebKit sin tarjetas partidas, huella de GAMES-1 sin cambios
- [X] T009 FR-009: las tarjetas impresas pasan de cuadrícula a bloques en línea en `English/css/quiz.css`, y se valida con WebKit que ninguna de las 22 tarjetas de gramática ni de las de verbos se parte (1 y 2 columnas)
- [X] T008 README: mencionar la fórmula en la sección de Grammar Cards
