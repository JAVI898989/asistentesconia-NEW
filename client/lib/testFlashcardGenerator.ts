import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  upsertTestWithKey,
  upsertFlashcardWithKey,
  clearTopicTestsAndFlashcards,
  updateTopicCounters,
  getTestHash,
  getFlashcardHash,
  normalize
} from "./dedupeUtils";

export interface TestQuestion {
  id?: string;
  stem: string;
  options: string[]; // [A, B, C, D]
  answer: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  section: string;
  difficulty: 1 | 2 | 3;
  stemHash?: string;
  createdAt?: any;
  assistantId?: string;
  slug?: string;
}

export interface Flashcard {
  id?: string;
  front: string;
  back: string;
  tags: string[];
  cardHash?: string;
  createdAt?: any;
  assistantId?: string;
  slug?: string;
}

export interface GenerationResult {
  success: boolean;
  testsCreated: number;
  flashcardsCreated: number;
  testsSkipped: number;
  flashcardsSkipped: number;
  errors: string[];
  qualityIssues: string[];
}

export interface GenerationOptions {
  mode: 'OVERWRITE' | 'ADD';
  testsToAdd?: number; // Only for ADD mode
  flashcardsToAdd?: number; // Only for ADD mode
  qualityGates?: boolean; // Enable quality validation
  maxRetries?: number; // Max retries for quality issues
}

class TestFlashcardGenerator {
  private readonly MIN_TESTS = 20;
  private readonly MIN_FLASHCARDS = 45;
  private readonly UNIQUE_RATIO_THRESHOLD = 0.95;
  
  /**
   * Main method to regenerate tests and flashcards for a topic
   */
  async regenerateTopicContent(
    assistantId: string,
    slug: string,
    contentMarkdown: string,
    title: string,
    options: GenerationOptions = { mode: 'OVERWRITE', qualityGates: true, maxRetries: 3 }
  ): Promise<GenerationResult> {
    console.log(`🔄 Regenerating content for ${slug} in ${options.mode} mode`);
    
    const result: GenerationResult = {
      success: false,
      testsCreated: 0,
      flashcardsCreated: 0,
      testsSkipped: 0,
      flashcardsSkipped: 0,
      errors: [],
      qualityIssues: []
    };

    try {
      // Clear existing content if OVERWRITE mode
      if (options.mode === 'OVERWRITE') {
        console.log(`🗑️ Clearing existing content for ${slug}`);
        const clearResult = await clearTopicTestsAndFlashcards(assistantId, slug);
        console.log(`✅ Cleared ${clearResult.testsDeleted} tests and ${clearResult.flashcardsDeleted} flashcards`);
        
        if (clearResult.errors.length > 0) {
          result.errors.push(...clearResult.errors);
        }
      }

      // Generate tests
      const testsTarget = options.mode === 'OVERWRITE' ? this.MIN_TESTS : (options.testsToAdd || 10);
      const testResult = await this.generateTests(
        assistantId, 
        slug, 
        contentMarkdown, 
        title, 
        testsTarget,
        options
      );
      
      result.testsCreated = testResult.created;
      result.testsSkipped = testResult.skipped;
      result.errors.push(...testResult.errors);
      result.qualityIssues.push(...testResult.qualityIssues);

      // Generate flashcards
      const flashcardsTarget = options.mode === 'OVERWRITE' ? this.MIN_FLASHCARDS : (options.flashcardsToAdd || 25);
      const flashcardResult = await this.generateFlashcards(
        assistantId, 
        slug, 
        contentMarkdown, 
        title, 
        flashcardsTarget,
        options
      );
      
      result.flashcardsCreated = flashcardResult.created;
      result.flashcardsSkipped = flashcardResult.skipped;
      result.errors.push(...flashcardResult.errors);
      result.qualityIssues.push(...flashcardResult.qualityIssues);

      // Update counters
      await updateTopicCounters(assistantId, slug);

      // Quality validation for OVERWRITE mode
      if (options.mode === 'OVERWRITE' && options.qualityGates) {
        const qualityCheck = await this.validateQuality(assistantId, slug);
        if (!qualityCheck.passed) {
          result.qualityIssues.push(...qualityCheck.issues);
          
          // If quality is too poor and we have retries left, try again
          if (qualityCheck.critical && (options.maxRetries || 0) > 0) {
            console.warn(`⚠️ Quality issues detected for ${slug}, retrying...`);
            const retryOptions = { ...options, maxRetries: (options.maxRetries || 0) - 1 };
            return await this.regenerateTopicContent(assistantId, slug, contentMarkdown, title, retryOptions);
          }
        }
      }

      result.success = true;
      console.log(`✅ Content regeneration completed for ${slug}: ${result.testsCreated} tests, ${result.flashcardsCreated} flashcards`);

    } catch (error) {
      console.error(`❌ Error regenerating content for ${slug}:`, error);
      result.errors.push(`General error: ${error.message}`);
    }

    return result;
  }

