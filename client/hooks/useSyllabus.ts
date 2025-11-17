import { useState, useEffect } from "react";
import {
  subscribeToAssistantSyllabi,
  getAssistantSyllabi,
  getSyllabus,
  type AssistantSyllabus,
} from "@/lib/syllabusService";

// Hook for real-time syllabus list
export function useAssistantSyllabi(assistantId: string | null) {
  const [syllabi, setSyllabi] = useState<AssistantSyllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assistantId) {
      setSyllabi([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToAssistantSyllabi(
      assistantId,
      (newSyllabi) => {
        setSyllabi(newSyllabi);
        setLoading(false);
      }
    );

    // Handle subscription errors
    const errorTimeout = setTimeout(() => {
      if (loading) {
        setError("Error al cargar los temarios");
        setLoading(false);
      }
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(errorTimeout);
    };
  }, [assistantId]);

  const refresh = async () => {
    if (!assistantId) return;
    
    try {
      setLoading(true);
      const freshSyllabi = await getAssistantSyllabi(assistantId);
      setSyllabi(freshSyllabi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return {
    syllabi,
    loading,
    error,
    refresh,
  };
}

// Hook for single syllabus
export function useSyllabus(syllabusId: string | null) {
  const [syllabus, setSyllabus] = useState<AssistantSyllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!syllabusId) {
      setSyllabus(null);
      setLoading(false);
      return;
    }

    const fetchSyllabus = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSyllabus(syllabusId);
        setSyllabus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el temario");
        setSyllabus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [syllabusId]);

  const refresh = async () => {
    if (!syllabusId) return;
    
    try {
      setLoading(true);
      const data = await getSyllabus(syllabusId);
      setSyllabus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return {
    syllabus,
    loading,
    error,
    refresh,
  };
}

// Hook for syllabus statistics
export function useSyllabusStats(assistantId: string | null) {
  const { syllabi, loading } = useAssistantSyllabi(assistantId);

  const stats = {
    total: syllabi.length,
    withPdf: syllabi.filter(s => s.pdf?.downloadURL).length,
    pending: syllabi.filter(s => !s.pdf?.downloadURL).length,
    totalCharacters: syllabi.reduce((sum, s) => sum + s.contentMarkdown.length, 0),
  };

  return {
    stats,
    loading,
  };
}
