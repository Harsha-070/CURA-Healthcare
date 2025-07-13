
import React from 'react';
import { SidebarIcon, SettingsIcon, BrandIcon } from './Icons';

interface HeaderProps {
    sessionTitle: string;
    onToggleHistory: () => void;
    onToggleSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ sessionTitle, onToggleHistory, onToggleSettings }) => {
    return (
        <header className="flex-shrink-0 p-3 md:p-4 border-b border-slate-700/80 flex items-center justify-between relative bg-slate-800 dark:bg-black/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                 <button 
                    onClick={onToggleHistory}
                    className="p-2 rounded-full text-slate-300 hover:bg-white/10 transition-colors md:hidden"
                    aria-label="Toggle chat history"
                >
                    <SidebarIcon />
                </button>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-100 tracking-wide">
                    <BrandIcon className="w-7 h-7 text-sky-400" />
                    <span>CURA</span>
                </div>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 text-center hidden sm:block">
                 <h1 className="text-base font-semibold text-slate-300 truncate max-w-[200px] md:max-w-sm" title={sessionTitle}>
                    {sessionTitle}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleSettings}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-slate-300 hover:bg-white/10 transition-colors"
                    aria-label="Open settings"
                >
                    <SettingsIcon />
                </button>
            </div>
        </header>
    );
};

export default Header;