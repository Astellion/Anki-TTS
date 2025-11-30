import React, { useRef, useState, useEffect } from 'react';

interface AudioControlProps {
  audioUrl?: string;
  onGenerate: () => void;
  isLoading: boolean;
  label?: string;
  autoPlay?: boolean;
}

export const AudioControl: React.FC<AudioControlProps> = ({ 
  audioUrl, 
  onGenerate, 
  isLoading, 
  label = "Audio",
  autoPlay = false
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioUrl && autoPlay && audioRef.current) {
        audioRef.current.play().catch(e => console.warn("Autoplay blocked", e));
    }
  }, [audioUrl, autoPlay]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play();
      }
    }
  };

  if (!audioUrl) {
    return (
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-secondary bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>Generate {label}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Play Button */}
      <button
        onClick={handlePlay}
        className="p-2 text-white bg-primary rounded-full hover:bg-rose-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        title="Play"
      >
        {isPlaying ? (
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>

      {/* Download Button */}
      <a
        href={audioUrl}
        download={`anki_${Date.now()}.wav`}
        className="p-2 text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-primary transition-colors shadow-sm"
        title="Download for Anki"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </a>
    </div>
  );
};