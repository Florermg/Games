// Notebook: free writing checked by the game's rules and by LanguageTool (GAMES-13)
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext, loadFixture } from './helpers/game-context.mjs';

const game = createGameContext();
const check = (text) => game.toPlain(game.call('checkNotebookText', text));
const TENSE_IDS = game.toPlain(game.run('TENSES')).map(t => t.id);

// ---------- Rules of the game (FR-003, SC-001) ----------

// [text, rule, what is marked, first suggestion]; each sentence has exactly one mistake
const MISTAKES = [
    ['I like pizza and i like tacos.', 'I_LOWERCASE', 'i', 'I'],
    ["Mom says i'm funny.", 'I_LOWERCASE', "i'm", "I'm"],
    ['my dog is big.', 'CAPITAL_START', 'my', 'My'],
    ['I have a cat. she is white.', 'CAPITAL_START', 'she', 'She'],
    ['I like my school a lot', 'END_PUNCTUATION', '', '.'],
    ['I have a orange cat.', 'A_AN', 'a', 'an'],
    ['She is an teacher.', 'A_AN', 'an', 'a'],
    ['She play soccer every day.', 'THIRD_PERSON', 'play', 'plays'],
    ['He always eat breakfast at home.', 'THIRD_PERSON', 'eat', 'eats'],
    ['My cat is lazy. It sleep on my bed.', 'THIRD_PERSON', 'sleep', 'sleeps'],
    ['It rain a lot in summer.', 'THIRD_PERSON', 'rain', 'rains'],
    ['They plays in the park.', 'PLURAL_PERSON', 'plays', 'play'],
    ['I has a new bike.', 'PLURAL_PERSON', 'has', 'have'],
    ["He don't like carrots.", 'DO_DOES', "don't", "doesn't"],
    ["We doesn't have homework.", 'DO_DOES', "doesn't", "don't"],
    ['I is happy today.', 'BE_AGREEMENT', 'is', 'am'],
    ['They is my friends.', 'BE_AGREEMENT', 'is', 'are'],
    ['She are my sister.', 'BE_AGREEMENT', 'are', 'is'],
    ['We was at school.', 'WAS_WERE', 'was', 'were'],
    ['Yesterday I go to the park.', 'PAST_TIME', 'go', 'went'],
    ['Last week she play tennis.', 'PAST_TIME', 'play', 'played'],
    ['Two days ago we eat tacos.', 'PAST_TIME', 'eat', 'ate'],
    ['Yesterday I am sick.', 'PAST_TIME', 'am', 'was'],
    ['In 2020 we visit my grandma.', 'PAST_TIME', 'visit', 'visited'],
    ["I didn't went to school.", 'BASE_AFTER', 'went', 'go'],
    ['She can sings very well.', 'BASE_AFTER', 'sings', 'sing'],
    ['Does he likes pizza?', 'BASE_AFTER', 'likes', 'like'],
    ['He will goes to the beach.', 'BASE_AFTER', 'goes', 'go'],
    ['I like the the park.', 'REPEATED_WORD', 'the the', 'the']
];

test('each typical mistake is found with its rule and suggestion (FR-003, FR-004, SC-001)', () => {
    assert.ok(MISTAKES.length >= 20);
    for (const [text, rule, found, suggestion] of MISTAKES) {
        const issues = check(text);
        assert.equal(issues.length, 1, text + ' → ' + JSON.stringify(issues.map(i => i.rule + ':' + i.found)));
        const [issue] = issues;
        assert.equal(issue.rule, rule, text);
        assert.equal(issue.found, found, text);
        assert.equal(text.slice(issue.start, issue.end), found, text);
        assert.equal(issue.suggestions[0], suggestion, text);
        assert.equal(issue.source, 'game');
        assert.ok(issue.message.length > 10, text);
        assert.ok(['grammar', 'punctuation'].includes(issue.kind), text);
    }
});

test('the past message names the word that shows it is the past', () => {
    const [issue] = check('Yesterday I go to the park.');
    assert.match(issue.message, /"Yesterday"/);
    assert.match(issue.message, /"went"/);
});

test('the example of the quickstart: 6 mistakes in the order of the text', () => {
    const text = 'yesterday i go to the park and she play with a orange ball';
    const issues = check(text);
    assert.deepEqual(issues.map(i => [i.rule, i.found, i.suggestions[0]]), [
        ['CAPITAL_START', 'yesterday', 'Yesterday'],
        ['I_LOWERCASE', 'i', 'I'],
        ['PAST_TIME', 'go', 'went'],
        ['PAST_TIME', 'play', 'played'],
        ['A_AN', 'a', 'an'],
        ['END_PUNCTUATION', '', '.']
    ]);
    assert.equal(issues.at(-1).start, text.length);
});

