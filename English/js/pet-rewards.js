/* =====================================================================
   PET REWARDS (GAMES-14): accessories for the kitten and the puppy,
   won by finishing a generated guide with 100%. Each accessory is hand
   drawn SVG in the coordinates of the pets (viewBox 120 x 120, research
   R1) and goes inside their body group, so it moves with them.
   Pure: no DOM; the tests run it in Node.
   ===================================================================== */

// ---------- Seasons in Mexico (research R2): [month, day] ----------

const SEASONS = {
    independence: { label: "Independence Day", labelEs: "las fiestas patrias", from: [9, 1], to: [9, 16] },
    halloween: { label: "Halloween", labelEs: "Halloween", from: [10, 15], to: [10, 31] },
    muertos: { label: "Day of the Dead", labelEs: "Día de Muertos", from: [10, 25], to: [11, 3] },
    christmas: { label: "Christmas", labelEs: "Navidad", from: [12, 1], to: [1, 6] },
    spring: { label: "spring", labelEs: "primavera", from: [3, 20], to: [6, 20] },
    summer: { label: "summer", labelEs: "verano", from: [6, 21], to: [9, 22] },
    autumn: { label: "autumn", labelEs: "otoño", from: [9, 23], to: [12, 20] },
    winter: { label: "winter", labelEs: "invierno", from: [12, 21], to: [3, 19] }
};

/** Ids of the seasons of a date; the ones that cross the new year are compared by month and day. */
function activeSeasons(date) {
    const today = (date.getMonth() + 1) * 100 + date.getDate();
    return Object.keys(SEASONS).filter(id => {
        const from = SEASONS[id].from[0] * 100 + SEASONS[id].from[1];
        const to = SEASONS[id].to[0] * 100 + SEASONS[id].to[1];
        return from <= to ? today >= from && today <= to : today >= from || today <= to;
    });
}

// ---------- Drawing helpers ----------

// Anchors of each pet: the puppy's head is 1 lower and its feet 1 wider apart
const PET_ANCHORS = { cat: { hy: 0, fx: 0 }, dog: { hy: 1, fx: 1 } };
const SLOT_ORDER = ["body", "feet", "neck", "eyes", "head"];

const onHead = (a, inner) => '<g transform="translate(0 ' + a.hy + ')">' + inner + '</g>';
const both = (a, draw) => draw(47 - a.fx) + draw(73 + a.fx);
const circle = (cx, cy, r, fill, extra) => '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (extra || '') + '/>';
const path = (d, fill, extra) => '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>';

// Points on the top of the head, for crowns of flowers
function headArc(count, lift) {
    const points = [];
    for (let i = 0; i < count; i++) {
        const x = 40 + (40 * i) / (count - 1);
        points.push([x, 50 - Math.sqrt(27 * 27 - (x - 60) * (x - 60)) + (lift || 2)]);
    }
    return points;
}

function flower(x, y, r, petals, center) {
    let html = "";
    for (let k = 0; k < 5; k++) {
        const angle = (k * 2 * Math.PI) / 5;
        html += circle((x + Math.cos(angle) * r * 0.6).toFixed(1), (y + Math.sin(angle) * r * 0.6).toFixed(1), (r * 0.55).toFixed(1), petals);
    }
    return html + circle(x.toFixed(1), y.toFixed(1), (r * 0.4).toFixed(1), center);
}

function heart(cx, cy, s, fill) {
    return path("M" + cx + " " + (cy + 6 * s) + " C" + (cx - 9 * s) + " " + (cy) + " " + (cx - 7 * s) + " " + (cy - 7 * s) + " " + cx + " " + (cy - 3 * s) +
        " C" + (cx + 7 * s) + " " + (cy - 7 * s) + " " + (cx + 9 * s) + " " + cy + " " + cx + " " + (cy + 6 * s) + " Z", fill);
}

function star(cx, cy, r, fill) {
    const points = [];
    for (let k = 0; k < 10; k++) {
        const radius = k % 2 ? r * 0.45 : r;
        const angle = -Math.PI / 2 + (k * Math.PI) / 5;
        points.push((cx + Math.cos(angle) * radius).toFixed(1) + "," + (cy + Math.sin(angle) * radius).toFixed(1));
    }
    return '<polygon points="' + points.join(" ") + '" fill="' + fill + '"/>';
}

