// Pets: a black kitten and a German shepherd puppy, always on screen (GAMES-9)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createGameContext, ENGLISH_DIR } from './helpers/game-context.mjs';

const game = createGameContext();
const css = fs.readFileSync(path.join(ENGLISH_DIR, 'css', 'quiz.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const html = fs.readFileSync(path.join(ENGLISH_DIR, 'QuizA.html'), 'utf8');

// The body of the first rule for a selector inside a block of CSS
function ruleBody(block, selector) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = new RegExp('(^|[},\\s])' + escaped + '\\s*(,[^{]*)?\\{([^}]*)\\}').exec(block);
    return match ? match[3] : null;
}
function mediaBlock(query) {
    const start = css.indexOf('@media ' + query);
    assert.ok(start >= 0, 'no @media ' + query);
    let depth = 0, i = css.indexOf('{', start);
    const from = i;
    for (; i < css.length; i++) {
        if (css[i] === '{') depth++;
        if (css[i] === '}' && --depth === 0) break;
    }
    return css.slice(from + 1, i);
}

// ---------- US1: drawing, position and hiding ----------

test('each pet is an inline SVG with a 3D look: radial gradients with its own ids, eyelids and tail (FR-001, FR-002)', () => {
    const ids = new Set();
    for (const kind of ['cat', 'dog']) {
        const svg = game.call('petSvg', kind);
        assert.match(svg, /^<svg[^>]*viewBox="0 0 120 120"/, kind);
        assert.ok((svg.match(/<radialGradient/g) || []).length >= 2, kind + ' needs radial gradients for the volume');
        assert.match(svg, /class="pet-eyelids"/, kind);
        assert.match(svg, /class="pet-tail"/, kind);
        assert.ok(!/(href|src)="(https?:|\/\/)/.test(svg), kind + ' must not load anything');
        for (const [, id] of svg.matchAll(/id="([^"]+)"/g)) {
            assert.ok(id.startsWith('pet-' + kind + '-'), kind + ': id without prefix: ' + id);
            assert.ok(!ids.has(id), 'repeated id ' + id);
            ids.add(id);
        }
    }
    assert.throws(() => game.call('petSvg', 'bird'));
});

test('the pets live outside the sheet and are fixed to the window (FR-004)', () => {
    assert.match(html, /<div id="pets" data-cat-image="[^"]*" data-dog-image="[^"]*"><\/div>/);
    const sheetEnd = html.indexOf('<div id="print-area"');
    assert.ok(html.indexOf('<div id="pets"') > sheetEnd, '#pets is not inside the sheet');
    assert.match(ruleBody(css, '#pets') || '', /position:\s*fixed/);
    assert.match(ruleBody(css, '#pets-toggle') || '', /position:\s*fixed/);
});

test('the pets are never printed (FR-007)', () => {
    const print = [...css.matchAll(/@media print\s*\{/g)].map(m => mediaBlock('print')).join('');
    const all = css.split('@media print').slice(1).join(' ');
    assert.match(all, /#pets[^{]*\{[^}]*display:\s*none\s*!important/);
    assert.match(all, /#pets-toggle[^{]*\{[^}]*display:\s*none\s*!important|#pets,\s*#pets-toggle\s*\{[^}]*display:\s*none\s*!important/);
    assert.ok(print.length > 0);
});

test('reduce motion turns the animations off, and pets-hidden hides them (FR-003, FR-006a)', () => {
    const reduced = mediaBlock('(prefers-reduced-motion: reduce)');
    assert.match(reduced, /animation:\s*none/);
    assert.match(css, /body\.pets-hidden\s+\.pet\s*\{[^}]*display:\s*none/);
});

// ---------- US2: touching the pets ----------

test('each pet has an accessible name and at least 4 phrases suitable for kids (FR-005, FR-006)', () => {
    const pets = game.toPlain(game.run('PETS'));
    assert.deepEqual(Object.keys(pets), ['cat', 'dog']);
    assert.equal(pets.cat.name, 'Black kitten');
    assert.equal(pets.dog.name, 'German shepherd puppy');
    const unsafe = game.run('UNSAFE');
    for (const kind of ['cat', 'dog']) {
        assert.ok(pets[kind].phrases.length >= 4, kind);
        assert.equal(new Set(pets[kind].phrases).size, pets[kind].phrases.length, kind + ' repeats a phrase');
        for (const phrase of pets[kind].phrases) {
            assert.ok(!unsafe.test(phrase), phrase);
            assert.ok(phrase.length <= 60 && /[.!]$/.test(phrase), phrase);
        }
    }
});

test('nextPetPhrase goes around the phrases in order, for each pet on its own', () => {
    const fresh = createGameContext();
    const cat = fresh.toPlain(fresh.run('PETS')).cat.phrases;
    const said = Array.from({ length: cat.length + 1 }, () => fresh.call('nextPetPhrase', 'cat'));
    assert.deepEqual(said.slice(0, cat.length), cat);
    assert.equal(said[cat.length], cat[0], 'starts again');
    assert.equal(fresh.call('nextPetPhrase', 'dog'), fresh.toPlain(fresh.run('PETS')).dog.phrases[0]);
});

test('touching a pet makes it jump, with no sound (FR-005)', () => {
    assert.match(css, /\.pet\.jump\s*\{[^}]*animation:\s*pet-jump/);
    assert.match(css, /@keyframes pet-jump/);
    const source = fs.readFileSync(path.join(ENGLISH_DIR, 'js', 'pets.js'), 'utf8');
    assert.ok(!/speechSynthesis|new Audio|AudioContext/.test(source), 'the pets must be silent');
});

// ---------- US3: own images ----------

test('petImageHtml shows the own image with its path escaped', () => {
    const img = game.call('petImageHtml', 'cat', 'img/pet-cat.png?v=1a2b3c4d');
    assert.match(img, /^<img class="pet-image" alt="" src="img\/pet-cat\.png\?v=1a2b3c4d"/);
    const tricky = game.call('petImageHtml', 'dog', 'img/x.png" onerror="alert(1)');
    assert.ok(!tricky.includes('" onerror="alert'), tricky);
});

// ---------- The strip on phones is solid (GAMES-10) ----------

test('on narrow screens the pets strip is solid and the hide button is compact, with its accessible name (FR-005)', () => {
    const narrow = mediaBlock('(max-width: 1159.98px)');
    const strip = ruleBody(narrow, '#pets') || '';
    assert.match(strip, /background:\s*#[0-9a-f]{6}\s*;/i, 'solid background color');
    assert.ok(!/gradient|rgba\([^)]*,\s*0\)|transparent/.test(strip), 'no transparent part: ' + strip);
    assert.match(ruleBody(narrow, '.pets-toggle-text') || '', /display:\s*none/);
    const source = fs.readFileSync(path.join(ENGLISH_DIR, 'js', 'pets.js'), 'utf8');
    assert.match(source, /pets-toggle-text/);
    assert.match(source, /setAttribute\("aria-label", hidden \? "Show pets" : "Hide pets"\)/);
});
