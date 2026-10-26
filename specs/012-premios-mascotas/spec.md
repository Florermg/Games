# Feature Specification: Premios de accesorios para las mascotas

**Feature Branch**: `012-premios-mascotas`

**Created**: 2026-10-25

**Status**: Draft

**Jira**: GAMES-14 (Historia) · **Modo de ejecución**: continuo (solo se pide autorización para commit, push, PR y merge)

**Input**: User description: "por cada test que termine con 100% aprobatorio vamos a darle un premio, estos premios son accesorios para las mascotas, gatito y perrito, pueden ser por ejemplo collares, correas, ropa de temporada (se acerca Día de Muertos y Halloween), sombreros, lentes, corbatas, zapatitos y que tengas la posibilidad de ir poniéndoselos, estos se deben de guardar para que en futuras sesiones puedan usarlos" + "como el usuario va a querer ponerle los accesorios a la mascota, te sugiero una sección nueva".

## Clarifications

### Session 2026-10-25

- Q: ¿Qué cuenta como "100%"? → A: **b**. Solo las guías **generadas** (incluida Listening) terminadas con todo correcto. Las demos no dan premio, porque siempre son iguales.
- Q: ¿Se gana un premio cada vez, aunque se repita la misma guía? → A: **a**. Un premio por cada guía distinta; repetir la misma guía ("Try This Guide Again") no da otro.
- Q: ¿Los premios son de cada alumno o del equipo? → A: **a**. De cada alumno, según el nombre que escribe en el menú.
- Q: ¿Cómo se elige el premio? → A: **a**. Sorpresa al azar entre los que todavía no tiene; en temporada, los de esa temporada salen más seguido. Lo ganado se queda para siempre.
- Sugerencia del usuario: una sección nueva en el menú para ponerle los accesorios a las mascotas → **🐾 My Pets**.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ganar un accesorio con una guía perfecta (Priority: P1) 🎯 MVP

Como alumno, cuando termino una guía generada con todo correcto, quiero ganar un accesorio sorpresa para el gatito o el perrito, para tener una razón más para esforzarme.

**Why this priority**: es el corazón de la petición.

**Independent Test**: generar una guía, contestarla toda bien y terminarla: la pantalla de resultados muestra "🎁 You won…" con el dibujo y el nombre del accesorio, y queda guardado.

**Acceptance Scenarios**:

1. **Given** una guía generada con 100%, **When** el alumno termina, **Then** ve el premio con su dibujo y su nombre y un botón para ir a **My Pets**.
2. **Given** una demo con 100%, **Then** no hay premio, y se le invita a generar una guía nueva para ganar uno.
3. **Given** la misma guía repetida con "Try This Guide Again" y otra vez 100%, **Then** no hay un segundo premio, y se le dice que ya ganó el de esa guía.
4. **Given** una guía con menos de 100%, **Then** no hay premio, y se le dice cuántos puntos le faltaron.
5. **Given** que ya tiene todos los accesorios disponibles hoy, **Then** se le felicita sin premio nuevo.
6. **Given** que no escribió su nombre, **Then** el premio se guarda para "Guest" y se le sugiere escribir su nombre para guardar sus premios.

### User Story 2 - Vestir a las mascotas en "My Pets" (Priority: P1)

Como alumno, quiero una sección **🐾 My Pets** donde veo a mis dos mascotas en grande y mis accesorios, para ponérselos y quitárselos.

**Independent Test**: con algunos accesorios ganados, abrir My Pets, elegir el gatito, tocar un sombrero: el gatito lo trae puesto en la pantalla y también abajo de la ventana; tocarlo otra vez se lo quita.

**Acceptance Scenarios**:

1. **Given** My Pets, **Then** se ven el gatito y el perrito en grande, cada uno con lo que trae puesto, y la lista de accesorios ganados, con el número de los que faltan por ganar.
2. **When** elige una mascota y toca un accesorio, **Then** se lo pone; si en esa parte del cuerpo ya traía otro, lo cambia.
3. **When** toca un accesorio que ya trae puesto, **Then** se lo quita.
4. **When** toca "Take everything off", **Then** esa mascota queda sin accesorios.
5. **Given** un accesorio, **Then** se puede poner al gatito, al perrito o a los dos (cada uno trae su propio conjunto).
6. **Given** que el alumno sin premios abre My Pets, **Then** se le explica cómo ganar el primero.

### User Story 3 - Lo ganado y lo puesto se queda para otras sesiones (Priority: P1)

**Independent Test**: ganar un accesorio, ponérselo al perrito, recargar el juego y escribir el mismo nombre: el perrito lo trae puesto y el accesorio sigue en la lista.

**Acceptance Scenarios**:

