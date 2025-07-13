
import React, {useState} from 'react';
import { PaperPlaneIcon } from './Icons';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '' || isLoading || disabled) return;
    onSendMessage(input);
    setInput('');
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex-shrink-0 p-3 md:p-4 bg-transparent border-t border-slate-200 dark:border-slate-700/80">
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Select a chat to begin" : "Type your health question…"}
          disabled={isLoading || disabled}
          className="w-full h-12 px-6 pr-14 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Chat input"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || disabled || input.trim() === ''}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-400 text-white rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:scale-100 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <PaperPlaneIcon />
        </button>
      </div>
    </div>
  );
};

export default InputBar;
