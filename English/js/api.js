/* =====================================================================
   PUBLIC APIs (free, no API key, work directly from the browser)
     - Datamuse:               words by topic, definitions, synonyms, frequency
     - Wiktionary REST API:    example sentences for vocabulary words
     - Simple English Wikipedia: easy texts for reading and listening
   Nothing is downloaded or saved: everything is requested live.
   ===================================================================== */

const DATAMUSE_URL = "https://api.datamuse.com/words";
const WIKTIONARY_URL = "https://en.wiktionary.org/api/rest_v1/page/definition/";
const SIMPLE_WIKI_URL = "https://simple.wikipedia.org/w/api.php";

// Word difficulty per grade, based on word frequency (occurrences per million words).
// Lower frequency = less common = harder word.
// listeningSentences and speechRate: length and voice speed of the Listening guide (GAMES-11)
const GRADE_LEVELS = {
    3: { label: "3rd Grade", minFreq: 12,  maxFreq: Infinity, maxLength: 8,  spellingMinLength: 4, passageSentences: 6,  listeningSentences: 5, speechRate: 0.8 },
    4: { label: "4th Grade", minFreq: 6,   maxFreq: Infinity, maxLength: 10, spellingMinLength: 5, passageSentences: 7,  listeningSentences: 6, speechRate: 0.85 },
    5: { label: "5th Grade", minFreq: 2.5, maxFreq: 250,      maxLength: 12, spellingMinLength: 6, passageSentences: 9,  listeningSentences: 7, speechRate: 0.9 },
    6: { label: "6th Grade", minFreq: 1,   maxFreq: 150,      maxLength: 13, spellingMinLength: 7, passageSentences: 11, listeningSentences: 8, speechRate: 0.95 }
};

// ml = "means like" query, trigger = words associated with it, describe = noun to find adjectives for,
// wiki = article to search in Simple English Wikipedia
const TOPICS = {
    environment: { label: "Environment & Nature 🌱",  plain: "the environment",   ml: "environment nature conservation", trigger: "nature",   describe: "forest",     wiki: "environment" },
    jobs:        { label: "Jobs & Professions 👩‍⚕️",   plain: "jobs",              ml: "jobs professions occupations",  trigger: "job",        describe: "worker",     wiki: "occupation" },
    animals:     { label: "Animals 🐾",               plain: "animals",           ml: "animals wildlife",              trigger: "animal",     describe: "animal",     wiki: "animal" },
    health:      { label: "Health & the Body 🩺",     plain: "health",            ml: "health body medicine",          trigger: "health",     describe: "body",       wiki: "health" },
    food:        { label: "Food & Cooking 🍎",        plain: "food",              ml: "food cooking",                  trigger: "food",       describe: "food",       wiki: "food" },
    sports:      { label: "Sports ⚽",                plain: "sports",            ml: "sports athletes games",         trigger: "sport",      describe: "player",     wiki: "sport" },
    science:     { label: "Science 🔬",               plain: "science",           ml: "science experiment laboratory", trigger: "science",    describe: "experiment", wiki: "science" },
    space:       { label: "Space & Planets 🪐",       plain: "space",             ml: "outer space planets astronomy", trigger: "planet",     describe: "planet",     wiki: "solar system" },
    weather:     { label: "Weather 🌦️",               plain: "the weather",       ml: "weather climate",               trigger: "weather",    describe: "weather",    wiki: "weather" },
    feelings:    { label: "Feelings & Emotions 😊",   plain: "feelings",          ml: "feelings emotions",             trigger: "emotion",    describe: "person",     wiki: "emotion" },
    school:      { label: "School 🏫",                plain: "school",            ml: "school classroom education",    trigger: "school",     describe: "student",    wiki: "school" },
    arts:        { label: "Music & Art 🎨",           plain: "music and art",     ml: "music art",                     trigger: "art",        describe: "music",      wiki: "art" },
    technology:  { label: "Technology 💻",            plain: "technology",        ml: "technology computers",          trigger: "computer",   describe: "machine",    wiki: "computer" },
    travel:      { label: "Travel & Places 🌎",       plain: "travel",            ml: "travel places city",            trigger: "travel",     describe: "city",       wiki: "tourism" },
    home:        { label: "Family & Home 🏠",         plain: "family and home",   ml: "family home house",             trigger: "house",      describe: "house",      wiki: "family" },
    ocean:       { label: "Ocean Life 🐠",            plain: "the ocean",         ml: "ocean sea marine life",         trigger: "ocean",      describe: "ocean",      wiki: "ocean" },
    recycling:   { label: "Recycling ♻️",             plain: "recycling",         ml: "recycling waste reuse",         trigger: "recycling",  describe: "material",   wiki: "recycling" },
    community:   { label: "Community & Volunteering 🤝", plain: "helping your community", ml: "community volunteer charity", trigger: "community", describe: "community", wiki: "charity" }
};

