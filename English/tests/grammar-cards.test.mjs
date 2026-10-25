// Grammar cards and the printed card sheets (GAMES-6, FR-008 to FR-012)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext();
const CARDS = game.toPlain(game.run('GRAMMAR_CARDS'));
const TENSE_IDS = game.toPlain(game.run('TENSES')).map(t => t.id);
const cardsFor = (tenseIds) => game.toPlain(game.call('grammarCardsFor', tenseIds));
const build = (selection) => game.call('buildCardsPrintHtml', selection);

const GUIDE_IDS = ['quantifiers', 'causative', 'pastAgo', 'comparatives'];
const BASIC_IDS = ['subjectPronouns', 'possessives', 'articles', 'plurals', 'thereIsAre', 'prepositionsPlace', 'prepositionsTime', 'canCant'];

function countClass(html, token) {
    return Array.from(html.matchAll(/class="([^"]*)"/g)).filter(m => m[1].split(/\s+/).includes(token)).length;
}

test('22 cards: 10 tenses, 4 from the guides and 8 basic topics', () => {
    assert.equal(CARDS.length, 22);
    const ids = (group) => CARDS.filter(c => c.group === group).map(c => c.id);
    assert.deepEqual(ids('tenses'), TENSE_IDS);
    assert.deepEqual(ids('guides'), GUIDE_IDS);
    assert.deepEqual(ids('basics'), BASIC_IDS);
    assert.equal(new Set(CARDS.map(c => c.id)).size, 22);
});

test('every card has a title, a short explanation and 1 or 2 examples in English and Spanish (FR-009, FR-010)', () => {
    const examplesOk = (list, where) => {
        assert.ok(list.length >= 1 && list.length <= 2, where + ': ' + list.length + ' examples');
        for (const e of list) assert.ok(e.en && e.es && e.en !== e.es, where + ': ' + JSON.stringify(e));
    };
    for (const card of CARDS) {
        assert.ok(card.title, card.id);
        // 3 lines of a card are about 180 characters
        assert.ok(card.explanation && card.explanation.length <= 180, card.id + ' explanation: ' + (card.explanation || '').length);
        if (card.changesWithTense) {
            for (const [tenseId, list] of Object.entries(card.examplesByTense)) {
                assert.ok(TENSE_IDS.includes(tenseId), card.id + ' ' + tenseId);
                examplesOk(list, card.id + ' ' + tenseId);
            }
        } else {
            examplesOk(card.examples, card.id);
        }
    }
});

test('tense cards have the structure (affirmative, negative, question) and keywords', () => {
    for (const card of CARDS.filter(c => c.group === 'tenses')) {
        for (const part of ['affirmative', 'negative', 'question']) assert.ok(card.structure && card.structure[part], card.id + ' ' + part);
        assert.ok(card.keywords.length >= 3, card.id + ' keywords');
        assert.equal(card.examples.length, 2, card.id);
    }
    for (const card of CARDS.filter(c => c.group !== 'tenses')) assert.equal(card.structure, undefined, card.id);
});

test('topics that change with the tense have an example for every tense they allow', () => {
    const changing = CARDS.filter(c => c.changesWithTense).map(c => c.id).sort();
    assert.deepEqual(changing, ['canCant', 'causative', 'comparatives', 'quantifiers', 'thereIsAre']);
    const can = CARDS.find(c => c.id === 'canCant');
    assert.deepEqual(Object.keys(can.examplesByTense).sort(), ['futureGoingTo', 'futureWill', 'pastSimple', 'presentSimple']);
    assert.match(can.examplesByTense.pastSimple[0].en, /could/);
    assert.match(can.examplesByTense.futureWill[0].en, /will be able to/);
    const there = CARDS.find(c => c.id === 'thereIsAre');
    assert.match(there.examplesByTense.pastSimple[0].en, /There (was|were)/);
    assert.match(there.examplesByTense.futureWill[0].en, /There will be/);
    assert.equal(Object.keys(CARDS.find(c => c.id === 'quantifiers').examplesByTense).length, 10);
});

test('grammarCardsFor shows the examples of the chosen tenses only, in the fixed order', () => {
    const cards = cardsFor(['pastSimple', 'presentSimple']);
    assert.equal(cards.length, 22);
    const there = cards.find(c => c.id === 'thereIsAre');
    assert.deepEqual(there.examples.map(e => e.tense), ['Present simple', 'Past simple']);
    assert.match(there.examples[0].en, /^There (is|are)/);
    // A fixed topic says that it works the same in every tense
    assert.match(cards.find(c => c.id === 'articles').note, /same in every tense/);
    assert.match(cards.find(c => c.id === 'pastAgo').note, /past simple/i);
    // Tense cards say whether their tense is one of the chosen ones
    assert.equal(cards.find(c => c.id === 'pastSimple').chosen, true);
    assert.equal(cards.find(c => c.id === 'pastPerfect').chosen, false);
});

