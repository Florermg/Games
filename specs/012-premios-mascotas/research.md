# Research: Premios de accesorios (GAMES-14)

## R1. Dibujar los accesorios

- **Decision**: cada accesorio es SVG en línea escrito a mano, en las mismas coordenadas de las mascotas (viewBox 120 × 120). Se agrega **dentro** del grupo `.pet-body` de la mascota, así respira, salta y parpadea con ella.
- **Anclas**: las dos mascotas comparten casi toda la geometría (cabeza en 60,50 de radio 27; ojos en 49 y 71; cuerpo en 60,90; patas en y 108). El perrito tiene la cabeza 1 unidad más abajo y las patas 1 unidad más separadas; cada accesorio recibe esas anclas.
- **Ropa del cuerpo**: se recorta a la forma del cuerpo (`clipPath`) y una máscara le quita el círculo de la cabeza, para que no tape la barbilla.
- **Orden**: cuerpo → patas → cuello → ojos → cabeza.
- **Ids únicos**: la misma mascota aparece varias veces en la página (abajo de la ventana, en grande en My Pets y en las miniaturas). `petSvg(kind, outfit, uid)` agrega un sufijo a los ids de degradados, recortes y máscaras; si no, un SVG oculto con `display: none` podría dejar sin degradado a los demás.
- **Alternatives considered**: imágenes PNG por accesorio (requieren archivos y no siguen la animación); emojis encima de la mascota (no se ajustan a la cabeza ni a las patas).

## R2. Temporadas (México, hemisferio norte)

| Temporada | Desde | Hasta |
|---|---|---|
| Fiestas patrias | 1 sep | 16 sep |
| Halloween | 15 oct | 31 oct |
| Día de Muertos | 25 oct | 3 nov |
| Navidad | 1 dic | 6 ene |
| Primavera | 20 mar | 20 jun |
| Verano | 21 jun | 22 sep |
| Otoño | 23 sep | 20 dic |
| Invierno | 21 dic | 19 mar |

Los rangos que cruzan el año (Navidad, invierno) se comparan por mes y día. Varias temporadas pueden estar activas a la vez (el 25 de octubre: Halloween, Día de Muertos y otoño).

## R3. Sorteo

- **Decision**: peso 3 para los de temporada activa, 1 para los de todo el año; los de temporadas no activas tienen peso 0. Se usa `Math.random`, que en las pruebas tiene semilla (mulberry32).

## R4. "La misma guía"

- **Decision**: la clave de una guía es un hash (djb2) de su título, subtítulo y secciones. "Try This Guide Again" usa el mismo objeto, así que da la misma clave. Una guía generada de nuevo, aunque sea del mismo tema, cambia sus preguntas u opciones y da otra clave.
- **Demos**: se reconocen porque son uno de los objetos de `DEMO_GUIDES`.

## R5. Guardado

- `localStorage`, clave `games-pets-v1`, con `try/catch` como el cuaderno (GAMES-13). Los alumnos se guardan por nombre normalizado (minúsculas, sin espacios de más); sin nombre, "guest".
