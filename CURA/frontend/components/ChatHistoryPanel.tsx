
import React, { useState, useMemo } from 'react';
import { ChatSession } from '../types';
import { PlusIcon, TrashIcon, ArchiveIcon, UnarchiveIcon, CloseIcon } from './Icons';
import { formatDistanceToNow } from 'https://esm.sh/date-fns@3.6.0';

interface ChatHistoryPanelProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDelete: (ids: string[]) => void;
    onArchive: (ids: string[], archive: boolean) => void;
    showArchived: boolean;
}

const ChatHistoryItem: React.FC<{
    session: ChatSession;
    isActive: boolean;
    isSelected: boolean;
    onSelect: () => void;
    onToggleSelection: (e: React.MouseEvent) => void;
}> = ({ session, isActive, isSelected, onSelect, onToggleSelection }) => {
    return (
        <li
            onClick={onSelect}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 group ${
                isActive ? 'bg-sky-500/30 dark:bg-sky-800/50' : 'hover:bg-black/10 dark:hover:bg-slate-700/50'
            }`}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    onClick={onToggleSelection}
                    className="form-checkbox h-4 w-4 rounded text-sky-500 focus:ring-sky-500 border-slate-600 bg-slate-900/10 dark:border-slate-600 bg-transparent dark:bg-slate-900 dark:checked:bg-sky-500 transition"
                />
                <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-sm truncate text-slate-200">{session.title}</p>
                    <p className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </div>
        </li>
    );
};


const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
    sessions, activeSessionId, isOpen, setIsOpen, onNewChat, onSelectChat, onDelete, onArchive, showArchived
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const visibleSessions = useMemo(() => {
        return sessions.filter(s => s.isArchived === showArchived);
    }, [sessions, showArchived]);
    
    const handleToggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleAction = (action: 'archive' | 'unarchive' | 'delete') => {
        const ids = Array.from(selectedIds);
        if (action === 'delete') {
            onDelete(ids);
        } else {
            onArchive(ids, action === 'archive');
        }
        setSelectedIds(new Set());
    };

    return (
        <>
            <aside
                className={`absolute md:relative z-20 h-full w-72 md:w-80 flex-shrink-0 bg-slate-800 dark:bg-slate-800/80 text-white dark:backdrop-blur-md border-r border-slate-700 flex flex-col transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-lg font-bold text-slate-100">{showArchived ? 'Archived Chats' : 'Chat History'}</h2>
                    <div className="flex items-center gap-2">
                         <button onClick={onNewChat} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="New Chat">
                            <PlusIcon className="w-5 h-5 text-slate-300" />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors md:hidden" aria-label="Close panel">
                            <CloseIcon className="w-5 h-5 text-slate-300" />
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-2 overflow-y-auto custom-scrollbar">
                    <ul>
                        {visibleSessions.map(session => (
                            <ChatHistoryItem 
                                key={session.id}
                                session={session}
                                isActive={session.id === activeSessionId}
                                isSelected={selectedIds.has(session.id)}
                                onSelect={() => onSelectChat(session.id)}
                                onToggleSelection={(e) => { e.stopPropagation(); handleToggleSelection(session.id); }}
                            />
                        ))}
                    </ul>
                     {visibleSessions.length === 0 && (
                        <div className="text-center py-10 px-4">
                            <p className="text-sm text-slate-400">
                                {showArchived ? "No archived chats." : "No active chats. Start a new one!"}
                            </p>
                        </div>
                    )}
                </div>
                
                {selectedIds.size > 0 && (
                    <div className="p-2 border-t border-slate-700 flex-shrink-0">
                        <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                             <span className="text-sm font-medium text-slate-200">{selectedIds.size} selected</span>
                             <div className="flex items-center gap-2">
                                <button onClick={() => handleAction(showArchived ? 'unarchive' : 'archive')} className="p-2 text-slate-200 hover:bg-white/10 rounded-full" aria-label={showArchived ? 'Unarchive' : 'Archive'}>
                                    {showArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
                                </button>
                                <button onClick={() => handleAction('delete')} className="p-2 hover:bg-red-800/50 rounded-full text-red-400" aria-label="Delete">
                                    <TrashIcon />
                                </button>
                             </div>
                        </div>
                    </div>
                 )}
            </aside>
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/30 z-10 md:hidden animate-fade-in" />}
        </>
    );
};

export default ChatHistoryPanel;
