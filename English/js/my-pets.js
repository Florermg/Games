/* =====================================================================
   MY PETS (GAMES-14): the prize after a perfect generated guide, the
   "My Pets" screen to put accessories on, and the outfits of the pets at
   the bottom of the window. The catalog and the rules are in pet-rewards.js.
   ===================================================================== */

let petRewards = null;   // { store, available }
let myPetsKind = "cat";

// Texts of the screen and of the prize, in the language of the page (GAMES-17)
const MY_PETS_TEXT = {
    en: {
        slots: { head: "🎩 Head", eyes: "🕶 Eyes", neck: "🎀 Neck", body: "👕 Body", feet: "👟 Feet" },
        pets: { cat: "🐱 Kitten", dog: "🐶 Puppy" },
        guest: "Guest",
        special: (season) => season + " special",
        won: "🎁 You won a new accessory for your pets!",
        writeName: "Write your name in the menu next time, so your prizes are saved for you.",
        cannotSave: "This browser does not let me save your prizes.",
        dress: "🐾 Dress my pets",
        wonTutor: (name) => "100%! You won the " + name + " for your pets. Go to My Pets to put it on!",
        repeat: "🎁 You already won the prize for this guide. Generate a new guide and get 100% to win another accessory!",
        complete: "🌟 Wow! You have all the accessories you can win today. New ones come with each season!",
        missing: (n) => "🎁 Get 100% in a generated guide to win an accessory for your pets. You were " + n + (n === 1 ? " point" : " points") + " away!",
        demoPerfect: "🎁 Perfect! Now generate a new guide and get 100% to win an accessory for your pets.",
        openWithPrizes: "Choose a pet, then tap an accessory to put it on or take it off!",
        openEmpty: "Get 100% in a new guide to win your first accessory!",
        owner: (name, count, total) => "<b>" + name + "'s pets</b> · " + count + " of " + total + " accessories",
        ownerNoName: " · Write your name in the menu to keep your own prizes.",
        imageNote: "The accessories are drawn on the game's own pets; pets with their own image keep it at the bottom of the window.",
        noAccessories: "🎁 You don't have accessories yet. Generate a guide and get 100% to win your first one!",
        on: "✓ On",
        winIt: "🎁 Win it!",
        comesBack: (season) => "Comes back in " + season,
        locked: "Locked accessory",
        lookingGreat: (name) => "Looking great with the " + name + "!",
        isOff: (name) => "The " + name + " is off."
    },
    es: {
        slots: { head: "🎩 Cabeza", eyes: "🕶 Ojos", neck: "🎀 Cuello", body: "👕 Cuerpo", feet: "👟 Patas" },
        pets: { cat: "🐱 Gatito", dog: "🐶 Perrito" },
        guest: "Invitado",
        special: (season) => "Especial de " + season,
        won: "🎁 ¡Ganaste un accesorio nuevo para tus mascotas!",
        writeName: "La próxima vez escribe tu nombre en el menú para que se guarden tus premios.",
        cannotSave: "Este navegador no me deja guardar tus premios.",
        dress: "🐾 Vestir a mis mascotas",
        wonTutor: (name) => "¡100%! Ganaste: " + name + " para tus mascotas. ¡Ve a Mis mascotas para ponérselo!",
        repeat: "🎁 Ya ganaste el premio de esta guía. ¡Genera una guía nueva y saca 100% para ganar otro accesorio!",
        complete: "🌟 ¡Increíble! Ya tienes todos los accesorios que se pueden ganar hoy. ¡Llegan nuevos en cada temporada!",
        missing: (n) => "🎁 Saca 100% en una guía nueva para ganar un accesorio para tus mascotas. ¡Te faltaron " + n + (n === 1 ? " punto" : " puntos") + "!",
        demoPerfect: "🎁 ¡Perfecto! Ahora genera una guía nueva y saca 100% para ganar un accesorio para tus mascotas.",
        openWithPrizes: "¡Elige una mascota y toca un accesorio para ponérselo o quitárselo!",
        openEmpty: "¡Saca 100% en una guía nueva para ganar tu primer accesorio!",
        owner: (name, count, total) => "<b>Mascotas de " + name + "</b> · " + count + " de " + total + " accesorios",
        ownerNoName: " · Escribe tu nombre en el menú para guardar tus propios premios.",
        imageNote: "Los accesorios se dibujan sobre las mascotas del juego; las mascotas con imagen propia la conservan abajo de la ventana.",
        noAccessories: "🎁 Todavía no tienes accesorios. ¡Genera una guía y saca 100% para ganar el primero!",
        on: "✓ Puesto",
        winIt: "🎁 ¡Gánalo!",
        comesBack: (season) => "Regresa en " + season,
        locked: "Accesorio bloqueado",
        lookingGreat: (name) => "¡Qué bien se ve con: " + name + "!",
        isOff: (name) => "Le quitaste: " + name + "."
    }
};

