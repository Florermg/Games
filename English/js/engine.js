/* =====================================================================
   WORKSHEET ENGINE
   Renders a guide (demo or generated), checks the answers with 2 attempts
   per section (one point per item), and shows the results with the
   average out of 10.
   ===================================================================== */

const ATTEMPTS_PER_SECTION = 2;

let currentGuide = null;
let sectionStates = [];
let finishWarned = false;

const tutorPhrases = {
    allCorrect: ["✨ Awesome! Everything is correct!", "🎉 Perfect! Great job!", "⭐ All correct! Keep it up!"],
    someWrong: ["💡 Almost! Check the hints and try again.", "🐾 Good try! Read the hints in orange.", "💭 Some answers need another look. You can do it!"],
    outOfAttempts: "📚 That's it for this section. Read the correct answers in green."
};

// ---------- Helpers ----------

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

function stripTags(html) {
    return String(html).replace(/<[^>]+>/g, "");
}

function studentName() {
    return document.getElementById('student-name').value.trim();
}

// ---------- Rendering ----------

// Turns "I have ___ problems" into text + a control in the blank
function renderBlankText(text, control) {
    const wrapper = el('span');
    const parts = text.split("___");
    wrapper.appendChild(document.createTextNode(parts[0]));
    wrapper.appendChild(control);
    wrapper.appendChild(document.createTextNode(parts.slice(1).join("___")));
    return wrapper;
}

function letterOf(index) {
    return "abcdefghijklmnopqrstuvwxyz"[index];
}

function renderBankSection(section, box) {
    box.appendChild(el('div', 'word-bank', section.bank.map(escapeHtml).join(" / ")));
    section.items.forEach((item, i) => {
        const row = el('div', 'item');
        const select = el('select');
        select.appendChild(new Option("— choose —", ""));
        section.bank.forEach(word => select.appendChild(new Option(word, word)));
        select.dataset.response = "";
        const line = el('div', 'item-text');
        line.appendChild(document.createTextNode(letterOf(i) + ". "));
        line.appendChild(renderBlankText(item.text, select));
        row.appendChild(line);
        box.appendChild(row);
    });
}

function renderRewriteSection(section, box) {
    section.items.forEach((item, i) => {
        const row = el('div', 'item');
        row.appendChild(el('div', 'item-text', letterOf(i) + ". " + escapeHtml(item.text)));
        const input = el('input', 'wide');
        input.type = "text";
        input.placeholder = "Write the sentence here...";
        input.autocomplete = "off";
        input.spellcheck = false;
        row.appendChild(input);
        box.appendChild(row);
    });
}

function renderFillSection(section, box) {
    if (section.script) box.appendChild(renderAudioBar(section));
    section.items.forEach((item, i) => {
        const row = el('div', 'item');
        const input = el('input', 'inline');
        input.type = "text";
        input.autocomplete = "off";
        input.spellcheck = false;
        const line = el('div', 'item-text');
        // Listening items are already lettered ("a. ..."), like the PDF
        if (!/^[a-z]\. /.test(item.text)) line.appendChild(document.createTextNode(letterOf(i) + ". "));
        line.appendChild(renderBlankText(item.text, input));
        row.appendChild(line);
        box.appendChild(row);
    });
}

function renderAudioBar(section) {
    const bar = el('div', 'audio-bar');
    if (!Speech.supported()) {
        bar.innerHTML = "⚠️ This browser cannot read the audio aloud. Please use Chrome, Edge or Safari.";
        return bar;
    }
    const rate = section.rate || 0.9;
    // Listening guide (GAMES-11): sentence by sentence, with the voice of each character
    const read = speed => section.sentences
        ? Speech.speakSequence(section.sentences, speed, null, null, section.pitches)
        : Speech.speak(section.script, speed);
    const play = el('button', 'small-btn', "▶ Play audio");
    play.onclick = () => {
        read(rate);
        tutor("🎧", section.sentences
            ? "Listen carefully and choose the correct answers. You can play it again!"
            : "Listen carefully and complete the information. You can play it again!");
    };
    const slow = el('button', 'small-btn', "🐢 Slow");
    slow.onclick = () => read(section.rate ? Math.round((rate - 0.2) * 100) / 100 : 0.7);
    const stop = el('button', 'small-btn', "⏹ Stop");
    stop.onclick = () => Speech.stop();
    bar.append(play, slow, stop, el('span', 'note', "The browser reads the audio aloud."));
    return bar;
}

