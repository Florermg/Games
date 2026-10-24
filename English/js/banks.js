/* =====================================================================
   GRAMMAR BANKS AND WRITING TASKS
   Grammar is not available in a public API, so new guides combine these
   templates at random (each guide is different). Vocabulary, spelling,
   reading and listening come from the APIs (see api.js).
   ===================================================================== */

const GRAMMAR_POINTS = {
    quantifiers: { label: "Quantifiers (all, most, some, a few, no)" },
    causative:   { label: "Causative verbs (have/get something done)" },
    ago:         { label: "Past simple + ago" },
    comparatives: { label: "Comparatives" }
};

// Each quantifier has three sentences; a guide uses one of each (like the demo)
const QUANTIFIER_BANK = {
    "all": [
        { text: "___ the students in my class brought a pencil case today. Everybody has one!", tip: "'Everybody' means 100% of the students." },
        { text: "I love ___ kinds of fruit. There isn't one I don't like!", tip: "'There isn't one I don't like' means there are no exceptions." },
        { text: "___ the lights in the house are on. Not one is off.", tip: "'Not one is off' means every light is on." }
    ],
    "most": [
        { text: "___ of my friends like pizza. Only Ana prefers salad.", tip: "Almost everybody, with one exception (Ana)." },
        { text: "___ of the books in our library are in English, but a small number are in Spanish.", tip: "A large part, but not all (a small number are different)." },
        { text: "___ students passed the test. Only two have to take it again.", tip: "Almost all of them passed: only two didn't." }
    ],
    "some": [
        { text: "___ people like cats, and others like dogs.", tip: "Look at the structure '___ ... and others ...'." },
        { text: "___ of my classmates walk to school, and others come by bus.", tip: "Look at the structure '___ ... and others ...'." },
        { text: "___ days are sunny, and other days are rainy.", tip: "Look at the structure '___ ... and other ...'." }
    ],
    "a few": [
        { text: "I only need ___ minutes to get ready. I'm very quick!", tip: "A small number of minutes." },
        { text: "I have ___ coins in my pocket, just three.", tip: "'Just three' is a small number." },
        { text: "Only ___ people went to the park because it was raining.", tip: "Because of the rain, the number of people was small." }
    ],
    "no": [
        { text: "There is ___ milk in the fridge. We need to buy some.", tip: "We need to buy it, so there isn't any." },
        { text: "The classroom is empty. There are ___ students here.", tip: "Empty means zero students." },
        { text: "I have ___ homework today, so I can play all afternoon!", tip: "If you can play all afternoon, you don't have any homework." }
    ]
};

const QUANTIFIER_EXPLANATIONS = {
    "all": "'All' is used when there are no exceptions.",
    "most": "'Most' means a large part of the group, but not everybody.",
    "some": "'Some' fits the pattern 'some ... and others ...'.",
    "a few": "'A few' is used for a small number of countable things.",
    "no": "'No' means zero: there isn't / there aren't any."
};

// Services for causative sentences: someone else does the action for us
const CAUSATIVE_SERVICES = [
    { pro: "The mechanic",          verb: "repairs",  past: "repaired",  participle: "repaired",  object: "car",      habit: "when it breaks" },
    { pro: "The hairdresser",       verb: "cuts",     past: "cut",       participle: "cut",       object: "hair",     habit: "every month" },
    { pro: "The dentist",           verb: "checks",   past: "checked",   participle: "checked",   object: "teeth",    habit: "every six months" },
    { pro: "The painter",           verb: "paints",   past: "painted",   participle: "painted",   object: "house",    habit: "every five years" },
    { pro: "The technician",        verb: "fixes",    past: "fixed",     participle: "fixed",     object: "computer", habit: "when it stops working" },
    { pro: "The photographer",      verb: "takes",    past: "took",      participle: "taken",     object: "photo",    habit: "every school year" },
    { pro: "The window cleaner",    verb: "cleans",   past: "cleaned",   participle: "cleaned",   object: "windows",  habit: "every week" },
    { pro: "The bike shop",         verb: "repairs",  past: "repaired",  participle: "repaired",  object: "bike",     habit: "when it gets a flat tire" },
    { pro: "The gardener",          verb: "cuts",     past: "cut",       participle: "cut",       object: "grass",    habit: "every two weeks" },
    { pro: "The eye doctor",        verb: "checks",   past: "checked",   participle: "checked",   object: "eyes",     habit: "once a year" },
    { pro: "The tailor",            verb: "makes",    past: "made",      participle: "made",      object: "curtains", habit: "for every new house" },
    { pro: "The car wash",          verb: "washes",   past: "washed",    participle: "washed",    object: "car",      habit: "every Saturday" }
];

