// Listening guide (GAMES-11): stories and dialogues written for the game, facts from
// Simple English Wikipedia, the level of each grade, the voice queue and the print.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameContext, loadFixture } from './helpers/game-context.mjs';
import { SCENARIOS } from './fixtures/record.mjs';

const game = createGameContext({ seed: 3 });
const STORIES = game.toPlain(game.run('LISTENING_STORIES'));
const TOPIC_KEYS = Object.keys(game.toPlain(game.run('TOPICS')));
const LEVELS = game.toPlain(game.run('GRADE_LEVELS'));
const GRADES = [3, 4, 5, 6];

async function storyGuide(topic, grade) {
    const g = createGameContext({ seed: 5 });
    return g.toPlain(await g.run(`generateListeningGuide({ grade: ${grade},
        topic: Object.assign({ name: TOPICS.${topic}.label, key: '${topic}' }, TOPICS.${topic}),
        audioType: 'story', onStatus: () => {} })`));
}

async function replayFacts() {
    const fixture = loadFixture('listening-space-g5');
    const g = createGameContext({ seed: fixture.seed, fixture });
    const guide = g.toPlain(await g.run(SCENARIOS['listening-space-g5'].expression));
    return { g, guide };
}

// Words of an answer that must be heard in its sentence ("her bedroom" ~ "my bedroom")
const FUNCTION_WORDS = new Set(['a', 'an', 'the', 'his', 'her', 'their', 'its', 'she', 'he', 'it', 'they', 'if', 'to', 'is', 'are', 'what', 'at', 'in', 'on', 'of', 'and', 'who']);
function heardIn(option, line) {
    const said = ((line.speaker || '') + ' ' + line.text).toLowerCase();
    const words = option.toLowerCase().match(/[a-z']+/g).filter(w => !FUNCTION_WORDS.has(w));
    return words.every(w => new RegExp('\\b' + w.slice(0, Math.max(3, w.length - 2))).test(said));
}

function assertGuideShape(guide, grade) {
    const level = LEVELS[grade];
    assert.equal(guide.kind, 'listening');
    assert.equal(guide.title, 'LISTENING GUIDE');
    const [withSubtitles, without, quiz] = guide.sections;
    assert.deepEqual(guide.sections.map(s => s.stage), [1, 2, 3]);
    assert.deepEqual(guide.sections.map(s => s.type), ['listen', 'listen', 'choice']);
    assert.equal(withSubtitles.subtitles, true);
    assert.equal(without.subtitles, false);
    for (const section of guide.sections) {
        assert.equal(section.sentences.length, level.listeningSentences, 'sentences of grade ' + grade);
        assert.equal(section.rate, level.speechRate);
        assert.equal(section.speakers.length, section.sentences.length);
        assert.equal(section.pitches.length, section.sentences.length);
    }
    assert.deepEqual(without.sentences, withSubtitles.sentences, 'the second listening is the same audio');
    assert.ok(quiz.items.length >= 5 && quiz.items.length <= 6, 'quiz of 5-6 questions: ' + quiz.items.length);
    quiz.items.forEach((item, i) => {
        assert.match(item.text, new RegExp('^' + (i + 1) + '\\. '));
        assert.equal(item.options.length, 3);
        assert.equal(new Set(item.options).size, 3, 'options are different');
        assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 3);
        assert.ok(item.tip, 'every question has a hint');
    });
}

// ---------- Content written for the game (FR-014, Principle VI) ----------

test('there is a story or dialogue for each of the 18 topics, and at least 6 dialogues', () => {
    assert.equal(TOPIC_KEYS.length, 18);
    assert.deepEqual(Object.keys(STORIES).sort(), TOPIC_KEYS.slice().sort());
    assert.ok(Object.values(STORIES).filter(s => s.kind === 'dialogue').length >= 6);
});

test('each story has 8 sentences and 7 questions of 3 options, ordered by the sentence that answers them', () => {
    for (const [topic, story] of Object.entries(STORIES)) {
        assert.equal(story.lines.length, 8, topic);
        assert.equal(story.questions.length, 7, topic);
        const lines = story.questions.map(q => q.line);
        assert.deepEqual(lines, lines.slice().sort((a, b) => a - b), topic + ': questions in the order of the audio');
        assert.ok(story.questions.filter(q => q.line < 5).length >= 5, topic + ': 5 questions for 3rd grade');
        for (const q of story.questions) assert.equal(q.options.length, 3, topic + ': ' + q.text);
        if (story.kind === 'dialogue') {
            assert.ok(story.lines.every(l => l.speaker), topic + ': every line of a dialogue has its character');
            assert.ok(new Set(story.lines.map(l => l.speaker)).size >= 2, topic);
        }
    }
});

test('the correct option is heard in its sentence, and the wrong ones are not', () => {
    for (const [topic, story] of Object.entries(STORIES)) {
        for (const q of story.questions) {
            const line = story.lines[q.line];
            assert.ok(heardIn(q.options[q.answer], line), topic + ': "' + q.options[q.answer] + '" is not in "' + line.text + '"');
            q.options.forEach((option, k) => {
                if (k !== q.answer) assert.ok(!heardIn(option, line), topic + ': the wrong option "' + option + '" is also in the sentence');
            });
        }
    }
});

test('the stories use plain ASCII text and no unsafe words', () => {
    const unsafe = game.run('UNSAFE');
    for (const [topic, story] of Object.entries(STORIES)) {
        const text = story.title + ' ' + story.lines.map(l => (l.speaker || '') + ' ' + l.text).join(' ') + ' ' +
            story.questions.map(q => q.text + ' ' + q.options.join(' ')).join(' ');
        assert.doesNotMatch(text, /[^\x00-\x7F]/, topic);
        assert.ok(!unsafe.test(text), topic);
    }
});

// ---------- Level of each grade (FR-006, FR-015) ----------

test('higher grades hear more sentences at a faster speed', () => {
    for (let i = 1; i < GRADES.length; i++) {
        assert.ok(LEVELS[GRADES[i]].listeningSentences > LEVELS[GRADES[i - 1]].listeningSentences);
        assert.ok(LEVELS[GRADES[i]].speechRate > LEVELS[GRADES[i - 1]].speechRate);
    }
    assert.equal(LEVELS[3].listeningSentences, 5);
    assert.equal(LEVELS[6].listeningSentences, 8);
});

test('story mode builds a full guide for the 18 topics and the 4 grades, without internet (SC-001)', async () => {
    for (const topic of TOPIC_KEYS) {
        for (const grade of GRADES) {
            const guide = await storyGuide(topic, grade);
            assertGuideShape(guide, grade);
            assert.equal(guide.audioType, 'story');
            const story = STORIES[topic];
            const quiz = guide.sections[2];
            // Only the questions about the sentences heard (FR-015)
            const asked = story.questions.filter(q => q.line < LEVELS[grade].listeningSentences).slice(0, 6);
            assert.deepEqual(quiz.items.map(i => i.text.replace(/^\d+\. /, '')), asked.map(q => q.text), topic + ' / ' + grade);
            assert.match(quiz.source, /written for this game/);
            assert.ok(guide.subtitle.includes(story.title));
        }
    }
});

test('in a dialogue each character sounds different and the narration keeps the normal voice (FR-016)', async () => {
    const dialogue = await storyGuide('jobs', 6);
    const section = dialogue.sections[0];
    const byName = {};
    section.speakers.forEach((name, i) => { byName[name] = section.pitches[i]; });
    assert.equal(new Set(Object.values(byName)).size, Object.keys(byName).length, 'one pitch per character');
    assert.match(dialogue.sections[2].script, /^Leo: /);
    const story = await storyGuide('animals', 6);
    assert.ok(story.sections[0].pitches.every(p => p === 1));
    assert.ok(story.sections[0].speakers.every(s => s === ''));
});

test('story mode with a topic typed by the student explains what to do', async () => {
    const g = createGameContext();
    await assert.rejects(g.run(`generateListeningGuide({ grade: 5, topic: { name: 'Pirates', plain: 'pirates', wiki: 'pirates' },
        audioType: 'story', onStatus: () => {} })`), /Stories are only for the topics in the list/);
});

// ---------- Facts from Simple English Wikipedia ----------

test('facts: the recorded scenario replays without asking for unrecorded URLs', async () => {
    const { g } = await replayFacts();
    assert.deepEqual(g.missingUrls, []);
});

test('facts: a full guide with the CC BY-SA source and answers taken from the audio', async () => {
    const { guide } = await replayFacts();
    assertGuideShape(guide, 5);
    assert.equal(guide.audioType, 'facts');
    const quiz = guide.sections[2];
    assert.match(quiz.source, /Simple English Wikipedia.*CC BY-SA/);
    assert.match(quiz.items[0].text, /What is the audio mainly about\?/);
    const text = quiz.sentences.join(' ');
    for (const item of quiz.items.filter(i => /completes the sentence/.test(i.text))) {
        const sentence = item.text.split('\n')[1].replace(/^"|"$/g, '').replace('______', item.options[item.answer]);
        assert.ok(text.includes(sentence), 'cloze answer rebuilds a sentence of the audio: ' + sentence);
    }
    for (const item of quiz.items.filter(i => /TRUE/.test(i.text))) {
        assert.ok(text.includes(item.options[item.answer]));
    }
    for (const item of quiz.items) assert.doesNotMatch(item.tip, /paragraph|Read /, 'listening hints talk about the audio');
});

test('facts: the same seed and recording build the same guide', async () => {
    assert.deepEqual((await replayFacts()).guide, (await replayFacts()).guide);
});

test('facts: when Wikipedia is busy (429) the student sees the "busy" message', async () => {
    const g = createGameContext({ rateLimited: true });
    await assert.rejects(g.run(SCENARIOS['listening-space-g5'].expression), /busy right now/);
});

// ---------- Grading (FR-008) ----------

test('the quiz is graded like the other guides, and the audio stages add no points', async () => {
    const guide = await storyGuide('space', 5);
    const quiz = guide.sections[2];
    const isCorrect = game.run('isCorrect');
    quiz.items.forEach(item => {
        assert.equal(isCorrect(quiz, item, String(item.answer)), true);
        assert.equal(isCorrect(quiz, item, String((item.answer + 1) % 3)), false);
    });
    const score = game.run('scoreSection');
    assert.deepEqual(game.toPlain(score(guide.sections[0], { correct: [] })), { score: 0, max: 0 });
});

// ---------- Voice queue (R1) ----------

function fakeSpeech(g) {
    const spoken = [];
    g.context.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    g.context.window = {
        speechSynthesis: {
            getVoices: () => [{ lang: 'en-US', name: 'Samantha' }],
            speak: (u) => spoken.push(u),
            cancel: () => {}
        }
    };
    return spoken;
}

test('the subtitles follow the voice: one utterance per sentence, in order, and one end', () => {
    const g = createGameContext();
    const spoken = fakeSpeech(g);
    const shown = [];
    let ended = 0;
    const ok = g.run('Speech').speakSequence(['One.', 'Two.', 'Three.'], 0.9, i => shown.push(i), () => ended++, [1.25, 0.8, 1]);
    assert.equal(ok, true);
    assert.deepEqual(spoken.map(u => u.text), ['One.', 'Two.', 'Three.']);
    assert.deepEqual(spoken.map(u => u.pitch), [1.25, 0.8, 1]);
    assert.ok(spoken.every(u => u.rate === 0.9 && u.lang === 'en-US'));
    spoken.forEach(u => { u.onstart(); if (u.onend) u.onend(); });
    assert.deepEqual(shown, [0, 1, 2]);
    assert.equal(ended, 1);
});

test('after Stop, the events of the old reading no longer change the subtitles', () => {
    const g = createGameContext();
    const spoken = fakeSpeech(g);
    const shown = [];
    const speech = g.run('Speech');
    speech.speakSequence(['One.', 'Two.'], 0.9, i => shown.push(i), () => shown.push('end'));
    speech.stop();
    spoken.forEach(u => { u.onstart(); if (u.onend) u.onend(); });
    assert.deepEqual(shown, []);
});

// ---------- Print (FR-009) ----------

test('the student sheet does not show the audio text; the answer key reads it aloud with its characters', async () => {
    const buildPrintHtml = game.run('buildPrintHtml');
    for (const guide of [await storyGuide('food', 5), (await replayFacts()).guide]) {
        const student = buildPrintHtml(guide, 'student');
        const key = buildPrintHtml(guide, 'key');
        const sentences = guide.sections[0].sentences;
        const escape = s => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        for (const sentence of sentences) {
            assert.ok(!student.includes(escape(sentence)) || guide.sections[2].items.some(i => i.options.includes(sentence)),
                'the student sheet shows the audio: ' + sentence);
        }
        assert.equal((key.match(/class="read-aloud"/g) || []).length, 1, 'the text is printed once, in the key');
        for (const sentence of sentences) assert.ok(key.includes(escape(sentence)), sentence);
        assert.ok(key.includes('class="key"'), 'the key marks the answers');
        if (guide.audioType === 'story') assert.ok(key.includes('<b>Dad:</b>'), 'the characters are in the key');
    }
});
