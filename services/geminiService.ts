import { GoogleGenAI, Modality, Type } from '@google/genai';
import { WordData } from '../types';
import { base64ToBytes, createWavBlob } from './audioUtils';

// Initialize Gemini Client
// NOTE: API Key is managed via process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_TEXT = 'gemini-2.5-flash';
const MODEL_AUDIO = 'gemini-2.5-flash-preview-tts';

// 1. Analyze the Japanese word
export const analyzeWord = async (word: string): Promise<WordData> => {
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Analyze the Japanese word "${word}". Provide the reading in Hiragana, Romaji, English meanings, and 3 example sentences (Japanese, Reading, English Translation).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          reading: { type: Type.STRING },
          romaji: { type: Type.STRING },
          meanings: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                japanese: { type: Type.STRING },
                reading: { type: Type.STRING },
                english: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text) as WordData;
};

// 2. Generate Audio (TTS)
// Returns a Blob URL that points to a WAV file
export const generateSpeech = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: MODEL_AUDIO,
    contents: `Read the following Japanese text with an instructional & professional tone: ${text}`,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Erinome' }
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error('No audio data received');
  }

  // Convert Base64 -> Raw PCM Bytes
  const pcmBytes = base64ToBytes(base64Audio);

  // Wrap PCM in WAV container
  // Gemini TTS sample rate is typically 24kHz
  const wavBlob = createWavBlob(pcmBytes, 24000);

  return URL.createObjectURL(wavBlob);
};