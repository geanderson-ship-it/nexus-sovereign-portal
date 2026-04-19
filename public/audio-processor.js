/**
 * PCM Audio Processor for Gemini Multimodal Live API
 * Extract and convert audio chunks for real-time streaming.
 */
class PCMAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Int16Array(1024);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      
      for (let i = 0; i < channelData.length; i++) {
        // Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
        let sample = Math.max(-1, Math.min(1, channelData[i]));
        this.buffer[this.bufferIndex++] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;

        if (this.bufferIndex >= this.buffer.length) {
          // Send the Int16 chunk to the main thread
          this.port.postMessage(this.buffer);
          this.buffer = new Int16Array(1024);
          this.bufferIndex = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('pcm-processor', PCMAudioProcessor);