// The arms of the glasses, from the lenses to the sides of the head
const glassesArms = (color) => '<path d="M40 48 L33 46 M80 48 L87 46" stroke="' + color + '" stroke-width="2" stroke-linecap="round" fill="none"/>';

// Band around the neck, just under the chin
const COLLAR = "M41 72 Q60 84 79 72 L80 77 Q60 89 40 77 Z";

// Clothes: cut to the shape of the body, without covering the head (research R1)
function clothes(a, kind, inner) {
    const clip = "pet-clothes-clip-" + kind, mask = "pet-clothes-mask-" + kind;
    return '<defs><clipPath id="' + clip + '"><ellipse cx="60" cy="90" rx="30.5" ry="22.5"/></clipPath>' +
        '<mask id="' + mask + '"><rect width="120" height="103.5" fill="#ffffff"/>' + circle(60, 50 + a.hy, 27.5, "#000000") + '</mask></defs>' +
        '<g clip-path="url(#' + clip + ')" mask="url(#' + mask + ')">' + inner + '</g>';
}

function stripes(color, from, step, height) {
    let html = "";
    for (let y = from; y < 114; y += step) html += '<rect x="25" y="' + y + '" width="70" height="' + height + '" fill="' + color + '"/>';
    return html;
}

// ---------- Catalog (FR-003, FR-004): hand drawn, for both pets ----------

