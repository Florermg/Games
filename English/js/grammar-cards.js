/* =====================================================================
   GRAMMAR CARDS (GAMES-6): the grammar reference cards and the printed
   card sheets. Pure: no DOM; the tests run it in Node.
   Every example is written by hand (research R5), with its translation.
   ===================================================================== */

const CARD_GROUPS = [
    { id: "tenses", label: "Verb tenses" },
    { id: "guides", label: "From the study guides" },
    { id: "basics", label: "Basic grammar" }
];

const FIXED_NOTE = "This rule works the same in every tense.";

const GRAMMAR_CARDS = [
    // ---------- Verb tenses (id = tense id) ----------
    {
        id: "presentSimple", group: "tenses", title: "Present simple",
        explanation: "Use it for habits, routines and facts that are always true.",
        structure: {
            affirmative: "I / you / we / they play · he / she / it plays",
            negative: "I / you / we / they don't play · he / she / it doesn't play",
            question: "Do I / you / we / they play? · Does he / she / it play?"
        },
        formula: {
            affirmative: "Subject + verb in base form (he / she / it: verb + -s)",
            negative: "Subject + don't / doesn't + verb in base form",
            question: "Do / Does + subject + verb in base form?"
        },
        keywords: ["every day", "always", "usually", "often", "sometimes", "never"],
        examples: [
            { en: "I brush my teeth every morning.", es: "Me lavo los dientes todas las mañanas." },
            { en: "Water boils at 100 degrees.", es: "El agua hierve a 100 grados." }
        ]
    },
    {
        id: "presentContinuous", group: "tenses", title: "Present continuous",
        explanation: "Use it for actions that are happening right now or around now.",
        structure: {
            affirmative: "I am playing · you / we / they are playing · he / she / it is playing",
            negative: "I'm not playing · you / we / they aren't playing · he / she / it isn't playing",
            question: "Am I playing? · Are you / we / they playing? · Is he / she / it playing?"
        },
        formula: {
            affirmative: "Subject + am / is / are + verb-ing",
            negative: "Subject + am not / isn't / aren't + verb-ing",
            question: "Am / Is / Are + subject + verb-ing?"
        },
        keywords: ["now", "right now", "at the moment", "today", "Look!", "Listen!"],
        examples: [
            { en: "Look! The baby is sleeping.", es: "¡Mira! El bebé está durmiendo." },
            { en: "We are studying for the test right now.", es: "Estamos estudiando para el examen ahora mismo." }
        ]
    },
    {
        id: "presentPerfect", group: "tenses", title: "Present perfect",
        explanation: "Use it for life experiences and for past actions that are connected to now.",
        structure: {
            affirmative: "I / you / we / they have played · he / she / it has played",
            negative: "I / you / we / they haven't played · he / she / it hasn't played",
            question: "Have I / you / we / they played? · Has he / she / it played?"
        },
        formula: {
            affirmative: "Subject + have / has + past participle",
            negative: "Subject + haven't / hasn't + past participle",
            question: "Have / Has + subject + past participle?"
        },
        keywords: ["already", "yet", "just", "ever", "never", "since", "for"],
        examples: [
            { en: "I have already finished my homework.", es: "Ya he terminado mi tarea." },
            { en: "Have you ever seen a whale?", es: "¿Alguna vez has visto una ballena?" }
        ]
    },
    {
        id: "presentPerfectContinuous", group: "tenses", title: "Present perfect continuous",
        explanation: "Use it for actions that started in the past and are still happening now.",
        structure: {
            affirmative: "I / you / we / they have been playing · he / she / it has been playing",
            negative: "I / you / we / they haven't been playing · he / she / it hasn't been playing",
            question: "Have I / you / we / they been playing? · Has he / she / it been playing?"
        },
        formula: {
            affirmative: "Subject + have / has + been + verb-ing",
            negative: "Subject + haven't / hasn't + been + verb-ing",
            question: "Have / Has + subject + been + verb-ing?"
        },
        keywords: ["for", "since", "all day", "lately", "How long...?"],
        examples: [
            { en: "She has been reading for two hours.", es: "Ella ha estado leyendo durante dos horas." },
            { en: "It has been raining since Monday.", es: "Ha estado lloviendo desde el lunes." }
        ]
    },
    {
        id: "pastSimple", group: "tenses", title: "Past simple",
        explanation: "Use it for actions that finished at a specific time in the past.",
        structure: {
            affirmative: "I / you / he / she / it / we / they played (irregular: went, ate)",
            negative: "I / you / he / she / it / we / they didn't play",
            question: "Did I / you / he / she / it / we / they play?"
        },
        formula: {
            affirmative: "Subject + verb in past (-ed or irregular)",
            negative: "Subject + didn't + verb in base form",
            question: "Did + subject + verb in base form?"
        },
        keywords: ["yesterday", "last week", "ago", "in 2020", "when I was little"],
        examples: [
            { en: "We visited the museum last Friday.", es: "Visitamos el museo el viernes pasado." },
            { en: "I didn't eat breakfast yesterday.", es: "Ayer no desayuné." }
        ]
    },
    {
        id: "pastContinuous", group: "tenses", title: "Past continuous",
        explanation: "Use it for an action in progress at a moment in the past, often interrupted by another action.",
        structure: {
            affirmative: "I / he / she / it was playing · you / we / they were playing",
            negative: "I / he / she / it wasn't playing · you / we / they weren't playing",
            question: "Was I / he / she / it playing? · Were you / we / they playing?"
        },
        formula: {
            affirmative: "Subject + was / were + verb-ing",
            negative: "Subject + wasn't / weren't + verb-ing",
            question: "Was / Were + subject + verb-ing?"
        },
        keywords: ["while", "when", "at 8 o'clock last night", "all morning"],
        examples: [
            { en: "I was reading when the phone rang.", es: "Estaba leyendo cuando sonó el teléfono." },
            { en: "They were playing outside at five o'clock.", es: "Ellos estaban jugando afuera a las cinco." }
        ]
    },
    {
        id: "pastPerfect", group: "tenses", title: "Past perfect",
        explanation: "Use it for an action that happened before another action in the past.",
        structure: {
            affirmative: "I / you / he / she / it / we / they had played",
            negative: "I / you / he / she / it / we / they hadn't played",
            question: "Had I / you / he / she / it / we / they played?"
        },
        formula: {
            affirmative: "Subject + had + past participle",
            negative: "Subject + hadn't + past participle",
            question: "Had + subject + past participle?"
        },
        keywords: ["before", "after", "already", "by the time", "never ... before"],
        examples: [
            { en: "The movie had already started when we arrived.", es: "La película ya había empezado cuando llegamos." },
            { en: "She had never seen snow before that trip.", es: "Ella nunca había visto nieve antes de ese viaje." }
        ]
    },
    {
        id: "futureWill", group: "tenses", title: "Future (will)",
        explanation: "Use it for predictions, promises and decisions you make at the moment of speaking.",
        structure: {
            affirmative: "I / you / he / she / it / we / they will play",
            negative: "I / you / he / she / it / we / they won't play",
            question: "Will I / you / he / she / it / we / they play?"
        },
        formula: {
            affirmative: "Subject + will + verb in base form",
            negative: "Subject + won't + verb in base form",
            question: "Will + subject + verb in base form?"
        },
        keywords: ["tomorrow", "next year", "soon", "I think...", "probably"],
        examples: [
            { en: "I think it will rain tomorrow.", es: "Creo que lloverá mañana." },
            { en: "I will help you with your backpack.", es: "Te ayudaré con tu mochila." }
        ]
    },
    {
        id: "futureGoingTo", group: "tenses", title: "Future (going to)",
        explanation: "Use it for plans, and for things you can see are going to happen.",
        structure: {
            affirmative: "I am going to play · you / we / they are going to play · he / she / it is going to play",
            negative: "I'm not going to play · you / we / they aren't going to play · he / she / it isn't going to play",
            question: "Am I going to play? · Are you / we / they going to play? · Is he / she / it going to play?"
        },
        formula: {
            affirmative: "Subject + am / is / are + going to + verb in base form",
            negative: "Subject + am not / isn't / aren't + going to + verb in base form",
            question: "Am / Is / Are + subject + going to + verb in base form?"
        },
        keywords: ["next week", "this weekend", "tonight", "Look at those clouds!"],
        examples: [
            { en: "We are going to visit my grandma this weekend.", es: "Vamos a visitar a mi abuela este fin de semana." },
            { en: "Look at those clouds! It is going to rain.", es: "¡Mira esas nubes! Va a llover." }
        ]
    },
    {
        id: "futureContinuous", group: "tenses", title: "Future continuous",
        explanation: "Use it for an action that will be in progress at a moment in the future.",
        structure: {
            affirmative: "I / you / he / she / it / we / they will be playing",
            negative: "I / you / he / she / it / we / they won't be playing",
            question: "Will I / you / he / she / it / we / they be playing?"
        },
        formula: {
            affirmative: "Subject + will be + verb-ing",
            negative: "Subject + won't be + verb-ing",
            question: "Will + subject + be + verb-ing?"
        },
        keywords: ["at this time tomorrow", "at 9 o'clock tonight", "this time next week"],
        examples: [
            { en: "At this time tomorrow, I will be flying to Cancún.", es: "Mañana a esta hora estaré volando a Cancún." },
            { en: "Don't call at eight; we will be having dinner.", es: "No llames a las ocho; estaremos cenando." }
        ]
    },

    // ---------- From the study guides ----------
    {
        id: "quantifiers", group: "guides", title: "Quantifiers",
        explanation: "Quantifiers say how much or how many: all, most, some, a few, no / none.",
        formula: "all / most / some / a few / none + of + the / my + noun + verb · all / most / some / a few + noun + verb",
        changesWithTense: true,
        examplesByTense: {
            presentSimple: [{ en: "Most of my classmates walk to school.", es: "La mayoría de mis compañeros camina a la escuela." }],
            presentContinuous: [{ en: "Some students are reading in the library now.", es: "Algunos alumnos están leyendo en la biblioteca ahora." }],
            presentPerfect: [{ en: "All of the children have finished the test.", es: "Todos los niños han terminado el examen." }],
            presentPerfectContinuous: [{ en: "A few birds have been singing since six o'clock.", es: "Unos cuantos pájaros han estado cantando desde las seis." }],
            pastSimple: [{ en: "None of my friends came to the party.", es: "Ninguno de mis amigos vino a la fiesta." }],
            pastContinuous: [{ en: "Most of the people were sleeping when the storm started.", es: "La mayoría de la gente estaba durmiendo cuando empezó la tormenta." }],
            pastPerfect: [{ en: "All of the cookies had disappeared before lunch.", es: "Todas las galletas habían desaparecido antes de la comida." }],
            futureWill: [{ en: "Some of us will bring sandwiches tomorrow.", es: "Algunos de nosotros traeremos sándwiches mañana." }],
            futureGoingTo: [{ en: "A few students are going to sing at the festival.", es: "Unos cuantos alumnos van a cantar en el festival." }],
            futureContinuous: [{ en: "At noon, all of the teachers will be having a meeting.", es: "Al mediodía, todos los maestros estarán en una junta." }]
        }
    },
    {
        id: "causative", group: "guides", title: "Causative (have / get something done)",
        explanation: "Use have or get + object + past participle when another person does something for you.",
        formula: "Subject + have / get + object + past participle",
        changesWithTense: true,
        examplesByTense: {
            presentSimple: [{ en: "My mom has her hair cut every month.", es: "A mi mamá le cortan el pelo cada mes." }],
            presentContinuous: [{ en: "We are having our kitchen painted this week.", es: "Nos están pintando la cocina esta semana." }],
            presentPerfect: [{ en: "I have just had my bike fixed.", es: "Me acaban de arreglar la bicicleta." }],
            pastSimple: [{ en: "My aunt had her house painted last year.", es: "Mi tía mandó pintar su casa el año pasado." }],
            pastContinuous: [{ en: "Dad was getting the car washed when it started to rain.", es: "A papá le estaban lavando el coche cuando empezó a llover." }],
            pastPerfect: [{ en: "She had already had her photo taken before class.", es: "A ella ya le habían tomado la foto antes de la clase." }],
            futureWill: [{ en: "I will get my eyes checked tomorrow.", es: "Mañana me van a revisar la vista." }],
            futureGoingTo: [{ en: "We are going to have our windows cleaned next week.", es: "Vamos a mandar limpiar las ventanas la próxima semana." }]
        }
    },
    {
        id: "pastAgo", group: "guides", title: "Past simple + ago",
        explanation: "Use ago to say how long before now something happened: amount of time + ago.",
        formula: "Subject + verb in past simple + amount of time + ago",
        note: "Ago is used only with the past simple.",
        examples: [
            { en: "I went to Paris two years ago.", es: "Fui a París hace dos años." },
            { en: "My brother woke up ten minutes ago.", es: "Mi hermano se despertó hace diez minutos." }
        ]
    },
    {
        id: "comparatives", group: "guides", title: "Comparatives",
        explanation: "Add -er to short adjectives and use more with long ones, then than: bigger than, more beautiful than.",
        formula: "Subject + verb + adjective-er + than + noun · Subject + verb + more + adjective + than + noun",
        changesWithTense: true,
        examplesByTense: {
            presentSimple: [{ en: "My dog is bigger than your cat.", es: "Mi perro es más grande que tu gato." }],
            presentContinuous: [{ en: "My sister is running faster than me.", es: "Mi hermana está corriendo más rápido que yo." }],
            presentPerfect: [{ en: "The river has become wider than before.", es: "El río se ha vuelto más ancho que antes." }],
            pastSimple: [{ en: "Yesterday was colder than today.", es: "Ayer hizo más frío que hoy." }],
            pastContinuous: [{ en: "The bus was moving more slowly than a bike.", es: "El autobús estaba avanzando más despacio que una bicicleta." }],
            pastPerfect: [{ en: "The test had been easier than we expected.", es: "El examen había sido más fácil de lo que esperábamos." }],
            futureWill: [{ en: "Tomorrow will be warmer than today.", es: "Mañana hará más calor que hoy." }],
            futureGoingTo: [{ en: "This project is going to be more difficult than the last one.", es: "Este proyecto va a ser más difícil que el anterior." }]
        }
    },

    // ---------- Basic grammar ----------
    {
        id: "subjectPronouns", group: "basics", title: "Subject pronouns",
        explanation: "Subject pronouns take the place of the person or thing that does the action: I, you, he, she, it, we, they.",
        formula: "I / you / he / she / it / we / they + verb",
        examples: [
            { en: "Ana is my friend. She is ten years old.", es: "Ana es mi amiga. Ella tiene diez años." },
            { en: "Tom and I play soccer. We play every Saturday.", es: "Tom y yo jugamos futbol. Jugamos todos los sábados." }
        ]
    },
    {
        id: "possessives", group: "basics", title: "Possessive adjectives",
        explanation: "They say who something belongs to: my, your, his, her, its, our, their. They go before a noun.",
        formula: "my / your / his / her / its / our / their + noun",
        examples: [
            { en: "This is my backpack.", es: "Esta es mi mochila." },
            { en: "The dog wags its tail.", es: "El perro mueve su cola." }
        ]
    },
    {
        id: "articles", group: "basics", title: "Articles (a / an / the)",
        explanation: "Use a before a consonant sound, an before a vowel sound, and the for something specific.",
        formula: "a + noun with a consonant sound · an + noun with a vowel sound · the + a specific noun",
        examples: [
            { en: "I have a cat and an orange fish.", es: "Tengo un gato y un pez naranja." },
            { en: "The cat is sleeping on the sofa.", es: "El gato está durmiendo en el sillón." }
        ]
    },
    {
        id: "plurals", group: "basics", title: "Plurals",
        explanation: "Most nouns add -s. After -s, -sh, -ch or -x add -es; consonant + y changes to -ies. Some are irregular: child → children.",
        formula: "noun + -s · noun ending in -s, -sh, -ch or -x + -es · consonant + y → -ies",
        examples: [
            { en: "two boxes, three babies, five children", es: "dos cajas, tres bebés, cinco niños" },
            { en: "My feet are cold.", es: "Tengo los pies fríos." }
        ]
    },
    {
        id: "thereIsAre", group: "basics", title: "There is / there are",
        explanation: "Use there is with one thing and there are with many things to say that something exists.",
        formula: "There is + one thing · There are + two or more things",
        changesWithTense: true,
        examplesByTense: {
            presentSimple: [{ en: "There is a park near my house.", es: "Hay un parque cerca de mi casa." }],
            presentPerfect: [{ en: "There have been three storms this month.", es: "Ha habido tres tormentas este mes." }],
            pastSimple: [{ en: "There were many people at the concert.", es: "Había mucha gente en el concierto." }],
            pastPerfect: [{ en: "There had been a fire before we arrived.", es: "Había habido un incendio antes de que llegáramos." }],
            futureWill: [{ en: "There will be a party on Friday.", es: "Habrá una fiesta el viernes." }],
            futureGoingTo: [{ en: "There is going to be a test next week.", es: "Va a haber un examen la próxima semana." }]
        }
    },
    {
        id: "prepositionsPlace", group: "basics", title: "Prepositions of place",
        explanation: "They say where something is: in, on, under, next to, behind, between, in front of.",
        formula: "Subject + be + preposition + place",
        examples: [
            { en: "The cat is under the table.", es: "El gato está debajo de la mesa." },
            { en: "The bank is between the school and the park.", es: "El banco está entre la escuela y el parque." }
        ]
    },
    {
        id: "prepositionsTime", group: "basics", title: "Prepositions of time",
        explanation: "Use at with clock times, on with days and dates, and in with months, years and seasons.",
        formula: "at + clock time · on + day or date · in + month, year or season",
        examples: [
            { en: "I wake up at seven o'clock.", es: "Me despierto a las siete." },
            { en: "My birthday is on May 5th, in spring.", es: "Mi cumpleaños es el 5 de mayo, en primavera." }
        ]
    },
    {
        id: "canCant", group: "basics", title: "Can / can't",
        explanation: "Use can / can't + verb for ability and permission. In the past use could / couldn't; in the future, will be able to.",
        formula: "Subject + can / can't + verb in base form",
        changesWithTense: true,
        examplesByTense: {
            presentSimple: [{ en: "I can ride a bike, but I can't skate.", es: "Sé andar en bicicleta, pero no sé patinar." }],
            pastSimple: [{ en: "When I was five, I couldn't read.", es: "Cuando tenía cinco años, no sabía leer." }],
            futureWill: [{ en: "After the course, she will be able to speak French.", es: "Después del curso, ella podrá hablar francés." }],
            futureGoingTo: [{ en: "We are going to be able to see the eclipse tonight.", es: "Vamos a poder ver el eclipse esta noche." }]
        }
    }
];

