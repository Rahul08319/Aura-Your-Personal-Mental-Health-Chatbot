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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  moods,
  onLogMood,
  onPromptRequest,
  isOpenMobile,
  onCloseMobile,
}) => {
  const currentYear = new Date().getFullYear();

  const sidebarContent = (
    <div className="flex flex-col h-full space-y-6">
      {/* Mobile Drawer Close */}
      <div className="flex md:hidden items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
        <span className="text-sm font-bold text-slate-800 dark:text-white">Aura Toolkit</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Wellness Insight Badge */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-teal-500/10 via-indigo-500/10 to-purple-500/10 border border-teal-500/20 dark:border-teal-400/20 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-white text-base shadow-sm">
            ✨
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Mindfulness Zone</h4>
            <p className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">Calm & Compassionate</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-lg border border-black/5 dark:border-white/10">
          {currentYear}
        </span>
      </div>

      {/* Mood Tracker */}
      <MoodTracker moods={moods} onLogMood={onLogMood} />

      {/* Daily Reflection Journaling */}
      <JournalingPrompts onPromptRequest={onPromptRequest} />

      {/* Ambient Soundscape */}
      <AmbientSounds />

      {/* Emergency SOS Support */}
      <EmergencySupport />

      {/* Dynamic Auto-Updating Year & Apple Design Footer */}
      <div className="pt-4 border-t border-black/5 dark:border-white/5 text-center text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
        <p className="font-medium text-slate-500 dark:text-slate-400">
          Designed with Apple Human Interface Guidelines
        </p>
        <p>© 2025–{currentYear} Aura Project • Live Auto-Sync</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-80 lg:w-84 apple-glass border-r border-black/[0.06] dark:border-white/[0.08] p-5 overflow-y-auto z-20 flex-shrink-0 transition-colors duration-200">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Panel */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-[85%] bg-white dark:bg-slate-900 shadow-2xl p-5 overflow-y-auto flex flex-col z-50 animate-slide-up">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;