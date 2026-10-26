/* =====================================================================
   PETS (GAMES-9): a black kitten and a German shepherd puppy, always
   visible at the bottom of the window. Drawn as inline SVG with a 3D
   look (radial gradients, highlights and a contact shadow): no files,
   no libraries. Optional own images in English/img/ (see README).
   The pure part (PETS, petSvg, nextPetPhrase) is tested in Node.
   ===================================================================== */

const PETS = {
    cat: {
        name: "Black kitten", emoji: "🐱",
        phrases: [
            "Meow! Keep going!",
            "Purr... you are doing great!",
            "Meow! Read it one more time.",
            "Paws up for English!",
            "Meow! Take a deep breath and try again."
        ]
    },
    dog: {
        name: "German shepherd puppy", emoji: "🐶",
        phrases: [
            "Woof! Great job!",
            "Woof woof! You can do it!",
            "Let's fetch the right answer!",
            "Woof! Practice makes perfect!",
            "Happy tail wags for you!"
        ]
    }
};

// ---------- Drawings (viewBox 120 x 120, light from the top left) ----------

function radial(id, stops, cx, cy, r) {
    return '<radialGradient id="' + id + '" cx="' + (cx || "35%") + '" cy="' + (cy || "30%") + '" r="' + (r || "75%") + '">' +
        stops.map(([offset, color]) => '<stop offset="' + offset + '" stop-color="' + color + '"/>').join('') + '</radialGradient>';
}

// Soft contact shadow under the feet, shared by both pets
function petShadow(kind) {
    return '<ellipse cx="60" cy="113" rx="34" ry="5" fill="url(#pet-' + kind + '-shadow)"/>';
}

function catSvg() {
    const fur = "url(#pet-cat-fur)";
    return '<defs>' +
        radial("pet-cat-fur", [["0%", "#5b6178"], ["45%", "#262833"], ["100%", "#0a0b0f"]]) +
        radial("pet-cat-ear", [["0%", "#ffc2cf"], ["100%", "#c86f88"]], "50%", "70%") +
        radial("pet-cat-eye", [["0%", "#f3ff8a"], ["70%", "#a9d43a"], ["100%", "#5f8a1c"]], "40%", "35%") +
        radial("pet-cat-shadow", [["0%", "rgba(0,0,0,0.35)"], ["100%", "rgba(0,0,0,0)"]], "50%", "50%", "50%") +
        '</defs>' +
        petShadow("cat") +
        // Tail: curls up from the right side of the body
        '<path class="pet-tail" d="M84 100 C104 98 108 78 100 64 C97 59 92 61 94 66 C99 77 95 90 82 92 Z" fill="' + fur + '"/>' +
        '<g class="pet-body">' +
        '<ellipse cx="60" cy="90" rx="29" ry="22" fill="' + fur + '"/>' +
        '<ellipse cx="47" cy="108" rx="9" ry="5.5" fill="' + fur + '"/>' +
        '<ellipse cx="73" cy="108" rx="9" ry="5.5" fill="' + fur + '"/>' +
        // Ears
        '<path d="M36 40 L33 13 L55 30 Z" fill="' + fur + '"/>' +
        '<path d="M84 40 L87 13 L65 30 Z" fill="' + fur + '"/>' +
        '<path d="M39 35 L37.5 20 L50 30 Z" fill="url(#pet-cat-ear)"/>' +
        '<path d="M81 35 L82.5 20 L70 30 Z" fill="url(#pet-cat-ear)"/>' +
        // Head with a soft highlight
        '<circle cx="60" cy="50" r="27" fill="' + fur + '"/>' +
        '<ellipse cx="50" cy="36" rx="11" ry="6" fill="#ffffff" opacity="0.16"/>' +
        // Eyes: iris, pupil and two highlights
        '<ellipse cx="49" cy="50" rx="6.5" ry="7.5" fill="url(#pet-cat-eye)"/>' +
        '<ellipse cx="71" cy="50" rx="6.5" ry="7.5" fill="url(#pet-cat-eye)"/>' +
        '<ellipse cx="49" cy="51" rx="2.2" ry="5.5" fill="#0a0b0f"/>' +
        '<ellipse cx="71" cy="51" rx="2.2" ry="5.5" fill="#0a0b0f"/>' +
        '<circle cx="47" cy="47" r="1.8" fill="#ffffff"/><circle cx="69" cy="47" r="1.8" fill="#ffffff"/>' +
        '<circle cx="51" cy="54" r="0.9" fill="#ffffff" opacity="0.8"/><circle cx="73" cy="54" r="0.9" fill="#ffffff" opacity="0.8"/>' +
        // Eyelids (blink): they cover the eyes only during the animation
        '<g class="pet-eyelids"><ellipse cx="49" cy="50" rx="7.2" ry="8.2" fill="#1c1e27"/><ellipse cx="71" cy="50" rx="7.2" ry="8.2" fill="#1c1e27"/></g>' +
        // Nose, mouth and whiskers
        '<path d="M57 59 L63 59 L60 62.5 Z" fill="#f29bb0"/>' +
        '<path d="M60 62.5 Q57 66 54 64 M60 62.5 Q63 66 66 64" stroke="#8c90a3" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
        '<path d="M44 60 L30 57 M44 63 L30 64 M76 60 L90 57 M76 63 L90 64" stroke="#b9bdcc" stroke-width="0.9" opacity="0.75" stroke-linecap="round"/>' +
        '</g>';
}

