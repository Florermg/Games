// Environment: time of day, season and current weather (GAMES-15)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext({ seed: 15 });
const plain = (value) => game.toPlain(value);
const at = (text) => new Date(text);

function memoryStorage() {
    const data = {};
    return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } };
}
const blockedStorage = () => ({ getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } });
const response = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => (typeof body === 'string' ? JSON.parse(body) : body) });

const PERIODS = ['day', 'afternoon', 'night'];
const WEATHERS = ['clear', 'cloudy', 'fog', 'rain', 'snow', 'storm'];
const SEASONS4 = ['spring', 'summer', 'autumn', 'winter'];

// ---------- Time of day and season (FR-001, FR-002) ----------

test('periodOf: day 6:00-11:59, afternoon 12:00-18:59, night 19:00-5:59 (FR-001)', () => {
    const cases = {
        '2026-10-25T05:59:00': 'night', '2026-10-25T06:00:00': 'day', '2026-10-25T11:59:00': 'day',
        '2026-10-25T12:00:00': 'afternoon', '2026-10-25T18:59:00': 'afternoon', '2026-10-25T19:00:00': 'night',
        '2026-10-25T23:30:00': 'night', '2026-10-25T00:00:00': 'night'
    };
    for (const [time, period] of Object.entries(cases)) assert.equal(game.call('periodOf', at(time)), period, time);
});

test('seasonOf uses the dates of GAMES-14, with winter crossing the new year (FR-002)', () => {
    const cases = {
        '2026-10-25T12:00:00': 'autumn', '2026-03-19T12:00:00': 'winter', '2026-03-20T12:00:00': 'spring',
        '2026-06-20T12:00:00': 'spring', '2026-06-21T12:00:00': 'summer', '2026-09-22T12:00:00': 'summer',
        '2026-09-23T12:00:00': 'autumn', '2026-12-20T12:00:00': 'autumn', '2026-12-21T12:00:00': 'winter',
        '2027-01-01T12:00:00': 'winter'
    };
    for (const [time, season] of Object.entries(cases)) assert.equal(game.call('seasonOf', at(time)), season, time);
    // Every day of a year has exactly one of the four seasons
    for (let day = 0; day < 365; day++) {
        const date = new Date(2026, 0, 1 + day, 12);
        assert.ok(SEASONS4.includes(game.call('seasonOf', date)), date.toDateString());
    }
});

// ---------- Test mode in the address (FR-008, US4) ----------

test('envOverrides reads ambiente, clima and estacion in Spanish and in English (US4)', () => {
    assert.deepEqual(plain(game.call('envOverrides', '?ambiente=noche&clima=lluvia&estacion=invierno')), { period: 'night', weather: 'rain', season: 'winter' });
    assert.deepEqual(plain(game.call('envOverrides', '?ambiente=dia&clima=sol&estacion=primavera')), { period: 'day', weather: 'clear', season: 'spring' });
    assert.deepEqual(plain(game.call('envOverrides', '?ambiente=tarde&clima=tormenta&estacion=otoño')), { period: 'afternoon', weather: 'storm', season: 'autumn' });
    assert.deepEqual(plain(game.call('envOverrides', '?ambiente=d%C3%ADa&clima=nubes&estacion=otono')), { period: 'day', weather: 'cloudy', season: 'autumn' });
    assert.deepEqual(plain(game.call('envOverrides', '?clima=niebla&estacion=verano')), { weather: 'fog', season: 'summer' });
    assert.deepEqual(plain(game.call('envOverrides', '?clima=nieve')), { weather: 'snow' });
    assert.deepEqual(plain(game.call('envOverrides', '?ambiente=NIGHT&clima=Rain&estacion=Winter')), { period: 'night', weather: 'rain', season: 'winter' });
    assert.deepEqual(plain(game.call('envOverrides', '?ambiente=afternoon&clima=fog&estacion=fall')), { period: 'afternoon', weather: 'fog', season: 'autumn' });
});

test('envOverrides ignores unknown values and other parameters (US4 scenario 4)', () => {
    assert.deepEqual(plain(game.call('envOverrides', '')), {});
    assert.deepEqual(plain(game.call('envOverrides', '?ambiente=madrugada&clima=granizo&estacion=x')), {});
    assert.deepEqual(plain(game.call('envOverrides', '?harness=1&ambiente=noche')), { period: 'night' });
});

// ---------- State, classes and summary (FR-005, FR-006) ----------

