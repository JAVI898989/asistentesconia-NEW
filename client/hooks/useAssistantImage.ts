import { useState, useEffect } from 'react';
import { 
  subscribeToAssistant, 
  getActiveAssistantImage,
  type AssistantWithImage 
} from '@/lib/assistantImageService';

export interface UseAssistantImageReturn {
  assistant: AssistantWithImage | null;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  isConnected: boolean;
}

/**
 * Hook para gestionar la imagen de un asistente con suscripción en tiempo real
 */
export function useAssistantImage(assistantId: string, fallbackImageUrl?: string): UseAssistantImageReturn {
  const [assistant, setAssistant] = useState<AssistantWithImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!assistantId) {
      setIsLoading(false);
      setError('Assistant ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsConnected(false);

    // Real-time subscription
    const unsubscribe = subscribeToAssistant(
      assistantId,
      (updatedAssistant) => {
        console.log(`📡 [useAssistantImage] Real-time update for ${assistantId}:`, updatedAssistant);
        setAssistant(updatedAssistant);
        setIsLoading(false);
        setIsConnected(true);
        setError(null);
      },
      (subscriptionError) => {
        console.error(`❌ [useAssistantImage] Subscription error for ${assistantId}:`, subscriptionError);
        setError(subscriptionError.message);
        setIsLoading(false);
        setIsConnected(false);
      }
    );

    // Optional: Load initial data if needed
    const loadInitialData = async () => {
      try {
        const activeImageUrl = await getActiveAssistantImage(assistantId);
        if (activeImageUrl && !assistant?.coverImageUrl) {
          // This will be overridden by the real-time subscription if it provides data
          console.log(`📷 [useAssistantImage] Initial image loaded for ${assistantId}:`, activeImageUrl);
        }
      } catch (loadError) {
        console.warn(`⚠️ [useAssistantImage] Could not load initial image for ${assistantId}:`, loadError);
      }
    };

    loadInitialData();

    return () => {
      console.log(`🔌 [useAssistantImage] Unsubscribing from ${assistantId}`);
      unsubscribe();
    };
  }, [assistantId]);

  // Determine the image URL to use
  const imageUrl = assistant?.coverImageUrl || fallbackImageUrl || null;
  const lastUpdated = assistant?.updatedAtMs || null;

  return {
    assistant,
    imageUrl,
    isLoading,
    error,
    lastUpdated,
    isConnected
  };
}

/**
 * Hook simplificado que solo devuelve la URL de la imagen
 */
export function useAssistantImageUrl(assistantId: string, fallbackImageUrl?: string): string | null {
  const { imageUrl } = useAssistantImage(assistantId, fallbackImageUrl);
  return imageUrl;
}

/**
 * Hook para verificar si una imagen es persistente (guardada en Firebase Storage)
 */
export function useIsImagePersistent(assistantId: string): boolean {
  const { assistant } = useAssistantImage(assistantId);
  return !!(assistant?.coverImageUrl && assistant?.coverImagePath);
}
