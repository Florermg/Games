/* =====================================================================
   HOLIDAYS (GAMES-16): Day of the Dead, Halloween, Las Posadas, Christmas
   and 12 more. A few days before each one and on the day itself the game
   shows a garland on the sheet, decorations in the menu window (on top of
   the sky of GAMES-15) and in the background, a greeting of the tutor and
   a card of English words. When two come together, they are mixed.
   Test mode: QuizA.html?festividad=posadas (or halloween,muertos · ninguna)
   The pure part is tested in Node; the DOM part at the end only runs in the browser.
   ===================================================================== */

// ---------- Movable dates (research R1) ----------

/** Easter Sunday as [month, day] (anonymous Gregorian algorithm). */
function easterSunday(year) {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    return [month, ((h + l - 7 * m + 114) % 31) + 1];
}

/** Thanksgiving: the 4th Thursday of November, as [11, day]. */
function thanksgivingDay(year) {
    const first = new Date(year, 10, 1).getDay();
    return [11, 1 + ((4 - first + 7) % 7) + 21];
}

// [month, day] some days before or after
function shiftDay(year, [month, day], days) {
    const date = new Date(year, month - 1, day + days, 12);
    return [date.getMonth() + 1, date.getDate()];
}

// ---------- Drawing helpers (viewBox of the menu window: 320 x 120, ground at y 104) ----------

const heartPath = (x, y, s, fill) => '<path d="M' + x + ' ' + (y + s * 0.9) + ' C' + (x - s * 1.3) + ' ' + (y - s * 0.1) + ' ' +
    (x - s * 0.6) + ' ' + (y - s * 1.1) + ' ' + x + ' ' + (y - s * 0.4) + ' C' + (x + s * 0.6) + ' ' + (y - s * 1.1) + ' ' +
    (x + s * 1.3) + ' ' + (y - s * 0.1) + ' ' + x + ' ' + (y + s * 0.9) + ' Z" fill="' + fill + '"/>';

const tricolorFlag = (x, y, w, h) => '<line x1="' + x + '" y1="' + (y + h * 2.6) + '" x2="' + x + '" y2="' + (y - 2) + '" stroke="#7f8c8d" stroke-width="2"/>' +
    '<rect x="' + (x + 1) + '" y="' + y + '" width="' + w / 3 + '" height="' + h + '" fill="#006847"/>' +
    '<rect x="' + (x + 1 + w / 3) + '" y="' + y + '" width="' + w / 3 + '" height="' + h + '" fill="#ffffff"/>' +
    '<rect x="' + (x + 1 + 2 * w / 3) + '" y="' + y + '" width="' + w / 3 + '" height="' + h + '" fill="#ce1126"/>' +
    '<circle cx="' + (x + 1 + w / 2) + '" cy="' + (y + h / 2) + '" r="' + h / 6 + '" fill="#8d5a2b"/>';

const candle = (x, y) => '<rect x="' + (x - 2) + '" y="' + y + '" width="4" height="9" fill="#fff6dc"/>' +
    '<path d="M' + x + ' ' + (y - 5) + ' Q' + (x + 2.5) + ' ' + (y - 1.5) + ' ' + x + ' ' + y + ' Q' + (x - 2.5) + ' ' + (y - 1.5) + ' ' + x + ' ' + (y - 5) + ' Z" fill="#ffb300"/>';

