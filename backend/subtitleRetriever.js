
const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription('KEY', 'REGION');
  const pushStream = sdk.AudioInputStream.createPushStream();
  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognized = (_, e) => {
    ws.send(JSON.stringify({ final: e.result.text }));
  };

  recognizer.startContinuousRecognitionAsync();

  ws.on('message', (audioChunk) => {
    pushStream.write(audioChunk);
  });

  ws.on('close', () => {
    pushStream.close();
    recognizer.stopContinuousRecognitionAsync();
  });
});