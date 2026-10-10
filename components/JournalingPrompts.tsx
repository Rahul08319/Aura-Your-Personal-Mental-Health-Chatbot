import React, { useState } from 'react';
import JournalIcon from './icons/JournalIcon';

interface JournalingPromptsProps {
  onPromptRequest: (prompt: string) => void;
}

const categorizedPrompts = [
  { category: 'Gratitude', prompt: "What is a small, quiet moment from today that brought you peace?" },
  { category: 'Self-Compassion', prompt: "What would you say right now to a dear friend experiencing what you feel?" },
  { category: 'Mindfulness', prompt: "What does 'ease' feel like in your chest and shoulders right now?" },
  { category: 'Growth', prompt: "What is a challenge you navigated recently that proved your resilience?" },
  { category: 'Letting Go', prompt: "What is one worry you can gently surrender your grip on for tonight?" },
  { category: 'Connection', prompt: "Who is someone whose presence makes you feel safe and heard?" },
  { category: 'Clarity', prompt: "If you could tell your younger self one truth about life, what would it be?" },
];

const JournalingPrompts: React.FC<JournalingPromptsProps> = ({ onPromptRequest }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = categorizedPrompts[currentIndex];

  const nextPrompt = () => {
    setCurrentIndex((prev) => (prev + 1) % categorizedPrompts.length);
  };

  const handleUsePrompt = () => {
    onPromptRequest(currentItem.prompt);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-black/5 dark:border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <JournalIcon />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Daily Reflection
          </h3>
        </div>
        <button
          onClick={nextPrompt}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-1"
          title="Shuffle Prompt"
        >
          <span>Shuffle ↺</span>
        </button>
      </div>

      <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-black/5 dark:border-white/5 space-y-2">
        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          {currentItem.category}
        </span>
        <p className="text-xs text-slate-700 dark:text-slate-200 font-medium italic leading-relaxed">
          "{currentItem.prompt}"
        </p>
      </div>

      <button
        onClick={handleUsePrompt}
        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5"
      >
        <span>Reflect in Chat</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default JournalingPrompts;
