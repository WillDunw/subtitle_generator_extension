const bar = document.createElement("div");
bar.id = "subtitle-bar-for-extension";
bar.textContent = "";
document.body.appendChild(bar);

Object.assign(bar.style, {
  position: "fixed",
  bottom: "0.2em",
  marginLeft: "40%",
  maxHeight: "15%",
  width: "20%",
  background: "rgba(0,0,0,0.8)",
  color: "white",
  textAlign: "center",
  padding: "10px",
  fontSize: "20px",
  fontFamily: "sans-serif",
  zIndex: "9999"
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "displaySubtitle") {
    let subtitle = document.getElementById("subtitle-bar-for-extension");
   subtitle.textContent = message.text;
  }
});
