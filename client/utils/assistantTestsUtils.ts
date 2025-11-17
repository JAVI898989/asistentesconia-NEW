import { assistantTests } from '../data/assistantTests';
import { doc, setDoc, getDoc, collection, getDocs, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db, auth } from '@/lib/simpleAuth';
import { onAuthStateChanged } from 'firebase/auth';

// Storage quota management
const getStorageUsage = () => {
  let totalSize = 0;
  for (const key in sessionStorage) {
    if (sessionStorage.hasOwnProperty(key)) {
      totalSize += sessionStorage.getItem(key)?.length || 0;
    }
  }
  return totalSize;
};

const getStorageSizeInMB = (sizeInBytes: number) => {
  return (sizeInBytes / (1024 * 1024)).toFixed(2);
};

const cleanOldTestData = (preserveKey?: string) => {
  const testKeys = Object.keys(sessionStorage)
    .filter(key => key.startsWith('assistant_tests_'))
    .filter(key => key !== preserveKey)
    .sort(); // Sort to remove oldest first

  let clearedCount = 0;
  for (const key of testKeys) {
    try {
      sessionStorage.removeItem(key);
      clearedCount++;
      console.log(`🗑️ Removed: ${key}`);

      // Check if we have enough space now
      const currentUsage = getStorageUsage();
      if (currentUsage < 3 * 1024 * 1024) { // Under 3MB
        break;
      }
    } catch (error) {
      console.warn(`Error removing ${key}:`, error);
    }
  }

  console.log(`🧹 Cleaned ${clearedCount} old test data entries`);
  return clearedCount;
};

const safeSetItem = (key: string, value: string): boolean => {
  try {
    // Check current usage before attempting to store
    const currentUsage = getStorageUsage();
    const valueSize = value.length;
    const estimatedTotal = currentUsage + valueSize;

    console.log(`💾 Storage usage: ${getStorageSizeInMB(currentUsage)}MB, adding ${getStorageSizeInMB(valueSize)}MB`);

    // If it would exceed ~4MB, clean up first
    if (estimatedTotal > 4 * 1024 * 1024) {
      console.log(`⚠️ Storage near limit, cleaning old data...`);
      cleanOldTestData(key);
    }

    sessionStorage.setItem(key, value);
    console.log(`✅ Stored ${key} successfully`);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      console.log(`❌ Quota exceeded for ${key}, attempting cleanup...`);

      // Emergency cleanup
      cleanOldTestData(key);

      try {
        sessionStorage.setItem(key, value);
        console.log(`✅ Stored ${key} after cleanup`);
        return true;
      } catch (retryError) {
        console.error(`❌ Still failed after cleanup:`, retryError);
        return false;
      }
    } else {
      console.error(`��� Storage error:`, error);
      return false;
    }
  }
};

interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ThemeTests {
  themeId: string;
  themeName: string;
  tests: TestQuestion[];
}

// Save tests to Firebase with robust error handling and rate limiting protection
export const saveTestsToFirebase = async (assistantId: string, tests: ThemeTests[]): Promise<boolean> => {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('⚠️ No user authenticated, skipping Firebase save');
        return false;
      }

      // Add timeout to prevent hanging
      const savePromise = setDoc(doc(db, 'assistantTests', `${user.uid}_${assistantId}`), {
        assistantId,
        tests,
        lastUpdated: new Date().toISOString(),
        userId: user.uid
      });

      // Timeout after 15 seconds (increased for mass operations)
      await Promise.race([
        savePromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firebase timeout')), 15000)
        )
      ]);

      console.log(`✅ Tests saved to Firebase for ${assistantId} (attempt ${attempt})`);
      return true;

    } catch (error) {
      lastError = error;
      const errorMessage = error.message || '';

      // Check for specific Firebase rate limiting errors
      if (errorMessage.includes('resource-exhausted') || errorMessage.includes('Write stream exhausted')) {
        console.warn(`🚫 Firebase rate limit hit for ${assistantId}, attempt ${attempt}/${maxRetries}`);

        if (attempt < maxRetries) {
          // Exponential backoff with jitter for rate limit errors
          const baseDelay = 5000; // 5 seconds base
          const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
          const jitter = Math.random() * 2000; // Random 0-2 seconds
          const totalDelay = exponentialDelay + jitter;

          console.warn(`⏳ Waiting ${Math.round(totalDelay/1000)}s for rate limit recovery...`);
          await new Promise(resolve => setTimeout(resolve, totalDelay));
        }
      } else {
        console.warn(`⚠️ Firebase save attempt ${attempt}/${maxRetries} failed for ${assistantId}:`, errorMessage);

        if (attempt < maxRetries) {
          // Standard retry delay for other errors
          const delay = attempt * 2000; // 2, 4, 6 seconds
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }

  console.error(`❌ All Firebase save attempts failed for ${assistantId}:`, lastError?.message || 'Unknown error');
  return false;
};

// Load tests from Firebase
export const loadTestsFromFirebase = async (assistantId: string): Promise<ThemeTests[] | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('⚠️ No user authenticated, skipping Firebase load');
      return null;
    }

    const testDoc = await getDoc(doc(db, 'assistantTests', `${user.uid}_${assistantId}`));
    if (testDoc.exists()) {
      const data = testDoc.data();
      console.log(`✅ Tests loaded from Firebase for ${assistantId}:`, data.tests.length, 'themes');
      return data.tests;
    }

    return null;
  } catch (error) {
    console.error('❌ Error loading tests from Firebase:', error);
    return null;
  }
};

