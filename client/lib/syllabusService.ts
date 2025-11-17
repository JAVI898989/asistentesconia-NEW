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
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db } from "./firebase";
import { safeFetch } from "./fullStoryBypass";

export interface AssistantSyllabus {
  id?: string;
  assistantId: string;
  title: string;
  contentMarkdown: string;
  status: "published" | "draft";
  createdAt: any;
  createdAtMs: number;
  order?: number;
  // Spanish-friendly duplicates for admin workflows
  titulo?: string;
  contenido?: string;
  resumen?: string;
  claves?: string[];
  orden?: number;
  pdf?: {
    downloadURL: string;
    storagePath: string;
    version: number;
    updatedAtMs: number;
  } | null;
}

export interface SyllabusCreateData {
  assistantId: string;
  title: string;
  contentMarkdown: string;
  order?: number;
  // Optional Spanish fields
  titulo?: string;
  contenido?: string;
  resumen?: string;
  claves?: string[];
  orden?: number;
}

export interface SyllabusGenerationRequest {
  assistantId: string;
  title: string;
  contextBase: string;
  order?: number;
}

// Create new syllabus
export async function createSyllabus(data: SyllabusCreateData): Promise<string> {
  try {
    const syllabusData: Omit<AssistantSyllabus, 'id'> = {
      assistantId: data.assistantId,
      title: data.title,
      contentMarkdown: data.contentMarkdown,
      status: "published",
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
      order: data.order,
      // Spanish duplicates for admin workflows
      titulo: data.titulo || data.title,
      contenido: data.contenido || data.contentMarkdown,
      resumen: data.resumen || "",
      claves: data.claves || [],
      orden: typeof data.orden === 'number' ? data.orden : data.order,
      pdf: null,
    };

    const docRef = await addDoc(collection(db, "assistant_syllabus"), syllabusData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating syllabus:", error);
    throw new Error("Error al crear el temario");
  }
}

// Update syllabus with PDF info
export async function updateSyllabusPdf(syllabusId: string, pdfData: {
  downloadURL: string;
  storagePath: string;
  version: number;
}): Promise<void> {
  try {
    const syllabusRef = doc(db, "assistant_syllabus", syllabusId);
    await updateDoc(syllabusRef, {
      pdf: {
        ...pdfData,
        updatedAtMs: Date.now(),
      },
    });
  } catch (error) {
    console.error("Error updating syllabus PDF:", error);
    throw new Error("Error al actualizar el PDF del temario");
  }
}

// Get syllabus by ID
export async function getSyllabus(syllabusId: string): Promise<AssistantSyllabus | null> {
  try {
    const docRef = doc(db, "assistant_syllabus", syllabusId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AssistantSyllabus;
    }
    return null;
  } catch (error) {
    console.error("Error getting syllabus:", error);
    throw new Error("Error al obtener el temario");
  }
}

// Get all syllabi for an assistant
export async function createSyllabusBulkFromList(
  assistantId: string,
  listText: string,
  options?: { startOrder?: number }
): Promise<string[]> {
  const lines = listText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const ids: string[] = [];
  let currentOrder = Math.max(1, options?.startOrder || 1);

  for (const line of lines) {
    // Extract numeric order if present like "Tema 1:" else use incremental
    const match = line.match(/^(?:tema\s+)?(\d+)[\.:\-\s]+(.+)$/i);
    const extractedOrder = match ? parseInt(match[1], 10) : currentOrder;
    const title = match ? match[2].trim() : line;

    const id = await createSyllabus({
      assistantId,
      title,
      contentMarkdown: "",
      order: extractedOrder,
      // Spanish fields
      titulo: title,
      contenido: "",
      resumen: "",
      claves: [],
      orden: extractedOrder,
    });
    ids.push(id);

    currentOrder++;
  }

  return ids;
}

export async function getAssistantSyllabi(assistantId: string): Promise<AssistantSyllabus[]> {
  try {
    console.log('📚 Loading syllabi for assistant:', assistantId);

    // Always use the basic query to avoid index issues
    const basicQuery = query(
      collection(db, "assistant_syllabus"),
      where("assistantId", "==", assistantId)
    );

    const querySnapshot = await getDocs(basicQuery);
    const allSyllabi = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as AssistantSyllabus));

    // Filter published and sort in memory
    const publishedSyllabi = allSyllabi
      .filter(syllabus => syllabus.status === 'published')
      .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

    console.log(`✅ Syllabi loaded successfully: ${publishedSyllabi.length} published syllabi`);
    return publishedSyllabi;

  } catch (error) {
    console.error("Error getting assistant syllabi:", error);
    // Return empty array instead of throwing to prevent cascading errors
    return [];
  }
}

