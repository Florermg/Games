# Feature Specification: Avatares 3D de un gatito negro y un pastor alemán en las orillas de la pantalla

**Feature Branch**: `007-avatares-mascotas`

**Created**: 2026-10-24

**Status**: Draft

**Jira**: GAMES-9 (Historia) · **Modo de ejecución**: `in-all-process`

**Input**: User description: "puedes colocar en las orillas de la pantalla un avatar de un perrito y de un gato en 3d, un gatito negro y un pastor alemán de perrito"

## Contexto y decisiones de diseño

- **Situación actual**: el juego tiene una tutora (Anya-chan, un emoji con globo de diálogo) arriba, y la hoja de trabajo centrada (máximo 900 px). En PC y en iPad horizontal quedan orillas vacías a los lados.
- **Decisiones del usuario**:
  - **Estilo**: ilustraciones con aspecto 3D, con volumen, sombras y brillo, y una animación suave. Se dibujan dentro del juego, sin archivos ni librerías nuevas, así que funcionan sin internet y con doble clic (Principio II).
  - **Reemplazo por imágenes**: el juego queda listo para usar imágenes 3D que el usuario proporcione. Si existe la imagen de una mascota, se muestra esa; si no, la ilustración.
  - **Celular**: las mascotas se hacen más chicas y se colocan en las esquinas de abajo, sin tapar botones ni texto. En PC y iPad van a los lados de la hoja.
  - **Interacción**: parpadean y mueven la cola. Al tocarlas dan un saltito y la tutora dice una frase corta en inglés. No se imprimen.
  - Modo `in-all-process`.

## Clarifications

### Session 2026-10-24

- Q: ¿Al tocar al gatito o al perrito, también deben hacer un sonido (maullido o ladrido), o solo el saltito y la frase de la tutora? → A: Sin sonido: solo el saltito y la frase en el globo de la tutora.
- Q: ¿El maestro o el alumno deben poder ocultar a las mascotas (por ejemplo, durante un examen o si distraen)? → A: Sí, con un botón "Hide / Show pets" que vuelve a "visibles" cada vez que se abre el juego (no se guarda).
- Q: (Observación del usuario) La página casi siempre tiene scroll; si las mascotas van al final de la página casi nunca se verán. ¿Dónde van? → A: Siempre visibles en la pantalla: fijas en la ventana, no al final de la página, y en el mismo lugar sin importar cuánto se haga scroll.
- Q: ¿De qué tamaño deben verse las mascotas en PC y iPad horizontal? → A: Medianas, ~120 px; van a los lados desde 1160 px de ancho de ventana. En pantallas más angostas, van en la franja inferior.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver al gatito y al perrito en las orillas (Priority: P1) 🎯 MVP

Como alumno, quiero ver un gatito negro en una orilla de la pantalla y un perrito pastor alemán en la otra, con aspecto 3D y moviéndose un poco, para que el juego se sienta amigable mientras estudio.

**Why this priority**: es el pedido principal.

**Independent Test**: abrir el juego en PC: el gatito negro aparece a un lado de la hoja y el pastor alemán al otro, con volumen y animados, sin tapar nada. Navegar por el menú, una guía, Grammar y Verbs: siguen ahí. Abrir en celular: aparecen más chicos en las esquinas de abajo y no tapan botones ni texto.

**Acceptance Scenarios**:

1. **Given** una pantalla de PC o de iPad horizontal, **Then** el gatito negro se ve en una orilla y el pastor alemán en la otra, fuera de la hoja de trabajo.
2. **Given** las mascotas en pantalla, **Then** tienen aspecto de figura 3D (volumen, sombra y brillo) y una animación suave: parpadean y mueven la cola.
3. **Given** un celular o una pantalla angosta, **Then** las mascotas se ven más chicas en las esquinas de abajo y no tapan botones, campos ni texto de la hoja. El alumno puede tocar todo lo que tocaba antes.
4. **Given** cualquier pantalla del juego (menú, guías, resultados, Grammar, Verbs), **When** el alumno hace scroll hasta cualquier parte de la página, **Then** las mascotas siguen visibles en el mismo lugar de la ventana.
5. **Given** que el sistema tiene activada la opción de reducir movimiento, **Then** las mascotas se ven sin animación.
6. **Given** las mascotas visibles, **When** se toca "🐾 Hide pets", **Then** las dos se ocultan (y en celular, también su franja) y el botón cambia a "🐾 Show pets". Al recargar la página, vuelven a verse.

---

### User Story 2 - Tocar a las mascotas (Priority: P2)

Como alumno, quiero tocar al gatito o al perrito y que reaccionen, para divertirme un momento sin salir de la guía.

**Why this priority**: agrega diversión; la US1 ya cumple el pedido visual.

**Independent Test**: tocar al gatito: da un saltito y la tutora dice una frase de gato. Tocar al perro: lo mismo, con una frase de perro. La guía abierta no cambia.

**Acceptance Scenarios**:

1. **Given** el gatito, **When** se toca o se le da clic, **Then** da un saltito y la tutora dice una frase corta en inglés de gato (por ejemplo "Meow! Keep going!").
2. **Given** el perrito, **When** se toca, **Then** da un saltito y la tutora dice una frase corta en inglés de perro (por ejemplo "Woof! Great job!").
3. **Given** que se tocan varias veces, **Then** las frases van cambiando entre varias opciones.
4. **Given** una guía con respuestas a medias, **When** se toca una mascota, **Then** las respuestas, la calificación y la pantalla no cambian.
5. **Given** un teclado, **Then** las mascotas se pueden activar con Tab y Enter, y tienen un nombre accesible ("Black kitten", "German shepherd puppy").

---

### User Story 3 - Usar imágenes 3D propias (Priority: P3)

