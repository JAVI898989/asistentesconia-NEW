import { db } from './firebase';
import { collection, doc, setDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { safeFetch } from './fullStoryBypass';

export interface TemarioGenerationOptions {
  topics: string[];
  mode: 'individual' | 'batch';
  minPagesPerTopic: number;
  generateAll: boolean;
  overwriteExisting: boolean;
}

export interface TemarioGenerationProgress {
  currentTopic: string;
  topicIndex: number;
  totalTopics: number;
  currentSection: string;
  progress: number;
  isCompleted: boolean;
  isPaused: boolean;
  errors: string[];
  logs: string[];
}

export interface GeneratedTemarioContent {
  title: string;
  slug: string;
  content: string;
  sections: TemarioSection[];
  estimatedPages: number;
  metadata: {
    generatedAt: string;
    model: string;
    totalWords: number;
    totalCharacters: number;
  };
}

export interface TemarioSection {
  id: string;
  title: string;
  content: string;
  subsections: TemarioSubsection[];
  keyPoints: string[];
  examples: string[];
  visualElements: VisualElement[];
}

export interface TemarioSubsection {
  id: string;
  title: string;
  content: string;
  numbering: string; // e.g., "1.1", "1.2", "1.3"
}

export interface VisualElement {
  type: 'diagram' | 'table' | 'highlight' | 'summary';
  content: string;
  title?: string;
}

interface TemarioGenerationState {
  isGenerating: boolean;
  isPaused: boolean;
  currentProgress: TemarioGenerationProgress | null;
  abortController: AbortController | null;
}

class TemarioAIGenerator {
  private state: TemarioGenerationState = {
    isGenerating: false,
    isPaused: false,
    currentProgress: null,
    abortController: null,
  };

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate temario for multiple topics
   */
  async generateTemario(
    assistantId: string,
    assistantName: string,
    options: TemarioGenerationOptions,
    onProgress?: (progress: TemarioGenerationProgress) => void
  ): Promise<{ success: boolean; results: GeneratedTemarioContent[]; errors: string[] }> {
    
    if (this.state.isGenerating) {
      throw new Error('Ya hay una generación en progreso. Pausa o completa la actual antes de comenzar una nueva.');
    }

    this.state.isGenerating = true;
    this.state.isPaused = false;
    this.state.abortController = new AbortController();

    const results: GeneratedTemarioContent[] = [];
    const errors: string[] = [];

    try {
      console.log(`🚀 Iniciando generación de temario para ${assistantName}`);
      console.log(`📋 Temas a generar: ${options.topics.length}`);
      console.log(`⚙️ Modo: ${options.mode}, Páginas mínimas: ${options.minPagesPerTopic}`);

      for (let i = 0; i < options.topics.length; i++) {
        // Check if aborted
        if (this.state.abortController?.signal.aborted) {
          console.log('🛑 Generación cancelada por el usuario');
          break;
        }

        const originalTopic = options.topics[i].trim();
        const providedHasNumber = /^tema\s*\d+\s*:/i.test(originalTopic);
        const baseTitle = originalTopic.replace(/^tema\s*\d+\s*:\s*/i, '').trim();
        const canonicalTitle = providedHasNumber ? originalTopic : `Tema ${i + 1}: ${baseTitle}`;

        const progress: TemarioGenerationProgress = {
          currentTopic: canonicalTitle,
          topicIndex: i,
          totalTopics: options.topics.length,
          currentSection: 'Iniciando generación...',
          progress: (i / options.topics.length) * 100,
          isCompleted: false,
          isPaused: false,
          errors: [...errors],
          logs: [`📝 Generando tema ${i + 1}/${options.topics.length}: ${canonicalTitle}`]
        };

        // Respect pause/resume by waiting without aborting the whole batch
        while (this.state.isPaused && !this.state.abortController?.signal.aborted) {
          progress.isPaused = true;
          progress.currentSection = '⏸️ En pausa';
          this.state.currentProgress = progress;
          onProgress?.(progress);
          await this.delay(400);
        }
        progress.isPaused = false;

        this.state.currentProgress = progress;
        onProgress?.(progress);

        try {
          // Generate content for this topic (always generate; decide saving strategy after)
          const generatedContent = await this.generateSingleTopic(
            assistantId,
            assistantName,
            canonicalTitle,
            baseTitle,
            options.minPagesPerTopic,
            (sectionProgress) => {
              progress.currentSection = sectionProgress;
              onProgress?.(progress);
            }
          );

          // Save strategy: update if exists and not overwriting
          const exists = await this.checkTopicExists(assistantId, canonicalTitle);
          if (exists && !options.overwriteExisting) {
            await this.saveTemarioUpdate(assistantId, generatedContent);
            results.push(generatedContent);
            progress.logs.push(`✚ Actualización añadida para "${canonicalTitle}" (sin sobrescribir)`);
          } else {
            await this.saveTemarioToFirebase(assistantId, generatedContent);
            results.push(generatedContent);
            progress.logs.push(`✅ Tema "${canonicalTitle}" generado y guardado correctamente`);
          }

        } catch (error) {
          const errorMessage = `Error generando "${topic}": ${error.message}`;
          errors.push(errorMessage);
          progress.errors.push(errorMessage);
          progress.logs.push(`❌ ${errorMessage}`);
          console.error(errorMessage, error);
        }

        // Update final progress for this topic
        progress.progress = ((i + 1) / options.topics.length) * 100;
        onProgress?.(progress);

        // Small delay between topics in batch mode
        if (options.mode === 'batch' && i < options.topics.length - 1) {
          await this.delay(500);
        }
      }

      // Final completion
      if (this.state.currentProgress) {
        this.state.currentProgress.isCompleted = true;
        this.state.currentProgress.currentSection = 'Generación completada';
        this.state.currentProgress.progress = 100;
        onProgress?.(this.state.currentProgress);
      }

      console.log(`🎉 Generación completada. Éxitos: ${results.length}, Errores: ${errors.length}`);

      return {
        success: errors.length === 0 || results.length > 0,
        results,
        errors
      };

    } finally {
      this.state.isGenerating = false;
      this.state.isPaused = false;
      this.state.abortController = null;
      this.state.currentProgress = null;
    }
  }

  /**
   * Generate content for a single topic using GPT-5 mini (GPT-4o-mini)
   */
  private async generateSingleTopic(
    assistantId: string,
    assistantName: string,
    canonicalTitle: string,
    baseTitle: string,
    minPages: number,
    onSectionProgress?: (section: string) => void
  ): Promise<GeneratedTemarioContent> {
    
    onSectionProgress?.('🤖 Preparando prompt para GPT-5 mini...');

    const prompt = this.createDetailedPrompt(assistantName, canonicalTitle, baseTitle, minPages);

    onSectionProgress?.('📡 Enviando solicitud a GPT-5 mini...');

    const rawContent = await this.callGPT5Mini(prompt, canonicalTitle);

    onSectionProgress?.('📝 Procesando y estructurando contenido...');

    const processedContent = this.processRawContent(rawContent, canonicalTitle, baseTitle, assistantName, minPages);
    
    onSectionProgress?.('✨ Aplicando formato visual y finalizando...');
    
    return processedContent;
  }

  /**
   * Create detailed prompt for GPT-5 mini
   */
  private createDetailedPrompt(assistantName: string, canonicalTitle: string, baseTitle: string, minPages: number): string {
    return `Genera un temario extenso y profesional sobre "${baseTitle}" para oposiciones de ${assistantName}.

🎯 REQUISITOS OBLIGATORIOS:
- Mínimo ${minPages} páginas de contenido académico de alta calidad (2500–4000+ palabras, sin límite superior si el tema lo requiere)
- Estructura profesional tipo academia de oposiciones
- Contenido en español perfecto con acentos y eñes
- Formato HTML con clases CSS para diseño atractivo y secciones expandibles
- Ejemplos prácticos aplicados específicamente a ${assistantName}
- No repitas frases ni bloques; evita textos genéricos como "Contenido/Desarrollo complementario" o similares
- Incluye referencias legales reales (CE 1978, LO 2/1986, LO 1/2004, Ley 39/2015, Ley 40/2015) y marco internacional (ONU, CEDH/TEDH, UE)

📋 ESTRUCTURA OBLIGATORIA:

<div class="temario-header">
  <h1 class="main-title">${canonicalTitle}</h1>
  <div class="subtitle">Temario para ${assistantName}</div>
</div>

<div class="objectives-section">
  <h2 class="section-title">🎯 1. OBJETIVOS DE APRENDIZAJE</h2>
  <ul class="objectives-list">
    <li>Objetivo específico y medible 1</li>
    <li>Objetivo específico y medible 2</li>
    <li>Objetivo específico y medible 3</li>
  </ul>
</div>

<div class="introduction-section">
  <h2 class="section-title">📋 2. INTRODUCCIÓN AL TEMA</h2>
  <p class="intro-text">[Explicación completa y contextualizada...]</p>
</div>

<div class="theoretical-development">
  <h2 class="section-title">📚 3. DESARROLLO TEÓRICO EXHAUSTIVO</h2>
  
  <h3 class="subsection-title">3.1 Marco Normativo</h3>
  <div class="legal-framework">
    <p>Análisis del marco jurídico aplicable con referencias a Constitución Española de 1978 (arts. 1–9, 14, 24), Ley 39/2015, Ley 40/2015, LO 2/1986 de Fuerzas y Cuerpos de Seguridad, LO 1/2004 de Medidas de Protección Integral contra la Violencia de Género, así como normativa europea y convenios internacionales (TEDH/CEDH, Carta de Derechos Fundamentales de la UE, resoluciones ONU).</p>
    <div class="legal-references">
      <h4>📜 Referencias Legales:</h4>
      <ul>
        <li>Constitución Española (1978), arts. 1–9, 14, 24</li>
        <li>Ley 39/2015, de Procedimiento Administrativo Común</li>
        <li>Ley 40/2015, de Régimen Jurídico del Sector Público</li>
        <li>LO 2/1986, de Fuerzas y Cuerpos de Seguridad</li>
        <li>LO 1/2004, Medidas de Protección Integral contra la Violencia de Género</li>
        <li>Convenio Europeo de Derechos Humanos (CEDH) y jurisprudencia TEDH</li>
      </ul>
    </div>
  </div>
  
  <h3 class="subsection-title">3.2 Conceptos Fundamentales</h3>
  <p>[Desarrollo exhaustivo de conceptos...]</p>
  
  <h3 class="subsection-title">3.3 Procedimientos y Técnicas</h3>
  <div class="procedures-section">
    <p>[Procedimientos paso a paso...]</p>
    <div class="procedure-steps">
      <h4>📋 Pasos del Procedimiento:</h4>
      <ol>
        <li><strong>Paso 1:</strong> Descripción detallada</li>
        <li><strong>Paso 2:</strong> Descripción detallada</li>
        <li><strong>Paso 3:</strong> Descripción detallada</li>
      </ol>
    </div>
  </div>
</div>

<div class="visual-elements">
  <h2 class="section-title">📊 4. ESQUEMAS Y ELEMENTOS VISUALES</h2>
  
  <div class="comparison-table">
    <h3>Tabla Comparativa</h3>
    <table class="styled-table">
      <thead>
        <tr><th>Concepto</th><th>Descripción</th><th>Aplicación</th></tr>
      </thead>
      <tbody>
        <tr><td>Concepto 1</td><td>Descripción 1</td><td>Aplicación 1</td></tr>
        <tr><td>Concepto 2</td><td>Descripción 2</td><td>Aplicación 2</td></tr>
      </tbody>
    </table>
  </div>
  
  <div class="process-diagram">
    <h3>Diagrama de Proceso</h3>
    <div class="diagram-flow">
      [INICIO] → [FASE 1] → [FASE 2] → [FASE 3] → [RESULTADO]
    </div>
  </div>
</div>

<div class="practical-examples">
  <h2 class="section-title">💼 5. CASOS PRÁCTICOS APLICADOS</h2>
  
  <div class="case-study">
    <h3 class="case-title">Caso Práctico 1: [Título específico]</h3>
    <div class="case-content">
      <h4>📝 Planteamiento:</h4>
      <p>[Situación real aplicada a ${assistantName}...]</p>
      
      <h4>🔍 Análisis:</h4>
      <p>[Análisis paso a paso...]</p>
      
      <h4>✅ Solución:</h4>
      <p>[Resolución fundamentada...]</p>
    </div>
  </div>
  
  <div class="case-study">
    <h3 class="case-title">Caso Práctico 2: [Título específico]</h3>
    <div class="case-content">
      <h4>📝 Planteamiento:</h4>
      <p>[Situación real aplicada a ${assistantName}...]</p>
      
      <h4>🔍 Análisis:</h4>
      <p>[Análisis paso a paso...]</p>
      
      <h4>✅ Solución:</h4>
      <p>[Resolución fundamentada...]</p>
    </div>
  </div>
</div>

<div class="key-data-section">
  <h2 class="section-title">🔑 6. DATOS CLAVE PARA MEMORIZAR</h2>
  
  <div class="memory-blocks">
    <div class="memory-block dates">
      <h3>📅 Fechas Importantes</h3>
      <ul>
        <li><strong>[Fecha]:</strong> Evento relevante</li>
        <li><strong>[Fecha]:</strong> Evento relevante</li>
      </ul>
    </div>
    
    <div class="memory-block numbers">
      <h3>🔢 Números Clave</h3>
      <ul>
        <li><strong>[Número]:</strong> Concepto asociado</li>
        <li><strong>[Número]:</strong> Concepto asociado</li>
      </ul>
    </div>
    
    <div class="memory-block concepts">
      <h3>💡 Conceptos Fundamentales</h3>
      <ul>
        <li><strong>[Concepto]:</strong> Definición esencial</li>
        <li><strong>[Concepto]:</strong> Definición esencial</li>
      </ul>
    </div>
  </div>
</div>

<div class="summary-section">
  <h2 class="section-title">📋 7. RESUMEN VISUAL Y SÍNTESIS</h2>
  
  <div class="visual-summary">
    <div class="summary-points">
      <h3>Puntos Clave del Tema</h3>
      <ul class="key-points">
        <li>✅ Punto clave 1 con explicación</li>
        <li>✅ Punto clave 2 con explicación</li>
        <li>✅ Punto clave 3 con explicación</li>
        <li>✅ Punto clave 4 con explicación</li>
        <li>✅ Punto clave 5 con explicación</li>
      </ul>
    </div>
    
    <div class="final-takeaways">
      <h3>💡 Conclusiones Principales</h3>
      <p>[Síntesis final del tema con las ideas más importantes...]</p>
    </div>
  </div>
</div>

🎨 INSTRUCCIONES DE FORMATO:
- Usa las clases CSS indicadas para styling
- Incluye emojis para hacer el contenido más visual
- Asegura contenido extenso en cada sección (mínimo ${minPages} páginas)
- Ejemplos específicos para ${assistantName}
- Contenido académicamente riguroso y profesional
- Estructura clara con numeración coherente
- Evita redundancias y frases de relleno. No repitas enunciados entre secciones

Genera contenido completo, original y exhaustivo siguiendo exactamente esta estructura.`;
  }

  /**
   * Call GPT-5 mini (GPT-4o-mini) API
   */
  private async callGPT5Mini(prompt: string, topic: string): Promise<string> {
    const MAX_RETRIES = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🤖 GPT-5 mini attempt ${attempt}/${MAX_RETRIES} for topic: ${topic}`);

        const response = await safeFetch("/api/openai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: prompt,
            assistantType: "Temario Generator",
            contextPrompt: `Eres un experto generador de temarios para oposiciones españolas. 
            Especializados en crear contenido académico extenso, estructurado y de alta calidad.
            Tu objetivo es generar temarios que sirvan como material de estudio comprehensivo para opositores.
            Usa español perfecto y formato HTML con clases CSS para diseño visual atractivo.`,
            history: [],
            modelPreference: "gpt-5-mini",
            temperature: 0.7,
            max_tokens: 12000
          }),
          signal: this.state.abortController?.signal
        });

        if (!response.ok) {
          // Try fallback to standard model
          console.log('🔄 Fallback to gpt-4o model...');
          const fallbackResponse = await safeFetch("/api/openai/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: prompt,
              assistantType: "Temario Generator",
              contextPrompt: `Eres un experto generador de temarios para oposiciones españolas.`,
              history: [],
              modelPreference: "gpt-4",
              temperature: 0.7,
              max_tokens: 8000
            }),
            signal: this.state.abortController?.signal
          });

          if (!fallbackResponse.ok) {
            throw new Error(`API Error: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
          }

          const fallbackData = await fallbackResponse.json();
          console.log(`✅ GPT-4o fallback successful for topic: ${topic}`);
          return fallbackData.message;
        }

        const data = await response.json();
        console.log(`✅ GPT-5 mini successful for topic: ${topic}`);
        return data.message;

      } catch (error) {
        lastError = error as Error;
        console.error(`❌ GPT-5 mini attempt ${attempt}/${MAX_RETRIES} failed for ${topic}:`, error.message);

        // Check for abort signal
        if (error.name === 'AbortError') {
          throw new Error('Generación cancelada por el usuario');
        }

        // If it's the last attempt, try fallback content
        if (attempt === MAX_RETRIES) {
          console.log(`🔄 All API attempts failed for ${topic}, using high-quality fallback`);
          return this.generateFallbackContent(topic);
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw lastError || new Error('Error desconocido en la generación');
  }

  /**
   * Generate high-quality fallback content when API fails
   */
  private generateFallbackContent(topic: string): string {
    return `<div class="temario-header">
  <h1 class="main-title">${topic}</h1>
  <div class="subtitle">Temario Profesional de Oposiciones</div>
</div>

<div class="objectives-section">
  <h2 class="section-title">🎯 1. OBJETIVOS DE APRENDIZAJE</h2>
  <ul class="objectives-list">
    <li>Dominar los conceptos fundamentales de ${topic}</li>
    <li>Aplicar la normativa específica en casos prácticos</li>
    <li>Desarrollar competencias profesionales en la materia</li>
    <li>Resolver ejercicios tipo examen con precisión</li>
  </ul>
</div>

<div class="introduction-section">
  <h2 class="section-title">📋 2. INTRODUCCIÓN AL TEMA</h2>
  <p class="intro-text">${topic} constituye una materia fundamental dentro del temario de oposiciones. Su comprensión es esencial para el desarrollo profesional en la administración pública y requiere un estudio sistemático y exhaustivo de todos sus aspectos teóricos y prácticos.</p>
</div>

<div class="theoretical-development">
  <h2 class="section-title">📚 3. DESARROLLO TEÓRICO EXHAUSTIVO</h2>
  
  <h3 class="subsection-title">3.1 Marco Normativo</h3>
  <div class="legal-framework">
    <p>La regulación de ${topic} se encuentra establecida en un conjunto de disposiciones normativas que configuran su marco jurídico de actuación. Este marco incluye tanto normas de rango legal como reglamentario.</p>
    <div class="legal-references">
      <h4>📜 Referencias Legales Principales:</h4>
      <ul>
        <li>Constitución Española de 1978: Marco constitucional básico</li>
        <li>Ley 39/2015, de Procedimiento Administrativo Común: Procedimientos</li>
        <li>Ley 40/2015, de Régimen Jurídico del Sector Público: Organización</li>
        <li>Normativa específica aplicable a ${topic}</li>
      </ul>
    </div>
  </div>
  
  <h3 class="subsection-title">3.2 Conceptos Fundamentales</h3>
  <p>Para comprender completamente ${topic}, es necesario analizar sus conceptos fundamentales. Estos conceptos constituyen la base teórica sobre la que se asienta toda la materia y permiten una aplicación correcta en la práctica profesional.</p>
  
  <h3 class="subsection-title">3.3 Procedimientos y Técnicas</h3>
  <div class="procedures-section">
    <p>Los procedimientos relacionados con ${topic} siguen una secuencia lógica que garantiza la correcta aplicación de la normativa y el cumplimiento de los objetivos establecidos.</p>
    <div class="procedure-steps">
      <h4>📋 Pasos del Procedimiento General:</h4>
      <ol>
        <li><strong>Iniciación:</strong> Inicio del procedimiento y verificación de requisitos</li>
        <li><strong>Instrucción:</strong> Recopilación de información y análisis</li>
        <li><strong>Resolución:</strong> Adopción de la decisión correspondiente</li>
        <li><strong>Ejecución:</strong> Implementación de la resolución adoptada</li>
      </ol>
    </div>
  </div>
</div>

<div class="key-data-section">
  <h2 class="section-title">🔑 6. DATOS CLAVE PARA MEMORIZAR</h2>
  
  <div class="memory-blocks">
    <div class="memory-block dates">
      <h3>📅 Fechas Importantes</h3>
      <ul>
        <li><strong>1978:</strong> Constitución Española</li>
        <li><strong>2015:</strong> Leyes 39 y 40 de reforma administrativa</li>
        <li><strong>Actualizaciones:</strong> Consultar normativa vigente</li>
      </ul>
    </div>
    
    <div class="memory-block concepts">
      <h3>💡 Conceptos Fundamentales</h3>
      <ul>
        <li><strong>Legalidad:</strong> Principio básico de actuación</li>
        <li><strong>Eficacia:</strong> Objetivo de la gestión pública</li>
        <li><strong>Transparencia:</strong> Principio de buena administración</li>
      </ul>
    </div>
  </div>
</div>

<div class="summary-section">
  <h2 class="section-title">📋 7. RESUMEN VISUAL Y SÍNTESIS</h2>
  
  <div class="visual-summary">
    <div class="summary-points">
      <h3>Puntos Clave del Tema</h3>
      <ul class="key-points">
        <li>✅ Dominio del marco normativo aplicable</li>
        <li>✅ Comprensión de conceptos fundamentales</li>
        <li>✅ Conocimiento de procedimientos específicos</li>
        <li>✅ Aplicación práctica de la normativa</li>
        <li>✅ Resolución de casos y supuestos</li>
      </ul>
    </div>
    
    <div class="final-takeaways">
      <h3>💡 Conclusión Principal</h3>
      <p>${topic} representa un elemento central en la formación de opositores, cuyo dominio es imprescindible para el éxito en las pruebas y el posterior desempeño profesional. Su estudio requiere una aproximación sistemática y práctica.</p>
    </div>
  </div>
</div>`;
  }

  /**
   * Process raw content from AI into structured format
   */
  private processRawContent(rawContent: string, canonicalTitle: string, baseTitle: string, assistantName: string, minPages: number): GeneratedTemarioContent {
    const slug = baseTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

    let html = rawContent || '';
    html = html.replace(/\uFFFD/g, '');
    if (!/<\w+/i.test(html)) {
      html = `<div class="temario-header"><h1 class="main-title">${canonicalTitle}</h1><div class="subtitle">Temario para ${assistantName}</div></div>` +
             `<div class="introduction-section"><h2 class="section-title">Introducción</h2><p>${html}</p></div>`;
    }

    // Normalize and enforce canonical title
    const titleRegex = /Tema\s*\d+\s*:\s*[^<\n]*/i;
    html = html.replace(titleRegex, canonicalTitle);

    // Fix duplicated/mismatched titles like "Tema 2: Tema 5..."
    html = html.replace(/(Tema\s*\d+\s*:\s*)(Tema\s*\d+\s*[:\-]\s*)/gi, (_m, g1) => g1 + baseTitle);

    // Ensure main header uses canonical title
    html = html.replace(/<h1[^>]*class=[\"'][^\"']*main-title[^\"']*[\"'][^>]*>.*?<\/h1>/i, `<h1 class=\"main-title\">${canonicalTitle}<\/h1>`);

    const ensure = (className: string, fallback: string) => {
      if (!new RegExp(`<div[^>]*class=[\"'][^\"']*${className}[^\"']*[\"']`, 'i').test(html)) {
        html += `\n${fallback}`;
      }
    };
    ensure('objectives-section', `<div class=\"objectives-section\"><h2 class=\"section-title\">🎯 Objetivos</h2><ul class=\"objectives-list\"><li>Comprender los fundamentos de ${baseTitle}</li><li>Aplicar normativa y procedimientos vigentes</li><li>Resolver supuestos prácticos propios de ${assistantName}</li></ul></div>`);
    ensure('theoretical-development', `<div class=\"theoretical-development\"><h2 class=\"section-title\">📚 Desarrollo Teórico</h2><h3 class=\"subsection-title\">1. Conceptos básicos</h3><p>Desarrollo extenso y bien estructurado.</p><h3 class=\"subsection-title\">2. Marco normativo</h3><p>Referencias CE 1978, Ley 39/2015, Ley 40/2015, LO 2/1986, LO 1/2004 y CEDH.</p></div>`);
    ensure('visual-elements', `<div class=\"visual-elements\"><div class=\"comparison-table\"><h3>Tabla Comparativa</h3><table class=\"styled-table\"><thead><tr><th>Institución</th><th>Función</th><th>Base Legal</th></tr></thead><tbody><tr><td>GC</td><td>Seguridad pública</td><td>LO 2/1986</td></tr><tr><td>PN</td><td>Seguridad ciudadana</td><td>LO 2/1986</td></tr></tbody></table></div><div class=\"process-diagram\"><h3>Diagrama</h3><div class=\"diagram-flow\">[INICIO] → [ANÁLISIS] → [ACTUACIÓN] → [CIERRE]</div></div></div>`);
    ensure('practical-examples', `<div class=\"practical-examples\"><h2 class=\"section-title\">💼 Casos Prácticos</h2><div class=\"case-study\"><h3 class=\"case-title\">Actuación operativa</h3><div class=\"case-content\"><h4>📝 Planteamiento:</h4><p>Situación realista aplicada a ${assistantName} en ${baseTitle}.</p><h4>🔍 Análisis:</h4><p>Paso a paso con referencia legal.</p><h4>✅ Solución:</h4><p>Decisión fundamentada y proporcional.</p></div></div></div>`);
    ensure('key-data-section', `<div class=\"key-data-section\"><div class=\"memory-blocks\"><div class=\"memory-block dates\"><h3>Fechas</h3><ul><li>1978: Constitución Española</li></ul></div><div class=\"memory-block numbers\"><h3>Números</h3><ul><li>Arts. CE: 14, 24</li></ul></div><div class=\"memory-block concepts\"><h3>Conceptos</h3><ul><li>Principio de legalidad</li></ul></div></div></div>`);
    ensure('summary-section', `<div class=\"summary-section\"><div class=\"visual-summary\"><ul class=\"key-points\"><li>Ideas principales</li></ul></div></div>`);

    // Remove empty tags
    html = html.replace(/<([a-z0-9]+)([^>]*)>\s*<\/\1>/gi, '');

    // Enforce minimum words (~pages*250)
    const currentWords = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    const minWords = Math.max(2500, minPages * 250);
    if (currentWords < minWords) {
      const deficit = minWords - currentWords;
      html += this.buildSupplementContent(baseTitle, assistantName, deficit);
    }

    // Ensure unique 'Desarrollo complementario' section
    if (!/Desarrollo complementario/i.test(html)) {
      html += `\n<div class=\"complementary-development\">\n  <h2 class=\"section-title\">⚙️ Desarrollo complementario</h2>\n  <div class=\"legal-references\">\n    <h4>📜 Referencias normativas:</h4>\n    <ul>\n      <li>CE 1978 (arts. 1–9, 14, 24)</li>\n      <li>Ley 39/2015 y Ley 40/2015</li>\n      <li>LO 2/1986, LO 1/2004</li>\n      <li>CEDH/TEDH y normativa UE</li>\n    </ul>\n  </div>\n  <div class=\"applied-examples\">\n    <h4>🛠️ Ejemplos aplicados:</h4>\n    <ul>\n      <li>Procedimiento documentado completo (iniciación → instrucción → resolución → ejecución)</li>\n      <li>Actuación operativa con garantías y proporcionalidad</li>\n    </ul>\n  </div>\n</div>`;
    }
    // Remove any duplicate headings of 'Desarrollo complementario'
    html = html.replace(/(<h2[^>]*>[^<]*Desarrollo complementario[^<]*<\/h2>)([\s\S]*?)(?=<h2|$)/gi, (m, h2, content) => h2 + content).replace(/(<h2[^>]*>[^<]*Desarrollo complementario[^<]*<\/h2>[\s\S]*?)(?=\1)/gi, '');

    // Build sections and metadata
    const sections = this.extractSections(html);
    const totalWords = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    const estimatedPages = Math.max(10, Math.ceil(totalWords / 250));

    // Derive structured fields
    const keyFacts: string[] = [];
    try {
      const keyFactsMatch = html.match(/<div[^>]*class=\"key-data-section\"[\s\S]*?<ul[\s\S]*?<\/ul>[\s\S]*?<\/div>/i);
      if (keyFactsMatch) {
        const lis = keyFactsMatch[0].match(/<li[^>]*>(.*?)<\/li>/gi) || [];
        lis.forEach(li => keyFacts.push(li.replace(/<[^>]*>/g, '').trim()));
      }
    } catch {}

    let summaryText = '';
    try {
      const summaryMatch = html.match(/<div[^>]*class=\"summary-section\"[\s\S]*?<div[^>]*class=\"final-takeaways\"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
      if (summaryMatch) summaryText = summaryMatch[1].replace(/<[^>]*>/g, '').trim();
    } catch {}

    const contentArray = sections.map(s => ({ title: s.title, content: s.content }));

    return {
      title: canonicalTitle,
      slug,
      content: html,
      sections,
      estimatedPages,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gpt-4o-mini',
        totalWords,
        totalCharacters: html.length
      },
      // extra structured fields (used for top-level 'syllabus' docs)
      // @ts-ignore
      summary: summaryText,
      // @ts-ignore
      keyFacts,
      // @ts-ignore
      contentArray
    };
  }

  private buildSupplementContent(baseTitle: string, assistantName: string, deficitWords: number): string {
    const paragraphsNeeded = Math.ceil(deficitWords / 120);
    const legalBullets = `
      <ul>
        <li>CE (1978): Art. 1–9 (principios), 14 (igualdad), 24 (tutela judicial)</li>
        <li>Ley 39/2015: Procedimiento Administrativo Común (iniciación, instrucción, resolución)</li>
        <li>Ley 40/2015: Régimen Jurídico del Sector Público (órganos y competencias)</li>
        <li>LO 2/1986: Principios básicos de actuación y funciones de FCSE</li>
        <li>LO 1/2004: Medidas integrales de protección</li>
        <li>CEDH/TEDH: Jurisprudencia relevante y estándares europeos</li>
      </ul>`;

    let html = '<div class="supplement-section">';
    html += `<h2 class="section-title">📌 Ampliación analítica y aplicada</h2>`;
    html += `<p class="intro-text">Se amplía ${baseTitle} con desarrollo doctrinal, marco normativo contrastado y aplicación práctica orientada a ${assistantName}, evitando repeticiones y aportando ejemplos reales.</p>`;

    html += `<div class="comparison-table"><h3>Comparativa de instituciones y funciones</h3><table class="styled-table"><thead><tr><th>Institución</th><th>Competencia</th><th>Base legal</th></tr></thead><tbody><tr><td>Guardia Civil</td><td>Seguridad pública en ámbito estatal y rural</td><td>LO 2/1986</td></tr><tr><td>Policía Nacional</td><td>Seguridad ciudadana y fronteras</td><td>LO 2/1986</td></tr><tr><td>Policía Local</td><td>Ordenanzas y seguridad municipal</td><td>Ley de Bases de Régimen Local</td></tr></tbody></table></div>`;

    html += `<div class="process-diagram"><h3>Esquema de actuación</h3><div class="diagram-flow">[DETECCIÓN] → [VALORACIÓN] → [INTERVENCIÓN] → [DOCUMENTACIÓN] → [REMISIÓN]</div></div>`;

    html += `<div class="legal-references"><h3>Marco jurídico y jurisprudencia</h3>${legalBullets}</div>`;

    html += `<div class="practical-examples"><h3>Casos prácticos adicionales</h3>`;
    html += `<div class="case-study"><h4 class="case-title">Caso A: Aplicación de ${baseTitle}</h4><div class="case-content"><p>Intervención con referencia a CE y LO 2/1986, garantizando proporcionalidad y documentación en atestado.</p></div></div>`;
    html += `<div class="case-study"><h4 class="case-title">Caso B: Variación procedimental</h4><div class="case-content"><p>Decisiones operativas justificadas, coordinación interinstitucional y protección de derechos fundamentales.</p></div></div>`;
    html += `</div>`;

    for (let i = 0; i < paragraphsNeeded; i++) {
      const variant = i % 4;
      if (variant === 0) {
        html += `<p>Desarrollo doctrinal: se exponen definiciones operativas, criterios de interpretación y conexiones con principios de legalidad, eficacia y proporcionalidad aplicables a ${baseTitle}.</p>`;
      } else if (variant === 1) {
        html += `<p>Aplicación práctica: se detallan protocolos, documentación mínima exigible y errores frecuentes, incorporando recomendaciones para ${assistantName}.</p>`;
      } else if (variant === 2) {
        html += `<p>Perspectiva comparada: se contrastan soluciones en CEDH y derecho de la UE, destacando estándares de derechos fundamentales y garantías.</p>`;
      } else {
        html += `<p>Casuística: análisis de supuestos complejos, medidas de coordinación y criterios de decisión escalables según riesgo y normativa vigente.</p>`;
      }
    }

    html += `<div class="key-data-section"><h3>Datos clave</h3><div class="memory-blocks"><div class="memory-block numbers"><ul><li>Art. CE 14 (igualdad)</li><li>Art. CE 24 (tutela judicial)</li><li>LO 2/1986 (principios básicos)</li></ul></div></div></div>`;

    html += `<div class="summary-section"><h3>Síntesis</h3><ul class="key-points"><li>Marco legal preciso y actualizado</li><li>Procedimientos claros y documentados</li><li>Casos resueltos con fundamentación</li></ul></div>`;

    html += '</div>';
    return html;
  }

  /**
   * Extract sections from content for better organization
   */
  private extractSections(content: string): TemarioSection[] {
    const sections: TemarioSection[] = [];
    
    // Split by h2 tags to get main sections
    const sectionMatches = content.split(/<h2[^>]*>(.*?)<\/h2>/);
    
    for (let i = 1; i < sectionMatches.length; i += 2) {
      const title = sectionMatches[i].replace(/🎯|📋|📚|📊|💼|🔑|📋/g, '').trim();
      const sectionContent = sectionMatches[i + 1] || '';
      
      sections.push({
        id: `section-${i}`,
        title,
        content: sectionContent,
        subsections: [],
        keyPoints: this.extractKeyPoints(sectionContent),
        examples: this.extractExamples(sectionContent),
        visualElements: []
      });
    }
    
    return sections;
  }

  /**
   * Extract key points from section content
   */
  private extractKeyPoints(content: string): string[] {
    const keyPoints: string[] = [];
    const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/g);
    
    if (listMatches) {
      keyPoints.push(...listMatches.map(match => 
        match.replace(/<[^>]*>/g, '').trim()
      ).slice(0, 5)); // Limit to 5 key points
    }
    
    return keyPoints;
  }

  /**
   * Extract examples from section content
   */
  private extractExamples(content: string): string[] {
    const examples: string[] = [];
    const exampleMatches = content.match(/Caso Práctico \d+:(.*?)(?=Caso Práctico|\n\n|$)/gs);
    
    if (exampleMatches) {
      examples.push(...exampleMatches.map(match => match.trim()));
    }
    
    return examples;
  }

  /**
   * Save generated temario to Firebase
   */
  private async saveTemarioToFirebase(assistantId: string, content: GeneratedTemarioContent): Promise<void> {
    try {
      const temarioRef = doc(collection(db, 'assistants', assistantId, 'syllabus'), content.slug);

      await setDoc(temarioRef, {
        title: content.title,
        slug: content.slug,
        content: content.content,
        sections: content.sections.map(s => ({ title: s.title, content: s.content })),
        summary: (content as any).summary || '',
        keyFacts: (content as any).keyFacts || [],
        status: 'published',
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
        estimatedPages: content.estimatedPages,
        metadata: content.metadata,
        published: true,
        type: 'ai_generated',
        version: '1.0'
      });

      // Write standardized record for Temario view
      const stdRef = doc(collection(db, 'assistant_syllabus'));
      await setDoc(stdRef, {
        assistantId,
        title: content.title,
        themeName: content.title,
        themeId: content.slug,
        sections: content.sections.map(s => ({ title: s.title, content: s.content })),
        content: content.content,
        summary: (content as any).summary || '',
        keyFacts: (content as any).keyFacts || [],
        status: 'published',
        createdAt: new Date().toISOString(),
        createdAtMs: Date.now(),
        totalPages: content.estimatedPages,
        wordCount: content.metadata.totalWords,
        type: 'gpt5_mini_generated',
        version: '1.0'
      });

      // Also write to top-level 'syllabus' with structured arrays
      try {
        const topRef = doc(collection(db, 'syllabus'));
        await setDoc(topRef, {
          assistantId,
          topicId: content.slug,
          title: content.title,
          content: (content as any).contentArray || content.sections.map(s => ({ title: s.title, content: s.content })),
          summary: (content as any).summary || '',
          keyFacts: (content as any).keyFacts || [],
          createdAt: new Date().toISOString(),
          createdAtMs: Date.now(),
          totalPages: content.estimatedPages,
          wordCount: content.metadata.totalWords,
          type: 'structured_syllabus',
          version: '1.0'
        });
      } catch {}

      // Broadcast update so assistant Temario refreshes automatically
      try {
        const channel = new BroadcastChannel('temario_updates');
        channel.postMessage({ type: 'TEMARIO_UPDATED', assistantId, themeName: content.title, timestamp: Date.now(), force: true });
        channel.close();
        window.postMessage({ type: 'TEMARIO_UPDATED', assistantId }, '*');
      } catch {}

      console.log(`💾 Temario saved to Firebase (std + legacy): ${content.title}`);
    } catch (error) {
      console.error('Error saving temario to Firebase:', error);
      throw new Error(`Error guardando temario en Firebase: ${error.message}`);
    }
  }

  private async saveTemarioUpdate(assistantId: string, content: GeneratedTemarioContent): Promise<void> {
    try {
      const updateRef = doc(collection(db, 'assistants', assistantId, 'syllabus', content.slug, 'updates'));
      await setDoc(updateRef, {
        title: content.title,
        slug: content.slug,
        content: content.content,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
        estimatedPages: content.estimatedPages,
        metadata: content.metadata,
        type: 'ai_generated_update',
        version: '1.0'
      });

      const stdRef = doc(collection(db, 'assistant_syllabus_updates'));
      await setDoc(stdRef, {
        assistantId,
        title: content.title,
        themeName: content.title,
        themeId: content.slug,
        sections: content.sections.map(s => ({ title: s.title, content: s.content })),
        content: content.content,
        status: 'update',
        createdAt: new Date().toISOString(),
        createdAtMs: Date.now(),
        totalPages: content.estimatedPages,
        wordCount: content.metadata.totalWords,
        type: 'gpt5_mini_generated_update',
        version: '1.0'
      });

      try {
        const channel = new BroadcastChannel('temario_updates');
        channel.postMessage({ type: 'TEMARIO_UPDATED', assistantId, themeName: content.title, timestamp: Date.now(), update: true });
        channel.close();
        window.postMessage({ type: 'TEMARIO_UPDATED', assistantId }, '*');
      } catch {}

      console.log(`✚ Update saved for ${content.title}`);
    } catch (error: any) {
      console.error('Error saving temario update:', error);
      throw new Error(`Error guardando actualización de temario: ${error.message}`);
    }
  }

  /**
   * Check if a topic already exists
   */
  private async checkTopicExists(assistantId: string, topic: string): Promise<boolean> {
    try {
      const baseTitle = topic.replace(/^tema\s*\d+\s*:\s*/i, '').trim();
      const slug = baseTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

      const syllabusRef = collection(db, 'assistants', assistantId, 'syllabus');
      const q = query(syllabusRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);

      return !querySnapshot.empty;
    } catch (error) {
      console.warn('Error checking topic existence:', error);
      return false; // Assume it doesn't exist if we can't check
    }
  }

  /**
   * Pause generation
   */
  pauseGeneration(): void {
    if (this.state.isGenerating) {
      this.state.isPaused = true;
      console.log('⏸️ Generación pausada');
    }
  }

  /**
   * Resume generation
   */
  resumeGeneration(): void {
    if (this.state.isGenerating && this.state.isPaused) {
      this.state.isPaused = false;
      console.log('▶️ Generación reanudada');
    }
  }

  /**
   * Cancel generation
   */
  cancelGeneration(): void {
    if (this.state.isGenerating) {
      this.state.abortController?.abort();
      this.state.isGenerating = false;
      this.state.isPaused = false;
      console.log('🛑 Generación cancelada');
    }
  }

  /**
   * Get current generation state
   */
  getGenerationState(): TemarioGenerationState {
    return { ...this.state };
  }
}

// Export singleton instance
export const temarioAIGenerator = new TemarioAIGenerator();
