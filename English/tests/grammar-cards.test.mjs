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