export const getTestsForAssistant = async (assistantId: string, forceRefresh: boolean = false): Promise<ThemeTests[]> => {
  console.log(`📚 STARTING getTestsForAssistant for: ${assistantId}`);

  // Si se solicita refresh forzado, limpiar cache primero
  if (forceRefresh) {
    const storageKey = `assistant_tests_${assistantId}`;
    sessionStorage.removeItem(storageKey);
    console.log(`🔄 Cache cleared for ${assistantId} - forcing fresh load`);
  }

  // 1. Intentar cargar desde la estructura estandarizada (assistant_tests)
  try {
    console.log(`🔍 FIREBASE SEARCH: Loading ALL tests for ${assistantId}`);

    // Use simplest possible query - no orderBy to avoid any index requirements
    const testsCollection = collection(db, 'assistant_tests');
    const testsQuery = query(
      testsCollection,
      where('assistantId', '==', assistantId)
    );
    const testsSnapshot = await getDocs(testsQuery);

    console.log(`📁 Found ${testsSnapshot.docs.length} test documents for ${assistantId}`);

    const gptTests: ThemeTests[] = [];
    const themesMap = new Map<string, TestQuestion[]>();

    // Sort documents by createdAtMs in JavaScript (newest first)
    const sortedDocs = testsSnapshot.docs.sort((a, b) => {
      const aTime = a.data().createdAtMs || 0;
      const bTime = b.data().createdAtMs || 0;
      return bTime - aTime; // Descending order (newest first)
    });

    // Process each test document from standardized collection
    sortedDocs.forEach((testDoc) => {
      const testData = testDoc.data();
      console.log(`📝 Test document:`, {
        id: testDoc.id,
        hasQuestions: !!testData.questions,
        questionsCount: testData.questions?.length || 0,
        assistantId: testData.assistantId,
        themeId: testData.themeId,
        title: testData.title,
        status: testData.status,
        createdAtMs: testData.createdAtMs
      });

      // Apply status filter in code for fallback compatibility
      if (testData.questions && Array.isArray(testData.questions) &&
          (testData.status === 'published' || testData.status === undefined)) {
        const themeId = testData.themeId || testData.themeName || 'general';
        const themeName = testData.themeName || themeId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

        if (!themesMap.has(themeId)) {
          themesMap.set(themeId, []);
        }

        // Convert questions to our format
        testData.questions.forEach((q: any, index: number) => {
          const questionId = `${testDoc.id}_q${index + 1}`;

          themesMap.get(themeId)!.push({
            id: questionId,
            question: q.enunciado || q.question || '',
            options: q.opciones || q.options || [],
            correctAnswer: q.opciones ? q.opciones.findIndex((opt: string) => opt.startsWith(q.correcta)) : (q.correctAnswer || 0),
            explanation: q.explicacion || q.explanation || ''
          });
        });
      }
    });

    // Convert map to ThemeTests array
    themesMap.forEach((tests, themeId) => {
      if (tests.length > 0) {
        gptTests.push({
          themeId,
          themeName: themeId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          tests
        });
      }
    });

    const totalTestsFound = gptTests.reduce((sum, theme) => sum + theme.tests.length, 0);

    console.log(`📊 TOTAL RESULTS for ${assistantId}:`, {
      themes: gptTests.length,
      totalQuestions: totalTestsFound,
      themesDetail: gptTests.map(t => ({ name: t.themeName, questions: t.tests.length }))
    });

    if (gptTests.length > 0) {
      console.log(`✅ Loaded ${gptTests.length} themes with ${totalTestsFound} total questions from Firebase for ${assistantId}`);

      // Cache in sessionStorage
      const storageKey = `assistant_tests_${assistantId}`;
      const success = safeSetItem(storageKey, JSON.stringify(gptTests));
      if (!success) {
        console.warn(`⚠️ Failed to store ${assistantId} in sessionStorage due to quota`);
      }

      return gptTests;
    } else {
      console.log(`❌ No tests found in Firebase for ${assistantId}`);
    }
  } catch (error) {
    console.error(`❌ Error loading tests for ${assistantId}:`, error);
  }

  // 2. Fallback to old Firebase structure
  const firebaseTests = await loadTestsFromFirebase(assistantId);
  if (firebaseTests && firebaseTests.length > 0) {
    console.log(`☁️ Loaded ${firebaseTests.length} themes from old Firebase structure for ${assistantId}`);
    // También actualizar sessionStorage usando método seguro
    const storageKey = `assistant_tests_${assistantId}`;
    const success = safeSetItem(storageKey, JSON.stringify(firebaseTests));
    if (!success) {
      console.warn(`��️ Failed to store ${assistantId} in sessionStorage due to quota`);
    }
    return firebaseTests;
  }

  // 3. Luego buscar en sessionStorage (tests generados localmente)
  const storageKey = `assistant_tests_${assistantId}`;
  const storedTests = sessionStorage.getItem(storageKey);

  console.log(`🔍 Getting tests for ${assistantId}:`, {
    storageKey,
    hasStoredData: !!storedTests,
    storedDataLength: storedTests ? storedTests.length : 0
  });

  if (storedTests) {
    try {
      const parsedTests = JSON.parse(storedTests);
      console.log(`📚 Cargando tests generados para ${assistantId}:`, parsedTests.length, 'temas');
      if (parsedTests.length > 0) {
        console.log(`📝 Sample theme:`, parsedTests[0]);
        console.log(`🎯 Sample questions:`, parsedTests[0]?.tests?.length || 0);

        // Guardar en Firebase para próximas cargas
        saveTestsToFirebase(assistantId, parsedTests);
      }
      return parsedTests;
    } catch (error) {
      console.error('Error parsing stored tests:', error);
    }
  }

  // 4. Fallback a tests estáticos
  const staticTests = assistantTests[assistantId] || [];
  console.log(`📚 Fallback to static tests for ${assistantId}:`, staticTests.length, 'themes');
  return staticTests;
};

