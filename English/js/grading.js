/* =====================================================================
   GRADING
   Pure functions that check answers and compute scores. They do not use
   the DOM, so the automated tests can run them in Node (English/tests/).
   ===================================================================== */

// Answers are compared ignoring case, commas, extra spaces and final punctuation
function normalizeAnswer(text) {
    return String(text)
        .toLowerCase()
        .replace(/[‘’`´]/g, "'")
        .replace(/,/g, " ")
        .replace(/\s+([.!?])/g, "$1")
        .trim()     // before removing the final period: phone keyboards add a space after it
        .replace(/[.!?]+$/, "")
        .replace(/\s+/g, " ")
        .trim();
}

function isCorrect(section, item, response) {
    if (section.type === "choice") return Number(response) === item.answer;
    const normalized = normalizeAnswer(response);
    return item.answers.some(answer => normalizeAnswer(answer) === normalized);
}

function correctAnswerText(section, item) {
    if (section.type === "choice") return item.options[item.answer];
    if (section.type === "match") {
        const definition = section.definitions.find(d => d.letter === item.answers[0]);
        return item.answers[0] + ". " + definition.text;
    }
    return item.answers[0];
}

// One point per correct item, whatever the attempt; writing uses its criteria
function scoreSection(section, state) {
    if (section.type === "writing") {
        return { score: state.writingScore, max: section.criteria.reduce((sum, c) => sum + c.points, 0) };
    }
    return { score: state.correct.filter(Boolean).length, max: section.items.length };
}

// Average out of 10 with one decimal, like the "Average" of the printed guides
function computeAverage(score, max) {
    return max ? Math.round(score / max * 100) / 10 : 0;
}
