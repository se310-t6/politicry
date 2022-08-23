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
      this.checkForUpdate();
  },

  //listener to scroll events
  //updates new visible posts to be filtered
  checkForUpdate: function(){
      document.addEventListener('scroll', (ev) => {
      this.counter++;
      if(this.counter == this.refreshFrequency){
          this.counter = 0;
          this.blurImage();
          //console.log("updated"); //debug
      }
      });
  },



  //check if any configured keywords are found in a post
  //return true if found
  async filterText (post,callBack) {
      //temporary filter data
      //these data must be stored in cookie
      const blockedWordsData = [
        "trump",
        "terrorist",
        "communism",
        "racism",
        "isis",
        "pizza"
    ];

      const title = this.getDOMTitle(post);
      const description = this.getDOMDescription(post);
      //image varible contain image url then contain result of ocr
      //getDOMImageLink gets an url of the image if there is one
      let image = this.getDOMImageLink(post);

      //check if the imagelink was blank or not.
      if(image != ""){
        //asynchronously computing ocr, therefore await is needed
        image = await this.ocr(image);
        image = image.toLowerCase();
        //callback to wait ocr to be processed
        callBack();
      }

      //search if blockedwords are in the title
      //true if found
      var isInclude = false;
      for (i in blockedWordsData){

          if(title.includes(blockedWordsData[i])){
            isInclude = true;
          }else if (image.includes(blockedWordsData[i])){
            isInclude = true;
          }else if (description.includes(blockedWordsData[i])){
            isInclude = true;
          }
      }
      return isInclude;
  },

  //extract text from image using tesseract
  //returns text
  async ocr (url) {

      const { createWorker } = Tesseract;
      const worker = createWorker();

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
          const promise = this.filterText(post,function () {/*console.log("ocr done"); //debug*/})
          .then(function(isFound){
          //isFound = result of promise
          //true if found
          if(isFound) {
              document.getElementById(link).style.filter = "blur(5Px)";
              //removes link if no images found.
              //this.removeLinkFromDOM(link);
          }
          });
      }
      });
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
    //console.log("post url: " + "www.reddit.com" + url); // DEBUG
  },

  // retrive the posts iamge link
  getDOMImageLink: function (_post) {
    classSelector = "._2_tDEnGMLxpM6uOa2kaDB3";
    var url = _post.querySelector(classSelector);
    if(url != undefined){
      url = url.getAttribute("src");
      //console.log("image url: " + url); // DEBUG
      return url;
    }else{ //image link was empty, hence the post does not contain image
      return "";
    }
    
  },

  getDOMTitle: function (_post) {
    classSelector = "._eYtD2XCVieq6emjKBH3m";
    var title = _post.querySelector(classSelector);
    if(title != undefined){
      title = title.textContent.toLowerCase();
      //console.log("post title: " + title); // DEBUG
      return title;
    }else{ //title was empty, returns empty string value
      return "";
    }
  },

  //retrieve the posts description
  getDOMDescription: function (_post) {
      descriptionSelector = "._292iotee39Lmt0MkQZ2hPV";
      var description = _post.querySelector(descriptionSelector);
      if(description != undefined){
        description = description.textContent.toLowerCase();
        //console.log("post description: " + description); // DEBUG
        return description;
      }else{ //description was empty, returns empty string value
        return "";
      }
      
  }
};

Reddit.initialize();
