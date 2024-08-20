'use client';

import { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatRoom({ questionData }) {
  const [messages, setMessages] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
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

  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
    setSelectedQuestion('');
    setMessages([]);
  };

  const handleQuestionChange = (e) => {
    const newQuestion = e.target.value;
    setSelectedQuestion(newQuestion);
    if (newQuestion) {
      setMessages([
        { role: 'assistant', content: `[[Let's get started!]]\n\n- ${newQuestion}` }
      ]);
    } else {
      setMessages([]);
    }
  };

  const handleSendMessage = async (text) => {
    const newUserMessage = { role: 'user', content: text };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, newUserMessage],
          selectedQuestion
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
      } else {
        console.error('Failed to get response:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={`w-full h-[calc(100vh-100px)] flex flex-col ${
      darkMode ? 'bg-gray-800' : 'bg-gray-50'
    } rounded-lg overflow-hidden shadow-lg`}>
      <div className={`p-2 ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="flex justify-between items-center mb-2">
          <select 
            value={selectedSession} 
            onChange={handleSessionChange} 
            className={`w-3/4 p-1 text-sm border rounded shadow-sm focus:ring ${
              darkMode 
                ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-300' 
                : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          >
            <option value="">Select a session</option>
            {Object.keys(questionData).map(session => (
              <option key={session} value={session}>{session}</option>
            ))}
          </select>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-2 py-1 text-sm rounded ${
              darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
            } hover:bg-opacity-80 transition-colors`}
          >
            {darkMode ? 'Light ☀️' : 'Dark 🌙'}
          </button>
        </div>
        {selectedSession && (
          <div className="relative">
            <select 
              value={selectedQuestion} 
              onChange={handleQuestionChange} 
              className={`w-full p-1 text-sm border rounded shadow-sm focus:ring appearance-none ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-300'
                  : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            >
              <option value="">Select a question</option>
              {questionData[selectedSession].questions.map((question, index) => (
                <option key={index} value={question}>{question}</option>
              ))}
            </select>
            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}>
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-hidden">
        <ChatMessages messages={messages} darkMode={darkMode} />
      </div>
      <div className={`p-2 ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      } border-t`}>
        <ChatInput onSendMessage={handleSendMessage} isDisabled={!selectedQuestion} darkMode={darkMode} />
      </div>
      <div className={`text-center py-1 text-xs ${
        darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
      }`}>
        © {new Date().getFullYear()} Dongwon at Xoul. All rights reserved.
      </div>
    </div>
  );
}