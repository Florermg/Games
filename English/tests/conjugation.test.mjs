// Verb tenses in English and Spanish (GAMES-6, FR-003, FR-005, FR-006, SC-002, SC-003)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext();
const TENSE_IDS = ['presentSimple', 'presentContinuous', 'presentPerfect', 'presentPerfectContinuous', 'pastSimple',
    'pastContinuous', 'pastPerfect', 'futureWill', 'futureGoingTo', 'futureContinuous'];

const findVerb = (base) => game.run('VERBS').find(v => v.base === base);
const conjugate = (verb, tenseId) => game.toPlain(game.call('conjugate', verb, tenseId));

// Hand-reviewed table (SC-002): base, 3rd person, -ing, past, participle | Spanish: infinitive, present, preterite, future, gerund, participle
const REVIEWED = [
    ['eat', 'eats', 'eating', 'ate', 'eaten', 'comer', 'come', 'comió', 'comerá', 'comiendo', 'comido'],
    ['go', 'goes', 'going', 'went', 'gone', 'ir', 'va', 'fue', 'irá', 'yendo', 'ido'],
    ['be', 'is', 'being', 'was', 'been', 'ser', 'es', 'fue', 'será', 'siendo', 'sido'],
    ['have', 'has', 'having', 'had', 'had', 'tener', 'tiene', 'tuvo', 'tendrá', 'teniendo', 'tenido'],
    ['do', 'does', 'doing', 'did', 'done', 'hacer', 'hace', 'hizo', 'hará', 'haciendo', 'hecho'],
    ['study', 'studies', 'studying', 'studied', 'studied', 'estudiar', 'estudia', 'estudió', 'estudiará', 'estudiando', 'estudiado'],
    ['stop', 'stops', 'stopping', 'stopped', 'stopped', 'parar', 'para', 'paró', 'parará', 'parando', 'parado'],
    ['play', 'plays', 'playing', 'played', 'played', 'jugar', 'juega', 'jugó', 'jugará', 'jugando', 'jugado'],
    ['make', 'makes', 'making', 'made', 'made', 'hacer', 'hace', 'hizo', 'hará', 'haciendo', 'hecho'],
    ['write', 'writes', 'writing', 'wrote', 'written', 'escribir', 'escribe', 'escribió', 'escribirá', 'escribiendo', 'escrito'],
    ['swim', 'swims', 'swimming', 'swam', 'swum', 'nadar', 'nada', 'nadó', 'nadará', 'nadando', 'nadado'],
    ['run', 'runs', 'running', 'ran', 'run', 'correr', 'corre', 'corrió', 'correrá', 'corriendo', 'corrido'],
    ['lie', 'lies', 'lying', 'lied', 'lied', 'mentir', 'miente', 'mintió', 'mentirá', 'mintiendo', 'mentido'],
    ['dance', 'dances', 'dancing', 'danced', 'danced', 'bailar', 'baila', 'bailó', 'bailará', 'bailando', 'bailado'],
    ['watch', 'watches', 'watching', 'watched', 'watched', 'mirar', 'mira', 'miró', 'mirará', 'mirando', 'mirado'],
    ['fix', 'fixes', 'fixing', 'fixed', 'fixed', 'arreglar', 'arregla', 'arregló', 'arreglará', 'arreglando', 'arreglado'],
    ['try', 'tries', 'trying', 'tried', 'tried', 'intentar', 'intenta', 'intentó', 'intentará', 'intentando', 'intentado'],
    ['cry', 'cries', 'crying', 'cried', 'cried', 'llorar', 'llora', 'lloró', 'llorará', 'llorando', 'llorado'],
    ['wake up', 'wakes up', 'waking up', 'woke up', 'woken up', 'despertarse', 'despierta', 'despertó', 'despertará', 'despertando', 'despertado'],
    ['get up', 'gets up', 'getting up', 'got up', 'gotten up', 'levantarse', 'levanta', 'levantó', 'levantará', 'levantando', 'levantado'],
    ['know', 'knows', 'knowing', 'knew', 'known', 'saber', 'sabe', 'supo', 'sabrá', 'sabiendo', 'sabido'],
    ['want', 'wants', 'wanting', 'wanted', 'wanted', 'querer', 'quiere', 'quiso', 'querrá', 'queriendo', 'querido'],
    ['see', 'sees', 'seeing', 'saw', 'seen', 'ver', 've', 'vio', 'verá', 'viendo', 'visto'],
    ['read', 'reads', 'reading', 'read', 'read', 'leer', 'lee', 'leyó', 'leerá', 'leyendo', 'leído'],
    ['put', 'puts', 'putting', 'put', 'put', 'poner', 'pone', 'puso', 'pondrá', 'poniendo', 'puesto'],
    ['buy', 'buys', 'buying', 'bought', 'bought', 'comprar', 'compra', 'compró', 'comprará', 'comprando', 'comprado'],
    ['teach', 'teaches', 'teaching', 'taught', 'taught', 'enseñar', 'enseña', 'enseñó', 'enseñará', 'enseñando', 'enseñado'],
    ['sleep', 'sleeps', 'sleeping', 'slept', 'slept', 'dormir', 'duerme', 'durmió', 'dormirá', 'durmiendo', 'dormido'],
    ['open', 'opens', 'opening', 'opened', 'opened', 'abrir', 'abre', 'abrió', 'abrirá', 'abriendo', 'abierto'],
    ['travel', 'travels', 'traveling', 'traveled', 'traveled', 'viajar', 'viaja', 'viajó', 'viajará', 'viajando', 'viajado']
];

