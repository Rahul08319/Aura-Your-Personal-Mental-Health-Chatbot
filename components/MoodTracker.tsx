import React from 'react';
import { Mood, MoodEntry } from '../types';

interface MoodTrackerProps {
  moods: MoodEntry[];
  onLogMood: (mood: Mood) => void;
}

const moodOptions: { mood: Mood; emoji: string; label: string; color: string; bgGradient: string }[] = [
  { mood: Mood.Happy, emoji: '😊', label: 'Happy', color: 'text-emerald-500', bgGradient: 'from-emerald-400 to-teal-500' },
  { mood: Mood.Content, emoji: '😌', label: 'Content', color: 'text-teal-500', bgGradient: 'from-teal-400 to-cyan-500' },
  { mood: Mood.Neutral, emoji: '😐', label: 'Neutral', color: 'text-amber-500', bgGradient: 'from-amber-400 to-yellow-500' },
  { mood: Mood.Sad, emoji: '🌧️', label: 'Low', color: 'text-sky-500', bgGradient: 'from-sky-400 to-blue-500' },
  { mood: Mood.Anxious, emoji: '⚡', label: 'Anxious', color: 'text-purple-500', bgGradient: 'from-purple-400 to-indigo-500' },
];

const MoodTracker: React.FC<MoodTrackerProps> = ({ moods, onLogMood }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-5">
      {/* Header & Quick Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            State of Mind
          </h3>
          <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400">
            {currentYear} Daily Log
          </span>
        </div>

        {/* Apple Segmented Mood Pills */}
        <div className="flex justify-between items-center p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-black/5 dark:border-white/5 backdrop-blur-md">
          {moodOptions.map(({ mood, emoji, label }) => (
            <button
              key={mood}
              onClick={() => onLogMood(mood)}
              title={`Log ${mood}`}
              className="group relative flex flex-col items-center p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
            >
              <span className="text-2xl transition-transform group-hover:drop-shadow-sm">
                {emoji}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white mt-1">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Trend Histogram */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Recent Rhythm
          </span>
          {moods.length > 0 && (
            <span className="text-[11px] text-slate-400">
              Last {moods.length} check-ins
            </span>
          )}
        </div>

        {moods.length > 0 ? (
          <div className="flex items-end justify-between h-32 space-x-2 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-black/5 dark:border-white/5">
            {[...moods].reverse().map((entry, index) => {
              const moodInfo = moodOptions.find((m) => m.mood === entry.mood);
              const heightPercentage = ((index + 1) / moods.length) * 65 + 35;
              const formattedTime = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={index} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                  {/* Apple Hover Tooltip */}
                  <div className="absolute bottom-full mb-2 w-max px-2.5 py-1 text-[11px] font-medium text-white bg-slate-900/90 dark:bg-slate-700/90 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-20 backdrop-blur-md">
                    {entry.mood} • {formattedTime}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900/90 dark:border-t-slate-700/90" />
                  </div>

                  {/* Gradient Pillar */}
                  <div
                    className={`w-full max-w-[24px] rounded-t-lg bg-gradient-to-t ${moodInfo?.bgGradient} shadow-sm transition-all duration-500 ease-out`}
                    style={{ height: `${heightPercentage}%` }}
                  />
                  <span className="text-sm mt-1.5 opacity-90">{moodInfo?.emoji}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-28 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xl mb-1 opacity-70">🌱</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Log your state of mind above to visualize your emotional rhythm.
            </p>
          </div>
        )}
      </div>

      {/* Mood History List */}
      {moods.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Timeline
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {moods.slice(0, 4).map((entry, index) => {
              const info = moodOptions.find((m) => m.mood === entry.mood);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/50 border border-black/[0.03] dark:border-white/[0.04] text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{info?.emoji}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{entry.mood}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;