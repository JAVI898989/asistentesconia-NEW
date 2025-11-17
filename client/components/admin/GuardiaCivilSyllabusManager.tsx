import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  FileText,
  Eye,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Star,
  Target,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import RepairPDFsAction from "./RepairPDFsAction";
import GcPdfUploader from "./GcPdfUploader";
import deepCleanAssistantContent from "@/lib/cleanupAssistantContent";
import {
  guardiaCivilPerfectGenerator,
  type SyllabusDocument,
  type GenerationResult,
} from "@/lib/guardiaCivilPerfectGenerator";

// 12 Topics for Guardia Civil (Escala Cabos y Guardias)
const GUARDIA_CIVIL_TOPICS = [
  {
    slug: "procedimiento-penal-policia-judicial",
    title: "Procedimiento penal y Policía Judicial",
    order: 1,
    summary: "LECrim: atestado, detención, entrada/registro, cadena de custodia",
  },
  {
    slug: "seguridad-ciudadana-lo-4-2015",
    title: "LO 4/2015 Seguridad Ciudadana",
    order: 2,
    summary: "Identificación, registros, actas, régimen sancionador",
  },
  {
    slug: "seguridad-vial",
    title: "Seguridad vial",
    order: 3,
    summary: "Alcoholemia/drogas, permiso por puntos, atestados/accidentes",
  },
  {
    slug: "armas-explosivos",
    title: "Armas y Explosivos",
    order: 4,
    summary: "RD 137/1993: clasificación, licencias/guías, intervención, depósito y destrucción",
  },
  {
    slug: "extranjeria",
    title: "Extranjería",
    order: 5,
    summary: "LO 4/2000; RD 557/2011: situaciones, infracciones, expulsión/devolución, actuaciones GC",
  },
  {
    slug: "proteccion-civil",
    title: "Protección Civil",
    order: 6,
    summary: "Ley 17/2015: planes, activación, mando y coordinación operativa",
  },
  {
    slug: "derechos-fundamentales",
    title: "Derechos fundamentales, CE y LO 2/1986",
    order: 7,
    summary: "Principios, uso proporcional de la fuerza, responsabilidad",
  },
  {
    slug: "violencia-genero",
    title: "Violencia de género",
    order: 8,
    summary: "LO 1/2004: diligencias, valoración de riesgo, VioGén",
  },
  {
    slug: "medio-ambiente-seprona",
    title: "Medio ambiente y SEPRONA",
    order: 9,
    summary: "Ley 42/2007, CITES, delitos ambientales, toma de muestras",
  },
  {
    slug: "organizacion-regimen-disciplinario",
    title: "Organización y régimen disciplinario GC",
    order: 10,
    summary: "Estructura, empleos, faltas y sanciones",
  },
  {
    slug: "primeros-auxilios",
    title: "Primeros auxilios y actuación inmediata",
    order: 11,
    summary: "PAS, hemorragias, inmovilización, coordinación sanitaria",
  },
  {
    slug: "comunicaciones-radio",
    title: "Comunicaciones y radio",
    order: 12,
    summary: "Procedimientos, códigos, seguridad de la información",
  }
];

