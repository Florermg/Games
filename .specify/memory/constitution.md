<!--
Sync Impact Report
- Version change: 1.0.0 → 1.0.1 (PATCH)
- Rationale: se resuelve TODO(QUALITY_GATE_SETUP). La historia GAMES-1
  (specs/001-linea-base-quality-gate) creó la suite de pruebas
  (`npm test`) y el workflow `Tests` de GitHub Actions; el Principio IV deja
  de describir una intención y pasa a describir el gate real. Sin cambio
  semántico en ningún principio.
- Principios modificados: IV. Calidad de Código vía Quality Gate de CI
  (se reemplaza el párrafo "Estado actual" por la descripción del gate
  existente y su bloqueo de proceso).
- Secciones agregadas/eliminadas: ninguna.
- Deferred TODOs: ninguno.
-->

<!--
Sync Impact Report
- Version change: (plantilla del kit _sdd-template-kit 1.0.0) → 1.0.0
- Rationale: primera constitución del proyecto Games (juegos educativos web;
  el primero es el juego de inglés de English/), adaptada del kit de
  gobernanza SDD del piloto NutriTrackPro.
- Principios incluidos: I-V (núcleo). Del bloque opcional se conserva y
  redacta el IX como "Contenido Apto para Niños y Fuentes Externas Abiertas"
  (renumerado como VI); se eliminan VI (frontend-backend), VII (esquema de
  BD), VIII (roles) y X (auditoría) porque el proyecto no tiene backend, base
  de datos, usuarios ni datos sensibles almacenados.
- Deferred TODOs:
  - TODO(QUALITY_GATE_SETUP): el workflow de GitHub Actions y la suite de
    tests aún no existen; se implementan en la primera HU (ver Principio IV).
-->

# Constitution: Games (juegos educativos)

## Principios Núcleo

### I. Contratos como Fuente de Verdad (Spec-Driven Development)

Toda feature no trivial pasa por el flujo Spec Kit
(`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement`) antes de escribir código de producción. La
especificación (`spec.md`) describe QUÉ y POR QUÉ desde la perspectiva del
usuario (alumno, maestro), sin detalles de implementación; el plan
(`plan.md`) describe CÓMO. El código no se adelanta a la spec — si durante la
implementación se descubre que la spec estaba mal o incompleta, se corrige
la spec primero (o se documenta la desviación explícitamente), nunca se
deja que el código y la documentación diverjan en silencio.

El código existente en `English/` se construyó antes de adoptar este flujo:
se trata como línea base heredada. Cualquier cambio sobre él pasa por el
flujo, y su comportamiento actual se documenta en una spec de línea base
antes de modificarlo de forma no trivial.

**Rationale**: sin este orden, la documentación se vuelve retroactiva
("documentar lo que ya se hizo") y deja de ser una fuente de verdad
confiable — nadie puede confiar en que `spec.md` describe el sistema real.

### II. Simplicidad Apropiada al Alcance del Proyecto

Toda abstracción, dependencia nueva o capa de indirección adicional se
justifica contra el tamaño y la etapa real del proyecto — no contra un
escenario hipotético de escala futura. Los juegos son páginas web estáticas
(HTML, CSS y JavaScript sin framework ni paso de build) que deben poder
abrirse con doble clic o servirse desde cualquier hosting estático; agregar
un framework, bundler o backend requiere justificarlo contra este principio
en el `plan.md`. Las herramientas de desarrollo (por ejemplo, el runner de
tests) no cuentan como dependencia de producción siempre que el juego siga
funcionando sin ellas. Al mismo tiempo, simplicidad no es excusa para
saltarse pruebas, saltarse la sincronización con el sistema de seguimiento,
o acumular deuda técnica sin registrarla.

**Rationale**: la sobre-ingeniería temprana es tan costosa como la deuda
técnica — ambas se justifican solo cuando el problema real ya apareció,
no antes.

### III. Sincronización con el Sistema de Seguimiento (Jira)

Toda feature que pase por el flujo Spec Kit DEBE quedar reflejada como un
issue en Jira (sitio `sitereliabilityengineering.atlassian.net`, proyecto
`GAMES`, vía el MCP de Atlassian) — sin excepción por
no tener ya un issue de origen. Si la feature no tiene un issue
identificable al iniciar `/speckit-specify`, se crea uno nuevo ahí mismo
(o a más tardar antes de dar la feature por completa).

