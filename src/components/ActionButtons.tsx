import React from "react";

interface ActionButtonsProps {
  onRefresh?: () => void;
  onClear?: () => void;
  type: "refresh" | "logout";
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRefresh,
  onClear,
  type,
}) => {
  return (
    <div className="action-buttons ">
      <button
        className="action-button refresh-button rounded-full p-2"
        onClick={type === "refresh" ? onRefresh : onClear}
      >
        {type === "refresh" ? (
          <>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>{" "}
          </>
        )}
      </button>
      {/* <button 
        className="action-button clear-button"
        onClick={onClear}
      >
        <span>Clear Data</span>
      </button> */}
    </div>
  );
};

export default ActionButtons;
