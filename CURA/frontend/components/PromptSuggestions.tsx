

import React from 'react';

interface PromptSuggestionsProps {
    onPromptClick: (prompt: string) => void;
}

const suggestions = [
    'What are the signs of dehydration?',
    'Explain intermittent fasting',
    'Benefits of meditation for stress?',
    'First aid for a minor burn',
    'How to handle seasonal allergies?',
    'What makes a breakfast healthy?',
];

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onPromptClick }) => {
    return (
        <div className="px-4 pt-1 pb-3 flex-shrink-0 animate-fade-in-down">
            <div className="flex items-center justify-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                {suggestions.map((question) => (
                    <button
                        key={question}
                        onClick={() => onPromptClick(question)}
                        className="flex-shrink-0 px-4 py-2 bg-white/60 dark:bg-slate-800/60 rounded-full text-xs font-medium text-sky-800 dark:text-sky-200 hover:bg-white dark:hover:bg-slate-700 transition-colors whitespace-nowrap shadow-sm"
                    >
                        {question}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PromptSuggestions;
