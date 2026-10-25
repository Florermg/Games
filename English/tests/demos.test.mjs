// The three demo guides, exactly as the PDFs of English/documentacion (FR-005 to FR-008, SC-002)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext();
const demos = game.toPlain(game.run('DEMO_GUIDES'));
const writingChecks = Object.keys(game.run('WRITING_CHECKS'));
const isCorrect = (section, item, response) => game.call('isCorrect', section, item, response);

// Every item must accept its own correct answer (SC-002)
function assertAcceptsOwnAnswers(section) {
    section.items.forEach((item, i) => {
        if (section.type === 'choice') {
            assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length, 'answer index ' + i);
            assert.equal(isCorrect(section, item, String(item.answer)), true, 'item ' + i);
            assert.equal(new Set(item.options.map(o => o.toLowerCase())).size, item.options.length, 'distinct options ' + i);
        } else {
            assert.ok(item.answers.length > 0, 'answers ' + i);
            assert.equal(isCorrect(section, item, item.answers[0]), true, 'item ' + i);
        }
        assert.ok(item.tip, 'tip ' + i);
    });
}

function assertBlanks(section) {
    for (const item of section.items) assert.equal(item.text.split('___').length, 2, item.text);
}

// ---------- Grammar, Vocabulary & Spelling ----------

const gvs = demos.gvs;

test('gvs: header and section order as in the PDF (FR-005)', () => {
    assert.equal(gvs.title, 'GRAMMAR, VOCABULARY & SPELLING GUIDE');
    assert.equal(gvs.subtitle, '1st Trimester - 5th Grade');
    assert.equal(gvs.teacher, 'Aurora Corante');
    assert.deepEqual(gvs.sections.map(s => s.group + ':' + s.type + ':' + s.items.length), [
        'Grammar:bank:5', 'Grammar:rewrite:5', 'Grammar:rewrite:5',
        'Vocabulary:match:9', 'Vocabulary:bank:4', 'Spelling:dictation:5', 'Spelling:choice:5'
    ]);
});

test('gvs section 1: quantifiers with the 5-word bank', () => {
    const section = gvs.sections[0];
    assert.match(section.title, /^1\. Complete the sentences using/);
    assert.deepEqual(section.bank, ['all', 'most', 'some', 'a few', 'no']);
    assertBlanks(section);
    assertAcceptsOwnAnswers(section);
    assert.deepEqual(section.items.map(i => i.answers[0]), ['most', 'all', 'a few', 'some', 'no']);
    for (const item of section.items) assert.ok(section.bank.includes(item.answers[0]));
});

test('gvs section 2: causative rewrites accept their explanation', () => {
    const section = gvs.sections[1];
    assert.match(section.title, /^2\. Rewrite the sentences using Causative Verbs/);
    assertAcceptsOwnAnswers(section);
    assert.equal(section.items[0].text, 'My car was very dirty, so someone washed it yesterday.');
    assert.equal(section.items[4].text, "The photographer took my brother's photo at school last Friday.");
    for (const item of section.items) assert.equal(isCorrect(section, item, item.explanation), true, item.text);
});

test('gvs section 3: sentences with ago accept their explanation', () => {
    const section = gvs.sections[2];
    assert.match(section.title, /^3\. Write sentences with <i>ago<\/i>/);
    assertAcceptsOwnAnswers(section);
    assert.deepEqual(section.items.map(i => i.text), [
        'I / go / Paris / two years',
        'I / finish my homework / an hour',
        'We / see the movie / three weeks',
        'I / go swimming in the ocean / one week',
        'My brother / wake up / ten minutes'
    ]);
    for (const item of section.items) assert.equal(isCorrect(section, item, item.explanation), true, item.text);
    assert.equal(isCorrect(section, section.items[3], 'I went swimming in the ocean a week ago'), true);
});

