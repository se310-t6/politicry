/** @param {HTMLDivElement} el */
function checkTweet(el) {
  if (window.matchesBlocklist(el.innerText)) {
    el.style.filter = "blur(20px)";
  }
}

document.addEventListener("politicry-ready", () => {
  // quit if twitter is not enabled
  if (!window.enabled.twitter) return;

  // check every 1 second if a new post has been loaded
  setInterval(() => {
    // check every visible tweet, which can be identified since each tweet is a different
    // article. Politicry currently only supports English (for now) but tweets in any language
    // that contain any of the blocked words will be blurred.
    document.querySelectorAll('article').forEach(checkTweet);
  }, 1000);
});
