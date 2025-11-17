import { useState, useEffect } from "react";
import { 
  syllabusTemplateEngine,
  type SyllabusTemplate,
  type SyllabusAdapter 
} from "@/lib/syllabusTemplateEngine";
import { 
  syllabusGenerator,
  type SyllabusGenerationOptions,
  type SyllabusGenerationResult 
} from "@/lib/syllabusGenerator";

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
}

export interface AdapterInfo {
  id: string;
  name: string;
  description: string;
}

// Hook for available templates and adapters
export function useSyllabusTemplates() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [adapters, setAdapters] = useState<AdapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplatesAndAdapters = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load available templates
        const templateIds = await syllabusTemplateEngine.getAvailableTemplates();
        const templatePromises = templateIds.map(async (id) => {
          try {
            const template = await syllabusTemplateEngine.loadTemplate(id);
            return {
              id: template.id,
              name: template.name,
              description: template.description
            };
          } catch (error) {
            console.warn(`Failed to load template ${id}:`, error);
            return null;
          }
        });

        const loadedTemplates = (await Promise.all(templatePromises))
          .filter((t): t is TemplateInfo => t !== null);

        // Load available adapters
        const adapterIds = await syllabusTemplateEngine.getAvailableAdapters();
        const adapterPromises = adapterIds.map(async (id) => {
          try {
            const adapter = await syllabusTemplateEngine.loadAdapter(id);
            return {
              id: adapter.id,
              name: adapter.name,
              description: adapter.description
            };
          } catch (error) {
            console.warn(`Failed to load adapter ${id}:`, error);
            return null;
          }
        });

        const loadedAdapters = (await Promise.all(adapterPromises))
          .filter((a): a is AdapterInfo => a !== null);

        setTemplates(loadedTemplates);
        setAdapters(loadedAdapters);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading templates");
      } finally {
        setLoading(false);
      }
    };

    loadTemplatesAndAdapters();
  }, []);

  return {
    templates,
    adapters,
    loading,
    error,
  };
}

// Hook for template details
export function useSyllabusTemplate(templateId: string | null) {
  const [template, setTemplate] = useState<SyllabusTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setTemplate(null);
      setLoading(false);
      return;
    }

    const loadTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedTemplate = await syllabusTemplateEngine.loadTemplate(templateId);
        setTemplate(loadedTemplate);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading template");
        setTemplate(null);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  return {
    template,
    loading,
    error,
  };
}

// Hook for adapter details
export function useSyllabusAdapter(adapterId: string | null) {
  const [adapter, setAdapter] = useState<SyllabusAdapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!adapterId) {
      setAdapter(null);
      setLoading(false);
      return;
    }

    const loadAdapter = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedAdapter = await syllabusTemplateEngine.loadAdapter(adapterId);
        setAdapter(loadedAdapter);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading adapter");
        setAdapter(null);
      } finally {
        setLoading(false);
      }
    };

    loadAdapter();
  }, [adapterId]);

  return {
    adapter,
    loading,
    error,
  };
}

