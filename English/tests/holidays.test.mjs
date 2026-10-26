// Holidays: decoration, greeting and English words for each celebration (GAMES-16)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext({ seed: 16 });
const plain = (value) => game.toPlain(value);
const at = (text) => new Date(text + 'T12:00:00');
const IDS = plain(game.run('HOLIDAYS.map(h => h.id)'));

// FR-001, written again here so the test does not trust the code
const FIXED = {
    newyear: [[12, 28], [1, 1]], reyes: [[1, 2], [1, 6]], valentine: [[2, 7], [2, 14]], flag: [[2, 17], [2, 24]],
    stpatrick: [[3, 10], [3, 17]], children: [[4, 23], [4, 30]], mothers: [[5, 3], [5, 10]], teachers: [[5, 11], [5, 15]],
    independence: [[9, 1], [9, 16]], halloween: [[10, 15], [10, 31]], muertos: [[10, 25], [11, 2]], revolution: [[11, 14], [11, 20]],
    posadas: [[12, 16], [12, 24]], christmas: [[12, 1], [12, 25]]
};
const EASTER = { 2025: [4, 20], 2026: [4, 5], 2027: [3, 28], 2028: [4, 16], 2029: [4, 1], 2030: [4, 21] };
const THANKSGIVING = { 2025: 27, 2026: 26, 2027: 25, 2028: 23, 2029: 22, 2030: 28 };

function expectedOn(date) {
    const year = date.getFullYear();
    const md = (date.getMonth() + 1) * 100 + date.getDate();
    const inside = ([from, to]) => {
        const a = from[0] * 100 + from[1], b = to[0] * 100 + to[1];
        return a <= b ? md >= a && md <= b : md >= a || md <= b;
    };
    const ids = Object.keys(FIXED).filter(id => inside(FIXED[id]));
    const day = (m, d) => new Date(year, m - 1, d, 12);
    const easter = day(...EASTER[year]);
    if (date >= new Date(easter.getTime() - 7 * 864e5 - 1) && date <= easter) ids.push('easter');
    const thanks = day(11, THANKSGIVING[year]);
    if (date >= new Date(thanks.getTime() - 6 * 864e5 - 1) && date <= thanks) ids.push('thanksgiving');
    return ids.sort();
}

// ---------- Dates (FR-001, FR-002, SC-001) ----------

test('there are the 16 holidays of the clarification 1c, with names and an emoji', () => {
    assert.deepEqual([...IDS].sort(), [...Object.keys(FIXED), 'easter', 'thanksgiving'].sort());
    for (const h of plain(game.run('HOLIDAYS.map(h => ({ id: h.id, name: h.name, nameEs: h.nameEs, emoji: h.emoji }))'))) {
        assert.ok(h.name.length > 3 && h.nameEs.length > 3 && h.emoji.length > 0, h.id);
    }
});

test('Easter and Thanksgiving are calculated for each year (research R1)', () => {
    for (const [year, md] of Object.entries(EASTER)) assert.deepEqual(plain(game.call('easterSunday', Number(year))), md, 'Easter ' + year);
    for (const [year, day] of Object.entries(THANKSGIVING)) assert.deepEqual(plain(game.call('thanksgivingDay', Number(year))), [11, day], 'Thanksgiving ' + year);
});

test('activeHolidays follows the table of FR-001 every day from 2025 to 2030 (SC-001)', () => {
    for (let year = 2025; year <= 2030; year++) {
        for (let day = 0; day < 366; day++) {
            const date = new Date(year, 0, 1 + day, 12);
            if (date.getFullYear() !== year) break;
            assert.deepEqual([...plain(game.call('activeHolidays', date))].sort(), expectedOn(date), date.toDateString());
        }
    }
});

