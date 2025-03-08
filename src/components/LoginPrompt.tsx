import React from 'react';

interface LoginPromptProps {
  onRefresh: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onRefresh }) => {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">SyncSignature</h1>
          <p className="text-xs text-gray-500">Manage your email signatures</p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Disconnected
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400 mb-3" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        
        <h2 className="text-lg font-medium text-gray-900 mb-2">Not connected</h2>
        <p className="text-gray-500 mb-4">
          Please log in to your SyncSignature account to manage your signatures.
        </p>
        
        <div className="space-y-3">
          <a 
            href="http://localhost:3000" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
          >
            Log in via localhost:3000
          </a>
          
          <a 
            href="https://app.syncsignature.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
          >
            Log in via app.syncsignature.com
          </a>
          
          <button
            onClick={onRefresh}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
          >
            I've logged in (Refresh)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;