---

description: "Task list for 008-impresion-iphone"
---

# Tasks: títulos de sección solos al pie de la hoja y franja transparente

**Jira**: GAMES-10 (Error) · **Modo**: `in-all-process` (el usuario pidió avanzar sin detenerse) · **Rama**: `008-impresion-iphone`

**Principio V**: commit, push, PR y merge con autorización explícita por acción.

## Phase 1: Setup

- [X] T001 Línea base y referencia:
  - `npm test` (`232 · pass 230 · fail 0 · todo 2`) y la huella de GAMES-1;
  - guardar el texto visible actual de las 6 versiones impresas de las demos y de las guías generadas de prueba, para la comparación de FR-004.

  Registrar en `validation.md`.

## Phase 2: User Story 1 - El título queda junto a su ejercicio (P1) 🎯 MVP

- [X] T002 [US1] Pruebas en `English/tests/print.test.mjs` (deben fallar antes de T003): cada `.print-section-title` y cada `.print-group` va dentro de un `.print-keep` que contiene también el primer bloque de su sección, en la hoja y en la clave de las demos y de las guías generadas de prueba; el texto visible es idéntico al de T001
- [X] T003 [US1] `English/js/print.js`: los *renderers* devuelven listas de bloques; `printSection(section, isKey, groupLabel)` arma `.print-keep`; `buildPrintHtml` pasa el grupo. En `English/css/quiz.css`, `.print-keep` con `break-inside: avoid` (research R1)
- [X] T004 [US1] `specs/008-impresion-iphone/validate-print/`: imprimir con Chrome las guías generadas de prueba (hoja y clave) y las demos, y verificar por página que cada título está en la misma página que el texto de su primer bloque
- [X] T005 [US1] Validar:
  - `npm run versions`, `npm test`;
  - los PDFs de T004, revisados a ojo;
  - `run.sh` de GAMES-3 y de GAMES-6;
  - la huella de GAMES-1.

  Registrar en `validation.md`, y luego Jira: checkpoint de la US1.

## Phase 3: User Story 2 - Franja sólida (P2)

- [X] T006 [US2] Prueba en `English/tests/pets.test.mjs` (debe fallar antes de T007): en pantallas angostas `#pets` tiene `background` sólido (sin `rgba(…, 0)` ni degradado) y `.pets-toggle-text` se oculta; `pets.js` pone `aria-label` al botón
- [X] T007 [US2] CSS de la franja y del botón compacto, y `pets.js` (`<span class="pets-toggle-text">`, `aria-label` en `togglePets`) (research R2)
- [X] T008 [US2] Validar en un iframe de 390 px: hacer scroll por una guía con la franja sólida, el botón "🐾" y su nombre accesible, y Hide / Show. En PC sin cambios. Registrar, y luego Jira: checkpoint de la US2

## Phase 4: Polish

- [X] T009 Verificación final: `npm test` 10 veces, versiones al día, todos los `run.sh` y la huella. Registrar
- [ ] T010 **Pedir autorización** para el commit; **aparte**, push; **aparte**, PR; confirmar `Tests` en ✅
- [ ] T011 Cierre: **pedir autorización** para integrar; ✅ en `main`; "**Implementado**" en GAMES-10 y "Listo". Pedir al usuario que vuelva a imprimir desde su iPhone (SC-004)

## Dependencies

T001 → T002 → T003 → T004 → T005; T006 → T007 → T008 (independiente de la US1); T009 → T010 → T011.
