const bar = document.createElement("div");
bar.id = "subtitle-bar-for-extension";
bar.textContent = "";
document.body.appendChild(bar);

Object.assign(bar.style, {
  position: "fixed",
  bottom: "0.2em",
  marginLeft: "40%",
  maxWidth: "20%",
  background: "rgba(0,0,0,0.8)",
  color: "white",
  textAlign: "center",
  padding: "10px",
  fontSize: "20px",
  fontFamily: "sans-serif",
  zIndex: "9999",
  display: "none"
});

let displayArray = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "displaySubtitle") {
    let subtitle = document.getElementById("subtitle-bar-for-extension");
    subtitle.style.display = "block";

    let wordArray = message.text.split(" ");

    if (wordArray.length <= 20) {
      subtitle.textContent = message.text;
    } else {
      wordArray = wordArray.slice(-20);
      subtitle.textContent = wordArray.join(" ");
    }
  }

  if(message.type === "hideSubtitle") {
    let subtitle = document.getElementById("subtitle-bar-for-extension");
    subtitle.style.display = "none";
  }
});