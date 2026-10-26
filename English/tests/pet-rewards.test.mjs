// Prizes: accessories for the kitten and the puppy, won with perfect generated guides (GAMES-14)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext({ seed: 21 });
const plain = (value) => game.toPlain(value);
const CATALOG = plain(game.run('PET_ACCESSORIES.map(a => ({ id: a.id, name: a.name, slot: a.slot, season: a.season }))'));
const SEASON_IDS = Object.keys(plain(game.run('SEASONS')));
const SLOTS = ['head', 'eyes', 'neck', 'body', 'feet'];
const OCT25 = '2026-10-25T12:00:00';

function memoryStorage() {
    const data = {};
    return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } };
}
const emptyStore = () => plain(game.call('loadPetRewards', memoryStorage())).store;
const guide = (title) => ({ kind: 'gvs', title, subtitle: '5th grade', sections: [{ type: 'choice', title: 'Choose', items: [{ q: title }] }] });

// ---------- Catalog (FR-003, FR-004) ----------

test('the catalog has 30+ accessories, 12+ of them from a season, with unique ids and every slot (FR-003, FR-004)', () => {
    assert.ok(CATALOG.length >= 30, CATALOG.length + ' accessories');
    assert.ok(CATALOG.filter(a => a.season).length >= 12);
    assert.equal(new Set(CATALOG.map(a => a.id)).size, CATALOG.length);
    for (const slot of SLOTS) assert.ok(CATALOG.some(a => a.slot === slot), slot);
    for (const a of CATALOG) {
        assert.ok(SLOTS.includes(a.slot), a.id);
        assert.ok(a.season === null || SEASON_IDS.includes(a.season), a.id + ' ' + a.season);
        assert.match(a.name, /^[A-Z][A-Za-z' -]+$/, a.id);
    }
    // The kinds the user asked for
    for (const word of ['collar', 'leash', 'hat', 'glasses', 'tie', 'shoes']) {
        assert.ok(CATALOG.some(a => a.name.toLowerCase().includes(word)), word);
    }
    for (const season of ['muertos', 'halloween']) assert.ok(CATALOG.filter(a => a.season === season).length >= 3, season);
});

test('every accessory draws on both pets, inside the body, without loading anything (SC-004)', () => {
    for (const a of CATALOG) {
        for (const kind of ['cat', 'dog']) {
            const svg = game.call('petSvg', kind, { [a.slot]: a.id }, 't');
            assert.ok(svg.includes('data-accessory="' + a.id + '"'), a.id + ' ' + kind);
            const body = svg.indexOf('class="pet-body"');
            assert.ok(body > 0 && svg.indexOf('data-accessory="' + a.id + '"') > body, a.id + ' must be inside .pet-body');
            assert.ok(!/(href|src)="(https?:|\/\/)/.test(svg), a.id);
            assert.equal((svg.match(/<svg/g) || []).length, 1, a.id);
        }
    }
});

// ---------- Seasons (research R2) ----------

test('the seasons of a date, including the ones that cross the new year', () => {
    const seasons = (date) => plain(game.call('activeSeasons', new Date(date))).sort();
    assert.deepEqual(seasons(OCT25), ['autumn', 'halloween', 'muertos']);
    assert.deepEqual(seasons('2026-11-02T12:00:00'), ['autumn', 'muertos']);
    assert.deepEqual(seasons('2026-12-25T12:00:00'), ['christmas', 'winter']);
    assert.deepEqual(seasons('2027-01-05T12:00:00'), ['christmas', 'winter']);
    assert.deepEqual(seasons('2027-02-14T12:00:00'), ['winter']);
    assert.deepEqual(seasons('2027-04-30T12:00:00'), ['spring']);
    assert.deepEqual(seasons('2027-07-15T12:00:00'), ['summer']);
    assert.deepEqual(seasons('2027-09-15T12:00:00'), ['independence', 'summer']);
    assert.deepEqual(seasons('2027-09-30T12:00:00'), ['autumn']);
});

test('only all-year accessories and the ones of today\'s seasons can be won', () => {
    const ids = plain(game.call('availableAccessories', new Date(OCT25))).map(a => a.id);
    for (const a of CATALOG) {
        const expected = a.season === null || ['autumn', 'halloween', 'muertos'].includes(a.season);
        assert.equal(ids.includes(a.id), expected, a.id);
    }
});

test('in 1,000 draws, an accessory of the season comes out about 3 times as often as an all-year one (SC-002)', () => {
    const counts = {};
    for (let i = 0; i < 6000; i++) {
        const a = plain(game.call('pickAccessory', [], new Date(OCT25)));
        counts[a.id] = (counts[a.id] || 0) + 1;
    }
    const mean = (list) => list.reduce((sum, a) => sum + (counts[a.id] || 0), 0) / list.length;
    const seasonal = CATALOG.filter(a => ['autumn', 'halloween', 'muertos'].includes(a.season));
    const allYear = CATALOG.filter(a => a.season === null);
    const ratio = mean(seasonal) / mean(allYear);
    assert.ok(ratio > 2.5 && ratio < 3.5, 'ratio ' + ratio.toFixed(2));
    assert.ok(CATALOG.filter(a => a.season === 'christmas').every(a => !counts[a.id]), 'no Christmas accessory in October');
});

test('the draw never gives an accessory the student has, and gives nothing when all are owned', () => {
    const available = plain(game.call('availableAccessories', new Date(OCT25))).map(a => a.id);
    const owned = available.slice(1);
    for (let i = 0; i < 50; i++) assert.equal(plain(game.call('pickAccessory', owned, new Date(OCT25))).id, available[0]);
    assert.equal(game.call('pickAccessory', available, new Date(OCT25)), null);
});

// ---------- Prize after a guide (FR-001, FR-002, SC-001) ----------

function award(store, name, g, score, max, isDemo, date) {
    return plain(game.call('awardForGuide', store, name, g, { score, max, isDemo, date: new Date(date || OCT25) }));
}

test('a perfect generated guide wins an accessory, saved for the student with its date (FR-001, FR-005)', () => {
    const store = emptyStore();
    const result = award(store, 'Ana', guide('Recycling'), 30, 30, false);
    assert.equal(result.status, 'won');
    assert.ok(CATALOG.some(a => a.id === result.accessory.id));
    const record = plain(game.call('studentRecord', store, 'Ana'));
    assert.deepEqual(record.owned.map(o => o.id), [result.accessory.id]);
    assert.match(record.owned[0].date, /^2026-10-25/);
    assert.equal(record.guides.length, 1);
});

test('demos, repeated guides and guides that are not perfect win nothing (FR-002, SC-001)', () => {
    const store = emptyStore();
    const g = guide('Space');
    assert.equal(award(store, 'Ana', g, 30, 30, true).status, 'demo');
    assert.equal(award(store, 'Ana', g, 29, 30, false).status, 'notPerfect');
    assert.equal(award(store, 'Ana', g, 29, 30, false).missing, 1);
    assert.equal(award(store, 'Ana', g, 0, 0, false).status, 'notPerfect');
    assert.equal(award(store, 'Ana', g, 30, 30, false).status, 'won');
    assert.equal(award(store, 'Ana', g, 30, 30, false).status, 'repeat');
    // The same guide is new for another student
    assert.equal(award(store, 'Luis', g, 30, 30, false).status, 'won');
    // Another guide is a new prize
    assert.equal(award(store, 'Ana', guide('Ocean'), 30, 30, false).status, 'won');
    assert.equal(plain(game.call('studentRecord', store, 'Ana')).owned.length, 2);
});

test('when every accessory of today is owned, a perfect guide says so', () => {
    const store = emptyStore();
    let result;
    for (let i = 0; i < 100; i++) {
        result = award(store, 'Ana', guide('Topic ' + i), 10, 10, false);
        if (result.status !== 'won') break;
    }
    assert.equal(result.status, 'complete');
    const available = plain(game.call('availableAccessories', new Date(OCT25)));
    assert.equal(plain(game.call('studentRecord', store, 'Ana')).owned.length, available.length);
});

test('the key of a guide is the same for the same guide and changes with its questions', () => {
    const a = guide('Recycling');
    assert.equal(game.call('guideKey', a), game.call('guideKey', JSON.parse(JSON.stringify(a))));
    const b = guide('Recycling');
    b.sections[0].items[0].q = 'Other question';
    assert.notEqual(game.call('guideKey', a), game.call('guideKey', b));
});

// ---------- Students and saving (FR-005, FR-008, SC-003) ----------

test('"Ana", " ana " and "ANA" are the same student; no name is "guest"', () => {
    assert.equal(game.call('studentKey', 'Ana'), 'ana');
    assert.equal(game.call('studentKey', '  ANA '), 'ana');
    assert.equal(game.call('studentKey', 'Ana  María'), 'ana maría');
    assert.equal(game.call('studentKey', ''), 'guest');
    assert.equal(game.call('studentKey', '   '), 'guest');
});

test('prizes and outfits are saved and loaded back (SC-003)', () => {
    const storage = memoryStorage();
    const store = plain(game.call('loadPetRewards', storage)).store;
    const won = award(store, 'Ana', guide('Food'), 5, 5, false).accessory;
    game.call('toggleAccessory', store, 'Ana', 'dog', won.id);
    assert.equal(game.call('savePetRewards', storage, store), true);
    const loaded = plain(game.call('loadPetRewards', storage));
    assert.equal(loaded.available, true);
    const record = plain(game.call('studentRecord', loaded.store, 'ana'));
    assert.deepEqual(record.owned.map(o => o.id), [won.id]);
    assert.equal(record.outfits.dog[won.slot], won.id);
    assert.deepEqual(record.outfits.cat, {});
});

test('a browser that does not let us save, and a broken record, still work (FR-008)', () => {
    const blocked = { getItem: () => { throw new Error('SecurityError'); }, setItem: () => { throw new Error('QuotaExceededError'); } };
    const loaded = plain(game.call('loadPetRewards', blocked));
    assert.equal(loaded.available, false);
    assert.deepEqual(loaded.store.students, {});
    assert.equal(game.call('savePetRewards', blocked, loaded.store), false);
    const storage = memoryStorage();
    storage.setItem('games-pets-v1', '{broken');
    assert.deepEqual(plain(game.call('loadPetRewards', storage)).store.students, {});
    // Unknown accessories and outfits of accessories that are not owned are dropped
    storage.setItem('games-pets-v1', JSON.stringify({ version: 1, students: { ana: { name: 'Ana', owned: [{ id: 'noSuchThing', date: OCT25 }, { id: CATALOG[0].id, date: OCT25 }], guides: [], outfits: { cat: { head: 'noSuchThing', [CATALOG[1].slot]: CATALOG[1].id }, dog: {} } } } }));
    const record = plain(game.call('studentRecord', plain(game.call('loadPetRewards', storage)).store, 'Ana'));
    assert.deepEqual(record.owned.map(o => o.id), [CATALOG[0].id]);
    assert.deepEqual(record.outfits.cat, {});
});

// ---------- Putting accessories on (FR-006, FR-007) ----------

test('putting on, changing and taking off accessories: one per slot, each pet its own outfit (FR-006)', () => {
    const store = emptyStore();
    const record = game.call('studentRecord', store, 'Ana');
    const hats = CATALOG.filter(a => a.slot === 'head').slice(0, 2);
    const glasses = CATALOG.find(a => a.slot === 'eyes');
    for (const a of hats.concat(glasses)) record.owned.push({ id: a.id, date: OCT25 });
    const outfit = (kind) => plain(game.call('studentRecord', store, 'Ana')).outfits[kind];

    game.call('toggleAccessory', store, 'Ana', 'cat', hats[0].id);
    game.call('toggleAccessory', store, 'Ana', 'cat', glasses.id);
    assert.deepEqual(outfit('cat'), { head: hats[0].id, eyes: glasses.id });
    game.call('toggleAccessory', store, 'Ana', 'cat', hats[1].id);
    assert.equal(outfit('cat').head, hats[1].id, 'a new hat replaces the old one');
    game.call('toggleAccessory', store, 'Ana', 'cat', hats[1].id);
    assert.equal(outfit('cat').head, undefined, 'touching it again takes it off');
    game.call('toggleAccessory', store, 'Ana', 'dog', glasses.id);
    assert.deepEqual(outfit('dog'), { eyes: glasses.id });
    assert.deepEqual(outfit('cat'), { eyes: glasses.id });
    game.call('takeEverythingOff', store, 'Ana', 'cat');
    assert.deepEqual(outfit('cat'), {});
    assert.deepEqual(outfit('dog'), { eyes: glasses.id });
    // An accessory that is not owned cannot be put on
    const notOwned = CATALOG.find(a => a.slot === 'feet');
    assert.equal(game.call('toggleAccessory', store, 'Ana', 'dog', notOwned.id), false);
    assert.equal(outfit('dog').feet, undefined);
});

test('the pet drawing has the outfit in a fixed order and its own ids (research R1)', () => {
    const pick = (slot) => CATALOG.find(a => a.slot === slot && a.season === null).id;
    const outfit = { head: pick('head'), eyes: pick('eyes'), neck: pick('neck'), body: pick('body'), feet: pick('feet') };
    const svg = game.call('petSvg', 'dog', outfit, 'big');
    const order = ['body', 'feet', 'neck', 'eyes', 'head'].map(slot => svg.indexOf('data-accessory="' + outfit[slot] + '"'));
    assert.deepEqual(order.slice().sort((a, b) => a - b), order);
    // Every id and every reference carries the suffix, so two drawings never share a gradient
    const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
    assert.ok(ids.length > 3);
    for (const id of ids) assert.match(id, /^pet-big-/, id);
    for (const [, ref] of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(ref), ref + ' is not defined in this drawing');
    // Without an outfit, the drawing is the one of GAMES-9
    assert.equal(game.call('petSvg', 'cat'), game.call('petSvg', 'cat', {}));
});
