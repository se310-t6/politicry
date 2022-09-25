// this file is shared amongst all workers

const blockedWordsData = [
  "trump",
  "terrorist",
  "communism",
  "racism",
  "isis",
  "pizza",
];

/* returns true if the supplied text matches any word in the blocked list */
window.matchesBlocklist = (text) => {
  return blockedWordsData.some((word) => text.includes(word));
};
