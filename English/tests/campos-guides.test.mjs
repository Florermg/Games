// Guía 5.º Campos formativos (GAMES-17): content, grading, demo and generated guides
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCamposContext } from './helpers/campos-context.mjs';

const game = createCamposContext({ seed: 17 });
const plain = (value) => game.toPlain(value);
const CAMPOS = plain(game.run('CAMPOS'));
const TEMAS = plain(game.run('TEMAS'));
const CLASIFICA = plain(game.run('CLASIFICA'));
const CAMPO_IDS = ['lenguajes', 'saberes', 'etica', 'humano'];
const TYPES = ['choice', 'truefalse', 'match', 'bank', 'classify', 'open'];

// The 21 topics of the guide, in its order (spec, "Contenido de la guía")
const GUIDE_TITLES = {
    lenguajes: ['Tipos de sustantivos', 'Clases de palabras: variables e invariables', 'Artículos determinados e indeterminados',
        'Sustantivos y adjetivos', 'Palabras polisémicas', 'Prefijos y sufijos'],
    saberes: ['Huella hídrica y agua virtual', 'Contaminación del agua, aire y suelo', 'Sistema respiratorio',
        'Sistema circulatorio', 'El impacto de nuestras acciones en el ambiente y la salud', 'Acciones para cuidar el ambiente'],
    etica: ['Sustentabilidad y las 5 R', 'Energías renovables y no renovables', 'Las capas de la Tierra', 'Independencia de México'],
    humano: ['Escuchar activamente', 'Tomar decisiones en grupo', 'Resolución de conflictos',
        'Importancia de la comunicación en grupo', 'Reuniones para llegar a acuerdos']
};

// ---------- Content (FR-002, SC-001) ----------

test('the 4 campos formativos and the 21 topics of the guide, in order', () => {
    assert.deepEqual(CAMPOS.map(c => c.id), CAMPO_IDS);
    assert.deepEqual(CAMPOS.map(c => c.name), ['Lenguajes', 'Saberes y pensamiento científico', 'Ética, naturaleza y sociedades', 'De lo humano y lo comunitario']);
    for (const campo of CAMPO_IDS) {
        assert.deepEqual(TEMAS.filter(t => t.campo === campo).map(t => t.title), GUIDE_TITLES[campo], campo);
    }
    assert.equal(TEMAS.length, 21);
    assert.equal(new Set(TEMAS.map(t => t.id)).size, 21);
});

test('every topic has a study card and questions; every question is complete', () => {
    for (const tema of TEMAS) {
        assert.ok(tema.card.points.length >= 2, tema.id + ' card');
        assert.ok(tema.choice.length >= 3, tema.id + ' choice');
        assert.ok(tema.truefalse.length >= 3, tema.id + ' truefalse');
        assert.ok(tema.pairs.length >= 2, tema.id + ' pairs');
        for (const q of tema.choice) {
            assert.ok(q.text && q.tip && q.explanation, tema.id + ': ' + q.text);
            assert.ok(q.options.length >= 3 && new Set(q.options).size === q.options.length, tema.id + ': ' + q.text);
            assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, tema.id + ': ' + q.text);
        }
        for (const q of tema.truefalse) {
            assert.equal(typeof q.answer, 'boolean', tema.id + ': ' + q.text);
            assert.ok(q.text && q.explanation, tema.id + ': ' + q.text);
        }
        for (const pair of tema.pairs) assert.ok(pair.length === 2 && pair[0] && pair[1], tema.id + ' pair');
        for (const q of tema.bank || []) {
            assert.equal(q.text.split('___').length, 2, tema.id + ': ' + q.text);
            assert.ok(q.answer && q.tip, tema.id + ': ' + q.text);
        }
        for (const q of tema.open || []) {
            assert.ok(q.text && q.model && q.tip, tema.id + ': ' + q.text);
            assert.ok(q.ideas.length >= 1 && q.need >= 1 && q.need <= q.ideas.length, tema.id + ': ' + q.text);
            // The model answer itself must pass
            assert.ok(game.call('openIdeasFound', q, q.model) >= q.need, tema.id + ' model of: ' + q.text);
        }
    }
    // Every type has questions in every campo (clarification 4: all the types)
    for (const campo of CAMPO_IDS) {
        const temas = TEMAS.filter(t => t.campo === campo);
        assert.ok(temas.some(t => (t.bank || []).length), campo + ' bank');
        assert.ok(temas.some(t => (t.open || []).length), campo + ' open');
        assert.ok(CLASIFICA.some(c => c.campo === campo), campo + ' classify');
    }
});

