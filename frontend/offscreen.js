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
          sampleRate: 48000,  // High-quality capture
          channelCount: 1     // Azure requires mono
        }
      }
    });

    socket = new WebSocket("https://subtitle-gen-wa-gcaxeyc5ana8ewax.canadacentral-01.azurewebsites.net");
    
    audioContext = new AudioContext();
    source = audioContext.createMediaStreamSource(stream);
    
    await audioContext.audioWorklet.addModule('processor.js');
    workletNode = new AudioWorkletNode(audioContext, "pcm-worklet");
    
    source.connect(workletNode);
    workletNode.connect(audioContext.destination);
    

     // Handle 16-bit PCM data for Azure
     workletNode.port.onmessage = (event) => {
      if (event.data.type === "audio16bit" && socket?.readyState === WebSocket.OPEN) {
        socket.send(event.data.data); // Send raw ArrayBuffer
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