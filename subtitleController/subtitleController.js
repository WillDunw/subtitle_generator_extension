document.addEventListener("DOMContentLoaded", function () {
  let state = document.getElementById("state");
  let toggle = document.getElementById("toggle");
  // let is_generating = false;

  toggle.addEventListener("change", function (event) {
    state.innerText = "Loading...";
    if (event.target.checked) {
      is_generating = true;
      document.getElementById("state").innerText = "On";
      console.log("Generating subtitles...");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSubtitleGeneration", data: "true" });
      });
    } else {
      is_generating = false;
      document.getElementById("state").innerText = "Off";
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSubtitleGeneration", data: "false" });
      });
    }
  });
});

// function displaySubtitle(text) {
//   let subtitle = document.getElementById("subtitle-bar");
//   subtitle.textContent = text;
// //   setTimeout(() => {
// //     subtitle.style.display = "none";
// //   }, 2000);
// };