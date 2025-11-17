import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    || "tema";
}

async function getAvailableTopicId(assistantId: string, baseId: string): Promise<{ topicId: string; version: number }> {
  let candidate = baseId;
  let version = 1;
  while (true) {
    const ref = doc(db, "assistants", assistantId, "syllabus", candidate);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { topicId: candidate, version };
    }
    version += 1;
    candidate = `${baseId}-v${version}`;
  }
}

export interface SaveTemarioParams {
  assistantId: string;
  topicTitle: string;
  html: string;
  wordCount: number;
}

export async function saveTemarioTopic(params: SaveTemarioParams): Promise<{ topicId: string; version: number }> {
  const baseId = slugify(params.topicTitle);
  const { topicId, version } = await getAvailableTopicId(params.assistantId, baseId);
  const ref = doc(db, "assistants", params.assistantId, "syllabus", topicId);
  const now = Date.now();
  await setDoc(ref, {
    topicId,
    baseTopicId: baseId,
    title: params.topicTitle,
    html: params.html,
    wordCount: params.wordCount,
    version,
    status: "generated",
    testsCount: 0,
    flashcardsCount: 0,
    gamesCount: 0,
    createdAt: serverTimestamp(),
    createdAtMs: now,
    updatedAt: serverTimestamp(),
    updatedAtMs: now,
  });
  return { topicId, version };
}

export async function updateTemarioMetadata(params: { assistantId: string; topicId: string; data: Record<string, unknown> }): Promise<void> {
  const ref = doc(db, "assistants", params.assistantId, "syllabus", params.topicId);
  await updateDoc(ref, {
    ...params.data,
    updatedAt: serverTimestamp(),
    updatedAtMs: Date.now(),
  });
}
