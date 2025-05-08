// offscreen.js
let audioContext, source, workletNode;
let socket; // Your WebSocket connection

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'startProcessing') {
    console.log(message);
    await startCapture(message.streamId);
  }
  if (message.type === 'stopProcessing') {
    stopCapture();
  }
});

async function startCapture(streamId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: streamId,
          }
        }
      });

    socket = new WebSocket("http://localhost:3000");
    
    audioContext = new AudioContext({ sampleRate: 16000 });
    source = audioContext.createMediaStreamSource(stream);
    
    await audioContext.audioWorklet.addModule('processor.js');
    workletNode = new AudioWorkletNode(audioContext, "pcm-worklet");
    
    source.connect(workletNode);
    workletNode.connect(audioContext.destination);
    
    workletNode.port.onmessage = (event) => {
      const pcmBuffer = event.data;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(pcmBuffer);
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.interim) {
        chrome.runtime.sendMessage({ type: "passSubtitle", text: data.interim });
       }
    };
    
  } catch (error) {
    console.error('Error in offscreen capture:', error);
  }
}

async function stopCapture() {
  if (workletNode) {
    workletNode.port.close();
    workletNode.disconnect();
  }
  if (source) {
    source.disconnect();
  }
  if (audioContext) {
    audioContext.close();
  }
  if (socket) {
    socket.close();
  }
}