// ---------- Listening guide (GAMES-11) ----------

function subtitleHtml(section, index) {
    const speaker = section.speakers && section.speakers[index];
    return (speaker ? "<b class='subtitle-speaker'>" + escapeHtml(speaker) + ":</b> " : "") + escapeHtml(section.sentences[index]);
}

// Stage 1 shows each sentence while it is read; stage 2 plays the same audio without text
function renderListenSection(section, box) {
    const total = section.sentences.length;
    const slowRate = Math.round((section.rate - 0.2) * 100) / 100;
    let screen = null;
    if (section.subtitles) {
        screen = el('div', 'subtitles');
        screen.setAttribute('aria-live', 'polite');
        box.appendChild(screen);
    } else {
        box.appendChild(el('div', 'no-subtitles', "🙈 No subtitles this time. Listen carefully!"));
    }
    const counter = el('span', 'subtitle-counter');
    const waiting = () => {
        counter.innerText = "";
        if (screen) screen.innerHTML = "<span class='note'>Press ▶ Play and read while you listen.</span>";
    };

    if (!Speech.supported()) {
        box.appendChild(el('div', 'audio-bar', "⚠️ This browser cannot read the audio aloud. Please use Chrome, Edge or Safari."));
        // Without a voice, the subtitles are the only way to follow the text
        if (screen) screen.innerHTML = section.sentences.map((s, i) => "<p>" + subtitleHtml(section, i) + "</p>").join("");
    } else {
        const read = rate => Speech.speakSequence(section.sentences, rate,
            i => {
                counter.innerText = (i + 1) + " / " + total;
                if (screen) screen.innerHTML = subtitleHtml(section, i);
            },
            () => {
                counter.innerText = "✔ " + total + " / " + total;
                tutor("🌟", section.subtitles
                    ? "Great listening! Press \"Next\" to listen without subtitles."
                    : "Well done! Press \"Next\" to answer the quiz.");
            },
            section.pitches);
        const bar = el('div', 'audio-bar');
        const play = el('button', 'small-btn', "▶ Play");
        play.onclick = () => read(section.rate);
        const slow = el('button', 'small-btn', "🐢 Slow");
        slow.onclick = () => read(slowRate);
        const stop = el('button', 'small-btn', "⏹ Stop");
        stop.onclick = () => Speech.stop();
        bar.append(play, slow, stop, counter);
        box.appendChild(bar);
        waiting();
    }

    const actions = el('div', 'stage-actions');
    if (section.stage > 1) {
        const back = el('button', 'small-btn', "⬅ Back");
        back.onclick = () => showStage(section.stage - 1);
        actions.appendChild(back);
    }
    const next = el('button', 'main-btn', section.subtitles ? "Next: listen without subtitles ▶" : "Next: answer the quiz ▶");
    next.onclick = () => showStage(section.stage + 1);
    actions.appendChild(next);
    box.appendChild(actions);
    if (section.source) box.appendChild(el('div', 'source', escapeHtml(section.source)));
}

// Only one stage of the Listening guide is on screen at a time
function showStage(stage) {
    Speech.stop();
    document.querySelectorAll('#sheet-body [data-stage]').forEach(node => {
        node.classList.toggle('hidden', Number(node.dataset.stage) !== stage);
    });
    const messages = {
        1: "Press ▶ Play and read the subtitles while you listen!",
        2: "Now listen again without subtitles. You can do it!",
        3: "Answer the quiz. You can play the audio again."
    };
    tutor("🎧", messages[stage]);
    document.getElementById('sheet-body').scrollIntoView();
}

