import { setUserObject, setSignatures, setSignaturesTimestamp, getSelectedSignature, setSelectedSignature, getUserObject } from '../utils/storage';
import { fetchSignatures } from '../utils/api';
// import { UserObject } from '../types/index';
import { getUserFromTab } from '../utils/messaging';
import { logger } from '../utils/logger';

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  logger.info('SyncSignature extension installed!');
  
  // Wait a bit to make sure everything is initialized
  setTimeout(() => {
    checkForUserToken();
  }, 1000);
});

// Function to check for user token in any open tabs
async function checkForUserToken() {
  try {
    // Check if we already have a token
    const existingUser = await getUserObject();
    if (existingUser) {
      logger.info('User token already exists in storage');
      
      // Refresh signatures if we have a token
      if (existingUser.id) {
        await fetchAndStoreSignatures(existingUser.id);
      }
      return;
    }
    
    // Look for token in localhost:3000 or app.syncsignature.com tabs
    const tabs = await chrome.tabs.query({
      url: [
        'http://localhost:3000/*', 
        'https://app.syncsignature.com/*'
      ]
    });
    
    if (tabs.length > 0) {
      for (const tab of tabs) {
        if (!tab.id) continue;
        
        try {
          // Try to get user from tab
          const userObject = await getUserFromTab(tab.id);
          
          if (userObject) {
            // Save to extension storage
            await setUserObject(userObject);
            logger.success('User object saved to extension storage from tab:', tab.id);
            
            // After getting the token, fetch signatures
            if (userObject.id) {
              await fetchAndStoreSignatures(userObject.id);
            }
            
            break; // Stop after finding a valid token
          }
        } catch (e) {
          logger.error('Error extracting user token from tab:', tab.id, e);
        }
      }
    } else {
      logger.info('No compatible tabs found to extract user token');
    }
  } catch (error) {
    logger.error('Error in checkForUserToken:', error);
  }
}

// Function to fetch and store signatures
async function fetchAndStoreSignatures(userId: string) {
  logger.info('Fetching signatures for user:', userId);
  
  try {
    const data = await fetchSignatures(userId);
    
    if (data && data.html && Array.isArray(data.html) && data.html.length > 0) {
      // Store all signatures
      await setSignatures(data.html);
      await setSignaturesTimestamp(Date.now());
      logger.success('Signatures saved to storage:', data.html.length);
      
      // If no signature is selected yet, set the first one as default
      const selectedSignature = await getSelectedSignature();
      if (!selectedSignature) {
        await setSelectedSignature({
          index: 0,
          content: data.html[0].html,
          timestamp: Date.now()
        });
        logger.info('Default signature set to first signature');
      }
    } else {
      logger.warn('No signatures found or invalid response format');
    }
  } catch (error) {
    logger.error('Failed to fetch signatures:', error);
  }
}

// Listen for tab updates to detect when user logs in
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && 
      (tab.url?.includes('localhost:3000') || tab.url?.includes('app.syncsignature.com'))) {
    // Wait a moment for page to fully load
    setTimeout(async () => {
      try {
        const userObject = await getUserFromTab(tabId);
        
        if (userObject) {
          // Check if we need to update the stored token
          const existingUser = await getUserObject();
          
          // If token doesn't exist or has changed, update it
          if (!existingUser || existingUser.id !== userObject.id) {
            await setUserObject(userObject);
            logger.info('User token updated after login detection');
            
            // Fetch signatures with the new token
            if (userObject.id) {
              await fetchAndStoreSignatures(userObject.id);
            }
          }
        }
      } catch (e) {
        logger.error('Error processing login detection:', e);
      }
    }, 1500);
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "fetchSignatures") {
    // Handle request to fetch signatures
    (async () => {
      try {
        const user = await getUserObject();
        if (user && user.id) {
          await fetchAndStoreSignatures(user.id);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "No user found" });
        }
      } catch (error) {
        logger.error('Error in fetchSignatures message handler:', error);
        sendResponse({ success: false, error: String(error) });
      }
    })();
    return true; // Keep channel open for async response
  }
  
  return false;
});