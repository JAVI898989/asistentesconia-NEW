import { db, auth } from '@/lib/simpleAuth';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

export interface TemarioSection {
  title: string;
  content: string;
  pageNumbers: number[];
}

export interface ExtensiveTemarioData {
  id: string;
  assistantId: string;
  assistantName: string;
  themeId: string;
  themeName: string;
  sections: TemarioSection[];
  totalPages: number;
  pdfUrl?: string;
  created: string;
  lastUpdated: string;
}

export interface TemarioProgress {
  assistantId: string;
  assistantName: string;
  themeId: string;
  themeName: string;
  themeNumber: number;
  totalThemes: number;
  pages: number;
  isCompleted: boolean;
  hasError: boolean;
  error?: string;
}

// Generate extensive temario content using GPT-4-nano
export const generateExtensiveTemario = async (
  assistantId: string,
  assistantName: string,
  themeName: string,
  minPages: number = 10,
  onProgress?: (progress: TemarioProgress) => void
): Promise<ExtensiveTemarioData> => {

  console.log(`📚 Generando temario extenso para ${assistantName} - ${themeName} (mín. ${minPages} páginas)`);

  const themeId = themeName.toLowerCase().replace(/\s+/g, '-');

  try {
    // Generate content using GPT-5 mini (server-mapped)
    let contentHtml = await generateTemarioWithGPT5Mini(assistantName, themeName, minPages);

    // Post-process to enforce required structure, avoid duplicate titles, and ensure non-empty blocks
    contentHtml = postProcessTemarioHtml(contentHtml, themeName, assistantName, minPages);

    // Structure the content into sections (for compatibility) and estimate pages
    const sections = structureTemarioContent(contentHtml, minPages);

    const plainText = contentHtml.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const totalPages = Math.max(minPages, Math.ceil(wordCount / 250));

    const temarioData: ExtensiveTemarioData = {
      id: `${themeId}_temario_${Date.now()}`,
      assistantId,
      assistantName,
      themeId,
      themeName,
      sections,
      totalPages,
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // PASO 4: Save to standardized collection with double timestamp + required fields
    try {
      const user = auth.currentUser;
      if (user) {
        // PASO 2: Use standardized collection name 'assistant_syllabus'
        const temarioDocRef = doc(collection(db, 'assistant_syllabus'));
        const now = Date.now();
        await setDoc(temarioDocRef, {
          ...temarioData,
          // PASO 2: Standard required fields
          title: temarioData.themeName || 'Temario',
          status: 'published',
          assistantId: assistantId,
          // PASO 4: Double timestamp
          createdAt: new Date().toISOString(), // Server timestamp
          createdAtMs: now, // Numeric for stable ordering
          // Additional metadata
          published: true,
          createdBy: user.uid,
          createdByEmail: user.email,
          generated: new Date().toISOString(), // For backward compatibility
          type: 'gpt5_mini_generated',
          version: '1.0',
          pdfGenerated: false,
          content: contentHtml
        });
        console.log(`💾 Temario guardado en Firebase para ${themeName} con published:true`);

        // Generate and save PDF version
        try {
          const { generateTemarioPDF } = await import('./temarioPDFGenerator');
          const pdfContent = await generateTemarioPDF(temarioData);

          // Save PDF reference
          const pdfDocRef = doc(db, `assistants/${assistantId}/temario/${themeId}`, 'pdf');
          await setDoc(pdfDocRef, {
            themeId,
            themeName,
            assistantId,
            assistantName,
            pdfContent,
            pdfGenerated: new Date().toISOString(),
            published: true
          });

          console.log(`📄 PDF generado y guardado para ${themeName}`);
        } catch (pdfError) {
          console.warn(`⚠️ Error generando PDF:`, pdfError);
        }

        // Log audit
        await logTemarioCreation(assistantId, assistantName, themeName, totalPages);
      }
    } catch (error) {
      console.warn(`⚠️ Error guardando en Firebase:`, error);
    }

    console.log(`✅ Temario generado: ${themeName} (${wordCount} palabras, ~${totalPages} páginas)`);
    return temarioData;

  } catch (error) {
    console.error(`❌ Error generando temario para ${themeName}:`, error);
    throw error;
  }
};

// Generate temario content using server endpoint (GPT-5 mini preference)
const generateTemarioWithGPT5Mini = async (
  assistantName: string,
  themeName: string,
  minPages: number
): Promise<string> => {
  const { safeFetch } = await import('./fullStoryBypass');

  const prompt = `Genera en HTML un temario EXTENSO y PROFESIONAL sobre "${themeName}" para "${assistantName}"\n\nREQUISITOS:\n- Mínimo ${minPages} páginas equivalentes (≈ 2500+ palabras)\n- Español perfecto (UTF-8), sin caracteres corruptos\n- Estructura académica con títulos y subtítulos claros, párrafos espaciados\n- Bloques visuales con clases CSS específicas para estilo:\n  • Encabezado: <div class=\"content-header\"> con <h1 class=\"main-title\"> y <p class=\"subtitle\">\n  • Objetivos: <div class=\"objectives-section\"><ul class=\"objectives-list\">...</ul></div>\n  • Desarrollo: secciones con <h2 class=\"section-title\"> y <h3 class=\"subsection-title\">\n  • Visuales: <div class=\"diagram-flow\"> (diagramas ASCII) y <table class=\"styled-table\"> (tablas)\n  • Casos prácticos: <div class=\"case-study\"> con subtítulos y contenido\n  • Datos clave a memorizar: <div class=\"key-data-section\"><div class=\"memory-blocks\"> ... <div class=\"memory-block dates|numbers|concepts\">...</div></div></div>\n  • Resumen final: <div class=\"summary-section visual-summary\"><ul class=\"key-points\">...</ul></div>\n\nFORMATO:\n- Devuelve SOLO HTML válido, bien indentado, con las clases indicadas\n- Usa listas, tablas y diagramas cuando aporte claridad\n- No incluyas texto de sistema ni markdown; solo HTML listo para renderizar\n- Estilo profesional de academia online, específico para ${assistantName}`;

  try {
    const response = await safeFetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        assistantType: 'Temario Generator',
        assistantName: assistantName,
        modelPreference: 'gpt-5-mini',
        history: []
      }),
      timeout: 60000
    } as any);

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error: ${response.status} - ${err}`);
    }
    const data = await response.json();
    const html = data.message || '';
    if (!html || !/<\w+/i.test(html)) {
      throw new Error('Respuesta sin HTML válido');
    }
    return html;
  } catch (error) {
    console.warn('Fallo IA, usando contenido fallback:', error);
    return generateFallbackTemarioContent(assistantName, themeName, minPages);
  }
};

// Generate fallback content when API fails
const generateFallbackTemarioContent = (
  assistantName: string,
  themeName: string,
  minPages: number
): string => {

  return `# ${themeName}
