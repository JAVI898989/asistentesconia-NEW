import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadString, deleteObject } from "firebase/storage";
import { db } from "./firebase";

export interface HealthTestResult {
  success: boolean;
  firestoreTest: boolean;
  storageTest: boolean;
  errors: string[];
  details: string[];
}

/**
 * Mini-test to verify Firestore and Storage write permissions
 * As requested in the requirements for immediate confirmation
 */
export async function runMiniHealthTest(assistantId: string): Promise<HealthTestResult> {
  const result: HealthTestResult = {
    success: false,
    firestoreTest: false,
    storageTest: false,
    errors: [],
    details: []
  };

  console.log('🧪 Running mini health test...');

  // Test Firestore write
  try {
    result.details.push('Testing Firestore write...');
    
    const healthDocRef = doc(db, 'assistants', assistantId, 'syllabus', 'zz-health');
    
    await setDoc(healthDocRef, {
      title: 'health',
      slug: 'zz-health', 
      order: 999,
      status: 'published',
      updatedAtMs: Date.now(),
      createdAt: serverTimestamp(),
      test: true
    });

    result.details.push('✅ Firestore write successful');
    
    // Clean up
    await deleteDoc(healthDocRef);
    result.details.push('✅ Firestore cleanup successful');
    
    result.firestoreTest = true;

  } catch (error) {
    const errorMsg = `Firestore test failed: ${error.message}`;
    result.errors.push(errorMsg);
    result.details.push(`❌ ${errorMsg}`);
    console.error('Firestore test error:', error);
  }

  // Test Storage write
  try {
    result.details.push('Testing Storage write...');
    
    const storage = getStorage();
    const testRef = ref(storage, `assistants/${assistantId}/__health__/ping.txt`);
    
    await uploadString(testRef, 'ok', 'raw', {
      cacheControl: 'no-store',
      customMetadata: {
        test: 'true',
        timestamp: new Date().toISOString()
      }
    });

    result.details.push('✅ Storage write successful');
    
    // Clean up
    await deleteObject(testRef);
    result.details.push('✅ Storage cleanup successful');
    
    result.storageTest = true;

  } catch (error) {
    const errorMsg = `Storage test failed: ${error.message}`;
    result.errors.push(errorMsg);
    result.details.push(`❌ ${errorMsg}`);
    console.error('Storage test error:', error);
  }

  result.success = result.firestoreTest && result.storageTest;

  console.log('🧪 Mini health test completed:', {
    success: result.success,
    firestore: result.firestoreTest,
    storage: result.storageTest,
    errors: result.errors.length
  });

  return result;
}

/**
 * Quick console test function for immediate verification
 * Can be run from browser console: window.runQuickTest()
 */
export function setupQuickTest() {
  (window as any).runQuickTest = async () => {
    const ASSISTANT_ID = 'guardia-civil';
    console.log('🚀 Running quick health test for Guardia Civil assistant...');
    
    const result = await runMiniHealthTest(ASSISTANT_ID);
    
    console.group('📊 Health Test Results');
    console.log('Success:', result.success ? '✅' : '❌');
    console.log('Firestore:', result.firestoreTest ? '✅' : '❌');
    console.log('Storage:', result.storageTest ? '✅' : '❌');
    
    if (result.errors.length > 0) {
      console.group('❌ Errors');
      result.errors.forEach(error => console.error(error));
      console.groupEnd();
    }
    
    console.group('📝 Details');
    result.details.forEach(detail => console.log(detail));
    console.groupEnd();
    
    console.groupEnd();
    
    return result;
  };

  console.log('💡 Quick test setup complete. Run: runQuickTest()');
}
