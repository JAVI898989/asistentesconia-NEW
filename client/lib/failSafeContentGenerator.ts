import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { testFlashcardGenerator } from "./testFlashcardGenerator";
import { pdfGenerationService } from "./pdfGenerationService";

// 12 Guardia Civil topics as defined
const GUARDIA_CIVIL_TOPICS = [
  {
    slug: "procedimiento-penal-policia-judicial",
    title: "Procedimiento penal y Policía Judicial",
    order: 1,
    summary: "LECrim: atestado, detención, entrada/registro, cadena de custodia",
    legalFramework: ["LECrim", "CP"],
    keyAreas: ["atestado", "detención", "entrada y registro", "cadena de custodia"]
  },
  {
    slug: "seguridad-ciudadana-lo-4-2015",
    title: "LO 4/2015 Seguridad Ciudadana",
    order: 2,
    summary: "Identificación, registros, actas, régimen sancionador",
    legalFramework: ["LO 4/2015"],
    keyAreas: ["identificación", "registros", "actas", "régimen sancionador"]
  },
  {
    slug: "seguridad-vial",
    title: "Seguridad vial",
    order: 3,
    summary: "Alcoholemia/drogas, permiso por puntos, atestados/accidentes",
    legalFramework: ["RDL 6/2015", "RD 1428/2003"],
    keyAreas: ["alcoholemia", "drogas", "permiso por puntos", "atestados de tráfico"]
  },
  {
    slug: "armas-explosivos",
    title: "Armas y Explosivos",
    order: 4,
    summary: "RD 137/1993: clasificación, licencias/guías, intervención, depósito y destrucción",
    legalFramework: ["RD 137/1993"],
    keyAreas: ["clasificación de armas", "licencias", "guías", "intervención"]
  },
  {
    slug: "extranjeria",
    title: "Extranjería",
    order: 5,
    summary: "LO 4/2000; RD 557/2011: situaciones, infracciones, expulsión/devolución, actuaciones GC",
    legalFramework: ["LO 4/2000", "RD 557/2011"],
    keyAreas: ["situaciones de extranjería", "infracciones", "expulsión", "devolución"]
  },
  {
    slug: "proteccion-civil",
    title: "Protección Civil",
    order: 6,
    summary: "Ley 17/2015: planes, activación, mando y coordinación operativa",
    legalFramework: ["Ley 17/2015"],
    keyAreas: ["planes de protección civil", "activación", "mando único"]
  },
  {
    slug: "derechos-fundamentales",
    title: "Derechos fundamentales, CE y LO 2/1986",
    order: 7,
    summary: "Principios, uso proporcional de la fuerza, responsabilidad",
    legalFramework: ["Constitución Española", "LO 2/1986"],
    keyAreas: ["derechos fundamentales", "principios de actuación", "uso proporcional de la fuerza"]
  },
  {
    slug: "violencia-genero",
    title: "Violencia de género",
    order: 8,
    summary: "LO 1/2004: diligencias, valoración de riesgo, VioGén",
    legalFramework: ["LO 1/2004"],
    keyAreas: ["diligencias", "valoración de riesgo", "sistema VioGén"]
  },
  {
    slug: "trafico-drogas",
    title: "Tráfico de drogas",
    order: 9,
    summary: "CP art. 368-378: tipos penales, investigación, decomiso",
    legalFramework: ["CP"],
    keyAreas: ["tipos penales", "investigación", "decomiso", "sustancias controladas"]
  },
  {
    slug: "organizacion-regimen-disciplinario",
    title: "Organización y régimen disciplinario",
    order: 10,
    summary: "LO 2/1986: estructura, jerarquía, faltas y sanciones",
    legalFramework: ["LO 2/1986"],
    keyAreas: ["estructura orgánica", "jerarquía", "faltas disciplinarias", "sanciones"]
  },
  {
    slug: "primeros-auxilios",
    title: "Primeros auxilios",
    order: 11,
    summary: "Técnicas básicas de emergencia, RCP, atención inicial",
    legalFramework: ["Protocolos sanitarios"],
    keyAreas: ["técnicas de emergencia", "RCP", "atención inicial", "protocolos"]
  },
  {
    slug: "medio-ambiente-seprona",
    title: "Medio ambiente y SEPRONA",
    order: 12,
    summary: "Delitos ambientales, protección natural, SEPRONA",
    legalFramework: ["CP", "Ley 42/2007"],
    keyAreas: ["delitos ambientales", "protección natural", "SEPRONA", "espacios protegidos"]
  }
];

