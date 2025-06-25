/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  getUserObject,
  getSignatures,
  getSignaturesTimestamp,
  getSelectedSignature,
  setUserObject,
  setSelectedSignature,
} from "./utils/storage";
import { fetchSignatures } from "./utils/api";
import { UserObject, Signature, SelectedSignature } from "./types";
import Header from "./components/Header";
import UserInfo from "./components/UserInfo";
import SignatureList from "./components/SignatureList";
import LoginPrompt from "./components/LoginPrompt";
import ErrorAlert from "./components/ErrorAlert";
import Toast from "./components/Toast";
import "./App.css";

function App() {
  const [userObject, setUserObjectState] = useState<UserObject | null>(null);
  const [signatures, setSignaturesState] = useState<Signature[] | null>(null);
  const [selectedSignatureState, setSelectedSignatureState] =
    useState<SelectedSignature | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "info" | "error";
  } | null>(null);

  useEffect(() => {
    // Initial data load
    loadStoredData();
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  async function loadStoredData() {
    try {
      setIsLoading(true);
      setError(null);

      // Load user object
      const storedUser = await getUserObject();
      if (storedUser) {
        setUserObjectState(storedUser);

        // Load signatures
        await loadSignatures(storedUser.id);
      }

      // Load selected signature
      const storedSelectedSignature = await getSelectedSignature();
      if (storedSelectedSignature) {
        setSelectedSignatureState(storedSelectedSignature);
      }
    } catch (err) {
      setError(
        (err as Error).message || "An error occurred while loading data"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSignatures(userId: string) {
    // Check if we have cached signatures first
    const storedSignatures = await getSignatures();
    const timestamp = await getSignaturesTimestamp();
    const currentTime = Date.now();
    const isDataFresh = timestamp && currentTime - timestamp < 30 * 60 * 1000; // 30 minutes

    if (storedSignatures && storedSignatures.length > 0 && isDataFresh) {
      console.log(
        "Using signatures from storage, last updated:",
        new Date(timestamp)
      );
      setSignaturesState(storedSignatures);
      return;
    }

    // If no fresh signatures in storage, fetch them
    try {
      const data = await fetchSignatures(userId);

      if (data && data.html && Array.isArray(data.html)) {
        setSignaturesState(data.html);
      }
    } catch (err) {
      setError("Looks like server is busy please try again");
      // console.error("Error fetching signatures:", err);
      // // Still use cached signatures if available, even if outdated
      // if (storedSignatures && storedSignatures.length > 0) {
      //   setSignaturesState(storedSignatures);
      // }
    }
  }

  async function handleHardRefresh() {
    try {
      setIsLoading(true);
      setError(null);

      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const activeTab = tabs[0];

      if (
        activeTab.url?.includes("app.syncsignature.com")
      ) {
        chrome.tabs.sendMessage(
          activeTab.id!,
          { action: "getLocalStorageItem", key: "USER" },
          async (response) => {
            if (response && response.value) {
              try {
                const user = JSON.parse(response.value) as UserObject;

                // Save to storage and update state
                await setUserObject(user);
                setUserObjectState(user);

                // Get fresh signatures
                if (user.id) {
                  await loadSignatures(user.id);
                }

                setIsLoading(false);
                setStatusMessage({
                  text: "Data refreshed successfully",
                  type: "success",
                });
              } catch (e) {
                setError("Failed to parse user data");
                setIsLoading(false);
              }
            } else {
              setError("No user data found on page");
              setIsLoading(false);
            }
          }
        );
      } else {
        setError("Please navigate to app.syncsignature.com first");
        setIsLoading(false);
      }
    } catch (err) {
      setError((err as Error).message || "Failed to refresh data");
      setIsLoading(false);
    }
  }

  async function handleSelectSignature(signature: Signature, index: number) {
    try {
      const newSelectedSignature: SelectedSignature = {
        index,
        content: signature.html,
        timestamp: Date.now(),
      };

      await setSelectedSignature(newSelectedSignature);
      setSelectedSignatureState(newSelectedSignature);

      setStatusMessage({
        text: "Signature selected! It will be used in Gmail.",
        type: "success",
      });
    } catch (err) {
      setError((err as Error).message || "Failed to select signature");
    }
  }

  if (!isLoading && !userObject) {
    return <LoginPrompt onRefresh={handleHardRefresh} />;
  }

  return (
    <div className="glass-container min-h-[500px] min-w-[400px] w-[600px] mx-auto overflow-hidden animate-fade-in ">
      <Header
        isConnected={!!userObject}
        setSignaturesState={setSignaturesState}
        setError={setError}
        setStatusMessage={setStatusMessage}
        setIsLoading={setIsLoading}
      />
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {statusMessage && (
        <Toast message={statusMessage.text} type={statusMessage.type} />
      )}

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="loader"></div>
          <p className="mt-4 text-primary-600 animate-pulse-slow">
            Loading your signatures...
          </p>
        </div>
      ) : (
        <div className="content-container p-4">
          {userObject && (
            <UserInfo
              user={userObject}
              setUserObjectState={setUserObjectState}
              setSignaturesState={setSignaturesState}
              setSelectedSignatureState={setSelectedSignatureState}
              setStatusMessage={setStatusMessage}
              setError={setError}
            />
          )}

          {signatures && signatures.length > 0 ? (
            <SignatureList
              signatures={signatures}
              selectedSignature={selectedSignatureState}
              onSelectSignature={handleSelectSignature}
              setStatusMessage={setStatusMessage}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                  <path d="M10 9H8"></path>
                </svg>
              </div>
              <p className="empty-state-text">No signatures found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
