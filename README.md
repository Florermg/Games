# Games

Juegos educativos web. El primero es el de **inglés** (`English/`), con las guías de estudio de 5° de primaria (Grammar, Vocabulary & Spelling; Reading & Listening; Writing; Listening): las demos del 1er trimestre y guías nuevas generadas por grado y tema desde fuentes públicas.

## Abrir el juego

Doble clic en `English/QuizA.html` (la página principal) y elige la materia. No hace falta instalar nada. Las demos funcionan sin internet; generar guías nuevas necesita conexión.

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

## My Pets y premios

- Al terminar una **guía generada** con **100%**, el alumno gana un accesorio sorpresa para el gatito y el perrito. Las demos no dan premio, y repetir la misma guía tampoco.
- Hay **43 accesorios** dibujados a mano: sombreros y coronas, lentes, collares y correa, corbata y moños, ropa y zapatitos.
  - **24 son de temporada**: Día de Muertos, Halloween, Navidad, fiestas patrias, primavera, verano, otoño e invierno.
  - Solo se ganan en su temporada, y en ella salen el triple de seguido. Una vez ganados, se usan todo el año.
- En **🐾 My Pets** se elige la mascota y se toca un accesorio para ponérselo o quitárselo (uno por cabeza, ojos, cuello, cuerpo y patas). Lo puesto se ve también en las mascotas de abajo de la ventana.
- Los premios son **de cada alumno**, según el nombre del menú, y se guardan en el navegador del equipo.

## Ambiente: hora, clima y estación

- El cielo del juego cambia con el reloj del equipo: **mañana** (6:00–11:59), **tarde** (12:00–18:59) y **noche** (19:00–5:59).
- También con el **clima actual** (sol, nubes, niebla, lluvia, nieve o tormenta, con la temperatura) y con la **estación** (primavera, verano, otoño e invierno, con las mismas fechas que los accesorios).
- El menú muestra una ventana dibujada con el ambiente y, abajo de "Weather of", se elige la ciudad.
  - Con "📍 Where I am", el navegador pide permiso de ubicación. Solo la da en `https://` o `localhost`; si no la da, se usa Ciudad de México.
  - La ciudad elegida se recuerda en el navegador.
- Sin internet se ven la hora del día y la estación, sin clima. El ambiente no se imprime.
- **Modo de prueba**: agregar a la dirección `?ambiente=dia|tarde|noche`, `&clima=sol|nubes|niebla|lluvia|nieve|tormenta` y `&estacion=primavera|verano|otono|invierno`. Por ejemplo, `QuizA.html?ambiente=noche&clima=lluvia&estacion=invierno`. El menú dice "test mode".

## Festividades

- Unos días antes de cada festividad y el día mismo, el juego se decora:
  - guirnalda arriba de la hoja (papel picado, banderines, luces o corazones);
  - adornos en la ventana del menú (calabaza, altar, piñata, árbol, rosca, bandera…);
  - cosas que flotan en el fondo.
- La tutora saluda al abrir el juego, y en el menú hay una tarjeta de **palabras en inglés** de la festividad, con dibujo, significado en español y una oración de ejemplo. Al tocar una palabra se escucha.
- Son 16 festividades:

  | Festividad | Se ve |
  |---|---|
  | Año Nuevo | 28 dic – 1 ene |
  | Día de Reyes | 2 – 6 ene |
  | Amor y Amistad | 7 – 14 feb |
  | Día de la Bandera | 17 – 24 feb |
  | St. Patrick's Day | 10 – 17 mar |
  | Easter | la semana antes del domingo de Pascua |
  | Día del Niño | 23 – 30 abr |
  | Día de las Madres | 3 – 10 may |
  | Día del Maestro | 11 – 15 may |
  | Independencia | 1 – 16 sep |
  | Halloween | 15 – 31 oct |
  | Día de Muertos | 25 oct – 2 nov |
  | Revolución | 14 – 20 nov |
  | Thanksgiving | la semana antes del 4.º jueves de noviembre |
  | Posadas | 16 – 24 dic |
  | Navidad | 1 – 25 dic |

- Si coinciden dos, se mezclan.
- **Modo de prueba**: `QuizA.html?festividad=posadas`, `?festividad=halloween,muertos` o `?festividad=ninguna`. Se puede combinar con el del ambiente, por ejemplo `?festividad=navidad&ambiente=noche&clima=nieve`.

## Página principal (QuizA.html)