// Decorations on the ground (or in the sky) of the menu window, centered at x
const HOLIDAY_ITEMS = {
    fireworks: () => [[0, 30, "#f5c542"], [20, 16, "#ff6b81"], [-16, 18, "#74b9ff"]].map(([dx, y, color]) =>
        '<g stroke="' + color + '" stroke-width="1.6" stroke-linecap="round">' + Array.from({ length: 12 }, (_, i) => {
            const angle = i * Math.PI / 6;
            return '<line x1="' + (dx + Math.cos(angle) * 3).toFixed(1) + '" y1="' + (y + Math.sin(angle) * 3).toFixed(1) +
                '" x2="' + (dx + Math.cos(angle) * 9).toFixed(1) + '" y2="' + (y + Math.sin(angle) * 9).toFixed(1) + '"/>';
        }).join("") + '</g>').join(""),
    rosca: () => '<g transform="translate(0 100)"><polygon points="-9,-20 -9,-29 -4.5,-24 0,-31 4.5,-24 9,-29 9,-20" fill="#f5c542" stroke="#c99a1c" stroke-width="0.8"/>' +
        '<ellipse cx="0" cy="-4" rx="17" ry="7" fill="none" stroke="#d9a05b" stroke-width="6"/>' +
        '<rect x="-12" y="-11" width="5" height="2.5" rx="1" fill="#e74c3c"/><rect x="4" y="-11" width="6" height="2.5" rx="1" fill="#27ae60"/>' +
        '<rect x="-3" y="1.5" width="6" height="2.5" rx="1" fill="#f39c12"/></g>',
    hearts: () => heartPath(0, 84, 11, "#e84393") + heartPath(15, 66, 6, "#ff9ff3") + heartPath(-14, 70, 4.5, "#ff6b81"),
    flag: () => tricolorFlag(-12, 56, 30, 18),
    shamrock: () => '<g transform="translate(-8 98)"><line x1="0" y1="0" x2="2" y2="-10" stroke="#1e8449" stroke-width="2"/>' +
        heartPath(0, -16, 4.5, "#27ae60") + '<g transform="rotate(-110 0 -12)">' + heartPath(0, -16, 4.5, "#2ecc71") + '</g>' +
        '<g transform="rotate(110 0 -12)">' + heartPath(0, -16, 4.5, "#2ecc71") + '</g></g>' +
        '<g transform="translate(12 100)"><circle cx="-4" cy="-10" r="2.6" fill="#f1c40f"/><circle cx="1" cy="-11" r="2.6" fill="#f7dc6f"/><circle cx="5" cy="-9.5" r="2.6" fill="#f1c40f"/>' +
        '<path d="M-8 -9 H8 Q9 2 0 2 Q-9 2 -8 -9 Z" fill="#2d2d2d"/></g>',
    eggs: () => [[-10, "#ff9ff3", "#ffffff"], [0, "#74b9ff", "#fff3b0"], [10, "#c8f7c5", "#e84393"]].map(([dx, fill, line], i) =>
        '<g transform="translate(' + dx + ' ' + (97 - (i % 2) * 2) + ')"><ellipse rx="5.2" ry="7" fill="' + fill + '"/>' +
        '<path d="M-5 0 L-2.5 -2 L0 0 L2.5 -2 L5 0" fill="none" stroke="' + line + '" stroke-width="1.3"/></g>').join(""),
    balloons: () => [[-10, 56, "#ff6b6b"], [2, 48, "#feca57"], [12, 60, "#48dbfb"]].map(([dx, y, color]) =>
        '<path d="M' + dx + ' ' + (y + 9) + ' Q' + (dx + 3) + ' ' + (y + 24) + ' 0 100" fill="none" stroke="#7f8c8d" stroke-width="0.8"/>' +
        '<ellipse cx="' + dx + '" cy="' + y + '" rx="6.5" ry="8.5" fill="' + color + '"/><ellipse cx="' + (dx - 2) + '" cy="' + (y - 3) + '" rx="1.6" ry="2.4" fill="#ffffff" opacity="0.6"/>').join(""),
    bouquet: () => '<path d="M-9 80 L9 80 L0 102 Z" fill="#ff9ff3"/>' +
        '<path d="M-4 82 L-10 74 M4 82 L10 74" stroke="#27ae60" stroke-width="2"/>' +
        [[-6, 76, "#e74c3c"], [0, 72, "#ff6b81"], [6, 76, "#e84393"], [-2, 79, "#fd79a8"], [4, 80, "#d63031"]].map(([x, y, c]) =>
            '<circle cx="' + x + '" cy="' + y + '" r="4" fill="' + c + '"/>').join(""),
    books: () => '<rect x="-14" y="94" width="28" height="7" rx="1" fill="#3498db"/><rect x="-12" y="87" width="25" height="7" rx="1" fill="#e74c3c"/>' +
        '<rect x="-13" y="80" width="26" height="7" rx="1" fill="#2ecc71"/>' +
        '<circle cx="0" cy="73" r="6.5" fill="#e74c3c"/><path d="M0 67 Q4 62 7 64 Q4 68 0 67" fill="#27ae60"/><line x1="0" y1="67" x2="0" y2="64" stroke="#6b4a2b" stroke-width="1.4"/>',
    bell: () => '<path d="M-11 92 Q-11 70 0 68 Q11 70 11 92 Z" fill="#f5c542" stroke="#c99a1c" stroke-width="1"/>' +
        '<rect x="-13" y="91" width="26" height="4" rx="2" fill="#c99a1c"/><circle cx="0" cy="98" r="3" fill="#c99a1c"/>' + tricolorFlag(14, 64, 18, 11),
    pumpkin: () => '<g transform="translate(0 92)"><rect x="-1.5" y="-15" width="3" height="5" rx="1" fill="#27ae60"/>' +
        '<ellipse cx="-6" cy="0" rx="8" ry="10" fill="#e67e22"/><ellipse cx="6" cy="0" rx="8" ry="10" fill="#e67e22"/><ellipse cx="0" cy="0" rx="8" ry="11" fill="#f39c12"/>' +
        '<path d="M-7 -4 L-3 -4 L-5 -8 Z M3 -4 L7 -4 L5 -8 Z" fill="#3a2410"/>' +
        '<path d="M-7 3 Q0 9 7 3 L4 4 L2 2 L0 4 L-2 2 L-4 4 Z" fill="#3a2410"/></g>',
    altar: () => '<g transform="translate(0 102)"><rect x="-18" y="-14" width="36" height="14" fill="#8e44ad"/>' +
        '<path d="M-18 -14 H18 V-10 L15 -8 L12 -10 L9 -8 L6 -10 L3 -8 L0 -10 L-3 -8 L-6 -10 L-9 -8 L-12 -10 L-15 -8 L-18 -10 Z" fill="#e84393"/>' +
        '<circle cx="0" cy="-22" r="7" fill="#ffffff"/><rect x="-4" y="-17" width="8" height="5" rx="2" fill="#ffffff"/>' +
        '<circle cx="-2.6" cy="-23" r="2" fill="#00b894"/><circle cx="2.6" cy="-23" r="2" fill="#e84393"/><path d="M0 -20 L-1 -18.5 H1 Z" fill="#2d3436"/>' +
        candle(-13, -23) + candle(13, -23) +
        '<circle cx="-8" cy="-16" r="3" fill="#f39c12"/><circle cx="8" cy="-16" r="3" fill="#f39c12"/><circle cx="-8" cy="-16" r="1.2" fill="#e67e22"/><circle cx="8" cy="-16" r="1.2" fill="#e67e22"/></g>',
    sombrero: () => '<ellipse cx="0" cy="96" rx="22" ry="5" fill="#d4a056"/><path d="M-9 95 Q-8 78 0 77 Q8 78 9 95 Z" fill="#c8913f"/>' +
        '<rect x="-9" y="90" width="18" height="3" fill="#ce1126"/><ellipse cx="0" cy="96" rx="22" ry="5" fill="none" stroke="#a87632" stroke-width="1"/>',
    turkey: () => '<g transform="translate(0 92)">' + ["#c0392b", "#e67e22", "#f1c40f", "#a0522d", "#e67e22", "#c0392b", "#f1c40f"].map((c, i) =>
        '<ellipse cx="0" cy="-14" rx="4.5" ry="12" fill="' + c + '" transform="rotate(' + (-60 + i * 20) + ' 0 0)"/>').join("") +
        '<circle cx="0" cy="0" r="9" fill="#8d5a2b"/><circle cx="0" cy="-10" r="4.5" fill="#a0522d"/>' +
        '<circle cx="-1.5" cy="-11" r="0.9" fill="#222"/><circle cx="1.5" cy="-11" r="0.9" fill="#222"/>' +
        '<path d="M-1.5 -9 L1.5 -9 L0 -6.5 Z" fill="#f39c12"/><path d="M1 -8 Q3 -5 1.5 -3" stroke="#e74c3c" stroke-width="1.6" fill="none"/></g>',
    pinata: () => '<line x1="0" y1="0" x2="0" y2="30" stroke="#7f8c8d" stroke-width="1"/>' +
        '<g transform="translate(0 44)">' + ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#ff9ff3", "#f368e0", "#54a0ff"].map((c, i) =>
            '<polygon points="-3.5,-7 3.5,-7 0,-21" fill="' + c + '" transform="rotate(' + (i * 360 / 7).toFixed(1) + ')"/>').join("") +
        '<circle r="9" fill="#f5c542"/><circle r="9" fill="none" stroke="#e17055" stroke-width="1.5" stroke-dasharray="3 2"/></g>',
    tree: () => '<rect x="-2.5" y="94" width="5" height="8" fill="#6b4a2b"/>' +
        '<polygon points="0,62 13,82 -13,82" fill="#27ae60"/><polygon points="0,72 16,96 -16,96" fill="#1e8449"/>' +
        [[-6, 80, "#e74c3c"], [5, 77, "#f1c40f"], [-8, 92, "#3498db"], [7, 90, "#e74c3c"], [0, 86, "#f5c542"]].map(([x, y, c]) =>
            '<circle cx="' + x + '" cy="' + y + '" r="2" fill="' + c + '"/>').join("") +
        '<polygon points="0,56 1.8,60.5 6.5,60.8 2.8,63.6 4.1,68 0,65.5 -4.1,68 -2.8,63.6 -6.5,60.8 -1.8,60.5" fill="#f5c542"/>' +
        '<rect x="12" y="94" width="10" height="8" fill="#e74c3c"/><rect x="16" y="94" width="2" height="8" fill="#f5c542"/>'
};

