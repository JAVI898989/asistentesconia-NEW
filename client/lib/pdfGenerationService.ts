import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface PdfGenerationOptions {
  assistantId: string;
  topicSlug: string;
  title: string;
  currentVersion?: number;
  retries?: number;
}

export interface PdfGenerationResult {
  success: boolean;
  pdfUrl?: string;
  version?: number;
  error?: string;
  size?: number;
  duration?: number;
}

class PdfGenerationService {
  private readonly MAX_RETRIES = 3;
  private readonly TIMEOUT_MS = 300000; // 5 minutes
  private readonly MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB limit

  /**
   * Generate PDF for a topic using the print route
   */
  async generatePdfOnPublish(options: PdfGenerationOptions): Promise<PdfGenerationResult> {
    const startTime = Date.now();
    const { assistantId, topicSlug, title, currentVersion = 0, retries = this.MAX_RETRIES } = options;

    console.log(`📄 Starting PDF generation for ${title} (${topicSlug})`);

    try {
      // Generate PDF via server-side API
      const response = await this.callPdfGenerationApi(assistantId, topicSlug, title);

      if (!response.success || !response.pdfData) {
        throw new Error(response.error || 'PDF generation failed');
      }

      // Convert base64 to blob
      const pdfBytes = Uint8Array.from(atob(response.pdfData), c => c.charCodeAt(0));
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const sizeInMB = (pdfBlob.size / 1024 / 1024).toFixed(2);

      console.log(`📊 Generated PDF size: ${sizeInMB}MB for ${title}`);

      // Check if PDF is too large
      if (pdfBlob.size > this.MAX_PDF_SIZE) {
        console.warn(`⚠️ PDF too large (${sizeInMB}MB) for ${title}, skipping upload`);
        return {
          success: false,
          error: `PDF too large (${sizeInMB}MB > 50MB limit)`,
          size: pdfBlob.size
        };
      }

      // Upload to Firebase Storage
      const newVersion = currentVersion + 1;
      const pdfUrl = await this.uploadPdfToStorage(assistantId, topicSlug, pdfBlob, newVersion);

      // Update Firestore with new PDF URL and version
      await this.updateTopicMetadata(assistantId, topicSlug, pdfUrl, newVersion);

      const duration = Date.now() - startTime;
      console.log(`✅ PDF generation completed for ${title} in ${duration}ms`);

      return {
        success: true,
        pdfUrl,
        version: newVersion,
        size: pdfBlob.size,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ PDF generation failed for ${title}:`, error);

      // Retry logic
      if (retries > 0 && !error.message.includes('too large')) {
        console.log(`🔄 Retrying PDF generation for ${title} (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry

        return this.generatePdfOnPublish({
          ...options,
          retries: retries - 1
        });
      }

      return {
        success: false,
        error: error.message || 'PDF generation failed',
        duration
      };
    }
  }

  /**
   * Call the server-side PDF generation API
   */
  private async callPdfGenerationApi(
    assistantId: string,
    topicSlug: string,
    title: string
  ): Promise<{ success: boolean; pdfData?: string; error?: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId,
          topicSlug,
          title,
          printUrl: `${window.location.origin}/print/${assistantId}/${topicSlug}`
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`PDF API failed: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`PDF generation timeout (${this.TIMEOUT_MS / 1000}s)`);
      }

      throw error;
    }
  }

  /**
   * Upload PDF blob to Firebase Storage
   */
  private async uploadPdfToStorage(
    assistantId: string,
    topicSlug: string,
    pdfBlob: Blob,
    version: number
  ): Promise<string> {
    const storage = getStorage();
    const fileName = `v${version}.pdf`;
    const pdfRef = ref(storage, `assistants/${assistantId}/syllabus/${topicSlug}/${fileName}`);

    console.log(`⬆️ Uploading PDF to Storage: ${fileName}`);

    // Upload with cache control headers
    const metadata = {
      cacheControl: 'public,max-age=31536000,immutable',
      contentType: 'application/pdf',
      customMetadata: {
        assistantId,
        topicSlug,
        version: version.toString(),
        generatedAt: new Date().toISOString()
      }
    };

    await uploadBytes(pdfRef, pdfBlob, metadata);

    // Get download URL with cache-busting version parameter
    const downloadURL = await getDownloadURL(pdfRef);
    const urlWithVersion = `${downloadURL}&v=${version}`;

    console.log(`✅ PDF uploaded successfully: ${fileName}`);
    return urlWithVersion;
  }

  /**
   * Update topic metadata in Firestore
   */
  private async updateTopicMetadata(
    assistantId: string,
    topicSlug: string,
    pdfUrl: string,
    version: number
  ): Promise<void> {
    const topicRef = doc(db, "assistants", assistantId, "syllabus", topicSlug);

    console.log(`📝 Updating topic metadata for ${topicSlug}`);

    await updateDoc(topicRef, {
      pdfUrl,
      version,
      status: 'published',
      pdfGenerationFailed: false,
      lastPdfError: null,
      pdfGeneratedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedAtMs: Date.now()
    });

    console.log(`✅ Topic metadata updated: ${topicSlug} v${version}`);
  }

  /**
   * Batch generate PDFs for multiple topics
   */
  async generateBatchPdfs(
    assistantId: string,
    topics: Array<{ slug: string; title: string; version?: number }>,
    onProgress?: (current: number, total: number, currentTopic: string) => void
  ): Promise<{ success: number; failed: number; results: PdfGenerationResult[] }> {
    console.log(`📄 Starting batch PDF generation for ${topics.length} topics`);

    const results: PdfGenerationResult[] = [];
    let success = 0;
    let failed = 0;

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];

      onProgress?.(i + 1, topics.length, topic.title);

      try {
        const result = await this.generatePdfOnPublish({
          assistantId,
          topicSlug: topic.slug,
          title: topic.title,
          currentVersion: topic.version || 0
        });

        results.push(result);

        if (result.success) {
          success++;
        } else {
          failed++;
        }

        // Small delay between generations to avoid overwhelming the system
        if (i < topics.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`❌ Batch PDF generation failed for ${topic.title}:`, error);
        results.push({
          success: false,
          error: error.message || 'Unknown error'
        });
        failed++;
      }
    }

    console.log(`✅ Batch PDF generation completed: ${success} success, ${failed} failed`);

    return {
      success,
      failed,
      results
    };
  }

  /**
   * Verify PDF accessibility
   */
  async verifyPdfUrl(pdfUrl: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(pdfUrl, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;

    } catch (error) {
      console.warn(`PDF verification failed for ${pdfUrl}:`, error);
      return false;
    }
  }

  /**
   * Get PDF file size without downloading
   */
  async getPdfSize(pdfUrl: string): Promise<number | null> {
    try {
      const response = await fetch(pdfUrl, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : null;
    } catch (error) {
      console.warn(`Could not get PDF size for ${pdfUrl}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const pdfGenerationService = new PdfGenerationService();
export default pdfGenerationService;
