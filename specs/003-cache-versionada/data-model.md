# Data Model: Versión de los archivos

**Feature**: `003-cache-versionada`

## 1. VersionedReference (en `English/QuizA.html`)

| Campo | Regla |
|---|---|
| `attr` | `src` (en `<script>`) o `href` (en `<link rel="stylesheet">`). |
| `path` | Ruta local relativa a `English/`, que empieza con `js/` o `css/`. Las URLs con esquema (`https://`) no cuentan. |
| `version` | El valor de `?v=`. Son 8 caracteres `[0-9a-f]`, iguales a `hash(path)`. |

Hoy hay **12** referencias: `css/quiz.css` y 11 `js/*.js`, en el orden de carga actual (sin cambios).

## 2. hash(path)

`sha256(contenido con CRLF → LF).hex.slice(0, 8)` (research R1). Es determinista: el mismo contenido da el mismo valor.

## 3. Estados de una referencia (prueba R4)

| Estado | Condición | Resultado |
|---|---|---|
| Al día | `version === hash(path)` | ✔ |
| Sin versión | no hay `?v=` | ✖ "… has no version" |
| Desactualizada | `version !== hash(path)` | ✖ "… changed: run npm run versions" |
| Archivo inexistente | `path` no existe | ✖ "… does not exist" |
