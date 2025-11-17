import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db } from "./firebase";
import { safeFetch } from "./fullStoryBypass";
import {
  syllabusTemplateEngine,
  type AdaptedSyllabus,
  type AdaptedBlock
} from "./syllabusTemplateEngine";
import {
  createSyllabus,
  updateSyllabusPdf,
  type AssistantSyllabus,
  type SyllabusCreateData
} from "./syllabusService";

export interface SyllabusGenerationOptions {
  assistantId: string;
  templateId: string;
  adapterId?: string;
  rewriteMinimum?: number;
  generatePdfs?: boolean;
  generateTests?: boolean;
  generateFlashcards?: boolean;
  onProgress?: (step: string, progress: number) => void;
}

export interface SyllabusGenerationResult {
  success: boolean;
  syllabusIds: string[];
  errors: string[];
  adaptedSyllabus: AdaptedSyllabus;
  statistics: {
    totalBlocks: number;
    successfulBlocks: number;
    failedBlocks: number;
    totalHours: number;
    pdfsGenerated: number;
  };
}

export interface SyllabusKey {
  assistantId: string;
  slug: string;
  templateId: string;
  adapterId?: string;
  createdAt: number;
}

class SyllabusGenerator {

  async generateTemplateSyllabus(options: SyllabusGenerationOptions): Promise<SyllabusGenerationResult> {
    const {
      assistantId,
      templateId,
      adapterId,
      generatePdfs = true,
      onProgress
    } = options;

    const result: SyllabusGenerationResult = {
      success: false,
      syllabusIds: [],
      errors: [],
      adaptedSyllabus: null as any,
      statistics: {
        totalBlocks: 0,
        successfulBlocks: 0,
        failedBlocks: 0,
        totalHours: 0,
        pdfsGenerated: 0
      }
    };

    try {
      onProgress?.("Iniciando generación de temario...", 5);

      // Check for existing syllabi to prevent duplicates
      await this.cleanExistingSyllabi(assistantId, templateId, adapterId);

      onProgress?.("Generando estructura adaptada...", 10);

      // Generate adapted syllabus structure
      const adaptedSyllabus = await syllabusTemplateEngine.generateAdaptedSyllabus(
        assistantId,
        templateId,
        adapterId,
        (step, progress) => onProgress?.(step, 10 + (progress * 0.3))
      );

      result.adaptedSyllabus = adaptedSyllabus;
      result.statistics.totalBlocks = adaptedSyllabus.bloques.length;
      result.statistics.totalHours = adaptedSyllabus.metadata.totalHours;

      onProgress?.("Creando temarios individuales...", 40);

      // Create individual syllabus entries
      const syllabusPromises = adaptedSyllabus.bloques.map(async (block, index) => {
        try {
          const progress = 40 + ((index / adaptedSyllabus.bloques.length) * 40);
          onProgress?.(`Creando temario: ${block.titulo}...`, progress);

          const syllabusData: SyllabusCreateData = {
            assistantId,
            title: block.titulo,
            contentMarkdown: block.contentMarkdown,
            order: block.orden
          };

          const syllabusId = await createSyllabus(syllabusData);

          // Store syllabus key to prevent duplicates
          await this.storeSyllabusKey({
            assistantId,
            slug: block.slug,
            templateId,
            adapterId,
            createdAt: Date.now()
          });

          result.syllabusIds.push(syllabusId);
          result.statistics.successfulBlocks++;

          // Generate PDF if requested (but don't fail the whole process)
          if (generatePdfs) {
            try {
              await this.generateSyllabusPdfEnhanced(syllabusId, block, adaptedSyllabus);
              result.statistics.pdfsGenerated++;
            } catch (pdfError) {
              console.warn(`PDF generation failed for ${block.titulo}:`, pdfError);
              // Don't add to errors - PDF generation is optional
              console.log(`📄 Continuing without PDF for: ${block.titulo}`);
            }
          }

          return syllabusId;

        } catch (error) {
          console.error(`Error creating syllabus for ${block.titulo}:`, error);
          result.errors.push(`${block.titulo}: ${error.message}`);
          result.statistics.failedBlocks++;
          return null;
        }
      });

      // Wait for all syllabi to be created
      await Promise.all(syllabusPromises);

      onProgress?.("Finalizando generación...", 95);

      result.success = result.statistics.successfulBlocks > 0;

      onProgress?.("Generación completada", 100);

      console.log(`✅ Syllabus generation completed:`, {
        success: result.success,
        created: result.statistics.successfulBlocks,
        failed: result.statistics.failedBlocks,
        errors: result.errors.length
      });

      return result;

    } catch (error) {
      console.error("Error in template syllabus generation:", error);
      result.errors.push(`Error general: ${error.message}`);
      return result;
    }
  }