// Who owns the object: "I had MY car repaired" / "My aunt had HER car repaired"
const CAUSATIVE_OWNERS = [
    { subject: "I",          possessive: "my",    owner: "my" },
    { subject: "I",          possessive: "my",    owner: "my" },
    { subject: "My aunt",    possessive: "her",   owner: "my aunt's" },
    { subject: "My brother", possessive: "his",   owner: "my brother's" },
    { subject: "My parents", possessive: "their", owner: "my parents'" },
    { subject: "We",         possessive: "our",   owner: "our" }
];

const CAUSATIVE_TIMES = ["yesterday", "last week", "last Saturday", "two days ago", "last month", "last year"];

// Verb phrases for "Write sentences with ago"
const AGO_PHRASES = [
    ["go", "to the zoo"], ["eat", "pizza for dinner"], ["visit", "our grandparents"], ["play", "soccer in the park"],
    ["watch", "a movie"], ["read", "a funny book"], ["buy", "new shoes"], ["write", "a letter"],
    ["clean", "the kitchen"], ["swim", "in the pool"], ["see", "a rainbow"], ["make", "a chocolate cake"],
    ["ride", "a horse"], ["drink", "orange juice"], ["study", "for the math test"], ["travel", "to Mexico City"],
    ["draw", "a picture of a dog"], ["win", "a soccer game"], ["lose", "the keys"], ["take", "a photo of the sunset"],
    ["wake", "up early"], ["get", "up late"], ["have", "breakfast together"], ["meet", "a famous singer"],
    ["call", "the doctor"], ["finish", "the science project"], ["plant", "a tree"], ["cook", "pasta"],
    ["dance", "at the party"], ["stop", "at the store"], ["build", "a sandcastle"], ["sing", "a song"],
    ["do", "the homework"], ["find", "a lost puppy"], ["fly", "a kite"], ["break", "a glass"]
];

const AGO_SUBJECTS = ["I", "We", "My sister", "My friends", "My dad", "They", "Our teacher"];
const AGO_TIMES = ["two days", "an hour", "three weeks", "ten minutes", "a month", "five years", "one week", "two hours", "a year"];

const IRREGULAR_PAST = {
    go: "went", see: "saw", eat: "ate", have: "had", make: "made", come: "came", take: "took", get: "got",
    give: "gave", run: "ran", swim: "swam", write: "wrote", drink: "drank", sing: "sang", find: "found",
    buy: "bought", bring: "brought", think: "thought", teach: "taught", catch: "caught", fly: "flew",
    drive: "drove", ride: "rode", speak: "spoke", break: "broke", choose: "chose", wake: "woke",
    forget: "forgot", begin: "began", grow: "grew", know: "knew", throw: "threw", draw: "drew",
    sleep: "slept", keep: "kept", feel: "felt", leave: "left", meet: "met", sit: "sat", stand: "stood",
    tell: "told", sell: "sold", send: "sent", spend: "spent", build: "built", lose: "lost", win: "won",
    read: "read", do: "did", put: "put", cut: "cut"
};

function regularPast(base) {
    if (base.endsWith("e")) return base + "d";
    if (/[^aeiou]y$/.test(base)) return base.slice(0, -1) + "ied";
    if (base.length <= 4 && endsWithCVC(base)) return base + base.slice(-1) + "ed";
    return base + "ed";
}

function pastSimple(base) {
    return IRREGULAR_PAST[base] || regularPast(base);
}

function pastTip(base) {
    if (IRREGULAR_PAST[base]) return "'" + base + "' is an irregular verb: " + base + " → " + IRREGULAR_PAST[base] + ".";
    if (base.endsWith("e")) return "Regular verb ending in -e: just add -d.";
    if (/[^aeiou]y$/.test(base)) return "Consonant + y: change the y to i and add -ed.";
    if (base.length <= 4 && endsWithCVC(base)) return "Short verb ending in consonant-vowel-consonant: double the last letter and add -ed.";
    return "Regular verb: add -ed.";
}

