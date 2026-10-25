# Games

Juegos educativos web. El primero es el de **inglés** (`English/`), con las guías de estudio de 5° de primaria (Grammar, Vocabulary & Spelling; Reading & Listening; Writing): las demos del 1er trimestre y guías nuevas generadas por grado y tema desde fuentes públicas.

## Abrir el juego

Doble clic en `English/QuizA.html`. No hace falta instalar nada. Las demos funcionan sin internet; generar guías nuevas necesita conexión.

Para probarlo en un celular o iPad de la misma red Wi-Fi:

```sh
cd English && python3 -m http.server 8765 --bind 0.0.0.0   # y abrir http://<IP-de-la-Mac>:8765/QuizA.html
```

## Imprimir guías

Dentro de cualquier guía abierta (demo o generada), el botón **🖨 Print** ofrece dos versiones:

- **Student sheet**: la hoja en blanco para contestar a mano, con el formato de las guías en papel (`English/documentacion/`). No incluye nada de lo contestado en pantalla.
- **Answer key**: la misma hoja con las respuestas, otras formas válidas, las palabras del dictado y el guion del *listening* para leer en voz alta, y la rúbrica del writing.

Se usa la impresión del navegador (PC, iPhone, iPad, Android), que también permite **guardar como PDF**. Imprimir no necesita internet. En las guías generadas, imprime la hoja y la clave antes de cerrar la guía: no se guardan.

## Pruebas

Requisito: Node 24. No hay dependencias, así que no hace falta `npm install`.

| Comando | Qué hace |
|---|---|
| `npm test` | Ejecuta todas las pruebas, **sin internet**, en menos de un minuto. |
| `npm run test:coverage` | Igual, con un reporte informativo de cobertura por archivo. |
| `npm run fixtures:record` | Regraba las respuestas de las fuentes externas que usan las pruebas (necesita internet; ver `English/tests/fixtures/README.md`). |

Algunas pruebas aparecen como `todo` (⚠ `# GAMES-2`): describen brechas conocidas en celulares e iPad y **no** hacen fallar la suite. Node las lista bajo "failing tests", pero el comando termina con código 0. GAMES-2 las convierte en pruebas normales cuando las corrige.

## Quality gate

El workflow `Tests` (`.github/workflows/tests.yml`) corre `npm test` en cada push y en cada pull request a `main`, y marca el cambio con ✅ o ❌.

El repositorio es privado en una cuenta gratuita de GitHub, así que el check no se puede hacer obligatorio. El bloqueo es de proceso: una historia de Jira no se cierra con el check en ❌ (constitución, Principio IV).

## Cómo se trabaja

Spec-Driven Development con [Spec Kit](https://github.com/github/spec-kit):

- La constitución está en `.specify/memory/constitution.md`.
- Cada historia vive en `specs/NNN-nombre/` (spec, plan, tasks) y se sigue en Jira (proyecto `GAMES`).
