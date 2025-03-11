import { UserObject, Signature, SelectedSignature } from '../types/index';

export const storage = {
  local: {
    get: <T>(key: string): Promise<T | undefined> => {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] as T);
        });
      });
    },
    
    set: <T>(key: string, value: T): Promise<void> => {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    },
    
    remove: (key: string): Promise<void> => {
      return new Promise((resolve) => {
        chrome.storage.local.remove(key, () => {
          resolve();
        });
      });
    }
  },
  
  // Sync storage functions
  sync: {
    get: <T>(key: string): Promise<T | undefined> => {
      return new Promise((resolve) => {
        chrome.storage.sync.get([key], (result) => {
          resolve(result[key] as T);
        });
      });
    },
    
    set: <T>(key: string, value: T): Promise<void> => {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ [key]: value }, () => {
          resolve();
        });
      });
    },
    
    remove: (key: string): Promise<void> => {
      return new Promise((resolve) => {
        chrome.storage.sync.remove(key, () => {
          resolve();
        });
      });
    }
  }
};

export async function getUserObject(): Promise<UserObject | undefined> {
  return storage.local.get<UserObject>('userObject');
}

export async function setUserObject(userObject: UserObject): Promise<void> {
  return storage.local.set('userObject', userObject);
}

export async function getSignatures(): Promise<Signature[] | undefined> {
  return storage.local.get<Signature[]>('signatures');
}

export async function setSignatures(signatures: Signature[]): Promise<void> {
  return storage.local.set('signatures', signatures);
}

export async function setSignaturesTimestamp(timestamp: number): Promise<void> {
  return storage.local.set('signaturesTimestamp', timestamp);
}

export async function getSignaturesTimestamp(): Promise<number | undefined> {
  return storage.local.get<number>('signaturesTimestamp');
}

export async function getSelectedSignature(): Promise<SelectedSignature | undefined> {
  return storage.sync.get<SelectedSignature>('selectedSignature');
}

export async function setSelectedSignature(selectedSignature: SelectedSignature): Promise<void> {
  return storage.sync.set('selectedSignature', selectedSignature);
}