import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Brain, Loader2, CheckCircle, AlertTriangle, Zap } from "lucide-react";

interface GenerationProgress {
  currentAssistant: string;
  currentTheme: number;
  assistantProgress: number;
  totalProgress: number;
  completed: number;
  total: number;
  errors: string[];
  conflicts: string[];
}

interface MassAICurriculumGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MassAICurriculumGenerator({
  isOpen,
  onClose,
}: MassAICurriculumGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    currentAssistant: "",
    currentTheme: 0,
    assistantProgress: 0,
    totalProgress: 0,
    completed: 0,
    total: 0,
    errors: [],
    conflicts: [],
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [conflictingAssistants, setConflictingAssistants] = useState<string[]>([]);
  const [generationMode, setGenerationMode] = useState<"all" | "blocks">("blocks");
  const [blockSize, setBlockSize] = useState(5);

  // All assistants to process
  const allAssistants = [
    { id: "policia-nacional", name: "Policía Nacional" },
    { id: "guardia-civil", name: "Guardia Civil" },
    { id: "auxiliar-administrativo-estado", name: "Auxiliar Administrativo del Estado" },
    { id: "administrativo", name: "Administrativo" },
    { id: "auxiliar-administrativo", name: "Auxiliar Administrativo" },
    { id: "administrativo-estado", name: "Administrativo del Estado" },
    { id: "celador", name: "Celador" },
    { id: "mir", name: "Médico Interno Residente (MIR)" },
    { id: "tecnicos-hacienda", name: "Técnicos de Hacienda" },
    { id: "agentes-hacienda-publica", name: "Agentes de la Hacienda Pública" },
    { id: "intervencion-general", name: "Intervención General del Estado" },
    { id: "inspeccion-hacienda", name: "Inspección de Hacienda" },
    { id: "cnmv-tecnicos", name: "CNMV – Técnicos" },
    { id: "banco-espana-tecnicos", name: "Banco de España – Técnicos" },
    { id: "tecnicos-seguridad-social", name: "Técnicos de Seguridad Social" },
    { id: "inspectores-hacienda-superior", name: "Cuerpo Superior de Inspectores de Hacienda" },
    { id: "tecnico-hacienda", name: "Técnico de Hacienda" },
    { id: "auxiliar-enfermeria", name: "Auxiliar de Enfermería" },
    { id: "enfermero", name: "Enfermero/a" },
    { id: "tecnico-radiodiagnostico", name: "Técnico en Radiodiagnóstico" },
    { id: "tecnico-laboratorio", name: "Técnico de Laboratorio" },
    { id: "fisioterapeuta", name: "Fisioterapeuta" },
    { id: "trabajador-social", name: "Trabajador Social" },
    { id: "psicologo-clinico", name: "Psicólogo Clínico" },
    { id: "farmaceutico", name: "Farmacéutico" },
    { id: "medico-familia", name: "Médico de Familia" },
    { id: "maestros-primaria", name: "Maestros de Educación Primaria" },
    { id: "profesores-secundaria", name: "Profesores de Educación Secundaria" },
    { id: "orientador-educativo", name: "Orientador Educativo" },
    { id: "inspector-educacion", name: "Inspector de Educación" },
    { id: "juez", name: "Juez" },
    { id: "fiscal", name: "Fiscal" },
    { id: "secretario-judicial", name: "Secretario Judicial" },
    { id: "gestor-procesal", name: "Gestor Procesal" },
    { id: "tramitador-procesal", name: "Tramitador Procesal" },
    { id: "auxilio-judicial", name: "Auxilio Judicial" },
    { id: "notario", name: "Notario" },
    { id: "registrador", name: "Registrador de la Propiedad" },
    { id: "letrado-administracion-justicia", name: "Letrado de la Administración de Justicia" },
    { id: "bombero", name: "Bombero" },
    { id: "policia-local", name: "Policía Local" },
    { id: "mossos-esquadra", name: "Mossos d'Esquadra" },
    { id: "ertzaintza", name: "Ertzaintza" }
  ];

  const themeTemplates = [
    "Introducción y Marco General",
    "Marco Normativo y Legal",
    "Organización y Estructura",
    "Procedimientos y Protocolos",
    "Funciones y Competencias",
    "Normativa Específica",
    "Casos Prácticos y Aplicaciones",
    "Recursos y Herramientas",
    "Evaluación y Exámenes"
  ];

  const handleStartGeneration = async () => {
    try {
      // First, check for existing content
      console.log("🔍 Checking for existing curricula...");
      const { checkExistingCurricula } = await import("@/lib/massAIGenerator");
      
      const conflicts = await checkExistingCurricula(allAssistants.map(a => a.id));
      
      if (conflicts.length > 0) {
        setConflictingAssistants(conflicts);
        setShowConfirmDialog(true);
        return;
      }
      
      await startGeneration(false);
    } catch (error) {
      console.error("Error starting generation:", error);
    }
  };

  const startGeneration = async (overwriteExisting: boolean) => {
    setIsGenerating(true);
    setProgress({
      currentAssistant: "",
      currentTheme: 0,
      assistantProgress: 0,
      totalProgress: 0,
      completed: 0,
      total: allAssistants.length * themeTemplates.length,
      errors: [],
      conflicts: [],
    });

    try {
      const { generateAllCurricula } = await import("@/lib/massAIGenerator");
      
      const assistantsToProcess = generationMode === "blocks" 
        ? allAssistants.slice(0, blockSize)
        : allAssistants;

      await generateAllCurricula(
        assistantsToProcess,
        themeTemplates,
        overwriteExisting,
        (progressData) => {
          setProgress(progressData);
        }
      );

      console.log("✅ Mass generation completed successfully!");
      
    } catch (error) {
      console.error("❌ Mass generation failed:", error);
      setProgress(prev => ({
        ...prev,
        errors: [...prev.errors, `Error general: ${error.message || 'Error desconocido'}`]
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      onClose();
    }
  };

  const resetProgress = () => {
    setProgress({
      currentAssistant: "",
      currentTheme: 0,
      assistantProgress: 0,
      totalProgress: 0,
      completed: 0,
      total: 0,
      errors: [],
      conflicts: [],
    });
    setIsGenerating(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Generación Masiva de Temarios con IA
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Genera temarios completos para todos los asistentes usando GPT-3.5. 
              Cada tema tendrá mínimo 10 páginas con contenido detallado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {!isGenerating ? (
              <div className="space-y-4">
                {/* Mode Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">
                    Modo de Generación
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={generationMode === "blocks" ? "default" : "outline"}
                      onClick={() => setGenerationMode("blocks")}
                      className={generationMode === "blocks" 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "border-slate-600 text-slate-300"
                      }
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Por Bloques ({blockSize} asistentes)
                    </Button>
                    <Button
                      variant={generationMode === "all" ? "default" : "outline"}
                      onClick={() => setGenerationMode("all")}
                      className={generationMode === "all" 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "border-slate-600 text-slate-300"
                      }
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Todos ({allAssistants.length} asistentes)
                    </Button>
                  </div>
                </div>

                {/* Statistics */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          {generationMode === "blocks" ? blockSize : allAssistants.length}
                        </div>
                        <div className="text-xs text-slate-400">Asistentes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {themeTemplates.length}
                        </div>
                        <div className="text-xs text-slate-400">Temas c/u</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {(generationMode === "blocks" ? blockSize : allAssistants.length) * themeTemplates.length}
                        </div>
                        <div className="text-xs text-slate-400">Total PDFs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Theme List */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Temas a Generar
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {themeTemplates.map((theme, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-slate-400 bg-slate-700/30 p-2 rounded"
                      >
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                          {index + 1}
                        </Badge>
                        {theme}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div className="text-xs text-yellow-200">
                      <strong>Importante:</strong> Este proceso puede tomar varios minutos u horas 
                      dependiendo del número de asistentes. Se harán múltiples llamadas a la API de OpenAI.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Overview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">
                      Progreso General
                    </span>
                    <span className="text-sm text-slate-400">
                      {progress.completed} / {progress.total}
                    </span>
                  </div>
                  <Progress value={progress.totalProgress} className="h-2" />
                </div>

                {/* Current Status */}
                {progress.currentAssistant && (
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">
                            Procesando: {progress.currentAssistant}
                          </span>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            Tema {progress.currentTheme}/9
                          </Badge>
                        </div>
                        <Progress value={progress.assistantProgress} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Errors */}
                {progress.errors.length > 0 && (
                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-red-400 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Errores ({progress.errors.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {progress.errors.map((error, index) => (
                          <div key={index} className="text-xs text-red-200">
                            {error}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {!isGenerating ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="border-slate-600 text-slate-400"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleStartGeneration}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Iniciar Generación
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm text-slate-400">
                  Generando... No cerrar esta ventana
                </span>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Overwrite */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Contenido Existente Detectado
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Se encontró contenido existente en {conflictingAssistants.length} asistentes.
              ¿Deseas sobrescribir el contenido existente o cancelar la operación?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-32 overflow-y-auto">
            <div className="space-y-1">
              {conflictingAssistants.slice(0, 10).map((assistant, index) => (
                <div key={index} className="text-xs text-slate-400 bg-slate-700/30 p-1 rounded">
                  {assistant}
                </div>
              ))}
              {conflictingAssistants.length > 10 && (
                <div className="text-xs text-slate-500">
                  ... y {conflictingAssistants.length - 10} más
                </div>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-400">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false);
                startGeneration(true);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Sobrescribir Todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
