import type { SelectedSignature, Signature, UserObject } from "../types";
import ActionButtons from "./ActionButtons";
import { handleClearData } from "../utils/actions";

interface UserInfoProps {
  user: UserObject;
  setUserObjectState: (user: UserObject | null) => void;
  setSignaturesState: (signatures: Signature[] | null) => void;
  setSelectedSignatureState: (signature: SelectedSignature | null) => void;
  setStatusMessage: (
    message: { text: string; type: "success" | "info" | "error" } | null
  ) => void;
  setError: (error: string | null) => void;
}

const UserInfo = ({
  user,
  setUserObjectState,
  setSignaturesState,
  setSelectedSignatureState,
  setStatusMessage,
  setError
}: UserInfoProps) => {
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(user.name || "User");

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
      </div>
      <div className="pb-4">
        <ActionButtons
          onClear={() => handleClearData(setUserObjectState, setSignaturesState, setSelectedSignatureState, setStatusMessage, setError)}
          type="logout"
        />
      </div>
    </div>
  );
};

export default UserInfo;