// Generated guides, replayed from recorded responses without internet (FR-025, FR-027, FR-029)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext, loadFixture } from './helpers/game-context.mjs';
import { SCENARIOS } from './fixtures/record.mjs';

async function replay(name) {
    const fixture = loadFixture(name);
    const game = createGameContext({ seed: fixture.seed, fixture });
    const guide = game.toPlain(await game.run(SCENARIOS[name].expression));
    return { game, guide };
}

function assertChoiceItems(section, optionCount) {
    for (const item of section.items) {
        if (optionCount) assert.equal(item.options.length, optionCount, item.text);
        assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length, item.text);
        const lower = item.options.map(o => o.toLowerCase());
        assert.equal(new Set(lower).size, lower.length, 'distinct options: ' + item.options.join(' | '));
    }
}

function assertBlankItems(section) {
    for (const item of section.items) {
        assert.equal(item.text.split('___').length, 2, item.text);
        assert.ok(item.answers.length > 0 && item.tip, item.text);
    }
}

// ---------- Grammar, Vocabulary & Spelling ----------

test('gvs: the recorded scenario replays without asking for unrecorded URLs', async () => {
    const { game } = await replay('gvs-recycling-g5');
    assert.deepEqual(game.missingUrls, []);
});

test('gvs: same format as the demo (FR-025)', async () => {
    const { guide } = await replay('gvs-recycling-g5');
    assert.equal(guide.kind, 'gvs');
    assert.equal(guide.title, 'GRAMMAR, VOCABULARY & SPELLING GUIDE');
    assert.equal(guide.subtitle, '5th Grade · Recycling ♻️');
    assert.deepEqual(guide.sections.map(s => s.group + ':' + s.type), [
        'Grammar:bank', 'Grammar:rewrite', 'Grammar:rewrite', 'Grammar:fill',
        'Vocabulary:match', 'Vocabulary:bank', 'Spelling:dictation', 'Spelling:choice'
    ]);
    for (const section of guide.sections.slice(0, 4)) assert.equal(section.items.length, 5, section.title);
});

test('gvs: match has up to 9 words, each with its own letter', async () => {
    const { guide } = await replay('gvs-recycling-g5');
    const match = guide.sections[4];
    assert.ok(match.items.length >= 5 && match.items.length <= 9);
    assert.equal(match.definitions.length, match.items.length);
    const letters = match.definitions.map(d => d.letter);
    assert.equal(new Set(letters).size, letters.length);
    const used = match.items.map(i => i.answers[0]);
    assert.deepEqual([...used].sort(), [...letters].sort(), 'every definition is the answer of exactly one word');
    for (const definition of match.definitions) assert.ok(definition.text.length > 0 && definition.text.length <= 80);
});

test('gvs: the word bank has 3 to 5 sentences whose answers are in the bank', async () => {
    const { guide } = await replay('gvs-recycling-g5');
    const bank = guide.sections[5];
    assert.ok(bank.items.length >= 3 && bank.items.length <= 5);
    assert.ok(bank.bank.length <= 9);
    assertBlankItems(bank);
    for (const item of bank.items) assert.ok(bank.bank.includes(item.answers[0]), item.answers[0]);
    assert.equal(new Set(bank.bank).size, bank.bank.length, 'no repeated words in the bank');
});

test('gvs: dictation and spelling use distinct topic words; misspellings are not the correct word (FR-029)', async () => {
    const { guide } = await replay('gvs-recycling-g5');
    const [dictation, spelling] = guide.sections.slice(6);
    assert.ok(dictation.items.length >= 3 && dictation.items.length <= 5);
    for (const item of dictation.items) {
        assert.ok(item.answers.includes(item.text));
        assert.ok(item.text.length >= 6, '5th grade spelling words have at least 6 letters');
    }
    assert.ok(spelling.items.length >= 3 && spelling.items.length <= 5);
    assertChoiceItems(spelling, 3);
    for (const item of spelling.items) assert.equal(item.explanation, item.options[item.answer]);
    const words = dictation.items.map(i => i.text).concat(spelling.items.map(i => i.explanation));
    assert.equal(new Set(words).size, words.length, 'no word is used twice');
});

test('gvs: the same seed and recording build the same guide (FR-033)', async () => {
    const first = await replay('gvs-recycling-g5');
    const second = await replay('gvs-recycling-g5');
    assert.deepEqual(first.guide, second.guide);
});

test('gvs: easier grades get more common words (FR-027)', async () => {
    const fixture = loadFixture('gvs-recycling-g5');
    const averageFrequency = async (grade) => {
        const game = createGameContext({ fixture });
        const pool = await game.run(`buildWordPool(Object.assign({ name: 'r' }, TOPICS.recycling), ${grade})`);
        return pool.vocab.reduce((sum, w) => sum + w.freq, 0) / pool.vocab.length;
    };
    const grade3 = await averageFrequency(3);
    const grade6 = await averageFrequency(6);
    assert.ok(grade3 > grade6, `grade 3 average ${grade3.toFixed(1)} should be above grade 6 average ${grade6.toFixed(1)}`);
});