export interface TopicGenerationProgress {
  order: number;
  slug: string;
  title: string;
  status: 'pending' | 'generating-mdx' | 'mdx-done' | 'generating-tests' | 'tests-done' | 
          'generating-flashcards' | 'flashcards-done' | 'generating-pdf' | 'completed' | 'error';
  mdxGenerated: boolean;
  testsCount: number;
  flashcardsCount: number;
  pdfGenerated: boolean;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface GenerationResult {
  success: boolean;
  topics: TopicGenerationProgress[];
  totalProcessed: number;
  totalSuccessful: number;
  totalErrors: number;
  duration: number;
  errors: string[];
}

export interface ProgressCallback {
  (progress: TopicGenerationProgress[]): void;
}

class FailSafeContentGenerator {
  private readonly MIN_WORDS = 2800;
  private readonly EXACT_TESTS = 20;
  private readonly MIN_FLASHCARDS = 45;

  /**
   * Main fail-safe content generation flow
   */
  async generateGuardiaCivilSyllabus(
    assistantId: string,
    onProgress?: ProgressCallback
  ): Promise<GenerationResult> {
    const startTime = Date.now();
    console.log(`🚀 Starting fail-safe Guardia Civil syllabus generation`);

    // Initialize progress tracking
    const progress: TopicGenerationProgress[] = GUARDIA_CIVIL_TOPICS.map(topic => ({
      order: topic.order,
      slug: topic.slug,
      title: topic.title,
      status: 'pending',
      mdxGenerated: false,
      testsCount: 0,
      flashcardsCount: 0,
      pdfGenerated: false
    }));

    const result: GenerationResult = {
      success: false,
      topics: progress,
      totalProcessed: 0,
      totalSuccessful: 0,
      totalErrors: 0,
      duration: 0,
      errors: []
    };

    try {
      // Process each topic with fail-safe approach
      for (let i = 0; i < GUARDIA_CIVIL_TOPICS.length; i++) {
        const topic = GUARDIA_CIVIL_TOPICS[i];
        const topicProgress = progress[i];
        
        console.log(`📝 Processing topic ${i + 1}/${GUARDIA_CIVIL_TOPICS.length}: ${topic.title}`);
        
        try {
          topicProgress.startTime = Date.now();
          topicProgress.status = 'generating-mdx';
          onProgress?.(progress);

          // Step 1: Generate and store MDX content
          const mdxContent = await this.generateTopicMDX(topic);
          
          // Step 2: Create Firestore document (ALWAYS SUCCESSFUL)
          await this.createTopicDocument(assistantId, topic, mdxContent);
          
          topicProgress.mdxGenerated = true;
          topicProgress.status = 'mdx-done';
          onProgress?.(progress);

          // Step 3: Generate Tests (fail-safe)
          topicProgress.status = 'generating-tests';
          onProgress?.(progress);
          
          try {
            const testsResult = await testFlashcardGenerator.regenerateTopicContent(
              assistantId,
              topic.slug,
              mdxContent,
              topic.title,
              { mode: 'OVERWRITE', testsToAdd: 0, flashcardsToAdd: 0, qualityGates: true }
            );
            
            topicProgress.testsCount = testsResult.testsCreated;
            topicProgress.status = 'tests-done';
          } catch (testsError) {
            console.warn(`⚠️ Tests generation failed for ${topic.title}:`, testsError);
            result.errors.push(`Tests for ${topic.title}: ${testsError.message}`);
            // Continue - don't let tests failure block the topic
          }
          
          onProgress?.(progress);

          // Step 4: Generate Flashcards (fail-safe)
          topicProgress.status = 'generating-flashcards';
          onProgress?.(progress);
          
          try {
            const flashcardsResult = await testFlashcardGenerator.regenerateTopicContent(
              assistantId,
              topic.slug,
              mdxContent,
              topic.title,
              { mode: 'OVERWRITE', testsToAdd: 0, flashcardsToAdd: this.MIN_FLASHCARDS, qualityGates: true }
            );
            
            topicProgress.flashcardsCount = flashcardsResult.flashcardsCreated;
            topicProgress.status = 'flashcards-done';
          } catch (flashcardsError) {
            console.warn(`⚠️ Flashcards generation failed for ${topic.title}:`, flashcardsError);
            result.errors.push(`Flashcards for ${topic.title}: ${flashcardsError.message}`);
            // Continue - don't let flashcards failure block the topic
          }
          
          onProgress?.(progress);

          // Step 5: Queue PDF generation (non-blocking)
          topicProgress.status = 'generating-pdf';
          onProgress?.(progress);
          
          this.queuePdfGeneration(assistantId, topic, topicProgress)
            .then(() => {
              topicProgress.pdfGenerated = true;
              onProgress?.(progress);
            })
            .catch(pdfError => {
              console.warn(`⚠️ PDF generation failed for ${topic.title}:`, pdfError);
              result.errors.push(`PDF for ${topic.title}: ${pdfError.message}`);
              // Don't block - PDF is optional
            });

          // Update final counters in Firestore
          await this.updateTopicCounters(assistantId, topic.slug, topicProgress.testsCount, topicProgress.flashcardsCount);

          topicProgress.status = 'completed';
          topicProgress.endTime = Date.now();
          result.totalSuccessful++;

        } catch (topicError) {
          console.error(`❌ Topic generation failed for ${topic.title}:`, topicError);
          topicProgress.status = 'error';
          topicProgress.error = topicError.message;
          topicProgress.endTime = Date.now();
          result.errors.push(`${topic.title}: ${topicError.message}`);
          result.totalErrors++;
        }

        result.totalProcessed++;
        onProgress?.(progress);

        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      result.success = result.totalSuccessful > 0;
      result.duration = Date.now() - startTime;

      console.log(`✅ Syllabus generation completed: ${result.totalSuccessful}/${result.totalProcessed} successful`);

    } catch (error) {
      console.error('❌ Fatal error in syllabus generation:', error);
      result.errors.push(`Fatal error: ${error.message}`);
      result.duration = Date.now() - startTime;
    }

    return result;
  }

  /**
   * Generate high-quality MDX content for a topic
   */
  private async generateTopicMDX(topic: any): Promise<string> {
    const prompt = `
Genera contenido educativo completo en formato MDX para el tema "${topic.title}" de Guardia Civil.

ESTRUCTURA OBLIGATORIA (mínimo ${this.MIN_WORDS} palabras):

# ${topic.title}

## Objetivos de aprendizaje
- Lista específica de lo que el alumno aprenderá
- Competencias que desarrollará

## Desarrollo del tema
### Marco normativo
${topic.legalFramework.map(law => `- ${law}: aspectos clave`).join('\n')}

### Conceptos fundamentales
### Procedimientos operativos
### Aspectos técnicos

## Protocolos de actuación
### Actuación básica
### Casos especiales
### Coordinación con otros cuerpos

## Casos prácticos (2-3 casos)
### Caso 1: [Título descriptivo]
**Situación:** [Descripción del escenario]
**Actuación:** [Pasos específicos]
**Normativa aplicable:** [Referencias legales]

### Caso 2: [Título descriptivo]
**Situación:** [Descripción del escenario]
**Actuación:** [Pasos específicos]
**Normativa aplicable:** [Referencias legales]

## Checklist de verificación
- [ ] Elemento 1 verificado
- [ ] Elemento 2 verificado
- [ ] Elemento 3 verificado
- [ ] Documentación completa
- [ ] Procedimiento seguido

## Glosario de términos (mínimo 25 términos)
**Término 1:** Definición precisa
**Término 2:** Definición precisa
[...continuar hasta 25+ términos]

## Referencias normativas
- Ley/RD específico (Verificar referencia)
- Jurisprudencia relevante (Verificar referencia)
- Protocolos internos (Verificar referencia)

REQUISITOS:
- Idioma: español UTF-8
- Tono: profesional y educativo
- Contenido: específico de ${topic.summary}
- Casos reales y prácticos
- Mínimo ${this.MIN_WORDS} palabras
- Incluir todas las secciones
`;

    try {
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en contenido educativo para Guardia Civil. Generas contenido de alta calidad, estructurado y completo.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from AI');
      }

      // Validate minimum word count
      const wordCount = content.split(/\s+/).length;
      if (wordCount < this.MIN_WORDS) {
        console.warn(`Content for ${topic.title} is only ${wordCount} words, below minimum ${this.MIN_WORDS}`);
      }

      return content;

    } catch (error) {
      console.error(`Error generating MDX for ${topic.title}:`, error);
      
      // Fallback content if AI fails
      return this.generateFallbackContent(topic);
    }
  }

