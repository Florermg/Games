// Answer checking, points and average (FR-015, FR-016, FR-017, FR-022)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext();
const normalizeAnswer = (text) => game.call('normalizeAnswer', text);
const isCorrect = (section, item, response) => game.call('isCorrect', section, item, response);

test('normalizeAnswer ignores case, commas, extra spaces, final punctuation and curly apostrophes (FR-016)', () => {
    assert.equal(normalizeAnswer('  I Went   to PARIS two years ago.'), 'i went to paris two years ago');
    assert.equal(normalizeAnswer('Yesterday, I had my car washed'), 'yesterday i had my car washed');
    assert.equal(normalizeAnswer('Really?!'), 'really');
    assert.equal(normalizeAnswer('Hello !'), 'hello');
    assert.equal(normalizeAnswer('He’s happy'), "he's happy");
    assert.equal(normalizeAnswer('It‘s `fine´'), "it's 'fine'");
    assert.equal(normalizeAnswer(42), '42');
});

// Bug found while writing this suite (fixed in GAMES-1): the final period was removed
// before trimming, so "ago. " (space after the period, common with phone keyboards) kept it.
test('normalizeAnswer ignores the final period even with a trailing space (FR-016)', () => {
    assert.equal(normalizeAnswer('I went to Paris two years ago. '), 'i went to paris two years ago');
    const item = { answers: ['I went to Paris two years ago.'] };
    assert.equal(isCorrect({ type: 'rewrite' }, item, 'I went to Paris two years ago. '), true);
});

test('normalizeAnswer keeps the words that matter', () => {
    assert.notEqual(normalizeAnswer('I had my car washed'), normalizeAnswer('I have my car washed'));
    assert.notEqual(normalizeAnswer('a few'), normalizeAnswer('few'));
});

test('isCorrect for choice compares the selected option index', () => {
    const section = { type: 'choice' };
    const item = { options: ['a', 'b', 'c'], answer: 1 };
    assert.equal(isCorrect(section, item, '1'), true);
    assert.equal(isCorrect(section, item, 1), true);
    assert.equal(isCorrect(section, item, '0'), false);
    assert.equal(isCorrect(section, item, ''), false);
});

test('isCorrect for written answers accepts any listed variant (bank, rewrite, fill)', () => {
    const item = { answers: ['I had my car washed yesterday.', 'Yesterday, I had my car washed.', 'I got my car washed yesterday.'] };
    for (const type of ['bank', 'rewrite', 'fill', 'dictation', 'match']) {
        assert.equal(isCorrect({ type }, item, 'yesterday i had my car washed'), true, type);
        assert.equal(isCorrect({ type }, item, 'I got my car washed yesterday'), true, type);
        assert.equal(isCorrect({ type }, item, 'I washed my car yesterday.'), false, type);
    }
    assert.equal(isCorrect({ type: 'bank' }, { answers: ['a few'] }, 'A few'), true);
});

test('correctAnswerText shows the option text or the letter and definition', () => {
    assert.equal(game.call('correctAnswerText', { type: 'choice' }, { options: ['x', 'y'], answer: 1 }), 'y');
    const match = { type: 'match', definitions: [{ letter: 'a', text: 'a doctor for animals' }] };
    assert.equal(game.call('correctAnswerText', match, { answers: ['a'] }), 'a. a doctor for animals');
    assert.equal(game.call('correctAnswerText', { type: 'rewrite' }, { answers: ['First.', 'Second.'] }), 'First.');
});

test('scoreSection gives one point per correct item, on the first or the second attempt (FR-015)', () => {
    const section = { type: 'bank', items: [{}, {}, {}, {}, {}] };
    const result = game.toPlain(game.call('scoreSection', section, { correct: [1, 2, 0, 1, 2], writingScore: 0 }));
    assert.deepEqual(result, { score: 4, max: 5 });
});

test('scoreSection for writing uses the last automatic estimate and the sum of criteria points', () => {
    const section = { type: 'writing', criteria: [{ points: 2 }, { points: 2 }, { points: 2 }, { points: 2 }, { points: 2 }] };
    const result = game.toPlain(game.call('scoreSection', section, { correct: [], writingScore: 7 }));
    assert.deepEqual(result, { score: 7, max: 10 });
});

test('computeAverage gives an average out of 10 with one decimal (FR-022)', () => {
    const computeAverage = (score, max) => game.call('computeAverage', score, max);
    assert.equal(computeAverage(36, 38), 9.5);
    assert.equal(computeAverage(37, 38), 9.7);
    assert.equal(computeAverage(11, 11), 10);
    assert.equal(computeAverage(1, 3), 3.3);
    assert.equal(computeAverage(2, 3), 6.7);
    assert.equal(computeAverage(0, 38), 0);
    assert.equal(computeAverage(0, 0), 0);
});
