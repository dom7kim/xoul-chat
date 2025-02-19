import { useEffect, useRef, useState } from 'react';
import PlayButton from './PlayButton';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function ChatMessages({ messages, darkMode, largeFont, isTyping }) {
  const messagesEndRef = useRef(null);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setExpandedFeedback({});
  }, [messages]);

  const toggleFeedback = (index) => {
    setExpandedFeedback(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderMessage = (message, index) => {
    if (message.role === 'user') {
      return (
        <div key={index} className={`p-2 rounded-lg ${
          darkMode ? 'bg-blue-900 ml-auto' : 'bg-blue-100 ml-auto'
        } max-w-[90%] shadow`}>
          <p className={`font-bold ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            You:
          </p>
          <p className={`${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } whitespace-pre-wrap`}>
            {message.content}
          </p>
        </div>
      );
    }

    // Parse assistant's response as JSON
    let feedback = '';
    let response = '';
    try {
      const content = JSON.parse(message.content);
      feedback = content.feedback;
      response = content.response;
    } catch (error) {
      // Fallback for non-JSON responses
      response = message.content;
    }

    return (
      <div key={index} className={`p-2 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      } max-w-[90%] shadow`}>
        <div className="flex justify-between items-start mb-2">
          <p className={`font-bold ${
            darkMode ? 'text-green-300' : 'text-green-700'
          }`}>
            Stephanie:
          </p>
          <PlayButton text={response} darkMode={darkMode} />
        </div>
        {feedback && (
          <div className="mb-2">
            <button
              onClick={() => toggleFeedback(index)}
              className={`flex items-center px-2 py-1 rounded-md transition-colors ${
                expandedFeedback[index]
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800')
                  : (darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              {expandedFeedback[index] 
                ? <ChevronUp size={16} className="mr-1" />
                : <ChevronDown size={16} className="mr-1" />
              }
              Feedback
            </button>
            {expandedFeedback[index] && (
              <div className={`mt-2 pl-3 border-l-4 ${
                darkMode ? 'border-blue-500 bg-gray-800' : 'border-blue-500 bg-gray-50'
              } p-2 rounded`}>
                <p className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feedback}
                </p>
              </div>
            )}
          </div>
        )}
        <p className={`${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        } whitespace-pre-wrap`}>
          {response}
        </p>
      </div>
    );
  };

  return (
    <div className={`space-y-2 overflow-y-auto max-h-full px-1 py-2 ${largeFont ? 'text-lg' : 'text-base'}`}>
      {messages.length === 0 ? (
        <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Select a session and question to start,<br />or click the 🎲 for a random question!
        </p>
      ) : (
        messages.map(renderMessage)
      )}
      {isTyping && (
        <div className={`p-2 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        } max-w-[90%] shadow`}>
          <p className={`font-bold ${
            darkMode ? 'text-green-300' : 'text-green-700'
          }`}>
            Stephanie:
          </p>
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}