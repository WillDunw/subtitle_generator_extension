const bar = document.createElement("div");
bar.id = "subtitle-bar";
bar.textContent = "📢 Subtitles will appear here.";
document.body.appendChild(bar);
// const output = new AudioContext();
// const source = output.createMediaStreamSource(stream);
// source.connect(output.destination);

Object.assign(bar.style, {
  position: "fixed",
  bottom: "0.2em",
  marginLeft: "40%",
  width: "20%",
  background: "rgba(0,0,0,0.8)",
  color: "white",
  textAlign: "center",
  padding: "10px",
  fontSize: "20px",
  fontFamily: "sans-serif",
  zIndex: "9999"
});

function displaySubtitle(text) {
  let subtitle = document.getElementById("subtitle-bar");
  subtitle.textContent = text;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "displaySubtitle") {
    displaySubtitle(message.data);
  }
});
