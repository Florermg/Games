# Quickstart: validar Grammar y Verbs

**Feature**: `004-gramatica-verbos` · **Jira**: GAMES-6

## 1. Pruebas (FR-014, FR-015)

- `npm test`. **Esperado**:
  - Las 146 pruebas anteriores siguen igual: 144 pasan, 0 fallan y 2 pendientes de GAMES-2.
  - Se suman, en verde, `conjugation.test.mjs`, `verb-search.test.mjs` y `grammar-cards.test.mjs`, sin red.

## 2. Verbs en el navegador (US1)

1. Elegir 5° → Verbs.
2. Buscar "comer", "EAT", "ir", "study", "went", "tocar" y "levantarse".
3. **Esperado**:
   - Hay sugerencias mientras se escribe.
   - Aparecen los 7 tiempos de 5°, con formas correctas (*ate*, *went/gone*, *studied/studying*) y un ejemplo con traducción.
   - "went" lleva a *go*; "tocar" ofrece *play* y *touch*.
4. Marcar "All tenses" y luego solo 2 tiempos. **Esperado**: se ven exactamente esos tiempos, en el orden fijo.
5. Buscar un verbo fuera de la lista (por ejemplo, "susurrar", con internet). **Esperado**: aparece *whisper*, marcado "not reviewed".
6. Sin internet: el mismo verbo da un mensaje claro y sugerencias, y los verbos de la lista siguen funcionando (SC-001).

## 3. Grammar en el navegador (US2)

1. Elegir 3° → Grammar. **Esperado**: 22 tarjetas en 3 grupos; las de tiempos tienen estructura, palabras clave y ejemplos.
2. Cambiar los tiempos. **Esperado**: los ejemplos de *there is/are*, quantifiers, causative y comparatives cambian. Las tarjetas que no cambian con el tiempo lo indican.

## 4. Impresión (US2, US3, SC-004, SC-005)

1. Grammar: marcar 4 tarjetas con los tiempos de 3° → 🖨 Print selected. **Esperado**: 1–2 hojas carta, varias tarjetas por hoja, ninguna partida y sin elementos de pantalla.
2. Verbs: agregar 6 verbos → 🖨 Print selected. **Esperado**: 6 tarjetas completas.
3. Sin selección → 🖨. **Esperado**: la tutora pide elegir al menos una tarjeta y no se abre la impresión.
4. Generar los PDFs con el script de validación de la historia (Chrome sin ventana + `pdftotext`, como en GAMES-3) y revisarlos a ojo.

## 5. Las guías no cambian (FR-015)

El recorrido de GAMES-1 (quickstart §4 de `specs/001-linea-base-quality-gate/`) da la misma huella, `f1 b9 82 7e 2c 76`.
