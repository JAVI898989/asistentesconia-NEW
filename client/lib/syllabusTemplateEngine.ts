import { safeFetch } from "./fullStoryBypass";

export interface SyllabusTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  variables: {
    CORPUS_NORMATIVO: string[];
    ESTILO_EXAMEN: string;
    ROL: string;
    AMBITO_ACTUACION?: string;
    COMPETENCIAS_BASICAS?: string[];
  };
  bloques: SyllabusBlock[];
  seccionesEstandar: string[];
  formatoSalida: {
    pdf: {
      paginas_minimas: number;
      paginas_maximas: number;
      fuente: string;
      encoding: string;
      sin_cortes_pagina: boolean;
    };
    tests: {
      cantidad_minima: number;
      con_explicacion: boolean;
      dificultad_graduada: boolean;
    };
    flashcards: {
      cantidad_minima: number;
      incluir_casos: boolean;
    };
    glosario: {
      terminos_minimos: number;
      definiciones_completas: boolean;
    };
  };
}

export interface SyllabusBlock {
  slug: string;
  titulo: string;
  orden: number;
  requisitos: string[];
  normativa_principal: string[];
  horas_estimadas: number;
  complejidad: "baja" | "media" | "alta";
}

export interface SyllabusAdapter {
  id: string;
  name: string;
  description: string;
  version: string;
  ROL_DESTINO: string;
  AMBITO_DESTINO: string;
  REMAP_NORMATIVA: Record<string, string | null>;
  REMAP_BLOQUES: Record<string, string>;
  BLOQUES_DESTINO: Record<string, SyllabusBlock>;
  ESTILO_EXAMEN_DESTINO: string;
  REGLAS_REESCRITURA: {
    min_rewrite_ratio: number;
    cambios_obligatorios: string[];
    mantener_estructura: string[];
    ejemplos_contexto: string[];
  };
  COMPETENCIAS_DESTINO: string[];
}

export interface AdaptedSyllabus {
  assistantId: string;
  templateId: string;
  adapterId: string | null;
  bloques: AdaptedBlock[];
  variables: any;
  metadata: {
    generatedAt: string;
    totalHours: number;
    totalBlocks: number;
    rewriteRatio: number;
  };
}

export interface AdaptedBlock {
  slug: string;
  titulo: string;
  orden: number;
  originalSlug?: string;
  contentMarkdown: string;
  metadata: {
    horas_estimadas: number;
    complejidad: string;
    normativa_principal: string[];
    requisitos: string[];
  };
}

class SyllabusTemplateEngine {
  private templates: Map<string, SyllabusTemplate> = new Map();
  private adapters: Map<string, SyllabusAdapter> = new Map();

