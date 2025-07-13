import React from 'react';
import { PlusIcon, BrandIcon } from './Icons';

interface EmptyStateProps {
    onNewChat: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewChat }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-fade-in">
            <div className="text-center bg-white/30 dark:bg-black/20 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl">
                <div className="inline-flex items-center justify-center gap-3">
                    <BrandIcon className="w-12 h-12 text-sky-500 dark:text-sky-400" />
                    <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">CURA</h1>
                </div>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 max-w-md">
                    Your personal healthcare assistant.
                </p>
                <button
                    onClick={onNewChat}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Start New Chat</span>
                </button>
            </div>
        </div>
    );
};

export default EmptyState;