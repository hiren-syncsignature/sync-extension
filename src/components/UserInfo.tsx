import type { UserObject } from "../types"

interface UserInfoProps {
  user: UserObject
}

const UserInfo = ({ user }: UserInfoProps) => {
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const formatLastUpdated = (isoDateString: string) => {
    const date = new Date(isoDateString);
    
    // Format options
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    } as Intl.DateTimeFormatOptions;
    
    // Convert to readable string
    return `Last updated: ${date.toLocaleDateString('en-US', options)}`;
  };


  const initials = getInitials(user.name || "User")

  return (
    <div className="user-info-card">
      <div className="user-avatar">
        {user.avatar ? (
          <img src={user.avatar || "/placeholder.svg"} alt={user.name || "User"} className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">{initials}</div>
        )}
      </div>
      <div className="user-details">
        <h2 className="user-name">{user.name || "Unknown User"}</h2>
        <p className="user-email">{user.email || "No email available"}</p>
        <div className="user-meta">
          <span className="user-id">{formatLastUpdated(user.workspaces[0].updatedAt)}...</span>
          {/* <span className="user-plan">
            <span className={`plan-badge ${user.plan === "premium" ? "premium" : "free"}`}>
              {user.plan === "premium" ? "Premium" : "Free"}
            </span>
          </span> */}
        </div>
      </div>
    </div>
  )
}

export default UserInfo

