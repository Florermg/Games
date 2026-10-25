# Feature Specification: Versión de los archivos para que cada publicación llegue a todos los navegadores

**Feature Branch**: `003-cache-versionada`

**Created**: 2026-10-24

**Status**: Draft

**Jira**: GAMES-5 (Error) · **Modo de ejecución**: `in-all-process`

**Input**: User description: "Romper la caché de los archivos del juego de inglés al publicar una versión nueva (bug de producción en https://nutritrack.mx/quiz/QuizA.html). Modo de ejecución: in-all-process. Problema: el servidor entrega QuizA.html sin caché (max-age=0) pero los .js y el .css con max-age=2678400 (31 días); un navegador que ya había abierto el juego carga el HTML nuevo con los scripts viejos de su caché. Verificado en Chrome: el botón Print falla con "togglePrintPanel is not defined" porque engine.js viene de la caché; en Safari funciona. Solución elegida por el usuario: que QuizA.html pida cada archivo .js y .css con una versión en la URL (por ejemplo js/engine.js?v=...), de modo que al publicar una versión nueva todos los navegadores descarguen los archivos nuevos aunque tengan caché, sin depender de la configuración del servidor. Debe existir una prueba automática que falle si un archivo cambia sin actualizar su versión, y el procedimiento de publicación debe quedar documentado. El juego debe seguir abriendo con doble clic."

## Contexto y decisiones de diseño

- **Origen**: bug en producción, reportado por el usuario el 2026-10-24 después de publicar GAMES-3. En `https://nutritrack.mx/quiz/QuizA.html`, el botón 🖨 Print no hace nada en Chrome y en Safari sí funciona.
- **Causa verificada**, no supuesta:
  - Los 9 archivos publicados son idénticos byte a byte a los de `main`, así que el despliegue está bien.
  - El servidor entrega `QuizA.html` con caché de 0 segundos, pero los archivos de código y de estilos con caché de 31 días.
  - En el Chrome afectado, los 8 archivos de código y estilos se cargaron desde la caché del navegador. La página nueva llamaba a funciones que el `engine.js` guardado no tiene (`togglePrintPanel is not defined`). Safari no tenía la versión anterior guardada.
- **Alcance del problema**: no es exclusivo de la impresión. Cualquier publicación futura que cambie un archivo de código o de estilos repite el problema, hasta por 31 días, en cada dispositivo que ya haya abierto el juego. Ese dispositivo queda con una mezcla de página nueva y código viejo, con fallas impredecibles.
- **Actualización tras GAMES-6** (2026-10-24): GAMES-6 se integró en `main` antes que esta historia y agregó 4 archivos de código (`verbs-data.js`, `conjugation.js`, `grammar-cards.js`, `reference.js`). La página pide ahora 12 archivos propios: 1 de estilos y 11 de código. Los requisitos aplican a todos sin cambios. Publicar GAMES-6 sin esta historia repetiría el bug en las pantallas nuevas.
- **Decisión del usuario**: resolverlo en el propio juego, sin depender de la configuración del servidor. La página pide cada archivo con una versión en su dirección, y una versión nueva obliga a todos los navegadores a descargarlo de nuevo. Cambiar la caché del servidor queda fuera de alcance.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Después de una publicación, todos ven la versión nueva (Priority: P1) 🎯 MVP

Como maestra o alumno que ya había abierto el juego antes, quiero que al entrar después de una publicación funcione la versión nueva completa, sin tener que borrar la caché ni saber qué es, para que los botones nuevos (como 🖨 Print) funcionen desde el primer momento.

**Why this priority**: es el bug de producción. Hoy, quien ya usaba el juego no puede imprimir, y la siguiente publicación volverá a romper algo.

**Independent Test**: en un navegador que tenga guardada la versión anterior de los archivos (como el Chrome donde se reprodujo el bug), abrir la página publicada con la versión nueva, sin recargar a la fuerza, y comprobar que 🖨 Print funciona y la consola no muestra errores.

**Acceptance Scenarios**:

1. **Given** un navegador con los archivos de la versión anterior en su caché, **When** abre la página después de publicar una versión nueva, **Then** descarga los archivos que cambiaron, y la página y sus archivos son de la misma versión.
2. **Given** ese mismo navegador, **When** la maestra usa 🖨 Print en una guía, **Then** se abre la impresión, sin el error `togglePrintPanel is not defined`.
3. **Given** que no hubo una publicación nueva, **When** el alumno vuelve a abrir el juego, **Then** el navegador puede seguir usando sus archivos guardados (no se pierde la ventaja de la caché).

---

### User Story 2 - No se puede publicar un cambio sin su versión (Priority: P2)

Como responsable del proyecto, quiero que las pruebas automáticas fallen si alguien cambia un archivo de código o de estilos y olvida actualizar su versión, para que el problema no vuelva a llegar a producción por un descuido.

**Why this priority**: la US1 arregla el problema una vez; esta lo previene en cada publicación futura (Principio IV).

**Independent Test**: cambiar una línea de un archivo de código sin tocar su versión y comprobar que `npm test` falla y dice qué archivo necesita versión nueva; actualizar la versión y comprobar que pasa.