test('every classify set has 2+ categories and 6+ items in them', () => {
    const temaIds = TEMAS.map(t => t.id);
    for (const set of CLASIFICA) {
        assert.ok(CAMPO_IDS.includes(set.campo) && temaIds.includes(set.tema), set.id);
        assert.ok(set.categories.length >= 2 && set.prompt, set.id);
        assert.ok(set.items.length >= 6, set.id);
        for (const [text, index] of set.items) assert.ok(text && index >= 0 && index < set.categories.length, set.id + ' ' + text);
        // Each category is used
        set.categories.forEach((c, i) => assert.ok(set.items.some(([, index]) => index === i), set.id + ' ' + c));
    }
});

// ---------- Grading (FR-005, FR-006) ----------

test('normalizeEs ignores case, accents and punctuation', () => {
    assert.equal(game.call('normalizeEs', '  ¡El CORAZÓN bombea la sangre!  '), 'el corazon bombea la sangre');
    assert.equal(game.call('normalizeEs', 'Tráquea'), 'traquea');
    assert.equal(game.call('normalizeEs', 'pequeñito'), 'pequenito');
});

test('open answers are graded by key ideas, as whole words, with synonyms', () => {
    const item = { ideas: [['oxigeno'], ['sangre', 'corazon']], need: 2 };
    assert.equal(game.call('openIdeasFound', item, 'El oxígeno pasa a la sangre.'), 2);
    assert.equal(game.call('openIdeasFound', item, 'El OXIGENO llega al corazón'), 2);
    assert.equal(game.call('openIdeasFound', item, 'Respiramos oxígeno'), 1);
    assert.equal(game.call('openIdeasFound', item, 'sangrero'), 0, 'whole words only');
    const phrase = { ideas: [['otra actividad', 'turnarse']], need: 1 };
    assert.equal(game.call('openIdeasFound', phrase, 'Pueden buscar otra actividad.'), 1);
    assert.equal(game.call('isCorrectCampos', { type: 'open' }, item, 'El oxígeno pasa a la sangre'), true);
    assert.equal(game.call('isCorrectCampos', { type: 'open' }, item, 'Respiramos oxígeno'), false);
});

test('isCorrectCampos and correctAnswerTextCampos for every type', () => {
    const choice = { type: 'choice' }, item = { options: ['a', 'b'], answer: 1 };
    assert.equal(game.call('isCorrectCampos', choice, item, '1'), true);
    assert.equal(game.call('isCorrectCampos', choice, item, '0'), false);
    assert.equal(game.call('correctAnswerTextCampos', choice, item), 'b');
    const classify = { type: 'classify', categories: ['renovable', 'no renovable'] };
    assert.equal(game.call('isCorrectCampos', classify, { answer: 1 }, '1'), true);
    assert.equal(game.call('correctAnswerTextCampos', classify, { answer: 1 }), 'no renovable');
    const bank = { type: 'bank' };
    assert.equal(game.call('isCorrectCampos', bank, { answers: ['tráquea'] }, 'tráquea'), true);
    assert.equal(game.call('isCorrectCampos', bank, { answers: ['tráquea'] }, 'bronquios'), false);
    const match = { type: 'match', definitions: [{ letter: 'a', text: 'Bombea la sangre' }] };
    assert.equal(game.call('isCorrectCampos', match, { answers: ['a'] }, 'a'), true);
    assert.equal(game.call('correctAnswerTextCampos', match, { answers: ['a'] }), 'a. Bombea la sangre');
    assert.equal(game.call('correctAnswerTextCampos', { type: 'open' }, { model: 'Porque…' }), 'Porque…');
    assert.deepEqual(plain(game.call('scoreSectionCampos', { items: [1, 2, 3] }, { correct: [1, 0, 2] })), { score: 2, max: 3 });
});

