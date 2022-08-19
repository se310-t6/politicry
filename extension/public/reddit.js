var Reddit = {
  // CSS selector for Reddit links
  linkSelector: ".scrollerItem[id]",

  // CSS selector for hidden links
  hiddenLinkSelector: ".scrollerItem[id]:hidden",

  // CSS selector for visible links
  visibleLinkSelector: ".scrollerItem[id]:visible",

  // CSS selector for the Reddit posts list
  listSelector: ".rpBJOHq2PR60pnwJlUyP0",

  counter: 0,
  refreshFrequency: 100,

  // initalize
  initialize: function () {
    this.blurImage();
    this.checkForUpdate();
  },

  checkForUpdate: function(){
    document.addEventListener('scroll', (ev) => {
      this.counter++;
      console.log(this.counter);
      if(this.counter == this.refreshFrequency){
        this.counter = 0;
        this.blurImage();
      }
    });
  },

  setupPostUI: function () {
    // adds hide button to each Reddit post
    posts = document.querySelectorAll(this.linkSelector);
    console.log(posts);
    posts.forEach((post) => {
      post.innerHTML += this.hideLinkHTML();
      post
        .querySelector(".reddit-action.hide")
        .addEventListener("click", (event) => {
          this.removeLink(event);
        });
    });
    console.log("setup post UI");
  },

  // calls removeLinkFromDOM to remove a specific post link from the DOM
  removeLink: function (event) {
    var button = event.currentTarget;
    var post = button.parentNode.parentNode;
    var link = post.getAttribute("id");

    this.getDOMTitle(post);
    this.getDOMLink(post);
    try {
      this.getDOMImageLink(post);
    } catch (e) {
      console.log("Not an image" + e);
    }
    // this.blurImage(post);
    this.removeLinkFromDOM(link);
  },

  // called removeLinkFromDOM to remove all loaded posts on the page
  // can use this method to call our image processing on all posts automatically
  removeLinkAll: function () {
    var posts = document.querySelectorAll(this.linkSelector);
    // console.log("Found " + posts.length + " Visible posts");
    // console.log(posts);
    posts.forEach((post) => {
      post.style.display = "none";
      post.querySelector(".reddit-action").style.display = "none";

    });
  },

  // remove post from DOM (page)
  removeLinkFromDOM: function (_link) {
    document.querySelector("[id=" + _link + "]").style.display = "none";
    document.querySelector("[id=" + _link + "] .reddit-action").style.display = "none";
  },

  // restore all hidden posts
  restoreDOM: function () {
    var posts = document.querySelectorAll(this.linkSelector);
    // console.log("Found " + posts.length + " Visible posts");
    // console.log(posts);
    posts.forEach((post) => {
      post.style.display = "block";
      post.querySelector(".reddit-action").style.display = "block";
    });
  },

  // retrieve the post link
  getDOMLink: function (_post) {
    classSelector = ".SQnoC3ObvgnGjWt90zD9Z";
    var url = _post.querySelector(classSelector).getAttribute("href");
    console.log("post url: " + "www.reddit.com" + url); // DEBUG
  },

  // retrive the posts iamge link
  getDOMImageLink: function (_post) {
    classSelector = "._2_tDEnGMLxpM6uOa2kaDB3";
    var url = _post.querySelector(classSelector).getAttribute("src");
    console.log("image url: " + url); // DEBUG
  },

  getDOMTitle: function (_post) {
    classSelector = "._eYtD2XCVieq6emjKBH3m";
    var title = _post.querySelector(classSelector).textContent;
    console.log("post title: " + title); // DEBUG
  },

  blurImage: function (_post) {
    classSelector = "._2_tDEnGMLxpM6uOa2kaDB3";
    var image = _post.querySelector(classSelector);
    image.style.filter = "blur(5px)";
  },
};

Reddit.initialize();