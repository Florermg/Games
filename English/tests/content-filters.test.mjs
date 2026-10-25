// Content filters for kids: words, definitions, example sentences and texts (FR-028, Principle VI)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext();
const UNSAFE = game.run('UNSAFE');

test('UNSAFE rejects words that are not suitable for kids', () => {
    const blocked = ['sex', 'sexual', 'drugs', 'kill', 'killer', 'murder', 'weapon', 'gun', 'alcohol', 'beer', 'wine',
        'naked', 'suicide', 'bomb', 'rape', 'drunk', 'cigarette', 'tobacco', 'corpse', 'hell', 'damn', 'porn',
        'torture', 'terrorist', 'nazi', 'slavery', 'erotic', 'seduce', 'arouse'];
    for (const word of blocked) assert.equal(UNSAFE.test(word), true, word);
    assert.equal(UNSAFE.test('They found a gun in the box.'), true);
});

test('UNSAFE accepts common school words', () => {
    // "skill" and "shell" contain "kill" and "hell" but are not whole words
    const allowed = ['school', 'animal', 'skill', 'shell', 'hello', 'winter', 'beach', 'whale', 'kid', 'sea', 'skin', 'music', 'garden'];
    for (const word of allowed) assert.equal(UNSAFE.test(word), false, word);
});

test('isCleanWord accepts short lowercase words within the grade length only', () => {
    const isCleanWord = (word, max) => game.call('isCleanWord', word, max);
    assert.equal(isCleanWord('planet', 12), true);
    assert.equal(isCleanWord('ox', 12), false, 'too short');
    assert.equal(isCleanWord('Mexico', 12), false, 'capital letters');
    assert.equal(isCleanWord('ice-cream', 12), false, 'hyphen');
    assert.equal(isCleanWord('environmental', 12), false, 'too long');
    assert.equal(isCleanWord('weapon', 12), false, 'unsafe');
});

test('cleanDefinition removes unsuitable labels and starts', () => {
    const clean = (text, word = 'test') => game.call('cleanDefinition', text, word);
    assert.equal(clean('(slang) A cool person who is nice to others.'), null);
    assert.equal(clean('(obsolete) An old kind of carriage with wheels.'), null);
    assert.equal(clean('Plural of something else that exists.'), null);
    assert.equal(clean('A surname from the north of England.'), null);
    assert.equal(clean('Alternative form of colour, used in old books.'), null);
    assert.equal(clean('A place where people drink beer and wine.'), null, 'unsafe content');
});

test('cleanDefinition keeps clean definitions and tidies them', () => {
    const clean = (text, word) => game.call('cleanDefinition', text, word);
    assert.equal(clean('(countable) A doctor for animals.', 'veterinarian'), 'A doctor for animals');
    assert.equal(clean('Tending to ask questions; inquisitive; nosy.', 'curious'), 'Tending to ask questions');
    assert.equal(clean('An animal that lives in water, especially.', 'fish'), 'An animal that lives in water');
    assert.equal(clean('[from Latin] Someone who writes music.', 'composer'), 'Someone who writes music');
});

test('cleanDefinition rejects definitions that give the answer away or have a bad length', () => {
    const clean = (text, word) => game.call('cleanDefinition', text, word);
    assert.equal(clean('The act of recycling old things.', 'recycling'), null);
    assert.equal(clean('A pet.', 'cat'), null, 'too short');
    assert.equal(clean('A '.repeat(70) + 'thing.', 'thing'), null, 'too long');
});

test('pickDefinition only looks at the first 3 senses and needs a known part of speech', () => {
    const entry = (defs) => ({ word: 'bank', defs });
    const pick = (defs) => game.toPlain(game.call('pickDefinition', entry(defs)));
    assert.deepEqual(pick([{ pos: 'n', text: '(slang) Money of any kind.' }, { pos: 'n', text: 'A place where people keep money.' }]),
        { pos: 'n', text: 'A place where people keep money' });
    assert.equal(pick([
        { pos: 'n', text: '(slang) Money.' }, { pos: 'n', text: '(obsolete) A bench.' }, { pos: 'n', text: '(dated) A shelf.' },
        { pos: 'n', text: 'A place where people keep money.' }
    ]), null);
    assert.equal(pick([{ pos: 'u', text: 'A place where people keep money.' }]), null);
});

