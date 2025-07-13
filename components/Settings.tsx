import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon, CloseIcon, UserCircleIcon, DatabaseIcon, LogoutIcon, TrashIcon, ArchiveIcon } from './Icons';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onDeleteAccount: () => void;
    onDeleteAllChats: () => void;
    showArchived: boolean;
    setShowArchived: (show: boolean) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeToggle: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void; }> = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    return (
        <div className="flex items-center justify-between">
            <span className="font-medium">Theme</span>
            <button
                onClick={toggleTheme}
                className="w-14 h-8 flex items-center bg-slate-200 dark:bg-slate-700 rounded-full p-1 transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                <div className={`w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`}>
                    {theme === 'light' ? <SunIcon className="w-full h-full p-1 text-yellow-500" /> : <MoonIcon className="w-full h-full p-1 text-blue-400" />}
                </div>
            </button>
        </div>
    );
};

const Settings: React.FC<SettingsProps> = ({
    isOpen, onClose, onLogout, onDeleteAccount, onDeleteAllChats, showArchived, setShowArchived, theme, setTheme
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
            aria-labelledby="settings-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl animate-fade-in-down">
                <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-slate-700/50">
                    <h3 id="settings-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">Settings</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                        <CloseIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>

                <div className="p-6 space-y-8 text-slate-700 dark:text-slate-300">
                    {/* Account Section */}
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                            <UserCircleIcon />
                            <span>ACCOUNT</span>
                        </h4>
                        <div className="space-y-3">
                            <ThemeToggle theme={theme} setTheme={setTheme} />
                             <button onClick={onLogout} className="flex w-full items-center justify-between text-left font-medium text-red-500 dark:text-red-400 p-2 rounded-lg transition-colors hover:bg-red-500/10">
                                <span>Logout</span>
                                <LogoutIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Data Controls Section */}
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                            <DatabaseIcon />
                            <span>DATA CONTROLS</span>
                        </h4>
                        <div className="space-y-3">
                             <button
                                onClick={() => {
                                    setShowArchived(!showArchived);
                                    onClose();
                                }}
                                className="flex w-full items-center justify-between text-left font-medium p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <span>{showArchived ? 'View Active Chats' : 'View Archived Chats'}</span>
                                <ArchiveIcon className="w-5 h-5" />
                            </button>
                            <button onClick={onDeleteAllChats} className="flex w-full items-center justify-between text-left font-medium text-red-500 dark:text-red-400 p-2 rounded-lg transition-colors hover:bg-red-500/10">
                                <span>Delete All Chats</span>
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                     <div className="pt-4 border-t border-white/20 dark:border-slate-700/50">
                        <button
                            onClick={onDeleteAccount}
                            className="w-full text-center text-sm font-medium py-2 rounded-lg text-red-500 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;