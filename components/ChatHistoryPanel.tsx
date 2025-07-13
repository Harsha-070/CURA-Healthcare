

import React, { useMemo } from 'react';
import { ChatSession } from '../types';
import { PlusIcon, TrashIcon, ArchiveIcon, UnarchiveIcon, CloseIcon, ChatBubbleIcon } from './Icons';
import { formatDistanceToNow } from 'https://esm.sh/date-fns@3.6.0';

interface ChatHistoryPanelProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDelete: (id: string) => void;
    onArchive: (id: string, archive: boolean) => void;
    showArchived: boolean;
}

const ChatHistoryItem: React.FC<{
    session: ChatSession;
    isActive: boolean;
    onSelect: () => void;
    onDelete: (e: React.MouseEvent) => void;
    onArchive: (e: React.MouseEvent) => void;
    isArchived: boolean;
}> = ({ session, isActive, onSelect, onDelete, onArchive, isArchived }) => {
    return (
        <li
            onClick={onSelect}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                isActive ? 'bg-sky-100 dark:bg-sky-900/60 shadow-inner' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/40'
            }`}
        >
            <div className="flex-1 overflow-hidden pr-10">
                <p className="font-semibold text-sm truncate text-slate-800 dark:text-slate-100">{session.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 bg-slate-200/80 dark:bg-slate-900/80 rounded-full p-0.5">
                 <button onClick={onArchive} className="p-1.5 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300" aria-label={isArchived ? 'Unarchive' : 'Archive'}>
                    {isArchived ? <UnarchiveIcon className="w-4 h-4" /> : <ArchiveIcon className="w-4 h-4" />}
                </button>
                <button onClick={onDelete} className="p-1.5 hover:bg-red-200 dark:hover:bg-red-800/50 rounded-full text-red-500 dark:text-red-400" aria-label="Delete">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </li>
    );
};


const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
    sessions, activeSessionId, isOpen, setIsOpen, onNewChat, onSelectChat, onDelete, onArchive, showArchived
}) => {
    const visibleSessions = useMemo(() => {
        return sessions.filter(s => s.isArchived === showArchived);
    }, [sessions, showArchived]);
    
    return (
        <>
            <aside
                className={`absolute md:relative z-20 h-full w-72 md:w-80 flex-shrink-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-lg border-r border-slate-200/80 dark:border-slate-700/60 flex flex-col transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="p-4 flex-shrink-0">
                    <button 
                        onClick={onNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 dark:ring-offset-slate-800"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>New Chat</span>
                    </button>
                </div>
                
                <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{showArchived ? 'Archived' : 'Chat History'}</h2>
                     <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors md:hidden" aria-label="Close panel">
                        <CloseIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>

                <div className="flex-grow p-2 overflow-y-auto custom-scrollbar">
                    {visibleSessions.length > 0 ? (
                        <ul className="space-y-1.5">
                            {visibleSessions.map(session => (
                                <ChatHistoryItem 
                                    key={session.id}
                                    session={session}
                                    isActive={session.id === activeSessionId}
                                    onSelect={() => onSelectChat(session.id)}
                                    onDelete={(e) => { e.stopPropagation(); onDelete(session.id); }}
                                    onArchive={(e) => { e.stopPropagation(); onArchive(session.id, !showArchived); }}
                                    isArchived={showArchived}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-16 px-4 h-full animate-fade-in">
                            <ChatBubbleIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                            <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">
                                {showArchived ? 'No archived chats' : 'No chat history yet'}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {showArchived ? 'Your archived chats will appear here' : 'Start a conversation to see it here'}
                            </p>
                        </div>
                    )}
                </div>
            </aside>
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/30 z-10 md:hidden animate-fade-in" />}
        </>
    );
};

export default ChatHistoryPanel;