// ---------- No marks on correct sentences (FR-011, SC-002) ----------

const CORRECT = [
    'Does she play soccer?', 'Can he swim?', 'She can play the piano.', "I'm happy.", "I've got a dog.", 'I waited an hour.',
    'She goes to a university.', 'If I were a bird, I would fly.', 'I wish I were taller.', 'Let it go.', 'I saw him play.',
    'We watched it rain.', 'I read a book yesterday.', "Yesterday I didn't go to school.", 'In May we go to the beach.',
    "She doesn't like carrots.", "They don't play.", 'He is a doctor.', 'We were at home yesterday.', 'Did you see it?',
    'My friends and I play every day.', 'He has a big dog.', 'It is an orange.', 'She always plays with her cat.',
    'Last night I watched a movie.', 'I had had enough.', 'What do you like?', 'Dear Ana,', 'My Weekend'
];

// The letter of the GAMES-1 walkthrough (demo Writing)
const LETTER = "Dear neighbors,\nMy name is Ana and I am organizing a park clean-up (with my classmates) to help our community.\nIt will be on Saturday, November 8th at 9 o'clock in the morning at Central Park.\nPlease bring gloves and a bag (we will give you water and snacks).\nIt is important because our park is dirty and animals can get sick.\nTogether we can make a difference, and it will be fun!\nJoin us and help our community.\nSincerely,\nAna";

function gameSentences() {
    const cards = game.toPlain(game.run('GRAMMAR_CARDS'));
    const sentences = [];
    for (const card of cards) {
        for (const e of card.examples || []) sentences.push(e.en);
        for (const list of Object.values(card.examplesByTense || {})) for (const e of list) sentences.push(e.en);
    }
    const verbs = game.toPlain(game.run('VERBS'));
    for (const verb of verbs) for (const tense of TENSE_IDS) sentences.push(game.toPlain(game.call('conjugate', verb, tense)).exampleEn);
    // A list of words, not a sentence: it has no period on purpose
    return sentences.filter(s => s !== 'two boxes, three babies, five children');
}

test('the correct sentences of the game have no marks (FR-011, SC-002)', () => {
    const sentences = gameSentences().concat(CORRECT, [LETTER]);
    assert.ok(sentences.length > 1000, sentences.length + ' sentences');
    const wrong = sentences.map(s => [s, check(s)]).filter(([, issues]) => issues.length)
        .map(([s, issues]) => s + ' → ' + issues.map(i => i.rule + ':' + i.found).join(', '));
    assert.deepEqual(wrong, []);
});

test('an empty text and a text without letters have no marks', () => {
    assert.deepEqual(check(''), []);
    assert.deepEqual(check('   \n\n  123  '), []);
});

// ---------- Using a suggestion (FR-005) ----------

test('using a suggestion changes the text and moves the next marks', () => {
    const text = 'yesterday i go to the park and she play with a orange ball';
    const issues = check(text);
    const go = issues.findIndex(i => i.found === 'go');
    const result = game.toPlain(game.call('applySuggestion', text, issues, go, 'went'));
    assert.equal(result.text, 'yesterday i went to the park and she play with a orange ball');
    assert.equal(result.issues.length, issues.length - 1);
    for (const issue of result.issues) {
        assert.equal(result.text.slice(issue.start, issue.end), issue.found, issue.rule);
    }
    // The marks before it do not move
    assert.deepEqual(result.issues.slice(0, 2), issues.slice(0, 2));
});

test('using every suggestion in turn leaves a text without mistakes', () => {
    let text = 'yesterday i go to the park and she play with a orange ball';
    let issues = check(text);
    while (issues.length) {
        ({ text, issues } = game.toPlain(game.call('applySuggestion', text, issues, 0, issues[0].suggestions[0])));
    }
    assert.equal(text, 'Yesterday I went to the park and she played with an orange ball.');
    assert.deepEqual(check(text), []);
});

// ---------- Marked text (FR-004) ----------

