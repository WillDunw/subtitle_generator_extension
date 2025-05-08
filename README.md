# 🎧 Subtitle Generator Chrome Extension

![Status](https://img.shields.io/badge/status-in--progress-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Built with](https://img.shields.io/badge/built%20with-Azure%20Speech%20SDK-lightgrey)
![Platform](https://img.shields.io/badge/platform-Chrome-4285F4)

Generate **live subtitles** on **any site with audio**, straight from your Chrome browser.

This extension taps into **Azure Speech Services** to deliver **real-time transcription** overlays—perfect for those moments when you're watching streams, videos, or anything audio-based and wish you had subtitles.

---

## 🌟 Features

- 🎙️ Real-time audio transcription  
- 🌍 Works on any tab with audio  
- 🧩 Easy Chrome extension setup  
- 🔐 Secure via your own Azure keys  
- 🛠️ Under active development  

---

## 🔧 Getting Started

> **Note**: This project is currently **not deployed** on the Chrome Web Store. You’ll need to run it manually via the devtools.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/subtitle-generator-extension.git
cd subtitle-generator-extension
```

### 2. Add your Azure credentials

Create a `.env` file in the `backend/` folder and provide your Azure Speech SDK keys:

```env
AZURE_SPEECH_KEY=your_speech_key_here
AZURE_REGION=your_region_here
```

### 3. Install Backend Dependencies

```bash
npm install
npm start
```

### 4. Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder in the repo
5. Once loaded, the extension icon will appear in your Chrome toolbar.
