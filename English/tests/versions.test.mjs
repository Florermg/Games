// Versions in the URLs of the game files, so every browser downloads what changed (GAMES-5, FR-001 to FR-004)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ENGLISH_DIR } from './helpers/game-context.mjs';
import { fileVersion, listReferences, stampVersions, checkVersions } from '../tools/versions.mjs';

const PAGE = path.join(ENGLISH_DIR, 'QuizA.html');
const readGameFile = (file) => fs.readFileSync(path.join(ENGLISH_DIR, file), 'utf8');

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

test('QuizA.html asks for its 12 files with a version (SC-002)', () => {
    const references = listReferences(fs.readFileSync(PAGE, 'utf8'));
    assert.equal(references.length, 12, references.map(r => r.path).join(', '));
    assert.equal(references.filter(r => r.path.startsWith('css/')).length, 1);
    assert.ok(references.every(r => r.version), 'without version: ' + references.filter(r => !r.version).map(r => r.path).join(', '));
});

test('every version in QuizA.html matches its file: if not, run npm run versions (FR-004)', () => {
    const problems = checkVersions(fs.readFileSync(PAGE, 'utf8'), readGameFile);
    const message = problems.map(p => '  ' + p.path + ': ' + p.problem).join('\n');
    assert.deepEqual(problems, [], 'QuizA.html asks for files with a wrong version:\n' + message + '\nRun `npm run versions` and commit QuizA.html.');
});
