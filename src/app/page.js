'use client';
import { useState, useEffect } from 'react';
import ChatRoom from './components/ChatRoom';
import { getQuestionData } from '@/lib/questionData';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const [questionData, setQuestionData] = useState({});
  const [largeFont, setLargeFont] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      const data = await getQuestionData();
      setQuestionData(data);
    }
    loadQuestions();

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkMode', darkMode);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode, mounted]);

  const handleToggleFontSize = () => {
    setLargeFont(!largeFont);
  };

  return (
    <main className="flex flex-col min-h-screen w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center p-2">
        <h1 className="text-lg font-semibold">Xoul Chat</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex-grow">
        <ChatRoom 
          questionData={questionData} 
          largeFont={largeFont}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onToggleFontSize={handleToggleFontSize}
        />
      </div>
    </main>
  );
}