function renderMatchSection(section, box) {
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
        "<b>Definitions</b>" + section.definitions.map(d => "<div><b>" + d.letter + ".</b> " + escapeHtml(d.text) + "</div>").join(""));
    grid.append(terms, definitions);
    box.appendChild(grid);
}

function renderChoiceSection(section, box) {
    if (section.script) box.appendChild(renderAudioBar(section));
    if (section.passage) {
        const passage = el('div', 'passage', section.passage.map(p => "<p>" + escapeHtml(p) + "</p>").join(""));
        if (section.source) passage.appendChild(el('div', 'source', escapeHtml(section.source)));
        box.appendChild(passage);
    }
    section.items.forEach((item, i) => {
        const row = el('div', 'item');
        if (item.text) row.appendChild(el('div', 'item-text', "<b>" + escapeHtml(item.text).replace(/\n/g, "<br>") + "</b>"));
        const options = el('div', 'options' + (section.inline ? ' inline-options' : ''));
        if (section.inline) options.appendChild(el('span', '', "<b>" + (i + 1) + ".</b>"));
        item.options.forEach((option, optionIndex) => {
            const button = el('button', 'option', letterOf(optionIndex) + ") " + escapeHtml(option));
            button.type = "button";
            button.onclick = () => {
                options.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
                button.classList.add('selected');
                row.dataset.response = String(optionIndex);
                row.classList.remove('wrong');
            };
            options.appendChild(button);
        });
        row.appendChild(options);
        box.appendChild(row);
    });
}

function renderDictationSection(section, box) {
    if (!Speech.supported()) {
        box.appendChild(el('div', 'audio-bar', "⚠️ This browser cannot read the words aloud. Please use Chrome, Edge or Safari."));
    } else {
        box.appendChild(el('p', 'note', "Press 🔊 to listen to each word, then write it."));
    }
    section.items.forEach((item, i) => {
        const row = el('div', 'item');
        const speak = el('button', 'speak-btn', "🔊");
        speak.type = "button";
        speak.title = "Listen";
        speak.onclick = () => Speech.speak(item.text, 0.75);
        const input = el('input', 'inline');
        input.type = "text";
        input.autocomplete = "off";
        input.spellcheck = false;
        row.appendChild(document.createTextNode((i + 1) + ". "));
        row.append(speak, input);
        box.appendChild(row);
    });
}

