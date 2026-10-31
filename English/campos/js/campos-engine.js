/* =====================================================================
   PANTALLA DE LA GUÍA (GAMES-17): menú, guía, revisión con 2 intentos por
   sección (un punto por pregunta), resultados con promedio sobre 10,
   impresión y tarjetas de repaso. Igual que el juego de inglés
   (English/js/engine.js), en español, con las mismas clases de CSS.
   ===================================================================== */

const CAMPOS_ATTEMPTS = 2;

let currentGuide = null;
let sectionStates = [];
let finishWarned = false;

// La voz en español (GAMES-11): la que tenga el navegador
Speech.lang = "es-MX";

const camposPhrases = {
    allCorrect: ["✨ ¡Increíble! ¡Todo está correcto!", "🎉 ¡Perfecto! ¡Muy buen trabajo!", "⭐ ¡Todo bien! ¡Sigue así!"],
    someWrong: ["💡 ¡Casi! Lee las pistas e inténtalo otra vez.", "🐾 ¡Buen intento! Lee las pistas en naranja.", "💭 Algunas respuestas necesitan otra mirada. ¡Tú puedes!"],
    outOfAttempts: "📚 Terminamos esta sección. Lee las respuestas correctas en verde."
};

const SECTION_LABELS = {
    choice: "Opción múltiple", truefalse: "Verdadero o falso", match: "Relacionar", bank: "Banco de palabras", classify: "Clasificar", open: "Respuesta abierta"
};

// ---------- Ayudantes (los usan también las mascotas, el ambiente y las festividades) ----------

function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
}

function tutor(avatar, message) {
    document.getElementById('anime-avatar').innerText = avatar;
    document.getElementById('tutor-dialogue').innerText = message;
}

function studentName() {
    return document.getElementById('student-name').value.trim();
}

const stripTagsEs = (html) => String(html).replace(/<[^>]+>/g, "");
const pickOne = (list) => list[Math.floor(Math.random() * list.length)];
const letterAt = (index) => "abcdefghijklmnopqrstuvwxyz"[index];
const temaLabel = (id) => CAMPO_BY_ID[TEMA_BY_ID[id].campo].emoji + " " + TEMA_BY_ID[id].title;

// ---------- Secciones ----------

// Botones de opciones: la respuesta queda en row.dataset.response
function optionButtons(row, labels, inline) {
    const options = el('div', 'options' + (inline ? ' inline-options' : ''));
    labels.forEach((label, index) => {
        const button = el('button', 'option', escapeHtml(label));
        button.type = "button";
        button.onclick = () => {
            options.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');
            row.dataset.response = String(index);
            row.classList.remove('wrong');
        };
        options.appendChild(button);
    });
    return options;
}

function questionRow(section, item, i) {
    const row = el('div', 'item');
    row.appendChild(el('div', 'item-text', "<b>" + (i + 1) + ". " + escapeHtml(item.text) + "</b>"));
    return row;
}

function blankText(text, control) {
    const wrapper = el('span');
    const parts = text.split("___");
    wrapper.appendChild(document.createTextNode(parts[0]));
    wrapper.appendChild(control);
    wrapper.appendChild(document.createTextNode(parts.slice(1).join("___")));
    return wrapper;
}

