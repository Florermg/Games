# Validation: Secciones de gramática y de verbos

**Feature**: `004-gramatica-verbos` · **Jira**: GAMES-6

## Línea base (T001)

- **Rama**: `004-gramatica-verbos`, desde `main` (`c9a1978`), sin cambios de código.
- `git diff db1ac09 HEAD -- English` está vacío: `English/` es idéntico al código sobre el que GAMES-3 midió la huella del recorrido de GAMES-1 en su T024 (2026-10-24): **`f1 b9 82 7e 2c 76`** (4,817 caracteres). Esa es la referencia de FR-015 para esta historia; se vuelve a medir en T005 y T028.

## Base (T002–T005)

- Pantallas `#grammar-screen` y `#verbs-screen` con su selector de grado y tiempos (Chrome): 3° marca `presentSimple, presentContinuous, pastSimple`; 6° marca los 10; 5° marca 7; "All tenses" marca los 10; "⬅ Menu" vuelve al menú y oculta la pantalla. Sin errores en consola.
- **FR-015**: `npm test` → `146 · pass 144 · fail 0 · todo 2`. Huella del recorrido de GAMES-1 con las pantallas nuevas en el HTML: **`f1 b9 82 7e 2c 76`** (4,817), sin cambios.

## Decisiones de contenido (T006, T008)

- **"like" no entra en la lista propia**: en español lleva otra estructura ("A ella le gusta la pizza"), y el patrón de ejemplo "Ella + verbo" daría el incorrecto "Ella gusta…". El caso de verbo poco usado en continuo lo cubren *want* (querer), *know* (saber) y *love* (amar). La tabla de 30 verbos de la prueba usa *want* en lugar de *like*.
- Las traducciones, complementos y formas españolas los escribe el proyecto a mano (research R2–R3). **Se recomienda que una maestra revise la lista** antes de usarla con alumnos; las pruebas garantizan la consistencia de las formas, no la naturalidad de cada traducción.

## US1: conjugación y búsqueda (T008–T011)

- `verbs-data.js`: **215 verbos** (211 infinitivos españoles distintos). Se revisaron a mano las 5 formas base españolas de los 211 (cambios de raíz, irregulares, participios *escrito/devuelto/impreso*, *rio/sonrió*, *anduvo*).
- Errores encontrados por las pruebas o la revisión manual y corregidos, cada uno con su prueba de regresión:
  - *wake up* daba "waked up" → irregular *woke/woken*.
  - El futuro "ensenará" (se perdía la ñ) → solo se quita la tilde de *-ír*.
  - *whisper* se tomaba como verbo español (*-er*) → si es-en no da nada, se intenta en-es.
  - "Ella se irió": *irse* no se detectaba como reflexivo → regla `(ar|er|ir|ír)se$`.
  - El complemento de *hope* daba "deseó que nieve ayer" → se cambió el complemento.
  - Los verbos de estado quedaban raros con la expresión de tiempo → se omite, salvo en pasado continuo y pasado perfecto.
- `npm test` → `196 · pass 194 · fail 0 · todo 2` (los 2 `todo` son de GAMES-2).

## US1 en el navegador (T012–T013), Chrome, 127.0.0.1:8765

- 5° → Verbs: "comer", "EAT", "ir" (*go*, *leave/irse*), "study", "went" (→ *go*), "tocar" (*play*, *ring*, *touch*), "levantarse" (*get up*) dan sugerencias al escribir; Enter elige la primera.
- *go* en 5°: los 7 tiempos de 5° en el orden fijo (*goes, is going, has gone, went, was going, will go, is going to go*), cada uno con ejemplo y traducción ("Ella fue a la escuela ayer.").
- "All tenses" → 10 filas; solo 2 tiempos → *Present simple* y *Past simple*; ninguno → "Choose at least one tense."
- Fuera de la lista, con internet real: "susurrar" → *whisper*, marcado **not reviewed**, con "Translation not reviewed" en lugar del ejemplo español.
- Sin conexión (simulada): "No internet connection, so I can only show verbs from my list." más sugerencias de la lista, y los verbos de la lista siguen funcionando (SC-001). Palabra que no es verbo ("mesa"): mensaje de "couldn't find" con 4 sugerencias.
  - Hallazgo corregido en T012: sin conexión se mostraba "couldn't find". Ahora `lookupVerbOnline` deja `lastLookupOffline` (sigue devolviendo `null`, según el contrato), con su prueba.
- Escapado: `<img src=x onerror=…>` en la búsqueda se muestra como texto.
- Ancho de teléfono (iframe de 390 px): sin scroll horizontal, el campo en 16 px (sin zoom en iOS) y las filas de la tabla apiladas. La ventana de Chrome no se pudo redimensionar; la prueba en dispositivos reales sigue en GAMES-4.
- Consola sin errores. **FR-015**: huella del recorrido de GAMES-1 **`f1 b9 82 7e 2c 76`** (4,817), sin cambios.

## US2: tarjetas de gramática (T015–T019)

- `grammar-cards.test.mjs` (10 pruebas): antes de T016–T017, 7 fallaban; las 3 que pasaban eran las de "debe lanzar error", porque el esqueleto siempre lanzaba. Ahora pasan las 10.
- 22 tarjetas escritas a mano:
  - 10 de tiempos, con estructura, palabras clave y 2 ejemplos;
  - 4 de las guías y 8 básicas;
  - 5 temas cambian con el tiempo: quantifiers (10 tiempos), causative (8), comparatives (8), *there is/are* (6) y *can* (4: *can*, *could*, *will be able to*, *going to be able to*). Son unas 90 oraciones con traducción.
  - Las tarjetas que no cambian dicen "This rule works the same in every tense."; *ago* dice "Ago is used only with the past simple."
  - Si ninguno de los tiempos elegidos aplica a un tema que cambia, la tarjeta muestra el ejemplo de su primer tiempo, con una nota de qué tiempos elegir.
