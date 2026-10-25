// Printed versions of a guide: student sheet and answer key (GAMES-3, FR-004 to FR-013, FR-019)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createGameContext, loadFixture, ENGLISH_DIR } from './helpers/game-context.mjs';
import { SCENARIOS } from './fixtures/record.mjs';

const game = createGameContext();
const demos = game.toPlain(game.run('DEMO_GUIDES'));

async function generatedGuides() {
    const guides = {};
    for (const name of Object.keys(SCENARIOS)) {
        const fixture = loadFixture(name);
        const replay = createGameContext({ seed: fixture.seed, fixture });
        guides[name] = replay.toPlain(await replay.run(SCENARIOS[name].expression));
    }
    return guides;
}
const generated = await generatedGuides();
const ALL_GUIDES = Object.assign({ 'demo gvs': demos.gvs, 'demo rl': demos.rl, 'demo writing': demos.writing }, generated);

const buildPrintHtml = (guide, version) => game.call('buildPrintHtml', guide, version);
const printSection = (section, isKey) => game.call('printSection', section, isKey);

// Number of elements whose class list contains the token
function countClass(html, token) {
    return Array.from(html.matchAll(/class="([^"]*)"/g)).filter(m => m[1].split(/\s+/).includes(token)).length;
}

// Visible text of the printed HTML
function textOf(html) {
    return html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, ' ')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        .replace(/[ \t]+/g, ' ');
}

const escapeForText = (text) => textOf(game.call('escapeHtml', text)).replace(/[ \t]+/g, ' ').trim();

// ---------- Student sheet ----------

for (const [name, guide] of Object.entries(ALL_GUIDES)) {
    test(`${name}: the student sheet has no answers or read-aloud texts (FR-007)`, () => {
        const html = buildPrintHtml(guide, 'student');
        assert.equal(countClass(html, 'key'), 0);
        assert.equal(countClass(html, 'read-aloud'), 0);
        const text = textOf(html);
        for (const section of guide.sections) {
            const sectionText = textOf(printSection(section, false));
            if (section.type === 'dictation') {
                for (const item of section.items) assert.ok(!new RegExp('\\b' + item.text + '\\b', 'i').test(sectionText), 'dictation word: ' + item.text);
            }
            if (section.script) {
                for (const sentence of section.script.split(/(?<=[.!?])\s+/).filter(s => s.length > 25)) {
                    assert.ok(!text.includes(sentence), 'script sentence: ' + sentence);
                }
            }
            for (const item of section.items || []) {
                if (item.tip) assert.ok(!text.includes(escapeForText(item.tip)), 'tip: ' + item.tip);
                if (section.type !== 'choice' && item.explanation && item.explanation.split(' ').length > 3) {
                    assert.ok(!text.includes(escapeForText(item.explanation)), 'explanation: ' + item.explanation);
                }
                if (section.type === 'rewrite') {
                    for (const answer of item.answers) assert.ok(!text.includes(escapeForText(answer)), 'rewrite answer: ' + answer);
                }
            }
        }
    });

    test(`${name}: one block per item and a blank to answer each written item (FR-006)`, () => {
        for (const section of guide.sections) {
            const html = printSection(section, false);
            const items = (section.items || []).length;
            assert.equal(countClass(html, 'print-item'), items, section.title);
            if (section.type !== 'choice' && section.type !== 'writing') {
                assert.ok(countClass(html, 'blank') >= items, 'blanks in ' + section.title);
            }
        }
    });

    test(`${name}: header like the PDFs, always blank for the student (FR-004)`, () => {
        const html = buildPrintHtml(guide, 'student');
        const text = textOf(html);
        assert.ok(text.includes(guide.title) && !text.includes('ANSWER KEY'));
        assert.ok(text.includes(escapeForText(guide.subtitle)));
        if (guide.school) assert.ok(text.includes(guide.school));
        for (const field of ['Name', 'Group', 'R.N', 'Date', 'Average']) {
            assert.ok(html.includes('<b>' + field + ':</b> <span class="field-line"></span>'), field);
        }
        if (guide.teacher) assert.ok(html.includes('<b>Teacher:</b> ' + guide.teacher));
        else assert.ok(html.includes('<b>Teacher:</b> <span class="field-line"></span>'));
    });

    test(`${name}: every section title and group is printed in order (FR-005)`, () => {
        const html = buildPrintHtml(guide, 'student');
        let position = 0;
        for (const section of guide.sections) {
            const found = html.indexOf(section.title, position);
            assert.ok(found >= position, 'section in order: ' + section.title);
            position = found;
        }
        for (const group of new Set(guide.sections.map(s => s.group))) assert.ok(html.includes('<div class="print-group">' + group + '</div>'));
    });

    test(`${name}: printing does not change the guide (FR-016)`, () => {
        const before = JSON.stringify(guide);
        buildPrintHtml(guide, 'student');
        buildPrintHtml(guide, 'key');
        assert.equal(JSON.stringify(guide), before);
    });
}