La sincronización es un **gate por fase, no un paso único al final**: cada
transición del flujo Spec Kit queda bloqueada hasta que el issue refleja la
fase recién completada.

1. Al completar `/speckit-specify`: el issue se transiciona a
   **"En curso"** y se agrega un comentario resumiendo la spec
   (User Stories priorizadas, alcance). No se ejecuta `/speckit-plan`
   hasta completar este paso.
2. Al completar `/speckit-plan`: se agrega un comentario resumiendo el
   enfoque técnico (decisiones clave, archivos/módulos afectados). No se
   ejecuta `/speckit-tasks` hasta completar este paso.
3. Al completar `/speckit-tasks`: se agrega un comentario con el
   **checklist completo de tareas como texto** (cada `T00X` con su
   descripción, copiado de `tasks.md`) — no solo un conteo. No se crean
   subtareas reales en Jira por cada `T00X` (duplicaría el mantenimiento);
   el comentario es una copia de solo lectura en ese momento. No se
   ejecuta `/speckit-implement` hasta completar este paso.
4. Durante `/speckit-implement`: se agrega un comentario en cada
   checkpoint relevante (típicamente, por User Story completada) — no es
   necesario un comentario por cada tarea individual.
5. Antes de transicionar el issue a su estado terminal: se verifica que
   `tasks.md` no tenga tareas eliminadas o alteradas en su alcance de
   forma silenciosa respecto al desglose original del paso 3 — cualquier
   cambio real de alcance durante la implementación debe quedar
   documentado explícitamente. Cumplida esta verificación, la descripción
   del issue se actualiza con el resumen final ("**Implementado**":
   archivos, tests, rama/commit) y el issue se transiciona a su estado
   terminal — solo una vez que la implementación está validada (suite de
   tests en verde y, cuando la spec lo exige, validación en vivo en el
   navegador completada).

**Modo de ejecución de la HU: `in-all-process` vs. multi-rol**

Al iniciar `/speckit-specify` para una HU nueva (antes de escribir
`spec.md`), se pregunta explícitamente: **¿esta HU es `in-all-process` (la
misma persona/sesión ejecuta las cuatro fases de punta a punta) o involucra
distintos roles/personas por fase?** La respuesta se registra en `spec.md`
y en el comentario de la fase `/speckit-specify`, y determina el gate entre
cada transición de fase:

- **`in-all-process`**: antes de ejecutar `/speckit-plan`,
  `/speckit-tasks` o `/speckit-implement`, se pregunta explícitamente
  "¿continúo con la siguiente fase?" — incluso si ya se autorizó el ciclo
  completo al inicio ("genera la HU completa" no exime esta pregunta en
  cada frontera).
- **Multi-rol**: se aplican ambos mecanismos — la misma pregunta de
  "¿continúo?" en cada frontera, y además se verifica que el issue esté
  asignado a la identidad conectada en la sesión actual antes de avanzar
  de fase. Si no coincide, no se avanza sin que esa persona lo confirme
  desde su propia sesión.

Límite honesto: ninguno de los dos modos autentica criptográficamente a la
persona frente al teclado — solo se confía en la identidad de sistemas ya
conectados (cuenta de Jira detrás del token de integración, o
`git config user.email` local).

**Rationale**: sin este gate por fase, Jira queda desincronizado del estado
real del código — deja de ser una fuente confiable para quien necesita dar
seguimiento sin leer el repo directamente. Sin el gate de modo de
ejecución, una autorización inicial ("hazlo todo") termina funcionando como
si las cuatro fases fueran una sola.

### IV. Calidad de Código vía Quality Gate de CI (GitHub Actions + tests)

El código nuevo o modificado DEBE pasar el quality gate de GitHub Actions
configurado en el repositorio antes de dar una feature por completada. Como
mínimo: la suite de tests automáticos en verde (tests de la lógica
JavaScript: validación de respuestas, generadores, reglas gramaticales y
filtros de contenido; las llamadas a APIs externas se prueban con respuestas
simuladas para que la suite no dependa de la red). Un fallo del quality gate
causado por el propio cambio (no por infraestructura) se corrige antes de
cerrar la HU en Jira — no se documenta como "excepción" salvo que sea
genuinamente inevitable, y en ese caso se documenta explícitamente por qué.

