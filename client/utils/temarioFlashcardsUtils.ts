import { doc, setDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface TemarioData {
  name: string;
  pdf: {
    url: string;
    storagePath: string;
    pages: number;
    lang: string;
    hash: string;
    createdAt: string;
    updatedAt: string;
  };
  flashcards_count: number;
  lastUpdatedAt: any; // serverTimestamp
}

export interface FlashcardData {
  front: string;
  back: string;
  tags: string[];
  createdAt: any; // serverTimestamp
  updatedAt: any; // serverTimestamp
}

/**
 * Upload PDF to Firebase Storage and create topic document in Firestore
 */
export const uploadTemarioPdf = async (
  assistantSlug: string,
  topicId: string,
  topicName: string,
  pdfFile: File
): Promise<{ success: boolean; error?: string }> => {
  // Configurable retry and timeout strategy
  const maxAttempts = 3;
  const baseTimeoutMs = 2 * 60 * 1000; // 2 minutes base timeout

  // Build storage path
  const storagePath = `assistants/${assistantSlug}/topics/${topicId}/temario.pdf`;
  const storageRef = ref(storage, storagePath);

  const attemptUpload = async (attempt: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const uploadTask = uploadBytesResumable(storageRef, pdfFile);

        const timeoutMs = baseTimeoutMs * attempt; // increase timeout with attempts
        const timeoutHandle = setTimeout(() => {
          // Cancel the upload on timeout
          try {
            uploadTask.cancel();
          } catch (e) {
            console.warn('⚠️ Failed to cancel upload task:', e);
          }
          reject(new Error('Upload timeout'));
        }, timeoutMs);

        uploadTask.on(
          'state_changed',
          // progress
          () => {},
          // error
          (error) => {
            clearTimeout(timeoutHandle);
            console.error(`Upload attempt ${attempt} failed:`, error);
            reject(error);
          },
          // success
          async () => {
            clearTimeout(timeoutHandle);
            try {
              const downloadURL = await getDownloadURL(storageRef);
              resolve(downloadURL);
            } catch (err) {
              reject(err);
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const downloadURL = await attemptUpload(attempt);
      // Success!
      // Calculate PDF hash (simple implementation)
      const hash = await calculateFileHash(pdfFile);

      // Create topic document in Firestore
      const topicData: TemarioData = {
        name: topicName,
        pdf: {
          url: downloadURL,
          storagePath: storagePath,
          pages: await getPdfPageCount(pdfFile), // Estimated
          lang: 'es',
          hash: hash,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        flashcards_count: 0,
        lastUpdatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'assistants', assistantSlug, 'topics', topicId), topicData);

      return { success: true };
    } catch (err: any) {
      lastError = err;

      // If user explicitly canceled, stop retrying
      if (err?.code === 'storage/canceled' && err?.message?.toLowerCase().includes('user canceled')) {
        console.error('Upload canceled by user');
        return { success: false, error: 'Upload canceled by user' };
      }

      // If timeout occurred, and we have attempts left, wait and retry
      const isTimeout = (err && (err.message === 'Upload timeout' || (err?.code && err.code === 'storage/canceled')));

      console.warn(`Upload attempt ${attempt} failed. ${isTimeout ? 'Timeout or canceled.' : ''} ${attempt < maxAttempts ? 'Retrying...' : 'No more retries.'}`);

      if (attempt < maxAttempts) {
        // exponential backoff before next attempt
        const backoffMs = 1000 * Math.pow(2, attempt);
        await new Promise((res) => setTimeout(res, backoffMs));
        continue;
      }

      // Final failure
      console.error('All upload attempts failed:', err);
      // Provide friendly error messages for known cases
      if (err?.code === 'storage/retry-limit-exceeded') {
        return { success: false, error: 'Firebase Storage: excedido el tiempo máximo de reintento. Intenta de nuevo más tarde.' };
      }

      if (err?.code === 'storage/canceled') {
        return { success: false, error: 'Firebase Storage: subida cancelada por el usuario o por timeout.' };
      }

      // If final failure due to CORS or canceled/timeout, attempt server-side upload fallback
      const isCorsOrCanceled = (err && (err?.code === 'storage/canceled' || err?.message === 'Upload timeout'));

      if (isCorsOrCanceled) {
        try {
          // Convert file to base64 and POST to server endpoint
          const arrayBuffer = await pdfFile.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');

          const response = await fetch('/api/upload-temario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assistantSlug,
              topicId,
              filename: 'temario.pdf',
              contentBase64: base64,
              contentType: pdfFile.type || 'application/pdf'
            }),
          });

          const result = await response.json();
          if (result && result.success && result.url) {
            // Save Firestore doc using returned URL
            const hash = await calculateFileHash(pdfFile);
            const topicData: TemarioData = {
              name: topicName,
              pdf: {
                url: result.url,
                storagePath: result.storagePath || `assistants/${assistantSlug}/topics/${topicId}/temario.pdf`,
                pages: await getPdfPageCount(pdfFile),
                lang: 'es',
                hash: hash,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              flashcards_count: 0,
              lastUpdatedAt: serverTimestamp()
            };

            await setDoc(doc(db, 'assistants', assistantSlug, 'topics', topicId), topicData);
            return { success: true };
          } else {
            return { success: false, error: result.error || 'Server upload failed' };
          }
        } catch (serverErr) {
          console.error('Server-side upload fallback failed:', serverErr);
          return { success: false, error: serverErr?.message || String(serverErr) };
        }
      }

      return { success: false, error: err?.message || String(err) };
    }
  }

  // Should not reach here, but return generic error
  return { success: false, error: lastError?.message || 'Unknown upload error' };
};

/**
 * Upload flashcards to Firestore
 */
export const uploadFlashcards = async (
  assistantSlug: string,
  topicId: string,
  flashcards: any[]
): Promise<{ success: boolean; error?: string; count: number }> => {
  try {
    const flashcardsRef = collection(db, 'assistants', assistantSlug, 'topics', topicId, 'flashcards');
    
    let uploadedCount = 0;
    
    for (const flashcard of flashcards) {
      // Normalize tags
      const normalizedTags = flashcard.tags
        .split(',')
        .map((tag: string) => tag.trim().toLowerCase())
        .filter((tag: string) => tag.length > 0);
      
      const flashcardData: FlashcardData = {
        front: flashcard.front.trim(),
        back: flashcard.back.trim(),
        tags: normalizedTags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Check for duplicates by creating a hash of front+back
      const contentHash = await calculateContentHash(flashcard.front + flashcard.back);
      
      await addDoc(flashcardsRef, {
        ...flashcardData,
        contentHash: contentHash
      });
      
      uploadedCount++;
    }
    
    // Update topic's flashcards count
    await updateDoc(doc(db, 'assistants', assistantSlug, 'topics', topicId), {
      flashcards_count: uploadedCount,
      lastUpdatedAt: serverTimestamp()
    });
    
    return { success: true, count: uploadedCount };
  } catch (error) {
    console.error('Error uploading flashcards:', error);
    return { success: false, error: error.message, count: 0 };
  }
};

/**
 * Check if PDF with same hash already exists
 */
export const checkExistingPdf = async (assistantSlug: string, hash: string): Promise<boolean> => {
  try {
    // This would query Firestore to check for existing PDFs with same hash
    // Implementation depends on your indexing strategy
    return false; // For now, always upload
  } catch (error) {
    console.error('Error checking existing PDF:', error);
    return false;
  }
};

/**
 * Validate PDF file
 */
export const validatePdfFile = (file: File): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (file.type !== 'application/pdf') {
    errors.push('El archivo debe ser un PDF válido');
  }
  
  if (file.size > 10 * 1024 * 1024) {
    errors.push('El PDF no debe superar 10MB');
  }
  
  if (file.size === 0) {
    errors.push('El archivo PDF está vacío');
  }
  
  return { valid: errors.length === 0, errors };
};

/**
 * Validate CSV file structure
 */
export const validateCsvFile = async (file: File): Promise<{ valid: boolean; errors: string[]; preview: any[] }> => {
  const errors: string[] = [];
  let preview: any[] = [];
  
  try {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      errors.push('El CSV está vacío');
      return { valid: false, errors, preview };
    }
    
    const header = lines[0].trim();
    const expectedHeader = 'assistant,topic,front,back,tags';
    
    if (header !== expectedHeader) {
      errors.push(`Cabecera incorrecta. Esperada: ${expectedHeader}`);
      return { valid: false, errors, preview };
    }
    
    // Parse data lines
    const dataLines = lines.slice(1);
    preview = dataLines.slice(0, 10).map((line, index) => {
      const columns = line.split(',');
      if (columns.length < 5) {
        errors.push(`Fila ${index + 2}: campos insuficientes`);
        return null;
      }
      
      const row = {
        assistant: columns[0]?.trim(),
        topic: columns[1]?.trim(),
        front: columns[2]?.trim(),
        back: columns[3]?.trim(),
        tags: columns[4]?.trim()
      };
      
      // Validate required fields
      if (!row.front || !row.back) {
        errors.push(`Fila ${index + 2}: campos obligatorios vacíos`);
      }
      
      return row;
    }).filter(Boolean);
    
  } catch (error) {
    errors.push('Error al leer el archivo CSV');
  }
  
  return { valid: errors.length === 0, errors, preview };
};

/**
 * Helper function to calculate file hash
 */
const calculateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Helper function to calculate content hash
 */
const calculateContentHash = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Estimate PDF page count (simplified)
 */
const getPdfPageCount = async (file: File): Promise<number> => {
  // This is a simplified estimation
  // In a real implementation, you would use a PDF parsing library
  const sizeInMB = file.size / (1024 * 1024);
  return Math.max(1, Math.ceil(sizeInMB * 5)); // Rough estimate: 5 pages per MB
};

/**
 * Check if user has admin permissions
 */
export const checkAdminPermissions = (): boolean => {
  // This should check the user's role/permissions
  // For now, we'll assume all authenticated users are admin
  return true;
};

/**
 * Log admin action
 */
export const logAdminAction = async (
  userId: string,
  action: string,
  target: string,
  result: 'success' | 'error',
  error?: string
): Promise<void> => {
  try {
    // Use top-level collection 'admin_logs' to avoid invalid path segment errors
    await addDoc(collection(db, 'admin_logs'), {
      timestamp: serverTimestamp(),
      userId,
      action,
      target,
      result,
      error: error || null
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};
