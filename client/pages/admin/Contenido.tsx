import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import {
  BookOpen,
  FileText,
  RefreshCw,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Target,
  Zap,
  FileCheck,
  Clock,
  Users,
  Activity,
  PlayCircle,
  ListChecks,
  Sparkles,
  ChevronRight,
  BarChart3,
  Calendar,
  ExternalLink,
  FileSpreadsheet,
  Home,
  Info,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useGuardiaCivilSyllabus } from "@/hooks/useGuardiaCivilSyllabus";
import { guardiaCivilPerfectGenerator } from "@/lib/guardiaCivilPerfectGenerator";
import { GuardiaCivilContentFixer } from "@/lib/guardiaCivilContentFixer";
import {
  testFlashcardAdvancedGenerator,
  type GenerationProgress,
  type GenerationResult
} from "@/lib/testFlashcardAdvancedGenerator";
import { pdfGenerationService } from "@/lib/pdfGenerationService";
import {
  unifiedContentManager,
  type UnifiedGenerationProgress,
  type ContentGenerationResult,
  type TopicContentResult
} from "@/lib/unifiedContentManager";
import SyllabusPdfViewer from "@/components/SyllabusPdfViewer";

interface Assistant {
  id: string;
  name: string;
  slug: string;
  category: string;
}

const getAllAssistants = (): Assistant[] => [
  {
    id: "guardia-civil",
    name: "Guardia Civil",
    slug: "guardia-civil",
    category: "seguridad",
  },
  {
    id: "policia-nacional",
    name: "Policía Nacional",
    slug: "policia-nacional",
    category: "seguridad",
  },
  {
    id: "auxiliar-administrativo",
    name: "Auxiliar Administrativo",
    slug: "auxiliar-administrativo",
    category: "administracion",
  },
  {
    id: "auxilio-judicial",
    name: "Auxilio Judicial",
    slug: "auxilio-judicial",
    category: "justicia",
  },
  {
    id: "tramitacion-procesal",
    name: "Tramitación Procesal",
    slug: "tramitacion-procesal",
    category: "justicia",
  },
];

type Mode = "OVERWRITE" | "ADD";

interface ActionResult {
  success: boolean;
  message: string;
  topicSlug?: string;
  testsCreated?: number;
  flashcardsCreated?: number;
  pdfUrl?: string;
  version?: number;
  timestamp: number;
}

interface GenerationState {
  isActive: boolean;
  currentAction: string;
  progress: number;
  logs: string[];
  results: ActionResult[];
}

interface TopicLogEntry {
  timestamp: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

interface TopicLogs {
  [topicSlug: string]: TopicLogEntry[];
}

export default function ContenidoAdmin() {
  const [assistants] = useState<Assistant[]>(getAllAssistants());
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [mode, setMode] = useState<Mode>("ADD");
  const [testsToAdd, setTestsToAdd] = useState(10);
  const [flashcardsToAdd, setFlashcardsToAdd] = useState(50);

  // Generation state
  const [generationState, setGenerationState] = useState<GenerationState>({
    isActive: false,
    currentAction: "",
    progress: 0,
    logs: [],
    results: []
  });

  // Topic logs for drawer
  const [topicLogs, setTopicLogs] = useState<TopicLogs>({});
  const [selectedTopicForLogs, setSelectedTopicForLogs] = useState<string | null>(null);

  // PDF viewer state
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDFTopic, setSelectedPDFTopic] = useState<any>(null);

  // Load syllabus data
  const {
    syllabi,
    loading: syllabusLoading,
    error: syllabusError,
    statistics,
    refresh: refreshSyllabus,
  } = useGuardiaCivilSyllabus(selectedAssistant?.id || null);

  // Auto-select first assistant
  useEffect(() => {
    if (assistants.length > 0 && !selectedAssistant) {
      setSelectedAssistant(assistants[0]);
    }
  }, [assistants, selectedAssistant]);

  // Utility functions
  const addLog = (message: string, topicSlug?: string) => {
    const timestamp = Date.now();
    const logEntry = `${new Date().toLocaleTimeString()}: ${message}`;

    setGenerationState(prev => ({
      ...prev,
      logs: [...prev.logs, logEntry]
    }));

    // Add to topic-specific logs if specified
    if (topicSlug) {
      setTopicLogs(prev => ({
        ...prev,
        [topicSlug]: [
          ...(prev[topicSlug] || []),
          {
            timestamp,
            type: message.includes('❌') ? 'error' :
                  message.includes('⚠️') ? 'warning' :
                  message.includes('✅') ? 'success' : 'info',
            message,
          }
        ]
      }));
    }
  };

  const clearLogs = () => {
    setGenerationState(prev => ({ ...prev, logs: [], results: [] }));
    setTopicLogs({});
  };

  const startGeneration = (action: string) => {
    setGenerationState({
      isActive: true,
      currentAction: action,
      progress: 0,
      logs: [],
      results: []
    });
    clearLogs();
  };