test('gvs: without internet the guide is not created and the message is clear', async () => {
    const game = createGameContext({ offline: true });
    await assert.rejects(game.run(SCENARIOS['gvs-recycling-g5'].expression), /Could not reach the dictionary API/);
});

test('gvs: when the dictionary is busy (429) the guide is not created', async () => {
    const game = createGameContext({ rateLimited: true });
    // Every Datamuse request fails, so the word pool reports it cannot reach the dictionary
    await assert.rejects(game.run(SCENARIOS['gvs-recycling-g5'].expression), /Could not reach the dictionary API/);
});

// ---------- Reading & Listening ----------

test('rl: the recorded scenario replays without asking for unrecorded URLs', async () => {
    const { game } = await replay('rl-space-g5');
    assert.deepEqual(game.missingUrls, []);
});

test('rl: reading with up to 7 questions of 3 options and the CC BY-SA source (FR-025, FR-028, FR-029)', async () => {
    const { guide } = await replay('rl-space-g5');
    assert.equal(guide.title, 'READING & LISTENING GUIDE');
    const [reading, listening] = guide.sections;
    assert.equal(reading.type, 'choice');
    assert.equal(reading.passage.length, 2);
    assert.match(reading.source, /Simple English Wikipedia.*CC BY-SA/);
    assert.ok(reading.items.length >= 4 && reading.items.length <= 7);
    assertChoiceItems(reading, 3);
    reading.items.forEach((item, i) => assert.match(item.text, new RegExp('^' + (i + 1) + '\\. ')));
    assert.match(reading.items[0].text, /What is the text mainly about\?/);
    const text = reading.passage.join(' ');
    for (const item of reading.items.filter(i => /which word completes/.test(i.text))) {
        const sentence = item.text.split('\n')[1].replace(/^"|"$/g, '').replace('______', item.options[item.answer]);
        assert.ok(text.includes(sentence), 'cloze answer rebuilds a sentence of the text: ' + sentence);
    }
    for (const item of reading.items.filter(i => /TRUE/.test(i.text))) {
        assert.ok(text.includes(item.options[item.answer]), 'the true sentence is in the text');
        item.options.forEach((option, k) => { if (k !== item.answer) assert.ok(!text.includes(option), 'a false sentence is not in the text'); });
    }
    assert.equal(listening.type, 'fill');
    assert.ok(listening.items.length >= 3 && listening.items.length <= 4);
    assertBlankItems(listening);
    const script = listening.script.toLowerCase();
    for (const item of listening.items) assert.ok(script.includes(item.answers[0].toLowerCase()), item.answers[0]);
});

test('rl: the same seed and recording build the same guide (FR-033)', async () => {
    const first = await replay('rl-space-g5');
    const second = await replay('rl-space-g5');
    assert.deepEqual(first.guide, second.guide);
});

test('rl: without internet the guide is not created', async () => {
    const game = createGameContext({ offline: true });
    // Known gap (spec, Edge Cases): the student sees the browser's technical message
    // instead of a clear one. It will be fixed in a later story, not here (FR-038).
    await assert.rejects(game.run(SCENARIOS['rl-space-g5'].expression), /Failed to fetch/);
});

test('rl: when Wikipedia is busy (429) the student sees the "busy" message', async () => {
    const game = createGameContext({ rateLimited: true });
    await assert.rejects(game.run(SCENARIOS['rl-space-g5'].expression), /busy right now/);
});

// ---------- Writing ----------

test('writing: the recorded scenario replays without asking for unrecorded URLs', async () => {
    const { game } = await replay('writing-animals-g5');
    assert.deepEqual(game.missingUrls, []);
});

test('writing: task, Remember, useful words, a fact with its source and 5 criteria of 2 points (FR-025)', async () => {
    const { guide } = await replay('writing-animals-g5');
    assert.equal(guide.title, 'WRITING GUIDE');
    const section = guide.sections[0];
    assert.equal(section.type, 'writing');
    assert.match(section.title, /event you are organizing to help your community\. The event is about animals\./);
    assert.equal(section.remember.length, 4);
    assert.equal(section.lines, 8);
    assert.ok(section.usefulWords.length > 0 && section.usefulWords.length <= 8);
    assert.ok(section.fact.length > 0);
    assert.match(section.source, /Simple English Wikipedia/);
    assert.equal(section.criteria.length, 5);
    for (const criterion of section.criteria) assert.equal(criterion.points, 2);
});

test('writing: without internet the guide is still created, without useful words or fact', async () => {
    const game = createGameContext({ offline: true });
    const guide = game.toPlain(await game.run(SCENARIOS['writing-animals-g5'].expression));
    assert.deepEqual(guide.sections[0].usefulWords, []);
    assert.equal(guide.sections[0].fact, '');
});
