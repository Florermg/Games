# Games

Juegos educativos web. El primero es el de **inglés** (`English/`), con las guías de estudio de 5° de primaria (Grammar, Vocabulary & Spelling; Reading & Listening; Writing; Listening): las demos del 1er trimestre y guías nuevas generadas por grado y tema desde fuentes públicas.

## Abrir el juego

Doble clic en `English/QuizA.html`. No hace falta instalar nada. Las demos funcionan sin internet; generar guías nuevas necesita conexión.

Para probarlo en un celular o iPad de la misma red Wi-Fi:

```sh
cd English && python3 -m http.server 8765 --bind 0.0.0.0   # y abrir http://<IP-de-la-Mac>:8765/QuizA.html
```

## Imprimir guías

Dentro de cualquier guía abierta (demo o generada), el botón **🖨 Print** ofrece dos versiones:

- **Student sheet**: la hoja en blanco para contestar a mano, con el formato de las guías en papel (`English/documentacion/`). No incluye nada de lo contestado en pantalla.
- **Answer key**: la misma hoja con las respuestas, otras formas válidas, las palabras del dictado y el guion del *listening* para leer en voz alta, y la rúbrica del writing.

Se usa la impresión del navegador (PC, iPhone, iPad, Android), que también permite **guardar como PDF**. Imprimir no necesita internet. En las guías generadas, imprime la hoja y la clave antes de cerrar la guía: no se guardan.

## Listening

La tarjeta **🎧 Listening** del menú usa el grado y el tema de *Settings for new guides* y tiene tres etapas:

1. **Listen and read**: la voz en inglés del navegador lee el texto oración por oración, y cada oración aparece como subtítulo ("3 / 7").
2. **Listen again**: el mismo audio, sin subtítulos.
3. **Quiz**: 5 o 6 preguntas de opción múltiple, con dos intentos, pistas y resultados, como en las otras guías. El audio se puede volver a escuchar sin subtítulos.

Hay dos tipos de audio (selector **Audio type**):

- **📖 Story or dialogue**: una historia o un diálogo por cada uno de los 18 temas (`English/js/listening-stories.js`), escritos a mano con sus preguntas. En los diálogos cada personaje tiene su propia entonación. Funciona sin internet.
- **🌐 Facts about the topic**: un texto de Simple English Wikipedia, con preguntas generadas como en la guía Reading.

Según el grado se escuchan de 5 (3°) a 8 (6°) oraciones, y la voz va de más lenta a más rápida. Se imprime como las otras guías: la hoja del alumno no trae el texto, y la clave lo trae para leerlo en voz alta. Conviene que una maestra revise las historias antes de usarlas en clase.

## Gramática y verbos

Desde el menú, dos secciones de consulta, con selector de grado (3° a 6°) y de tiempos verbales: por defecto, los del grado; también "All tenses" o los que se marquen.