// ---------- The 16 holidays (FR-001, FR-003) ----------

const word = (emoji, english, es, example) => ({ emoji, word: english, es, example });

const HOLIDAYS = [
    {
        id: "newyear", name: "New Year", nameEs: "Año Nuevo", emoji: "🎆", wish: "Happy New Year",
        from: [12, 28], to: [1, 1], garland: "lights", colors: ["#f5c542", "#d9dde5", "#ffffff", "#f5a623"], item: "fireworks", floaters: ["🎉", "✨", "🎊"],
        words: [
            word("🎆", "fireworks", "fuegos artificiales", "We watch the fireworks at midnight."),
            word("🕛", "midnight", "medianoche", "The new year starts at midnight."),
            word("🍇", "grapes", "uvas", "We eat twelve grapes for good luck."),
            word("📅", "calendar", "calendario", "I put a new calendar on the wall."),
            word("🎉", "celebrate", "celebrar", "We celebrate with our family."),
            word("🥳", "party", "fiesta", "There is a big party at my house."),
            word("📝", "resolution", "propósito", "My resolution is to read more books."),
            word("🔟", "countdown", "cuenta regresiva", "We shout the countdown: ten, nine, eight!"),
            word("🌠", "wish", "deseo", "I make a wish for the new year.")
        ]
    },
    {
        id: "reyes", name: "Three Kings' Day", nameEs: "Día de Reyes", emoji: "👑", wish: "Happy Three Kings' Day",
        from: [1, 2], to: [1, 6], garland: "pennants", colors: ["#f5c542", "#c0392b", "#2e86de", "#27ae60"], item: "rosca", floaters: ["👑", "⭐", "🐪"],
        words: [
            word("👑", "king", "rey", "The three kings bring gifts to the children."),
            word("🍩", "sweet bread", "pan dulce (rosca)", "The rosca is a round sweet bread."),
            word("👶", "little doll", "muñequito", "If you find the little doll, you make tamales on February second."),
            word("🎁", "gift", "regalo", "I got a gift on January sixth."),
            word("👟", "shoe", "zapato", "Children leave a shoe by the door."),
            word("⭐", "star", "estrella", "The kings followed a bright star."),
            word("🐪", "camel", "camello", "One king rides a camel."),
            word("☕", "hot chocolate", "chocolate caliente", "We drink hot chocolate with the rosca."),
            word("🤴", "crown", "corona", "The rosca looks like a crown.")
        ]
    },
    {
        id: "valentine", name: "Valentine's Day", nameEs: "Día del Amor y la Amistad", emoji: "💝", wish: "Happy Valentine's Day",
        from: [2, 7], to: [2, 14], garland: "hearts", colors: ["#e84393", "#ff6b81", "#ff9ff3", "#d63031"], item: "hearts", floaters: ["💖", "💌", "❤️"],
        words: [
            word("❤️", "heart", "corazón", "I drew a big red heart."),
            word("💌", "card", "tarjeta", "I made a card for my best friend."),
            word("🤝", "friendship", "amistad", "Today we celebrate love and friendship."),
            word("🤗", "hug", "abrazo", "I gave my mom a hug."),
            word("🍫", "chocolate", "chocolate", "My friend gave me a chocolate."),
            word("🌹", "rose", "rosa", "My dad bought a red rose."),
            word("🎈", "balloon", "globo", "The balloon has a heart on it."),
            word("😊", "kind", "amable", "Be kind to your classmates."),
            word("💝", "love", "amor", "I love my family.")
        ]
    },
    {
        id: "flag", name: "Flag Day", nameEs: "Día de la Bandera", emoji: "🚩", wish: "Happy Flag Day",
        from: [2, 17], to: [2, 24], garland: "papel", colors: ["#006847", "#ffffff", "#ce1126"], item: "flag", floaters: ["🦅", "🌵", "✨"],
        words: [
            word("🚩", "flag", "bandera", "We salute the flag at school."),
            word("🦅", "eagle", "águila", "The eagle stands on a cactus."),
            word("🌵", "cactus", "nopal", "The cactus grows on a rock in the lake."),
            word("🐍", "snake", "serpiente", "The eagle has a snake in its beak."),
            word("🟩", "green", "verde", "Green is on the left side of the flag."),
            word("⬜", "white", "blanco", "White is in the middle of the flag."),
            word("🟥", "red", "rojo", "Red is on the right side of the flag."),
            word("🎺", "anthem", "himno", "We sing the national anthem."),
            word("✋", "salute", "saludar", "Students salute the flag on Mondays.")
        ]
    },
    {
        id: "stpatrick", name: "St. Patrick's Day", nameEs: "Día de San Patricio", emoji: "☘️", wish: "Happy St. Patrick's Day",
        from: [3, 10], to: [3, 17], garland: "pennants", colors: ["#2ecc71", "#27ae60", "#f1c40f", "#ffffff"], item: "shamrock", floaters: ["☘️", "🍀", "🌈"],
        words: [
            word("☘️", "shamrock", "trébol", "A shamrock has three leaves."),
            word("🍀", "lucky", "con suerte", "Today is my lucky day!"),
            word("🌈", "rainbow", "arcoíris", "There is a rainbow after the rain."),
            word("💰", "gold", "oro", "There is gold at the end of the rainbow."),
            word("🧝", "leprechaun", "duende irlandés", "The leprechaun hides his gold."),
            word("🟢", "green", "verde", "People wear green clothes today."),
            word("🎩", "hat", "sombrero", "He wears a tall green hat."),
            word("🏞️", "Ireland", "Irlanda", "St. Patrick's Day comes from Ireland."),
            word("🥁", "parade", "desfile", "We watch the parade in the street.")
        ]
    },
    {
        id: "easter", name: "Easter", nameEs: "Pascua", emoji: "🐣", wish: "Happy Easter",
        range: (year) => ({ from: shiftDay(year, easterSunday(year), -7), to: easterSunday(year) }),
        garland: "pennants", colors: ["#ffd6e7", "#c8f7c5", "#fff3b0", "#cde7ff", "#e5d4ff"], item: "eggs", floaters: ["🥚", "🐣", "🌷"],
        words: [
            word("🐣", "chick", "pollito", "The little chick is yellow."),
            word("🐰", "bunny", "conejito", "The Easter bunny hides the eggs."),
            word("🥚", "egg", "huevo", "I found a blue egg in the garden."),
            word("🧺", "basket", "canasta", "Put the eggs in the basket."),
            word("🎨", "paint", "pintar", "We paint the eggs with bright colors."),
            word("🔍", "hunt", "búsqueda", "The egg hunt starts at ten."),
            word("🌷", "spring", "primavera", "Easter is in spring."),
            word("🍬", "candy", "dulces", "There is candy inside the eggs."),
            word("🌸", "flower", "flor", "A pink flower is next to the egg.")
        ]
    },
    {
        id: "children", name: "Children's Day", nameEs: "Día del Niño", emoji: "🎈", wish: "Happy Children's Day",
        from: [4, 23], to: [4, 30], garland: "papel", colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#ff9ff3"], item: "balloons", floaters: ["🎈", "🎉", "🪁"],
        words: [
            word("🎈", "balloon", "globo", "I have a red balloon."),
            word("🎲", "game", "juego", "We play a game in the yard."),
            word("🧸", "toy", "juguete", "My favorite toy is a teddy bear."),
            word("🎂", "cake", "pastel", "We eat cake at school."),
            word("🍿", "popcorn", "palomitas", "We eat popcorn and watch a movie."),
            word("😄", "fun", "diversión", "Today is a fun day!"),
            word("🪁", "kite", "papalote", "My kite flies very high."),
            word("👫", "friends", "amigos", "I share my snacks with my friends."),
            word("🍭", "lollipop", "paleta", "The clown gave me a lollipop.")
        ]
    },
    {
        id: "mothers", name: "Mother's Day", nameEs: "Día de las Madres", emoji: "💐", wish: "Happy Mother's Day",
        from: [5, 3], to: [5, 10], garland: "pennants", colors: ["#ff9ff3", "#f368e0", "#ffffff", "#ff6b81"], item: "bouquet", floaters: ["💐", "🌷", "💖"],
        words: [
            word("💐", "bouquet", "ramo de flores", "I give my mom a bouquet."),
            word("👩", "mother", "madre", "My mother is my hero."),
            word("😊", "proud", "orgulloso", "I am proud of my mom."),
            word("🌹", "roses", "rosas", "My mom likes red roses."),
            word("💌", "card", "tarjeta", "I wrote a card for my mother."),
            word("🎶", "song", "canción", "We sing a song at the school festival."),
            word("🍳", "breakfast", "desayuno", "I make breakfast for my mom."),
            word("🤗", "hug", "abrazo", "I give her a big hug."),
            word("🙏", "thank you", "gracias", "Thank you for everything, Mom!")
        ]
    },
    {
        id: "teachers", name: "Teacher's Day", nameEs: "Día del Maestro", emoji: "🍎", wish: "Happy Teacher's Day",
        from: [5, 11], to: [5, 15], garland: "pennants", colors: ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"], item: "books", floaters: ["🍎", "✏️", "📚"],
        words: [
            word("🧑‍🏫", "teacher", "maestra / maestro", "My teacher helps me every day."),
            word("🍎", "apple", "manzana", "I give my teacher an apple."),
            word("📚", "books", "libros", "We read books in class."),
            word("✏️", "pencil", "lápiz", "I write with a pencil."),
            word("🏫", "school", "escuela", "Our school has a big garden."),
            word("🧑‍🎓", "student", "alumno", "I am a good student."),
            word("🪑", "classroom", "salón de clases", "Our classroom is very colorful."),
            word("🙏", "thank you", "gracias", "Thank you, teacher!"),
            word("💡", "learn", "aprender", "I learn something new every day.")
        ]
    },
    {
        id: "independence", name: "Independence Day", nameEs: "Día de la Independencia", emoji: "🔔", wish: "Happy Independence Day",
        from: [9, 1], to: [9, 16], garland: "papel", colors: ["#006847", "#ffffff", "#ce1126"], item: "bell", floaters: ["🎆", "🔔", "✨"],
        words: [
            word("🔔", "bell", "campana", "The bell rings on the night of September fifteenth."),
            word("🚩", "flag", "bandera", "We wave the flag in the square."),
            word("🎆", "fireworks", "fuegos artificiales", "There are fireworks in the main square."),
            word("🌶️", "chili", "chile", "Chiles en nogada is a stuffed chili dish with the colors of the flag."),
            word("🌽", "corn", "maíz", "Pozole is made with corn."),
            word("📣", "shout", "grito", "We hear the shout of independence at night."),
            word("🦅", "Mexico", "México", "Mexico is a beautiful country."),
            word("🎺", "parade", "desfile", "There is a parade on September sixteenth."),
            word("🕊️", "freedom", "libertad", "Independence means freedom.")
        ]
    },
    {
        id: "halloween", name: "Halloween", nameEs: "Halloween", emoji: "🎃", wish: "Happy Halloween",
        from: [10, 15], to: [10, 31], garland: "pennants", colors: ["#f39c12", "#2d2d2d", "#8e44ad"], item: "pumpkin", floaters: ["🦇", "🎃", "👻"],
        words: [
            word("🎃", "pumpkin", "calabaza", "We carve a pumpkin with a funny face."),
            word("👻", "ghost", "fantasma", "The ghost says boo!"),
            word("🦇", "bat", "murciélago", "A bat flies at night."),
            word("🧙", "witch", "bruja", "The witch has a black hat."),
            word("🍬", "candy", "dulces", "I got a lot of candy."),
            word("🕷️", "spider", "araña", "A spider makes a web."),
            word("🦸", "costume", "disfraz", "My costume is a superhero."),
            word("🌕", "full moon", "luna llena", "There is a full moon tonight."),
            word("🚪", "trick or treat", "dulce o truco", "Kids say trick or treat at the door."),
            word("😱", "scary", "que da miedo", "This movie is a little scary.")
        ]
    },
    {
        id: "muertos", name: "Day of the Dead", nameEs: "Día de Muertos", emoji: "💀", wish: "Happy Day of the Dead",
        from: [10, 25], to: [11, 2], garland: "papel", colors: ["#e84393", "#f39c12", "#8e44ad", "#00b894", "#fdcb6e"], item: "altar", floaters: ["🌼", "💀", "🕯️"],
        words: [
            word("🌼", "marigold", "cempasúchil", "Marigold flowers are orange."),
            word("💀", "sugar skull", "calaverita de azúcar", "My sugar skull has my name on it."),
            word("🕯️", "candle", "vela", "We light a candle on the altar."),
            word("🖼️", "altar", "ofrenda", "Our altar has photos of our family."),
            word("🍞", "bread of the dead", "pan de muerto", "Bread of the dead is sweet and soft."),
            word("🎏", "tissue paper", "papel picado", "Colorful tissue paper hangs over the altar."),
            word("📷", "photo", "foto", "We put a photo of my grandpa on the altar."),
            word("💭", "remember", "recordar", "We remember the people we love."),
            word("🍬", "sugar", "azúcar", "The skulls are made of sugar."),
            word("🌙", "cemetery", "panteón", "Families visit the cemetery with flowers.")
        ]
    },
    {
        id: "revolution", name: "Revolution Day", nameEs: "Día de la Revolución", emoji: "🥁", wish: "Happy Revolution Day",
        from: [11, 14], to: [11, 20], garland: "papel", colors: ["#006847", "#ffffff", "#ce1126"], item: "sombrero", floaters: ["🥁", "🎺", "✨"],
        words: [
            word("🐎", "horse", "caballo", "The soldiers rode horses."),
            word("👒", "hat", "sombrero", "Zapata wore a big hat."),
            word("🦸", "hero", "héroe", "Zapata and Villa are heroes of Mexico."),
            word("🎺", "parade", "desfile", "Students march in the parade."),
            word("🥁", "drum", "tambor", "I play the drum in the school band."),
            word("🚶", "march", "marchar", "We march with the school band."),
            word("⚽", "sports", "deportes", "There are sports shows on Revolution Day."),
            word("📜", "history", "historia", "We learn Mexican history at school."),
            word("🌾", "land", "tierra", "The farmers wanted land."),
            word("⚖️", "justice", "justicia", "People fought for justice.")
        ]
    },
    {
        id: "thanksgiving", name: "Thanksgiving", nameEs: "Día de Acción de Gracias", emoji: "🦃", wish: "Happy Thanksgiving",
        range: (year) => ({ from: shiftDay(year, thanksgivingDay(year), -6), to: thanksgivingDay(year) }),
        garland: "pennants", colors: ["#a0522d", "#e67e22", "#f1c40f", "#c0392b"], item: "turkey", floaters: ["🍂", "🦃", "🌽"],
        words: [
            word("🦃", "turkey", "pavo", "We eat turkey for dinner."),
            word("🙏", "thankful", "agradecido", "I am thankful for my family."),
            word("🥧", "pie", "pay", "Pumpkin pie is my favorite dessert."),
            word("🌽", "corn", "maíz", "We have corn on the table."),
            word("🍂", "leaves", "hojas", "The leaves are orange and brown."),
            word("🍽️", "dinner", "cena", "Thanksgiving dinner is very big."),
            word("👨‍👩‍👧", "family", "familia", "My family eats together."),
            word("🥔", "potatoes", "papas", "I like mashed potatoes."),
            word("🏈", "football", "fútbol americano", "My uncle watches football.")
        ]
    },
    {
        id: "posadas", name: "Las Posadas", nameEs: "Las Posadas", emoji: "🪅", wish: "Happy Posadas",
        from: [12, 16], to: [12, 24], garland: "papel", colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#ff9ff3", "#ffffff"], item: "pinata", floaters: ["⭐", "🕯️", "✨"],
        words: [
            word("🪅", "piñata", "piñata", "We break the piñata with a stick."),
            word("⭐", "star", "estrella", "The piñata has seven points like a star."),
            word("🕯️", "candle", "vela", "We walk with a candle in our hands."),
            word("🎶", "carol", "villancico", "We sing a Christmas carol."),
            word("🍊", "fruit", "fruta", "The piñata has fruit and candy inside."),
            word("🥤", "punch", "ponche", "Hot punch has guava and cinnamon."),
            word("🏠", "neighbors", "vecinos", "We visit our neighbors' houses."),
            word("🍬", "candy bag", "bolo / aguinaldo", "Each child gets a candy bag."),
            word("🎤", "sing", "cantar", "We sing at the door to ask for a place to stay."),
            word("🌽", "tamales", "tamales", "Grandma makes tamales for the posada.")
        ]
    },
    {
        id: "christmas", name: "Christmas", nameEs: "Navidad", emoji: "🎄", wish: "Merry Christmas",
        from: [12, 1], to: [12, 25], garland: "lights", colors: ["#e74c3c", "#2ecc71", "#f1c40f", "#3498db"], item: "tree", floaters: ["🎄", "⭐", "❄️"],
        words: [
            word("🎄", "tree", "árbol", "We decorate the Christmas tree."),
            word("🎁", "present", "regalo", "I wrap a present for my brother."),
            word("🎅", "Santa Claus", "Santa Claus", "Santa Claus says ho ho ho."),
            word("🦌", "reindeer", "reno", "The reindeer pulls the sleigh."),
            word("⛄", "snowman", "muñeco de nieve", "We draw a snowman with a scarf."),
            word("🧦", "stocking", "calcetín navideño", "My stocking is full of candy."),
            word("🔔", "bells", "campanas", "The bells ring on Christmas Eve."),
            word("✨", "lights", "luces", "Our house has colorful lights."),
            word("🔴", "ornament", "esfera", "I hang a shiny ornament on the tree."),
            word("🍪", "cookies", "galletas", "We bake cookies for Santa.")
        ]
    }
];

