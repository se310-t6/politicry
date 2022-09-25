// copied from reddit.js
const blockedWordsData = [
  "trump",
  "terrorist",
  "communism",
  "racism",
  "isis",
  "pizza",
];

/* returns true if the supplied text matches any word in the blocked list */
function matchesBlocklist(text) {
  return blockedWordsData.some((word) => text.includes(word));
}

/** @param {HTMLImageElement} img */
function blurImage(img) {
  // eslint-disable-next-line no-param-reassign
  img.style.filter = "blur(30px)";
}

// checks the caption of a post that is currently opened
function checkOpenPost() {
  const caption = document.querySelector('li[role="menuitem"]');

  if (!caption) return; // abort, there is no post open right now

  const anyMatches = matchesBlocklist(caption.innerText.toLowerCase());

  if (anyMatches) {
    let parent = caption;

    // search up the DOM tree until we find the first parent element
    // of the caption, which contains an <img /> element.
    while (true) {
      parent = parent.parentElement;

      // if parent is null we abort because we reached the root element
      // (<html>) and still haven't found an image
      if (!parent) return;

      const img = parent.querySelector("img");
      if (img) {
        blurImage(img);
        return;
      }
    }
  }
}

/** @param {HTMLImageElement} img */
function checkImage(img) {
  if (img.alt && matchesBlocklist(img.alt)) {
    blurImage(img);
  }
}

// check every 1 second if a new post has been loaded
setInterval(() => {
  // part 1: check the main post visible
  checkOpenPost();

  // part 2: check the alt-text of every image
  document.querySelectorAll("img").forEach(checkImage);
}, 1000);
