// Activity of the student for the main page (GAMES-18): every finished guide is kept per
// student, and the summary encourages without grades and says what to reinforce.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';
import { createCamposContext } from './helpers/campos-context.mjs';

const game = createGameContext({ seed: 18 });
const plain = (value) => game.toPlain(value);

function memoryStorage() {
    const data = {};
    return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } };
}
const blockedStorage = () => ({ getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } });
const emptyStore = () => plain(game.call('loadProgress', memoryStorage())).store;
const area = (id, label, score, max, extra) => Object.assign({ id, label, score, max }, extra || {});
const exam = (subject, areas, day, demo) => ({ date: new Date(2026, 9, day || 20, 12).toISOString(), subject, title: subject === 'english' ? 'GRAMMAR GUIDE' : 'GUÍA DE ESTUDIO', demo: Boolean(demo), areas });

// ---------- Saving (FR-004) ----------

test('loadProgress / saveProgress: normal, blocked and broken storage', () => {
    const storage = memoryStorage();
    assert.deepEqual(plain(game.call('loadProgress', storage)), { store: { version: 1, students: {} }, available: true });
    const store = emptyStore();
    game.call('recordExam', store, 'Ana', exam('english', [area('english:Grammar', 'Grammar', 3, 5)]));
    assert.equal(game.call('saveProgress', storage, store), true);
    assert.equal(plain(game.call('loadProgress', storage)).store.students.ana.exams.length, 1);
    storage.setItem('games-progress-v1', '{broken');
    assert.deepEqual(plain(game.call('loadProgress', storage)).store, { version: 1, students: {} });
    assert.equal(plain(game.call('loadProgress', blockedStorage())).available, false);
    assert.equal(game.call('saveProgress', blockedStorage(), store), false);
});

test('recordExam keeps the exams of each student (same name rules as the prizes) and only the last 50', () => {
    const store = emptyStore();
    for (let i = 0; i < 55; i++) game.call('recordExam', store, i % 2 ? ' ANA ' : 'Ana', exam('campos', [area('campos:huella', 'Huella hídrica', i % 3, 2)], 1 + (i % 28)));
    game.call('recordExam', store, '', exam('english', [area('english:Reading', 'Reading', 1, 1)]));
    const result = plain(store);
    assert.equal(result.students.ana.exams.length, 50);
    assert.equal(result.students.ana.name, 'Ana');
    assert.equal(result.students.guest.exams.length, 1);
});

// ---------- Exams from the guides (FR-004) ----------

test('englishExamFromGuide: one area per group of sections (Grammar, Vocabulary, Spelling…)', () => {
    const guide = game.run('DEMO_GUIDES.gvs');
    const scores = plain(game.run('DEMO_GUIDES.gvs.sections.map(s => ({ score: 1, max: s.items.length }))'));
    const result = plain(game.call('englishExamFromGuide', guide, scores, new Date(2026, 9, 31, 12)));
    assert.equal(result.subject, 'english');
    assert.equal(result.demo, true);
    assert.equal(result.title, 'GRAMMAR, VOCABULARY & SPELLING GUIDE');
    assert.deepEqual(result.areas.map(a => a.label), ['Grammar', 'Vocabulary', 'Spelling']);
    const grammar = result.areas[0];
    assert.equal(grammar.score, 3);
    assert.equal(grammar.max, scores.slice(0, 3).reduce((n, s) => n + s.max, 0));
    // A guide without groups uses its kind (the Listening guide)
    const listening = { kind: 'listening', title: 'LISTENING', sections: [{ type: 'listen' }, { type: 'choice', items: [1, 2] }] };
    assert.deepEqual(plain(game.call('englishExamFromGuide', listening, [{ score: 0, max: 0 }, { score: 2, max: 2 }], new Date())).areas.map(a => [a.label, a.score, a.max]), [['Listening', 2, 2]]);
});

test('camposExamFromGuide: one area per topic, with its campo, from what was answered right', () => {
    const campos = createCamposContext({ seed: 2 });
    const demo = campos.toPlain(campos.call('buildCamposDemo'));
    const states = demo.sections.map(s => ({ correct: s.items.map((item, i) => (i % 2 ? 0 : 1)) }));
    const result = campos.toPlain(campos.call('camposExamFromGuide', demo, states, new Date(2026, 9, 31, 12)));
    assert.equal(result.subject, 'campos');
    assert.equal(result.demo, true);
    const items = demo.sections.flatMap(s => s.items);
    assert.equal(result.areas.reduce((n, a) => n + a.max, 0), items.length);
    for (const a of result.areas) {
        assert.match(a.id, /^campos:/);
        assert.ok(a.label && a.campo && a.campoName, a.id);
    }
});

// ---------- Summary without grades (FR-005, SC-001, SC-002) ----------

const NO_GRADES = /\d+\s*(%|\/|pts|points|puntos)|average|promedio|calificaci|grade\b|\b\d{1,3}\b/i;

function textsOf(summary) {
    return [summary.headline, ...summary.subjects.map(s => s.message), ...summary.strengths, ...summary.improve, ...summary.recent.map(r => r.subject + ' ' + r.title + ' ' + r.emoji)];
}