test('a changing topic with none of its tenses chosen still shows an example, with a note', () => {
    const can = cardsFor(['presentPerfect']).find(c => c.id === 'canCant');
    assert.equal(can.examples.length, 1);
    assert.match(can.note, /Present simple/);
});

test('buildCardsPrintHtml makes one .print-card per chosen card, in the chosen order', () => {
    const html = build({ kind: 'grammar', items: ['articles', 'presentSimple', 'canCant', 'quantifiers'], tenses: ['presentSimple', 'presentContinuous', 'pastSimple'] });
    assert.equal(countClass(html, 'print-cards'), 1);
    assert.equal(countClass(html, 'print-card'), 4);
    const order = ['Articles', 'Present simple', 'Can / can', 'Quantifiers'].map(t => html.indexOf(t));
    assert.deepEqual([...order].sort((a, b) => a - b), order, order.join(','));
    assert.ok(!/<button|tutor|onclick/i.test(html), 'no screen elements');
});

test('verb cards: one per verb, wide when the verb has more than 6 tenses', () => {
    const verbs = game.toPlain(game.run('VERBS'));
    const eat = verbs.find(v => v.base === 'eat'), go = verbs.find(v => v.base === 'go');
    const few = build({ kind: 'verbs', items: [eat, go], tenses: ['presentSimple', 'pastSimple'] });
    assert.equal(countClass(few, 'print-card'), 2);
    assert.equal(countClass(few, 'wide'), 0);
    assert.match(few, /ate/);
    assert.match(few, /Ella comió/);
    const all = build({ kind: 'verbs', items: ['eat'], tenses: TENSE_IDS });
    assert.equal(countClass(all, 'wide'), 1);
    assert.match(all, /will be eating/);
});

test('buildCardsPrintHtml fails without cards or without tenses', () => {
    assert.throws(() => build({ kind: 'grammar', items: [], tenses: ['presentSimple'] }));
    assert.throws(() => build({ kind: 'grammar', items: ['articles'], tenses: [] }));
    assert.throws(() => build({ kind: 'verbs', items: [], tenses: ['presentSimple'] }));
    assert.throws(() => build({ kind: 'grammar', items: ['nope'], tenses: ['presentSimple'] }));
});

test('text is escaped and the selection is not changed', () => {
    const online = { base: 'whisper', es: ['<b>susurrar</b>'], objEn: '', objEs: '', reviewed: false };
    const selection = { kind: 'verbs', items: [online], tenses: ['pastSimple', 'presentSimple'] };
    const before = JSON.stringify(selection);
    const html = build(selection);
    assert.ok(!html.includes('<b>susurrar'), 'escaped');
    assert.match(html, /&lt;b&gt;susurrar/);
    assert.match(html, /not reviewed/);
    assert.equal(JSON.stringify(selection), before);
    assert.deepEqual(selection.tenses, ['pastSimple', 'presentSimple']);
});

test('verb cards keep the order of the selection and show the chosen tenses only (US3)', () => {
    const html = build({ kind: 'verbs', items: ['swim', 'eat', 'get up'], tenses: ['futureWill', 'pastSimple'] });
    assert.equal(countClass(html, 'print-card'), 3);
    const order = ['swim (nadar)', 'eat (comer)', 'get up (levantarse)'].map(t => html.indexOf(t.replace('(', '<span class="card-es">(')));
    assert.ok(order.every(i => i >= 0), order.join(','));
    assert.deepEqual([...order].sort((a, b) => a - b), order);
    // Tenses in the fixed order, whatever the order of the selection
    assert.ok(html.indexOf('Past simple') < html.indexOf('Future (will)'));
    assert.ok(!html.includes('Present simple'));
    for (const text of ['swam', 'She swam', 'will swim', 'got up', 'Ella se levantó', 'will eat']) assert.ok(html.includes(text), text);
});

// ---------- Subjects in the structure of the tense cards (GAMES-7) ----------