test('the marked text numbers the mistakes, keeps new lines and escapes HTML', () => {
    const text = 'i like <b>cats</b>\nShe play.';
    const issues = check(text);
    const html = game.call('markedTextHtml', text, issues);
    assert.equal((html.match(/class="nb-mark/g) || []).length, issues.length);
    assert.ok(html.includes('<sup class="nb-n">1</sup>'));
    assert.ok(html.includes('<br>'));
    assert.ok(!html.includes('<b>cats</b>'));
    assert.ok(html.includes('&lt;b&gt;cats&lt;/b&gt;'));
    assert.match(html, /<mark class="nb-mark nb-grammar" data-n="\d">play<\/mark>/);
});

// ---------- LanguageTool (FR-006, FR-007) ----------

function onlineContext(handler) {
    const calls = [];
    const ctx = createGameContext({ fetch: async (url, init) => { calls.push({ url: String(url), init }); return handler(url, init); } });
    return { ctx, calls };
}

const reply = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => JSON.parse(body) });

test('LanguageTool answers become suggestions marked as online (recorded answer)', () => {
    const fixture = loadFixture('languagetool-footbal');
    const issues = game.toPlain(game.call('languageToolIssues', JSON.parse(fixture.body), fixture.text));
    assert.deepEqual(issues.map(i => [i.found, i.suggestions[0], i.kind, i.source]), [
        ['footbal', 'football', 'spelling', 'online'],
        ['freinds', 'friends', 'spelling', 'online']
    ]);
});

test('online and game mistakes in the same place show only once, the game one first (FR-006)', () => {
    const fixture = loadFixture('languagetool-mixed');
    const online = game.toPlain(game.call('languageToolIssues', JSON.parse(fixture.body), fixture.text));
    assert.ok(online.length >= 3);
    const mine = check(fixture.text);
    const merged = game.toPlain(game.call('mergeIssues', mine, online));
    for (let i = 1; i < merged.length; i++) assert.ok(merged[i - 1].end <= merged[i].start || merged[i - 1].start === merged[i - 1].end, 'no overlap');
    const play = merged.find(i => i.found === 'play');
    assert.equal(play.source, 'game');
    assert.equal(play.suggestions[0], 'played');
});

test('online suggestions: at most 3, no unsafe words, typography rules left out', () => {
    const text = 'I like beer and wine.';
    const json = { matches: [
        { offset: 7, length: 4, message: 'x', rule: { id: 'SOME_RULE', category: { id: 'GRAMMAR' } }, replacements: [{ value: 'beer' }, { value: 'bear' }, { value: 'bee' }, { value: 'been' }, { value: 'beet' }] },
        { offset: 0, length: 1, message: 'y', rule: { id: 'EN_QUOTES', category: { id: 'TYPOGRAPHY' } }, replacements: [{ value: '“' }] },
        { offset: 16, length: 4, message: 'z', rule: { id: 'OTHER', category: { id: 'GRAMMAR' } }, replacements: [] }
    ] };
    const issues = game.toPlain(game.call('languageToolIssues', json, text));
    assert.equal(issues.length, 1);
    assert.deepEqual(issues[0].suggestions, ['bear', 'bee', 'been']);
});

test('the online check sends the text in the body of a POST, not in the URL (FR-006)', async () => {
    const fixture = loadFixture('languagetool-footbal');
    const { ctx, calls } = onlineContext(() => reply(200, fixture.body));
    const issues = await ctx.call('checkOnline', fixture.text);
    assert.equal(issues.length, 2);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.languagetool.org/v2/check');
    assert.equal(calls[0].init.method, 'POST');
    assert.ok(!calls[0].url.includes('footbal'));
    const body = new URLSearchParams(calls[0].init.body);
    assert.equal(body.get('text'), fixture.text);
    assert.equal(body.get('language'), 'en-US');
});

test('busy, error and no internet give a clear message (FR-007)', async () => {
    for (const [handler, pattern] of [
        [() => reply(429, '{}'), /busy/],
        [() => reply(500, '{}'), /error 500/],
        [() => { throw new TypeError('Failed to fetch'); }, /no internet/]
    ]) {
        const { ctx } = onlineContext(handler);
        await assert.rejects(ctx.call('checkOnline', 'I like cats.'), pattern);
    }
});

test('the game rules never use the internet', () => {
    const { ctx, calls } = onlineContext(() => reply(200, '{"matches":[]}'));
    ctx.call('checkNotebookText', 'yesterday i go to the park');
    assert.equal(calls.length, 0);
});

// ---------- Saved pages (FR-008, FR-009) ----------

function memoryStorage() {
    const data = {};
    return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } };
}