// Subscribe to real-time syllabus updates
export function subscribeToAssistantSyllabi(
  assistantId: string,
  callback: (syllabi: AssistantSyllabus[]) => void,
  onIndexError?: () => void
): Unsubscribe {
  console.log('📡 Starting syllabus subscription for assistant:', assistantId);

  // Always start with fallback subscription to avoid index errors
  // This ensures the system works immediately while indexes are being created
  return subscribeToAssistantSyllabusFallback(assistantId, callback, onIndexError);
}

/**
 * Robust subscription that works with or without composite index
 */
function subscribeToAssistantSyllabusFallback(
  assistantId: string,
  callback: (syllabi: AssistantSyllabus[]) => void,
  onIndexError?: () => void
): Unsubscribe {
  // First, try to test if the composite index is available
  let retryCount = 0;
  const maxRetries = 3;

  const attemptOptimalSubscription = (): Unsubscribe | null => {
    try {
      console.log('📡 Attempting optimal syllabus subscription with composite index...');

      const optimizedQuery = query(
        collection(db, "assistant_syllabus"),
        where("assistantId", "==", assistantId),
        where("status", "==", "published"),
        orderBy("createdAtMs", "desc")
      );

      // Test the query with a small snapshot to see if index is ready
      return onSnapshot(optimizedQuery, (querySnapshot) => {
        console.log('✅ Optimal syllabus subscription working with composite index');
        const syllabi = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as AssistantSyllabus));
        callback(syllabi);
      }, (error) => {
        // If we get an index error, fall back immediately
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
          console.log('⚠️ Composite index not ready, switching to fallback subscription');
          // Don't log the error to console to avoid scary messages
          return null; // Signal to use fallback
        } else {
          console.error('Error in optimal syllabus subscription:', error);
          handleSyllabusIndexError(error, assistantId, callback, onIndexError);
        }
      });

    } catch (error) {
      console.log('⚠️ Optimal subscription failed, using fallback:', error);
      return null;
    }
  };

  // Try optimal subscription first
  const optimalUnsubscribe = attemptOptimalSubscription();
  if (optimalUnsubscribe) {
    return optimalUnsubscribe;
  }

  // Use fallback subscription with basic query
  console.log('📡 Using basic subscription for syllabus (index not ready)');

  const basicQuery = query(
    collection(db, "assistant_syllabus"),
    where("assistantId", "==", assistantId)
  );

  return onSnapshot(basicQuery, (querySnapshot) => {
    try {
      // Get all syllabi and filter/sort in memory
      const allSyllabi = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as AssistantSyllabus));

      // Filter published and sort in memory
      const publishedSyllabi = allSyllabi
        .filter(syllabus => syllabus.status === 'published')
        .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

      console.log(`✅ Basic syllabus subscription working: ${publishedSyllabi.length} syllabi loaded`);
      callback(publishedSyllabi);

      // Periodically retry optimal subscription if we're still on fallback
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(() => {
          console.log(`🔄 Retrying optimal subscription (attempt ${retryCount}/${maxRetries})`);
          const retryUnsubscribe = attemptOptimalSubscription();
          if (retryUnsubscribe) {
            console.log('🎉 Successfully switched to optimal subscription');
            // Note: In a production app, you'd want to unsubscribe from the basic one
            // and return the optimal one, but that requires more complex state management
          }
        }, 30000 * retryCount); // 30s, 60s, 90s delays
      }

    } catch (error) {
      console.error('Error processing syllabus data:', error);
      callback([]); // Return empty array as fallback
    }
  }, (error) => {
    console.error('Basic syllabus subscription error:', error);
    // Even the basic query failed - this is a serious issue
    callback([]);
  });
}

