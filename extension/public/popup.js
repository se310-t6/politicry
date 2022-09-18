/********** Enabled Sites **********/

// UI references
const toggleList = document.getElementById("toggleList");
const redditSwitch = document.getElementById("redditSwitch");
const imgurSwitch = document.getElementById("imgurSwitch");
const twitterSwitch = document.getElementById("twitterSwitch");
const addOtherSites = document.getElementById("addOtherSites");
const globalSwitch = document.getElementById("globalSwitch");

// Politicry is not yet available for Imgur and Twitter
imgurSwitch.disabled = true
twitterSwitch.disabled = true

const globalSwitchHandler = () => {
    if(globalSwitch.checked == true) {
        redditSwitch.checked = false;
        imgurSwitch.checked = false;
        twitterSwitch.checked = false;

        toggleList.style.pointerEvents = "none";
        toggleList.style.opacity = "50%";
    } else {
        toggleList.style.pointerEvents = "auto";
        toggleList.style.opacity = "100%";
    }

    chrome.storage.sync.set({ globalToggled: globalSwitch.checked });
}

const redditSwitchHandler = () => {
    chrome.storage.sync.set({ redditToggled: redditSwitch.checked });
}

// onchange instead of onclick as the state may change programatically
globalSwitch.onchange = globalSwitchHandler;
redditSwitch.onchange = redditSwitchHandler;

// Set initial state of toggles
chrome.storage.sync.get(['redditToggled'], function(data) {
    redditSwitch.checked = data.redditToggled;
    redditSwitchHandler();
});

chrome.storage.sync.get(['globalToggled'], function(data) {
    globalSwitch.checked = data.globalToggled;
    globalSwitchHandler();
});

/********** Keywords **********/

// keywords data
const allowedWordsData = [
    "ukraine",
    "blm",
    "gas prices"
];

const blockedWordsData = [
    "trump",
    "terrorist",
    "communism",
    "racism",
    "isis",
    "pizza"
];

// UI references
const allowedBtn = document.getElementById("allowedBtn");
const blockedBtn = document.getElementById("blockedBtn");
const tagList = document.getElementById("tagList");
const manageTagListBtn = document.getElementById("manageTagListBtn");

// Helper:
const renderAllowedWords = () => {
    const max = 4;
    const numTagItems = allowedWordsData.length > max ? max : allowedWordsData.length;
    const numMoreResults=  allowedWordsData.length - numTagItems;

    let tagItems = "";
    const moreResults = numMoreResults > 0 ? `<div class=\"tag-results-item\">${numMoreResults} more</div>` : "";

    for (let i=0; i<numTagItems; i++) {
        tagItems += `<div class=\"tag-item\">${allowedWordsData[i]}</div>`;
    }
    tagList.innerHTML = tagItems + moreResults;
}

// Helper:
const renderBlockedWords = () => {
    const max = 4;
    const numTagItems = blockedWordsData.length > max ? max : blockedWordsData.length
    const numMoreResults=  blockedWordsData.length - numTagItems;

    let tagItems = "";
    const moreResults = numMoreResults > 0 ? `<div class=\"tag-results-item\">${numMoreResults} more</div>` : "";

    for (let i=0; i<numTagItems; i++) {
        tagItems += `<div class=\"tag-item\">${blockedWordsData[i]}</div>`;
    }
    tagList.innerHTML = tagItems + moreResults;
}

// Method:
const allowedBtnHandler = () => {
    manageTagListBtn.innerHTML = "Edit Allowed"
    allowedBtn.style.backgroundColor = "#2196F3"
    blockedBtn.style.backgroundColor = "#999999";
    renderAllowedWords();
}

// Method:
const blockedBtnHandler = () => {
    manageTagListBtn.innerHTML = "Edit Blocked"
    allowedBtn.style.backgroundColor = "#999999"
    blockedBtn.style.backgroundColor = "#2196F3";
    renderBlockedWords();
}

// assign buttons their respective functions
allowedBtn.onclick = allowedBtnHandler;
blockedBtn.onclick = blockedBtnHandler;

allowedBtnHandler();
