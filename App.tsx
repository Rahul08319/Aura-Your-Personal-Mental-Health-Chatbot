import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import BreathingModal from './components/BreathingModal';
import SettingsModal from './components/SettingsModal';
import { Message, Sender, Mood, MoodEntry } from './types';
import { sendMessageStream } from './services/geminiService';

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hello, I'm Aura 🌿. I'm here to provide a calm, safe, and supportive space for your thoughts. \n\nHow are you feeling in this moment? You can talk through what's on your mind, explore a breathing exercise, or check in with your mood.",
  sender: Sender.Bot,
  timestamp: new Date(),
};

const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('aura_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Messages state
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_messages');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((m: any) => ({
            ...m,
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
          }));
        } catch {
          // ignore corrupted data
        }
      }
    }
    return [INITIAL_MESSAGE];
  });

  // Moods state
  const [moods, setMoods] = useState<MoodEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_moods');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
        } catch {
          // fallback
        }
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aura_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aura_theme', 'light');
    }
  }, [darkMode]);

  // Save messages in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Save moods in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_moods', JSON.stringify(moods));
    } catch {
      // ignore
    }
  }, [moods]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogMood = (mood: Mood) => {
    const newMoodEntry: MoodEntry = { mood, timestamp: new Date() };
    setMoods((prevMoods) => [newMoodEntry, ...prevMoods].slice(0, 10)); // Keep last 10
    const moodMessage: Message = {
      id: Date.now().toString(),
      text: `Thank you for checking in. I've noted that you're feeling ${mood.toLowerCase()}. Taking note of how you feel is an important step in self-compassion. Would you like to share what contributed to this feeling?`,
      sender: Sender.Bot,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, moodMessage]);
  };

  const handleJournalPrompt = (prompt: string) => {
    const promptMessage: Message = {
      id: Date.now().toString(),
      text: `Here is a mindful reflection prompt for you:\n\n"${prompt}"\n\nTake your time. What thoughts or memories come to mind?`,
      sender: Sender.Bot,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, promptMessage]);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: Sender.User,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const botMessagePlaceholder: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: Sender.Bot,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessagePlaceholder]);

    try {
      const stream = sendMessageStream(text);
      let botResponse = '';
      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessagePlaceholder.id ? { ...msg, text: botResponse } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a brief moment of connection difficulty. Please take a gentle breath and try again shortly.",
        sender: Sender.Bot,
        timestamp: new Date(),
      };
      setMessages((prev) => prev.filter((msg) => msg.id !== botMessagePlaceholder.id));
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem('aura_messages');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar: Desktop + Mobile Drawer */}
      <Sidebar
        moods={moods}
        onLogMood={handleLogMood}
        onPromptRequest={handleJournalPrompt}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative">
        {/* Apple Frosted Header */}
        <Header
          onOpenBreathing={() => setIsBreathingOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Chat Message Scroll Window */}
        <main className="flex-1 overflow-y-auto relative">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSelectPrompt={handleSendMessage}
            onOpenBreathing={() => setIsBreathingOpen(true)}
          />
        </main>

        {/* Floating Capsule Input Footer */}
        <footer className="flex-shrink-0 p-3 sm:p-4 z-20">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onQuickAction={handleSendMessage}
          />
        </footer>
      </div>

      {/* Interactive Apple Breathe Modal */}
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      {/* Apple Settings & Gemini API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default App;