import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/simpleAuth';
import { AssistantAvatar, getImageWithCacheBusting } from '@/lib/assistantImageUploadService';

export interface UseAssistantAvatarResult {
  avatar: AssistantAvatar | null;
  imageUrl: string | null;
  thumbUrl: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to get assistant avatar with real-time updates
 */
export function useAssistantAvatar(assistantId: string): UseAssistantAvatarResult {
  const [avatar, setAvatar] = useState<AssistantAvatar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assistantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      doc(db, 'assistants', assistantId),
      (doc) => {
        try {
          if (doc.exists()) {
            const data = doc.data();
            setAvatar(data.avatar || null);
          } else {
            setAvatar(null);
            setError('Asistente no encontrado');
          }
        } catch (err) {
          console.error('Error parsing avatar data:', err);
          setError('Error al cargar avatar');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in avatar subscription:', err);
        setError('Error de conexión');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [assistantId]);

  // Generate URLs with cache busting
  const imageUrl = avatar ? getImageWithCacheBusting(avatar, false) : null;
  const thumbUrl = avatar ? getImageWithCacheBusting(avatar, true) : null;

  return {
    avatar,
    imageUrl,
    thumbUrl,
    loading,
    error
  };
}

/**
 * Hook to get multiple assistant avatars efficiently
 */
export function useMultipleAssistantAvatars(assistantIds: string[]): Record<string, UseAssistantAvatarResult> {
  const [avatars, setAvatars] = useState<Record<string, AssistantAvatar | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    assistantIds.forEach(assistantId => {
      if (!assistantId) return;

      setLoading(prev => ({ ...prev, [assistantId]: true }));
      setErrors(prev => ({ ...prev, [assistantId]: null }));

      const unsubscribe = onSnapshot(
        doc(db, 'assistants', assistantId),
        (doc) => {
          try {
            if (doc.exists()) {
              const data = doc.data();
              setAvatars(prev => ({ ...prev, [assistantId]: data.avatar || null }));
            } else {
              setAvatars(prev => ({ ...prev, [assistantId]: null }));
              setErrors(prev => ({ ...prev, [assistantId]: 'Asistente no encontrado' }));
            }
          } catch (err) {
            console.error(`Error parsing avatar data for ${assistantId}:`, err);
            setErrors(prev => ({ ...prev, [assistantId]: 'Error al cargar avatar' }));
          } finally {
            setLoading(prev => ({ ...prev, [assistantId]: false }));
          }
        },
        (err) => {
          console.error(`Error in avatar subscription for ${assistantId}:`, err);
          setErrors(prev => ({ ...prev, [assistantId]: 'Error de conexión' }));
          setLoading(prev => ({ ...prev, [assistantId]: false }));
        }
      );

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [assistantIds.join(',')]);

  // Transform to the expected format
  const result: Record<string, UseAssistantAvatarResult> = {};
  
  assistantIds.forEach(assistantId => {
    const avatar = avatars[assistantId] || null;
    result[assistantId] = {
      avatar,
      imageUrl: avatar ? getImageWithCacheBusting(avatar, false) : null,
      thumbUrl: avatar ? getImageWithCacheBusting(avatar, true) : null,
      loading: loading[assistantId] || false,
      error: errors[assistantId] || null
    };
  });

  return result;
}
