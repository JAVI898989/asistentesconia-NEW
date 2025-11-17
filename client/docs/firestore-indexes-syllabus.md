# Firestore Indexes for Syllabus System

## Required Composite Indexes

### 1. assistant_syllabus Collection

Create the following composite index for the `assistant_syllabus` collection:

**Collection ID:** `assistant_syllabus`

**Fields to index:**
1. `assistantId` (Ascending)
2. `status` (Ascending)  
3. `createdAtMs` (Descending)

**Query scopes:** Collection

This index supports the following queries:
- Get published syllabi for a specific assistant ordered by creation date
- Real-time subscription to syllabus updates
- Admin dashboard queries for syllabus management

## Single Field Indexes

Make sure the following single field indexes exist:

### assistant_syllabus Collection
- `assistantId` (Ascending) - for assistant-specific queries
- `status` (Ascending) - for status filtering
- `createdAtMs` (Descending) - for date sorting

## Firestore Console Setup

1. Go to Firebase Console > Firestore Database > Indexes
2. Click "Create Index"
3. Fill in the fields as specified above for the composite index
4. Click "Create"

## Direct Index Creation Link

The system provides a direct link to create the required index:

**Assistant Syllabus Index:**
https://console.firebase.google.com/v1/r/project/cursor-64188/firestore/indexes?create_composite=Cldwcm9qZWN0cy9jdXJzb3ItNjQxODgvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Fzc2lzdGFudF9zeWxsYWJ1cy9pbmRleGVzL18QARoPCgthc3Npc3RhbnRJZBABGgoKBnN0YXR1cxABGg8KC2NyZWF0ZWRBdE1zEAIaDAoIX19uYW1lX18QAg

## CLI Command (if using Firebase CLI)

```bash
# Add to firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "assistant_syllabus",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "assistantId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status", 
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtMs",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

Deploy with:
```bash
firebase deploy --only firestore:indexes
```

## Security Rules

Add these rules to your `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Syllabus documents
    match /assistant_syllabus/{syllabusId} {
      // Allow read access to published syllabi
      allow read: if resource.data.status == 'published';
      // Allow admin write access
      allow write: if request.auth != null && 
                      (request.auth.token.admin == true || 
                       request.auth.token.role == 'admin');
    }
  }
}
```

## Error Handling

The syllabus service includes graceful error handling for missing indexes:

### Fallback Strategy
1. **Primary query:** `where('assistantId', '==', id).where('status', '==', 'published').orderBy('createdAtMs', 'desc')` ❌
2. **Fallback query:** `where('assistantId', '==', id)` ✅
3. **In-memory filtering:** Filter by status and sort by createdAtMs in JavaScript
4. **Performance impact:** Minimal for typical datasets (<100 syllabi per assistant)

### Error Recovery
- Automatic fallback to basic queries when composite index is missing
- Console logging with direct links to create required indexes
- User-friendly error messages and recovery instructions
- Retry mechanisms for when indexes become available

## Troubleshooting

If you're still seeing index errors after creating the indexes:

1. **Wait for propagation**: Index creation can take 1-5 minutes
2. **Check index status**: Verify the index is "Built" in Firebase Console
3. **Clear browser cache**: Hard refresh the application
4. **Check query structure**: Ensure queries match the index exactly

## Performance Notes

- **With Index**: Queries execute in O(log n) time
- **Without Index**: Fallback queries may take longer but remain functional
- **Data Size Impact**: Index creation time increases with collection size
- **Cost Impact**: Indexes consume storage space and write operations

The syllabus system is designed to work reliably both with and without the composite index, ensuring uninterrupted functionality while indexes are being created.
