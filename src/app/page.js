'use client';
import { useState, useEffect } from 'react';
import ChatRoom from './components/ChatRoom';
import { getQuestionData } from '@/lib/questionData';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const [questionData, setQuestionData] = useState(null);
  const [largeFont, setLargeFont] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      const data = await getQuestionData();
      setQuestionData(data);
    }
    loadQuestions();

    const savedMode = localStorage.getItem('darkMode');
    setDarkMode(savedMode === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleFontSize = () => {
    setLargeFont(!largeFont);
  };

  if (!questionData) {
    return <div>Loading...</div>;
  }

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