// Shared parts of the game in Spanish for campos/Guia5.html (GAMES-17, FR-008).
// The English page must keep producing exactly the same texts.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createGameContext, ENGLISH_DIR } from './helpers/game-context.mjs';

const game = createGameContext({ seed: 3 });
const plain = (value) => game.toPlain(value);
const state = (s) => Object.assign({ temperature: null, place: null, test: false }, s);

test('pageLang is English outside a Spanish page (Node, QuizA.html)', () => {
    assert.equal(game.call('pageLang'), 'en');
    const quiz = fs.readFileSync(path.join(ENGLISH_DIR, 'QuizA.html'), 'utf8');
    const campos = fs.readFileSync(path.join(ENGLISH_DIR, 'campos', 'Guia5.html'), 'utf8');
    assert.match(quiz, /<html lang="en">/);
    assert.match(campos, /<html lang="es">/);
    // lang.js goes first in both pages
    assert.match(quiz, /<script src="js\/lang\.js\?v=\w+"><\/script>\s*<script src="js\/api\.js/);
    assert.match(campos, /<script src="\.\.\/js\/lang\.js\?v=\w+"><\/script>\s*<script src="\.\.\/js\/api\.js/);
});

test('the environment summary in Spanish (GAMES-15)', () => {
    const es = (s) => game.call('environmentSummary', state(s), 'es');
    assert.equal(es({ period: 'night', weather: 'rain', season: 'autumn', temperature: 17, place: 'Ciudad de México' }),
        '🌙 Noche · 🌧 Lluvia, 17 °C en Ciudad de México · 🍂 Otoño');
    assert.equal(es({ period: 'day', weather: 'clear', season: 'summer', temperature: 30, place: 'where you are' }),
        '☀️ Mañana · ☀️ Soleado, 30 °C donde estás · 🌻 Verano');
    assert.match(es({ period: 'night', weather: 'clear', season: 'spring' }), /🌙 Cielo despejado/);
    assert.equal(es({ period: 'afternoon', weather: null, season: 'winter' }), '🌇 Tarde · ⛄ Invierno');
    assert.equal(es({ period: 'night', weather: 'storm', season: 'winter', test: true }), '🌙 Noche · ⛈ Tormenta · ⛄ Invierno · 🧪 modo de prueba');
    // English by default, as before
    assert.equal(game.call('environmentSummary', state({ period: 'afternoon', weather: null, season: 'winter' })), '🌇 Afternoon · ⛄ Winter');
    const texts = plain(game.run('ENV_TEXT'));
    assert.deepEqual(Object.keys(texts.es).sort(), Object.keys(texts.en).sort());
});

test('the holiday greeting in Spanish (GAMES-16)', () => {
    assert.equal(game.call('holidayGreeting', ['halloween', 'muertos'], 'es'), '🎃💀 ¡Feliz Halloween y feliz Día de Muertos! ¡Vamos a estudiar con alegría!');
    assert.equal(game.call('holidayGreeting', ['posadas', 'christmas'], 'es'), '🪅🎄 ¡Felices posadas y feliz Navidad! ¡Vamos a estudiar con alegría!');
    for (const h of plain(game.run('HOLIDAYS.map(h => ({ id: h.id, wishEs: h.wishEs }))'))) assert.match(h.wishEs, /^(Feliz|Felices) /, h.id);
    assert.match(game.call('holidayGreeting', ['halloween']), /^🎃 Happy Halloween! Look at the holiday words/);
    assert.equal(game.call('holidayGreeting', [], 'es'), '');
});

test('the accessories, seasons and pets have Spanish names (GAMES-9, GAMES-14)', () => {
    for (const a of plain(game.run('PET_ACCESSORIES.map(a => ({ id: a.id, name: a.name, es: a.es }))'))) {
        assert.ok(a.es && a.es !== a.name && /^[A-ZÁÉÍÓÚÑ¡]/.test(a.es), a.id + ': ' + a.es);
        assert.equal(game.call('accessoryName', { name: a.name, es: a.es }, 'es'), a.es);
        assert.equal(game.call('accessoryName', { name: a.name, es: a.es }), a.name);
    }
    for (const [id, season] of Object.entries(plain(game.run('SEASONS')))) assert.ok(season.labelEs, id);
    for (const kind of ['cat', 'dog']) {
        const pet = plain(game.run('PETS.' + kind));
        assert.ok(pet.nameEs && pet.phrasesEs.length === pet.phrases.length, kind);
    }
    // The screen texts of My Pets, in both languages with the same keys
    game.run(fs.readFileSync(path.join(ENGLISH_DIR, 'js', 'my-pets.js'), 'utf8'));
    const texts = plain(game.run('MY_PETS_TEXT'));
    assert.deepEqual(Object.keys(texts.es).sort(), Object.keys(texts.en).sort());
});

test('isDemoGuide knows the English demos and the guides marked as demo', () => {
    assert.equal(game.call('isDemoGuide', game.run('DEMO_GUIDES.gvs')), true);
    assert.equal(game.call('isDemoGuide', { demo: true, sections: [] }), true);
    assert.equal(game.call('isDemoGuide', { title: 'x', sections: [] }), false);
    assert.equal(game.call('isDemoGuide', null), false);
});

test('the voice speaks English by default (GAMES-11)', () => {
    assert.equal(game.run('Speech.lang'), 'en-US');
});
