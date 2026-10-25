/* =====================================================================
   NOTEBOOK (GAMES-13): checks what the student writes freely.
   The game's own rules work offline (research R2); LanguageTool adds
   spelling and other mistakes when the student leaves it on (R1).
   Pure: no DOM; the tests run it in Node.
   ===================================================================== */

const NOTEBOOK_MAX_LENGTH = 5000;
const LANGUAGETOOL_URL = "https://api.languagetool.org/v2/check";

// ---------- Words of the text, with their place ----------

function notebookTokens(text) {
    const tokens = [];
    let sentence = 0, last = 0;
    for (const match of text.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)) {
        // A new sentence starts after . ! ? or a new line
        if (tokens.length && /[.!?\n]/.test(text.slice(last, match.index))) sentence++;
        tokens.push({ word: match[0], lower: match[0].toLowerCase().replace(/’/g, "'"), start: match.index, end: match.index + match[0].length, sentence });
        last = match.index + match[0].length;
    }
    tokens.forEach((token, i) => { token.first = i === 0 || tokens[i - 1].sentence !== token.sentence; });
    return tokens;
}

// ---------- Verb forms, from the reviewed list of verbs (GAMES-6) ----------

let verbFormsCache = null;

// Common verbs in what students write that are not in the list of the verb cards
const NOTEBOOK_EXTRA_VERBS = ["like", "rain", "snow", "hate", "stay", "miss", "turn", "wish", "kiss", "wake"];

// Maps of base, -s and past forms of the one-word verbs. "be" has its own rule, and
// verbs whose past is the base (put, read) are left out: their tense cannot be told.
function notebookVerbForms() {
    if (verbFormsCache) return verbFormsCache;
    const base = {}, s3 = {}, past = {};
    const known = new Set(VERBS.map(v => v.base));
    for (const verb of VERBS.concat(NOTEBOOK_EXTRA_VERBS.filter(base => !known.has(base)).map(base => ({ base })))) {
        if (verb.base.includes(" ") || verb.base === "be") continue;
        const forms = englishForms(verb);
        if (forms.past === forms.base) continue;
        base[forms.base] = forms;
        s3[forms.s3] = forms;
        past[forms.past] = forms;
    }
    verbFormsCache = { base, s3, past };
    return verbFormsCache;
}

// ---------- Rules ----------

const SINGULAR = ["he", "she", "it"];
const PLURAL = ["i", "you", "we", "they"];
const SUBJECTS = SINGULAR.concat(PLURAL);
const FREQUENCY = ["always", "usually", "often", "sometimes", "never", "really", "also", "just", "still", "rarely"];
// Before a subject, these words mean the verb after it stays in base form: Does she play? Let it go.
const BEFORE_SUBJECT = ["do", "does", "did", "don't", "doesn't", "didn't", "can", "could", "will", "would", "shall", "should", "may", "might", "must",
    "can't", "couldn't", "won't", "wouldn't", "shouldn't", "let", "make", "makes", "made", "help", "helps", "helped", "see", "saw", "sees",
    "watch", "watched", "hear", "heard"];
// If I were a bird, I wish I were taller: "were" is right with I, he, she and it
const BEFORE_WERE = ["if", "wish", "as"];
// After these words the verb goes in base form: didn't go, can swim, will play
const BASE_AFTER = ["do", "does", "did", "don't", "doesn't", "didn't", "can", "could", "will", "would", "should", "may", "might", "must",
    "can't", "cannot", "couldn't", "won't", "wouldn't", "shouldn't"];
