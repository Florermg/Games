// Main page to choose the subject (GAMES-18): QuizA.html, Ingles.html and campos/Guia5.html
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createGameContext, ENGLISH_DIR } from './helpers/game-context.mjs';

const read = (file) => fs.readFileSync(path.join(ENGLISH_DIR, file), 'utf8');
const hub = read('QuizA.html');
const english = read('Ingles.html');
const campos = read('campos/Guia5.html');
const game = createGameContext({ seed: 4 });
const plain = (value) => game.toPlain(value);

test('QuizA.html is the main page: English by default, with the language choice, name and city (FR-001, FR-002)', () => {
    assert.match(hub, /<html lang="en" data-lang-choice>/);
    assert.match(hub, /id="student-name"/);
    assert.match(hub, /<select id="env-city"><\/select>/);
    assert.match(hub, /data-lang="en"/);
    assert.match(hub, /data-lang="es"/);
    assert.match(hub, /id="hub-summary"/);
    // The language is applied by lang.js, the first script
    assert.match(hub, /<script src="js\/lang\.js\?v=\w+"><\/script>\s*<script src="js\/api\.js/);
    for (const file of ['progress.js', 'student.js', 'hub.js', 'environment.js', 'holidays.js', 'pets.js']) {
        assert.ok(hub.includes('src="js/' + file + '?v='), file);
    }
});

test('the subjects: English and campos open their pages; Math is coming soon (US1)', () => {
    assert.match(hub, /<a class="main-btn[^"]*" href="Ingles\.html"/);
    assert.match(hub, /<a class="main-btn[^"]*" href="campos\/Guia5\.html"/);
    assert.match(hub, /class="guide-card subject-card soon" aria-disabled="true"/);
    assert.ok(!/href="[^"]*mat/i.test(hub), 'Math has no link yet');
});

test('Ingles.html is the English game, with a link back to the main page (FR-001)', () => {
    assert.match(english, /<title>5th Grade Study Guides - Anime Edition<\/title>/);
    assert.match(english, /<a class="small-btn" href="QuizA\.html">⬅ All subjects<\/a>/);
    assert.match(campos, /<a class="small-btn" href="\.\.\/QuizA\.html">⬅ Materias<\/a>/);
    for (const page of [english, campos]) {
        assert.ok(/progress\.js\?v=/.test(page) && /student\.js\?v=/.test(page), 'progress.js and student.js');
    }
});

test('the shared files work on the main page, which has no My Pets screen', () => {
    assert.match(read('js/my-pets.js'), /const screen = document\.getElementById\("pets-screen"\);\s*if \(screen && /);
});

test('both guides keep their finished exams for the summary (FR-004)', () => {
    assert.match(read('js/engine.js'), /saveFinishedExam\(englishExamFromGuide\(currentGuide, /);
    assert.match(read('campos/js/campos-engine.js'), /saveFinishedExam\(camposExamFromGuide\(currentGuide, sectionStates, /);
});

test('the texts of the main page in English and Spanish have the same keys', () => {
    game.run(read('js/hub.js'));
    const texts = plain(game.run('HUB_TEXT'));
    assert.deepEqual(Object.keys(texts.es).sort(), Object.keys(texts.en).sort());
    for (const key of Object.keys(texts.en)) assert.ok(texts.en[key] && texts.es[key], key);
});

test('the name is saved once for every page (FR-003)', () => {
    game.run(read('js/student.js'));
    const data = {};
    const storage = { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } };
    assert.equal(game.call('loadStudentName', storage), '');
    assert.equal(game.call('saveStudentName', storage, 'Ana'), true);
    assert.equal(game.call('loadStudentName', storage), 'Ana');
    const blocked = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
    assert.equal(game.call('loadStudentName', blocked), '');
    assert.equal(game.call('saveStudentName', blocked, 'Ana'), false);
});

test('without the card of words, the English holiday greeting does not talk about it', () => {
    assert.equal(game.call('holidayGreeting', ['halloween'], 'en', false), "🎃 Happy Halloween! Let's have fun studying!");
    assert.match(game.call('holidayGreeting', ['halloween'], 'en'), /Look at the holiday words/);
});
