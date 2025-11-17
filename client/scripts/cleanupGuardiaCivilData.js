import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBywGWqSpzZ4BRxIoEnIQZhv3ObHvrLIC8",
  authDomain: "cursor-64188.firebaseapp.com",
  projectId: "cursor-64188",
  storageBucket: "cursor-64188.appspot.com",
  messagingSenderId: "657742231663",
  appId: "1:657742231663:web:9b6fce322922f3b6e0f59a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ASSISTANT_ID = 'guardia-civil';

async function cleanupOldGuardiaCivilData() {
  console.log('🧹 Iniciando limpieza de datos antiguos de Guardia Civil...');
  
  try {
    // 1. Limpiar syllabus antiguos
    console.log('📚 Limpiando syllabus antiguos...');
    const syllabusRef = collection(db, 'assistants', ASSISTANT_ID, 'syllabus');
    const syllabusSnapshot = await getDocs(syllabusRef);
    
    const batch = writeBatch(db);
    let deletedSyllabus = 0;
    
    syllabusSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      deletedSyllabus++;
    });
    
    if (deletedSyllabus > 0) {
      await batch.commit();
      console.log(`✅ Eliminados ${deletedSyllabus} syllabus antiguos`);
    }
    
    // 2. Limpiar tests antiguos
    console.log('🎯 Limpiando tests antiguos...');
    const testsRef = collection(db, 'assistants', ASSISTANT_ID, 'tests');
    const testsSnapshot = await getDocs(testsRef);
    
    const testsBatch = writeBatch(db);
    let deletedTests = 0;
    
    testsSnapshot.docs.forEach(doc => {
      testsBatch.delete(doc.ref);
      deletedTests++;
    });
    
    if (deletedTests > 0) {
      await testsBatch.commit();
      console.log(`✅ Eliminados ${deletedTests} tests antiguos`);
    }
    
    // 3. Limpiar flashcards antiguos
    console.log('💳 Limpiando flashcards antiguos...');
    const flashcardsRef = collection(db, 'assistants', ASSISTANT_ID, 'flashcards');
    const flashcardsSnapshot = await getDocs(flashcardsRef);
    
    const flashcardsBatch = writeBatch(db);
    let deletedFlashcards = 0;
    
    flashcardsSnapshot.docs.forEach(doc => {
      flashcardsBatch.delete(doc.ref);
      deletedFlashcards++;
    });
    
    if (deletedFlashcards > 0) {
      await flashcardsBatch.commit();
      console.log(`✅ Eliminadas ${deletedFlashcards} flashcards antiguas`);
    }
    
    console.log('🎉 Limpieza completada exitosamente');
    console.log(`📊 Resumen: ${deletedSyllabus} syllabus, ${deletedTests} tests, ${deletedFlashcards} flashcards eliminados`);
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupOldGuardiaCivilData()
    .then(() => {
      console.log('✅ Script de limpieza terminado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en script de limpieza:', error);
      process.exit(1);
    });
}

export { cleanupOldGuardiaCivilData };
