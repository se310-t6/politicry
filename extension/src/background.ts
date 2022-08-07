function helloWorld(): void {
    console.log('Hello World');
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id ? tab.id : -1},
        func: helloWorld,
    }).then();
});