const PET_ACCESSORIES = [
    // ---- Head ----
    { id: "cap", name: "Baseball cap", es: "Gorra de béisbol", slot: "head", season: null, draw: a => onHead(a,
        path("M38 31 Q39 11 60 10 Q81 11 82 31 Z", "#e63946") + path("M60 29 Q85 25 97 31 Q85 36 62 33 Z", "#b5172b") +
        path("M44 22 Q60 14 76 22", "none", ' stroke="#ffffff" stroke-width="1.2" opacity="0.5"') + circle(60, 10.5, 2.2, "#b5172b")) },
    { id: "topHat", name: "Top hat", es: "Sombrero de copa", slot: "head", season: null, draw: a => onHead(a,
        '<ellipse cx="60" cy="27" rx="24" ry="4.5" fill="#1b1b1b"/><rect x="46" y="3" width="28" height="24" rx="2" fill="#2b2b2b"/>' +
        '<rect x="46" y="19" width="28" height="4.5" fill="#c1121f"/><rect x="49" y="5" width="4" height="13" rx="2" fill="#ffffff" opacity="0.15"/>') },
    { id: "crown", name: "Golden crown", es: "Corona dorada", slot: "head", season: null, draw: a => onHead(a,
        path("M42 31 L42 14 L51 22 L60 8 L69 22 L78 14 L78 31 Z", "#f4c430", ' stroke="#c99700" stroke-width="1.2" stroke-linejoin="round"') +
        '<rect x="42" y="27" width="36" height="4" fill="#e0a800"/>' + circle(60, 22, 2.6, "#e63946") + circle(50, 26, 1.8, "#4361ee") + circle(70, 26, 1.8, "#2a9d8f")) },
    { id: "partyHat", name: "Party hat", es: "Gorro de fiesta", slot: "head", season: null, draw: a => onHead(a,
        path("M47 29 L60 1 L73 29 Z", "#4cc9f0") + path("M51 20 L69 20 L71 25 L49 25 Z", "#f72585") + path("M55 10 L65 10 L66.5 14 L53.5 14 Z", "#ffd60a") +
        circle(60, 2, 3.6, "#f72585")) },
    { id: "hairBow", name: "Pink bow", es: "Moño rosa", slot: "head", season: null, draw: a => onHead(a,
        path("M72 25 L61 17 Q59 25 61 33 Z", "#ff6fa8") + path("M72 25 L83 17 Q85 25 83 33 Z", "#ff6fa8") + circle(72, 25, 3.4, "#d63384")) },
    { id: "marigoldCrown", name: "Marigold crown", es: "Corona de cempasúchil", slot: "head", season: "muertos", draw: a => onHead(a,
        headArc(7, 3).map(([x, y], i) => flower(x, y, 6, i % 2 ? "#ffb703" : "#fb8500", "#c1121f")).join('')) },
    { id: "catrinaHat", name: "Catrina hat", es: "Sombrero de catrina", slot: "head", season: "muertos", draw: a => onHead(a,
        '<ellipse cx="60" cy="27" rx="35" ry="6" fill="#5a189a"/>' + path("M44 27 Q45 7 60 7 Q75 7 76 27 Z", "#7b2cbf") +
        flower(50, 22, 6, "#ff006e", "#ffbe0b") + flower(60, 20, 6, "#ffbe0b", "#fb5607") + flower(70, 22, 6, "#fb5607", "#ffffff") +
        path("M74 12 Q90 0 96 6 Q86 8 76 18 Z", "#ff006e")) },
    { id: "witchHat", name: "Witch hat", es: "Sombrero de bruja", slot: "head", season: "halloween", draw: a => onHead(a,
        '<ellipse cx="60" cy="28" rx="31" ry="5" fill="#2d1b4e"/>' + path("M44 28 Q54 16 57 -2 Q68 8 77 28 Z", "#3c1f66") +
        '<rect x="45" y="21" width="31" height="4.5" fill="#ff8c00"/><rect x="57" y="20.3" width="6" height="6" fill="none" stroke="#ffd60a" stroke-width="1.3"/>') },
    { id: "santaHat", name: "Santa hat", es: "Gorro de Santa", slot: "head", season: "christmas", draw: a => onHead(a,
        path("M40 30 Q44 9 63 8 Q82 9 89 26 L84 29 Q78 18 70 17 L80 30 Z", "#d62828") +
        '<rect x="37" y="25" width="47" height="7.5" rx="3.7" fill="#ffffff"/>' + circle(88, 27, 5, "#ffffff")) },
    { id: "antlers", name: "Reindeer antlers", es: "Cuernos de reno", slot: "head", season: "christmas", draw: a => onHead(a,
        '<path d="M47 27 L42 9 M44 16 L36 12 M43 12 L46 5 M73 27 L78 9 M76 16 L84 12 M77 12 L74 5" stroke="#8b5a2b" stroke-width="3.2" stroke-linecap="round" fill="none"/>' +
        circle(60, 60, 3.4, "#e63946") + circle(59, 59, 1, "#ffffff", ' opacity="0.7"')) },
    { id: "charroHat", name: "Charro hat", es: "Sombrero de charro", slot: "head", season: "independence", draw: a => onHead(a,
        '<ellipse cx="60" cy="26" rx="38" ry="7" fill="#d4a373" stroke="#a0703c" stroke-width="1.2"/>' + path("M47 26 Q49 5 60 5 Q71 5 73 26 Z", "#c08552") +
        '<rect x="48" y="19" width="8" height="4" fill="#006847"/><rect x="56" y="19" width="8" height="4" fill="#ffffff"/><rect x="64" y="19" width="8" height="4" fill="#ce1126"/>') },
    { id: "flowerCrown", name: "Flower crown", es: "Corona de flores", slot: "head", season: "spring", draw: a => onHead(a,
        headArc(7, 2).map(([x, y], i) => '<ellipse cx="' + (x + 3).toFixed(1) + '" cy="' + (y + 2).toFixed(1) + '" rx="3" ry="1.6" fill="#80b918"/>' +
            flower(x, y, 4.5, ["#ff8fab", "#ffffff", "#ffd60a"][i % 3], "#f77f00")).join('')) },
    { id: "strawHat", name: "Straw hat", es: "Sombrero de paja", slot: "head", season: "summer", draw: a => onHead(a,
        '<ellipse cx="60" cy="27" rx="33" ry="6" fill="#e9c46a" stroke="#c9a227" stroke-width="1"/>' + path("M46 27 Q47 11 60 11 Q73 11 74 27 Z", "#f4d58d") +
        '<rect x="46" y="21.5" width="28" height="4.5" fill="#2a9d8f"/>') },
    { id: "beanie", name: "Winter beanie", es: "Gorro de invierno", slot: "head", season: "winter", draw: a => onHead(a,
        path("M38 31 Q38 9 60 9 Q82 9 82 31 Z", "#457b9d") + '<rect x="40" y="16" width="40" height="3" fill="#a8dadc"/>' +
        '<rect x="37" y="26" width="46" height="7.5" rx="3.5" fill="#1d3557"/>' + circle(60, 8, 5, "#f1faee")) },

    // ---- Eyes ----
    { id: "sunglasses", name: "Sunglasses", es: "Lentes de sol", slot: "eyes", season: null, draw: a => onHead(a,
        glassesArms("#111111") + '<rect x="40" y="44" width="18" height="12" rx="4" fill="#111111" opacity="0.92"/><rect x="62" y="44" width="18" height="12" rx="4" fill="#111111" opacity="0.92"/>' +
        '<path d="M58 49 Q60 47 62 49" stroke="#111111" stroke-width="2" fill="none"/><path d="M43 47 L48 47 M65 47 L70 47" stroke="#ffffff" stroke-width="1.3" opacity="0.6"/>') },
    { id: "roundGlasses", name: "Round glasses", es: "Lentes redondos", slot: "eyes", season: null, draw: a => onHead(a,
        glassesArms("#6d4c41") + circle(49, 50, 8.5, "rgba(200,230,255,0.25)", ' stroke="#6d4c41" stroke-width="2"') +
        circle(71, 50, 8.5, "rgba(200,230,255,0.25)", ' stroke="#6d4c41" stroke-width="2"') + '<path d="M57.5 49 Q60 46.5 62.5 49" stroke="#6d4c41" stroke-width="2" fill="none"/>') },
    { id: "heartGlasses", name: "Heart glasses", es: "Lentes de corazón", slot: "eyes", season: null, draw: a => onHead(a,
        glassesArms("#d6336c") + heart(49, 50, 1.25, "#ff4d6d") + heart(71, 50, 1.25, "#ff4d6d") + '<path d="M57 48 L63 48" stroke="#d6336c" stroke-width="2"/>') },
    { id: "starGlasses", name: "Star glasses", es: "Lentes de estrella", slot: "eyes", season: null, draw: a => onHead(a,
        glassesArms("#f59f00") + star(49, 50, 10, "#ffd60a") + star(71, 50, 10, "#ffd60a") + '<path d="M57 49 L63 49" stroke="#f59f00" stroke-width="2"/>') },
    { id: "sugarSkullMask", name: "Sugar skull mask", es: "Antifaz de calaverita", slot: "eyes", season: "muertos", draw: a => onHead(a,
        circle(49, 50, 9, "none", ' stroke="#00b4d8" stroke-width="2.5"') + circle(71, 50, 9, "none", ' stroke="#ff006e" stroke-width="2.5"') +
        [[41, 41, "#ffbe0b"], [49, 39, "#8338ec"], [57, 41, "#fb5607"], [63, 41, "#ffbe0b"], [71, 39, "#3a86ff"], [79, 41, "#fb5607"]].map(([x, y, c]) => circle(x, y, 1.8, c)).join('') +
        flower(60, 34, 5, "#ff006e", "#ffbe0b")) },
    { id: "swimGoggles", name: "Swim goggles", es: "Goggles para nadar", slot: "eyes", season: "summer", draw: a => onHead(a,
        '<path d="M32 49 L88 49" stroke="#ff6b00" stroke-width="3"/>' +
        '<ellipse cx="49" cy="50" rx="8" ry="6.5" fill="rgba(0,180,216,0.35)" stroke="#ff6b00" stroke-width="3"/><ellipse cx="71" cy="50" rx="8" ry="6.5" fill="rgba(0,180,216,0.35)" stroke="#ff6b00" stroke-width="3"/>') },

    // ---- Neck ----
    { id: "redCollar", name: "Red collar", es: "Collar rojo", slot: "neck", season: null, draw: a => onHead(a,
        path(COLLAR, "#d62828") + circle(60, 85, 3.6, "#ffd60a", ' stroke="#c99700" stroke-width="0.8"')) },
    { id: "bellCollar", name: "Blue collar with a bell", es: "Collar azul con cascabel", slot: "neck", season: null, draw: a => onHead(a,
        path(COLLAR, "#1d4ed8") + circle(60, 86, 4.2, "#ffd166", ' stroke="#c99700" stroke-width="1"') + '<path d="M60 86 L60 90" stroke="#8a6d00" stroke-width="1.2"/>') },
    { id: "leash", name: "Green collar and leash", es: "Collar verde con correa", slot: "neck", season: null, draw: a => onHead(a,
        path(COLLAR, "#2a9d8f") + circle(60, 85, 2.6, "none", ' stroke="#ced4da" stroke-width="1.6"') +
        '<path d="M60 87 Q92 104 119 86" stroke="#e76f51" stroke-width="2.6" fill="none" stroke-linecap="round"/>') },
    { id: "bowTie", name: "Bow tie", es: "Moño de corbata", slot: "neck", season: null, draw: a => onHead(a,
        path("M60 80 L48 73 L48 87 Z", "#7b2cbf") + path("M60 80 L72 73 L72 87 Z", "#7b2cbf") + '<rect x="57" y="77" width="6" height="6" rx="1.5" fill="#5a189a"/>') },
    { id: "necktie", name: "Necktie", es: "Corbata", slot: "neck", season: null, draw: a => onHead(a,
        path("M56 75 L64 75 L62.5 80.5 L57.5 80.5 Z", "#1d3557") + path("M57.5 80.5 L62.5 80.5 L65.5 97 L60 102 L54.5 97 Z", "#e63946") +
        '<path d="M57 86 L63.5 84 M56 92 L64.5 90" stroke="#ffffff" stroke-width="1.3" opacity="0.7"/>') },
    { id: "bandana", name: "Red bandana", es: "Pañoleta roja", slot: "neck", season: null, draw: a => onHead(a,
        path("M39 73 Q60 82 81 73 L60 97 Z", "#e76f51") + [[52, 80], [60, 84], [68, 80], [60, 91]].map(([x, y]) => circle(x, y, 1.4, "#ffffff")).join('')) },
    { id: "papelPicado", name: "Papel picado scarf", es: "Bufanda de papel picado", slot: "neck", season: "muertos", draw: a => onHead(a,
        '<path d="M40 75 Q60 84 80 75" stroke="#6c757d" stroke-width="1" fill="none"/>' +
        [[42, 76, "#ff006e"], [50, 79.5, "#fb5607"], [58, 81, "#8338ec"], [66, 80.5, "#3a86ff"], [74, 77.5, "#ffbe0b"]].map(([x, y, c]) =>
            path("M" + x + " " + y + " h7 v9 l-1.75 -2 l-1.75 2 l-1.75 -2 l-1.75 2 Z", c) + circle(x + 3.5, y + 4, 1, "#ffffff")).join('')) },
    { id: "batBowTie", name: "Bat bow tie", es: "Moño de murciélago", slot: "neck", season: "halloween", draw: a => onHead(a,
        path("M60 79 Q54 72 45 74 Q48 78 46 82 Q50 81 52 85 Q55 81 60 83 Q65 81 68 85 Q70 81 74 82 Q72 78 75 74 Q66 72 60 79 Z", "#1b1b1b", ' stroke="#c77dff" stroke-width="1.2" stroke-linejoin="round"') +
        circle(58, 79, 0.9, "#c77dff") + circle(62, 79, 0.9, "#c77dff")) },
    { id: "scarf", name: "Winter scarf", es: "Bufanda de invierno", slot: "neck", season: "winter", draw: a => onHead(a,
        path("M39 70 Q60 84 81 70 L82 78 Q60 92 38 78 Z", "#e63946") + '<path d="M44 75 Q60 85 76 75" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.8"/>' +
        '<rect x="64" y="80" width="8" height="18" rx="2" fill="#e63946" transform="rotate(-8 68 80)"/>' +
        '<path d="M64 99 L64 102 M67 99 L67 102 M70 99 L70 102" stroke="#e63946" stroke-width="1.4" transform="rotate(-8 68 80)"/>') },
    { id: "tricolorBow", name: "Tricolor bow", es: "Moño tricolor", slot: "neck", season: "independence", draw: a => onHead(a,
        path("M60 80 L48 73 L48 87 Z", "#006847") + path("M60 80 L72 73 L72 87 Z", "#ce1126") + '<rect x="56.5" y="76.5" width="7" height="7" rx="1.5" fill="#ffffff" stroke="#dddddd" stroke-width="0.6"/>') },
    { id: "flowerCollar", name: "Flower collar", es: "Collar de flores", slot: "neck", season: "spring", draw: a => onHead(a,
        path("M41 74 Q60 84 79 74 L79 77 Q60 87 41 77 Z", "#80b918") +
        [[45, 77.5, "#ff8fab"], [52.5, 81, "#ffffff"], [60, 82.5, "#ffd60a"], [67.5, 81, "#ff8fab"], [75, 77.5, "#ffffff"]].map(([x, y, c]) => flower(x, y, 4, c, "#f77f00")).join('')) },
    { id: "leafScarf", name: "Autumn leaf scarf", es: "Bufanda de hojas de otoño", slot: "neck", season: "autumn", draw: a => onHead(a,
        path(COLLAR, "#bc6c25") + [[45, 77, -30, "#f4a261"], [53, 81, -10, "#e76f51"], [61, 82.5, 10, "#ffb703"], [69, 81, 25, "#d62828"], [76, 77, 40, "#f4a261"]].map(([x, y, r, c]) =>
            '<ellipse cx="' + x + '" cy="' + (y + 3) + '" rx="2.6" ry="4.6" fill="' + c + '" transform="rotate(' + r + ' ' + x + ' ' + (y + 3) + ')"/>').join('')) },

    // ---- Body ----
    { id: "stripedShirt", name: "Striped T-shirt", es: "Playera de rayas", slot: "body", season: null, draw: (a, kind) => clothes(a, kind,
        '<rect x="25" y="62" width="70" height="52" fill="#f8f9fa"/>' + stripes("#4361ee", 70, 7, 3)) },
    { id: "heroSuit", name: "Hero suit", es: "Traje de héroe", slot: "body", season: null, draw: (a, kind) => clothes(a, kind,
        '<rect x="25" y="62" width="70" height="52" fill="#e63946"/>' + circle(60, 92, 7.5, "#ffd60a") + star(60, 92, 6, "#e63946")) },
    { id: "pumpkinCostume", name: "Pumpkin costume", es: "Disfraz de calabaza", slot: "body", season: "halloween", draw: (a, kind) => clothes(a, kind,
        '<rect x="25" y="62" width="70" height="52" fill="#ff8c00"/>' +
        '<path d="M45 70 Q40 90 45 112 M75 70 Q80 90 75 112 M60 68 L60 112" stroke="#e85d04" stroke-width="2" fill="none"/>' +
        path("M50 85 L55 92 L45 92 Z", "#1b1b1b") + path("M70 85 L75 92 L65 92 Z", "#1b1b1b") + path("M47 97 L51 101 L55 97 L60 101 L65 97 L69 101 L73 97 L70 104 L50 104 Z", "#1b1b1b")) },
    { id: "vampireCape", name: "Vampire cape", es: "Capa de vampiro", slot: "body", season: "halloween", draw: (a, kind) => clothes(a, kind,
        '<rect x="25" y="62" width="70" height="52" fill="#1b1b1b"/>' + path("M30 74 L50 80 L36 100 Z", "#c1121f") + path("M90 74 L70 80 L84 100 Z", "#c1121f") +
        circle(60, 82, 2.4, "#ffd60a")) },
    { id: "skeletonSuit", name: "Skeleton suit", es: "Traje de esqueleto", slot: "body", season: "muertos", draw: (a, kind) => clothes(a, kind,
        '<rect x="25" y="62" width="70" height="52" fill="#212529"/><path d="M60 72 L60 110" stroke="#f8f9fa" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M60 80 Q50 78 44 84 M60 80 Q70 78 76 84 M60 88 Q49 86 42 92 M60 88 Q71 86 78 92 M60 96 Q50 94 44 100 M60 96 Q70 94 76 100" stroke="#f8f9fa" stroke-width="2.4" fill="none" stroke-linecap="round"/>') },
    { id: "christmasSweater", name: "Christmas sweater", es: "Suéter navideño", slot: "body", season: "christmas", draw: (a, kind) => clothes(a, kind,
        '<rect x="25" y="62" width="70" height="52" fill="#c1121f"/><rect x="25" y="86" width="70" height="7" fill="#ffffff"/>' +
        '<path d="M28 89.5 L32 87 L36 89.5 L40 87 L44 89.5 L48 87 L52 89.5 L56 87 L60 89.5 L64 87 L68 89.5 L72 87 L76 89.5 L80 87 L84 89.5 L88 87 L92 89.5" stroke="#2d6a4f" stroke-width="1.6" fill="none"/>' +
        [[45, 78], [60, 76], [75, 78], [50, 101], [70, 101]].map(([x, y]) => star(x, y, 3, "#ffffff")).join('')) },
    { id: "flowerShirt", name: "Flower shirt", es: "Camisa de flores", slot: "body", season: "summer", draw: (a, kind) => clothes(a, kind,
        '<rect x="25" y="62" width="70" height="52" fill="#00b4d8"/>' + [[42, 80], [58, 76], [74, 82], [48, 96], [66, 98], [80, 96]].map(([x, y], i) =>
            flower(x, y, 6, i % 2 ? "#ffd60a" : "#ff8fab", "#ffffff")).join('')) },

    // ---- Feet ----
    { id: "sneakers", name: "Sport shoes", es: "Tenis deportivos", slot: "feet", season: null, draw: a => both(a, x =>
        '<ellipse cx="' + x + '" cy="108.5" rx="10" ry="6" fill="#f8f9fa" stroke="#adb5bd" stroke-width="0.8"/>' +
        '<rect x="' + (x - 10) + '" y="110.5" width="20" height="3" rx="1.5" fill="#ef476f"/>' +
        '<path d="M' + (x - 3) + ' 105 L' + (x + 3) + ' 105 M' + (x - 3) + ' 107.5 L' + (x + 3) + ' 107.5" stroke="#4361ee" stroke-width="1.2"/>') },
    { id: "rainBoots", name: "Yellow rain boots", es: "Botas de lluvia amarillas", slot: "feet", season: null, draw: a => both(a, x =>
        '<ellipse cx="' + x + '" cy="108.5" rx="10" ry="6.5" fill="#ffd60a" stroke="#e0a800" stroke-width="0.8"/>' +
        '<rect x="' + (x - 8) + '" y="102" width="16" height="3.5" rx="1.7" fill="#e0a800"/>') },
    { id: "flipFlops", name: "Flip-flops", es: "Chanclas", slot: "feet", season: "summer", draw: a => both(a, x =>
        '<ellipse cx="' + x + '" cy="112.5" rx="10.5" ry="2.6" fill="#ff8fab"/>' +
        '<path d="M' + (x - 6) + ' 110 L' + x + ' 104.5 L' + (x + 6) + ' 110" stroke="#2a9d8f" stroke-width="2.2" fill="none" stroke-linecap="round"/>') },
    { id: "snowBoots", name: "Snow boots", es: "Botas para la nieve", slot: "feet", season: "winter", draw: a => both(a, x =>
        '<ellipse cx="' + x + '" cy="108.5" rx="10" ry="6.5" fill="#6f4518"/>' +
        '<rect x="' + (x - 9) + '" y="101.5" width="18" height="5" rx="2.5" fill="#f8f9fa"/>') }
];

