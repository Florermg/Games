/* =====================================================================
   ENVIRONMENT (GAMES-15): the sky of the game follows the time of day
   (morning, afternoon, night), the current weather of the student's city
   (Open-Meteo, no key) and the season. The pure part is tested in Node;
   the DOM part at the end only runs in the browser.
   Test mode: QuizA.html?ambiente=noche&clima=lluvia&estacion=invierno
   ===================================================================== */

const ENV_PERIODS = {
    day: { label: "Morning", emoji: "☀️" },
    afternoon: { label: "Afternoon", emoji: "🌇" },
    night: { label: "Night", emoji: "🌙" }
};

const ENV_WEATHERS = {
    clear: { label: "Sunny", emoji: "☀️", nightLabel: "Clear sky", nightEmoji: "🌙" },
    cloudy: { label: "Cloudy", emoji: "☁️" },
    fog: { label: "Foggy", emoji: "🌫" },
    rain: { label: "Rain", emoji: "🌧" },
    snow: { label: "Snow", emoji: "❄️" },
    storm: { label: "Storm", emoji: "⛈" }
};

const ENV_SEASONS = {
    spring: { label: "Spring", emoji: "🌸" },
    summer: { label: "Summer", emoji: "🌻" },
    autumn: { label: "Autumn", emoji: "🍂" },
    winter: { label: "Winter", emoji: "⛄" }
};

/** Morning 6:00-11:59, afternoon 12:00-18:59, night 19:00-5:59 (FR-001). */
function periodOf(date) {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return "day";
    if (hour >= 12 && hour < 19) return "afternoon";
    return "night";
}

/** The astronomical season, with the same dates as the seasonal accessories (GAMES-14). */
function seasonOf(date) {
    return activeSeasons(date).find(id => id in ENV_SEASONS);
}

// ---------- Test mode in the address (FR-008) ----------

const ENV_OVERRIDE_WORDS = {
    ambiente: {
        dia: "day", day: "day", manana: "day", morning: "day",
        tarde: "afternoon", afternoon: "afternoon",
        noche: "night", night: "night"
    },
    clima: {
        sol: "clear", soleado: "clear", despejado: "clear", clear: "clear", sunny: "clear",
        nubes: "cloudy", nublado: "cloudy", cloudy: "cloudy", clouds: "cloudy",
        niebla: "fog", neblina: "fog", fog: "fog", foggy: "fog",
        lluvia: "rain", rain: "rain",
        nieve: "snow", snow: "snow",
        tormenta: "storm", storm: "storm"
    },
    estacion: {
        primavera: "spring", spring: "spring",
        verano: "summer", summer: "summer",
        otono: "autumn", autumn: "autumn", fall: "autumn",
        invierno: "winter", winter: "winter"
    }
};
const ENV_OVERRIDE_FIELDS = { ambiente: "period", clima: "weather", estacion: "season" };

// "Otoño", "DÍA" → "otono", "dia"
const plainWord = (text) => String(text).trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Reads ?ambiente=, ?clima= and ?estacion=; unknown values are ignored (US4). */
function envOverrides(search) {
    const params = new URLSearchParams(search || "");
    const overrides = {};
    for (const [param, field] of Object.entries(ENV_OVERRIDE_FIELDS)) {
        const value = ENV_OVERRIDE_WORDS[param][plainWord(params.get(param) || "")];
        if (value) overrides[field] = value;
    }
    return overrides;
}

// ---------- State, classes and summary ----------

/**
 * @param {{date: Date, weather: ?{kind, temperature}, place: ?string, overrides: object}} input
 * A forced weather (test mode) has no real temperature or place.
 */
function environmentState({ date, weather, place, overrides }) {
    const forced = overrides || {};
    const real = forced.weather ? null : weather;
    return {
        period: forced.period || periodOf(date),
        season: forced.season || seasonOf(date),
        weather: forced.weather || (real ? real.kind : null),
        temperature: real && typeof real.temperature === "number" ? Math.round(real.temperature) : null,
        place: real ? place || null : null,
        test: Object.keys(forced).length > 0
    };
}

function environmentClasses(state) {
    return ["env-" + state.period, "env-w-" + (state.weather || "none"), "env-s-" + state.season];
}

