let firstStart = true;
let socket = new WebSocket("http://localhost:3000");
document.addEventListener("DOMContentLoaded", async function () {
  let state = document.getElementById("state");
  let toggle = document.getElementById("toggle");

  await chrome.storage.local.get(["is_enabled"], function (result) {
    if (result.is_enabled == "true") {
      toggle.checked = true;
      state.innerText = "On";
    }
  });

  toggle.addEventListener("change", async function (event) {
    if (event.target.checked) {
      state.innerText = "On";

      const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

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

      await chrome.storage.local.set({ is_enabled: "true" });
    } else {
      state.innerText = "Off";
      chrome.runtime.sendMessage({
        type: "stopCapture",
      });
      await chrome.storage.local.set({ is_enabled: "false" });
    }
  });
});

function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) buf[l] = buffer[l] * 0x7fff;
  return buf.buffer;
}
