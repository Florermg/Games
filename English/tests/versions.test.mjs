// Versions in the URLs of the game files, so every browser downloads what changed (GAMES-5, FR-001 to FR-004)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ENGLISH_DIR } from './helpers/game-context.mjs';
import { fileVersion, listReferences, stampVersions, checkVersions, PET_IMAGES, readGameFile as readForVersion } from '../tools/versions.mjs';

const PAGE = path.join(ENGLISH_DIR, 'QuizA.html');
const readGameFile = (file) => readForVersion(ENGLISH_DIR, file);

// A tiny set of files for the examples
const FILES = { 'js/a.js': 'const a = 1;\n', 'js/b.js': 'const b = 2;\n', 'css/s.css': 'body { color: red; }\n' };
const readFake = (files) => (file) => {
    if (!(file in files)) throw new Error('ENOENT: ' + file);
    return files[file];
};
const SAMPLE = '<link rel="stylesheet" href="css/s.css">\n' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito">\n' +
    '<script src="js/a.js?v=00000000"></script>\n<script src="js/b.js"></script>\n' +
    '<script src="https://cdn.example.com/lib.js"></script>';

test('fileVersion: 8 hex characters from the content, the same with CRLF or LF', () => {
    const v = fileVersion('const a = 1;\n');
    assert.match(v, /^[0-9a-f]{8}$/);
    assert.equal(fileVersion('const a = 1;\n'), v);
    assert.notEqual(fileVersion('const a = 2;\n'), v);
    assert.equal(fileVersion('line one\r\nline two\r\n'), fileVersion('line one\nline two\n'));
});

test('listReferences finds the local js/ and css/ files, with or without version, and skips https', () => {
    assert.deepEqual(listReferences(SAMPLE), [
        { attr: 'href', path: 'css/s.css', version: null },
        { attr: 'src', path: 'js/a.js', version: '00000000' },
        { attr: 'src', path: 'js/b.js', version: null }
    ]);
});

test('stampVersions writes every version, leaves external URLs alone and is idempotent', () => {
    const first = stampVersions(SAMPLE, readFake(FILES));
    assert.deepEqual(first.changed, ['css/s.css', 'js/a.js', 'js/b.js']);
    assert.ok(first.html.includes('href="css/s.css?v=' + fileVersion(FILES['css/s.css']) + '"'));
    assert.ok(first.html.includes('src="js/a.js?v=' + fileVersion(FILES['js/a.js']) + '"'));
    assert.ok(first.html.includes('https://fonts.googleapis.com/css2?family=Nunito"'));
    assert.ok(first.html.includes('src="https://cdn.example.com/lib.js"'));
    const second = stampVersions(first.html, readFake(FILES));
    assert.equal(second.html, first.html);
    assert.deepEqual(second.changed, []);
    // Only the file that changed gets a new version (FR-002)
    const third = stampVersions(first.html, readFake({ ...FILES, 'js/b.js': 'const b = 3;\n' }));
    assert.deepEqual(third.changed, ['js/b.js']);
});

test('stampVersions fails with the path of a missing file', () => {
    assert.throws(() => stampVersions(SAMPLE, readFake({ 'js/a.js': '', 'js/b.js': '' })), /css\/s\.css/);
});

test('checkVersions finds missing versions, outdated versions and missing files', () => {
    const stamped = stampVersions(SAMPLE, readFake(FILES)).html;
    assert.deepEqual(checkVersions(stamped, readFake(FILES)), []);
    assert.deepEqual(checkVersions(SAMPLE, readFake(FILES)).map(p => p.path + ' ' + p.problem),
        ['css/s.css missing-version', 'js/a.js outdated', 'js/b.js missing-version']);
    assert.deepEqual(checkVersions(stamped, readFake({ ...FILES, 'js/a.js': 'changed' })).map(p => p.path + ' ' + p.problem), ['js/a.js outdated']);
    const { 'js/b.js': gone, ...withoutB } = FILES;
    assert.deepEqual(checkVersions(stamped, readFake(withoutB)).map(p => p.path + ' ' + p.problem), ['js/b.js missing-file']);
});