function renderWritingSection(section, box) {
    const wrapper = el('div', 'writing-box');
    wrapper.appendChild(el('b', '', "Remember"));
    wrapper.appendChild(el('ul', '', section.remember.map(r => "<li>" + escapeHtml(r) + "</li>").join("")));
    if ((section.usefulWords && section.usefulWords.length) || section.fact) {
        let ideas = "";
        if (section.usefulWords && section.usefulWords.length) ideas += "<b>📝 Useful words:</b> " + section.usefulWords.map(escapeHtml).join(", ") + "<br>";
        if (section.fact) ideas += "<b>💡 Did you know?</b> " + escapeHtml(section.fact) + (section.source ? " <span class='source'>(" + escapeHtml(section.source) + ")</span>" : "");
        wrapper.appendChild(el('div', 'ideas', ideas));
    }
    const textarea = el('textarea', 'writing-area');
    textarea.rows = section.lines;
    textarea.placeholder = "Write your text here (" + section.lines + " lines)...";
    const count = el('div', 'word-count', "0 words");
    textarea.oninput = () => {
        count.innerText = (textarea.value.match(/[A-Za-z']+/g) || []).length + " words";
    };
    wrapper.append(textarea, count);
    wrapper.appendChild(el('b', '', "Criteria"));
    const criteria = el('ol', 'criteria');
    section.criteria.forEach(c => {
        criteria.appendChild(el('li', '', escapeHtml(c.text) + " <b>(" + c.points + ")</b> <span class='crit-result'></span><div class='feedback tip'></div>"));
    });
    wrapper.appendChild(criteria);
    const total = section.criteria.reduce((sum, c) => sum + c.points, 0);
    wrapper.appendChild(el('div', 'section-score writing-total', "Total ____ / " + total));
    box.appendChild(wrapper);
}

const SECTION_RENDERERS = {
    bank: renderBankSection,
    rewrite: renderRewriteSection,
    fill: renderFillSection,
    match: renderMatchSection,
    choice: renderChoiceSection,
    listen: renderListenSection,
    dictation: renderDictationSection,
    writing: renderWritingSection
};

function renderGuide(guide) {
    const body = document.getElementById('sheet-body');
    body.innerHTML = "";

    const header = el('div', 'sheet-header');
    if (guide.school) header.appendChild(el('div', 'school', escapeHtml(guide.school)));
    header.appendChild(el('h1', '', escapeHtml(guide.title)));
    header.appendChild(el('h3', '', escapeHtml(guide.subtitle)));
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    header.appendChild(el('div', 'sheet-meta',
        "<b>Name:</b> " + (escapeHtml(studentName()) || "_______________") +
        " &nbsp; <b>Date:</b> " + today +
        " &nbsp; <b>Average:</b> <span id='sheet-average'>____</span>" +
        (guide.teacher ? " &nbsp; <b>Teacher:</b> " + escapeHtml(guide.teacher) : "")));
    body.appendChild(header);

    let lastGroup = null;
    guide.sections.forEach((section, index) => {
        if (section.group && section.group !== lastGroup) {
            body.appendChild(el('div', 'group-label', escapeHtml(section.group)));
            lastGroup = section.group;
        }
        const box = el('div', 'section');
        box.id = "section-" + index;
        if (section.stage) {
            box.dataset.stage = String(section.stage);
            if (section.stage !== 1) box.classList.add('hidden');
        }
        box.appendChild(el('div', 'section-title', section.title));
        SECTION_RENDERERS[section.type](section, box);
        // The audio stages have nothing to check (GAMES-11)
        if (section.type === "listen") {
            body.appendChild(box);
            return;
        }

        const footer = el('div', 'section-footer');
        const button = el('button', 'main-btn btn-secondary', section.type === "writing" ? "Check my writing ✔" : "Check answers ✔");
        button.onclick = () => checkSection(index);
        footer.append(button, el('span', 'section-score', ""));
        if (section.script) {
            const scriptButton = el('button', 'small-btn hidden', "📜 Show audio text");
            scriptButton.onclick = () => {
                box.querySelector('.script-text').classList.toggle('hidden');
            };
            footer.appendChild(scriptButton);
            const scriptHtml = section.sentences
                ? section.sentences.map((s, i) => "<p>" + subtitleHtml(section, i) + "</p>").join("")
                : "<p>" + escapeHtml(section.script) + "</p>";
            box.appendChild(el('div', 'passage script-text hidden', scriptHtml + (section.source ? "<div class='source'>" + escapeHtml(section.source) + "</div>" : "")));
        }
        box.appendChild(footer);
        body.appendChild(box);

        // Changing a wrong answer removes the red mark
        box.querySelectorAll('.item').forEach(row => {
            row.querySelectorAll('select, input').forEach(control => {
                control.addEventListener('input', () => row.classList.remove('wrong'));
                control.addEventListener('change', () => row.classList.remove('wrong'));
            });
        });
    });
}

// ---------- Checking ----------

function itemRows(index) {
    return Array.from(document.querySelectorAll('#section-' + index + ' .item'));
}

function readResponse(section, row) {
    if (section.type === "choice") return row.dataset.response === undefined ? "" : row.dataset.response;
    const control = row.querySelector('select, input');
    return control ? control.value : "";
}

function lockRow(row) {
    row.querySelectorAll('select, input, button.option').forEach(control => { control.disabled = true; });
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

function checkSection(index) {
    const section = currentGuide.sections[index];
    const state = sectionStates[index];
    if (section.type === "writing") return checkWriting(index);
    if (state.done) return;

    const rows = itemRows(index);
    const pending = rows.filter((row, i) => !state.correct[i]);
    if (pending.some(row => readResponse(section, row).trim() === "")) {
        tutor("✏️", "Please answer all the items in this section before checking!");
        return;
    }

    const attempt = ATTEMPTS_PER_SECTION - state.attemptsLeft + 1;
    state.attemptsLeft--;
    rows.forEach((row, i) => {
        if (state.correct[i]) return;
        const item = section.items[i];
        if (isCorrect(section, item, readResponse(section, row))) {
            state.correct[i] = attempt;
            row.classList.remove('wrong');
            row.classList.add('correct');
            setFeedback(row, 'answer', "✔ Correct!");
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
        button.innerText = "Done ✔";
        rows.forEach((row, i) => {
            lockRow(row);
            if (state.correct[i]) return;
            const item = section.items[i];
            setFeedback(row, 'answer', "✔ Correct answer: <b>" + escapeHtml(correctAnswerText(section, item)) + "</b>" +
                (item.explanation && item.explanation !== correctAnswerText(section, item) ? "<br>📖 " + escapeHtml(item.explanation) : ""));
            if (section.type === "choice") row.querySelectorAll('.option')[item.answer].classList.add('right-answer');
        });
        const scriptButton = box.querySelector('.section-footer .small-btn');
        if (scriptButton) scriptButton.classList.remove('hidden');
        if (allCorrect) tutor("🌸", pickRandom(tutorPhrases.allCorrect));
        else tutor("🐾", tutorPhrases.outOfAttempts);
    } else {
        button.innerText = "Check again ✔ (1 attempt left)";
        tutor("💧", pickRandom(tutorPhrases.someWrong));
    }
    updateScores();
}

function checkWriting(index) {
    const section = currentGuide.sections[index];
    const state = sectionStates[index];
    const box = document.getElementById('section-' + index);
    const text = box.querySelector('textarea').value;
    if (text.trim().split(/\s+/).length < 5) {
        tutor("✏️", "Write your text first, then I'll check it with you!");
        return;
    }
    let total = 0;
    const results = box.querySelectorAll('.criteria li');
    section.criteria.forEach((criterion, i) => {
        const result = WRITING_CHECKS[criterion.check](text, section);
        const score = Math.min(result.score, criterion.points);
        total += score;
        results[i].querySelector('.crit-result').innerText = " → " + score + "/" + criterion.points + (score === criterion.points ? " ✔" : "");
        results[i].querySelector('.feedback').innerText = score === criterion.points ? "" : "💡 " + result.note;
    });
    state.writingScore = total;
    state.done = true;
    const max = section.criteria.reduce((sum, c) => sum + c.points, 0);
    box.querySelector('.writing-total').innerText = "Total " + total + " / " + max + " (automatic estimate; your teacher gives the final grade)";
    if (total === max) tutor("🏆", "Wow! Your text meets all the criteria!");
    else tutor("✍️", "Good work! Read the hints, improve your text and check again.");
    updateScores();
}

// ---------- Scores and results ----------

function sectionScore(index) {
    return scoreSection(currentGuide.sections[index], sectionStates[index]);
}

function updateScores() {
    let score = 0;
    let max = 0;
    currentGuide.sections.forEach((section, index) => {
        const result = sectionScore(index);
        score += result.score;
        max += result.max;
        const label = document.querySelector('#section-' + index + ' .section-footer .section-score');
        if (label && sectionStates[index].done && section.type !== "writing") label.innerText = "⭐ " + result.score + " / " + result.max;
    });
    document.getElementById('score-pill').innerText = "⭐ " + score + " / " + max + " pts";
    return { score, max };
}

function finishGuide() {
    const pending = sectionStates.filter(s => !s.done).length;
    if (pending && !finishWarned) {
        finishWarned = true;
        tutor("🤔", "You still have " + pending + " section(s) to check. Press \"Finish\" again to see your results anyway.");
        return;
    }
    Speech.stop();
    const { score, max } = updateScores();
    const average = computeAverage(score, max);
    document.getElementById('sheet-average').innerText = average;

    document.getElementById('sheet-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    window.scrollTo(0, 0);

    const name = studentName();
    document.getElementById('final-score').innerText = score + " / " + max + " pts";
    document.getElementById('final-average').innerText = "Average: " + average + " / 10";
    let message;
    if (average >= 9) {
        message = "🌟 Super brilliant" + (name ? ", " + name : "") + "! You mastered almost everything!";
        tutor("🏆", "Amazing score! I'm so proud of you!");
    } else if (average >= 7) {
        message = "👍 Great job" + (name ? ", " + name : "") + "! Check out the concepts you missed below.";
        tutor("✨", "Good effort! Read the explanations to reinforce your learning.");
    } else {
        message = "📚 Good try" + (name ? ", " + name : "") + "! Calmly review the correct answers below.";
        tutor("🐾", "Don't worry! Review these explanations and you'll be ready next time.");
    }
    document.getElementById('final-message').innerText = message;

    const table = document.getElementById('result-table');
    table.innerHTML = "";
    currentGuide.sections.forEach((section, index) => {
        if (section.type === "listen") return;
        const result = sectionScore(index);
        const row = table.insertRow();
        row.insertCell().innerText = (section.group ? section.group + " · " : "") + stripTags(section.title).replace(/\(one point each\)|\(0\/1\)/g, "").trim();
        row.insertCell().innerText = result.score + " / " + result.max;
    });

    const review = document.getElementById('review-box');
    review.innerHTML = "";
    currentGuide.sections.forEach((section, index) => {
        if (section.type === "writing") return;
        section.items.forEach((item, i) => {
            if (sectionStates[index].correct[i]) return;
            const question = section.type === "dictation" ? "Dictation word #" + (i + 1)
                : section.type === "match" ? "Match: " + item.text
                : item.text || "Spelling #" + (i + 1);
            const answer = correctAnswerText(section, item);
            const div = el('div', 'review-item',
                "<b>" + escapeHtml(stripTags(question)).replace(/\n/g, "<br>") + "</b><br>" +
                "<span style='color:var(--correct);'>✔ Correct answer: <b>" + escapeHtml(answer) + "</b></span>" +
                (item.explanation && item.explanation !== answer ? "<br><span style='color:#555; font-size:0.95em;'>💡 <i>" + escapeHtml(item.explanation) + "</i></span>" : ""));
            review.appendChild(div);
        });
    });
    if (!review.children.length) {
        review.innerHTML = "<p style='color:var(--correct); font-weight:bold; text-align:center;'>🎉 Awesome! You had no final mistakes!</p>";
    }
}

// ---------- Screens ----------

function startGuide(guide) {
    currentGuide = guide;
    finishWarned = false;
    sectionStates = guide.sections.map(section => ({
        attemptsLeft: ATTEMPTS_PER_SECTION,
        done: section.type === "listen",
        correct: (section.items || []).map(() => 0),
        writingScore: 0
    }));
    renderGuide(guide);
    closePrintPanel();
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('sheet-screen').classList.remove('hidden');
    updateScores();
    window.scrollTo(0, 0);
    if (guide.kind === "listening") tutor("🎧", "Press ▶ Play and read the subtitles while you listen!");
    else tutor("👧🏻", "Let's start the " + guide.title.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) + "! You have 2 attempts per section.");
}

function backToMenu() {
    Speech.stop();
    closePrintPanel();
    document.getElementById('sheet-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.querySelectorAll('.reference-screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById('menu-screen').classList.remove('hidden');
    window.scrollTo(0, 0);
    tutor("👧🏻", "Welcome back! Choose a guide to practice.");
}

// ---------- Print (GAMES-3) ----------

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

// The printed version is built from the guide data, never from the screen,
// so the student sheet never shows what was answered (FR-007, FR-016)
function printGuide(version) {
    if (!currentGuide) return;
    document.getElementById('print-area').innerHTML = buildPrintHtml(currentGuide, version);
    closePrintPanel();
    tutor("🖨", version === "key"
        ? "Printing the answer key... You can also save it as a PDF."
        : "Printing the student sheet... You can also save it as a PDF.");
    window.print();
}

// ---------- Menu: demos and generated guides ----------

function selectedTopic() {
    const custom = document.getElementById('gen-custom').value.trim().toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
    if (custom) {
        const first = custom.split(" ")[0];
        return { name: capitalize(custom), plain: custom, ml: custom, trigger: first, describe: first, wiki: custom };
    }
    const key = document.getElementById('gen-topic').value;
    return Object.assign({ name: TOPICS[key].label, key }, TOPICS[key]);
}

function setStatus(message, isError) {
    const status = document.getElementById('gen-status');
    status.innerText = message;
    status.className = "status" + (isError ? " error" : "");
}

function playDemo(kind) {
    startGuide(DEMO_GUIDES[kind]);
}

async function generateGuide(kind) {
    const grade = Number(document.getElementById('gen-grade').value);
    const topic = selectedTopic();
    const grammarPoints = Object.keys(GRAMMAR_POINTS).filter(p => document.getElementById('grammar-' + p).checked);
    if (kind === "gvs" && !grammarPoints.length) {
        setStatus("Choose at least one grammar topic.", true);
        return;
    }

    const buttons = document.querySelectorAll('.generate-btn');
    buttons.forEach(b => { b.disabled = true; });
    tutor("🔍", "Let me prepare a new guide about " + topic.name + "...");
    const options = {
        grade, topic, grammarPoints,
        taskKey: document.getElementById('writing-task').value,
        audioType: document.getElementById('listening-type').value,
        onStatus: message => setStatus(message)
    };
    try {
        const builders = { gvs: generateGrammarGuide, rl: generateReadingGuide, writing: generateWritingGuide, listening: generateListeningGuide };
        const guide = await builders[kind](options);
        setStatus("");
        startGuide(guide);
        if (kind === "listening") tutor("🎧", "Your listening about " + topic.name + " is ready! Press ▶ Play and read the subtitles.");
        else tutor("✨", "I made a brand-new guide about " + topic.name + " just for you! You have 2 attempts per section.");
    } catch (error) {
        setStatus(error.message, true);
        tutor("💧", "Oh no! " + error.message);
    } finally {
        buttons.forEach(b => { b.disabled = false; });
    }
}

function setupMenu() {
    const topicSelect = document.getElementById('gen-topic');
    Object.keys(TOPICS).forEach(key => topicSelect.appendChild(new Option(TOPICS[key].label, key)));

    const grammarBox = document.getElementById('grammar-points');
    Object.keys(GRAMMAR_POINTS).forEach(point => {
        const chip = el('label', 'chip');
        const checkbox = el('input');
        checkbox.type = "checkbox";
        checkbox.id = "grammar-" + point;
        // Same grammar as the demo by default
        checkbox.checked = point !== "comparatives";
        chip.append(checkbox, document.createTextNode(GRAMMAR_POINTS[point].label));
        grammarBox.appendChild(chip);
    });

    const taskSelect = document.getElementById('writing-task');
    taskSelect.appendChild(new Option("🎲 Random text type", "random"));
    Object.keys(WRITING_TASKS).forEach(key => taskSelect.appendChild(new Option(WRITING_TASKS[key].label, key)));
}

setupMenu();
