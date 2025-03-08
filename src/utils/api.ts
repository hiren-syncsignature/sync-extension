import { SignaturesResponse } from '../types/index';

export async function fetchSignatures(userId: string): Promise<SignaturesResponse | null> {
  try {
    const queryParams = new URLSearchParams({
      token: userId,
      platform: "chrome_extension"
    });
    
    const response = await fetch(
      `http://localhost:4000/main-server/api/get-extension-signatures?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching signatures:', error);
    return null;
  }
}