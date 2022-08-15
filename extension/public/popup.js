/***** Sites *****/ 

// UI references
const toggleList = document.getElementById("toggleList");
const redditSwitch = document.getElementById("redditSwitch");
const imgurSwitch = document.getElementById("imgurSwitch");
const twitterSwitch = document.getElementById("twitterSwitch");
const addOtherSites = document.getElementById("addOtherSites");
const globalSwitch = document.getElementById("globalSwitch");

const globalSwitchHandler = () => {
    if(globalSwitch.checked == true) {
        redditSwitch.checked = false;
        imgurSwitch.checked = false;
        twitterSwitch.checked = false;

        toggleList.style.pointerEvents = "none";
        toggleList.style.opacity = "50%";
    }
    else {
        toggleList.style.pointerEvents = "auto";
        toggleList.style.opacity = "100%";
    }
}

globalSwitch.onclick = globalSwitchHandler;