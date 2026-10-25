// Development check of GAMES-10: in the PDF, every title is on the same page as
// the start of its first block. Usage: node check-keeps.mjs file.pdf keeps.json
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const [pdf, keepsFile] = process.argv.slice(2);
if (!fs.existsSync(pdf)) { console.log('    ✖ no PDF: ' + pdf); process.exit(1); }
// Only letters and digits, without case: the PDF shows group titles in capitals (CSS)
// and pdftotext changes spaces and emoji
const flat = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
const pages = execFileSync('pdftotext', [pdf, '-'], { encoding: 'utf8' }).split('\f').map(flat);
// One text with the page of every character, to search forward from each title
let all = '', pageOf = [];
pages.forEach((p, n) => { all += p; pageOf.push(...Array(p.length).fill(n + 1)); });
let from = 0, failed = 0;
for (const keep of JSON.parse(fs.readFileSync(keepsFile, 'utf8'))) {
    const start = flat(keep.start), end = flat(keep.end);
    const a = all.indexOf(start, from);
    const b = a < 0 ? -1 : all.indexOf(end, a + start.length);
    const ok = a >= 0 && b >= 0 && pageOf[a] === pageOf[b + end.length - 1];
    if (!ok) { failed++; console.log('    ✖ "' + keep.start + '" page ' + pageOf[a] + ' / "' + keep.end + '" page ' + pageOf[b + end.length - 1]); }
    if (a >= 0) from = a + start.length;
}
process.exit(failed ? 1 : 0);