test('mixed holidays are sorted by how near their main day is (FR-002)', () => {
    assert.deepEqual(plain(game.call('activeHolidays', at('2026-10-25'))), ['halloween', 'muertos']);
    assert.deepEqual(plain(game.call('activeHolidays', at('2026-11-01'))), ['muertos']);
    assert.deepEqual(plain(game.call('activeHolidays', at('2026-12-20'))), ['posadas', 'christmas']);
    assert.deepEqual(plain(game.call('activeHolidays', at('2026-11-20'))), ['revolution', 'thanksgiving']);
    assert.deepEqual(plain(game.call('activeHolidays', at('2026-12-31'))), ['newyear']);
    assert.deepEqual(plain(game.call('activeHolidays', at('2026-07-15'))), []);
});

// ---------- Test mode (FR-006) ----------

test('holidayOverrides reads ?festividad= in Spanish and English, several and none', () => {
    const read = (search) => plain(game.call('holidayOverrides', search));
    assert.equal(read(''), null);
    assert.equal(read('?ambiente=noche'), null);
    assert.deepEqual(read('?festividad=posadas'), ['posadas']);
    assert.deepEqual(read('?festividad=halloween,muertos'), ['halloween', 'muertos']);
    assert.deepEqual(read('?festividad=Navidad'), ['christmas']);
    assert.deepEqual(read('?festividad=a%C3%B1o%20nuevo'), ['newyear']);
    assert.deepEqual(read('?festividad=reyes,amor,bandera,sanpatricio,pascua,nino,madres,maestro'),
        ['reyes', 'valentine', 'flag', 'stpatrick', 'easter', 'children', 'mothers', 'teachers']);
    assert.deepEqual(read('?festividad=independencia,revolucion,acciondegracias,dayofthedead'), ['independence', 'revolution', 'thanksgiving', 'muertos']);
    assert.deepEqual(read('?festividad=ninguna'), []);
    assert.deepEqual(read('?festividad=none'), []);
    // Unknown names are ignored; with nothing valid, the real date is used
    assert.equal(read('?festividad=cumpleanos'), null);
    assert.deepEqual(read('?festividad=cumpleanos,posadas,posadas'), ['posadas']);
});

// ---------- Drawing (FR-003, SC-002) ----------

const ids1 = IDS.map(id => [id]);
const MIXES = [['halloween', 'muertos'], ['posadas', 'christmas'], ['revolution', 'thanksgiving'], ['easter', 'children'], ['easter', 'children', 'christmas']];

