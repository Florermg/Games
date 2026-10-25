/* =====================================================================
   CONJUGATION (GAMES-6)
   Verb tenses, English and Spanish forms, verb search and the online
   lookup for verbs that are not in the reviewed list (verbs-data.js).
   Pure: no DOM; the tests run it in Node (English/tests/).
   ===================================================================== */

// The 10 tenses, always shown in this order (FR-003). minGrade: the grade where it is marked by default
const TENSES = [
    { id: "presentSimple",            label: "Present simple",             minGrade: 3, timeEn: "every day",                timeEs: "todos los días" },
    { id: "presentContinuous",        label: "Present continuous",         minGrade: 3, timeEn: "now",                      timeEs: "ahora" },
    { id: "presentPerfect",           label: "Present perfect",            minGrade: 5, timeEn: "already",                  timeEs: "ya" },
    { id: "presentPerfectContinuous", label: "Present perfect continuous", minGrade: 6, timeEn: "for an hour",              timeEs: "desde hace una hora" },
    { id: "pastSimple",               label: "Past simple",                minGrade: 3, timeEn: "yesterday",                timeEs: "ayer" },
    { id: "pastContinuous",           label: "Past continuous",            minGrade: 5, timeEn: "when I called",            timeEs: "cuando llamé" },
    { id: "pastPerfect",              label: "Past perfect",               minGrade: 6, timeEn: "before class",             timeEs: "antes de la clase" },
    { id: "futureWill",               label: "Future (will)",              minGrade: 4, timeEn: "tomorrow",                 timeEs: "mañana" },
    { id: "futureGoingTo",            label: "Future (going to)",          minGrade: 4, timeEn: "next week",                timeEs: "la próxima semana" },
    { id: "futureContinuous",         label: "Future continuous",          minGrade: 6, timeEn: "at this time tomorrow",    timeEs: "mañana a esta hora" }
];

const TENSE_BY_ID = Object.fromEntries(TENSES.map(t => [t.id, t]));

// Tenses marked by default for a grade (3rd to 6th)
function tensesForGrade(grade) {
    return TENSES.filter(t => t.minGrade <= Number(grade));
}

// ---------- English ----------

function splitPhrasal(base) {
    const [verb, ...rest] = base.split(" ");
    return { verb, particle: rest.length ? " " + rest.join(" ") : "" };
}

function vowelGroups(word) {
    return (word.match(/[aeiou]+/g) || []).length;
}

// stop → stopp-, begin → beginn- (one vowel group, or marked "double")
function doublesLastLetter(word, double) {
    return endsWithCVC(word) && (double || vowelGroups(word) === 1);
}

function thirdPerson(word) {
    if (word === "be") return "is";
    if (word === "have") return "has";
    if (/(s|x|z|ch|sh|o)$/.test(word)) return word + "es";
    if (/[^aeiou]y$/.test(word)) return word.slice(0, -1) + "ies";
    return word + "s";
}

function ingForm(word, double) {
    if (word === "be") return "being";
    if (word.endsWith("ie")) return word.slice(0, -2) + "ying";
    if (/[^aeoy]e$/.test(word)) return word.slice(0, -1) + "ing";
    if (doublesLastLetter(word, double)) return word + word.slice(-1) + "ing";
    return word + "ing";
}

function regularPastForm(word, double) {
    if (word.endsWith("e")) return word + "d";
    if (/[^aeiou]y$/.test(word)) return word.slice(0, -1) + "ied";
    if (doublesLastLetter(word, double)) return word + word.slice(-1) + "ed";
    return word + "ed";
}

// The 4 English forms of a verb, with the particle of phrasal verbs at the end
function englishForms(verb) {
    const { verb: word, particle } = splitPhrasal(verb.base);
    const irregular = IRREGULAR_FORMS[word];
    const past = irregular ? irregular[0] : regularPastForm(word, verb.double);
    const participle = irregular ? irregular[1] : past;
    return {
        base: verb.base,
        s3: thirdPerson(word) + particle,
        ing: ingForm(word, verb.double) + particle,
        past: past + particle,
        participle: participle + particle
    };
}

