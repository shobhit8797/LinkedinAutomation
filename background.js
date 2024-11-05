// background.js

let progress = 0;

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "progressUpdate") {
        progress = request.data; // Save progress data in the background script
        console.log("Progress updated to", progress);
        

        // Optionally broadcast the progress to popup.js if it's open
        chrome.runtime.sendMessage({ type: "progressUpdate", data: progress });
    }
});

// Allow popup.js to request the latest progress
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getProgress") {
        sendResponse({ data: progress });
    }
});
