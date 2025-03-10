

interface HeaderProps {
  isConnected: boolean
}

const Header = ({ isConnected }: HeaderProps) => {
  return (
    <header className="header-container">
      <div className="logo-container">
        <div className="logo">
          <img
            width="24"
            height="24"
            src="32x32.jpg"
          />
        </div>
        <div className="logo-text">
          <h1 className="app-title">SyncSignature</h1>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? "connected" : "disconnected"}`}></span>
            <span className="status-text">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

