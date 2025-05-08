// processor.js
class PCMWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const channelData = input[0]; // mono audio only
      const output = outputs[0];

      for (let channel = 0; channel < input.length; ++channel) {
        output[channel].set(input[channel]); // ✅ Pass through audio
      }

      // Convert Float32 to Int16
      const int16Buffer = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        int16Buffer[i] = channelData[i] * 0x7FFF;
      }
  
      // Send to main thread
      this.port.postMessage(int16Buffer.buffer, [int16Buffer.buffer]);
      return true; // keep processor alive
    }
  }
  
  registerProcessor('pcm-worklet', PCMWorkletProcessor);
  