const COMPARATIVE_BANK = [
    { text: "A cheetah is ___ (fast) than a horse.", answer: "faster", tip: "Short adjective: add -er." },
    { text: "An elephant is ___ (big) than a dog.", answer: "bigger", tip: "Consonant-vowel-consonant: double the last letter and add -er." },
    { text: "My grandmother is ___ (old) than my mother.", answer: "older", tip: "Short adjective: add -er." },
    { text: "For me, math is ___ (easy) than science.", answer: "easier", tip: "Ending in consonant + y: change the y to i and add -er." },
    { text: "This book is ___ (interesting) than that one.", answer: "more interesting", tip: "Long adjective: use 'more'." },
    { text: "Today is ___ (hot) than yesterday.", answer: "hotter", tip: "Consonant-vowel-consonant: double the last letter and add -er." },
    { text: "My sister is ___ (happy) than me today.", answer: "happier", tip: "Ending in consonant + y: change the y to i and add -er." },
    { text: "A car is ___ (expensive) than a bike.", answer: "more expensive", tip: "Long adjective: use 'more'." },
    { text: "My new phone is ___ (good) than my old one.", answer: "better", tip: "'Good' is irregular." },
    { text: "The weather today is ___ (bad) than yesterday.", answer: "worse", tip: "'Bad' is irregular." },
    { text: "The Pacific Ocean is ___ (large) than the Atlantic Ocean.", answer: "larger", tip: "Ending in -e: just add -r." },
    { text: "A turtle is ___ (slow) than a rabbit.", answer: "slower", tip: "Short adjective: add -er." },
    { text: "This exercise is ___ (difficult) than the first one.", answer: "more difficult", tip: "Long adjective: use 'more'." },
    { text: "Winter is ___ (cold) than summer.", answer: "colder", tip: "Short adjective: add -er." },
    { text: "Your drawing is ___ (beautiful) than mine.", answer: "more beautiful", tip: "Long adjective: use 'more'." },
    { text: "A mountain is ___ (high) than a hill.", answer: "higher", tip: "Short adjective: add -er." },
    { text: "My backpack is ___ (heavy) than yours.", answer: "heavier", tip: "Ending in consonant + y: change the y to i and add -er." },
    { text: "Soccer is ___ (popular) than baseball in Mexico.", answer: "more popular", tip: "Long adjective: use 'more'." }
];

/* ---------- Writing tasks ----------
   {topic} is replaced with the topic. Every task has 5 criteria worth 2 points (total 10),
   like the demo. "check" names the automatic self-check used for each criterion. */
