import React, { useState, useCallback } from 'react';
import { WordInput } from './components/WordInput';
import { WordCard } from './components/WordCard';
import { SentenceList } from './components/SentenceList';
import { QuickTTS } from './components/QuickTTS';
import { WordData, LoadingState } from './types';
import { analyzeWord, generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [isGeneratingWordAudio, setIsGeneratingWordAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Handle Main Search
  const handleSearch = useCallback(async (word: string) => {
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    setWordData(null); // Clear previous

    try {
      const data = await analyzeWord(word);
      setWordData(data);
      setLoadingState(LoadingState.IDLE);
      
      // Auto-generate audio for the main word immediately after text analysis
      handleGenerateWordAudio(data.original);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze word. Please try again.");
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  // 2. Generate Audio for Main Word
  const handleGenerateWordAudio = async (text: string) => {
    setIsGeneratingWordAudio(true);
    try {
      const url = await generateSpeech(text);
      setWordData(prev => prev ? { ...prev, wordAudioUrl: url } : null);
    } catch (err) {
      console.error("Audio generation failed", err);
    } finally {
      setIsGeneratingWordAudio(false);
    }
  };

  // 3. Generate Audio for a Sentence
  const handleGenerateSentenceAudio = useCallback(async (index: number) => {
    if (!wordData) return;
    
    // Set loading state for specific sentence
    const newSentences = [...wordData.sentences];
    newSentences[index] = { ...newSentences[index], isGeneratingAudio: true };
    setWordData({ ...wordData, sentences: newSentences });

    try {
        const sentence = wordData.sentences[index];
        const url = await generateSpeech(sentence.japanese);
        
        // Update URL
        setWordData(prev => {
            if (!prev) return null;
            const updated = [...prev.sentences];
            updated[index] = { ...updated[index], audioUrl: url, isGeneratingAudio: false };
            return { ...prev, sentences: updated };
        });
    } catch (err) {
        console.error("Sentence audio failed", err);
        // Reset loading state
        setWordData(prev => {
            if (!prev) return null;
            const updated = [...prev.sentences];
            updated[index] = { ...updated[index], isGeneratingAudio: false };
            return { ...prev, sentences: updated };
        });
    }
  }, [wordData]);

  return (
    <div className="min-h-screen pb-20">
        {/* Header / Hero */}
        <header className="bg-white border-b border-slate-200">
            <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-200">
                        暗
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">AnkiGen</h1>
                        <p className="text-xs text-slate-500 font-medium">AI Deck Builder</p>
                    </div>
                </div>
                <a href="https://ankiweb.net/" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                    What is Anki?
                </a>
            </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Master Japanese Vocabulary</h2>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Enter a word to generate native-sounding audio and context sentences for your flashcards.
                </p>
            </div>

            <WordInput onSearch={handleSearch} isLoading={loadingState === LoadingState.ANALYZING} />

            <div className="mb-12 border-b border-slate-200 pb-12">
                 <QuickTTS />
            </div>

            {error && (
                <div className="p-4 mb-8 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center">
                    {error}
                </div>
            )}

            {wordData && (
                <div className="animate-fade-in-up">
                    <WordCard 
                        data={wordData} 
                        onGenerateAudio={() => handleGenerateWordAudio(wordData.original)}
                        isGeneratingAudio={isGeneratingWordAudio}
                    />
                    
                    <SentenceList 
                        sentences={wordData.sentences}
                        onGenerateAudio={handleGenerateSentenceAudio}
                    />
                </div>
            )}
            
            {!wordData && loadingState === LoadingState.IDLE && (
                 <div className="mt-8 text-center">
                    <div className="inline-grid grid-cols-3 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="w-24 h-32 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-3xl font-jp">猫</div>
                        <div className="w-24 h-32 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-3xl font-jp mt-8">本</div>
                        <div className="w-24 h-32 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-3xl font-jp">夢</div>
                    </div>
                 </div>
            )}
        </main>
    </div>
  );
};

export default App;