test('QuizA.html asks for its 18 files with a version (SC-002)', () => {
    const references = listReferences(fs.readFileSync(PAGE, 'utf8'));
    // 1 CSS + 17 JS (pet-rewards.js and my-pets.js since GAMES-14)
    assert.equal(references.length, 18, references.map(r => r.path).join(', '));
    assert.equal(references.filter(r => r.path.startsWith('css/')).length, 1);
    assert.ok(references.every(r => r.version), 'without version: ' + references.filter(r => !r.version).map(r => r.path).join(', '));
});

test('every version in QuizA.html matches its file: if not, run npm run versions (FR-004)', () => {
    const problems = checkVersions(fs.readFileSync(PAGE, 'utf8'), readGameFile);
    const message = problems.map(p => '  ' + p.path + ': ' + p.problem).join('\n');
    assert.deepEqual(problems, [], 'QuizA.html asks for files with a wrong version:\n' + message + '\nRun `npm run versions` and commit QuizA.html.');
});

// ---------- Own pet images, optional (GAMES-9, FR-008, FR-009) ----------

const PET_SAMPLE = '<div id="pets" data-cat-image="" data-dog-image=""></div>\n<script src="js/a.js"></script>';
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0x10]);

test('fileVersion of an image uses its bytes as they are', () => {
    const v = fileVersion(PNG);
    assert.match(v, /^[0-9a-f]{8}$/);
    assert.notEqual(fileVersion(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xfe, 0x10])), v, 'one byte changes the version');
    assert.deepEqual(PET_IMAGES, { cat: 'img/pet-cat.png', dog: 'img/pet-dog.png' });
});

test('stampVersions writes the version of an own image when it exists, and leaves it empty when not', () => {
    const files = { 'js/a.js': 'a', 'img/pet-cat.png': PNG };
    const first = stampVersions(PET_SAMPLE, readFake(files));
    assert.ok(first.html.includes('data-cat-image="img/pet-cat.png?v=' + fileVersion(PNG) + '"'), first.html);
    assert.ok(first.html.includes('data-dog-image=""'), 'no dog image: empty, and not an error');
    assert.ok(first.changed.includes('img/pet-cat.png'));
    assert.deepEqual(stampVersions(first.html, readFake(files)).changed, [], 'idempotent');
    // The image is removed: back to empty
    const removed = stampVersions(first.html, readFake({ 'js/a.js': 'a' }));
    assert.ok(removed.html.includes('data-cat-image=""'));
    assert.ok(removed.changed.includes('img/pet-cat.png'));
});

test('checkVersions finds an own image whose version is missing, old or left behind', () => {
    const files = { 'js/a.js': 'a', 'img/pet-cat.png': PNG };
    const stamped = stampVersions(PET_SAMPLE, readFake(files)).html;
    assert.deepEqual(checkVersions(stamped, readFake(files)), []);
    const problems = (html, f) => checkVersions(html, readFake(f)).map(p => p.path + ' ' + p.problem);
    assert.deepEqual(problems(stampVersions(PET_SAMPLE, readFake({ 'js/a.js': 'a' })).html, files), ['img/pet-cat.png pet-image-outdated'], 'image added without npm run versions');
    assert.deepEqual(problems(stamped, { ...files, 'img/pet-cat.png': Buffer.from([1, 2, 3]) }), ['img/pet-cat.png pet-image-outdated'], 'image changed');
    assert.deepEqual(problems(stamped, { 'js/a.js': 'a' }), ['img/pet-cat.png pet-image-outdated'], 'image deleted');
});

test('readGameFile reads images as bytes and code as text', () => {
    assert.ok(Buffer.isBuffer(readForVersion(ENGLISH_DIR, 'img/pet-cat.png', () => PNG)));
    assert.equal(typeof readForVersion(ENGLISH_DIR, 'js/api.js'), 'string');
});
