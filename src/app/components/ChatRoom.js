'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import CopyButton from './CopyButton';

export default function ChatRoom({ 
  questionData, 
  largeFont, 
  darkMode, 
  setDarkMode,
  onToggleFontSize 
}) {
  const [messages, setMessages] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
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

  const selectRandomTopic = () => {
    const sessions = Object.keys(questionData);
    const randomSession = sessions[Math.floor(Math.random() * sessions.length)];
    setSelectedSession(randomSession);

    const questions = questionData[randomSession].questions;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setSelectedQuestion(randomQuestion);

    // Clear previous messages and set initial message in JSON format
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const initialMessage = {
        role: 'assistant',
        content: JSON.stringify({
          feedback: "Let's get started!",
          response: `${randomQuestion}`
        })
      };
      setMessages([initialMessage]);
    }, 500 + Math.random() * 500);
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
      // Create initial message in JSON format
      const initialMessage = {
        role: 'assistant',
        content: JSON.stringify({
          feedback: "Let's get started!",
          response: `${newQuestion}`
        })
      };
      setMessages([initialMessage]);
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
          selectedQuestion,
          context: selectedSession ? questionData[selectedSession].context : ''
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

  const handleStartOver = () => {
    if (selectedQuestion) {
      // Immediately clear all messages and set typing to true
      setMessages([]);
      setIsTyping(true);

      // Add the initial message in JSON format and set typing to false after a delay
      setTimeout(() => {
        const initialMessage = {
          role: 'assistant',
          content: JSON.stringify({
            feedback: "Let's start over!",
            response: `${selectedQuestion}`
          })
        };
        setMessages([initialMessage]);
        setIsTyping(false);
      }, 500);
    }
  };

  const copyConversation = () => {
    const topicTitle = selectedSession;
    const currentQuestion = selectedQuestion;
    let conversationText = '';

    // Add header with emojis
    conversationText += `✨ ${topicTitle} ✨\n\n`;
    conversationText += `💬 Question: ${currentQuestion}\n\n`;
    conversationText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    let interactionCount = 0;
    
    messages.forEach((msg, index) => {
      // Start a new interaction when we encounter a user message (except the first one)
      if (msg.role === 'user' && interactionCount > 0) {
        conversationText += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n`;
      }
      
      if (msg.role === 'user') {
        conversationText += `👤 You: ${msg.content.trim()}\n\n`;
        interactionCount++;
      } else if (msg.role === 'assistant') {
        try {
          const content = JSON.parse(msg.content);
          const feedback = content.feedback;
          const response = content.response;

          // Skip the first assistant message if it's just repeating the question
          if (index === 0 && response.includes(currentQuestion)) {
            interactionCount = 0; // Reset counter since we're skipping this
            return;
          }

          if (index > 0 && messages[index - 1].role === 'user' && feedback) {
            conversationText += `🔍 Feedback: ${feedback}\n\n`;
          }

          conversationText += `👩‍🏫 Stephanie: ${response}\n\n`;
        } catch (error) {
          // Fallback for non-JSON responses
          conversationText += `👩‍🏫 Stephanie: ${msg.content.trim()}\n\n`;
        }
      }
    });

    conversationText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    conversationText += `📅 ${new Date().toLocaleString()}\n`;

    navigator.clipboard.writeText(conversationText)
      .then(() => console.log('Conversation copied to clipboard in text format'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleEditMessage = (index, newContent) => {
    // Create a new array with only messages up to the edited message
    const editedMessage = { role: 'user', content: newContent };
    const newMessages = [...messages.slice(0, index), editedMessage];
    
    setMessages(newMessages);
    
    // If this is the only message (after the initial assistant message),
    // we don't need to send a request
    if (newMessages.length <= 1) {
      return;
    }
    
    // Send the edited message to get a new response
    setIsTyping(true);
    
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        messages: newMessages,
        selectedQuestion,
        context: selectedSession ? questionData[selectedSession].context : ''
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.response) {
          setTimeout(() => {
            setIsTyping(false);
            setMessages([...newMessages, { role: 'assistant', content: data.response }]);
          }, 300 + Math.random() * 200);
        } else {
          console.error('Failed to get response:', data.error);
          setIsTyping(false);
        }
      })
      .catch(error => {
        console.error('Error sending message:', error);
        setIsTyping(false);
      });
  };

  return (
    <div className={`w-full flex flex-col ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
    } rounded-lg overflow-hidden shadow-lg`}>
      <div className={`px-1 py-2 ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <select 
                value={selectedSession} 
                onChange={handleSessionChange} 
                className={`w-full p-1 pr-8 text-sm border rounded shadow-sm focus:ring appearance-none ${
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
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
                onClick={() => onToggleFontSize()}
                className={`px-2 py-1 text-sm rounded w-8 ${
                  darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
                } hover:bg-opacity-80 transition-colors`}
                aria-label={largeFont ? "Decrease font size" : "Increase font size"}
              >
                {largeFont ? 'A-' : 'A+'}
              </button>
            </div>
          </div>

          {selectedSession && (
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <select 
                  value={selectedQuestion} 
                  onChange={handleQuestionChange} 
                  className={`w-full p-1 pr-8 text-sm border rounded shadow-sm focus:ring appearance-none ${
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleStartOver}
                  className={`px-2 py-1 text-sm rounded ${
                    darkMode 
                      ? 'bg-gray-600 text-white hover:bg-gray-500' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-colors`}
                  aria-label="Start over"
                >
                  🔄
                </button>
                <CopyButton 
                  onClick={copyConversation} 
                  darkMode={darkMode}
                  className={`px-2 py-1 text-sm rounded ${
                    darkMode 
                      ? 'bg-gray-600 text-white hover:bg-gray-500' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-colors`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div ref={chatContainerRef} className="flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          <ChatMessages 
            messages={messages} 
            darkMode={darkMode} 
            largeFont={largeFont} 
            isTyping={isTyping} 
            onEditMessage={handleEditMessage}
          />
        </div>
        <div className={`px-1 py-2 ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
        } border-t`}>
          <ChatInput onSendMessage={handleSendMessage} isDisabled={!selectedQuestion || isTyping} darkMode={darkMode} largeFont={largeFont} />
        </div>
      </div>
      <div className="text-center py-1 text-xs ${
        darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
      }">
        © {new Date().getFullYear()} Dongwon at Xoul. All rights reserved.
      </div>
    </div>
  );
}