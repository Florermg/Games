/* =====================================================================
   IMPRESIÓN (GAMES-17): la hoja del alumno, la clave de respuestas y las
   tarjetas de repaso, con las mismas clases que el juego de inglés
   (GAMES-3, GAMES-8, GAMES-10), en español. Solo usa los datos de la guía,
   nunca la pantalla. Puro: sin DOM.
   ===================================================================== */

const CAMPOS_PRINT_VERSIONS = ["student", "key"];

const cpBlank = (size) => '<span class="blank ' + (size || "short") + '"></span>';
const cpKey = (text) => '<span class="key">' + escapeHtml(text) + '</span>';
const cpSlot = (isKey, answer, size) => isKey ? cpKey(answer) : cpBlank(size);
const cpItem = (html) => '<div class="print-item">' + html + '</div>';
const cpLetter = (index) => "abcdefghijklmnopqrstuvwxyz"[index];
const cpField = (label, value) => '<span class="print-field"><b>' + label + ':</b> ' + (value ? escapeHtml(value) : '<span class="field-line"></span>') + '</span>';

function camposPrintHeader(guide, isKey) {
    let html = '<header class="print-header">';
    if (isKey) html += '<div class="print-key-badge">CLAVE DE RESPUESTAS</div>';
    if (guide.school) html += '<div class="print-school">' + escapeHtml(guide.school) + '</div>';
    html += '<h1 class="print-title">' + escapeHtml(guide.title) + '</h1>';
    html += '<h2 class="print-subtitle">' + escapeHtml(guide.subtitle) + '</h2>';
    // Siempre en blanco: la hoja se fotocopia para todo el grupo
    html += '<div class="print-fields">' + cpField('Nombre') + cpField('Grupo') + cpField('N.L.') +
        cpField('Fecha') + cpField('Promedio') + cpField('Maestra/o') + '</div>';
    return html + '</header>';
}

function cpOptions(item, isKey, inline) {
    const options = item.options.map((option, k) => {
        const label = (inline ? '( ) ' : cpLetter(k) + ') ') + option;
        return '<span class="print-option">' + (isKey && k === item.answer ? cpKey(label) : escapeHtml(label)) + '</span>';
    }).join(' ');
    return '<div class="print-options' + (inline ? ' inline' : '') + '">' + options + '</div>';
}

const CAMPOS_PRINT_RENDERERS = {
    choice(section, isKey) {
        return section.items.map((item, i) => cpItem('<div class="print-question">' + (i + 1) + '. ' + escapeHtml(item.text) + '</div>' + cpOptions(item, isKey, false)));
    },

    truefalse(section, isKey) {
        return section.items.map((item, i) => cpItem('<div class="print-question">' + (i + 1) + '. ' + escapeHtml(item.text) + '</div>' + cpOptions(item, isKey, true)));
    },

    match(section, isKey) {
        const words = section.items.map((item, i) => cpItem((i + 1) + '. ' + escapeHtml(item.text) + ' ' + cpSlot(isKey, item.answers[0], 'letter'))).join('');
        const definitions = section.definitions.map(d => '<div><b>' + d.letter + '.</b> ' + escapeHtml(d.text) + '</div>').join('');
        const solved = isKey ? '<div class="print-solved"><b>Resuelto</b>' + section.items.map(item => {
            const definition = section.definitions.find(d => d.letter === item.answers[0]);
            return '<div>' + escapeHtml(item.text) + ' → ' + definition.letter + '. ' + escapeHtml(definition.text) + '</div>';
        }).join('') + '</div>' : '';
        return ['<div class="print-match"><div class="print-match-words">' + words + '</div>' +
            '<div class="print-match-definitions">' + definitions + '</div></div>', solved];
    },

    bank(section, isKey) {
        const items = section.items.map((item, i) => cpItem(cpLetter(i) + '. ' + item.text.split('___').map(escapeHtml).join(cpSlot(isKey, item.answers[0], 'short'))));
        return ['<div class="print-bank">' + section.bank.map(escapeHtml).join(' / ') + '</div>'].concat(items);
    },

    classify(section, isKey) {
        const items = section.items.map((item, i) => cpItem((i + 1) + '. ' + escapeHtml(item.text) + ' → ' + cpSlot(isKey, section.categories[item.answer], 'short')));
        return ['<div class="print-bank">' + section.categories.map(escapeHtml).join(' / ') + '</div>'].concat(items);
    },

    open(section, isKey) {
        return section.items.map((item, i) => cpItem('<div class="print-question">' + (i + 1) + '. ' + escapeHtml(item.text) + '</div>' +
            (isKey
                ? '<div class="print-note"><b>Respuesta modelo:</b> ' + cpKey(item.model) + '</div>'
                : '<div class="print-lines">' + '<div class="write-line"></div>'.repeat(3) + '</div>')));
    }
};

// El título va junto a su primer bloque, que nunca se parte entre hojas (GAMES-10)
function camposPrintSection(section, isKey) {
    const blocks = CAMPOS_PRINT_RENDERERS[section.type](section, isKey).filter(Boolean);
    return '<section class="print-section print-type-' + section.type + '">' +
        '<div class="print-keep"><div class="print-section-title">' + section.title + '</div>' + (blocks[0] || '') + '</div>' +
        blocks.slice(1).join('') + '</section>';
}

/** @param {string} version "student" (hoja del alumno) o "key" (clave de respuestas) */
function buildCamposPrintHtml(guide, version) {
    if (!CAMPOS_PRINT_VERSIONS.includes(version)) throw new Error('Unknown print version: ' + version);
    const isKey = version === "key";
    return '<div class="print-sheet ' + (isKey ? 'print-version-answer' : 'print-version-student') + '">' +
        camposPrintHeader(guide, isKey) + guide.sections.map(section => camposPrintSection(section, isKey)).join('') + '</div>';
}

// ---------- Tarjetas de repaso (US3) ----------

// Los puntos de las tarjetas son HTML escrito en campos-data.js (negritas y cursivas)
function studyCardHtml(tema) {
    const campo = CAMPO_BY_ID[tema.campo];
    return '<div class="print-card"><h3>' + escapeHtml(tema.title) + '</h3>' +
        '<p class="card-explanation">' + campo.emoji + ' ' + escapeHtml(campo.name) + '</p>' +
        '<ul class="card-examples">' + tema.card.points.map(point => '<li>' + point + '</li>').join('') + '</ul>' +
        (tema.card.remember ? '<p class="card-note"><b>Recuerda:</b> ' + escapeHtml(tema.card.remember) + '</p>' : '') + '</div>';
}

/** Las tarjetas elegidas, en 1 o 2 columnas (GAMES-8). */
function buildStudyCardsPrintHtml(ids, columns) {
    if (columns !== 1 && columns !== 2) throw new Error("Las columnas deben ser 1 o 2.");
    const cards = ids.map(id => TEMA_BY_ID[id]).filter(Boolean).map(studyCardHtml);
    return '<div class="print-sheet print-card-sheet"><h1 class="print-title">Tarjetas de repaso · Guía 5.º Primer trimestre</h1>' +
        '<div class="print-cards' + (columns === 1 ? ' one-column' : '') + '">' + cards.join('') + '</div></div>';
}
