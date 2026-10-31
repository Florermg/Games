/* =====================================================================
   LANGUAGE OF THE PAGE (GAMES-17): QuizA.html is in English and
   campos/Guia5.html is in Spanish. The shared files (pets, prizes,
   environment, holidays) ask pageLang() which texts to show.
   ===================================================================== */

/** "es" on a page with <html lang="es">; "en" on the others and in Node. */
function pageLang() {
    return typeof document !== "undefined" && document.documentElement && document.documentElement.lang === "es" ? "es" : "en";
}
