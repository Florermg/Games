// Loads the scripts of campos/Guia5.html (GAMES-17) into an isolated node:vm context,
// in the same order as the page, with a seeded Math.random. The DOM parts are left out.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { ENGLISH_DIR } from './game-context.mjs';

export const CAMPOS_DIR = path.join(ENGLISH_DIR, 'campos');

// Shared files of the game (../js) and the files of the page (js/)
export const CAMPOS_SCRIPTS = ['../js/lang.js', '../js/api.js', '../js/grading.js', '../js/pet-rewards.js',
    'js/campos-data.js', 'js/campos-grading.js', 'js/campos-guides.js', 'js/campos-print.js'];

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

export function createCamposContext({ seed = 1 } = {}) {
    const context = vm.createContext({ console, URLSearchParams });
    vm.runInContext(seededRandomSource(seed), context);
    for (const file of CAMPOS_SCRIPTS) {
        vm.runInContext(fs.readFileSync(path.join(CAMPOS_DIR, file), 'utf8'), context, { filename: file });
    }
    return {
        context,
        run: (expression) => vm.runInContext(expression, context),
        call: (name, ...args) => vm.runInContext(name, context)(...args),
        toPlain: (value) => JSON.parse(JSON.stringify(value))
    };
}