function checkSvg(svg, uid, name) {
    assert.match(svg, /^<svg [^>]*xmlns="http:\/\/www.w3.org\/2000\/svg"/, name);
    assert.ok(!/NaN|undefined/.test(svg), name);
    for (const id of svg.match(/id="[^"]+"/g) || []) assert.match(id, new RegExp('^id="hol-' + uid + '-'), name);
    assert.equal((svg.match(/<svg/g) || []).length, 1, name);
    assert.ok(svg.endsWith('</svg>'), name);
}

test('every holiday and every mix has a garland, window decoration and floaters (SC-002)', () => {
    for (const ids of [...ids1, ...MIXES]) {
        const name = ids.join('+');
        const garland = game.call('holidayGarlandSvg', ids, 'g');
        checkSvg(garland, 'g', name);
        assert.match(garland, /preserveAspectRatio="none"/, name);
        // Half of the garland for each of the first two (clarification 4a)
        for (const id of ids.slice(0, 2)) assert.ok(garland.includes('data-holiday="' + id + '"'), name + ' garland ' + id);
        const windowSvg = game.call('holidayWindowSvg', ids, 'w');
        checkSvg(windowSvg, 'w', name);
        assert.match(windowSvg, /viewBox="0 0 320 120"/, name);
        for (const id of ids) assert.ok(windowSvg.includes('class="hol-item" data-holiday="' + id + '"'), name + ' item ' + id);
        const floaters = game.call('holidayParticles', ids);
        assert.ok((floaters.match(/class="hol-p /g) || []).length >= 8, name);
    }
    assert.equal(game.call('holidayGarlandSvg', [], 'g'), '');
    assert.equal(game.call('holidayWindowSvg', [], 'w'), '');
    assert.equal(game.call('holidayParticles', []), '');
});

test('the drawings are the same every time (no Math.random)', () => {
    const ids = ['halloween', 'muertos'];
    assert.equal(game.call('holidayWindowSvg', ids, 'x'), game.call('holidayWindowSvg', ids, 'x'));
    assert.equal(game.call('holidayParticles', ids), game.call('holidayParticles', ids));
});

// ---------- Greeting and words (FR-003, FR-004, SC-003) ----------

test('every holiday has 8+ English words with emoji, Spanish meaning and an example with the word', () => {
    const all = plain(game.run('HOLIDAYS.map(h => ({ id: h.id, words: h.words }))'));
    for (const { id, words } of all) {
        assert.ok(words.length >= 8, id + ': ' + words.length + ' words');
        assert.equal(new Set(words.map(w => w.word.toLowerCase())).size, words.length, id + ' repeated word');
        for (const w of words) {
            assert.ok(w.emoji && w.word && w.es && w.example, id + ' ' + JSON.stringify(w));
            assert.match(w.word, /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]*$/, id + ' ' + w.word);
            assert.match(w.example, /^[A-Z].*[.!?]$/, id + ' ' + w.example);
            const head = w.word.toLowerCase().split(' ')[0].replace(/(e|y)$/, '');
            assert.ok(w.example.toLowerCase().includes(head), id + ': "' + w.example + '" uses "' + w.word + '"');
        }
    }
});

test('holidayGreeting names one or two holidays and invites to see the words (US2)', () => {
    const one = game.call('holidayGreeting', ['halloween']);
    assert.match(one, /Halloween/);
    assert.match(one, /words/i);
    const two = game.call('holidayGreeting', ['halloween', 'muertos']);
    assert.match(two, /Halloween/);
    assert.match(two, /Day of the Dead/);
    assert.equal(game.call('holidayGreeting', []), '');
});

test('holidayCardHtml shows the words of the chosen holiday, with a tab for each one (US3)', () => {
    const single = game.call('holidayCardHtml', ['posadas'], 'posadas');
    assert.ok(!single.includes('class="hol-tab'), 'no tabs with one holiday');
    const words = plain(game.run('HOLIDAY_BY_ID.posadas.words'));
    for (const w of words) assert.ok(single.includes(w.word) && single.includes(w.es), w.word);
    assert.equal((single.match(/class="hol-word"/g) || []).length, words.length);
    assert.match(single, /data-say="[^"]+"/);

    const mixed = game.call('holidayCardHtml', ['halloween', 'muertos'], 'muertos');
    assert.equal((mixed.match(/class="hol-tab[ "]/g) || []).length, 2);
    assert.match(mixed, /class="hol-tab selected" data-holiday="muertos"/);
    const dead = plain(game.run('HOLIDAY_BY_ID.muertos.words'));
    assert.ok(mixed.includes(dead[0].word));
    assert.equal(game.call('holidayCardHtml', [], null), '');
    // Text from the words is escaped
    assert.ok(!/<script/i.test(mixed));
});

test('the garland is drawn for the width of the sheet, so it is never stretched', () => {
    assert.match(game.call('holidayGarlandSvg', ['posadas'], 'g', 340), /viewBox="0 0 340 28"/);
    assert.match(game.call('holidayGarlandSvg', ['posadas'], 'g', 852.4), /viewBox="0 0 852 28"/);
    assert.match(game.call('holidayGarlandSvg', ['posadas'], 'g', 0), /viewBox="0 0 600 28"/);
    const narrow = game.call('holidayGarlandSvg', ['posadas'], 'g', 340);
    const wide = game.call('holidayGarlandSvg', ['posadas'], 'g', 852);
    assert.ok((wide.match(/<path/g) || []).length > (narrow.match(/<path/g) || []).length, 'more papel picado on a wide sheet');
});

test('holidays are not printed and stay still with reduced motion', async () => {
    const fs = await import('node:fs');
    const css = fs.readFileSync(new URL('../css/quiz.css', import.meta.url), 'utf8');
    assert.match(css, /@media print\s*\{\s*#holiday-scene,\s*\.holiday-garland\s*\{\s*display:\s*none !important;/);
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.hol-p\s*\{\s*animation: none;/);
});
