/**
 * Auto-sync hook for automatic Firebase persistence
 *
 * This hook automatically saves any content changes to Firebase
 * and handles offline/online synchronization.
 */

import { useEffect, useRef, useCallback } from "react";
import { firebaseService } from "@/lib/firebaseService";

interface AutoSyncOptions {
  debounceMs?: number;
  collection: string;
  documentId: string;
  enabled?: boolean;
}

export function useAutoSync<T extends Record<string, any>>(
  data: T,
  options: AutoSyncOptions,
) {
  const { debounceMs = 2000, collection, documentId, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>("");

  const save = useCallback(
    async (dataToSave: T) => {
      try {
        const operation = {
          id: `autosync_${Date.now()}`,
          type: "setDoc",
          collection,
          id: documentId,
          data: {
            ...dataToSave,
            updatedAt: new Date().toISOString(),
            autoSaved: true,
          },
        };

        // Save to Firebase
        await firebaseService.executeOperation(operation);
        console.log(`✅ Auto-saved ${collection}/${documentId}`);

        // Update last saved reference
        lastSavedRef.current = JSON.stringify(dataToSave);
      } catch (error) {
        console.warn("Auto-save failed:", error);
      }
    },
    [collection, documentId],
  );

  const debouncedSave = useCallback(
    (dataToSave: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        save(dataToSave);
      }, debounceMs);
    },
    [save, debounceMs],
  );

  useEffect(() => {
    if (!enabled || !data) return;

    const currentData = JSON.stringify(data);

    // Only save if data has actually changed
    if (currentData !== lastSavedRef.current) {
      debouncedSave(data);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debouncedSave, enabled]);

  // Save immediately when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        if (enabled && data) {
          save(data);
        }
      }
    };
  }, [save, enabled, data]);

  return {
    save: () => save(data),
    isAutoSaving: !!timeoutRef.current,
  };
}

/**
 * Hook for auto-saving course content
 */
export function useCourseAutoSync(courseId: string, courseData: any) {
  return useAutoSync(courseData, {
    collection: "courses",
    documentId: courseId,
    debounceMs: 3000,
  });
}

/**
 * Hook for auto-saving temario content
 */
export function useTemarioAutoSync(courseId: string, temarioData: any) {
  return useAutoSync(temarioData, {
    collection: "temarios",
    documentId: courseId,
    debounceMs: 2000,
  });
}

/**
 * Hook for auto-saving user progress
 */
export function useProgressAutoSync(userId: string, progressData: any) {
  return useAutoSync(progressData, {
    collection: "userProgress",
    documentId: userId,
    debounceMs: 1000,
  });
}

/**
 * Hook for auto-saving assistant content
 */
export function useAssistantAutoSync(assistantId: string, assistantData: any) {
  return useAutoSync(assistantData, {
    collection: "assistants",
    documentId: assistantId,
    debounceMs: 2000,
  });
}
