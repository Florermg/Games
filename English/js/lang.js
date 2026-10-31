/* =====================================================================
   LANGUAGE OF THE PAGE (GAMES-17): QuizA.html is in English and
   campos/Guia5.html is in Spanish. The shared files (pets, prizes,
   environment, holidays) ask pageLang() which texts to show.
   ===================================================================== */

/** "es" on a page with <html lang="es">; "en" on the others and in Node. */
function pageLang() {
    return typeof document !== "undefined" && document.documentElement && document.documentElement.lang === "es" ? "es" : "en";
}

// The main page (QuizA.html, <html data-lang-choice>) lets the student choose its
// language, English by default (GAMES-18). It runs first, before the other scripts.
const LANG_KEY = "games-lang-v1";

function savedLang() {
    try {
        const value = window.localStorage.getItem(LANG_KEY);
        return value === "es" || value === "en" ? value : null;
    } catch (error) {
        return null;
    }
}

if (typeof document !== "undefined" && document.documentElement.hasAttribute("data-lang-choice")) {
    const lang = savedLang();
    if (lang) document.documentElement.lang = lang;
}