  const endGeneration = () => {
    setGenerationState(prev => ({
      ...prev,
      isActive: false,
      currentAction: "Completado",
      progress: 100,
    }));
  };

  const updateProgress = (progress: number) => {
    setGenerationState(prev => ({ ...prev, progress }));
  };

  // Admin action: Create Temario
  const handleCreateTemario = async () => {
    if (!selectedAssistant) {
      toast({
        title: "Error",
        description: "Selecciona un asistente primero",
        variant: "destructive",
      });
      return;
    }

    startGeneration("Creando Temario");
    addLog(`📚 Iniciando creación de temario para ${selectedAssistant.name}`);

    try {
      updateProgress(10);

      if (selectedAssistant.id === "guardia-civil") {
        // Use specialized Guardia Civil generator
        const temarioResult = await guardiaCivilPerfectGenerator.generateCompleteSyllabus(
          selectedAssistant.id,
          (topic: string, progress: number, total: number) => {
            const overallProgress = 10 + (progress / total) * 80;
            updateProgress(overallProgress);
            addLog(`📝 Generando: ${topic} (${progress}/${total})`);
          }
        );

        if (!temarioResult.success) {
          throw new Error(`Error en temario: ${temarioResult.errors?.join(', ')}`);
        }

        addLog(`✅ Temario completo: ${temarioResult.topicsGenerated} temas extensos generados`);
      } else {
        // Use unified content manager for other assistants
        const result = await unifiedContentManager.generateCompleteContent(
          selectedAssistant.id,
          (progress) => {
            if (progress.step === 'temario') {
              const overallProgress = 10 + ((progress.processedTopics || 0) / (progress.totalTopics || 1)) * 80;
              updateProgress(overallProgress);
              addLog(`📝 Generando tema ${progress.processedTopics}/${progress.totalTopics}`);
            }
          }
        );

        addLog(`✅ Temario completo: ${result.summary.topicsGenerated} temas generados`);
      }

      updateProgress(100);
      await refreshSyllabus();

      toast({
        title: "Temario creado",
        description: `Temario completo generado para ${selectedAssistant.name}`,
      });

    } catch (error) {
      console.error("Error creando temario:", error);
      addLog(`❌ Error: ${error.message}`);

      toast({
        title: "Error creando temario",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  // Admin action: Create Tests
  const handleCreateTests = async () => {
    if (!selectedAssistant) {
      toast({
        title: "Error",
        description: "Selecciona un asistente primero",
        variant: "destructive",
      });
      return;
    }

    const testsCount = selectedAssistant.id === "guardia-civil" ? 5 : 20;
    startGeneration("Creando Tests");
    addLog(`🎯 Iniciando creación de tests para ${selectedAssistant.name} (${testsCount} por tema)`);

    try {
      const result = await unifiedContentManager.generateAllTests(
        selectedAssistant.id,
        'OVERWRITE',
        testsCount,
        (progress) => {
          const overallProgress = (progress.testsCreated || 0) / (progress.totalTopics || 1) / testsCount * 100;
          updateProgress(overallProgress);
          addLog(`🎯 Tests creados: ${progress.testsCreated}`);
        }
      );

      addLog(`✅ Tests generados: ${result.successful} temas con ${testsCount} tests cada uno`);
      updateProgress(100);

      await refreshSyllabus();

      toast({
        title: "Tests creados",
        description: `${result.successful * testsCount} tests generados para ${selectedAssistant.name}`,
      });

    } catch (error) {
      console.error("Error creando tests:", error);
      addLog(`❌ Error: ${error.message}`);

      toast({
        title: "Error creando tests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  // Admin action: Create Flashcards
  const handleCreateFlashcards = async () => {
    if (!selectedAssistant) {
      toast({
        title: "Error",
        description: "Selecciona un asistente primero",
        variant: "destructive",
      });
      return;
    }

    const flashcardsCount = selectedAssistant.id === "guardia-civil" ? 40 : 45;
    startGeneration("Creando Flashcards");
    addLog(`💳 Iniciando creación de flashcards para ${selectedAssistant.name} (${flashcardsCount} por tema)`);

    try {
      const result = await unifiedContentManager.generateAllFlashcards(
        selectedAssistant.id,
        'OVERWRITE',
        flashcardsCount,
        (progress) => {
          const overallProgress = (progress.flashcardsCreated || 0) / (progress.totalTopics || 1) / flashcardsCount * 100;
          updateProgress(overallProgress);
          addLog(`💳 Flashcards creadas: ${progress.flashcardsCreated}`);
        }
      );

      addLog(`✅ Flashcards generadas: ${result.successful} temas con ${flashcardsCount} flashcards cada una`);
      updateProgress(100);

      await refreshSyllabus();

      toast({
        title: "Flashcards creadas",
        description: `${result.successful * flashcardsCount} flashcards generadas para ${selectedAssistant.name}`,
      });

    } catch (error) {
      console.error("Error creando flashcards:", error);
      addLog(`❌ Error: ${error.message}`);

      toast({
        title: "Error creando flashcards",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  // Comprehensive content generation (for Guardia Civil)
  const handleGenerateCompleteGuardiaCivil = async () => {
    if (!selectedAssistant || selectedAssistant.id !== "guardia-civil") {
      toast({
        title: "Error",
        description: "Esta función es específica para Guardia Civil",
        variant: "destructive",
      });
      return;
    }

    startGeneration("Generando contenido completo de Guardia Civil");
    addLog("🎖️ Iniciando generación completa de contenido para Guardia Civil");

    try {
      // Temario completo (12 temas extensos y profesionales)
      addLog("📚 Paso 1: Generando temario completo (12 temas extensos)");
      updateProgress(10);

      const temarioResult = await guardiaCivilPerfectGenerator.generateCompleteSyllabus(
        selectedAssistant.id,
        (topic: string, progress: number, total: number) => {
          const overallProgress = 10 + (progress / total) * 40;
          updateProgress(overallProgress);
          addLog(`📝 Generando: ${topic} (${progress}/${total})`);
        }
      );

      if (!temarioResult.success) {
        throw new Error(`Error en temario: ${temarioResult.errors?.join(', ')}`);
      }

      addLog(`✅ Temario completo: ${temarioResult.topicsGenerated} temas extensos generados`);
      updateProgress(50);

      // Tests especializados (5 por tema)
      addLog("🎯 Paso 2: Generando tests especializados (5 por tema)");

      const testResult = await unifiedContentManager.generateAllTests(
        selectedAssistant.id,
        'OVERWRITE',
        5
      );

      addLog(`✅ Tests generados: ${testResult.successful} temas con 5 tests cada uno`);
      updateProgress(70);

      // Flashcards profesionales (40 por tema)
      addLog("💳 Paso 3: Generando flashcards profesionales (40 por tema)");

      const flashcardResult = await unifiedContentManager.generateAllFlashcards(
        selectedAssistant.id,
        'OVERWRITE',
        40
      );

      addLog(`✅ Flashcards generadas: ${flashcardResult.successful} temas con 40 flashcards cada uno`);
      updateProgress(85);

      // PDFs visuales (sin descarga)
      addLog("📄 Paso 4: Generando PDFs para visualización");

      try {
        const pdfResult = await unifiedContentManager.generateAllPDFs(selectedAssistant.id, false);
        addLog(`✅ PDFs generados: ${pdfResult.successful}/${pdfResult.processed} PDFs para visualización`);
      } catch (pdfError) {
        addLog(`⚠️ PDFs: ${pdfError.message} (no crítico - contenido disponible en MDX)`);
      }

      updateProgress(100);
      addLog("🎉 ¡Contenido completo de Guardia Civil generado exitosamente!");

      // Refresh data
      await refreshSyllabus();

      toast({
        title: "Contenido completo generado",
        description: `Guardia Civil: ${temarioResult.topicsGenerated} temas + ${testResult.successful * 5} tests + ${flashcardResult.successful * 40} flashcards`,
      });

    } catch (error) {
      console.error("Error en generación completa GC:", error);
      addLog(`❌ Error: ${error.message}`);

      toast({
        title: "Error en generación",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  // Generation handlers
  const handleGenerateEverything = async () => {
    if (!selectedAssistant) return;

    startGeneration("Generando TODO (Temario + PDF + Tests + Flashcards)");
    addLog("🚀 Iniciando generación completa del asistente");

    try {
      const result = await unifiedContentManager.generateCompleteContent(
        selectedAssistant.id,
        (progress: UnifiedGenerationProgress) => {
          // Update progress based on step
          let progressPercentage = 0;
          switch (progress.step) {
            case 'temario':
              progressPercentage = (progress.processedTopics || 0) / (progress.totalTopics || 1) * 30;
              break;
            case 'tests':
              progressPercentage = 30 + ((progress.testsCreated || 0) + (progress.flashcardsCreated || 0)) / 100 * 50;
              break;
            case 'pdf':
              progressPercentage = 80 + (progress.pdfsGenerated || 0) / (progress.totalTopics || 1) * 15;
              break;
            case 'completed':
              progressPercentage = 100;
              break;
          }

          updateProgress(Math.min(progressPercentage, 100));

          // Add new logs
          progress.logs.forEach(log => {
            if (!generationState.logs.includes(log)) {
              addLog(log, progress.currentTopic);
            }
          });
        }
      );

      // Show final results
      const { summary } = result;
      addLog(`🎉 Generación completada: ${summary.topicsGenerated} temas, ${summary.testsCreated} tests, ${summary.flashcardsCreated} flashcards, ${summary.pdfsGenerated} PDFs`);

      // Refresh data and show success
      await refreshSyllabus();

      toast({
        title: "Generación completada",
        description: `${summary.topicsGenerated} temas + ${summary.testsCreated} tests + ${summary.flashcardsCreated} flashcards + ${summary.pdfsGenerated} PDFs`,
      });

    } catch (error) {
      console.error("Error en generación completa:", error);
      addLog(`❌ Error: ${error.message}`);

      toast({
        title: "Error en generación",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  // Base package handlers (5 tests, 45+ flashcards)
  const handleCreateBasePackage = async (topicSlug: string) => {
    if (!selectedAssistant) return;

    const topic = syllabi.find(s => s.slug === topicSlug);
    if (!topic) return;

    startGeneration(`Creando paquete base: ${topic.title}`);
    addLog(`📦 Creando paquete base para: ${topic.title} (5 tests + ≥45 flashcards)`, topicSlug);

    try {
      const result = await unifiedContentManager.generateTopicContent(
        selectedAssistant.id,
        topicSlug,
        {
          generateTests: true,
          generateFlashcards: true,
          generatePDF: false,
          mode: 'OVERWRITE', // Base package always overwrites
          isBasePackage: true, // Flag for base package logic
          testsCount: 5,
          flashcardsCount: 45
        },
        (progress: UnifiedGenerationProgress) => {
          updateProgress(((progress.testsCreated || 0) / 5 + (progress.flashcardsCreated || 0) / 45) * 50);
          progress.logs.forEach(log => {
            if (!generationState.logs.includes(log)) {
              addLog(`  ${log}`, topicSlug);
            }
          });
        }
      );

      addLog(`✅ Paquete base creado: ${topic.title} (${result.testsCreated} tests + ${result.flashcardsCreated} flashcards)`, topicSlug);

      await refreshSyllabus();

      toast({
        title: "Paquete base creado",
        description: `${topic.title}: ${result.testsCreated} tests + ${result.flashcardsCreated} flashcards`,
      });

    } catch (error) {
      console.error(`Error creando paquete base ${topic.title}:`, error);
      addLog(`❌ Error: ${error.message}`, topicSlug);

      toast({
        title: "Error creando paquete base",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  // Add mode handlers
  const handleAddMoreTests = async (topicSlug: string) => {
    if (!selectedAssistant) return;

    const topic = syllabi.find(s => s.slug === topicSlug);
    if (!topic) return;

    startGeneration(`Añadiendo tests: ${topic.title}`);
    addLog(`➕ Añadiendo ${testsToAdd} tests a: ${topic.title}`, topicSlug);

    try {
      const result = await unifiedContentManager.generateTopicContent(
        selectedAssistant.id,
        topicSlug,
        {
          generateTests: true,
          generateFlashcards: false,
          generatePDF: false,
          mode: 'ADD',
          testsCount: testsToAdd
        },
        (progress: UnifiedGenerationProgress) => {
          updateProgress((progress.testsCreated || 0) / testsToAdd * 100);
          progress.logs.forEach(log => {
            if (!generationState.logs.includes(log)) {
              addLog(`  ${log}`, topicSlug);
            }
          });
        }
      );

      addLog(`✅ Tests añadidos: ${topic.title} (+${result.testsCreated} tests)`, topicSlug);

      await refreshSyllabus();

      toast({
        title: "Tests añadidos",
        description: `${result.testsCreated} tests añadidos a ${topic.title}`,
      });

    } catch (error) {
      console.error(`Error añadiendo tests ${topic.title}:`, error);
      addLog(`❌ Error: ${error.message}`, topicSlug);

      toast({
        title: "Error añadiendo tests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  const handleAddMoreFlashcards = async (topicSlug: string) => {
    if (!selectedAssistant) return;

    const topic = syllabi.find(s => s.slug === topicSlug);
    if (!topic) return;

    startGeneration(`Añadiendo flashcards: ${topic.title}`);
    addLog(`➕ Añadiendo ${flashcardsToAdd} flashcards a: ${topic.title}`, topicSlug);

    try {
      const result = await unifiedContentManager.generateTopicContent(
        selectedAssistant.id,
        topicSlug,
        {
          generateTests: false,
          generateFlashcards: true,
          generatePDF: false,
          mode: 'ADD',
          flashcardsCount: flashcardsToAdd
        },
        (progress: UnifiedGenerationProgress) => {
          updateProgress((progress.flashcardsCreated || 0) / flashcardsToAdd * 100);
          progress.logs.forEach(log => {
            if (!generationState.logs.includes(log)) {
              addLog(`  ${log}`, topicSlug);
            }
          });
        }
      );

      addLog(`✅ Flashcards añadidas: ${topic.title} (+${result.flashcardsCreated} flashcards)`, topicSlug);

      await refreshSyllabus();

      toast({
        title: "Flashcards añadidas",
        description: `${result.flashcardsCreated} flashcards añadidas a ${topic.title}`,
      });

    } catch (error) {
      console.error(`Error añadiendo flashcards ${topic.title}:`, error);
      addLog(`❌ Error: ${error.message}`, topicSlug);

      toast({
        title: "Error añadiendo flashcards",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  // Individual handlers
  const handleRegenerateTemario = async (topicSlug: string) => {
    if (!selectedAssistant) return;

    const topic = syllabi.find(s => s.slug === topicSlug);
    if (!topic) return;

    startGeneration(`Regenerando temario: ${topic.title}`);
    addLog(`🔄 Regenerando temario para: ${topic.title}`, topicSlug);

    try {
      await guardiaCivilPerfectGenerator.regenerateTopic(selectedAssistant.id, topicSlug);

      addLog(`✅ Temario regenerado: ${topic.title}`, topicSlug);
      updateProgress(100);

      await refreshSyllabus();

      toast({
        title: "Temario regenerado",
        description: `${topic.title} ha sido regenerado exitosamente`,
      });

    } catch (error) {
      console.error(`Error regenerando temario ${topic.title}:`, error);
      addLog(`❌ Error: ${error.message}`, topicSlug);

      toast({
        title: "Error regenerando temario",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  const handleGenerateTopicPDF = async (topicSlug: string) => {
    if (!selectedAssistant) return;

    const topic = syllabi.find(s => s.slug === topicSlug);
    if (!topic) return;

    startGeneration(`Generando PDF: ${topic.title}`);
    addLog(`📄 Generando PDF para: ${topic.title}`, topicSlug);

    try {
      await pdfGenerationService.generateTopicPDF(selectedAssistant.id, topicSlug);

      addLog(`✅ PDF generado: ${topic.title}`, topicSlug);
      updateProgress(100);

      await refreshSyllabus();

      toast({
        title: "PDF generado",
        description: `PDF generado para ${topic.title}`,
      });

    } catch (error) {
      console.error(`Error generando PDF ${topic.title}:`, error);
      addLog(`❌ Error: ${error.message}`, topicSlug);

      toast({
        title: "Error generando PDF",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  const handleViewPDF = (topic: any) => {
    setSelectedPDFTopic(topic);
    setShowPDFViewer(true);
  };

  const getTopicStatus = (topic: any) => {
    const hasContent = topic.status === 'published';
    const hasPDF = !!topic.pdfUrl;
    const hasTests = topic.testsCount >= 5;
    const hasFlashcards = topic.flashcardsCount >= 45;

    if (hasContent && hasPDF && hasTests && hasFlashcards) {
      return { status: 'complete', label: 'Completo', color: 'bg-emerald-500', variant: 'default' as const };
    } else if (hasContent && (hasTests || hasFlashcards)) {
      return { status: 'partial', label: 'Parcial', color: 'bg-amber-500', variant: 'secondary' as const };
    } else if (hasContent) {
      return { status: 'content', label: 'Solo MDX', color: 'bg-indigo-500', variant: 'outline' as const };
    } else {
      return { status: 'empty', label: 'Pendiente', color: 'bg-slate-500', variant: 'destructive' as const };
    }
  };

  const formatLastUpdated = (timestamp: any) => {
    if (!timestamp) return "Nunca";

    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Hace menos de 1h";
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString();
  };

  // Loading state
  if (syllabusLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            <Card className="shadow-xl rounded-3xl border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-indigo-400" />
                <p className="text-slate-300 text-lg leading-relaxed">Cargando contenido del asistente...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Enhanced Header */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 text-sm font-medium text-slate-400 tracking-normal">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span>Asistentes</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Contenido</span>
            </div>

            {/* Main Header */}
            <Card className="shadow-xl rounded-3xl border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-white flex items-center gap-4 leading-relaxed">
                      <BookOpen className="w-8 h-8 text-indigo-400" />
                      Gestión de Contenido por Asistente
                    </CardTitle>
                    <p className="text-slate-400 text-lg leading-relaxed tracking-normal">
                      Panel Administrativo · Crear Temario + Tests + Flashcards para cualquier Asistente
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Select
                      value={selectedAssistant?.id || ""}
                      onValueChange={(value) => {
                        const assistant = assistants.find(a => a.id === value);
                        setSelectedAssistant(assistant || null);
                      }}
                    >
                      <SelectTrigger className="w-64 bg-slate-700/50 border-slate-600 rounded-2xl">
                        <SelectValue placeholder="Selecciona asistente" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 rounded-2xl">
                        {assistants.map((assistant) => (
                          <SelectItem key={assistant.id} value={assistant.id} className="rounded-xl">
                            {assistant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              {selectedAssistant && (
                <CardContent className="space-y-6">
                  {/* Enhanced Status Chips */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-700/50 rounded-2xl p-4 text-center space-y-2">
                      <div className="text-2xl font-bold text-indigo-400">{statistics.total || 0}</div>
                      <div className="text-sm text-slate-300 leading-relaxed">Temas</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl p-4 text-center space-y-2">
                      <div className="text-2xl font-bold text-emerald-400">{statistics.withPdf || 0}/{statistics.total || 0}</div>
                      <div className="text-sm text-slate-300 leading-relaxed">PDFs OK</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl p-4 text-center space-y-2">
                      <div className="text-2xl font-bold text-violet-400">{statistics.totalTests || 0}</div>
                      <div className="text-sm text-slate-300 leading-relaxed">Tests totales</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl p-4 text-center space-y-2">
                      <div className="text-2xl font-bold text-amber-400">{statistics.totalFlashcards || 0}</div>
                      <div className="text-sm text-slate-300 leading-relaxed">Flashcards totales</div>
                    </div>
                  </div>

                  {/* System Status Alert */}
                  <Alert className="bg-indigo-500/10 border-indigo-500/30 rounded-2xl">
                    <Info className="h-5 w-5 text-indigo-400" />
                    <AlertDescription className="text-indigo-300 leading-relaxed">
                      <strong>Panel de Administrador:</strong> Crea contenido (temario, tests, flashcards) para cualquier asistente. Los usuarios solo ven el contenido en sus pestañas correspondientes. Para acceso directo por asistente, ve a <a href="/admin/assistants" className="underline text-indigo-200 hover:text-white">Gestión de Asistentes → 📚 Gestión de Contenido</a>.
                    </AlertDescription>
                  </Alert>

                  {/* Main Action Button */}
                  <Button
                    onClick={handleGenerateEverything}
                    disabled={generationState.isActive}
                    className="w-full h-20 text-xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-2xl rounded-3xl leading-relaxed tracking-normal"
                  >
                    <PlayCircle className="w-8 h-8 mr-4" />
                    {generationState.isActive ? generationState.currentAction : "Crear Contenido Completo"}
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Generation Progress */}
          {generationState.isActive && (
            <Card className="shadow-xl rounded-3xl border-indigo-500/30 bg-indigo-500/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-indigo-400 leading-relaxed">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Progreso de Generación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-slate-300 leading-relaxed">{generationState.currentAction}</span>
                    <span className="text-indigo-400 font-bold">{generationState.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={generationState.progress} className="h-3 rounded-xl" />
                </div>

                {generationState.logs.length > 0 && (
                  <ScrollArea className="h-40 bg-slate-900/50 rounded-2xl p-4">
                    <div className="space-y-2">
                      {generationState.logs.slice(-15).map((log, index) => (
                        <div key={index} className="text-sm font-mono text-slate-300 leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          )}

          {/* Enhanced Global Controls */}
          <Card className="shadow-xl rounded-3xl border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white leading-relaxed">
                <Settings className="w-6 h-6 text-slate-400" />
                Acciones de Administrador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed tracking-normal">
                    Como administrador, crea contenido profesional para cualquier asistente.
                    Los usuarios verán el contenido en las pestañas correspondientes del asistente.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Create Temario */}
                    <Card className="shadow-lg border-slate-600 hover:border-slate-500 transition-all duration-300 rounded-2xl bg-slate-700/30">
                      <CardContent className="p-6 text-center space-y-4">
                        <BookOpen className="w-12 h-12 mx-auto text-blue-400" />
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">Crear Temario</h3>
                          <p className="text-sm text-slate-300 mb-4">
                            Generar temario completo y extenso (mínimo 10 páginas por tema).
                            Visualmente atractivo con títulos en negrita, separación y colores.
                          </p>
                          <Button
                            onClick={handleCreateTemario}
                            disabled={generationState.isActive}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Crear Temario
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Create Tests */}
                    <Card className="shadow-lg border-slate-600 hover:border-slate-500 transition-all duration-300 rounded-2xl bg-slate-700/30">
                      <CardContent className="p-6 text-center space-y-4">
                        <ListChecks className="w-12 h-12 mx-auto text-violet-400" />
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">Crear Tests</h3>
                          <p className="text-sm text-slate-300 mb-4">
                            Generar automáticamente {selectedAssistant?.id === "guardia-civil" ? "5" : "20"} tests por tema.
                            4 opciones + 1 respuesta correcta. Sin repeticiones.
                          </p>
                          <Button
                            onClick={handleCreateTests}
                            disabled={generationState.isActive}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-2xl"
                          >
                            <ListChecks className="w-4 h-4 mr-2" />
                            Crear Tests ({selectedAssistant?.id === "guardia-civil" ? "5" : "20"} por tema)
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Create Flashcards */}
                    <Card className="shadow-lg border-slate-600 hover:border-slate-500 transition-all duration-300 rounded-2xl bg-slate-700/30">
                      <CardContent className="p-6 text-center space-y-4">
                        <Sparkles className="w-12 h-12 mx-auto text-amber-400" />
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">Crear Flashcards</h3>
                          <p className="text-sm text-slate-300 mb-4">
                            Generar {selectedAssistant?.id === "guardia-civil" ? "40" : "45"} flashcards por tema.
                            Pregunta en el frente, respuesta clara detrás. Sin repeticiones.
                          </p>
                          <Button
                            onClick={handleCreateFlashcards}
                            disabled={generationState.isActive}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-2xl"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Crear Flashcards ({selectedAssistant?.id === "guardia-civil" ? "40" : "45"} por tema)
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Special Actions */}
                  <div className="flex gap-3 mt-6">
                    {selectedAssistant?.id === "guardia-civil" && (
                      <Button
                        onClick={handleGenerateCompleteGuardiaCivil}
                        disabled={generationState.isActive}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generar TODO Guardia Civil
                      </Button>
                    )}
                    <Button
                      onClick={handleGenerateEverything}
                      disabled={generationState.isActive}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-lg"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Generar Contenido Completo
                    </Button>
                    <Button
                      onClick={() => {/* TODO: Repair PDFs */}}
                      disabled={generationState.isActive}
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/10 rounded-2xl"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Reparar PDFs
                    </Button>
                  </div>
                </div>

                {/* Add Mode Configuration */}
                <div className="bg-slate-700/30 rounded-2xl p-6 space-y-4">
                  <h4 className="font-semibold text-white leading-relaxed">Modo Añadir (sin borrar existente)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testsToAdd" className="text-sm text-slate-300">Tests a añadir</Label>
                      <Input
                        id="testsToAdd"
                        type="number"
                        value={testsToAdd}
                        onChange={(e) => setTestsToAdd(parseInt(e.target.value) || 10)}
                        min="1"
                        max="50"
                        className="bg-slate-600/50 border-slate-500 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flashcardsToAdd" className="text-sm text-slate-300">Flashcards a añadir</Label>
                      <Input
                        id="flashcardsToAdd"
                        type="number"
                        value={flashcardsToAdd}
                        onChange={(e) => setFlashcardsToAdd(parseInt(e.target.value) || 50)}
                        min="1"
                        max="100"
                        className="bg-slate-600/50 border-slate-500 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Topics Table */}
          {selectedAssistant && (
            <Card className="shadow-xl rounded-3xl border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white leading-relaxed">
                  <BarChart3 className="w-6 h-6 text-slate-400" />
                  Temas del Temario
                </CardTitle>
              </CardHeader>
              <CardContent>
                {syllabusError ? (
                  <Alert className="border-red-200 bg-red-50 rounded-2xl">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-800 leading-relaxed">
                      Error cargando datos: {syllabusError}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {syllabi.map((topic) => {
                      const status = getTopicStatus(topic);
                      return (
                        <Card key={topic.slug} className="shadow-lg border-slate-600 hover:border-slate-500 transition-all duration-300 rounded-2xl bg-slate-700/30 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {/* Topic Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="text-sm font-bold rounded-xl border-slate-500">
                                      {topic.order}
                                    </Badge>
                                    <h3 className="font-bold text-white text-xl leading-relaxed">
                                      {topic.title}
                                    </h3>
                                    <Badge className={status.color + " text-white font-medium rounded-xl"}>
                                      {status.label}
                                    </Badge>
                                  </div>

                                  {/* Enhanced Status Badges */}
                                  <div className="flex flex-wrap gap-3">
                                    <Badge
                                      variant={topic.pdfUrl ? "default" : "secondary"}
                                      className={`text-sm rounded-xl ${topic.pdfUrl ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                                    >
                                      <FileText className="w-3 h-3 mr-2" />
                                      PDF {topic.pdfUrl ? '✅' : '❌'}
                                    </Badge>
                                    <Badge
                                      variant={topic.testsCount >= 5 ? "default" : "destructive"}
                                      className={`text-sm rounded-xl ${topic.testsCount >= 5 ? 'bg-violet-500 text-white' : 'bg-red-500 text-white'}`}
                                    >
                                      <ListChecks className="w-3 h-3 mr-2" />
                                      {topic.testsCount || 0} Tests
                                    </Badge>
                                    <Badge
                                      variant={topic.flashcardsCount >= 45 ? "default" : "destructive"}
                                      className={`text-sm rounded-xl ${topic.flashcardsCount >= 45 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}
                                    >
                                      <Sparkles className="w-3 h-3 mr-2" />
                                      {topic.flashcardsCount || 0} Flashcards
                                    </Badge>
                                    <Badge variant="outline" className="text-sm rounded-xl border-slate-500 text-slate-300">
                                      <Clock className="w-3 h-3 mr-2" />
                                      v{topic.version || 1}
                                    </Badge>
                                    <Badge variant="outline" className="text-sm rounded-xl border-slate-500 text-slate-300">
                                      <Calendar className="w-3 h-3 mr-2" />
                                      {formatLastUpdated(topic.updatedAt)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Action Buttons */}
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-600">
                                {/* Temario & PDF Actions */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-slate-300 leading-relaxed">Temario & PDF</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      onClick={() => handleRegenerateTemario(topic.slug)}
                                      disabled={generationState.isActive}
                                      size="sm"
                                      variant="outline"
                                      className="border-slate-500 hover:bg-slate-600 rounded-xl text-xs"
                                    >
                                      <BookOpen className="w-3 h-3 mr-1" />
                                      Regenerar Tema (MDX)
                                    </Button>
                                    <Button
                                      onClick={() => handleGenerateTopicPDF(topic.slug)}
                                      disabled={generationState.isActive}
                                      size="sm"
                                      variant="outline"
                                      className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 rounded-xl text-xs"
                                    >
                                      <FileText className="w-3 h-3 mr-1" />
                                      Generar/Reparar PDF
                                    </Button>
                                  </div>
                                </div>

                                {/* Tests Actions */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-slate-300 leading-relaxed">Tests</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      onClick={() => handleCreateBasePackage(topic.slug)}
                                      disabled={generationState.isActive}
                                      size="sm"
                                      className="bg-violet-600 hover:bg-violet-700 rounded-xl text-xs"
                                    >
                                      <ListChecks className="w-3 h-3 mr-1" />
                                      Crear paquete base (5)
                                    </Button>
                                    <Button
                                      onClick={() => handleAddMoreTests(topic.slug)}
                                      disabled={generationState.isActive}
                                      size="sm"
                                      variant="outline"
                                      className="border-violet-500 text-violet-400 hover:bg-violet-500/10 rounded-xl text-xs"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Añadir más ({testsToAdd})
                                    </Button>
                                  </div>
                                </div>

                                {/* Flashcards Actions */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-slate-300 leading-relaxed">Flashcards</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      onClick={() => handleCreateBasePackage(topic.slug)}
                                      disabled={generationState.isActive}
                                      size="sm"
                                      className="bg-amber-600 hover:bg-amber-700 rounded-xl text-xs"
                                    >
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      Crear paquete base (≥45)
                                    </Button>
                                    <Button
                                      onClick={() => handleAddMoreFlashcards(topic.slug)}
                                      disabled={generationState.isActive}
                                      size="sm"
                                      variant="outline"
                                      className="border-amber-500 text-amber-400 hover:bg-amber-500/10 rounded-xl text-xs"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Añadir más ({flashcardsToAdd})
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* View Actions */}
                              <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                                <div className="flex gap-2">
                                  {topic.pdfUrl && (
                                    <Button
                                      onClick={() => handleViewPDF(topic)}
                                      size="sm"
                                      variant="ghost"
                                      className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl"
                                    >
                                      <BookOpen className="w-4 h-4 mr-2" />
                                      Estudiar
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() => window.open(`/assistant/${selectedAssistant.slug}/test?topic=${topic.slug}`, '_blank')}
                                    size="sm"
                                    variant="ghost"
                                    className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Ver Tests
                                  </Button>
                                  <Button
                                    onClick={() => window.open(`/assistant/${selectedAssistant.slug}/flashcards?topic=${topic.slug}`, '_blank')}
                                    size="sm"
                                    variant="ghost"
                                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Ver Flashcards
                                  </Button>
                                </div>

                                {/* Logs Drawer */}
                                <Drawer>
                                  <DrawerTrigger asChild>
                                    <Button
                                      onClick={() => setSelectedTopicForLogs(topic.slug)}
                                      size="sm"
                                      variant="ghost"
                                      className="text-slate-400 hover:text-white hover:bg-slate-600 rounded-xl"
                                    >
                                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                                      Ver Logs
                                    </Button>
                                  </DrawerTrigger>
                                  <DrawerContent className="bg-slate-900 border-slate-700 rounded-3xl">
                                    <DrawerHeader>
                                      <DrawerTitle className="text-white leading-relaxed">
                                        Logs: {topic.title}
                                      </DrawerTitle>
                                      <DrawerDescription className="leading-relaxed">
                                        Historial de creación/duplicados/errores
                                      </DrawerDescription>
                                    </DrawerHeader>
                                    <div className="p-6 max-h-96 overflow-y-auto">
                                      <ScrollArea className="h-full">
                                        {topicLogs[topic.slug]?.length ? (
                                          <div className="space-y-3">
                                            {topicLogs[topic.slug].map((log, index) => (
                                              <div
                                                key={index}
                                                className={`p-4 rounded-2xl text-sm font-mono leading-relaxed ${
                                                  log.type === 'error' ? 'bg-red-900/20 text-red-300 border border-red-800/30' :
                                                  log.type === 'success' ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-800/30' :
                                                  log.type === 'warning' ? 'bg-amber-900/20 text-amber-300 border border-amber-800/30' :
                                                  'bg-slate-800 text-slate-300 border border-slate-700'
                                                }`}
                                              >
                                                <div className="text-xs text-slate-400 mb-2">
                                                  {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                                {log.message}
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="text-center text-slate-400 py-12 leading-relaxed">
                                            No hay logs para este tema
                                          </div>
                                        )}
                                      </ScrollArea>
                                    </div>
                                  </DrawerContent>
                                </Drawer>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* PDF Viewer Modal */}
          {showPDFViewer && selectedPDFTopic && (
            <Dialog open={showPDFViewer} onOpenChange={setShowPDFViewer}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white leading-relaxed">{selectedPDFTopic.title}</DialogTitle>
                  <DialogDescription className="leading-relaxed">
                    Visualizador de PDF - Versión {selectedPDFTopic.version || 1}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <SyllabusPdfViewer
                    pdfUrl={selectedPDFTopic.pdfUrl}
                    version={selectedPDFTopic.version}
                    title={selectedPDFTopic.title}
                    onRegeneratePdf={() => pdfGenerationService.generateTopicPDF(selectedAssistant?.id || '', selectedPDFTopic.slug)}
                    isAdmin={true}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
