// Guía 5.º Campos formativos (GAMES-17): printed sheet, answer key and study cards
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCamposContext } from './helpers/campos-context.mjs';

const game = createCamposContext({ seed: 7 });
const plain = (value) => game.toPlain(value);
const demo = plain(game.call('buildCamposDemo'));
const student = game.call('buildCamposPrintHtml', demo, 'student');
const key = game.call('buildCamposPrintHtml', demo, 'key');
const textOf = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ');

test('the header is in Spanish and always blank, like the printed guides (FR-007)', () => {
    for (const label of ['Nombre', 'Grupo', 'N.L.', 'Fecha', 'Promedio', 'Maestra/o']) {
        assert.ok(student.includes('<b>' + label + ':</b>'), label);
    }
    assert.ok(student.includes(demo.title) && student.includes(demo.subtitle));
    assert.ok(key.includes('CLAVE DE RESPUESTAS'));
    assert.ok(!student.includes('CLAVE DE RESPUESTAS'));
});

test('the student sheet has no answers; the key has every answer and the model answers', () => {
    assert.ok(!student.includes('class="key"'), 'no answers on the student sheet');
    for (const section of demo.sections) {
        assert.ok(student.includes(section.title), section.type + ' title');
        for (const item of section.items) {
            const plainKey = textOf(key);
            const answer = section.type === 'classify' ? section.categories[item.answer]
                : section.type === 'open' ? item.model
                : ['choice', 'truefalse'].includes(section.type) ? item.options[item.answer]
                : item.answers[0];
            assert.ok(plainKey.includes(textOf(answer).trim()), section.type + ': ' + answer);
        }
    }
    // Open answers: lines to write on the sheet; the model answer in the key
    assert.ok(student.includes('write-line'));
    assert.ok(textOf(key).includes('Respuesta modelo'));
});

test('every section keeps its title with its first block on paper (GAMES-10)', () => {
    const sections = student.split('<section class="print-section').length - 1;
    assert.equal(sections, demo.sections.length);
    assert.equal((student.match(/<div class="print-keep">/g) || []).length, demo.sections.length);
});

test('unknown print versions are an error', () => {
    assert.throws(() => game.call('buildCamposPrintHtml', demo, 'other'), /Unknown print version/);
});

test('study cards: one per chosen topic, in 1 or 2 columns, with their summary (US3)', () => {
    const temas = plain(game.run('TEMAS'));
    const ids = ['sustantivos', temas[8].id, temas[20].id];
    const two = game.call('buildStudyCardsPrintHtml', ids, 2);
    assert.equal((two.match(/<div class="print-card">/g) || []).length, 3);
    assert.ok(!two.includes('one-column'));
    assert.ok(game.call('buildStudyCardsPrintHtml', ids, 1).includes('print-cards one-column'));
    for (const id of ids) {
        const tema = temas.find(t => t.id === id);
        assert.ok(two.includes(tema.title), tema.title);
        assert.ok(textOf(two).includes(textOf(tema.card.points[0]).trim().slice(0, 30)), tema.title + ' summary');
    }
    assert.throws(() => game.call('buildStudyCardsPrintHtml', ids, 3), /1 o 2/);
});
