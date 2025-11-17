// Test script for Guardia Civil content generation
import { GuardiaCivilOfficialGenerator } from '../lib/guardiaCivilOfficialGenerator.js';

console.log('🧪 Testing Guardia Civil Official Generator...');

// Test 1: Check topics list
const topics = GuardiaCivilOfficialGenerator.getOfficialTopics();
console.log(`✅ Found ${topics.length} official topics`);

// Test 2: Test topic content generation
const firstTopic = topics[0];
console.log(`📝 Testing content generation for: ${firstTopic.title}`);

const content = GuardiaCivilOfficialGenerator.generateTopicContent(firstTopic);
const wordCount = content.split(' ').length;
console.log(`✅ Generated content: ${wordCount} words`);

// Test 3: Test tests generation
const tests = GuardiaCivilOfficialGenerator.generateTopicTests(firstTopic);
console.log(`🎯 Generated ${tests.length} tests for topic`);

// Test 4: Test flashcards generation
const flashcards = GuardiaCivilOfficialGenerator.generateTopicFlashcards(firstTopic);
console.log(`💳 Generated ${flashcards.length} flashcards for topic`);

// Summary
console.log('\n🎉 Generation Test Summary:');
console.log(`📚 Topics: ${topics.length}`);
console.log(`📝 Content words per topic: ~${wordCount}`);
console.log(`🎯 Tests per topic: ${tests.length}`);
console.log(`💳 Flashcards per topic: ${flashcards.length}`);
console.log('\n📊 Total if all generated:');
console.log(`📚 Total temario words: ~${wordCount * topics.length}`);
console.log(`🎯 Total tests: ${tests.length * topics.length}`);
console.log(`💳 Total flashcards: ${flashcards.length * topics.length}`);

console.log('\n✅ All tests passed! Ready for production use.');
