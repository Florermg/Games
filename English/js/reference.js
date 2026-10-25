/* =====================================================================
   REFERENCE SCREENS (GAMES-6): Grammar cards and Verbs.
   Uses tutor(), backToMenu() and #print-area from engine.js / print.
   ===================================================================== */

// Tenses picked on each screen: { grammar: Set(ids), verbs: Set(ids) }
const referenceTenses = { grammar: new Set(), verbs: new Set() };
const referenceGrade = { grammar: 5, verbs: 5 };
// Cards per row on the printed sheet (GAMES-8): kept while the page is open
const referenceColumns = { grammar: 2, verbs: 2 };

function renderColumnsChoice(kind) {
    const box = document.querySelector('.columns-choice[data-kind="' + kind + '"]');
    box.innerHTML = 'Print in:' + [2, 1].map(n =>
        '<label class="chip"><input type="radio" name="columns-' + kind + '" value="' + n + '" autocomplete="off"' +
        (referenceColumns[kind] === n ? ' checked' : '') + '> ' + n + (n === 1 ? ' column' : ' columns') + '</label>').join('');
    box.querySelectorAll('input').forEach(radio => {
        radio.onchange = () => { referenceColumns[kind] = Number(radio.value); };
    });
}

function selectedTenseIds(kind) {
    // Always in the fixed order of FR-003
    return TENSES.map(t => t.id).filter(id => referenceTenses[kind].has(id));
}

function setGradeTenses(kind, grade) {
    referenceGrade[kind] = Number(grade);
    referenceTenses[kind] = new Set(tensesForGrade(grade).map(t => t.id));
}

function renderTensePicker(kind) {
    const box = document.querySelector('.tense-picker[data-kind="' + kind + '"]');
    const grades = [3, 4, 5, 6].map(g =>
        '<option value="' + g + '"' + (g === referenceGrade[kind] ? ' selected' : '') + '>' + g + (g === 3 ? 'rd' : 'th') + ' Grade</option>').join('');
    const all = selectedTenseIds(kind).length === TENSES.length;
    box.innerHTML =
        '<div class="field-grid"><label>Grade level <select class="tense-grade">' + grades + '</select></label></div>' +
        '<div class="chips tense-chips">' +
        '<label class="chip"><input type="checkbox" class="tense-all"' + (all ? ' checked' : '') + '> All tenses</label>' +
        TENSES.map(t => '<label class="chip"><input type="checkbox" class="tense-box" value="' + t.id + '"' +
            (referenceTenses[kind].has(t.id) ? ' checked' : '') + '> ' + escapeHtml(t.label) + '</label>').join('') +
        '</div>';
    box.querySelector('.tense-grade').onchange = (event) => {
        setGradeTenses(kind, event.target.value);
        renderTensePicker(kind);
        refreshReference(kind);
    };
    box.querySelector('.tense-all').onchange = (event) => {
        referenceTenses[kind] = new Set(event.target.checked ? TENSES.map(t => t.id) : tensesForGrade(referenceGrade[kind]).map(t => t.id));
        renderTensePicker(kind);
        refreshReference(kind);
    };
    box.querySelectorAll('.tense-box').forEach(checkbox => {
        checkbox.onchange = () => {
            if (checkbox.checked) referenceTenses[kind].add(checkbox.value);
            else referenceTenses[kind].delete(checkbox.value);
            box.querySelector('.tense-all').checked = selectedTenseIds(kind).length === TENSES.length;
            refreshReference(kind);
        };
    });
}

// Redraws the content of a screen after the tenses change
function refreshReference(kind) {
    if (!selectedTenseIds(kind).length) tutor("✏️", "Choose at least one tense.");
    if (kind === "grammar") renderGrammarScreen();
    else renderVerbsScreen();
}

