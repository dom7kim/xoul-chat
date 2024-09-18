import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ onClick, darkMode }) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-md focus:outline-none focus:ring-2 ${
        darkMode
          ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400'
      }`}
      aria-label="Copy conversation"
    >
      {copied ? (
        <Check className="w-5 h-5" />
      ) : (
        <Copy className="w-5 h-5" />
      )}
    </button>
  );
}