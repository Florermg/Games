// Backup of the progress of a student, to take it to another device (GAMES-19)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext } from './helpers/game-context.mjs';

const game = createGameContext({ seed: 19 });
const plain = (value) => game.toPlain(value);
const NOW = new Date('2026-10-31T12:00:00');

const pets = () => ({ name: 'Ana', owned: [{ id: 'witchHat', date: '2026-10-28T10:00:00.000Z' }, { id: 'redCollar', date: '2026-10-20T10:00:00.000Z' }],
    guides: ['g1', 'g2'], outfits: { cat: { head: 'witchHat' }, dog: { neck: 'redCollar' } } });
const exam = (day, title) => ({ date: new Date(2026, 9, day, 12).toISOString(), subject: 'english', title: title || 'GRAMMAR GUIDE', demo: false, areas: [{ id: 'english:Grammar', label: 'Grammar', score: 3, max: 5 }] });
const progress = () => ({ name: 'Ana', exams: [exam(10), exam(12)] });
const notebook = () => [{ id: 'p1', created: '2026-10-01T10:00:00.000Z', updated: '2026-10-02T10:00:00.000Z', title: 'My day', text: 'I went to the park.' }];
const sealed = async (extra) => plain(await game.call('sealBackup', game.call('buildBackup', Object.assign({ name: 'Ana', pets: pets(), progress: progress(), notebook: notebook(), now: NOW }, extra || {}))));
const stores = () => ({ pets: { version: 1, students: {} }, progress: { version: 1, students: {} }, notebook: { version: 1, online: true, pages: [] } });

// ---------- Format and check (FR-001, SC-002) ----------

test('the backup has the format, the student, the data and a SHA-256 hash', async () => {
    const backup = await sealed();
    assert.equal(backup.format, 'games-backup');
    assert.equal(backup.version, 1);
    assert.equal(backup.created, NOW.toISOString());
    assert.deepEqual(backup.student, { name: 'Ana' });
    assert.deepEqual(backup.data.pets, pets());
    assert.deepEqual(backup.data.progress, progress());
    assert.deepEqual(backup.data.notebook, notebook());
    assert.match(backup.hash, /^[0-9a-f]{64}$/);
    const result = plain(await game.call('checkBackup', JSON.stringify(backup)));
    assert.equal(result.ok, true);
});

test('any change of one character in the backup is detected (SC-002)', async () => {
    const text = JSON.stringify(await sealed());
    const changed = text.replace('witchHat', 'witchHut');
    assert.deepEqual(plain(await game.call('checkBackup', changed)), { ok: false, error: 'tampered' });
    const noHash = JSON.parse(text);
    delete noHash.hash;
    assert.deepEqual(plain(await game.call('checkBackup', JSON.stringify(noHash))), { ok: false, error: 'tampered' });
});

test('files and codes that are not a backup are rejected without changing anything', async () => {
    for (const text of ['', 'hello', '{"a":1}', '[]', JSON.stringify({ format: 'other' })]) {
        assert.deepEqual(plain(await game.call('checkBackup', text)), { ok: false, error: 'notBackup' }, text);
    }
    const future = await sealed();
    future.version = 9;
    assert.deepEqual(plain(await game.call('checkBackup', JSON.stringify(future))), { ok: false, error: 'version' });
});

// ---------- Text code (FR-002) ----------

test('the code goes and comes back the same, compressed and not compressed', async () => {
    const backup = await sealed();
    const code = await game.call('encodeBackupCode', backup);
    assert.match(code, /^GAMES1-[A-Za-z0-9_-]+$/);
    assert.ok(code.length < JSON.stringify(backup).length, 'shorter than the JSON');
    const back = plain(await game.call('readBackupInput', code));
    assert.equal(back.ok, true);
    assert.deepEqual(back.backup, backup);
    // Without CompressionStream (older browsers): GAMES0-
    const plainCode = await game.call('encodeBackupCode', backup, false);
    assert.match(plainCode, /^GAMES0-/);
    assert.deepEqual(plain(await game.call('readBackupInput', plainCode)).backup, backup);
    // Pasted with spaces or line breaks (WhatsApp, mail)
    assert.equal(plain(await game.call('readBackupInput', '  ' + code.slice(0, 20) + '\n' + code.slice(20) + ' ')).ok, true);
    // The file contents (JSON) are also accepted
    assert.equal(plain(await game.call('readBackupInput', JSON.stringify(backup))).ok, true);
    // A broken code
    assert.deepEqual(plain(await game.call('readBackupInput', 'GAMES1-' + code.slice(7, 40))), { ok: false, error: 'notBackup' });
});