const CAMPOS_RENDERERS = {
    choice(section, box) {
        section.items.forEach((item, i) => {
            const row = questionRow(section, item, i);
            row.appendChild(optionButtons(row, item.options.map((o, k) => letterAt(k) + ") " + o), false));
            box.appendChild(row);
        });
    },

    truefalse(section, box) {
        section.items.forEach((item, i) => {
            const row = questionRow(section, item, i);
            row.appendChild(optionButtons(row, item.options, true));
            box.appendChild(row);
        });
    },

    classify(section, box) {
        box.appendChild(el('div', 'word-bank', section.categories.map(escapeHtml).join(" / ")));
        section.items.forEach((item, i) => {
            const row = questionRow(section, item, i);
            row.appendChild(optionButtons(row, section.categories, true));
            box.appendChild(row);
        });
    },

    match(section, box) {
        const grid = el('div', 'match-grid');
        const terms = el('div');
        section.items.forEach((item, i) => {
            const row = el('div', 'item');
            const select = el('select');
            select.appendChild(new Option("—", ""));
            section.definitions.forEach(d => select.appendChild(new Option(d.letter, d.letter)));
            row.appendChild(document.createTextNode((i + 1) + ". " + item.text + "  "));
            row.appendChild(select);
            terms.appendChild(row);
        });
        const definitions = el('div', 'definition-list',
            "<b>Definiciones</b>" + section.definitions.map(d => "<div><b>" + d.letter + ".</b> " + escapeHtml(d.text) + "</div>").join(""));
        grid.append(terms, definitions);
        box.appendChild(grid);
    },

    bank(section, box) {
        box.appendChild(el('div', 'word-bank', section.bank.map(escapeHtml).join(" / ")));
        section.items.forEach((item, i) => {
            const row = el('div', 'item');
            const select = el('select');
            select.appendChild(new Option("— elige —", ""));
            section.bank.forEach(word => select.appendChild(new Option(word, word)));
            const line = el('div', 'item-text');
            line.appendChild(document.createTextNode(letterAt(i) + ". "));
            line.appendChild(blankText(item.text, select));
            row.appendChild(line);
            box.appendChild(row);
        });
    },

    open(section, box) {
        section.items.forEach((item, i) => {
            const row = questionRow(section, item, i);
            const area = el('textarea', 'open-answer');
            area.rows = 3;
            area.placeholder = "Escribe tu respuesta con tus palabras...";
            area.setAttribute('aria-label', item.text);
            row.appendChild(area);
            box.appendChild(row);
        });
    }
};

function renderCamposGuide(guide) {
    const body = document.getElementById('sheet-body');
    body.innerHTML = "";
    const header = el('div', 'sheet-header');
    header.appendChild(el('h1', '', escapeHtml(guide.title)));
    header.appendChild(el('h3', '', escapeHtml(guide.subtitle)));
    const today = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
    header.appendChild(el('div', 'sheet-meta',
        "<b>Nombre:</b> " + (escapeHtml(studentName()) || "_______________") +
        " &nbsp; <b>Fecha:</b> " + today + " &nbsp; <b>Promedio:</b> <span id='sheet-average'>____</span>"));
    body.appendChild(header);

    guide.sections.forEach((section, index) => {
        const box = el('div', 'section');
        box.id = "section-" + index;
        box.appendChild(el('div', 'group-label', escapeHtml(SECTION_LABELS[section.type])));
        box.appendChild(el('div', 'section-title', escapeHtml(section.title)));
        CAMPOS_RENDERERS[section.type](section, box);
        const footer = el('div', 'section-footer');
        const button = el('button', 'main-btn btn-secondary', "Revisar respuestas ✔");
        button.onclick = () => checkCamposSection(index);
        footer.append(button, el('span', 'section-score', ""));
        box.appendChild(footer);
        body.appendChild(box);
        // Cambiar una respuesta mal le quita la marca roja
        box.querySelectorAll('.item').forEach(row => {
            row.querySelectorAll('select, input, textarea').forEach(control => {
                control.addEventListener('input', () => row.classList.remove('wrong'));
                control.addEventListener('change', () => row.classList.remove('wrong'));
            });
        });
    });
}

// ---------- Revisión ----------

function itemRows(index) {
    return Array.from(document.querySelectorAll('#section-' + index + ' .item'));
}

function readCamposResponse(section, row) {
    if (["choice", "truefalse", "classify"].includes(section.type)) return row.dataset.response === undefined ? "" : row.dataset.response;
    const control = row.querySelector('select, input, textarea');
    return control ? control.value : "";
}

function lockRow(row) {
    row.querySelectorAll('select, input, textarea, button.option').forEach(control => { control.disabled = true; });
}

function setFeedback(row, className, html) {
    let feedback = row.querySelector('.feedback');
    if (!feedback) {
        feedback = el('div', 'feedback');
        row.appendChild(feedback);
    }
    feedback.className = 'feedback ' + className;
    feedback.innerHTML = html;
}

