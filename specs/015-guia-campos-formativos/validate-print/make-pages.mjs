// Development check of GAMES-17 (not run in CI): writes printable pages of the campos guide
// (demo and 3 generated guides, student sheet and answer key; a sweep of the demo moved down
// 0-240 mm; study cards in 1 and 2 columns) and what must stay together on paper (GAMES-10).
// Usage: node make-pages.mjs <output-folder>
import fs from 'node:fs';
import path from 'node:path';
import { createCamposContext } from '../../../English/tests/helpers/campos-context.mjs';
import { ENGLISH_DIR } from '../../../English/tests/helpers/game-context.mjs';

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const game = createCamposContext({ seed: 5 });
const plain = (v) => game.toPlain(v);
const guides = { demo: plain(game.call('buildCamposDemo')) };
for (const [name, campos] of [['todos', ['lenguajes', 'saberes', 'etica', 'humano']], ['lenguajes', ['lenguajes']], ['humano', ['humano']]]) {
    guides[name] = plain(game.call('generateCamposGuide', { campos }));
}
const text = (html) => html.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
const css = 'file://' + path.join(ENGLISH_DIR, 'css', 'quiz.css');
function keepsOf(html) {
    return html.split('<div class="print-keep">').slice(1).map(part => {
        let depth = 1, i = 0;
        const tag = /<\/?div\b[^>]*>/g;
        let m;
        while ((m = tag.exec(part))) { depth += m[0].startsWith('</') ? -1 : 1; if (depth === 0) { i = m.index; break; } }
        const keep = part.slice(0, i);
        const titles = (keep.match(/<div class="print-section-title">[\s\S]*?<\/div>/g) || []).map(text).join(' ');
        const block = text(keep.replace(/<div class="print-section-title">[\s\S]*?<\/div>/, ''));
        const first = [];
        for (const word of block.split(' ')) {
            first.push(word);
            if (first.join('').replace(/[^A-Za-z0-9]/g, '').length >= 8) break;
        }
        return { start: titles.split(' ').slice(0, 4).join(' '), end: first.join(' ') };
    });
}
function write(name, html) {
    fs.writeFileSync(path.join(out, name + '.html'), '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><link rel="stylesheet" href="' + css + '"></head>' +
        '<body><div class="main-wrapper"><div class="screen-only-marker">SCREEN ONLY</div><div id="print-area">' + html + '</div></div></body></html>');
    fs.writeFileSync(path.join(out, name + '.json'), JSON.stringify(keepsOf(html)));
}
for (const [name, guide] of Object.entries(guides)) {
    for (const version of ['student', 'key']) write(name + '-' + version, game.call('buildCamposPrintHtml', guide, version));
}
for (let mm = 0; mm <= 240; mm += 24) {
    write('sweep-demo-' + String(mm).padStart(3, '0') + 'mm', game.call('buildCamposPrintHtml', guides.demo, 'student')
        .replace('<div class="print-sheet', '<div style="height:' + mm + 'mm"></div><div class="print-sheet'));
}
const all = plain(game.run('TEMAS.map(t => t.id)'));
write('tarjetas-2-columnas', game.call('buildStudyCardsPrintHtml', all, 2));
write('tarjetas-1-columna', game.call('buildStudyCardsPrintHtml', all, 1));
console.log('Pages in ' + out);
