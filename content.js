function sendStatusToPopup(progress) {
    console.log("Sending status to popup...");
    chrome.runtime.sendMessage({ type: "progressUpdate", data: progress });
}

async function sendConnectionRequest(button, delay) {
    // Wait for the specified delay before starting this request
    await new Promise((resolve) => setTimeout(resolve, delay));

    console.log("Clicking Connect button...");
    button.click();

    // Check if "Send without a note" button appears after clicking "Connect"
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for popup to appear if any
    const sendWithoutNoteButton = Array.from(
        document.querySelectorAll("button")
    ).find((btn) => btn.textContent.includes("Send without a note"));

    if (sendWithoutNoteButton) {
        console.log("Clicking Send without a note button...");
        sendWithoutNoteButton.click();
    } else {
        console.log("No additional popup, moving to the next button");
    }
}

async function startConnecting() {
    console.log("Starting to connect...");
    const connectButtons = Array.from(
        document.querySelectorAll("button")
    ).filter((button) => button.textContent.includes("Connect"));

    const totalConnections = connectButtons.length;
    console.log(`Total connections: ${totalConnections}`);

    let delay = 5000;
    for (let i = 0; i < connectButtons.length; i++) {
        await sendConnectionRequest(connectButtons[i], delay);

        // Update progress after each connection attempt
        sendStatusToPopup(((i + 1) / totalConnections) * 360);

        console.log(`Connection ${i + 1} initiated`);

        // Set delay for the next request (random delay between 5-10 seconds)
        delay = Math.floor(Math.random() * 5000) + 5000;
    }
}

chrome.runtime.onMessage.addListener((request) => {
    console.log("Message received in content script");
    if (request.message === "start") {
        console.log("Start Connecting");
        startConnecting();
    }
});
