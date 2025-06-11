"use client";

interface LoginPromptProps {
  onRefresh: () => void;
}

const LoginPrompt = ({ onRefresh }: LoginPromptProps) => {
  const openUrl = (url: string) => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url });
    }
  };
  return (
    <div className="login-prompt-container min-w-[350px] min-h-[500px]">
      <div className="login-prompt-content gap-2">
        <div className="login-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1" />
          </svg>
        </div>
        <h2 className="login-title">Not Connected</h2>
        <p className="login-description">
          Please log in to SyncSignature in your browser first, then click the
          button below to connect.
        </p>
        <div className="login-steps">
          <div className="login-step">
            <div className="step-number">1</div>
            <div className="step-text">Navigate to app.dev.syncsignature.com</div>
          </div>
          <div className="login-step">
            <div className="step-number">2</div>
            <div className="step-text">Log in to your account</div>
          </div>
          <div className="login-step">
            <div className="step-number">3</div>
            <div className="step-text">Return here and click Connect</div>
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-2">
          <button
            className="connect-button "
            onClick={() => openUrl("https://app.dev.syncsignature.com/auth/login")}
          >
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Login</span>
          </button>
          <button
            className="connect-button"
            onClick={() => openUrl("https://app.dev.syncsignature.com/auth/signup")}
          >
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span>Register</span>
          </button>
        </div>

        <button className="connect-button" onClick={onRefresh}>
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
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>
            Connect <span>( I am logged in )</span>{" "}
          </span>
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
