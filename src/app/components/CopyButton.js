import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ onClick, darkMode, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`focus:outline-none focus:ring-2 ${className}`}
      aria-label="Copy conversation"
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}