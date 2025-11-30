import { WavHeaderOptions } from '../types';

// Convert Base64 string to raw Uint8Array bytes
export function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert raw PCM Int16 bytes to an AudioBuffer for playback
export async function decodePcmToAudioBuffer(
  pcmBytes: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(pcmBytes.buffer);
  // Mono channel assumption for TTS usually
  const numChannels = 1;
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    // Convert int16 to float32 range [-1.0, 1.0]
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

// Create a WAV file header
function createWavHeader(options: WavHeaderOptions): Uint8Array {
  const { numFrames, numChannels, sampleRate, bytesPerSample } = options;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // ChunkSize
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bytesPerSample * 8, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size

  return new Uint8Array(buffer);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Combines the header and the raw PCM data into a single WAV Blob
export function createWavBlob(pcmBytes: Uint8Array, sampleRate: number = 24000): Blob {
  // Input pcmBytes are assumed to be Int16 (2 bytes per sample)
  const numFrames = pcmBytes.byteLength / 2; 
  
  const header = createWavHeader({
    numFrames,
    numChannels: 1, // Gemini TTS is usually mono
    sampleRate,
    bytesPerSample: 2 // 16-bit
  });

  // Concatenate header and data
  const wavBytes = new Uint8Array(header.byteLength + pcmBytes.byteLength);
  wavBytes.set(header, 0);
  wavBytes.set(pcmBytes, header.byteLength);

  return new Blob([wavBytes], { type: 'audio/wav' });
}