  /**
   * Generate tests using AI with quality gates
   */
  private async generateTests(
    assistantId: string,
    slug: string,
    contentMarkdown: string,
    title: string,
    targetCount: number,
    options: GenerationOptions
  ): Promise<{ created: number; skipped: number; errors: string[]; qualityIssues: string[] }> {
    const result = { created: 0, skipped: 0, errors: [], qualityIssues: [] };

    try {
      console.log(`📝 Generating ${targetCount} tests for ${slug}`);

      // Extract sections from markdown for balanced coverage
      const sections = this.extractSections(contentMarkdown);
      const testsPerSection = Math.ceil(targetCount / Math.max(sections.length, 1));

      // Generate tests in batches
      const batchSize = 5;
      const batches = Math.ceil(targetCount / batchSize);
      
      for (let batch = 0; batch < batches; batch++) {
        const currentBatchSize = Math.min(batchSize, targetCount - (batch * batchSize));
        if (currentBatchSize <= 0) break;

        try {
          const batchTests = await this.generateTestBatch(
            contentMarkdown,
            title,
            sections,
            currentBatchSize,
            testsPerSection
          );

          // Validate and insert each test
          for (const test of batchTests) {
            const validation = this.validateTest(test);
            if (!validation.valid) {
              result.qualityIssues.push(`Test validation failed: ${validation.reason}`);
              continue;
            }

            const insertResult = await upsertTestWithKey(assistantId, slug, {
              ...test,
              assistantId,
              slug
            });

            if (insertResult.created) {
              result.created++;
            } else {
              result.skipped++;
              if (insertResult.reason === 'duplicate_stem') {
                console.log(`⏭️ Skipped duplicate test: ${test.stem.substring(0, 50)}...`);
              }
            }
          }

        } catch (batchError) {
          console.error(`❌ Error in test batch ${batch}:`, batchError);
          result.errors.push(`Batch ${batch} error: ${batchError.message}`);
        }

        // Small delay between batches to avoid rate limits
        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

    } catch (error) {
      console.error('Error generating tests:', error);
      result.errors.push(`Test generation error: ${error.message}`);
    }

    return result;
  }

  /**
   * Generate flashcards using AI with quality gates
   */
  private async generateFlashcards(
    assistantId: string,
    slug: string,
    contentMarkdown: string,
    title: string,
    targetCount: number,
    options: GenerationOptions
  ): Promise<{ created: number; skipped: number; errors: string[]; qualityIssues: string[] }> {
    const result = { created: 0, skipped: 0, errors: [], qualityIssues: [] };

    try {
      console.log(`💳 Generating ${targetCount} flashcards for ${slug}`);

      // Extract sections for tagging
      const sections = this.extractSections(contentMarkdown);

      // Generate flashcards in batches
      const batchSize = 10;
      const batches = Math.ceil(targetCount / batchSize);
      
      for (let batch = 0; batch < batches; batch++) {
        const currentBatchSize = Math.min(batchSize, targetCount - (batch * batchSize));
        if (currentBatchSize <= 0) break;

        try {
          const batchCards = await this.generateFlashcardBatch(
            contentMarkdown,
            title,
            sections,
            currentBatchSize
          );

          // Validate and insert each flashcard
          for (const card of batchCards) {
            const validation = this.validateFlashcard(card);
            if (!validation.valid) {
              result.qualityIssues.push(`Flashcard validation failed: ${validation.reason}`);
              continue;
            }

            const insertResult = await upsertFlashcardWithKey(assistantId, slug, {
              ...card,
              assistantId,
              slug
            });

            if (insertResult.created) {
              result.created++;
            } else {
              result.skipped++;
              if (insertResult.reason === 'duplicate_content') {
                console.log(`⏭️ Skipped duplicate flashcard: ${card.front.substring(0, 30)}...`);
              }
            }
          }

        } catch (batchError) {
          console.error(`❌ Error in flashcard batch ${batch}:`, batchError);
          result.errors.push(`Batch ${batch} error: ${batchError.message}`);
        }

        // Small delay between batches to avoid rate limits
        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

    } catch (error) {
      console.error('Error generating flashcards:', error);
      result.errors.push(`Flashcard generation error: ${error.message}`);
    }

    return result;
  }

  /**
   * Generate a batch of tests using AI
   */
  private async generateTestBatch(
    contentMarkdown: string,
    title: string,
    sections: string[],
    count: number,
    testsPerSection: number
  ): Promise<TestQuestion[]> {
    const response = await fetch('/api/generate-tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentMarkdown,
        title,
        sections,
        count,
        testsPerSection,
        requirements: {
          exactOptions: 4,
          forbiddenPatterns: ['todas las anteriores', 'ninguna de las anteriores', 'todas'],
          difficultyDistribution: { 1: 0.3, 2: 0.5, 3: 0.2 },
          balancedCoverage: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Test generation API failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.tests) {
      throw new Error('Invalid response from test generation API');
    }

    return data.tests;
  }

  /**
   * Generate a batch of flashcards using AI
   */
  private async generateFlashcardBatch(
    contentMarkdown: string,
    title: string,
    sections: string[],
    count: number
  ): Promise<Flashcard[]> {
    const response = await fetch('/api/generate-flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentMarkdown,
        title,
        sections,
        count,
        requirements: {
          oneLinePerSide: true,
          concreteDefinitions: true,
          sectionTags: true,
          noMarkdown: true,
          utf8Spanish: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Flashcard generation API failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.flashcards) {
      throw new Error('Invalid response from flashcard generation API');
    }

    return data.flashcards;
  }

  /**
   * Extract main sections from markdown content
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
   * Validate a test question
   */
  private validateTest(test: TestQuestion): { valid: boolean; reason?: string } {
    if (!test.stem || test.stem.length < 20) {
      return { valid: false, reason: 'Stem too short' };
    }

    if (!test.options || test.options.length !== 4) {
      return { valid: false, reason: 'Must have exactly 4 options' };
    }

    if (!['A', 'B', 'C', 'D'].includes(test.answer)) {
      return { valid: false, reason: 'Invalid answer format' };
    }

    if (!test.rationale || test.rationale.length < 10) {
      return { valid: false, reason: 'Rationale too short' };
    }

    // Check for forbidden patterns
    const forbiddenPatterns = ['todas las anteriores', 'ninguna de las anteriores', 'todas', 'ninguna'];
    for (const option of test.options) {
      for (const pattern of forbiddenPatterns) {
        if (option.toLowerCase().includes(pattern)) {
          return { valid: false, reason: 'Contains forbidden pattern' };
        }
      }
    }

    // Check for unique options
    const uniqueOptions = new Set(test.options.map(o => normalize(o)));
    if (uniqueOptions.size !== test.options.length) {
      return { valid: false, reason: 'Non-unique options' };
    }

    return { valid: true };
  }

  /**
   * Validate a flashcard
   */
  private validateFlashcard(card: Flashcard): { valid: boolean; reason?: string } {
    if (!card.front || card.front.length < 5) {
      return { valid: false, reason: 'Front side too short' };
    }

    if (!card.back || card.back.length < 5) {
      return { valid: false, reason: 'Back side too short' };
    }

    // Check for one line per side
    if (card.front.split('\n').length > 1 || card.back.split('\n').length > 1) {
      return { valid: false, reason: 'Multiple lines detected' };
    }

    if (!card.tags || card.tags.length === 0) {
      return { valid: false, reason: 'Missing tags' };
    }

    return { valid: true };
  }

  /**
   * Validate the overall quality of generated content
   */
  private async validateQuality(
    assistantId: string,
    slug: string
  ): Promise<{ passed: boolean; critical: boolean; issues: string[] }> {
    const issues: string[] = [];
    let critical = false;

    try {
      // Count tests and flashcards
      const testsSnapshot = await getDocs(collection(db, 'assistants', assistantId, 'syllabus', slug, 'tests'));
      const flashcardsSnapshot = await getDocs(collection(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards'));

      const testsCount = testsSnapshot.size;
      const flashcardsCount = flashcardsSnapshot.size;

      // Check minimum counts
      if (testsCount < this.MIN_TESTS) {
        issues.push(`Insufficient tests: ${testsCount}/${this.MIN_TESTS}`);
        critical = true;
      }

      if (flashcardsCount < this.MIN_FLASHCARDS) {
        issues.push(`Insufficient flashcards: ${flashcardsCount}/${this.MIN_FLASHCARDS}`);
        critical = true;
      }

      // Check uniqueness ratio for tests
      if (testsCount > 0) {
        const testStems = testsSnapshot.docs.map(doc => doc.data().stem);
        const uniqueStems = new Set(testStems.map(stem => normalize(stem)));
        const uniqueRatio = uniqueStems.size / testStems.length;

        if (uniqueRatio < this.UNIQUE_RATIO_THRESHOLD) {
          issues.push(`Low test uniqueness: ${(uniqueRatio * 100).toFixed(1)}%`);
          if (uniqueRatio < 0.8) {
            critical = true;
          }
        }
      }

      // Check section coverage for tests
      if (testsCount >= 10) {
        const sections = testsSnapshot.docs.map(doc => doc.data().section);
        const uniqueSections = new Set(sections);
        
        if (uniqueSections.size < 3) {
          issues.push(`Poor section coverage: ${uniqueSections.size} sections`);
        }
      }

    } catch (error) {
      console.error('Error validating quality:', error);
      issues.push(`Quality validation error: ${error.message}`);
    }

    const passed = issues.length === 0;
    return { passed, critical, issues };
  }
}

// Export singleton instance
export const testFlashcardGenerator = new TestFlashcardGenerator();
