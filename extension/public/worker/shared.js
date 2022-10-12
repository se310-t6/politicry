// this file is shared amongst all workers AND the popup page

/// <reference types="chrome" />
/* global chrome */

window.defaultBlockedWordsList = [
  "trump",
  "terrorist",
  "communism",
  "racism",
  "isis",
  "pizza",
];

let blockedList = window.defaultBlockedWordsList;
let allowedList = [];

chrome.storage.sync.get(
  ["blockedWords", "allowedWords", "redditToggled", "instagramToggled", "twitterToggled"],
  (data) => {
    window.enabled = {
      reddit: data.redditToggled,
      instagram: data.instagramToggled,
      twitter: data.twitterToggled,
    };

    // replace the allowed/blocked list with the list from chrome storage
    if (data.blockedWords && data.blockedWords.length) {
      blockedList = data.blockedWords;
    }

    if (data.allowedWords && data.allowedWords.length) {
      allowedList = data.allowedWords;
    }

    // lastly, emit the "politicry-ready" event, which the other files listen for
    document.dispatchEvent(new CustomEvent("politicry-ready"));
  },
);

/* returns true if the supplied text matches any word in the blocked list 
unless it contains an allowed word */
window.matchesBlocklist = (text) => {
  let hasAllowedWord = allowedList.some((word) => text.toLowerCase().includes(word.toLowerCase()))
  let hasBlockedWord = blockedList.some((word) => text.toLowerCase().includes(word.toLowerCase()))
  return !hasAllowedWord && hasBlockedWord
}
