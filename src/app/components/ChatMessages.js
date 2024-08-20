'use client';

import { useEffect, useRef } from 'react';

export default function ChatMessages({ messages, darkMode }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="space-y-2 overflow-y-auto max-h-full px-1 py-2">
      {messages.length === 0 ? (
        <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No messages yet. Start a conversation!
        </p>
      ) : (
        messages.map((message, index) => (
          <div key={index} className={`p-2 rounded-lg text-sm ${
            message.role === 'user' 
              ? darkMode ? 'bg-blue-900 ml-auto' : 'bg-blue-100 ml-auto'
              : darkMode ? 'bg-gray-700' : 'bg-gray-100'
          } max-w-[90%] shadow`}>
            <p className={`font-bold ${
              message.role === 'user'
                ? darkMode ? 'text-blue-300' : 'text-blue-700'
                : darkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              {message.role === 'user' ? 'You' : 'Stephanie'}:
            </p>
            <p className={`mt-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } whitespace-pre-wrap`}>
              {message.content}
            </p>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}