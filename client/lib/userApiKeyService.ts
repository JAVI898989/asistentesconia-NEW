import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

/**
 * Service to manage user's personal OpenAI API key
 * This ensures all API calls are charged to the user's account, not the platform
 */

export interface UserApiKeyConfig {
  openaiApiKey: string;
  encrypted: boolean;
  createdAt: any;
  updatedAt: any;
  lastValidated?: any;
  isValid?: boolean;
}

/**
 * Get user's OpenAI API key from Firestore
 */
export async function getUserApiKey(userId: string): Promise<string | null> {
  try {
    const configRef = doc(db, "users", userId, "private", "apiKeys");
    const configSnap = await getDoc(configRef);
    
    if (!configSnap.exists()) {
      return null;
    }
    
    const data = configSnap.data() as UserApiKeyConfig;
    return data.openaiApiKey || null;
  } catch (error) {
    console.error("Error getting user API key:", error);
    return null;
  }
}

/**
 * Save user's OpenAI API key to Firestore
 * Stored in a private subcollection for security
 */
export async function saveUserApiKey(userId: string, apiKey: string): Promise<void> {
  try {
    const configRef = doc(db, "users", userId, "private", "apiKeys");
    
    await setDoc(configRef, {
      openaiApiKey: apiKey,
      encrypted: false, // Could implement encryption in the future
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastValidated: serverTimestamp(),
      isValid: await validateApiKey(apiKey)
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user API key:", error);
    throw new Error("No se pudo guardar la API key");
  }
}

/**
 * Delete user's API key
 */
export async function deleteUserApiKey(userId: string): Promise<void> {
  try {
    const configRef = doc(db, "users", userId, "private", "apiKeys");
    await setDoc(configRef, {
      openaiApiKey: "",
      updatedAt: serverTimestamp(),
      isValid: false
    }, { merge: true });
  } catch (error) {
    console.error("Error deleting user API key:", error);
    throw new Error("No se pudo eliminar la API key");
  }
}

/**
 * Validate OpenAI API key format and optionally test it
 */
export async function validateApiKey(apiKey: string, test: boolean = false): Promise<boolean> {
  // Basic format validation
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return false;
  }
  
  if (apiKey.length < 40) {
    return false;
  }
  
  // Optional: test the key with a real API call
  if (test) {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
  
  return true;
}

/**
 * Get current user's API key
 */
export async function getCurrentUserApiKey(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  return getUserApiKey(user.uid);
}

/**
 * Check if user has configured their API key
 */
export async function hasUserApiKey(userId?: string): Promise<boolean> {
  const uid = userId || auth.currentUser?.uid;
  if (!uid) {
    return false;
  }
  
  const apiKey = await getUserApiKey(uid);
  return !!apiKey && apiKey.startsWith('sk-');
}

/**
 * Mask API key for display (show only first/last chars)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 10) {
    return "****";
  }
  
  return `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`;
}