const HOLIDAY_BY_ID = Object.fromEntries(HOLIDAYS.map(h => [h.id, h]));

// ---------- Which holidays are on (FR-001, FR-002) ----------

function holidayRange(holiday, year) {
    return holiday.range ? holiday.range(year) : { from: holiday.from, to: holiday.to };
}

const monthDay = ([month, day]) => month * 100 + day;

function inRange(date, { from, to }) {
    const today = monthDay([date.getMonth() + 1, date.getDate()]);
    const a = monthDay(from), b = monthDay(to);
    return a <= b ? today >= a && today <= b : today >= a || today <= b;
}

// Days until the main day (the last of the range), across the new year
function daysUntil(date, [month, day]) {
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let target = new Date(date.getFullYear(), month - 1, day);
    if (target < today) target = new Date(date.getFullYear() + 1, month - 1, day);
    return Math.round((target - today) / 864e5);
}

/** Ids of the holidays of a date, the nearest main day first. */
function activeHolidays(date) {
    const year = date.getFullYear();
    return HOLIDAYS.map((holiday, order) => ({ holiday, order, range: holidayRange(holiday, year) }))
        .filter(({ range }) => inRange(date, range))
        .sort((x, y) => daysUntil(date, x.range.to) - daysUntil(date, y.range.to) || x.order - y.order)
        .map(({ holiday }) => holiday.id);
}