// Expected English form of each tense, built from the 4 reviewed forms
function expectedEnglish(base, s3, ing, past, participle, tenseId) {
    const beIng = 'being';
    return {
        presentSimple: s3,
        presentContinuous: 'is ' + ing,
        presentPerfect: 'has ' + participle,
        presentPerfectContinuous: 'has been ' + ing,
        pastSimple: past,
        pastContinuous: 'was ' + ing,
        pastPerfect: 'had ' + participle,
        futureWill: 'will ' + base,
        futureGoingTo: 'is going to ' + base,
        futureContinuous: 'will be ' + ing
    }[tenseId];
}

test('there are 10 tenses in the fixed order of FR-003', () => {
    assert.deepEqual(game.toPlain(game.run('TENSES')).map(t => t.id), TENSE_IDS);
});

test('the tenses marked by default depend on the grade (SC-003)', () => {
    const ids = (grade) => game.toPlain(game.call('tensesForGrade', grade)).map(t => t.id);
    assert.deepEqual(ids(3), ['presentSimple', 'presentContinuous', 'pastSimple']);
    assert.deepEqual(ids(4), ['presentSimple', 'presentContinuous', 'pastSimple', 'futureWill', 'futureGoingTo']);
    assert.deepEqual(ids(5), ['presentSimple', 'presentContinuous', 'presentPerfect', 'pastSimple', 'pastContinuous', 'futureWill', 'futureGoingTo']);
    assert.deepEqual(ids(6), TENSE_IDS);
});

for (const row of REVIEWED) {
    const [base, s3, ing, past, participle, esInfinitive, esPresent, esPreterite, esFuture, esGerund, esParticiple] = row;
    test(`reviewed verb "${base}": English forms in the 10 tenses and Spanish base forms`, () => {
        const verb = findVerb(base);
        assert.ok(verb, base + ' is in the list');
        assert.ok(verb.es.includes(esInfinitive), base + ' translates to ' + esInfinitive);
        for (const tenseId of TENSE_IDS) {
            assert.equal(conjugate(verb, tenseId).formEn, expectedEnglish(base, s3, ing, past, participle, tenseId), base + ' ' + tenseId);
        }
        const forms = { infinitive: esInfinitive, present: esPresent, preterite: esPreterite, future: esFuture, gerund: esGerund, participle: esParticiple };
        for (const [kind, expected] of Object.entries(forms)) {
            assert.equal(game.call('spanishForm', verb, kind, esInfinitive), expected, base + ' es ' + kind);
        }
    });
}

test('the list has at least 200 reviewed verbs with unique bases and translations', () => {
    const verbs = game.toPlain(game.run('VERBS'));
    assert.ok(verbs.length >= 200, 'verbs: ' + verbs.length);
    assert.equal(new Set(verbs.map(v => v.base)).size, verbs.length);
    for (const verb of verbs) {
        assert.match(verb.base, /^[a-z]+( [a-z]+)?$/, verb.base);
        assert.ok(verb.es.length > 0 && verb.es.every(es => /^[a-záéíóúñü]*(ar|er|ir|ír)(se)?$/.test(es)), verb.base + ': ' + verb.es);
        assert.equal(verb.reviewed, true);
    }
});