test('levelOf: 4 levels by the ratio of right answers', () => {
    assert.equal(game.call('levelOf', 1), 'star');
    assert.equal(game.call('levelOf', 0.9), 'star');
    assert.equal(game.call('levelOf', 0.89), 'great');
    assert.equal(game.call('levelOf', 0.75), 'great');
    assert.equal(game.call('levelOf', 0.6), 'good');
    assert.equal(game.call('levelOf', 0.59), 'growing');
    assert.equal(game.call('levelOf', 0), 'growing');
});

test('the summary has no grades in any level or language (SC-001)', () => {
    for (const ratio of [1, 0.8, 0.65, 0.3]) {
        for (const lang of ['en', 'es']) {
            const store = emptyStore();
            const record = game.call('recordExam', store, 'Ana', exam('english', [area('english:Grammar', 'Grammar', Math.round(10 * ratio), 10), area('english:Reading', 'Reading', Math.round(4 * ratio), 4)], 10));
            game.call('recordExam', store, 'Ana', exam('campos', [area('campos:circulatorio', 'Sistema circulatorio', Math.round(6 * ratio), 6, { campo: 'saberes', campoName: 'Saberes y pensamiento científico' })], 11));
            const summary = plain(game.call('summarizeProgress', record, lang));
            assert.equal(summary.empty, false);
            for (const text of textsOf(summary)) assert.ok(!NO_GRADES.test(text), lang + ' ' + ratio + ': ' + text);
            assert.ok(summary.headline.includes('Ana'), summary.headline);
        }
    }
});

test('strengths are the best areas and the areas to reinforce the weakest, with what to do (SC-002)', () => {
    const store = emptyStore();
    const saberes = { campo: 'saberes', campoName: 'Saberes y pensamiento científico' };
    game.call('recordExam', store, 'Luis', exam('english', [area('english:Grammar', 'Grammar', 2, 10), area('english:Reading', 'Reading', 7, 7), area('english:Spelling', 'Spelling', 5, 5)], 3));
    const record = game.call('recordExam', store, 'Luis', exam('campos', [area('campos:circulatorio', 'Sistema circulatorio', 1, 6, saberes), area('campos:huella', 'Huella hídrica', 6, 6, saberes)], 4));
    const en = plain(game.call('summarizeProgress', record, 'en'));
    assert.equal(en.strengths.length, 3);
    assert.ok(en.strengths.some(s => s.includes('Reading')) && en.strengths.some(s => s.includes('Spelling')) && en.strengths.some(s => s.includes('Huella hídrica')));
    assert.equal(en.improve.length, 2);
    // The weakest first, with a concrete suggestion
    assert.match(en.improve[0], /Sistema circulatorio/);
    assert.match(en.improve[0], /Saberes y pensamiento científico/);
    assert.match(en.improve[1], /Grammar/);
    assert.match(en.improve[1], /Grammar Cards/);
    const es = plain(game.call('summarizeProgress', record, 'es'));
    assert.match(es.improve[0], /Repasa la tarjeta «Sistema circulatorio»/);
    assert.match(es.improve[1], /Gramática/);
    assert.deepEqual(es.subjects.map(s => s.subject), ['english', 'campos']);
    // Recent activity: newest first, without numbers
    assert.equal(es.recent.length, 2);
    assert.equal(es.recent[0].subject, 'Campos formativos');
    assert.equal(en.recent[1].subject, 'English');
});

test('a student without exams is invited to start', () => {
    const en = plain(game.call('summarizeProgress', null, 'en'));
    assert.equal(en.empty, true);
    assert.match(en.headline, /first guide/i);
    assert.match(plain(game.call('summarizeProgress', { name: 'Ana', exams: [] }, 'es')).headline, /primera guía/i);
});

// ---------- Prizes already won (they count from before GAMES-18) ----------

test('prizesLine: the accessories already won and the latest one, in both languages, without grades', () => {
    assert.equal(game.call('prizesLine', [], 'en'), '');
    assert.equal(game.call('prizesLine', null, 'es'), '');
    const owned = [{ id: 'redCollar', date: '2026-10-01T10:00:00.000Z' }, { id: 'witchHat', date: '2026-10-28T10:00:00.000Z' }, { id: 'cap', date: '2026-10-20T10:00:00.000Z' }];
    assert.equal(game.call('prizesLine', owned, 'en'), '🐾 You have already won 3 accessories for your pets. The latest one: Witch hat. Keep it up!');
    assert.equal(game.call('prizesLine', owned, 'es'), '🐾 Ya ganaste 3 accesorios para tus mascotas. El último: Sombrero de bruja. ¡Sigue así!');
    assert.equal(game.call('prizesLine', owned.slice(0, 1), 'en'), '🐾 You have already won 1 accessory for your pets. The latest one: Red collar. Keep it up!');
    assert.equal(game.call('prizesLine', owned.slice(0, 1), 'es'), '🐾 Ya ganaste 1 accesorio para tus mascotas. El último: Collar rojo. ¡Sigue así!');
    // An accessory that no longer exists is skipped
    assert.equal(game.call('prizesLine', [{ id: 'gone', date: '2026-10-30T10:00:00.000Z' }], 'en'), '');
});
