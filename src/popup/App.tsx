import { useState, useEffect } from 'react';
import { getUserObject, getSignatures, getSignaturesTimestamp, getSelectedSignature, setUserObject, setSelectedSignature } from '../utils/storage';
import { fetchSignatures } from '../utils/api';
import { UserObject, Signature, SelectedSignature } from '../types';
import Header from '../components/Header';
import UserInfo from '../components/UserInfo';
import SignatureList from '../components/SignatureList';
import ActionButtons from '../components/ActionButtons';
import LoginPrompt from '../components/LoginPrompt';
import ErrorAlert from '../components/ErrorAlert';

function App() {
  const [userObject, setUserObjectState] = useState<UserObject | null>(null);
  const [signatures, setSignaturesState] = useState<Signature[] | null>(null);
  const [selectedSignatureState, setSelectedSignatureState] = useState<SelectedSignature | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{text: string, type: 'success' | 'info' | 'error'} | null>(null);

  useEffect(() => {
    // Initial data load
    loadStoredData();
  }, []);

  // Clear status message after 3 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
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
      setError((err as Error).message || 'An error occurred while loading data');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSignatures(userId: string) {
    // Check if we have cached signatures first
    const storedSignatures = await getSignatures();
    const timestamp = await getSignaturesTimestamp();
    const currentTime = Date.now();
    const isDataFresh = timestamp && (currentTime - timestamp) < (30 * 60 * 1000); // 30 minutes
    
    if (storedSignatures && storedSignatures.length > 0 && isDataFresh) {
      console.log('Using signatures from storage, last updated:', new Date(timestamp));
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
      console.error('Error fetching signatures:', err);
      // Still use cached signatures if available, even if outdated
      if (storedSignatures && storedSignatures.length > 0) {
        setSignaturesState(storedSignatures);
      }
    }
  }

  async function handleRefresh() {
    try {
      setIsLoading(true);
      setError(null);
      
      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      const activeTab = tabs[0];
      
      // Check if we're on a compatible page
      if (activeTab.url?.includes('localhost:3000') || activeTab.url?.includes('app.syncsignature.com')) {
        // Get token from content script
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
                  text: 'Data refreshed successfully',
                  type: 'success'
                });
              } catch (e) {
                setError('Failed to parse user data');
                setIsLoading(false);
              }
            } else {
              setError('No user data found on page');
              setIsLoading(false);
            }
          }
        );
      } else {
        setError('Please navigate to localhost:3000 or app.syncsignature.com first');
        setIsLoading(false);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to refresh data');
      setIsLoading(false);
    }
  }

  async function handleClearData() {
    try {
      await chrome.storage.local.clear();
      await chrome.storage.sync.remove('selectedSignature');
      setUserObjectState(null);
      setSignaturesState(null);
      setSelectedSignatureState(null);
      setStatusMessage({
        text: 'All data cleared',
        type: 'info'
      });
    } catch (err) {
      setError((err as Error).message || 'Failed to clear data');
    }
  }

  async function handleSelectSignature(signature: Signature, index: number) {
    try {
      const newSelectedSignature: SelectedSignature = {
        index,
        content: signature.html,
        timestamp: Date.now()
      };
      
      await setSelectedSignature(newSelectedSignature);
      setSelectedSignatureState(newSelectedSignature);
      
      setStatusMessage({
        text: 'Signature selected! It will be used in Gmail.',
        type: 'success'
      });
    } catch (err) {
      setError((err as Error).message || 'Failed to select signature');
    }
  }

  // Show login prompt if no user data
// Show login prompt if no user data
if (!isLoading && !userObject) {
    return <LoginPrompt onRefresh={handleRefresh} />;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Header isConnected={!!userObject} />
      
      {error && (
        <ErrorAlert 
          message={error} 
          onDismiss={() => setError(null)} 
        />
      )}
      
      {statusMessage && (
        <div className={`mb-4 p-3 rounded-md ${
          statusMessage.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : statusMessage.type === 'info'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
        }`}>
          {statusMessage.text}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {userObject && <UserInfo user={userObject} />}
          
          {signatures && signatures.length > 0 ? (
            <SignatureList 
              signatures={signatures}
              selectedSignature={selectedSignatureState}
              onSelectSignature={handleSelectSignature}
            />
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-yellow-700">No signatures found. Please ensure you're logged in.</p>
            </div>
          )}
          
          <ActionButtons 
            onRefresh={handleRefresh}
            onClear={handleClearData}
          />
        </>
      )}
    </div>
  );
}

export default App;