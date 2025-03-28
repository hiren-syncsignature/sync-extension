import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // console.error('Failed to copy text:', err);
    }
  };
  
  return (
    <button
      onClick={handleCopy}
      className={`
        px-2 py-1 text-xs rounded 
        ${copied 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
        transition-colors
      `}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
};

export default CopyButton;