// Hook for syllabus generation
export function useSyllabusGeneration() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [result, setResult] = useState<SyllabusGenerationResult | null>(null);

  const generateSyllabus = async (options: SyllabusGenerationOptions) => {
    try {
      setGenerating(true);
      setProgress(0);
      setCurrentStep("Iniciando...");
      setResult(null);

      const generationResult = await syllabusGenerator.generateTemplateSyllabus({
        ...options,
        onProgress: (step, progressValue) => {
          setCurrentStep(step);
          setProgress(progressValue);
        }
      });

      setResult(generationResult);
      return generationResult;

    } catch (error) {
      console.error("Error in syllabus generation:", error);
      const errorResult: SyllabusGenerationResult = {
        success: false,
        syllabusIds: [],
        errors: [error instanceof Error ? error.message : "Error desconocido"],
        adaptedSyllabus: null as any,
        statistics: {
          totalBlocks: 0,
          successfulBlocks: 0,
          failedBlocks: 0,
          totalHours: 0,
          pdfsGenerated: 0
        }
      };
      setResult(errorResult);
      return errorResult;
    } finally {
      setGenerating(false);
    }
  };

  const regenerateTests = async (assistantId: string, syllabusId: string) => {
    try {
      setCurrentStep("Regenerando tests...");
      await syllabusGenerator.regenerateTests(assistantId, syllabusId);
      setCurrentStep("Tests regenerados correctamente");
    } catch (error) {
      console.error("Error regenerating tests:", error);
      throw error;
    }
  };

  const regenerateFlashcards = async (assistantId: string, syllabusId: string) => {
    try {
      setCurrentStep("Regenerando flashcards...");
      await syllabusGenerator.regenerateFlashcards(assistantId, syllabusId);
      setCurrentStep("Flashcards regeneradas correctamente");
    } catch (error) {
      console.error("Error regenerating flashcards:", error);
      throw error;
    }
  };

  const cleanGenericSyllabi = async (assistantId: string) => {
    try {
      setCurrentStep("Limpiando temarios genéricos...");
      const cleaned = await syllabusGenerator.cleanGenericSyllabi(assistantId);
      setCurrentStep(`${cleaned} temarios genéricos eliminados`);
      return cleaned;
    } catch (error) {
      console.error("Error cleaning generic syllabi:", error);
      throw error;
    }
  };

  return {
    generating,
    progress,
    currentStep,
    result,
    generateSyllabus,
    regenerateTests,
    regenerateFlashcards,
    cleanGenericSyllabi,
  };
}

// Hook for template preview
export function useTemplatePreview(templateId: string | null, adapterId: string | null) {
  const [preview, setPreview] = useState<{
    blocks: Array<{
      slug: string;
      titulo: string;
      originalSlug?: string;
      isOmitted: boolean;
      isAdapted: boolean;
    }>;
    variables: any;
    statistics: {
      totalBlocks: number;
      adaptedBlocks: number;
      omittedBlocks: number;
      totalHours: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setPreview(null);
      return;
    }

    const generatePreview = async () => {
      try {
        setLoading(true);
        setError(null);

        const template = await syllabusTemplateEngine.loadTemplate(templateId);
        let adapter: SyllabusAdapter | null = null;

        if (adapterId) {
          adapter = await syllabusTemplateEngine.loadAdapter(adapterId);
        }

        // Generate preview without content
        const blocks = template.bloques.map(block => {
          if (!adapter) {
            return {
              slug: block.slug,
              titulo: block.titulo,
              isOmitted: false,
              isAdapted: false
            };
          }

          const mappedSlug = adapter.REMAP_BLOQUES[block.slug];
          if (mappedSlug === null) {
            return {
              slug: block.slug,
              titulo: block.titulo,
              originalSlug: block.slug,
              isOmitted: true,
              isAdapted: false
            };
          }

          const destinationBlock = adapter.BLOQUES_DESTINO[mappedSlug];
          return {
            slug: mappedSlug,
            titulo: destinationBlock?.titulo || block.titulo,
            originalSlug: block.slug,
            isOmitted: false,
            isAdapted: true
          };
        });

        const activeBlocks = blocks.filter(b => !b.isOmitted);
        const totalHours = activeBlocks.reduce((sum, block) => {
          if (!adapter) {
            const originalBlock = template.bloques.find(b => b.slug === block.slug);
            return sum + (originalBlock?.horas_estimadas || 0);
          }
          const destinationBlock = adapter.BLOQUES_DESTINO[block.slug];
          return sum + (destinationBlock?.horas_estimadas || 0);
        }, 0);

        setPreview({
          blocks,
          variables: {
            ...template.variables,
            ...(adapter ? {
              ROL: adapter.ROL_DESTINO,
              AMBITO_ACTUACION: adapter.AMBITO_DESTINO,
              ESTILO_EXAMEN: adapter.ESTILO_EXAMEN_DESTINO
            } : {})
          },
          statistics: {
            totalBlocks: template.bloques.length,
            adaptedBlocks: blocks.filter(b => b.isAdapted).length,
            omittedBlocks: blocks.filter(b => b.isOmitted).length,
            totalHours
          }
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : "Error generating preview");
        setPreview(null);
      } finally {
        setLoading(false);
      }
    };

    generatePreview();
  }, [templateId, adapterId]);

  return {
    preview,
    loading,
    error,
  };
}
