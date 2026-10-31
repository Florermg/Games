/* =====================================================================
   CALIFICACIÓN (GAMES-17): funciones puras para revisar las respuestas
   de la guía de campos formativos. El promedio sobre 10 es el mismo del
   juego de inglés (computeAverage, ../js/grading.js).
   ===================================================================== */

// Sin mayúsculas, acentos ni signos: «¡El CORAZÓN!» → «el corazon»
function normalizeEs(text) {
    return String(text).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, " ").trim();
}

/** Cuántas ideas clave hay en una respuesta abierta: cada idea es un grupo de sinónimos, como palabras completas. */
function openIdeasFound(item, response) {
    const words = " " + normalizeEs(response) + " ";
    return item.ideas.filter(group => group.some(synonym => words.includes(" " + normalizeEs(synonym) + " "))).length;
}

function isCorrectCampos(section, item, response) {
    if (["choice", "truefalse", "classify"].includes(section.type)) return String(response) !== "" && Number(response) === item.answer;
    if (section.type === "open") return openIdeasFound(item, response) >= item.need;
    return item.answers.some(answer => normalizeEs(answer) === normalizeEs(response));
}

function correctAnswerTextCampos(section, item) {
    if (section.type === "choice" || section.type === "truefalse") return item.options[item.answer];
    if (section.type === "classify") return section.categories[item.answer];
    if (section.type === "open") return item.model;
    if (section.type === "match") {
        const definition = section.definitions.find(d => d.letter === item.answers[0]);
        return item.answers[0] + ". " + definition.text;
    }
    return item.answers[0];
}

// Un punto por pregunta correcta, en cualquier intento
function scoreSectionCampos(section, state) {
    return { score: state.correct.filter(Boolean).length, max: section.items.length };
}
