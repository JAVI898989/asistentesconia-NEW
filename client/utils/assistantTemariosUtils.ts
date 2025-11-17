import { doc, setDoc, getDoc, collection, getDocs, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db, auth } from '@/lib/simpleAuth';

export interface TemarioContent {
  themeId: string;
  themeName: string;
  content: string;
  generated: string;
  pages: number;
  status: 'completed' | 'generated_example' | 'error';
}

// Save temarios to Firebase (old structure)
export const saveTemariosToFirebase = async (assistantId: string, temarios: TemarioContent[]): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('⚠️ No user authenticated, skipping Firebase save');
      return;
    }

    await setDoc(doc(db, 'assistantTemarios', `${user.uid}_${assistantId}`), {
      assistantId,
      temarios,
      lastUpdated: new Date().toISOString(),
      userId: user.uid
    });

    console.log(`✅ Temarios saved to Firebase for ${assistantId}`);
  } catch (error) {
    console.error('❌ Error saving temarios to Firebase:', error);
  }
};

// Load temarios from Firebase (old structure)
export const loadTemariosFromFirebase = async (assistantId: string): Promise<TemarioContent[] | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('⚠️ No user authenticated, skipping Firebase load');
      return null;
    }

    const temarioDoc = await getDoc(doc(db, 'assistantTemarios', `${user.uid}_${assistantId}`));
    if (temarioDoc.exists()) {
      const data = temarioDoc.data();
      console.log(`✅ Temarios loaded from Firebase for ${assistantId}:`, data.temarios.length, 'themes');
      return data.temarios;
    }

    return null;
  } catch (error) {
    console.error('❌ Error loading temarios from Firebase:', error);
    return null;
  }
};

// Load published temarios from new Firebase structure
export const loadPublishedTemariosFromFirebase = async (assistantId: string): Promise<TemarioContent[] | null> => {
  try {
    console.log(`🔍 Loading published temarios from assistants/${assistantId}/temario`);

    const temariosCollection = collection(db, `assistants/${assistantId}/temario`);
    const temariosSnapshot = await getDocs(temariosCollection);

    console.log(`📁 Found ${temariosSnapshot.docs.length} temario themes for ${assistantId}`);

    const publishedTemarios: TemarioContent[] = [];

    for (const themeDoc of temariosSnapshot.docs) {
      const themeId = themeDoc.id;

      // Get the documento for this theme
      const documentoCollection = collection(db, `assistants/${assistantId}/temario/${themeId}/documentos`);
      const documentoSnapshot = await getDocs(documentoCollection);

      for (const docDoc of documentoSnapshot.docs) {
        const docData = docDoc.data();

        console.log(`📄 Checking documento: ${docDoc.id}`, {
          published: docData.published,
          hasSections: !!docData.sections,
          themeName: docData.themeName,
          totalPages: docData.totalPages
        });

        if (docData.published !== false && docData.sections) {
          // Convert from new structure to old interface
          const content = docData.sections.map((section: any) =>
            `## ${section.title}\n\n${section.content}`
          ).join('\n\n');

          publishedTemarios.push({
            themeId: docData.themeId || themeId,
            themeName: docData.themeName || themeId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            content: content,
            generated: docData.created || new Date().toISOString(),
            pages: docData.totalPages || 10,
            status: 'completed'
          });

          console.log(`✅ Loaded published temario: ${docData.themeName} (${docData.totalPages} pages)`);
        }
      }
    }

    console.log(`📊 Total published temarios loaded: ${publishedTemarios.length}`);
    return publishedTemarios.length > 0 ? publishedTemarios : null;
  } catch (error) {
    console.error(`❌ Error loading published temarios for ${assistantId}:`, error);
    return null;
  }
};

