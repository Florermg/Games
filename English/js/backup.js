/* =====================================================================
   BACKUP OF THE PROGRESS (GAMES-19, phase 1): the student takes the
   prizes, the outfits of the pets, the history of guides and the notebook
   to another device, as a file (.json) or as a text code to copy and
   paste. A SHA-256 hash detects a backup that is incomplete or changed.
   Restoring joins with what the device has: it never deletes anything.
   The same format will travel to the server in phase 2 (GAMES-20).
   The pure part is tested in Node; the DOM part is in hub.js.
   ===================================================================== */

const BACKUP_FORMAT = "games-backup";
const BACKUP_VERSION = 1;
const BACKUP_CODE_GZIP = "GAMES1-";
const BACKUP_CODE_PLAIN = "GAMES0-";

/** The backup of one student, without its hash yet. pets/progress are the student's records; notebook, its pages. */
function buildBackup({ name, pets, progress, notebook, now }) {
    return {
        format: BACKUP_FORMAT,
        version: BACKUP_VERSION,
        created: now.toISOString(),
        student: { name: String(name || "").trim() },
        data: { pets: pets || null, progress: progress || null, notebook: notebook || null }
    };
}

// Always the same text for the same content: the fields in a fixed order
function backupContent(backup) {
    return JSON.stringify({ format: backup.format, version: backup.version, created: backup.created, student: backup.student, data: backup.data });
}

async function backupHash(backup) {
    const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(backupContent(backup))));
    return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

async function sealBackup(backup) {
    return Object.assign({}, backup, { hash: await backupHash(backup) });
}

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function looksLikeBackup(value) {
    if (!isObject(value) || value.format !== BACKUP_FORMAT || !isObject(value.student) || !isObject(value.data)) return false;
    const { pets, progress, notebook } = value.data;
    return (pets === null || (isObject(pets) && Array.isArray(pets.owned))) &&
        (progress === null || (isObject(progress) && Array.isArray(progress.exams))) &&
        (notebook === null || Array.isArray(notebook));
}

/** @returns {{ ok: true, backup } | { ok: false, error: "notBackup" | "version" | "tampered" }} */
async function checkBackup(text) {
    let value;
    try { value = JSON.parse(text); } catch (error) { return { ok: false, error: "notBackup" }; }
    if (!looksLikeBackup(value)) return { ok: false, error: "notBackup" };
    if (value.version !== BACKUP_VERSION) return { ok: false, error: "version" };
    if (typeof value.hash !== "string" || value.hash !== await backupHash(value)) return { ok: false, error: "tampered" };
    return { ok: true, backup: value };
}

// ---------- Text code: GAMES1- + gzip + base64url (GAMES0- without compression) ----------

function toBase64Url(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text) {
    const base64 = text.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64 + "=".repeat((4 - base64.length % 4) % 4));
    return Uint8Array.from(binary, c => c.charCodeAt(0));
}

async function transform(bytes, stream) {
    return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}

/** compress: false for browsers without CompressionStream (the code is longer, and is read the same way). */
async function encodeBackupCode(backup, compress = typeof CompressionStream === "function") {
    const bytes = new TextEncoder().encode(JSON.stringify(backup));
    return compress
        ? BACKUP_CODE_GZIP + toBase64Url(await transform(bytes, new CompressionStream("gzip")))
        : BACKUP_CODE_PLAIN + toBase64Url(bytes);
}

/** What the student brings: the contents of the file (JSON) or a pasted code, maybe with spaces or line breaks. */
async function readBackupInput(input) {
    const text = String(input || "").trim();
    if (!text.startsWith(BACKUP_CODE_GZIP) && !text.startsWith(BACKUP_CODE_PLAIN)) return checkBackup(text);
    const body = text.slice(BACKUP_CODE_GZIP.length).replace(/\s+/g, "");
    try {
        let bytes = fromBase64Url(body);
        if (text.startsWith(BACKUP_CODE_GZIP)) bytes = await transform(bytes, new DecompressionStream("gzip"));
        return checkBackup(new TextDecoder().decode(bytes));
    } catch (error) {
        return { ok: false, error: "notBackup" };
    }
}

/** "respaldo-ana-2026-10-31.json" / "backup-jose-maria-2026-10-31.json" */
function backupFileName(name, now, lang = pageLang()) {
    const slug = String(name || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || (lang === "es" ? "alumno" : "student");
    const day = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    return (lang === "es" ? "respaldo-" : "backup-") + slug + "-" + day + ".json";
}

// ---------- Restore: join without deleting (FR-003) ----------

function mergePets(store, key, name, incoming) {
    if (!incoming) return 0;
    const current = store.students[key] || (store.students[key] = { name, owned: [], guides: [], outfits: { cat: {}, dog: {} } });
    let added = 0;
    for (const prize of incoming.owned || []) {
        if (!prize || typeof prize.id !== "string") continue;
        const mine = current.owned.find(o => o.id === prize.id);
        if (!mine) {
            current.owned.push({ id: prize.id, date: prize.date });
            added++;
        } else if (String(prize.date) < String(mine.date)) {
            mine.date = prize.date;
        }
    }
    current.guides = Array.from(new Set(current.guides.concat(incoming.guides || [])));
    current.outfits = current.outfits || { cat: {}, dog: {} };
    for (const kind of ["cat", "dog"]) {
        const mine = current.outfits[kind] || {};
        const theirs = (incoming.outfits && incoming.outfits[kind]) || {};
        current.outfits[kind] = Object.keys(mine).length ? mine : Object.assign({}, theirs);
    }
    return added;
}

function mergeExams(store, key, name, incoming) {
    if (!incoming) return 0;
    const current = store.students[key] || (store.students[key] = { name, exams: [] });
    const id = (e) => e.date + "|" + e.subject + "|" + e.title;
    const known = new Set(current.exams.map(id));
    const fresh = (incoming.exams || []).filter(e => e && typeof e.subject === "string" && Array.isArray(e.areas) && !known.has(id(e)));
    current.exams = current.exams.concat(fresh).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-MAX_EXAMS);
    return fresh.length;
}

function mergePages(store, incoming) {
    let added = 0;
    for (const page of incoming || []) {
        if (!page || typeof page.id !== "string" || typeof page.text !== "string") continue;
        const mine = store.pages.find(p => p.id === page.id);
        if (!mine) {
            store.pages.push(Object.assign({}, page));
            added++;
        } else if (String(page.updated) > String(mine.updated)) {
            Object.assign(mine, page);
        }
    }
    return added;
}

/**
 * Joins a checked backup with the stores of the device (pets, progress, notebook), changing them.
 * @returns {{ name, prizes, exams, pages }} what was new
 */
function mergeBackup(stores, backup, includeNotebook) {
    const name = backup.student.name || "Guest";
    const key = studentKey(name);
    return {
        name,
        prizes: mergePets(stores.pets, key, name, backup.data.pets),
        exams: mergeExams(stores.progress, key, name, backup.data.progress),
        pages: includeNotebook ? mergePages(stores.notebook, backup.data.notebook) : 0
    };
}