// ---------- Guides (FR-003, FR-004, SC-002) ----------

function checkGuide(guide, campos) {
    const temaIds = new Set(TEMAS.filter(t => campos.includes(t.campo)).map(t => t.id));
    const seen = new Set();
    for (const section of guide.sections) {
        assert.ok(TYPES.includes(section.type), section.type);
        assert.ok(section.title && section.items.length > 0, section.type);
        for (const item of section.items) {
            assert.ok(temaIds.has(item.tema), section.type + ' from ' + item.tema);
            const key = section.type + '|' + item.text;
            assert.ok(!seen.has(key), 'repeated: ' + key);
            seen.add(key);
            if (['choice', 'truefalse'].includes(section.type)) assert.ok(item.answer >= 0 && item.answer < item.options.length);
            if (section.type === 'truefalse') assert.deepEqual(item.options, ['Verdadero', 'Falso']);
            if (section.type === 'classify') assert.ok(item.answer >= 0 && item.answer < section.categories.length);
            if (section.type === 'bank') assert.ok(section.bank.includes(item.answers[0]));
            if (section.type === 'match') assert.ok(section.definitions.some(d => d.letter === item.answers[0]));
            if (section.type === 'open') assert.ok(item.model && item.ideas.length);
        }
        if (section.type === 'match') {
            assert.equal(new Set(section.definitions.map(d => d.text)).size, section.definitions.length, 'unique definitions');
            assert.equal(section.definitions.length, section.items.length);
        }
        if (section.type === 'bank') assert.equal(new Set(section.items.map(i => i.answers[0])).size, section.items.length, 'unique bank answers');
    }
}

test('the demo is fixed, has every type and questions of the 4 campos (FR-003)', () => {
    const demo = plain(game.call('buildCamposDemo'));
    assert.equal(demo.demo, true);
    assert.equal(demo.kind, 'campos');
    assert.deepEqual(demo.sections.map(s => s.type), TYPES);
    checkGuide(demo, CAMPO_IDS);
    const campos = new Set(demo.sections.flatMap(s => s.items.map(i => TEMAS.find(t => t.id === i.tema).campo)));
    assert.deepEqual([...campos].sort(), [...CAMPO_IDS].sort());
    assert.deepEqual(plain(game.call('buildCamposDemo')), demo, 'always the same');
    // The right option is not always the first one
    const answers = demo.sections.filter(s => s.type === 'choice').flatMap(s => s.items.map(i => i.answer));
    assert.ok(new Set(answers).size > 1);
});

test('generated guides: 200 guides only from the chosen campos, without repeats (SC-002)', () => {
    const choices = [CAMPO_IDS, ['lenguajes'], ['saberes'], ['etica'], ['humano'], ['lenguajes', 'humano']];
    for (let i = 0; i < 200; i++) {
        const campos = choices[i % choices.length];
        const guide = plain(game.call('generateCamposGuide', { campos }));
        assert.equal(guide.kind, 'campos');
        assert.ok(!guide.demo);
        checkGuide(guide, campos);
    }
    // With all the campos, every section has its full size (FR-004)
    const full = plain(game.call('generateCamposGuide', { campos: CAMPO_IDS }));
    assert.deepEqual(full.sections.map(s => [s.type, s.items.length]),
        [['choice', 8], ['truefalse', 8], ['match', 5], ['bank', 5], ['classify', 6], ['open', 2]]);
    // Two guides are different
    const a = JSON.stringify(plain(game.call('generateCamposGuide', { campos: CAMPO_IDS })));
    const b = JSON.stringify(plain(game.call('generateCamposGuide', { campos: CAMPO_IDS })));
    assert.notEqual(a, b);
});

