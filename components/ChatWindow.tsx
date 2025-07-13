import React, { useEffect, useRef } from 'react';
import { type ChatSession } from '../types';
import MessageBubble from './MessageBubble';
import PromptSuggestions from './PromptSuggestions';

interface ChatWindowProps {
  session: ChatSession | null;
  isLoading: boolean;
  onPromptClick: (prompt: string) => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 self-start p-3 m-2">
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
    </div>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ session, isLoading, onPromptClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages, isLoading]);
  
  const isNewChat = session && session.messages.length <= 1;

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
    <div ref={scrollRef} className="flex-grow p-4 md:p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
      {!isNewChat && session.messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isNewChat && (
        <div className="flex-grow flex flex-col justify-center">
            <PromptSuggestions onPromptClick={onPromptClick} />
        </div>
      )}
      {isLoading && <TypingIndicator />}
    </div>
  );
};

export default ChatWindow;