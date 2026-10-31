/* =====================================================================
   MAIN PAGE (GAMES-18): QuizA.html, to choose the subject. The student
   writes the name once, chooses the city of the weather and the language
   of the page (English by default), and sees a summary of the recent
   activity without grades (progress.js).
   ===================================================================== */

const HUB_TEXT = {
    en: {
        pageTitle: "5th Grade Study Hub",
        title: "🌟 My Study Hub 🌟",
        subtitle: "Choose what you want to study today.",
        language: "Language",
        name: "Your name",
        namePlaceholder: "Write your name",
        weatherOf: "Weather of",
        subjectsTitle: "📚 Subjects",
        englishTitle: "🔤 English",
        englishNote: "Grammar, reading, listening, writing, my notebook, verbs and grammar cards.",
        englishOpen: "▶ Open English",
        camposTitle: "📚 Español · Campos formativos",
        camposNote: "The 1st Trimester guide in Spanish: Lenguajes, Saberes y pensamiento científico, Ética, naturaleza y sociedades, and De lo humano y lo comunitario.",
        camposOpen: "▶ Open the guide",
        mathTitle: "🔢 Math",
        mathNote: "Coming soon! Math guides are on their way.",
        mathOpen: "⏳ Coming soon",
        summaryTitle: "📊 My recent activity",
        strengthsTitle: "✨ What you do great",
        improveTitle: "🎯 Your next challenges",
        improveNone: "🏅 Nothing to reinforce right now. Try a new guide to keep growing!",
        strengthsNone: "Keep practicing: your strengths will appear here very soon.",
        recentTitle: "🗓 Your latest guides",
        demo: "demo",
        cannotSave: "This browser does not let me save your activity.",
        welcome: "Hello! I'm Anya-chan. Write your name and choose a subject!"
    },
    es: {
        pageTitle: "Centro de estudio 5.º grado",
        title: "🌟 Mi centro de estudio 🌟",
        subtitle: "Elige qué quieres estudiar hoy.",
        language: "Idioma",
        name: "Tu nombre",
        namePlaceholder: "Escribe tu nombre",
        weatherOf: "Clima de",
        subjectsTitle: "📚 Materias",
        englishTitle: "🔤 Inglés",
        englishNote: "Gramática, lectura, listening, escritura, mi cuaderno, verbos y tarjetas de gramática.",
        englishOpen: "▶ Abrir Inglés",
        camposTitle: "📚 Español · Campos formativos",
        camposNote: "La guía del primer trimestre: Lenguajes, Saberes y pensamiento científico, Ética, naturaleza y sociedades, y De lo humano y lo comunitario.",
        camposOpen: "▶ Abrir la guía",
        mathTitle: "🔢 Matemáticas",
        mathNote: "¡Muy pronto! Las guías de matemáticas vienen en camino.",
        mathOpen: "⏳ Próximamente",
        summaryTitle: "📊 Mi actividad reciente",
        strengthsTitle: "✨ Lo que haces genial",
        improveTitle: "🎯 Tus próximos retos",
        improveNone: "🏅 Por ahora no hay nada que reforzar. ¡Prueba una guía nueva para seguir creciendo!",
        strengthsNone: "Sigue practicando: muy pronto aparecerán aquí tus fortalezas.",
        recentTitle: "🗓 Tus últimas guías",
        demo: "demo",
        cannotSave: "Este navegador no me deja guardar tu actividad.",
        welcome: "¡Hola! Soy Anya-chan. ¡Escribe tu nombre y elige una materia!"
    }
};

const hubText = () => HUB_TEXT[pageLang()];

// ---------- Helpers used by the shared files (pets, prizes, holidays) ----------

function tutor(avatar, message) {
    document.getElementById("anime-avatar").innerText = avatar;
    document.getElementById("tutor-dialogue").innerText = message;
}

function studentName() {
    return document.getElementById("student-name").value.trim();
}

// ---------- Texts and summary ----------

function renderHubTexts() {
    const text = hubText();
    document.title = text.pageTitle;
    document.querySelectorAll("[data-t]").forEach(node => { node.textContent = text[node.dataset.t]; });
    document.getElementById("student-name").placeholder = text.namePlaceholder;
    document.querySelectorAll(".hub-lang button").forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.lang === pageLang()));
    });
}

