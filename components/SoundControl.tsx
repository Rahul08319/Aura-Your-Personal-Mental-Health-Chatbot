import React, { useState, useRef, useEffect, useCallback } from 'react';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import VolumeIcon from './icons/VolumeIcon';

interface SoundControlProps {
  name: string;
  soundFile: string;
  icon: React.ReactNode;
}

const SoundControl: React.FC<SoundControlProps> = ({ name, soundFile, icon }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(soundFile);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    const handleCanPlay = () => setIsAudioReady(true);
    audioRef.current.addEventListener('canplaythrough', handleCanPlay);

    const audio = audioRef.current;
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.pause();
    };
  }, [soundFile]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (audioRef.current && isAudioReady) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isAudioReady]);


  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="text-sky-500">{icon}</div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
            </div>
             <button
                onClick={togglePlay}
                disabled={!isAudioReady}
                aria-label={isPlaying ? `Pause ${name}` : `Play ${name}`}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
        </div>
        <div className="flex items-center space-x-2">
            <VolumeIcon />
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                aria-label={`${name} volume`}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-sky-500"
            />
        </div>
    </div>
  );
};

export default SoundControl;