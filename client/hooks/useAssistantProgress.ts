import { useCallback, useEffect, useMemo, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AssistantProgressData, AssistantProgressTopicStats } from "@/lib/assistantProgress";

export interface UseAssistantProgressResult {
  progress: AssistantProgressData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const EMPTY_PROGRESS: AssistantProgressData = {
  assistantId: "",
  userId: "",
  topicStats: {},
  totalTopicVisits: 0,
  totalTestsTaken: 0,
  totalFlashcardsReviewed: 0,
  totalGamesPlayed: 0,
  lastActivityAtMs: null,
  createdAtMs: null,
  updatedAtMs: null,
};

function normalizeProgress(assistantId: string, userId: string, data: any): AssistantProgressData {
  const topicStatsRaw = (data?.topicStats ?? {}) as Record<string, AssistantProgressTopicStats>;
  const topicStats: Record<string, AssistantProgressTopicStats> = {};
  for (const [key, value] of Object.entries(topicStatsRaw)) {
    topicStats[key] = {
      title: typeof value.title === "string" ? value.title : undefined,
      visits: typeof value.visits === "number" ? value.visits : 0,
      testsTaken: typeof value.testsTaken === "number" ? value.testsTaken : 0,
      flashcardsReviewed: typeof value.flashcardsReviewed === "number" ? value.flashcardsReviewed : 0,
      gamesPlayed: typeof value.gamesPlayed === "number" ? value.gamesPlayed : 0,
      lastVisitedAtMs: typeof value.lastVisitedAtMs === "number" ? value.lastVisitedAtMs : undefined,
      lastTestAtMs: typeof value.lastTestAtMs === "number" ? value.lastTestAtMs : undefined,
      lastFlashcardAtMs: typeof value.lastFlashcardAtMs === "number" ? value.lastFlashcardAtMs : undefined,
      lastGameAtMs: typeof value.lastGameAtMs === "number" ? value.lastGameAtMs : undefined,
    };
  }

  return {
    assistantId,
    userId,
    topicStats,
    totalTopicVisits: typeof data?.totalTopicVisits === "number" ? data.totalTopicVisits : 0,
    totalTestsTaken: typeof data?.totalTestsTaken === "number" ? data.totalTestsTaken : 0,
    totalFlashcardsReviewed: typeof data?.totalFlashcardsReviewed === "number" ? data.totalFlashcardsReviewed : 0,
    totalGamesPlayed: typeof data?.totalGamesPlayed === "number" ? data.totalGamesPlayed : 0,
    lastTopicId: typeof data?.lastTopicId === "string" ? data.lastTopicId : undefined,
    lastTestTopicId: typeof data?.lastTestTopicId === "string" ? data.lastTestTopicId : undefined,
    lastFlashcardTopicId: typeof data?.lastFlashcardTopicId === "string" ? data.lastFlashcardTopicId : undefined,
    lastGameTopicId: typeof data?.lastGameTopicId === "string" ? data.lastGameTopicId : undefined,
    lastActivityAtMs: typeof data?.lastActivityAtMs === "number" ? data.lastActivityAtMs : null,
    createdAtMs: typeof data?.createdAtMs === "number" ? data.createdAtMs : null,
    updatedAtMs: typeof data?.updatedAtMs === "number" ? data.updatedAtMs : null,
  };
}

export function useAssistantProgress(assistantId: string | null, userId: string | null): UseAssistantProgressResult {
  const [progress, setProgress] = useState<AssistantProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assistantId || !userId) {
      setProgress(null);
      setLoading(false);
      setError(null);
      return;
    }

    const ref = doc(db, "assistants", assistantId, "progress", userId);
    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProgress(normalizeProgress(assistantId, userId, data));
        } else {
          setProgress({
            ...EMPTY_PROGRESS,
            assistantId,
            userId,
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error observing assistant progress:", err);
        setError(err instanceof Error ? err.message : "Error al cargar el progreso");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [assistantId, userId]);

  const refresh = useCallback(async () => {
    if (!assistantId || !userId) {
      setProgress(null);
      return;
    }

    try {
      const ref = doc(db, "assistants", assistantId, "progress", userId);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setProgress(normalizeProgress(assistantId, userId, snapshot.data()));
      } else {
        setProgress({
          ...EMPTY_PROGRESS,
          assistantId,
          userId,
        });
      }
      setError(null);
    } catch (err) {
      console.error("Error refreshing assistant progress:", err);
      setError(err instanceof Error ? err.message : "No se pudo actualizar el progreso");
    }
  }, [assistantId, userId]);

  return {
    progress,
    loading,
    error,
    refresh,
  };
}