function checkCamposSection(index) {
    const section = currentGuide.sections[index];
    const state = sectionStates[index];
    if (state.done) return;
    const rows = itemRows(index);
    if (rows.filter((row, i) => !state.correct[i]).some(row => readCamposResponse(section, row).trim() === "")) {
        tutor("✏️", "¡Contesta todas las preguntas de esta sección antes de revisar!");
        return;
    }
    const attempt = CAMPOS_ATTEMPTS - state.attemptsLeft + 1;
    state.attemptsLeft--;
    rows.forEach((row, i) => {
        if (state.correct[i]) return;
        const item = section.items[i];
        if (isCorrectCampos(section, item, readCamposResponse(section, row))) {
            state.correct[i] = attempt;
            row.classList.remove('wrong');
            row.classList.add('correct');
            setFeedback(row, 'answer', "✔ ¡Correcto!" + (section.type === "open" ? "<br>📖 Respuesta modelo: " + escapeHtml(item.model) : ""));
            lockRow(row);
        } else {
            row.classList.add('wrong');
            if (state.attemptsLeft > 0 && item.tip) setFeedback(row, 'tip', "💡 " + escapeHtml(item.tip));
        }
    });

    const allCorrect = state.correct.every(Boolean);
    const box = document.getElementById('section-' + index);
    const button = box.querySelector('.section-footer .main-btn');
    if (allCorrect || state.attemptsLeft === 0) {
        state.done = true;
        box.classList.add('done');
        button.disabled = true;
        button.innerText = "Listo ✔";
        rows.forEach((row, i) => {
            lockRow(row);
            if (state.correct[i]) return;
            const item = section.items[i];
            const answer = correctAnswerTextCampos(section, item);
            setFeedback(row, 'answer', (section.type === "open" ? "✔ Respuesta modelo: <b>" : "✔ Respuesta correcta: <b>") + escapeHtml(answer) + "</b>" +
                (item.explanation && item.explanation !== answer ? "<br>📖 " + escapeHtml(item.explanation) : ""));
            const buttons = row.querySelectorAll('.option');
            if (buttons.length) buttons[item.answer].classList.add('right-answer');
        });
        if (allCorrect) tutor("🌸", pickOne(camposPhrases.allCorrect));
        else tutor("🐾", camposPhrases.outOfAttempts);
    } else {
        button.innerText = "Revisar otra vez ✔ (queda 1 intento)";
        tutor("💧", pickOne(camposPhrases.someWrong));
    }
    updateCamposScores();
}

// ---------- Puntos y resultados ----------

function updateCamposScores() {
    let score = 0;
    let max = 0;
    currentGuide.sections.forEach((section, index) => {
        const result = scoreSectionCampos(section, sectionStates[index]);
        score += result.score;
        max += result.max;
        const label = document.querySelector('#section-' + index + ' .section-footer .section-score');
        if (label && sectionStates[index].done) label.innerText = "⭐ " + result.score + " / " + result.max;
    });
    document.getElementById('score-pill').innerText = "⭐ " + score + " / " + max + " pts";
    return { score, max };
}

