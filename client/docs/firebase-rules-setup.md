# Firebase Rules Setup for Assistant Image Persistence

## Firebase Storage Rules

Add these rules to your Firebase Storage to allow image uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Assistant images - public read, authenticated write
    match /assistants/{assistantId}/images/{allPaths=**} {
      allow read: if true;  // Public read access for displaying images
      allow write: if request.auth != null  // Only authenticated users can upload
                  && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                  && request.resource.contentType.matches('image/.*');  // Only images
    }
  }
}
```

## Firestore Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Assistants collection - allow read/write for authenticated users
    match /assistants/{assistantId} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Authenticated users can update
    }
    
    // Assistant media collection - for image history
    match /assistant_media/{mediaId} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Authenticated users can create records
    }
  }
}
```

## Required Collections Structure

### assistants/{assistantId}
```typescript
{
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;      // Firebase Storage download URL
  coverImagePath?: string;     // Storage path for management
  updatedAt?: serverTimestamp; // When image was last updated
  updatedAtMs?: number;        // Numeric timestamp for ordering
  // ... other assistant fields
}
```

### assistant_media/{mediaId}
```typescript
{
  id: string;
  assistantId: string;
  type: 'image';
  storagePath: string;         // Full storage path
  downloadURL: string;         // Public download URL
  status: 'active' | 'inactive';
  createdAt: serverTimestamp;
  createdAtMs: number;
}
```

## Environment Variables

Make sure these environment variables are set:

```env
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

## Testing the Setup

1. Navigate to `/test-images` in your application
2. Select an assistant from the dropdown
3. Click "Gestionar Imagen" and upload a new image
4. Verify that:
   - Image uploads successfully to Firebase Storage
   - Firestore documents are updated with new URLs
   - Image displays immediately without page refresh
   - Image persists after page reload
   - Old images are marked as inactive in history

## Troubleshooting

### Upload Fails
- Check Firebase Storage rules
- Verify authentication is working
- Check file size (max 5MB) and type (images only)

### Images Don't Persist
- Check Firestore rules
- Verify collection names match (`assistants`, `assistant_media`)
- Check browser console for errors

### Real-time Updates Don't Work
- Verify Firestore rules allow reading
- Check browser console for subscription errors
- Ensure component is properly unmounting subscriptions

## Production Considerations

1. **Storage Cleanup**: Implement a cleanup function to remove inactive images from Storage
2. **Image Optimization**: Consider adding image resizing/optimization
3. **CDN**: Firebase Storage automatically provides CDN capabilities
4. **Security**: Restrict upload permissions based on user roles
5. **Quotas**: Monitor Firebase Storage and Firestore usage