const ACCESSORY_BY_ID = Object.fromEntries(PET_ACCESSORIES.map(a => [a.id, a]));

/** The name of an accessory in the language of the page (GAMES-17). */
function accessoryName(accessory, lang = pageLang()) {
    return lang === "es" && accessory.es ? accessory.es : accessory.name;
}

/** The name of a season in the language of the page (GAMES-17). */
function seasonLabel(id, lang = pageLang()) {
    return lang === "es" ? SEASONS[id].labelEs : SEASONS[id].label;
}

/** Demos never give a prize: the English demos and the guides marked with demo (GAMES-17). */
function isDemoGuide(guide) {
    if (!guide) return false;
    if (guide.demo === true) return true;
    return typeof DEMO_GUIDES !== "undefined" && Object.values(DEMO_GUIDES).includes(guide);
}

/** The SVG of an outfit ({ slot: id }), in the fixed order of the slots, for a pet. */
function accessoryLayers(kind, outfit) {
    const anchors = PET_ANCHORS[kind];
    return SLOT_ORDER.map(slot => {
        const accessory = ACCESSORY_BY_ID[outfit && outfit[slot]];
        if (!accessory || accessory.slot !== slot) return "";
        return '<g class="pet-acc pet-acc-' + slot + '" data-accessory="' + accessory.id + '">' + accessory.draw(anchors, kind) + '</g>';
    }).join('');
}

