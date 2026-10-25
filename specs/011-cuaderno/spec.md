# Feature Specification: Cuaderno con revisión de gramática y sugerencias

**Feature Branch**: `011-cuaderno`

**Created**: 2026-10-25

**Status**: Draft

**Jira**: GAMES-13 (Historia) · **Modo de ejecución**: continuo (solo se pide autorización para commit, push, PR y merge)

**Input**: User description: "agrega la siguiente funcionalidad es una nueva opcion en el menu, el objetivo de esta opcion es que el alumno pueda escribir libremente como si fuera el cuaderno y despues la aplicacion le revise la sintaxis y le haga sugerencias"

## Clarifications

### Session 2026-10-25

- Q: ¿Con qué se revisa el texto? → A: **c**. Primero las reglas escritas dentro del juego (sin internet, sin que el texto salga del equipo) y, si hay internet, también el revisor público LanguageTool, con un aviso de que el texto se envía para revisarlo.
- Q: ¿Se guarda lo que escribe el alumno? → A: **a**. Sí, en el navegador del equipo, como páginas del cuaderno con su fecha, para seguir después.
- Q: ¿Se puede imprimir? → A: **a**. Sí: el texto con los errores marcados y las sugerencias, para entregarlo a la maestra.

## Contexto y decisiones de diseño

- **Situación actual**: la guía Writing revisa criterios de una tarea fija (saludo, número de palabras…), pero no la gramática de lo que el alumno escribe libremente.
- **Revisor en línea**: la API pública de LanguageTool funciona desde el navegador sin clave. En una prueba encontró "she play" e "i", pero no "Yesterday I go"; por eso las reglas del juego cubren los errores típicos de primaria y LanguageTool agrega ortografía y otros casos. Límites: 20 revisiones por minuto y 20 KB por texto.
- **Privacidad**: los alumnos son menores. La revisión en línea se puede apagar con una casilla, que se recuerda, y junto al botón se avisa que el texto se envía a languagetool.org. Con la casilla apagada, nada sale del equipo.
- **Idioma**: la pantalla y los mensajes van en inglés sencillo, como el resto del juego.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escribir y revisar con las reglas del juego (Priority: P1) 🎯 MVP

Como alumno, quiero abrir "My Notebook" desde el menú, escribir libremente en inglés y, con un botón, ver mis errores marcados en el texto con una explicación sencilla y la corrección sugerida, para aprender de mis errores.

**Why this priority**: es el objetivo de la petición y funciona sin internet.

**Independent Test**: sin internet, escribir "yesterday i go to the park and she play with a orange ball" y revisar: se marcan *yesterday* (mayúscula), *i*, *go* → *went*, *play* → *played*, *a* → *an* y el punto final, cada uno con su explicación.

**Acceptance Scenarios**:

1. **Given** el menú, **When** el alumno elige "📓 My Notebook", **Then** ve una página en blanco para escribir, con la fecha de hoy.
2. **Given** un texto con errores, **When** toca "✔ Check my writing", **Then** cada error aparece resaltado y numerado en el texto, y debajo una lista con el número, lo que escribió, la explicación y la sugerencia.
3. **Given** una sugerencia, **When** toca "Use this", **Then** el texto se corrige en ese lugar y la marca desaparece; las demás marcas siguen en su lugar.
4. **Given** un texto sin errores, **Then** Anya-chan lo felicita ("No mistakes found").
5. **Given** un texto vacío, **Then** se le pide escribir algo primero.

### User Story 2 - Revisión en línea con LanguageTool (Priority: P2)

Como alumno, quiero que, si hay internet, la revisión también encuentre errores de ortografía y otros que las reglas del juego no conocen.

**Why this priority**: amplía mucho lo que se detecta, pero depende de internet y de un servicio externo.

**Independent Test**: con internet y la casilla "Also check online" encendida, escribir "I like playing footbal" y revisar: aparece la sugerencia *football* marcada como revisión en línea.

**Acceptance Scenarios**:

1. **Given** la casilla encendida, **Then** junto al botón se lee que el texto se envía a languagetool.org para revisarlo.
2. **Given** que LanguageTool y el juego marcan el mismo lugar, **Then** se muestra una sola marca (la del juego).
3. **Given** que no hay internet o LanguageTool está ocupado, **Then** se muestran los errores del juego y un aviso de que la revisión en línea no estuvo disponible.
4. **Given** la casilla apagada, **Then** no se hace ninguna petición a internet.

### User Story 3 - Páginas guardadas del cuaderno (Priority: P2)

Como alumno, quiero que mis páginas se guarden solas en el equipo, con su fecha, para seguir otro día o ver lo que escribí antes.

**Independent Test**: escribir una página, recargar el juego y abrir "My Notebook": la página sigue ahí. Crear una página nueva y volver a la anterior desde la lista.

**Acceptance Scenarios**:

1. **Given** que el alumno escribe, **Then** la página se guarda sola, sin botón.
2. **Given** varias páginas, **Then** una lista las muestra con su fecha y su título (o el inicio del texto), de la más nueva a la más vieja.
3. **When** toca "➕ New page", **Then** se crea una página en blanco con la fecha de hoy.
4. **When** toca "🗑 Delete page" y lo confirma con un segundo toque, **Then** la página se borra.
5. **Given** un navegador que no permite guardar (modo privado), **Then** el cuaderno funciona igual y avisa que las páginas no se guardarán.