const ALL = 'I / you / he / she / it / we / they';
// Reviewed by hand: subject-verb agreement of every line (FR-003, SC-002)
const STRUCTURES = {
    presentSimple: [
        'I / you / we / they play · he / she / it plays',
        "I / you / we / they don't play · he / she / it doesn't play",
        'Do I / you / we / they play? · Does he / she / it play?'
    ],
    presentContinuous: [
        'I am playing · you / we / they are playing · he / she / it is playing',
        "I'm not playing · you / we / they aren't playing · he / she / it isn't playing",
        'Am I playing? · Are you / we / they playing? · Is he / she / it playing?'
    ],
    presentPerfect: [
        'I / you / we / they have played · he / she / it has played',
        "I / you / we / they haven't played · he / she / it hasn't played",
        'Have I / you / we / they played? · Has he / she / it played?'
    ],
    presentPerfectContinuous: [
        'I / you / we / they have been playing · he / she / it has been playing',
        "I / you / we / they haven't been playing · he / she / it hasn't been playing",
        'Have I / you / we / they been playing? · Has he / she / it been playing?'
    ],
    pastSimple: [
        ALL + ' played (irregular: went, ate)',
        ALL + " didn't play",
        'Did ' + ALL + ' play?'
    ],
    pastContinuous: [
        'I / he / she / it was playing · you / we / they were playing',
        "I / he / she / it wasn't playing · you / we / they weren't playing",
        'Was I / he / she / it playing? · Were you / we / they playing?'
    ],
    pastPerfect: [ALL + ' had played', ALL + " hadn't played", 'Had ' + ALL + ' played?'],
    futureWill: [ALL + ' will play', ALL + " won't play", 'Will ' + ALL + ' play?'],
    futureGoingTo: [
        'I am going to play · you / we / they are going to play · he / she / it is going to play',
        "I'm not going to play · you / we / they aren't going to play · he / she / it isn't going to play",
        'Am I going to play? · Are you / we / they going to play? · Is he / she / it going to play?'
    ],
    futureContinuous: [ALL + ' will be playing', ALL + " won't be playing", 'Will ' + ALL + ' be playing?']
};

test('every structure line of the 10 tense cards names the 7 subjects and a form of play (FR-001, FR-002, FR-004)', () => {
    for (const card of CARDS.filter(c => c.group === 'tenses')) {
        for (const part of ['affirmative', 'negative', 'question']) {
            const line = card.structure[part];
            for (const subject of ['I', 'you', 'he', 'she', 'it', 'we', 'they']) {
                assert.match(line, new RegExp('(^|[^A-Za-z])' + subject + '([^A-Za-z]|$)', subject === 'I' ? '' : 'i'), card.id + ' ' + part + ' has no "' + subject + '": ' + line);
            }
            assert.match(line, /\bplay(s|ing|ed)?\b/, card.id + ' ' + part + ' has no form of play: ' + line);
        }
    }
});

test('the 30 structure lines are the reviewed ones (FR-003, SC-002)', () => {
    for (const card of CARDS.filter(c => c.group === 'tenses')) {
        assert.deepEqual([card.structure.affirmative, card.structure.negative, card.structure.question], STRUCTURES[card.id], card.id);
    }
});

test('each group of subjects goes on its own line of the card (GAMES-7)', () => {
    const html = build({ kind: 'grammar', items: ['presentPerfect'], tenses: ['presentPerfect'] });
    assert.ok(html.includes('I / you / we / they have played<br>he / she / it has played'), html);
    assert.ok(!html.includes(' · he / she / it has played'));
});

// ---------- 1 or 2 columns per printed sheet (GAMES-8) ----------

test('columns: 2 by default, with the same sheet as before (SC-002)', () => {
    for (const selection of [
        { kind: 'grammar', items: ['articles', 'presentSimple'], tenses: ['presentSimple', 'pastSimple'] },
        { kind: 'verbs', items: ['eat', 'go'], tenses: TENSE_IDS }
    ]) {
        const before = build(selection);
        assert.equal(build({ ...selection, columns: 2 }), before, selection.kind);
        assert.equal(countClass(before, 'one-column'), 0);
    }
});

test('columns: 1 marks the sheet as one column, with the same cards (FR-003)', () => {
    const grammar = { kind: 'grammar', items: ['articles', 'presentSimple', 'canCant'], tenses: ['presentSimple', 'pastSimple'] };
    const verbs = { kind: 'verbs', items: ['eat', 'go', 'swim'], tenses: TENSE_IDS };
    for (const selection of [grammar, verbs]) {
        const one = build({ ...selection, columns: 1 });
        assert.match(one, /class="print-cards one-column"/, selection.kind);
        assert.equal(countClass(one, 'print-card'), selection.items.length, selection.kind);
        assert.equal(countClass(one, 'print-card'), countClass(build(selection), 'print-card'));
    }
});

test('columns other than 1 or 2 is an error', () => {
    const selection = { kind: 'grammar', items: ['articles'], tenses: ['presentSimple'] };
    for (const columns of [3, 0, '1', null]) assert.throws(() => build({ ...selection, columns }), String(columns));
});
