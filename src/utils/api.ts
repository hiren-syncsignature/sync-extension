import { SignaturesResponse } from '../types/index';

export async function fetchSignatures(userId: string): Promise<SignaturesResponse | null> {
  try {
    const queryParams = new URLSearchParams({
      token: userId,
      platform: "chrome_extension"
    });

    const response = await fetch(
      `${import.meta.env.VITE_APP_SERVER_DEV}?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }, mode: "cors"
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error fetching signatures:', error);
    return null;
  }
}