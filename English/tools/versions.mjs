// Versions of the game files in the URLs of QuizA.html (GAMES-5). The server keeps
// js/ and css/ cached for 31 days: a new ?v= makes every browser download the file again.
// Pure: it never reads or writes files by itself (readFile is passed in).
import { createHash } from 'node:crypto';

// Local js/ and css/ files in src="..." or href="...", with an optional ?v=
const LOCAL_REFERENCE = /\b(src|href)="((?:js|css)\/[^"?#]+)(?:\?v=([^"]*))?"/g;

/** 8 hex characters of the SHA-256 of the content (CRLF → LF, research R1). */
export function fileVersion(text) {
    return createHash('sha256').update(String(text).replace(/\r\n/g, '\n')).digest('hex').slice(0, 8);
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
    });
    return { html: stamped, changed };
}

/** @returns {{ path, problem: "missing-version"|"outdated"|"missing-file" }[]} empty when everything is up to date */
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
    return problems;
}
