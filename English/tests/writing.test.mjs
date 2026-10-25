// Automatic self-check of writing (FR-019 to FR-021)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext();
const score = (check, text, section = {}) => game.run('WRITING_CHECKS')[check](text, section).score;

// The letter used in the browser verification of 2026-10-24
export const EXAMPLE_LETTER = [
    'Dear neighbors,',
    'My name is Ana and I am organizing a park clean-up (with my classmates) to help our community.',
    "It will be on Saturday, November 8th at 9 o'clock in the morning at Central Park.",
    'Please bring gloves and a bag (we will give you water and snacks).',
    'It is important because our park is dirty and animals can get sick.',
    'Together we can make a difference, and it will be fun!',
    'Join us and help our community.',
    'Sincerely,',
    'Ana'
].join('\n');

const words = (count) => Array.from({ length: count }, (_, i) => 'word' + i).join(' ');

// [check, text that gets 2, text that gets 1 (or null), text that gets 0]
const CASES = [
    ['letterFormat', EXAMPLE_LETTER, 'Dear friends,\nWe are having a party.', 'We are having a party.'],
    ['practicalInfo', EXAMPLE_LETTER, 'It will be on Friday.', 'This is my letter.'],
    ['persuasive', 'Please help, it is important because together we can make a difference.', 'Please help.', 'This is a letter.'],
    ['parentheses', 'On Friday (after school) at the park (near my house).', 'On Friday (after school).', 'On Friday after school.'],
    ['length', words(70), words(40), words(20)],
    ['question', 'How are you? Do you like dogs?', 'Do you like dogs?', 'I like dogs.'],
    ['title', 'My Big Day\nOne day I went to the park.', null, 'One day I went to the park.'],
    ['sequence', 'First we ate. Then we played. Finally we slept.', 'Then we ate.', 'We ate.'],
    ['pastTense', 'We went to the park, saw a dog, played, walked, jumped and laughed.', 'We went and saw it, and played.', 'We go to the park.'],
    ['adjectives', 'It was a big, beautiful, scary and colorful house.', 'A big house and a small dog.', 'A house.'],
    ['opinion', 'I think kids should recycle.', null, 'Kids recycle.'],
    ['reasons', 'Because it is fun. Also, for example, it helps.', 'Because it is fun.', 'It is fun.'],
    ['conclusion', 'In conclusion, recycling is great.', null, 'Recycling is great.']
];

for (const [check, two, one, zero] of CASES) {
    test(`WRITING_CHECKS.${check} gives 2, 1 and 0 points`, () => {
        assert.equal(score(check, two), 2, 'expected 2');
        if (one !== null) assert.equal(score(check, one), 1, 'expected 1');
        assert.equal(score(check, zero), 0, 'expected 0');
    });
}

test('practicalInfo recognizes places like "at Central Park"', () => {
    assert.equal(score('practicalInfo', 'Come at 9 o\'clock at Central Park and bring a bag.'), 2);
    assert.equal(score('practicalInfo', 'Meet us in the school yard.'), 1);
});

test('topicWords counts the useful words of the topic', () => {
    const section = { usefulWords: ['recycle', 'plastic', 'paper', 'glass'] };
    assert.equal(score('topicWords', 'We recycle plastic, paper and glass.', section), 2);
    assert.equal(score('topicWords', 'We recycled bottles.', section), 1);
    assert.equal(score('topicWords', 'We played soccer.', section), 0);
    assert.equal(score('topicWords', 'We played soccer.', {}), 0);
});

test('every check returns a hint (note) to improve the text', () => {
    const checks = game.run('WRITING_CHECKS');
    for (const name of Object.keys(checks)) {
        const result = checks[name]('', { usefulWords: [] });
        assert.ok(typeof result.note === 'string' && result.note.length > 0, name);
    }
});

test('the example letter gets 10/10 with the demo criteria (FR-019)', () => {
    const section = game.toPlain(game.run('DEMO_GUIDES.writing.sections[0]'));
    const total = section.criteria.reduce((sum, c) => sum + Math.min(score(c.check, EXAMPLE_LETTER, section), c.points), 0);
    assert.equal(total, 10);
});

test('every writing task has 5 valid criteria worth 2 points and a {topic} prompt', () => {
    const tasks = game.toPlain(game.run('WRITING_TASKS'));
    const checks = Object.keys(game.run('WRITING_CHECKS'));
    assert.deepEqual(Object.keys(tasks).sort(), ['email', 'invitation', 'letter', 'opinion', 'story']);
    for (const [name, task] of Object.entries(tasks)) {
        assert.match(task.prompt, /\{topic\}/, name);
        assert.equal(task.remember.length, 4, name);
        assert.equal(task.criteria.length, 5, name);
        for (const criterion of task.criteria) assert.ok(checks.includes(criterion.check), name + ': ' + criterion.check);
    }
});
