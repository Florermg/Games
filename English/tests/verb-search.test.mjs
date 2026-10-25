// Verb search in Spanish and English, and the online lookup (GAMES-6, FR-004, FR-007)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext();
const search = (query) => game.toPlain(game.call('searchVerbs', query)).map(v => v.base);

test('Spanish and English, ignoring case, accents and extra spaces', () => {
    for (const query of ['comer', 'Comér', '  COMER ', 'eat', 'EAT', ' Eat ']) {
        assert.equal(search(query)[0], 'eat', query);
    }
    assert.equal(search('ir')[0], 'go');
    assert.equal(search('estudiar')[0], 'study');
    assert.equal(search('levantarse')[0], 'get up');
});

test('conjugated English forms find their base verb', () => {
    const expected = { went: 'go', gone: 'go', eaten: 'eat', ate: 'eat', studied: 'study', swimming: 'swim', goes: 'go', taught: 'teach' };
    for (const [form, base] of Object.entries(expected)) assert.equal(search(form)[0], base, form);
});

test('a Spanish verb with several English verbs shows them all', () => {
    const tocar = search('tocar');
    assert.ok(tocar.includes('play') && tocar.includes('touch'), tocar.join(', '));
    assert.ok(search('jugar').includes('play'));
    const hacer = search('hacer');
    assert.ok(hacer.includes('do') && hacer.includes('make'), hacer.join(', '));
});

test('prefixes suggest verbs while typing, at most 8', () => {
    assert.ok(search('estud').includes('study'));
    assert.ok(search('swi').includes('swim'));
    assert.ok(search('c').length <= 8);
    assert.ok(search('co').length >= 1);
});

test('no matches gives an empty list', () => {
    assert.deepEqual(search('xyzzy'), []);
    assert.deepEqual(search(''), []);
    assert.deepEqual(search('   '), []);
});

// ---------- Online lookup (MyMemory + Datamuse), simulated ----------

function fakeOnline(translations, verbs) {
    return async (url) => {
        const parsed = new URL(url);
        if (parsed.host === 'api.mymemory.translated.net') {
            const key = parsed.searchParams.get('q') + '|' + parsed.searchParams.get('langpair');
            const entry = translations[key];
            if (!entry) return { ok: true, status: 200, json: async () => ({ responseData: { translatedText: '', match: 0 }, matches: [] }) };
            return { ok: true, status: 200, json: async () => ({ responseData: { translatedText: entry[0], match: 1 }, matches: entry.slice(1).map(t => ({ translation: t })) }) };
        }
        if (parsed.host === 'api.datamuse.com') {
            const word = parsed.searchParams.get('sp');
            const body = verbs.includes(word) ? [{ word, score: 1, tags: ['v', 'f:5'] }] : (word ? [{ word, score: 1, tags: ['n', 'f:5'] }] : []);
            return { ok: true, status: 200, json: async () => body };
        }
        throw new Error('unexpected ' + url);
    };
}

const ONLINE = {
    'susurrar|es|en': ['Para susurrar', 'whisper', 'to whisper'],
    'chismear|es|en': ['gossip'],
    'palpar|es|en': ['Sense of Touch', 'touch', 'to touch'],
    'to whisper|en|es': ['Para susurrar', 'susurrar'],
    'whisper|en|es': ['susurrar'],
    'kill|en|es': ['matar']
};

test('a Spanish verb outside the list is found online and marked "not reviewed"', async () => {
    const online = createGameContext({ fetch: fakeOnline(ONLINE, ['whisper', 'gossip', 'touch']) });
    const verb = online.toPlain(await online.call('lookupVerbOnline', 'susurrar'));
    assert.equal(verb.base, 'whisper');
    assert.deepEqual(verb.es, ['susurrar']);
    assert.equal(verb.reviewed, false);
});

test('noisy translations are cleaned: "Sense of Touch" is skipped for the alternative "touch"', async () => {
    const online = createGameContext({ fetch: fakeOnline(ONLINE, ['whisper', 'touch']) });
    const verb = online.toPlain(await online.call('lookupVerbOnline', 'palpar'));
    assert.equal(verb.base, 'touch');
});

test('an English verb outside the list gets its Spanish infinitive ("Para susurrar" → "susurrar")', async () => {
    const online = createGameContext({ fetch: fakeOnline(ONLINE, ['whisper']) });
    const verb = online.toPlain(await online.call('lookupVerbOnline', 'whisper'));
    assert.equal(verb.base, 'whisper');
    assert.deepEqual(verb.es, ['susurrar']);
});

test('a word that is not a verb, an unsafe word or no connection gives null', async () => {
    const notVerb = createGameContext({ fetch: fakeOnline(ONLINE, []) });
    assert.equal(await notVerb.call('lookupVerbOnline', 'chismear'), null, 'gossip is not tagged as a verb here');
    const unsafe = createGameContext({ fetch: fakeOnline(ONLINE, ['kill']) });
    assert.equal(await unsafe.call('lookupVerbOnline', 'kill'), null);
    const offline = createGameContext({ offline: true });
    assert.equal(await offline.call('lookupVerbOnline', 'susurrar'), null);
    assert.equal(offline.run('lastLookupOffline'), true, 'offline is told apart from "not found"');
    assert.equal(notVerb.run('lastLookupOffline'), false);
    const empty = createGameContext({ fetch: fakeOnline(ONLINE, []) });
    assert.equal(await empty.call('lookupVerbOnline', 'zzzzar'), null);
});
