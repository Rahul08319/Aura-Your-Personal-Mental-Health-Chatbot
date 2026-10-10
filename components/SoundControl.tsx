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
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(soundFile);
    audio.loop = true;
    audio.volume = volume;

    const handleCanPlay = () => setIsAudioReady(true);
    audio.addEventListener('canplaythrough', handleCanPlay);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, [soundFile]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn("Audio play prevented:", e));
    }
  }, [isPlaying]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <div className="flex flex-col space-y-2 p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-black/5 dark:border-white/5 transition-all duration-200 hover:shadow-apple-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            {icon}
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {name}
            </span>
            {/* Animated Equalizer Waveform when playing */}
            {isPlaying && (
              <div className="flex items-center space-x-0.5 mt-0.5 h-2">
                <span className="w-1 bg-teal-500 rounded-full animate-wave-bar" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-teal-500 rounded-full animate-wave-bar" style={{ animationDelay: '200ms' }} />
                <span className="w-1 bg-teal-500 rounded-full animate-wave-bar" style={{ animationDelay: '400ms' }} />
                <span className="w-1 bg-teal-500 rounded-full animate-wave-bar" style={{ animationDelay: '100ms' }} />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? `Pause ${name}` : `Play ${name}`}
          className={`p-2 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none ${
            isPlaying
              ? 'bg-teal-500 text-white shadow-sm'
              : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      {/* Volume Slider with percentage */}
      <div className="flex items-center space-x-2 pt-1">
        <div className="text-slate-400 dark:text-slate-500 scale-90">
          <VolumeIcon />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          aria-label={`${name} volume`}
          className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-500"
        />
        <span className="text-[10px] text-slate-400 font-mono w-6 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};

export default SoundControl;