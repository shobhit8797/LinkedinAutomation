// Script to handle user interactions in the popup

// Function to update progress in the popup UI
function updateProgress(progress) {
    const progressCircle = document.querySelector(".progress-circle");
    if (!progressCircle) return;

    const progressValue = Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
    progressCircle.style.setProperty(
        "--progress",
        `${progress}deg`
        // `${(progressValue / 100) * 360}deg`
    );
    document.getElementById("progress-text").innerText = `${Math.round(
        (progress / 360) * 100
    )}%`;
}

// Request current progress from background.js on popup load
chrome.runtime.sendMessage({ type: "getProgress" }, (response) => {
    if (response && response.data != null) {
        updateProgress(response.data);
    }
});

// Listen for real-time progress updates from background.js
chrome.runtime.onMessage.addListener((request) => {
    if (request.type === "progressUpdate") {
        updateProgress(request.data);
    }
});

// Start button listener
document.getElementById("start-button").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("start-button clicked");

    // Inject content script into the page if it hasn't been injected already
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
    });

    // Send message to the content script to start automation
    chrome.tabs.sendMessage(tab.id, { message: "start" });
});