- En Chrome, 3° → Grammar:
  - aparecen los 3 grupos (10, 4 y 8 tarjetas); las 7 tarjetas de tiempos fuera de 3° se ven atenuadas con "(not in the chosen tenses)";
  - *there is/are* muestra los ejemplos de *Present simple* y *Past simple*, y con "All tenses" muestra 6;
  - "Select all" marca 22;
  - sin selección, 🖨 hace que la tutora diga "Choose at least one card to print." y **no** abre la impresión;
  - con 4 marcadas, `#print-area` lleva 4 `.print-card` y se abre la impresión.
- `npm test` → `206 · pass 204 · fail 0 · todo 2`. Consola sin errores. **FR-015**: huella **`f1 b9 82 7e 2c 76`** (4,817), sin cambios.

## Impresión de tarjetas (T020, SC-004)

`sh specs/004-gramatica-verbos/validate-print/run.sh` (Chrome sin ventana + `pdftotext`). `check-cards.mjs` comprueba que el título y la última línea de cada tarjeta estén en la misma página.

| Caso | Tarjetas | Hojas | Carta | Sin pantalla | Ninguna partida |
|---|---|---|---|---|---|
| Gramática, 4 tarjetas, tiempos de 3° | 4 | 1 | ✔ | ✔ | ✔ |
| Gramática, las 22, todos los tiempos | 22 | 5 | ✔ | ✔ | ✔ |
| Verbos, 6, tiempos de 5° (tarjeta ancha) | 6 | 3 | ✔ | ✔ | ✔ |
| Verbos, 6, tiempos de 3° | 6 | 1 | ✔ | ✔ | ✔ |

- Revisión a ojo: 2 columnas, borde, blanco y negro, ejemplo con traducción en cursiva y sin elementos de pantalla. Las tarjetas de verbo con 7 o más tiempos ocupan el ancho completo: caben 2 por hoja, dentro de SC-004.
- Hallazgos en el *harness*, no en el juego:
  - El *script* no creaba la carpeta de salida → `mkdir -p`.
  - El verificador buscaba la nota repetida "same in every tense" como última línea y la encontraba en otra página → ahora usa el último ejemplo, que es único.
- El `run.sh` de GAMES-3 (sin argumento) sigue en "All checks passed" con las mismas hojas (3/3/2/2/1/1). Ojo: ese *script* tampoco crea la carpeta si se le pasa una que no existe.

## US3: imprimir tarjetas de verbos (T022–T024)

- T022: la prueba nueva (orden de la selección, solo los tiempos elegidos en el orden fijo, formas y ejemplos) **pasó desde el inicio**, en lugar de fallar primero. Las tarjetas de verbo de `buildCardsPrintHtml` ya se habían escrito en T017, junto con su prueba de tarjeta ancha y escapado.
- T023: botón "➕ Add to print" en la tarjeta del verbo; queda en "✔ Added to print" (deshabilitado) si el verbo ya está. Lista "Verbs to print (n)" con "✖" por verbo; "🖨 Print selected" imprime en el orden en que se agregaron, con los tiempos marcados en ese momento.
- En Chrome, 5° → Verbs:
  - sin verbos, 🖨 hace que la tutora diga "Add at least one verb with ➕ before printing." y **no** abre la impresión;
  - se agregaron comer, went (*go*), estudiar, levantarse, swim y jugar (*play*) → 6 en la lista; *eat* otra vez → "✔ Added to print";
  - se quitó *go* con ✖ → 5, y se volvió a agregar al final → 6;
  - se dejaron solo *Present simple* y *Past simple* → `#print-area` con 6 `.print-card` (*eat, study, get up, swim, play, go*), cada una con 2 filas, y se abre la impresión.
- PDFs de T020 (los casos de 6 verbos): "All checks passed" (1 hoja con 3 tiempos, 3 hojas con 7). `npm test` → `207 · pass 205 · fail 0 · todo 2`. Consola sin errores.

## Cierre (T026–T028)

- T026: `README.md` con las secciones "Gramática y verbos" y "Fuentes públicas" (MyMemory incluida).
- T027: constitución **1.0.2** (PATCH), con su Sync Impact Report: MyMemory se agrega a la lista de fuentes del Principio VI, sin cambio semántico.
- T028:
  - `npm test` 10 veces → las 10 dan `207 · pass 205 · fail 0 · todo 2`.
  - **FR-015**: huella del recorrido de GAMES-1 en carga limpia → **`f1 b9 82 7e 2c 76`** (4,817), sin cambios desde la línea base.
  - **SC-001**: buscar y mostrar un verbo de la lista (comer, went, tocar, levantarse, study, swimming, EAT) tarda como máximo **2.8 ms**, contra 1 s permitido.
  - **SC-005**: menú → Grammar → marcar 3 tarjetas → 🖨 tarda **1.7 ms** de proceso hasta abrir la impresión, contra 1 minuto permitido. El tiempo real lo pone la persona; el juego no agrega espera.
  - `run.sh` de tarjetas: "All checks passed". El de GAMES-3 (sin argumento): "All checks passed".
- `main` sigue en `c9a1978` (GAMES-5 no se ha integrado): no hace falta rebasar.
