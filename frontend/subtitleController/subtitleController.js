let firstStart = true;
let socket = new WebSocket("http://localhost:3000");
document.addEventListener("DOMContentLoaded", function () {
  let state = document.getElementById("state");
  let toggle = document.getElementById("toggle");

  toggle.addEventListener("change", async function (event) {
    state.innerText = "Loading...";
    if (event.target.checked) {
      is_generating = true;
      document.getElementById("state").innerText = "On";

      const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const capturedTabs = await new Promise((resolve) => {
        chrome.tabCapture.getCapturedTabs(resolve);
      });
    
      const alreadyCaptured = capturedTabs.some(tab => tab.id === currentTab.id);

      const streamId = await chrome.tabCapture.getMediaStreamId({
        targetTabId: currentTab.id,
      });

      // Send message to background to start capture
      chrome.runtime.sendMessage(
        {
          type: "startCapture",
          streamId: streamId,
          tabId: currentTab.id,
        },
        (response) => {
          if (response.status === "offscreen_ready") {
            console.log("Capture started in offscreen document");
          }
        }
      );

    } else {
      is_generating = false;
      document.getElementById("state").innerText = "Off";
      chrome.runtime.sendMessage(
        {
          type: "stopCapture",
        });
    }
  });
});

function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) buf[l] = buffer[l] * 0x7fff;
  return buf.buffer;
}