// ---------- Ejercicios por tema (GAMES-21) ----------

test('every topic has every type of exercise, with its examples to classify', () => {
    for (const tema of TEMAS) {
        assert.ok(tema.choice.length >= 4, tema.id + ' choice');
        assert.ok(tema.truefalse.length >= 4, tema.id + ' truefalse');
        assert.ok(tema.pairs.length >= 3, tema.id + ' pairs');
        assert.ok((tema.bank || []).length >= 3, tema.id + ' bank');
        assert.ok((tema.open || []).length >= 1, tema.id + ' open');
        assert.ok(CLASIFICA.some(set => set.tema === tema.id), tema.id + ' classify');
        // Inside one topic the bank answers and the match columns never repeat
        assert.equal(new Set(tema.bank.map(q => game.call('normalizeEs', q.answer))).size, tema.bank.length, tema.id + ' bank answers');
        assert.equal(new Set(tema.pairs.map(p => p[0])).size, tema.pairs.length, tema.id + ' pair terms');
        assert.equal(new Set(tema.pairs.map(p => p[1])).size, tema.pairs.length, tema.id + ' pair definitions');
    }
});

test('topics are numbered as in the printed guide, starting at 1 in each campo', () => {
    assert.equal(game.call('temaNumber', 'sustantivos'), 1);
    assert.equal(game.call('temaNumber', 'variables'), 2);
    assert.equal(game.call('temaNumber', 'prefijos'), 6);
    assert.equal(game.call('temaNumber', 'huella'), 1);
    assert.equal(game.call('temaNumber', 'reuniones'), 5);
    assert.equal(game.call('temaHeading', 'variables'), '2. Clases de palabras: variables e invariables');
});

test('the exercises of one topic: all its questions, every type, nothing from other topics', () => {
    for (const tema of TEMAS) {
        const guide = plain(game.call('buildTemaGuide', tema.id));
        assert.equal(guide.kind, 'campos');
        assert.equal(guide.tema, tema.id);
        assert.ok(!guide.demo, 'it can earn a prize like a new guide');
        assert.ok(guide.subtitle.includes(game.call('temaHeading', tema.id)), tema.id + ' subtitle');
        checkGuide(guide, [tema.campo]);
        for (const section of guide.sections) for (const item of section.items) assert.equal(item.tema, tema.id);
        const count = (type) => guide.sections.filter(s => s.type === type).reduce((n, s) => n + s.items.length, 0);
        assert.equal(count('choice'), tema.choice.length, tema.id + ' choice');
        assert.equal(count('truefalse'), tema.truefalse.length, tema.id + ' truefalse');
        assert.equal(count('match'), tema.pairs.length, tema.id + ' match');
        assert.equal(count('bank'), tema.bank.length, tema.id + ' bank');
        assert.equal(count('open'), tema.open.length, tema.id + ' open');
        const sets = CLASIFICA.filter(set => set.tema === tema.id);
        assert.equal(count('classify'), sets.reduce((n, set) => n + set.items.length, 0), tema.id + ' classify');
        assert.deepEqual([...new Set(guide.sections.map(s => s.type))], TYPES, tema.id + ' every type, in order');
        // Sections are numbered 1, 2, 3…
        guide.sections.forEach((s, i) => assert.ok(s.title.startsWith((i + 1) + '. '), s.title));
    }
});

test('an unknown topic is an error in Spanish', () => {
    assert.throws(() => game.call('buildTemaGuide', 'nada'), /Ese tema no existe/);
});

test('a guide without campos is an error in Spanish', () => {
    assert.throws(() => game.call('generateCamposGuide', { campos: [] }), /Elige al menos un campo/);
});
