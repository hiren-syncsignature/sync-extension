import ActionButtons from "./ActionButtons"

interface HeaderProps {
  isConnected: boolean
}

const Header = ({ isConnected }: HeaderProps) => {
  return (
    <header className="header-container flex items-center justify-between pl-8 pr-8">
      <div className="logo-container">
        <div className="logo">
          <img
            width="24"
            height="24"
            src="32_32.png"
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
      <div className="pb-4 ">
      <ActionButtons type="refresh" />
      </div>
    </header>
  )
}

export default Header