test('environmentState combines the clock, the weather and the test mode', () => {
    const real = plain(game.call('environmentState', {
        date: at('2026-10-25T21:00:00'), weather: { kind: 'rain', temperature: 16.6 }, place: 'Ciudad de México', overrides: {}
    }));
    assert.deepEqual(real, { period: 'night', season: 'autumn', weather: 'rain', temperature: 17, place: 'Ciudad de México', test: false });

    const offline = plain(game.call('environmentState', { date: at('2026-10-25T10:00:00'), weather: null, place: null, overrides: {} }));
    assert.deepEqual(offline, { period: 'day', season: 'autumn', weather: null, temperature: null, place: null, test: false });

    const forced = plain(game.call('environmentState', {
        date: at('2026-10-25T10:00:00'), weather: { kind: 'clear', temperature: 24 }, place: 'Monterrey',
        overrides: { period: 'night', weather: 'storm', season: 'winter' }
    }));
    // A forced weather has no real temperature or place
    assert.deepEqual(forced, { period: 'night', season: 'winter', weather: 'storm', temperature: null, place: null, test: true });

    const onlyPeriod = plain(game.call('environmentState', {
        date: at('2026-10-25T10:00:00'), weather: { kind: 'cloudy', temperature: 20 }, place: 'Puebla', overrides: { period: 'afternoon' }
    }));
    assert.equal(onlyPeriod.weather, 'cloudy');
    assert.equal(onlyPeriod.temperature, 20);
    assert.equal(onlyPeriod.test, true);
});

test('environmentClasses gives one class for each part, also without weather', () => {
    const state = (period, weather, season) => ({ period, weather, season, temperature: null, place: null, test: false });
    assert.deepEqual(plain(game.call('environmentClasses', state('night', 'rain', 'winter'))), ['env-night', 'env-w-rain', 'env-s-winter']);
    assert.deepEqual(plain(game.call('environmentClasses', state('day', null, 'autumn'))), ['env-day', 'env-w-none', 'env-s-autumn']);
});

test('environmentSummary tells the time of day, the weather with its place and the season (FR-005)', () => {
    const summary = (s) => game.call('environmentSummary', Object.assign({ temperature: null, place: null, test: false }, s));
    assert.equal(summary({ period: 'night', weather: 'rain', season: 'autumn', temperature: 17, place: 'Ciudad de México' }),
        '🌙 Night · 🌧 Rain, 17 °C in Ciudad de México · 🍂 Autumn');
    assert.equal(summary({ period: 'day', weather: 'clear', season: 'summer', temperature: 30, place: 'where you are' }),
        '☀️ Morning · ☀️ Sunny, 30 °C where you are · 🌻 Summer');
    // At night a clear sky is not "sunny"
    assert.match(summary({ period: 'night', weather: 'clear', season: 'spring' }), /🌙 Clear sky/);
    assert.equal(summary({ period: 'afternoon', weather: null, season: 'winter' }), '🌇 Afternoon · ⛄ Winter');
    assert.equal(summary({ period: 'night', weather: 'storm', season: 'winter', test: true }), '🌙 Night · ⛈ Storm · ⛄ Winter · 🧪 test mode');
});

// ---------- Drawing (FR-005, FR-006, SC-001) ----------

test('the menu window draws all 84 combinations with their parts and its own ids (SC-001)', () => {
    for (const period of PERIODS) for (const weather of [...WEATHERS, null]) for (const season of SEASONS4) {
        const state = { period, weather, season, temperature: null, place: null, test: false };
        const svg = game.call('environmentSceneSvg', state, 'menu');
        const name = period + '/' + weather + '/' + season;
        assert.match(svg, /^<svg [^>]*viewBox="0 0 320 120"/, name);
        assert.match(svg, new RegExp('data-period="' + period + '" data-weather="' + (weather || 'none') + '" data-season="' + season + '"'), name);
        assert.ok(svg.includes(period === 'night' ? 'class="env-moon"' : 'class="env-sun"'), name);
        assert.equal(svg.includes('class="env-stars"'), period === 'night' && (weather === 'clear' || weather === null), name);
        assert.equal(svg.includes('class="env-clouds"'), ['cloudy', 'rain', 'snow', 'storm', 'fog'].includes(weather), name);
        assert.equal(svg.includes('class="env-drops"'), weather === 'rain' || weather === 'storm', name);
        assert.equal(svg.includes('class="env-flakes"'), weather === 'snow', name);
        assert.equal(svg.includes('class="env-bolt"'), weather === 'storm', name);
        assert.equal(svg.includes('class="env-fog"'), weather === 'fog', name);
        assert.ok(svg.includes('class="env-ground env-ground-' + season + '"'), name);
        assert.ok(!svg.includes('NaN') && !svg.includes('undefined'), name);
        // Gradients have the id of this drawing, so the window and other drawings never mix them
        for (const id of svg.match(/id="[^"]+"/g)) assert.match(id, /^id="env-menu-/, name);
        assert.equal((svg.match(/<svg/g) || []).length, (svg.match(/<\/svg>/g) || []).length);
    }
});

