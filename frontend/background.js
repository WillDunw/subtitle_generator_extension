chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'startCapture') {
      handleCapture(request.streamId);
      return true; // Required for async sendResponse
    }
    if (request.type === 'stopCapture') {
      handleStopCapture();
    }

    if (request.type === 'passSubtitle') {
      handlePassSubtitle(request.text);
    }
  });
  
  async function handleCapture(streamId) {
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
  }

  async function handleStopCapture() {
    await chrome.runtime.sendMessage({
        type: 'stopProcessing'
      });
    await chrome.offscreen.closeDocument();

    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await chrome.tabs.sendMessage(currentTab.id, {
      type: 'hideSubtitle'
    });
  }

  async function handlePassSubtitle(text) {
    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await chrome.tabs.sendMessage(currentTab.id, {
      type: 'displaySubtitle',
      text: text
    });
  }