const POS_NAMES = { n: "noun", v: "verb", adj: "adjective", adv: "adverb" };

// Definition labels that are not suitable for kids or for a quiz
const BAD_LABELS = /\b(obsolete|archaic|dated|slang|vulgar|offensive|derogatory|rare|dialect|dialectal|nonstandard|informal|colloquial|euphemistic|sexual|obscene|pejorative|historical|poetic|proscribed|uncommon|nautical|heraldry|chiefly)\b/i;
const BAD_STARTS = /^(alternative|plural of|simple past|past participle|present participle|third-person|abbreviation|initialism|acronym|misspelling|eye dialect|a surname|a male given name|a female given name|a unisex given name|a placename|a city|a town|a village|a river|a county|senses|en)\b/i;
const UNSAFE = /\b(sex\w*|drugs?|kill\w*|murder\w*|weapons?|guns?|alcohol\w*|beer|wine|nude|naked|genital\w*|suicide|bombs?|prostitut\w*|rape\w*|drunk\w*|cigarettes?|tobacco|corpses?|hell|damn\w*|intoxica\w*|penis|vagina|breasts?|arous\w*|erotic\w*|lust\w*|seduc\w*|porn\w*|torture\w*|terroris\w*|nazi\w*|slave\w*)\b/i;

// ---------- Small helpers ----------

