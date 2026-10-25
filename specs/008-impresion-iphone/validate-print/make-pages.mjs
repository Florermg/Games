// Development check of GAMES-10: writes one printable page per guide and version
// (the demos and the recorded generated guides of GAMES-1), plus what must stay
// together on paper: each title and the start of its first block. Also a sweep that
// moves the GVS demo down, so every title falls at the bottom of a page at some point.
// Usage: node make-pages.mjs <output-folder>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGameContext, loadFixture, ENGLISH_DIR } from '../../../English/tests/helpers/game-context.mjs';
import { SCENARIOS } from '../../../English/tests/fixtures/record.mjs';

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const game = createGameContext();
const guides = Object.fromEntries(Object.entries(game.toPlain(game.run('DEMO_GUIDES'))).map(([k, g]) => ['demo-' + k, g]));
for (const name of Object.keys(SCENARIOS)) {
    const fixture = loadFixture(name);
    const replay = createGameContext({ seed: fixture.seed, fixture });
    guides[name] = replay.toPlain(await replay.run(SCENARIOS[name].expression));
}
const text = (html) => html.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
const css = 'file://' + path.join(ENGLISH_DIR, 'css', 'quiz.css');
// Sweep: the GVS demo with a blank space of 0 to 240 mm before the guide, so that
// every title falls, at some point, at the bottom of a page (where the bug showed)
const sweep = [];
for (let mm = 0; mm <= 240; mm += 12) sweep.push(['sweep-gvs-' + String(mm).padStart(3, '0') + 'mm', guides['demo-gvs'], 'student', mm]);
const cases = Object.entries(guides).flatMap(([name, guide]) => ['student', 'key'].map(version => [name + '-' + version, guide, version, 0]))
    .concat(sweep);
for (const [caseName, guide, version, spaceMm] of cases) {
    {
        const html = game.call('buildPrintHtml', guide, version)
            .replace('<div class="print-sheet', '<div style="height:' + spaceMm + 'mm"></div><div class="print-sheet');
        // Every .print-keep: its first words (the title) and its last words (end of the first block)
        const keeps = html.split('<div class="print-keep">').slice(1).map(part => {
            let depth = 1, i = 0;
            const tag = /<\/?div\b[^>]*>/g;
            let m;
            while ((m = tag.exec(part))) { depth += m[0].startsWith('</') ? -1 : 1; if (depth === 0) { i = m.index; break; } }
            const keep = part.slice(0, i);
            // The first words of the first block, after the group and section titles
            // (columns, as in the matching table, break the reading order of its last words)
            const titles = (keep.match(/<div class="print-(group|section-title)">[\s\S]*?<\/div>/g) || []).map(text).join(' ');
            const block = text(keep.replace(/<div class="print-group">[\s\S]*?<\/div>/, '').replace(/<div class="print-section-title">[\s\S]*?<\/div>/, ''));
            // Just enough words to be found (8 letters or more): in two-column blocks, like
            // the matching table, the next words come after the other column in the PDF text
            const first = [];
            for (const word of block.split(' ')) {
                first.push(word);
                if (first.join('').replace(/[^A-Za-z0-9]/g, '').length >= 8) break;
            }
            // start: only words of the titles, so the search for the block begins after them
            return { start: titles.split(' ').slice(0, 4).join(' '), end: first.join(' ') };
        });
        const file = path.join(out, caseName);
        fs.writeFileSync(file + '.html', '<!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="' + css + '"></head>' +
            '<body><div class="main-wrapper"><div class="screen-only-marker">SCREEN ONLY</div><div id="print-area">' + html + '</div></div></body></html>');
        fs.writeFileSync(file + '.json', JSON.stringify(keeps));
    }
}
console.log(cases.length);
