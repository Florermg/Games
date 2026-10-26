# Feature Specification: Ambiente según la hora, el clima y la estación

**Feature Branch**: `013-ambiente`

**Created**: 2026-10-25

**Status**: Draft

**Jira**: GAMES-15 (Historia) · **Modo de ejecución**: continuo (solo se pide autorización para commit, push, PR y merge)

**Input**: User description: "el programa debe adaptarse al ambiente, es decir si está de día muestras algo referente a esto y así para la tarde y la noche, además es importante que esto se combine con el clima actual y con la estación del año, es decir primavera, verano etc" + "no vemos como probar lo del clima".

## Clarifications

### Session 2026-10-25

- Q: ¿De dónde se toma la ubicación para el clima? → A: **c**. Primero se pide la ubicación al navegador; si no la da (permiso negado, sin soporte o página sin conexión segura), se usa la ciudad elegida en el juego. Si no han elegido ninguna, **Ciudad de México**.
- Q: ¿Cómo se prueba sin esperar a que anochezca o llueva? → Un **modo de prueba en la dirección**: `QuizA.html?ambiente=noche&clima=lluvia&estacion=invierno` muestra esa combinación (anunciado al usuario el 2026-10-25).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - El juego se ve de día, de tarde o de noche (Priority: P1) 🎯 MVP

Como alumno, quiero que el juego se vea distinto de mañana, de tarde y de noche, para que se sienta vivo.

**Independent Test**: abrir el juego a las 10:00, a las 15:00 y a las 21:00 (o con `?ambiente=dia|tarde|noche`): el cielo, el sol o la luna y las estrellas cambian.

**Acceptance Scenarios**:

1. **Given** entre las 6:00 y las 11:59, **Then** se ve el cielo de día con el sol.
2. **Given** entre las 12:00 y las 18:59, **Then** se ve el cielo de tarde con el sol bajo y tonos naranjas.
3. **Given** entre las 19:00 y las 5:59, **Then** se ve el cielo de noche con la luna y estrellas.
4. **Given** que el juego sigue abierto cuando cambia la hora, **Then** el ambiente cambia solo, sin recargar.
5. **Given** cualquier ambiente, **Then** las guías, las tarjetas y el cuaderno se leen igual de bien (siguen sobre fondo blanco).

### User Story 2 - El clima de mi ciudad (Priority: P1)

Como alumno, quiero ver el clima de ahorita (sol, nubes, lluvia, tormenta, niebla o nieve) y la temperatura de mi ciudad.

**Independent Test**: con internet, abrir el juego: el menú dice, por ejemplo, "🌧 Rain · 17 °C in Ciudad de México" y se ve la lluvia en el dibujo.

**Acceptance Scenarios**:

1. **Given** que el navegador da la ubicación, **Then** se muestra el clima de ese lugar ("where you are").
2. **Given** que el navegador no da la ubicación, **Then** se usa la ciudad elegida en el menú, o Ciudad de México, y se avisa que se puede elegir la ciudad.
3. **When** el alumno elige otra ciudad, **Then** el clima cambia a esa ciudad y la elección se recuerda la próxima vez.
4. **Given** sin internet o con el servicio del clima caído, **Then** se ven la hora del día y la estación, sin clima, con un aviso corto; nada se rompe.
5. **Given** el juego abierto mucho tiempo, **Then** el clima se actualiza cada 30 minutos.

### User Story 3 - La estación del año (Priority: P2)

Como alumno, quiero que el dibujo muestre la estación: flores en primavera, sol y pasto en verano, hojas que caen en otoño y nieve en el suelo en invierno.

**Acceptance Scenarios**:

1. **Given** el 25 de octubre, **Then** se ve el otoño (hojas naranjas).
2. **Given** del 21 de diciembre al 19 de marzo, **Then** se ve el invierno; las fechas son las mismas que usan los accesorios de temporada (GAMES-14).

### User Story 4 - Probar cualquier combinación (Priority: P1)

Como maestra o maestro, quiero ver cualquier combinación sin esperar a la noche o a que llueva.

**Independent Test**: abrir `QuizA.html?ambiente=noche&clima=tormenta&estacion=invierno`: noche, tormenta e invierno, con la nota "test mode".

**Acceptance Scenarios**:

