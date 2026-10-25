# Contract: mascotas

## `English/js/pets.js`

| Elemento | Contrato |
|---|---|
| `PETS` | `{ cat: { name: "Black kitten", emoji: "🐱", phrases: [≥4] }, dog: { name: "German shepherd puppy", emoji: "🐶", phrases: [≥4] } }`. |
| `petSvg(kind)` | SVG en línea de la mascota (`kind` ∈ `cat`, `dog`). Lleva degradados con id prefijado (`pet-<kind>-`), `.pet-eyelids` y `.pet-tail`. Con otro `kind`, lanza un error. |
| `petImageHtml(kind, src)` | `<img class="pet-image" alt="" src="…">`, con la ruta escapada. |
| `nextPetPhrase(kind)` | La siguiente frase en orden; vuelve a la primera al terminar. |
| `togglePets()` | Pone o quita `pets-hidden` en `<body>` y cambia el texto del botón a "🐾 Show pets" o "🐾 Hide pets". No guarda nada. |
| `mountPets()` | Llena `#pets` con 2 `<button class="pet pet-<kind>" aria-label="…">`, con la imagen propia si `data-<kind>-image` tiene valor (y la ilustración si falla), y conecta el clic: saltito y `tutor(emoji, frase)`. Solo corre en el navegador. |

## `English/tools/versions.mjs` (GAMES-5, ampliado)

| Función | Contrato |
|---|---|
| `PET_IMAGES` | `{ cat: "img/pet-cat.png", dog: "img/pet-dog.png" }`. |
| `stampVersions(html, readFile)` | Además de lo de GAMES-5, pone `data-<kind>-image` en `ruta?v=<hash>` si el archivo existe y en `""` si no; sigue siendo idempotente. Una imagen que falta **no** es error, porque es opcional. |
| `checkVersions(html, readFile)` | Además, reporta `pet-image-outdated` cuando el atributo no corresponde al archivo. |

## CSS

- `#pets .pet`: fijo; 120 px en pantallas de 1160 px o más, y 56 px en la franja inferior de 72 px en pantallas angostas.
- `body.pets-hidden #pets` oculto; el botón `#pets-toggle` siempre visible (fijo).
- `@media print`: `#pets` y `#pets-toggle` ocultos y `body` sin `padding-bottom`.
- `@media (prefers-reduced-motion: reduce)`: sin animaciones.
