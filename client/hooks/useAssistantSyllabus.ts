import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs, onSnapshot, orderBy, query, type QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AssistantSyllabusTopic {
  id: string;
  assistantId: string;
  topicId: string;
  baseTopicId: string;
  title: string;
  slug: string;
  order: number;
  summary: string;
  status: "generated" | "published" | "draft" | string;
  version: number;
  wordCount: number;
  pageCount: number;
  testsCount: number;
  flashcardsCount: number;
  gamesCount: number;
  html: string;
  content: string;
  contentMarkdown: string;
  pdfUrl?: string;
  createdAtMs: number | null;
  updatedAtMs: number | null;
}

interface AssistantSyllabusStatistics {
  total: number;
  completed: number;
  generating: number;
  totalTests: number;
  totalFlashcards: number;
  withGames: number;
  averageWordCount: number;
}

interface UseAssistantSyllabusResult {
  topics: AssistantSyllabusTopic[];
  loading: boolean;
  error: string | null;
  statistics: AssistantSyllabusStatistics;
  refresh: () => Promise<void>;
}

export function useAssistantSyllabus(assistantId: string | null): UseAssistantSyllabusResult {
  const [topics, setTopics] = useState<AssistantSyllabusTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mapDoc = useCallback(
    (docSnap: QueryDocumentSnapshot, index: number): AssistantSyllabusTopic => {
      const data = docSnap.data() as Record<string, unknown>;
      const topicId = typeof data.topicId === "string" && data.topicId.length > 0 ? data.topicId : docSnap.id;
      const baseTopicId = typeof data.baseTopicId === "string" && data.baseTopicId.length > 0 ? data.baseTopicId : topicId;
      const title = typeof data.title === "string" && data.title.length > 0 ? data.title : `Tema ${index + 1}`;
      const slug = slugify(topicId || title || `tema-${index + 1}`);
      const html = typeof data.html === "string" ? data.html : "";
      const wordCount = typeof data.wordCount === "number" ? data.wordCount : countWords(html);
      const createdAtMs = typeof data.createdAtMs === "number" ? data.createdAtMs : null;
      const updatedAtMs = typeof data.updatedAtMs === "number" ? data.updatedAtMs : createdAtMs;

      return {
        id: docSnap.id,
        assistantId: assistantId ?? "",
        topicId,
        baseTopicId,
        title,
        slug,
        order: typeof data.order === "number" ? data.order : index + 1,
        summary: typeof data.summary === "string" ? data.summary : "Temario generado automáticamente",
        status: (typeof data.status === "string" ? data.status : "generated") as AssistantSyllabusTopic["status"],
        version: typeof data.version === "number" ? data.version : 1,
        wordCount,
        pageCount: typeof data.pageCount === "number" ? data.pageCount : Math.max(1, Math.ceil(wordCount / 250)),
        testsCount: typeof data.testsCount === "number" ? data.testsCount : 0,
        flashcardsCount: typeof data.flashcardsCount === "number" ? data.flashcardsCount : 0,
        gamesCount: typeof data.gamesCount === "number" ? data.gamesCount : 0,
        html,
        content: html,
        contentMarkdown: html,
        pdfUrl: typeof data.pdfUrl === "string" ? data.pdfUrl : undefined,
        createdAtMs,
        updatedAtMs,
      };
    },
    [assistantId]
  );

  const applySnapshot = useCallback(
    (docs: QueryDocumentSnapshot[]): AssistantSyllabusTopic[] => docs.map((docSnap, index) => mapDoc(docSnap, index)),
    [mapDoc]
  );

  useEffect(() => {
    if (!assistantId) {
      setTopics([]);
      setLoading(false);
      return;
    }

    const collectionRef = collection(db, "assistants", assistantId, "syllabus");
    const q = query(collectionRef, orderBy("createdAtMs", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setTopics(applySnapshot(snapshot.docs));
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        console.error("Error loading assistant syllabus:", snapshotError);
        setError(snapshotError instanceof Error ? snapshotError.message : "Error al cargar el temario");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [assistantId, applySnapshot]);

  const refresh = useCallback(async () => {
    if (!assistantId) {
      setTopics([]);
      return;
    }

    try {
      setLoading(true);
      const collectionRef = collection(db, "assistants", assistantId, "syllabus");
      const q = query(collectionRef, orderBy("createdAtMs", "asc"));
      const snapshot = await getDocs(q);
      setTopics(applySnapshot(snapshot.docs));
      setError(null);
    } catch (refreshError) {
      console.error("Error refreshing assistant syllabus:", refreshError);
      setError(refreshError instanceof Error ? refreshError.message : "No se pudo actualizar el temario");
    } finally {
      setLoading(false);
    }
  }, [assistantId, applySnapshot]);

  const statistics = useMemo<AssistantSyllabusStatistics>(() => {
    const total = topics.length;
    const completed = topics.filter((topic) => topic.status === "published").length;
    const generating = topics.filter((topic) => topic.status === "generating").length;
    const totalTests = topics.reduce((sum, topic) => sum + topic.testsCount, 0);
    const totalFlashcards = topics.reduce((sum, topic) => sum + topic.flashcardsCount, 0);
    const withGames = topics.filter((topic) => topic.gamesCount > 0).length;
    const averageWordCount = total > 0 ? Math.round(topics.reduce((sum, topic) => sum + topic.wordCount, 0) / total) : 0;

    return {
      total,
      completed,
      generating,
      totalTests,
      totalFlashcards,
      withGames,
      averageWordCount,
    };
  }, [topics]);

  return {
    topics,
    loading,
    error,
    statistics,
    refresh,
  };
}

function countWords(text: string): number {
  return text
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0).length;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "tema";
}
