import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { getUserApiKey, hasUserApiKey } from "@/lib/userApiKeyService";

/**
 * Hook to automatically get the current user's OpenAI API key
 * Returns the API key and loading/error states
 */
export function useUserApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApiKey = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const user = auth.currentUser;
        if (!user) {
          setApiKey(null);
          setHasKey(false);
          setIsLoading(false);
          return;
        }

        let key = await getUserApiKey(user.uid);
        // Fallback to global env key if user has not configured one
        if (!key) {
          try {
            const env = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
            key = env.VITE_OPENAI_API_KEY || env.NEXT_PUBLIC_OPENAI_API_KEY || (window as any)?.NEXT_PUBLIC_OPENAI_API_KEY || null;
          } catch (e) {
            key = null;
          }
        }

        setApiKey(key);
        setHasKey(!!key && key.startsWith('sk-'));
      } catch (err) {
        console.error("Error loading user API key:", err);
        setError("No se pudo cargar la API key");
        setApiKey(null);
        setHasKey(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();

    // Listen to auth changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadApiKey();
    });

    return () => unsubscribe();
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        let key = await getUserApiKey(user.uid);
        if (!key) {
          try {
            const env = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
            key = env.VITE_OPENAI_API_KEY || env.NEXT_PUBLIC_OPENAI_API_KEY || (window as any)?.NEXT_PUBLIC_OPENAI_API_KEY || null;
          } catch (e) {
            key = null;
          }
        }
        setApiKey(key);
        setHasKey(!!key && key.startsWith('sk-'));
      }
    } catch (err) {
      setError("No se pudo recargar la API key");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    apiKey,
    hasKey,
    isLoading,
    error,
    refresh
  };
}