test('the drawing never uses Math.random: the same state gives the same drawing', () => {
    const state = { period: 'night', weather: 'snow', season: 'winter', temperature: null, place: null, test: false };
    assert.equal(game.call('environmentSceneSvg', state, 'a'), game.call('environmentSceneSvg', state, 'a'));
    assert.equal(game.call('backgroundParticles', state), game.call('backgroundParticles', state));
});

test('backgroundParticles: rain, snow, autumn leaves and spring petals fall in the background (FR-006)', () => {
    const count = (state, kind) => (game.call('backgroundParticles', Object.assign({ temperature: null, place: null, test: false }, state))
        .match(new RegExp('class="env-p env-p-' + kind + '"', 'g')) || []).length;
    assert.ok(count({ period: 'day', weather: 'rain', season: 'summer' }, 'rain') >= 20);
    assert.ok(count({ period: 'night', weather: 'storm', season: 'summer' }, 'rain') >= 20);
    assert.ok(count({ period: 'day', weather: 'snow', season: 'winter' }, 'snow') >= 20);
    assert.ok(count({ period: 'day', weather: 'clear', season: 'autumn' }, 'leaf') >= 6);
    assert.ok(count({ period: 'day', weather: null, season: 'spring' }, 'petal') >= 6);
    assert.equal(game.call('backgroundParticles', { period: 'day', weather: 'clear', season: 'summer' }), '');
    // Rain does not mix with leaves: the weather wins
    assert.equal(count({ period: 'day', weather: 'rain', season: 'autumn' }, 'leaf'), 0);
});

// ---------- Weather (FR-003, FR-007) ----------

test('weatherKind sorts every WMO code into the 6 kinds (research R2)', () => {
    const expected = {
        0: 'clear', 1: 'clear', 2: 'cloudy', 3: 'cloudy', 45: 'fog', 48: 'fog',
        51: 'rain', 53: 'rain', 55: 'rain', 56: 'rain', 57: 'rain', 61: 'rain', 63: 'rain', 65: 'rain', 66: 'rain', 67: 'rain',
        71: 'snow', 73: 'snow', 75: 'snow', 77: 'snow', 80: 'rain', 81: 'rain', 82: 'rain', 85: 'snow', 86: 'snow',
        95: 'storm', 96: 'storm', 99: 'storm'
    };
    for (const [code, kind] of Object.entries(expected)) assert.equal(game.call('weatherKind', Number(code)), kind, code);
    for (const code of [4, 10, 100, -1, null, undefined, 'x']) assert.equal(game.call('weatherKind', code), null, String(code));
});

test('weatherUrl asks Open-Meteo only for the current weather, with coordinates rounded to 2 decimals', () => {
    const url = new URL(game.call('weatherUrl', 19.432608, -99.133209));
    assert.equal(url.origin + url.pathname, 'https://api.open-meteo.com/v1/forecast');
    assert.equal(url.searchParams.get('latitude'), '19.43');
    assert.equal(url.searchParams.get('longitude'), '-99.13');
    assert.equal(url.searchParams.get('current'), 'temperature_2m,weather_code');
    assert.equal(url.searchParams.get('timezone'), 'auto');
    assert.deepEqual([...url.searchParams.keys()].sort(), ['current', 'latitude', 'longitude', 'timezone']);
});

test('parseWeather reads the answer of Open-Meteo and rejects broken answers', () => {
    assert.deepEqual(plain(game.call('parseWeather', { current: { temperature_2m: 16.6, weather_code: 61 } })), { kind: 'rain', temperature: 17 });
    assert.deepEqual(plain(game.call('parseWeather', { current: { temperature_2m: -0.4, weather_code: 0 } })), { kind: 'clear', temperature: 0 });
    for (const broken of [null, {}, { current: {} }, { current: { weather_code: 3 } }, { current: { temperature_2m: 20, weather_code: 42 } }, { current: { temperature_2m: 'hot', weather_code: 0 } }]) {
        assert.equal(game.call('parseWeather', broken), null, JSON.stringify(broken));
    }
});