1. **Given** `?ambiente=` `dia`, `tarde` o `noche`, **Then** se usa ese momento del día en lugar del reloj.
2. **Given** `?clima=` `sol`, `nubes`, `niebla`, `lluvia`, `nieve` o `tormenta`, **Then** se usa ese clima y no se pide la ubicación ni el clima a internet.
3. **Given** `?estacion=` `primavera`, `verano`, `otono` u `otoño` o `invierno`, **Then** se usa esa estación.
4. **Given** un valor que no existe, **Then** se ignora y se usa el valor real.
5. **Given** cualquiera de estos valores, **Then** el menú dice "test mode".

### Edge Cases

- **Abrir con doble clic** (`file://`) o desde la red local (`http://192.168…`): algunos navegadores no dan la ubicación fuera de una conexión segura; entonces se usa la ciudad elegida.
- **Permiso de ubicación negado**: no se vuelve a preguntar en cada recarga si ya se eligió una ciudad.
- **Movimiento reducido** (preferencia del sistema): lluvia, nieve y hojas se ven quietas.
- **Impresión**: el ambiente no se imprime.
- **Celular**: el dibujo del menú siempre se ve; el fondo de afuera de la hoja se ve donde haya espacio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El juego DEBE calcular el momento del día con el reloj del equipo: día (6:00–11:59), tarde (12:00–18:59) y noche (19:00–5:59), y revisarlo cada minuto.
- **FR-002**: El juego DEBE calcular la estación con la fecha del equipo (hemisferio norte), con las mismas fechas de GAMES-14.
- **FR-003**: El juego DEBE pedir el clima actual (tipo y temperatura) a un servicio público sin clave, por latitud y longitud, y actualizarlo cada 30 minutos. Se clasifica en: sol, nubes, niebla, lluvia, nieve y tormenta.
- **FR-004**: La ubicación DEBE pedirse primero al navegador; si falla, se usa la ciudad elegida en el menú (lista de ciudades de México), y si no hay ninguna, Ciudad de México. La ciudad elegida se recuerda en el navegador.
- **FR-005**: El menú DEBE mostrar un dibujo del ambiente (cielo, sol o luna, nubes, lluvia o nieve, suelo de la estación) y una línea con el momento del día, el clima con su temperatura y lugar, y la estación.
- **FR-006**: El fondo de la página (fuera de la hoja blanca) y la barra de la tutora DEBEN cambiar de color con el momento del día y oscurecerse con nubes, lluvia o tormenta; la lluvia, la nieve, las hojas o los pétalos caen en el fondo.
- **FR-007**: Sin internet o si el servicio falla, DEBE verse el momento del día y la estación, sin clima, con un aviso; ningún error en la consola rompe el juego.
- **FR-008**: El modo de prueba de la dirección (US4) DEBE poder fijar el momento del día, el clima y la estación.
- **FR-009**: No cambian las guías, las tarjetas, el cuaderno, los premios ni el resto del juego (la huella de GAMES-1 sigue igual); el contenido sigue sobre fondo blanco; el ambiente no se imprime; los archivos llevan su versión (GAMES-5); el juego sigue abriendo con doble clic.

### Key Entities

- **Ambiente**: momento del día, estación y clima (o sin clima), y si viene del modo de prueba.
- **Lugar**: "donde estoy" (ubicación del navegador) o una ciudad de la lista, con su nombre, latitud y longitud.
- **Clima guardado**: tipo, temperatura, lugar y hora en que se pidió (sirve 30 minutos).

## Success Criteria *(mandatory)*

- **SC-001**: Las 3 × 6 × 4 = 72 combinaciones de momento, clima y estación (más las 12 sin clima) se dibujan sin errores y se distinguen a ojo (hoja con todas).
- **SC-002**: Con internet, el clima aparece en menos de 5 segundos al abrir el juego.
- **SC-003**: Sin internet, el juego abre y funciona igual, con el ambiente sin clima.
- **SC-004**: El texto de las guías conserva su contraste (texto oscuro sobre blanco) en las 72 combinaciones.
- **SC-005**: `npm test` en verde; huella de GAMES-1 sin cambios; 390 px sin scroll horizontal.

## Assumptions

- El servicio del clima es Open-Meteo (gratuito, sin clave y permitido desde el navegador); solo se le envían la latitud y la longitud redondeadas a 2 decimales (≈1 km), nunca el nombre del alumno.
- Los textos del ambiente van en inglés, como el resto del juego; los valores del modo de prueba van en español (y también se aceptan en inglés).
- Las horas de día, tarde y noche son fijas (no dependen del amanecer real).
