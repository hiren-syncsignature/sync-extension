import ActionButtons from "./ActionButtons";
import { getUserObject, setSignatures } from "../utils/storage";
import { fetchSignatures } from "../utils/api";
import { Signature } from "../types";
import { useEffect } from "react";

interface HeaderProps {
  isConnected: boolean;
  setSignaturesState: React.Dispatch<React.SetStateAction<Signature[] | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setStatusMessage: React.Dispatch<
    React.SetStateAction<{
      text: string;
      type: "success" | "info" | "error";
    } | null>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({
  isConnected,
  setSignaturesState,
  setError,
  setStatusMessage,
  setIsLoading,
}: HeaderProps) => {
  useEffect(() => {
    const handleRefreshSignatures_inside = async () => {
      await handleRefreshSignatures();
    };
    handleRefreshSignatures_inside();
  }, []);
  const handleRefreshSignatures = async () => {
    try {
      // console.log("Starting refresh process");
      setIsLoading(true);
      setError(null);

      // Get user object from storage
      // console.log("Fetching user object");
      const userObj = await getUserObject();
      console.log("User object:", userObj);
      const userId = userObj?.id;

      if (!userId) {
        // console.log("No user ID found");
        setError("User not found. Please log in.");
        setIsLoading(false);
        return;
      }

      // console.log("Fetching signatures for user:", userId);

      try {
        // Fetch signatures from API with timeout
        const fetchPromise = fetchSignatures(userId);

        const data = await fetchPromise;
        // console.log("API response:", data);

        if (data && data.html && Array.isArray(data.html)) {
          // console.log("Valid signature data received");

          try {
            // Update signatures in storage - wrap in try/catch
            await setSignatures(data.html);
            // console.log("Signatures saved to storage");

            // Update signatures in state
            setSignaturesState(data.html);
            // console.log("Signature state updated");

            // Show success message
            setStatusMessage({
              text: "Signatures refreshed successfully",
              type: "success",
            });
          } catch (storageError) {
            console.error("Storage error:", storageError);
            setError("Error saving signatures. Please try again.");
          }
        } else {
          // console.log("Invalid API response format");
          if (data) {
            setError(
              "No signature found please add one from app.dev.syncsignature.com"
            );
            return;
          }
          setError("Failed to fetch signatures. Please try again.");
        }
      } catch (fetchError) {
        // console.error("Fetch error:", fetchError);
        if ((fetchError as Error)?.message === "Request timed out") {
          setError("Request timed out. Server might be busy.");
        } else {
          setError("Error connecting to server. Please try again.");
        }
      }
    } catch (err) {
      console.error("Top-level error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      // console.log("Refresh process complete");
      setIsLoading(false);
    }
  };

  return (
    <header className="header-container flex items-center justify-between pl-8 pr-8">
      <div className="logo-container">
        <div className="logo">
          <img
            width="24"
            height="24"
            src="32_32.png"
            alt="SyncSignature Logo"
          />
        </div>
        <div className="logo-text">
          <h1 className="app-title">SyncSignature</h1>
          <div className="connection-status">
            <span
              className={`status-indicator ${
                isConnected ? "connected" : "disconnected"
              }`}
            ></span>
            <span className="status-text">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
      <div className="pb-4">
        <ActionButtons type="refresh" onRefresh={handleRefreshSignatures} />
      </div>
    </header>
  );
};

export default Header;
