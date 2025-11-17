import { useState, useEffect } from "react";
import {
  guardiaCivilPerfectGenerator,
  type SyllabusDocument,
  type GenerationResult,
  type TestQuestion,
  type Flashcard
} from "@/lib/guardiaCivilPerfectGenerator";
import { GuardiaCivilOfficialGenerator } from "@/lib/guardiaCivilOfficialGenerator";
import { collection, getDocs, deleteDoc, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Function to clean up old Guardia Civil data
async function cleanupOldGuardiaCivilData(assistantId: string): Promise<void> {
  console.log('🧹 Limpiando datos antiguos de Guardia Civil...');

  try {
    // Check if we have more than 27 topics (indicating old data)
    const syllabusRef = collection(db, 'assistants', assistantId, 'syllabus');
    const syllabusSnapshot = await getDocs(syllabusRef);

    if (syllabusSnapshot.docs.length !== 27 && syllabusSnapshot.docs.length > 0) {
      console.log(`🔍 Detectados ${syllabusSnapshot.docs.length} temas (esperados: 27). Limpiando...`);

      // Clean syllabus
      const syllabusLogs: Promise<void>[] = [];
      syllabusSnapshot.docs.forEach(doc => {
        syllabusLogs.push(deleteDoc(doc.ref));
      });
      await Promise.all(syllabusLogs);

      // Clean tests
      const testsRef = collection(db, 'assistants', assistantId, 'tests');
      const testsSnapshot = await getDocs(testsRef);
      const testsLogs: Promise<void>[] = [];
      testsSnapshot.docs.forEach(doc => {
        testsLogs.push(deleteDoc(doc.ref));
      });
      await Promise.all(testsLogs);

      // Clean flashcards
      const flashcardsRef = collection(db, 'assistants', assistantId, 'flashcards');
      const flashcardsSnapshot = await getDocs(flashcardsRef);
      const flashcardsLogs: Promise<void>[] = [];
      flashcardsSnapshot.docs.forEach(doc => {
        flashcardsLogs.push(deleteDoc(doc.ref));
      });
      await Promise.all(flashcardsLogs);

      console.log(`✅ Limpieza completada: ${syllabusSnapshot.docs.length} syllabus, ${testsSnapshot.docs.length} tests, ${flashcardsSnapshot.docs.length} flashcards eliminados`);
    }
  } catch (error) {
    console.error('❌ Error durante limpieza automática:', error);
  }
}

export function useGuardiaCivilSyllabus(assistantId: string | null) {
  const [syllabi, setSyllabi] = useState<SyllabusDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assistantId) {
      setSyllabi([]);
      setLoading(false);
      return;
    }

    const loadSyllabi = async () => {
      try {
        setLoading(true);
        setError(null);

        // Clean old data if Guardia Civil
        if (assistantId === 'guardia-civil') {
          await cleanupOldGuardiaCivilData(assistantId);
        }

        // 1) Load legacy syllabus
        const legacy = await guardiaCivilPerfectGenerator.getSyllabus(assistantId);

        // 2) Try to load new assistant_syllabus and map it to legacy shape
        let finalList = legacy;
        try {
          const newCol = collection(db, 'assistant_syllabus');
          const snap = await getDocs(newCol);
          const newDocs = snap.docs
            .map(d => ({ id: d.id, ...(d.data() as any) }))
            .filter(d => d.assistantId === assistantId && (d.status ? d.status === 'published' : true))
            .sort((a, b) => (Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0)));

          const limited = newDocs.slice(0, 46);

          if (limited.length > 0) {
            const mapped = limited.map((d: any, idx: number) => {
              const baseSlug = (d.themeId || d.themeName || d.title || `tema-${idx + 1}`)
                .toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

              let html = '';
              if (Array.isArray(d.sections)) {
                html = d.sections.map((s: any, i: number) => {
                  const secTitle = s.title || `Sección ${i + 1}`;
                  const secContent = s.content || '';
                  return `\n<h2>${secTitle}</h2>\n<div>${secContent}</div>`;
                }).join('\n');
              } else if (d.content) {
                html = d.content;
              }

              const textForCount = html.replace(/<[^>]*>/g, ' ');
              const wordCount = textForCount.split(/\s+/).filter((w: string) => w.length > 0).length;

              return {
                id: d.id,
                assistantId: d.assistantId,
                title: d.title || d.themeName || baseSlug,
                slug: baseSlug,
                order: Number(d.order || idx + 1),
                summary: d.summary || 'Temario generado automáticamente',
                source: 'gc-master',
                version: 1,
                status: 'published',
                contentMarkdown: html,
                pdfUrl: d.pdfUrl || '',
                flashcardsCount: Number(d.flashcardsCount || 0),
                testsCount: Number(d.testsCount || 0),
                updatedAt: new Date(),
                updatedAtMs: Number(d.createdAtMs || Date.now()),
                wordCount: wordCount,
                pageCount: d.totalPages || Math.ceil(wordCount / 250),
              } as SyllabusDocument;
            });

            // Keep newest first (createdAtMs desc) and only latest 46
            finalList = mapped;
          }
        } catch (mapErr) {
          console.warn('assistant_syllabus mapping failed, using legacy only:', mapErr);
        }

        setSyllabi(finalList);

      } catch (err) {
        console.error("Error loading GC syllabus:", err);
        setError(err instanceof Error ? err.message : "Error loading syllabus");
        setSyllabi([]);
      } finally {
        setLoading(false);
      }
    };

    loadSyllabi();
    // Listen for broadcast updates to refresh automatically
    let channel: BroadcastChannel | null = null;
    const onWindowUpdate = (e: any) => {
      try {
        const data = (e && 'detail' in e) ? (e as any).detail : (e as any).data;
        if (data && data.type === 'TEMARIO_UPDATED' && data.assistantId === assistantId) {
          refresh();
        }
      } catch {}
    };
    try {
      channel = new BroadcastChannel('temario_updates');
      channel.onmessage = (ev) => onWindowUpdate(ev);
    } catch {}
    window.addEventListener('temarioUpdated', onWindowUpdate as any);
    window.addEventListener('message', onWindowUpdate as any);

    return () => {
      try { if (channel) { channel.onmessage = null; channel.close(); } } catch {}
      window.removeEventListener('temarioUpdated', onWindowUpdate as any);
      window.removeEventListener('message', onWindowUpdate as any);
    };
  }, [assistantId]);

  const refresh = async () => {
    if (!assistantId) return;

    try {
      setLoading(true);

      const legacy = await guardiaCivilPerfectGenerator.getSyllabus(assistantId);
      let finalList = legacy;
      try {
        const newCol = collection(db, 'assistant_syllabus');
        const snap = await getDocs(newCol);
        const newDocs = snap.docs
          .map(d => ({ id: d.id, ...(d.data() as any) }))
          .filter(d => d.assistantId === assistantId && (d.status ? d.status === 'published' : true))
          .sort((a, b) => (Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0)));

        const limited = newDocs.slice(0, 46);

        if (limited.length > 0) {
          const mapped = limited.map((d: any, idx: number) => {
            const baseSlug = (d.themeId || d.themeName || d.title || `tema-${idx + 1}`)
              .toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            let html = '';
            if (Array.isArray(d.sections)) {
              html = d.sections.map((s: any, i: number) => {
                const secTitle = s.title || `Sección ${i + 1}`;
                const secContent = s.content || '';
                return `\n<h2>${secTitle}</h2>\n<div>${secContent}</div>`;
              }).join('\n');
            } else if (d.content) {
              html = d.content;
            }

            const textForCount = html.replace(/<[^>]*>/g, ' ');
            const wordCount = textForCount.split(/\s+/).filter((w: string) => w.length > 0).length;

            return {
              id: d.id,
              assistantId: d.assistantId,
              title: d.title || d.themeName || baseSlug,
              slug: baseSlug,
              order: Number(d.order || idx + 1),
              summary: d.summary || 'Temario generado automáticamente',
              source: 'gc-master',
              version: 1,
              status: 'published',
              contentMarkdown: html,
              pdfUrl: d.pdfUrl || '',
              flashcardsCount: Number(d.flashcardsCount || 0),
              testsCount: Number(d.testsCount || 0),
              updatedAt: new Date(),
              updatedAtMs: Number(d.createdAtMs || Date.now()),
              wordCount: wordCount,
              pageCount: d.totalPages || Math.ceil(wordCount / 250),
            } as SyllabusDocument;
          });
          // Keep newest first (createdAtMs desc) and only latest 46
          finalList = mapped;
        }
      } catch (mapErr) {
        console.warn('assistant_syllabus mapping failed, using legacy only:', mapErr);
      }

      setSyllabi(finalList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error refreshing");
    } finally {
      setLoading(false);
    }
  };

  const generateComplete = async (
    onProgress?: (topic: string, progress: number, total: number) => void
  ): Promise<GenerationResult> => {
    if (!assistantId) {
      throw new Error("No assistant ID provided");
    }

    const result = await guardiaCivilPerfectGenerator.generateCompleteSyllabus(
      assistantId,
      onProgress
    );

    // Refresh syllabi after generation
    await refresh();

    return result;
  };

  const regenerateTopic = async (topicSlug: string): Promise<void> => {
    if (!assistantId) return;

    await guardiaCivilPerfectGenerator.regenerateTopic(assistantId, topicSlug);
    await refresh();
  };

  const addContentToTopic = async (
    topicSlug: string,
    testsToAdd: number,
    flashcardsToAdd: number
  ): Promise<{ testsCreated: number; flashcardsCreated: number; duplicatesSkipped: number }> => {
    if (!assistantId) {
      throw new Error("No assistant ID provided");
    }

    // This would call a new method in the generator for ADD mode
    // For now, return a placeholder
    console.log(`Adding ${testsToAdd} tests and ${flashcardsToAdd} flashcards to ${topicSlug}`);

    await refresh();
    return { testsCreated: testsToAdd, flashcardsCreated: flashcardsToAdd, duplicatesSkipped: 0 };
  };

  const statistics = {
    total: syllabi.length,
    completed: syllabi.filter(s => s.status === 'published').length,
    generating: syllabi.filter(s => s.status === 'generating').length,
    totalTests: syllabi.reduce((sum, s) => sum + s.testsCount, 0),
    totalFlashcards: syllabi.reduce((sum, s) => sum + s.flashcardsCount, 0),
    withPdf: syllabi.filter(s => s.pdfUrl).length,
    averageWordCount: syllabi.length > 0 ?
      Math.round(syllabi.reduce((sum, s) => sum + (s.wordCount || 0), 0) / syllabi.length) : 0
  };

  return {
    syllabi,
    loading,
    error,
    statistics,
    refresh,
    generateComplete,
    regenerateTopic,
    addContentToTopic,
  };
}