- `QuizA.html` es la entrada: el alumno elige la materia. Las opciones son 🔤 Inglés (`Ingles.html`), 📚 Español · Campos formativos (`campos/Guia5.html`) y 🔢 Matemáticas, que por ahora dice "próximamente".
- Arriba se elige el idioma de la página. Inglés es el idioma por omisión, y la elección se recuerda en el equipo.
- El alumno escribe su **nombre** una sola vez y todas las materias lo usan. También elige la **ciudad** del clima.
- **Mi actividad reciente**: un resumen de las últimas 50 guías que terminó, demos o nuevas, de cualquier materia. No muestra calificaciones, sino:
  - una frase alentadora según su nivel, en general y por materia;
  - lo que hace genial;
  - sus próximos retos, cada uno con algo concreto que hacer (por ejemplo, "Repasa la tarjeta «Sistema circulatorio» y genera una guía de Saberes…");
  - sus últimas guías, con fecha y un emoji de logro.
- Cada materia tiene un botón para volver a la página principal.

## Respaldo del avance (Fase 1)

- En la página principal, la tarjeta **💾 Mi respaldo** junta en un respaldo lo del alumno: sus premios, la ropa de sus mascotas, su historial de guías y, si deja marcada la casilla, su cuaderno. Se puede llevar de dos formas:
  - **💾 Descargar mi respaldo**: un archivo `respaldo-ana-2026-10-31.json`.
  - **📋 Copiar mi código**: un texto que empieza con `GAMES1-` y se puede mandar por mensaje.
- En el otro equipo, **📥 Recuperar mi avance**, con el archivo o pegando el código. Lo recuperado **se junta** con lo que ya hay: no se borra nada ni se repite.
- El respaldo lleva una verificación (SHA-256). Si llega incompleto o alguien lo modificó, no se usa y no cambia nada.
- **No está cifrado**: quien tenga el archivo puede leer el avance. Guárdenlo como una libreta. El cifrado y el guardado en el servidor son la Fase 2 (GAMES-20, en borrador).

## Guía 5.º Campos formativos (en español)

- Página propia: `English/campos/Guia5.html`. Se abre con doble clic o desde la tarjeta "📚 Guía 5.º — Campos formativos" del menú de inglés, y tiene "⬅ Inglés" para regresar.
- Contenido de la *Guía de estudio del primer trimestre 2026-2027*: 21 temas de Lenguajes, Saberes y pensamiento científico, Ética, naturaleza y sociedades, y De lo humano y lo comunitario. Está en `campos/js/campos-data.js`; el PDF no se guarda en el repositorio.
- **Demo** (siempre igual) y **🎲 guías nuevas** de los campos que elijas. Cada guía trae seis tipos de ejercicio:

  | Ejercicio | Preguntas |
  |---|---|
  | Opción múltiple | 8 |
  | Verdadero o falso | 8 |
  | Relacionar | 5 |
  | Banco de palabras | 5 |
  | Clasificar | 6 |
  | Respuesta con tus palabras | 2 |

- La revisión funciona como en inglés: 2 intentos por sección, pistas, promedio sobre 10, tabla de resultados y repaso de lo que faltó. Las respuestas abiertas se califican por ideas clave, sin importar acentos ni mayúsculas, y al final muestran la respuesta modelo.
- **✏️ Ejercicios por tema** (GAMES-21): los 21 temas, numerados como en la guía (1. Tipos de sustantivos, 2. Clases de palabras: variables e invariables…). Cada tema abre todos sus ejercicios: opción múltiple, verdadero o falso, relacionar, banco de palabras, clasificar ejemplos y respuesta abierta. También se abren con "✏️ Ejercicios de este tema" en cada tarjeta de repaso. Cuentan para el avance y, con 100%, dan premio.
- 🖨 Hoja del alumno y clave de respuestas. **📚 Tarjetas de repaso**: una por tema; se escuchan con 🔊 y se imprimen en 1 o 2 columnas.
- Comparte con el juego de inglés las mascotas, los premios y Mis mascotas, el clima y las festividades, todo en español. Con el mismo nombre, los accesorios son los mismos en las dos páginas.
- **Publicar**: sube también la carpeta `English/campos/` a `nutritrack.mx/quiz/campos/`. Usa los mismos `js/` y `css/` del juego (`../js`, `../css`), y `npm run versions` sella las dos páginas.

## Fuentes públicas

Todas son gratuitas, sin clave y se consultan en vivo desde el navegador:

