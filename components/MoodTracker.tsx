import React from 'react';
import { Mood, MoodEntry } from '../types';

interface MoodTrackerProps {
  moods: MoodEntry[];
  onLogMood: (mood: Mood) => void;
}

const moodOptions: { mood: Mood; emoji: string; color: string; bg: string }[] = [
  { mood: Mood.Happy, emoji: '😊', color: 'text-green-500', bg: 'bg-green-400' },
  { mood: Mood.Content, emoji: '🙂', color: 'text-sky-500', bg: 'bg-sky-400' },
  { mood: Mood.Neutral, emoji: '😐', color: 'text-yellow-500', bg: 'bg-yellow-400' },
  { mood: Mood.Sad, emoji: '😕', color: 'text-blue-500', bg: 'bg-blue-400' },
  { mood: Mood.Anxious, emoji: '😟', color: 'text-purple-500', bg: 'bg-purple-400' },
];

const MoodTracker: React.FC<MoodTrackerProps> = ({ moods, onLogMood }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">How are you feeling?</h2>
        <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
          {moodOptions.map(({ mood, emoji }) => (
            <button
              key={mood}
              onClick={() => onLogMood(mood)}
              title={mood}
              className={`text-2xl p-2 rounded-full transition-transform duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-sky-500`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-md font-semibold text-slate-600 dark:text-slate-300">Mood Trend</h3>
        {moods.length > 0 ? (
          <div className="flex items-end justify-center h-40 space-x-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            {[...moods].reverse().map((entry, index) => {
              const moodInfo = moodOptions.find(m => m.mood === entry.mood);
              // Scale height from 20% to 100% based on recency
              const heightPercentage = ((index + 1) / moods.length) * 80 + 20; 
              return (
                <div key={index} className="group relative flex-1 flex flex-col items-center justify-end h-full text-center">
                  <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none z-10">
                    {entry.mood} at {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900 dark:border-t-slate-700"></div>
                  </div>
                  <div
                    className={`w-full max-w-[30px] rounded-t-md transition-all duration-500 ease-in-out ${moodInfo?.bg}`}
                    style={{ height: `${heightPercentage}%` }}
                  ></div>
                  <span className="text-xl mt-1">{moodInfo?.emoji}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center">Log your first mood to see your trend here.</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-md font-semibold text-slate-600 dark:text-slate-300">Recent Moods</h3>
        <ul className="space-y-2">
          {moods.length > 0 ? (
            moods.map((entry, index) => (
              <li key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-sm">
                <span className="flex items-center">
                  <span className="text-xl mr-2">{moodOptions.find(m => m.mood === entry.mood)?.emoji}</span>
                  {entry.mood}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            ))
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">No moods logged yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MoodTracker;