interface GuardiaCivilSyllabusManagerProps {
  assistantId: string;
  assistantName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function GuardiaCivilSyllabusManager({
  assistantId,
  assistantName,
  isOpen,
  onClose,
}: GuardiaCivilSyllabusManagerProps) {
  const [syllabi, setSyllabi] = useState<SyllabusDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [showRepairPDFs, setShowRepairPDFs] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [showPdfUploader, setShowPdfUploader] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSyllabi();
    }
  }, [isOpen, assistantId]);

  const loadSyllabi = async () => {
    try {
      setLoading(true);
      const data = await guardiaCivilPerfectGenerator.getSyllabus(assistantId);
      setSyllabi(data);
    } catch (error) {
      console.error("Error loading syllabi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateComplete = async () => {
    try {
      setGenerating(true);
      setProgress(0);
      setCurrentTopic("");
      setResult(null);

        const generationResult = await guardiaCivilPerfectGenerator.generateCompleteSyllabus(
          assistantId,
          (topic, current, total) => {
            setCurrentTopic(topic);
            setProgress(total > 0 ? (current / total) * 100 : 0);
          }
        );

      setResult(generationResult);
      setShowResult(true);
      await loadSyllabi(); // Reload to show new content

    } catch (error) {
      console.error("Error generating syllabus:", error);
      setResult({
        success: false,
        completed: 0,
        total: GUARDIA_CIVIL_TOPICS.length,
        errors: [error.message],
        syllabi: []
      });
      setShowResult(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateTopic = async (topicSlug: string) => {
    try {
      setLoading(true);
      await guardiaCivilPerfectGenerator.regenerateTopic(assistantId, topicSlug);
      await loadSyllabi();
    } catch (error) {
      console.error("Error regenerating topic:", error);
      alert(`Error regenerando tema: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getTopicStatus = (topicSlug: string) => {
    const syllabus = syllabi.find(s => s.slug === topicSlug);
    if (!syllabus) return "missing";
    return syllabus.status;
  };

  const getTopicSyllabus = (topicSlug: string) => {
    return syllabi.find(s => s.slug === topicSlug);
  };

  const completedTopics = syllabi.filter(s => s.status === "ready").length;
  const totalTopics = GUARDIA_CIVIL_TOPICS.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Star className="h-6 w-6 mr-2 text-yellow-600" />
            Guardia Civil PERFECTO - {assistantName}
          </DialogTitle>
          <DialogDescription className="text-base">
            🎯 Sistema PERFECTO: 12 temas completos (2800+ palabras) • 20 tests exactos • 45+ flashcards • Quality Gates automáticos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {completedTopics}/{totalTopics}
                  </div>
                  <div className="text-xs text-gray-600">Temas Completados</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {syllabi.reduce((sum, s) => sum + (s.testsCount || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-600">Tests Generados</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {syllabi.reduce((sum, s) => sum + (s.flashcardsCount || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-600">Flashcards</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {syllabi.filter(s => s.pdfUrl).length}
                  </div>
                  <div className="text-xs text-gray-600">PDFs Generados</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generation Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generación Completa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="min-w-[260px]">
                  <p className="text-sm text-gray-600">
                    Genera los 12 temas completos del temario de Guardia Civil
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 12-15 páginas por tema • Sin límite superior • PDFs sin cortes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleGenerateComplete}
                    disabled={generating || loading}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Generar Temario PERFECTO
                  </Button>
                  <Button
                    onClick={() => setShowRepairPDFs(true)}
                    disabled={generating || loading}
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Reparar PDFs
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        setCleaning(true);
                        await deepCleanAssistantContent(assistantId);
                        await loadSyllabi();
                        alert('✅ Temario, tests y flashcards de Guardia Civil eliminados');
                      } catch (e: any) {
                        alert(`❌ Error limpiando: ${e?.message || e}`);
                      } finally {
                        setCleaning(false);
                      }
                    }}
                    disabled={generating || loading || cleaning}
                    variant="destructive"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {cleaning ? 'Limpiando…' : 'Borrar TODO GC'}
                  </Button>
                  <Button
                    onClick={() => setShowPdfUploader(true)}
                    disabled={generating || loading}
                    variant="secondary"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Subir Temario PDF
                  </Button>
                </div>
              </div>

              {/* Progress */}
              {generating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generando: {currentTopic}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={isNaN(progress) ? 0 : progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Topics Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Temas del Temario</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">Cargando temas...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Palabras</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>Flashcards</TableHead>
                      <TableHead>PDF</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {GUARDIA_CIVIL_TOPICS.map((topic) => {
                      const status = getTopicStatus(topic.slug);
                      const syllabus = getTopicSyllabus(topic.slug);

                      return (
                        <TableRow key={topic.slug}>
                          <TableCell className="font-medium">
                            {topic.order}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{topic.title}</div>
                              <div className="text-xs text-gray-500">
                                {topic.summary}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {status === "published" && (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Publicado
                              </Badge>
                            )}
                            {status === "generating" && (
                              <Badge variant="secondary" className="bg-blue-600">
                                <Clock className="w-3 h-3 mr-1" />
                                Generando
                              </Badge>
                            )}
                            {status === "missing" && (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Pendiente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {syllabus?.wordCount && !isNaN(syllabus.wordCount) ? (
                              <Badge
                                variant="outline"
                                className={syllabus.wordCount >= 2800 ? "text-green-600" : "text-red-600"}
                              >
                                {syllabus.wordCount}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {syllabus && (syllabus.testsCount || 0) >= 0 ? (
                              <Badge
                                variant="outline"
                                className={(syllabus.testsCount || 0) === 20 ? "text-green-600" : "text-red-600"}
                              >
                                {syllabus.testsCount || 0}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {syllabus && (syllabus.flashcardsCount || 0) >= 0 ? (
                              <Badge
                                variant="outline"
                                className={(syllabus.flashcardsCount || 0) >= 45 ? "text-green-600" : "text-red-600"}
                              >
                                {syllabus.flashcardsCount || 0}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {syllabus?.pdfUrl ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPdf(syllabus.pdfUrl!)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {syllabus && (
                              (syllabus.wordCount || 0) >= 2800 &&
                              (syllabus.testsCount || 0) === 20 &&
                              (syllabus.flashcardsCount || 0) >= 45
                            ) ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                ✓
                              </Badge>
                            ) : syllabus ? (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                ✗
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {status !== "missing" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRegenerateTopic(topic.slug)}
                                  disabled={loading}
                                  title="Regenerar tema"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* PDF Viewer */}
        {selectedPdf && (
          <Dialog open={!!selectedPdf} onOpenChange={() => setSelectedPdf(null)}>
            <DialogContent className="sm:max-w-[90vw] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Vista previa del PDF</DialogTitle>
              </DialogHeader>
              <div className="w-full h-[70vh]">
                <iframe
                  src={selectedPdf}
                  className="w-full h-full border rounded"
                  title="PDF Preview"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedPdf(null)}>
                  Cerrar
                </Button>
                <Button onClick={() => window.open(selectedPdf, '_blank')}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Generation Result */}
        {showResult && result && (
          <Dialog open={showResult} onOpenChange={setShowResult}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  Resultado de Generación
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.completed}
                    </div>
                    <div className="text-sm text-gray-600">Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {result.errors.length}
                    </div>
                    <div className="text-sm text-gray-600">Errores</div>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Errores encontrados:</strong>
                      <ul className="mt-2 text-sm list-disc list-inside">
                        {result.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setShowResult(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Repair PDFs Dialog */}
        <RepairPDFsAction
          assistantId={assistantId}
          assistantName={assistantName}
          isOpen={showRepairPDFs}
          onClose={() => setShowRepairPDFs(false)}
          onComplete={loadSyllabi}
        />

        {/* Upload PDF Dialog */}
        <GcPdfUploader
          assistantId={assistantId}
          isOpen={showPdfUploader}
          onClose={() => setShowPdfUploader(false)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GuardiaCivilSyllabusManager;
