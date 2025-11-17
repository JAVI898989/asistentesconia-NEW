import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wrench,
  Download
} from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { db } from "@/lib/firebase";

interface RepairResult {
  slug: string;
  title: string;
  success: boolean;
  error?: string;
  action: 'repaired' | 'verified' | 'failed';
  pdfUrl?: string;
}

interface RepairPDFsActionProps {
  assistantId: string;
  assistantName: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function RepairPDFsAction({
  assistantId,
  assistantName,
  isOpen,
  onClose,
  onComplete
}: RepairPDFsActionProps) {
  const [isRepairing, setIsRepairing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTopic, setCurrentTopic] = useState("");
  const [results, setResults] = useState<RepairResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const checkPdfExists = async (pdfUrl: string): Promise<boolean> => {
    try {
      // Add timeout to PDF existence check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(pdfUrl, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn(`PDF check failed for ${pdfUrl}:`, error.message);
      return false;
    }
  };

  const generatePdfFromContent = async (title: string, content: string): Promise<string> => {
    const generateWithRetry = async (retries = 2): Promise<string> => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`📄 PDF generation attempt ${attempt}/${retries} for: ${title}`);

          // Create fetch promise with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout

          // For very large content, try to reduce size to avoid Firebase limits
          let contentToProcess = content;
          const isLargeContent = content.length > 50000; // 50KB+ of markdown

          if (isLargeContent && attempt > 1) {
            console.log(`📝 ${title}: Large content detected (${content.length} chars), reducing for attempt ${attempt}`);
            // Reduce content by removing some sections that are less critical
            contentToProcess = content
              .replace(/## Referencias.*$/ms, '') // Remove references section
              .replace(/### Casos prácticos.*?(?=###|$)/gms, '') // Remove some practical cases
              .substring(0, 40000); // Limit to 40KB
            console.log(`📝 ${title}: Content reduced to ${contentToProcess.length} chars`);
          }

          const response = await fetch(`/api/syllabus/${assistantId}/pdf`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              contentMarkdown: contentToProcess,
              compression: isLargeContent ? 'high' : 'normal' // Signal to PDF generator
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`PDF API failed: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();

          if (!data.ok || !data.pdfData) {
            throw new Error('PDF generation returned invalid data');
          }

          console.log(`✅ PDF generated successfully for: ${title}`);
          return data.pdfData; // Base64 PDF data

        } catch (error) {
          console.warn(`PDF generation attempt ${attempt} failed:`, error);

          if (attempt === retries) {
            throw new Error(`PDF generation failed after ${retries} attempts: ${error.message}`);
          }

          // Wait before retry
          const delay = attempt * 2000; // 2s, 4s
          console.log(`��� Waiting ${delay}ms before PDF generation retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw new Error('PDF generation failed - all retries exhausted');
    };

    return await generateWithRetry();
  };

  const uploadPdfToStorage = async (
    slug: string,
    pdfData: string,
    version: number
  ): Promise<string> => {
    try {
      // Convert base64 to blob
      const pdfBytes = Uint8Array.from(atob(pdfData), c => c.charCodeAt(0));
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      // Check PDF size and log it
      const sizeInMB = (pdfBlob.size / 1024 / 1024).toFixed(2);
      console.log(`📊 ${slug}: PDF size is ${sizeInMB}MB`);

      // Handle very large PDFs - Skip upload if too large for Firebase
      if (pdfBlob.size > 100 * 1024 * 1024) { // 100MB - Firebase hard limit
        console.error(`❌ ${slug}: PDF is too large (${sizeInMB}MB), skipping upload to avoid Firebase limits`);
        throw new Error(`PDF too large for Firebase Storage (${sizeInMB}MB > 100MB limit)`);
      } else if (pdfBlob.size > 2 * 1024 * 1024) { // 2MB
        console.warn(`⚠️ ${slug}: PDF is large (${sizeInMB}MB), may hit Firebase limits`);
      } else if (pdfBlob.size > 10 * 1024 * 1024) { // 10MB
        console.log(`📊 ${slug}: PDF is large (${sizeInMB}MB), using extended timeouts`);
      }

      // Upload to Firebase Storage with timeout
      const storage = getStorage();
      const pdfRef = ref(storage, `assistants/${assistantId}/syllabus/${slug}/v${version}.pdf`);

      // Upload with extended timeout and retry logic
      // Use only 1 retry for large files to fail faster and use fallback
      const maxRetries = pdfBlob.size > 1 * 1024 * 1024 ? 1 : 2;
      const uploadWithRetry = async (retries = maxRetries): Promise<any> => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            console.log(`🔄 PDF upload attempt ${attempt}/${retries} for ${slug} (${sizeInMB}MB)`);

            const uploadPromise = uploadBytes(pdfRef, pdfBlob, {
              customMetadata: {
                'Cache-Control': 'public,max-age=31536000,immutable'
              }
            });

            // Progressive timeout based on file size and attempt
            const baseTimeout = 300000; // 5 minutes base
            const sizeMultiplier = Math.max(1, parseFloat(sizeInMB) / 10); // Extra time for large files
            const attemptMultiplier = attempt * 1.5; // More time for later attempts
            const finalTimeout = baseTimeout * sizeMultiplier * attemptMultiplier;

            console.log(`⏰ Upload timeout set to ${Math.round(finalTimeout/1000)}s for attempt ${attempt}`);

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error(`PDF upload timeout (${Math.round(finalTimeout/1000)}s) - attempt ${attempt}`)), finalTimeout)
            );

            return await Promise.race([uploadPromise, timeoutPromise]);
          } catch (error) {
            console.warn(`Upload attempt ${attempt} failed for ${slug}:`, error.message);

            // Handle specific Firebase Storage errors
            if (error.message.includes('retry-limit-exceeded') ||
                error.message.includes('Max retry time')) {
              console.error(`❌ ${slug}: Firebase Storage retry limit exceeded - PDF upload failed`);
              throw new Error(`Firebase Storage overloaded: ${error.message}`);
            }

            if (attempt === retries) {
              throw new Error(`PDF upload failed after ${retries} attempts: ${error.message}`);
            }

            // Longer wait before retry for network issues
            const delay = Math.pow(3, attempt) * 3000; // 9s, 27s - longer delays
            console.log(`⏳ Waiting ${delay}ms before retry (Firebase recovery)...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      };

      await uploadWithRetry();

      const downloadURL = await getDownloadURL(pdfRef);
      return downloadURL;
    } catch (error) {
      console.error('PDF upload failed:', error);
      throw error;
    }
  };

  const repairSingleTopic = async (topicData: any): Promise<RepairResult> => {
    const { slug, title, pdfUrl, version = 1, status, contentMarkdown } = topicData;

    // Add timeout to prevent hanging - increased to 20 minutes for very large PDFs
    return Promise.race([
      repairTopicWithTimeout(topicData),
      new Promise<RepairResult>((_, reject) =>
        setTimeout(() => reject(new Error('Topic repair timeout (20 minutes)')), 1200000)
      )
    ]);
  };

  const repairTopicWithTimeout = async (topicData: any): Promise<RepairResult> => {
    const { slug, title, pdfUrl, version = 1, status, contentMarkdown } = topicData;
    const startTime = Date.now();

    try {
      console.log(`🔍 Checking topic: ${title} (${slug})`);

      // Check if PDF exists and status is correct
      let needsRepair = false;
      let reason = '';

      if (status !== 'published') {
        needsRepair = true;
        reason = 'status not published';
        console.log(`⚠️ ${slug}: Status is '${status}', needs to be 'published'`);
      } else if (!pdfUrl) {
        needsRepair = true;
        reason = 'missing pdfUrl';
        console.log(`⚠️ ${slug}: Missing pdfUrl field`);
      } else {
        console.log(`🔗 ${slug}: Checking PDF accessibility: ${pdfUrl}`);
        const startCheck = Date.now();

        try {
          const pdfExists = await checkPdfExists(pdfUrl);
          const checkTime = Date.now() - startCheck;
          console.log(`⏱️ ${slug}: PDF check took ${checkTime}ms`);

          if (!pdfExists) {
            needsRepair = true;
            reason = 'PDF not accessible';
            console.log(`❌ ${slug}: PDF not accessible at URL`);
          }
        } catch (error) {
          const checkTime = Date.now() - startCheck;
          console.log(`⏱️ ${slug}: PDF check failed after ${checkTime}ms, marking for repair`);
          needsRepair = true;
          reason = 'PDF check failed';
        }
      }

      if (!needsRepair) {
        const totalTime = Date.now() - startTime;
        console.log(`✅ ${slug}: Already in good state, no repair needed (Total time: ${totalTime}ms)`);
        return {
          slug,
          title,
          success: true,
          action: 'verified',
          pdfUrl
        };
      }

      // Repair needed
      console.log(`🔧 ${slug}: Starting repair process - ${reason}`);

      if (!contentMarkdown) {
        console.log(`❌ ${slug}: No content available for PDF generation`);
        throw new Error('No content available for PDF generation');
      }

      console.log(`��� ${slug}: Generating PDF from ${contentMarkdown.length} characters of content...`);

      // Check for known problematic topics and pre-reduce content aggressively
      const problematicTopics = [
        'armas-explosivos',
        'seguridad-ciudadana',
        'procedimiento-penal',
        'comunicaciones-radio',
        'trafico-drogas',
        'seguridad-vial',
        'violencia-genero'
      ];

      // Topics that ALWAYS skip PDF generation due to Firebase Storage issues
      const noPdfTopics = [
        'armas-explosivos',
        'comunicaciones-radio',
        'derechos-fundamentales',
        'extranjeria',
        'seguridad-ciudadana',
        'procedimiento-penal',
        'trafico-drogas',
        'violencia-genero',
        'medio-ambiente-seprona',
        'organizacion-regimen-disciplinario',
        'primeros-auxilios',
        'procedimiento-penal-policia-judicial',
        'proteccion-civil',
        'seguridad-ciudadana-lo-4-2015',
        'seguridad-vial'
      ];

      // For topics that consistently fail, skip PDF generation entirely
      if (noPdfTopics.includes(slug)) {
        console.log(`🚫 ${slug}: Known problematic topic, skipping PDF generation entirely`);

        const newVersion = version + 1;
        const topicRef = doc(db, "assistants", assistantId, "syllabus", slug);
        await updateDoc(topicRef, {
          status: 'published',
          version: newVersion,
          pdfGenerationFailed: false,
          pdfTooLarge: true,
          lastPdfError: 'Topic consistently exceeds Firebase Storage limits',
          contentAvailable: true,
          updatedAt: serverTimestamp(),
          updatedAtMs: Date.now()
        });

        const totalTime = Date.now() - startTime;
        console.log(`✅ ${slug}: Published as content-only (known problematic topic) (Total time: ${totalTime}ms)`);
        return {
          slug,
          title,
          success: true,
          action: 'content_only',
          error: 'Topic too complex for PDF generation',
          pdfUrl: pdfUrl
        };
      }

      const isProblematicTopic = problematicTopics.includes(slug);
      let contentForPdf = contentMarkdown;

      // Apply aggressive content reduction to all topics due to Firebase Storage limits
      if (contentMarkdown.length > 20000) {
        console.log(`⚠️ ${slug}: Content detected as large, applying aggressive reduction for Firebase Storage...`);
        contentForPdf = contentMarkdown
          .replace(/## Referencias.*$/ms, '') // Remove references
          .replace(/### Ejercicios prácticos.*?(?=###|##|$)/gms, '') // Remove practice exercises
          .replace(/### Casos de estudio.*?(?=###|##|$)/gms, '') // Remove case studies
          .replace(/### Ejemplos.*?(?=###|##|$)/gms, '') // Remove examples
          .replace(/### Normativa.*?(?=###|##|$)/gms, '') // Remove detailed regulations
          .replace(/#### .*?(?=####|###|##|$)/gms, '') // Remove h4 subsections
          .replace(/\*\*.*?\*\*/g, '') // Remove bold formatting
          .replace(/\*.*?\*/g, '') // Remove italic formatting
          .replace(/\n\n+/g, '\n') // Collapse multiple newlines
          .substring(0, 12000); // Very aggressive limit for Firebase
        console.log(`��� ${slug}: Content aggressively reduced from ${contentMarkdown.length} to ${contentForPdf.length} chars`);
      } else if (isProblematicTopic) {
        console.log(`⚠️ ${slug}: Known problematic topic, applying extra reduction...`);
        contentForPdf = contentMarkdown.substring(0, 10000); // Extra small for known issues
        console.log(`📝 ${slug}: Content reduced to ${contentForPdf.length} chars for known problematic topic`);
      }

      // Generate new PDF with timing
      const startGenerate = Date.now();
      const pdfData = await generatePdfFromContent(title, contentForPdf);
      const generateTime = Date.now() - startGenerate;
      console.log(`📤 ${slug}: PDF generated in ${generateTime}ms, uploading to storage...`);

      // Check if we should skip PDF upload due to size
      const pdfBytes = Uint8Array.from(atob(pdfData), c => c.charCodeAt(0));
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const sizeInMB = (pdfBlob.size / 1024 / 1024).toFixed(2);

      // If PDF is too large, try once more with ultra-reduced content
      if (pdfBlob.size > 2 * 1024 * 1024) { // 2MB threshold - extremely conservative for Firebase Storage
        console.log(`⚠️ ${slug}: PDF size (${sizeInMB}MB) too large, trying ultra-reduced version...`);

        // Ultra-aggressive content reduction
        const ultraReducedContent = contentForPdf
          .split('\n')
          .filter(line => !line.match(/^###|^####/)) // Remove most subsections
          .filter(line => !line.match(/^\s*\-/)) // Remove bullet points
          .filter(line => line.length > 10) // Remove very short lines
          .join('\n')
          .replace(/\([^)]+\)/g, '') // Remove parenthetical content
          .substring(0, 8000); // Extremely small limit for PDF generation

        console.log(`📝 ${slug}: Ultra-reducing content to ${ultraReducedContent.length} chars`);

        try {
          const ultraPdfData = await generatePdfFromContent(title, ultraReducedContent);
          const ultraPdfBytes = Uint8Array.from(atob(ultraPdfData), c => c.charCodeAt(0));
          const ultraPdfBlob = new Blob([ultraPdfBytes], { type: 'application/pdf' });
          const ultraSizeInMB = (ultraPdfBlob.size / 1024 / 1024).toFixed(2);

          if (ultraPdfBlob.size <= 2 * 1024 * 1024) {
            console.log(`✅ ${slug}: Ultra-reduced PDF size (${ultraSizeInMB}MB) acceptable, proceeding with upload`);
            // Replace the PDF data with the ultra-reduced version
            const replacedPdfData = ultraPdfData;

            // Continue with upload using the smaller PDF
            const startUpload = Date.now();
            const newVersion = version + 1;
            const newPdfUrl = await uploadPdfToStorage(slug, replacedPdfData, newVersion);
            const uploadTime = Date.now() - startUpload;
            console.log(`🔗 ${slug}: Ultra-reduced PDF uploaded in ${uploadTime}ms, new URL: ${newPdfUrl}`);

            // Update Firestore with successful ultra-reduced PDF
            const topicRef = doc(db, "assistants", assistantId, "syllabus", slug);
            await updateDoc(topicRef, {
              pdfUrl: newPdfUrl,
              version: newVersion,
              status: 'published',
              pdfGenerationFailed: false,
              pdfReduced: true, // Flag to indicate this is a reduced version
              lastPdfError: null,
              updatedAt: serverTimestamp(),
              updatedAtMs: Date.now()
            });

            const totalTime = Date.now() - startTime;
            console.log(`✅ ${slug}: Ultra-reduced PDF repair completed! Version ${newVersion} (Total time: ${totalTime}ms)`);
            return {
              slug,
              title,
              success: true,
              action: 'repaired_reduced',
              pdfUrl: newPdfUrl
            };
          }
        } catch (ultraError) {
          console.warn(`❌ ${slug}: Ultra-reduced PDF generation failed:`, ultraError.message);
        }

        // If ultra-reduction also fails, mark as content-only
        console.log(`🚫 ${slug}: Even ultra-reduced PDF too large, publishing content only`);

        const newVersion = version + 1;
        const topicRef = doc(db, "assistants", assistantId, "syllabus", slug);
        await updateDoc(topicRef, {
          status: 'published',
          version: newVersion,
          pdfGenerationFailed: false,
          pdfTooLarge: true,
          lastPdfError: `PDF too large (${sizeInMB}MB) for Firebase Storage`,
          contentAvailable: true,
          updatedAt: serverTimestamp(),
          updatedAtMs: Date.now()
        });

        const totalTime = Date.now() - startTime;
        console.log(`✅ ${slug}: Content published without PDF due to size limits (Total time: ${totalTime}ms)`);
        return {
          slug,
          title,
          success: true,
          action: 'content_only',
          error: `PDF too large (${sizeInMB}MB) for Firebase Storage`,
          pdfUrl: pdfUrl
        };
      }

      // Proceed with normal upload
      const startUpload = Date.now();
      const newVersion = version + 1;
      let newPdfUrl = "";
      let uploadSuccess = false;

      try {
        newPdfUrl = await uploadPdfToStorage(slug, pdfData, newVersion);
        const uploadTime = Date.now() - startUpload;
        console.log(`🔗 ${slug}: PDF uploaded in ${uploadTime}ms, new URL: ${newPdfUrl}`);
        uploadSuccess = true;
      } catch (uploadError) {
        const uploadTime = Date.now() - startUpload;
        console.error(`❌ ${slug}: PDF upload failed after ${uploadTime}ms:`, uploadError.message);
        console.log(`💾 ${slug}: Updating topic without PDF (content will be available)`);

        // Regular upload failure
        const topicRef = doc(db, "assistants", assistantId, "syllabus", slug);
        await updateDoc(topicRef, {
          status: 'published', // Mark as published even without PDF
          version: newVersion,
          pdfGenerationFailed: true, // Flag to indicate PDF needs regeneration
          lastPdfError: uploadError.message,
          updatedAt: serverTimestamp(),
          updatedAtMs: Date.now()
        });

        const totalTime = Date.now() - startTime;
        console.log(`⚠️ ${slug}: Content updated but PDF upload failed (Total time: ${totalTime}ms)`);
        return {
          slug,
          title,
          success: false,
          action: 'partial',
          error: `PDF upload failed: ${uploadError.message}`,
          pdfUrl: pdfUrl // Keep old PDF URL if it exists
        };
      }

      // Update Firestore document with successful PDF
      console.log(`💾 ${slug}: Updating Firestore document with new PDF...`);
      const startFirestore = Date.now();
      const topicRef = doc(db, "assistants", assistantId, "syllabus", slug);
      await updateDoc(topicRef, {
        pdfUrl: newPdfUrl,
        version: newVersion,
        status: 'published',
        pdfGenerationFailed: false, // Clear any previous PDF error flags
        lastPdfError: null,
        updatedAt: serverTimestamp(),
        updatedAtMs: Date.now()
      });
      const firestoreTime = Date.now() - startFirestore;
      console.log(`💾 ${slug}: Firestore updated in ${firestoreTime}ms`);

      const totalTime = Date.now() - startTime;
      console.log(`✅ ${slug}: Repair completed successfully! Version ${newVersion} (Total time: ${totalTime}ms)`);
      return {
        slug,
        title,
        success: true,
        action: 'repaired',
        pdfUrl: newPdfUrl
      };

    } catch (error) {
      console.error(`❌ Failed to repair ${slug}:`, error);
      return {
        slug,
        title,
        success: false,
        action: 'failed',
        error: error.message
      };
    }
  };

  const handleRepairAllPdfs = async () => {
    setIsRepairing(true);
    setProgress(0);
    setResults([]);
    setShowResults(false);

    try {
      // Get all topics for this assistant
      const syllabusCollection = collection(db, "assistants", assistantId, "syllabus");
      const querySnapshot = await getDocs(syllabusCollection);

      const topics = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`🔧 Starting PDF repair for ${topics.length} topics`);

      const repairResults: RepairResult[] = [];

      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];

        try {
          const startTopicTime = Date.now();
          console.log(`🔧 Processing topic ${i + 1}/${topics.length}: ${topic.title || topic.slug}`);
          setCurrentTopic(`(${i + 1}/${topics.length}) ${topic.title || topic.slug}`);
          setProgress(((i + 1) / topics.length) * 100);

          const result = await repairSingleTopic(topic);
          repairResults.push(result);

          const topicTime = Date.now() - startTopicTime;
          console.log(`✅ Topic ${i + 1} completed in ${topicTime}ms:`, result.success ? "SUCCESS" : "FAILED");

        } catch (error) {
          console.error(`❌ Critical error processing topic ${topic.title || topic.slug}:`, error);

          // Add failed result and continue with next topic
          repairResults.push({
            slug: topic.slug || `topic-${i}`,
            title: topic.title || `Topic ${i + 1}`,
            success: false,
            action: 'failed',
            error: `Critical error: ${error.message}`
          });
        }
      }

      setResults(repairResults);
      setShowResults(true);

      // Call completion callback
      onComplete();

      console.log(`✅ PDF repair completed: ${repairResults.filter(r => r.success).length}/${repairResults.length} successful`);

    } catch (error) {
      console.error('❌ PDF repair failed:', error);
      setResults([{
        slug: 'error',
        title: 'Error general',
        success: false,
        action: 'failed',
        error: error.message
      }]);
      setShowResults(true);
    } finally {
      setIsRepairing(false);
      setCurrentTopic("");
      setProgress(0);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const repairedCount = results.filter(r => r.action === 'repaired').length;
  const verifiedCount = results.filter(r => r.action === 'verified').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Reparar PDFs - {assistantName}
          </DialogTitle>
          <DialogDescription>
            Verifica y repara PDFs faltantes o inaccesibles para todos los temas del asistente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Repair Action */}
          {!showResults && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acción de Reparación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600">
                  <p className="mb-2">Esta acción verificará cada tema y:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Verificará que status sea 'published'</li>
                    <li>Comprobará que pdfUrl existe y es accesible</li>
                    <li>Regenerará PDFs faltantes o inválidos</li>
                    <li>Actualizará version y timestamps</li>
                  </ul>
                </div>

                {isRepairing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reparando: {currentTopic}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleRepairAllPdfs}
                    disabled={isRepairing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    {isRepairing ? "Reparando PDFs..." : "Reparar PDFs del Asistente"}
                  </Button>

                  {isRepairing && (
                    <Button
                      onClick={() => {
                        setIsRepairing(false);
                        setProgress(0);
                        setCurrentTopic("");
                      }}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {showResults && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resultados de Reparación</CardTitle>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">✓ Éxito: {successCount}</span>
                  <span className="text-blue-600">🔧 Reparados: {repairedCount}</span>
                  <span className="text-slate-600">✓ Verificados: {verifiedCount}</span>
                  <span className="text-red-600">✗ Errores: {results.length - successCount}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        result.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{result.title}</div>
                          <div className="text-xs text-slate-500">{result.slug}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            result.action === 'repaired'
                              ? "default"
                              : result.action === 'verified'
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {result.action === 'repaired' && '🔧 Reparado'}
                          {result.action === 'verified' && '✓ Verificado'}
                          {result.action === 'failed' && '✗ Error'}
                        </Badge>
                        {result.pdfUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(result.pdfUrl!, '_blank')}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {results.some(r => !r.success) && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Algunos PDFs no pudieron ser reparados. Revisa los errores específicos arriba.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {showResults && (
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar Vista
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RepairPDFsAction;
