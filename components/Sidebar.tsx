import React from 'react';
import MoodTracker from './MoodTracker';
import EmergencySupport from './EmergencySupport';
import JournalingPrompts from './JournalingPrompts';
import AmbientSounds from './AmbientSounds';
import { Mood, MoodEntry } from '../types';

interface SidebarProps {
  moods: MoodEntry[];
  onLogMood: (mood: Mood) => void;
  onPromptRequest: (prompt: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ moods, onLogMood, onPromptRequest }) => {
  return (
    <aside className="hidden md:flex flex-col w-72 lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 space-y-8 overflow-y-auto">
      <MoodTracker moods={moods} onLogMood={onLogMood} />
      <JournalingPrompts onPromptRequest={onPromptRequest} />
      <AmbientSounds />
      <EmergencySupport />
    </aside>
  );
};

export default Sidebar;