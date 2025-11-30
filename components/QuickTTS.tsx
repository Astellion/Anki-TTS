import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { AudioControl } from './AudioControl';

export const QuickTTS: React.FC = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const url = await generateSpeech(text.trim());
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="mb-4">
         <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </div>
            Quick Audio Generator
         </h2>
         <p className="text-slate-500 text-sm mt-1 ml-11">Generate native-sounding TTS for any sentence.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste Japanese text here (e.g. 吾輩は猫である)..."
          className="w-full p-4 text-lg text-slate-900 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all placeholder:text-slate-400 min-h-[100px] font-jp resize-y"
          disabled={isLoading}
        />
        
        {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
        )}

        <div className="flex items-center justify-between pt-2 gap-4">
             <div className="flex-1 min-h-[48px] flex items-center">
                 {audioUrl && (
                     <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-fit animate-fade-in">
                         <AudioControl 
                            audioUrl={audioUrl} 
                            onGenerate={() => {}}
                            isLoading={false}
                            label="Result"
                            autoPlay={true}
                         />
                         <span className="text-xs text-slate-400 font-medium">Generated</span>
                     </div>
                 )}
             </div>
             
             <button
                onClick={handleGenerate}
                disabled={isLoading || !text.trim()}
                className="flex-shrink-0 bg-secondary hover:bg-indigo-700 text-white font-medium rounded-xl text-sm px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200"
             >
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating</span>
                    </div>
                ) : (
                    'Generate Audio'
                )}
             </button>
        </div>
      </div>
    </div>
  );
};