function weatherLabel(state) {
    const info = ENV_WEATHERS[state.weather];
    const night = state.period === "night" && info.nightLabel;
    let text = (night ? info.nightEmoji + " " + info.nightLabel : info.emoji + " " + info.label);
    if (state.temperature !== null) text += ", " + state.temperature + " °C";
    if (state.place) text += state.place === ENV_HERE_NAME ? " " + ENV_HERE_NAME : " in " + state.place;
    return text;
}

/** "🌙 Night · 🌧 Rain, 17 °C in Ciudad de México · 🍂 Autumn" (FR-005). */
function environmentSummary(state) {
    const parts = [ENV_PERIODS[state.period].emoji + " " + ENV_PERIODS[state.period].label];
    if (state.weather) parts.push(weatherLabel(state));
    parts.push(ENV_SEASONS[state.season].emoji + " " + ENV_SEASONS[state.season].label);
    if (state.test) parts.push("🧪 test mode");
    return parts.join(" · ");
}

// ---------- Colors and drawing (FR-005, FR-006) ----------

const GREY_WEATHERS = ["cloudy", "fog", "rain", "snow", "storm"];

// [top, bottom] of the sky
const SKY_COLORS = {
    day: { clear: ["#6ec3f5", "#dff2ff"], grey: ["#9db3c6", "#e2e9ef"], storm: ["#66778a", "#aeb9c4"], snow: ["#bfd0df", "#f3f7fb"] },
    afternoon: { clear: ["#ff9466", "#ffd9a8"], grey: ["#bc948a", "#e8cfc0"], storm: ["#755b58", "#b89f95"], snow: ["#cdb5b5", "#f2e6e3"] },
    night: { clear: ["#0e1846", "#3a3d82"], grey: ["#1f2638", "#434a63"], storm: ["#11141e", "#2d3244"], snow: ["#2a3350", "#59607e"] }
};

/** Colors of the sky for a state: also used by the page background and the bars (FR-006). */
function skyColors(state) {
    const colors = SKY_COLORS[state.period];
    if (state.weather === "storm") return colors.storm;
    if (state.weather === "snow") return colors.snow;
    if (GREY_WEATHERS.includes(state.weather)) return colors.grey;
    return colors.clear;
}

// Fixed positions (no Math.random): the same state always gives the same drawing
const spread = (count, mod, offset) => Array.from({ length: count }, (_, i) => (i * mod + offset) % 100);

function sceneSun(state) {
    const dim = GREY_WEATHERS.includes(state.weather) ? ' opacity="0.55"' : "";
    if (state.period === "afternoon") {
        return '<g class="env-sun"' + dim + '><circle cx="262" cy="82" r="26" fill="#ffb36b" opacity="0.35"/>' +
            '<circle cx="262" cy="82" r="17" fill="#ff7a3d"/></g>';
    }
    return '<g class="env-sun"' + dim + '><circle cx="56" cy="32" r="24" fill="#fff3a6" opacity="0.45"/>' +
        '<circle cx="56" cy="32" r="15" fill="#ffd93b"/></g>';
}

function sceneMoon(state) {
    const dim = GREY_WEATHERS.includes(state.weather) ? ' opacity="0.5"' : "";
    return '<g class="env-moon"' + dim + '><circle cx="262" cy="30" r="20" fill="#fff6c9" opacity="0.18"/>' +
        '<circle cx="262" cy="30" r="13" fill="#fff6c9"/>' +
        '<circle cx="257" cy="27" r="2.6" fill="#e6dca8"/><circle cx="266" cy="35" r="2" fill="#e6dca8"/><circle cx="267" cy="24" r="1.4" fill="#e6dca8"/></g>';
}

function sceneStars() {
    const xs = spread(14, 37, 7), ys = spread(14, 23, 11);
    return '<g class="env-stars">' + xs.map((x, i) =>
        '<circle cx="' + (x * 3.1 + 6).toFixed(1) + '" cy="' + (ys[i] * 0.62 + 4).toFixed(1) + '" r="' + (i % 3 === 0 ? 1.6 : 1) + '" fill="#fffbe0"/>').join("") + '</g>';
}

