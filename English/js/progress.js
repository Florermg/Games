/* =====================================================================
   PROGRESS (GAMES-18): every finished guide (English and campos) is kept
   per student, and the main page shows a summary of the recent activity
   WITHOUT grades: an encouraging phrase by level, what the student does
   well and what to reinforce, with something concrete to do.
   The pure part is tested in Node; saveFinishedExam uses the browser.
   ===================================================================== */

const PROGRESS_KEY = "games-progress-v1";
const MAX_EXAMS = 50;

// Area of an English guide without groups (Listening, Writing…)
const ENGLISH_KIND_AREAS = { gvs: "Grammar", rl: "Reading", writing: "Writing", listening: "Listening" };
const ENGLISH_AREA_ES = { Grammar: "Gramática", Vocabulary: "Vocabulario", Spelling: "Ortografía", Reading: "Lectura", Listening: "Comprensión auditiva", Writing: "Escritura" };

// ---------- Saving ----------

function emptyProgress() {
    return { version: 1, students: {} };
}

function cleanProgress(raw) {
    const store = emptyProgress();
    if (!raw || typeof raw !== "object" || !raw.students || typeof raw.students !== "object") return store;
    for (const [key, record] of Object.entries(raw.students)) {
        if (!record || !Array.isArray(record.exams)) continue;
        const exams = record.exams.filter(e => e && typeof e.subject === "string" && Array.isArray(e.areas)).slice(-MAX_EXAMS);
        store.students[key] = { name: String(record.name || ""), exams };
    }
    return store;
}

function loadProgress(storage) {
    try {
        const text = storage.getItem(PROGRESS_KEY);
        let raw = null;
        try { raw = text ? JSON.parse(text) : null; } catch (error) { raw = null; }
        return { store: cleanProgress(raw), available: true };
    } catch (error) {
        return { store: emptyProgress(), available: false };
    }
}

function saveProgress(storage, store) {
    try {
        storage.setItem(PROGRESS_KEY, JSON.stringify(store));
        return true;
    } catch (error) {
        return false;
    }
}

/** Adds a finished guide to the student (same name rules as the prizes), keeping the last 50. */
function recordExam(store, name, exam) {
    const key = studentKey(name);
    const record = store.students[key] || (store.students[key] = { name: String(name || "").trim() || "Guest", exams: [] });
    if (String(name || "").trim()) record.name = String(name).trim();
    record.exams.push(exam);
    if (record.exams.length > MAX_EXAMS) record.exams.splice(0, record.exams.length - MAX_EXAMS);
    return record;
}

// ---------- Exams from the guides ----------

function addArea(areas, id, label, score, max, extra) {
    if (!max) return;
    let target = areas.find(a => a.id === id);
    if (!target) areas.push(target = Object.assign({ id, label, score: 0, max: 0 }, extra || {}));
    target.score += score;
    target.max += max;
}

/** English guide: one area per group of sections; scores are the { score, max } of each section. */
function englishExamFromGuide(guide, scores, date) {
    const areas = [];
    guide.sections.forEach((section, i) => {
        const label = section.group || ENGLISH_KIND_AREAS[guide.kind] || "English";
        addArea(areas, "english:" + label, label, scores[i].score, scores[i].max);
    });
    return { date: date.toISOString(), subject: "english", title: guide.title, demo: isDemoGuide(guide), areas };
}

/** Campos guide (GAMES-17): one area per topic, from the right answers of each question. */
function camposExamFromGuide(guide, states, date) {
    const areas = [];
    guide.sections.forEach((section, s) => {
        section.items.forEach((item, i) => {
            const tema = TEMA_BY_ID[item.tema];
            const campo = CAMPO_BY_ID[tema.campo];
            addArea(areas, "campos:" + tema.id, tema.title, states[s].correct[i] ? 1 : 0, 1, { campo: campo.id, campoName: campo.name });
        });
    });
    return { date: date.toISOString(), subject: "campos", title: guide.title, demo: isDemoGuide(guide), areas };
}

// ---------- Summary without grades (FR-005) ----------

/** star ≥ 90 %, great ≥ 75 %, good ≥ 60 %, growing below. */
function levelOf(ratio) {
    if (ratio >= 0.9) return "star";
    if (ratio >= 0.75) return "great";
    if (ratio >= 0.6) return "good";
    return "growing";
}

const LEVEL_EMOJI = { star: "🌟", great: "🚀", good: "💪", growing: "🌱" };