test('pages are saved and loaded back, newest first (FR-008, SC-004)', () => {
    const storage = memoryStorage();
    const first = game.toPlain(game.call('newNotebookPage', '2026-10-24T18:00:00.000Z', []));
    const second = game.toPlain(game.call('newNotebookPage', '2026-10-25T18:00:00.000Z', [first]));
    first.text = 'My first page.';
    second.title = 'My weekend';
    const store = { version: 1, online: false, pages: [first, second] };
    assert.equal(game.call('saveNotebook', storage, store), true);
    const loaded = game.toPlain(game.call('loadNotebook', storage));
    assert.equal(loaded.available, true);
    assert.equal(loaded.store.online, false);
    assert.deepEqual(loaded.store.pages, [first, second]);
    const sorted = game.toPlain(game.call('sortedPages', loaded.store.pages));
    assert.deepEqual(sorted.map(p => p.id), [second.id, first.id]);
});

test('two pages made at the same moment get different ids', () => {
    const now = '2026-10-25T18:00:00.000Z';
    const a = game.toPlain(game.call('newNotebookPage', now, []));
    const b = game.toPlain(game.call('newNotebookPage', now, [a]));
    assert.notEqual(a.id, b.id);
    assert.equal(b.created, now);
    assert.equal(b.text, '');
});

test('a browser that does not let us save still works (FR-009)', () => {
    const blocked = { getItem: () => { throw new Error('SecurityError'); }, setItem: () => { throw new Error('QuotaExceededError'); } };
    const loaded = game.toPlain(game.call('loadNotebook', blocked));
    assert.equal(loaded.available, false);
    assert.deepEqual(loaded.store.pages, []);
    assert.equal(game.call('saveNotebook', blocked, loaded.store), false);
});

test('an empty or broken notebook starts empty, with the online check on', () => {
    const storage = memoryStorage();
    assert.deepEqual(game.toPlain(game.call('loadNotebook', storage)).store, { version: 1, online: true, pages: [] });
    storage.setItem('games-notebook-v1', '{not json');
    assert.deepEqual(game.toPlain(game.call('loadNotebook', storage)).store.pages, []);
});

test('the page label has the date and the title or the start of the text', () => {
    const page = { id: 'p1', created: '2026-10-25T18:00:00.000Z', updated: '2026-10-25T18:00:00.000Z', title: '', text: 'Today I went to the zoo with my family and we saw lions.' };
    assert.equal(game.call('pageLabel', page), 'Oct 25, 2026 · Today I went to the zoo with m…');
    assert.equal(game.call('pageLabel', { ...page, title: 'The zoo' }), 'Oct 25, 2026 · The zoo');
    assert.equal(game.call('pageLabel', { ...page, text: '' }), 'Oct 25, 2026 · Empty page');
    assert.equal(game.call('wordCount', "I'm at the zoo, with 2 lions."), 7);
});

// ---------- Printed page (FR-010) ----------

test('the printed page has name, date, title, numbered marks and suggestions (FR-010)', () => {
    const page = { id: 'p1', created: '2026-10-25T18:00:00.000Z', updated: '2026-10-25T18:00:00.000Z', title: 'My day', text: 'Yesterday I go to the park' };
    const issues = check(page.text);
    const html = game.call('buildNotebookPrintHtml', { name: 'Ana', page, issues, checkedWith: 'online' });
    assert.ok(html.includes('My Notebook'));
    assert.ok(html.includes('<b>Name:</b> Ana'));
    assert.ok(html.includes('Oct 25, 2026'));
    assert.ok(html.includes('My day'));
    assert.equal((html.match(/class="nb-mark/g) || []).length, 2);
    assert.equal((html.match(/<li>/g) || []).length, 2);
    assert.ok(html.includes('<b>go</b> → went'));
    assert.ok(html.includes('<b>(missing)</b> → .'));
    assert.ok(html.includes('LanguageTool'));
});

test('a printed page without mistakes says so, and says which check was used', () => {
    const page = { id: 'p1', created: '2026-10-25T18:00:00.000Z', updated: '2026-10-25T18:00:00.000Z', title: '', text: 'I like cats.' };
    const html = game.call('buildNotebookPrintHtml', { name: '', page, issues: [], checkedWith: 'game-only-offline' });
    assert.ok(html.includes('No mistakes found'));
    assert.ok(html.includes('online check was not available'));
    assert.ok(html.includes('__________________'));
    assert.ok(!html.includes('nb-print-title'));
});
