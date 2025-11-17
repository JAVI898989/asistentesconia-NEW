import { collection, doc, getDoc, getDocs, setDoc, updateDoc, runTransaction, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { guardiaCivilPerfectGenerator } from "./guardiaCivilPerfectGenerator";
import { testFlashcardAdvancedGenerator, type GenerationProgress } from "./testFlashcardAdvancedGenerator";
import { pdfGenerationService } from "./pdfGenerationService";

export interface UnifiedGenerationProgress {
  step: 'temario' | 'tests' | 'flashcards' | 'pdf' | 'completed';
  currentTopic?: string;
  totalTopics?: number;
  processedTopics?: number;
  testsCreated?: number;
  flashcardsCreated?: number;
  pdfsGenerated?: number;
  logs: string[];
  errors: string[];
}

export interface ContentGenerationResult {
  success: boolean;
  temarioResult?: any;
  testFlashcardResult?: any;
  pdfResults?: { [topicSlug: string]: { success: boolean; pdfUrl?: string; error?: string } };
  summary: {
    topicsGenerated: number;
    testsCreated: number;
    flashcardsCreated: number;
    pdfsGenerated: number;
    totalErrors: number;
  };
  errors: string[];
}

export interface TopicContentResult {
  success: boolean;
  temarioGenerated: boolean;
  testsCreated: number;
  flashcardsCreated: number;
  pdfGenerated: boolean;
  pdfUrl?: string;
  errors: string[];
}

export interface BatchOperationResult {
  success: boolean;
  processed: number;
  successful: number;
  failed: number;
  results: { [topicSlug: string]: { success: boolean; error?: string } };
}

class UnifiedContentManager {

  /**
   * Generate complete content for an assistant (Temario + Tests + Flashcards + PDFs)
   */
  async generateCompleteContent(
    assistantId: string,
    onProgress?: (progress: UnifiedGenerationProgress) => void
  ): Promise<ContentGenerationResult> {
    const result: ContentGenerationResult = {
      success: false,
      summary: {
        topicsGenerated: 0,
        testsCreated: 0,
        flashcardsCreated: 0,
        pdfsGenerated: 0,
        totalErrors: 0
      },
      errors: []
    };

    const progress: UnifiedGenerationProgress = {
      step: 'temario',
      logs: [],
      errors: []
    };

    try {
      // Step 1: Generate Temario (MDX)
      onProgress?.({ ...progress, step: 'temario' });
      progress.logs.push("🚀 Iniciando generación de temario...");

      const temarioResult = await guardiaCivilPerfectGenerator.generateCompleteSyllabus(
        assistantId,
        (topic: string, processed: number, total: number) => {
          progress.currentTopic = topic;
          progress.totalTopics = total;
          progress.processedTopics = processed;
          progress.logs.push(`📝 Generando: ${topic} (${processed}/${total})`);
          onProgress?.(progress);
        }
      );

      result.temarioResult = temarioResult;
      result.summary.topicsGenerated = temarioResult.topicsGenerated || 0;

      if (!temarioResult.success) {
        progress.errors.push(`Error en temario: ${temarioResult.errors?.join(', ')}`);
        result.errors.push(...(temarioResult.errors || []));
      }

      // Step 2: Generate Tests and Flashcards
      progress.step = 'tests';
      progress.logs.push("🎯 Generando tests y flashcards...");
      onProgress?.(progress);

      const testFlashcardResult = await testFlashcardAdvancedGenerator.generateForAllTopics(
        assistantId,
        (topicProgress: GenerationProgress) => {
          progress.currentTopic = topicProgress.topicTitle;
          progress.testsCreated = (progress.testsCreated || 0) + topicProgress.testsCreated;
          progress.flashcardsCreated = (progress.flashcardsCreated || 0) + topicProgress.flashcardsCreated;

          topicProgress.logs.forEach(log => progress.logs.push(`  ${log}`));
          topicProgress.errors.forEach(error => progress.errors.push(error));

          onProgress?.(progress);
        }
      );

      result.testFlashcardResult = testFlashcardResult;
      result.summary.testsCreated = testFlashcardResult.totalTestsCreated;
      result.summary.flashcardsCreated = testFlashcardResult.totalFlashcardsCreated;

      // Step 3: Generate PDFs (non-blocking)
      progress.step = 'pdf';
      progress.logs.push("📄 Generando PDFs (no bloqueante)...");
      onProgress?.(progress);

      const pdfResults = await this.generateAllPDFs(assistantId, false);
      result.pdfResults = pdfResults.results;
      result.summary.pdfsGenerated = pdfResults.successful;

      // Final step
      progress.step = 'completed';
      progress.logs.push("🎉 Generación completa finalizada");
      onProgress?.(progress);

      result.summary.totalErrors = progress.errors.length;
      result.success = progress.errors.length === 0 || result.summary.topicsGenerated > 0;

    } catch (error) {
      console.error("Error en generación completa:", error);
      progress.errors.push(`Error general: ${error.message}`);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Generate content for a single topic
   */
  async generateTopicContent(
    assistantId: string,
    topicSlug: string,
    options: {
      regenerateTemario?: boolean;
      generateTests?: boolean;
      generateFlashcards?: boolean;
      generatePDF?: boolean;
      mode?: 'OVERWRITE' | 'ADD';
      testsCount?: number; // Custom test count
      flashcardsCount?: number; // Custom flashcard count
      isBasePackage?: boolean; // Whether this is a base package (5 tests, 45+ flashcards)
    } = {},
    onProgress?: (progress: UnifiedGenerationProgress) => void
  ): Promise<TopicContentResult> {
    const result: TopicContentResult = {
      success: false,
      temarioGenerated: false,
      testsCreated: 0,
      flashcardsCreated: 0,
      pdfGenerated: false,
      errors: []
    };

    const progress: UnifiedGenerationProgress = {
      step: 'temario',
      currentTopic: topicSlug,
      logs: [],
      errors: []
    };

    try {
      // Get topic info
      const topicDoc = await getDoc(doc(db, 'assistants', assistantId, 'syllabus', topicSlug));
      if (!topicDoc.exists()) {
        throw new Error(`Topic not found: ${topicSlug}`);
      }

      const topicData = topicDoc.data();
      progress.currentTopic = topicData.title;

      // Step 1: Regenerate Temario if needed
      if (options.regenerateTemario) {
        progress.logs.push("📝 Regenerando temario...");
        onProgress?.(progress);

        await guardiaCivilPerfectGenerator.regenerateTopic(assistantId, topicSlug);
        result.temarioGenerated = true;
        progress.logs.push("✅ Temario regenerado");
      }

      // Step 2: Generate Tests and Flashcards
      if (options.generateTests || options.generateFlashcards) {
        progress.step = 'tests';

        // Determine targets based on base package or custom counts
        const testsTarget = options.isBasePackage ? 5 : (options.testsCount || 20);
        const flashcardsTarget = options.isBasePackage ? 45 : (options.flashcardsCount || 45);

        if (options.isBasePackage) {
          progress.logs.push(`📦 Creando paquete base: ${testsTarget} tests + ${flashcardsTarget}+ flashcards...`);
        } else {
          progress.logs.push(`🎯 Generando contenido: ${testsTarget} tests + ${flashcardsTarget} flashcards...`);
        }

        onProgress?.(progress);

        const topicProgress: GenerationProgress = {
          topicSlug,
          topicTitle: topicData.title,
          testsTarget: options.generateTests ? testsTarget : 0,
          testsCreated: 0,
          testsSkipped: 0,
          flashcardsTarget: options.generateFlashcards ? flashcardsTarget : 0,
          flashcardsCreated: 0,
          flashcardsSkipped: 0,
          errors: [],
          status: 'pending',
          logs: []
        };

        // Custom generation logic for base packages
        if (options.isBasePackage && options.mode === 'OVERWRITE') {
          // For base packages in OVERWRITE mode, clear existing content first
          await this.clearTopicContent(assistantId, topicSlug, options.generateTests, options.generateFlashcards);
          progress.logs.push("🗑️ Contenido anterior eliminado para paquete base");
        }

        await testFlashcardAdvancedGenerator.generateForSingleTopic(
          assistantId,
          topicData,
          topicProgress,
          (updatedProgress: GenerationProgress) => {
            progress.testsCreated = updatedProgress.testsCreated;
            progress.flashcardsCreated = updatedProgress.flashcardsCreated;

            updatedProgress.logs.forEach(log => progress.logs.push(`  ${log}`));
            onProgress?.(progress);
          }
        );

        result.testsCreated = topicProgress.testsCreated;
        result.flashcardsCreated = topicProgress.flashcardsCreated;
        result.errors.push(...topicProgress.errors);

        // For base packages, ensure we meet minimum requirements
        if (options.isBasePackage) {
          if (options.generateTests && result.testsCreated < testsTarget) {
            progress.logs.push(`⚠️ Base package: ${result.testsCreated}/${testsTarget} tests creados. Intentando completar...`);
            // TODO: Retry logic for base package completion
          }
          if (options.generateFlashcards && result.flashcardsCreated < flashcardsTarget) {
            progress.logs.push(`⚠️ Base package: ${result.flashcardsCreated}/${flashcardsTarget} flashcards creadas. Intentando completar...`);
            // TODO: Retry logic for base package completion
          }
        }
      }

      // Step 3: Generate PDF (non-blocking)
      if (options.generatePDF) {
        progress.step = 'pdf';
        progress.logs.push("📄 Generando PDF...");
        onProgress?.(progress);

        try {
          const pdfResult = await pdfGenerationService.generateTopicPDF(assistantId, topicSlug);
          result.pdfGenerated = true;
          result.pdfUrl = pdfResult.pdfUrl;
          progress.logs.push("✅ PDF generado");
        } catch (pdfError) {
          progress.logs.push(`⚠️ PDF falló (no crítico): ${pdfError.message}`);
          result.errors.push(`PDF error: ${pdfError.message}`);
        }
      }

      progress.step = 'completed';
      progress.logs.push("🎉 Contenido del tema completado");
      onProgress?.(progress);

      result.success = result.errors.length === 0 || result.testsCreated > 0 || result.flashcardsCreated > 0;

    } catch (error) {
      console.error(`Error generando contenido para ${topicSlug}:`, error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Generate PDFs for all published topics
   */
  async generateAllPDFs(
    assistantId: string,
    throwOnError: boolean = false
  ): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      success: false,
      processed: 0,
      successful: 0,
      failed: 0,
      results: {}
    };

    try {
      // Get all published topics
      const syllabusRef = collection(db, 'assistants', assistantId, 'syllabus');
      const publishedQuery = query(
        syllabusRef,
        where('status', '==', 'published'),
        orderBy('order', 'asc')
      );
      const syllabusSnapshot = await getDocs(publishedQuery);
      const topics = syllabusSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      result.processed = topics.length;

      for (const topic of topics) {
        try {
          const pdfResult = await pdfGenerationService.generateTopicPDF(assistantId, topic.slug);
          result.results[topic.slug] = { success: true, pdfUrl: pdfResult.pdfUrl };
          result.successful++;
        } catch (error) {
          result.results[topic.slug] = { success: false, error: error.message };
          result.failed++;

          if (throwOnError) {
            throw error;
          }
        }
      }

      result.success = result.successful > 0;

    } catch (error) {
      console.error("Error en generación masiva de PDFs:", error);

      if (throwOnError) {
        throw error;
      }
    }

    return result;
  }

  /**
   * Generate tests for all published topics
   */
  async generateAllTests(
    assistantId: string,
    mode: 'OVERWRITE' | 'ADD' = 'OVERWRITE',
    testsToAdd: number = 20
  ): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      success: false,
      processed: 0,
      successful: 0,
      failed: 0,
      results: {}
    };

    try {
      // Get all published topics
      const syllabusRef = collection(db, 'assistants', assistantId, 'syllabus');
      const publishedQuery = query(
        syllabusRef,
        where('status', '==', 'published'),
        orderBy('order', 'asc')
      );
      const syllabusSnapshot = await getDocs(publishedQuery);
      const topics = syllabusSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      result.processed = topics.length;

      for (const topic of topics) {
        try {
          const topicProgress: GenerationProgress = {
            topicSlug: topic.slug,
            topicTitle: topic.title,
            testsTarget: mode === 'OVERWRITE' ? 20 : testsToAdd,
            testsCreated: 0,
            testsSkipped: 0,
            flashcardsTarget: 0, // Only tests
            flashcardsCreated: 0,
            flashcardsSkipped: 0,
            errors: [],
            status: 'pending',
            logs: []
          };

          // Generate only tests for this topic
          await testFlashcardAdvancedGenerator.generateForSingleTopic(
            assistantId,
            topic,
            topicProgress
          );

          result.results[topic.slug] = {
            success: topicProgress.errors.length === 0,
            error: topicProgress.errors.join(', ') || undefined
          };

          if (topicProgress.errors.length === 0) {
            result.successful++;
          } else {
            result.failed++;
          }

        } catch (error) {
          result.results[topic.slug] = { success: false, error: error.message };
          result.failed++;
        }
      }

      result.success = result.successful > 0;

    } catch (error) {
      console.error("Error en generación masiva de tests:", error);
      throw error;
    }

    return result;
  }

  /**
   * Generate flashcards for all published topics
   */
  async generateAllFlashcards(
    assistantId: string,
    mode: 'OVERWRITE' | 'ADD' = 'OVERWRITE',
    flashcardsToAdd: number = 45
  ): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      success: false,
      processed: 0,
      successful: 0,
      failed: 0,
      results: {}
    };

    try {
      // Get all published topics
      const syllabusRef = collection(db, 'assistants', assistantId, 'syllabus');
      const publishedQuery = query(
        syllabusRef,
        where('status', '==', 'published'),
        orderBy('order', 'asc')
      );
      const syllabusSnapshot = await getDocs(publishedQuery);
      const topics = syllabusSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      result.processed = topics.length;

      for (const topic of topics) {
        try {
          const topicProgress: GenerationProgress = {
            topicSlug: topic.slug,
            topicTitle: topic.title,
            testsTarget: 0, // Only flashcards
            testsCreated: 0,
            testsSkipped: 0,
            flashcardsTarget: mode === 'OVERWRITE' ? 45 : flashcardsToAdd,
            flashcardsCreated: 0,
            flashcardsSkipped: 0,
            errors: [],
            status: 'pending',
            logs: []
          };

          // Generate only flashcards for this topic
          await testFlashcardAdvancedGenerator.generateForSingleTopic(
            assistantId,
            topic,
            topicProgress
          );

          result.results[topic.slug] = {
            success: topicProgress.errors.length === 0,
            error: topicProgress.errors.join(', ') || undefined
          };

          if (topicProgress.errors.length === 0) {
            result.successful++;
          } else {
            result.failed++;
          }

        } catch (error) {
          result.results[topic.slug] = { success: false, error: error.message };
          result.failed++;
        }
      }

      result.success = result.successful > 0;

    } catch (error) {
      console.error("Error en generación masiva de flashcards:", error);
      throw error;
    }

    return result;
  }

  /**
   * Clear existing content for a topic (for base package overwrite)
   */
  private async clearTopicContent(
    assistantId: string,
    topicSlug: string,
    clearTests: boolean = true,
    clearFlashcards: boolean = true
  ): Promise<void> {
    try {
      const promises = [];

      if (clearTests) {
        // Delete all tests in the subcollection
        const testsRef = collection(db, 'assistants', assistantId, 'syllabus', topicSlug, 'tests');
        const testsSnapshot = await getDocs(testsRef);

        testsSnapshot.docs.forEach(testDoc => {
          promises.push(testDoc.ref.delete());
        });

        // Delete corresponding test keys
        testsSnapshot.docs.forEach(testDoc => {
          const testData = testDoc.data();
          if (testData.stemHash) {
            const keyPath = `${assistantId}:${topicSlug}:${testData.stemHash}`;
            promises.push(doc(db, 'tests_keys', keyPath).delete());
          }
        });
      }

      if (clearFlashcards) {
        // Delete all flashcards in the subcollection
        const flashcardsRef = collection(db, 'assistants', assistantId, 'syllabus', topicSlug, 'flashcards');
        const flashcardsSnapshot = await getDocs(flashcardsRef);

        flashcardsSnapshot.docs.forEach(flashcardDoc => {
          promises.push(flashcardDoc.ref.delete());
        });

        // Delete corresponding flashcard keys
        flashcardsSnapshot.docs.forEach(flashcardDoc => {
          const flashcardData = flashcardDoc.data();
          if (flashcardData.cardHash) {
            const keyPath = `${assistantId}:${topicSlug}:${flashcardData.cardHash}`;
            promises.push(doc(db, 'flashcard_keys', keyPath).delete());
          }
        });
      }

      await Promise.all(promises);

      // Reset counters
      const topicRef = doc(db, 'assistants', assistantId, 'syllabus', topicSlug);
      const updateData: any = { updatedAtMs: Date.now() };

      if (clearTests) updateData.testsCount = 0;
      if (clearFlashcards) updateData.flashcardsCount = 0;

      await updateDoc(topicRef, updateData);

    } catch (error) {
      console.error('Error clearing topic content:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive statistics for an assistant
   */
  async getContentStatistics(assistantId: string) {
    try {
      const syllabusRef = collection(db, 'assistants', assistantId, 'syllabus');
      const syllabusSnapshot = await getDocs(query(syllabusRef, orderBy('order', 'asc')));
      const topics = syllabusSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const stats = {
        total: topics.length,
        published: topics.filter(t => t.status === 'published').length,
        withPDF: topics.filter(t => t.pdfUrl).length,
        totalTests: topics.reduce((sum, t) => sum + (t.testsCount || 0), 0),
        totalFlashcards: topics.reduce((sum, t) => sum + (t.flashcardsCount || 0), 0),
        completeTopics: topics.filter(t =>
          t.status === 'published' &&
          t.testsCount >= 20 &&
          t.flashcardsCount >= 45 &&
          t.pdfUrl
        ).length,
        partialTopics: topics.filter(t =>
          t.status === 'published' &&
          (t.testsCount > 0 || t.flashcardsCount > 0) &&
          !(t.testsCount >= 20 && t.flashcardsCount >= 45 && t.pdfUrl)
        ).length,
        emptyTopics: topics.filter(t =>
          !t.testsCount && !t.flashcardsCount && !t.pdfUrl
        ).length
      };

      return stats;
    } catch (error) {
      console.error("Error getting content statistics:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const unifiedContentManager = new UnifiedContentManager();