const myPetsText = () => MY_PETS_TEXT[pageLang()];

// localStorage can be missing or throw (private mode): FR-008
function petRewardsStorage() {
    try {
        if (window.localStorage) return window.localStorage;
    } catch (error) { /* blocked */ }
    const blocked = () => { throw new Error("Storage is not available"); };
    return { getItem: blocked, setItem: blocked };
}

function petRewardsData() {
    if (!petRewards) petRewards = loadPetRewards(petRewardsStorage());
    return petRewards;
}

function savePetRewardsNow() {
    if (!savePetRewards(petRewardsStorage(), petRewardsData().store)) petRewards.available = false;
}

// The record of the student of the menu, without creating it (just looking does not save anything)
function currentPetRecord() {
    return petRewardsData().store.students[studentKey(studentName())] || { name: studentName() || myPetsText().guest, owned: [], guides: [], outfits: { cat: {}, dog: {} } };
}

function hasOwnImage(kind) {
    const box = document.getElementById("pets");
    return Boolean(box && box.getAttribute("data-" + kind + "-image"));
}

/** Draws the pets at the bottom of the window with the outfits of the student (FR-007). */
function dressPets() {
    const outfits = currentPetRecord().outfits;
    document.querySelectorAll("#pets .pet").forEach(button => {
        const kind = button.classList.contains("pet-cat") ? "cat" : "dog";
        if (hasOwnImage(kind)) return;
        button.innerHTML = petSvg(kind, outfits[kind], "float-" + kind);
    });
}

// ---------- Prize in the results (FR-001, FR-002) ----------

function seasonNote(accessory) {
    return accessory.season ? " <span class=\"reward-season\">✨ " + escapeHtml(myPetsText().special(seasonLabel(accessory.season))) + "</span>" : "";
}

/** Called by finishGuide with the final score. Demos never give a prize (clarification 1b). */
function showPetReward(guide, score, max) {
    const box = document.getElementById("reward-box");
    if (!box) return;
    const isDemo = isDemoGuide(guide);
    const text = myPetsText();
    const result = awardForGuide(petRewardsData().store, studentName(), guide, { score, max, isDemo, date: new Date() });
    let html = "";
    if (result.status === "won") {
        savePetRewardsNow();
        const accessory = ACCESSORY_BY_ID[result.accessory.id];
        const outfit = { [accessory.slot]: accessory.id };
        html = '<div class="reward-card">' +
            '<div class="reward-pets">' + petSvg("cat", outfit, "reward-cat") + petSvg("dog", outfit, "reward-dog") + '</div>' +
            '<h3>' + text.won + '</h3>' +
            '<p class="reward-name"><b>' + escapeHtml(accessoryName(accessory)) + '</b>' + seasonNote(accessory) + '</p>' +
            (studentName() ? '' : '<p class="note">' + text.writeName + '</p>') +
            (petRewards.available ? '' : '<p class="status error">' + text.cannotSave + '</p>') +
            '<button class="main-btn" onclick="openMyPets()">' + text.dress + '</button></div>';
        tutor("🎁", text.wonTutor(accessoryName(accessory)));
    } else if (result.status === "repeat") {
        html = '<p class="reward-note">' + text.repeat + '</p>';
    } else if (result.status === "complete") {
        html = '<p class="reward-note">' + text.complete + '</p>';
    } else if (result.status === "notPerfect" && !isDemo && max > 0) {
        html = '<p class="reward-note">' + text.missing(result.missing) + '</p>';
    } else if (result.status === "demo" && max > 0 && score >= max) {
        html = '<p class="reward-note">' + text.demoPerfect + '</p>';
    }
    box.innerHTML = html;
}

// ---------- My Pets screen (FR-006) ----------