function cloud(x, y, scale, fill) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + scale + ')" fill="' + fill + '">' +
        '<ellipse cx="0" cy="6" rx="26" ry="10"/><circle cx="-10" cy="0" r="11"/><circle cx="8" cy="-4" r="14"/><circle cx="22" cy="4" r="9"/></g>';
}

function sceneClouds(state) {
    const shades = {
        day: { light: "#ffffff", rain: "#a9b3bf", storm: "#6d7685" },
        afternoon: { light: "#fff1e8", rain: "#b9a3a0", storm: "#7a6866" },
        night: { light: "#7d86a3", rain: "#565e76", storm: "#3a4052" }
    }[state.period];
    const fill = state.weather === "storm" ? shades.storm : state.weather === "rain" ? shades.rain : shades.light;
    return '<g class="env-clouds" opacity="0.95">' + cloud(70, 34, 1, fill) + cloud(160, 24, 1.25, fill) + cloud(250, 38, 0.95, fill) +
        (state.weather === "cloudy" ? "" : cloud(115, 46, 0.8, fill) + cloud(210, 50, 0.85, fill)) + '</g>';
}

function sceneDrops(state) {
    const xs = spread(26, 41, 3);
    const color = state.period === "night" ? "#9fb2e6" : "#5b8fd6";
    return '<g class="env-drops" stroke="' + color + '" stroke-width="1.6" stroke-linecap="round">' + xs.map((x, i) => {
        const x1 = 20 + x * 2.8, y1 = 52 + (i * 17) % 34;
        return '<line x1="' + x1.toFixed(1) + '" y1="' + y1 + '" x2="' + (x1 - 3).toFixed(1) + '" y2="' + (y1 + 8) + '"/>';
    }).join("") + '</g>';
}

function sceneFlakes() {
    const xs = spread(24, 43, 5);
    return '<g class="env-flakes" fill="#ffffff">' + xs.map((x, i) =>
        '<circle cx="' + (14 + x * 2.9).toFixed(1) + '" cy="' + (50 + (i * 13) % 42) + '" r="' + (i % 2 ? 2 : 1.4) + '"/>').join("") + '</g>';
}

function sceneBolt() {
    return '<path class="env-bolt" d="M168 44 L156 68 L166 68 L158 90 L180 62 L169 62 L177 44 Z" fill="#ffe14d" stroke="#f5b800" stroke-width="1"/>';
}

function sceneFog() {
    return '<g class="env-fog" fill="#ffffff">' +
        '<rect x="-10" y="58" width="220" height="9" rx="4.5" opacity="0.55"/><rect x="90" y="72" width="250" height="10" rx="5" opacity="0.5"/>' +
        '<rect x="-10" y="86" width="200" height="9" rx="4.5" opacity="0.45"/></g>';
}

function flowerAt(x, y, petals) {
    return '<g transform="translate(' + x + ' ' + y + ')"><line x1="0" y1="0" x2="0" y2="9" stroke="#3f9a3a" stroke-width="1.4"/>' +
        [[-3, -1], [3, -1], [0, -4], [0, 2]].map(([dx, dy]) => '<circle cx="' + dx + '" cy="' + dy + '" r="2.6" fill="' + petals + '"/>').join("") +
        '<circle cx="0" cy="-1" r="1.8" fill="#ffd23b"/></g>';
}