// ---------- Draw (research R3) ----------

const SEASON_WEIGHT = 3;

/** Accessories that can be won on a date: the all-year ones and the ones of its seasons. */
function availableAccessories(date) {
    const seasons = activeSeasons(date);
    return PET_ACCESSORIES.filter(a => a.season === null || seasons.includes(a.season));
}

/** A surprise accessory the student does not have; the ones of the season weigh 3 times more. null if none is left. */
function pickAccessory(ownedIds, date) {
    const candidates = availableAccessories(date).filter(a => !ownedIds.includes(a.id));
    if (!candidates.length) return null;
    const weights = candidates.map(a => (a.season ? SEASON_WEIGHT : 1));
    let r = Math.random() * weights.reduce((sum, w) => sum + w, 0);
    for (let i = 0; i < candidates.length; i++) {
        r -= weights[i];
        if (r < 0) return candidates[i];
    }
    return candidates[candidates.length - 1];
}

// ---------- Students and saving (research R5) ----------

const PET_REWARDS_KEY = "games-pets-v1";

function studentKey(name) {
    return String(name || "").trim().toLowerCase().replace(/\s+/g, " ") || "guest";
}

function emptyPetRewards() {
    return { version: 1, students: {} };
}

// Only known accessories, without repeats, and outfits of owned accessories in their slot
function cleanRecord(record) {
    const owned = [];
    for (const item of Array.isArray(record.owned) ? record.owned : []) {
        if (item && ACCESSORY_BY_ID[item.id] && !owned.some(o => o.id === item.id)) owned.push({ id: item.id, date: String(item.date || "") });
    }
    const outfits = { cat: {}, dog: {} };
    for (const kind of ["cat", "dog"]) {
        const outfit = (record.outfits && record.outfits[kind]) || {};
        for (const slot of SLOT_ORDER) {
            const id = outfit[slot];
            if (ACCESSORY_BY_ID[id] && ACCESSORY_BY_ID[id].slot === slot && owned.some(o => o.id === id)) outfits[kind][slot] = id;
        }
    }
    return { name: String(record.name || ""), owned, guides: (Array.isArray(record.guides) ? record.guides : []).map(String), outfits };
}