function dogSvg() {
    const tan = "url(#pet-dog-tan)", black = "url(#pet-dog-black)";
    return '<defs>' +
        radial("pet-dog-tan", [["0%", "#f6cf98"], ["50%", "#d0914d"], ["100%", "#8a5627"]]) +
        radial("pet-dog-black", [["0%", "#6b5a4e"], ["50%", "#2e241e"], ["100%", "#120d0a"]]) +
        radial("pet-dog-eye", [["0%", "#a8692e"], ["100%", "#4a2a10"]], "40%", "35%") +
        radial("pet-dog-shadow", [["0%", "rgba(0,0,0,0.35)"], ["100%", "rgba(0,0,0,0)"]], "50%", "50%", "50%") +
        '</defs>' +
        petShadow("dog") +
        // Bushy tail: tan with a dark tip
        '<path class="pet-tail" d="M85 98 C103 96 110 82 106 70 C104 64 98 65 99 71 C101 82 95 89 83 90 Z" fill="' + tan + '"/>' +
        '<g class="pet-body">' +
        '<ellipse cx="60" cy="90" rx="30" ry="22" fill="' + tan + '"/>' +
        // Black saddle covering the top of the back, cut to the shape of the body
        '<clipPath id="pet-dog-body"><ellipse cx="60" cy="90" rx="30" ry="22"/></clipPath>' +
        '<path clip-path="url(#pet-dog-body)" d="M25 60 H95 V86 C84 92 72 90 60 84 C48 90 36 92 25 86 Z" fill="' + black + '"/>' +
        '<ellipse cx="46" cy="108" rx="9" ry="5.5" fill="' + tan + '"/>' +
        '<ellipse cx="74" cy="108" rx="9" ry="5.5" fill="' + tan + '"/>' +
        // Tall pointed ears: dark outside, tan inside
        '<path d="M37 42 L35 8 L57 31 Z" fill="' + black + '"/>' +
        '<path d="M83 42 L85 8 L63 31 Z" fill="' + black + '"/>' +
        '<path d="M41 36 L40 18 L52 31 Z" fill="' + tan + '"/>' +
        '<path d="M79 36 L80 18 L68 31 Z" fill="' + tan + '"/>' +
        // Head (tan) with the dark cap of the breed, cut to the shape of the head,
        // and the two tan marks above the eyes
        '<clipPath id="pet-dog-head"><circle cx="60" cy="51" r="27"/></clipPath>' +
        '<circle cx="60" cy="51" r="27" fill="' + tan + '"/>' +
        '<path clip-path="url(#pet-dog-head)" d="M20 10 H100 V45 C86 37 70 38 60 49 C50 38 34 37 20 45 Z" fill="' + black + '"/>' +
        '<ellipse cx="48" cy="41.5" rx="3.6" ry="2.2" fill="#e0a865"/><ellipse cx="72" cy="41.5" rx="3.6" ry="2.2" fill="#e0a865"/>' +
        '<ellipse cx="50" cy="32" rx="10" ry="4.5" fill="#ffffff" opacity="0.14"/>' +
        // Eyes
        '<circle cx="49" cy="50" r="5.5" fill="url(#pet-dog-eye)"/><circle cx="71" cy="50" r="5.5" fill="url(#pet-dog-eye)"/>' +
        '<circle cx="49" cy="50.5" r="2.8" fill="#140c06"/><circle cx="71" cy="50.5" r="2.8" fill="#140c06"/>' +
        '<circle cx="47.5" cy="48" r="1.6" fill="#ffffff"/><circle cx="69.5" cy="48" r="1.6" fill="#ffffff"/>' +
        '<g class="pet-eyelids"><circle cx="49" cy="50" r="6.2" fill="#b77a3e"/><circle cx="71" cy="50" r="6.2" fill="#b77a3e"/></g>' +
        // Dark muzzle, shiny nose and a small tongue
        '<ellipse cx="60" cy="63" rx="12" ry="9" fill="' + black + '"/>' +
        '<ellipse cx="60" cy="59" rx="5" ry="3.6" fill="#0d0907"/>' +
        '<ellipse cx="58.5" cy="57.8" rx="1.6" ry="0.9" fill="#ffffff" opacity="0.6"/>' +
        '<path d="M56 68 Q60 76 64 68 Z" fill="#f08aa0"/>' +
        '</g>';
}

