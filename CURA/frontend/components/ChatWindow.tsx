

import React, { useEffect, useRef } from 'react';
import { type ChatSession } from '../types';
import MessageBubble from './MessageBubble';
import { BrandIcon } from './Icons';

interface ChatWindowProps {
  session: ChatSession | null;
  isLoading: boolean;
  isNewChat: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 self-start p-3 m-2">
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
    </div>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ session, isLoading, isNewChat }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages, isLoading]);

  if (!session) {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Your Healthcare Assistant</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
                Select a chat from the side panel or start a new one.
            </p>
        </div>
    );
  }

  return (
    <div ref={scrollRef} className="relative flex-grow p-4 md:p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
      {session.messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      
      {isNewChat && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-fade-in" aria-hidden="true">
            <div className="text-center">
                <BrandIcon className="w-20 h-20 md:w-24 md:h-24 text-slate-200 dark:text-slate-700/50" />
                <h1 className="text-5xl md:text-6xl font-bold text-slate-200 dark:text-slate-700/50 mt-2">CURA</h1>
            </div>
        </div>
      )}

      {isLoading && <TypingIndicator />}
    </div>
  );
};

export default ChatWindow;
