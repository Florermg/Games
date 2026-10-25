# Contract: funciones y pantallas de Grammar y Verbs

**Feature**: `004-gramatica-verbos`

## Funciones puras (probadas en Node)

| Función | Archivo | Contrato |
|---|---|---|
| `tensesForGrade(grade)` | `conjugation.js` | Lista de `Tense` con `minGrade ≤ grade`, en el orden de FR-003. |
| `conjugate(verb, tenseId)` | `conjugation.js` | `ConjugatedTense` (data-model §3). Formas inglesas: irregular de la lista o regla regular (*-s/-es/-ies*, *-ed/-d/-ied*, consonante doble, *-ing* sin *-e*, con *-ying* o con consonante doble). |
| `spanishForm(verb, kind)` | `conjugation.js` | Una de las 6 formas base del español (`infinitive`, `present`, `preterite`, `future`, `gerund`, `participle`), con las excepciones de `esForms`. |
| `searchVerbs(query)` | `conjugation.js` | Hasta 8 verbos de la lista que coinciden. El orden es: coincidencia exacta (español o inglés, sin acentos ni mayúsculas); luego forma conjugada inglesa (*went* → *go*); luego prefijo. Si no hay ninguno, devuelve `[]`. |
| `lookupVerbOnline(query)` | `conjugation.js` | Promesa → `Verb` con `reviewed: false`, o `null` (no encontrado, filtrado o sin conexión). Usa MyMemory y Datamuse (research R4). |
| `grammarCardsFor(tenseIds)` | `grammar-cards.js` | Las 22 tarjetas con sus ejemplos filtrados a esos tiempos. |
| `buildCardsPrintHtml(selection)` | `grammar-cards.js` | HTML de la cuadrícula de tarjetas para `#print-area`. Una `.print-card` por elemento. Lanza un error si no hay elementos o tiempos. |

## Pantallas (QuizA.html + reference.js)

| Elemento | Comportamiento |
|---|---|
| Menú | Dos tarjetas nuevas, "📗 Grammar cards" y "🔤 Verbs", además de las 3 guías. |
| Grado y tiempos (ambas pantallas) | Selector de grado (3°–6°; por defecto, el del menú) y casillas de los 10 tiempos, con las del grado marcadas, más "All tenses". Con 0 tiempos marcados no se muestra ni imprime nada y se pide marcar uno. |
| Verbs | Campo de búsqueda con sugerencias mientras se escribe; al elegir un verbo, su tarjeta con los tiempos marcados. Botón "➕ Add to print" y lista de seleccionados con "✖". "🖨 Print selected" imprime. |
| Grammar | Las 22 tarjetas en 3 grupos, cada una con su casilla para imprimir; "Select all" o "Select none"; "🖨 Print selected". |
| Imprimir | `#print-area.innerHTML = buildCardsPrintHtml(...)` → `window.print()`. Sin selección, la tutora pide elegir al menos una tarjeta. |
| Volver | "⬅ Menu", como en las guías. |
