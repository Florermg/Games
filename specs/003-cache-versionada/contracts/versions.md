# Contract: versiones de los archivos

**Feature**: `003-cache-versionada`

## Módulo `English/tools/versions.mjs` (puro, sin escribir archivos)

| Función | Contrato |
|---|---|
| `fileVersion(text)` | 8 caracteres hex del SHA-256 de `text`, con `CRLF` convertido a `LF`. |
| `listReferences(html)` | `[{ attr, path, version \| null }]` de cada `src`/`href` local a `js/` o `css/`, en orden. |
| `stampVersions(html, readFile)` | `{ html, changed: [path] }`: el HTML con cada referencia local en `?v=fileVersion(readFile(path))`. Idempotente. Si un archivo no existe, lanza un error con su ruta. |
| `checkVersions(html, readFile)` | `[{ path, problem }]` con `problem` ∈ `missing-version`, `outdated`, `missing-file`. Si todo está al día, devuelve `[]`. |

## Comando `npm run versions`

Ejecuta `node English/tools/stamp-versions.mjs`:
- Reescribe `English/QuizA.html` y lista los archivos cuya versión cambió (o "All versions are up to date").
- Termina con código 1 si falta un archivo.

## Prueba `English/tests/versions.test.mjs`

- Falla si `checkVersions` devuelve algún problema, con un mensaje que nombra el archivo e indica "run `npm run versions`".
- Comprueba con HTML de ejemplo las funciones del módulo: idempotencia, URLs externas intactas y los tres estados de error.
