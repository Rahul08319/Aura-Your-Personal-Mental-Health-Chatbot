import React from 'react';
import SoundControl from './SoundControl';
import RainIcon from './icons/RainIcon';
import WaveIcon from './icons/WaveIcon';
import MusicIcon from './icons/MusicIcon';

const soundData = [
  { 
    name: 'Gentle Rain', 
    soundFile: 'https://cdn.pixabay.com/audio/2022/11/17/audio_87163821f2.mp3', 
    icon: <RainIcon /> 
  },
  { 
    name: 'Ocean Waves', 
    soundFile: 'https://cdn.pixabay.com/audio/2022/01/18/audio_73d9e05713.mp3', 
    icon: <WaveIcon /> 
  },
  { 
    name: 'Serene Piano', 
    soundFile: 'https://cdn.pixabay.com/audio/2024/05/29/audio_d149405d45.mp3', 
    icon: <MusicIcon /> 
  },
];

const AmbientSounds: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Soundscape Studio
        </h3>
        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
          Binaural & Lo-Fi
        </span>
      </div>

      <div className="space-y-2.5">
        {soundData.map((sound) => (
          <SoundControl
            key={sound.name}
            name={sound.name}
            soundFile={sound.soundFile}
            icon={sound.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default AmbientSounds;