const GRAMMAR_CARD_BY_ID = Object.fromEntries(GRAMMAR_CARDS.map(c => [c.id, c]));

const tenseLabel = (id) => TENSE_BY_ID[id].label;

/**
 * The 22 cards with their examples for the chosen tenses (in the fixed order of TENSES).
 * @returns {{ id, group, title, explanation, structure?, keywords?, examples: [{ tense?, en, es }], note, chosen? }[]}
 */
function grammarCardsFor(tenseIds) {
    const chosen = TENSES.map(t => t.id).filter(id => tenseIds.includes(id));
    return GRAMMAR_CARDS.map(card => {
        const view = { id: card.id, group: card.group, title: card.title, explanation: card.explanation, formula: card.formula, note: "" };
        if (card.group === "tenses") {
            Object.assign(view, { structure: card.structure, keywords: card.keywords, examples: card.examples, chosen: chosen.includes(card.id) });
        } else if (card.changesWithTense) {
            const allowed = Object.keys(card.examplesByTense);
            const shown = chosen.filter(id => allowed.includes(id));
            view.examples = (shown.length ? shown : [allowed[0]]).flatMap(id =>
                card.examplesByTense[id].map(e => ({ tense: tenseLabel(id), en: e.en, es: e.es })));
            if (!shown.length) view.note = "Choose one of these tenses to see more examples: " + allowed.map(tenseLabel).join(", ") + ".";
        } else {
            view.examples = card.examples;
            view.note = card.note || FIXED_NOTE;
        }
        return view;
    });
}

