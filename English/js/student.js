/* =====================================================================
   STUDENT (GAMES-18): the name is written once, on the main page or in any
   subject, and every page of the game fills it in. Saved on the device.
   ===================================================================== */

const STUDENT_KEY = "games-student-v1";

function loadStudentName(storage) {
    try {
        const value = storage.getItem(STUDENT_KEY);
        return typeof value === "string" ? value.slice(0, 40) : "";
    } catch (error) {
        return "";
    }
}

function saveStudentName(storage, name) {
    try {
        storage.setItem(STUDENT_KEY, String(name).slice(0, 40));
        return true;
    } catch (error) {
        return false;
    }
}

function studentStorage() {
    try {
        if (window.localStorage) return window.localStorage;
    } catch (error) { /* blocked */ }
    const blocked = () => { throw new Error("Storage is not available"); };
    return { getItem: blocked, setItem: blocked };
}

function setupStudentName() {
    const input = document.getElementById("student-name");
    if (!input) return;
    const storage = studentStorage();
    const saved = loadStudentName(storage);
    if (!input.value && saved) {
        input.value = saved;
        // After the other setups, so the pets and the summary follow the name
        setTimeout(() => input.dispatchEvent(new Event("input")), 0);
    }
    input.addEventListener("input", () => saveStudentName(storage, input.value.trim()));
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupStudentName);
    else setupStudentName();
}
