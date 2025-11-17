// Script de diagnóstico para Guardia Civil
import { GuardiaCivilOfficialGenerator } from '../lib/guardiaCivilOfficialGenerator.js';

console.log('🔍 DIAGNÓSTICO GUARDIA CIVIL');
console.log('============================');

// Test 1: Verificar que el generador funciona
console.log('\n1. Verificando generador...');
try {
  const topics = GuardiaCivilOfficialGenerator.getOfficialTopics();
  console.log(`✅ ${topics.length} temas oficiales cargados`);
  
  // Test 2: Generar contenido de prueba
  console.log('\n2. Generando contenido de prueba...');
  const testTopic = topics[0]; // Tema 1
  console.log(`📝 Tema de prueba: ${testTopic.title}`);
  
  const content = GuardiaCivilOfficialGenerator.generateTopicContent(testTopic);
  console.log(`📄 Contenido generado: ${content.length} caracteres`);
  
  if (content.length < 100) {
    console.log('❌ PROBLEMA: Contenido muy corto');
    console.log('Contenido:', content);
  } else {
    console.log('✅ Contenido se ve correcto');
    console.log('Primeros 200 caracteres:', content.substring(0, 200));
  }
  
  // Test 3: Generar tests de prueba
  console.log('\n3. Generando tests de prueba...');
  const tests = GuardiaCivilOfficialGenerator.generateTopicTests(testTopic);
  console.log(`🎯 Tests generados: ${tests.length}`);
  
  if (tests.length === 0) {
    console.log('❌ PROBLEMA: No se generaron tests');
  } else {
    console.log('✅ Tests generados correctamente');
    console.log('Test de ejemplo:', JSON.stringify(tests[0], null, 2));
  }
  
  // Test 4: Generar flashcards de prueba
  console.log('\n4. Generando flashcards de prueba...');
  const flashcards = GuardiaCivilOfficialGenerator.generateTopicFlashcards(testTopic);
  console.log(`💳 Flashcards generadas: ${flashcards.length}`);
  
  if (flashcards.length === 0) {
    console.log('❌ PROBLEMA: No se generaron flashcards');
  } else {
    console.log('✅ Flashcards generadas correctamente');
    console.log('Flashcard de ejemplo:', JSON.stringify(flashcards[0], null, 2));
  }
  
} catch (error) {
  console.error('❌ ERROR CRÍTICO:', error);
  console.error('Stack:', error.stack);
}

console.log('\n============================');
console.log('🔍 DIAGNÓSTICO COMPLETADO');
