
import React from 'react';
import { ThermometerIcon, HeartIcon, LeafIcon, BrainIcon, PulseIcon, ShieldIcon, LockIcon, PeopleIcon } from './Icons';

interface Suggestion {
    icon: React.FC<{ className?: string }>;
    question: string;
    category: string;
}

const suggestions: Suggestion[] = [
    { icon: PulseIcon, question: 'Explain intermittent fasting', category: 'Nutrition' },
    { icon: BrainIcon, question: 'Benefits of meditation for stress?', category: 'Mental Health' },
    { icon: LeafIcon, question: 'How to handle seasonal allergies?', category: 'Ailments' },
    { icon: HeartIcon, question: 'What makes a breakfast healthy?', category: 'Diet' },
    { icon: ShieldIcon, question: 'First aid steps for a minor burn', category: 'First Aid' },
    { icon: ThermometerIcon, question: 'What are the signs of dehydration?', category: 'Wellness' },
];

interface PromptSuggestionsProps {
    onPromptClick: (prompt: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onPromptClick }) => {
    return (
        <div className="flex-grow flex flex-col justify-center animate-fade-in px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion.question}
                        onClick={() => onPromptClick(suggestion.question)}
                        className="p-4 bg-white/70 dark:bg-slate-800/60 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left"
                    >
                        <suggestion.icon className="w-7 h-7 mb-2 text-sky-500 dark:text-sky-400" />
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-tight">{suggestion.question}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{suggestion.category}</p>
                    </button>
                ))}
            </div>
             <div className="flex items-center justify-center gap-6 mt-8 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                    <LockIcon />
                    <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <PeopleIcon />
                    <span>Professional Advice</span>
                </div>
            </div>
        </div>
    );
};

export default PromptSuggestions;