function renderHubSummary() {
    const text = hubText();
    const { store, available } = loadProgress(progressStorage());
    // Without guides yet, the summary still greets the student by name
    const record = store.students[studentKey(studentName())] || { name: studentName(), exams: [] };
    const summary = summarizeProgress(record, pageLang());
    const list = (items) => '<ul>' + items.map(item => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>';
    let html = '<h2>' + escapeHtml(text.summaryTitle) + '</h2>' +
        '<p class="hub-headline">' + escapeHtml(summary.headline) + '</p>';
    // The prizes won before this summary existed also show the student's effort
    const pets = loadPetRewards(progressStorage()).store.students[studentKey(studentName())];
    const prizes = prizesLine(pets ? pets.owned : [], pageLang());
    if (prizes) html += '<p class="hub-prizes">' + escapeHtml(prizes) + '</p>';
    if (!summary.empty) {
        html += summary.subjects.map(s => '<p class="hub-subject">' + escapeHtml(s.message) + '</p>').join('');
        html += '<div class="hub-columns"><div class="hub-box hub-strong"><h3>' + escapeHtml(text.strengthsTitle) + '</h3>' +
            (summary.strengths.length ? list(summary.strengths) : '<p class="note">' + escapeHtml(text.strengthsNone) + '</p>') + '</div>' +
            '<div class="hub-box hub-improve"><h3>' + escapeHtml(text.improveTitle) + '</h3>' +
            (summary.improve.length ? list(summary.improve) : '<p class="note">' + escapeHtml(text.improveNone) + '</p>') + '</div></div>';
        html += '<h3>' + escapeHtml(text.recentTitle) + '</h3><ul class="hub-recent">' + summary.recent.map(r =>
            '<li><span class="hub-emoji" aria-hidden="true">' + r.emoji + '</span> <b>' + escapeHtml(r.date) + '</b> · ' + escapeHtml(r.subject) +
            ' · ' + escapeHtml(r.title) + '</li>').join('') + '</ul>';
    }
    if (!available) html += '<p class="status error">' + escapeHtml(text.cannotSave) + '</p>';
    document.getElementById("hub-summary").innerHTML = html;
}

// ---------- Language (clarification 2: English by default, remembered) ----------

function refreshSharedTexts() {
    // Weather (GAMES-15): summary and the first option of the city
    if (typeof applyEnvironment === "function") {
        envDrawn = "";
        applyEnvironment();
        const select = document.getElementById("env-city");
        if (select && select.options.length) select.options[0].text = ENV_TEXT[pageLang()].whereIAm;
    }
    // Pets (GAMES-9): the button and their names
    const toggle = document.getElementById("pets-toggle");
    if (toggle && typeof petsToggleLabel === "function") {
        const label = petsToggleLabel(document.body.classList.contains("pets-hidden"));
        toggle.querySelector(".pets-toggle-text").textContent = label;
        toggle.setAttribute("aria-label", label);
        document.querySelectorAll("#pets .pet").forEach(button => {
            const kind = button.classList.contains("pet-cat") ? "cat" : "dog";
            button.setAttribute("aria-label", pageLang() === "es" ? PETS[kind].nameEs : PETS[kind].name);
        });
    }
}

function greetHub() {
    if (typeof holidayIds !== "undefined" && holidayIds.length) tutor(HOLIDAY_BY_ID[holidayIds[0]].emoji, holidayGreeting(holidayIds, pageLang(), false));
    else tutor("👧🏻", hubText().welcome);
}

function setHubLang(lang) {
    document.documentElement.lang = lang;
    try { window.localStorage.setItem(LANG_KEY, lang); } catch (error) { /* only for this visit */ }
    renderHubTexts();
    renderHubSummary();
    refreshSharedTexts();
    greetHub();
}

function setupHub() {
    renderHubTexts();
    renderHubSummary();
    document.querySelectorAll(".hub-lang button").forEach(button => {
        button.addEventListener("click", () => setHubLang(button.dataset.lang));
    });
    document.getElementById("student-name").addEventListener("input", renderHubSummary);
    // After the holidays (GAMES-16), which greet in the language of the page
    setTimeout(greetHub, 0);
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupHub);
    else setupHub();
}
