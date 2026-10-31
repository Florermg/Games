# Implementation Plan: Respaldo del avance (Fase 1)

**Branch**: `017-respaldo-avance` | **Jira**: GAMES-19

## Design

- `English/js/backup.js` (puro + DOM):
  - Funciones puras: `buildBackup({ name, pets, progress, notebook, now })`, `backupHash(backup)` (SHA-256 por Web Crypto, asíncrona), `sealBackup`, `checkBackup(text)` → `{ ok, backup | error }`, `mergeBackup(stores, backup)`, `encodeBackupCode(backup)` / `decodeBackupCode(code)` (CompressionStream si hay), `backupFileName(name, now)`.
  - DOM: tarjeta "💾 My backup / Mi respaldo" en `QuizA.html`: descargar, copiar código, recuperar desde archivo o código pegado.
- `hub.js`: textos `HUB_TEXT` del respaldo; vuelve a dibujar el resumen y las mascotas al recuperar.
- Pruebas: `backup.test.mjs`. El contexto de prueba agrega `crypto`, `TextEncoder`, `CompressionStream`, `Blob`, `Response` y `btoa`/`atob`.

## Constitution Check

- Pruebas antes del código; `npm test` + `Tests`: ✔. Principio V: ✔. Sin dependencias ni red: ✔.
