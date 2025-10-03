import React from 'react';
import JournalIcon from './icons/JournalIcon';

interface JournalingPromptsProps {
  onPromptRequest: (prompt: string) => void;
}

const prompts = [
  "What is something that made you smile today?",
  "Describe a challenge you've overcome recently. What did you learn?",
  "If you could give your younger self one piece of advice, what would it be?",
  "What are three things you're grateful for right now?",
  "Write about a goal you have for this week, no matter how small.",
  "What does 'peace' feel like in your body? Describe it.",
  "Describe a place where you feel completely at ease.",
  "What is a skill you'd like to learn and why?",
  "Write a letter to someone you miss, without the intention of sending it.",
  "What's a simple pleasure that you often overlook?",
];

const JournalingPrompts: React.FC<JournalingPromptsProps> = ({ onPromptRequest }) => {
  const getPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const selectedPrompt = prompts[randomIndex];
    onPromptRequest(selectedPrompt);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Journaling Prompt</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Take a moment to reflect. A prompt can help you get started.
      </p>
      <button
        onClick={getPrompt}
        className="w-full flex items-center justify-center p-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-sky-500"
      >
        <JournalIcon />
        <span className="ml-2 font-medium">Get a Prompt</span>
      </button>
    </div>
  );
};

export default JournalingPrompts;