test('backupFileName: the name of the student without accents or spaces, and the date', () => {
    assert.equal(game.call('backupFileName', 'Ana', NOW, 'es'), 'respaldo-ana-2026-10-31.json');
    assert.equal(game.call('backupFileName', 'José María', NOW, 'en'), 'backup-jose-maria-2026-10-31.json');
    assert.equal(game.call('backupFileName', '', NOW, 'es'), 'respaldo-alumno-2026-10-31.json');
});

// ---------- Merge without deleting (FR-003) ----------

test('restoring on an empty device brings everything of the student', async () => {
    const backup = await sealed();
    const target = stores();
    const result = plain(game.call('mergeBackup', target, backup, true));
    assert.deepEqual(result, { name: 'Ana', prizes: 2, exams: 2, pages: 1 });
    assert.deepEqual(plain(target.pets.students.ana), pets());
    assert.deepEqual(plain(target.progress.students.ana), progress());
    assert.deepEqual(plain(target.notebook.pages), notebook());
});

test('restoring joins with what the device already has, without deleting or repeating', async () => {
    const backup = await sealed();
    const target = stores();
    target.pets.students.ana = { name: 'Ana', owned: [{ id: 'cap', date: '2026-10-29T10:00:00.000Z' }, { id: 'redCollar', date: '2026-10-25T10:00:00.000Z' }],
        guides: ['g2', 'g3'], outfits: { cat: {}, dog: { head: 'cap' } } };
    target.progress.students.ana = { name: 'Ana', exams: [exam(12), exam(20, 'NEW GUIDE')] };
    target.notebook.pages = [{ id: 'p1', created: '2026-10-01T10:00:00.000Z', updated: '2026-10-05T10:00:00.000Z', title: 'My day', text: 'Newer text.' },
        { id: 'p2', created: '2026-10-06T10:00:00.000Z', updated: '2026-10-06T10:00:00.000Z', title: '', text: 'Other page.' }];
    const result = plain(game.call('mergeBackup', target, backup, true));
    assert.deepEqual(result, { name: 'Ana', prizes: 1, exams: 1, pages: 0 });
    const petsAfter = plain(target.pets.students.ana);
    assert.deepEqual(petsAfter.owned.map(o => o.id).sort(), ['cap', 'redCollar', 'witchHat']);
    // The oldest date of a prize won on both devices
    assert.equal(petsAfter.owned.find(o => o.id === 'redCollar').date, '2026-10-20T10:00:00.000Z');
    assert.deepEqual(petsAfter.guides.sort(), ['g1', 'g2', 'g3']);
    // The outfit of the device stays; an empty one takes the backup's
    assert.deepEqual(petsAfter.outfits, { cat: { head: 'witchHat' }, dog: { head: 'cap' } });
    const exams = plain(target.progress.students.ana.exams);
    assert.deepEqual(exams.map(e => e.date.slice(5, 10)), ['10-10', '10-12', '10-20']);
    // The newer page stays; the other one is kept
    assert.deepEqual(plain(target.notebook.pages).map(p => p.text), ['Newer text.', 'Other page.']);
    // Twice: nothing new
    assert.deepEqual(plain(game.call('mergeBackup', target, backup, true)), { name: 'Ana', prizes: 0, exams: 0, pages: 0 });
});

test('the history keeps only the last 50 guides after joining; the notebook only when chosen', async () => {
    const many = { name: 'Ana', exams: Array.from({ length: 40 }, (_, i) => exam(1 + (i % 28), 'A' + i)) };
    const backup = await sealed({ progress: many, notebook: null });
    const target = stores();
    target.progress.students.ana = { name: 'Ana', exams: Array.from({ length: 30 }, (_, i) => exam(1 + (i % 28), 'B' + i)) };
    game.call('mergeBackup', target, backup, false);
    assert.equal(target.progress.students.ana.exams.length, 50);
    const sorted = plain(target.progress.students.ana.exams).map(e => e.date);
    assert.deepEqual(sorted, [...sorted].sort());
    assert.deepEqual(plain(target.notebook.pages), []);
    // A backup with the notebook, restored without choosing it
    const withNotebook = await sealed();
    const other = stores();
    assert.equal(plain(game.call('mergeBackup', other, withNotebook, false)).pages, 0);
    assert.deepEqual(plain(other.notebook.pages), []);
});

test('the backup texts of the main page exist in English and Spanish', async () => {
    const fs = await import('node:fs');
    game.run(fs.readFileSync(new URL('../js/hub.js', import.meta.url), 'utf8'));
    const texts = plain(game.run('HUB_TEXT'));
    for (const key of ['backupTitle', 'backupNote', 'backupDownload', 'backupCopy', 'backupRestore', 'backupDone', 'backupRestored', 'backupTampered', 'backupNotBackup', 'backupNeedName', 'backupEmpty', 'backupNotebook']) {
        assert.ok(texts.en[key] && texts.es[key], key);
    }
});