// ---------- Printed card sheets (FR-011, FR-012) ----------

// Verb cards with more than this many tenses take the two columns of the sheet
const WIDE_CARD_TENSES = 6;

function printExample(example) {
    return '<li>' + (example.tense ? '<span class="card-tense">' + escapeHtml(example.tense) + ':</span> ' : '') +
        escapeHtml(example.en) + '<div class="card-es">' + escapeHtml(example.es) + '</div></li>';
}

function grammarCardHtml(card) {
    let html = '<div class="print-card"><h3>' + escapeHtml(card.title) + '</h3>' +
        '<p class="card-explanation">' + escapeHtml(card.explanation) + '</p>';
    if (card.structure) {
        html += '<table class="card-structure">' +
            [["+", "affirmative"], ["−", "negative"], ["?", "question"]]
                // The formula first (GAMES-12), then one line per group of subjects, so a group never wraps in the middle (GAMES-7)
                .map(([sign, part]) => '<tr><th>' + sign + '</th><td><div class="card-formula">' + escapeHtml(card.formula[part]) + '</div>' +
                    card.structure[part].split(' · ').map(escapeHtml).join('<br>') + '</td></tr>').join('') +
            '</table><p class="card-keywords"><b>Keywords:</b> ' + card.keywords.map(escapeHtml).join(', ') + '</p>';
    } else if (card.formula) {
        html += '<p class="card-formula"><b>Structure:</b> ' + card.formula.split(' · ').map(escapeHtml).join('<br>') + '</p>';
    }
    html += '<ul class="card-examples">' + card.examples.map(printExample).join('') + '</ul>';
    if (card.note) html += '<p class="card-note">' + escapeHtml(card.note) + '</p>';
    return html + '</div>';
}

