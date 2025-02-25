import { useEffect, useRef, useState } from 'react';
import PlayButton from './PlayButton';
import { ChevronUp, ChevronDown, Edit2 } from 'lucide-react';

export default function ChatMessages({ messages, darkMode, largeFont, isTyping, onEditMessage }) {
  const messagesEndRef = useRef(null);
  const [expandedFeedback, setExpandedFeedback] = useState({});
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const editInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setExpandedFeedback({});
  }, [messages]);

  useEffect(() => {
    if (editingMessageIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessageIndex]);

  const toggleFeedback = (index) => {
    setExpandedFeedback(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const startEditing = (index, content) => {
    setEditingMessageIndex(index);
    setEditText(content);
  };

  const cancelEditing = () => {
    setEditingMessageIndex(null);
    setEditText('');
  };

  const saveEdit = () => {
    if (editText.trim() && editingMessageIndex !== null) {
      onEditMessage(editingMessageIndex, editText);
      setEditingMessageIndex(null);
      setEditText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const renderMessage = (message, index) => {
    if (message.role === 'user') {
      // If this message is being edited
      if (editingMessageIndex === index) {
        return (
          <div key={index} className={`p-2 rounded-lg ${
            darkMode ? 'bg-blue-900 ml-auto' : 'bg-blue-100 ml-auto'
          } max-w-[90%] shadow`}>
            <p className={`font-bold ${
              darkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              You:
            </p>
            <div className="mt-1">
              <textarea
                ref={editInputRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full px-2 py-1 rounded ${
                  darkMode ? 'bg-blue-800 text-white' : 'bg-white text-gray-800'
                } border ${
                  darkMode ? 'border-blue-700' : 'border-blue-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                rows={Math.max(1, (editText.match(/\n/g) || []).length + 1)}
              />
              <div className="flex justify-end space-x-2 mt-1">
                <button
                  onClick={cancelEditing}
                  className={`px-2 py-1 text-xs rounded ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className={`px-2 py-1 text-xs rounded ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Regular user message (not being edited)
      return (
        <div key={index} className={`p-2 rounded-lg ${
          darkMode ? 'bg-blue-900 ml-auto' : 'bg-blue-100 ml-auto'
        } max-w-[90%] shadow group relative`}>
          <div className="flex justify-between items-start">
            <p className={`font-bold ${
              darkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              You:
            </p>
            <button
              onClick={() => startEditing(index, message.content)}
              className={`p-1 rounded ${
                darkMode ? 'hover:bg-blue-800 text-blue-300' : 'hover:bg-blue-200 text-blue-700'
              }`}
              aria-label="Edit message"
            >
              <Edit2 size={14} />
            </button>
          </div>
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