const PROGRESS_TEXT = {
    en: {
        guest: "friend",
        subjects: { english: "English", campos: "Campos formativos" },
        headline: {
            star: (n) => "🌟 " + n + ", you are shining! You master almost everything you practice.",
            great: (n) => "🚀 Great work, " + n + "! You are learning a lot and it shows.",
            good: (n) => "💪 You are on the right track, " + n + "! Every guide makes you stronger.",
            growing: (n) => "🌱 " + n + ", every expert started like this! Keep practicing and you will see how much you grow."
        },
        subject: {
            star: (s) => "🌟 In " + s + " you are a star. Keep it up!",
            great: (s) => "🚀 In " + s + " you are doing really well.",
            good: (s) => "💪 In " + s + " you are moving forward. A little more practice and you will fly!",
            growing: (s) => "🌱 " + s + " is growing in you. Practice a little every day."
        },
        strength: (label) => "⭐ You master " + label + ".",
        improveEnglish: {
            Grammar: (label) => "🎯 " + label + ": open the Grammar Cards and then generate a new Grammar guide.",
            Vocabulary: (label) => "🎯 " + label + ": generate a new Grammar, Vocabulary & Spelling guide and read the definitions out loud.",
            Spelling: (label) => "🎯 " + label + ": practice the dictation of a new guide and write the words in My Notebook.",
            Reading: (label) => "🎯 " + label + ": generate a new Reading & Listening guide and read the text twice before answering.",
            Listening: (label) => "🎯 " + label + ": generate a Listening and listen first with subtitles.",
            Writing: (label) => "🎯 " + label + ": write a few lines in My Notebook and check them with Anya-chan.",
            other: (label) => "🎯 " + label + ": generate a new English guide to practice it."
        },
        improveCampos: (label, campo) => "🎯 " + label + ": review its study card and generate a new guide of " + campo + ".",
        empty: (n) => "👋 Hi, " + n + "! Choose a subject and finish your first guide: here you will see how you are doing."
    },
    es: {
        guest: "amiga o amigo",
        subjects: { english: "Inglés", campos: "Campos formativos" },
        headline: {
            star: (n) => "🌟 ¡" + n + ", estás brillando! Dominas casi todo lo que practicas.",
            great: (n) => "🚀 ¡Muy buen trabajo, " + n + "! Estás aprendiendo mucho y se nota.",
            good: (n) => "💪 ¡Vas por buen camino, " + n + "! Cada guía te hace más fuerte.",
            growing: (n) => "🌱 ¡" + n + ", así empiezan los expertos! Sigue practicando y verás cuánto creces."
        },
        subject: {
            star: (s) => "🌟 En " + s + " eres una estrella. ¡Sigue así!",
            great: (s) => "🚀 En " + s + " vas muy bien.",
            good: (s) => "💪 En " + s + " vas avanzando. ¡Un poco más de práctica y vas a volar!",
            growing: (s) => "🌱 " + s + " está creciendo en ti. Practica un poquito cada día."
        },
        strength: (label) => "⭐ Dominas " + label + ".",
        improveEnglish: {
            Grammar: (label) => "🎯 " + label + ": abre las Grammar Cards y luego genera una guía nueva de gramática.",
            Vocabulary: (label) => "🎯 " + label + ": genera una guía nueva de Grammar, Vocabulary & Spelling y lee las definiciones en voz alta.",
            Spelling: (label) => "🎯 " + label + ": practica el dictado de una guía nueva y escribe las palabras en My Notebook.",
            Reading: (label) => "🎯 " + label + ": genera una guía nueva de Reading & Listening y lee el texto dos veces antes de contestar.",
            Listening: (label) => "🎯 " + label + ": genera un Listening y escúchalo primero con subtítulos.",
            Writing: (label) => "🎯 " + label + ": escribe unas líneas en My Notebook y revísalas con Anya-chan.",
            other: (label) => "🎯 " + label + ": genera una guía nueva de inglés para practicarlo."
        },
        improveCampos: (label, campo) => "🎯 Repasa la tarjeta «" + label + "» y genera una guía de " + campo + ".",
        empty: (n) => "👋 ¡Hola, " + n + "! Elige una materia y termina tu primera guía: aquí verás cómo vas."
    }
};

const ratioOf = (score, max) => max ? score / max : 0;