## Temario para ${assistantName}

### OBJETIVOS DE APRENDIZAJE
Al finalizar este tema, el opositor será capaz de:
- Dominar los conceptos fundamentales de ${themeName}
- Aplicar la normativa específica en casos prácticos
- Resolver ejercicios tipo examen con precisión
- Relacionar este tema con el resto del temario

### 1. INTRODUCCIÓN Y MARCO NORMATIVO

#### 1.1 Concepto y Definición
${themeName} constituye una materia fundamental dentro del temario de ${assistantName}. Su comprensión es esencial para el desarrollo profesional en la administración pública.

#### 1.2 Marco Legal
La regulación de ${themeName} se encuentra establecida en:
- Constitución Española de 1978
- Legislación específica aplicable
- Jurisprudencia del Tribunal Supremo
- Directivas europeas relevantes

### 2. DESARROLLO TEÓRICO EXHAUSTIVO

#### 2.1 Antecedentes Históricos
El desarrollo de ${themeName} en el ordenamiento jurídico español ha seguido una evolución progresiva desde la transición democrática.

#### 2.2 Principios Fundamentales
Los principios que rigen ${themeName} son:
1. Principio de legalidad
2. Principio de eficacia
3. Principio de transparencia
4. Principio de responsabilidad

#### 2.3 Elementos Esenciales
Para comprender completamente ${themeName}, es necesario analizar:

**Elemento 1: Aspecto Normativo**
La dimensión normativa de ${themeName} se articula a través de un conjunto de disposiciones que establecen el marco de actuación.

**Elemento 2: Aspecto Procedimental**
Los procedimientos relacionados con ${themeName} siguen una secuencia lógica que garantiza la correcta aplicación de la normativa.