test('decodeEntities turns HTML entities into text', () => {
    assert.equal(game.call('decodeEntities', 'Tom&#39;s &quot;big&quot; dog &amp; cat&nbsp;&lt;3&gt;'), 'Tom\'s "big" dog & cat <3>');
    assert.equal(game.call('decodeEntities', 'caf&#233;'), 'café');
});

test('articleSentences keeps easy sentences and drops technical ones', () => {
    const text = [
        'Heading',
        'A volcano is a mountain that has lava coming out from the ground. The largest ocean is the Pacific Ocean.The smallest ocean is the Arctic Ocean.',
        'HDPE plastic is usually used to make milk bottles for many people. About 3,000 people live in the small town near the hill.',
        'Volcanoes can also form where plates move apart, e.g. in Africa today. Polypropylene plastic is used to make buckets and boxes.',
        'The word "lava" comes from an old language of Italy. The café near the beach sells very good ice cream to everyone.',
        'Some volcanoes erupt very often and some never erupt again at all. Some people kill animals in the forest for their skins.'
    ].join('\n');
    const sentences = game.toPlain(game.call('articleSentences', text));
    assert.deepEqual(sentences, [
        'A volcano is a mountain that has lava coming out from the ground.',
        'The largest ocean is the Pacific Ocean.',
        'The smallest ocean is the Arctic Ocean.',
        'Some volcanoes erupt very often and some never erupt again at all.'
    ]);
});

test('articleSentences removes text in parentheses', () => {
    const sentences = game.toPlain(game.call('articleSentences', 'A planet (from Greek words) is a big round object in space that moves around a star.'));
    assert.deepEqual(sentences, ['A planet is a big round object in space that moves around a star.']);
});

// Minimal fake fetch for Datamuse frequency lookups and a Wiktionary page
function datamuseFrequency(table) {
    return async (url) => {
        const parsed = new URL(url);
        if (parsed.host === 'api.datamuse.com') {
            const word = parsed.searchParams.get('sp');
            const body = word in table ? [{ word, score: 1, tags: ['f:' + table[word]] }] : [];
            return { ok: true, status: 200, json: async () => body };
        }
        if (parsed.host === 'en.wiktionary.org') {
            return { ok: true, status: 200, json: async () => WIKTIONARY_CHARITY };
        }
        throw new Error('unexpected ' + url);
    };
}

const WIKTIONARY_CHARITY = {
    en: [{
        partOfSpeech: 'Noun',
        definitions: [
            { definition: 'An organization that helps people.', examples: ['The event raised money for local <b>charities</b>.', 'He donated half his earnings to <b>charity</b>.'] },
            { definition: 'Goods given.', examples: ['an act of <b>charity</b>'] }
        ]
    }]
};

test('isEasySentence requires every longer word to be common enough for the grade', async () => {
    const seeded = createGameContext({ fetch: datamuseFrequency({ event: 40, raised: 20, money: 90, local: 80, charities: 3, terephthalate: 0.01 }) });
    assert.equal(await seeded.call('isEasySentence', 'The event raised money for local charities.', 1.25, 'charities'), true);
    assert.equal(await seeded.call('isEasySentence', 'The event raised terephthalate money.', 1.25), false);
    assert.equal(await seeded.call('isEasySentence', 'The event raised money for local charities.', 5), false, 'charities is rarer than 5 per million');
});

test('exampleSentence turns a Wiktionary example into a blank sentence with its answer', async () => {
    const seeded = createGameContext({ fetch: datamuseFrequency({}) });
    const example = seeded.toPlain(await seeded.call('exampleSentence', 'charity'));
    assert.deepEqual(example, { sentence: 'The event raised money for local ___.', answer: 'charities' });
});

test('exampleSentence returns null when the source fails', async () => {
    const offline = createGameContext({ offline: true });
    assert.equal(await offline.call('exampleSentence', 'charity'), null);
});
