//setting up enable / disable of extension
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

//functionality to to get the subtitles
let stream = null;
chrome.tabCapture.capture({audio: true, video:true},
  (s) => {
    stream = s;
  }
);

const socket = new WebSocket('wss://localhost:3000');

const ctx = new AudioContext({ sampleRate: 16000 });
const source = ctx.createMediaStreamSource(stream);
const processor = ctx.createScriptProcessor(4096, 1, 1);

source.connect(processor);
processor.connect(ctx.destination);

processor.onaudioprocess = (e) => {
  const input = e.inputBuffer.getChannelData(0);
  const pcm = convertFloat32ToInt16(input);
  socket.send(pcm); // send to backend
};

function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) buf[l] = buffer[l] * 0x7FFF;
  return buf.buffer;
}