test('gvs section 4: match 9 words with lettered definitions', () => {
    const section = gvs.sections[3];
    assert.match(section.title, /^2\. Match the words and the definitions/);
    const letters = section.definitions.map(d => d.letter);
    assert.deepEqual(letters, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']);
    assertAcceptsOwnAnswers(section);
    const used = section.items.map(i => i.answers[0]);
    for (const letter of used) assert.ok(letters.includes(letter));
    assert.equal(new Set(used).size, used.length, 'each letter used once');
    const pairs = Object.fromEntries(section.items.map(i => [i.text, section.definitions.find(d => d.letter === i.answers[0]).text]));
    assert.equal(pairs.veterinarian, 'a doctor for animals');
    assert.equal(pairs.sculptor, 'someone who makes art from materials like wood');
    assert.equal(pairs.crowd, 'a lot of people in one place');
});

test('gvs section 5: vocabulary word bank of 9 words', () => {
    const section = gvs.sections[4];
    assert.match(section.title, /^1\. Choose the correct words to complete the sentences/);
    assert.equal(section.bank.length, 9);
    assertBlanks(section);
    assertAcceptsOwnAnswers(section);
    assert.deepEqual(section.items.map(i => i.answers[0]), ['conservation', 'charity', 'environment', 'vaccinations']);
    for (const item of section.items) assert.ok(section.bank.includes(item.answers[0]));
});

test('gvs section 6: dictation words (provisional content, FR-008)', () => {
    const section = gvs.sections[5];
    assert.equal(section.title, 'Spelling Dictation:');
    assertAcceptsOwnAnswers(section);
    for (const item of section.items) assert.ok(item.answers.includes(item.text));
    // The PDF has no dictation words: the demo reuses the "Circle the correct spelling" words
    assert.deepEqual(section.items.map(i => i.text), ['comfortably', 'unhappy', 'unicellular', 'totally', 'untrue']);
});

test('gvs section 7: circle the correct spelling, 3 options each', () => {
    const section = gvs.sections[6];
    assert.equal(section.title, 'Circle the correct Spelling word:');
    assertAcceptsOwnAnswers(section);
    for (const item of section.items) assert.equal(item.options.length, 3);
    assert.deepEqual(section.items.map(i => i.options[i.answer]), ['comfortably', 'unhappy', 'unicellular', 'totally', 'untrue']);
});

// ---------- Reading & Listening ----------

const rl = demos.rl;

test('rl: reading text of Jordan Jacobs with 7 questions of 3 options (FR-006)', () => {
    assert.equal(rl.title, 'READING & LISTENING GUIDE');
    assert.equal(rl.school, 'Colegio Reims School year 2026-2027');
    const section = rl.sections[0];
    assert.equal(section.type, 'choice');
    assert.equal(section.passage.length, 2);
    assert.match(section.passage[0], /^Jordan Jacobs is a young sculptor\./);
    assert.equal(section.items.length, 7);
    for (const item of section.items) assert.equal(item.options.length, 3);
    assertAcceptsOwnAnswers(section);
    assert.deepEqual(section.items.map(i => i.answer), [1, 0, 2, 0, 2, 0, 2]);
});

test('rl: listening with 4 blanks whose answers are in the script (provisional script, FR-008)', () => {
    const section = rl.sections[1];
    assert.equal(section.type, 'fill');
    assert.match(section.title, /^2\. Listen\. Complete the information\./);
    assertBlanks(section);
    assertAcceptsOwnAnswers(section);
    const script = section.script.toLowerCase();
    for (const item of section.items) assert.ok(item.answers.some(a => script.includes(a.toLowerCase())), item.text);
    assert.deepEqual(section.items.map(i => i.answers[0]), ['school', 'bake sale', 'Friday', 'cakes or cookies']);
});

// ---------- Writing ----------

test('writing: letter task with Remember, 8 lines and 5 criteria worth 10 points (FR-007)', () => {
    const guide = demos.writing;
    assert.equal(guide.title, 'WRITING GUIDE');
    const section = guide.sections[0];
    assert.equal(section.type, 'writing');
    assert.match(section.title, /^Write a letter to tell people about an event you are organizing to help your community\./);
    assert.equal(section.remember.length, 4);
    assert.equal(section.lines, 8);
    assert.equal(section.criteria.length, 5);
    assert.equal(section.criteria.reduce((sum, c) => sum + c.points, 0), 10);
    for (const criterion of section.criteria) assert.ok(writingChecks.includes(criterion.check), criterion.check);
});
