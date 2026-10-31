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
        welcome: "Hello! I'm Anya-chan. Write your name and choose a subject!",
        // Backup of the progress (GAMES-19)
        backupTitle: "💾 My backup",
        backupNote: "Take your prizes, your pets' clothes, your guides and your notebook to another tablet, phone or computer. Save a file or copy a code, and open it on the other device.",
        backupNotebook: "Include my notebook",
        backupDownload: "💾 Download my backup",
        backupCopy: "📋 Copy my code",
        backupRestoreTitle: "📥 Bring my progress to this device",
        backupFile: "📂 Choose my backup file",
        backupPaste: "…or paste your code here (it starts with GAMES)",
        backupRestore: "📥 Restore my progress",
        backupDone: "✅ Your backup is ready: keep the file {file} in a safe place (or send it to yourself).",
        backupCopied: "📋 Code copied! Paste it in a message to yourself or on the other device.",
        backupCopyManual: "Your browser did not let me copy it: select the code below and copy it.",
        backupRestored: "✅ Welcome back, {name}! New on this device: prizes {prizes} · guides {exams} · notebook pages {pages}. Nothing was deleted.",
        backupTampered: "⚠️ This backup is incomplete or was changed, so I did not use it. Nothing was modified.",
        backupNotBackup: "⚠️ That is not a backup of the game. Nothing was modified.",
        backupVersion: "⚠️ This backup comes from a newer version of the game. Update the game and try again.",
        backupNeedName: "✏️ Write your name first, so I know whose progress to save.",
        backupEmpty: "🌱 There is no progress to save yet: finish a guide or win a prize first.",
        backupNothing: "✏️ Choose your backup file or paste your code first.",
        backupCannotSave: "⚠️ This browser does not let me save on this device."
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
        welcome: "¡Hola! Soy Anya-chan. ¡Escribe tu nombre y elige una materia!",
        backupTitle: "💾 Mi respaldo",
        backupNote: "Lleva tus premios, la ropa de tus mascotas, tus guías y tu cuaderno a otra tablet, celular o computadora. Guarda un archivo o copia un código, y ábrelo en el otro equipo.",
        backupNotebook: "Incluir mi cuaderno",
        backupDownload: "💾 Descargar mi respaldo",
        backupCopy: "📋 Copiar mi código",
        backupRestoreTitle: "📥 Traer mi avance a este equipo",
        backupFile: "📂 Elegir mi archivo de respaldo",
        backupPaste: "…o pega aquí tu código (empieza con GAMES)",
        backupRestore: "📥 Recuperar mi avance",
        backupDone: "✅ Tu respaldo está listo: guarda el archivo {file} en un lugar seguro (o envíatelo).",
        backupCopied: "📋 ¡Código copiado! Pégalo en un mensaje para ti o en el otro equipo.",
        backupCopyManual: "Tu navegador no me dejó copiarlo: selecciona el código de abajo y cópialo.",
        backupRestored: "✅ ¡Qué gusto verte de nuevo, {name}! Nuevo en este equipo: premios {prizes} · guías {exams} · páginas del cuaderno {pages}. No se borró nada.",
        backupTampered: "⚠️ Este respaldo está incompleto o fue modificado, así que no lo usé. No se cambió nada.",
        backupNotBackup: "⚠️ Eso no es un respaldo del juego. No se cambió nada.",
        backupVersion: "⚠️ Este respaldo es de una versión más nueva del juego. Actualiza el juego e inténtalo otra vez.",
        backupNeedName: "✏️ Primero escribe tu nombre, para saber de quién es el avance.",
        backupEmpty: "🌱 Todavía no hay avance que guardar: termina una guía o gana un premio primero.",
        backupNothing: "✏️ Primero elige tu archivo de respaldo o pega tu código.",
        backupCannotSave: "⚠️ Este navegador no me deja guardar en este equipo."
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
    document.querySelectorAll("[data-tp]").forEach(node => { node.placeholder = text[node.dataset.tp]; });
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

