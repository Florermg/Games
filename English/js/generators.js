/* =====================================================================
   GUIDE GENERATORS
   Build new guides with the same format as the demos (see demos.js):
     generateGrammarGuide  -> GRAMMAR, VOCABULARY & SPELLING GUIDE
     generateReadingGuide  -> READING & LISTENING GUIDE
     generateWritingGuide  -> WRITING GUIDE
   ===================================================================== */

const STOPWORDS = new Set(("about above after again against along also although among another around away " +
    "because been before being below between both called came come comes could does doing done down during each " +
    "either else even ever every first from further given goes going gone have having here into itself just known " +
    "last later least less like made main make makes many might more most much must near need never next often " +
    "once only other others over part same several shall should show since some something sometimes still such " +
    "than that their them themselves then there these they thing things this those though three through thus " +
    "today together under until upon used uses using usually very want well were what when where whether which " +
    "while whole will with within without would year years your called become became across").split(" "));

function withArticle(noun) {
    return (isVowel(noun[0]) ? "an " : "a ") + noun;
}

// Lowercase start, like the definitions in the PDF ("a doctor for animals")
function pdfStyleDefinition(text) {
    return /^[A-Z](?![A-Z])/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function replaceWord(sentence, word, replacement) {
    return sentence.replace(new RegExp("\\b" + word + "\\b", "i"), replacement);
}

// ---------- 1. GRAMMAR, VOCABULARY & SPELLING ----------

function quantifierSection(number) {
    const items = shuffle(Object.keys(QUANTIFIER_BANK)).map(quantifier => {
        const sentence = pickRandom(QUANTIFIER_BANK[quantifier]);
        return { text: sentence.text, answers: [quantifier], tip: sentence.tip, explanation: QUANTIFIER_EXPLANATIONS[quantifier] };
    });
    return {
        group: "Grammar",
        type: "bank",
        title: number + ". Complete the sentences using <i>all</i>, <i>most</i>, <i>some</i>, <i>a few</i>, or <i>no</i>. (one point each)",
        bank: ["all", "most", "some", "a few", "no"],
        items
    };
}

function causativeSection(number) {
    const items = shuffle(CAUSATIVE_SERVICES).slice(0, 5).map(service => {
        const owner = pickRandom(CAUSATIVE_OWNERS);
        if (Math.random() < 0.6) {
            const time = pickRandom(CAUSATIVE_TIMES);
            const text = Math.random() < 0.5
                ? "Someone " + service.past + " " + owner.owner + " " + service.object + " " + time + "."
                : capitalize(time) + ", someone " + service.past + " " + owner.owner + " " + service.object + ".";
            const answers = causativeAnswers(owner.subject, owner.possessive, service.object, service.participle, time, "past");
            return {
                text, answers,
                tip: "It happened " + time + ": " + owner.subject + " + had + " + owner.possessive + " " + service.object + " + " + service.participle + ".",
                explanation: answers[0]
            };
        }
        const answers = causativeAnswers(owner.subject, owner.possessive, service.object, service.participle, service.habit, "present");
        return {
            text: service.pro + " " + service.verb + " " + owner.owner + " " + service.object + " " + service.habit + ".",
            answers,
            tip: "It happens regularly, so use the present: " + owner.subject + " + have/get (has/gets) + " + owner.possessive + " " + service.object + " + " + service.participle + ".",
            explanation: answers[0]
        };
    });
    return { group: "Grammar", type: "rewrite", title: number + ". Rewrite the sentences using Causative Verbs. (one point each)", items };
}

function agoSection(number) {
    const items = shuffle(AGO_PHRASES).slice(0, 5).map(([base, rest]) => {
        const subject = pickRandom(AGO_SUBJECTS);
        const time = pickRandom(AGO_TIMES);
        const sentence = subject + " " + pastSimple(base) + " " + rest + " " + time + " ago.";
        const answers = [sentence];
        // "a week ago" and "one week ago" are both fine
        if (/^(a|an|one) /.test(time)) {
            ["a", "an", "one"].forEach(article => answers.push(subject + " " + pastSimple(base) + " " + rest + " " + time.replace(/^(a|an|one) /, article + " ") + " ago."));
        }
        return {
            text: subject + " / " + base + " " + rest + " / " + time,
            answers,
            tip: pastTip(base) + " Put 'ago' at the end.",
            explanation: sentence
        };
    });
    return { group: "Grammar", type: "rewrite", title: number + ". Write sentences with <i>ago</i> and the correct form of the verbs. (one point each)", items };
}

function comparativeSection(number) {
    const items = shuffle(COMPARATIVE_BANK).slice(0, 5).map(entry => ({
        text: entry.text,
        answers: [entry.answer],
        tip: entry.tip,
        explanation: entry.text.replace("___", entry.answer).replace(/ \([a-z]+\)/, "")
    }));
    return { group: "Grammar", type: "fill", title: number + ". Complete the sentences with the comparative form of the adjectives in parentheses. (one point each)", items };
}

const GRAMMAR_SECTION_BUILDERS = {
    quantifiers: quantifierSection,
    causative: causativeSection,
    ago: agoSection,
    comparatives: comparativeSection
};

// Picks words whose definitions do not mention the other chosen words
function pickMatchWords(vocab, count, used) {
    const chosen = [];
    for (const word of topicCandidates(vocab)) {
        if (chosen.length === count) break;
        if (used.has(word.word) || word.def.text.length > 80) continue;
        const clash = chosen.some(c =>
            c.def.text === word.def.text ||
            c.def.text.toLowerCase().includes(word.word) ||
            word.def.text.toLowerCase().includes(c.word) ||
            sharesStem(c.word, word.word));
        if (!clash) chosen.push(word);
    }
    return chosen;
}

async function matchSection(pool, used, number) {
    const words = pickMatchWords(pool.vocab, 9, used);
    if (words.length < 5) return null;
    words.forEach(w => used.add(w.word));
    const letters = "abcdefghi".split("");
    const definitions = shuffle(words).map((w, i) => ({ letter: letters[i], text: pdfStyleDefinition(w.def.text), word: w.word }));
    return {
        group: "Vocabulary",
        type: "match",
        title: number + ". Match the words and the definitions. (one point each)",
        definitions: definitions.map(d => ({ letter: d.letter, text: d.text })),
        items: words.map(w => ({
            text: w.word,
            answers: [definitions.find(d => d.word === w.word).letter],
            tip: "\"" + w.word + "\" is " + withArticle(POS_NAMES[w.def.pos]) + "."
        }))
    };
}

async function wordBankSection(pool, used, number) {
    const candidates = topicCandidates(pool.vocab).filter(w => !used.has(w.word));
    const found = [];
    for (let start = 0; start < Math.min(candidates.length, 40) && found.length < 5; start += 10) {
        const batch = candidates.slice(start, start + 10);
        const examples = await Promise.all(batch.map(async w => {
            const example = await exampleSentence(w.word);
            return example && (await isEasySentence(example.sentence, pool.level.minFreq / 2, example.answer)) ? example : null;
        }));
        examples.forEach((example, i) => {
            if (example && found.length < 5 && !found.some(f => f.example.answer === example.answer)) {
                found.push({ word: batch[i], example });
            }
        });
    }
    if (found.length < 3) return null;
    found.forEach(f => used.add(f.word.word));
    // Extra words make the bank harder, like the 9-word bank of the demo
    const extra = topicCandidates(pool.vocab).filter(w => !used.has(w.word)).slice(0, 9 - found.length).map(w => w.word);
    extra.forEach(w => used.add(w));
    return {
        group: "Vocabulary",
        type: "bank",
        title: number + ". Choose the correct words to complete the sentences. (one point each)",
        bank: shuffle(found.map(f => f.example.answer).concat(extra)),
        items: found.map(f => ({
            text: f.example.sentence,
            answers: [f.example.answer],
            tip: "The word means: " + f.word.def.text + ".",
            explanation: "'" + f.example.answer + "': " + f.word.def.text + "."
        }))
    };
}

function dictationSection(pool, used) {
    const level = pool.level;
    const words = topicCandidates(pool.vocab)
        .filter(w => !used.has(w.word) && w.word.length >= level.spellingMinLength)
        .slice(0, 5);
    if (words.length < 3) return null;
    words.forEach(w => used.add(w.word));
    return {
        group: "Spelling",
        type: "dictation",
        title: "Spelling Dictation:",
        items: words.map(w => ({
            text: w.word,
            answers: [w.word],
            tip: "It has " + w.word.length + " letters and starts with \"" + w.word[0] + "\". It means: " + w.def.text + "."
        }))
    };
}

async function circleSpellingSection(pool, used) {
    const candidates = topicCandidates(pool.vocab).filter(w => !used.has(w.word) && w.word.length >= pool.level.spellingMinLength);
    const items = [];
    for (let start = 0; start < candidates.length && items.length < 5; start += 7) {
        const batch = candidates.slice(start, start + 7);
        const results = await Promise.all(batch.map(w => fakeSpellings(w.word, 2)));
        results.forEach((wrong, i) => {
            if (!wrong || items.length >= 5) return;
            const word = batch[i].word;
            used.add(word);
            const options = shuffle([word].concat(wrong));
            items.push({
                text: "",
                options,
                answer: options.indexOf(word),
                tip: "The correct word has " + word.length + " letters. It means: " + batch[i].def.text + ".",
                explanation: word
            });
        });
    }
    if (items.length < 3) return null;
    return { group: "Spelling", type: "choice", title: "Circle the correct Spelling word:", inline: true, items };
}

async function generateGrammarGuide(options) {
    const { grade, topic, grammarPoints, onStatus } = options;
    const sections = grammarPoints.map((point, i) => GRAMMAR_SECTION_BUILDERS[point](i + 1));

    onStatus("Looking up " + topic.name + " words...");
    const pool = await buildWordPool(topic, grade);
    if (pool.vocab.length < 12) {
        throw new Error("I couldn't find enough words about \"" + topic.name + "\". Try another topic!");
    }
    const used = new Set();
    onStatus("Creating the vocabulary exercises...");
    const vocabulary = [await matchSection(pool, used, 1), await wordBankSection(pool, used, 2)].filter(Boolean);
    onStatus("Creating the spelling exercises...");
    const spelling = [dictationSection(pool, used), await circleSpellingSection(pool, used)].filter(Boolean);

    return {
        kind: "gvs",
        school: "",
        title: "GRAMMAR, VOCABULARY & SPELLING GUIDE",
        subtitle: GRADE_LEVELS[grade].label + " · " + topic.name,
        teacher: "",
        sections: sections.concat(vocabulary, spelling)
    };
}

// ---------- 2. READING & LISTENING ----------

// Part of speech and frequency of the content words of a text
async function analyzeKeywords(sentences) {
    const words = new Set();
    sentences.forEach(s => (s.match(/\b[a-z]{4,12}\b/g) || []).forEach(w => {
        if (!STOPWORDS.has(w) && !UNSAFE.test(w)) words.add(w);
    }));
    const list = Array.from(words).slice(0, 80);
    const results = await Promise.all(list.map(w => datamuse({ sp: w, md: "pf", max: 1 }).catch(() => [])));
    const keywords = [];
    results.forEach((result, i) => {
        if (!result.length || result[0].word !== list[i]) return;
        const entry = parseEntry(result[0]);
        const pos = entry.pos.find(p => p === "n" || p === "adj" || p === "v");
        if (pos && entry.freq >= 1) keywords.push({ word: list[i], pos, freq: entry.freq });
    });
    return keywords;
}

function keywordsIn(sentence, keywords) {
    return keywords.filter(k => new RegExp("\\b" + k.word + "\\b").test(sentence) &&
        (sentence.match(new RegExp("\\b" + k.word + "\\b", "gi")) || []).length === 1);
}

function distractorsFor(keyword, sentence, keywords, count) {
    return shuffle(keywords.filter(k =>
        k.pos === keyword.pos && k.word !== keyword.word &&
        k.word.endsWith("s") === keyword.word.endsWith("s") &&       // keep singular/plural agreement
        !sharesStem(k.word, keyword.word) &&
        !new RegExp("\\b" + k.word + "\\b", "i").test(sentence)
    )).slice(0, count).map(k => k.word);
}

function paragraphOf(index, total) {
    return index < Math.ceil(total / 2) ? "the first paragraph" : "the second paragraph";
}

// Texts of the reading questions; the Listening guide uses its own (GAMES-11)
const READING_WORDING = {
    maxQuestions: 7,
    main: "What is the text mainly about?",
    mainTip: "Read the first sentence again.",
    mainExplanation: "The text is about ",
    trueText: "Which sentence is TRUE according to the text?",
    trueTip: (index, total) => "Read " + paragraphOf(index, total) + " again and compare the sentences word by word.",
    clozeText: "According to the text, which word completes the sentence?",
    clozeTip: (index, total) => "Find this sentence in " + paragraphOf(index, total) + "."
};

function readingQuestions(article, passage, keywords, wording) {
    const words = wording || READING_WORDING;
    const questions = [];
    // Other topics must not share any word with the title ("Ocean" / "The ocean")
    const titleWords = article.title.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const otherTopics = shuffle(Object.values(TOPICS).map(t => capitalize(t.plain)))
        .filter(t => !t.toLowerCase().split(/\s+/).some(w => w.length > 2 && titleWords.some(tw => sharesStem(w, tw))))
        .slice(0, 2);
    const mainOptions = shuffle([article.title].concat(otherTopics));
    questions.push({
        order: -1,
        text: words.main,
        options: mainOptions,
        answer: mainOptions.indexOf(article.title),
        tip: words.mainTip,
        explanation: words.mainExplanation + article.title + "."
    });

    // Sentences in random order; questions are shown in the order of the text
    const usedSentences = new Set();
    const order = shuffle(passage.map((s, i) => i));
    for (const index of order) {
        if (questions.length >= words.maxQuestions) break;
        const sentence = passage[index];
        const inSentence = keywordsIn(sentence, keywords).sort((a, b) => (b.pos === "n") - (a.pos === "n"));
        const trueSentences = questions.filter(q => q.kind === "true").length;
        for (const keyword of inSentence) {
            const wrong = distractorsFor(keyword, sentence, keywords, 2);
            if (wrong.length < 2) continue;
            if (trueSentences < 2 && sentence.length <= 150 && questions.length >= 3) {
                const options = shuffle([sentence].concat(wrong.map(w => replaceWord(sentence, keyword.word, w))));
                questions.push({
                    kind: "true", order: index,
                    text: words.trueText,
                    options, answer: options.indexOf(sentence),
                    tip: words.trueTip(index, passage.length),
                    explanation: "\"" + sentence + "\""
                });
            } else {
                const options = shuffle([keyword.word].concat(wrong));
                questions.push({
                    kind: "cloze", order: index,
                    text: words.clozeText + "\n\"" + replaceWord(sentence, keyword.word, "______") + "\"",
                    options, answer: options.indexOf(keyword.word),
                    tip: words.clozeTip(index, passage.length),
                    explanation: "\"" + sentence + "\""
                });
            }
            usedSentences.add(index);
            break;
        }
    }
    questions.sort((a, b) => a.order - b.order);
    return questions.map((q, i) => ({ text: (i + 1) + ". " + q.text, options: q.options, answer: q.answer, tip: q.tip, explanation: q.explanation }));
}

function listeningItems(script, keywords, level) {
    const letters = "abcdefgh";
    const items = [];
    script.forEach(sentence => {
        if (items.length >= 4) return;
        const options = keywordsIn(sentence, keywords)
            .filter(k => k.word.length <= 10 && k.freq >= level.minFreq / 3)
            .sort((a, b) => (b.pos === "n") - (a.pos === "n") || b.freq - a.freq);
        if (!options.length) return;
        const keyword = options[0];
        items.push({
            text: letters[items.length] + ". " + replaceWord(sentence, keyword.word, "___"),
            answers: [keyword.word],
            tip: "Listen again. The word has " + keyword.word.length + " letters and starts with \"" + keyword.word[0] + "\"."
        });
    });
    return items;
}

async function generateReadingGuide(options) {
    const { grade, topic, onStatus } = options;
    const level = GRADE_LEVELS[grade];
    onStatus("Looking for an easy text about " + topic.name + "...");
    // Prefer easy sentences; relax the filter and try other searches if the text is too short
    let article = null;
    const attempts = [[topic.wiki, level.minFreq / 2], [topic.plain, level.minFreq / 2], [topic.wiki, level.minFreq / 6], [topic.plain, 0]];
    for (const [query, minFreq] of attempts) {
        article = await findArticle(query, 9, minFreq);
        if (article) break;
    }
    if (!article) throw new Error("I couldn't find a text about \"" + topic.name + "\". Try another topic!");

    // Short articles get a shorter reading, keeping at least 4 sentences for listening
    const passageLength = Math.max(5, Math.min(level.passageSentences, article.sentences.length - 4));
    const passage = article.sentences.slice(0, passageLength);
    const script = article.sentences.slice(passageLength, passageLength + 6);
    onStatus("Creating the questions...");
    const keywords = await analyzeKeywords(passage.concat(script));
    const questions = readingQuestions(article, passage, keywords);
    const listening = listeningItems(script, keywords, level);
    if (questions.length < 4 || listening.length < 3) {
        throw new Error("The text about \"" + topic.name + "\" was too short for a full guide. Try another topic!");
    }

    const half = Math.ceil(passage.length / 2);
    return {
        kind: "rl",
        school: "",
        title: "READING & LISTENING GUIDE",
        subtitle: level.label + " · " + topic.name,
        teacher: "",
        sections: [
            {
                group: "Reading",
                type: "choice",
                title: "1. Read the text and answer the questions. (one point each)",
                passage: [passage.slice(0, half).join(" "), passage.slice(half).join(" ")],
                source: "Text from Simple English Wikipedia: \"" + article.title + "\" (CC BY-SA).",
                items: questions
            },
            {
                group: "Listening",
                type: "fill",
                title: "2. Listen. Complete the information. (one point each)",
                script: script.join(" "),
                source: "Audio text from Simple English Wikipedia: \"" + article.title + "\" (CC BY-SA).",
                items: listening
            }
        ]
    };
}

// ---------- 2b. LISTENING (GAMES-11) ----------

// Where a sentence is in the audio, for the hints of the quiz
function audioPartOf(index, total) {
    if (index < total / 3) return "near the beginning of the audio";
    if (index < total * 2 / 3) return "in the middle of the audio";
    return "near the end of the audio";
}

const LISTENING_WORDING = {
    maxQuestions: 6,
    main: "What is the audio mainly about?",
    mainTip: "Listen to the first sentence again.",
    mainExplanation: "The audio is about ",
    trueText: "Which sentence is TRUE according to the audio?",
    trueTip: (index, total) => "Listen again: the answer is " + audioPartOf(index, total) + ".",
    clozeText: "Which word completes the sentence you heard?",
    clozeTip: (index, total) => "Listen again: this sentence is " + audioPartOf(index, total) + "."
};

// Each character of a dialogue gets its own pitch; the narrator keeps the normal one
const SPEAKER_PITCHES = [1.25, 0.8, 1.05];

function speakerPitches(speakers) {
    const names = speakers.filter((name, i) => name && speakers.indexOf(name) === i);
    return speakers.map(name => name ? SPEAKER_PITCHES[names.indexOf(name) % SPEAKER_PITCHES.length] : 1);
}

// Text of the audio for the answer key and the review: "Mia: Hello!" in dialogues
function audioScript(sentences, speakers) {
    return sentences.map((sentence, i) => (speakers[i] ? speakers[i] + ": " : "") + sentence).join(" ");
}

function listeningSections(audio, level, questions) {
    const shared = { sentences: audio.sentences, speakers: audio.speakers, pitches: speakerPitches(audio.speakers), rate: level.speechRate };
    return [
        Object.assign({
            group: "Listening",
            type: "listen",
            stage: 1,
            subtitles: true,
            title: "1. Listen and read the subtitles.",
            source: audio.source,
            items: []
        }, shared),
        Object.assign({
            group: "Listening",
            type: "listen",
            stage: 2,
            subtitles: false,
            title: "2. Listen again. This time there are no subtitles.",
            items: []
        }, shared),
        Object.assign({
            group: "Listening",
            type: "choice",
            stage: 3,
            title: "3. Listen and choose the correct answer. (one point each)",
            script: audioScript(audio.sentences, audio.speakers),
            source: audio.source,
            items: questions
        }, shared)
    ];
}

// Story or dialogue written for the game: the grade decides how many sentences are heard,
// and only the questions about those sentences are asked
function storyListening(topicKey, level) {
    const story = LISTENING_STORIES[topicKey];
    if (!story) throw new Error("Stories are only for the topics in the list. Choose a topic from the list or use Facts about the topic.");
    const lines = story.lines.slice(0, level.listeningSentences);
    const questions = story.questions.filter(q => q.line < lines.length).slice(0, LISTENING_WORDING.maxQuestions)
        .map((q, i) => ({
            text: (i + 1) + ". " + q.text,
            options: q.options.slice(),
            answer: q.answer,
            tip: "Listen again: the answer is " + audioPartOf(q.line, lines.length) + ".",
            explanation: "\"" + (lines[q.line].speaker ? lines[q.line].speaker + ": " : "") + lines[q.line].text + "\""
        }));
    return {
        title: story.title,
        audio: {
            sentences: lines.map(l => l.text),
            speakers: lines.map(l => l.speaker || ""),
            source: (story.kind === "dialogue" ? "Dialogue" : "Story") + " written for this game: \"" + story.title + "\"."
        },
        questions
    };
}

async function factsListening(topic, level, onStatus) {
    onStatus("Looking for an easy text about " + topic.name + "...");
    let article = null;
    const attempts = [[topic.wiki, level.minFreq / 2], [topic.plain, level.minFreq / 2], [topic.wiki, level.minFreq / 6], [topic.plain, 0]];
    for (const [query, minFreq] of attempts) {
        article = await findArticle(query, level.listeningSentences, minFreq);
        if (article) break;
    }
    if (!article) throw new Error("I couldn't find a text about \"" + topic.name + "\". Try another topic!");
    const sentences = article.sentences.slice(0, level.listeningSentences);
    onStatus("Creating the questions...");
    const keywords = await analyzeKeywords(sentences);
    const questions = readingQuestions(article, sentences, keywords, LISTENING_WORDING);
    if (questions.length < 5) {
        throw new Error("The text about \"" + topic.name + "\" was too short for a full quiz. Try another topic!");
    }
    return {
        title: article.title,
        audio: {
            sentences,
            speakers: sentences.map(() => ""),
            source: "Audio text from Simple English Wikipedia: \"" + article.title + "\" (CC BY-SA)."
        },
        questions
    };
}

async function generateListeningGuide(options) {
    const { grade, topic, audioType, onStatus } = options;
    const level = GRADE_LEVELS[grade];
    const built = audioType === "facts"
        ? await factsListening(topic, level, onStatus)
        : storyListening(topic.key, level);
    return {
        kind: "listening",
        audioType: audioType === "facts" ? "facts" : "story",
        school: "",
        title: "LISTENING GUIDE",
        subtitle: level.label + " · " + topic.name + " · " + built.title,
        teacher: "",
        sections: listeningSections(built.audio, level, built.questions)
    };
}

// ---------- 3. WRITING ----------

async function generateWritingGuide(options) {
    const { grade, topic, taskKey, onStatus } = options;
    const key = taskKey === "random" ? pickRandom(Object.keys(WRITING_TASKS)) : taskKey;
    const task = WRITING_TASKS[key];

    onStatus("Looking up useful words about " + topic.name + "...");
    const [pool, article] = await Promise.all([
        buildWordPool(topic, grade).catch(() => null),
        findArticle(topic.wiki, 2).catch(() => null)
    ]);
    // The most common of the most related words are the most useful for writing
    const usefulWords = pool
        ? pool.vocab.slice().sort((a, b) => (b.def.pos === "n") - (a.def.pos === "n") || a.relevance - b.relevance).slice(0, 20)
            .sort((a, b) => b.freq - a.freq).slice(0, 8).map(w => w.word)
        : [];

    return {
        kind: "writing",
        school: "",
        title: "WRITING GUIDE",
        subtitle: GRADE_LEVELS[grade].label + " · " + topic.name,
        teacher: "",
        sections: [
            {
                group: "Writing",
                type: "writing",
                title: task.prompt.replace("{topic}", topic.plain),
                remember: task.remember,
                lines: 8,
                usefulWords,
                fact: article ? article.sentences.slice(0, 2).join(" ") : "",
                source: article ? "Simple English Wikipedia: \"" + article.title + "\" (CC BY-SA)." : "",
                criteria: task.criteria.map(c => ({ check: c.check, text: c.text, points: 2 }))
            }
        ]
    };
}
