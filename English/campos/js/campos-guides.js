/* =====================================================================
   GUÍAS (GAMES-17): la demo (siempre igual) y las guías nuevas, con
   preguntas de los campos elegidos (campos-data.js). Mismo formato que
   las guías del juego de inglés: { kind, title, subtitle, sections }.
   Puro: sin DOM; las pruebas lo cargan en Node.
   ===================================================================== */

// Tipo de sección y cuántas preguntas lleva (FR-004)
const CAMPOS_SECTION_PLAN = [
    { type: "choice", count: 8, title: "Elige la respuesta correcta." },
    { type: "truefalse", count: 8, title: "Marca si es verdadero o falso." },
    { type: "match", count: 5, title: "Relaciona cada concepto con su definición." },
    { type: "bank", count: 5, title: "Completa con las palabras del banco." },
    { type: "classify", count: 6, title: "Clasifica:" },
    { type: "open", count: 2, title: "Responde con tus palabras." }
];

const CAMPOS_GUIDE_TITLE = "GUÍA DE ESTUDIO · PRIMER TRIMESTRE";
const DEMO_SEED = 2026;

// mulberry32: la demo usa siempre la misma semilla, así nunca cambia
function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6D2B79F5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffledWith(list, random) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/**
 * Hasta count elementos repartidos entre los temas: uno de cada tema por vuelta.
 * candidates: [{ tema, value }]; accept(value, picked) decide si se puede usar (para no repetir).
 */
function pickSpread(candidates, count, random, accept) {
    const byTema = {};
    for (const c of shuffledWith(candidates, random)) (byTema[c.tema] = byTema[c.tema] || []).push(c);
    const temas = shuffledWith(Object.keys(byTema), random);
    const picked = [];
    while (picked.length < count && temas.some(t => byTema[t].length)) {
        for (const tema of temas) {
            if (picked.length >= count) break;
            while (byTema[tema].length) {
                const candidate = byTema[tema].pop();
                if (!accept || accept(candidate, picked)) {
                    picked.push(candidate);
                    break;
                }
            }
        }
    }
    return picked;
}

const fromTemas = (temas, field) => temas.flatMap(tema => (tema[field] || []).map(value => ({ tema: tema.id, value })));
const lettersFor = (count) => "abcdefghijklmnopqrstuvwxyz".slice(0, count).split("");

const SECTION_BUILDERS = {
    choice(temas, count, random) {
        return pickSpread(fromTemas(temas, "choice"), count, random).map(({ tema, value }) => {
            const options = shuffledWith(value.options, random);
            return { text: value.text, options, answer: options.indexOf(value.options[value.answer]), tip: value.tip, explanation: value.explanation, tema };
        });
    },

    truefalse(temas, count, random) {
        return pickSpread(fromTemas(temas, "truefalse"), count, random).map(({ tema, value }) => ({
            text: value.text, options: ["Verdadero", "Falso"], answer: value.answer ? 0 : 1,
            tip: "Repasa la tarjeta «" + TEMA_BY_ID[tema].title + "».", explanation: value.explanation, tema
        }));
    },

    match(temas, count, random) {
        const unique = (c, picked) => !picked.some(p => p.value[0] === c.value[0] || p.value[1] === c.value[1]);
        const picked = pickSpread(fromTemas(temas, "pairs"), count, random, unique);
        const letters = lettersFor(picked.length);
        const order = shuffledWith(picked.map((p, i) => i), random);
        const definitions = order.map((index, k) => ({ letter: letters[k], text: picked[index].value[1] }));
        const items = picked.map(({ tema, value }, i) => ({
            text: value[0], answers: [letters[order.indexOf(i)]], explanation: value[0] + ": " + value[1], tema
        }));
        return { items, extra: { definitions } };
    },

    bank(temas, count, random) {
        const unique = (c, picked) => !picked.some(p => normalizeEs(p.value.answer) === normalizeEs(c.value.answer));
        const items = pickSpread(fromTemas(temas, "bank"), count, random, unique).map(({ tema, value }) => ({
            text: value.text, answers: [value.answer], tip: value.tip, explanation: value.text.replace("___", value.answer), tema
        }));
        return { items, extra: { bank: shuffledWith(items.map(i => i.answers[0]), random) } };
    },

    classify(temas, count, random) {
        const ids = temas.map(t => t.id);
        const sets = CLASIFICA.filter(set => ids.includes(set.tema));
        if (!sets.length) return [];
        const set = sets[Math.floor(random() * sets.length)];
        let chosen = shuffledWith(set.items, random).slice(0, count);
        // At least two categories, so it is really a classification
        if (new Set(chosen.map(([, i]) => i)).size < 2) {
            const other = set.items.find(([, i]) => i !== chosen[0][1]);
            chosen = chosen.slice(0, -1).concat([other]);
        }
        const items = chosen.map(([text, answer]) => ({ text, answer, explanation: text + " → " + set.categories[answer], tema: set.tema }));
        return { items, extra: { categories: set.categories.slice(), prompt: set.prompt } };
    },

    open(temas, count, random) {
        return pickSpread(fromTemas(temas, "open"), count, random).map(({ tema, value }) => ({
            text: value.text, ideas: value.ideas, need: value.need, model: value.model, tip: value.tip, explanation: value.model, tema
        }));
    }
};

