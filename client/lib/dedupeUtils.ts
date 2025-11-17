import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  getDocs,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

// Utility functions for deduplication
export const normalize = (s: string): string =>
  s.toLowerCase().replace(/\s+/g, ' ').trim();

// Browser-compatible hash function using Web Crypto API
export const shortHash = async (s: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(s);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.slice(0, 16);
};

// Fallback simple hash for deduplication (non-cryptographic)
export const simpleHash = (s: string): string => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 16);
};

// Test hash based on normalized stem
export const getTestHash = async (stem: string): Promise<string> => {
  try {
    return await shortHash(normalize(stem));
  } catch (error) {
    console.warn("Falling back to simple hash:", error);
    return simpleHash(normalize(stem));
  }
};

// Flashcard hash based on normalized front + back
export const getFlashcardHash = async (front: string, back: string): Promise<string> => {
  try {
    return await shortHash(normalize(front) + '|' + normalize(back));
  } catch (error) {
    console.warn("Falling back to simple hash:", error);
    return simpleHash(normalize(front) + '|' + normalize(back));
  }
};

// Insert test with deduplication
export async function upsertTestWithKey(
  assistantId: string,
  slug: string,
  test: any
): Promise<{ created: boolean; reason?: string }> {
  const stemHash = await getTestHash(test.stem);
  const keyRef = doc(db, 'tests_keys', `${assistantId}:${slug}:${stemHash}`);
  const testRef = doc(collection(db, 'assistants', assistantId, 'syllabus', slug, 'tests'));

  try {
    const result = await runTransaction(db, async (tx) => {
      const keyDoc = await tx.get(keyRef);

      if (keyDoc.exists()) {
        return { created: false, reason: 'duplicate_stem' };
      }

      // Create test with hash
      const testData = {
        ...test,
        id: testRef.id,
        stemHash,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      tx.set(testRef, testData);
      tx.set(keyRef, {
        testId: testRef.id,
        assistantId,
        slug,
        stemHash,
        createdAt: serverTimestamp()
      });

      return { created: true };
    });

    return result;
  } catch (error) {
    console.error('Error upserting test:', error);
    return { created: false, reason: 'error' };
  }
}

// Insert flashcard with deduplication
export async function upsertFlashcardWithKey(
  assistantId: string,
  slug: string,
  card: any
): Promise<{ created: boolean; reason?: string }> {
  const cardHash = await getFlashcardHash(card.front, card.back);
  const keyRef = doc(db, 'flashcard_keys', `${assistantId}:${slug}:${cardHash}`);
  const cardRef = doc(collection(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards'));

  try {
    const result = await runTransaction(db, async (tx) => {
      const keyDoc = await tx.get(keyRef);

      if (keyDoc.exists()) {
        return { created: false, reason: 'duplicate_content' };
      }

      // Create flashcard with hash
      const cardData = {
        ...card,
        id: cardRef.id,
        cardHash,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      tx.set(cardRef, cardData);
      tx.set(keyRef, {
        flashcardId: cardRef.id,
        assistantId,
        slug,
        cardHash,
        createdAt: serverTimestamp()
      });

      return { created: true };
    });

    return result;
  } catch (error) {
    console.error('Error upserting flashcard:', error);
    return { created: false, reason: 'error' };
  }
}

// Deduplicate existing tests for a topic
export async function deduplicateTopicTests(
  assistantId: string,
  slug: string
): Promise<{ removed: number; kept: number; errors: string[] }> {
  const result = { removed: 0, kept: 0, errors: [] };

  try {
    console.log(`🔄 Deduplicating tests for ${slug}`);

    // Get all tests
    const testsCollection = collection(db, 'assistants', assistantId, 'syllabus', slug, 'tests');
    const testsSnapshot = await getDocs(testsCollection);

    const seenHashes = new Set<string>();
    const toDelete: string[] = [];
    const toKeep: { id: string; hash: string; test: any }[] = [];

    // Process each test
    for (const testDoc of testsSnapshot.docs) {
      const testData = testDoc.data();
      const hash = await getTestHash(testData.stem);

      if (seenHashes.has(hash)) {
        // Duplicate - mark for deletion
        toDelete.push(testDoc.id);
        result.removed++;
      } else {
        // First occurrence - keep it
        seenHashes.add(hash);
        toKeep.push({ id: testDoc.id, hash, test: testData });
        result.kept++;
      }
    }

    // Delete duplicates
    for (const testId of toDelete) {
      try {
        await deleteDoc(doc(db, 'assistants', assistantId, 'syllabus', slug, 'tests', testId));
      } catch (error) {
        result.errors.push(`Failed to delete test ${testId}: ${error.message}`);
      }
    }

    // Create/update keys for kept tests
    for (const { hash, test } of toKeep) {
      try {
        const keyRef = doc(db, 'tests_keys', `${assistantId}:${slug}:${hash}`);
        await runTransaction(db, async (tx) => {
          tx.set(keyRef, {
            testId: test.id,
            assistantId,
            slug,
            stemHash: hash,
            createdAt: serverTimestamp()
          });
        });
      } catch (error) {
        result.errors.push(`Failed to create key for test ${test.id}: ${error.message}`);
      }
    }

    console.log(`✅ Tests deduplicated: ${result.kept} kept, ${result.removed} removed`);

  } catch (error) {
    console.error('Error deduplicating tests:', error);
    result.errors.push(`General error: ${error.message}`);
  }

  return result;
}

// Deduplicate existing flashcards for a topic
export async function deduplicateTopicFlashcards(
  assistantId: string,
  slug: string
): Promise<{ removed: number; kept: number; errors: string[] }> {
  const result = { removed: 0, kept: 0, errors: [] };

  try {
    console.log(`🔄 Deduplicating flashcards for ${slug}`);

    // Get all flashcards
    const flashcardsCollection = collection(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards');
    const flashcardsSnapshot = await getDocs(flashcardsCollection);

    const seenHashes = new Set<string>();
    const toDelete: string[] = [];
    const toKeep: { id: string; hash: string; card: any }[] = [];

    // Process each flashcard
    for (const cardDoc of flashcardsSnapshot.docs) {
      const cardData = cardDoc.data();
      const hash = await getFlashcardHash(cardData.front, cardData.back);

      if (seenHashes.has(hash)) {
        // Duplicate - mark for deletion
        toDelete.push(cardDoc.id);
        result.removed++;
      } else {
        // First occurrence - keep it
        seenHashes.add(hash);
        toKeep.push({ id: cardDoc.id, hash, card: cardData });
        result.kept++;
      }
    }

    // Delete duplicates
    for (const cardId of toDelete) {
      try {
        await deleteDoc(doc(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards', cardId));
      } catch (error) {
        result.errors.push(`Failed to delete flashcard ${cardId}: ${error.message}`);
      }
    }

    // Create/update keys for kept flashcards
    for (const { hash, card } of toKeep) {
      try {
        const keyRef = doc(db, 'flashcard_keys', `${assistantId}:${slug}:${hash}`);
        await runTransaction(db, async (tx) => {
          tx.set(keyRef, {
            flashcardId: card.id,
            assistantId,
            slug,
            cardHash: hash,
            createdAt: serverTimestamp()
          });
        });
      } catch (error) {
        result.errors.push(`Failed to create key for flashcard ${card.id}: ${error.message}`);
      }
    }

    console.log(`✅ Flashcards deduplicated: ${result.kept} kept, ${result.removed} removed`);

  } catch (error) {
    console.error('Error deduplicating flashcards:', error);
    result.errors.push(`General error: ${error.message}`);
  }

  return result;
}

// Update topic counters after deduplication
export async function updateTopicCounters(assistantId: string, slug: string): Promise<void> {
  try {
    // Count actual tests and flashcards
    const testsSnapshot = await getDocs(collection(db, 'assistants', assistantId, 'syllabus', slug, 'tests'));
    const flashcardsSnapshot = await getDocs(collection(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards'));

    const testsCount = testsSnapshot.size;
    const flashcardsCount = flashcardsSnapshot.size;

    // Update topic document
    const topicRef = doc(db, 'assistants', assistantId, 'syllabus', slug);
    await updateDoc(topicRef, {
      testsCount,
      flashcardsCount,
      updatedAt: serverTimestamp(),
      updatedAtMs: Date.now()
    });

    console.log(`✅ Updated counters for ${slug}: ${testsCount} tests, ${flashcardsCount} flashcards`);

  } catch (error) {
    console.error('Error updating topic counters:', error);
    throw error;
  }
}

// Batch delete collections (for OVERWRITE mode)
export async function clearTopicTestsAndFlashcards(
  assistantId: string,
  slug: string
): Promise<{ testsDeleted: number; flashcardsDeleted: number; errors: string[] }> {
  const result = { testsDeleted: 0, flashcardsDeleted: 0, errors: [] };

  try {
    console.log(`🗑️ Clearing tests and flashcards for ${slug}`);

    // Delete tests
    const testsCollection = collection(db, 'assistants', assistantId, 'syllabus', slug, 'tests');
    const testsSnapshot = await getDocs(testsCollection);

    const testDeletions = testsSnapshot.docs.map(async (testDoc) => {
      try {
        await deleteDoc(testDoc.ref);
        result.testsDeleted++;
      } catch (error) {
        result.errors.push(`Failed to delete test ${testDoc.id}: ${error.message}`);
      }
    });

    // Delete flashcards
    const flashcardsCollection = collection(db, 'assistants', assistantId, 'syllabus', slug, 'flashcards');
    const flashcardsSnapshot = await getDocs(flashcardsCollection);

    const flashcardDeletions = flashcardsSnapshot.docs.map(async (cardDoc) => {
      try {
        await deleteDoc(cardDoc.ref);
        result.flashcardsDeleted++;
      } catch (error) {
        result.errors.push(`Failed to delete flashcard ${cardDoc.id}: ${error.message}`);
      }
    });

    // Wait for all deletions
    await Promise.all([...testDeletions, ...flashcardDeletions]);

    // Clear related keys
    // Note: In a production system, you'd want to also clean up the keys collections
    // For now, we'll let them accumulate (they're small and help prevent re-creation)

    console.log(`✅ Cleared ${result.testsDeleted} tests and ${result.flashcardsDeleted} flashcards`);

  } catch (error) {
    console.error('Error clearing topic content:', error);
    result.errors.push(`General error: ${error.message}`);
  }

  return result;
}
