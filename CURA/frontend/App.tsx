

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { type Message, MessageSender, type ChatSession, type Theme, type User } from './types';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import ChatHistoryPanel from './components/ChatHistoryPanel';
import Modal from './components/Modal';
import Settings from './components/Settings';
import { Auth } from './components/Auth';
import EmptyState from './components/EmptyState';
import { initializeChat, sendMessageToBot } from '../backend/geminiService';
import type { Chat } from '@google/genai';
import { v4 as uuidv4 } from 'https://esm.sh/uuid';
import PromptSuggestions from './components/PromptSuggestions';

const GREETING = "Hello! I'm CURA, your AI Healthcare Assistant. How can I help you today?";
const DISCLAIMER = "Please remember, I'm an AI assistant, and while I can offer general information and insights, it's always best to consult with a doctor or other healthcare professional for personalized medical advice, diagnosis, or treatment, especially if you're not feeling well. They can provide the most accurate guidance based on your specific situation.";

const initialBotMessage = {
  id: 'initial-message',
  text: `${GREETING}\n\n${DISCLAIMER}`,
  sender: MessageSender.BOT,
};

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Could not save to local storage", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('cura-theme', 'light');
  const [users, setUsers] = useLocalStorage<User[]>('cura-users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('cura-current-user', null);
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('cura-chat-sessions-all', []);
  const [activeSessionId, setActiveSessionId] = useLocalStorage<string | null>('cura-active-session', null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [modal, setModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  const chatInstances = useRef(new Map<string, Chat>());

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const userSessions = useMemo(() => {
    if (!currentUser) return [];
    return sessions
        .filter(s => s.userId === currentUser.username)
        .sort((a, b) => b.createdAt - a.createdAt);
  }, [sessions, currentUser]);

  const activeSession = userSessions.find(s => s.id === activeSessionId) || null;
  const isNewChat = useMemo(() => activeSession && activeSession.messages.length <= 1, [activeSession]);

  const getActiveChatInstance = useCallback(() => {
    if (!activeSession) return null;
    if (!chatInstances.current.has(activeSession.id)) {
      const newChatInstance = initializeChat(activeSession.messages);
      chatInstances.current.set(activeSession.id, newChatInstance);
    }
    return chatInstances.current.get(activeSession.id) || null;
  }, [activeSession]);
  
  const handleNewChat = useCallback(() => {
    if (!currentUser) return;
    
    const newSession: ChatSession = {
      id: uuidv4(),
      userId: currentUser.username,
      title: 'New Chat',
      messages: [initialBotMessage],
      createdAt: Date.now(),
      isArchived: false,
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsHistoryPanelOpen(false);

  }, [currentUser, setSessions, setActiveSessionId]);

  useEffect(() => {
    if (currentUser && userSessions.length > 0 && (!activeSessionId || !userSessions.find(s => s.id === activeSessionId))) {
        const firstAvailable = userSessions.find(s => !s.isArchived);
        setActiveSessionId(firstAvailable ? firstAvailable.id : null);
    }
  }, [userSessions, activeSessionId, setActiveSessionId, currentUser]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (text.trim() === '' || isLoading || !activeSessionId) return;

    const chatInstance = getActiveChatInstance();
    if (!chatInstance) return;

    const userMessage: Message = { id: uuidv4(), text: text.trim(), sender: MessageSender.USER };

    // Update UI immediately with user's message and the new title if applicable.
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === activeSessionId) {
          const isFirstUserMessage = !session.messages.some(m => m.sender === MessageSender.USER);
          const newTitle = isFirstUserMessage
            ? userMessage.text.substring(0, 50) + (userMessage.text.length > 50 ? '...' : '')
            : session.title;
          
          return {
            ...session,
            title: newTitle,
            messages: [...session.messages, userMessage],
          };
        }
        return session;
      })
    );
    setIsLoading(true);

    try {
      const botResponseText = await sendMessageToBot(chatInstance, userMessage.text);
      const botMessage: Message = { id: uuidv4(), text: botResponseText, sender: MessageSender.BOT };
      
      // Append bot's response to the conversation.
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === activeSessionId
            ? { ...session, messages: [...session.messages, botMessage] }
            : session
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: 'error-message',
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: MessageSender.BOT,
      };
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === activeSessionId
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, activeSessionId, getActiveChatInstance, setSessions]);

  const handleDeleteSessions = (ids: string[]) => {
    setModal({
      title: `Delete ${ids.length} Chat(s)?`,
      message: 'This action cannot be undone. Are you sure you want to proceed?',
      onConfirm: () => {
        setSessions(prev => prev.filter(s => !ids.includes(s.id)));
        ids.forEach(id => chatInstances.current.delete(id));
        if (ids.includes(activeSessionId || '')) {
          setActiveSessionId(null);
        }
        setModal(null);
      }
    });
  };
  
  const handleArchiveSessions = (ids: string[], archive = true) => {
    setSessions(prev => prev.map(s => ids.includes(s.id) ? { ...s, isArchived: archive } : s));
    if (archive && ids.includes(activeSessionId || '')) {
        setActiveSessionId(null);
    }
    if (!archive) {
      setShowArchived(false);
    }
  };

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleRegister = (user: User) => {
      setUsers(prev => [...prev, user]);
      setCurrentUser(user);
  };
  const handleLogout = () => {
      setCurrentUser(null);
      setActiveSessionId(null);
      setIsSettingsOpen(false);
  };
  const handleDeleteAccount = () => {
    if (!currentUser) return;
    setModal({
        title: "Delete Account?",
        message: "This will permanently delete your account and all your chat data. This action cannot be undone.",
        onConfirm: () => {
            setSessions(prev => prev.filter(s => s.userId !== currentUser.username));
            setUsers(prev => prev.filter(u => u.username !== currentUser.username));
            handleLogout();
            setModal(null);
        }
    });
  };
   const handleDeleteAllChats = () => {
    if (!currentUser) return;
    setModal({
        title: "Delete All Chats?",
        message: "This will permanently delete all your active and archived chats. This action cannot be undone.",
        onConfirm: () => {
            setSessions(prev => prev.filter(s => s.userId !== currentUser.username));
            setActiveSessionId(null);
            setModal(null);
            setIsSettingsOpen(false);
        }
    });
  };

  if (!currentUser) {
    return (
        <div className={`w-full h-screen font-sans bg-gradient-to-br from-cyan-200 via-sky-300 to-indigo-400 dark:from-blue-900 dark:via-black dark:to-teal-900`}>
            <Auth users={users} onLogin={handleLogin} onRegister={handleRegister} />
        </div>
    );
  }

  return (
    <div className={`w-full h-screen font-sans bg-gradient-to-br from-cyan-200 via-sky-300 to-indigo-400 dark:bg-gradient-to-br dark:from-blue-900 dark:via-black dark:to-teal-900 text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
        {userSessions.length === 0 ? (
            <EmptyState onNewChat={handleNewChat} />
        ) : (
            <div className="flex h-full">
                <ChatHistoryPanel 
                    sessions={userSessions}
                    activeSessionId={activeSessionId}
                    isOpen={isHistoryPanelOpen}
                    setIsOpen={setIsHistoryPanelOpen}
                    onNewChat={handleNewChat}
                    onSelectChat={(id) => { setActiveSessionId(id); setIsHistoryPanelOpen(false); }}
                    onDelete={handleDeleteSessions}
                    onArchive={handleArchiveSessions}
                    showArchived={showArchived}
                />
                <div className="flex-1 flex flex-col h-full transition-all duration-300">
                    <main className="w-full h-full flex flex-col bg-white/50 dark:bg-black/20 backdrop-blur-xl shadow-lg shadow-slate-400/10 dark:shadow-black/30">
                        <Header 
                            sessionTitle={activeSession?.title || 'CURA'}
                            onToggleHistory={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)}
                            onToggleSettings={() => setIsSettingsOpen(true)}
                        />
                        <ChatWindow 
                            session={activeSession} 
                            isLoading={isLoading} 
                            isNewChat={isNewChat}
                        />
                        {isNewChat && !isLoading && <PromptSuggestions onPromptClick={handleSendMessage} />}
                        <InputBar 
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            disabled={!activeSession}
                        />
                    </main>
                </div>
            </div>
        )}
        {modal && 
            <Modal 
                title={modal.title} 
                message={modal.message} 
                onConfirm={modal.onConfirm} 
                onCancel={() => setModal(null)} 
            />
        }
        {isSettingsOpen && 
            <Settings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
                onDeleteAllChats={handleDeleteAllChats}
                showArchived={showArchived}
                setShowArchived={setShowArchived}
                theme={theme}
                setTheme={setTheme}
            />
        }
    </div>
  );
};

export default App;