function areaLabel(area, lang) {
    return area.id.startsWith("english:") && lang === "es" ? ENGLISH_AREA_ES[area.label] || area.label : area.label;
}

/**
 * @param {?{name, exams}} record the student's activity (null when there is none)
 * @returns {{ empty, headline, subjects: [{subject, label, message}], strengths, improve, recent: [{date, subject, title, emoji}] }}
 */
function summarizeProgress(record, lang = pageLang()) {
    const text = PROGRESS_TEXT[lang];
    const name = record && record.name && record.name !== "Guest" ? record.name : text.guest;
    const exams = record ? record.exams : [];
    if (!exams.length) return { empty: true, headline: text.empty(name), subjects: [], strengths: [], improve: [], recent: [] };

    // Every area of every exam, added up
    const areas = [];
    let score = 0, max = 0;
    const bySubject = {};
    for (const exam of exams) {
        for (const area of exam.areas) {
            addArea(areas, area.id, area.label, area.score, area.max, area.campo ? { campo: area.campo, campoName: area.campoName, subject: exam.subject } : { subject: exam.subject });
            score += area.score;
            max += area.max;
            const subject = bySubject[exam.subject] || (bySubject[exam.subject] = { score: 0, max: 0 });
            subject.score += area.score;
            subject.max += area.max;
        }
    }
    const subjects = ["english", "campos"].filter(id => bySubject[id] && bySubject[id].max).map(id => ({
        subject: id, label: text.subjects[id], message: text.subject[levelOf(ratioOf(bySubject[id].score, bySubject[id].max))](text.subjects[id])
    }));
    const measured = areas.filter(a => a.max >= 2);
    const strengths = measured.filter(a => ratioOf(a.score, a.max) >= 0.85)
        .sort((a, b) => ratioOf(b.score, b.max) - ratioOf(a.score, a.max) || b.max - a.max).slice(0, 3)
        .map(a => text.strength(areaLabel(a, lang)));
    const improve = measured.filter(a => ratioOf(a.score, a.max) < 0.7)
        .sort((a, b) => ratioOf(a.score, a.max) - ratioOf(b.score, b.max) || b.max - a.max).slice(0, 3)
        .map(a => a.subject === "campos" ? text.improveCampos(areaLabel(a, lang), a.campoName)
            : (text.improveEnglish[a.label] || text.improveEnglish.other)(areaLabel(a, lang)));
    const recent = exams.slice(-8).reverse().map(exam => {
        const total = exam.areas.reduce((n, a) => ({ score: n.score + a.score, max: n.max + a.max }), { score: 0, max: 0 });
        return {
            date: new Date(exam.date).toLocaleDateString(lang === "es" ? "es-MX" : "en-US", { day: "numeric", month: "short" }),
            subject: text.subjects[exam.subject] || exam.subject,
            title: exam.title,
            emoji: LEVEL_EMOJI[levelOf(ratioOf(total.score, total.max))]
        };
    });
    return { empty: false, headline: text.headline[levelOf(ratioOf(score, max))](name), subjects, strengths, improve, recent };
}

// ---------- Prizes already won (GAMES-14): they count from before this summary existed ----------

/** "🐾 You have already won 3 accessories for your pets. The latest one: Witch hat. Keep it up!" ("" without prizes) */
function prizesLine(owned, lang = pageLang()) {
    const valid = (owned || []).filter(o => o && ACCESSORY_BY_ID[o.id]);
    if (!valid.length) return "";
    const latest = valid.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
    const name = accessoryName(ACCESSORY_BY_ID[latest.id], lang);
    const n = valid.length;
    return lang === "es"
        ? "🐾 Ya ganaste " + n + (n === 1 ? " accesorio" : " accesorios") + " para tus mascotas. El último: " + name + ". ¡Sigue así!"
        : "🐾 You have already won " + n + (n === 1 ? " accessory" : " accessories") + " for your pets. The latest one: " + name + ". Keep it up!";
}

// ---------- In the browser ----------

function progressStorage() {
    try {
        if (window.localStorage) return window.localStorage;
    } catch (error) { /* blocked */ }
    const blocked = () => { throw new Error("Storage is not available"); };
    return { getItem: blocked, setItem: blocked };
}

/** Called by the guides when they finish: keeps the exam for the student of the page. */
function saveFinishedExam(exam) {
    const storage = progressStorage();
    const { store } = loadProgress(storage);
    recordExam(store, studentName(), exam);
    return saveProgress(storage, store);
}
