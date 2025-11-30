import React from 'react';
import { WordData } from '../types';
import { AudioControl } from './AudioControl';

interface WordCardProps {
  data: WordData;
  onGenerateAudio: () => void;
  isGeneratingAudio: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ data, onGenerateAudio, isGeneratingAudio }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          
          {/* Main Word Section */}
          <div className="flex-1">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase mb-1">Studied Word</p>
            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="text-5xl md:text-6xl font-bold font-jp text-slate-900 mb-2">{data.original}</h1>
              <div className="flex flex-col">
                <span className="text-xl font-jp text-slate-600">{data.reading}</span>
                <span className="text-sm font-mono text-slate-400">{data.romaji}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {data.meanings.map((meaning, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-base font-medium bg-slate-100 text-slate-700">
                    {meaning}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex-shrink-0">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-medium text-slate-400 mb-3 text-center uppercase tracking-wider">Pronunciation</p>
                <div className="flex justify-center">
                    <AudioControl 
                        audioUrl={data.wordAudioUrl}
                        onGenerate={onGenerateAudio}
                        isLoading={isGeneratingAudio}
                        label="Word"
                        autoPlay={true}
                    />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};