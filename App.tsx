import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import { Message, Sender, Mood, MoodEntry } from './types';
import { sendMessageStream } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Aura, your personal mental health companion. How are you feeling today? Feel free to share what's on your mind, or log your mood to get started.",
      sender: Sender.Bot,
    },
  ]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogMood = (mood: Mood) => {
    const newMoodEntry: MoodEntry = { mood, timestamp: new Date() };
    setMoods(prevMoods => [newMoodEntry, ...prevMoods].slice(0, 5)); // Keep last 5 entries
    const moodMessage: Message = {
        id: Date.now().toString(),
        text: `I've logged that you're feeling ${mood.toLowerCase()}. Thanks for sharing. Is there anything you'd like to talk about regarding this feeling?`,
        sender: Sender.Bot
    }
    setMessages(prev => [...prev, moodMessage]);
  };

  const handleJournalPrompt = (prompt: string) => {
    const promptMessage: Message = {
      id: Date.now().toString(),
      text: `Here's a journaling prompt for you to reflect on:\n\n"${prompt}"`,
      sender: Sender.Bot
    };
    setMessages(prev => [...prev, promptMessage]);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: Sender.User,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const botMessagePlaceholder: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        sender: Sender.Bot,
    };
    setMessages((prev) => [...prev, botMessagePlaceholder]);

    try {
        const stream = await sendMessageStream(text);
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
            text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
            sender: Sender.Bot,
        };
        setMessages((prev) => prev.filter(msg => msg.id !== botMessagePlaceholder.id));
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex h-screen w-full font-sans antialiased text-slate-800 dark:text-slate-200">
      <Sidebar moods={moods} onLogMood={handleLogMood} onPromptRequest={handleJournalPrompt} />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-800/50">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </main>
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;