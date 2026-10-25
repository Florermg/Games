# Research: Línea base y quality gate del juego de inglés

**Feature**: `001-linea-base-quality-gate` · **Date**: 2026-10-24 · **Jira**: GAMES-1

Cada decisión se verificó con una prueba rápida en esta máquina (Node 24.16.0, npm 11.13.0) antes de escribir el plan.

## R1. Runner de pruebas

- **Decision**: el runner integrado de Node (`node:test` + `node:assert/strict`), en Node 24 LTS. Sin dependencias npm.
- **Rationale**: el proyecto no tiene dependencias ni paso de build (Principio II). `node:test` cubre lo necesario: suites, `assert`, reporte, filtrado y cobertura experimental, sin instalar nada. Además, CI no necesita `npm install`, así que es más rápido y no hay paquetes que auditar. Verificado: una prueba de ejemplo corre en unos 40 ms.
- **Alternatives considered**: **Vitest**, que se recomendó al elegir el quality gate, y **Jest** ofrecen mejor salida y *watch mode*, pero agregan cientos de paquetes de desarrollo a un proyecto sin `node_modules`. Además, ambos esperan módulos ES o CommonJS, y el juego usa scripts de navegador con variables globales. No compensa en esta etapa. Si más adelante se necesita (por ejemplo, para probar el DOM), migrar es directo porque la API de aserciones es parecida.

## R2. Cómo cargar el código del juego en las pruebas

- **Decision**: cargar los scripts tal cual, en el mismo orden que `QuizA.html`, dentro de un contexto aislado de `node:vm`, mediante un helper de pruebas. No se convierten a módulos.
- **Rationale**: el juego usa scripts clásicos con funciones globales para poder abrirse con doble clic. Chrome bloquea los módulos ES en `file://`, así que convertirlos rompería FR-035. Verificado: `api.js`, `banks.js`, `demos.js` y `generators.js` cargan en un contexto `vm` sin cambios y sus funciones globales (`pastSimple`, `quantifierSection`, `DEMO_GUIDES`…) se pueden llamar desde la prueba. Cada prueba obtiene un contexto nuevo, sin estado compartido; por ejemplo, la caché de peticiones `apiCache` empieza vacía.
- **Alternatives considered**: (a) Agregar `module.exports` condicional al final de cada archivo: toca todos los archivos de producción para servir a las pruebas. (b) Un bundler: viola el Principio II.

## R3. La lógica que vive en `engine.js`

- **Decision**: extraer las funciones puras de calificación de `engine.js` a un archivo nuevo, `English/js/grading.js`, cargado antes de `engine.js` en `QuizA.html`. Son `normalizeAnswer`, `isCorrect`, `correctAnswerText` y el cálculo de puntos por sección y del promedio, que hoy está escrito dentro de `finishGuide`. `engine.js` las sigue usando con los mismos nombres. No se prueba el DOM.
- **Rationale**: `engine.js` llama `setupMenu()` al cargarse y depende del DOM, así que no carga en Node. Sin embargo, la lógica que más importa proteger (FR-015, FR-016, FR-022) son funciones puras mezcladas con la pantalla. Separarlas es el cambio mínimo permitido por FR-038 y no altera el comportamiento visible.
- **Alternatives considered**: (a) Simular un DOM con jsdom: es una dependencia grande, y la spec asume que la capa visual se valida a mano. (b) Un DOM falso escrito a mano: es frágil y prueba la simulación más que el juego. (c) Copiar las funciones en las pruebas: deja de probar el código real.

## R4. Pruebas repetibles con generadores aleatorios

- **Decision**: antes de cargar los scripts en cada contexto, reemplazar `Math.random` por un generador con semilla fija (mulberry32). Cada prueba declara su semilla.
- **Rationale**: los generadores usan `Math.random` (con `shuffle` y `pickRandom`). Con semilla, la misma prueba produce siempre la misma guía y pide exactamente las mismas URLs, lo que permite simular la red con respuestas grabadas (R5). Verificado: dos contextos con la misma semilla dan la misma sección de *quantifiers*. Esto cumple FR-033 y SC-004.
- **Alternatives considered**: probar solo propiedades válidas para cualquier resultado aleatorio. Es más robusto ante cambios, pero no permite simular la red, porque las URLs cambian en cada ejecución. Se usa como complemento: las pruebas verifican propiedades (FR-025, FR-029), no una guía exacta.

## R5. Simular las fuentes externas

