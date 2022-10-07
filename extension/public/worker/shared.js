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
      facebook: data.facebookToggled,
    };

    // replace the blocklist with the list from chrome storage
    if (data.blockedWords && data.blockedWords.length) {
      blockedList = data.blockedWords;
    }

    // lastly, call the "onceReady" function if it exists
    window.onceReady?.();
  },
);

/* returns true if the supplied text matches any word in the blocked list */
window.matchesBlocklist = (text) =>
  blockedList.some((word) => text.toLowerCase().includes(word.toLowerCase()));