// ---------- Test mode (FR-006) ----------

const HOLIDAY_WORDS = {
    newyear: ["newyear", "anonuevo", "ano nuevo", "new year"],
    reyes: ["reyes", "diadereyes", "threekings", "kings"],
    valentine: ["valentine", "valentin", "amor", "amistad", "sanvalentin"],
    flag: ["flag", "bandera", "diadelabandera"],
    stpatrick: ["stpatrick", "sanpatricio", "patrick"],
    easter: ["easter", "pascua"],
    children: ["children", "nino", "ninos", "diadelnino"],
    mothers: ["mothers", "madres", "mama", "diadelasmadres"],
    teachers: ["teachers", "maestro", "maestros", "diadelmaestro"],
    independence: ["independence", "independencia", "septiembre"],
    halloween: ["halloween"],
    muertos: ["muertos", "diademuertos", "dayofthedead"],
    revolution: ["revolution", "revolucion"],
    thanksgiving: ["thanksgiving", "acciondegracias"],
    posadas: ["posadas", "posada"],
    christmas: ["christmas", "navidad"]
};
const HOLIDAY_ALIASES = Object.fromEntries(Object.entries(HOLIDAY_WORDS).flatMap(([id, words]) => words.map(w => [w.replace(/ /g, ""), id])));

