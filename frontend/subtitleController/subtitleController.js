//setting up enable / disable of extension
let firstStart = true;
let socket = new WebSocket("http://localhost:3000");
document.addEventListener("DOMContentLoaded", function () {
  let state = document.getElementById("state");
  let toggle = document.getElementById("toggle");
  // let is_generating = false;

  toggle.addEventListener("change", async function (event) {
    state.innerText = "Loading...";
    if (event.target.checked) {
      is_generating = true;
      document.getElementById("state").innerText = "On";

      if (firstStart) {
        firstStart = false;
        //functionality to to get the subtitles
        await chrome.tabCapture.capture(
          { audio: true, video: true },
          async (stream) => {
            if(stream){
            const ctx = new AudioContext({ sampleRate: 16000 });
            const source = ctx.createMediaStreamSource(stream);

            await ctx.audioWorklet.addModule("../processor.js");
            const workletNode = new AudioWorkletNode(ctx, "pcm-worklet");

            source.connect(workletNode);
            workletNode.connect(ctx.destination);

            workletNode.port.onmessage = (event) => {
              const pcmBuffer = event.data;
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(pcmBuffer);
              }
            };

          }}
        );
      } else {
        socket = new WebSocket("http://localhost:3000");
      }
      // socket
      socket.onmessage = (event) => {
        console.log(event.data);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "displaySubtitle",
            data: event.data,
          });
        });
      };
    } else {
      is_generating = false;
      document.getElementById("state").innerText = "Off";
      socket.close();
    }
  });
});

function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) buf[l] = buffer[l] * 0x7fff;
  return buf.buffer;
}
