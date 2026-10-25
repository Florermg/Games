// npm run versions: writes in QuizA.html the ?v= of every js/ and css/ file from its
// current content (GAMES-5). Run it after changing any of those files, before the commit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stampVersions } from './versions.mjs';

const englishDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(englishDir, 'QuizA.html');

try {
    const { html, changed } = stampVersions(fs.readFileSync(page, 'utf8'), (file) => fs.readFileSync(path.join(englishDir, file), 'utf8'));
    if (!changed.length) {
        console.log('All versions are up to date.');
    } else {
        fs.writeFileSync(page, html);
        console.log('New version in QuizA.html for:\n' + changed.map(file => '  ' + file).join('\n'));
    }
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
