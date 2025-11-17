import { collection, doc, getDoc, getDocs, setDoc, updateDoc, runTransaction, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export interface TestQuestion {
  id?: string;
  stem: string;
  options: string[]; // [A, B, C, D]
  answer: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  section: string;
  difficulty: 1 | 2 | 3;
  stemHash?: string;
  assistantId: string;
  slug: string;
  createdAt?: any;
}

export interface Flashcard {
  id?: string;
  front: string;
  back: string;
  tags: string[];
  cardHash?: string;
  assistantId: string;
  slug: string;
  createdAt?: any;
}

export interface GenerationProgress {
  topicSlug: string;
  topicTitle: string;
  testsTarget: number;
  testsCreated: number;
  testsSkipped: number;
  flashcardsTarget: number;
  flashcardsCreated: number;
  flashcardsSkipped: number;
  errors: string[];
  status: 'pending' | 'generating-tests' | 'generating-flashcards' | 'completed' | 'error';
  logs: string[];
}

export interface GenerationResult {
  success: boolean;
  topicResults: GenerationProgress[];
  totalTestsCreated: number;
  totalFlashcardsCreated: number;
  totalTestsSkipped: number;
  totalFlashcardsSkipped: number;
  totalErrors: number;
}

// Utility functions for hashing and normalization
export function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

// Simple hash function for browser compatibility
function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36).padStart(8, '0').substring(0, 16);
}

export function getStemHash(stem: string): string {
  const normalized = normalize(stem);
  return simpleHash(normalized);
}

export function getCardHash(front: string, back: string): string {
  const normalized = normalize(front) + '|' + normalize(back);
  return simpleHash(normalized);
}

class TestFlashcardAdvancedGenerator {
  private readonly EXACT_TESTS_COUNT = 20;
  private readonly MIN_FLASHCARDS_COUNT = 45;
  private readonly GC_TESTS_COUNT = 5; // Guardia Civil specific
  private readonly GC_FLASHCARDS_COUNT = 40; // Guardia Civil specific

  /**
   * Get appropriate counts based on assistant type
   */
  private getCountsForAssistant(assistantId: string): { testsCount: number; flashcardsCount: number } {
    if (assistantId === 'guardia-civil') {
      return {
        testsCount: this.GC_TESTS_COUNT,
        flashcardsCount: this.GC_FLASHCARDS_COUNT
      };
    }
    return {
      testsCount: this.EXACT_TESTS_COUNT,
      flashcardsCount: this.MIN_FLASHCARDS_COUNT
    };
  }

