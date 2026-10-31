# Feature Specification: Respaldo del avance del alumno (Fase 1)

**Feature Branch**: `017-respaldo-avance`

**Created**: 2026-10-31

**Status**: Draft

**Jira**: GAMES-19 (Historia) · **Depende de**: GAMES-18 · **Fase 2**: GAMES-20 (borrador)

**Input**: "para poder guardar el avance no podríamos idear un esquema en el cual se pueda enviar al dispositivo actual por un intercambio de token generado en el dispositivo anterior o que se guarde en el servidor … propón algo" → propuesta de 2 fases → "implementa la fase 1".

## Clarifications

### Session 2026-10-31

- El usuario eligió la Fase 1 de la propuesta: un respaldo sin servidor que el alumno lleva de un equipo a otro. La Fase 2 (llave y servidor) queda en GAMES-20.
- Decisión técnica: **sin código QR**. El avance completo no cabe en un QR, y leerlo con la cámara no funciona en Safari de iPhone/iPad sin librerías externas. Se usa archivo y código de texto.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guardar mi avance (Priority: P1) 🎯 MVP

**Independent Test**: Ana, con premios, ropa e historial, toca "💾 Guardar mi avance" en la página principal: se descarga `respaldo-ana-2026-10-31.json`; con "📋 Copiar código" se copia un texto que empieza con `GAMES1-`.

**Acceptance Scenarios**:

1. **Given** un alumno con nombre, **Then** el respaldo incluye sus premios, la ropa de sus mascotas, su historial de guías y, si deja marcada la casilla, las páginas de su cuaderno.
2. **Given** sin nombre, **Then** se le pide escribir su nombre primero.
3. **Given** un alumno sin nada guardado, **Then** se le dice que aún no hay avance que guardar.

### User Story 2 - Recuperar mi avance en otro equipo (Priority: P1)

**Independent Test**: en otro navegador, "📥 Recuperar mi avance" con el archivo (o pegando el código): aparecen el nombre, los premios, la ropa y el resumen de Ana.

**Acceptance Scenarios**:

1. **Given** un respaldo válido, **Then** se **juntan** sus datos con los del equipo, sin borrar nada:
   - premios: los de ambos lados, con la fecha más antigua;
   - guías ya premiadas: las de ambos lados;
   - ropa: la del equipo si ya hay, si no la del respaldo;
   - historial: sin repetir, ordenado y con las últimas 50;
   - cuaderno: por página, la más reciente.
2. **Given** un respaldo incompleto o modificado (la verificación no coincide), **Then** no se cambia nada y se avisa.
3. **Given** un archivo o un código que no es un respaldo, **Then** se avisa y no se cambia nada.
4. **Given** un respaldo de otro nombre, **Then** se recupera con el nombre del respaldo y el campo del nombre cambia a ese nombre.
5. **Given** el mismo respaldo recuperado dos veces, **Then** no duplica nada.

### Edge Cases

- Navegador que no deja guardar: se avisa y no se pierde lo que hay.
- El código es largo: se copia con un botón; si el navegador no deja copiar, se muestra en un cuadro para copiarlo a mano.
- Navegadores sin compresión: el código va sin comprimir (más largo) y se lee igual.

## Requirements *(mandatory)*

- **FR-001**: El respaldo DEBE ser un JSON `{ format: "games-backup", version: 1, created, student: { name }, data: { pets, progress, notebook }, hash }`, con `hash` = SHA-256 del contenido. Es el mismo formato que usará la Fase 2.
- **FR-002**: Se DEBE poder descargar como archivo y copiar como código de texto (`GAMES1-` + gzip + base64url, o `GAMES0-` + base64url sin compresión).
- **FR-003**: La recuperación DEBE validar el formato y la verificación antes de cambiar algo, y juntar los datos sin borrar nada (US2-1).
- **FR-004**: Textos en inglés y en español, según el idioma de la página principal. Abre con doble clic, sin internet ni servidor; versiones (GAMES-5); huella de GAMES-1 sin cambios.

## Success Criteria *(mandatory)*

- **SC-001**: Guardar en un equipo y recuperar en otro deja premios, ropa, historial y cuaderno iguales (prueba automática y en Chrome con dos perfiles).
- **SC-002**: Cualquier cambio de un carácter en el contenido del respaldo se detecta.
- **SC-003**: `npm test` en verde; 390 px sin scroll horizontal.

## Assumptions

- El cuaderno es del equipo, no del alumno: se incluye con una casilla marcada por omisión.
- El respaldo no está cifrado; quien lo tenga puede leer el avance, como si viera la libreta. El cifrado llega con la Fase 2.