const aliasKey = (text) => String(text).trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");

/** ?festividad=posadas,navidad → ids; "ninguna" → []; nothing valid → null (the real date). */
function holidayOverrides(search) {
    const value = new URLSearchParams(search || "").get("festividad");
    if (value === null) return null;
    const keys = value.split(",").map(aliasKey).filter(Boolean);
    if (keys.some(key => key === "ninguna" || key === "ninguno" || key === "none")) return [];
    const ids = [];
    for (const key of keys) {
        const id = HOLIDAY_ALIASES[key];
        if (id && !ids.includes(id)) ids.push(id);
    }
    return ids.length ? ids : null;
}

// ---------- Drawings (FR-003) ----------

// One part of the garland between x0 and x1 (viewBox width x 28): papel picado, pennants, lights or hearts
function garlandPart(holiday, x0, x1) {
    const sag = (x) => { const t = (x - x0) / (x1 - x0); return 3 + 16 * t * (1 - t); };
    const step = holiday.garland === "lights" ? 22 : 30;
    const count = Math.max(1, Math.floor((x1 - x0 - 10) / step));
    let shapes = "";
    for (let i = 0; i < count; i++) {
        const x = x0 + 10 + step * (i + 0.5), y = sag(x), color = holiday.colors[i % holiday.colors.length];
        if (holiday.garland === "papel") {
            shapes += '<path d="M' + (x - 11) + ' ' + y + ' H' + (x + 11) + ' V' + (y + 13) + ' L' + (x + 8) + ' ' + (y + 15) + ' L' + (x + 5) + ' ' + (y + 13) +
                ' L' + (x + 2) + ' ' + (y + 15) + ' L' + (x - 1) + ' ' + (y + 13) + ' L' + (x - 4) + ' ' + (y + 15) + ' L' + (x - 7) + ' ' + (y + 13) + ' L' + (x - 11) + ' ' + (y + 15) + ' Z" fill="' + color + '" stroke="rgba(0,0,0,0.25)" stroke-width="0.7"/>' +
                '<circle cx="' + (x - 4) + '" cy="' + (y + 6) + '" r="2" fill="rgba(255,255,255,0.65)"/><circle cx="' + (x + 4) + '" cy="' + (y + 6) + '" r="2" fill="rgba(255,255,255,0.65)"/>' +
                '<path d="M' + (x - 2) + ' ' + (y + 10) + ' H' + (x + 2) + '" stroke="rgba(255,255,255,0.65)" stroke-width="1.4"/>';
        } else if (holiday.garland === "pennants") {
            shapes += '<polygon points="' + (x - 10) + ',' + y + ' ' + (x + 10) + ',' + y + ' ' + x + ',' + (y + 17) + '" fill="' + color + '" stroke="rgba(0,0,0,0.25)" stroke-width="0.7"/>';
        } else if (holiday.garland === "lights") {
            shapes += '<rect x="' + (x - 1.6) + '" y="' + (y - 0.5) + '" width="3.2" height="3" fill="#555"/>' +
                '<ellipse cx="' + x + '" cy="' + (y + 7) + '" rx="4" ry="5.5" fill="' + color + '" opacity="0.35"/>' +
                '<ellipse cx="' + x + '" cy="' + (y + 6.5) + '" rx="2.6" ry="4" fill="' + color + '"/>';
        } else {
            shapes += heartPath(x, y + 8, 6, color);
        }
    }
    const mid = (x0 + x1) / 2;
    return '<g data-holiday="' + holiday.id + '"><path d="M' + x0 + ' 3 Q' + mid + ' 19 ' + x1 + ' 3" fill="none" stroke="#7f6a5d" stroke-width="1"/>' + shapes + '</g>';
}