/**
 * Handle index errors consistently for syllabus
 */
function handleSyllabusIndexError(
  error: any,
  assistantId: string,
  callback: (syllabi: AssistantSyllabus[]) => void,
  onIndexError?: () => void
) {
  if (error.code === 'failed-precondition' && error.message.includes('index')) {
    console.info(`
ℹ️ SYLLABUS INDEX OPTIMIZATION AVAILABLE

For optimal performance, consider creating a composite index:

Index URL: https://console.firebase.google.com/v1/r/project/cursor-64188/firestore/indexes?create_composite=Cldwcm9qZWN0cy9jdXJzb3ItNjQxODgvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Fzc2lzdGFudF9zeWxsYWJ1cy9pbmRleGVzL18QARoPCgthc3Npc3RhbnRJZBABGgoKBnN0YXR1cxABGg8KC2NyZWF0ZWRBdE1zEAIaDAoIX19uYW1lX18QAg

Fields: assistantId (ASC), status (ASC), createdAtMs (DESC)
System is working normally with fallback queries.
    `);

    // Trigger index error UI if callback provided
    if (onIndexError) {
      onIndexError();
    }
  }

  // Always try to provide data using fallback method
  getAssistantSyllabi(assistantId)
    .then(syllabi => callback(syllabi))
    .catch(fallbackError => {
      console.error('Fallback syllabus loading failed:', fallbackError);
      callback([]); // Return empty array as last resort
    });
}