const WRITING_TASKS = {
    letter: {
        label: "Letter about a community event",
        prompt: "Write a letter to tell people about an event you are organizing to help your community. The event is about {topic}.",
        remember: [
            "Start and end your letter correctly.",
            "Include practical information about the event.",
            "Persuade readers to support the event.",
            "Use parentheses to add extra information to your sentences."
        ],
        criteria: [
            { check: "letterFormat", text: "Letter format: starts and ends the letter correctly (greeting and closing)." },
            { check: "practicalInfo", text: "Practical information: includes useful details about the event (what, when, where, or how to participate)." },
            { check: "persuasive", text: "Persuasive language: explains why people should support the event." },
            { check: "parentheses", text: "Parentheses: uses parentheses correctly to add extra information." },
            { check: "length", text: "Length and organization: writes a complete, clear letter using the 8 lines provided." }
        ]
    },
    email: {
        label: "Email to a friend",
        prompt: "Write an email to a friend. Tell them what you learned about {topic} and why it is interesting.",
        remember: [
            "Start with a friendly greeting and end with a closing.",
            "Use words about the topic.",
            "Ask your friend at least one question.",
            "Use parentheses to add extra information to your sentences."
        ],
        criteria: [
            { check: "letterFormat", text: "Email format: starts and ends the email correctly (greeting and closing)." },
            { check: "topicWords", text: "Content: uses vocabulary about the topic." },
            { check: "question", text: "Questions: asks the friend at least one question." },
            { check: "parentheses", text: "Parentheses: uses parentheses correctly to add extra information." },
            { check: "length", text: "Length and organization: writes a complete, clear email using the 8 lines provided." }
        ]
    },
    story: {
        label: "Short story",
        prompt: "Write a short story about {topic}. Begin with \"One day...\".",
        remember: [
            "Give your story a title.",
            "Use time words (first, then, after that, finally).",
            "Write in the past simple.",
            "Describe people and places with adjectives."
        ],
        criteria: [
            { check: "title", text: "Title: the story has a title." },
            { check: "sequence", text: "Sequence: uses time words to order the events." },
            { check: "pastTense", text: "Grammar: uses the past simple correctly." },
            { check: "adjectives", text: "Description: uses adjectives to describe." },
            { check: "length", text: "Length and organization: writes a complete, clear story using the 8 lines provided." }
        ]
    },
    opinion: {
        label: "Opinion paragraph",
        prompt: "Write your opinion: What can kids learn about {topic}, and why is it important? Give reasons.",
        remember: [
            "Say your opinion (I think... / In my opinion...).",
            "Give reasons with \"because\".",
            "Use words about the topic.",
            "Finish with a conclusion."
        ],
        criteria: [
            { check: "opinion", text: "Opinion: clearly says what they think." },
            { check: "reasons", text: "Reasons: explains the opinion with reasons (because, so, also)." },
            { check: "topicWords", text: "Vocabulary: uses words about the topic." },
            { check: "conclusion", text: "Conclusion: ends with a final sentence that sums up the opinion." },
            { check: "length", text: "Length and organization: writes a complete, clear paragraph using the 8 lines provided." }
        ]
    },
    invitation: {
        label: "Invitation",
        prompt: "Write an invitation to a school event about {topic}. Invite your classmates and their families.",
        remember: [
            "Start and end your invitation correctly.",
            "Say what, when and where.",
            "Persuade people to come.",
            "Use parentheses to add extra information to your sentences."
        ],
        criteria: [
            { check: "letterFormat", text: "Format: starts and ends the invitation correctly (greeting and closing)." },
            { check: "practicalInfo", text: "Practical information: says what, when, where and how to participate." },
            { check: "persuasive", text: "Persuasive language: explains why people should come." },
            { check: "parentheses", text: "Parentheses: uses parentheses correctly to add extra information." },
            { check: "length", text: "Length and organization: writes a complete, clear invitation using the 8 lines provided." }
        ]
    }
};

/* ---------- Automatic self-check for writing ----------
   Simple text rules that estimate each criterion (0, 1 or 2 points).
   It helps students improve their text; the teacher gives the final grade. */
