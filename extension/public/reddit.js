var Reddit = {
  // CSS selector for Reddit links
  linkSelector: ".scrollerItem[id]",

  // CSS selector for the Reddit posts list
  listSelector: ".rpBJOHq2PR60pnwJlUyP0",

  //counter for checkForUpdate
  counter: 0,
  refreshFrequency: 100,

  // initalize
  initialize: function () {
      this.blurImage();
      this.addReportButton();
      this.checkForUpdate();
  },

  // HTML for report button
  reportLinkHTML: function () {
    return '<div class="reddit-actions"><div class="reddit-action report">Report</div></div>';
  },
  
  //listener to scroll events
  //updates new visible posts to be filtered
  checkForUpdate: function(){
      document.addEventListener('scroll', (ev) => {
      this.counter++;
      if(this.counter == this.refreshFrequency){
          this.counter = 0;
          this.blurImage();
          this.addReportButton();
          console.log("updated");
      }
      });
  },



  //check if any configured keywords are found in a post
  //return true if found
  async filterText (post,callBack) {
      //temporary filter data
      //these data must be stored in cookie
      const blockedWordsData = [
          "denr",
          "nobody",
          "taranaki",
          "covid",
          "isis",
          "pizza"
      ];

      const title = this.getDOMTitle(post);
      const description = this.getDOMDescription(post);
      //image varible contain image url then contain result of ocr
      let image = this.getDOMImageLink(post);

      if(image != "n/a"){
          image = await this.ocr(image);
          image = image.toLowerCase();
          //callback to wait ocr to be processed
          callBack();
      }

      console.log(image);
      //search if blockedwords are in the title
      //true if found
      for (i in blockedWordsData){
          console.log("pass");
          if(title.search(blockedWordsData[i]) != -1){
            return true;
          }else if (image.search(blockedWordsData[i]) != -1){
            return true;
          }else if (description.search(blockedWordsData[i]) != -1){
            return true;
          }
      }
      return false;
  },

  //extract text from image using tesseract
  //returns text
  async ocr (url) {

      const { createWorker } = Tesseract;
      const worker = createWorker ({
      logger: m => console.log(m)
      });

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(url);
      await worker.terminate();
      return text;

  },

  //blurs the image in a post when blocked keyword is found
  blurImage: function () {
      var posts = document.querySelectorAll(this.linkSelector);

      posts.forEach((post) => {
      var link = post.getAttribute("id");
      //link(id) of promotions in reddit exceed 50 characters
      const linkMaxLength = 50;
      if(link.length < linkMaxLength){

          //checking if current post contains blocked keyword
          //promise has to be processed to retrieve result data
          const promise = this.filterText(post,function () {console.log("ocr done");})
          .then(function(isFound){
          //isFound = result of promise
          //true if found
          console.log(isFound); // debug
          if(isFound) {
              console.log(document.getElementsByClassName(link));
              document.getElementById(link).style.filter = "blur(5Px)";
              //removes link if no images found.
              //this.removeLinkFromDOM(link);
          }
          });
      }
      });
  },

  //Add a report Button under every post
  addReportButton:function(){
    var posts = document.querySelectorAll(this.linkSelector);
    posts.forEach((post) => {
        
        if(!(post.innerHTML.includes(this.reportLinkHTML()))){
          post.innerHTML += this.reportLinkHTML();
           post
         .querySelector(".reddit-action.report")
         .addEventListener("click", (event) => {
            event.stopPropagation()
            console.log(post)
            alert("reported!");
            post.style.filter = "blur(5Px)";
         });
       }
  
    });
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
     //this.blurImage(post);
      this.removeLinkFromDOM(link);
  },



  // remove post from DOM (page)
  removeLinkFromDOM: function (_link) {
    document.querySelector("[id=" + _link + "]").style.display = "none";
    document.querySelector("[id=" + _link + "] .reddit-action").style.display = "none";
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
    var url = _post.querySelector(classSelector);
    if(url != null){
      url = url.getAttribute("src");
      console.log("image url: " + url); // DEBUG
      return url;
    }else{
      return "n/a";
    }
  },

  getDOMTitle: function (_post) {
    classSelector = "._eYtD2XCVieq6emjKBH3m";
    var title = _post.querySelector(classSelector);
    if(title != null){
      title = title.textContent.toLowerCase();
      console.log("post title: " + title); // DEBUG
      return title;
    }else{
      return "n/a";
    }
  },

  //retrieve the posts description
  getDOMDescription: function (_post) {
      descriptionSelector = "._292iotee39Lmt0MkQZ2hPV";
      var description = _post.querySelector(descriptionSelector);
      if(description != null){
        description = description.textContent.toLowerCase();
        console.log("post description: " + description); // DEBUG
        return description;
      }else{
        return "n/a";
      }
  }
};

Reddit.initialize()