  async loadTemplate(templateId: string): Promise<SyllabusTemplate> {
    if (this.templates.has(templateId)) {
      return this.templates.get(templateId)!;
    }

    try {
      const templatePath = `/templates/syllabus/${templateId}.json`;
      console.log(`🔍 Loading template from: ${templatePath}`);

      const response = await fetch(templatePath);
      console.log(`📡 Template response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Template request failed:`, { status: response.status, errorText });
        throw new Error(`Template not found: ${templateId} (${response.status})`);
      }

      const responseText = await response.text();
      console.log(`📄 Template response length: ${responseText.length}, starts with: ${responseText.substring(0, 50)}`);

      // Check if response is HTML (error page)
      if (responseText.trim().startsWith('<!') || responseText.trim().startsWith('<html')) {
        console.error(`❌ Received HTML instead of JSON for template: ${templateId}`);
        throw new Error(`Template file not accessible: ${templateId}`);
      }

      const template: SyllabusTemplate = JSON.parse(responseText);
      console.log(`✅ Template loaded successfully: ${template.name}`);

      this.templates.set(templateId, template);
      return template;
    } catch (error) {
      console.error(`Error loading template ${templateId}:`, error);
      throw new Error(`Failed to load template: ${templateId} - ${error.message}`);
    }
  }

  async loadAdapter(adapterId: string): Promise<SyllabusAdapter> {
    if (this.adapters.has(adapterId)) {
      return this.adapters.get(adapterId)!;
    }

    try {
      const adapterPath = `/templates/adapters/${adapterId}.json`;
      console.log(`🔍 Loading adapter from: ${adapterPath}`);

      const response = await fetch(adapterPath);
      console.log(`📡 Adapter response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Adapter request failed:`, { status: response.status, errorText });
        throw new Error(`Adapter not found: ${adapterId} (${response.status})`);
      }

      const responseText = await response.text();
      console.log(`📄 Adapter response length: ${responseText.length}, starts with: ${responseText.substring(0, 50)}`);

      // Check if response is HTML (error page)
      if (responseText.trim().startsWith('<!') || responseText.trim().startsWith('<html')) {
        console.error(`❌ Received HTML instead of JSON for adapter: ${adapterId}`);
        throw new Error(`Adapter file not accessible: ${adapterId}`);
      }

      const adapter: SyllabusAdapter = JSON.parse(responseText);
      console.log(`✅ Adapter loaded successfully: ${adapter.name}`);

      this.adapters.set(adapterId, adapter);
      return adapter;
    } catch (error) {
      console.error(`Error loading adapter ${adapterId}:`, error);
      throw new Error(`Failed to load adapter: ${adapterId} - ${error.message}`);
    }
  }

  async generateAdaptedSyllabus(
    assistantId: string,
    templateId: string,
    adapterId?: string,
    onProgress?: (step: string, progress: number) => void
  ): Promise<AdaptedSyllabus> {
    try {
      onProgress?.("Cargando plantilla maestra...", 10);
      const template = await this.loadTemplate(templateId);

      let adapter: SyllabusAdapter | null = null;
      if (adapterId) {
        onProgress?.("Cargando adaptador...", 20);
        adapter = await this.loadAdapter(adapterId);
      }

      onProgress?.("Procesando bloques...", 30);
      const adaptedBlocks: AdaptedBlock[] = [];

      for (let i = 0; i < template.bloques.length; i++) {
        const block = template.bloques[i];
        const progress = 30 + (i / template.bloques.length) * 50;

        onProgress?.(`Procesando bloque: ${block.titulo}...`, progress);

        const adaptedBlock = await this.adaptBlock(
          block,
          template,
          adapter,
          assistantId
        );

        if (adaptedBlock) {
          adaptedBlocks.push(adaptedBlock);
        }
      }

      // Calculate metadata
      const totalHours = adaptedBlocks.reduce((sum, block) => sum + block.metadata.horas_estimadas, 0);
      const rewriteRatio = adapter ? adapter.REGLAS_REESCRITURA.min_rewrite_ratio : 0;

      onProgress?.("Finalizando generación...", 95);

      const adaptedSyllabus: AdaptedSyllabus = {
        assistantId,
        templateId,
        adapterId: adapterId || null,
        bloques: adaptedBlocks.sort((a, b) => a.orden - b.orden),
        variables: {
          ...template.variables,
          ...(adapter ? {
            ROL: adapter.ROL_DESTINO,
            AMBITO_ACTUACION: adapter.AMBITO_DESTINO,
            ESTILO_EXAMEN: adapter.ESTILO_EXAMEN_DESTINO,
            COMPETENCIAS_BASICAS: adapter.COMPETENCIAS_DESTINO
          } : {})
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          totalHours,
          totalBlocks: adaptedBlocks.length,
          rewriteRatio
        }
      };

      onProgress?.("Generación completada", 100);
      return adaptedSyllabus;

    } catch (error) {
      console.error("Error generating adapted syllabus:", error);
      throw error;
    }
  }

  private async adaptBlock(
    originalBlock: SyllabusBlock,
    template: SyllabusTemplate,
    adapter: SyllabusAdapter | null,
    assistantId: string
  ): Promise<AdaptedBlock | null> {
    try {
      // If no adapter, use original block
      if (!adapter) {
        const content = await this.generateBlockContent(originalBlock, template, null, assistantId);
        return {
          slug: originalBlock.slug,
          titulo: originalBlock.titulo,
          orden: originalBlock.orden,
          contentMarkdown: content,
          metadata: {
            horas_estimadas: originalBlock.horas_estimadas,
            complejidad: originalBlock.complejidad,
            normativa_principal: originalBlock.normativa_principal,
            requisitos: originalBlock.requisitos
          }
        };
      }

      // Check if block should be omitted
      const mappedSlug = adapter.REMAP_BLOQUES[originalBlock.slug];
      if (mappedSlug === null) {
        return null; // Omit this block
      }

      // Get destination block definition
      const destinationBlock = adapter.BLOQUES_DESTINO[mappedSlug];
      if (!destinationBlock) {
        console.warn(`Destination block not found: ${mappedSlug}`);
        return null;
      }

      // Generate adapted content
      const content = await this.generateBlockContent(destinationBlock, template, adapter, assistantId);

      return {
        slug: mappedSlug,
        titulo: destinationBlock.titulo,
        orden: destinationBlock.orden || originalBlock.orden,
        originalSlug: originalBlock.slug,
        contentMarkdown: content,
        metadata: {
          horas_estimadas: destinationBlock.horas_estimadas,
          complejidad: destinationBlock.complejidad,
          normativa_principal: destinationBlock.normativa_principal,
          requisitos: destinationBlock.requisitos
        }
      };

    } catch (error) {
      console.error(`Error adapting block ${originalBlock.slug}:`, error);
      throw error;
    }
  }

  private async generateBlockContent(
    block: SyllabusBlock,
    template: SyllabusTemplate,
    adapter: SyllabusAdapter | null,
    assistantId: string
  ): Promise<string> {
    const isAdapted = !!adapter;
    const contextRole = adapter ? adapter.ROL_DESTINO : template.variables.ROL;
    const contextNormativa = adapter ?
      this.adaptNormativa(template.variables.CORPUS_NORMATIVO, adapter) :
      template.variables.CORPUS_NORMATIVO;

    const prompt = this.buildContentPrompt(block, template, adapter, contextRole, contextNormativa);

    try {
      console.log(`🤖 Generating content for block: ${block.titulo}`);
      const response = await safeFetch("/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          assistantType: "Syllabus Generator",
          contextPrompt: this.buildContextPrompt(contextRole, isAdapted),
          history: [],
          model: "gpt-4o",
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        // Fallback to gpt-4o-mini
        const fallbackResponse = await safeFetch("/api/openai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: prompt,
            assistantType: "Syllabus Generator",
            contextPrompt: this.buildContextPrompt(contextRole, isAdapted),
            history: [],
            model: "gpt-4o-mini",
            temperature: 0.3,
          }),
        });

        if (!fallbackResponse.ok) {
          throw new Error(`Error en la API de OpenAI: ${fallbackResponse.status}`);
        }

        const fallbackData = await fallbackResponse.json();
        return fallbackData.message;
      }

      const data = await response.json();
      return data.message;

    } catch (error) {
      console.error("Error generating block content:", error);
      throw new Error(`Error al generar contenido para: ${block.titulo}`);
    }
  }

  private adaptNormativa(originalNormativa: string[], adapter: SyllabusAdapter): string[] {
    const adapted: string[] = [];

    // Add transformed normativa
    for (const norma of originalNormativa) {
      const mapped = adapter.REMAP_NORMATIVA[norma];
      if (mapped === "mantener") {
        adapted.push(norma);
      } else if (mapped && mapped !== null) {
        adapted.push(mapped);
      }
      // If null or undefined, omit
    }

    // Add new normativa
    for (const [norma, action] of Object.entries(adapter.REMAP_NORMATIVA)) {
      if (action === "añadir") {
        adapted.push(norma);
      }
    }

    return adapted;
  }

  private buildContentPrompt(
    block: SyllabusBlock,
    template: SyllabusTemplate,
    adapter: SyllabusAdapter | null,
    contextRole: string,
    contextNormativa: string[]
  ): string {
    const isAdapted = !!adapter;
    const ejemplosContexto = adapter?.REGLAS_REESCRITURA.ejemplos_contexto || [];

    return `Genera un temario completo y extenso en Markdown para el tema: "${block.titulo}"

CONTEXTO DEL ROL: ${contextRole}
NORMATIVA APLICABLE: ${contextNormativa.join(", ")}
REQUISITOS DEL TEMA: ${block.requisitos.join(", ")}
COMPLEJIDAD: ${block.complejidad}
HORAS ESTIMADAS: ${block.horas_estimadas}

${isAdapted ? `
ADAPTACIÓN REQUERIDA:
- Mínimo ${adapter!.REGLAS_REESCRITURA.min_rewrite_ratio * 100}% de reescritura
- Cambios obligatorios: ${adapter!.REGLAS_REESCRITURA.cambios_obligatorios.join(", ")}
- Ejemplos específicos del contexto: ${ejemplosContexto.join(", ")}
- Ámbito de actuación: ${adapter!.AMBITO_DESTINO}
` : ''}

ESTRUCTURA OBLIGATORIA (asegurar ${template.formatoSalida.pdf.paginas_minimas}-${template.formatoSalida.pdf.paginas_maximas} páginas en PDF):

# ${block.titulo}

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
Referencias legales y normativas aplicables: ${contextNormativa.join(", ")}

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

[Repetir para ${template.formatoSalida.tests.cantidad_minima} preguntas]

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
[Mínimo ${template.formatoSalida.glosario.terminos_minimos} términos]

## 11. Referencias y Normativa Aplicable

### Normativa Principal
${contextNormativa.map(norma => `- ${norma}: Descripción y aplicabilidad`).join('\n')}

### Bibliografía Recomendada
- [Libro/Artículo 1]
- [Libro/Artículo 2]

### Enlaces de Interés
- [Recurso online 1]
- [Recurso online 2]

---

REQUISITOS IMPORTANTES:
- Contenido en español con tildes y ñ correctas
- Mínimo ${template.formatoSalida.pdf.paginas_minimas}-${template.formatoSalida.pdf.paginas_maximas} páginas cuando se convierta a PDF
- Contenido pedagógico y profesional
- Sin caracteres raros ni repeticiones inútiles
- Títulos claros y estructura lógica
- Contenido extenso y detallado en cada sección
${isAdapted ? `- Adaptado específicamente para: ${contextRole}` : ''}`;
  }

  private buildContextPrompt(contextRole: string, isAdapted: boolean): string {
    return `Eres un generador de temarios educativos especializado en contenido académico de alta calidad para ${contextRole}.
${isAdapted ? 'Tu especialidad es adaptar contenidos base a contextos específicos, manteniendo la calidad académica pero cambiando ejemplos, casos prácticos y enfoques según el ámbito profesional de destino.' : ''}
Generas contenido extenso, detallado y pedagógico para estudiantes y profesionales.
Tu objetivo es crear temarios completos que sirvan como material de estudio comprehensivo.
Siempre adaptas los ejemplos y casos prácticos al contexto profesional específico.`;
  }

  async getAvailableTemplates(): Promise<string[]> {
    return ["GC-Master"]; // In a real implementation, this would scan the templates directory
  }

  async getAvailableAdapters(): Promise<string[]> {
    return ["aux-admin-estado", "policia-local"]; // In a real implementation, this would scan the adapters directory
  }
}

export const syllabusTemplateEngine = new SyllabusTemplateEngine();