  /**
   * Generate tests and flashcards for all published topics
   */
  async generateForAllTopics(
    assistantId: string,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<GenerationResult> {
    console.log(`🚀 Starting test/flashcard generation for assistant ${assistantId}`);

    const result: GenerationResult = {
      success: false,
      topicResults: [],
      totalTestsCreated: 0,
      totalFlashcardsCreated: 0,
      totalTestsSkipped: 0,
      totalFlashcardsSkipped: 0,
      totalErrors: 0
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

      console.log(`📚 Found ${topics.length} published topics to process`);

      for (const topic of topics) {
        const topicProgress: GenerationProgress = {
          topicSlug: topic.slug,
          topicTitle: topic.title,
          testsTarget: this.EXACT_TESTS_COUNT,
          testsCreated: 0,
          testsSkipped: 0,
          flashcardsTarget: this.MIN_FLASHCARDS_COUNT,
          flashcardsCreated: 0,
          flashcardsSkipped: 0,
          errors: [],
          status: 'pending',
          logs: []
        };

        result.topicResults.push(topicProgress);

        try {
          await this.generateForSingleTopic(assistantId, topic, topicProgress, onProgress);
        } catch (error) {
          console.error(`❌ Error processing topic ${topic.slug}:`, error);
          topicProgress.status = 'error';
          topicProgress.errors.push(`Topic generation failed: ${error.message}`);
        }

        // Update totals
        result.totalTestsCreated += topicProgress.testsCreated;
        result.totalFlashcardsCreated += topicProgress.flashcardsCreated;
        result.totalTestsSkipped += topicProgress.testsSkipped;
        result.totalFlashcardsSkipped += topicProgress.flashcardsSkipped;
        result.totalErrors += topicProgress.errors.length;
      }

      result.success = result.totalErrors === 0;
      console.log(`✅ Generation complete: ${result.totalTestsCreated} tests, ${result.totalFlashcardsCreated} flashcards`);

    } catch (error) {
      console.error('❌ Error in generateForAllTopics:', error);
      result.success = false;
    }

    return result;
  }

  /**
   * Generate tests and flashcards for a single topic
   */
  async generateForSingleTopic(
    assistantId: string,
    topic: any,
    progress: GenerationProgress,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<void> {
    console.log(`📝 Processing topic: ${topic.title}`);

    progress.status = 'generating-tests';
    progress.logs.push(`🔄 Starting generation for ${topic.title}`);
    onProgress?.(progress);

    try {
      // Read the MDX content for this topic
      const topicDoc = await getDoc(doc(db, 'assistants', assistantId, 'syllabus', topic.slug));
      if (!topicDoc.exists()) {
        throw new Error(`Topic document not found: ${topic.slug}`);
      }

      const topicData = topicDoc.data();
      const contentMarkdown = topicData.mdxContent || topicData.content || '';

      if (!contentMarkdown) {
        throw new Error(`No content found for topic: ${topic.slug}`);
      }

      progress.logs.push(`📖 Content loaded (${contentMarkdown.length} chars)`);

      // Generate tests first
      progress.status = 'generating-tests';
      onProgress?.(progress);

      // Generate tests if target > 0
      if (progress.testsTarget > 0) {
        const testResult = await this.generateTests(
          assistantId,
          topic.slug,
          contentMarkdown,
          topic.title,
          progress.testsTarget,
          progress,
          progress.testsTarget === 5 // Base package if exactly 5 tests
        );

        progress.testsCreated = testResult.created;
        progress.testsSkipped = testResult.skipped;
        progress.errors.push(...testResult.errors);
        progress.logs.push(`✅ Tests: ${testResult.created} created, ${testResult.skipped} skipped`);
      }

      // Generate flashcards if target > 0
      if (progress.flashcardsTarget > 0) {
        progress.status = 'generating-flashcards';
        onProgress?.(progress);

        const flashcardResult = await this.generateFlashcards(
          assistantId,
          topic.slug,
          contentMarkdown,
          topic.title,
          progress.flashcardsTarget,
          progress
        );

        progress.flashcardsCreated = flashcardResult.created;
        progress.flashcardsSkipped = flashcardResult.skipped;
        progress.errors.push(...flashcardResult.errors);
        progress.logs.push(`✅ Flashcards: ${flashcardResult.created} created, ${flashcardResult.skipped} skipped`);
      }

      // Update topic counters
      await this.updateTopicCounters(assistantId, topic.slug);
      progress.logs.push(`📊 Counters updated`);

      // Quality validation
      const qualityCheck = await this.validateQuality(assistantId, topic.slug);
      if (!qualityCheck.passed) {
        progress.errors.push(...qualityCheck.issues);
        progress.logs.push(`⚠️ Quality issues: ${qualityCheck.issues.length}`);
      }

      progress.status = 'completed';
      progress.logs.push(`🎉 Topic completed successfully`);

    } catch (error) {
      console.error(`❌ Error in generateForSingleTopic for ${topic.slug}:`, error);
      progress.status = 'error';
      progress.errors.push(`Generation failed: ${error.message}`);
      progress.logs.push(`❌ Error: ${error.message}`);
    }

    onProgress?.(progress);
  }

  /**
   * Generate tests with anti-duplication
   */
  private async generateTests(
    assistantId: string,
    slug: string,
    contentMarkdown: string,
    title: string,
    targetCount: number,
    progress: GenerationProgress,
    isBasePackage: boolean = false
  ): Promise<{ created: number; skipped: number; errors: string[] }> {
    const result = { created: 0, skipped: 0, errors: [] };

    try {
      // Extract sections for balanced coverage
      const sections = this.extractSections(contentMarkdown);
      progress.logs.push(`📑 Extracted ${sections.length} sections`);

      // Generate tests in batches to avoid rate limits
      const batchSize = 5;
      const batches = Math.ceil(targetCount / batchSize);

      for (let batch = 0; batch < batches; batch++) {
        const currentBatchSize = Math.min(batchSize, targetCount - (batch * batchSize));
        if (currentBatchSize <= 0) break;

        progress.logs.push(`🔄 Generating test batch ${batch + 1}/${batches} (${currentBatchSize} tests)`);

        try {
          const batchTests = await this.generateTestBatch(
            contentMarkdown,
            title,
            sections,
            currentBatchSize
          );

          // Process each test with anti-duplication
          for (const test of batchTests) {
            const insertResult = await this.insertTestWithDeduplication(assistantId, slug, test);

            if (insertResult.created) {
              result.created++;
              progress.logs.push(`✅ Test created: ${test.stem.substring(0, 50)}...`);
            } else {
              result.skipped++;
              progress.logs.push(`⏭️ Test skipped (duplicate): ${test.stem.substring(0, 30)}...`);
            }
          }

        } catch (batchError) {
          console.error(`❌ Error in test batch ${batch}:`, batchError);
          result.errors.push(`Batch ${batch} error: ${batchError.message}`);
          progress.logs.push(`❌ Batch error: ${batchError.message}`);
        }

        // Delay between batches
        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // If we don't have enough tests, try to generate more
      if (result.created < targetCount) {
        const remaining = targetCount - result.created;
        progress.logs.push(`🔄 Need ${remaining} more tests, generating additional batch`);

        try {
          const additionalTests = await this.generateTestBatch(
            contentMarkdown,
            title,
            sections,
            remaining * 2 // Generate extra to account for duplicates
          );

          for (const test of additionalTests) {
            if (result.created >= targetCount) break;

            const insertResult = await this.insertTestWithDeduplication(assistantId, slug, test);
            if (insertResult.created) {
              result.created++;
            } else {
              result.skipped++;
            }
          }
        } catch (error) {
          result.errors.push(`Additional test generation failed: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Error generating tests:', error);
      result.errors.push(`Test generation error: ${error.message}`);
    }

    return result;
  }

  /**
   * Generate flashcards with anti-duplication
   */
  private async generateFlashcards(
    assistantId: string,
    slug: string,
    contentMarkdown: string,
    title: string,
    targetCount: number,
    progress: GenerationProgress
  ): Promise<{ created: number; skipped: number; errors: string[] }> {
    const result = { created: 0, skipped: 0, errors: [] };

    try {
      const sections = this.extractSections(contentMarkdown);
      progress.logs.push(`💳 Generating flashcards from ${sections.length} sections`);

      // Generate flashcards in batches
      const batchSize = 10;
      const batches = Math.ceil(targetCount / batchSize);

      for (let batch = 0; batch < batches; batch++) {
        const currentBatchSize = Math.min(batchSize, targetCount - (batch * batchSize));
        if (currentBatchSize <= 0) break;

        progress.logs.push(`🔄 Generating flashcard batch ${batch + 1}/${batches} (${currentBatchSize} cards)`);

        try {
          const batchCards = await this.generateFlashcardBatch(
            contentMarkdown,
            title,
            sections,
            currentBatchSize
          );

          // Process each flashcard with anti-duplication
          for (const card of batchCards) {
            const insertResult = await this.insertFlashcardWithDeduplication(assistantId, slug, card);

            if (insertResult.created) {
              result.created++;
              progress.logs.push(`✅ Flashcard created: ${card.front.substring(0, 30)}...`);
            } else {
              result.skipped++;
              progress.logs.push(`⏭️ Flashcard skipped (duplicate): ${card.front.substring(0, 20)}...`);
            }
          }

        } catch (batchError) {
          console.error(`❌ Error in flashcard batch ${batch}:`, batchError);
          result.errors.push(`Batch ${batch} error: ${batchError.message}`);
          progress.logs.push(`❌ Batch error: ${batchError.message}`);
        }

        // Delay between batches
        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // If we don't have enough flashcards, generate more
      if (result.created < targetCount) {
        const remaining = targetCount - result.created;
        progress.logs.push(`🔄 Need ${remaining} more flashcards, generating additional batch`);

        try {
          const additionalCards = await this.generateFlashcardBatch(
            contentMarkdown,
            title,
            sections,
            remaining * 2 // Generate extra to account for duplicates
          );

          for (const card of additionalCards) {
            if (result.created >= targetCount) break;

            const insertResult = await this.insertFlashcardWithDeduplication(assistantId, slug, card);
            if (insertResult.created) {
              result.created++;
            } else {
              result.skipped++;
            }
          }
        } catch (error) {
          result.errors.push(`Additional flashcard generation failed: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Error generating flashcards:', error);
      result.errors.push(`Flashcard generation error: ${error.message}`);
    }

    return result;
  }

  /**
   * Insert test with anti-duplication using hash keys
   */
  private async insertTestWithDeduplication(
    assistantId: string,
    slug: string,
    test: TestQuestion
  ): Promise<{ created: boolean; reason?: string }> {
    const stemHash = getStemHash(test.stem);
    const keyPath = `${assistantId}:${slug}:${stemHash}`;

    try {
      return await runTransaction(db, async (transaction) => {
        // Check if key exists
        const keyRef = doc(db, 'tests_keys', keyPath);
        const keyDoc = await transaction.get(keyRef);

        if (keyDoc.exists()) {
          return { created: false, reason: 'duplicate_stem' };
        }

        // Create test document
        const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const testRef = doc(db, 'assistants', assistantId, 'syllabus', slug, 'tests', testId);

        const testData: TestQuestion = {
          id: testId,
          stem: test.stem,
          options: test.options,
          answer: test.answer,
          rationale: test.rationale,
          section: test.section,
          difficulty: test.difficulty,
          stemHash,
          assistantId,
          slug,
          createdAt: serverTimestamp()
        };

        // Insert test and key atomically
        transaction.set(testRef, testData);
        transaction.set(keyRef, {
          assistantId,
          slug,
          stemHash,
          createdAt: serverTimestamp()
        });

        return { created: true };
      });

    } catch (error) {
      console.error('Error inserting test:', error);
      return { created: false, reason: 'transaction_error' };
    }
  }

  /**
   * Insert flashcard with anti-duplication using hash keys
   */
  private async insertFlashcardWithDeduplication(
    assistantId: string,
    slug: string,
    card: Flashcard
  ): Promise<{ created: boolean; reason?: string }> {
    const cardHash = getCardHash(card.front, card.back);
    const keyPath = `${assistantId}:${slug}:${cardHash}`;

    try {
      return await runTransaction(db, async (transaction) => {
        // Check if key exists
        const keyRef = doc(db, 'flashcard_keys', keyPath);
        const keyDoc = await transaction.get(keyRef);

        if (keyDoc.exists()) {
          return { created: false, reason: 'duplicate_content' };
        }

        // Create flashcard document
        const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const cardRef = doc(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards', cardId);

        const cardData: Flashcard = {
          id: cardId,
          front: card.front,
          back: card.back,
          tags: card.tags,
          cardHash,
          assistantId,
          slug,
          createdAt: serverTimestamp()
        };

        // Insert flashcard and key atomically
        transaction.set(cardRef, cardData);
        transaction.set(keyRef, {
          assistantId,
          slug,
          cardHash,
          createdAt: serverTimestamp()
        });

        return { created: true };
      });

    } catch (error) {
      console.error('Error inserting flashcard:', error);
      return { created: false, reason: 'transaction_error' };
    }
  }

  /**
   * Update topic counters
   */
  private async updateTopicCounters(assistantId: string, slug: string): Promise<void> {
    try {
      // Count tests
      const testsSnapshot = await getDocs(
        collection(db, 'assistants', assistantId, 'syllabus', slug, 'tests')
      );
      const testsCount = testsSnapshot.size;

      // Count flashcards
      const flashcardsSnapshot = await getDocs(
        collection(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards')
      );
      const flashcardsCount = flashcardsSnapshot.size;

      // Update topic document
      const topicRef = doc(db, 'assistants', assistantId, 'syllabus', slug);
      await updateDoc(topicRef, {
        testsCount,
        flashcardsCount,
        updatedAtMs: Date.now(),
        updatedAt: serverTimestamp()
      });

      console.log(`📊 Updated counters for ${slug}: ${testsCount} tests, ${flashcardsCount} flashcards`);

    } catch (error) {
      console.error('Error updating topic counters:', error);
      throw error;
    }
  }

  /**
   * Generate test batch using AI
   */
  private async generateTestBatch(
    contentMarkdown: string,
    title: string,
    sections: string[],
    count: number,
    userApiKey?: string
  ): Promise<TestQuestion[]> {
    const response = await fetch('/api/generate-tests-advanced', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentMarkdown,
        title,
        sections,
        count,
        userApiKey: userApiKey || undefined,
        requirements: {
          exactOptions: 4,
          forbiddenPatterns: ['todas las anteriores', 'ninguna de las anteriores', 'todas', 'ninguna'],
          difficultyDistribution: { 1: 0.3, 2: 0.5, 3: 0.2 },
          balancedCoverage: true,
          spanishUtf8: true,
          qualityGates: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Test generation API failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.tests) {
      const errMsg = data?.errors?.join?.(', ') || data?.error || JSON.stringify(data);
      throw new Error(`Invalid response from test generation API: ${errMsg}`);
    }

    return data.tests.map((test: any) => ({
      stem: test.stem,
      options: test.options,
      answer: test.answer,
      rationale: test.rationale,
      section: test.section || 'General',
      difficulty: test.difficulty || 2
    }));
  }

  /**
   * Generate flashcard batch using AI
   */
  private async generateFlashcardBatch(
    contentMarkdown: string,
    title: string,
    sections: string[],
    count: number,
    userApiKey?: string
  ): Promise<Flashcard[]> {
    const response = await fetch('/api/generate-flashcards-advanced', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentMarkdown,
        title,
        sections,
        count,
        userApiKey: userApiKey || undefined,
        requirements: {
          oneLinePerSide: true,
          concreteDefinitions: true,
          sectionTags: true,
          noMarkdown: true,
          spanishUtf8: true,
          qualityGates: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Flashcard generation API failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.flashcards) {
      const errMsg = data?.errors?.join?.(', ') || data?.error || JSON.stringify(data);
      throw new Error(`Invalid response from flashcard generation API: ${errMsg}`);
    }

    return data.flashcards.map((card: any) => ({
      front: card.front,
      back: card.back,
      tags: card.tags || ['General']
    }));
  }

  /**
   * Extract sections from markdown content
   */
  private extractSections(contentMarkdown: string): string[] {
    const sections = [];
    const lines = contentMarkdown.split('\n');

    for (const line of lines) {
      if (line.match(/^##\s+/)) {
        const sectionTitle = line.replace(/^##\s+/, '').trim();
        if (sectionTitle && !sectionTitle.toLowerCase().includes('referencias')) {
          sections.push(sectionTitle);
        }
      }
    }

    return sections.length > 0 ? sections : ['General'];
  }

  /**
   * Validate quality of generated content
   */
  private async validateQuality(
    assistantId: string,
    slug: string
  ): Promise<{ passed: boolean; issues: string[] }> {
    const issues: string[] = [];

    try {
      // Count tests and flashcards
      const testsSnapshot = await getDocs(
        collection(db, 'assistants', assistantId, 'syllabus', slug, 'tests')
      );
      const flashcardsSnapshot = await getDocs(
        collection(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards')
      );

      const testsCount = testsSnapshot.size;
      const flashcardsCount = flashcardsSnapshot.size;

      // Check exact test count
      if (testsCount !== this.EXACT_TESTS_COUNT) {
        issues.push(`Tests count mismatch: ${testsCount}/${this.EXACT_TESTS_COUNT}`);
      }

      // Check minimum flashcard count
      if (flashcardsCount < this.MIN_FLASHCARDS_COUNT) {
        issues.push(`Insufficient flashcards: ${flashcardsCount}/${this.MIN_FLASHCARDS_COUNT}`);
      }

      // Check test uniqueness
      if (testsCount > 0) {
        const testStems = testsSnapshot.docs.map(doc => doc.data().stem);
        const uniqueStems = new Set(testStems.map(stem => normalize(stem)));
        const uniqueRatio = uniqueStems.size / testStems.length;

        if (uniqueRatio < 0.95) {
          issues.push(`Low test uniqueness: ${(uniqueRatio * 100).toFixed(1)}%`);
        }
      }

      // Check flashcard uniqueness
      if (flashcardsCount > 0) {
        const flashcardPairs = flashcardsSnapshot.docs.map(doc => {
          const data = doc.data();
          return normalize(data.front) + '|' + normalize(data.back);
        });
        const uniquePairs = new Set(flashcardPairs);
        const uniqueRatio = uniquePairs.size / flashcardPairs.length;

        if (uniqueRatio < 0.95) {
          issues.push(`Low flashcard uniqueness: ${(uniqueRatio * 100).toFixed(1)}%`);
        }
      }

    } catch (error) {
      console.error('Error validating quality:', error);
      issues.push(`Quality validation error: ${error.message}`);
    }

    return { passed: issues.length === 0, issues };
  }
}

// Export singleton instance
export const testFlashcardAdvancedGenerator = new TestFlashcardAdvancedGenerator();