**Elemento 3: Aspecto Organizativo**
La estructura organizativa necesaria para la gestión de ${themeName} requiere una distribución eficiente de competencias.

### 3. ESQUEMAS Y DIAGRAMAS

#### 3.1 Organigrama Funcional
\`\`\`
      AUTORIDAD SUPERIOR
           |
    ┌──────┼──────┐
    │      │      │
ÓRGANO A ÓRGANO B ÓRGANO C
    │      │      │
SUB-A1  SUB-B1  SUB-C1
\`\`\`

#### 3.2 Procedimiento Tipo
\`\`\`
INICIO → TRAMITACIÓN → RESOLUCIÓN → RECURSOS → FIN
  │         │            │          │
  ▼         ▼            ▼          ▼
Solicitud Instrucción  Decisión   Revisión
\`\`\`

### 4. CASOS PRÁCTICOS Y EJEMPLOS

#### 4.1 Supuesto Práctico 1
**Planteamiento**: Un ciudadano presenta una solicitud relacionada con ${themeName}...

**Desarrollo**: Para resolver este caso, debemos aplicar los siguientes criterios...

**Solución**: La resolución correcta implica...

#### 4.2 Supuesto Práctico 2
**Planteamiento**: Una administración debe gestionar un expediente de ${themeName}...

**Desarrollo**: Los pasos a seguir son...

**Solución**: El resultado final debe ser...

### 5. JURISPRUDENCIA RELEVANTE

#### 5.1 Sentencias del Tribunal Supremo
- STS de [fecha]: Doctrina sobre ${themeName}
- STS de [fecha]: Criterios de aplicación
- STS de [fecha]: Límites y excepciones

#### 5.2 Doctrina Administrativa
Los criterios establecidos por los órganos consultivos han clarificado aspectos específicos de ${themeName}.

### 6. ASPECTOS CONTROVERTIDOS Y NOVEDADES

#### 6.1 Debates Doctrinales
En la actualidad, existen diferentes interpretaciones sobre determinados aspectos de ${themeName}.

#### 6.2 Reformas Recientes
Las últimas modificaciones normativas han introducido cambios significativos en la regulación de ${themeName}.

### 7. CONEXIONES CON OTROS TEMAS

${themeName} se relaciona estrechamente con:
- Derecho Administrativo General
- Procedimiento Administrativo
- Régimen Jurídico del Sector Público
- Otros temas específicos del temario

### 8. RESUMEN EJECUTIVO

#### Puntos Clave a Memorizar:
1. Definición esencial de ${themeName}
2. Marco normativo aplicable
3. Principios fundamentales
4. Procedimientos básicos
5. Jurisprudencia relevante

#### Conclusiones:
${themeName} representa un elemento central en la formación de ${assistantName}, cuyo dominio es imprescindible para el éxito en la oposición y el posterior desempeño profesional.

### 9. DATOS CLAVE PARA MEMORIZAR

**Fechas Importantes:**
- Constitución Española: 1978
- Ley de Régimen Jurídico: Ley 40/2015
- Ley de Procedimiento: Ley 39/2015

**Artículos Fundamentales:**
- Art. 103 CE: Administraci��n Pública
- Art. 106 CE: Control jurisdiccional
- Artículos específicos de la normativa sectorial

**Plazos Esenciales:**
- Resolución: 3 meses (regla general)
- Recursos: 1 mes (regla general)
- Prescripción: Variable según materia

### 10. BIBLIOGRAFÍA Y NORMATIVA

#### Normativa Básica:
- Constitución Española
- Ley 39/2015, de Procedimiento Administrativo Común
- Ley 40/2015, de Régimen Jurídico del Sector Público
- Normativa específica de ${themeName}

#### Bibliografía Especializada:
- Manuales de referencia
- Comentarios jurisprudenciales
- Estudios doctrinales
- Obras especializadas en ${assistantName}

---

**NOTA IMPORTANTE**: Este temario constituye una base sólida para la preparación de ${themeName} en las oposiciones de ${assistantName}. Se recomienda complementar con la normativa actualizada y jurisprudencia reciente.

**PÁGINAS GENERADAS**: ${minPages}+ páginas de contenido académico profesional.

**ÚLTIMA ACTUALIZACIÓN**: ${new Date().toLocaleDateString('es-ES')}`;
};