  /**
   * Create Firestore document for the topic
   */
  private async createTopicDocument(assistantId: string, topic: any, mdxContent: string): Promise<void> {
    const topicRef = doc(db, "assistants", assistantId, "syllabus", topic.slug);
    
    const topicData = {
      title: topic.title,
      slug: topic.slug,
      order: topic.order,
      summary: topic.summary,
      status: 'published',
      source: 'gc-master',
      version: 1,
      contentMarkdown: mdxContent,
      pdfUrl: null, // Will be updated when PDF is generated
      testsCount: 0, // Will be updated after tests generation
      flashcardsCount: 0, // Will be updated after flashcards generation
      wordCount: mdxContent.split(/\s+/).length,
      legalFramework: topic.legalFramework,
      keyAreas: topic.keyAreas,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedAtMs: Date.now()
    };

    await setDoc(topicRef, topicData);
    console.log(`✅ Created Firestore document for ${topic.title}`);
  }

  /**
   * Queue PDF generation (non-blocking)
   */
  private async queuePdfGeneration(assistantId: string, topic: any, progress: TopicGenerationProgress): Promise<void> {
    try {
      console.log(`📄 Queuing PDF generation for ${topic.title}`);
      
      const result = await pdfGenerationService.generatePdfOnPublish({
        assistantId,
        topicSlug: topic.slug,
        title: topic.title,
        currentVersion: 0
      });

      if (result.success) {
        console.log(`✅ PDF generated for ${topic.title}: ${result.pdfUrl}`);
        progress.pdfGenerated = true;
      } else {
        throw new Error(result.error || 'PDF generation failed');
      }

    } catch (error) {
      // PDF failure is non-critical
      console.warn(`⚠️ PDF generation failed for ${topic.title}, but topic remains published:`, error);
      throw error; // Re-throw for logging but don't block main flow
    }
  }

