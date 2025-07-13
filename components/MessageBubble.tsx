import React from 'react';
import { type Message, MessageSender } from '../types';
import { UserIcon, BotIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const bubbleClasses = isUser
    ? 'bg-sky-500 text-white dark:bg-sky-600 dark:text-white'
    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200';

  const containerClasses = isUser
    ? 'flex-row-reverse'
    : 'flex-row';

  return (
    <div className={`flex items-start gap-3 max-w-xl lg:max-w-3xl w-fit ${containerClasses} ${isUser ? 'self-end' : 'self-start'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-sky-100 dark:bg-sky-900' : 'bg-emerald-100 dark:bg-emerald-900'}`}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>
      <div
        className={`px-4 py-3 rounded-2xl ${bubbleClasses} ${isUser ? 'rounded-br-none' : 'rounded-bl-none'} shadow-md`}
      >
        <p className={`whitespace-pre-wrap ${isUser ? 'font-medium' : ''}`}>{message.text}</p>
      </div>
    </div>
  );
};

export default MessageBubble;