const PAST_MARKER = /\b(yesterday|ago|last (night|week|weekend|month|year|summer|winter|spring|fall|autumn|time|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|in (19|20)\d\d)\b/i;
const BE_PRESENT = { i: "am", he: "is", she: "is", it: "is", you: "are", we: "are", they: "are" };
const BE_PAST = { i: "was", he: "was", she: "was", it: "was", you: "were", we: "were", they: "were" };

const NOTEBOOK_MESSAGES = {
    I_LOWERCASE: 'Write "I" with a capital letter.',
    CAPITAL_START: "Start every sentence with a capital letter.",
    END_PUNCTUATION: "End your sentence with a period (.), a question mark (?) or an exclamation mark (!).",
    A_AN: 'Use "an" before a vowel sound (an apple, an hour) and "a" before a consonant sound (a dog, a university).',
    THIRD_PERSON: "With he, she or it, the verb ends in -s in the present simple: she plays.",
    PLURAL_PERSON: "With I, you, we or they, the verb has no -s in the present simple: they play.",
    DO_DOES: 'Use "doesn\'t" with he, she and it, and "don\'t" with I, you, we and they.',
    BE_AGREEMENT: 'Use "am" with I, "is" with he, she and it, and "are" with you, we and they.',
    WAS_WERE: 'Use "was" with I, he, she and it, and "were" with you, we and they.',
    BASE_AFTER: "After this word, use the verb in its base form (without -s or -ed).",
    REPEATED_WORD: "You wrote the same word twice."
};

function sameCase(model, word) {
    return /^[A-Z]/.test(model) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

function makeIssue(text, start, end, rule, kind, suggestions, message) {
    return { start, end, found: text.slice(start, end), rule, kind, message: message || NOTEBOOK_MESSAGES[rule], suggestions, source: "game" };
}

function startsWithVowelSound(word) {
    const lower = word.toLowerCase();
    if (/^(hour|honest|hono(u)?r|heir|herb)/.test(lower)) return true;
    if (/^(uni|use|usu|uti|ure|uro|eu|ewe|one|once|ufo|uk)/.test(lower)) return false;
    return /^[aeiou]/.test(lower);
}

// The verb after a subject: the next word, or the one after an adverb of frequency (she always plays)
function verbAfter(tokens, i) {
    let j = i + 1;
    if (tokens[j] && tokens[j].sentence === tokens[i].sentence && FREQUENCY.includes(tokens[j].lower)) j++;
    return tokens[j] && tokens[j].sentence === tokens[i].sentence ? tokens[j] : null;
}

function subjectRules(text, tokens, i, pastSentence, marker, issues) {
    const subject = tokens[i];
    const before = tokens[i - 1];
    if (before && before.sentence === subject.sentence && BEFORE_SUBJECT.includes(before.lower)) return;
    const verb = verbAfter(tokens, i);
    if (!verb) return;
    const forms = notebookVerbForms();
    const singular = SINGULAR.includes(subject.lower);
    const add = (rule, kind, suggestion, message) => issues.push(makeIssue(text, verb.start, verb.end, rule, kind, [sameCase(verb.word, suggestion)], message));

    if (["am", "is", "are"].includes(verb.lower)) {
        const right = pastSentence ? BE_PAST[subject.lower] : BE_PRESENT[subject.lower];
        if (verb.lower !== right) add(pastSentence ? "PAST_TIME" : "BE_AGREEMENT", "grammar", right,
            pastSentence ? pastMessage(marker, right) : null);
        return;
    }
    if (["was", "were"].includes(verb.lower)) {
        const subjunctive = verb.lower === "were" && before && before.sentence === subject.sentence && BEFORE_WERE.includes(before.lower);
        if (verb.lower !== BE_PAST[subject.lower] && !subjunctive) add("WAS_WERE", "grammar", BE_PAST[subject.lower]);
        return;
    }
    if (["don't", "doesn't"].includes(verb.lower)) {
        const right = pastSentence ? "didn't" : (singular ? "doesn't" : "don't");
        if (verb.lower !== right) add(pastSentence ? "PAST_TIME" : "DO_DOES", "grammar", right, pastSentence ? pastMessage(marker, right) : null);
        return;
    }
    const present = forms.base[verb.lower] || forms.s3[verb.lower];
    if (!present) return;
    if (pastSentence) {
        add("PAST_TIME", "grammar", present.past, pastMessage(marker, present.past));
    } else if (singular && forms.base[verb.lower] && verb.lower !== present.s3) {
        add("THIRD_PERSON", "grammar", present.s3);
    } else if (!singular && forms.s3[verb.lower] && verb.lower !== present.base) {
        add("PLURAL_PERSON", "grammar", present.base);
    }
}

function pastMessage(marker, right) {
    return 'This sentence talks about the past ("' + marker + '"). Use the past simple: "' + right + '".';
}

/**
 * Mistakes found by the game's own rules, in the order of the text, without overlaps (FR-003).
 * @returns {{ start, end, found, rule, kind, message, suggestions: string[], source: "game" }[]}
 */
function checkNotebookText(text) {
    const tokens = notebookTokens(text);
    const forms = notebookVerbForms();
    const issues = [];
    // The text of each sentence, from its first word to its last one (with numbers: in 2020)
    const sentenceText = {};
    tokens.forEach(t => {
        const first = tokens.find(other => other.sentence === t.sentence);
        sentenceText[t.sentence] = text.slice(first.start, t.end);
    });

    tokens.forEach((token, i) => {
        const next = tokens[i + 1] && tokens[i + 1].sentence === token.sentence ? tokens[i + 1] : null;
        const gap = next ? text.slice(token.end, next.start) : "";
        const markerMatch = sentenceText[token.sentence].match(PAST_MARKER);

        if (/^i(?:'(m|ve|ll|d))?$/.test(token.word.replace(/’/g, "'"))) {
            issues.push(makeIssue(text, token.start, token.end, "I_LOWERCASE", "punctuation", ["I" + token.word.slice(1)]));
        } else if (token.first && /^[a-z]/.test(token.word)) {
            issues.push(makeIssue(text, token.start, token.end, "CAPITAL_START", "punctuation", [sameCase("A", token.word)]));
        }

        if (SUBJECTS.includes(token.lower)) subjectRules(text, tokens, i, Boolean(markerMatch), markerMatch && markerMatch[0], issues);

        if ((token.lower === "a" || token.lower === "an") && next && /^\s+$/.test(gap) && !/^[A-Z]{2,}$/.test(next.word)) {
            const right = startsWithVowelSound(next.word) ? "an" : "a";
            if (token.lower !== right) issues.push(makeIssue(text, token.start, token.end, "A_AN", "grammar", [sameCase(token.word, right)]));
        }

        if (BASE_AFTER.includes(token.lower) && !(token.word === "May" && !token.first)) {
            let verb = next;
            if (verb && (SUBJECTS.includes(verb.lower) || verb.lower === "not")) verb = tokens[i + 2] && tokens[i + 2].sentence === token.sentence ? tokens[i + 2] : null;
            const wrong = verb && !forms.base[verb.lower] && (forms.s3[verb.lower] || forms.past[verb.lower]);
            if (wrong) issues.push(makeIssue(text, verb.start, verb.end, "BASE_AFTER", "grammar", [sameCase(verb.word, wrong.base)],
                'After "' + token.word + '", use the verb in its base form: "' + wrong.base + '".'));
        }

        if (next && /^[ \t]+$/.test(gap) && token.lower === next.lower && !["had", "that"].includes(token.lower)) {
            issues.push(makeIssue(text, token.start, next.end, "REPEATED_WORD", "grammar", [token.word]));
        }
    });

    // A line of 4 or more words without . ! ? at the end: the mark goes right after the last word
    let offset = 0;
    for (const line of text.split("\n")) {
        const trimmed = line.replace(/\s+$/, "");
        if (trimmed.split(/\s+/).filter(w => /[A-Za-z]/.test(w)).length >= 4 && !/[.!?:;"')\]…]$/.test(trimmed)) {
            const at = offset + trimmed.length;
            issues.push(makeIssue(text, at, at, "END_PUNCTUATION", "punctuation", ["."]));
        }
        offset += line.length + 1;
    }
    return mergeIssues(issues, []);
}

// ---------- LanguageTool (research R1) ----------

// Typography rules that only confuse primary students
const LANGUAGETOOL_SKIP = ["EN_QUOTES", "DASH_RULE", "WHITESPACE_RULE", "ELLIPSIS", "COMMA_PARENTHESIS_WHITESPACE"];

/** Mistakes from a LanguageTool answer: at most 3 suggestions, none UNSAFE, only with a suggestion. */
function languageToolIssues(json, text) {
    const issues = [];
    for (const match of (json && json.matches) || []) {
        const start = match.offset, end = match.offset + match.length;
        if (!(match.length > 0 && start >= 0 && end <= text.length)) continue;
        const rule = match.rule || {};
        if (LANGUAGETOOL_SKIP.includes(rule.id)) continue;
        const suggestions = [...new Set((match.replacements || []).map(r => r.value))]
            .filter(value => value && !UNSAFE.test(value)).slice(0, 3);
        if (!suggestions.length) continue;
        const category = rule.category ? rule.category.id : "";
        const kind = rule.issueType === "misspelling" || category === "TYPOS" ? "spelling"
            : ["PUNCTUATION", "CASING", "TYPOGRAPHY"].includes(category) ? "punctuation" : "grammar";
        issues.push({ start, end, found: text.slice(start, end), rule: rule.id || "LANGUAGETOOL", kind, message: match.message || match.shortMessage || "", suggestions, source: "online" });
    }
    return issues;
}

function overlaps(a, b) {
    if (a.start === a.end || b.start === b.end) return a.start === b.start && a.end === b.end;
    return a.start < b.end && b.start < a.end;
}

/** The game's mistakes first, then the online ones that do not overlap them; in the order of the text (FR-006). */
function mergeIssues(gameIssues, onlineIssues) {
    const kept = [];
    for (const issue of gameIssues.concat(onlineIssues)) {
        if (!kept.some(other => overlaps(other, issue))) kept.push(issue);
    }
    return kept.sort((a, b) => a.start - b.start || a.end - b.end);
}

/** Asks LanguageTool; the text goes in the body of the request, never in the URL (FR-006, FR-007). */
async function checkOnline(text) {
    let response;
    try {
        response = await fetch(LANGUAGETOOL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ text, language: "en-US" }).toString()
        });
    } catch (error) {
        throw new Error("The online check is not available (no internet?). Here are the game's own suggestions.");
    }
    if (response.status === 429) throw new Error("The online checker is busy. Wait a minute and try again. Here are the game's own suggestions.");
    if (!response.ok) throw new Error("The online check is not available right now (error " + response.status + "). Here are the game's own suggestions.");
    return languageToolIssues(await response.json(), text);
}

// ---------- Using a suggestion (research R4) ----------

/** The text with the suggestion of issues[index]; that mark goes away and the next ones move with the text (FR-005). */
function applySuggestion(text, issues, index, replacement) {
    const used = issues[index];
    const delta = replacement.length - (used.end - used.start);
    const newText = text.slice(0, used.start) + replacement + text.slice(used.end);
    const rest = [];
    issues.forEach((issue, i) => {
        if (i === index || overlaps(issue, used) || (issue.start < used.end && issue.end > used.start)) return;
        if (issue.start >= used.end) rest.push(Object.assign({}, issue, { start: issue.start + delta, end: issue.end + delta }));
        else rest.push(issue);
    });
    return { text: newText, issues: rest };
}

// ---------- HTML ----------

function textHtml(text) {
    return escapeHtml(text).replace(/\n/g, "<br>");
}

/** The text with the mistakes marked and numbered from 1 (FR-004). */
function markedTextHtml(text, issues) {
    let html = "", at = 0;
    issues.forEach((issue, i) => {
        html += textHtml(text.slice(at, issue.start));
        const inner = issue.start === issue.end ? "‸" : textHtml(text.slice(issue.start, issue.end));
        html += '<mark class="nb-mark nb-' + issue.kind + (issue.start === issue.end ? ' nb-insert' : '') + '" data-n="' + (i + 1) + '">' +
            inner + '</mark><sup class="nb-n">' + (i + 1) + '</sup>';
        at = issue.end;
    });
    return html + textHtml(text.slice(at));
}

function suggestionLabel(value) {
    return value === "" ? "(delete it)" : value;
}

// ---------- Saved pages (research R3) ----------

const NOTEBOOK_KEY = "games-notebook-v1";

function emptyNotebook() {
    return { version: 1, online: true, pages: [] };
}

/** @returns {{ store, available: boolean }} available is false when the browser does not let us save (FR-009) */
function loadNotebook(storage) {
    let raw;
    try {
        raw = storage.getItem(NOTEBOOK_KEY);
    } catch (error) {
        return { store: emptyNotebook(), available: false };
    }
    try {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.pages)) {
            const pages = data.pages.filter(p => p && typeof p.id === "string" && typeof p.text === "string" && typeof p.created === "string")
                .map(p => ({ id: p.id, created: p.created, updated: p.updated || p.created, title: String(p.title || ""), text: p.text }));
            return { store: { version: 1, online: data.online !== false, pages }, available: true };
        }
    } catch (error) { /* an unreadable notebook starts empty */ }
    return { store: emptyNotebook(), available: true };
}

