# Respuestas grabadas de las fuentes externas

Estos archivos permiten que `npm test` pruebe los generadores de guías **sin internet**. Cada JSON guarda las respuestas reales que dio cada fuente a las peticiones del juego, indexadas por URL (formato en `specs/001-linea-base-quality-gate/data-model.md` §6).

| Archivo | Escenario | Semilla | Fuentes | Captura |
|---|---|---|---|---|
| `gvs-recycling-g5.json` | Guía de gramática, tema Recycling, 5° grado, con *quantifiers*, causativos, *ago* y comparativos | 7 | Datamuse, Wiktionary | 2026-10-24 |
| `rl-space-g5.json` | Guía de Reading & Listening, tema Space & Planets, 5° grado | 11 | Simple English Wikipedia, Datamuse | 2026-10-24 |
| `writing-animals-g5.json` | Guía de Writing (carta), tema Animals, 5° grado | 13 | Datamuse, Simple English Wikipedia | 2026-10-24 |
| `languagetool-footbal.json`, `languagetool-mixed.json` | Respuestas de LanguageTool para el cuaderno (GAMES-13); cada archivo guarda el texto enviado y la respuesta, no se indexan por URL | — | LanguageTool | 2026-10-25 |

## Licencias y atribución

- **Simple English Wikipedia** (<https://simple.wikipedia.org>) y **Wiktionary** (<https://en.wiktionary.org>): los textos y las oraciones de ejemplo están bajo [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/). Se guardan sin modificar, solo para pruebas; el juego muestra la fuente de cada texto en pantalla.
- **Datamuse** (<https://www.datamuse.com/api/>): API pública y gratuita; las definiciones que devuelve provienen de Wiktionary (CC BY-SA).
- **LanguageTool** (<https://languagetool.org>): API pública y gratuita. Las dos respuestas se grabaron a mano con `curl` (POST a `/v2/check`, `language=en-US`); para regrabarlas, repetir la petición con el texto de cada archivo.

## Cómo regrabar

```sh
npm run fixtures:record                 # todos los escenarios
npm run fixtures:record -- rl-space-g5  # uno solo
```

- Necesita internet. El script se identifica ante las fuentes con un `User-Agent` descriptivo, como pide Wikimedia.
- Si una fuente responde 429 (demasiadas peticiones), el escenario se marca como fallido y **se conserva el archivo anterior**. Basta con reintentar más tarde.
- Regrabar con las mismas semillas **cambia los archivos si las fuentes cambiaron** (por ejemplo, si Wikipedia editó un artículo). En ese caso, revisa que `npm test` siga en verde antes de hacer commit, porque los resultados de los generadores pueden cambiar.
- Si cambias el código de los generadores y `npm test` reporta `No recorded response for <URL>`, el juego ahora pide algo que no está grabado: regraba el escenario.