function finishCamposGuide() {
    const pending = sectionStates.filter(s => !s.done).length;
    if (pending && !finishWarned) {
        finishWarned = true;
        tutor("🤔", "Te falta revisar " + pending + (pending === 1 ? " sección" : " secciones") + ". Presiona «Terminar» otra vez para ver tus resultados de todos modos.");
        return;
    }
    Speech.stop();
    const { score, max } = updateCamposScores();
    const average = computeAverage(score, max);
    document.getElementById('sheet-average').innerText = average;
    document.getElementById('sheet-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    window.scrollTo(0, 0);

    const name = studentName();
    document.getElementById('final-score').innerText = score + " / " + max + " pts";
    document.getElementById('final-average').innerText = "Promedio: " + average + " / 10";
    let message;
    if (average >= 9) {
        message = "🌟 ¡Brillante" + (name ? ", " + name : "") + "! ¡Dominas casi todo!";
        tutor("🏆", "¡Qué calificación! ¡Estoy muy orgullosa de ti!");
    } else if (average >= 7) {
        message = "👍 ¡Muy bien" + (name ? ", " + name : "") + "! Repasa abajo lo que te faltó.";
        tutor("✨", "¡Buen esfuerzo! Lee las explicaciones para reforzar lo que aprendiste.");
    } else {
        message = "📚 ¡Buen intento" + (name ? ", " + name : "") + "! Repasa con calma las respuestas correctas.";
        tutor("🐾", "¡No te preocupes! Repasa las explicaciones y las tarjetas, y la próxima vez te irá mejor.");
    }
    document.getElementById('final-message').innerText = message;
    // Accesorio para las mascotas con una guía nueva al 100% (GAMES-14)
    if (typeof showPetReward === "function") showPetReward(currentGuide, score, max);

    const table = document.getElementById('result-table');
    table.innerHTML = "";
    currentGuide.sections.forEach((section, index) => {
        const result = scoreSectionCampos(section, sectionStates[index]);
        const row = table.insertRow();
        row.insertCell().innerText = SECTION_LABELS[section.type] + " · " + section.title.replace(/^\d+\.\s*/, "").replace(/\(un punto cada una\)/, "").trim();
        row.insertCell().innerText = result.score + " / " + result.max;
    });

    const review = document.getElementById('review-box');
    review.innerHTML = "";
    currentGuide.sections.forEach((section, index) => {
        section.items.forEach((item, i) => {
            if (sectionStates[index].correct[i]) return;
            const answer = correctAnswerTextCampos(section, item);
            review.appendChild(el('div', 'review-item',
                "<span class='note'>" + escapeHtml(temaLabel(item.tema)) + "</span><br>" +
                "<b>" + escapeHtml(item.text) + "</b><br>" +
                "<span style='color:var(--correct);'>✔ " + (section.type === "open" ? "Respuesta modelo" : "Respuesta correcta") + ": <b>" + escapeHtml(answer) + "</b></span>" +
                (item.explanation && item.explanation !== answer ? "<br><span style='color:#555; font-size:0.95em;'>💡 <i>" + escapeHtml(item.explanation) + "</i></span>" : "")));
        });
    });
    if (!review.children.length) {
        review.innerHTML = "<p style='color:var(--correct); font-weight:bold; text-align:center;'>🎉 ¡Increíble! No tuviste errores al final.</p>";
    }
}

// ---------- Pantallas ----------

function showScreen(id) {
    ['menu-screen', 'sheet-screen', 'results-screen'].forEach(s => document.getElementById(s).classList.toggle('hidden', s !== id));
    document.querySelectorAll('.reference-screen').forEach(screen => screen.classList.toggle('hidden', screen.id !== id));
    window.scrollTo(0, 0);
}

function startCamposGuide(guide) {
    currentGuide = guide;
    finishWarned = false;
    sectionStates = guide.sections.map(section => ({ attemptsLeft: CAMPOS_ATTEMPTS, done: false, correct: section.items.map(() => 0) }));
    renderCamposGuide(guide);
    closePrintPanel();
    showScreen('sheet-screen');
    updateCamposScores();
    tutor("👧🏻", "¡Empecemos la guía! Tienes 2 intentos por sección.");
}

function backToMenu() {
    Speech.stop();
    closePrintPanel();
    showScreen('menu-screen');
    tutor("👧🏻", "¡Qué gusto verte de nuevo! Elige una guía para practicar.");
}

function playCamposDemo() {
    startCamposGuide(buildCamposDemo());
}

function setStatus(message, isError) {
    const status = document.getElementById('gen-status');
    status.innerText = message;
    status.className = "status" + (isError ? " error" : "");
}

function chosenCampos() {
    return Array.from(document.querySelectorAll('#campos-chips input:checked')).map(box => box.value);
}

function generateCamposClick() {
    try {
        const guide = generateCamposGuide({ campos: chosenCampos() });
        setStatus("");
        startCamposGuide(guide);
        tutor("✨", "¡Preparé una guía nueva solo para ti! Tienes 2 intentos por sección.");
    } catch (error) {
        setStatus(error.message, true);
        tutor("💧", error.message);
    }
}

// ---------- Impresión (GAMES-3) ----------

function closePrintPanel() {
    document.getElementById('print-panel').classList.add('hidden');
    document.getElementById('print-btn').setAttribute('aria-expanded', 'false');
}

function togglePrintPanel() {
    const panel = document.getElementById('print-panel');
    const opening = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !opening);
    document.getElementById('print-btn').setAttribute('aria-expanded', String(opening));
}

// Se imprime desde los datos de la guía, nunca desde la pantalla
function printCamposGuide(version) {
    if (!currentGuide) return;
    document.getElementById('print-area').innerHTML = buildCamposPrintHtml(currentGuide, version);
    closePrintPanel();
    tutor("🖨", version === "key"
        ? "Imprimiendo la clave de respuestas... También puedes guardarla como PDF."
        : "Imprimiendo la hoja del alumno... También puedes guardarla como PDF.");
    window.print();
}

// ---------- Tarjetas de repaso (US3) ----------

const studySelected = new Set();
const studyCampos = new Set(CAMPOS.map(c => c.id));
let studyColumns = 2;

function openStudyCards() {
    showScreen('study-screen');
    renderStudyScreen();
    tutor("📚", "Elige un campo, escucha las tarjetas con 🔊 y marca las que quieras imprimir.");
}