const SCENE_GROUNDS = {
    spring: () => '<path d="M0 98 Q80 86 160 96 T320 94 V120 H0 Z" fill="#7fd37a"/>' +
        flowerAt(40, 102, "#ff8fb8") + flowerAt(92, 106, "#ffffff") + flowerAt(150, 101, "#c58bff") +
        flowerAt(214, 105, "#ff8fb8") + flowerAt(276, 101, "#ffffff"),
    summer: () => '<path d="M0 98 Q80 88 160 97 T320 95 V120 H0 Z" fill="#59bf48"/>' +
        '<g transform="translate(70 76)"><line x1="0" y1="8" x2="0" y2="30" stroke="#2f8a2a" stroke-width="2.4"/>' +
        '<path d="M0 20 Q-9 14 -12 20 Q-6 24 0 22" fill="#3fa53a"/>' +
        Array.from({ length: 10 }, (_, i) => '<ellipse cx="0" cy="-7" rx="2.6" ry="5.5" fill="#ffc81f" transform="rotate(' + i * 36 + ')"/>').join("") +
        '<circle r="5" fill="#7a4a1c"/></g>',
    autumn: () => '<path d="M0 98 Q80 88 160 97 T320 95 V120 H0 Z" fill="#c8a35a"/>' +
        '<g transform="translate(70 62)"><rect x="-3" y="10" width="6" height="28" rx="2" fill="#7a4a24"/>' +
        '<circle cx="-11" cy="6" r="13" fill="#e8742c"/><circle cx="10" cy="4" r="14" fill="#f0a030"/><circle cx="0" cy="-8" r="13" fill="#d9532a"/></g>' +
        [[110, 104, "#e8742c"], [160, 109, "#d9532a"], [230, 103, "#f0a030"], [286, 108, "#e8742c"]].map(([x, y, c]) =>
            '<ellipse cx="' + x + '" cy="' + y + '" rx="4.5" ry="2.4" fill="' + c + '" transform="rotate(-25 ' + x + ' ' + y + ')"/>').join(""),
    winter: () => '<path d="M0 96 Q80 86 160 95 T320 93 V120 H0 Z" fill="#f4f8ff"/>' +
        '<g transform="translate(70 66)"><rect x="-2.5" y="30" width="5" height="8" fill="#6b4a2b"/>' +
        '<path d="M0 -10 L14 12 H-14 Z M0 2 L18 30 H-18 Z" fill="#2f7a4a"/>' +
        '<path d="M0 -10 L6 0 L0 -2 L-6 0 Z M0 2 L8 14 L0 11 L-8 14 Z" fill="#ffffff"/></g>' +
        '<g transform="translate(232 92)"><circle cy="0" r="9" fill="#ffffff" stroke="#d5dff0"/><circle cy="-14" r="6.5" fill="#ffffff" stroke="#d5dff0"/>' +
        '<circle cx="-2" cy="-15" r="0.9" fill="#333"/><circle cx="2" cy="-15" r="0.9" fill="#333"/><path d="M0 -13 L5 -12 L0 -11.5 Z" fill="#ff8a3d"/></g>'
};

/** The window of the menu: sky, sun or moon, clouds, rain or snow and the ground of the season. */
function environmentSceneSvg(state, uid) {
    const id = "env-" + uid + "-sky";
    const [top, bottom] = skyColors(state);
    const night = state.period === "night";
    const grey = GREY_WEATHERS.includes(state.weather);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" role="img" aria-label="' + environmentSummary(state).replace(/"/g, "") + '" ' +
        'data-period="' + state.period + '" data-weather="' + (state.weather || "none") + '" data-season="' + state.season + '">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + bottom + '"/></linearGradient></defs>' +
        '<rect width="320" height="120" fill="url(#' + id + ')"/>' +
        (night && !grey ? sceneStars() : "") +
        (night ? sceneMoon(state) : sceneSun(state)) +
        (grey ? sceneClouds(state) : "") +
        (state.weather === "storm" ? sceneBolt() : "") +
        '<g class="env-ground env-ground-' + state.season + '">' + SCENE_GROUNDS[state.season]() +
        (night ? '<rect y="84" width="320" height="36" fill="#0b1030" opacity="0.35"/>' : "") + '</g>' +
        (state.weather === "rain" || state.weather === "storm" ? sceneDrops(state) : "") +
        (state.weather === "snow" ? sceneFlakes() : "") +
        (state.weather === "fog" ? sceneFog() : "") +
        '</svg>';
}

/** What falls in the background of the page: the weather wins over the season (FR-006). */
function backgroundParticles(state) {
    let kind = null, count = 0, duration = 1;
    if (state.weather === "rain" || state.weather === "storm") { kind = "rain"; count = 40; duration = 0.9; }
    else if (state.weather === "snow") { kind = "snow"; count = 36; duration = 9; }
    else if (state.season === "autumn") { kind = "leaf"; count = 10; duration = 12; }
    else if (state.season === "spring") { kind = "petal"; count = 10; duration = 11; }
    if (!kind) return "";
    return spread(count, 37, 3).map((left, i) => {
        const time = duration * (0.8 + (i % 5) * 0.1);
        return '<span class="env-p env-p-' + kind + '" style="left:' + (left + (i % 3) * 0.33).toFixed(2) + '%;' +
            'animation-duration:' + time.toFixed(2) + 's;animation-delay:-' + ((i * 0.618 * duration) % time).toFixed(2) + 's"></span>';
    }).join("");
}

