# Test and Flashcard Regeneration System Implementation

## Overview
Comprehensive implementation of test and flashcard regeneration system for Guardia Civil content with OVERWRITE/ADD modes, quality gates, and anti-duplication.

## Core Features Implemented

### 1. Data Structure (✅ Complete)
- **Tests**: `assistants/{assistantId}/syllabus/{slug}/tests/{qid}`
- **Flashcards**: `assistants/{assistantId}/syllabus/{slug}/flashcards/{fid}`
- **Anti-duplication keys**: 
  - `tests_keys/{assistantId}:{slug}:{stemHash}`
  - `flashcard_keys/{assistantId}:{slug}:{cardHash}`
- **SHA-256 hashing** for deduplication (16 chars, fallback to simple hash)

### 2. Generation Modes (✅ Complete)
- **OVERWRITE**: Deletes existing content and regenerates exactly 20 tests + ≥45 flashcards
- **ADD**: Extends existing content with specified number of new items
- **Quality Gates**: Validates content quality, uniqueness, coverage
- **Automatic retry** with configurable attempts

### 3. Core Services (✅ Complete)

#### `testFlashcardGenerator.ts`
- Main regeneration service with both modes
- Quality validation (exactly 20 tests, ≥45 flashcards)
- Anti-duplication using hash keys
- Batch processing to handle rate limits
- Comprehensive error handling

#### API Endpoints
- `POST /api/generate-tests` - AI-powered test generation
- `POST /api/generate-flashcards` - AI-powered flashcard generation
- Quality requirements enforcement
- JSON response validation

### 4. Admin Interface (✅ Complete)

#### Enhanced `Contenido.tsx`
- **Primary Actions**:
  - "Generar Temario GC Completo" - Full generation
  - "Regenerar Tests + Flashcards" - Combined regeneration
- **Specific Actions**:
  - "Regenerar TESTS (20)" - Tests only
  - "Regenerar FLASHCARDS (≥45)" - Flashcards only
  - "Solo PDFs" - PDF generation only
- **Mode Selection**: OVERWRITE/ADD with input controls
- **Per-topic Actions**: Individual regeneration buttons in table
- **Progress Tracking**: Real-time logs and progress bars

### 5. Automatic Triggers (✅ Complete)
- **PDF Publish/Regenerate**: Automatically regenerates tests/flashcards
- **Topic Regeneration**: Complete content refresh including tests/flashcards
- **Quality Gate Integration**: Ensures minimum standards are met

### 6. User Interface Updates (✅ Complete)

#### `TemarioCompletoGC.tsx` 
- **Enhanced Counters**: Shows tests (X/20) and flashcards (X/45+) with color coding
  - ✅ Green: Requirements met
  - ⚠ Yellow: Partial completion
  - ✗ Red: Missing content
- **Quality Indicators**: Visual badges for content status

#### Test and Flashcard Viewing
- **`TestPorTemaGC.tsx`**: Loads from new Firestore structure
- **`FlashcardsGC.tsx`**: Enhanced with topic selection and filtering
- **Hooks**: `useGuardiaCivilTests`, `useGuardiaCivilFlashcards`, etc.

### 7. Quality Rules (✅ Complete)

#### Tests
- **Exactly 20 per topic**
- **4 unique options** (A, B, C, D)
- **Forbidden patterns**: "Todas/Ninguna de las anteriores"
- **Balanced coverage** of content sections
- **Rationale required** with topic citation
- **Uniqueness ratio** ≥95%

#### Flashcards
- **Minimum 45 per topic**
- **One line per side** (front/back)
- **Concrete definitions** from content
- **Section tags** for organization
- **UTF-8 Spanish** encoding
- **No duplicates** (hash-based)

### 8. Infrastructure (✅ Complete)

#### Firestore Indexes (`firestore.indexes.json`)
- Collection group queries for tests/flashcards
- Sorting by section, difficulty, creation date
- Tag-based filtering support

#### Deduplication System (`dedupeUtils.ts`)
- Web Crypto API for browser compatibility
- Transactional operations for consistency
- Batch operations for efficiency
- Counter updates and cleanup

### 9. Error Handling & Resilience (✅ Complete)
- **Retry Logic**: Configurable attempts with exponential backoff
- **Timeout Handling**: Progressive timeouts based on content size
- **Fallback Strategies**: Graceful degradation on failures
- **Comprehensive Logging**: Detailed progress and error tracking
- **Quality Validation**: Pre and post-generation checks

## Usage Instructions

### Admin Operations
1. **Access**: Navigate to Admin → Contenido
2. **Mode Selection**: Choose OVERWRITE (replace all) or ADD (extend existing)
3. **Generation Options**:
   - Full syllabus generation (recommended)
   - Individual test/flashcard regeneration
   - Per-topic actions via table buttons

### Quality Assurance
- System automatically validates content quality
- Retries generation if quality gates fail
- Provides detailed error messages and suggestions
- Maintains counters for easy monitoring

### Student Experience
- Tests available in "Tests" tab with proper section/difficulty distribution
- Flashcards in "Flashcards" tab with search and tag filtering
- Topic counters visible in syllabus overview
- Content guaranteed to meet minimum quality standards

## Technical Architecture

### Data Flow
1. **Content Generation** → AI APIs → Quality Validation
2. **Deduplication** → Hash checking → Firestore upsert
3. **Counter Updates** → Document statistics → UI refresh
4. **Progress Tracking** → Real-time logs → Admin feedback

### Key Components
- `testFlashcardGenerator`: Core business logic
- `dedupeUtils`: Anti-duplication and persistence
- `guardiaCivilPerfectGenerator`: Integration with existing system
- Admin UI: User interface and controls
- API endpoints: AI-powered content generation

## Performance Considerations
- **Batch Processing**: Reduces API calls and improves throughput
- **Progressive Timeouts**: Adapts to content complexity
- **Efficient Queries**: Optimized Firestore access patterns
- **Caching Strategy**: Minimizes redundant operations

## Security & Validation
- **Admin-only Access**: Protected routes and operations
- **Input Validation**: Sanitized parameters and content
- **Rate Limiting**: Prevents API abuse
- **Error Boundaries**: Graceful failure handling

This implementation provides a robust, scalable system for managing test and flashcard content with comprehensive quality assurance and user-friendly administration tools.