export const getTemariosForAssistant = async (assistantId: string, forceRefresh: boolean = false): Promise<TemarioContent[]> => {
  console.log(`📚 LOADING TEMARIOS for ${assistantId} (forceRefresh: ${forceRefresh})`);

  // 1. Load from new published temarios structure (NO CACHE)
  try {
    const publishedTemarios = await loadPublishedTemariosFromFirebase(assistantId);
    if (publishedTemarios && publishedTemarios.length > 0) {
      console.log(`☁️ Loaded ${publishedTemarios.length} published temarios from Firebase for ${assistantId}`);

      // Update sessionStorage for immediate access
      const storageKey = `assistant_temarios_${assistantId}`;
      sessionStorage.setItem(storageKey, JSON.stringify(publishedTemarios));

      return publishedTemarios;
    }
  } catch (error) {
    console.warn(`⚠️ Error loading published temarios for ${assistantId}:`, error);
  }

  // 2. Fallback to old structure
  console.log(`🔍 Fallback to old temarios structure for ${assistantId}`);

  const firebaseTemarios = await loadTemariosFromFirebase(assistantId);
  if (firebaseTemarios && firebaseTemarios.length > 0) {
    // También actualizar sessionStorage
    const storageKey = `assistant_temarios_${assistantId}`;
    sessionStorage.setItem(storageKey, JSON.stringify(firebaseTemarios));
    return firebaseTemarios;
  }

  // 3. Try sessionStorage for locally generated content
  if (!forceRefresh) {
    const storageKey = `assistant_temarios_${assistantId}`;
    const storedTemarios = sessionStorage.getItem(storageKey);

    if (storedTemarios) {
      try {
        const parsedTemarios = JSON.parse(storedTemarios);
        console.log(`📚 Loaded ${parsedTemarios.length} temarios from sessionStorage for ${assistantId}`);

        // Save to Firebase for next time
        if (parsedTemarios.length > 0) {
          saveTemariosToFirebase(assistantId, parsedTemarios);
        }

        return parsedTemarios;
      } catch (error) {
        console.error('Error parsing stored temarios:', error);
        sessionStorage.removeItem(storageKey);
      }
    }
  }

  console.log(`❌ No temarios found for ${assistantId}`);
  return [];
};

export const hasTemarios = async (assistantId: string): Promise<boolean> => {
  const temarios = await getTemariosForAssistant(assistantId);
  return temarios.length > 0;
};

export const getTemarioCount = async (assistantId: string): Promise<number> => {
  const temarios = await getTemariosForAssistant(assistantId);
  return temarios.length;
};

export const getTotalPages = async (assistantId: string): Promise<number> => {
  const temarios = await getTemariosForAssistant(assistantId);
  return temarios.reduce((total, temario) => total + temario.pages, 0);
};

export const getTemarioByThemeId = async (assistantId: string, themeId: string): Promise<TemarioContent | null> => {
  const temarios = await getTemariosForAssistant(assistantId);
  return temarios.find(t => t.themeId === themeId) || null;
};

