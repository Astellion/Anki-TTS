export interface Sentence {
  japanese: string;
  reading: string;
  english: string;
  audioUrl?: string; // Blob URL for playback
  isGeneratingAudio?: boolean;
}

export interface WordData {
  original: string;
  reading: string;
  romaji: string;
  meanings: string[];
  sentences: Sentence[];
  wordAudioUrl?: string; // Blob URL for playback
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING_AUDIO = 'GENERATING_AUDIO',
  ERROR = 'ERROR'
}

// Helper type for WAV encoding
export interface WavHeaderOptions {
  numFrames: number;
  numChannels: number;
  sampleRate: number;
  bytesPerSample: number;
}