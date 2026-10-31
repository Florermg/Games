// PC, phones and iPad (FR-030a, FR-039).
// The "todo" tests describe known touch-screen gaps: they run and are reported,
// but do not fail `npm test` until GAMES-2 fixes them and removes the todo mark.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ENGLISH_DIR } from './helpers/game-context.mjs';

const html = fs.readFileSync(path.join(ENGLISH_DIR, 'Ingles.html'), 'utf8');
const css = fs.readFileSync(path.join(ENGLISH_DIR, 'css', 'quiz.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

// Innermost CSS rules (also the ones inside @media), as { selectors: string[], declarations: {} }
const rules = Array.from(css.matchAll(/([^{}]+)\{([^{}]*)\}/g)).map(([, selectorText, body]) => ({
    selectors: selectorText.split(',').map(s => s.trim()).filter(Boolean),
    declarations: Object.fromEntries(body.split(';').map(d => d.split(':')).filter(p => p.length >= 2)
        .map(([property, ...value]) => [property.trim(), value.join(':').trim()]))
}));

const BASE_FONT_PX = 16;
function toPx(value) {
    const match = /^([\d.]+)(px|em|rem)$/.exec(value || '');
    if (!match) return null;
    return match[2] === 'px' ? Number(match[1]) : Number(match[1]) * BASE_FONT_PX;
}

test('Ingles.html adapts to the device width (FR-030a)', () => {
    assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/);
});

test('form controls use a font of at least 16px, so iPhone/iPad Safari does not zoom in', { todo: 'GAMES-2' }, () => {
    const formRules = rules.filter(rule => rule.selectors.some(s => /\b(input|select|textarea)\b/.test(s)) && rule.declarations['font-size']);
    assert.ok(formRules.length > 0);
    for (const rule of formRules) {
        const px = toPx(rule.declarations['font-size']);
        assert.ok(px !== null && px >= 16, `${rule.selectors.join(', ')} has font-size ${rule.declarations['font-size']}`);
    }
});

test('touch controls are at least 44px tall', { todo: 'GAMES-2' }, () => {
    const controls = ['.option', '.small-btn', '.speak-btn', 'select', 'input[type="text"]', '.chip input'];
    for (const control of controls) {
        const heights = rules
            .filter(rule => rule.selectors.includes(control))
            .map(rule => toPx(rule.declarations['min-height'] || rule.declarations['height']))
            .filter(px => px !== null);
        assert.ok(heights.some(px => px >= 44), `${control} declares no height of at least 44px`);
    }
});
