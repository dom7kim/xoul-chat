'use client';
import { useState, useEffect } from 'react';
import ChatRoom from './components/ChatRoom';
import { getQuestionData } from '@/lib/questionData';
import SettingsMenu from './components/SettingsMenu';

export default function Home() {
  const [questionData, setQuestionData] = useState(null);
  const [largeFont, setLargeFont] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      const data = await getQuestionData();
      setQuestionData(data);
    }
    loadQuestions();
  }, []);

  const handleToggleFontSize = () => {
    setLargeFont(!largeFont);
  };

  if (!questionData) {
    return <div>Loading...</div>; // Add proper loading state UI if needed
  }

  return (
    <main className="flex flex-col min-h-screen w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center p-2">
        <h1 className="text-lg font-semibold">Xoul Chat</h1>
        <SettingsMenu 
          largeFont={largeFont} 
          onToggleFontSize={handleToggleFontSize} 
        />
      </div>
      <div className="flex-grow">
        <ChatRoom 
          questionData={questionData} 
          largeFont={largeFont}
        />
      </div>
    </main>
  );
}