- **Datamuse**: palabras y verificación de verbos.
- **Wiktionary**: definiciones.
- **Simple English Wikipedia**: textos de lectura y de *listening*, con su atribución CC BY-SA.
- **MyMemory**: traducción de verbos que no están en la lista.
- **Open-Meteo**: clima actual del ambiente; solo recibe la latitud y la longitud redondeadas (≈1 km).
- **LanguageTool**: revisión de gramática y ortografía del cuaderno, solo si el alumno deja encendida la revisión en línea.

Lo que llega de ellas pasa por filtros de contenido no apto.

## Publicar una versión

El servidor guarda `js/` y `css/` en la caché del navegador hasta 31 días. Por eso las páginas (`QuizA.html`, `Ingles.html` y `campos/Guia5.html`) piden cada archivo con una versión en su dirección (`js/engine.js?v=efa6704a`), calculada de su contenido. Cuando un archivo cambia, cambia su versión y todos los navegadores lo descargan otra vez; los que no cambiaron siguen saliendo de la caché.

1. Después de cambiar cualquier archivo de `English/js/` o `English/css/`, y antes del commit:
   ```sh
   npm run versions   # actualiza los ?v= de QuizA.html, Ingles.html y campos/Guia5.html y dice qué archivos cambiaron
   npm test           # falla si alguna versión quedó desactualizada
   ```
2. Sube al servidor (`nutritrack.mx/quiz/`) los mismos archivos de siempre:
   - `English/QuizA.html` (la página principal) y `English/Ingles.html` (el juego de inglés, GAMES-18)
   - `English/css/`
   - `English/js/`
   - `English/img/`, solo si pusiste imágenes propias de las mascotas
   - `English/campos/` (la Guía 5.º de campos formativos, GAMES-17)

   No subas `tests/`, `tools/` ni `documentacion/`: no se usan en el navegador.
3. Comprueba que llegó la versión nueva. Abre la página normal, sin forzar la recarga, y luego:
   - En la consola del navegador, `[...document.scripts].map(s => s.src)` debe mostrar los mismos `?v=` que tu página (`QuizA.html`, `Ingles.html` o `campos/Guia5.html`).
   - En la pestaña Network, los archivos que cambiaron se descargan y los demás salen *from disk cache*.
   - Prueba 🖨 Print y la consola: no debe haber errores.

Si olvidas el paso 1, el check `Tests` del PR sale en ❌ y nombra los archivos.

### Imágenes propias de las mascotas (opcional)

El gatito negro y el pastor alemán están dibujados en el juego. Para usar imágenes 3D propias en su lugar, con permiso de uso:

1. Guarda la imagen como `English/img/pet-cat.png` (gato) o `English/img/pet-dog.png` (perro). Debe ser PNG cuadrado con fondo transparente; se recomienda de 240 × 240 px o más.
2. Ejecuta `npm run versions`. Escribe en `Ingles.html` la versión de la imagen, para que llegue a todos los navegadores.
3. Sube también la carpeta `English/img/` al servidor.

Para volver al dibujo, borra la imagen y vuelve a correr `npm run versions`. Si una imagen no carga, el juego muestra el dibujo.

## Pruebas

Requisito: Node 24. No hay dependencias, así que no hace falta `npm install`.

| Comando | Qué hace |
|---|---|
| `npm test` | Ejecuta todas las pruebas, **sin internet**, en menos de un minuto. |
| `npm run test:coverage` | Igual, con un reporte informativo de cobertura por archivo. |
| `npm run versions` | Actualiza la versión de los archivos en `QuizA.html`, `Ingles.html` y `campos/Guia5.html` (ver "Publicar una versión"). |
| `npm run fixtures:record` | Regraba las respuestas de las fuentes externas que usan las pruebas (necesita internet; ver `English/tests/fixtures/README.md`). |

Algunas pruebas aparecen como `todo` (⚠ `# GAMES-2`): describen brechas conocidas en celulares e iPad y **no** hacen fallar la suite. Node las lista bajo "failing tests", pero el comando termina con código 0. GAMES-2 las convierte en pruebas normales cuando las corrige.

## Quality gate

El workflow `Tests` (`.github/workflows/tests.yml`) corre `npm test` en cada push y en cada pull request a `main`, y marca el cambio con ✅ o ❌.

El repositorio es privado en una cuenta gratuita de GitHub, así que el check no se puede hacer obligatorio. El bloqueo es de proceso: una historia de Jira no se cierra con el check en ❌ (constitución, Principio IV).

## Cómo se trabaja

Spec-Driven Development con [Spec Kit](https://github.com/github/spec-kit):

- La constitución está en `.specify/memory/constitution.md`.
- Cada historia vive en `specs/NNN-nombre/` (spec, plan, tasks) y se sigue en Jira (proyecto `GAMES`).
