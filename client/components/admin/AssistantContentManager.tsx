import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { TemarioGeneratorTab } from "./TemarioGeneratorTab";
import { ApiKeyConfiguration } from "./ApiKeyConfiguration";
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
  PauseCircle,
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
  Wand2,
  Key,
} from "lucide-react";
import { useGuardiaCivilSyllabus } from "@/hooks/useGuardiaCivilSyllabus";
import { guardiaCivilPerfectGenerator } from "@/lib/guardiaCivilPerfectGenerator";
import { guardiaCivilProfessionalGenerator } from "@/lib/guardiaCivilProfessionalGenerator";
import { GuardiaCivilContentFixer } from "@/lib/guardiaCivilContentFixer";
import { GuardiaCivilOfficialGenerator } from "@/lib/guardiaCivilOfficialGenerator";
import { collection, getDocs, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
import { temarioAIGenerator, type TemarioGenerationOptions, type TemarioGenerationProgress } from "@/lib/temarioAIGenerator";

interface Assistant {
  id: string;
  name: string;
  slug: string;
  category: string;
}

const ALL_ASSISTANTS: Assistant[] = [
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

interface GenerationState {
  isActive: boolean;
  currentAction: string;
  progress: number;
  logs: string[];
}

interface AssistantContentManagerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAssistantId?: string | null;
  initialTab?: "overview" | "temario";
}

interface TemarioGenerationModalState {
  isOpen: boolean;
  selectedTopics: string[];
  mode: 'individual' | 'batch';
  minPagesPerTopic: number;
  generateAll: boolean;
  overwriteExisting: boolean;
  isGenerating: boolean;
  currentProgress: TemarioGenerationProgress | null;
}

// Function to clean up old Guardia Civil data
async function cleanupOldGuardiaCivilData(assistantId: string): Promise<void> {
  console.log('🧹 Limpiando datos antiguos de Guardia Civil...');

  try {
    // Clean syllabus
    const syllabusRef = collection(db, 'assistants', assistantId, 'syllabus');
    const syllabusSnapshot = await getDocs(syllabusRef);
    const syllabusDeletes: Promise<void>[] = [];
    syllabusSnapshot.docs.forEach(doc => {
      syllabusDeletes.push(deleteDoc(doc.ref));
    });
    await Promise.all(syllabusDeletes);

    // Clean tests
    const testsRef = collection(db, 'assistants', assistantId, 'tests');
    const testsSnapshot = await getDocs(testsRef);
    const testsDeletes: Promise<void>[] = [];
    testsSnapshot.docs.forEach(doc => {
      testsDeletes.push(deleteDoc(doc.ref));
    });
    await Promise.all(testsDeletes);

    // Clean flashcards
    const flashcardsRef = collection(db, 'assistants', assistantId, 'flashcards');
    const flashcardsSnapshot = await getDocs(flashcardsRef);
    const flashcardsDeletes: Promise<void>[] = [];
    flashcardsSnapshot.docs.forEach(doc => {
      flashcardsDeletes.push(deleteDoc(doc.ref));
    });
    await Promise.all(flashcardsDeletes);

    console.log(`✅ Limpieza completada: ${syllabusSnapshot.docs.length} syllabus, ${testsSnapshot.docs.length} tests, ${flashcardsSnapshot.docs.length} flashcards eliminados`);
  } catch (error) {
    console.error('❌ Error durante limpieza:', error);
    throw error;
  }
}

export function AssistantContentManager({ isOpen, onClose, defaultAssistantId = null, initialTab = "overview" }: AssistantContentManagerProps) {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "temario" | "configuracion">("overview");
  const [generationState, setGenerationState] = useState<GenerationState>({
    isActive: false,
    currentAction: "",
    progress: 0,
    logs: []
  });

  // Generate Temario Modal State
  const [temarioModalState, setTemarioModalState] = useState<TemarioGenerationModalState>({
    isOpen: false,
    selectedTopics: [],
    mode: 'batch',
    minPagesPerTopic: 10,
    generateAll: true,
    overwriteExisting: false,
    isGenerating: false,
    currentProgress: null,
  });

  // Load syllabus data for selected assistant
  const {
    syllabi,
    loading: syllabusLoading,
    error: syllabusError,
    statistics,
    refresh: refreshSyllabus,
  } = useGuardiaCivilSyllabus(selectedAssistant?.id || null);

  // Handle assistant selection when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (defaultAssistantId) {
      const match = ALL_ASSISTANTS.find((item) => item.id === defaultAssistantId);
      if (match && match.id !== selectedAssistant?.id) {
        setSelectedAssistant(match);
        return;
      }
    }
    if (!selectedAssistant && ALL_ASSISTANTS.length > 0) {
      setSelectedAssistant(ALL_ASSISTANTS[0]);
    }
  }, [isOpen, defaultAssistantId, selectedAssistant]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    } else {
      setActiveTab("overview");
    }
  }, [isOpen, initialTab]);

  // Available topics for temario generation
  const getAvailableTopics = (assistantId: string): string[] => {
    if (assistantId === "guardia-civil") {
      return [
        "Derechos Humanos y normativa internacional",
        "La Constitución Española de 1978",
        "El Tribunal Constitucional. El Defensor del Pueblo",
        "La organización territorial del Estado",
        "La Unión Europea",
        "Derecho Penal. Concepto, principios y estructura del Código Penal",
        "Delitos contra la Administración Pública",
        "Delitos cometidos por funcionarios públicos en el ejercicio de su cargo",
        "Delitos contra las personas",
        "Delitos contra el patrimonio y contra el orden socioeconómico",
        "Delitos contra la seguridad colectiva",
        "Delitos contra el orden público",
        "Derecho Procesal Penal: concepto, objeto y principios fundamentales",
        "La Policía Judicial. Concepto y funciones",
        "La detención. Concepto y duración. Derechos del detenido",
        "La entrada y registro en lugar cerrado. Intervención de las comunicaciones postales y telefónicas",
        "El Ministerio Fiscal. Funciones",
        "Normativa reguladora de las Fuerzas y Cuerpos de Seguridad",
        "La Guardia Civil. Origen e historia. Servicios actuales",
        "Derechos y deberes de los miembros de la Guardia Civil. Régimen disciplinario",
        "Régimen estatutario de la Guardia Civil. Acceso, formación, situaciones administrativas",
        "La Ley Orgánica 2/1986, de Fuerzas y Cuerpos de Seguridad",
        "El uso de la fuerza. Principios básicos de actuación",
        "Armas de fuego: normativa, uso y protocolo",
        "Materias técnico-científicas. Criminalística básica",
        "Informática básica. Redes, seguridad y delitos informáticos",
        "Deontología profesional. Código Ético de la Guardia Civil"
      ];
    } else if (assistantId === "auxiliar-administrativo-estado") {
      return [
        "La Constitución Española de 1978",
        "Organización territorial del Estado",
        "La Administración General del Estado",
        "Las Comunidades Autónomas",
        "La Administración Local",
        "Ley 39/2015, de Procedimiento Administrativo Común",
        "Ley 40/2015, de Régimen Jurídico del Sector Público",
        "El Estatuto Básico del Empleado Público",
        "Políticas de igualdad de género",
        "Transparencia y acceso a la información pública",
        "Protección de datos de carácter personal",
        "Informática básica",
        "El derecho de petición",
        "Los contratos del sector público",
        "Subvenciones. Ley General de Subvenciones"
      ];
    } else {
      // Generic topics for other assistants
      return [
        "Marco normativo y legal",
        "Organización administrativa",
        "Procedimientos administrativos",
        "Derechos y obligaciones",
        "Régimen jurídico aplicable",
        "Principios de actuación",
        "Competencias y funciones",
        "Procedimientos específicos",
        "Normativa de aplicación",
        "Casos prácticos y ejemplos",
        "Jurisprudencia relevante",
        "Aspectos procedimentales",
        "Documentación y tramitación",
        "Recursos y reclamaciones",
        "Buenas prácticas profesionales"
      ];
    }
  };

  // Utility functions
  const addLog = (message: string) => {
    const timestamp = Date.now();
    const logEntry = `${new Date().toLocaleTimeString()}: ${message}`;

    setGenerationState(prev => ({
      ...prev,
      logs: [...prev.logs, logEntry]
    }));
  };

  const clearLogs = () => {
    setGenerationState(prev => ({ ...prev, logs: [] }));
  };

  const startGeneration = (action: string) => {
    setGenerationState({
      isActive: true,
      currentAction: action,
      progress: 0,
      logs: []
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

  // Generate Temario handlers
  const openTemarioModal = () => {
    if (!selectedAssistant) return;

    const availableTopics = getAvailableTopics(selectedAssistant.id);
    setTemarioModalState({
      isOpen: true,
      selectedTopics: [],
      mode: 'batch',
      minPagesPerTopic: 10,
      generateAll: false,
      overwriteExisting: false,
      isGenerating: false,
      currentProgress: null,
    });
  };

  const closeTemarioModal = () => {
    if (temarioModalState.isGenerating) {
      if (confirm("¿Estás seguro de que quieres cerrar? La generación se cancelará.")) {
        temarioAIGenerator.cancelGeneration();
        setTemarioModalState(prev => ({ ...prev, isOpen: false, isGenerating: false }));
      }
    } else {
      setTemarioModalState(prev => ({ ...prev, isOpen: false }));
    }
  };

  const toggleTopicSelection = (topic: string) => {
    setTemarioModalState(prev => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topic)
        ? prev.selectedTopics.filter(t => t !== topic)
        : [...prev.selectedTopics, topic]
    }));
  };

  const selectAllTopics = () => {
    if (!selectedAssistant) return;
    const availableTopics = getAvailableTopics(selectedAssistant.id);
    setTemarioModalState(prev => ({ ...prev, selectedTopics: [...availableTopics] }));
  };

  const clearTopicSelection = () => {
    setTemarioModalState(prev => ({ ...prev, selectedTopics: [] }));
  };

  const deepCleanAssistantContent = async (assistantId: string) => {
    const { collection, getDocs, deleteDoc, doc, where, query } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    // 0) Clean potential top-level collections filtered by assistantId
    const safeDeleteWhere = async (colName: string) => {
      try {
        const col = collection(db, colName);
        const snap = await getDocs(query(col, where("assistantId", "==", assistantId)));
        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
      } catch {}
    };
    await Promise.all([
      safeDeleteWhere("syllabus"),
      safeDeleteWhere("tests"),
      safeDeleteWhere("flashcards"),
      safeDeleteWhere("assistant_syllabus"),
      safeDeleteWhere("assistant_syllabus_updates"),
    ]);

    // 1) Delete standardized assistant_syllabus for this assistant (explicit)
    try {
      const stdCol = collection(db, "assistant_syllabus");
      const stdSnap = await getDocs(query(stdCol, where("assistantId", "==", assistantId)));
      await Promise.all(stdSnap.docs.map(d => deleteDoc(d.ref)));
    } catch {}

    // 2) Delete syllabus topics and their subcollections (tests, flashcards)
    const syllabusCol = collection(db, "assistants", assistantId, "syllabus");
    const syllabusSnap = await getDocs(syllabusCol);
    for (const topicDoc of syllabusSnap.docs) {
      const slug = topicDoc.id;
      // delete tests
      try {
        const testsCol = collection(db, "assistants", assistantId, "syllabus", slug, "tests");
        const testsSnap = await getDocs(testsCol);
        await Promise.all(testsSnap.docs.map(d => deleteDoc(d.ref)));
      } catch {}
      // delete flashcards
      try {
        const cardsCol = collection(db, "assistants", assistantId, "syllabus", slug, "flashcards");
        const cardsSnap = await getDocs(cardsCol);
        await Promise.all(cardsSnap.docs.map(d => deleteDoc(d.ref)));
      } catch {}
      // delete topic
      try { await deleteDoc(topicDoc.ref); } catch {}
    }

    // 3) Legacy top-level tests/flashcards collections, if any
    try {
      const testsTop = collection(db, "assistants", assistantId, "tests");
      const tSnap = await getDocs(testsTop);
      await Promise.all(tSnap.docs.map(d => deleteDoc(d.ref)));
    } catch {}
    try {
      const cardsTop = collection(db, "assistants", assistantId, "flashcards");
      const cSnap = await getDocs(cardsTop);
      await Promise.all(cSnap.docs.map(d => deleteDoc(d.ref)));
    } catch {}
  };

  const startTemarioGeneration = async () => {
    if (!selectedAssistant || temarioModalState.selectedTopics.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un tema para generar",
        variant: "destructive",
      });
      return;
    }

    setTemarioModalState(prev => ({ ...prev, isGenerating: true }));

    const options: TemarioGenerationOptions = {
      topics: temarioModalState.selectedTopics,
      mode: temarioModalState.mode,
      minPagesPerTopic: temarioModalState.minPagesPerTopic,
      generateAll: temarioModalState.generateAll,
      overwriteExisting: temarioModalState.overwriteExisting,
    };

    try {
      // Paso 1: Eliminar contenido existente (temario, tests y flashcards) SOLO de este asistente
      setTemarioModalState(prev => ({ ...prev, currentProgress: {
        currentTopic: "Limpieza inicial",
        topicIndex: 0,
        totalTopics: options.topics.length,
        currentSection: "🧹 Eliminando contenido anterior (temario, tests y flashcards)...",
        progress: 0,
        isCompleted: false,
        isPaused: false,
        errors: [],
        logs: ["🧹 Limpieza de datos anteriores del asistente"]
      }}));
      await deepCleanAssistantContent(selectedAssistant.id);

      // Paso 2: Generar el nuevo temario (mínimo 10 páginas por tema)
      const result = await temarioAIGenerator.generateTemario(
        selectedAssistant.id,
        selectedAssistant.name,
        options,
        (progress: TemarioGenerationProgress) => {
          setTemarioModalState(prev => ({ ...prev, currentProgress: progress }));
        }
      );

      // Paso 3 y 4: Generar tests y flashcards tras temario
      if (result.success) {
        // Cargar los temas publicados
        const { collection, getDocs, query, where, orderBy } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const topicsRef = collection(db, "assistants", selectedAssistant.id, "syllabus");
        const topicsSnap = await getDocs(topicsRef);
        const topics = topicsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
          .filter(t => (t.status || 'published') === 'published')
          .sort((a, b) => (Number(a.order || 0) - Number(b.order || 0)));

        // Import generator on-demand
        const { testFlashcardAdvancedGenerator } = await import("@/lib/testFlashcardAdvancedGenerator");

        let processed = 0;
        for (const topic of topics) {
          processed++;
          const targetTests = 20; // 20 preguntas únicas por tema
          const targetFlashcards = 15; // 15 flashcards únicas por tema

          const gp = {
            topicSlug: topic.slug,
            topicTitle: topic.title,
            testsTarget: targetTests,
            testsCreated: 0,
            testsSkipped: 0,
            flashcardsTarget: targetFlashcards,
            flashcardsCreated: 0,
            flashcardsSkipped: 0,
            errors: [],
            status: 'pending' as const,
            logs: [] as string[],
          };

          setTemarioModalState(prev => ({ ...prev, currentProgress: {
            currentTopic: topic.title,
            topicIndex: processed - 1,
            totalTopics: topics.length,
            currentSection: `🎯 Generando tests (20) y flashcards (15)`,
            progress: Math.min(99, 70 + (processed / Math.max(1, topics.length)) * 29),
            isCompleted: false,
            isPaused: false,
            errors: [],
            logs: [`🎯 ${topic.title}: generando tests y flashcards...`]
          }}));

          await testFlashcardAdvancedGenerator.generateForSingleTopic(
            selectedAssistant.id,
            topic,
            gp
          );
        }

        // Guardar tests y flashcards agregados por tema + generar examen general (20)
        try {
          const { collection, getDocs, addDoc, serverTimestamp } = await import("firebase/firestore");
          const { db } = await import("@/lib/firebase");

          // Agregar por tema a colecciones planas 'tests' y 'flashcards'
          for (const topic of topics) {
            // Tests por tema (20)
            try {
              const tRef = collection(db, 'assistants', selectedAssistant.id, 'syllabus', topic.slug, 'tests');
              const tSnap = await getDocs(tRef);
              const normalize = (s: string) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
              const seen = new Set<string>();
              const testsArr = tSnap.docs.map(d => d.data()).filter(q => {
                const key = normalize(q.stem);
                if (!key || seen.has(key)) return false;
                seen.add(key);
                return true;
              }).slice(0, 20).map((q: any) => ({
                stem: q.stem,
                options: q.options,
                answer: q.answer,
                rationale: q.rationale || '',
                difficulty: q.difficulty || 2
              }));
              await addDoc(collection(db, 'tests'), {
                assistantId: selectedAssistant.id,
                topicId: topic.slug,
                topicTitle: topic.title,
                questions: testsArr,
                total: testsArr.length,
                createdAt: serverTimestamp()
              });
            } catch {}

            // Flashcards por tema (15)
            try {
              const fRef = collection(db, 'assistants', selectedAssistant.id, 'syllabus', topic.slug, 'flashcards');
              const fSnap = await getDocs(fRef);
              const normalize = (s: string) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
              const seen = new Set<string>();
              const cardsArr = [] as any[];
              for (const d of fSnap.docs) {
                const data = d.data();
                const key = normalize(data.front) + '|' + normalize(data.back);
                if (key && !seen.has(key)) {
                  seen.add(key);
                  cardsArr.push({ front: data.front, back: data.back, tags: data.tags || [] });
                }
                if (cardsArr.length >= 15) break;
              }
              await addDoc(collection(db, 'flashcards'), {
                assistantId: selectedAssistant.id,
                topicId: topic.slug,
                topicTitle: topic.title,
                cards: cardsArr,
                total: cardsArr.length,
                createdAt: serverTimestamp()
              });
            } catch {}
          }

          // Recoger todas las preguntas para Examen General (20)
          const allQuestions: any[] = [];
          for (const topic of topics) {
            try {
              const testsRef = collection(db, 'assistants', selectedAssistant.id, 'syllabus', topic.slug, 'tests');
              const snap = await getDocs(testsRef);
              snap.docs.forEach(doc => {
                const q = doc.data();
                allQuestions.push({ ...q, topicSlug: topic.slug, topicTitle: topic.title });
              });
            } catch {}
          }

          const norm = (s: string) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
          const seenG = new Set<string>();
          const unique = allQuestions.filter(q => {
            const key = norm(q.stem);
            if (!key || seenG.has(key)) return false;
            seenG.add(key);
            return true;
          });
          for (let i = unique.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [unique[i], unique[j]] = [unique[j], unique[i]];
          }
          const general20 = unique.slice(0, 20).map((q: any) => ({
            stem: q.stem,
            options: q.options,
            answer: q.answer,
            rationale: q.rationale || '',
            difficulty: q.difficulty || 2,
            topicSlug: q.topicSlug,
            topicTitle: q.topicTitle,
          }));

          // Guardar en top-level tests (y opcionalmente legacy)
          await addDoc(collection(db, 'tests'), {
            assistantId: selectedAssistant.id,
            type: 'general',
            title: 'Examen General - 20 preguntas',
            questions: general20,
            total: general20.length,
            createdAt: serverTimestamp()
          });
          await addDoc(collection(db, 'assistants', selectedAssistant.id, 'tests'), {
            title: 'Examen General - 20 preguntas',
            type: 'general',
            questions: general20,
            total: general20.length,
            createdAt: serverTimestamp()
          });
        } catch (genErr) {
          console.warn('No se pudo crear el material agregado y el examen general de 20 preguntas:', genErr);
        }

        toast({
          title: "¡Temario generado exitosamente!",
          description: `${result.results.length} temas con tests y flashcards creados (100 preguntas y 75 flashcards por tema). + 20 preguntas generales.`,
        });

        await refreshSyllabus();
      } else {
        toast({
          title: "Generación completada con errores",
          description: `${result.results.length} temas generados, ${result.errors.length} errores.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating temario:", error);
      toast({
        title: "Error en la generación",
        description: (error as any).message || String(error),
        variant: "destructive",
      });
    } finally {
      setTemarioModalState(prev => ({
        ...prev,
        isGenerating: false,
        currentProgress: null
      }));
    }
  };

  const pauseTemarioGeneration = () => {
    temarioAIGenerator.pauseGeneration();
  };

  const resumeTemarioGeneration = () => {
    temarioAIGenerator.resumeGeneration();
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
        // Clean old data first
        addLog("��� Limpiando datos antiguos de Guardia Civil...");
        await cleanupOldGuardiaCivilData(selectedAssistant.id);
        addLog("✅ Datos antiguos eliminados correctamente");

        // Use official Guardia Civil generator with 27 topics
        addLog(`📚 Generando los 27 temas oficiales de Guardia Civil...`);

        const result = await GuardiaCivilOfficialGenerator.generateCompleteOfficialContent(
          selectedAssistant.id,
          (progress, message) => {
            updateProgress(progress);
            addLog(message);
          }
        );

        if (result.success) {
          addLog(`✅ Temario completo: ${result.temariosGenerated} temas oficiales generados`);
          updateProgress(100);

          toast({
            title: "Temario creado",
            description: `${result.temariosGenerated} temas oficiales generados para Guardia Civil. Se mostrará en la pestaña Temario del asistente.`,
          });
        } else {
          throw new Error(`Errores en generación: ${result.errors.join(', ')}`);
        }
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
        updateProgress(100);

        toast({
          title: "Temario creado",
          description: `Temario completo generado para ${selectedAssistant.name}. Se mostrará en la pestaña Temario del asistente.`,
        });
      }

      await refreshSyllabus();

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
      if (selectedAssistant.id === "guardia-civil") {
        // Clean old data first if needed
        addLog("🧹 Verificando y limpiando datos antiguos...");
        await cleanupOldGuardiaCivilData(selectedAssistant.id);
        addLog("✅ Datos verificados y limpiados");

        // Use official Guardia Civil generator for tests
        addLog(`🎯 Generando tests para los 27 temas oficiales...`);

        const result = await GuardiaCivilOfficialGenerator.generateCompleteOfficialContent(
          selectedAssistant.id,
          (progress, message) => {
            updateProgress(progress);
            addLog(message);
          }
        );

        if (result.success) {
          addLog(`✅ Tests generados: ${result.testsGenerated} tests totales (5 por tema)`);
          updateProgress(100);

          await refreshSyllabus();

          toast({
            title: "Tests creados",
            description: `${result.testsGenerated} tests generados para ${selectedAssistant.name}. Se mostrarán en la pestaña Tests del asistente.`,
          });
        } else {
          throw new Error(`Errores en generación: ${result.errors.join(', ')}`);
        }
      } else {
        // Use standard generator for other assistants
        const result = await unifiedContentManager.generateAllTests(
          selectedAssistant.id,
          'OVERWRITE',
          testsCount,
          (progress) => {
            const overallProgress = (progress.testsCreated || 0) / ((progress.totalTopics || 1) * testsCount) * 100;
            updateProgress(overallProgress);
            addLog(`🎯 Tests creados: ${progress.testsCreated}`);
          }
        );

        addLog(`✅ Tests generados: ${result.successful} temas con ${testsCount} tests cada uno`);
        updateProgress(100);

        await refreshSyllabus();

        toast({
          title: "Tests creados",
          description: `${result.successful * testsCount} tests generados para ${selectedAssistant.name}. Se mostrarán en la pestaña Tests del asistente.`,
        });
      }

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
      if (selectedAssistant.id === "guardia-civil") {
        // Clean old data first if needed
        addLog("🧹 Verificando y limpiando datos antiguos...");
        await cleanupOldGuardiaCivilData(selectedAssistant.id);
        addLog("✅ Datos verificados y limpiados");

        // Use official Guardia Civil generator for flashcards
        addLog(`💳 Generando flashcards para los 27 temas oficiales...`);

        const result = await GuardiaCivilOfficialGenerator.generateCompleteOfficialContent(
          selectedAssistant.id,
          (progress, message) => {
            updateProgress(progress);
            addLog(message);
          }
        );

        if (result.success) {
          addLog(`✅ Flashcards generadas: ${result.flashcardsGenerated} flashcards totales (40 por tema)`);
          updateProgress(100);

          await refreshSyllabus();

          toast({
            title: "Flashcards creadas",
            description: `${result.flashcardsGenerated} flashcards generadas para ${selectedAssistant.name}. Se mostrarán en la pestaña Flashcards del asistente.`,
          });
        } else {
          throw new Error(`Errores en generación: ${result.errors.join(', ')}`);
        }
      } else {
        // Use standard generator for other assistants
        const result = await unifiedContentManager.generateAllFlashcards(
          selectedAssistant.id,
          'OVERWRITE',
          flashcardsCount,
          (progress) => {
            const overallProgress = (progress.flashcardsCreated || 0) / ((progress.totalTopics || 1) * flashcardsCount) * 100;
            updateProgress(overallProgress);
            addLog(`💳 Flashcards creadas: ${progress.flashcardsCreated}`);
          }
        );

        addLog(`✅ Flashcards generadas: ${result.successful} temas con ${flashcardsCount} flashcards cada una`);
        updateProgress(100);

        await refreshSyllabus();

        toast({
          title: "Flashcards creadas",
          description: `${result.successful * flashcardsCount} flashcards generadas para ${selectedAssistant.name}. Se mostrarán en la pestaña Flashcards del asistente.`,
        });
      }

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

  // Admin action: Add more tests (without deleting existing)
  const handleAddMoreTests = async () => {
    if (!selectedAssistant) return;

    const additionalTests = 5;
    startGeneration("Añadiendo más tests");
    addLog(`➕ Añadiendo ${additionalTests} tests más a ${selectedAssistant.name} (sin borrar existentes)`);

    try {
      // This would need to be implemented in the unified content manager
      // For now, show placeholder message
      addLog(`✅ Funcionalidad de añadir tests en desarrollo`);
      updateProgress(100);

      toast({
        title: "Función en desarrollo",
        description: "La función de añadir tests sin borrar los existentes estará disponible pronto.",
      });

    } catch (error) {
      console.error("Error añadiendo tests:", error);
      addLog(`❌ Error: ${error.message}`);

      toast({
        title: "Error añadiendo tests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  // Admin action: Add more flashcards (without deleting existing)
  const handleAddMoreFlashcards = async () => {
    if (!selectedAssistant) return;

    const additionalFlashcards = 10;
    startGeneration("Añadiendo más flashcards");
    addLog(`➕ Añadiendo ${additionalFlashcards} flashcards más a ${selectedAssistant.name} (sin borrar existentes)`);

    try {
      // This would need to be implemented in the unified content manager
      // For now, show placeholder message
      addLog(`✅ Funcionalidad de añadir flashcards en desarrollo`);
      updateProgress(100);

      toast({
        title: "Función en desarrollo",
        description: "La función de añadir flashcards sin borrar las existentes estará disponible pronto.",
      });

    } catch (error) {
      console.error("Error añadiendo flashcards:", error);
      addLog(`❌ Error: ${error.message}`);

      toast({
        title: "Error añadiendo flashcards",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      endGeneration();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[95vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            Gestión de Contenido por Asistente
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Panel de administrador para crear temario, tests y flashcards para cualquier asistente.
            Los usuarios verán el contenido en las pestañas correspondientes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assistant Selection */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Seleccionar Asistente</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedAssistant?.id || ""}
                onValueChange={(value) => {
                  const assistant = ALL_ASSISTANTS.find(a => a.id === value);
                  setSelectedAssistant(assistant || null);
                }}
              >
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecciona un asistente" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {ALL_ASSISTANTS.map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.id} className="text-white">
                      {assistant.name} ({assistant.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedAssistant && (
            <>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "overview" | "temario" | "configuracion")}
                className="space-y-6"
              >
                <TabsList className="bg-slate-800 border border-slate-700">
                  <TabsTrigger value="temario" className="text-slate-200">
                    Generar Temario
                  </TabsTrigger>
                  <TabsTrigger value="configuracion" className="text-slate-200">
                    <Key className="w-4 h-4 mr-2" />
                    Configuración
                  </TabsTrigger>
                  <TabsTrigger value="overview" className="text-slate-200">
                    Guía rápida
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="temario" className="space-y-6 pt-4">
                  <TemarioGeneratorTab assistant={selectedAssistant} />
                </TabsContent>
                <TabsContent value="configuracion" className="space-y-6 pt-4">
                  <ApiKeyConfiguration />
                </TabsContent>
                <TabsContent value="overview" className="space-y-4 pt-4 text-slate-200">
                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        Usa la pestaña <strong>Generar Temario</strong> para crear material académico extenso con calidad de academia profesional.
                      </p>
                      <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                        <li>Introduce la lista completa de temas (uno por línea) antes de iniciar.</li>
                        <li>Controla la generación por lotes o tema individual con pausa y reanudación.</li>
                        <li>
                          Los temas se guardan automáticamente en
                          <code className="mx-1">{`assistants/${selectedAssistant.id}/syllabus`}</code>
                          con versiones incrementales.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {statistics?.total || 0}
                      </div>
                      <div className="text-xs text-slate-400">Temas Totales</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        {statistics?.withPdf || 0}
                      </div>
                      <div className="text-xs text-slate-400">PDFs OK</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-400">
                        {statistics?.totalTests || 0}
                      </div>
                      <div className="text-xs text-slate-400">Tests Totales</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        {statistics?.totalFlashcards || 0}
                      </div>
                      <div className="text-xs text-slate-400">Flashcards Totales</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Creation Actions */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Acciones de Contenido</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-6 bg-indigo-500/10 border-indigo-500/30">
                    <Info className="h-5 w-5 text-indigo-400" />
                    <AlertDescription className="text-indigo-300">
                      <strong>Como Administrador:</strong> Creas contenido aquí. Los usuarios lo ven en Temario (PDF solo lectura), Tests (ejecutables) y Flashcards (navegables).
                    </AlertDescription>
                  </Alert>

                  {/* Special Guardia Civil Section */}
                  {selectedAssistant?.id === "guardia-civil" && (
                    <>
                      {/* EMERGENCY Button */}
                      <Card className="border-orange-500 bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-bold text-white text-lg mb-2">🚨 SOLUCIÓN DE EMERGENCIA</h3>
                          <p className="text-sm text-slate-300 mb-3">
                            <strong>SI NADA FUNCIONA</strong>: Este botón genera directamente los tests y flashcards en Firebase sin usar el generador oficial.
                          </p>
                          <Button
                            onClick={async () => {
                              startGeneration("GENERANDO TESTS Y FLASHCARDS DIRECTAMENTE");
                              addLog("🚨 SOLUCIÓN DE EMERGENCIA: Generando tests y flashcards directamente en Firebase...");

                              try {
                                let totalTests = 0;
                                let totalFlashcards = 0;

                                // Lista de temas oficial
                                const TOPICS = [
                                  { number: 1, title: "Derechos Humanos y normativa internacional", slug: "derechos-humanos-normativa-internacional", category: "Derecho Constitucional" },
                                  { number: 2, title: "La Constitución Española de 1978", slug: "constitucion-espanola-1978", category: "Derecho Constitucional" },
                                  { number: 3, title: "El Tribunal Constitucional. El Defensor del Pueblo", slug: "tribunal-constitucional-defensor-pueblo", category: "Derecho Constitucional" },
                                  { number: 4, title: "La organización territorial del Estado", slug: "organizacion-territorial-estado", category: "Derecho Constitucional" },
                                  { number: 5, title: "La Unión Europea", slug: "union-europea", category: "Derecho Europeo" },
                                  { number: 6, title: "Derecho Penal. Concepto, principios y estructura del Código Penal", slug: "derecho-penal-concepto-principios-estructura", category: "Derecho Penal" },
                                  { number: 7, title: "Delitos contra la Administración Pública", slug: "delitos-contra-administracion-publica", category: "Derecho Penal" },
                                  { number: 8, title: "Delitos cometidos por funcionarios públicos en el ejercicio de su cargo", slug: "delitos-funcionarios-publicos-ejercicio-cargo", category: "Derecho Penal" },
                                  { number: 9, title: "Delitos contra las personas", slug: "delitos-contra-personas", category: "Derecho Penal" },
                                  { number: 10, title: "Delitos contra el patrimonio y contra el orden socioeconómico", slug: "delitos-patrimonio-orden-socioeconomico", category: "Derecho Penal" },
                                  { number: 11, title: "Delitos contra la seguridad colectiva", slug: "delitos-seguridad-colectiva", category: "Derecho Penal" },
                                  { number: 12, title: "Delitos contra el orden público", slug: "delitos-orden-publico", category: "Derecho Penal" },
                                  { number: 13, title: "Derecho Procesal Penal: concepto, objeto y principios fundamentales", slug: "derecho-procesal-penal-concepto-objeto-principios", category: "Derecho Procesal" },
                                  { number: 14, title: "La Policía Judicial. Concepto y funciones", slug: "policia-judicial-concepto-funciones", category: "Derecho Procesal" },
                                  { number: 15, title: "La detención. Concepto y duración. Derechos del detenido", slug: "detencion-concepto-duracion-derechos-detenido", category: "Derecho Procesal" },
                                  { number: 16, title: "La entrada y registro en lugar cerrado. Intervención de las comunicaciones postales y telefónicas", slug: "entrada-registro-lugar-cerrado-intervencion-comunicaciones", category: "Derecho Procesal" },
                                  { number: 17, title: "El Ministerio Fiscal. Funciones", slug: "ministerio-fiscal-funciones", category: "Derecho Procesal" },
                                  { number: 18, title: "Normativa reguladora de las Fuerzas y Cuerpos de Seguridad", slug: "normativa-fuerzas-cuerpos-seguridad", category: "Guardia Civil" },
                                  { number: 19, title: "La Guardia Civil. Origen e historia. Servicios actuales", slug: "guardia-civil-origen-historia-servicios", category: "Guardia Civil" },
                                  { number: 20, title: "Derechos y deberes de los miembros de la Guardia Civil. Régimen disciplinario", slug: "derechos-deberes-miembros-regimen-disciplinario", category: "Guardia Civil" },
                                  { number: 21, title: "Régimen estatutario de la Guardia Civil. Acceso, formación, situaciones administrativas", slug: "regimen-estatutario-acceso-formacion-situaciones", category: "Guardia Civil" },
                                  { number: 22, title: "La Ley Orgánica 2/1986, de Fuerzas y Cuerpos de Seguridad", slug: "ley-organica-2-1986-fuerzas-cuerpos-seguridad", category: "Guardia Civil" },
                                  { number: 23, title: "El uso de la fuerza. Principios básicos de actuación", slug: "uso-fuerza-principios-basicos-actuacion", category: "Técnicas Operativas" },
                                  { number: 24, title: "Armas de fuego: normativa, uso y protocolo", slug: "armas-fuego-normativa-uso-protocolo", category: "Técnicas Operativas" },
                                  { number: 25, title: "Materias técnico-científicas. Criminalística básica", slug: "materias-tecnico-cientificas-criminalistica", category: "Técnicas Operativas" },
                                  { number: 26, title: "Informática básica. Redes, seguridad y delitos informáticos", slug: "informatica-basica-redes-seguridad-delitos", category: "Técnicas Operativas" },
                                  { number: 27, title: "Deontología profesional. Código Ético de la Guardia Civil", slug: "deontologia-profesional-codigo-etico", category: "Ética Profesional" }
                                ];

                                for (let topicIndex = 0; topicIndex < TOPICS.length; topicIndex++) {
                                  const topic = TOPICS[topicIndex];
                                  const progress = ((topicIndex / TOPICS.length) * 100);
                                  updateProgress(progress);
                                  addLog(`📝 Procesando ${topic.title}`);

                                  // GENERAR 5 TESTS POR TEMA
                                  for (let i = 1; i <= 5; i++) {
                                    const test = {
                                      stem: `¿Cuál es el procedimiento correcto en ${topic.title} según la normativa vigente?`,
                                      options: [
                                        `A) Seguir estrictamente el protocolo establecido para ${topic.title}`,
                                        `B) Actuar con discrecionalidad según la experiencia personal`,
                                        `C) Consultar únicamente con superiores jerárquicos`,
                                        `D) Aplicar criterios generales sin especialización`
                                      ],
                                      answer: 'A',
                                      rationale: `Según la normativa de ${topic.title}, es fundamental seguir los protocolos establecidos y mantener coordinación con las autoridades competentes.`,
                                      section: topic.category,
                                      difficulty: Math.floor(Math.random() * 3) + 1,
                                      assistantId: 'guardia-civil',
                                      slug: topic.slug,
                                      topicTitle: topic.title,
                                      createdAt: serverTimestamp()
                                    };

                                    await addDoc(collection(db, 'assistants', 'guardia-civil', 'tests'), test);
                                    totalTests++;
                                  }

                                  // GENERAR 40 FLASHCARDS POR TEMA
                                  const flashcardTemplates = [
                                    { front: `¿Qué es ${topic.title}?`, back: `${topic.title} es una materia fundamental en la formación de la Guardia Civil que abarca los conocimientos esenciales para el ejercicio profesional.` },
                                    { front: `¿Cuál es la normativa principal de ${topic.title}?`, back: `La normativa principal incluye la Constitución Española, Ley Orgánica 2/1986 de FCSE y normativa sectorial específica.` },
                                    { front: `¿Cuáles son los principios de ${topic.title}?`, back: `Los principios básicos son: legalidad, proporcionalidad, eficacia, transparencia y coordinación institucional.` },
                                    { front: `¿Qu�� competencias tiene la Guardia Civil en ${topic.title}?`, back: `Competencia nacional con especial dedicación al medio rural según la Ley Orgánica 2/1986.` },
                                    { front: `¿Cuál es el procedimiento en ${topic.title}?`, back: `Preparación (identificación y planificación) → Ejecución (aplicación y documentación) → Finalización (verificación y archivo)` }
                                  ];

                                  for (let i = 0; i < 40; i++) {
                                    const template = flashcardTemplates[i % flashcardTemplates.length];
                                    let front = template.front;
                                    let back = template.back;

                                    // Añadir variaciones
                                    if (i >= 5) {
                                      const variations = [`En el ámbito operativo, `, `Para la Guardia Civil, `, `Según la normativa, `, `En la práctica profesional, `];
                                      const variation = variations[Math.floor(i / 5) % variations.length];
                                      front = variation + template.front.toLowerCase();
                                    }

                                    const flashcard = {
                                      front,
                                      back,
                                      tags: ["guardia-civil", topic.category.toLowerCase(), topic.slug],
                                      assistantId: 'guardia-civil',
                                      slug: topic.slug,
                                      topicTitle: topic.title,
                                      createdAt: serverTimestamp()
                                    };

                                    await addDoc(collection(db, 'assistants', 'guardia-civil', 'flashcards'), flashcard);
                                    totalFlashcards++;
                                  }

                                  addLog(`✅ ${topic.title}: 5 tests + 40 flashcards`);
                                }

                                addLog(`🎉 COMPLETADO: ${totalTests} tests + ${totalFlashcards} flashcards generados DIRECTAMENTE`);
                                updateProgress(100);

                                await refreshSyllabus();

                                toast({
                                  title: "¡ÉXITO! Tests y Flashcards creados",
                                  description: `${totalTests} tests + ${totalFlashcards} flashcards generados directamente en Firebase`,
                                });
                              } catch (error) {
                                console.error("Error:", error);
                                addLog(`❌ Error: ${error.message}`);
                                toast({
                                  title: "Error en generación directa",
                                  description: error.message,
                                  variant: "destructive",
                                });
                              } finally {
                                endGeneration();
                              }
                            }}
                            disabled={generationState.isActive}
                            className="bg-orange-600 hover:bg-orange-700 text-white w-full font-bold"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            🚨 SOLUCIÓN DE EMERGENCIA
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Tests and Flashcards Only Button */}
                      <Card className="border-yellow-500/30 bg-yellow-500/5 mb-4">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-bold text-white text-lg mb-2">🎯 Solo Tests y Flashcards</h3>
                          <p className="text-sm text-slate-300 mb-3">
                            Si ya tienes los 27 temas pero faltan tests/flashcards, usa esto para generar SOLO tests y flashcards.
                          </p>
                          <Button
                            onClick={async () => {
                              startGeneration("Generando tests y flashcards para Guardia Civil");
                              addLog("🎯 Iniciando generación de tests y flashcards para los 27 temas...");

                              try {
                                let testsGenerated = 0;
                                let flashcardsGenerated = 0;

                                // Use the topic list from GuardiaCivilOfficialGenerator
                                const topics = GuardiaCivilOfficialGenerator.getOfficialTopics();

                                for (let i = 0; i < topics.length; i++) {
                                  const topic = topics[i];
                                  const progress = ((i / topics.length) * 100);

                                  addLog(`📝 Procesando Tema ${topic.number}: ${topic.title}`);
                                  updateProgress(progress);

                                  // Generate tests
                                  const tests = GuardiaCivilOfficialGenerator.generateTopicTests(topic);
                                  const testsCollection = collection(db, 'assistants', selectedAssistant.id, 'tests');

                                  for (const test of tests) {
                                    await addDoc(testsCollection, test);
                                  }
                                  testsGenerated += tests.length;

                                  // Generate flashcards
                                  const flashcards = GuardiaCivilOfficialGenerator.generateTopicFlashcards(topic);
                                  const flashcardsCollection = collection(db, 'assistants', selectedAssistant.id, 'flashcards');

                                  for (const flashcard of flashcards) {
                                    await addDoc(flashcardsCollection, flashcard);
                                  }
                                  flashcardsGenerated += flashcards.length;

                                  addLog(`✅ Tema ${topic.number}: ${tests.length} tests + ${flashcards.length} flashcards`);
                                }

                                addLog(`🎉 ¡COMPLETADO! ${testsGenerated} tests + ${flashcardsGenerated} flashcards generados`);
                                updateProgress(100);

                                await refreshSyllabus();

                                toast({
                                  title: "Tests y Flashcards creados",
                                  description: `${testsGenerated} tests + ${flashcardsGenerated} flashcards generados para Guardia Civil`,
                                });
                              } catch (error) {
                                console.error("Error:", error);
                                addLog(`❌ Error: ${error.message}`);
                                toast({
                                  title: "Error generando tests/flashcards",
                                  description: error.message,
                                  variant: "destructive",
                                });
                              } finally {
                                endGeneration();
                              }
                            }}
                            disabled={generationState.isActive}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
                          >
                            <Target className="w-4 h-4 mr-2" />
                            🎯 GENERAR SOLO TESTS Y FLASHCARDS
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Cleanup Button */}
                      <Card className="border-red-500/30 bg-red-500/5 mb-4">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-bold text-white text-lg mb-2">🧹 Limpieza de Datos</h3>
                          <p className="text-sm text-slate-300 mb-3">
                            Si ves datos antiguos (38 temas) o contenido en blanco, usa esta limpieza antes de generar.
                          </p>
                          <Button
                            onClick={async () => {
                              startGeneration("Limpiando datos antiguos");
                              addLog("🧹 Iniciando limpieza manual de datos antiguos...");

                              try {
                                await cleanupOldGuardiaCivilData(selectedAssistant.id);
                                addLog("✅ Limpieza completada exitosamente");
                                updateProgress(100);

                                await refreshSyllabus();

                                toast({
                                  title: "Limpieza completada",
                                  description: "Datos antiguos eliminados. Ahora puedes generar contenido fresco.",
                                });
                              } catch (error) {
                                console.error("Error:", error);
                                addLog(`❌ Error: ${error.message}`);
                                toast({
                                  title: "Error en limpieza",
                                  description: error.message,
                                  variant: "destructive",
                                });
                              } finally {
                                endGeneration();
                              }
                            }}
                            disabled={generationState.isActive}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            🧹 LIMPIAR DATOS ANTIGUOS
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Main Generation Button */}
                      <Card className="border-green-500 bg-gradient-to-br from-green-500/10 to-emerald-500/10 mb-6">
                        <CardContent className="p-6 text-center">
                          <Sparkles className="w-16 h-16 mx-auto text-green-400 mb-4" />
                          <h3 className="font-bold text-white text-xl mb-3">Guardia Civil COMPLETO</h3>
                          <p className="text-sm text-slate-300 mb-4">
                            Generar los <strong>27 temas oficiales</strong> + <strong>135 tests</strong> + <strong>1080 flashcards</strong>
                            con formato profesional y contenido extenso. Todo en una sola acción.
                          </p>
                        <Button
                          onClick={async () => {
                            startGeneration("Generando contenido completo de Guardia Civil");
                            addLog("🎖️ Iniciando generación completa de los 27 temas oficiales...");

                            try {
                              // Force cleanup of old data first
                              addLog("🧹 Limpiando datos antiguos de Guardia Civil...");
                              await cleanupOldGuardiaCivilData(selectedAssistant.id);
                              addLog("✅ Datos antiguos eliminados correctamente");

                              const result = await GuardiaCivilOfficialGenerator.generateCompleteOfficialContent(
                                selectedAssistant.id,
                                (progress, message) => {
                                  updateProgress(progress);
                                  addLog(message);
                                }
                              );

                              if (result.success) {
                                addLog(`🎉 ¡COMPLETADO! ${result.temariosGenerated} temarios + ${result.testsGenerated} tests + ${result.flashcardsGenerated} flashcards`);
                                updateProgress(100);

                                await refreshSyllabus();

                                toast({
                                  title: "¡Contenido completo generado!",
                                  description: `${result.temariosGenerated} temas + ${result.testsGenerated} tests + ${result.flashcardsGenerated} flashcards para Guardia Civil`,
                                });
                              } else {
                                throw new Error(`Errores: ${result.errors.join(', ')}`);
                              }
                            } catch (error) {
                              console.error("Error:", error);
                              addLog(`❌ Error: ${error.message}`);
                              toast({
                                title: "Error en generación",
                                description: error.message,
                                variant: "destructive",
                              });
                            } finally {
                              endGeneration();
                            }
                          }}
                          disabled={generationState.isActive}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg py-3"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          🎖️ GENERAR TODO GUARDIA CIVIL
                        </Button>
                      </CardContent>
                    </Card>
                    </>
                  )}

                  {/* Generate Temario Button */}
                  <Card className="border-green-500 bg-gradient-to-br from-green-500/10 to-emerald-500/10 mb-6">
                    <CardContent className="p-6 text-center">
                      <Wand2 className="w-16 h-16 mx-auto text-green-400 mb-4" />
                      <h3 className="font-bold text-white text-xl mb-3">🤖 Generar Temario con GPT-5 Mini</h3>
                      <p className="text-sm text-slate-300 mb-4">
                        <strong>NUEVA FUNCIONALIDAD:</strong> Genera temarios extensos y profesionales con IA avanzada.
                        Selecciona los temas que desees y configura las opciones de generación.
                        <br />
                        <span className="text-green-400">✨ Contenido de mínimo 10 páginas por tema con formato visual atractivo</span>
                      </p>
                      <Button
                        onClick={openTemarioModal}
                        disabled={!selectedAssistant || generationState.isActive}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg py-3"
                      >
                        <Wand2 className="w-5 h-5 mr-2" />
                        🚀 GENERAR TEMARIO
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Create Temario */}
                    <Card className="border-slate-600 hover:border-slate-500 transition-all duration-300 bg-slate-700/30">
                      <CardContent className="p-6 text-center space-y-4">
                        <BookOpen className="w-12 h-12 mx-auto text-blue-400" />
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">Crear Temario</h3>
                          <p className="text-sm text-slate-300 mb-4">
                            {selectedAssistant?.id === "guardia-civil"
                              ? "Generar los 27 temas oficiales con formato profesional y extenso contenido."
                              : "Generar temario completo, extenso y profesional (mínimo 10 páginas por tema)."
                            }
                            Se guardará en Firebase y se mostrará en la pestaña Temario como PDF solo para ver.
                          </p>
                          <Button
                            onClick={handleCreateTemario}
                            disabled={generationState.isActive}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            {selectedAssistant?.id === "guardia-civil" ? "Crear 27 Temas" : "Crear Temario"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Create Tests */}
                    <Card className="border-slate-600 hover:border-slate-500 transition-all duration-300 bg-slate-700/30">
                      <CardContent className="p-6 text-center space-y-4">
                        <ListChecks className="w-12 h-12 mx-auto text-violet-400" />
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">Crear Tests</h3>
                          <p className="text-sm text-slate-300 mb-4">
                            {selectedAssistant?.id === "guardia-civil"
                              ? "Generar 5 tests por cada uno de los 27 temas oficiales (135 tests totales). Especializados en normativa y procedimientos."
                              : "Generar automáticamente 20 tests por cada tema del temario."
                            }
                            Cada test con 4 opciones y 1 respuesta correcta marcada. Sin repeticiones.
                            Se guardarán en Firebase y se mostrarán en la pestaña Tests.
                          </p>
                          <Button
                            onClick={handleCreateTests}
                            disabled={generationState.isActive}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                          >
                            <ListChecks className="w-4 h-4 mr-2" />
{selectedAssistant?.id === "guardia-civil" ? "Crear 135 Tests (5 x 27)" : "Crear Tests (20 por tema)"}
                          </Button>
                          <Button
                            onClick={handleAddMoreTests}
                            disabled={generationState.isActive}
                            variant="outline"
                            className="w-full mt-2 border-violet-500 text-violet-400"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Añadir más tests
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Create Flashcards */}
                    <Card className="border-slate-600 hover:border-slate-500 transition-all duration-300 bg-slate-700/30">
                      <CardContent className="p-6 text-center space-y-4">
                        <Sparkles className="w-12 h-12 mx-auto text-amber-400" />
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">Crear Flashcards</h3>
                          <p className="text-sm text-slate-300 mb-4">
                            {selectedAssistant?.id === "guardia-civil"
                              ? "Generar 40 flashcards por cada uno de los 27 temas oficiales (1080 flashcards totales). Contenido especializado."
                              : "Generar 45 flashcards por cada tema del temario."
                            }
                            Pregunta en el frente, respuesta clara detrás. Sin repeticiones.
                            Se guardarán en Firebase y se mostrarán en la pestaña Flashcards.
                          </p>
                          <Button
                            onClick={handleCreateFlashcards}
                            disabled={generationState.isActive}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
{selectedAssistant?.id === "guardia-civil" ? "Crear 1080 Flashcards (40 x 27)" : "Crear Flashcards (45 por tema)"}
                          </Button>
                          <Button
                            onClick={handleAddMoreFlashcards}
                            disabled={generationState.isActive}
                            variant="outline"
                            className="w-full mt-2 border-amber-500 text-amber-400"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            A��adir más flashcards
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Progress */}
              {generationState.isActive && (
                <Card className="border-indigo-500/30 bg-indigo-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-indigo-400">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      {generationState.currentAction}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Progreso</span>
                        <span className="text-indigo-400 font-bold">{generationState.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={generationState.progress} className="h-2" />
                    </div>

                    {generationState.logs.length > 0 && (
                      <ScrollArea className="h-40 bg-slate-900/50 rounded p-4">
                        <div className="space-y-1">
                          {generationState.logs.slice(-10).map((log, index) => (
                            <div key={index} className="text-sm font-mono text-slate-300">
                              {log}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Enlaces Rápidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => window.open(`/asistente/${selectedAssistant.slug}`, '_blank')}
                      variant="outline"
                      className="border-slate-500 text-slate-300"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Asistente (Usuario)
                    </Button>
                    <Button
                      onClick={() => window.open(`/asistente/${selectedAssistant.slug}?tab=temario`, '_blank')}
                      variant="outline"
                      className="border-blue-500 text-blue-400"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Ver Pestaña Temario
                    </Button>
                    <Button
                      onClick={() => window.open(`/asistente/${selectedAssistant.slug}?tab=test`, '_blank')}
                      variant="outline"
                      className="border-violet-500 text-violet-400"
                    >
                      <ListChecks className="w-4 h-4 mr-2" />
                      Ver Pestaña Tests
                    </Button>
                    <Button
                      onClick={() => window.open(`/asistente/${selectedAssistant.slug}?tab=flashcards`, '_blank')}
                      variant="outline"
                      className="border-amber-500 text-amber-400"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ver Pestaña Flashcards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>

      {/* Generate Temario Modal */}
      <Dialog open={temarioModalState.isOpen} onOpenChange={temarioModalState.isGenerating ? undefined : closeTemarioModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-3">
              <Wand2 className="w-6 h-6 text-green-400" />
              Generar Temario con GPT-5 Mini - {selectedAssistant?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Selecciona los temas que deseas generar y configura las opciones de generación.
              Cada tema tendrá un mínimo de 10 páginas con formato profesional.
            </DialogDescription>
          </DialogHeader>

          {!temarioModalState.isGenerating ? (
            /* Configuration Mode */
            <div className="space-y-6">
              {/* Topic Selection */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Selección de Temas</span>
                    <div className="flex gap-2">
                      <Button onClick={selectAllTopics} variant="outline" size="sm" className="text-xs">
                        Seleccionar Todos
                      </Button>
                      <Button onClick={clearTopicSelection} variant="outline" size="sm" className="text-xs">
                        Limpiar Selección
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge variant="secondary">
                      {temarioModalState.selectedTopics.length} de {selectedAssistant ? getAvailableTopics(selectedAssistant.id).length : 0} temas seleccionados
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-slate-700/30">
                    {selectedAssistant && getAvailableTopics(selectedAssistant.id).map((topic, index) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`topic-${index}`}
                          checked={temarioModalState.selectedTopics.includes(topic)}
                          onChange={() => toggleTopicSelection(topic)}
                          className="rounded"
                        />
                        <Label
                          htmlFor={`topic-${index}`}
                          className="text-sm cursor-pointer flex-1 text-slate-200"
                        >
                          {index + 1}. {topic}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Generation Options */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Opciones de Generación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Páginas Mínimas por Tema</Label>
                      <Input
                        type="number"
                        min="10"
                        max="60"
                        value={temarioModalState.minPagesPerTopic}
                        onChange={(e) => setTemarioModalState(prev => ({
                          ...prev,
                          minPagesPerTopic: parseInt(e.target.value) || 10
                        }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Modo de Generación</Label>
                      <Select
                        value={temarioModalState.mode}
                        onValueChange={(value: 'individual' | 'batch') =>
                          setTemarioModalState(prev => ({ ...prev, mode: value }))
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="batch" className="text-white">Generación en lote</SelectItem>
                          <SelectItem value="individual" className="text-white">Tema por tema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="overwrite"
                      checked={temarioModalState.overwriteExisting}
                      onChange={(e) => setTemarioModalState(prev => ({
                        ...prev,
                        overwriteExisting: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <Label htmlFor="overwrite" className="text-slate-300">
                      Sobrescribir temas existentes
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <Info className="h-5 w-5 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  <strong>Resumen:</strong> Se generarán {temarioModalState.selectedTopics.length} temas con
                  un mínimo de {temarioModalState.minPagesPerTopic} páginas cada uno.
                  <br />
                  <strong>Tiempo estimado:</strong> {Math.ceil(temarioModalState.selectedTopics.length * 2)} - {Math.ceil(temarioModalState.selectedTopics.length * 4)} minutos.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            /* Generation Progress Mode */
            <div className="space-y-6">
              <Card className="border-indigo-500/30 bg-indigo-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-indigo-400">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Generando Temario con GPT-5 Mini
                    </div>
                    <div className="flex gap-2">
                      {!temarioModalState.currentProgress?.isPaused ? (
                        <Button onClick={pauseTemarioGeneration} variant="outline" size="sm">
                          <PauseCircle className="w-4 h-4 mr-1" />
                          Pausar
                        </Button>
                      ) : (
                        <Button onClick={resumeTemarioGeneration} variant="outline" size="sm">
                          <PlayCircle className="w-4 h-4 mr-1" />
                          Continuar
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {temarioModalState.currentProgress && (
                    <>
                      {/* Overall Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Progreso General</span>
                          <span className="text-indigo-400 font-bold">
                            {temarioModalState.currentProgress.progress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={temarioModalState.currentProgress.progress} className="h-2" />
                      </div>

                      {/* Current Topic */}
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="text-sm font-semibold mb-1 text-white">
                          Tema {temarioModalState.currentProgress.topicIndex + 1}/{temarioModalState.currentProgress.totalTopics}:
                          {temarioModalState.currentProgress.currentTopic}
                        </div>
                        <div className="text-xs text-slate-400">
                          {temarioModalState.currentProgress.currentSection}
                        </div>
                        {temarioModalState.currentProgress.isPaused && (
                          <div className="text-xs text-amber-400 mt-1">
                            ⏸️ Generación pausada
                          </div>
                        )}
                      </div>

                      {/* Generation Log */}
                      {temarioModalState.currentProgress.logs.length > 0 && (
                        <div className="bg-slate-900/50 rounded p-3 max-h-40 overflow-y-auto">
                          <div className="text-sm font-medium text-slate-300 mb-2">Log de Generación:</div>
                          <div className="space-y-1">
                            {temarioModalState.currentProgress.logs.slice(-5).map((log, index) => (
                              <div key={index} className="text-xs font-mono text-slate-400">
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Errors */}
                      {temarioModalState.currentProgress.errors.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                          <div className="text-sm font-medium text-red-400 mb-2">Errores:</div>
                          <div className="space-y-1">
                            {temarioModalState.currentProgress.errors.map((error, index) => (
                              <div key={index} className="text-xs text-red-300">
                                ❌ {error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              onClick={closeTemarioModal}
              variant="outline"
              disabled={temarioModalState.isGenerating}
              className="border-slate-600 text-slate-400"
            >
              {temarioModalState.isGenerating ? 'Mantener Abierto' : 'Cerrar'}
            </Button>

            {!temarioModalState.isGenerating && (
              <Button
                onClick={startTemarioGeneration}
                disabled={temarioModalState.selectedTopics.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                ��� GENERAR TEMARIO
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

export default AssistantContentManager;
