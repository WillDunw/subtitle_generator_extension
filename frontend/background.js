// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'startCapture') {
      handleCapture(request.streamId, sendResponse);
      return true; // Required for async sendResponse
    }
    if (request.type === 'stopCapture') {
      handleStopCapture();
    }
  });
  
  async function handleCapture(streamId, sendResponse) {
    // Check if we already have an offscreen document
    const existingContexts = await chrome.offscreen.hasDocument();
    if (!existingContexts) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Processing audio for subtitle generation'
      });
    }
    
    // Send the tabId to the offscreen document
    chrome.runtime.sendMessage({
      type: 'startProcessing',
      streamId: streamId
    });
    
    sendResponse({status: 'offscreen_ready'});
  }

  async function handleStopCapture() {
    await chrome.runtime.sendMessage({
        type: 'stopProcessing'
      });
    await chrome.offscreen.closeDocument();
  }