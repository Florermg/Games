/* =====================================================================
   PRINT
   Builds the printed versions of the open guide (GAMES-3):
     "student" -> blank sheet to answer by hand, like the PDFs of
                  English/documentacion
     "key"     -> the same sheet with the answers, for the teacher
   It works only from the guide data (never from the screen), so the
   student sheet can never carry what was answered on screen. Pure: no
   DOM, no network; the tests run it in Node (English/tests/print.test.mjs).
   ===================================================================== */

const PRINT_VERSIONS = ["student", "key"];

// ---------- Small pieces ----------

// A space or line to answer by hand ("short" for a word, "line" for a sentence)
function printBlank(size) {
    return '<span class="blank ' + (size || "short") + '"></span>';
}

// An answer printed in the answer key
function printKey(text) {
    return '<span class="key">' + escapeHtml(text) + '</span>';
}

// The answer key shows the answer where the student would write it
function printSlot(isKey, answer, size) {
    return isKey ? printKey(answer) : printBlank(size);
}

// Text the teacher reads aloud (dictation words, listening script): answer key only
function printReadAloud(label, html) {
    return '<div class="read-aloud"><div class="read-aloud-title">🔊 Read aloud (' + escapeHtml(label) + ')</div>' + html + '</div>';
}

// Other valid forms of a written answer (answer key only, FR-010)
function printAlso(isKey, item) {
    if (!isKey || !item.answers || item.answers.length < 2) return '';
    return '<div class="print-also">Also accepted: ' + item.answers.slice(1, 3).map(escapeHtml).join(' · ') + '</div>';
}

function printItem(html) {
    return '<div class="print-item">' + html + '</div>';
}

function printLetter(index) {
    return "abcdefghijklmnopqrstuvwxyz"[index];
}

function printField(label, value) {
    return '<span class="print-field"><b>' + label + ':</b> ' + (value ? escapeHtml(value) : '<span class="field-line"></span>') + '</span>';
}

function printHeader(guide, isKey) {
    let html = '<header class="print-header">';
    // On its own line, so a long title never splits the mark ("ANSWER / KEY")
    if (isKey) html += '<div class="print-key-badge">ANSWER KEY</div>';
    if (guide.school) html += '<div class="print-school">' + escapeHtml(guide.school) + '</div>';
    html += '<h1 class="print-title">' + escapeHtml(guide.title) + '</h1>';
    html += '<h2 class="print-subtitle">' + escapeHtml(guide.subtitle) + '</h2>';
    // Always blank: the sheet is photocopied for the whole group (FR-004)
    html += '<div class="print-fields">' +
        printField('Name') + printField('Group') + printField('R.N') +
        printField('Date') + printField('Average') + printField('Teacher', guide.teacher) +
        '</div>';
    return html + '</header>';
}

// ---------- One renderer per section type ----------
// Each one returns the blocks of its section, in order. printSection keeps the
// title together with the first block on paper (GAMES-10).

// Replaces the ___ of a sentence with a blank (or the answer in the key)
function printWithSlot(text, slotHtml) {
    return text.split("___").map(escapeHtml).join(slotHtml);
}

