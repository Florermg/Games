/* =====================================================================
   NOTEBOOK SCREEN (GAMES-13): free writing, saved pages, the check with
   its suggestions and the printed page. The checks are in notebook-check.js.
   ===================================================================== */

let notebook = null;            // { store, available }
let notebookPageId = null;
let notebookIssues = [];
let notebookCheckedText = null; // the text of the last check; null when there is none
let notebookCheckedWith = "game";
let notebookCheckId = 0;
let notebookDeleteTimer = null;

// localStorage can be missing or throw (private mode, file:// in some browsers): FR-009
function notebookStorage() {
    try {
        if (window.localStorage) return window.localStorage;
    } catch (error) { /* blocked */ }
    const blocked = () => { throw new Error("Storage is not available"); };
    return { getItem: blocked, setItem: blocked };
}

function currentNotebookPage() {
    return notebook.store.pages.find(p => p.id === notebookPageId);
}

function saveNotebookNow() {
    if (!saveNotebook(notebookStorage(), notebook.store)) notebook.available = false;
    document.getElementById('nb-save-note').innerText = notebook.available ? ""
        : "This browser does not let me save your pages. Print your page before you leave!";
}

function addNotebookPage() {
    const page = newNotebookPage(new Date().toISOString(), notebook.store.pages);
    notebook.store.pages.push(page);
    notebookPageId = page.id;
    saveNotebookNow();
}