test('choice items print a) b) c) options, with the reading text before its questions', () => {
    const reading = demos.rl.sections[0];
    const html = printSection(reading, false);
    const text = textOf(html);
    for (const item of reading.items) {
        item.options.forEach((option, i) => assert.ok(text.includes('abc'[i] + ') ' + option), option));
    }
    assert.ok(text.indexOf('Jordan Jacobs is a young sculptor') < text.indexOf('What did Jordan like doing'));
    const spelling = textOf(printSection(demos.gvs.sections[6], false));
    assert.ok(spelling.includes('a) comfortably') && spelling.includes('b) confortablie') && spelling.includes('c) comfortabli'));
});

test('match prints each word with a space for the letter and the definitions in letter order', () => {
    const section = demos.gvs.sections[3];
    const text = textOf(printSection(section, false));
    assert.ok(text.includes('1. sculptor'));
    let position = 0;
    for (const definition of section.definitions) {
        const found = text.indexOf(definition.letter + '. ' + definition.text, position);
        assert.ok(found >= position, definition.text);
        position = found;
    }
});

test('the word bank and the dictation lines are printed', () => {
    const bank = textOf(printSection(demos.gvs.sections[4], false));
    assert.ok(bank.includes('conservation / volunteer / environment / charity'));
    const dictation = printSection(demos.gvs.sections[5], false);
    assert.equal(countClass(dictation, 'blank'), 5);
    for (const n of [1, 2, 3, 4, 5]) assert.ok(textOf(dictation).includes(n + '.'));
});

test('generated texts keep their CC BY-SA source (FR-008)', () => {
    for (const guide of Object.values(generated)) {
        for (const section of guide.sections.filter(s => s.source)) {
            if (section.type === 'fill' && section.script) continue; // the listening source goes with its script, in the answer key
            assert.ok(textOf(buildPrintHtml(guide, 'student')).includes(escapeForText(section.source)), section.source);
        }
    }
});

test('writing prints Remember, the lines to write, the criteria with points and the total', () => {
    const section = demos.writing.sections[0];
    const html = printSection(section, false);
    const text = textOf(html);
    assert.ok(text.includes('Remember'));
    for (const reminder of section.remember) assert.ok(text.includes(reminder));
    assert.equal(countClass(html, 'write-line'), section.lines);
    assert.ok(text.includes('Criteria'));
    for (const criterion of section.criteria) assert.ok(text.includes(criterion.text + ' (' + criterion.points + ')'), criterion.text);
    assert.match(text, /Total\s+\/ 10/);
    const generatedWriting = textOf(printSection(generated['writing-animals-g5'].sections[0], false));
    for (const word of generated['writing-animals-g5'].sections[0].usefulWords) assert.ok(generatedWriting.includes(word));
});

test('an unknown version is an error', () => {
    assert.throws(() => buildPrintHtml(demos.gvs, 'teacher'), /Unknown print version/);
});

test('text from the guide is escaped', () => {
    const guide = { title: 'T', subtitle: 'S', teacher: '', school: '', sections: [
        { group: 'G', type: 'rewrite', title: '1. Rewrite', items: [{ text: '<script>alert(1)</script>', answers: ['x'] }] }
    ] };
    const html = buildPrintHtml(guide, 'student');
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&lt;script&gt;'));
});

// ---------- Answer key ----------

const isCorrect = (section, item, response) => game.call('isCorrect', section, item, response);

// Texts of the printed answers, in document order
function keyTexts(html) {
    return Array.from(html.matchAll(/<span class="key">([\s\S]*?)<\/span>/g)).map(m => textOf(m[1]).trim());
}

for (const [name, guide] of Object.entries(ALL_GUIDES)) {
    test(`${name}: the answer key is marked as such (FR-009)`, () => {
        const html = buildPrintHtml(guide, 'key');
        assert.ok(html.includes('<div class="print-key-badge">ANSWER KEY</div>'));
        assert.ok(html.indexOf('<div class="print-key-badge">ANSWER KEY</div>') < html.indexOf('<h1 class="print-title">' + game.call('escapeHtml', guide.title) + '</h1>'));
    });

    test(`${name}: every item shows an answer that the game accepts (FR-009, SC-003)`, () => {
        for (const section of guide.sections.filter(s => s.type !== 'writing')) {
            const answers = keyTexts(printSection(section, true));
            assert.ok(answers.length >= section.items.length, 'answers in ' + section.title);
            section.items.forEach((item, i) => {
                const printed = answers[i];
                if (section.type === 'choice') {
                    assert.equal(printed, 'abc'[item.answer] + ') ' + item.options[item.answer], item.text);
                    assert.equal(isCorrect(section, item, String(item.answer)), true);
                } else {
                    assert.equal(printed, escapeForText(item.answers[0]), item.text);
                    assert.equal(isCorrect(section, item, printed), true, 'accepted on screen: ' + printed);
                }
            });
        }
    });

    test(`${name}: other valid forms are listed (FR-010)`, () => {
        for (const section of guide.sections.filter(s => ['rewrite', 'fill', 'bank'].includes(s.type))) {
            const text = textOf(printSection(section, true));
            for (const item of section.items.filter(i => i.answers.length > 1)) {
                assert.ok(text.includes('Also accepted: ' + escapeForText(item.answers[1])), item.text);
            }
        }
    });

    test(`${name}: the key has the same questions and options in the same order (FR-013)`, () => {
        for (const section of guide.sections.filter(s => s.type === 'choice')) {
            const unmarked = printSection(section, true).replace(/<span class="key">([\s\S]*?)<\/span>/g, '$1');
            assert.equal(unmarked, printSection(section, false), section.title);
        }
        const studentTitles = guide.sections.map(s => buildPrintHtml(guide, 'student').indexOf(s.title));
        const keyTitles = guide.sections.map(s => buildPrintHtml(guide, 'key').indexOf(s.title));
        assert.deepEqual(studentTitles.map((p, i, a) => i === 0 || p > a[i - 1]), keyTitles.map((p, i, a) => i === 0 || p > a[i - 1]));
    });
}