test('fetchWeather gives the weather, or null without breaking when something fails (FR-007)', async () => {
    const asked = [];
    const ok = await game.call('fetchWeather', 25.69, -100.32, async (url) => { asked.push(url); return response(200, { current: { temperature_2m: 31.2, weather_code: 2 } }); });
    assert.deepEqual(plain(ok), { kind: 'cloudy', temperature: 31 });
    assert.equal(asked.length, 1);
    assert.ok(asked[0].includes('latitude=25.69') && asked[0].includes('longitude=-100.32'));

    assert.equal(await game.call('fetchWeather', 1, 2, async () => response(500, '{}')), null);
    assert.equal(await game.call('fetchWeather', 1, 2, async () => response(200, 'not json')), null);
    assert.equal(await game.call('fetchWeather', 1, 2, async () => { throw new TypeError('Failed to fetch'); }), null);
    assert.equal(await game.call('fetchWeather', 1, 2, undefined), null);
});

// ---------- Places (FR-004) ----------

test('ENV_CITIES: Mexican cities with unique ids, coordinates inside Mexico and Ciudad de México by default', () => {
    const cities = plain(game.run('ENV_CITIES'));
    assert.ok(cities.length >= 30, cities.length + ' cities');
    assert.equal(new Set(cities.map(c => c.id)).size, cities.length);
    for (const city of cities) {
        assert.ok(city.lat > 14 && city.lat < 33, city.id);
        assert.ok(city.lon > -118 && city.lon < -86, city.id);
        assert.ok(city.name.length > 2, city.id);
    }
    assert.equal(game.run('ENV_DEFAULT_CITY'), 'cdmx');
    assert.equal(plain(game.call('cityById', 'cdmx')).name, 'Ciudad de México');
    assert.equal(plain(game.call('cityById', 'monterrey')).name, 'Monterrey');
    // Unknown ids fall back to Ciudad de México
    assert.equal(plain(game.call('cityById', 'atlantis')).id, 'cdmx');
});

// ---------- Saving (FR-004, FR-007) ----------

test('the chosen city and the last weather are saved; broken or blocked storage starts empty', () => {
    const storage = memoryStorage();
    const first = plain(game.call('loadEnvironment', storage));
    assert.deepEqual(first, { data: { city: 'here', weather: null }, available: true });

    const data = { city: 'monterrey', weather: { kind: 'rain', temperature: 21, lat: 25.69, lon: -100.32, time: 1000 } };
    assert.equal(game.call('saveEnvironment', storage, data), true);
    assert.deepEqual(plain(game.call('loadEnvironment', storage)).data, data);

    storage.setItem('games-env-v1', '{broken');
    assert.deepEqual(plain(game.call('loadEnvironment', storage)).data, { city: 'here', weather: null });
    storage.setItem('games-env-v1', JSON.stringify({ city: 'atlantis', weather: { kind: 'lava' } }));
    assert.deepEqual(plain(game.call('loadEnvironment', storage)).data, { city: 'here', weather: null });

    assert.deepEqual(plain(game.call('loadEnvironment', blockedStorage())), { data: { city: 'here', weather: null }, available: false });
    assert.equal(game.call('saveEnvironment', blockedStorage(), data), false);
});

test('cachedWeather serves the saved weather for 30 minutes and only for the same place (FR-003)', () => {
    const saved = { city: 'here', weather: { kind: 'snow', temperature: -2, lat: 19.43, lon: -99.13, time: 1_000_000 } };
    const minutes = (n) => 1_000_000 + n * 60_000;
    assert.deepEqual(plain(game.call('cachedWeather', saved, 19.4321, -99.1332, minutes(29))), { kind: 'snow', temperature: -2 });
    assert.equal(game.call('cachedWeather', saved, 19.43, -99.13, minutes(31)), null);
    assert.equal(game.call('cachedWeather', saved, 25.69, -100.32, minutes(5)), null);
    assert.equal(game.call('cachedWeather', { city: 'here', weather: null }, 19.43, -99.13, minutes(1)), null);
});

// ---------- Page (FR-009, edge cases) ----------

test('the environment is not printed, stays still with reduced motion and the sheet stays white', async () => {
    const fs = await import('node:fs');
    const css = fs.readFileSync(new URL('../css/quiz.css', import.meta.url), 'utf8');
    assert.match(css, /@media print\s*\{\s*#env-scene\s*\{\s*display:\s*none !important;/);
    const still = css.slice(css.indexOf('/* Still, for people who prefer less movement */'));
    assert.match(still, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.env-p,\s*\.env-flash,[^}]*animation: none;/);
    assert.match(css, /\.game-container \{[^}]*background: white;/);
    assert.match(css, /#env-scene \{[^}]*z-index: -1;[^}]*pointer-events: none;/);
});
