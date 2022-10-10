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

chrome.storage.sync.get(
  ["blockedWords", "redditToggled", "instagramToggled", "twitterToggled"],
  (data) => {
    window.enabled = {
      reddit: data.redditToggled,
      instagram: data.instagramToggled,
      twitter: data.twitterToggled,
    };

    // replace the blocklist with the list from chrome storage
    if (data.blockedWords && data.blockedWords.length) {
      blockedList = data.blockedWords;
    }

    // lastly, emit the "politicry-ready" event, which the other files listen for
    document.dispatchEvent(new CustomEvent("politicry-ready"));
  },
);

/* returns true if the supplied text matches any word in the blocked list */
window.matchesBlocklist = (text) =>
  blockedList.some((word) => text.toLowerCase().includes(word.toLowerCase()));