Implementación vigente (GAMES-1): `npm test` ejecuta la suite de cada
juego (`English/tests/`) sin red ni dependencias, y el workflow `Tests`
(`.github/workflows/tests.yml`) la corre en cada push y pull request a
`main`. El repositorio es privado en una cuenta gratuita de GitHub, que no
permite hacer obligatorio el check; por eso el bloqueo es **de proceso**: una
historia no se transiciona a su estado terminal en Jira si el último commit de
su rama, o de `main` después de integrarla, tiene el check en ❌, e integrar
un PR con el check en ❌ requiere una excepción documentada en el issue. Las
pruebas marcadas como pendientes (`todo`) documentan brechas conocidas sin
bloquear el gate; la historia que corrige la brecha quita la marca.

**Rationale**: un quality gate que se puede saltar "por esta vez" deja de
ser un gate — es una sugerencia. La disciplina de corregirlo siempre
(salvo excepción documentada) es lo que lo hace confiable.

### V. Autorización Explícita para Commits (NON-NEGOTIABLE)

Ningún commit se crea sin la autorización explícita del usuario para ese
commit específico, sin importar qué paso del flujo Spec Kit lo motive, y
sin importar que el usuario ya haya aprobado el plan o las tareas que
llevan a ese commit. La autorización del push es una pregunta separada de
la autorización del commit — aprobar uno no aprueba el otro. Lo mismo
aplica a crear o modificar el repositorio remoto de GitHub.

**Rationale**: la ejecución automatizada de un flujo largo (specify → plan
→ tasks → implement) no debe traducirse en cambios persistidos al
historial de git sin que una persona los revise y confirme explícitamente
en ese momento — es el único punto de control verdaderamente humano en un
flujo que de otro modo podría correr de punta a punta sin supervisión.

---

## Principios del Proyecto

### VI. Contenido Apto para Niños y Fuentes Externas Abiertas

Los usuarios finales son alumnos de primaria (escuela bilingüe en México) y
sus maestros. Por eso:

- Todo contenido generado a partir de fuentes externas (palabras,
  definiciones, oraciones, textos) pasa por filtros de contenido no apto
  antes de mostrarse, y la interfaz no presenta el contenido generado como
  revisado: el maestro es quien lo valida para uso en clase.
- Las fuentes externas son APIs públicas, gratuitas y sin clave (hoy:
  Datamuse, Wiktionary y Simple English Wikipedia), consultadas en vivo
  desde el navegador. No se descargan ni almacenan archivos de contenido, y
  no se introduce una API que requiera clave o credenciales sin enmendar
  este principio.
- Se respetan las licencias de las fuentes: el contenido con licencia
  CC BY-SA muestra su atribución en pantalla.
- Ningún dato del alumno (nombre, respuestas, calificaciones) sale del
  navegador ni se envía a servicios externos.
- La falla de una fuente externa (sin red, límite de peticiones) se informa
  con un mensaje claro y no impide usar las guías de demostración, que
  funcionan sin red.

**Rationale**: el público es infantil y el contenido se arma en vivo desde
fuentes abiertas que nadie del proyecto controla; sin estas reglas, una
respuesta inesperada de una API llega directo a un niño, o un dato personal
sale del aula sin que nadie lo decida.

---

## Gobernanza

Esta constitución tiene prioridad sobre cualquier otra práctica de
desarrollo del proyecto. Toda enmienda se aplica editando este archivo y
registrando un **Sync Impact Report** al inicio (versión anterior → nueva,
rationale, principios modificados, secciones modificadas/eliminadas). Los
Sync Impact Reports anteriores se conservan en orden descendente (el más
reciente arriba), no se borran.

**Política de versionado**: SemVer para la constitución — MAJOR ante
eliminación o redefinición incompatible de un principio, MINOR ante la
adición de un principio o sección nueva, PATCH ante aclaraciones o
correcciones de redacción sin cambio semántico.

**Revisión de cumplimiento**: cada `/speckit-plan` y `/speckit-implement`
verifica alineación con los principios vigentes antes de aprobarse. Toda
complejidad adicional (nuevas dependencias, abstracciones, servicios) se
justifica contra el Principio II. Toda feature queda reflejada en Jira y
sincronizada por fase (Principio III). Todo cambio pasa el quality gate de
CI (Principio IV). Ningún commit se crea sin autorización explícita
(Principio V). Todo contenido externo cumple el Principio VI.

**Version**: 1.0.1 | **Ratified**: 2026-10-24 | **Last Amended**: 2026-10-24