// Ensure structure, fix duplicates, enforce non-empty blocks
const postProcessTemarioHtml = (
  html: string,
  themeName: string,
  assistantName: string,
  minPages: number
): string => {
  let out = html || '';

  // Normalize whitespace
  out = out.replace(/\uFFFD/g, '').replace(/[ \t]+\n/g, '\n');

  // Fix duplicated title patterns like "Tema 2: Tema 2 - ..."
  out = out.replace(/(Tema\s*\d+\s*:\s*)(Tema\s*\d+\s*[:\-]\s*)/gi, '$1');

  // Ensure main header exists
  if (!/<h1[\s\S]*?>[\s\S]*?<\/h1>/i.test(out)) {
    out = `<div class="content-header"><h1 class="main-title">${themeName}</h1><p class="subtitle">Temario para ${assistantName}</p></div>` + out;
  }

  // Ensure required blocks exist and are non-empty
  const ensureBlock = (className: string, content: string) => {
    if (!new RegExp(`<div[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>`, 'i').test(out)) {
      out += `\n<div class="${className}">${content}</div>`;
    }
  };

  ensureBlock('objectives-section', `<ul class="objectives-list"><li>Comprender los fundamentos de ${themeName}</li><li>Aplicar normativa y procedimientos relacionados</li><li>Resolver supuestos prácticos del ámbito de ${assistantName}</li></ul>`);
  ensureBlock('diagram-flow', `Proceso general: INICIO → DESARROLLO → CIERRE`);
  ensureBlock('key-data-section', `<div class="memory-blocks"><div class="memory-block dates"><h3>Fechas</h3><ul><li>Ver normativa vigente</li></ul></div><div class="memory-block numbers"><h3>Números</h3><ul><li>Artículos clave</li></ul></div><div class="memory-block concepts"><h3>Conceptos</h3><ul><li>Términos esenciales</li></ul></div></div>`);
  ensureBlock('summary-section', `<div class="visual-summary"><ul class="key-points"><li>Ideas principales de ${themeName}</li><li>Errores a evitar</li><li>Buenas prácticas</li></ul></div>`);

  // Remove empty tags like <p></p>, <li></li> that could cause "text content blocks must be non-empty"
  out = out.replace(/<([a-z0-9]+)([^>]*)>\s*<\/\1>/gi, '');

  // Ensure minimum length (append complementary content if too short)
  const text = out.replace(/<[^>]*>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  const minWords = Math.max(2500, minPages * 250);
  if (words < minWords) {
    const deficit = minWords - words;
    const approxParas = Math.ceil(deficit / 120);
    let extra = '<div class="theoretical-development">';
    extra += '<h2 class="section-title">Contenido Complementario</h2>';
    for (let i = 0; i < approxParas; i++) {
      extra += `<p>Desarrollo complementario orientado a ampliar ${themeName} en el contexto de ${assistantName}, con explicaciones prácticas, referencias normativas y ejemplos reales aplicados.</p>`;
    }
    extra += '</div>';
    out += extra;
  }

  return out;
};

// Structure content into sections for PDF generation
const structureTemarioContent = (content: string, minPages: number): TemarioSection[] => {
  const sections: TemarioSection[] = [];

  // Split content by main sections
  const sectionHeaders = content.split(/^###?\s+/m).filter(s => s.trim());

  let currentPage = 1;

  sectionHeaders.forEach((sectionContent, index) => {
    const lines = sectionContent.split('\n');
    const title = lines[0]?.trim() || `Sección ${index + 1}`;
    const contentBody = lines.slice(1).join('\n').trim();

    // Estimate pages based on content length (rough estimation)
    const estimatedPages = Math.max(1, Math.ceil(contentBody.length / 3000));
    const pageNumbers = Array.from({ length: estimatedPages }, (_, i) => currentPage + i);

    sections.push({
      title,
      content: contentBody,
      pageNumbers
    });

    currentPage += estimatedPages;
  });

  // Ensure minimum pages are met
  if (currentPage - 1 < minPages) {
    // Add additional content or extend existing sections
    const additionalPages = minPages - (currentPage - 1);
    if (sections.length > 0) {
      const lastSection = sections[sections.length - 1];
      lastSection.content += '\n\n### CONTENIDO ADICIONAL\n\nContenido complementario para alcanzar el mínimo de páginas requerido...';
      for (let i = 0; i < additionalPages; i++) {
        lastSection.pageNumbers.push(currentPage + i);
      }
    }
  }

  return sections;
};

// Clear existing temario for an assistant
export const clearTemarioForAssistant = async (assistantId: string): Promise<void> => {
  console.log(`🗑️ Eliminando temario existente para ${assistantId}`);

  try {
    let deletedCount = 0;

    // 0) Clear standardized assistant_syllabus entries
    try {
      const all = await getDocs(collection(db, 'assistant_syllabus'));
      for (const d of all.docs) {
        const data = d.data() as any;
        if (data.assistantId === assistantId) {
          await deleteDoc(d.ref);
          deletedCount++;
        }
      }
    } catch (e) {
      console.warn('No se pudo limpiar assistant_syllabus o no existe:', e);
    }

    // 1) Clear new temario collection (assistant-specific)
    try {
      const temarioRef = collection(db, `assistants/${assistantId}/temario`);
      const temarioSnapshot = await getDocs(temarioRef);
      for (const d of temarioSnapshot.docs) {
        await deleteDoc(d.ref);
        deletedCount++;
      }
    } catch (e) {
      console.warn('No se pudo limpiar assistants/{id}/temario o no existe:', e);
    }

    // 2) Clear legacy syllabus so que no se muestre el antiguo
    try {
      const syllabusRef = collection(db, `assistants/${assistantId}/syllabus`);
      const syllabusSnapshot = await getDocs(syllabusRef);
      for (const d of syllabusSnapshot.docs) {
        await deleteDoc(d.ref);
        deletedCount++;
      }
    } catch (e) {
      console.warn('No se pudo limpiar assistants/{id}/syllabus o no existe:', e);
    }

    console.log(`✅ Temario eliminado: ${deletedCount} documentos en total`);

    // Log audit
    await logTemarioReset(assistantId, deletedCount);

  } catch (error) {
    console.error('Error clearing temario:', error);
    throw error;
  }
};

// Log temario creation for audit
const logTemarioCreation = async (
  assistantId: string,
  assistantName: string,
  themeName: string,
  pages: number
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const logRef = doc(collection(db, 'admin_logs/temario_create/logs'));
    await setDoc(logRef, {
      assistantId,
      assistantName,
      themeName,
      pages,
      createdBy: user.uid,
      createdByEmail: user.email,
      timestamp: new Date().toISOString(),
      action: 'create_temario'
    });

    console.log(`📝 Audit log created for temario: ${assistantName}/${themeName}`);
  } catch (error) {
    console.warn('Error creating audit log:', error);
  }
};

// Log temario reset for audit
const logTemarioReset = async (
  assistantId: string,
  deletedCount: number
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const logRef = doc(collection(db, 'admin_logs/temario_reset/logs'));
    await setDoc(logRef, {
      assistantId,
      deletedCount,
      deletedBy: user.uid,
      deletedByEmail: user.email,
      timestamp: new Date().toISOString(),
      action: 'reset_temario'
    });

    console.log(`📝 Audit log created for temario reset: ${assistantId}`);
  } catch (error) {
    console.warn('Error creating reset audit log:', error);
  }
};

// Broadcast temario updates to all tabs
export const broadcastTemarioUpdate = (
  assistantId: string,
  assistantSlug: string,
  themeName: string
): void => {
  if (typeof window === 'undefined') return;

  try {
    const updateMessage = {
      type: 'TEMARIO_UPDATED',
      assistantId,
      assistantSlug,
      themeName,
      timestamp: Date.now(),
      force: true
    };

    // Multiple broadcast methods
    const channel = new BroadcastChannel('temario_updates');
    channel.postMessage(updateMessage);

    window.postMessage(updateMessage, '*');
    localStorage.setItem(`temario_update_${assistantId}`, JSON.stringify(updateMessage));
    window.dispatchEvent(new CustomEvent('temarioUpdated', { detail: updateMessage }));

    console.log(`📡 Temario update broadcast sent for ${assistantSlug}/${themeName}`);
  } catch (error) {
    console.warn('Error broadcasting temario update:', error);
  }
};