### User Story 4 - Imprimir la página revisada (Priority: P3)

Como alumno, quiero imprimir mi página con los errores marcados y las sugerencias, para entregarla a la maestra.

**Independent Test**: revisar una página con errores y tocar "🖨 Print": la hoja muestra el nombre, la fecha, el título, el texto con los errores numerados y la lista de sugerencias, sin nada de la pantalla.

**Acceptance Scenarios**:

1. **Given** una página revisada, **Then** la hoja impresa trae nombre, fecha, título, texto con marcas numeradas y la lista de sugerencias.
2. **Given** que el texto cambió después de la última revisión, **When** imprime, **Then** se revisa de nuevo con las reglas del juego antes de imprimir, y la hoja dice qué revisión se usó.
3. **Given** una página sin errores, **Then** la hoja lo dice ("No mistakes found").

### Edge Cases

- **Frases correctas**: las reglas del juego no deben marcar oraciones correctas: preguntas ("Does she play?"), modales ("She can play"), *I'm / I've*, *an hour*, *a university*, *If I were*.
- **Texto largo**: la página admite hasta 5,000 caracteres, dentro del límite de LanguageTool.
- **Sugerencias en línea**: se muestran como máximo 3 por error y se descartan las que tengan palabras inapropiadas para niños.
- **Saltos de línea**: se conservan al marcar e imprimir el texto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El menú DEBE tener una opción "📓 My Notebook" que abre la pantalla del cuaderno.
- **FR-002**: El cuaderno DEBE tener un área de escritura libre (hasta 5,000 caracteres), un título opcional, la fecha de la página y el número de palabras.
- **FR-003**: "✔ Check my writing" DEBE revisar el texto con las reglas del juego, sin internet. Como mínimo: *I* mayúscula; mayúscula al inicio de oración; punto, signo de interrogación o de exclamación al final; *a / an*; *-s* de *he / she / it* y verbo sin *-s* con *I / you / we / they*; *don't / doesn't*; *am / is / are* y *was / were* con su sujeto; pasado simple con *yesterday, ago, last…*; verbo en forma base después de *did / didn't / does / doesn't / can / will…*; palabra repetida.
- **FR-004**: Cada error DEBE mostrar lo que escribió el alumno, una explicación en inglés sencillo y al menos una sugerencia, y quedar resaltado y numerado en el texto.
- **FR-005**: "Use this" DEBE aplicar la sugerencia en el texto, quitar esa marca y mantener las demás en su lugar.
- **FR-006**: Si la casilla "Also check online" está encendida, la revisión DEBE consultar también LanguageTool, avisar que el texto se envía a languagetool.org y combinar sus errores con los del juego sin marcas repetidas en el mismo lugar.
- **FR-007**: Si LanguageTool falla, está ocupado o no hay internet, DEBEN mostrarse los errores del juego y un aviso. Con la casilla apagada, NO DEBE hacerse ninguna petición.
- **FR-008**: Las páginas DEBEN guardarse solas en el navegador del equipo con fecha, título y texto, y listarse de la más nueva a la más vieja; se puede crear una nueva y borrar una con doble confirmación.
- **FR-009**: Si el navegador no permite guardar, el cuaderno DEBE funcionar igual y avisarlo.
- **FR-010**: "🖨 Print" DEBE imprimir nombre, fecha, título, texto con errores numerados y la lista de sugerencias, con el mismo estilo de hoja que el resto del juego, en Chrome y Safari.
- **FR-011**: Las reglas del juego NO DEBEN marcar las oraciones correctas del juego (ejemplos de las tarjetas de gramática, ejemplos de los verbos y la carta de la demo Writing).
- **FR-012**: No cambian las guías ni las tarjetas (la huella de GAMES-1 sigue igual); los archivos nuevos y modificados llevan su versión (GAMES-5); el juego sigue abriendo con doble clic.

### Key Entities

- **Página del cuaderno**: id, fecha de creación, fecha de cambio, título, texto.
- **Error encontrado**: inicio y fin en el texto, regla, tipo (gramática, ortografía, puntuación), explicación, sugerencias, origen (juego o LanguageTool).

## Success Criteria *(mandatory)*

- **SC-001**: Con 20 oraciones con errores típicos de primaria, las reglas del juego encuentran el error esperado en todas.
- **SC-002**: Con todas las oraciones correctas del juego (FR-011), las reglas del juego no marcan ninguna.
- **SC-003**: Sin internet, la revisión muestra resultados al instante; con internet, en menos de 3 segundos.
- **SC-004**: Una página escrita sigue ahí al recargar el juego.
- **SC-005**: La hoja impresa se ve completa en Chrome y en WebKit, sin nada de la pantalla.
- **SC-006**: `npm test` en verde y la huella de GAMES-1 sin cambios.

## Assumptions

- El cuaderno es de un solo alumno por equipo; no hay cuentas ni envío a la maestra por internet.
- La revisión no califica: no da puntos ni promedio.
- LanguageTool se usa en su versión pública gratuita, en inglés de Estados Unidos (`en-US`).
