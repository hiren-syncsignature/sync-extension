import React from 'react';

interface ActionButtonsProps {
  onRefresh: () => void;
  onClear: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onRefresh, onClear }) => {
  return (
    <div className="flex space-x-2 mt-4">
      <button
        onClick={onRefresh}
        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition-colors"
      >
        Refresh
      </button>
      <button
        onClick={onClear}
        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
      >
        Clear Data
      </button>
    </div>
  );
};

export default ActionButtons;