require('dotenv').config();
const WebSocket = require('ws');
const express = require('express');
const sdk = require('microsoft-cognitiveservices-speech-sdk');


const app = express();
const PORT = process.env.port || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('🎤 Subtitle Generator Backend is live');
});

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
  const pushStream = sdk.AudioInputStream.createPushStream();
  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizing = (_, e) => {
    ws.send(JSON.stringify({ interim: e.result.text }));
  }

  recognizer.startContinuousRecognitionAsync();

  ws.on('message', (audioChunk) => {
    pushStream.write(audioChunk);
  });

  ws.on('close', () => {
    pushStream.close();
    recognizer.stopContinuousRecognitionAsync();
  });
});
