// Loads the game scripts into an isolated node:vm context, as QuizA.html does,
// with a seeded Math.random and a fake fetch (research R2, R4, R5).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ENGLISH_DIR = path.resolve(here, '..', '..');
export const FIXTURES_DIR = path.join(ENGLISH_DIR, 'tests', 'fixtures');

// Same order as the <script> tags of QuizA.html; engine.js is left out because it needs the DOM
export const GAME_SCRIPTS = ['lang.js', 'api.js', 'banks.js', 'demos.js', 'listening-stories.js', 'generators.js', 'grading.js', 'print.js', 'verbs-data.js', 'conjugation.js', 'grammar-cards.js', 'notebook-check.js', 'pet-rewards.js', 'progress.js', 'environment.js', 'holidays.js', 'pets.js'];

// mulberry32: small seeded generator, so the random choices of the generators repeat
function seededRandomSource(seed) {
    return `(() => {
        let state = ${seed >>> 0};
        Math.random = () => {
            state = (state + 0x6D2B79F5) >>> 0;
            let t = state;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    })();`;
}

function fakeResponse(status, body) {
    return { ok: status >= 200 && status < 300, status, json: async () => JSON.parse(body) };
}

export function loadFixture(name) {
    return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, name + '.json'), 'utf8'));
}

/**
 * @param {object} options
 * @param {number} [options.seed=1] seed for Math.random
 * @param {object} [options.fixture] recorded responses ({ responses: { url: { status, body } } })
 * @param {boolean} [options.offline] every request fails like a browser without internet
 * @param {boolean} [options.rateLimited] every request answers 429
 * @param {function} [options.fetch] custom fetch (used by the recorder)
 */
export function createGameContext(options = {}) {
    const { seed = 1, fixture = null, offline = false, rateLimited = false } = options;
    const missingUrls = [];
    const requestedUrls = [];

    const fakeFetch = async (url) => {
        const key = String(url);
        requestedUrls.push(key);
        if (offline) throw new TypeError('Failed to fetch');
        if (rateLimited) return fakeResponse(429, '{}');
        const recorded = fixture && fixture.responses[key];
        if (!recorded) {
            missingUrls.push(key);
            throw new Error('No recorded response for ' + key);
        }
        return fakeResponse(recorded.status, recorded.body);
    };

    const context = vm.createContext({
        console,
        URLSearchParams,
        fetch: options.fetch || fakeFetch
    });
    vm.runInContext(seededRandomSource(seed), context);
    for (const file of GAME_SCRIPTS) {
        const source = fs.readFileSync(path.join(ENGLISH_DIR, 'js', file), 'utf8');
        vm.runInContext(source, context, { filename: file });
    }

    return {
        context,
        missingUrls,
        requestedUrls,
        // Evaluates an expression inside the game (useful for top-level const like DEMO_GUIDES)
        run: (expression) => vm.runInContext(expression, context),
        // Calls a global game function; plain data is copied out so assertions work across realms
        call: (name, ...args) => vm.runInContext(name, context)(...args),
        // Deep copy into this realm (objects created inside the vm have a different prototype)
        toPlain: (value) => JSON.parse(JSON.stringify(value))
    };
}