function openNotebook() {
    if (!notebook) notebook = loadNotebook(notebookStorage());
    if (!notebook.store.pages.length) addNotebookPage();
    if (!currentNotebookPage()) notebookPageId = sortedPages(notebook.store.pages)[0].id;
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('sheet-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.querySelectorAll('.reference-screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById('notebook-screen').classList.remove('hidden');
    setupNotebookInputs();
    renderNotebook();
    window.scrollTo(0, 0);
    tutor("📓", "This is your notebook. Write freely in English, then tap \"Check my writing\" and I'll give you suggestions!");
}

function setupNotebookInputs() {
    const text = document.getElementById('nb-text');
    const title = document.getElementById('nb-title');
    const online = document.getElementById('nb-online');
    text.oninput = () => {
        const page = currentNotebookPage();
        page.text = text.value;
        page.updated = new Date().toISOString();
        saveNotebookNow();
        updateNotebookCount();
        // The marks belong to the text that was checked
        if (notebookCheckedText !== null && text.value !== notebookCheckedText) clearNotebookResults("You changed your text. Tap \"Check my writing\" again.");
        renderNotebookPageList();
    };
    title.oninput = () => {
        const page = currentNotebookPage();
        page.title = title.value;
        page.updated = new Date().toISOString();
        saveNotebookNow();
        renderNotebookPageList();
    };
    online.onchange = () => {
        notebook.store.online = online.checked;
        saveNotebookNow();
        renderOnlineNote();
    };
    document.getElementById('nb-pages').onchange = (event) => {
        notebookPageId = event.target.value;
        renderNotebook();
    };
}

function renderNotebookPageList() {
    document.getElementById('nb-pages').innerHTML = sortedPages(notebook.store.pages).map(page =>
        '<option value="' + escapeHtml(page.id) + '"' + (page.id === notebookPageId ? ' selected' : '') + '>' + escapeHtml(pageLabel(page)) + '</option>').join('');
}

function renderOnlineNote() {
    document.getElementById('nb-online-note').classList.toggle('hidden', !notebook.store.online);
}

function updateNotebookCount() {
    const page = currentNotebookPage();
    const words = wordCount(page.text);
    document.getElementById('nb-words').innerText = words + (words === 1 ? " word" : " words") +
        " · " + page.text.length + " / " + NOTEBOOK_MAX_LENGTH + " characters";
}

function renderNotebook() {
    const page = currentNotebookPage();
    renderNotebookPageList();
    document.getElementById('nb-title').value = page.title;
    document.getElementById('nb-text').value = page.text;
    document.getElementById('nb-date').innerText = notebookDate(page.created);
    document.getElementById('nb-online').checked = notebook.store.online;
    renderOnlineNote();
    updateNotebookCount();
    resetDeleteButton();
    saveNotebookNow();
    clearNotebookResults("");
}

function clearNotebookResults(message) {
    notebookIssues = [];
    notebookCheckedText = null;
    notebookCheckId++;
    document.getElementById('nb-results').innerHTML = "";
    setNotebookStatus(message, false);
    document.getElementById('nb-check').disabled = false;
}

function setNotebookStatus(message, isError) {
    const status = document.getElementById('nb-status');
    status.innerText = message;
    status.className = "status" + (isError ? " error" : "");
}

// ---------- Check (FR-003 to FR-007) ----------

async function checkNotebook() {
    const page = currentNotebookPage();
    const text = page.text;
    if (!text.trim()) {
        tutor("✏️", "Write something in your notebook first!");
        return;
    }
    notebookIssues = checkNotebookText(text);
    notebookCheckedText = text;
    notebookCheckedWith = "game";
    const id = ++notebookCheckId;
    setNotebookStatus("", false);
    renderNotebookResults();
    if (!notebook.store.online) return;

    const button = document.getElementById('nb-check');
    button.disabled = true;
    setNotebookStatus("Checking online with LanguageTool...", false);
    try {
        const online = await checkOnline(text);
        if (id !== notebookCheckId) return;
        notebookIssues = mergeIssues(notebookIssues, online);
        notebookCheckedWith = "online";
        setNotebookStatus("", false);
    } catch (error) {
        if (id !== notebookCheckId) return;
        notebookCheckedWith = "game-only-offline";
        setNotebookStatus(error.message, true);
    }
    button.disabled = false;
    renderNotebookResults();
}

function renderNotebookResults() {
    const box = document.getElementById('nb-results');
    const text = currentNotebookPage().text;
    if (!notebookIssues.length) {
        box.innerHTML = '<p class="nb-ok">No mistakes found. Great job! 🎉</p>';
        tutor("🌟", "No mistakes found. Great job! Keep writing!");
        return;
    }
    box.innerHTML = '<h3>Your text</h3><div class="nb-marked">' + markedTextHtml(text, notebookIssues) + '</div>' +
        '<h3>Suggestions</h3><ol class="nb-list">' + notebookIssues.map((issue, i) =>
            '<li class="nb-item nb-' + issue.kind + '" id="nb-item-' + (i + 1) + '">' +
            '<div><b class="nb-found">' + (issue.start === issue.end ? "(missing)" : escapeHtml(issue.found)) + '</b>' +
            (issue.source === "online" ? ' <span class="nb-source">online</span>' : '') + '</div>' +
            '<div class="nb-why">' + escapeHtml(issue.message) + '</div>' +
            '<div class="nb-fixes">' + issue.suggestions.map((s, k) =>
                '<button class="small-btn nb-use" data-i="' + i + '" data-k="' + k + '">Use “' + escapeHtml(suggestionLabel(s)) + '”</button>').join('') +
            '</div></li>').join('') + '</ol>';
    box.querySelectorAll('.nb-use').forEach(button => {
        button.onclick = () => useNotebookSuggestion(Number(button.dataset.i), Number(button.dataset.k));
    });
    box.querySelectorAll('.nb-mark').forEach(mark => {
        mark.onclick = () => {
            const item = document.getElementById('nb-item-' + mark.dataset.n);
            if (item) item.scrollIntoView({ behavior: "smooth", block: "center" });
        };
    });
    tutor("🧐", "I found " + notebookIssues.length + (notebookIssues.length === 1 ? " thing" : " things") +
        " to check. Read each suggestion and tap \"Use\" if you agree!");
}

function useNotebookSuggestion(index, k) {
    const page = currentNotebookPage();
    // An online answer still on its way belongs to the old text: drop it
    const button = document.getElementById('nb-check');
    if (button.disabled) {
        notebookCheckId++;
        button.disabled = false;
        setNotebookStatus("", false);
    }
    const result = applySuggestion(page.text, notebookIssues, index, notebookIssues[index].suggestions[k]);
    page.text = result.text;
    page.updated = new Date().toISOString();
    notebookIssues = result.issues;
    notebookCheckedText = result.text;
    document.getElementById('nb-text').value = result.text;
    saveNotebookNow();
    updateNotebookCount();
    renderNotebookPageList();
    renderNotebookResults();
}

// ---------- Pages (FR-008) ----------

function newNotebookPageClick() {
    addNotebookPage();
    renderNotebook();
    document.getElementById('nb-text').focus();
    tutor("📓", "A new page! What do you want to write about today?");
}

function resetDeleteButton() {
    clearTimeout(notebookDeleteTimer);
    notebookDeleteTimer = null;
    const button = document.getElementById('nb-delete');
    button.innerText = "🗑 Delete page";
    button.classList.remove('nb-armed');
}

// The first tap asks; a second tap within 4 seconds deletes
function deleteNotebookPage() {
    const button = document.getElementById('nb-delete');
    if (!notebookDeleteTimer) {
        button.innerText = "⚠️ Tap again to delete";
        button.classList.add('nb-armed');
        notebookDeleteTimer = setTimeout(resetDeleteButton, 4000);
        return;
    }
    notebook.store.pages = notebook.store.pages.filter(p => p.id !== notebookPageId);
    if (!notebook.store.pages.length) addNotebookPage();
    notebookPageId = sortedPages(notebook.store.pages)[0].id;
    saveNotebookNow();
    renderNotebook();
    tutor("🗑", "The page was deleted.");
}

// ---------- Print (FR-010) ----------

function printNotebook() {
    const page = currentNotebookPage();
    if (!page.text.trim()) {
        tutor("✏️", "Write something in your notebook first!");
        return;
    }
    // No waiting for the internet here: print() must run in the same tap (research R5)
    if (notebookCheckedText !== page.text) {
        notebookIssues = checkNotebookText(page.text);
        notebookCheckedText = page.text;
        notebookCheckedWith = "game";
        renderNotebookResults();
    }
    document.getElementById('print-area').innerHTML = buildNotebookPrintHtml({
        name: document.getElementById('student-name').value.trim(), page, issues: notebookIssues, checkedWith: notebookCheckedWith
    });
    tutor("🖨", "Printing your notebook page... You can also save it as a PDF.");
    window.print();
}