/** @returns {{ store, available: boolean }} available is false when the browser does not let us save (FR-008) */
function loadPetRewards(storage) {
    let raw;
    try {
        raw = storage.getItem(PET_REWARDS_KEY);
    } catch (error) {
        return { store: emptyPetRewards(), available: false };
    }
    const store = emptyPetRewards();
    try {
        const data = JSON.parse(raw);
        if (data && data.students && typeof data.students === "object") {
            for (const [key, record] of Object.entries(data.students)) {
                if (record && typeof record === "object") store.students[key] = cleanRecord(record);
            }
        }
    } catch (error) { /* unreadable prizes start empty */ }
    return { store, available: true };
}

function savePetRewards(storage, store) {
    try {
        storage.setItem(PET_REWARDS_KEY, JSON.stringify(store));
        return true;
    } catch (error) {
        return false;
    }
}

/** The record of a student, created when it does not exist yet. */
function studentRecord(store, name) {
    const key = studentKey(name);
    if (!store.students[key]) store.students[key] = { name: String(name || "").trim() || "Guest", owned: [], guides: [], outfits: { cat: {}, dog: {} } };
    return store.students[key];
}

// ---------- Prize after a guide (FR-001, FR-002, research R4) ----------

/** djb2 hash of the title and sections: the same guide gives the same key. */
function guideKey(guide) {
    const text = JSON.stringify({ title: guide.title, subtitle: guide.subtitle, sections: guide.sections });
    let hash = 5381;
    for (let i = 0; i < text.length; i++) hash = ((hash * 33) ^ text.charCodeAt(i)) >>> 0;
    return hash.toString(36) + "-" + text.length.toString(36);
}