- **📗 Grammar Cards**: 22 tarjetas en 3 grupos. Cada tarjeta muestra la fórmula de la oración (por ejemplo *Subject + have / has + past participle*); en las de tiempos, para afirmativa, negativa y pregunta, arriba de los sujetos con *play*.
  - Las 10 de tiempos verbales tienen uso, estructura (afirmativa, negativa y pregunta), palabras clave y 2 ejemplos.
  - Hay 4 de temas de las guías (quantifiers, causative, past simple + *ago*, comparatives) y 8 de temas básicos (pronombres, posesivos, artículos, plurales, *there is/are*, preposiciones de lugar y de tiempo, *can / can't*).
  - Los temas que cambian con el tiempo muestran un ejemplo en cada tiempo elegido.
  - Se marcan las tarjetas y **🖨 Print selected** las imprime en hoja carta, en 2 columnas, sin partir ninguna.
- **🔤 Verbs**: se busca un verbo en inglés o español (*eat*, *comer*, *went*) y se ven sus tiempos con la forma, un ejemplo y la traducción.
  - La lista propia tiene unos 215 verbos de primaria, revisados.
  - Un verbo que no está en la lista se busca en línea (MyMemory + Datamuse) y aparece marcado **not reviewed**.
  - Con **➕ Add to print** se juntan verbos y **🖨 Print selected** imprime una tarjeta por verbo.

Los ejemplos y las traducciones están escritos a mano; conviene que una maestra los revise antes de usarlos en clase. Sin internet, las tarjetas y los verbos de la lista funcionan igual.

## My Notebook

Desde el menú, **📓 My Notebook** es un cuaderno para escribir libremente en inglés.

- **✔ Check my writing** marca los errores en el texto, numerados, con una explicación sencilla y la corrección. **Use** aplica la sugerencia.
- **Sin internet**, el juego revisa con sus propias reglas los errores típicos de primaria: *I* y mayúsculas, punto final, *a / an*, *he plays / they play*, *don't / doesn't*, *am / is / are*, *was / were*, el pasado con *yesterday / ago / last…*, el verbo base después de *didn't / can / will…* y palabras repetidas.
- **En línea** (casilla *Also check online*, encendida por defecto), también revisa LanguageTool, que agrega ortografía y otros casos.
  - **Privacidad**: con la casilla encendida, el texto del alumno se envía a languagetool.org para revisarlo, y la pantalla lo avisa. Con la casilla apagada, nada sale del equipo.
- Las páginas se **guardan solas en el navegador del equipo**, con su fecha (no en internet). Se pueden crear páginas nuevas y borrarlas con dos toques. En modo privado, el cuaderno avisa que no puede guardar.
- **🖨 Print** imprime la página con el nombre, la fecha, los errores marcados y las sugerencias, para entregarla a la maestra.

## Fuentes públicas

Todas son gratuitas, sin clave y se consultan en vivo desde el navegador:

- **Datamuse**: palabras y verificación de verbos.
- **Wiktionary**: definiciones.
- **Simple English Wikipedia**: textos de lectura y de *listening*, con su atribución CC BY-SA.
- **MyMemory**: traducción de verbos que no están en la lista.
- **LanguageTool**: revisión de gramática y ortografía del cuaderno, solo si el alumno deja encendida la revisión en línea.

Lo que llega de ellas pasa por filtros de contenido no apto.

## Publicar una versión

El servidor guarda `js/` y `css/` en la caché del navegador hasta 31 días. Por eso `QuizA.html` pide cada archivo con una versión en su dirección (`js/engine.js?v=efa6704a`), calculada de su contenido. Cuando un archivo cambia, cambia su versión y todos los navegadores lo descargan otra vez; los que no cambiaron siguen saliendo de la caché.

1. Después de cambiar cualquier archivo de `English/js/` o `English/css/`, y antes del commit:
   ```sh
   npm run versions   # actualiza los ?v= de QuizA.html y dice qué archivos cambiaron
   npm test           # falla si alguna versión quedó desactualizada
   ```
2. Sube al servidor (`nutritrack.mx/quiz/`) los mismos archivos de siempre:
   - `English/QuizA.html`
   - `English/css/`
   - `English/js/`
   - `English/img/`, solo si pusiste imágenes propias de las mascotas

   No subas `tests/`, `tools/` ni `documentacion/`: no se usan en el navegador.
3. Comprueba que llegó la versión nueva. Abre la página normal, sin forzar la recarga, y luego:
   - En la consola del navegador, `[...document.scripts].map(s => s.src)` debe mostrar los mismos `?v=` que tu `QuizA.html`.
   - En la pestaña Network, los archivos que cambiaron se descargan y los demás salen *from disk cache*.
   - Prueba 🖨 Print y la consola: no debe haber errores.

Si olvidas el paso 1, el check `Tests` del PR sale en ❌ y nombra los archivos.

### Imágenes propias de las mascotas (opcional)

El gatito negro y el pastor alemán están dibujados en el juego. Para usar imágenes 3D propias en su lugar, con permiso de uso:

1. Guarda la imagen como `English/img/pet-cat.png` (gato) o `English/img/pet-dog.png` (perro). Debe ser PNG cuadrado con fondo transparente; se recomienda de 240 × 240 px o más.
2. Ejecuta `npm run versions`. Escribe en `QuizA.html` la versión de la imagen, para que llegue a todos los navegadores.
3. Sube también la carpeta `English/img/` al servidor.

Para volver al dibujo, borra la imagen y vuelve a correr `npm run versions`. Si una imagen no carga, el juego muestra el dibujo.

## Pruebas

Requisito: Node 24. No hay dependencias, así que no hace falta `npm install`.

| Comando | Qué hace |
|---|---|
| `npm test` | Ejecuta todas las pruebas, **sin internet**, en menos de un minuto. |
| `npm run test:coverage` | Igual, con un reporte informativo de cobertura por archivo. |
| `npm run versions` | Actualiza la versión de los archivos en `QuizA.html` (ver "Publicar una versión"). |
| `npm run fixtures:record` | Regraba las respuestas de las fuentes externas que usan las pruebas (necesita internet; ver `English/tests/fixtures/README.md`). |

Algunas pruebas aparecen como `todo` (⚠ `# GAMES-2`): describen brechas conocidas en celulares e iPad y **no** hacen fallar la suite. Node las lista bajo "failing tests", pero el comando termina con código 0. GAMES-2 las convierte en pruebas normales cuando las corrige.

## Quality gate

El workflow `Tests` (`.github/workflows/tests.yml`) corre `npm test` en cada push y en cada pull request a `main`, y marca el cambio con ✅ o ❌.

El repositorio es privado en una cuenta gratuita de GitHub, así que el check no se puede hacer obligatorio. El bloqueo es de proceso: una historia de Jira no se cierra con el check en ❌ (constitución, Principio IV).

## Cómo se trabaja

Spec-Driven Development con [Spec Kit](https://github.com/github/spec-kit):

- La constitución está en `.specify/memory/constitution.md`.
- Cada historia vive en `specs/NNN-nombre/` (spec, plan, tasks) y se sigue en Jira (proyecto `GAMES`).
