
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './Message';
import BotIcon from './icons/BotIcon';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-6">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && (
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                           <BotIcon />
                        </div>
                        <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-lg rounded-tl-none animate-pulse">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animation-delay-200"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animation-delay-400"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ChatWindow;
