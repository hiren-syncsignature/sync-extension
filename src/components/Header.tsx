import React from 'react';

interface HeaderProps {
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">SyncSignature</h1>
        <p className="text-xs text-gray-500">Manage your email signatures</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
};

export default Header;