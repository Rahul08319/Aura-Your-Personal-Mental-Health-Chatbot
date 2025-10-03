
import React from 'react';
import { Message, Sender } from '../types';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';

interface MessageProps {
  message: Message;
}

const MessageBubble: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-sky-500 text-white rounded-br-none'
    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none';

  return (
    <div className={`${containerClasses} items-start space-x-3`}>
        {!isUser && (
            <div className="flex-shrink-0">
                <BotIcon />
            </div>
        )}
        <div
        className={`max-w-md p-3 rounded-lg shadow-sm whitespace-pre-wrap ${bubbleClasses}`}
        >
            {message.text}
        </div>
        {isUser && (
            <div className="flex-shrink-0">
                <UserIcon />
            </div>
        )}
    </div>
  );
};

export default MessageBubble;
