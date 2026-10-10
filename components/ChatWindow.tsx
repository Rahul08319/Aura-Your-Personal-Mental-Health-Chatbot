import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './Message';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSelectPrompt?: (prompt: string) => void;
  onOpenBreathing?: () => void;
}

const QUICK_ACTIONS = [
  { label: '🧘 Guided Breathing', prompt: 'Can you guide me through a deep breathing exercise for stress relief?' },
  { label: '🌧️ Grounding 5-4-3-2-1', prompt: "I'm feeling a bit anxious. Can we do the 5-4-3-2-1 grounding exercise?" },
  { label: '💭 Overcoming Overthinking', prompt: 'I find myself stuck in a loop of overthinking. How can I calm my mind?' },
  { label: '📝 Gratitude Practice', prompt: 'Can you give me a thought-provoking gratitude journaling prompt?' },
];

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSelectPrompt,
  onOpenBreathing,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-2 sm:px-4 py-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Welcome Hero when conversation is fresh */}
        {messages.length <= 2 && (
          <div className="p-6 md:p-8 rounded-3xl apple-glass border border-black/5 dark:border-white/10 shadow-apple-sm text-center space-y-4 my-4 animate-fade-in">
            {/* Animated Pulsing Aura Emblem */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-teal-400/30 to-indigo-500/30 blur-xl animate-breathe-slow" />
              <div className="relative w-14 h-14 rounded-3xl bg-gradient-to-tr from-indigo-500 via-teal-400 to-emerald-400 p-[1.5px] shadow-apple-glow-teal flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
                  <span className="text-2xl animate-float">🌿</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Find Your Calm with Aura
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                A non-judgmental space crafted with Apple clarity and clinical empathy. Talk through your thoughts, track your emotions, or unwind with mindful exercises.
              </p>
            </div>

            {/* Quick Starter Chips */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2.5">
                Quick Ways to Begin
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {QUICK_ACTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectPrompt && onSelectPrompt(item.prompt)}
                    className="py-1.5 px-3 rounded-full text-xs font-medium bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-black/5 dark:border-white/10 shadow-sm transition-all duration-200 active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Stream */}
        <div className="space-y-1">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onOpenBreathing={onOpenBreathing}
              onSelectAction={onSelectPrompt}
            />
          ))}

          {/* Apple Animated Typing Indicator */}
          {isLoading && (
            <div className="flex items-end space-x-2.5 my-3 animate-fade-in">
              <div className="flex-shrink-0 mb-1">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-500 via-teal-400 to-emerald-400 p-[1px] shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[15px] flex items-center justify-center">
                    <span className="text-xs">🧘</span>
                  </div>
                </div>
              </div>
              <div className="apple-glass-card p-3.5 rounded-3xl rounded-bl-md shadow-apple-sm flex items-center space-x-1.5 border border-black/[0.05] dark:border-white/[0.08]">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-400 font-medium ml-1">Aura is reflecting...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
