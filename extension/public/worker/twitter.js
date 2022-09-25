/** @param {HTMLDivElement} el */
function checkTweet(el) {
  if (window.matchesBlocklist(el.innerText)) {
    el.style.filter = "blur(4px)";
  }
}

// check every 1 second if a new post has been loaded
setInterval(() => {
  // check every visible tweet, which can be identified since it's a
  // div with an attribute called lang="en". Politicry only supports English (for now)
  document.querySelectorAll('div[lang="en"]').forEach(checkTweet);
}, 1000);