function openReference(kind) {
    const grade = Number(document.getElementById('gen-grade').value) || 5;
    setGradeTenses(kind, grade);
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('sheet-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.querySelectorAll('.reference-screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(kind + '-screen').classList.remove('hidden');
    renderTensePicker(kind);
    renderColumnsChoice(kind);
    refreshReference(kind);
    window.scrollTo(0, 0);
    tutor(kind === "grammar" ? "📗" : "🔤", kind === "grammar"
        ? "Here are the grammar cards for your grade. Choose the ones you want to print!"
        : "Type a verb in English or Spanish and I'll show you its tenses.");
}

// ---------- Grammar screen ----------

const grammarSelected = new Set();

function renderGrammarScreen() {
    const box = document.getElementById('grammar-cards');
    const tenseIds = selectedTenseIds("grammar");
    if (!tenseIds.length) {
        box.innerHTML = '<p class="status error">Choose at least one tense.</p>';
        return;
    }
    const cards = grammarCardsFor(tenseIds);
    box.innerHTML = CARD_GROUPS.map(group =>
        '<h2 class="card-group-title">' + escapeHtml(group.label) + '</h2><div class="ref-cards">' +
        cards.filter(c => c.group === group.id).map(card =>
            '<div class="ref-card' + (grammarSelected.has(card.id) ? ' selected' : '') + (card.chosen === false ? ' dim' : '') + '" data-id="' + card.id + '">' +
            '<label class="pick"><input type="checkbox" class="card-pick" value="' + card.id + '"' + (grammarSelected.has(card.id) ? ' checked' : '') + '> Print this card' +
            (card.chosen === false ? ' <span class="card-note">(not in the chosen tenses)</span>' : '') + '</label>' +
            grammarCardHtml(card) + '</div>').join('') +
        '</div>').join('');
    box.querySelectorAll('.card-pick').forEach(checkbox => {
        checkbox.onchange = () => {
            if (checkbox.checked) grammarSelected.add(checkbox.value);
            else grammarSelected.delete(checkbox.value);
            checkbox.closest('.ref-card').classList.toggle('selected', checkbox.checked);
        };
    });
}

function selectGrammarCards(all) {
    grammarSelected.clear();
    if (all) GRAMMAR_CARDS.forEach(card => grammarSelected.add(card.id));
    renderGrammarScreen();
}

// Prints the chosen cards in the order of the screen (FR-011, FR-012)
function printGrammarCards() {
    const items = GRAMMAR_CARDS.map(c => c.id).filter(id => grammarSelected.has(id));
    const tenses = selectedTenseIds("grammar");
    if (!items.length) {
        tutor("✏️", "Choose at least one card to print.");
        return;
    }
    if (!tenses.length) {
        tutor("✏️", "Choose at least one tense.");
        return;
    }
    document.getElementById('print-area').innerHTML = buildCardsPrintHtml({ kind: "grammar", items, tenses, columns: referenceColumns.grammar });
    tutor("🖨", "Printing " + items.length + (items.length === 1 ? " card" : " cards") + "... You can also save them as a PDF.");
    window.print();
}

// ---------- Verbs screen (filled in by T012 and T023) ----------

let currentVerb = null;
let verbLookupId = 0;

function verbLabel(verb) {
    return escapeHtml(verb.base) + ' <span class="verb-es">' + escapeHtml(verb.es.join(" / ")) + '</span>';
}

// Suggestions while typing (FR-004); Enter picks the first one or searches online
function setupVerbSearch() {
    const input = document.getElementById('verb-query');
    if (input.dataset.ready) return;
    input.dataset.ready = "1";
    input.oninput = () => showVerbSuggestions(input.value);
    input.onkeydown = (event) => {
        if (event.key !== "Enter") return;
        const found = searchVerbs(input.value);
        if (found.length) chooseVerb(found[0]);
        else searchVerbOnline(input.value);
    };
}

function showVerbSuggestions(query) {
    const box = document.getElementById('verb-suggestions');
    const found = searchVerbs(query);
    if (!query.trim()) {
        box.innerHTML = "";
    } else if (found.length) {
        box.innerHTML = found.map((verb, i) =>
            '<button class="verb-suggestion" data-index="' + i + '">' + verbLabel(verb) + '</button>').join('');
        box.querySelectorAll('.verb-suggestion').forEach(button => {
            button.onclick = () => chooseVerb(found[Number(button.dataset.index)]);
        });
    } else {
        box.innerHTML = '<p class="note">"' + escapeHtml(query.trim()) + '" is not in my verb list.</p>' +
            '<button class="small-btn verb-online">🔎 Search online</button>';
        box.querySelector('.verb-online').onclick = () => searchVerbOnline(query);
    }
}

function chooseVerb(verb) {
    verbLookupId++;
    currentVerb = verb;
    document.getElementById('verb-query').value = verb.base;
    document.getElementById('verb-suggestions').innerHTML = "";
    renderVerbsScreen();
}

// Verbs that are not in the list: public translation + verb check (FR-007)
async function searchVerbOnline(query) {
    const text = query.trim();
    if (!text) return;
    const lookup = ++verbLookupId;
    const box = document.getElementById('verb-suggestions');
    box.innerHTML = '<p class="status">🔎 Looking for "' + escapeHtml(text) + '" online...</p>';
    const verb = await lookupVerbOnline(text);
    if (lookup !== verbLookupId) return;
    if (verb) {
        chooseVerb(verb);
        tutor("🔎", "I found it online. Its Spanish translation is not reviewed yet.");
        return;
    }
    // Close verbs from the list help the student keep going (offline too)
    const start = normalizeQuery(text);
    const close = (searchVerbs(start.slice(0, 3)).length ? searchVerbs(start.slice(0, 3)) : searchVerbs(start.slice(0, 2))).slice(0, 4);
    const message = lastLookupOffline || navigator.onLine === false
        ? 'No internet connection, so I can only show verbs from my list.'
        : 'I couldn\'t find a verb for "' + escapeHtml(text) + '". Check the spelling or try another word.';
    box.innerHTML = '<p class="status error">' + message + '</p>' +
        (close.length ? '<p class="note">Maybe: </p>' + close.map((v, i) =>
            '<button class="verb-suggestion" data-index="' + i + '">' + verbLabel(v) + '</button>').join('') : '');
    box.querySelectorAll('.verb-suggestion').forEach(button => {
        button.onclick = () => chooseVerb(close[Number(button.dataset.index)]);
    });
}

// The card of one verb with the selected tenses, in the fixed order
function verbCardHtml(verb, tenseIds) {
    const rows = tenseIds.map(id => {
        const c = conjugate(verb, id);
        return '<tr><th>' + escapeHtml(c.tense) + '</th><td><strong>' + escapeHtml(c.formEn) + '</strong>' +
            '<div class="verb-example">' + escapeHtml(c.exampleEn) + '</div>' +
            '<div class="verb-translation">' + (c.exampleEs ? escapeHtml(c.exampleEs) : '<em>Translation not reviewed</em>') + '</div>' +
            (c.note ? '<div class="note">' + escapeHtml(c.note) + '</div>' : '') + '</td></tr>';
    }).join('');
    return '<div class="verb-card">' +
        '<h2>' + verbLabel(verb) + (verb.reviewed ? '' : ' <span class="not-reviewed">not reviewed</span>') + '</h2>' +
        '<table class="verb-table">' + rows + '</table></div>';
}

function renderVerbsScreen() {
    setupVerbSearch();
    const result = document.getElementById('verb-result');
    const tenseIds = selectedTenseIds("verbs");
    if (!currentVerb) {
        result.innerHTML = '<p class="note">Try: eat, comer, went, tocar...</p>';
    } else if (!tenseIds.length) {
        result.innerHTML = '<p class="status error">Choose at least one tense.</p>';
    } else {
        const added = verbSelection.some(v => v.base === currentVerb.base);
        result.innerHTML = verbCardHtml(currentVerb, tenseIds) +
            '<button class="small-btn verb-add"' + (added ? ' disabled' : '') + '>' + (added ? '✔ Added to print' : '➕ Add to print') + '</button>';
        result.querySelector('.verb-add').onclick = () => addVerbToPrint(currentVerb);
    }
    renderVerbSelection();
}

// ---------- Verbs to print (US3) ----------

const verbSelection = [];

function addVerbToPrint(verb) {
    if (!verbSelection.some(v => v.base === verb.base)) verbSelection.push(verb);
    tutor("➕", verb.base + " is ready to print. You have " + verbSelection.length + (verbSelection.length === 1 ? " verb." : " verbs."));
    renderVerbsScreen();
}

function removeVerbFromPrint(base) {
    const index = verbSelection.findIndex(v => v.base === base);
    if (index >= 0) verbSelection.splice(index, 1);
    renderVerbsScreen();
}

function renderVerbSelection() {
    const box = document.getElementById('verb-selection');
    if (!verbSelection.length) {
        box.innerHTML = '<p class="note">Add verbs with ➕ to print them as cards.</p>';
        return;
    }
    box.innerHTML = '<h3>🖨 Verbs to print (' + verbSelection.length + ')</h3><div class="chips">' +
        verbSelection.map((verb, i) => '<span class="chip">' + verbLabel(verb) +
            ' <button class="chip-remove" data-index="' + i + '" aria-label="Remove ' + escapeHtml(verb.base) + '">✖</button></span>').join('') +
        '</div>';
    box.querySelectorAll('.chip-remove').forEach(button => {
        button.onclick = () => removeVerbFromPrint(verbSelection[Number(button.dataset.index)].base);
    });
}

// Prints the chosen verbs, in the order they were added, with the tenses marked now
function printVerbCards() {
    const tenses = selectedTenseIds("verbs");
    if (!verbSelection.length) {
        tutor("✏️", "Add at least one verb with ➕ before printing.");
        return;
    }
    if (!tenses.length) {
        tutor("✏️", "Choose at least one tense.");
        return;
    }
    document.getElementById('print-area').innerHTML = buildCardsPrintHtml({ kind: "verbs", items: verbSelection.slice(), tenses, columns: referenceColumns.verbs });
    tutor("🖨", "Printing " + verbSelection.length + (verbSelection.length === 1 ? " verb card" : " verb cards") + "... You can also save them as a PDF.");
    window.print();
}
