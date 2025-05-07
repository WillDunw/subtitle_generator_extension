const WebSocket = require('ws');
const express = require('express');

const app = express();
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('[✓] WebSocket connected');

  ws.on('message', (data) => {
    console.log(`[→] Received ${data.byteLength} bytes`);
    // Echo back test text to client
    ws.send(JSON.stringify({ text: "Received audio chunk!" }));
  });

  ws.on('close', () => {
    console.log('[x] WebSocket disconnected');
  });
});