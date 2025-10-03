import React from 'react';
import SoundControl from './SoundControl';
import RainIcon from './icons/RainIcon';
import WaveIcon from './icons/WaveIcon';
import MusicIcon from './icons/MusicIcon';

const soundData = [
  { 
    name: 'Rain', 
    soundFile: 'https://cdn.pixabay.com/audio/2022/11/17/audio_87163821f2.mp3', 
    icon: <RainIcon /> 
  },
  { 
    name: 'Ocean Waves', 
    soundFile: 'https://cdn.pixabay.com/audio/2022/01/18/audio_73d9e05713.mp3', 
    icon: <WaveIcon /> 
  },
  { 
    name: 'Calm Music', 
    soundFile: 'https://cdn.pixabay.com/audio/2024/05/29/audio_d149405d45.mp3', 
    icon: <MusicIcon /> 
  },
];

const AmbientSounds: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Ambient Sounds</h2>
      <div className="space-y-3">
        {soundData.map(sound => (
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