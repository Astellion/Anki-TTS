import React from 'react';
import { Sentence } from '../types';
import { AudioControl } from './AudioControl';

interface SentenceListProps {
  sentences: Sentence[];
  onGenerateAudio: (index: number) => void;
}

export const SentenceList: React.FC<SentenceListProps> = ({ sentences, onGenerateAudio }) => {
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Example Sentences
      </h2>
      
      <div className="grid gap-4">
        {sentences.map((sentence, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-primary/30 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-lg font-jp font-medium text-slate-900 leading-relaxed">
                  {sentence.japanese}
                </p>
                <p className="text-sm text-slate-500 font-jp">
                  {sentence.reading}
                </p>
                <p className="text-base text-slate-700 italic border-l-2 border-slate-200 pl-3 mt-2">
                  {sentence.english}
                </p>
              </div>
              
              <div className="flex-shrink-0 pt-2 md:pt-0">
                <AudioControl 
                    audioUrl={sentence.audioUrl}
                    onGenerate={() => onGenerateAudio(index)}
                    isLoading={!!sentence.isGeneratingAudio}
                    label="Sentence"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};