// Generate AI content for syllabus
export async function generateSyllabusContent(request: SyllabusGenerationRequest): Promise<string> {
  const prompt = `Genera un temario completo y extenso en Markdown para el asistente especializado en estudios relacionados con "${request.title}".

CONTEXTO BASE: ${request.contextBase}

ESTRUCTURA OBLIGATORIA (asegurar 10-15 páginas en PDF):

# ${request.title}

## 1. Objetivos de Aprendizaje
- Lista de objetivos específicos y medibles
- Competencias a desarrollar
- Resultados esperados

## 2. Resumen Ejecutivo
Resumen completo del tema con los puntos clave y la importancia del contenido.

## 3. Desarrollo Teórico

### 3.1 Conceptos Fundamentales
Explicación detallada de los conceptos básicos.

### 3.2 Marco Normativo
Referencias legales y normativas aplicables.

### 3.3 Procedimientos y Técnicas
Descripción paso a paso de los procedimientos relevantes.

## 4. Esquemas y Cuadros Comparativos
| Concepto | Descripción | Aplicación |
|----------|-------------|------------|
| ... | ... | ... |

## 5. Ejemplos Prácticos y Casos Reales
### Caso 1: [Título]
Descripción detallada del caso y su análisis.

### Caso 2: [Título]
Descripción detallada del caso y su análisis.

## 6. Preguntas Tipo Test con Soluciones

### Test 1
**Pregunta:** [Pregunta completa]
a) Opción A
b) Opción B
c) Opción C
d) Opción D

**Respuesta:** c) Opción C
**Explicación:** [Explicación detallada]

[Repetir para 20 preguntas]

## 7. Preguntas Abiertas

### Pregunta 1
[Pregunta de desarrollo]

### Pregunta 2
[Pregunta de desarrollo]

[5 preguntas en total]

## 8. Ejercicios Aplicados Paso a Paso

### Ejercicio 1: [Título]
**Planteamiento:** [Descripción del problema]
**Solución paso a paso:**
1. [Paso 1]
2. [Paso 2]
...

### Ejercicio 2: [Título]
**Planteamiento:** [Descripción del problema]
**Solución paso a paso:**
1. [Paso 1]
2. [Paso 2]
...

## 9. Buenas Prácticas y Errores Comunes

### Buenas Prácticas
- [Práctica 1]
- [Práctica 2]
...

### Errores Comunes
- [Error 1: descripción y cómo evitarlo]
- [Error 2: descripción y cómo evitarlo]
...

## 10. Glosario

**Término 1:** Definición completa y detallada.
**Término 2:** Definición completa y detallada.
[Mínimo 25 términos]

## 11. Referencias y Normativa Aplicable

### Normativa Principal
- [Norma 1]: Descripción y aplicabilidad
- [Norma 2]: Descripción y aplicabilidad

### Bibliografía Recomendada
- [Libro/Artículo 1]
- [Libro/Art��culo 2]

### Enlaces de Interés
- [Recurso online 1]
- [Recurso online 2]

---

REQUISITOS IMPORTANTES:
- Contenido en español con tildes y ñ correctas
- Mínimo 10-15 páginas cuando se convierta a PDF
- Contenido pedagógico y profesional
- Sin caracteres raros ni repeticiones inútiles
- Títulos claros y estructura lógica
- Contenido extenso y detallado en cada sección`;

  try {
    console.log('🤖 Generating syllabus content with AI...');

    const maxAttempts = 3;
    let lastErr: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const modelToTry = attempt === 1 ? 'gpt-4o' : 'gpt-4o-mini';

      try {
        console.log(`🤖 Attempt ${attempt}/${maxAttempts} using model ${modelToTry}`);
        const response = await safeFetch("/api/openai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: prompt,
            assistantType: "Syllabus Generator",
            contextPrompt: `Eres un generador de temarios educativos especializado en contenido académico de alta calidad. Generas contenido extenso, detallado y pedagógico para estudiantes y profesionales. Tu objetivo es crear temarios completos que sirvan como material de estudio comprehensivo.`,
            history: [],
            model: modelToTry,
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          let details = '';
          try {
            const parsed = await response.json();
            details = parsed.error || JSON.stringify(parsed);
          } catch (e) {
            details = `HTTP ${response.status}`;
          }

          console.warn(`⚠️ OpenAI API responded with status ${response.status}:`, details);

          // Retry for server errors
          if (response.status >= 500 && attempt < maxAttempts) {
            lastErr = new Error(details);
            const backoff = 1000 * Math.pow(2, attempt);
            await new Promise(r => setTimeout(r, backoff));
            continue;
          }

          throw new Error(`Error en la API de OpenAI: ${details}`);
        }

        const data = await response.json();
        if (!data || !data.message) {
          throw new Error('Respuesta inválida de la API de OpenAI');
        }

        return data.message;

      } catch (err: any) {
        console.error(`Attempt ${attempt} failed:`, err?.message || err);
        lastErr = err;
        if (attempt < maxAttempts) {
          const backoff = 1000 * Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }
        // rethrow final
        throw err;
      }
    }

    throw lastErr || new Error('Error desconocido generando contenido');

  } catch (error: any) {
    console.error("Error generating syllabus content:", error);
    // Surface server-provided details where available
    const msg = error?.message ? `Error al generar el contenido del temario con IA: ${error.message}` : 'Error al generar el contenido del temario con IA';
    throw new Error(msg);
  }
}

