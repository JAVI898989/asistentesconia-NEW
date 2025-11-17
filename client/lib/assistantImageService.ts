import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  doc, 
  updateDoc, 
  addDoc, 
  collection, 
  serverTimestamp, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  DocumentSnapshot 
} from 'firebase/firestore';
import { db, storage } from '@/lib/simpleAuth';

export interface AssistantMediaRecord {
  id?: string;
  assistantId: string;
  type: 'image';
  storagePath: string;
  downloadURL: string;
  status: 'active' | 'inactive';
  createdAt: any; // serverTimestamp
  createdAtMs: number;
}

export interface AssistantWithImage {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  coverImagePath?: string;
  updatedAt?: any;
  updatedAtMs?: number;
  [key: string]: any;
}

/**
 * Upload assistant image to Firebase Storage with versioned path and update Firestore
 */
export async function updateAssistantImage(
  file: File, 
  assistantId: string,
  onProgress?: (progress: number) => void
): Promise<{ downloadURL: string; storagePath: string }> {
  if (!file || !assistantId) {
    throw new Error('File and assistantId are required');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  const safeFileName = file.name.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9.-]/g, '');
  const storagePath = `assistants/${assistantId}/images/${Date.now()}-${safeFileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    // 1) Upload to Storage with progress tracking
    await new Promise<void>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file, { 
        contentType: file.type,
        customMetadata: { 
          assistantId,
          uploadedAt: new Date().toISOString()
        }
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
          console.log(`📤 Upload progress: ${progress.toFixed(1)}%`);
        },
        (error) => {
          console.error('❌ Upload failed:', error);
          reject(error);
        },
        () => {
          console.log('✅ Upload completed');
          resolve();
        }
      );
    });

    // 2) Get the persistent download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('📎 Got download URL:', downloadURL);

    // 3) Create media record in assistant_media collection
    const mediaRecord: Omit<AssistantMediaRecord, 'id'> = {
      assistantId,
      type: 'image',
      storagePath,
      downloadURL,
      status: 'active',
      createdAt: serverTimestamp(),
      createdAtMs: Date.now()
    };

    const mediaDocRef = await addDoc(collection(db, 'assistant_media'), mediaRecord);
    console.log('📝 Created media record:', mediaDocRef.id);

    // 4) Mark previous images as inactive
    const prevQuery = query(
      collection(db, 'assistant_media'),
      where('assistantId', '==', assistantId),
      where('type', '==', 'image'),
      where('status', '==', 'active')
    );
    
    const prevDocs = await getDocs(prevQuery);
    const updatePromises = prevDocs.docs
      .filter(docSnapshot => docSnapshot.data().storagePath !== storagePath)
      .map(docSnapshot => updateDoc(docSnapshot.ref, { status: 'inactive' }));
    
    await Promise.all(updatePromises);
    console.log(`📝 Marked ${updatePromises.length} previous images as inactive`);

    // 5) Update the assistant document with new image info
    const assistantRef = doc(db, 'assistants', assistantId);
    await updateDoc(assistantRef, {
      coverImageUrl: downloadURL,
      coverImagePath: storagePath,
      updatedAt: serverTimestamp(),
      updatedAtMs: Date.now()
    });
    
    console.log('✅ Updated assistant document with new image');

    return { downloadURL, storagePath };

  } catch (error) {
    console.error('❌ Error updating assistant image:', error);
    throw error;
  }
}

/**
 * Subscribe to assistant data changes in real-time
 */
export function subscribeToAssistant(
  assistantId: string,
  onUpdate: (assistant: AssistantWithImage | null) => void,
  onError?: (error: Error) => void
): () => void {
  const assistantRef = doc(db, 'assistants', assistantId);
  
  return onSnapshot(
    assistantRef,
    (snapshot: DocumentSnapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onUpdate({
          id: snapshot.id,
          ...data
        } as AssistantWithImage);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('❌ Error in assistant subscription:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Get assistant media history
 */
export async function getAssistantMediaHistory(assistantId: string): Promise<AssistantMediaRecord[]> {
  const mediaQuery = query(
    collection(db, 'assistant_media'),
    where('assistantId', '==', assistantId),
    where('type', '==', 'image')
  );
  
  const snapshot = await getDocs(mediaQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as AssistantMediaRecord[];
}

/**
 * Get active assistant image URL
 */
export async function getActiveAssistantImage(assistantId: string): Promise<string | null> {
  const assistantRef = doc(db, 'assistants', assistantId);
  const snapshot = await getDocs(query(collection(db, 'assistants')));
  
  // First try to get from assistant document
  const assistantDoc = snapshot.docs.find(doc => doc.id === assistantId);
  if (assistantDoc?.data()?.coverImageUrl) {
    return assistantDoc.data().coverImageUrl;
  }

  // Fallback to media collection
  const mediaQuery = query(
    collection(db, 'assistant_media'),
    where('assistantId', '==', assistantId),
    where('type', '==', 'image'),
    where('status', '==', 'active')
  );
  
  const mediaSnapshot = await getDocs(mediaQuery);
  const activeMedia = mediaSnapshot.docs[0];
  
  return activeMedia?.data()?.downloadURL || null;
}