const PET_DRAWINGS = { cat: catSvg, dog: dogSvg };

/**
 * Inline SVG of a pet ("cat" or "dog"), with its accessories (GAMES-14).
 * @param {object} [outfit] { slot: accessory id }; drawn inside .pet-body so they move with the pet
 * @param {string} [uid] suffix for the ids, when the same pet is drawn more than once on the page
 */
function petSvg(kind, outfit, uid) {
    if (!PET_DRAWINGS[kind]) throw new Error("Unknown pet: " + kind);
    let drawing = PET_DRAWINGS[kind]();
    const layers = typeof accessoryLayers === "function" ? accessoryLayers(kind, outfit) : "";
    // The drawing ends by closing .pet-body: the accessories go just before it
    if (layers) drawing = drawing.slice(0, -"</g>".length) + layers + "</g>";
    if (uid) drawing = drawing.replace(/(id="|url\(#)pet-/g, "$1pet-" + uid + "-");
    return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + drawing + '</svg>';
}

/** An own 3D image of a pet (English/img/, versioned by npm run versions). */
function petImageHtml(kind, src) {
    return '<img class="pet-image" alt="" src="' + escapeHtml(src) + '" draggable="false">';
}

// ---------- Phrases (they go around in order) ----------

const petPhraseIndex = { cat: 0, dog: 0 };

function nextPetPhrase(kind) {
    const phrases = PETS[kind].phrases;
    const phrase = phrases[petPhraseIndex[kind] % phrases.length];
    petPhraseIndex[kind] = (petPhraseIndex[kind] + 1) % phrases.length;
    return phrase;
}

// ---------- On the page ----------

// A touch, click, Enter or Space: a little jump and a phrase from the tutor (no sound, FR-005).
// It never touches the open guide.
function petTouched(kind, button) {
    button.classList.remove("jump");
    void button.offsetWidth; // restart the animation when touched again quickly
    button.classList.add("jump");
    tutor(PETS[kind].emoji, nextPetPhrase(kind));
}

// Hides or shows both pets until the page is reloaded (nothing is saved, FR-006a)
function togglePets() {
    const hidden = document.body.classList.toggle("pets-hidden");
    const button = document.getElementById("pets-toggle");
    // The text is hidden on phones (only 🐾), so the name also goes in aria-label (GAMES-10)
    button.querySelector(".pets-toggle-text").textContent = hidden ? "Show pets" : "Hide pets";
    button.setAttribute("aria-label", hidden ? "Show pets" : "Hide pets");
    button.setAttribute("aria-pressed", String(hidden));
}

function mountPets() {
    const box = document.getElementById("pets");
    if (!box || box.childElementCount) return;
    for (const kind of ["cat", "dog"]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "pet pet-" + kind;
        button.setAttribute("aria-label", PETS[kind].name);
        // The own image if there is one (FR-008); the drawing if not, or if it does not load
        const image = box.getAttribute("data-" + kind + "-image");
        if (image) {
            button.innerHTML = petImageHtml(kind, image);
            button.querySelector("img").addEventListener("error", () => { button.innerHTML = petSvg(kind); });
        } else {
            button.innerHTML = petSvg(kind);
        }
        button.addEventListener("click", () => petTouched(kind, button));
        button.addEventListener("animationend", (event) => {
            if (event.animationName === "pet-jump") button.classList.remove("jump");
        });
        box.appendChild(button);
    }
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "pets-toggle";
    toggle.innerHTML = '<span aria-hidden="true">🐾</span> <span class="pets-toggle-text">Hide pets</span>';
    toggle.setAttribute("aria-label", "Hide pets");
    toggle.setAttribute("aria-pressed", "false");
    toggle.onclick = togglePets;
    document.body.appendChild(toggle);
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountPets);
    else mountPets();
}