Como responsable del juego, quiero poder poner mis propias imágenes 3D del gatito y del perrito, para cambiar el aspecto sin tocar el código.

**Why this priority**: es opcional; sin imágenes, las ilustraciones de la US1 ya cumplen.

**Independent Test**: colocar una imagen del gato en la ubicación documentada y abrir el juego: se ve la imagen en lugar de la ilustración, con la misma posición, animación e interacción. Quitarla: vuelve la ilustración, sin errores.

**Acceptance Scenarios**:

1. **Given** que existe la imagen de una mascota en la ubicación documentada, **Then** se muestra esa imagen en lugar de la ilustración.
2. **Given** que no existe, o no carga, **Then** se muestra la ilustración, sin mensajes de error visibles para el alumno.
3. **Given** que se agrega o cambia una imagen, **When** se publica siguiendo el procedimiento del README, **Then** los navegadores que ya habían abierto el juego ven la imagen nueva (como con la versión de GAMES-5).

### Edge Cases

- **Impresión**: las mascotas nunca aparecen en el papel (guías, claves ni tarjetas).
- **Tutora**: su globo de diálogo sigue arriba y no queda tapado por las mascotas.
- **Pantalla mediana** (por ejemplo, iPad vertical): si no hay espacio a los lados, se usa la disposición de celular.
- **Sin internet / doble clic**: las ilustraciones se ven igual.
- **Lectores de pantalla**: las mascotas no interrumpen la lectura de la hoja; son botones con nombre.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El juego DEBE mostrar un gatito negro y un perrito pastor alemán con aspecto 3D (volumen, sombras y brillo), uno en cada orilla de la pantalla, en todas sus pantallas.
- **FR-002**: Las mascotas DEBEN dibujarse dentro del juego, sin archivos externos ni librerías nuevas, y verse igual sin internet y con doble clic.
- **FR-003**: Las mascotas DEBEN tener una animación suave en reposo (parpadeo y movimiento de cola), y quedarse quietas si el sistema pide reducir el movimiento.
- **FR-004**: Las mascotas DEBEN estar **siempre visibles en la pantalla**: fijas en la ventana, en el mismo lugar sin importar cuánto se haga scroll, y nunca colocadas al final de la página. En ventanas de 1160 px de ancho o más, miden alrededor de 120 px y se ubican en las esquinas de abajo de la ventana, fuera de la hoja. En pantallas angostas se reducen y van en una franja fija al pie de la ventana, sin tapar controles ni texto de la hoja: la página deja al final el espacio de la franja, para que el último botón se pueda subir por encima de ella.
- **FR-005**: Al tocar o hacer clic en una mascota, DEBE dar un saltito y la tutora DEBE decir una frase corta en inglés, apta para niños y propia de esa mascota, elegida entre al menos 4 frases por mascota. La reacción es **silenciosa**: no reproduce sonido ni voz. No DEBE cambiar respuestas, calificaciones ni la pantalla abierta.
- **FR-006**: Las mascotas DEBEN poder usarse con teclado y tener un nombre accesible.
- **FR-006a**: DEBE existir un botón "🐾 Hide pets" / "🐾 Show pets", siempre visible, que oculta y vuelve a mostrar a las dos mascotas. Al abrir o recargar el juego, las mascotas DEBEN estar visibles; la elección no se guarda. El botón tampoco se imprime.
- **FR-007**: Las mascotas NO DEBEN aparecer en ninguna impresión.
- **FR-008**: Si existe una imagen propia de una mascota en la ubicación documentada, el juego DEBE mostrarla en lugar de la ilustración. Si no existe o no carga, DEBE mostrar la ilustración sin errores visibles.
- **FR-009**: Las imágenes propias DEBEN quedar cubiertas por el mecanismo de versión de GAMES-5, para que una imagen nueva llegue a los navegadores que ya abrieron el juego. Su ubicación y formato DEBEN documentarse en el README.
- **FR-010**: Las guías no cambian: la huella del recorrido de GAMES-1 sigue igual. Pruebas automáticas DEBEN cubrir:
  - que las mascotas existen, con nombre accesible y frases;
  - que se ocultan al imprimir;
  - que una imagen faltante usa la ilustración.

### Key Entities

- **Mascota**: identificador (gato, perro), nombre accesible, ilustración, imagen propia opcional y frases.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En PC (1280 px o más) las dos mascotas se ven completas fuera de la hoja, y en celular (390 px) no se superponen a ningún botón, campo o texto de la hoja. En los dos casos, las mascotas están en la misma posición de la ventana al inicio, a la mitad y al final de una guía larga: el 100% del tiempo están a la vista.
- **SC-002**: El 100% de las impresiones (guías, claves y tarjetas) sale sin mascotas.
- **SC-003**: Tocar una mascota muestra la reacción y la frase en menos de medio segundo, y no cambia el estado de la guía.
- **SC-004**: La huella del recorrido de GAMES-1 no cambia (`f1 b9 82 7e 2c 76`), y las validaciones de PDF de GAMES-3 y de GAMES-6 siguen en "All checks passed".
- **SC-005**: Con una imagen propia colocada, se muestra en la siguiente visita normal (sin recargar a la fuerza) después de publicar.

## Assumptions

- "3D" se entiende como **aspecto** 3D (volumen, sombras, brillo), no como un modelo que se puede girar. Un modelo 3D real requeriría una librería externa (descartado por el usuario).
- El gatito es negro con ojos claros y el perro es un pastor alemán cachorro (orejas paradas, manto negro y café), ambos en estilo caricatura amigable.
- Las imágenes propias, si se usan, son del usuario o tienen permiso de uso; el juego no las descarga de internet.
- La tutora Anya-chan sigue siendo quien da los mensajes; las mascotas solo le pasan su frase.