// ---------- Weather (FR-003, FR-007) ----------

/** WMO weather code → one of the 6 kinds, or null (research R2). */
function weatherKind(code) {
    if (!Number.isInteger(code)) return null;
    if (code === 0 || code === 1) return "clear";
    if (code === 2 || code === 3) return "cloudy";
    if (code === 45 || code === 48) return "fog";
    if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
    if (code >= 95 && code <= 99) return "storm";
    return null;
}

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// Only the coordinates, rounded to 2 decimals (about 1 km), are sent
function weatherUrl(lat, lon) {
    return WEATHER_API + "?latitude=" + lat.toFixed(2) + "&longitude=" + lon.toFixed(2) + "&current=temperature_2m,weather_code&timezone=auto";
}

function parseWeather(json) {
    const current = json && json.current;
    if (!current) return null;
    const kind = weatherKind(current.weather_code);
    const temperature = current.temperature_2m;
    if (!kind || typeof temperature !== "number" || !Number.isFinite(temperature)) return null;
    return { kind, temperature: Math.round(temperature) };
}

/** The current weather, or null when there is no internet or the answer is wrong (never throws). */
async function fetchWeather(lat, lon, fetchFn) {
    if (typeof fetchFn !== "function") return null;
    try {
        const answer = await fetchFn(weatherUrl(lat, lon));
        if (!answer || !answer.ok) return null;
        return parseWeather(await answer.json());
    } catch (error) {
        return null;
    }
}

// ---------- Places (FR-004) ----------

const ENV_HERE = "here";
const ENV_HERE_NAME = "where you are";
const ENV_DEFAULT_CITY = "cdmx";

// Ciudad de México first, then the capitals of the states and other big cities
const ENV_CITIES = [
    { id: "cdmx", name: "Ciudad de México", lat: 19.43, lon: -99.13 },
    { id: "acapulco", name: "Acapulco", lat: 16.85, lon: -99.82 },
    { id: "aguascalientes", name: "Aguascalientes", lat: 21.88, lon: -102.29 },
    { id: "campeche", name: "Campeche", lat: 19.85, lon: -90.53 },
    { id: "cancun", name: "Cancún", lat: 21.16, lon: -86.85 },
    { id: "chetumal", name: "Chetumal", lat: 18.50, lon: -88.30 },
    { id: "chihuahua", name: "Chihuahua", lat: 28.63, lon: -106.07 },
    { id: "chilpancingo", name: "Chilpancingo", lat: 17.55, lon: -99.50 },
    { id: "juarez", name: "Ciudad Juárez", lat: 31.69, lon: -106.42 },
    { id: "victoria", name: "Ciudad Victoria", lat: 23.74, lon: -99.15 },
    { id: "colima", name: "Colima", lat: 19.24, lon: -103.72 },
    { id: "cuernavaca", name: "Cuernavaca", lat: 18.92, lon: -99.23 },
    { id: "culiacan", name: "Culiacán", lat: 24.81, lon: -107.39 },
    { id: "durango", name: "Durango", lat: 24.02, lon: -104.66 },
    { id: "guadalajara", name: "Guadalajara", lat: 20.67, lon: -103.35 },
    { id: "guanajuato", name: "Guanajuato", lat: 21.02, lon: -101.26 },
    { id: "hermosillo", name: "Hermosillo", lat: 29.07, lon: -110.96 },
    { id: "lapaz", name: "La Paz", lat: 24.14, lon: -110.31 },
    { id: "leon", name: "León", lat: 21.12, lon: -101.68 },
    { id: "mazatlan", name: "Mazatlán", lat: 23.25, lon: -106.41 },
    { id: "merida", name: "Mérida", lat: 20.97, lon: -89.62 },
    { id: "mexicali", name: "Mexicali", lat: 32.62, lon: -115.45 },
    { id: "monterrey", name: "Monterrey", lat: 25.69, lon: -100.32 },
    { id: "morelia", name: "Morelia", lat: 19.70, lon: -101.19 },
    { id: "oaxaca", name: "Oaxaca", lat: 17.07, lon: -96.73 },
    { id: "pachuca", name: "Pachuca", lat: 20.10, lon: -98.76 },
    { id: "puebla", name: "Puebla", lat: 19.04, lon: -98.21 },
    { id: "queretaro", name: "Querétaro", lat: 20.59, lon: -100.39 },
    { id: "saltillo", name: "Saltillo", lat: 25.42, lon: -101.00 },
    { id: "sanluis", name: "San Luis Potosí", lat: 22.16, lon: -100.98 },
    { id: "tepic", name: "Tepic", lat: 21.50, lon: -104.89 },
    { id: "tijuana", name: "Tijuana", lat: 32.51, lon: -117.04 },
    { id: "tlaxcala", name: "Tlaxcala", lat: 19.32, lon: -98.24 },
    { id: "toluca", name: "Toluca", lat: 19.29, lon: -99.66 },
    { id: "torreon", name: "Torreón", lat: 25.54, lon: -103.41 },
    { id: "tuxtla", name: "Tuxtla Gutiérrez", lat: 16.75, lon: -93.12 },
    { id: "veracruz", name: "Veracruz", lat: 19.17, lon: -96.13 },
    { id: "villahermosa", name: "Villahermosa", lat: 17.99, lon: -92.93 },
    { id: "zacatecas", name: "Zacatecas", lat: 22.77, lon: -102.58 }
];