  private async cleanExistingSyllabi(
    assistantId: string,
    templateId: string,
    adapterId?: string
  ): Promise<void> {
    try {
      console.log(`🧹 Checking for existing syllabi to clean up...`);

      // Query existing syllabus keys
      const keysQuery = query(
        collection(db, "syllabus_keys"),
        where("assistantId", "==", assistantId),
        where("templateId", "==", templateId)
      );

      const keysSnapshot = await getDocs(keysQuery);

      if (keysSnapshot.empty) {
        console.log("✅ No existing syllabi found, proceeding...");
        return;
      }

      const batch = writeBatch(db);
      let cleanupCount = 0;

      // Mark for cleanup
      keysSnapshot.docs.forEach(keyDoc => {
        const keyData = keyDoc.data() as SyllabusKey;

        // Only clean if same adapter (or both null)
        if (keyData.adapterId === adapterId) {
          batch.delete(keyDoc.ref);
          cleanupCount++;
        }
      });

      if (cleanupCount > 0) {
        await batch.commit();
        console.log(`🧹 Cleaned up ${cleanupCount} existing syllabus keys`);
      }

    } catch (error) {
      console.warn("Warning: Could not clean existing syllabi:", error);
      // Continue anyway - cleanup is optional
    }
  }

  private async storeSyllabusKey(key: SyllabusKey): Promise<void> {
    try {
      const keyData = {
        ...key,
        createdAt: serverTimestamp(),
        createdAtMs: key.createdAt
      };

      await addDoc(collection(db, "syllabus_keys"), keyData);

    } catch (error) {
      console.warn("Warning: Could not store syllabus key:", error);
      // Continue anyway - key storage is for optimization
    }
  }