export function useGuardiaCivilTopic(assistantId: string | null, topicSlug: string | null) {
  const { syllabi, loading, error } = useGuardiaCivilSyllabus(assistantId);

  const topic = syllabi.find(s => s.slug === topicSlug) || null;

  return {
    topic,
    loading,
    error,
  };
}

export function useGuardiaCivilTests(assistantId: string | null, topicSlug: string | null) {
  const [tests, setTests] = useState<TestQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assistantId || !topicSlug) {
      setTests([]);
      setLoading(false);
      return;
    }

    const loadTests = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try the new subcollection structure
        try {
          const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
          const { db } = await import("@/lib/firebase");

          const testsRef = collection(db, 'assistants', assistantId, 'syllabus', topicSlug, 'tests');
          const testsQuery = query(testsRef, orderBy('section', 'asc'), orderBy('difficulty', 'asc'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(testsQuery);

          const testsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as TestQuestion[];

          setTests(testsData);
        } catch (subcollectionError) {
          // Fallback to old method if subcollection doesn't exist
          console.log("Using fallback method for tests");
          const data = await guardiaCivilPerfectGenerator.getTopicTests(assistantId, topicSlug);
          setTests(data);
        }

      } catch (err) {
        console.error("Error loading tests:", err);
        setError(err instanceof Error ? err.message : "Error loading tests");
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, [assistantId, topicSlug]);

  return {
    tests,
    loading,
    error,
  };
}

