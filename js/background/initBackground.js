// Array to hold callback functions
var callbacks = [];
var currentTab = null;
var hsTabs = {};

function saveData(data) {
    datas.saveData(currentTab.url, data);
}

// This function is called onload in the popup code
function getOptions(callback) {
    // Add the callback to the queue
    //callbacks.push(callback);

    // Injects the content script into the current page
    //chrome.tabs.executeScript(null, { file: "content_script.js" });

    callback(hsTabs[currentTab.id], currentTab.url, options);
};

function saveActivated(activated) {
    options.setActivate(currentTab.url, activated);
    updateTab(currentTab);
}

function updateTab(tab) {
    if(tab == null) {
        tab = currentTab;
    } else {
        currentTab = tab;
    }
    chrome.tabs.executeScript(tab.id, {

        code : "htmlSelector.toggle("+options.getPageOption(tab.url).activated+
            ",\""+JSON.stringify(datas.getPageDatas(tab.url)).replace(/"/g,'\\"')+"\")"
    });
}

/* ---------------------------------- */

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var currentMethod = details.method;
    var body = details.requestBody;
    var currentParams = null;
    if(body != undefined) {
        if(body.formData != undefined) {
            currentParams = body.formData;
        }
    }
    hsTabs[details.tabId] = new HSPage(currentMethod, details.url, currentParams);
},{types:["main_frame"],urls:["http://*/*"]},["blocking", "requestBody"]);

// Perform the callback when a request is received from the content script
chrome.extension.onRequest.addListener(function(request) {
    // Get the first callback in the callbacks array
    // and remove it from the array
    var callback = callbacks.shift();

    // Call the callback function
    callback(request);
});

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        saveData(request);
    }
);

chrome.tabs.onCreated.addListener(function(tab) {
    updateTab(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo) {
    chrome.tabs.get(tabId, function(tab) {
        updateTab(tab);
    });
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
    chrome.tabs.get(tabId, function(tab) {
        updateTab(tab);
    });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        currentTab = tab;
    });
});