/// <reference types="chrome" />
/* global chrome */

const { version } = chrome.runtime.getManifest();

/** ******** Enabled Sites **********/

// UI references
const toggleList = document.getElementById("toggleList");
const redditSwitch = document.getElementById("redditSwitch");
const instagramSwitch = document.getElementById("instagramSwitch");
const twitterSwitch = document.getElementById("twitterSwitch");
const addOtherSites = document.getElementById("addOtherSites");
const globalSwitch = document.getElementById("globalSwitch");

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
};

// a map of all the switche elements, keyed by their storageKey in chrome storage
const switches = {
  redditToggled: redditSwitch,
  instagramToggled: instagramSwitch,
  twitterToggled: twitterSwitch,
  globalToggled: globalSwitch,
};

// Set initial state of toggles
for (const storageKey in switches) {
  const switchElement = switches[storageKey];

  const updatePreferences = () => {
    chrome.storage.sync.set({ [storageKey]: switchElement.checked });
    if (storageKey === "globalToggled") {
      // there's an extra step for global switch
      globalSwitchHandler();
    }
  };

  // onchange instead of onclick as the state may change programatically
  switchElement.onchange = updatePreferences;

  chrome.storage.sync.get([storageKey], (data) => {
    switchElement.checked = data[storageKey];
    updatePreferences();
  });
}

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
  manageTagListBtn.style.display = "flex";
  editTagsActions.style.display = "none";
  editTagsTextArea.style.display = "none";
  tagList.style.display = "flex";
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
      return;
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
    let blockedWordsData = data.blockedWords;
    if (!blockedWordsData) {
      blockedWordsData = window.defaultBlockedWordsList;
    } else if (blockedWordsData.length === 0) {
      tagList.innerHTML = "No keywords set!";
      return;
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
  manageTagListBtn.style.display = "none";
  editTagsActions.style.display = "flex";
  editTagsTextArea.style.display = "flex";
  tagList.style.display = "none";

  if (manageTagListBtn.innerHTML === "Edit Allowed") {
    chrome.storage.sync.get(["allowedWords"], (data) => {
      editTagsTextArea.value = arrayToCsv(data.allowedWords || []);
    });
  } else {
    chrome.storage.sync.get(["blockedWords"], (data) => {
      let list = data.blockedWords;
      if (!list) list = window.defaultBlockedWordsList;
      editTagsTextArea.value = arrayToCsv(list);
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

blockedBtnHandler();

// send context infomation to the report page when the user clicks the report link
document.querySelector("#report-link").addEventListener("click", async () => {
  const settings = await chrome.storage.sync.get([
    "blockedWords",
    "allowedWords",
    ...Object.keys(switches), // request all the switch states
  ]);
  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const context = { ...settings, currentUrl: tabs[0].url };

  // open the report-issue page in a new tab, and append the data to the end of the URL
  window.open(
    `https://politicry.com/report#${btoa(JSON.stringify(context))}`,
    "_blank",
    "noopener",
  );
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {
    // open the docs page in a new tab when the extension is first installed
    window.open("https://politicry.com/help#/", "_blank", "noopener");
  }
});

// update the version number in the UI based on the manifest.json file
document.querySelector(".version > span").innerHTML = `Version ${version}`;
