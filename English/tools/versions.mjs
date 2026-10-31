// Versions of the game files in the URLs of QuizA.html (GAMES-5). The server keeps
// js/ and css/ cached for 31 days: a new ?v= makes every browser download the file again.
// Also the optional own pet images of GAMES-9 (data-cat-image / data-dog-image).
// The functions receive readFile, so the tests can pass their own files; only
// readGameFile touches the disk.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Own pet images (GAMES-9): optional, at a fixed place
export const PET_IMAGES = { cat: 'img/pet-cat.png', dog: 'img/pet-dog.png' };
const PET_IMAGE_ATTR = /\bdata-(cat|dog)-image="([^"]*)"/g;

/** Reads a game file: images as bytes, code and styles as text. */
export function readGameFile(englishDir, file, read = fs.readFileSync) {
    const full = path.join(englishDir, file);
    return file.startsWith('img/') ? read(full) : read(full, 'utf8');
}

// The value data-<kind>-image must have: the path with its version, or "" without image
function petImageValue(kind, readFile) {
    let content;
    try {
        content = readFile(PET_IMAGES[kind]);
    } catch (error) {
        return '';
    }
    return PET_IMAGES[kind] + '?v=' + fileVersion(content);
}

// Local js/ and css/ files in src="..." or href="...", with an optional ?v=. They can start
// with ../: campos/Guia5.html uses the shared files of the game (GAMES-17)
const LOCAL_REFERENCE = /\b(src|href)="((?:\.\.\/)?(?:js|css)\/[^"?#]+)(?:\?v=([^"]*))?"/g;

// The pages of the game, relative to English/: the main page, English and the campos guide (GAMES-17, GAMES-18)
export const GAME_PAGES = ['QuizA.html', 'Ingles.html', 'campos/Guia5.html'];

/** 8 hex characters of the SHA-256 of the content: text with CRLF → LF (research R1), images as their bytes. */
export function fileVersion(content) {
    const data = Buffer.isBuffer(content) ? content : String(content).replace(/\r\n/g, '\n');
    return createHash('sha256').update(data).digest('hex').slice(0, 8);
}

/** @returns {{ attr, path, version: string|null }[]} the local references, in order */
export function listReferences(html) {
    return Array.from(html.matchAll(LOCAL_REFERENCE), m => ({ attr: m[1], path: m[2], version: m[3] === undefined ? null : m[3] }));
}

/** @returns {{ html, changed: string[] }} the page with every local reference at the version of its content */
export function stampVersions(html, readFile) {
    const changed = [];
    const stamped = html.replace(LOCAL_REFERENCE, (match, attr, file, version) => {
        let content;
        try {
            content = readFile(file);
        } catch (error) {
            throw new Error('File not found: ' + file);
        }
        const current = fileVersion(content);
        if (version !== current && !changed.includes(file)) changed.push(file);
        return attr + '="' + file + '?v=' + current + '"';
    }).replace(PET_IMAGE_ATTR, (match, kind, value) => {
        const current = petImageValue(kind, readFile);
        if (value !== current) changed.push(PET_IMAGES[kind]);
        return 'data-' + kind + '-image="' + current + '"';
    });
    return { html: stamped, changed };
}

/** @returns {{ path, problem: "missing-version"|"outdated"|"missing-file"|"pet-image-outdated" }[]} empty when everything is up to date */
export function checkVersions(html, readFile) {
    const problems = [];
    for (const { path, version } of listReferences(html)) {
        let content;
        try {
            content = readFile(path);
        } catch (error) {
            problems.push({ path, problem: 'missing-file' });
            continue;
        }
        if (version === null) problems.push({ path, problem: 'missing-version' });
        else if (version !== fileVersion(content)) problems.push({ path, problem: 'outdated' });
    }
    for (const [, kind, value] of html.matchAll(PET_IMAGE_ATTR)) {
        if (value !== petImageValue(kind, readFile)) problems.push({ path: PET_IMAGES[kind], problem: 'pet-image-outdated' });
    }
    return problems;
}
