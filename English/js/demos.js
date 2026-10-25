/* =====================================================================
   DEMO GUIDES
   The three 1st Trimester guides, exactly as they appear in the PDFs
   of the "documentacion" folder. Generated guides follow this same format.

   Section types:
     bank      - sentences with a blank (___) and a word bank to choose from
     rewrite   - rewrite/write a full sentence (typed answer)
     fill      - sentences with a blank (___) to type in (used for listening)
     match     - match terms with lettered definitions
     choice    - multiple choice a) b) c) (optional reading passage)
     dictation - listen to a word and type it
     writing   - free writing with a checklist and criteria
   ===================================================================== */

const DEMO_GUIDES = {
    gvs: {
        kind: "gvs",
        school: "",
        title: "GRAMMAR, VOCABULARY & SPELLING GUIDE",
        subtitle: "1st Trimester - 5th Grade",
        teacher: "Aurora Corante",
        sections: [
            {
                group: "Grammar",
                type: "bank",
                title: "1. Complete the sentences using <i>all</i>, <i>most</i>, <i>some</i>, <i>a few</i>, or <i>no</i>. (one point each)",
                bank: ["all", "most", "some", "a few", "no"],
                items: [
                    {
                        text: "___ of the children in my class walk or ride their bikes to school. Only one or two come by car.",
                        answers: ["most"],
                        tip: "Almost all of them do, but there are small exceptions (only one or two come by car).",
                        explanation: "'Most' means a large part of the group, leaving room for the few who come by car."
                    },
                    {
                        text: "___ my friends love soccer. I don't know anyone who doesn't like it!",
                        answers: ["all"],
                        tip: "'I don't know anyone who doesn't like it!' means 100% of them love it.",
                        explanation: "'All' is used when there are no exceptions in the group."
                    },
                    {
                        text: "My math homework today won't even take five minutes. I just have ___ math problems.",
                        answers: ["few"],
                        tip: "If it takes less than five minutes, there is a small number of problems.",
                        explanation: "'A few' is used for a small number of countable things."
                    },
                    {
                        text: "___ students prefer art class, and others prefer music class.",
                        answers: ["some"],
                        tip: "Look at the structure '___ ... and others ...'.",
                        explanation: "'Some' fits the pattern 'some ... and others ...'."
                    },
                    {
                        text: "We don't have public transportation in my town. Because there are ___ buses, we have to use the car.",
                        answers: ["no"],
                        tip: "There is no public transportation, so the number of buses is zero.",
                        explanation: "'No' means zero: there aren't any buses."
                    }
                ]
            },
            {
                group: "Grammar",
                type: "rewrite",
                title: "2. Rewrite the sentences using Causative Verbs. (one point each)",
                items: [
                    {
                        text: "My car was very dirty, so someone washed it yesterday.",
                        answers: causativeAnswers("I", "my", "car", "washed", "yesterday", "past"),
                        tip: "Past causative: subject + had + object + past participle.",
                        explanation: "I had my car washed yesterday."
                    },
                    {
                        text: "The hairdresser cuts my hair when it gets too long.",
                        answers: causativeAnswers("I", "my", "hair", "cut", "when it gets too long", "present"),
                        tip: "It happens regularly, so use the present: subject + get/have + object + past participle.",
                        explanation: "I get my hair cut when it gets too long."
                    },
                    {
                        text: "Last year, someone painted my aunt's house.",
                        answers: causativeAnswers("My aunt", "her", "house", "painted", "last year", "past"),
                        tip: "The subject is 'my aunt' and it happened last year, so use 'had'.",
                        explanation: "My aunt had her house painted last year."
                    },
                    {
                        text: "My computer didn't work, so someone fixed it.",
                        answers: causativeAnswers("I", "my", "computer", "fixed", "", "past"),
                        tip: "You didn't fix it yourself: subject + had + my computer + past participle.",
                        explanation: "I had my computer fixed."
                    },
                    {
                        text: "The photographer took my brother's photo at school last Friday.",
                        answers: causativeAnswers("My brother", "his", "photo", "taken", "at school last Friday", "past")
                            .concat(["Last Friday, my brother had his photo taken at school.", "Last Friday, my brother got his photo taken at school."]),
                        tip: "The past participle of 'take' is 'taken'. Start with 'My brother had his photo...'.",
                        explanation: "My brother had his photo taken at school last Friday."
                    }
                ]
            },
            {
                group: "Grammar",
                type: "rewrite",
                title: "3. Write sentences with <i>ago</i> and the correct form of the verbs. (one point each)",
                items: [
                    {
                        text: "I / go / Paris / two years",
                        answers: ["I went to Paris two years ago."],
                        tip: "The past of 'go' is irregular. Remember 'to' before the place and 'ago' at the end.",
                        explanation: "I went to Paris two years ago."
                    },
                    {
                        text: "I / finish my homework / an hour",
                        answers: ["I finished my homework an hour ago."],
                        tip: "'Finish' is a regular verb: add -ed.",
                        explanation: "I finished my homework an hour ago."
                    },
                    {
                        text: "We / see the movie / three weeks",
                        answers: ["We saw the movie three weeks ago."],
                        tip: "The past of 'see' is irregular.",
                        explanation: "We saw the movie three weeks ago."
                    },
                    {
                        text: "I / go swimming in the ocean / one week",
                        answers: ["I went swimming in the ocean one week ago.", "I went swimming in the ocean a week ago."],
                        tip: "Change only 'go' to the past. 'Swimming' stays the same.",
                        explanation: "I went swimming in the ocean one week ago."
                    },
                    {
                        text: "My brother / wake up / ten minutes",
                        answers: ["My brother woke up ten minutes ago."],
                        tip: "The past of 'wake' is irregular: wake → woke.",
                        explanation: "My brother woke up ten minutes ago."
                    }
                ]
            },
            {
                group: "Vocabulary",
                type: "match",
                title: "2. Match the words and the definitions. (one point each)",
                definitions: [
                    { letter: "a", text: "someone who teaches a sport or activity" },
                    { letter: "b", text: "someone who receives medical treatment" },
                    { letter: "c", text: "someone very good at sports" },
                    { letter: "d", text: "someone who writes music" },
                    { letter: "e", text: "someone who makes art from materials like wood" },
                    { letter: "f", text: "a student studying for a college degree" },
                    { letter: "g", text: "a lot of people in one place" },
                    { letter: "h", text: "someone who designs machines, roads, etc." },
                    { letter: "i", text: "a doctor for animals" }
                ],
                items: [
                    { text: "sculptor", answers: ["e"], tip: "A sculptor works with stone or wood." },
                    { text: "veterinarian", answers: ["i"], tip: "Think about pets and animal clinics." },
                    { text: "instructor", answers: ["a"], tip: "An instructor gives lessons, for example in swimming." },
                    { text: "composer", answers: ["d"], tip: "Think about symphonies and musical notes." },
                    { text: "undergraduate", answers: ["f"], tip: "This person is studying at a university." },
                    { text: "engineer", answers: ["h"], tip: "Engineers plan bridges, roads and machines." },
                    { text: "athlete", answers: ["c"], tip: "Think about the Olympic Games." },
                    { text: "patient", answers: ["b"], tip: "This person goes to the doctor or the hospital." },
                    { text: "crowd", answers: ["g"], tip: "Think about a stadium full of people." }
                ]
            },
            {
                group: "Vocabulary",
                type: "bank",
                title: "1. Choose the correct words to complete the sentences. (one point each)",
                bank: ["conservation", "volunteer", "environment", "charity", "inspire", "vaccinations", "disease", "germs", "international"],
                items: [
                    {
                        text: "My uncle is very interested in ___ .",
                        answers: ["conservation"],
                        tip: "A word about protecting nature.",
                        explanation: "'Conservation' is the protection of nature and the environment."
                    },
                    {
                        text: "He's a member of a ___ that does a lot of work in countries around the world.",
                        answers: ["charity"],
                        tip: "An organization that helps people who need it.",
                        explanation: "A 'charity' is an organization that helps people in need."
                    },
                    {
                        text: "Last summer, he spent a month in West Africa helping to protect the ___ there.",
                        answers: ["environment"],
                        tip: "The natural world: land, water, plants and animals.",
                        explanation: "The 'environment' is the natural world around us."
                    },
                    {
                        text: "He got several ___ before he went, to protect his health.",
                        answers: ["vaccinations"],
                        tip: "Injections that protect you from diseases.",
                        explanation: "'Vaccinations' protect your health against diseases."
                    }
                ]
            },
            {
                group: "Spelling",
                type: "dictation",
                title: "Spelling Dictation:",
                items: [
                    { text: "comfortably", answers: ["comfortably"], tip: "comfort + -ably." },
                    { text: "unhappy", answers: ["unhappy"], tip: "un- + happy (double p)." },
                    { text: "unicellular", answers: ["unicellular"], tip: "uni- + cellular (double l)." },
                    { text: "totally", answers: ["totally"], tip: "total + -ly (double l)." },
                    { text: "untrue", answers: ["untrue"], tip: "un- + true." }
                ]
            },
            {
                group: "Spelling",
                type: "choice",
                title: "Circle the correct Spelling word:",
                inline: true,
                items: [
                    { text: "", options: ["comfortably", "confortablie", "comfortabli"], answer: 0, tip: "Root 'comfort' + suffix '-ably'.", explanation: "comfortably" },
                    { text: "", options: ["unhapy", "unhappy", "unhappi"], answer: 1, tip: "Prefix 'un-' + 'happy' (double p, y at the end).", explanation: "unhappy" },
                    { text: "", options: ["unicellular", "unisellular", "unicelullar"], answer: 0, tip: "Prefix 'uni-' + 'cellular' (c, double l).", explanation: "unicellular" },
                    { text: "", options: ["totalli", "totaly", "totally"], answer: 2, tip: "'total' + '-ly' = double l.", explanation: "totally" },
                    { text: "", options: ["untrue", "untruu", "untruie"], answer: 0, tip: "Prefix 'un-' + 'true'.", explanation: "untrue" }
                ]
            }
        ]
    },

    rl: {
        kind: "rl",
        school: "Colegio Reims School year 2026-2027",
        title: "READING & LISTENING GUIDE",
        subtitle: "1st Trimester - 5th Grade",
        teacher: "Aurora Corante",
        sections: [
            {
                group: "Reading",
                type: "choice",
                title: "1. Read the text and answer the questions. (one point each)",
                passage: [
                    "Jordan Jacobs is a young sculptor. At an early age, Jordan was already very creative. He was drawing and painting in his free time. One day, he noticed how much his parents recycled. He decided to start making sculptures out of the recyclable materials. Soon, he started doing the same at school. The students and teachers loved his sculptures. They put them on display at the front of the school.",
                    "A journalist from the local newspaper came to interview Jordan about his sculptures. Then, Jordan appeared in the newspaper and became a local celebrity. Other schools in the town have been inspired by Jordan and have started using recyclable materials to make their own art. Jordan says he's very happy that people are using recyclable materials in new ways and that children in his town can develop and show their creativity."
                ],
                items: [
                    {
                        text: "1. What did Jordan like doing when he was a child?",
                        options: ["He liked making sculptures.", "He liked drawing and painting.", "He liked recycling."],
                        answer: 1,
                        tip: "Read the first lines: what was he doing in his free time?",
                        explanation: "\"He was drawing and painting in his free time.\""
                    },
                    {
                        text: "2. What gave him the idea of making his first sculpture?",
                        options: ["He noticed that his parents recycled a lot of things.", "His parents suggested it.", "He had become bored with drawing and painting."],
                        answer: 0,
                        tip: "Look for 'One day, he noticed...'.",
                        explanation: "\"One day, he noticed how much his parents recycled.\""
                    },
                    {
                        text: "3. Where did Jordan make his sculptures?",
                        options: ["at home", "at school", "at home and at school"],
                        answer: 2,
                        tip: "He started with his parents' recycling... and then 'he started doing the same at school'.",
                        explanation: "He started at home and soon did the same at school."
                    },
                    {
                        text: "4. How did Jordan become famous?",
                        options: ["A journalist interviewed him for a newspaper.", "His teachers told everyone about him.", "He was on TV."],
                        answer: 0,
                        tip: "Read the second paragraph.",
                        explanation: "\"A journalist from the local newspaper came to interview Jordan...\""
                    },
                    {
                        text: "5. Who was inspired by Jordan's sculptures?",
                        options: ["his parents", "a journalist", "other schools"],
                        answer: 2,
                        tip: "Look for the word 'inspired' in the text.",
                        explanation: "\"Other schools in the town have been inspired by Jordan...\""
                    },
                    {
                        text: "6. What did the people in Jordan's school think of his sculptures?",
                        options: ["They liked them, so they put them where lots of people could see them.", "They weren't convinced that his sculptures were art.", "They thought they were good, but not as good as his drawings and paintings."],
                        answer: 0,
                        tip: "Where did they put the sculptures?",
                        explanation: "\"The students and teachers loved his sculptures. They put them on display at the front of the school.\""
                    },
                    {
                        text: "7. How does Jordan feel about students in other schools making sculptures?",
                        options: ["He's annoyed because it was his idea.", "He thinks his sculptures are better than the other students' sculptures.", "He's happy that other people can do it, too."],
                        answer: 2,
                        tip: "Read the last sentence of the text.",
                        explanation: "\"Jordan says he's very happy that people are using recyclable materials in new ways...\""
                    }
                ]
            },
            {
                group: "Listening",
                type: "fill",
                title: "2. Listen. Complete the information. (one point each)",
                // The PDF does not include the audio script: this one is an example the teacher can replace.
                script: "Hi, everyone! My name is Tom. My friends and I are organizing an event at our school to help our community. The event is a bake sale, and all the money will go to the local animal shelter. It will happen on Friday next week, from ten o'clock to one o'clock, in the school yard. You can help by bringing cakes or cookies to school on Wednesday. Please come and support us. Thank you!",
                items: [
                    { text: "a. Tom and his friends are organizing an event at their ___ .", answers: ["school"], tip: "Where do Tom and his friends study?" },
                    { text: "b. The event is a ___ .", answers: ["bake sale"], tip: "Listen for the kind of event: people sell food they made." },
                    { text: "c. It will happen on ___ next week.", answers: ["Friday"], tip: "Listen for a day of the week." },
                    { text: "d. You can help by bringing ___ to school on Wednesday.", answers: ["cakes or cookies", "cakes and cookies", "cakes", "cookies", "cake", "cookie"], tip: "Listen for food you can bring." }
                ]
            }
        ]
    },

    writing: {
        kind: "writing",
        school: "Colegio Reims School year 2026-2027",
        title: "WRITING GUIDE",
        subtitle: "1st Trimester - 5th Grade",
        teacher: "Aurora Corante",
        sections: [
            {
                group: "Writing",
                type: "writing",
                title: "Write a letter to tell people about an event you are organizing to help your community. (0/1)",
                remember: [
                    "Start and end your letter correctly.",
                    "Include practical information about the event.",
                    "Persuade readers to support the event.",
                    "Use parentheses to add extra information to your sentences."
                ],
                lines: 8,
                criteria: [
                    { check: "letterFormat", text: "Letter format: starts and ends the letter correctly (greeting and closing).", points: 2 },
                    { check: "practicalInfo", text: "Practical information: includes useful details about the event (what, when, where, or how to participate).", points: 2 },
                    { check: "persuasive", text: "Persuasive language: explains why people should support the event.", points: 2 },
                    { check: "parentheses", text: "Parentheses: uses parentheses correctly to add extra information.", points: 2 },
                    { check: "length", text: "Length and organization: writes a complete, clear letter using the 8 lines provided.", points: 2 }
                ]
            }
        ]
    }
};

// Accepted answers for a causative sentence: "I had my car washed yesterday."
// also accepts "got", and the time expression at the beginning ("Yesterday, I had...").
function causativeAnswers(subject, possessive, object, participle, time, tense) {
    // "My parents" is plural, like "We": have/get instead of has/gets
    const thirdPerson = !["I", "We", "They", "You"].includes(subject) && !/s$/.test(subject);
    const auxiliaries = tense === "past"
        ? ["had", "got"]
        : (thirdPerson ? ["has", "gets"] : ["have", "get"]);
    const answers = [];
    auxiliaries.forEach(aux => {
        const core = subject + " " + aux + " " + possessive + " " + object + " " + participle;
        answers.push(time ? core + " " + time + "." : core + ".");
        // Only time expressions (not clauses like "when it gets too long") can move to the front
        if (time && !/^(when|because|if|at)\b/i.test(time)) {
            const lowerSubject = subject === "I" ? "I" : subject.charAt(0).toLowerCase() + subject.slice(1);
            answers.push(time.charAt(0).toUpperCase() + time.slice(1) + ", " + lowerSubject + " " + aux + " " + possessive + " " + object + " " + participle + ".");
        }
    });
    return answers;
}