function buildCamposGuide(campos, random, demo) {
    const temas = TEMAS.filter(t => campos.includes(t.campo));
    const sections = [];
    for (const plan of CAMPOS_SECTION_PLAN) {
        const built = SECTION_BUILDERS[plan.type](temas, plan.count, random);
        const items = Array.isArray(built) ? built : built.items;
        if (!items.length) continue;
        const extra = Array.isArray(built) ? {} : built.extra;
        const number = sections.length + 1;
        const title = number + ". " + plan.title + (extra.prompt ? " " + extra.prompt : "") + " (un punto cada una)";
        const section = Object.assign({ type: plan.type, title, items }, extra);
        delete section.prompt;
        sections.push(section);
    }
    const names = campos.length === CAMPOS.length ? "Los 4 campos formativos" : campos.map(id => CAMPO_BY_ID[id].name).join(" · ");
    const guide = { kind: "campos", school: "", title: CAMPOS_GUIDE_TITLE, subtitle: "5.º grado · " + names, sections };
    if (demo) guide.demo = true;
    return guide;
}

/** La demo: siempre la misma guía, con los 4 campos (FR-003). */
function buildCamposDemo() {
    return buildCamposGuide(CAMPOS.map(c => c.id), seededRandom(DEMO_SEED), true);
}

/** Una guía nueva con los campos elegidos (FR-004). */
function generateCamposGuide({ campos }) {
    const valid = (campos || []).filter(id => CAMPO_BY_ID[id]);
    if (!valid.length) throw new Error("Elige al menos un campo formativo.");
    return buildCamposGuide(CAMPOS.map(c => c.id).filter(id => valid.includes(id)), Math.random, false);
}

// ---------- Ejercicios por tema (GAMES-21) ----------

/** El número del tema dentro de su campo, como en la guía impresa (1, 2, 3…). */
function temaNumber(id) {
    const tema = TEMA_BY_ID[id];
    return TEMAS.filter(t => t.campo === tema.campo).indexOf(tema) + 1;
}

const temaHeading = (id) => temaNumber(id) + ". " + TEMA_BY_ID[id].title;

/**
 * Todos los ejercicios de un tema, de cada tipo, con las opciones mezcladas.
 * Clasificar lleva una sección por cada conjunto de ejemplos del tema.
 */
function buildTemaGuide(id, random = Math.random) {
    const tema = TEMA_BY_ID[id];
    if (!tema) throw new Error("Ese tema no existe.");
    const sections = [];
    const add = (plan, built) => {
        const items = Array.isArray(built) ? built : built.items;
        if (!items.length) return;
        const extra = Array.isArray(built) ? {} : built.extra;
        const title = (sections.length + 1) + ". " + plan.title + (extra.prompt ? " " + extra.prompt : "") + " (un punto cada una)";
        const section = Object.assign({ type: plan.type, title, items }, extra);
        delete section.prompt;
        sections.push(section);
    };
    for (const plan of CAMPOS_SECTION_PLAN) {
        if (plan.type === "classify") {
            for (const set of CLASIFICA.filter(s => s.tema === id)) {
                const items = shuffledWith(set.items, random).map(([text, answer]) => ({ text, answer, explanation: text + " → " + set.categories[answer], tema: id }));
                add(plan, { items, extra: { categories: set.categories.slice(), prompt: set.prompt } });
            }
            continue;
        }
        const field = plan.type === "match" ? "pairs" : plan.type;
        add(plan, SECTION_BUILDERS[plan.type]([tema], (tema[field] || []).length, random));
    }
    const campo = CAMPO_BY_ID[tema.campo];
    return { kind: "campos", school: "", tema: id, title: "EJERCICIOS POR TEMA", subtitle: "5.º grado · " + campo.emoji + " " + campo.name + " · " + temaHeading(id), sections };
}
