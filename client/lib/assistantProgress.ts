import { doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface AssistantProgressTopicStats {
  title?: string;
  visits?: number;
  testsTaken?: number;
  flashcardsReviewed?: number;
  gamesPlayed?: number;
  lastVisitedAtMs?: number;
  lastTestAtMs?: number;
  lastFlashcardAtMs?: number;
  lastGameAtMs?: number;
}

export interface AssistantProgressData {
  assistantId: string;
  userId: string;
  topicStats: Record<string, AssistantProgressTopicStats>;
  totalTopicVisits: number;
  totalTestsTaken: number;
  totalFlashcardsReviewed: number;
  totalGamesPlayed: number;
  lastTopicId?: string | null;
  lastTestTopicId?: string | null;
  lastFlashcardTopicId?: string | null;
  lastGameTopicId?: string | null;
  lastActivityAtMs?: number | null;
  createdAtMs?: number | null;
  updatedAtMs?: number | null;
}

function getProgressRef(assistantId: string, userId: string) {
  return doc(db, "assistants", assistantId, "progress", userId);
}

export async function ensureAssistantProgress(assistantId: string, userId: string): Promise<void> {
  const ref = getProgressRef(assistantId, userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return;
  }
  const now = Date.now();
  await setDoc(ref, {
    assistantId,
    userId,
    topicStats: {},
    totalTopicVisits: 0,
    totalTestsTaken: 0,
    totalFlashcardsReviewed: 0,
    totalGamesPlayed: 0,
    createdAt: serverTimestamp(),
    createdAtMs: now,
    updatedAt: serverTimestamp(),
    updatedAtMs: now,
    lastActivityAt: serverTimestamp(),
    lastActivityAtMs: now,
  });
}

async function touchProgress(refPath: ReturnType<typeof getProgressRef>): Promise<void> {
  const now = Date.now();
  await updateDoc(refPath, {
    updatedAt: serverTimestamp(),
    updatedAtMs: now,
    lastActivityAt: serverTimestamp(),
    lastActivityAtMs: now,
  });
}

export async function recordTopicVisit(params: { assistantId: string; userId: string; topicId: string; title?: string | null }): Promise<void> {
  const { assistantId, userId, topicId, title } = params;
  if (!assistantId || !userId || !topicId) {
    return;
  }
  await ensureAssistantProgress(assistantId, userId);
  const ref = getProgressRef(assistantId, userId);
  const now = Date.now();
  await updateDoc(ref, {
    totalTopicVisits: increment(1),
    lastTopicId: topicId,
    [`topicStats.${topicId}.title`]: title ?? null,
    [`topicStats.${topicId}.visits`]: increment(1),
    [`topicStats.${topicId}.lastVisitedAtMs`]: now,
  });
  await touchProgress(ref);
}

export async function recordTestAttempt(params: { assistantId: string; userId: string; topicId: string; topicTitle?: string | null; testId?: string | null }): Promise<void> {
  const { assistantId, userId, topicId, topicTitle, testId } = params;
  if (!assistantId || !userId || !topicId) {
    return;
  }
  await ensureAssistantProgress(assistantId, userId);
  const ref = getProgressRef(assistantId, userId);
  const now = Date.now();
  await updateDoc(ref, {
    totalTestsTaken: increment(1),
    lastTestTopicId: topicId,
    lastTopicId: topicId,
    [`topicStats.${topicId}.title`]: topicTitle ?? null,
    [`topicStats.${topicId}.testsTaken`]: increment(1),
    [`topicStats.${topicId}.lastTestAtMs`]: now,
    [`topicStats.${topicId}.lastVisitedAtMs`]: now,
    lastTestId: testId ?? null,
  });
  await touchProgress(ref);
}

export async function recordFlashcardStudy(params: { assistantId: string; userId: string; topicId: string; topicTitle?: string | null; cardId?: string | null }): Promise<void> {
  const { assistantId, userId, topicId, topicTitle, cardId } = params;
  if (!assistantId || !userId || !topicId) {
    return;
  }
  await ensureAssistantProgress(assistantId, userId);
  const ref = getProgressRef(assistantId, userId);
  const now = Date.now();
  await updateDoc(ref, {
    totalFlashcardsReviewed: increment(1),
    lastFlashcardTopicId: topicId,
    lastTopicId: topicId,
    [`topicStats.${topicId}.title`]: topicTitle ?? null,
    [`topicStats.${topicId}.flashcardsReviewed`]: increment(1),
    [`topicStats.${topicId}.lastFlashcardAtMs`]: now,
    [`topicStats.${topicId}.lastVisitedAtMs`]: now,
    lastFlashcardId: cardId ?? null,
  });
  await touchProgress(ref);
}

export async function recordGamePlayed(params: { assistantId: string; userId: string; topicId: string; topicTitle?: string | null; gameType?: string | null }): Promise<void> {
  const { assistantId, userId, topicId, topicTitle, gameType } = params;
  if (!assistantId || !userId || !topicId) {
    return;
  }
  await ensureAssistantProgress(assistantId, userId);
  const ref = getProgressRef(assistantId, userId);
  const now = Date.now();
  await updateDoc(ref, {
    totalGamesPlayed: increment(1),
    lastGameTopicId: topicId,
    lastTopicId: topicId,
    [`topicStats.${topicId}.title`]: topicTitle ?? null,
    [`topicStats.${topicId}.gamesPlayed`]: increment(1),
    [`topicStats.${topicId}.lastGameAtMs`]: now,
    [`topicStats.${topicId}.lastVisitedAtMs`]: now,
    lastGameType: gameType ?? null,
  });
  await touchProgress(ref);
}
