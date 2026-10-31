// npm run versions: writes in every page of the game (QuizA.html, campos/Guia5.html) the ?v= of
// every js/ and css/ file from its current content (GAMES-5, GAMES-17). Run it after changing
// any of those files, before the commit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stampVersions, readGameFile, GAME_PAGES } from './versions.mjs';

const englishDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
    for (const name of GAME_PAGES) {
        const page = path.join(englishDir, name);
        // Each page reads its files from its own folder (../js for the shared ones)
        const dir = path.dirname(page);
        const { html, changed } = stampVersions(fs.readFileSync(page, 'utf8'), (file) => readGameFile(dir, file));
        if (!changed.length) {
            console.log(name + ': all versions are up to date.');
        } else {
            fs.writeFileSync(page, html);
            console.log('New version in ' + name + ' for:\n' + changed.map(file => '  ' + file).join('\n'));
        }
    }
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