function renderStudyScreen() {
    const columns = document.getElementById('study-columns');
    columns.innerHTML = 'Imprimir en:' + [2, 1].map(n =>
        '<label class="chip"><input type="radio" name="study-columns" value="' + n + '" autocomplete="off"' + (studyColumns === n ? ' checked' : '') + '> ' +
        n + (n === 1 ? ' columna' : ' columnas') + '</label>').join('');
    columns.querySelectorAll('input').forEach(radio => { radio.onchange = () => { studyColumns = Number(radio.value); }; });

    const filter = document.getElementById('study-filter');
    filter.innerHTML = CAMPOS.map(c => '<label class="chip"><input type="checkbox" value="' + c.id + '"' + (studyCampos.has(c.id) ? ' checked' : '') + '> ' +
        c.emoji + ' ' + escapeHtml(c.name) + '</label>').join('');
    filter.querySelectorAll('input').forEach(box => {
        box.onchange = () => {
            if (box.checked) studyCampos.add(box.value);
            else studyCampos.delete(box.value);
            renderStudyCards();
        };
    });
    renderStudyCards();
}

function renderStudyCards() {
    const box = document.getElementById('study-cards');
    const campos = CAMPOS.filter(c => studyCampos.has(c.id));
    if (!campos.length) {
        box.innerHTML = '<p class="status error">Elige al menos un campo formativo.</p>';
        return;
    }
    box.innerHTML = campos.map(campo =>
        '<h2 class="card-group-title">' + campo.emoji + ' ' + escapeHtml(campo.name) + '</h2><div class="ref-cards">' +
        TEMAS.filter(t => t.campo === campo.id).map(tema =>
            '<div class="ref-card' + (studySelected.has(tema.id) ? ' selected' : '') + '" data-id="' + tema.id + '">' +
            '<div class="study-card-actions"><label class="pick"><input type="checkbox" class="card-pick" value="' + tema.id + '"' +
            (studySelected.has(tema.id) ? ' checked' : '') + '> Imprimir esta tarjeta</label>' +
            '<button type="button" class="speak-btn" data-say="' + tema.id + '" title="Escuchar" aria-label="Escuchar la tarjeta ' + escapeHtml(tema.title) + '">🔊</button></div>' +
            studyCardHtml(tema) + '</div>').join('') + '</div>').join('');
    box.querySelectorAll('.card-pick').forEach(checkbox => {
        checkbox.onchange = () => {
            if (checkbox.checked) studySelected.add(checkbox.value);
            else studySelected.delete(checkbox.value);
            checkbox.closest('.ref-card').classList.toggle('selected', checkbox.checked);
        };
    });
    box.querySelectorAll('.speak-btn').forEach(button => { button.onclick = () => sayStudyCard(button.dataset.say); });
}

function sayStudyCard(id) {
    const tema = TEMA_BY_ID[id];
    const text = [tema.title + "."].concat(tema.card.points.map(stripTagsEs), tema.card.remember ? ["Recuerda: " + tema.card.remember] : []).join(" ");
    if (!Speech.speak(text, 0.95)) tutor("🔇", "Este navegador no puede leer en voz alta. Prueba con Chrome, Edge o Safari.");
}

function selectStudyCards(all) {
    studySelected.clear();
    if (all) TEMAS.filter(t => studyCampos.has(t.campo)).forEach(t => studySelected.add(t.id));
    renderStudyCards();
}

function printStudyCards() {
    const ids = TEMAS.map(t => t.id).filter(id => studySelected.has(id));
    if (!ids.length) {
        tutor("✏️", "Elige al menos una tarjeta para imprimir.");
        return;
    }
    document.getElementById('print-area').innerHTML = buildStudyCardsPrintHtml(ids, studyColumns);
    tutor("🖨", "Imprimiendo " + ids.length + (ids.length === 1 ? " tarjeta" : " tarjetas") + "... También puedes guardarlas como PDF.");
    window.print();
}

// ---------- Inicio ----------

function setupCamposMenu() {
    const chips = document.getElementById('campos-chips');
    chips.innerHTML = CAMPOS.map(c => '<label class="chip"><input type="checkbox" value="' + c.id + '" checked> ' + c.emoji + ' ' + escapeHtml(c.name) + '</label>').join('');
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupCamposMenu);
    else setupCamposMenu();
}