function openMyPets() {
    document.getElementById("menu-screen").classList.add("hidden");
    document.getElementById("sheet-screen").classList.add("hidden");
    document.getElementById("results-screen").classList.add("hidden");
    document.querySelectorAll(".reference-screen").forEach(screen => screen.classList.add("hidden"));
    document.getElementById("pets-screen").classList.remove("hidden");
    renderMyPets();
    window.scrollTo(0, 0);
    const owned = currentPetRecord().owned.length;
    tutor("🐾", owned ? myPetsText().openWithPrizes : myPetsText().openEmpty);
}

function chooseMyPet(kind) {
    myPetsKind = kind;
    renderMyPets();
}

function renderMyPets() {
    const record = currentPetRecord();
    const ownedIds = record.owned.map(o => o.id);
    const seasons = activeSeasons(new Date());
    const text = myPetsText();
    document.getElementById("mp-owner").innerHTML = text.owner(escapeHtml(record.name || text.guest), ownedIds.length, PET_ACCESSORIES.length) +
        (studentName() ? "" : text.ownerNoName);
    document.getElementById("mp-save-note").innerText = petRewardsData().available ? "" : text.cannotSave;
    document.getElementById("mp-image-note").innerText = hasOwnImage("cat") || hasOwnImage("dog") ? text.imageNote : "";

    document.getElementById("mp-stage").innerHTML = ["cat", "dog"].map(kind =>
        '<button type="button" class="mp-pet' + (kind === myPetsKind ? ' selected' : '') + '" onclick="chooseMyPet(\'' + kind + '\')" aria-pressed="' + (kind === myPetsKind) + '">' +
        petSvg(kind, record.outfits[kind], "stage-" + kind) + '<span>' + text.pets[kind] + '</span></button>').join('');

    const outfit = record.outfits[myPetsKind];
    const box = document.getElementById("mp-wardrobe");
    if (!ownedIds.length) {
        box.innerHTML = '<p class="reward-note">' + text.noAccessories + '</p>';
    } else {
        box.innerHTML = "";
    }
    box.innerHTML += SLOT_ORDER.slice().reverse().map(slot => {
        // The ones the student has first, then the locked ones
        const items = PET_ACCESSORIES.filter(a => a.slot === slot)
            .sort((x, y) => Number(ownedIds.includes(y.id)) - Number(ownedIds.includes(x.id)));
        return '<h3 class="mp-slot">' + text.slots[slot] + '</h3><div class="mp-grid">' + items.map(a => {
            if (ownedIds.includes(a.id)) {
                const on = outfit[slot] === a.id;
                return '<button type="button" class="mp-item' + (on ? ' on' : '') + '" data-id="' + a.id + '" aria-pressed="' + on + '">' +
                    petSvg(myPetsKind, { [slot]: a.id }, "item-" + a.id) + '<span class="mp-name">' + escapeHtml(accessoryName(a)) + '</span>' +
                    (on ? '<span class="mp-on">' + text.on + '</span>' : '') + '</button>';
            }
            const when = a.season === null || seasons.includes(a.season) ? text.winIt : text.comesBack(seasonLabel(a.season));
            return '<div class="mp-item locked" aria-label="' + text.locked + '">' + petSvg(myPetsKind, { [slot]: a.id }, "lock-" + a.id) +
                '<span class="mp-name">???</span><span class="mp-when">' + escapeHtml(when) + '</span></div>';
        }).join('') + '</div>';
    }).join('');
    box.querySelectorAll(".mp-item[data-id]").forEach(button => {
        button.onclick = () => wearAccessory(button.dataset.id);
    });
}

function wearAccessory(id) {
    const store = petRewardsData().store;
    toggleAccessory(store, studentName(), myPetsKind, id);
    savePetRewardsNow();
    renderMyPets();
    dressPets();
    const on = currentPetRecord().outfits[myPetsKind][ACCESSORY_BY_ID[id].slot] === id;
    const name = accessoryName(ACCESSORY_BY_ID[id]);
    tutor(myPetsKind === "cat" ? "🐱" : "🐶", on ? myPetsText().lookingGreat(name) : myPetsText().isOff(name));
}

function takeOffAllClick() {
    takeEverythingOff(petRewardsData().store, studentName(), myPetsKind);
    savePetRewardsNow();
    renderMyPets();
    dressPets();
}

// ---------- Start ----------

function setupMyPets() {
    dressPets();
    const name = document.getElementById("student-name");
    // Another student: the pets wear what that student chose (US3)
    if (name) name.addEventListener("input", () => {
        dressPets();
        if (!document.getElementById("pets-screen").classList.contains("hidden")) renderMyPets();
    });
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupMyPets);
    else setupMyPets();
}