  /**
   * Update topic counters in Firestore
   */
  private async updateTopicCounters(assistantId: string, slug: string, testsCount: number, flashcardsCount: number): Promise<void> {
    try {
      const topicRef = doc(db, "assistants", assistantId, "syllabus", slug);
      await updateDoc(topicRef, {
        testsCount,
        flashcardsCount,
        updatedAt: serverTimestamp(),
        updatedAtMs: Date.now()
      });
      
      console.log(`📊 Updated counters for ${slug}: ${testsCount} tests, ${flashcardsCount} flashcards`);
    } catch (error) {
      console.error(`Error updating counters for ${slug}:`, error);
      // Non-critical error, don't fail the process
    }
  }

  /**
   * Generate fallback content when AI fails
   */
  private generateFallbackContent(topic: any): string {
    return `# ${topic.title}

## Resumen
${topic.summary}

## Marco normativo
${topic.legalFramework.map(law => `- ${law}`).join('\n')}

## Áreas clave
${topic.keyAreas.map(area => `- ${area}`).join('\n')}

## Desarrollo del tema
Este contenido será ampliado en futuras actualizaciones. El tema cubre los aspectos fundamentales de ${topic.title} según la normativa vigente.

### Procedimientos básicos
Los procedimientos estándar para este tema incluyen la aplicación de la normativa correspondiente y la coordinación con otros servicios cuando sea necesario.

### Consideraciones especiales
Se tendrán en cuenta las particularidades del caso y las circunstancias específicas de cada situación.

## Referencias
- ${topic.legalFramework.join('\n- ')}
- Protocolos internos de actuación

*Nota: Este es contenido de reserva. Se recomienda actualizar con contenido más específico.*
`;
  }

  /**
   * Get current generation status for all topics
   */
  async getGenerationStatus(assistantId: string): Promise<{ [slug: string]: any }> {
    try {
      const syllabusRef = collection(db, "assistants", assistantId, "syllabus");
      const snapshot = await getDocs(syllabusRef);
      
      const status: { [slug: string]: any } = {};
      
      snapshot.forEach(doc => {
        status[doc.id] = {
          ...doc.data(),
          id: doc.id
        };
      });

      return status;
    } catch (error) {
      console.error('Error getting generation status:', error);
      return {};
    }
  }
}

// Export singleton instance
export const failSafeContentGenerator = new FailSafeContentGenerator();
export default failSafeContentGenerator;
