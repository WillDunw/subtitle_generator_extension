class PCMWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sampleRate = sampleRate; // Native sample rate (e.g., 48kHz)
    this.targetSampleRate = 16000; // Azure requires 16kHz
    this.audioBuffer = [];
    this.bytesPerSample = 2; // 16-bit = 2 bytes
  }

  process(inputs, outputs) {
    const input = inputs[0];
    if (!input?.[0]) return true;

    const inputChannel = input[0]; // Mono input
    const output = outputs[0];

    // 1. Pass through original 32-bit audio (for playback)
    for (let channel = 0; channel < output.length; ++channel) {
      output[channel].set(inputChannel);
    }

    // 2. Downsample to 16kHz and convert to 16-bit for Azure
    const downsampled = this.downsampleAndConvertTo16Bit(inputChannel);
    
    // 3. Send to main thread (for WebSocket)
    this.port.postMessage(
      { type: "audio16bit", data: downsampled.buffer },
      [downsampled.buffer]
    );

    return true;
  }

  downsampleAndConvertTo16Bit(inputChannel) {
    // Simple downsampling: Average every N samples (e.g., 48kHz → 16kHz = 3:1)
    const ratio = Math.floor(this.sampleRate / this.targetSampleRate);
    const downsampledLength = Math.ceil(inputChannel.length / ratio);
    const int16Buffer = new Int16Array(downsampledLength);

    for (let i = 0, j = 0; i < inputChannel.length; i += ratio, j++) {
      let sum = 0;
      for (let k = 0; k < ratio && i + k < inputChannel.length; k++) {
        sum += inputChannel[i + k];
      }
      const avg = sum / Math.min(ratio, inputChannel.length - i);
      int16Buffer[j] = Math.max(-0x7FFF, Math.min(0x7FFF, avg * 0x7FFF));
    }

    return int16Buffer;
  }
}

  registerProcessor('pcm-worklet', PCMWorkletProcessor);
  