export const hasTests = (assistantId: string): boolean => {
  // Verificar primero sessionStorage
  const storageKey = `assistant_tests_${assistantId}`;
  const storedTests = sessionStorage.getItem(storageKey);

  console.log(`🔍 Checking tests for ${assistantId}:`, {
    storageKey,
    hasStoredData: !!storedTests,
    hasStaticData: !!assistantTests[assistantId]
  });

  if (storedTests) {
    try {
      const parsedTests = JSON.parse(storedTests);
      const isValid = Array.isArray(parsedTests) && parsedTests.length > 0;
      console.log(`✅ Generated tests found for ${assistantId}:`, parsedTests.length, 'themes');
      return isValid;
    } catch (error) {
      console.error('Error checking stored tests:', error);
    }
  }

  // Fallback a tests estáticos
  const hasStatic = !!assistantTests[assistantId] && assistantTests[assistantId].length > 0;
  console.log(`📚 Static tests for ${assistantId}:`, hasStatic);
  return hasStatic;
};

export const getTestCount = (assistantId: string): number => {
  // First check sessionStorage
  const storageKey = `assistant_tests_${assistantId}`;
  const storedTests = sessionStorage.getItem(storageKey);

  if (storedTests) {
    try {
      const parsedTests = JSON.parse(storedTests);
      return parsedTests.reduce((total: number, theme: ThemeTests) => total + theme.tests.length, 0);
    } catch (error) {
      console.error('Error parsing stored tests for count:', error);
    }
  }

  // Fallback to static tests
  const tests = assistantTests[assistantId];
  if (!tests) return 0;

  return tests.reduce((total, theme) => total + theme.tests.length, 0);
};

