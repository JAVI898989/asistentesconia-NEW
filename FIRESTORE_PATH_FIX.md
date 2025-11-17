# Fix: Firestore Collection Reference Error

## ❌ **Error Identified:**
```
FirebaseError: Invalid collection reference. Collection references must have an odd number of segments, but assistants/guardia-civil/temario/tema-1 has 4.
```

## 🔍 **Root Cause:**
In `client/utils/assistantTemariosUtils.ts`, line 74 was incorrectly using a 4-segment path as a collection reference:

```typescript
// ❌ INCORRECT (4 segments = document path, not collection)
const documentoCollection = collection(db, `assistants/${assistantId}/temario/${themeId}`);
```

## ✅ **Solution Applied:**
Fixed the path to have 5 segments (odd number) to make it a valid collection reference:

```typescript
// ✅ CORRECT (5 segments = valid collection path)
const documentoCollection = collection(db, `assistants/${assistantId}/temario/${themeId}/documentos`);
```

## 📋 **Firestore Path Structure Rules:**
- **Collections**: Must have ODD number of segments (1, 3, 5, 7...)
- **Documents**: Must have EVEN number of segments (2, 4, 6, 8...)

### Example Correct Structure:
```
assistants                          (1 segment - Collection ✅)
assistants/guardia-civil            (2 segments - Document ✅)
assistants/guardia-civil/temario    (3 segments - Collection ✅)
assistants/guardia-civil/temario/tema-1  (4 segments - Document ✅)
assistants/guardia-civil/temario/tema-1/documentos  (5 segments - Collection ✅)
```

## 🔧 **File Modified:**
- `client/utils/assistantTemariosUtils.ts` (line 74)

## ✅ **Result:**
The error should now be resolved. The code properly references the `documentos` subcollection within each theme document.
