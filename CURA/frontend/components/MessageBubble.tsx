

import React from 'react';
import { type Message, MessageSender } from '../types';
import { UserIcon, BotIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

// Helper function to parse and render formatted text from the bot
const renderFormattedText = (text: string) => {
  // Split the text by the bold markdown pattern (e.g., **text**), keeping the delimiters
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    // Check if the part is a bold segment
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the asterisks and wrap in a strong tag to make it bold
      return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    // Return the regular text part
    return part;
  });
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const bubbleClasses = isUser
    ? 'bg-sky-500 text-white dark:bg-sky-600 dark:text-white'
    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200';

  const containerClasses = isUser
    ? 'flex-row-reverse'
    : 'flex-row';

  return (
    <div className={`flex items-start gap-3 max-w-xl lg:max-w-3xl w-fit ${containerClasses} ${isUser ? 'self-end' : 'self-start'} animate-fade-in-down`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-sky-100 dark:bg-sky-900' : 'bg-emerald-100 dark:bg-emerald-900'}`}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>
      <div
        className={`px-4 py-3 rounded-2xl ${bubbleClasses} ${isUser ? 'rounded-br-none' : 'rounded-bl-none'} shadow-md`}
      >
        <p className={`whitespace-pre-wrap ${isUser ? 'font-medium' : ''}`}>
            {/* Only format text for bot messages */}
            {isUser ? message.text : renderFormattedText(message.text)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