  private async generateSyllabusPdfEnhanced(
    syllabusId: string,
    block: AdaptedBlock,
    adaptedSyllabus: AdaptedSyllabus
  ): Promise<void> {
    try {
      console.log(`📄 Generating enhanced PDF for: ${block.titulo}`);

      const enhancedMetadata = {
        ...block.metadata,
        templateId: adaptedSyllabus.templateId,
        adapterId: adaptedSyllabus.adapterId,
        assistantId: adaptedSyllabus.assistantId,
        role: adaptedSyllabus.variables.ROL,
        generatedAt: adaptedSyllabus.metadata.generatedAt
      };

      // Try enhanced PDF generation first
      try {
        const response = await safeFetch(`/api/syllabus/${syllabusId}/pdf-enhanced`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: block.titulo,
            contentMarkdown: block.contentMarkdown,
            metadata: enhancedMetadata,
            format: {
              encoding: "UTF-8",
              font: "Arial",
              pageBreaks: false,
              includeMetadata: true
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.ok && data.pdfData) {
            await this.uploadPdfToStorage(syllabusId, data.pdfData, adaptedSyllabus.assistantId, block);
            return;
          }
        }
      } catch (enhancedError) {
        console.log(`📄 Enhanced PDF failed: ${enhancedError.message}`);
      }

      // Fallback to standard PDF generation
      console.log(`📄 Using standard PDF generation for: ${block.titulo}`);
      const fallbackResponse = await safeFetch(`/api/syllabus/${syllabusId}/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: block.titulo,
          contentMarkdown: block.contentMarkdown,
        }),
      });

      if (!fallbackResponse.ok) {
        throw new Error(`PDF generation failed: ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      if (!fallbackData.ok || !fallbackData.pdfData) {
        throw new Error("Invalid PDF generation response");
      }

      await this.uploadPdfToStorage(syllabusId, fallbackData.pdfData, adaptedSyllabus.assistantId, block);

    } catch (error) {
      console.warn(`📄 PDF generation completely failed for ${block.titulo}:`, error.message);
      console.log(`📄 Syllabus content created successfully without PDF for: ${block.titulo}`);

      // Don't throw - PDF generation is optional, the important part is the content creation
    }
  }

  private async uploadPdfToStorage(
    syllabusId: string,
    pdfData: string,
    assistantId: string,
    block: AdaptedBlock
  ): Promise<void> {
    try {
      // Convert base64 to blob
      const pdfBlob = this.base64ToBlob(pdfData, 'application/pdf');

      // Check if PDF is too large (skip if > 10MB)
      if (pdfBlob.size > 10 * 1024 * 1024) {
        console.log(`📄 PDF too large (${Math.round(pdfBlob.size / 1024 / 1024)}MB), skipping upload for: ${block.titulo}`);
        return;
      }

      const timestamp = Date.now();
      const version = 1; // Could be incremented for updates
      const storagePath = `assistants/${assistantId}/syllabus/${block.slug}/v${version}.pdf`;

      const storage = getStorage();
      const storageRef = ref(storage, storagePath);

      const metadata = {
        contentType: 'application/pdf',
        cacheControl: 'public,max-age=31536000,immutable',
        customMetadata: {
          syllabusId,
          assistantId,
          blockSlug: block.slug,
          title: block.titulo,
          version: version.toString(),
          generatedAt: new Date().toISOString(),
          horasEstimadas: block.metadata.horas_estimadas.toString(),
          complejidad: block.metadata.complejidad,
        },
      };

      console.log(`📄 Uploading PDF to: ${storagePath} (${Math.round(pdfBlob.size / 1024)}KB)`);

      // Upload with generous timeout and quick failure
      const uploadPromise = uploadBytes(storageRef, pdfBlob, metadata);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout')), 30000); // Reduced to 30s for faster failure
      });

      await Promise.race([uploadPromise, timeoutPromise]);

      // Get download URL with timeout
      const urlPromise = getDownloadURL(storageRef);
      const urlTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('URL timeout')), 10000); // 10s for URL
      });

      const downloadURL = await Promise.race([urlPromise, urlTimeoutPromise]);

      // Update syllabus with PDF info
      await updateSyllabusPdf(syllabusId, {
        downloadURL,
        storagePath,
        version
      });

      console.log(`✅ PDF uploaded successfully for: ${block.titulo}`);

    } catch (error) {
      // Don't throw errors for PDF uploads - they're optional
      console.warn(`⚠️ PDF upload failed for ${block.titulo}:`, error.message);
      console.log(`📄 Syllabus created successfully without PDF attachment for: ${block.titulo}`);

      // Gracefully continue - the main content generation is successful
    }
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  async regenerateTests(assistantId: string, syllabusId: string): Promise<void> {
    try {
      console.log(`🧪 Regenerating tests for syllabus: ${syllabusId}`);

      // Get syllabus content
      const syllabusRef = doc(db, "assistant_syllabus", syllabusId);
      const syllabusDoc = await getDoc(syllabusRef);

      if (!syllabusDoc.exists()) {
        throw new Error("Syllabus not found");
      }

      const syllabus = syllabusDoc.data() as AssistantSyllabus;

      // Generate new tests from content
      const testsResponse = await safeFetch("/api/tests/generate-from-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId,
          themeTitle: syllabus.title,
          contentMarkdown: syllabus.contentMarkdown,
          quantity: 20
        }),
      });

      if (!testsResponse.ok) {
        throw new Error("Failed to generate tests");
      }

      const testsData = await testsResponse.json();
      console.log(`✅ Generated ${testsData.tests.length} new tests`);

    } catch (error) {
      console.error("Error regenerating tests:", error);
      throw error;
    }
  }

  async regenerateFlashcards(assistantId: string, syllabusId: string): Promise<void> {
    try {
      console.log(`📚 Regenerating flashcards for syllabus: ${syllabusId}`);

      // Get syllabus content
      const syllabusRef = doc(db, "assistant_syllabus", syllabusId);
      const syllabusDoc = await getDoc(syllabusRef);

      if (!syllabusDoc.exists()) {
        throw new Error("Syllabus not found");
      }

      const syllabus = syllabusDoc.data() as AssistantSyllabus;

      // Generate new flashcards from content
      const flashcardsResponse = await safeFetch("/api/flashcards/generate-from-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId,
          themeTitle: syllabus.title,
          contentMarkdown: syllabus.contentMarkdown,
          quantity: 15
        }),
      });

      if (!flashcardsResponse.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const flashcardsData = await flashcardsResponse.json();
      console.log(`✅ Generated ${flashcardsData.flashcards.length} new flashcards`);

    } catch (error) {
      console.error("Error regenerating flashcards:", error);
      throw error;
    }
  }

  async cleanGenericSyllabi(assistantId: string): Promise<number> {
    try {
      console.log(`🧹 Cleaning generic syllabi for assistant: ${assistantId}`);

      // Get all syllabi for assistant
      const syllabusQuery = query(
        collection(db, "assistant_syllabus"),
        where("assistantId", "==", assistantId)
      );

      const syllabusSnapshot = await getDocs(syllabusQuery);
      const batch = writeBatch(db);
      let cleanupCount = 0;

      // Check each syllabus against syllabus_keys
      for (const syllabusDoc of syllabusSnapshot.docs) {
        const syllabusData = syllabusDoc.data() as AssistantSyllabus;

        // If no corresponding key found, it's a "generic" syllabus
        const keysQuery = query(
          collection(db, "syllabus_keys"),
          where("assistantId", "==", assistantId)
        );

        const keysSnapshot = await getDocs(keysQuery);
        const hasKey = keysSnapshot.docs.some(keyDoc => {
          const keyData = keyDoc.data() as SyllabusKey;
          return keyData.assistantId === assistantId;
        });

        if (!hasKey) {
          batch.delete(syllabusDoc.ref);
          cleanupCount++;
        }
      }

      if (cleanupCount > 0) {
        await batch.commit();
        console.log(`🧹 Cleaned ${cleanupCount} generic syllabi`);
      }

      return cleanupCount;

    } catch (error) {
      console.error("Error cleaning generic syllabi:", error);
      throw error;
    }
  }
}

export const syllabusGenerator = new SyllabusGenerator();
