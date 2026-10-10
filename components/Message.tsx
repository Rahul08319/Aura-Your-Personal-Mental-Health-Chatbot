import React, { useState } from 'react';
import { Message, Sender } from '../types';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';

interface MessageProps {
  message: Message;
  onSelectAction?: (actionText: string) => void;
}

const MessageBubble: React.FC<MessageProps> = ({ message, onSelectAction }) => {
  const isUser = message.sender === Sender.User;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`group flex items-end space-x-2.5 my-3 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mb-1">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-500 via-teal-400 to-emerald-400 p-[1px] shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[15px] flex items-center justify-center">
              <span className="text-xs">🧘</span>
            </div>
          </div>
        </div>
      )}

      {/* Bubble Container */}
      <div className={`relative max-w-lg md:max-w-xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap transition-all ${
            isUser
              ? 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white rounded-br-md shadow-sm'
              : 'apple-glass-card text-slate-800 dark:text-slate-100 rounded-bl-md shadow-apple-sm border border-black/[0.05] dark:border-white/[0.08]'
          }`}
        >
          {message.text}

          {/* Time & Copy Pill on bottom */}
          <div className={`flex items-center space-x-2 mt-2 pt-1 text-[10px] ${isUser ? 'text-blue-100 justify-end' : 'text-slate-400 justify-between'}`}>
            <span>{formattedTime}</span>
            <button
              onClick={handleCopy}
              className={`opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded ${
                isUser ? 'hover:bg-blue-700/50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Copy message"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 mb-1">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm text-xs font-bold">
            You
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
