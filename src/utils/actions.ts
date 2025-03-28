import { fetchSignatures } from './api';
import { UserObject, Signature, SelectedSignature } from '../types';


export async function handleClearData(
  setUserObjectState: (user: UserObject | null) => void,
  setSignaturesState: (signatures: Signature[] | null) => void,
  setSelectedSignatureState: (signature: SelectedSignature | null) => void,
  setStatusMessage: (message: { text: string, type: 'success' | 'info' | 'error' } | null) => void,
  setError: (error: string | null) => void
) {
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

export async function handleRefresh(
  userId: string,
  setSignaturesState: (signatures: Signature[] | null) => void,
  setError: (error: string | null) => void
) {
  try {
    const data = await fetchSignatures(userId);

    if (data && data.html && Array.isArray(data.html)) {
      setSignaturesState(data.html);
    }
  } catch (err) {
    setError('Looks like server is busy please try again');
    // console.error('Error fetching signatures:', err);
  }
}