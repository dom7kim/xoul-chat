'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatRoom({ questionData }) {
  const [messages, setMessages] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const adjustChatContainerHeight = () => {
      if (chatContainerRef.current) {
        const viewportHeight = window.innerHeight;
        const chatTop = chatContainerRef.current.offsetTop;
        const newHeight = viewportHeight - chatTop - 10; // 10px buffer
        chatContainerRef.current.style.height = `${newHeight}px`;
      }
    };

    adjustChatContainerHeight();
    window.addEventListener('resize', adjustChatContainerHeight);

    return () => window.removeEventListener('resize', adjustChatContainerHeight);
  }, []);

  useEffect(() => {
    const adjustChatContainerHeight = () => {
      if (chatContainerRef.current) {
        const viewportHeight = window.innerHeight;
        const chatTop = chatContainerRef.current.offsetTop;
        const newHeight = viewportHeight - chatTop - 10; // 10px buffer
        chatContainerRef.current.style.height = `${newHeight}px`;
      }
    };

    adjustChatContainerHeight();
    window.addEventListener('resize', adjustChatContainerHeight);

    return () => window.removeEventListener('resize', adjustChatContainerHeight);
  }, []);

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

  const selectRandomTopic = () => {
    const sessions = Object.keys(questionData);
    const randomSession = sessions[Math.floor(Math.random() * sessions.length)];
    setSelectedSession(randomSession);

    const questions = questionData[randomSession].questions;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setSelectedQuestion(randomQuestion);

    // Clear previous messages when a new topic is selected
    setMessages([]);

    // Optionally, you can add an initial AI message here
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages([{ 
        role: 'assistant', 
        content: `[[Let's get started!]]\n\n- ${randomQuestion}` 
      }]);
    }, 500 + Math.random() * 500); // Random delay between 0.5-1 seconds
  };

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
    setIsTyping(true);

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
        // Simulate a delay before showing the AI's response
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
        }, 300 + Math.random() * 200); // Random delay between 300-500 milliseconds. 1000 + Math.random() * 1000 for random delay between 1-2 seconds.
      } else {
        console.error('Failed to get response:', data.error);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const toggleFontSize = () => {
    setLargeFont(!largeFont);
  };

  return (
    <div className={`w-full flex flex-col ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
    } rounded-lg overflow-hidden shadow-lg ${largeFont ? 'text-lg' : 'text-base'}`}>
      <div className={`px-1 py-2 ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="flex justify-between items-center mb-2">
          <select 
            value={selectedSession} 
            onChange={handleSessionChange} 
            className={`w-3/5 p-1 text-sm border rounded shadow-sm focus:ring ${
              darkMode 
                ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-300' 
                : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            } ${largeFont ? 'text-base' : 'text-sm'}`}
          >
            <option value="">Select a session</option>
            {Object.keys(questionData).map(session => (
              <option key={session} value={session}>{session}</option>
            ))}
          </select>
          <div className="flex items-center space-x-1">
            <button
              onClick={selectRandomTopic}
              className={`px-2 py-1 text-sm rounded ${
                darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
              } hover:bg-opacity-80 transition-colors`}
              aria-label="Select random topic"
            >
              🎲
            </button>
            <button
              onClick={toggleFontSize}
              className={`px-2 py-1 text-sm rounded ${
                darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
              } hover:bg-opacity-80 transition-colors`}
              aria-label={largeFont ? "Decrease font size" : "Increase font size"}
            >
              {largeFont ? 'A-' : 'A+'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-2 py-1 text-sm rounded ${
                darkMode ? 'bg-gray-600 text-white' : 'bg-gray-500 text-gray-800'
              } hover:bg-opacity-80 transition-colors`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        {selectedSession && (
          <div className="relative">
            <select 
              value={selectedQuestion} 
              onChange={handleQuestionChange} 
              className={`w-full p-1 border rounded shadow-sm focus:ring appearance-none ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-300'
                  : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              } ${largeFont ? 'text-base' : 'text-sm'}`}
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
      <div ref={chatContainerRef} className="flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          <ChatMessages messages={messages} darkMode={darkMode} largeFont={largeFont} isTyping={isTyping} />
        </div>
        <div className={`px-1 py-2 ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
        } border-t`}>
          <ChatInput onSendMessage={handleSendMessage} isDisabled={!selectedQuestion || isTyping} darkMode={darkMode} largeFont={largeFont} />
        </div>
      </div>
      <div className={`text-center py-1 ${largeFont ? 'text-sm' : 'text-xs'} ${
        darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
      }`}>
        © {new Date().getFullYear()} Dongwon at Xoul. All rights reserved.
      </div>
    </div>
  );
}