// Generate HTML preview for a temario
export const generateTemarioHTML = (temario: TemarioContent): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${temario.themeName}</title>
        <style>
            body {
                font-family: 'Times New Roman', serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #1e40af;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            h1 { color: #1e40af; font-size: 28px; }
            h2 { color: #374151; font-size: 20px; margin-top: 30px; }
            h3 { color: #4b5563; font-size: 16px; margin-top: 20px; }
            p { text-align: justify; margin-bottom: 15px; }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${temario.themeName}</h1>
            <p>Temario profesional para oposiciones públicas</p>
            <p>Generado el: ${new Date(temario.generated).toLocaleDateString('es-ES')}</p>
        </div>

        <div class="content">
            ${temario.content
              .replace(/\n/g, '<br>')
              .replace(/## (.+)/g, '<h2>$1</h2>')
              .replace(/### (.+)/g, '<h3>$1</h3>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            }
        </div>

        <div class="footer">
            <p>Páginas estimadas: ${temario.pages} | Estado: ${temario.status}</p>
            <p>Generado automáticamente para preparación de oposiciones</p>
        </div>
    </body>
    </html>
  `;
};

// Real-time subscription for temarios - PASO 2&3: standardized collection and preview-aware queries
export const subscribeToTemariosRealtime = (
  assistantId: string,
  onTemariosUpdate: (temarios: TemarioContent[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  // Detect FullStory interference
  const hasFullStory = typeof window !== 'undefined' && (
    window.FS ||
    document.querySelector('script[src*="fullstory"]') ||
    document.querySelector('script[src*="edge.fullstory.com"]')
  );

  if (hasFullStory) {
    console.log(`🚫 FullStory detected - using fallback loading instead of real-time subscription for ${assistantId}`);

    // Fallback to manual loading when FullStory interferes
    const loadFallbackTemarios = async () => {
      try {
        const fallbackTemarios = await getTemariosForAssistant(assistantId, true);
        onTemariosUpdate(fallbackTemarios);
      } catch (error) {
        console.error(`❌ Fallback temarios loading failed for ${assistantId}:`, error);
        if (onError) onError(error);
      }
    };

    // Initial load
    loadFallbackTemarios();

    // Return empty unsubscribe function
    return () => {};
  }

  // Detect Builder preview mode
  const isPreview = typeof window !== 'undefined' && (
    (window as any).__BUILDER_PREVIEW__ === true ||
    (window as any).Builder?.isEditing === true ||
    window.location.hostname.includes('builder.io') ||
    window.location.search.includes('builder.preview')
  );

  console.log(`🔴 Setting up real-time subscription for temarios: ${assistantId} (Preview: ${isPreview})`);

  // PASO 2: Use standardized collection name 'assistant_syllabus'
  const temariosCollection = collection(db, 'assistant_syllabus');

  // PASO 3: Preview-aware queries - no blocking filters in preview, stable ordering
  let temariosQuery;
  if (isPreview) {
    // Preview: no filters, order by createdAtMs DESC for stable ordering
    temariosQuery = query(temariosCollection, orderBy('createdAtMs', 'desc'));
  } else {
    // Production: filter by status published and assistantId
    temariosQuery = query(
      temariosCollection,
      where('status', '==', 'published'),
      where('assistantId', '==', assistantId),
      orderBy('createdAtMs', 'desc')
    );
  }

  const unsubscribe = onSnapshot(
    temariosQuery,
    (snapshot) => {
      try {
        console.log(`📡 Real-time temarios update: ${snapshot.docs.length} temario documents for ${assistantId} (Preview: ${isPreview})`);

        const realTimeTemarios: TemarioContent[] = [];

        // Process each temario document
        snapshot.docs.forEach((temarioDoc) => {
          const temarioData = temarioDoc.data();

          // In preview: include ALL temarios that have content and match assistantId (if specified)
          // In production: filter already applied in query
          const shouldInclude = isPreview
            ? (temarioData.content && temarioData.content.length > 0 &&
               (!temarioData.assistantId || temarioData.assistantId === assistantId))
            : true; // Already filtered by query

          if (shouldInclude) {
            realTimeTemarios.push({
              themeId: temarioData.themeId || temarioDoc.id,
              themeName: temarioData.themeName || temarioData.themeId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              content: temarioData.content,
              generated: temarioData.generated || temarioData.created || new Date().toISOString(),
              pages: temarioData.pages || 10,
              status: temarioData.status || 'completed'
            });
          }
        });

        console.log(`✅ Real-time temarios update processed: ${realTimeTemarios.length} temarios`);

        // Clear cache and update with fresh data
        const storageKey = `assistant_temarios_${assistantId}`;
        sessionStorage.removeItem(storageKey);

        if (realTimeTemarios.length > 0) {
          sessionStorage.setItem(storageKey, JSON.stringify(realTimeTemarios));
        }

        // Call the update callback with fresh data
        onTemariosUpdate(realTimeTemarios);

      } catch (error) {
        console.error(`❌ Error processing real-time temarios update for ${assistantId}:`, error);
        if (onError) onError(error);
      }
    },
    (error) => {
      console.error(`❌ Real-time temarios subscription error for ${assistantId}:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};

// PASO 4: Create temarios with double timestamp + optimistic updates
export const createTemarioWithOptimisticUpdate = async (
  assistantId: string,
  themeId: string,
  themeName: string,
  content: string,
  pages: number = 10,
  onOptimisticUpdate?: (newTemario: TemarioContent) => void
): Promise<boolean> => {
  try {
    const temarioData = {
      assistantId,
      themeId,
      themeName,
      content,
      pages,
      status: 'published',
      generated: new Date().toISOString(), // Server timestamp equivalent
      createdAt: new Date().toISOString(),
      createdAtMs: Date.now(), // Numeric timestamp for ordering
    };

    // Optimistic update - immediately update UI
    if (onOptimisticUpdate) {
      const optimisticTemario: TemarioContent = {
        themeId,
        themeName,
        content,
        generated: temarioData.generated,
        pages,
        status: 'completed'
      };
      onOptimisticUpdate(optimisticTemario);
    }

    // Add to standardized collection
    const temariosCollection = collection(db, 'assistant_syllabus');
    await setDoc(doc(temariosCollection), temarioData);

    console.log(`✅ Temario created successfully for ${assistantId}/${themeId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating temario for ${assistantId}/${themeId}:`, error);
    return false;
  }
};