**Acceptance Scenarios**:

1. **Given** un archivo de código o de estilos modificado y la versión sin actualizar, **When** se ejecutan las pruebas, **Then** fallan e indican el archivo afectado y cómo actualizar su versión.
2. **Given** la versión actualizada con el procedimiento documentado, **When** se ejecutan las pruebas, **Then** pasan.
3. **Given** que la página pide un archivo que no existe, o pide un archivo sin versión, **When** se ejecutan las pruebas, **Then** fallan.

---

### User Story 3 - Publicar siguiendo un procedimiento claro (Priority: P3)

Como persona que sube el juego al servidor, quiero un procedimiento corto y documentado para preparar y publicar una versión, para hacerlo siempre igual y saber qué archivos subir.

**Why this priority**: completa el ciclo. Con la US1 y la US2 el riesgo ya está controlado; esto lo vuelve repetible para cualquiera.

**Independent Test**: seguir el procedimiento del README desde un cambio hasta tener los archivos listos para subir, sin otra ayuda.

**Acceptance Scenarios**:

1. **Given** un cambio en el juego, **When** se sigue el procedimiento documentado, **Then** se actualizan las versiones con un solo comando, las pruebas pasan y queda claro qué archivos subir al servidor.

---

### Edge Cases

- **Abrir con doble clic** (sin servidor): la página debe cargar sus archivos igual que hoy (FR-006).
- **Archivo sin cambios entre publicaciones**: su versión no cambia, y el navegador puede seguir usando su copia guardada.
- **Navegador que ya tiene la página vieja abierta en una pestaña**: sigue con la versión que cargó hasta que recargue la pestaña. Al recargar, recibe la versión nueva completa.
- **La página misma (`QuizA.html`) en caché**: hoy el servidor no la guarda (0 segundos). Si en el futuro la guardara, esta solución no alcanza; queda documentado como supuesto.
- **Dispositivos afectados hoy**: los que ya tienen la mezcla vieja se corrigen solos con la primera publicación que incluya esta solución, porque la página nueva pide los archivos con una dirección que nunca vieron.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La página del juego DEBE pedir cada archivo de código y de estilos propio con un identificador de versión en su dirección.
- **FR-002**: El identificador de versión de un archivo DEBE cambiar cuando cambia el contenido de ese archivo, y NO DEBE cambiar cuando su contenido no cambia.
- **FR-003**: DEBE existir un solo comando documentado que actualiza los identificadores de versión de todos los archivos según su contenido actual.
- **FR-004**: Las pruebas automáticas (`npm test` y, por lo tanto, el quality gate de CI) DEBEN fallar si: un archivo cambió y su identificador no se actualizó; la página pide un archivo propio sin identificador; o la página pide un archivo que no existe. El mensaje de falla DEBE indicar el archivo y el comando para corregirlo.
- **FR-005**: Con los identificadores actualizados, el comportamiento del juego DEBE ser idéntico al actual: la huella del recorrido de GAMES-1 no cambia y la impresión de GAMES-3 funciona.
- **FR-006**: La página DEBE seguir abriéndose con doble clic, sin instalar nada (Principio II).
- **FR-007**: El README DEBE documentar el procedimiento de publicación: actualizar versiones, ejecutar las pruebas, qué archivos subir al servidor (los mismos de hoy) y cómo comprobar en el navegador que llegó la versión nueva.
- **FR-008**: El arreglo NO DEBE depender de la configuración de caché del servidor ni pedir cambios en él.

### Key Entities

- **Archivo versionado**: cada archivo de código o de estilos que la página pide, junto con su identificador de versión actual.
- **Identificador de versión**: un valor corto derivado del contenido del archivo, que va en la dirección con la que la página lo pide.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En el navegador donde se reprodujo el bug (Chrome con los archivos viejos en caché), después de publicar esta versión y sin recargar a la fuerza, 🖨 Print funciona y la consola tiene 0 errores.
- **SC-002**: El 100% de los archivos de código y de estilos que pide la página llevan identificador de versión.
- **SC-003**: Un cambio de una línea en cualquiera de esos archivos, sin actualizar versiones, hace fallar las pruebas en el 100% de los casos; tras correr el comando de actualización, pasan.
- **SC-004**: Una segunda visita sin publicación de por medio carga los archivos desde la caché del navegador (se conserva la ventaja de la caché).
- **SC-005**: La huella del recorrido de GAMES-1 es la misma que antes del cambio (`f1 b9 82 7e 2c 76`).

## Assumptions

- Los archivos que se suben al servidor siguen siendo los mismos de hoy (`QuizA.html`, `css/`, `js/`). La versión viaja en la dirección con la que se piden, no en el nombre del archivo, así que no hay archivos nuevos que subir.
- El servidor sigue entregando la página (`QuizA.html`) sin caché, como hoy (verificado: `max-age=0`). Si eso cambiara, haría falta otra medida (fuera de alcance).
- Publicar en el servidor de `nutritrack.mx` lo hace el usuario; esta historia no sube archivos al servidor.
- La validación en producción (SC-001) la hace el usuario después de publicar, o se hace en conjunto si el usuario lo pide.