/**
 * @param {{ score: number, max: number, isDemo: boolean, date: Date }} result
 * @returns {{ status: "won"|"demo"|"repeat"|"notPerfect"|"complete", accessory?, missing? }}
 */
function awardForGuide(store, name, guide, { score, max, isDemo, date }) {
    if (isDemo) return { status: "demo" };
    if (!(max > 0 && score >= max)) return { status: "notPerfect", missing: Math.max(0, max - score) };
    const record = studentRecord(store, name);
    if (String(name || "").trim()) record.name = String(name).trim();
    const key = guideKey(guide);
    if (record.guides.includes(key)) return { status: "repeat" };
    const accessory = pickAccessory(record.owned.map(o => o.id), date);
    if (!accessory) return { status: "complete" };
    record.owned.push({ id: accessory.id, date: date.toISOString() });
    record.guides.push(key);
    return { status: "won", accessory: { id: accessory.id, name: accessory.name, slot: accessory.slot, season: accessory.season } };
}

// ---------- Putting accessories on (FR-006) ----------

/** Puts an owned accessory on a pet (replacing the one in its slot), or takes it off if it has it on. */
function toggleAccessory(store, name, kind, id) {
    const record = studentRecord(store, name);
    const accessory = ACCESSORY_BY_ID[id];
    if (!accessory || !record.owned.some(o => o.id === id)) return false;
    const outfit = record.outfits[kind];
    if (outfit[accessory.slot] === id) delete outfit[accessory.slot];
    else outfit[accessory.slot] = id;
    return true;
}

function takeEverythingOff(store, name, kind) {
    studentRecord(store, name).outfits[kind] = {};
}