function verbPrintCardHtml(verb, tenseIds) {
    const rows = tenseIds.map(id => {
        const c = conjugate(verb, id);
        return '<tr><th>' + escapeHtml(c.tense) + '</th><td><b>' + escapeHtml(c.formEn) + '</b> · ' + escapeHtml(c.exampleEn) +
            (c.exampleEs ? '<div class="card-es">' + escapeHtml(c.exampleEs) + '</div>' : '') + '</td></tr>';
    }).join('');
    return '<div class="print-card' + (tenseIds.length > WIDE_CARD_TENSES ? ' wide' : '') + '">' +
        '<h3>' + escapeHtml(verb.base) + ' <span class="card-es">(' + escapeHtml(verb.es.join(' / ')) + ')</span>' +
        (verb.reviewed ? '' : ' <span class="card-note">not reviewed</span>') + '</h3>' +
        '<table class="card-verb">' + rows + '</table></div>';
}

/**
 * HTML of the printed card sheet for #print-area. It does not change the selection.
 * @param {{ kind: "grammar"|"verbs", items: (string|object)[], tenses: string[], columns?: 1|2 }} selection
 *        items: card ids, or verbs (objects, or bases of verbs in the list)
 *        columns: cards per row on the sheet (GAMES-8); 2 when missing
 */
