// Development check of GAMES-6: every printed card is whole on one page of the PDF
// (its first and last text are on the same page). Usage: node check-cards.mjs file.pdf "query string"
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createGameContext } from '../../../English/tests/helpers/game-context.mjs';

const [pdf, query] = process.argv.slice(2);
if (!fs.existsSync(pdf)) { console.log('    ✖ no PDF: ' + pdf); process.exit(1); }
const params = new URLSearchParams(query);
const kind = params.get('kind'), items = params.get('items').split(','), tenses = params.get('tenses').split(',');
const game = createGameContext();
const flat = (text) => text.replace(/\s+/g, ' ').trim();
const pages = execFileSync('pdftotext', [pdf, '-'], { encoding: 'utf8' }).split('\f').map(flat);

const ends = items.map(item => {
    if (kind === 'grammar') {
        const card = game.toPlain(game.call('grammarCardsFor', tenses)).find(c => c.id === item);
        // The last example (the note repeats on several cards)
        const last = card.examples[card.examples.length - 1].es;
        return { name: item, first: card.title, last };
    }
    const verb = game.toPlain(game.run('VERBS')).find(v => v.base === item);
    const order = game.toPlain(game.run('TENSES')).map(t => t.id).filter(id => tenses.includes(id));
    const c = game.toPlain(game.call('conjugate', verb, order[order.length - 1]));
    return { name: item, first: verb.base + ' (' + verb.es.join(' / ') + ')', last: c.exampleEs || c.exampleEn };
});

let failed = 0;
for (const { name, first, last } of ends) {
    const a = pages.findIndex(p => p.includes(flat(first)));
    const b = pages.findIndex(p => p.includes(flat(last)));
    const ok = a >= 0 && a === b;
    if (!ok) failed++;
    console.log('    ' + (ok ? '✔' : '✖') + ' ' + name + ': page ' + (a + 1) + (ok ? '' : ' / last line on page ' + (b + 1)));
}
process.exit(failed ? 1 : 0);