test('the key includes the dictation words and the listening script to read aloud (FR-011)', () => {
    const dictation = printSection(demos.gvs.sections[5], true);
    assert.equal(countClass(dictation, 'read-aloud'), 1);
    const readAloud = textOf(dictation.slice(dictation.indexOf('read-aloud'), dictation.indexOf('print-item')));
    let position = 0;
    for (const item of demos.gvs.sections[5].items) {
        const found = readAloud.indexOf(item.text, position);
        assert.ok(found >= position, item.text);
        position = found;
    }
    const listening = printSection(demos.rl.sections[1], true);
    assert.equal(countClass(listening, 'read-aloud'), 1);
    assert.ok(textOf(listening).includes(demos.rl.sections[1].script));
    const generatedListening = generated['rl-space-g5'].sections[1];
    const text = textOf(printSection(generatedListening, true));
    assert.ok(text.includes(generatedListening.script) && text.includes(escapeForText(generatedListening.source)));
});

test('the key includes the solved match table (word → letter. definition)', () => {
    const section = demos.gvs.sections[3];
    const text = textOf(printSection(section, true));
    for (const item of section.items) {
        const definition = section.definitions.find(d => d.letter === item.answers[0]);
        assert.ok(text.includes(item.text + ' → ' + definition.letter + '. ' + definition.text), item.text);
    }
});

test('the writing key is a rubric without lines to write (FR-012)', () => {
    for (const guide of [demos.writing, generated['writing-animals-g5']]) {
        const html = printSection(guide.sections[0], true);
        assert.equal(countClass(html, 'blank'), 0);
        assert.equal(countClass(html, 'write-line'), 0);
        const text = textOf(html);
        assert.ok(text.includes('Grading rubric'));
        for (const criterion of guide.sections[0].criteria) assert.ok(text.includes(criterion.text + ' (' + criterion.points + ')'));
    }
});

// ---------- Titles stay with their first block on paper, also in Safari (GAMES-10) ----------

// Contents of every <div class="print-keep">…</div> (they can hold nested divs)
function keepBlocks(html) {
    const blocks = [];
    const open = '<div class="print-keep">';
    let from = html.indexOf(open);
    while (from >= 0) {
        let depth = 0, i = from;
        const tag = /<\/?div\b[^>]*>/g;
        tag.lastIndex = from;
        let m;
        while ((m = tag.exec(html))) {
            depth += m[0].startsWith('</') ? -1 : 1;
            if (depth === 0) { i = tag.lastIndex; break; }
        }
        blocks.push(html.slice(from + open.length, i - '</div>'.length));
        from = html.indexOf(open, i);
    }
    return blocks;
}

const FIRST_BLOCK = /class="(print-item|print-bank|print-match|read-aloud|print-passage|print-remember|print-lines)\b/;

test('every section title and group title is kept with the first block of its section (FR-001, FR-002, FR-006)', () => {
    for (const [name, guide] of Object.entries(ALL_GUIDES)) {
        for (const version of ['student', 'key']) {
            const html = buildPrintHtml(guide, version);
            const where = name + ' / ' + version;
            const keeps = keepBlocks(html);
            assert.equal(keeps.length, guide.sections.length, where + ': one .print-keep per section');
            assert.equal(countClass(html, 'print-section-title'), keeps.filter(k => k.includes('class="print-section-title"')).length, where + ': a title outside .print-keep');
            assert.equal(countClass(html, 'print-group'), keeps.filter(k => k.startsWith('<div class="print-group">')).length, where + ': a group title outside .print-keep');
            keeps.forEach((keep, i) => {
                const afterTitle = keep.slice(keep.indexOf('class="print-section-title"'));
                assert.match(afterTitle, FIRST_BLOCK, where + ': section ' + (i + 1) + ' keeps its title alone');
            });
        }
    }
});

test('.print-keep is not split between pages, with a rule that Safari follows (FR-003)', () => {
    const css = fs.readFileSync(path.join(ENGLISH_DIR, 'css', 'quiz.css'), 'utf8');
    const print = css.split('@media print').slice(1).join(' ');
    assert.match(print, /\.print-keep\s*\{[^}]*break-inside:\s*avoid[^}]*page-break-inside:\s*avoid/);
});
