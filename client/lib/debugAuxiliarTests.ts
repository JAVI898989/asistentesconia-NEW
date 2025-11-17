import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/simpleAuth';

// Debug utility to show ALL tests for Auxiliar Administrativo del Estado
export const debugAuxiliarAdministrativoTests = async () => {
  const assistantId = 'auxiliar-administrativo-estado';
  
  console.log(`🚀 DEBUGGING ALL TESTS FOR: ${assistantId}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Get all test themes for this assistant
    const themesCollection = collection(db, `assistants/${assistantId}/tests`);
    const themesSnapshot = await getDocs(themesCollection);
    
    console.log(`📁 THEMES FOUND: ${themesSnapshot.docs.length}`);
    
    if (themesSnapshot.docs.length === 0) {
      console.log(`❌ NO THEMES FOUND for ${assistantId}`);
      
      // Try alternative IDs
      const alternativeIds = [
        'auxiliar-administrativo-del-estado',
        'administrativo-estado',
        'auxiliar-administrativo'
      ];
      
      for (const altId of alternativeIds) {
        console.log(`🔍 Trying alternative ID: ${altId}`);
        const altThemesCollection = collection(db, `assistants/${altId}/tests`);
        const altThemesSnapshot = await getDocs(altThemesCollection);
        
        if (altThemesSnapshot.docs.length > 0) {
          console.log(`✅ FOUND TESTS with alternative ID: ${altId}`);
          console.log(`📁 Themes: ${altThemesSnapshot.docs.length}`);
          return await debugSpecificAssistant(altId);
        }
      }
      
      return null;
    }
    
    return await debugSpecificAssistant(assistantId);
    
  } catch (error) {
    console.error(`❌ Error debugging tests for ${assistantId}:`, error);
    return null;
  }
};

const debugSpecificAssistant = async (assistantId: string) => {
  const allTests: any[] = [];
  let totalQuestions = 0;
  
  const themesCollection = collection(db, `assistants/${assistantId}/tests`);
  const themesSnapshot = await getDocs(themesCollection);
  
  for (const themeDoc of themesSnapshot.docs) {
    const themeId = themeDoc.id;
    const themeName = themeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    console.log(`\n📂 THEME: ${themeId} (${themeName})`);
    
    // Get tests for this theme
    const testsCollection = collection(db, `assistants/${assistantId}/tests/${themeId}/tests`);
    const testsSnapshot = await getDocs(testsCollection);
    
    console.log(`  🎯 Test documents: ${testsSnapshot.docs.length}`);
    
    const themeTests: any[] = [];
    
    testsSnapshot.docs.forEach((testDoc, testIndex) => {
      const testData = testDoc.data();
      const questionsCount = testData.questions?.length || 0;
      
      console.log(`    📝 Test ${testIndex + 1}:`, {
        id: testDoc.id,
        testNumber: testData.testNumber,
        questions: questionsCount,
        created: testData.created,
        assistantId: testData.assistantId,
        themeId: testData.themeId
      });
      
      if (testData.questions && Array.isArray(testData.questions)) {
        testData.questions.forEach((q: any, qIndex: number) => {
          themeTests.push({
            themeId,
            themeName,
            testNumber: testData.testNumber,
            questionNumber: qIndex + 1,
            question: q.enunciado || q.question,
            hasOptions: !!q.opciones,
            optionsCount: q.opciones?.length || 0,
            correctAnswer: q.correcta,
            hasExplanation: !!q.explicacion
          });
        });
        
        totalQuestions += questionsCount;
      }
    });
    
    if (themeTests.length > 0) {
      allTests.push({
        themeId,
        themeName,
        questionsCount: themeTests.length,
        tests: themeTests
      });
    }
  }
  
  console.log(`\n📊 SUMMARY FOR ${assistantId}:`);
  console.log(`  📁 Total themes: ${allTests.length}`);
  console.log(`  ❓ Total questions: ${totalQuestions}`);
  console.log(`  🎯 Tests per theme:`, allTests.map(t => `${t.themeName}: ${t.questionsCount}`));
  
  // Show sample questions
  if (allTests.length > 0 && allTests[0].tests.length > 0) {
    console.log(`\n📝 SAMPLE QUESTION:`, allTests[0].tests[0]);
  }
  
  return {
    assistantId,
    themes: allTests.length,
    totalQuestions,
    tests: allTests
  };
};

// Function to force refresh tests in any open Assistant Detail pages
export const forceRefreshAuxiliarTests = () => {
  if (typeof window !== 'undefined') {
    try {
      const updateMessage = {
        type: 'TESTS_UPDATED',
        assistantId: 'auxiliar-administrativo-estado',
        assistantSlug: 'auxiliar-administrativo-del-estado',
        timestamp: Date.now(),
        force: true,
        debug: true
      };
      
      // Multiple broadcast methods
      const channel = new BroadcastChannel('tests_updates');
      channel.postMessage(updateMessage);
      
      window.postMessage(updateMessage, '*');
      localStorage.setItem('tests_update_auxiliar-administrativo-estado', JSON.stringify(updateMessage));
      window.dispatchEvent(new CustomEvent('testsUpdated', { detail: updateMessage }));
      
      console.log(`📡 FORCED REFRESH broadcast sent for auxiliar-administrativo-estado`);
    } catch (error) {
      console.warn('Error broadcasting refresh:', error);
    }
  }
};

// Execute immediately when this module is imported in admin
if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
  console.log(`🔍 DEBUG MODE: Executing auxiliar tests debug...`);
  debugAuxiliarAdministrativoTests().then(result => {
    if (result) {
      console.log(`✅ DEBUG COMPLETE: Found ${result.totalQuestions} questions in ${result.themes} themes`);
      
      // Force refresh any open assistant detail pages
      setTimeout(() => {
        forceRefreshAuxiliarTests();
      }, 1000);
    } else {
      console.log(`❌ DEBUG COMPLETE: No tests found for auxiliar-administrativo-estado`);
    }
  });
}
