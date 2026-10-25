# Implementation Plan: Versión de los archivos para que cada publicación llegue a todos los navegadores

**Branch**: `003-cache-versionada` (avanzada a `main` `a025408`, con GAMES-6 incluida) | **Date**: 2026-10-24 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-5 (Error)

**Input**: Feature specification from `specs/003-cache-versionada/spec.md`

## Summary

`English/QuizA.html` pedirá cada uno de sus 12 archivos propios (1 CSS y 11 JS) con `?v=<hash del contenido>`. Así, un navegador con los archivos viejos en caché descarga solo los que cambiaron, sin depender del servidor.

- Un comando, `npm run versions`, calcula y escribe las versiones.
- Una prueba dentro de `npm test` (y del check `Tests`) falla si un archivo cambió sin actualizar su versión.
- El README documenta cómo publicar y cómo comprobarlo en el navegador.

Enfoque técnico (research.md): SHA-256 truncado a 8 caracteres hex (R1), versión en la consulta de la URL, verificada con `file://` (R2), y un módulo puro compartido por el comando y la prueba (R3, R4).

## Technical Context

**Language/Version**: HTML y JavaScript del juego, sin cambios de lógica. Node 24 (ESM, `node:crypto`, `node:fs`) para el comando y la prueba.

**Primary Dependencies**: ninguna.

**Storage**: N/A. Las versiones viven en los atributos `src`/`href` de `QuizA.html`.

**Testing**: `English/tests/versions.test.mjs` en `npm test`. Revalidación de la huella de GAMES-1 y de los PDFs de GAMES-3 y GAMES-6.

**Target Platform**:
- Navegadores de PC, iPhone, iPad y Android, con servidor (nutritrack.mx) o con doble clic (`file://`).
- CI en Ubuntu (`Tests`).

**Project Type**: aplicación web estática (single project).

**Performance Goals**: sin impacto en la carga. Las visitas sin publicación nueva siguen usando la caché (SC-004).

**Constraints**:
- Doble clic sin instalar nada (Principio II, FR-006).
- Sin cambios en el servidor (FR-008).
- El juego se comporta igual (FR-005).

**Scale/Scope**: 12 referencias en un archivo HTML, 2 módulos de herramienta, 1 archivo de prueba, 1 script de npm y una sección del README.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Spec-Driven | La spec está aprobada; la decisión del usuario ("Versión en las URLs") está registrada en el Contexto; sin clarificaciones pendientes. | ✅ |
| II. Simplicidad | Solo la consulta `?v=` en 12 URLs y un script de Node sin dependencias. Sin *bundler*, sin *service worker* y sin renombrar archivos (R2). El juego sigue abriendo con doble clic (verificado). | ✅ |
| III. Jira (GAMES-5) | Paso 1 (spec) cumplido; este plan cierra con el comentario del paso 2. Modo `in-all-process`. | ✅ |
| IV. Quality gate | La prueba nueva entra a `npm test` y a `Tests`, y convierte "olvidé la versión" en un ❌ (US2). | ✅ |
| V. Commits | Cada commit, push, PR y merge con autorización. | ✅ |
| VI. Contenido y fuentes | Sin cambios de contenido ni de fuentes. | ✅ |

**Re-check post-diseño**: sin violaciones. Cambia el flujo de trabajo: todo cambio a `js/` o `css/` requiere correr `npm run versions`. La prueba lo exige y el README lo documenta. No hace falta enmendar la constitución.

## Project Structure

### Documentation (this feature)

```text
specs/003-cache-versionada/
├── spec.md · plan.md · research.md · data-model.md · quickstart.md
├── contracts/versions.md
├── checklists/requirements.md
└── tasks.md                   # /speckit-tasks
```

### Source Code (repository root)

```text
package.json                   # CAMBIA: script "versions"
README.md                      # CAMBIA: sección "Publicar una versión"
English/
├── QuizA.html                 # CAMBIA: ?v=<hash> en las 12 referencias locales (mismo orden)
├── tools/
│   ├── versions.mjs           # NUEVO: módulo puro (fileVersion, listReferences, stampVersions, checkVersions)
│   └── stamp-versions.mjs     # NUEVO: comando que reescribe QuizA.html
└── tests/
    └── versions.test.mjs      # NUEVO: el gate de versiones (R4)
```

`English/tools/` no se sube al servidor: los archivos que se publican siguen siendo `QuizA.html`, `css/` y `js/`.

**Structure Decision**: las herramientas de Node viven en `English/tools/`, fuera de `js/` (que es lo que carga el navegador) y fuera de `tests/` (porque el comando no es una prueba). El orden de los `<script>` no cambia.

## Complexity Tracking

No aplica: sin violaciones.
