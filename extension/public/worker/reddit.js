/* global Tesseract */

const Reddit = {
  // CSS selector for Reddit links
  linkSelector: ".scrollerItem[id]",

  // CSS selector for the Reddit posts list
  listSelector: ".rpBJOHq2PR60pnwJlUyP0",

  // counter for checkForUpdate
  counter: 0,
  refreshFrequency: 100,

  // initalize
  initialize() {
    // quit if reddit is not enabled
    if (!window.enabled.reddit) return;

    this.blurImage();
    this.checkForUpdate();
  },

  // listener to scroll events
  // updates new visible posts to be filtered
  checkForUpdate() {
    document.addEventListener("scroll", () => {
      this.counter++;
      if (this.counter === this.refreshFrequency) {
        this.counter = 0;
        this.blurImage();
        // console.log("updated"); //debug
      }
    });
  },

  // check if any configured keywords are found in a post
  // return true if found
  async filterText(post, callBack) {
    const title = this.getDOMTitle(post);
    const description = this.getDOMDescription(post);
    // image varible contain image url then contain result of ocr
    // getDOMImageLink gets an url of the image if there is one
    let image = this.getDOMImageLink(post);

    // check if the imagelink was blank or not.
    if (image !== "") {
      // asynchronously computing ocr, therefore await is needed
      image = await this.ocr(image);
      image = image.toLowerCase();
      // callback to wait ocr to be processed
      callBack();
    }

    return window.matchesBlocklist(title + description + image);
  },

  // extract text from image using tesseract
  // returns text
  async ocr(url) {
    const { createWorker } = Tesseract;
    const worker = createWorker();

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(url);
    await worker.terminate();
    return text;
  },

  // blurs the image in a post when blocked keyword is found
  blurImage() {
    const posts = document.querySelectorAll(this.linkSelector);

    posts.forEach((post) => {
      const link = post.getAttribute("id");
      // link(id) of promotions in reddit exceed 50 characters
      const linkMaxLength = 50;
      if (link.length < linkMaxLength) {
        // checking if current post contains blocked keyword
        // promise has to be processed to retrieve result data
        this.filterText(post, () => {
          /* console.log("ocr done"); //debug*/
        }).then((isFound) => {
          // isFound = result of promise
          // true if found
          if (isFound) {
            document.getElementById(link).style.filter = "blur(5Px)";
            // removes link if no images found.
            // this.removeLinkFromDOM(link);
          }
        });
      }
    });
  },

  // remove post from DOM (page)
  removeLinkFromDOM(_link) {
    document.querySelector(`[id=${_link}]`).style.display = "none";
    document.querySelector(`[id=${_link}] .reddit-action`).style.display =
      "none";
  },

  // retrive the posts iamge link
  getDOMImageLink(_post) {
    const classSelector = "._2_tDEnGMLxpM6uOa2kaDB3";
    const url = _post.querySelector(classSelector);
    if (url) {
      return url.getAttribute("src");
    } // image link was empty, hence the post does not contain image
    return "";
  },

  getDOMTitle(_post) {
    const classSelector = "._eYtD2XCVieq6emjKBH3m";
    const title = _post.querySelector(classSelector);
    if (title) {
      return title.textContent.toLowerCase();
    } // title was empty, returns empty string value
    return "";
  },

  // retrieve the posts description
  getDOMDescription(_post) {
    const descriptionSelector = "._292iotee39Lmt0MkQZ2hPV";
    let description = _post.querySelector(descriptionSelector);
    if (description) {
      description = description.textContent.toLowerCase();
      // console.log("post description: " + description); // DEBUG
      return description;
    } // description was empty, returns empty string value
    return "";
  },
};

document.addEventListener("politicry-ready", () => Reddit.initialize());