// ---------- Backup of the progress (GAMES-19) ----------

const fillText = (template, values) => template.replace(/\{(\w+)\}/g, (match, key) => String(values[key]));

function backupStatus(message, isError) {
    const status = document.getElementById("backup-status");
    status.innerText = message;
    status.className = "status" + (isError ? " error" : "");
}

// The backup of the student of the page, or null (with the reason on screen)
async function studentBackup() {
    const text = hubText();
    const name = studentName();
    if (!name) {
        backupStatus(text.backupNeedName, true);
        return null;
    }
    const storage = progressStorage();
    const key = studentKey(name);
    const pets = loadPetRewards(storage).store.students[key] || null;
    const progress = loadProgress(storage).store.students[key] || null;
    const pages = document.getElementById("backup-notebook").checked ? loadNotebook(storage).store.pages : [];
    if (!(pets && pets.owned.length) && !(progress && progress.exams.length) && !pages.length) {
        backupStatus(text.backupEmpty, true);
        return null;
    }
    return sealBackup(buildBackup({ name, pets, progress, notebook: pages.length ? pages : null, now: new Date() }));
}

async function downloadBackup() {
    const backup = await studentBackup();
    if (!backup) return;
    const file = backupFileName(backup.student.name, new Date());
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 1)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = file;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    backupStatus(fillText(hubText().backupDone, { file }));
}

async function copyBackupCode() {
    const backup = await studentBackup();
    if (!backup) return;
    const code = await encodeBackupCode(backup);
    // The code is always on screen too, in case the clipboard does not answer
    const box = document.getElementById("backup-code");
    box.value = code;
    box.classList.remove("hidden");
    box.focus();
    box.select();
    const timeout = new Promise((resolve, reject) => setTimeout(() => reject(new Error("timeout")), 2000));
    try {
        if (!navigator.clipboard) throw new Error("no clipboard");
        await Promise.race([navigator.clipboard.writeText(code), timeout]);
        backupStatus(hubText().backupCopied);
    } catch (error) {
        backupStatus(hubText().backupCopyManual);
    }
}

async function restoreBackup() {
    const text = hubText();
    const fileInput = document.getElementById("backup-file");
    const pasted = document.getElementById("backup-paste").value;
    const input = fileInput.files && fileInput.files[0] ? await fileInput.files[0].text() : pasted;
    if (!String(input).trim()) {
        backupStatus(text.backupNothing, true);
        return;
    }
    const result = await readBackupInput(input);
    if (!result.ok) {
        backupStatus(text[{ tampered: "backupTampered", version: "backupVersion" }[result.error] || "backupNotBackup"], true);
        return;
    }
    const storage = progressStorage();
    const stores = { pets: loadPetRewards(storage).store, progress: loadProgress(storage).store, notebook: loadNotebook(storage).store };
    const added = mergeBackup(stores, result.backup, document.getElementById("backup-notebook").checked);
    const saved = savePetRewards(storage, stores.pets) & saveProgress(storage, stores.progress) & saveNotebook(storage, stores.notebook);
    if (!saved) {
        backupStatus(text.backupCannotSave, true);
        return;
    }
    // The pets (my-pets.js) read their prizes again
    if (typeof petRewards !== "undefined") petRewards = null;
    const nameInput = document.getElementById("student-name");
    nameInput.value = added.name;
    nameInput.dispatchEvent(new Event("input"));
    fileInput.value = "";
    document.getElementById("backup-paste").value = "";
    backupStatus(fillText(text.backupRestored, added));
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
    document.getElementById("backup-download").addEventListener("click", downloadBackup);
    document.getElementById("backup-copy").addEventListener("click", copyBackupCode);
    document.getElementById("backup-restore").addEventListener("click", restoreBackup);
    // After the holidays (GAMES-16), which greet in the language of the page
    setTimeout(greetHub, 0);
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupHub);
    else setupHub();
}