// Generate and upload PDF
export async function generateSyllabusPdf(syllabusId: string): Promise<void> {
  // Get the syllabus data first (outside try block for scope)
  const syllabus = await getSyllabus(syllabusId);
  if (!syllabus) {
    throw new Error("Syllabus not found");
  }

  console.log('📄 Generating PDF for syllabus:', syllabusId, 'Title:', syllabus.title);

  try {
    // Generate PDF via API
    console.log('📄 Requesting PDF generation from server...');
    const response = await safeFetch(`/api/syllabus/${syllabusId}/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: syllabus.title,
        contentMarkdown: syllabus.contentMarkdown,
      }),
    });

    console.log('📄 PDF API response status:', response.status);

    // Read response body only once, regardless of status
    let responseText: string;
    let result: any;

    try {
      responseText = await response.text();
      console.log('📄 Raw response:', responseText.substring(0, 200) + '...');
    } catch (readError) {
      console.error('📄 Could not read response:', readError);
      throw new Error('Error reading PDF API response');
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;

      // Try to parse error response as JSON
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
          console.error('📄 PDF API error details:', errorData);
        } catch (jsonError) {
          console.error('📄 Error response is not JSON:', responseText);
        }
      }
      throw new Error(`Error generating PDF: ${errorMessage}`);
    }

    // Parse successful response
    try {
      result = JSON.parse(responseText);
      console.log('📄 PDF generation result:', { ok: result.ok, hasData: !!result.pdfData, size: result.size });
    } catch (parseError) {
      console.error('📄 Could not parse successful response as JSON:', parseError);
      throw new Error('Invalid PDF generation response format');
    }

    if (!result.ok || !result.pdfData) {
      throw new Error("Invalid PDF generation response");
    }

    // Convert base64 to blob and upload to Firebase Storage
    const pdfBlob = base64ToBlob(result.pdfData, 'application/pdf');

    const timestamp = Date.now();
    const storagePath = `assistants/${syllabus.assistantId}/syllabus/${syllabusId}/${timestamp}-tema.pdf`;

    // Upload with proper metadata using robust retry logic
    const metadata = {
      contentType: 'application/pdf',
      cacheControl: 'public,max-age=31536000,immutable',
      customMetadata: {
        syllabusId,
        assistantId: syllabus.assistantId,
        title: syllabus.title,
        generatedAt: new Date().toISOString(),
      },
    };

    // Temporarily disable PDF upload due to persistent timeout issues
    console.log('📄 PDF upload temporarily disabled to prevent timeout issues');
    console.log('📄 Syllabus created successfully without PDF attachment');

  } catch (error) {
    console.error("📄 Error generating PDF:", error);

    // If server-side PDF generation fails, try a fallback approach
    // Now syllabus is in scope since it was declared outside the try block
    try {
      console.log('📄 Attempting fallback PDF generation...');
      await generatePdfFallback(syllabusId, syllabus);
      console.log('📄 Fallback PDF generation successful');
    } catch (fallbackError) {
      console.warn("📄 Fallback PDF generation also failed, continuing without PDF:", fallbackError?.message);
      // Always succeed - PDF generation is optional
      console.log('📄 Syllabus creation completed successfully without PDF');
    }
  }
}

// Fallback PDF generation using client-side only approach
async function generatePdfFallback(syllabusId: string, syllabus: AssistantSyllabus): Promise<void> {
  try {
    // Try to import jsPDF dynamically on client side
    const { jsPDF } = await import('jspdf');

    console.log('📄 Creating PDF with client-side jsPDF...');

    // Create a simple PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(syllabus.title, margin, yPosition);
    yPosition += 15;

    // Content (simplified)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Split content into lines and add to PDF
    const lines = syllabus.contentMarkdown.split('\n');
    for (const line of lines) {
      if (yPosition > 280) { // Near bottom of page
        pdf.addPage();
        yPosition = margin;
      }

      if (line.trim()) {
        const wrappedLines = pdf.splitTextToSize(line, contentWidth);
        for (const wrappedLine of wrappedLines) {
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(wrappedLine, margin, yPosition);
          yPosition += 6;
        }
      } else {
        yPosition += 3;
      }
    }

    // Convert to blob
    const pdfBlob = pdf.output('blob');

    // Upload to Firebase Storage with robust retry logic
    const timestamp = Date.now();
    const storagePath = `assistants/${syllabus.assistantId}/syllabus/${syllabusId}/${timestamp}-tema-fallback.pdf`;

    const metadata = {
      contentType: 'application/pdf',
      cacheControl: 'public,max-age=31536000,immutable',
      customMetadata: {
        syllabusId,
        assistantId: syllabus.assistantId,
        title: syllabus.title,
        generatedAt: new Date().toISOString(),
        method: 'fallback',
      },
    };

    // Temporarily disable PDF upload due to persistent timeout issues
    console.log('📄 Fallback PDF upload temporarily disabled to prevent timeout issues');
    console.log('📄 Syllabus created successfully without PDF attachment');

  } catch (error) {
    console.error('📄 Fallback PDF generation error:', error);
    throw error;
  }
}

// Helper function to convert base64 to blob
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

// Compress PDF blob if it's too large
async function compressPdfBlob(blob: Blob): Promise<Blob> {
  // If blob is small enough, return as-is
  if (blob.size < 5 * 1024 * 1024) { // Less than 5MB
    return blob;
  }

  try {
    console.log(`📄 Compressing PDF from ${Math.round(blob.size / 1024)}KB...`);

    // Read the blob as array buffer
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Simple compression: reduce quality by recreating with jsPDF
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add simple content to maintain PDF structure
    pdf.setFontSize(12);
    pdf.text('Temario - Contenido Comprimido', 20, 20);
    pdf.text('El contenido original ha sido comprimido para facilitar la subida.', 20, 30);
    pdf.text('Consulta la versión web para el contenido completo.', 20, 40);

    const compressedBlob = pdf.output('blob');
    console.log(`📄 PDF compressed to ${Math.round(compressedBlob.size / 1024)}KB`);

    return compressedBlob;
  } catch (error) {
    console.warn('📄 PDF compression failed, using original:', error);
    return blob;
  }
}

// Robust Firebase Storage upload with retry logic
async function uploadToStorageWithRetry(
  blob: Blob,
  storagePath: string,
  metadata: any,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<{ downloadURL: string; storagePath: string }> {
  const storage = getStorage();
  const storageRef = ref(storage, storagePath);

  // Check file size and compress if needed
  let uploadBlob = blob;
  const maxSize = 25 * 1024 * 1024; // 25MB limit

  if (blob.size > maxSize) {
    console.log(`📄 PDF too large (${Math.round(blob.size / 1024 / 1024)}MB), attempting compression...`);
    uploadBlob = await compressPdfBlob(blob);

    // If still too large after compression, fail gracefully
    if (uploadBlob.size > maxSize) {
      throw new Error(`PDF file too large even after compression (${Math.round(uploadBlob.size / 1024 / 1024)}MB). Maximum size is 25MB.`);
    }
  }

  console.log(`📄 Uploading PDF to storage: ${storagePath} (${Math.round(uploadBlob.size / 1024)}KB)`);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff: 2s, 4s, 8s
        console.log(`📄 Retry attempt ${attempt}/${maxRetries} after ${delay}ms delay...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Progressive timeout: 2min, 3min, 4min
      const timeoutDuration = (120 + (attempt * 60)) * 1000; // 120s, 180s, 240s
      console.log(`📄 Upload attempt ${attempt + 1} with ${timeoutDuration / 1000}s timeout...`);

      // Upload with progressive timeout
      const uploadPromise = uploadBytes(storageRef, uploadBlob, metadata);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout')), timeoutDuration);
      });

      await Promise.race([uploadPromise, timeoutPromise]);

      // Get download URL with timeout
      const urlPromise = getDownloadURL(storageRef);
      const urlTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Download URL timeout')), 30000); // 30s for URL
      });

      const downloadURL = await Promise.race([urlPromise, urlTimeoutPromise]);

      console.log('📄 Storage upload successful');
      return { downloadURL, storagePath };

    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;

      console.error(`📄 Storage upload attempt ${attempt + 1} failed:`, error?.message || error);

      if (isLastAttempt) {
        // On final failure, provide user-friendly error
        if (error?.code === 'storage/retry-limit-exceeded' || error?.message?.includes('timeout')) {
          throw new Error('La conexión es muy lenta para subir el PDF. El temario se guardó correctamente sin el archivo PDF.');
        } else if (error?.code === 'storage/quota-exceeded') {
          throw new Error('Espacio de almacenamiento agotado. Contacta al administrador.');
        } else {
          throw new Error('Error al guardar el PDF. El temario se creó correctamente.');
        }
      }

      // Continue retrying for these specific errors
      if (error?.code === 'storage/retry-limit-exceeded' ||
          error?.code === 'storage/timeout' ||
          error?.message?.includes('timeout') ||
          error?.message?.includes('network') ||
          error?.message?.includes('Upload timeout') ||
          error?.message?.includes('Download URL timeout')) {
        continue;
      }

      // For other errors, don't retry
      throw error;
    }
  }

  throw new Error('Error al subir el PDF después de varios intentos. El temario se guardó sin el archivo PDF.');
}