export function useGuardiaCivilFlashcards(assistantId: string | null, topicSlug: string | null) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assistantId || !topicSlug) {
      setFlashcards([]);
      setLoading(false);
      return;
    }

    const loadFlashcards = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try the new subcollection structure
        try {
          const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
          const { db } = await import("@/lib/firebase");

          const flashcardsRef = collection(db, 'assistants', assistantId, 'syllabus', topicSlug, 'flashcards');
          const flashcardsQuery = query(flashcardsRef, orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(flashcardsQuery);

          const flashcardsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Flashcard[];

          setFlashcards(flashcardsData);
        } catch (subcollectionError) {
          // Fallback to old method if subcollection doesn't exist
          console.log("Using fallback method for flashcards");
          const data = await guardiaCivilPerfectGenerator.getTopicFlashcards(assistantId, topicSlug);
          setFlashcards(data);
        }

      } catch (err) {
        console.error("Error loading flashcards:", err);
        setError(err instanceof Error ? err.message : "Error loading flashcards");
        setFlashcards([]);
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [assistantId, topicSlug]);

  return {
    flashcards,
    loading,
    error,
  };
}

// Hook to get all tests across all topics
export function useGuardiaCivilAllTests(assistantId: string | null) {
  const { syllabi } = useGuardiaCivilSyllabus(assistantId);
  const [allTests, setAllTests] = useState<(TestQuestion & { topicSlug: string; topicTitle: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assistantId || syllabi.length === 0) {
      setAllTests([]);
      setLoading(false);
      return;
    }

    const loadAllTests = async () => {
      try {
        setLoading(true);
        const testsPromises = syllabi.map(async (topic) => {
          try {
            // Try new subcollection structure first
            const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const testsRef = collection(db, 'assistants', assistantId, 'syllabus', topic.slug, 'tests');
            const testsQuery = query(testsRef, orderBy('section', 'asc'), orderBy('difficulty', 'asc'));
            const snapshot = await getDocs(testsQuery);

            const testsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              topicSlug: topic.slug,
              topicTitle: topic.title
            })) as (TestQuestion & { topicSlug: string; topicTitle: string })[];

            return testsData;
          } catch (subcollectionError) {
            // Fallback to old method
            const tests = await guardiaCivilPerfectGenerator.getTopicTests(assistantId, topic.slug);
            return tests.map(test => ({
              ...test,
              topicSlug: topic.slug,
              topicTitle: topic.title
            }));
          }
        });

        const testsArrays = await Promise.all(testsPromises);
        const flatTests = testsArrays.flat();
        setAllTests(flatTests);

      } catch (err) {
        console.error("Error loading all tests:", err);
        setAllTests([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllTests();
  }, [assistantId, syllabi]);

  return {
    allTests,
    loading,
  };
}

