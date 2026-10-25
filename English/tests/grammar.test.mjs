// Grammar rules and the grammar templates of generated guides (FR-017, FR-026)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext();
const pastSimple = (base) => game.call('pastSimple', base);
const isCorrect = (section, item, response) => game.call('isCorrect', section, item, response);

test('pastSimple uses the irregular form of every verb in IRREGULAR_PAST', () => {
    const irregular = game.toPlain(game.run('IRREGULAR_PAST'));
    assert.ok(Object.keys(irregular).length >= 50);
    for (const [base, past] of Object.entries(irregular)) assert.equal(pastSimple(base), past, base);
    assert.equal(pastSimple('go'), 'went');
    assert.equal(pastSimple('wake'), 'woke');
    assert.equal(pastSimple('read'), 'read');
});

test('pastSimple applies the regular spelling rules', () => {
    const expected = {
        play: 'played', dance: 'danced', study: 'studied', stop: 'stopped', visit: 'visited',
        finish: 'finished', clean: 'cleaned', call: 'called', plant: 'planted', cook: 'cooked',
        travel: 'traveled', cry: 'cried', plan: 'planned'
    };
    for (const [base, past] of Object.entries(expected)) assert.equal(pastSimple(base), past, base);
});

test('pastTip explains the rule used', () => {
    const pastTip = (base) => game.call('pastTip', base);
    assert.match(pastTip('go'), /irregular verb: go → went/);
    assert.match(pastTip('dance'), /ending in -e: just add -d/);
    assert.match(pastTip('study'), /change the y to i/);
    assert.match(pastTip('stop'), /double the last letter/);
    assert.match(pastTip('visit'), /^Regular verb: add -ed/);
});

test('causativeAnswers accepts had/got in the past and the time at the front (FR-017)', () => {
    const answers = game.toPlain(game.call('causativeAnswers', 'I', 'my', 'car', 'washed', 'yesterday', 'past'));
    assert.deepEqual(answers, [
        'I had my car washed yesterday.',
        'Yesterday, I had my car washed.',
        'I got my car washed yesterday.',
        'Yesterday, I got my car washed.'
    ]);
});

test('causativeAnswers uses have/get for I, We and plural subjects, has/gets for singular ones', () => {
    const present = (subject, possessive) => game.toPlain(game.call('causativeAnswers', subject, possessive, 'hair', 'cut', 'every month', 'present'));
    assert.ok(present('I', 'my').includes('I have my hair cut every month.'));
    assert.ok(present('I', 'my').includes('I get my hair cut every month.'));
    assert.ok(present('We', 'our').includes('We get our hair cut every month.'));
    assert.ok(present('My parents', 'their').includes('My parents have their hair cut every month.'));
    assert.ok(present('My aunt', 'her').includes('My aunt has her hair cut every month.'));
    assert.ok(present('My aunt', 'her').includes('Every month, my aunt gets her hair cut.'));
    assert.ok(!present('My aunt', 'her').some(a => a.includes('aunt have')));
});

test('causativeAnswers does not move clauses to the front (when / because / if / at)', () => {
    const answers = game.toPlain(game.call('causativeAnswers', 'I', 'my', 'hair', 'cut', 'when it gets too long', 'present'));
    assert.deepEqual(answers, ['I have my hair cut when it gets too long.', 'I get my hair cut when it gets too long.']);
    const noTime = game.toPlain(game.call('causativeAnswers', 'I', 'my', 'computer', 'fixed', '', 'past'));
    assert.deepEqual(noTime, ['I had my computer fixed.', 'I got my computer fixed.']);
});

test('the demo causative items accept their usual variants', () => {
    const section = game.toPlain(game.run('DEMO_GUIDES.gvs.sections[1]'));
    const variants = [
        ['Yesterday I had my car washed', 'I got my car washed yesterday'],
        ['I have my hair cut when it gets too long.', 'I get my hair cut when it gets too long'],
        ['Last year, my aunt had her house painted.', 'My aunt got her house painted last year.'],
        ['I got my computer fixed', 'i had my computer fixed.'],
        ['Last Friday, my brother had his photo taken at school.', 'My brother got his photo taken at school last Friday.']
    ];
    variants.forEach((accepted, i) => {
        for (const answer of accepted) assert.equal(isCorrect(section, section.items[i], answer), true, answer);
    });
    assert.equal(isCorrect(section, section.items[0], 'I washed my car yesterday.'), false);
});

test('COMPARATIVE_BANK and QUANTIFIER_BANK are well formed', () => {
    const comparatives = game.toPlain(game.run('COMPARATIVE_BANK'));
    assert.ok(comparatives.length >= 10);
    for (const entry of comparatives) {
        assert.equal(entry.text.split('___').length, 2, entry.text);
        assert.match(entry.text, /\([a-z]+\)/, entry.text);
        assert.ok(entry.answer && entry.tip, entry.text);
    }
    const texts = comparatives.map(e => e.text);
    assert.equal(new Set(texts).size, texts.length);

    const quantifiers = game.toPlain(game.run('QUANTIFIER_BANK'));
    assert.deepEqual(Object.keys(quantifiers).sort(), ['a few', 'all', 'most', 'no', 'some']);
    for (const [quantifier, sentences] of Object.entries(quantifiers)) {
        assert.equal(sentences.length, 3, quantifier);
        for (const sentence of sentences) assert.equal(sentence.text.split('___').length, 2, sentence.text);
    }
});

test('the grammar sections of generated guides have 5 items and accept their explanation', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
        const seeded = createGameContext({ seed });
        for (const builder of ['quantifierSection', 'causativeSection', 'agoSection', 'comparativeSection']) {
            const section = seeded.toPlain(seeded.call(builder, 1));
            assert.equal(section.items.length, 5, builder);
            assert.match(section.title, /^1\. /, builder);
            for (const item of section.items) {
                assert.ok(item.answers.length > 0 && item.tip, builder);
                if (builder !== 'quantifierSection') {
                    const expected = builder === 'comparativeSection' ? item.answers[0] : item.explanation;
                    assert.equal(seeded.call('isCorrect', section, item, expected), true, builder + ': ' + item.text);
                }
            }
        }
        const quantifiers = seeded.toPlain(seeded.call('quantifierSection', 1));
        assert.deepEqual(quantifiers.items.map(i => i.answers[0]).sort(), ['a few', 'all', 'most', 'no', 'some']);
        assert.deepEqual(quantifiers.bank, ['all', 'most', 'some', 'a few', 'no']);
    }
});

test('the same seed builds the same grammar section (FR-033)', () => {
    const a = createGameContext({ seed: 9 });
    const b = createGameContext({ seed: 9 });
    assert.deepEqual(a.toPlain(a.call('agoSection', 3)), b.toPlain(b.call('agoSection', 3)));
});

test('generateMisspellings never returns the original word and only uses letters a-z', () => {
    for (const word of ['comfortably', 'unhappy', 'environment', 'vaccination', 'charity', 'recycle', 'believe', 'photograph']) {
        const misspellings = game.toPlain(game.call('generateMisspellings', word));
        assert.ok(misspellings.length >= 3, word);
        for (const wrong of misspellings) {
            assert.notEqual(wrong, word);
            assert.match(wrong, /^[a-z]{3,}$/);
        }
        assert.equal(new Set(misspellings).size, misspellings.length, word);
    }
});