function cityById(id) {
    return ENV_CITIES.find(city => city.id === id) || ENV_CITIES.find(city => city.id === ENV_DEFAULT_CITY);
}

// ---------- Saving (FR-004) ----------

const ENV_KEY = "games-env-v1";
const ENV_WEATHER_MINUTES = 30;

const round2 = (value) => Math.round(value * 100) / 100;
const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

function cleanEnvironment(raw) {
    const data = { city: ENV_HERE, weather: null };
    if (!raw || typeof raw !== "object") return data;
    if (raw.city === ENV_HERE || ENV_CITIES.some(city => city.id === raw.city)) data.city = raw.city;
    const w = raw.weather;
    if (w && w.kind in ENV_WEATHERS && [w.temperature, w.lat, w.lon, w.time].every(isNumber)) {
        data.weather = { kind: w.kind, temperature: w.temperature, lat: w.lat, lon: w.lon, time: w.time };
    }
    if (data.city !== raw.city) data.weather = null;
    return data;
}

function loadEnvironment(storage) {
    try {
        const text = storage.getItem(ENV_KEY);
        let raw = null;
        try { raw = text ? JSON.parse(text) : null; } catch (error) { raw = null; }
        return { data: cleanEnvironment(raw), available: true };
    } catch (error) {
        return { data: cleanEnvironment(null), available: false };
    }
}

