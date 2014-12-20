function checkForValidUrl(tabId, changeInfo, tab) {
    chrome.pageAction.show(tabId);
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);
// http://dailyupgrade.me/post/6707468769/chrome-extension-development-page-actions

function onClickHandler(info, tab) {
    if (info.menuItemId == "memo") {
        chrome.tabs.sendMessage(tab.id, {memo: "out"});
    }
    else if (info.menuItemId == "eraser") {
        console.log("checkbox item " + info.menuItemId +
            " was clicked, state is now: " + info.checked +
            " (previous state was " + info.wasChecked + ")");

        if (info.checked){
            chrome.tabs.sendMessage(tab.id, {eraser: "on"})
        }
        else {
            chrome.tabs.sendMessage(tab.id, {eraser: "off"})
        }
    }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    //Create one test item for each context type.
    var contexts = ["page", "selection", "link", "editable", "image", "video", "audio"];
    var id = chrome.contextMenus.create({
        "title": "Add Memo", 
        "contexts":contexts, 
        "id": "memo" 
    });
    var id = chrome.contextMenus.create({
        "title": "Delete Element", 
        "type": "checkbox", 
        "contexts":contexts, 
        "id": "eraser"
    });
});