const ENGLISH_PATTERNS = {
    presentSimple: f => f.s3,
    presentContinuous: f => "is " + f.ing,
    presentPerfect: f => "has " + f.participle,
    presentPerfectContinuous: f => "has been " + f.ing,
    pastSimple: f => f.past,
    pastContinuous: f => "was " + f.ing,
    pastPerfect: f => "had " + f.participle,
    futureWill: f => "will " + f.base,
    futureGoingTo: f => "is going to " + f.base,
    futureContinuous: f => "will be " + f.ing
};

// ---------- Spanish ----------

function stripAccents(text) {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// One of the 6 Spanish base forms (3rd person singular) of an infinitive
function spanishForm(verb, kind, infinitive) {
    const full = infinitive || verb.es[0];
    if (kind === "infinitive") return full;
    // levantarse → levantar, irse → ir
    const reflexive = /(ar|er|ir|ír)se$/.test(full);
    const inf = reflexive ? full.slice(0, -2) : full;
    const irregular = SPANISH_FORMS[inf] || {};
    if (irregular[kind]) return irregular[kind];
    const ending = stripAccents(inf.slice(-2));
    const stem = inf.slice(0, -2);
    switch (kind) {
        case "present": return stem + (ending === "ar" ? "a" : "e");
        case "preterite": return stem + (ending === "ar" ? "ó" : "ió");
        // reír → reirá, oír → oirá (only the acute accent goes; ñ stays: enseñar → enseñará)
        case "future": return inf.replace(/í/g, "i") + "á";
        case "gerund": return stem + (ending === "ar" ? "ando" : "iendo");
        case "participle": return stem + (ending === "ar" ? "ado" : "ido");
        default: throw new Error("Unknown Spanish form: " + kind);
    }
}

const SPANISH_PATTERNS = {
    presentSimple: (f) => [f.present],
    presentContinuous: (f) => ["está", f.gerund],
    presentPerfect: (f) => ["ha", f.participle],
    presentPerfectContinuous: (f) => ["ha estado", f.gerund],
    pastSimple: (f) => [f.preterite],
    pastContinuous: (f) => ["estaba", f.gerund],
    pastPerfect: (f) => ["había", f.participle],
    futureWill: (f) => [f.future],
    futureGoingTo: (f) => ["va a", f.infinitive],
    futureContinuous: (f) => ["estará", f.gerund]
};

// "already" / "ya" goes before the verb in the perfect tenses
const BEFORE_VERB = { presentPerfect: true, pastPerfect: true };

function sentence(parts) {
    const text = parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

// Time expression of an example. Stative verbs keep only the ones a past action needs
// ("when I called", "before class"): "She loved animals yesterday" sounds odd
function exampleTime(verb, tense, language) {
    if (verb.stative && !["pastContinuous", "pastPerfect"].includes(tense.id)) return "";
    if (tense.id === "pastPerfect") return language === "en" ? "before class" : "antes de la clase";
    return language === "en" ? tense.timeEn : tense.timeEs;
}

const CONTINUOUS = ["presentContinuous", "presentPerfectContinuous", "pastContinuous", "futureContinuous"];

/**
 * @returns {{ tense, formEn, exampleEn, exampleEs, note }} one tense of a verb
 */
function conjugate(verb, tenseId) {
    const tense = TENSE_BY_ID[tenseId];
    if (!tense) throw new Error("Unknown tense: " + tenseId);
    const forms = englishForms(verb);
    const formEn = ENGLISH_PATTERNS[tenseId](forms);

    const already = BEFORE_VERB[tenseId] && !verb.stative;
    const enVerb = already ? formEn.replace(/^(has|had) /, "$1 already ") : formEn;
    const exampleEn = sentence(["She", enVerb, verb.objEn, tenseId === "presentPerfect" ? "" : exampleTime(verb, tense, "en")]);

    let exampleEs = null;
    if (verb.reviewed) {
        const infinitive = verb.es[0];
        const reflexive = /(ar|er|ir|ír)se$/.test(infinitive);
        const esForms = {};
        for (const kind of ["infinitive", "present", "preterite", "future", "gerund", "participle"]) {
            esForms[kind] = spanishForm(verb, kind, infinitive);
        }
        if (reflexive) esForms.infinitive = infinitive.slice(0, -2);
        const esVerb = SPANISH_PATTERNS[tenseId](esForms).join(" ");
        exampleEs = sentence(["Ella", already ? "ya" : "", reflexive ? "se" : "", esVerb, verb.objEs,
            tenseId === "presentPerfect" ? "" : exampleTime(verb, tense, "es")]);
    }

    const note = verb.stative && CONTINUOUS.includes(tenseId) ? "This verb is rarely used in continuous tenses." : "";
    return { tense: tense.label, formEn, exampleEn, exampleEs, note };
}

// ---------- Search ----------

function normalizeQuery(text) {
    return stripAccents(String(text).toLowerCase()).replace(/\s+/g, " ").trim();
}

// Every English form (base, -s, -ing, past, participle) → verbs, to find "went" → go
let verbFormIndex = null;
function formIndex() {
    if (verbFormIndex) return verbFormIndex;
    verbFormIndex = new Map();
    const add = (form, verb) => {
        const key = normalizeQuery(form);
        if (!verbFormIndex.has(key)) verbFormIndex.set(key, []);
        if (!verbFormIndex.get(key).includes(verb)) verbFormIndex.get(key).push(verb);
    };
    for (const verb of VERBS) {
        const forms = englishForms(verb);
        [forms.s3, forms.ing, forms.past, forms.participle].forEach(f => add(f, verb));
    }
    return verbFormIndex;
}

const MAX_RESULTS = 8;

function searchVerbs(query) {
    const q = normalizeQuery(query);
    if (!q) return [];
    const results = [];
    const push = (verb) => { if (!results.includes(verb) && results.length < MAX_RESULTS) results.push(verb); };
    // 1. Exact English base or Spanish infinitive
    VERBS.filter(v => normalizeQuery(v.base) === q || v.es.some(es => normalizeQuery(es) === q)).forEach(push);
    // 2. Conjugated English form (went → go)
    (formIndex().get(q) || []).forEach(push);
    // 3. Prefix while typing
    VERBS.filter(v => normalizeQuery(v.base).startsWith(q) || v.es.some(es => normalizeQuery(es).startsWith(q))).forEach(push);
    return results;
}

// ---------- Online lookup (verbs that are not in the list) ----------

const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const SPANISH_VERB = /^[a-záéíóúñü]*(ar|er|ir|ír)(se)?$/;

function cleanTranslation(text) {
    return String(text || "").toLowerCase().replace(/[.!?¿¡"]/g, "").replace(/^(to|para)\s+/, "").replace(/\s+/g, " ").trim();
}

async function translationCandidates(query, from, to) {
    const data = await fetchJson(MYMEMORY_URL + "?" + new URLSearchParams({ q: query, langpair: from + "|" + to }).toString());
    const texts = [data.responseData && data.responseData.translatedText].concat((data.matches || []).map(m => m.translation));
    return Array.from(new Set(texts.map(cleanTranslation).filter(Boolean)));
}

async function isEnglishVerb(word) {
    if (!/^[a-z]+$/.test(word)) return false;
    const result = await datamuse({ sp: word, md: "p", max: 1 });
    return result.length > 0 && result[0].word === word && (result[0].tags || []).includes("v");
}

// true when the last lookup failed because the public sources could not be reached
let lastLookupOffline = false;

/**
 * Looks up a verb that is not in the list with MyMemory (translation) and Datamuse (is it a verb?).
 * @returns {Promise<object|null>} a verb with reviewed: false, or null
 */
async function lookupVerbOnline(query) {
    const q = normalizeQuery(query).replace(/^to /, "");
    lastLookupOffline = false;
    if (!q || UNSAFE.test(q)) return null;
    try {
        // Looks Spanish (-ar/-er/-ir): try Spanish → English first
        if (SPANISH_VERB.test(q)) {
            for (const candidate of await translationCandidates(q, "es", "en")) {
                if (!UNSAFE.test(candidate) && await isEnglishVerb(candidate)) {
                    return { base: candidate, es: [q], objEn: "", objEs: "", reviewed: false };
                }
            }
        }
        // English words can end in -er too (whisper, answer): try English → Spanish
        if (!(await isEnglishVerb(q))) return null;
        for (const candidate of await translationCandidates(q, "en", "es")) {
            if (SPANISH_VERB.test(candidate) && !UNSAFE.test(candidate)) {
                return { base: q, es: [candidate], objEn: "", objEs: "", reviewed: false };
            }
        }
        return null;
    } catch (error) {
        lastLookupOffline = true;
        return null;
    }
}