function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isVowel(letter) {
    return "aeiou".includes(letter);
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function decodeEntities(text) {
    return text
        .replace(/&nbsp;/g, " ")
        .replace(/&quot;/g, "\"")
        .replace(/&#0?39;|&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#(\d+);/g, (m, code) => String.fromCharCode(Number(code)))
        .replace(/&amp;/g, "&");
}

// Consonant-vowel-consonant ending (stop, big) -> double the last letter
function endsWithCVC(word) {
    const [a, b, c] = word.slice(-3);
    return word.length >= 3 && !isVowel(a) && isVowel(b) && !isVowel(c) && !"wxy".includes(c);
}

function sharesStem(a, b) {
    const size = Math.min(4, a.length, b.length);
    return a.slice(0, size) === b.slice(0, size);
}

// ---------- Datamuse ----------

const apiCache = new Map();

function fetchJson(url) {
    if (!apiCache.has(url)) {
        const request = fetch(url).then(response => {
            if (response.status === 429) throw new Error("The online dictionary is busy right now. Please wait a minute and try again.");
            if (!response.ok) throw new Error("API error " + response.status);
            return response.json();
        });
        apiCache.set(url, request);
        request.catch(() => apiCache.delete(url));
    }
    return apiCache.get(url);
}

function datamuse(params) {
    return fetchJson(DATAMUSE_URL + "?" + new URLSearchParams(params).toString());
}

function parseEntry(entry) {
    const tags = entry.tags || [];
    const freqTag = tags.find(t => t.startsWith("f:"));
    return {
        word: entry.word,
        freq: freqTag ? parseFloat(freqTag.slice(2)) : 0,
        syllables: entry.numSyllables || 0,
        pos: tags.filter(t => POS_NAMES[t]),
        isProper: tags.includes("prop"),
        headword: entry.defHeadword || entry.word,
        defs: (entry.defs || []).map(d => {
            const parts = d.split("\t");
            return { pos: parts[0], text: (parts[1] || "").trim() };
        })
    };
}

function isCleanWord(word, maxLength) {
    return /^[a-z]{3,}$/.test(word) && word.length <= maxLength && !UNSAFE.test(word);
}

function cleanDefinition(text, word) {
    const labels = (text.match(/^(\([^)]*\)\s*)+/) || [""])[0];
    if (BAD_LABELS.test(labels)) return null;
    let def = text.slice(labels.length).replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
    if (BAD_STARTS.test(def) || UNSAFE.test(def)) return null;
    // Keep only the first part of long definitions ("Curious; inquisitive; nosy" -> "Curious")
    const firstPart = def.split(";")[0].trim();
    if (firstPart.length >= 15) def = firstPart;
    if (def.length < 12 || def.length > 110) return null;
    // Skip definitions that give the answer away
    if (def.toLowerCase().includes(word.slice(0, Math.max(4, word.length - 2)))) return null;
    return def.replace(/,? (especially|e\.g\.|such as|etc)\.?$/i, "").replace(/\.$/, "");
}

// Uses the first clean definition among the main senses of a word
function pickDefinition(entry) {
    for (const d of entry.defs.slice(0, 3)) {
        if (!POS_NAMES[d.pos]) continue;
        const text = cleanDefinition(d.text, entry.word);
        if (text) return { pos: d.pos, text: text };
    }
    return null;
}

async function wordFrequency(word) {
    const result = await datamuse({ sp: word, md: "f", max: 1 });
    if (!result.length || result[0].word !== word) return 0;
    return parseEntry(result[0]).freq;
}

// The words most related to the topic first (shuffled), then the rest
function topicCandidates(list) {
    const sorted = list.slice().sort((a, b) => a.relevance - b.relevance);
    return shuffle(sorted.slice(0, 45)).concat(shuffle(sorted.slice(45)));
}

// Vocabulary of a topic filtered by grade level
async function buildWordPool(topic, grade) {
    const level = GRADE_LEVELS[grade];
    const responses = await Promise.allSettled([
        datamuse({ ml: topic.ml, topics: topic.trigger, md: "dfps", max: 300 }),
        datamuse({ rel_trg: topic.trigger, md: "dfps", max: 200 }),
        datamuse({ rel_jjb: topic.describe, md: "dfps", max: 150 })
    ]);
    if (responses.every(r => r.status === "rejected")) {
        throw new Error("Could not reach the dictionary API. Check your internet connection.");
    }

    const topicWords = topic.ml.toLowerCase().split(/\s+/);
    const pool = new Map();
    responses.forEach((response, index) => {
        if (response.status !== "fulfilled") return;
        response.value.forEach((raw, position) => {
            const entry = parseEntry(raw);
            // rel_jjb returns adjectives that describe the topic
            if (index === 2 && !entry.pos.length) entry.pos = ["adj"];
            if (pool.has(entry.word) || entry.isProper || entry.headword !== entry.word) return;
            if (!isCleanWord(entry.word, level.maxLength)) return;
            if (topicWords.some(t => sharesStem(t, entry.word) && entry.word.length <= t.length + 1)) return;
            // 0 = most related to the topic, 1 = least related
            entry.relevance = position / response.value.length;
            entry.def = pickDefinition(entry);
            pool.set(entry.word, entry);
        });
    });

    const allWords = Array.from(pool.values());
    // Relax the grade filter if the topic has few words
    let minFreq = level.minFreq;
    let maxFreq = level.maxFreq;
    let vocab = [];
    for (let round = 0; round < 4; round++) {
        vocab = allWords.filter(w => w.def && w.freq >= minFreq && w.freq <= maxFreq);
        if (vocab.length >= 30) break;
        minFreq = minFreq / 2;
        maxFreq = Infinity;
    }
    return { level, vocab, allWords };
}

// ---------- Spelling ----------

function generateMisspellings(word) {
    const results = new Set();
    const add = w => { if (w !== word && /^[a-z]{3,}$/.test(w)) results.add(w); };
    const swaps = [
        ["ie", "ei"], ["ei", "ie"], ["ph", "f"], ["ck", "k"], ["c", "s"], ["s", "c"], ["tion", "sion"],
        ["sion", "tion"], ["ous", "us"], ["ful", "full"], ["able", "ible"], ["ible", "able"], ["ence", "ance"],
        ["ance", "ence"], ["er", "or"], ["or", "er"], ["al", "le"], ["le", "el"], ["gh", ""], ["wh", "w"], ["kn", "n"],
        ["ly", "li"], ["y", "ie"], ["y", "i"]
    ];
    swaps.forEach(([from, to]) => {
        const i = word.indexOf(from, 1);
        if (i > 0) add(word.slice(0, i) + to + word.slice(i + from.length));
    });
    const vowelSwaps = { a: "e", e: "i", i: "e", o: "u", u: "o" };
    for (let i = 1; i < word.length - 1; i++) {
        const c = word[i];
        if (word[i + 1] === c) {
            add(word.slice(0, i) + word.slice(i + 1));                    // remove a double letter
        } else if (!isVowel(c) && !"hwy".includes(c) && word[i - 1] !== c) {
            add(word.slice(0, i) + c + word.slice(i));                    // double a single consonant
        }
        if (isVowel(c)) add(word.slice(0, i) + vowelSwaps[c] + word.slice(i + 1));
    }
    if (word.endsWith("e")) add(word.slice(0, -1));
    return Array.from(results);
}

// True when every longer word of the sentence is common enough for the grade
async function isEasySentence(sentence, minFreq, ignoreWord) {
    const words = Array.from(new Set((sentence.toLowerCase().match(/[a-z]{5,}/g) || []).filter(w => w !== ignoreWord)));
    const frequencies = await Promise.all(words.map(w => wordFrequency(w).catch(() => 0)));
    return frequencies.every(f => f >= minFreq);
}

// Misspellings that are not real English words
async function fakeSpellings(word, count) {
    const result = [];
    for (const candidate of shuffle(generateMisspellings(word))) {
        if (result.length === count) break;
        if ((await wordFrequency(candidate)) < 0.15) result.push(candidate);
    }
    return result.length === count ? result : null;
}

// ---------- Wiktionary: example sentences ----------

// Returns { sentence: "He donated half his earnings to ___ .", answer: "charity" } or null
async function exampleSentence(word) {
    let data;
    try {
        data = await fetchJson(WIKTIONARY_URL + encodeURIComponent(word));
    } catch (e) {
        return null;
    }
    const senses = (data.en || []).flatMap(entry => entry.definitions || []);
    // Only the main senses: later senses are often unusual ("magazine" = a store for ammunition)
    for (const sense of senses.slice(0, 2)) {
        for (const html of (sense.examples || [])) {
            const bold = html.match(/<b>([^<]+)<\/b>/g) || [];
            if (bold.length !== 1) continue;
            const answer = decodeEntities(bold[0].replace(/<\/?b>/g, "")).trim();
            if (!/^[A-Za-z]+$/.test(answer) || !sharesStem(answer.toLowerCase(), word)) continue;
            const sentence = decodeEntities(html.replace(/<b>[^<]+<\/b>/, "___").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
            if (sentence.length < 25 || sentence.length > 110) continue;
            // Long words usually mean a sentence that is too difficult for kids
            if ((sentence.match(/[A-Za-z]{11,}/g) || []).some(w => w.toLowerCase() !== answer.toLowerCase())) continue;
            if (!/^[A-Z"]/.test(sentence) || !/[.!?]"?$/.test(sentence) || UNSAFE.test(sentence)) continue;
            if (/[‘-‟]{2,}|\d{3,}|[;:]/.test(sentence)) continue;
            return { sentence: sentence, answer: answer.toLowerCase() };
        }
    }
    return null;
}

// ---------- Simple English Wikipedia: texts ----------

async function searchWikiTitles(query) {
    const data = await fetchJson(SIMPLE_WIKI_URL + "?" + new URLSearchParams({
        action: "query", list: "search", srsearch: query, srlimit: 3, format: "json", origin: "*"
    }));
    return (data.query.search || []).map(r => r.title);
}

async function wikiArticle(title) {
    const data = await fetchJson(SIMPLE_WIKI_URL + "?" + new URLSearchParams({
        action: "query", prop: "extracts", explaintext: 1, exsectionformat: "plain",
        titles: title, redirects: 1, format: "json", origin: "*"
    }));
    const page = Object.values(data.query.pages)[0];
    return { title: page.title, text: page.extract || "" };
}

// Splits an article into clean, kid-friendly sentences
function articleSentences(text) {
    // Some articles miss the space after a period ("Ocean.The largest")
    const paragraphs = text.replace(/([a-z])\.([A-Z][a-z])/g, "$1. $2").split(/\n+/).filter(p => /[.!?]$/.test(p.trim()) && p.length > 60);
    const sentences = [];
    paragraphs.forEach(p => {
        p.replace(/\s*\([^)]*\)/g, "")
            .split(/(?<=[.!?])\s+(?=[A-Z])/)
            .forEach(s => {
                const clean = s.replace(/\s+/g, " ").trim();
                if (clean.length < 30 || clean.length > 190) return;
                if (UNSAFE.test(clean) || /[^\x00-\x7F’]/.test(clean)) return;
                // Skip technical sentences: acronyms, abbreviations, quotes, big numbers, very long words
                if (/\b[A-Z]{2,}\b|e\.g\.|i\.e\.|etc\.|"|\d[\d,.]{2,}|[A-Za-z]{12,}/.test(clean)) return;
                if (/^(It|This|These|They|He|She)\b/.test(clean) && !sentences.length) return; // the first sentence must name the topic
                sentences.push(clean);
            });
    });
    return sentences;
}

// Finds an article about the topic with enough easy sentences for reading and listening
async function findArticle(query, minSentences, minFreq) {
    const titles = await searchWikiTitles(query);
    for (const title of titles) {
        const article = await wikiArticle(title);
        let sentences = articleSentences(article.text).slice(0, 30);
        if (minFreq) {
            const easy = await Promise.all(sentences.map(s => isEasySentence(s, minFreq)));
            sentences = sentences.filter((s, i) => easy[i]);
        }
        if (sentences.length >= minSentences) return { title: article.title, sentences };
    }
    return null;
}

// ---------- Speech (the browser reads aloud; no audio files) ----------

const Speech = {
    voice: null,
    // Language of the voice: campos/Guia5.html changes it to Spanish (GAMES-17)
    lang: "en-US",
    // Changes on every cancel, so the events of a stopped reading are ignored
    token: 0,
    // Chrome loses the events of utterances it garbage-collects: keep them here
    queue: [],

    supported() {
        return typeof window !== "undefined" && "speechSynthesis" in window;
    },

    pickVoice() {
        const voices = window.speechSynthesis.getVoices();
        const base = this.lang.slice(0, 2);
        // Android names the languages with "_" (es_MX)
        const sameLang = v => v.lang.replace("_", "-") === this.lang;
        this.voice = (this.lang === "en-US" && voices.find(v => sameLang(v) && /samantha|google us|jenny|aria/i.test(v.name)))
            || voices.find(sameLang)
            || voices.find(v => v.lang.startsWith(base))
            || null;
    },

    utterance(text, rate, pitch) {
        if (!this.voice) this.pickVoice();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.lang;
        if (this.voice) utterance.voice = this.voice;
        utterance.rate = rate || 0.9;
        if (pitch) utterance.pitch = pitch;
        return utterance;
    },

    cancel() {
        this.token++;
        this.queue = [];
        window.speechSynthesis.cancel();
    },

    speak(text, rate) {
        if (!this.supported()) return false;
        this.cancel();
        window.speechSynthesis.speak(this.utterance(text, rate));
        return true;
    },

    // Reads the sentences one after another (GAMES-11). onSentence(i) runs when sentence i
    // starts (the subtitles follow it) and onEnd when the last one ends. pitches: optional,
    // one per sentence, so each character of a dialogue sounds different.
    speakSequence(sentences, rate, onSentence, onEnd, pitches) {
        if (!this.supported()) return false;
        this.cancel();
        const token = this.token;
        sentences.forEach((sentence, i) => {
            const utterance = this.utterance(sentence, rate, pitches && pitches[i]);
            utterance.onstart = () => { if (token === this.token && onSentence) onSentence(i); };
            if (i === sentences.length - 1) {
                utterance.onend = () => { if (token === this.token && onEnd) onEnd(); };
            }
            this.queue.push(utterance);
            window.speechSynthesis.speak(utterance);
        });
        return true;
    },

    stop() {
        if (this.supported()) this.cancel();
    }
};

if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => Speech.pickVoice();
}
