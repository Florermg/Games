/* =====================================================================
   MY PETS (GAMES-14): the prize after a perfect generated guide, the
   "My Pets" screen to put accessories on, and the outfits of the pets at
   the bottom of the window. The catalog and the rules are in pet-rewards.js.
   ===================================================================== */

let petRewards = null;   // { store, available }
let myPetsKind = "cat";

const SLOT_LABELS = { head: "🎩 Head", eyes: "🕶 Eyes", neck: "🎀 Neck", body: "👕 Body", feet: "👟 Feet" };
const PET_LABELS = { cat: "🐱 Kitten", dog: "🐶 Puppy" };

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
    return petRewardsData().store.students[studentKey(studentName())] || { name: studentName() || "Guest", owned: [], guides: [], outfits: { cat: {}, dog: {} } };
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
    return accessory.season ? " <span class=\"reward-season\">✨ " + escapeHtml(SEASONS[accessory.season].label) + " special</span>" : "";
}

/** Called by finishGuide with the final score. Demos never give a prize (clarification 1b). */
function showPetReward(guide, score, max) {
    const box = document.getElementById("reward-box");
    if (!box) return;
    const isDemo = Object.values(DEMO_GUIDES).includes(guide);
    const result = awardForGuide(petRewardsData().store, studentName(), guide, { score, max, isDemo, date: new Date() });
    let html = "";
    if (result.status === "won") {
        savePetRewardsNow();
        const accessory = ACCESSORY_BY_ID[result.accessory.id];
        const outfit = { [accessory.slot]: accessory.id };
        html = '<div class="reward-card">' +
            '<div class="reward-pets">' + petSvg("cat", outfit, "reward-cat") + petSvg("dog", outfit, "reward-dog") + '</div>' +
            '<h3>🎁 You won a new accessory for your pets!</h3>' +
            '<p class="reward-name"><b>' + escapeHtml(accessory.name) + '</b>' + seasonNote(accessory) + '</p>' +
            (studentName() ? '' : '<p class="note">Write your name in the menu next time, so your prizes are saved for you.</p>') +
            (petRewards.available ? '' : '<p class="status error">This browser does not let me save your prizes.</p>') +
            '<button class="main-btn" onclick="openMyPets()">🐾 Dress my pets</button></div>';
        tutor("🎁", "100%! You won the " + accessory.name + " for your pets. Go to My Pets to put it on!");
    } else if (result.status === "repeat") {
        html = '<p class="reward-note">🎁 You already won the prize for this guide. Generate a new guide and get 100% to win another accessory!</p>';
    } else if (result.status === "complete") {
        html = '<p class="reward-note">🌟 Wow! You have all the accessories you can win today. New ones come with each season!</p>';
    } else if (result.status === "notPerfect" && !isDemo && max > 0) {
        html = '<p class="reward-note">🎁 Get 100% in a generated guide to win an accessory for your pets. You were ' +
            result.missing + (result.missing === 1 ? ' point' : ' points') + ' away!</p>';
    } else if (result.status === "demo" && max > 0 && score >= max) {
        html = '<p class="reward-note">🎁 Perfect! Now generate a new guide and get 100% to win an accessory for your pets.</p>';
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
    tutor("🐾", owned ? "Choose a pet, then tap an accessory to put it on or take it off!"
        : "Get 100% in a new guide to win your first accessory!");
}

function chooseMyPet(kind) {
    myPetsKind = kind;
    renderMyPets();
}

function renderMyPets() {
    const record = currentPetRecord();
    const ownedIds = record.owned.map(o => o.id);
    const seasons = activeSeasons(new Date());
    document.getElementById("mp-owner").innerHTML = "<b>" + escapeHtml(record.name || "Guest") + "'s pets</b> · " +
        ownedIds.length + " of " + PET_ACCESSORIES.length + " accessories" +
        (studentName() ? "" : " · Write your name in the menu to keep your own prizes.");
    document.getElementById("mp-save-note").innerText = petRewardsData().available ? "" : "This browser does not let me save your prizes.";
    document.getElementById("mp-image-note").innerText = hasOwnImage("cat") || hasOwnImage("dog")
        ? "The accessories are drawn on the game's own pets; pets with their own image keep it at the bottom of the window." : "";

    document.getElementById("mp-stage").innerHTML = ["cat", "dog"].map(kind =>
        '<button type="button" class="mp-pet' + (kind === myPetsKind ? ' selected' : '') + '" onclick="chooseMyPet(\'' + kind + '\')" aria-pressed="' + (kind === myPetsKind) + '">' +
        petSvg(kind, record.outfits[kind], "stage-" + kind) + '<span>' + PET_LABELS[kind] + '</span></button>').join('');

    const outfit = record.outfits[myPetsKind];
    const box = document.getElementById("mp-wardrobe");
    if (!ownedIds.length) {
        box.innerHTML = '<p class="reward-note">🎁 You don\'t have accessories yet. Generate a guide and get 100% to win your first one!</p>';
    } else {
        box.innerHTML = "";
    }
    box.innerHTML += SLOT_ORDER.slice().reverse().map(slot => {
        // The ones the student has first, then the locked ones
        const items = PET_ACCESSORIES.filter(a => a.slot === slot)
            .sort((x, y) => Number(ownedIds.includes(y.id)) - Number(ownedIds.includes(x.id)));
        return '<h3 class="mp-slot">' + SLOT_LABELS[slot] + '</h3><div class="mp-grid">' + items.map(a => {
            if (ownedIds.includes(a.id)) {
                const on = outfit[slot] === a.id;
                return '<button type="button" class="mp-item' + (on ? ' on' : '') + '" data-id="' + a.id + '" aria-pressed="' + on + '">' +
                    petSvg(myPetsKind, { [slot]: a.id }, "item-" + a.id) + '<span class="mp-name">' + escapeHtml(a.name) + '</span>' +
                    (on ? '<span class="mp-on">✓ On</span>' : '') + '</button>';
            }
            const when = a.season === null || seasons.includes(a.season) ? "🎁 Win it!" : "Comes back in " + SEASONS[a.season].label;
            return '<div class="mp-item locked" aria-label="Locked accessory">' + petSvg(myPetsKind, { [slot]: a.id }, "lock-" + a.id) +
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
    tutor(myPetsKind === "cat" ? "🐱" : "🐶", on ? "Looking great with the " + ACCESSORY_BY_ID[id].name + "!" : "The " + ACCESSORY_BY_ID[id].name + " is off.");
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