function buildCardsPrintHtml(selection) {
    const items = selection.items || [];
    const tenseIds = TENSES.map(t => t.id).filter(id => (selection.tenses || []).includes(id));
    if (!items.length) throw new Error("Choose at least one card to print.");
    if (!tenseIds.length) throw new Error("Choose at least one tense.");
    const columns = selection.columns === undefined ? 2 : selection.columns;
    if (columns !== 1 && columns !== 2) throw new Error("Columns must be 1 or 2.");
    let cards, title;
    if (selection.kind === "grammar") {
        const views = Object.fromEntries(grammarCardsFor(tenseIds).map(c => [c.id, c]));
        cards = items.map(id => {
            if (!views[id]) throw new Error("Unknown grammar card: " + id);
            return grammarCardHtml(views[id]);
        });
        title = "Grammar Cards";
    } else {
        cards = items.map(item => {
            const verb = typeof item === "string" ? VERBS.find(v => v.base === item) : item;
            if (!verb) throw new Error("Unknown verb: " + item);
            return verbPrintCardHtml(verb, tenseIds);
        });
        title = "Verb Cards";
    }
    return '<div class="print-sheet print-card-sheet"><h1 class="print-title">' + title + '</h1>' +
        '<div class="print-cards' + (columns === 1 ? ' one-column' : '') + '">' + cards.join('') + '</div></div>';
}
