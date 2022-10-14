/** @param {HTMLImageElement} img */
function blurImage(img) {
    img.style.filter = "blur(30px)";
}


/** @param {HTMLDivElement} el */
function checkPost(el) {
    console.log("post checked")
    if (window.matchesBlocklist(el.innerText)) {
      el.style.filter = "blur(4px)";
    }
}
  
/** @param {HTMLImageElement} img */
function checkImage(img) {
    if (img.alt && window.matchesBlocklist(img.alt)) {
      blurImage(img);
    }
}

document.addEventListener("politicry-ready", () => {
// quit if facebook is not enabled
    if (!window.enabled.facebook) return;
  
    // check every 1 second if a new post has been loaded
    setInterval(() => {
      // check every visible facebook post, which can be identified since it's a
      // div with an attribute called data-ad-preview="message"
      document.querySelectorAll('div[data-ad-preview="message"]').forEach(checkPost);
      //check image 
      document.querySelectorAll('img').forEach(checkImage);
    }, 1000);
});