test('every verb of the list is conjugated in the 10 tenses with no invented forms', () => {
    const verbs = game.run('VERBS');
    for (const verb of verbs) {
        for (const tenseId of TENSE_IDS) {
            const result = conjugate(verb, tenseId);
            assert.ok(result.formEn && result.exampleEn && result.exampleEs, verb.base + ' ' + tenseId);
            assert.doesNotMatch(result.formEn, /\b(goed|eated|runned|swimmed|maked|taked|writed|buyed|teached|sleeped|seed|knowed|bringed|thinked|catched|drived|eatted|haved|doed)\b/, verb.base);
            assert.doesNotMatch(result.exampleEs, /undefined|null|\s{2,}/, verb.base);
        }
    }
});

test('examples use "She" / "Ella", the complement and the time expression of the tense', () => {
    const eat = findVerb('eat');
    const past = conjugate(eat, 'pastSimple');
    assert.equal(past.exampleEn, 'She ate an apple yesterday.');
    assert.equal(past.exampleEs, 'Ella comió una manzana ayer.');
    const perfect = conjugate(eat, 'presentPerfect');
    assert.equal(perfect.exampleEn, 'She has already eaten an apple.');
    assert.equal(perfect.exampleEs, 'Ella ya ha comido una manzana.');
    assert.equal(conjugate(eat, 'futureGoingTo').exampleEs, 'Ella va a comer una manzana la próxima semana.');
    assert.equal(conjugate(eat, 'presentContinuous').exampleEs, 'Ella está comiendo una manzana ahora.');
    for (const tenseId of TENSE_IDS) {
        const result = conjugate(eat, tenseId);
        assert.match(result.exampleEn, /^She .+\.$/);
        assert.match(result.exampleEs, /^Ella .+\.$/);
    }
});

test('reflexive Spanish verbs keep "se" before the verb', () => {
    const wake = findVerb('wake up');
    assert.match(conjugate(wake, 'pastSimple').exampleEs, /^Ella se despertó /);
    assert.match(conjugate(wake, 'presentContinuous').exampleEs, /^Ella se está despertando /);
    assert.match(conjugate(wake, 'futureGoingTo').exampleEs, /^Ella se va a despertar /);
    assert.match(conjugate(wake, 'pastSimple').exampleEn, /^She woke up /);
});

// Found in the manual review of the generated examples (T008–T010)
test('"irse" is reflexive too: "Ella se fue de la casa"', () => {
    const leave = findVerb('leave');
    assert.equal(conjugate(leave, 'pastSimple').exampleEs, 'Ella se fue de la casa ayer.');
    assert.equal(conjugate(leave, 'presentSimple').exampleEs, 'Ella se va de la casa todos los días.');
    assert.equal(conjugate(leave, 'presentPerfect').exampleEs, 'Ella ya se ha ido de la casa.');
});

test('stative verbs keep only the time expressions a past action needs', () => {
    const love = findVerb('love');
    assert.equal(conjugate(love, 'pastSimple').exampleEn, 'She loved animals.');
    assert.equal(conjugate(love, 'futureWill').exampleEn, 'She will love animals.');
    assert.match(conjugate(love, 'pastContinuous').exampleEn, /when I called\.$/);
});

test('Spanish examples never use a present subjunctive with a past verb', () => {
    for (const verb of game.run('VERBS')) {
        assert.doesNotMatch(game.call('conjugate', verb, 'pastSimple').exampleEs, / que [a-z]+e (ayer|antes)/, verb.base);
    }
});

test('verbs rarely used in continuous tenses carry a note', () => {
    const know = findVerb('know');
    assert.ok(conjugate(know, 'presentContinuous').note);
    assert.ok(!conjugate(know, 'presentSimple').note);
    assert.ok(!conjugate(findVerb('eat'), 'presentContinuous').note);
});

test('an unknown verb is conjugated with the regular rules', () => {
    const verb = { base: 'whisper', es: ['susurrar'], objEn: '', objEs: '', reviewed: false };
    assert.equal(conjugate(verb, 'pastSimple').formEn, 'whispered');
    assert.equal(conjugate(verb, 'presentContinuous').formEn, 'is whispering');
    assert.equal(conjugate(verb, 'pastSimple').exampleEs, null, 'not reviewed: no conjugated Spanish example');
});