const PRINT_RENDERERS = {
    bank(section, isKey) {
        const items = section.items.map((item, i) =>
            printItem(printLetter(i) + '. ' + printWithSlot(item.text, printSlot(isKey, item.answers[0], 'short')) + printAlso(isKey, item)));
        return ['<div class="print-bank">' + section.bank.map(escapeHtml).join(' / ') + '</div>'].concat(items);
    },

    rewrite(section, isKey) {
        return section.items.map((item, i) => printItem(
            '<div>' + printLetter(i) + '. ' + escapeHtml(item.text) + '</div>' +
            '<div class="answer-line">' + printSlot(isKey, item.answers[0], 'line') + '</div>' + printAlso(isKey, item)));
    },

    fill(section, isKey) {
        // The listening script is read by the teacher: answer key only (FR-011)
        const script = isKey && section.script
            ? printReadAloud('listening', '<p>' + escapeHtml(section.script) + '</p>' +
                (section.source ? '<div class="print-source">' + escapeHtml(section.source) + '</div>' : ''))
            : '';
        return [script].concat(section.items.map((item, i) => {
            // Listening items already come lettered ("a. ..."), like the PDF
            const prefix = /^[a-z]\. /.test(item.text) ? '' : printLetter(i) + '. ';
            return printItem(prefix + printWithSlot(item.text, printSlot(isKey, item.answers[0], 'short')) + printAlso(isKey, item));
        }));
    },

    match(section, isKey) {
        const words = section.items.map((item, i) =>
            printItem((i + 1) + '. ' + escapeHtml(item.text) + ' ' + printSlot(isKey, item.answers[0], 'letter'))).join('');
        const definitions = section.definitions.map(d =>
            '<div><b>' + d.letter + '.</b> ' + escapeHtml(d.text) + '</div>').join('');
        let solved = '';
        if (isKey) {
            solved = '<div class="print-solved"><b>Solved</b>' + section.items.map(item => {
                const definition = section.definitions.find(d => d.letter === item.answers[0]);
                return '<div>' + escapeHtml(item.text) + ' → ' + definition.letter + '. ' + escapeHtml(definition.text) + '</div>';
            }).join('') + '</div>';
        }
        return ['<div class="print-match"><div class="print-match-words">' + words + '</div>' +
            '<div class="print-match-definitions">' + definitions + '</div></div>', solved];
    },

    choice(section, isKey) {
        let html = '';
        if (section.passage) {
            html = '<div class="print-passage">' + section.passage.map(p => '<p>' + escapeHtml(p) + '</p>').join('') +
                (section.source ? '<div class="print-source">' + escapeHtml(section.source) + '</div>' : '') + '</div>';
        }
        return [html].concat(section.items.map((item, i) => {
            const question = item.text
                ? '<div class="print-question">' + escapeHtml(item.text).replace(/\n/g, '<br>') + '</div>'
                : '<span class="print-number">' + (i + 1) + '.</span> ';
            const options = item.options.map((option, k) => {
                const label = printLetter(k) + ') ' + option;
                return '<span class="print-option">' + (isKey && k === item.answer ? printKey(label) : escapeHtml(label)) + '</span>';
            }).join(' ');
            return printItem(question + '<div class="print-options' + (section.inline ? ' inline' : '') + '">' + options + '</div>');
        }));
    },

    dictation(section, isKey) {
        const words = isKey
            ? printReadAloud('dictation', '<ol>' + section.items.map(item => '<li>' + escapeHtml(item.text) + '</li>').join('') + '</ol>')
            : '';
        return [words].concat(section.items.map((item, i) =>
            printItem((i + 1) + '. ' + printSlot(isKey, item.text, 'line'))));
    },

    writing(section, isKey) {
        const blocks = ['<div class="print-remember"><b>Remember</b><ul>' +
            section.remember.map(r => '<li>' + escapeHtml(r) + '</li>').join('') + '</ul></div>'];
        if ((section.usefulWords && section.usefulWords.length) || section.fact) {
            let ideas = '<div class="print-ideas">';
            if (section.usefulWords && section.usefulWords.length) ideas += '<div><b>Useful words:</b> ' + section.usefulWords.map(escapeHtml).join(', ') + '</div>';
            if (section.fact) ideas += '<div><b>Did you know?</b> ' + escapeHtml(section.fact) +
                (section.source ? ' <span class="print-source">(' + escapeHtml(section.source) + ')</span>' : '') + '</div>';
            blocks.push(ideas + '</div>');
        }
        blocks.push(isKey
            ? '<div class="print-note">Students write here (' + section.lines + ' lines).</div>'
            : '<div class="print-lines">' + '<div class="write-line"></div>'.repeat(section.lines) + '</div>');
        const total = section.criteria.reduce((sum, c) => sum + c.points, 0);
        blocks.push('<div class="print-criteria"><b>' + (isKey ? 'Criteria — Grading rubric' : 'Criteria') + '</b><ol>' +
            section.criteria.map(c => '<li>' + escapeHtml(c.text) + ' <b>(' + c.points + ')</b></li>').join('') +
            '</ol><div class="print-total"><b>Total</b> <span class="field-line"></span> / ' + total + '</div></div>');
        return blocks;
    }
};

/**
 * One printed section. The group title (when the section opens a group), the
 * section title and its first block go together in .print-keep, which is never
 * split between pages: Safari ignores break-after: avoid, but follows
 * break-inside: avoid (GAMES-10).
 */
function printSection(section, isKey, groupLabel) {
    const render = PRINT_RENDERERS[section.type];
    const blocks = (render ? render(section, isKey) : []).filter(Boolean);
    const group = groupLabel ? '<div class="print-group">' + escapeHtml(groupLabel) + '</div>' : '';
    return '<section class="print-section print-type-' + section.type + '">' +
        '<div class="print-keep">' + group + '<div class="print-section-title">' + section.title + '</div>' + (blocks[0] || '') + '</div>' +
        blocks.slice(1).join('') + '</section>';
}

/**
 * @param {object} guide   the open guide (demo or generated)
 * @param {string} version "student" or "key"
 * @returns {string} HTML of the printed version
 */
function buildPrintHtml(guide, version) {
    if (!PRINT_VERSIONS.includes(version)) throw new Error('Unknown print version: ' + version);
    const isKey = version === "key";
    const parts = [printHeader(guide, isKey)];
    let lastGroup = null;
    guide.sections.forEach(section => {
        const opensGroup = section.group && section.group !== lastGroup;
        if (opensGroup) lastGroup = section.group;
        parts.push(printSection(section, isKey, opensGroup ? section.group : null));
    });
    return '<div class="print-sheet ' + (isKey ? 'print-version-answer' : 'print-version-student') + '">' + parts.join('') + '</div>';
}
