import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  UploadMetadata 
} from 'firebase/storage';
import { 
  doc, 
  updateDoc, 
  serverTimestamp, 
  increment,
  getDoc
} from 'firebase/firestore';
import { db, storage } from '@/lib/simpleAuth';

export interface AssistantAvatar {
  downloadURL: string;
  thumbURL?: string;
  storagePath: string;
  thumbPath?: string;
  width: number;
  height: number;
  format: string;
  alt: string;
  version: number;
  updatedAt: any; // serverTimestamp
  updatedAtMs: number;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * Create WebP thumbnail using canvas
 */
async function createWebPThumbnail(
  file: File, 
  maxSize: number = 512
): Promise<{ blob: Blob; width: number; height: number; format: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      try {
        // Calculate dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and convert to WebP
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ 
                blob, 
                width: Math.round(width), 
                height: Math.round(height), 
                format: 'webp' 
              });
            } else {
              reject(new Error('Failed to create thumbnail'));
            }
          },
          'image/webp',
          0.8
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Formato no soportado. Use JPG, PNG o WebP.' 
    };
  }
  
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'El archivo es demasiado grande. Máximo 5MB.' 
    };
  }
  
  return { valid: true };
}

/**
 * Upload assistant image with thumbnail generation
 */
export async function uploadAssistantImage(
  assistantId: string,
  file: File,
  alt: string = '',
  onProgress?: UploadProgressCallback
): Promise<AssistantAvatar> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  onProgress?.(10);
  
  // Generate thumbnail
  const thumbnail = await createWebPThumbnail(file, 512);
  onProgress?.(25);
  
  // Create file paths
  const timestamp = Date.now();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const basePath = `assistants/${assistantId}/images/${timestamp}`;
  
  const originalPath = `${basePath}-original.${ext}`;
  const thumbPath = `${basePath}-thumb.webp`;
  
  // Upload metadata
  const uploadMetadata: UploadMetadata = {
    contentType: file.type,
    cacheControl: 'public,max-age=31536000,immutable',
    customMetadata: {
      assistantId,
      uploadedBy: 'admin', // This should come from auth context
      role: 'admin',
      version: '1'
    }
  };
  
  const thumbMetadata: UploadMetadata = {
    contentType: 'image/webp',
    cacheControl: 'public,max-age=31536000,immutable',
    customMetadata: {
      assistantId,
      uploadedBy: 'admin',
      role: 'admin',
      version: '1'
    }
  };
  
  try {
    onProgress?.(40);
    
    // Upload original
    const originalRef = ref(storage, originalPath);
    await uploadBytes(originalRef, file, uploadMetadata);
    const downloadURL = await getDownloadURL(originalRef);
    
    onProgress?.(70);
    
    // Upload thumbnail
    const thumbRef = ref(storage, thumbPath);
    await uploadBytes(thumbRef, thumbnail.blob, thumbMetadata);
    const thumbURL = await getDownloadURL(thumbRef);
    
    onProgress?.(85);
    
    // Get current version
    const docRef = doc(db, 'assistants', assistantId);
    const docSnap = await getDoc(docRef);
    const currentVersion = docSnap.exists() ? (docSnap.data().avatar?.version || 0) : 0;
    
    // Create avatar object
    const avatar: AssistantAvatar = {
      downloadURL,
      thumbURL,
      storagePath: originalPath,
      thumbPath,
      width: thumbnail.width,
      height: thumbnail.height,
      format: thumbnail.format,
      alt,
      version: currentVersion + 1,
      updatedAt: serverTimestamp(),
      updatedAtMs: Date.now()
    };
    
    // Update Firestore
    await updateDoc(docRef, { avatar });
    
    onProgress?.(100);
    
    return avatar;
    
  } catch (error) {
    // Cleanup on error
    try {
      const originalRef = ref(storage, originalPath);
      await deleteObject(originalRef);
    } catch {}
    
    try {
      const thumbRef = ref(storage, thumbPath);
      await deleteObject(thumbRef);
    } catch {}
    
    throw error;
  }
}

/**
 * Delete assistant image
 */
export async function deleteAssistantImage(assistantId: string): Promise<void> {
  const docRef = doc(db, 'assistants', assistantId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Asistente no encontrado');
  }
  
  const avatar = docSnap.data().avatar;
  if (!avatar) {
    return; // No image to delete
  }
  
  // Delete from Storage
  if (avatar.storagePath) {
    try {
      const originalRef = ref(storage, avatar.storagePath);
      await deleteObject(originalRef);
    } catch (error) {
      console.warn('Failed to delete original image:', error);
    }
  }
  
  if (avatar.thumbPath) {
    try {
      const thumbRef = ref(storage, avatar.thumbPath);
      await deleteObject(thumbRef);
    } catch (error) {
      console.warn('Failed to delete thumbnail:', error);
    }
  }
  
  // Remove from Firestore
  await updateDoc(docRef, { avatar: null });
}

/**
 * Get image URL with cache busting
 */
export function getImageWithCacheBusting(avatar: AssistantAvatar | null, useThumb: boolean = true): string | null {
  if (!avatar) return null;
  
  const url = useThumb && avatar.thumbURL ? avatar.thumbURL : avatar.downloadURL;
  return avatar.version ? `${url}?v=${avatar.version}` : url;
}