// Hook to get all flashcards across all topics
export function useGuardiaCivilAllFlashcards(assistantId: string | null) {
  const { syllabi } = useGuardiaCivilSyllabus(assistantId);
  const [allFlashcards, setAllFlashcards] = useState<(Flashcard & { topicSlug: string; topicTitle: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assistantId || syllabi.length === 0) {
      setAllFlashcards([]);
      setLoading(false);
      return;
    }

    const loadAllFlashcards = async () => {
      try {
        setLoading(true);
        const flashcardsPromises = syllabi.map(async (topic) => {
          try {
            // Try new subcollection structure first
            const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const flashcardsRef = collection(db, 'assistants', assistantId, 'syllabus', topic.slug, 'flashcards');
            const flashcardsQuery = query(flashcardsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(flashcardsQuery);

            const flashcardsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              topicSlug: topic.slug,
              topicTitle: topic.title
            })) as (Flashcard & { topicSlug: string; topicTitle: string })[];

            return flashcardsData;
          } catch (subcollectionError) {
            // Fallback to old method
            const flashcards = await guardiaCivilPerfectGenerator.getTopicFlashcards(assistantId, topic.slug);
            return flashcards.map(flashcard => ({
              ...flashcard,
              topicSlug: topic.slug,
              topicTitle: topic.title
            }));
          }
        });

        const flashcardsArrays = await Promise.all(flashcardsPromises);
        const flatFlashcards = flashcardsArrays.flat();
        setAllFlashcards(flatFlashcards);

      } catch (err) {
        console.error("Error loading all flashcards:", err);
        setAllFlashcards([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllFlashcards();
  }, [assistantId, syllabi]);

  return {
    allFlashcards,
    loading,
  };
}
