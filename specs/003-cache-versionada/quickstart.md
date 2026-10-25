# Quickstart: validar la versión de los archivos

**Feature**: `003-cache-versionada`

## 1. Pruebas

1. `npm test` → todo en verde, con `versions.test.mjs` incluida.
2. Cambiar una línea de `English/js/engine.js` sin correr el comando → `npm test` falla y nombra `js/engine.js`.
3. `npm run versions` → dice que cambió `js/engine.js`; `npm test` vuelve a verde.
4. Revertir el cambio y correr `npm run versions` → la versión de `engine.js` regresa a la anterior (FR-002).

## 2. Doble clic (FR-006)

Abrir `English/QuizA.html` con doble clic en Chrome y en Safari. **Esperado**: el menú, las guías, 🖨 Print, Grammar y Verbs funcionan y la consola no muestra errores.

## 3. Caché (US1, SC-001, SC-004), en local con servidor

1. Servir `English/` (`python3 -m http.server 8765`) y abrir el juego en Chrome.
2. Cambiar un archivo, correr `npm run versions` y recargar normal (sin forzar). **Esperado**: en la pestaña Network, el archivo cambiado se descarga y los demás salen *from cache* o con 304; la página funciona.
3. Recargar otra vez sin cambios. **Esperado**: ningún archivo con versión nueva.

## 4. Producción (SC-001, lo hace el usuario al publicar)

Subir `QuizA.html`, `css/` y `js/` a `nutritrack.mx/quiz/`. En el Chrome donde se reprodujo el bug, abrir la página sin forzar la recarga. **Esperado**:
- `[...document.scripts].map(s => s.src)` muestra los `?v=`;
- 🖨 Print funciona y Grammar/Verbs abren;
- la consola tiene 0 errores.

## 5. Sin regresiones (FR-005, SC-005)

- La huella del recorrido de GAMES-1 sigue en `f1 b9 82 7e 2c 76`.
- `run.sh` de GAMES-3 y de GAMES-6 en "All checks passed".