export const getThemeCount = (assistantId: string): number => {
  // First check sessionStorage
  const storageKey = `assistant_tests_${assistantId}`;
  const storedTests = sessionStorage.getItem(storageKey);

  if (storedTests) {
    try {
      const parsedTests = JSON.parse(storedTests);
      return parsedTests.length;
    } catch (error) {
      console.error('Error parsing stored tests for theme count:', error);
    }
  }

  // Fallback to static tests
  return assistantTests[assistantId]?.length || 0;
};

export const getAllAvailableAssistantIds = (): string[] => {
  return Object.keys(assistantTests);
};

// Function to get a random test from a specific theme
export const getRandomTestFromTheme = (assistantId: string, themeId: string): TestQuestion | null => {
  const assistantTestData = assistantTests[assistantId];
  if (!assistantTestData) return null;

  const theme = assistantTestData.find(t => t.themeId === themeId);
  if (!theme || theme.tests.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * theme.tests.length);
  return theme.tests[randomIndex];
};

// Function to get tests by difficulty (assuming we add difficulty to themes later)
export const getTestsByDifficulty = (assistantId: string, difficulty: 'basic' | 'intermediate' | 'advanced'): TestQuestion[] => {
  const tests = assistantTests[assistantId];
  if (!tests) return [];

  // For now, return all tests. In the future, we could filter by difficulty
  return tests.flatMap(theme => theme.tests);
};

// Force cache invalidation for immediate preview updates
export const invalidateTestsCache = (assistantId?: string) => {
  if (assistantId) {
    const storageKey = `assistant_tests_${assistantId}`;
    sessionStorage.removeItem(storageKey);
    console.log(`🔄 Cache invalidated for ${assistantId}`);
  } else {
    // Invalidate all test caches
    const testKeys = Object.keys(sessionStorage).filter(key => key.startsWith('assistant_tests_'));
    testKeys.forEach(key => sessionStorage.removeItem(key));
    console.log(`🔄 All test caches invalidated (${testKeys.length} keys)`);
  }
};

// Mark tests as freshly updated
export const markTestsAsUpdated = (assistantId: string) => {
  const timestampKey = `tests_updated_${assistantId}`;
  sessionStorage.setItem(timestampKey, Date.now().toString());
  console.log(`⏰ Tests marked as updated for ${assistantId}`);
};