1. **Given** un accesorio ganado y puesto, **When** se recarga el juego con el mismo nombre, **Then** sigue ganado y puesto.
2. **Given** dos alumnos en el mismo equipo, **When** cambia el nombre del menú, **Then** las mascotas se visten con lo del alumno de ese nombre.
3. **Given** un navegador que no deja guardar, **Then** todo funciona en la sesión y se avisa que los premios no se guardarán.

### User Story 4 - Accesorios de temporada (Priority: P2)

Como alumno, quiero que en Día de Muertos, Halloween, Navidad, las fiestas patrias, primavera, verano o invierno salgan accesorios de esa temporada.

**Acceptance Scenarios**:

1. **Given** que hoy es 25 de octubre, **Then** los premios posibles incluyen los de Día de Muertos y Halloween, y salen más seguido que los de todo el año.
2. **Given** un accesorio de temporada ya ganado, **Then** se puede usar todo el año.
3. **Given** un accesorio de temporada no ganado, fuera de su temporada, **Then** no sale como premio, y en My Pets se ve como "comes back in <temporada>".

### Edge Cases

- **Nombre con mayúsculas o espacios**: "Ana", " ana " y "ANA" son el mismo alumno.
- **Guía Writing**: cuenta si su calificación es completa (todos los criterios).
- **Accesorios por parte del cuerpo**: cabeza, ojos, cuello, cuerpo y patas; uno por parte en cada mascota.
- **Imágenes propias de las mascotas** (GAMES-9, `English/img/`): los accesorios solo se dibujan sobre las mascotas dibujadas; con una imagen propia, My Pets lo avisa.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Al terminar una guía **generada** con puntaje igual al máximo, el juego DEBE dar un accesorio que el alumno no tenga, elegido al azar entre los disponibles hoy, y mostrarlo en los resultados con su dibujo y su nombre.
- **FR-002**: Las demos NO DEBEN dar premio; una guía ya premiada para ese alumno NO DEBE dar otro.
- **FR-003**: El catálogo DEBE tener al menos 30 accesorios hechos a mano, para cabeza (sombreros, gorras, coronas), ojos (lentes), cuello (collares, correa, corbata, moño, pañoleta), cuerpo (ropa, capas, disfraces) y patas (zapatitos, botas), que se vean bien en las dos mascotas.
- **FR-004**: Al menos 12 accesorios DEBEN ser de temporada (Día de Muertos, Halloween, Navidad, fiestas patrias, primavera, verano e invierno). Solo salen como premio en su temporada, con el triple de probabilidad que uno de todo el año.
- **FR-005**: Los premios DEBEN guardarse por alumno (nombre normalizado), con la fecha en que se ganaron, en el navegador del equipo.
- **FR-006**: El menú DEBE tener **🐾 My Pets**: las dos mascotas en grande, la lista de accesorios ganados y los que faltan, y elegir mascota y accesorio para ponerlo o quitarlo, con uno por parte del cuerpo.
- **FR-007**: Lo que trae puesta cada mascota DEBE guardarse por alumno y verse también en las mascotas de abajo de la ventana (GAMES-9).
- **FR-008**: Si el navegador no deja guardar, todo DEBE funcionar en la sesión y avisarlo.
- **FR-009**: No cambian las guías, las tarjetas, el cuaderno ni el resto del juego (la huella de GAMES-1 sigue igual); los archivos llevan su versión (GAMES-5); el juego sigue abriendo con doble clic y sin descargas.

### Key Entities

- **Accesorio**: id, nombre en inglés, parte del cuerpo, temporada (o de todo el año) y su dibujo.
- **Colección de un alumno**: nombre, accesorios ganados (con fecha), guías ya premiadas y lo que trae puesto cada mascota.

## Success Criteria *(mandatory)*

- **SC-001**: Una guía generada con 100% da un premio en el 100% de los casos mientras queden accesorios disponibles; una demo o una guía repetida, nunca.
- **SC-002**: En 1,000 sorteos simulados el 25 de octubre, cada accesorio de temporada sale en promedio el triple de veces que uno de todo el año.
- **SC-003**: Un accesorio ganado y puesto sigue igual al recargar el juego.
- **SC-004**: Los 30 o más accesorios se ven bien puestos en las dos mascotas (revisión a ojo de una hoja con todas las combinaciones).
- **SC-005**: `npm test` en verde; huella de GAMES-1 sin cambios; 390 px sin scroll horizontal.

## Assumptions

- Las temporadas se calculan con la fecha del equipo, para México (hemisferio norte).
- Los nombres de los accesorios van en inglés, como el resto del juego (*Witch hat*, *Marigold crown*).
- No hay intercambio de premios entre alumnos ni respaldo en internet.