- **Decision**: un `fetch` falso, inyectado en el contexto, que responde desde archivos JSON de respuestas grabadas indexados por URL completa. Si se pide una URL no grabada, la prueba falla y muestra la URL. Las grabaciones se generan con un script de desarrollo (`record.mjs`) que ejecuta los mismos escenarios con la misma semilla contra la red real.
- **Rationale**: cumple FR-032 (cero peticiones reales en las pruebas), y cualquier cambio en las peticiones del juego se detecta en vez de pasar en silencio. Tamaño medido: la guía de gramática completa hace 72 peticiones (32 a Datamuse y 40 a Wiktionary) y ocupa unos 550 KB; con *reading* y *writing* se estima que el total queda por debajo de 1.5 MB, aceptable para un repo.
- **Hallazgo al investigar**: Simple English Wikipedia respondió 429 a peticiones desde Node durante esta sesión, incluso con un `User-Agent` identificado, mientras que desde el navegador funcionaba. Por eso el script de grabación debe (a) mandar un `User-Agent` descriptivo, como pide la política de Wikimedia, y (b) reportar el 429 y permitir reintentar más tarde sin perder lo ya grabado. El juego en el navegador no se ve afectado.
- **Licencia**: las grabaciones contienen texto de Wikipedia y Wiktionary (CC BY-SA). Se acompañan de un `README.md` con la atribución y la fecha de captura (Principio VI).
- **Alternatives considered**: (a) Escribir a mano respuestas mínimas: no prueba los filtros contra datos reales. (b) Simular solo funciones de alto nivel (`buildWordPool`, `findArticle`): no prueba el parseo ni los filtros, que son justo lo que más se quiere proteger.

## R6. Quality gate en GitHub Actions

- **Decision**: un workflow, `.github/workflows/tests.yml`, que se dispara en `push` a `main` y en `pull_request` hacia `main`. Usa `actions/checkout` y `actions/setup-node` con Node 24, ejecuta `npm test` y tiene un *timeout* de 5 minutos. No necesita `npm install`, porque no hay dependencias.
- **Rationale**: cumple FR-036 y SC-005. El check aparece en cada PR y en cada commit de `main`. Por la clarificación de FR-037, el bloqueo es de proceso: el workflow no se configura como check obligatorio, porque la cuenta no lo permite en repos privados.
- **Alternatives considered**: SonarQube (como NutriTrackPro): se descartó al elegir el quality gate. Cobertura con umbral obligatorio: la constitución no exige umbral; se ofrece `npm run test:coverage` como información, sin bloquear.

## R7. Flujo de ramas para esta historia

- **Decision**: trabajar en la rama `001-linea-base-quality-gate` y abrir un PR hacia `main`. Antes de integrar, el PR muestra el check de la US2 en verde. Cada commit, el push y la creación del PR se autorizan por separado (Principio V).
- **Rationale**: es la forma de demostrar la US2 (escenario "propuesto para integrarse"), y deja la revisión del cambio en un solo lugar.
- **Alternatives considered**: trabajar directo en `main`: más simple, pero solo prueba el disparador de `push` y no el de PR.

## R8. Verificar que las pruebas detectan regresiones (SC-003)

- **Decision**: una tabla de "mutaciones deliberadas" en `quickstart.md`: un cambio pequeño por área y la prueba que debe fallar. Se ejecuta a mano una vez al cerrar la historia y el resultado se anota en Jira.
- **Rationale**: SC-003 se verifica una vez; automatizar *mutation testing* (Stryker, etc.) agrega dependencias y tiempo sin beneficio en esta etapa (Principio II).
- **Alternatives considered**: mutation testing automático en CI, descartado por costo y dependencias.

## R9. PC, celulares e iPad (FR-030a, FR-039, SC-007)

- **Decision**: en esta historia, tres niveles. (1) Revisión de la línea base con emulación de ancho en Chrome (375 px y 805 px), ya hecha el 2026-10-24: no hay desbordamiento horizontal y hay 4 brechas táctiles (ver Contexto de la spec). (2) Pruebas automáticas **pendientes** (`{ todo: 'GAMES-2' }` de `node:test`) que revisan `quiz.css` de forma estática: letra de al menos 16 px en campos y listas, y alto mínimo de 44 px en controles táctiles. (3) Un recorrido manual en iPhone, iPad, Android y PC reales, sirviendo el juego en la red local.
- **Rationale**: verificado que una prueba `todo` que falla se reporta como pendiente y el comando termina con código 0, así que documenta la brecha sin romper el gate. GAMES-2 quita el `todo` al corregirla, y desde ahí la prueba protege el arreglo. La revisión estática de CSS no necesita navegador, así que mantiene la suite sin dependencias (Principio II).
- **Alternatives considered**: (a) Un navegador headless (Playwright) para medir el layout real: es una dependencia pesada (descarga navegadores) y sigue sin ser Safari de iOS. Se puede reconsiderar en GAMES-2 si la revisión estática se queda corta. (b) Corregir las brechas en esta historia: el usuario lo descartó (clarificación del 2026-10-24) para mantener GAMES-1 como red de seguridad sin cambios visibles.
