'use client';

import { useState } from 'react';

export default function ChatInput({ onSendMessage, isDisabled, darkMode }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`flex-grow px-2 py-1 text-sm border rounded-l-md focus:outline-none focus:ring-2 ${
          darkMode
            ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-300'
            : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        }`}
        placeholder={isDisabled ? "Select a topic to start chatting" : "Type a message..."}
        disabled={isDisabled}
      />
      <button
        type="submit"
        className={`px-3 py-1 text-sm rounded-r-md focus:outline-none focus:ring-2 transition-colors ${
          isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300'
              : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-200'
        }`}
        disabled={isDisabled}
      >
        Send
      </button>
    </form>
  );
}