function saveEnvironment(storage, data) {
    try {
        storage.setItem(ENV_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        return false;
    }
}

/** The saved weather if it is from the same place and less than 30 minutes old (FR-003). */
function cachedWeather(data, lat, lon, now) {
    const w = data && data.weather;
    if (!w || round2(w.lat) !== round2(lat) || round2(w.lon) !== round2(lon)) return null;
    const age = now - w.time;
    if (age < 0 || age >= ENV_WEATHER_MINUTES * 60000) return null;
    return { kind: w.kind, temperature: w.temperature };
}

// ---------- In the browser ----------

let envData = null;
let envOverridesNow = {};
let envWeatherNow = null;
let envPlaceName = null;
let envDrawn = "";

function envStorage() {
    try {
        if (window.localStorage) return window.localStorage;
    } catch (error) { /* blocked */ }
    const blocked = () => { throw new Error("Storage is not available"); };
    return { getItem: blocked, setItem: blocked };
}

function envNote(text) {
    const note = document.getElementById("env-note");
    if (note) note.innerText = text || "";
}

/** Draws the current environment: body classes and colors, menu window, background and summary. */
function applyEnvironment() {
    const state = environmentState({ date: new Date(), weather: envWeatherNow, place: envPlaceName, overrides: envOverridesNow });
    const body = document.body;
    body.className = body.className.split(/\s+/).filter(name => name && !name.startsWith("env-")).concat(environmentClasses(state)).join(" ");
    const [top, bottom] = skyColors(state);
    body.style.setProperty("--env-top", top);
    body.style.setProperty("--env-bottom", bottom);

    const key = JSON.stringify(state);
    if (key === envDrawn) return;
    envDrawn = key;
    const windowBox = document.getElementById("env-window");
    if (windowBox) windowBox.innerHTML = environmentSceneSvg(state, "menu");
    const scene = document.getElementById("env-scene");
    if (scene) scene.innerHTML = backgroundParticles(state) + (state.weather === "storm" ? '<span class="env-flash"></span>' : "");
    const summary = document.getElementById("env-summary");
    if (summary) summary.innerText = environmentSummary(state);
}

function withTimeout(promise, ms, fallback) {
    return Promise.race([promise, new Promise(resolve => setTimeout(() => resolve(fallback), ms))]);
}

/** Where the weather is from: the browser's location first, then the chosen city (clarification 5c). */
function locatePlace() {
    const city = cityById(envData.city);
    const fromCity = (note) => ({ lat: city.lat, lon: city.lon, name: city.name, note });
    if (envData.city !== ENV_HERE) return Promise.resolve(fromCity(""));
    const fallbackNote = "I could not get your location, so I show the weather of Ciudad de México. You can choose your city.";
    if (!navigator.geolocation) return Promise.resolve(fromCity(fallbackNote));
    const asked = new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            position => resolve({ lat: position.coords.latitude, lon: position.coords.longitude, name: ENV_HERE_NAME, note: "" }),
            () => resolve(fromCity(fallbackNote)),
            { timeout: 8000, maximumAge: ENV_WEATHER_MINUTES * 60000 }
        );
    });
    // The browser's timeout only starts after the permission: nobody answering the question also falls back
    return withTimeout(asked, 12000, fromCity(fallbackNote));
}

async function refreshWeather() {
    if (envOverridesNow.weather) return;
    const place = await locatePlace();
    let weather = cachedWeather(envData, place.lat, place.lon, Date.now());
    if (!weather) {
        if (!envWeatherNow) envNote("Looking at the sky…");
        weather = await withTimeout(fetchWeather(place.lat, place.lon, typeof fetch === "function" ? fetch : null), 8000, null);
        if (weather) {
            envData.weather = Object.assign({}, weather, { lat: round2(place.lat), lon: round2(place.lon), time: Date.now() });
            saveEnvironment(envStorage(), envData);
        }
    }
    envWeatherNow = weather;
    envPlaceName = place.name;
    envNote(weather ? place.note : "No weather right now (maybe there is no internet). The time of day and the season still change.");
    applyEnvironment();
}

function chooseEnvCity() {
    const select = document.getElementById("env-city");
    envData.city = select.value;
    envData.weather = null;
    saveEnvironment(envStorage(), envData);
    refreshWeather();
}

function setupEnvironment() {
    envOverridesNow = envOverrides(window.location.search);
    envData = loadEnvironment(envStorage()).data;
    const select = document.getElementById("env-city");
    if (select) {
        select.innerHTML = '<option value="' + ENV_HERE + '">📍 Where I am</option>' +
            ENV_CITIES.map(city => '<option value="' + city.id + '">' + escapeHtml(city.name) + '</option>').join("");
        select.value = envData.city;
        select.addEventListener("change", chooseEnvCity);
        // In test mode with a forced weather, the city does nothing
        select.disabled = Boolean(envOverridesNow.weather);
    }
    applyEnvironment();
    setInterval(applyEnvironment, 60000);
    if (envOverridesNow.weather) {
        envNote("Test mode: the weather comes from the address, not from the internet.");
    } else {
        refreshWeather();
        setInterval(refreshWeather, ENV_WEATHER_MINUTES * 60000);
    }
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupEnvironment);
    else setupEnvironment();
}
