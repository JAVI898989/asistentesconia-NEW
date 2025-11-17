import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  BookOpen,
  FileText,
  Eye,
  Download,
  CheckCircle,
  Clock,
  Star,
  Target,
  Brain,
  FileQuestion,
} from "lucide-react";
import { guardiaCivilPerfectGenerator, type SyllabusDocument } from "@/lib/guardiaCivilPerfectGenerator";
import { useAdminStatus } from "@/hooks/useIsAdmin";

interface SyllabusViewerProps {
  assistantId: string;
  isLocked: boolean;
  onUnlock?: () => void;
}

export function SyllabusViewer({ assistantId, isLocked, onUnlock }: SyllabusViewerProps) {
  const [syllabi, setSyllabi] = useState<SyllabusDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<SyllabusDocument | null>(null);

  // Admin bypass
  const isAdmin = useAdminStatus();
  const effectiveIsLocked = !isAdmin && isLocked;

  useEffect(() => {
    loadSyllabi();
  }, [assistantId]);

  const loadSyllabi = async () => {
    try {
      setLoading(true);
      const data = await guardiaCivilPerfectGenerator.getSyllabus(assistantId);
      setSyllabi(data.filter(s => s.status === 'ready')); // Only show completed topics
    } catch (error) {
      console.error("Error loading syllabi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-slate-400">Cargando temario...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (syllabi.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Temario Oficial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">
              El temario estará disponible próximamente
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Contenido oficial en desarrollo
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const readyTopics = syllabi.filter(s => s.status === 'ready').length;
  const totalTests = syllabi.reduce((sum, s) => sum + s.testsCount, 0);
  const totalFlashcards = syllabi.reduce((sum, s) => sum + s.flashcardsCount, 0);

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Temario PERFECTO
          </CardTitle>
          <div className="text-slate-300 text-sm">
            {readyTopics} temas disponibles • {totalTests} tests • {totalFlashcards} flashcards
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-slate-700/50 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-400">{readyTopics}</div>
              <div className="text-xs text-slate-400">Temas</div>
            </div>
            <div className="text-center bg-slate-700/50 rounded-lg p-3">
              <div className="text-xl font-bold text-green-400">{totalTests}</div>
              <div className="text-xs text-slate-400">Tests</div>
            </div>
            <div className="text-center bg-slate-700/50 rounded-lg p-3">
              <div className="text-xl font-bold text-purple-400">{totalFlashcards}</div>
              <div className="text-xs text-slate-400">Flashcards</div>
            </div>
          </div>

          {/* Topics List */}
          <div className="space-y-3">
            {syllabi.map((syllabus) => (
              <div
                key={syllabus.id}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs bg-slate-600/50 text-slate-300">
                        Tema {syllabus.order}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-600/20 text-green-400 border-green-500/50">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completo
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-1">
                      {syllabus.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">
                      {syllabus.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        {syllabus.testsCount} tests
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {syllabus.flashcardsCount} flashcards
                      </div>
                      {syllabus.pdfUrl && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          PDF disponible
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTopic(syllabus)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-slate-600/50"
                      disabled={effectiveIsLocked}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {syllabus.pdfUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPdf(syllabus.pdfUrl!)}
                        className="text-purple-400 hover:text-purple-300 hover:bg-slate-600/50"
                        disabled={effectiveIsLocked}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Unlock CTA */}
          {effectiveIsLocked && (
            <div className="text-center pt-4 border-t border-slate-600/50">
              <p className="text-sm text-slate-400 mb-3">
                Accede a todo el contenido del temario
              </p>
              <Button
                onClick={onUnlock}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Star className="w-4 h-4 mr-2" />
                Suscribirse al Asistente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Topic Content Viewer */}
      {selectedTopic && (
        <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
          <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {selectedTopic.title}
              </DialogTitle>
              <DialogDescription>
                Tema {selectedTopic.order} • {selectedTopic.testsCount} tests • {selectedTopic.flashcardsCount} flashcards
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto max-h-[70vh] prose prose-invert max-w-none">
              <div className="bg-slate-800/50 rounded-lg p-6">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedTopic.contentMarkdown.length > 2000
                    ? selectedTopic.contentMarkdown.substring(0, 2000) + "...\n\n[Contenido completo disponible en el PDF]"
                    : selectedTopic.contentMarkdown
                  }
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedTopic(null)}>
                Cerrar
              </Button>
              {selectedTopic.pdfUrl && (
                <Button
                  onClick={() => {
                    setSelectedPdf(selectedTopic.pdfUrl!);
                    setSelectedTopic(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Ver PDF Completo
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* PDF Viewer */}
      {selectedPdf && (
        <Dialog open={!!selectedPdf} onOpenChange={() => setSelectedPdf(null)}>
          <DialogContent className="sm:max-w-[95vw] max-h-[95vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Visor de PDF</DialogTitle>
              <DialogDescription>
                Contenido completo del tema en formato PDF
              </DialogDescription>
            </DialogHeader>

            <div className="w-full h-[80vh]">
              <iframe
                src={selectedPdf}
                className="w-full h-full border rounded bg-white"
                title="PDF Viewer"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedPdf(null)}>
                Cerrar
              </Button>
              <Button onClick={() => window.open(selectedPdf, '_blank')}>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default SyllabusViewer;