/** @returns {boolean} false when the page could not be saved */
function saveNotebook(storage, store) {
    try {
        storage.setItem(NOTEBOOK_KEY, JSON.stringify(store));
        return true;
    } catch (error) {
        return false;
    }
}

function newNotebookPage(nowIso, pages) {
    let id = "p" + Date.parse(nowIso), n = 1;
    while (pages.some(p => p.id === id)) id = "p" + Date.parse(nowIso) + "-" + (n++);
    return { id, created: nowIso, updated: nowIso, title: "", text: "" };
}

function sortedPages(pages) {
    return pages.slice().sort((a, b) => b.created.localeCompare(a.created));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function notebookDate(iso) {
    const date = new Date(iso);
    return MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

function pageLabel(page) {
    const words = page.text.trim().replace(/\s+/g, " ");
    const name = page.title.trim() || (words.length > 30 ? words.slice(0, 30) + "…" : words) || "Empty page";
    return notebookDate(page.created) + " · " + name;
}

function wordCount(text) {
    return (text.match(/[A-Za-z0-9]+(?:['’][A-Za-z]+)*/g) || []).length;
}

// ---------- Printed page (FR-010) ----------

/**
 * @param {{ name: string, page, issues, checkedWith: "game"|"online"|"game-only-offline" }} options
 */
function buildNotebookPrintHtml({ name, page, issues, checkedWith }) {
    const note = checkedWith === "online" ? "Checked with the game's rules and LanguageTool (languagetool.org)."
        : checkedWith === "game-only-offline" ? "Checked with the game's rules (the online check was not available)."
        : "Checked with the game's rules.";
    const list = issues.length
        ? '<ol class="nb-print-list">' + issues.map(issue =>
            '<li><b>' + (issue.start === issue.end ? "(missing)" : escapeHtml(issue.found)) + '</b> → ' +
            issue.suggestions.map(s => escapeHtml(suggestionLabel(s))).join(" / ") +
            '<div class="nb-print-why">' + escapeHtml(issue.message) + '</div></li>').join('') + '</ol>'
        : '<p class="nb-print-ok">No mistakes found. Great job! 🎉</p>';
    return '<div class="print-sheet nb-print"><h1 class="print-title">My Notebook</h1>' +
        '<p class="nb-print-meta"><b>Name:</b> ' + (escapeHtml(name || "") || "__________________") +
        ' &nbsp;·&nbsp; <b>Date:</b> ' + escapeHtml(notebookDate(page.created)) + '</p>' +
        (page.title.trim() ? '<h2 class="nb-print-title">' + escapeHtml(page.title.trim()) + '</h2>' : '') +
        '<div class="nb-print-text">' + markedTextHtml(page.text, issues) + '</div>' +
        '<h3 class="nb-print-heading">Suggestions</h3>' + list +
        '<p class="nb-print-note">' + note + '</p></div>';
}