/**
 * The garland over the sheet: half of it for each of the two nearest holidays (clarification 4a).
 * width: the width of the sheet in pixels, so the shapes are never stretched.
 */
function holidayGarlandSvg(ids, uid, width) {
    const shown = ids.slice(0, 2).map(id => HOLIDAY_BY_ID[id]);
    if (!shown.length) return "";
    const total = Math.max(200, Math.round(width || 600));
    const part = total / shown.length;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' 28" preserveAspectRatio="none" aria-hidden="true" data-scene="' + uid + '">' +
        shown.map((holiday, i) => garlandPart(holiday, i * part, (i + 1) * part)).join("") + '</svg>';
}

const ITEM_SLOTS = [135, 185, 290];

/** Decorations of up to 3 holidays on top of the menu window of GAMES-15 (same viewBox). */
function holidayWindowSvg(ids, uid) {
    const shown = ids.slice(0, 3).map(id => HOLIDAY_BY_ID[id]);
    if (!shown.length) return "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" aria-hidden="true" data-scene="' + uid + '">' +
        shown.map((holiday, i) => '<g class="hol-item" data-holiday="' + holiday.id + '" transform="translate(' + ITEM_SLOTS[i] + ' 0)">' +
            HOLIDAY_ITEMS[holiday.item]() + '</g>').join("") + '</svg>';
}