const WRITING_CHECKS = {
    letterFormat(text) {
        const lines = text.trim().split(/\n+/).map(l => l.trim()).filter(Boolean);
        const greeting = lines.length && /^(dear|hi|hello|hey|good (morning|afternoon)|to (all|everyone|the))\b/i.test(lines[0]);
        const closing = lines.slice(-3).some(l => /^(sincerely|best wishes|best regards|regards|yours|love|thank you|thanks|see you|bye|cheers|your friend|hugs|with love)\b/i.test(l));
        const score = (greeting ? 1 : 0) + (closing ? 1 : 0);
        return { score, note: greeting && closing ? "Greeting and closing found." : !greeting ? "Start with a greeting, for example \"Dear neighbors,\"." : "End with a closing, for example \"Sincerely,\" and your name." };
    },
    practicalInfo(text) {
        const checks = [
            /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|tomorrow|next week|weekend|o'clock|\d{1,2}(:\d{2})?\s*(am|pm|a\.m\.|p\.m\.))\b/i,
            // "at Central Park", "in the school yard"...
            /\b(at|in)\b[^.!?\n]{0,30}\b(school|park|library|gym|center|centre|hall|street|community|playground|yard|plaza|auditorium|classroom|church|beach|square|garden)s?\b/i,
            /\b(bring|come|join|donate|sign up|register|call|contact|buy|help us|volunteer|participate)\b/i
        ];
        const found = checks.filter(r => r.test(text)).length;
        return { score: found >= 3 ? 2 : found >= 1 ? 1 : 0, note: found >= 3 ? "You included when, where and how to help." : "Add when (day/time), where (place) and how people can help." };
    },
    persuasive(text) {
        const found = (text.match(/\b(please|important|because|should|join us|don't miss|do not miss|amazing|fun|together|support|make a difference|everyone|help|great|wonderful|you can)\b/gi) || []).length;
        return { score: found >= 4 ? 2 : found >= 2 ? 1 : 0, note: found >= 4 ? "Very persuasive!" : "Explain why people should help: use words like please, important, because, together." };
    },
    parentheses(text) {
        const found = (text.match(/\([^()]{2,}\)/g) || []).length;
        return { score: found >= 2 ? 2 : found === 1 ? 1 : 0, note: found >= 2 ? "Good use of parentheses." : "Add extra information in parentheses, for example: \"on Friday (after school)\"." };
    },
    length(text) {
        const words = (text.match(/[A-Za-z']+/g) || []).length;
        const lines = text.split(/\n/).filter(l => l.trim()).length;
        const score = words >= 70 || (lines >= 8 && words >= 50) ? 2 : words >= 35 ? 1 : 0;
        return { score, note: "You wrote " + words + " words. " + (score === 2 ? "Great length!" : "Try to write at least 70 words (8 lines).") };
    },
    topicWords(text, context) {
        const words = (context.usefulWords || []).filter(w => new RegExp("\\b" + w + "\\w*\\b", "i").test(text));
        return { score: words.length >= 3 ? 2 : words.length >= 1 ? 1 : 0, note: words.length ? "Topic words used: " + words.join(", ") + "." : "Use some of the useful words in the box." };
    },
    question(text) {
        const found = (text.match(/\?/g) || []).length;
        return { score: found >= 2 ? 2 : found === 1 ? 1 : 0, note: found ? "You asked " + found + " question(s)." : "Ask your friend a question, for example \"Do you like...?\"." };
    },
    title(text) {
        const first = text.trim().split(/\n/)[0] || "";
        const ok = first.trim().split(/\s+/).length <= 8 && first.trim().length > 2 && !/[.,]$/.test(first.trim());
        return { score: ok ? 2 : 0, note: ok ? "Title: \"" + first.trim() + "\"." : "Write a short title on the first line." };
    },
    sequence(text) {
        const found = (text.match(/\b(first|then|next|after that|later|finally|suddenly|one day|in the end|at the end|before|after)\b/gi) || []).length;
        return { score: found >= 3 ? 2 : found >= 1 ? 1 : 0, note: found >= 3 ? "Good time words." : "Use time words: first, then, after that, finally." };
    },
    pastTense(text) {
        const irregular = new Set(Object.values(IRREGULAR_PAST).concat(["was", "were"]));
        const words = text.toLowerCase().match(/[a-z]+/g) || [];
        const found = words.filter(w => irregular.has(w) || (w.length > 4 && w.endsWith("ed"))).length;
        return { score: found >= 6 ? 2 : found >= 3 ? 1 : 0, note: found >= 6 ? "Good use of the past simple." : "Tell the story in the past: went, saw, played, was..." };
    },
    adjectives(text) {
        const common = /\b(big|small|little|beautiful|happy|sad|scary|funny|old|new|young|tall|short|amazing|great|wonderful|terrible|dark|bright|cold|hot|kind|brave|quiet|loud|strong|fast|slow|colorful|huge|tiny|delicious|friendly|interesting|exciting|nervous|excited|tired|clean|dirty|green|blue|red|yellow|white|black)\b/gi;
        const found = new Set((text.match(common) || []).map(w => w.toLowerCase())).size
            + (text.match(/\b\w+(ful|ous|ive|less)\b/gi) || []).length;
        return { score: found >= 4 ? 2 : found >= 2 ? 1 : 0, note: found >= 4 ? "Nice descriptions!" : "Describe with adjectives: big, colorful, scary, beautiful..." };
    },
    opinion(text) {
        const found = /\b(i think|in my opinion|i believe|i feel|for me)\b/i.test(text);
        return { score: found ? 2 : 0, note: found ? "Your opinion is clear." : "Start with \"I think...\" or \"In my opinion...\"." };
    },
    reasons(text) {
        const found = (text.match(/\b(because|so|also|for example|that's why|first|second)\b/gi) || []).length;
        return { score: found >= 3 ? 2 : found >= 1 ? 1 : 0, note: found >= 3 ? "Good reasons." : "Give more reasons with because, also, for example." };
    },
    conclusion(text) {
        const found = /\b(in conclusion|to sum up|finally|that's why|for these reasons|in the end)\b/i.test(text);
        return { score: found ? 2 : 0, note: found ? "Good conclusion." : "Finish with \"In conclusion,...\" or \"For these reasons,...\"." };
    }
};
