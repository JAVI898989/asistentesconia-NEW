import { db, auth } from '@/lib/simpleAuth';
import { collection, query, where, getDocs, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore';

export interface ResetAuditLog {
  assistantId: string;
  assistantName: string;
  testsDeleted: number;
  timestamp: string;
  adminUserId: string;
  adminEmail: string;
}

export interface Assistant {
  id: string;
  name: string;
  category: string;
  slug: string;
}

// Function to reset tests for all non-PRO assistants
export const resetNonProAssistantTests = async (assistants: Assistant[]): Promise<ResetAuditLog[]> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  // Filter non-PRO assistants
  const nonProAssistants = assistants.filter(assistant => assistant.category !== 'pro');
  const auditLogs: ResetAuditLog[] = [];

  console.log(`🧹 Iniciando reset de tests para ${nonProAssistants.length} asistentes NO PRO`);

  for (const assistant of nonProAssistants) {
    try {
      // Clear from SessionStorage and LocalStorage
      const sessionKey = `assistant_tests_${assistant.id}`;
      const localKey = `assistant_tests_${assistant.id}`;
      
      sessionStorage.removeItem(sessionKey);
      localStorage.removeItem(localKey);
      
      // Clear Firebase tests for this assistant
      let testsDeleted = 0;
      
      try {
        // Query tests for this specific assistant
        const testsQuery = query(
          collection(db, 'assistantTests'),
          where('assistantId', '==', assistant.id)
        );
        
        const testsSnapshot = await getDocs(testsQuery);
        
        // Delete each test document
        for (const testDoc of testsSnapshot.docs) {
          await deleteDoc(testDoc.ref);
          testsDeleted++;
        }
        
        console.log(`✅ ${assistant.name}: ${testsDeleted} tests eliminados`);
        
      } catch (firebaseError) {
        console.warn(`⚠️ Error Firebase para ${assistant.name}:`, firebaseError);
        // Continue with local cleanup even if Firebase fails
      }

      // Create audit log entry
      const auditLog: ResetAuditLog = {
        assistantId: assistant.id,
        assistantName: assistant.name,
        testsDeleted,
        timestamp: new Date().toISOString(),
        adminUserId: user.uid,
        adminEmail: user.email || 'unknown'
      };

      auditLogs.push(auditLog);

      // Save audit log to Firebase
      try {
        await addDoc(collection(db, 'admin_logs/tests_reset/entries'), auditLog);
      } catch (logError) {
        console.warn(`⚠️ Error guardando log para ${assistant.name}:`, logError);
      }

    } catch (error) {
      console.error(`❌ Error reseteando tests para ${assistant.name}:`, error);
      
      // Add error log
      const errorLog: ResetAuditLog = {
        assistantId: assistant.id,
        assistantName: assistant.name,
        testsDeleted: 0,
        timestamp: new Date().toISOString(),
        adminUserId: user.uid,
        adminEmail: user.email || 'unknown'
      };
      
      auditLogs.push(errorLog);
    }
  }

  // Save summary log
  try {
    const summaryLog = {
      type: 'tests_reset_summary',
      totalAssistants: nonProAssistants.length,
      totalTestsDeleted: auditLogs.reduce((sum, log) => sum + log.testsDeleted, 0),
      timestamp: new Date().toISOString(),
      adminUserId: user.uid,
      adminEmail: user.email || 'unknown',
      details: auditLogs
    };

    await addDoc(collection(db, 'admin_logs/tests_reset/summaries'), summaryLog);
    
    console.log(`📋 Resumen de reset guardado:`, summaryLog);

  } catch (summaryError) {
    console.warn(`⚠️ Error guardando resumen:`, summaryError);
  }

  return auditLogs;
};

// Function to check if assistant is PRO
export const isProAssistant = (assistant: Assistant): boolean => {
  return assistant.category === 'pro';
};

// Function to get resetable assistants (non-PRO)
export const getResetableAssistants = (assistants: Assistant[]): Assistant[] => {
  return assistants.filter(assistant => !isProAssistant(assistant));
};

// Function to get excluded assistants (PRO)
export const getExcludedAssistants = (assistants: Assistant[]): Assistant[] => {
  return assistants.filter(assistant => isProAssistant(assistant));
};

// Function to clear local storage for specific assistant
export const clearAssistantLocalData = (assistantId: string): void => {
  const keys = [
    `assistant_tests_${assistantId}`,
    `tests_updated_${assistantId}`,
    `assistant_temarios_${assistantId}`,
  ];

  keys.forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });

  console.log(`🧹 Datos locales limpiados para asistente: ${assistantId}`);
};
