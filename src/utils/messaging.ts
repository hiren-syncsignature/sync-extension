/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserObject } from '../types/index';

/**
 * Sends a message to a specific tab
 */
export async function sendMessageToTab<T>(
  tabId: number, 
  message: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response as T);
      }
    });
  });
}

/**
 * Gets the USER object from localStorage of the specified tab
 */
export async function getUserFromTab(tabId: number): Promise<UserObject | null> {
  try {
    const response = await sendMessageToTab<{value?: string; error?: string}>(
      tabId, 
      { action: "getLocalStorageItem", key: "USER" }
    );
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.value) {
      return null;
    }
    
    return JSON.parse(response.value) as UserObject;
  } catch (error) {
    console.error('Error getting user from tab:', error);
    return null;
  }
}

/**
 * Safely parses JSON from a string
 */
export function safeParseJSON<T>(jsonString: string, fallback: T | null = null): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return fallback;
  }
}