/** Things that float in the background, mixed when there are several holidays (FR-003). */
function holidayParticles(ids) {
    const floaters = ids.flatMap(id => HOLIDAY_BY_ID[id].floaters);
    if (!floaters.length) return "";
    return Array.from({ length: 10 }, (_, i) => {
        const left = (i * 37 + 11) % 100, time = 14 + (i % 4) * 3;
        return '<span class="hol-p hol-p-float" style="left:' + left + '%;animation-duration:' + time + 's;animation-delay:-' + ((i * 4.3) % time).toFixed(1) + 's">' +
            floaters[i % floaters.length] + '</span>';
    }).join("");
}

// ---------- Greeting and words (FR-003, FR-004) ----------

/** "🎃💀 Happy Halloween and happy Day of the Dead! …" */
function holidayGreeting(ids) {
    const shown = ids.map(id => HOLIDAY_BY_ID[id]);
    if (!shown.length) return "";
    const wishes = shown.map((holiday, i) => i === 0 ? holiday.wish : holiday.wish.charAt(0).toLowerCase() + holiday.wish.slice(1));
    const joined = wishes.length > 1 ? wishes.slice(0, -1).join(", ") + " and " + wishes[wishes.length - 1] : wishes[0];
    return shown.map(h => h.emoji).join("") + " " + joined + "! Look at the holiday words in the menu: tap a word to hear it.";
}

const cardText = (text) => String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** The card of English words of the chosen holiday, with a tab for each holiday (US3). */
function holidayCardHtml(ids, selected) {
    if (!ids.length) return "";
    const holiday = HOLIDAY_BY_ID[ids.includes(selected) ? selected : ids[0]];
    const tabs = ids.length > 1 ? '<div class="hol-tabs" role="tablist">' + ids.map(id => {
        const h = HOLIDAY_BY_ID[id];
        const on = h === holiday;
        return '<button type="button" class="hol-tab' + (on ? ' selected' : '') + '" data-holiday="' + id + '" role="tab" aria-selected="' + on + '">' +
            h.emoji + ' ' + cardText(h.name) + '</button>';
    }).join("") + '</div>' : "";
    return '<div class="hol-head"><h2>' + holiday.emoji + ' ' + cardText(holiday.name) + ' words</h2>' +
        '<p class="note">' + cardText(holiday.nameEs) + ' · Tap a word to hear it.</p></div>' + tabs +
        '<div class="hol-words">' + holiday.words.map(w =>
            '<button type="button" class="hol-word" data-say="' + cardText(w.word + ". " + w.example) + '">' +
            '<span class="hol-emoji" aria-hidden="true">' + w.emoji + '</span>' +
            '<span class="hol-en">' + cardText(w.word) + '</span>' +
            '<span class="hol-es">' + cardText(w.es) + '</span>' +
            '<span class="hol-example">' + cardText(w.example) + '</span></button>').join("") + '</div>';
}

// ---------- In the browser ----------

let holidayIds = [];
let holidayTab = null;
let holidayTest = false;

function renderHolidays() {
    const on = holidayIds.length > 0;
    const garland = document.getElementById("holiday-garland");
    if (garland) {
        garland.classList.toggle("hidden", !on);
        garland.innerHTML = holidayGarlandSvg(holidayIds, "garland", garland.clientWidth);
    }
    const windowBox = document.getElementById("holiday-window");
    if (windowBox) windowBox.innerHTML = holidayWindowSvg(holidayIds, "window");
    const scene = document.getElementById("holiday-scene");
    if (scene) scene.innerHTML = holidayParticles(holidayIds);
    renderHolidayCard();
}

function renderHolidayCard() {
    const card = document.getElementById("holiday-card");
    if (!card) return;
    card.innerHTML = holidayCardHtml(holidayIds, holidayTab) + (holidayTest && holidayIds.length ? '<p class="note">🧪 test mode</p>' : "");
    card.classList.toggle("hidden", !holidayIds.length);
}

function holidayCardClick(event) {
    const tab = event.target.closest(".hol-tab");
    if (tab) {
        holidayTab = tab.dataset.holiday;
        renderHolidayCard();
        return;
    }
    const wordButton = event.target.closest(".hol-word");
    if (wordButton && typeof Speech !== "undefined") Speech.speak(wordButton.dataset.say, 0.85);
}

function setupHolidays() {
    const overrides = holidayOverrides(window.location.search);
    holidayTest = overrides !== null;
    holidayIds = holidayTest ? overrides : activeHolidays(new Date());
    holidayTab = holidayIds[0] || null;
    renderHolidays();
    const card = document.getElementById("holiday-card");
    if (card) card.addEventListener("click", holidayCardClick);
    // The garland is drawn for the width of the sheet
    let resizing = null;
    window.addEventListener("resize", () => {
        clearTimeout(resizing);
        resizing = setTimeout(() => {
            const garland = document.getElementById("holiday-garland");
            if (garland && holidayIds.length) garland.innerHTML = holidayGarlandSvg(holidayIds, "garland", garland.clientWidth);
        }, 200);
    });
    // Only when the game opens, in the menu (FR-004)
    if (holidayIds.length && typeof tutor === "function") tutor(HOLIDAY_BY_ID[holidayIds[0]].emoji, holidayGreeting(holidayIds));
    // A new day can start or end a holiday while the game is open
    if (!holidayTest) setInterval(() => {
        const now = activeHolidays(new Date());
        if (now.join() === holidayIds.join()) return;
        holidayIds = now;
        holidayTab = now[0] || null;
        renderHolidays();
    }, 60 * 60000);
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupHolidays);
    else setupHolidays();
}
