/// <reference types="chrome" />
/* global chrome */

/** ******** Enabled Sites **********/

// UI references
const toggleList = document.getElementById("toggleList");
const redditSwitch = document.getElementById("redditSwitch");
const instagramSwitch = document.getElementById("instagramSwitch");
const twitterSwitch = document.getElementById("twitterSwitch");
const addOtherSites = document.getElementById("addOtherSites");
const globalSwitch = document.getElementById("globalSwitch");

// Politicry is not yet available for Twitter
twitterSwitch.disabled = true;

const globalSwitchHandler = () => {
  if (globalSwitch.checked === true) {
    redditSwitch.checked = false;
    instagramSwitch.checked = false;
    twitterSwitch.checked = false;

    toggleList.style.pointerEvents = "none";
    toggleList.style.opacity = "50%";
  } else {
    toggleList.style.pointerEvents = "auto";
    toggleList.style.opacity = "100%";
  }

  chrome.storage.sync.set({ globalToggled: globalSwitch.checked });
};

const redditSwitchHandler = () => {
  chrome.storage.sync.set({ redditToggled: redditSwitch.checked });
};

// onchange instead of onclick as the state may change programatically
globalSwitch.onchange = globalSwitchHandler;
redditSwitch.onchange = redditSwitchHandler;

// Set initial state of toggles
chrome.storage.sync.get(["redditToggled"], (data) => {
  redditSwitch.checked = data.redditToggled;
  redditSwitchHandler();
});

chrome.storage.sync.get(["globalToggled"], (data) => {
  globalSwitch.checked = data.globalToggled;
  globalSwitchHandler();
});

/** ******** Keywords **********/

// UI references
const allowedBtn = document.getElementById("allowedBtn");
const blockedBtn = document.getElementById("blockedBtn");
const tagList = document.getElementById("tagList");
const manageTagListBtn = document.getElementById("manageTagListBtn");
const editTagsTextArea = document.getElementById("editTagsTextArea");
const editTagsActions = document.getElementById("editTagsActions");
const saveBtn = document.getElementById("saveTagsBtn");
const cancelBtn = document.getElementById("cancelTagsBtn");

// Helper:
const hideTagsEdit = () => {
  manageTagListBtn.style.visibility = "visible";
  editTagsActions.style.visibility = "hidden";
  editTagsTextArea.style.visibility = "hidden";
};

// Helper:
// Array --> Comma Separated Values
// Converts array of strings to a single string where each value is separated by a comma
const arrayToCsv = (array) => array.join(",");

// Helper:
const renderAllowedWords = () => {
  hideTagsEdit();

  chrome.storage.sync.get(["allowedWords"], (data) => {
    const allowedWordsData = data.allowedWords;
    if (allowedWordsData === undefined || allowedWordsData.length === 0) {
      tagList.innerHTML = "No keywords set!";
    }

    const max = 4;
    const numTagItems =
      allowedWordsData.length > max ? max : allowedWordsData.length;
    const numMoreResults = allowedWordsData.length - numTagItems;

    let tagItems = "";
    const moreResults =
      numMoreResults > 0
        ? `<div class="tag-results-item">${numMoreResults} more</div>`
        : "";

    for (let i = 0; i < numTagItems; i++) {
      tagItems += `<div class="tag-item">${allowedWordsData[i]}</div>`;
    }

    tagList.innerHTML = tagItems + moreResults;
  });
};

// Helper:
const renderBlockedWords = () => {
  hideTagsEdit();
  chrome.storage.sync.get(["blockedWords"], (data) => {
    const blockedWordsData = data.blockedWords;
    if (!blockedWordsData || blockedWordsData.length === 0) {
      tagList.innerHTML = "No keywords set!";
    }

    const max = 4;
    const numTagItems =
      blockedWordsData.length > max ? max : blockedWordsData.length;
    const numMoreResults = blockedWordsData.length - numTagItems;

    let tagItems = "";
    const moreResults =
      numMoreResults > 0
        ? `<div class="tag-results-item">${numMoreResults} more</div>`
        : "";

    for (let i = 0; i < numTagItems; i++) {
      tagItems += `<div class="tag-item">${blockedWordsData[i]}</div>`;
    }

    tagList.innerHTML = tagItems + moreResults;
  });
};

// Helper:
const renderTagsEdit = () => {
  manageTagListBtn.style.visibility = "hidden";
  editTagsActions.style.visibility = "visible";
  editTagsTextArea.style.visibility = "visible";

  if (manageTagListBtn.innerHTML === "Edit Allowed") {
    chrome.storage.sync.get(["allowedWords"], (data) => {
      editTagsTextArea.value = arrayToCsv(data.allowedWords);
    });
  } else {
    chrome.storage.sync.get(["blockedWords"], (data) => {
      editTagsTextArea.value = arrayToCsv(data.blockedWords);
    });
  }
};

// Method:
const allowedBtnHandler = () => {
  manageTagListBtn.innerHTML = "Edit Allowed";
  allowedBtn.style.backgroundColor = "#2196F3";
  blockedBtn.style.backgroundColor = "#999999";
  renderAllowedWords();
};

// Method:
const blockedBtnHandler = () => {
  manageTagListBtn.innerHTML = "Edit Blocked";
  allowedBtn.style.backgroundColor = "#999999";
  blockedBtn.style.backgroundColor = "#2196F3";
  renderBlockedWords();
};

// Method:
const manageTagListBtnHandler = () => {
  renderTagsEdit();
};

// Method:
const saveBtnHandler = () => {
  // Split the text by commas
  // If the text is an empty string, return an empty array (rather than an array with an empty string value)
  const newWordList =
    editTagsTextArea.value === ""
      ? []
      : editTagsTextArea.value.split(",").map((word) => {
          return word.trim();
        });

  if (manageTagListBtn.innerHTML === "Edit Allowed") {
    chrome.storage.sync.set({ allowedWords: newWordList });
    renderAllowedWords();
  } else {
    chrome.storage.sync.set({ blockedWords: newWordList });
    renderBlockedWords();
  }

  hideTagsEdit();
};

// Method:
const cancelBtnHandler = () => {
  hideTagsEdit();
};

// assign buttons their respective functions
allowedBtn.onclick = allowedBtnHandler;
blockedBtn.onclick = blockedBtnHandler;
manageTagListBtn.onclick = manageTagListBtnHandler;
saveBtn.onclick = saveBtnHandler;
cancelBtn.onclick = cancelBtnHandler;

allowedBtnHandler();