// Real-time subscription for tests - PASO 2&3: standardized collection and preview-aware queries
export const subscribeToTestsRealtime = (
  assistantId: string,
  onTestsUpdate: (tests: ThemeTests[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  // Detect FullStory interference
  const hasFullStory = typeof window !== 'undefined' && (
    window.FS ||
    document.querySelector('script[src*="fullstory"]') ||
    document.querySelector('script[src*="edge.fullstory.com"]')
  );

  if (hasFullStory) {
    console.log(`🚫 FullStory detected - using fallback loading instead of real-time subscription for ${assistantId}`);

    // Fallback to manual loading when FullStory interferes
    const loadFallbackTests = async () => {
      try {
        const fallbackTests = await getTestsForAssistant(assistantId, true);
        onTestsUpdate(fallbackTests);
      } catch (error) {
        console.error(`❌ Fallback loading failed for ${assistantId}:`, error);
        if (onError) onError(error);
      }
    };

    // Initial load
    loadFallbackTests();

    // Return empty unsubscribe function
    return () => {};
  }

  // Detect Builder preview mode
  const isPreview = typeof window !== 'undefined' && (
    (window as any).__BUILDER_PREVIEW__ === true ||
    (window as any).Builder?.isEditing === true ||
    window.location.hostname.includes('builder.io') ||
    window.location.search.includes('builder.preview')
  );

  console.log(`���� Setting up real-time subscription for tests: ${assistantId} (Preview: ${isPreview})`);

  // PASO 2: Use standardized collection name 'assistant_tests'
  const testsCollection = collection(db, 'assistant_tests');

  // PASO 3: Preview-aware queries - simplest queries to avoid any index requirements
  let testsQuery;
  if (isPreview) {
    // Preview: no filters, no orderBy - sort in JavaScript
    testsQuery = query(testsCollection);
  } else {
    // Production: filter by assistantId only, no orderBy - sort in JavaScript
    testsQuery = query(
      testsCollection,
      where('assistantId', '==', assistantId)
    );
  }

  const unsubscribe = onSnapshot(
    testsQuery,
    (snapshot) => {
      try {
        console.log(`📡 Real-time tests update: ${snapshot.docs.length} test documents for ${assistantId} (Preview: ${isPreview})`);

        const realTimeTests: ThemeTests[] = [];
        const themesMap = new Map<string, TestQuestion[]>();

        // Sort documents by createdAtMs in JavaScript (newest first)
        const sortedDocs = snapshot.docs.sort((a, b) => {
          const aTime = a.data().createdAtMs || 0;
          const bTime = b.data().createdAtMs || 0;
          return bTime - aTime; // Descending order (newest first)
        });

        // Process each test document
        sortedDocs.forEach((testDoc) => {
          const testData = testDoc.data();

          // In preview: include ALL tests that have questions and match assistantId (if specified)
          // In production: apply status filter in code since query only filters by assistantId
          const shouldInclude = isPreview
            ? (testData.questions && Array.isArray(testData.questions) &&
               (!testData.assistantId || testData.assistantId === assistantId))
            : (testData.questions && Array.isArray(testData.questions) &&
               (testData.status === 'published' || testData.status === undefined));

          if (shouldInclude && testData.questions && Array.isArray(testData.questions)) {
            const themeId = testData.themeId || testData.themeName || 'general';
            const themeName = testData.themeName || themeId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

            if (!themesMap.has(themeId)) {
              themesMap.set(themeId, []);
            }

            // Convert questions to our format
            testData.questions.forEach((q: any, index: number) => {
              const questionId = `${testDoc.id}_q${index + 1}`;

              themesMap.get(themeId)!.push({
                id: questionId,
                question: q.enunciado || q.question || '',
                options: q.opciones || q.options || [],
                correctAnswer: q.opciones ? q.opciones.findIndex((opt: string) => opt.startsWith(q.correcta)) : (q.correctAnswer || 0),
                explanation: q.explicacion || q.explanation || ''
              });
            });
          }
        });

        // Convert map to ThemeTests array
        themesMap.forEach((tests, themeId) => {
          if (tests.length > 0) {
            realTimeTests.push({
              themeId,
              themeName: themeId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              tests
            });
          }
        });

        const totalQuestions = realTimeTests.reduce((sum, theme) => sum + theme.tests.length, 0);
        console.log(`✅ Real-time tests processed: ${realTimeTests.length} themes, ${totalQuestions} questions`);

        // Clear cache and update with fresh data
        const storageKey = `assistant_tests_${assistantId}`;
        sessionStorage.removeItem(storageKey);

        if (realTimeTests.length > 0) {
          safeSetItem(storageKey, JSON.stringify(realTimeTests));
        }

        // Call the update callback with fresh data
        onTestsUpdate(realTimeTests);

      } catch (error) {
        console.error(`❌ Error processing real-time tests update for ${assistantId}:`, error);
        if (onError) onError(error);
      }
    },
    (error) => {
      console.error(`❌ Real-time tests subscription error for ${assistantId}:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};

// PASO 4: Create tests with double timestamp + optimistic updates
export const createTestWithOptimisticUpdate = async (
  assistantId: string,
  themeId: string,
  themeName: string,
  questions: any[],
  onOptimisticUpdate?: (newTest: ThemeTests) => void
): Promise<boolean> => {
  try {
    const testData = {
      assistantId,
      themeId,
      themeName,
      questions,
      status: 'published',
      createdAt: new Date().toISOString(), // Server timestamp equivalent
      createdAtMs: Date.now(), // Numeric timestamp for ordering
    };

    // Optimistic update - immediately update UI
    if (onOptimisticUpdate) {
      const optimisticTest: ThemeTests = {
        themeId,
        themeName,
        tests: questions.map((q, index) => ({
          id: `temp_${Date.now()}_q${index + 1}`,
          question: q.enunciado || q.question || '',
          options: q.opciones || q.options || [],
          correctAnswer: q.opciones ? q.opciones.findIndex((opt: string) => opt.startsWith(q.correcta)) : (q.correctAnswer || 0),
          explanation: q.explicacion || q.explanation || ''
        }))
      };
      onOptimisticUpdate(optimisticTest);
    }

    // Add to standardized collection
    const testsCollection = collection(db, 'assistant_tests');
    await setDoc(doc(testsCollection), testData);

    console.log(`✅ Test created successfully for ${assistantId}/${themeId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating test for ${assistantId}/${themeId}:`, error);
    return false;
  }
};

// Firebase queries optimized for zero index requirements:
// Collection: assistant_tests
// Query: where('assistantId', '==', assistantId) - uses automatic single-field index
// Sorting and status filtering done in JavaScript to avoid composite indexes

export { type TestQuestion, type ThemeTests };
