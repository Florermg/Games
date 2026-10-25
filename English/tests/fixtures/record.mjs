// Records the real responses of the public sources used by the generators, so that
// `npm test` can replay them without internet (research R5). Development only:
//   npm run fixtures:record            (all scenarios)
//   npm run fixtures:record -- rl-space-g5
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createGameContext, FIXTURES_DIR } from '../helpers/game-context.mjs';

// Wikimedia asks automated clients to identify themselves
const USER_AGENT = 'GamesTestRecorder/1.0 (https://github.com/Florermg/Games; educational project)';

export const SCENARIOS = {
    'gvs-recycling-g5': {
        seed: 7,
        expression: `generateGrammarGuide({ grade: 5, topic: Object.assign({ name: TOPICS.recycling.label }, TOPICS.recycling),
            grammarPoints: ['quantifiers', 'causative', 'ago', 'comparatives'], onStatus: () => {} })`
    },
    'rl-space-g5': {
        seed: 11,
        expression: `generateReadingGuide({ grade: 5, topic: Object.assign({ name: TOPICS.space.label }, TOPICS.space), onStatus: () => {} })`
    },
    'writing-animals-g5': {
        seed: 13,
        expression: `generateWritingGuide({ grade: 5, topic: Object.assign({ name: TOPICS.animals.label }, TOPICS.animals),
            taskKey: 'letter', onStatus: () => {} })`
    }
};

async function recordScenario(name, scenario) {
    const responses = {};
    let rateLimited = false;
    const recordingFetch = async (url) => {
        const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
        const body = await response.text();
        if (response.status === 429) rateLimited = true;
        responses[String(url)] = { status: response.status, body };
        return { ok: response.ok, status: response.status, json: async () => JSON.parse(body) };
    };
    const game = createGameContext({ seed: scenario.seed, fetch: recordingFetch });
    await game.run(scenario.expression);
    if (rateLimited) throw new Error('a source answered 429 (too many requests); try again later');
    return { scenario: name, seed: scenario.seed, recordedAt: new Date().toISOString(), responses };
}

async function main() {
    const only = process.argv.slice(2);
    const names = only.length ? only : Object.keys(SCENARIOS);
    let failures = 0;
    for (const name of names) {
        const file = path.join(FIXTURES_DIR, name + '.json');
        try {
            const recording = await recordScenario(name, SCENARIOS[name]);
            const previous = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
            if (previous && JSON.stringify(previous.responses) === JSON.stringify(recording.responses)) {
                console.log(`= ${name}: sin cambios (${Object.keys(recording.responses).length} respuestas)`);
                continue;
            }
            fs.writeFileSync(file, JSON.stringify(recording, null, 1) + '\n');
            const kb = Math.round(fs.statSync(file).size / 1024);
            console.log(`✔ ${name}: grabado (${Object.keys(recording.responses).length} respuestas, ${kb} KB)`);
        } catch (error) {
            failures++;
            // The previous recording (if any) is kept untouched
            console.log(`✖ ${name}: fallido — ${error.message}`);
        }
    }
    process.exitCode = failures ? 1 : 0;
}

// Only record when run as a script: generators.test.mjs imports SCENARIOS and must never use the network
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
