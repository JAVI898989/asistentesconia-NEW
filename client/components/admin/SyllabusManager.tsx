import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Eye, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  subscribeToAssistantSyllabi,
  type AssistantSyllabus,
} from "@/lib/syllabusService";
import SyllabusCreator from "./SyllabusCreator";
import SyllabusViewer from "./SyllabusViewer";
import SyllabusListCreator from "./SyllabusListCreator";

interface SyllabusManagerProps {
  isOpen: boolean;
  onClose: () => void;
  assistantId: string;
  assistantName: string;
}

export default function SyllabusManager({
  isOpen,
  onClose,
  assistantId,
  assistantName,
}: SyllabusManagerProps) {
  const [syllabi, setSyllabi] = useState<AssistantSyllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState<AssistantSyllabus | null>(null);
  const [listCreatorOpen, setListCreatorOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !assistantId) return;

    setLoading(true);
    const unsubscribe = subscribeToAssistantSyllabi(
      assistantId,
      (newSyllabi) => {
        setSyllabi(newSyllabi);
        setLoading(false);
      },
      () => {
        // Index error callback - just log it, the service handles fallback
        console.warn('⚠️ Syllabus index not ready, using fallback queries');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen, assistantId]);

  const handleViewPdf = (syllabus: AssistantSyllabus) => {
    if (!syllabus.pdf?.downloadURL) {
      toast.error("PDF no disponible", {
        description: "El PDF aún está siendo generado. Intenta de nuevo en unos momentos.",
      });
      return;
    }

    setSelectedSyllabus(syllabus);
    setViewerOpen(true);
  };

  const getPdfStatus = (syllabus: AssistantSyllabus) => {
    if (!syllabus.pdf) {
      return { status: "pending", text: "Generando...", variant: "secondary" as const };
    }
    return { status: "ready", text: "Listo", variant: "default" as const };
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Gestión de Temarios - {assistantName}
            </DialogTitle>
            <DialogDescription>
              Gestiona los temarios generados para este asistente. Cada temario incluye contenido extenso y un PDF de 10-15 páginas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Actions */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {syllabi.length} temario{syllabi.length !== 1 ? 's' : ''} encontrado{syllabi.length !== 1 ? 's' : ''}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setListCreatorOpen(true)}>
                  Crear desde lista
                </Button>
                <Button onClick={() => setCreatorOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear (IA)
                </Button>
              </div>
            </div>

            {/* Syllabi List */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Cargando temarios...</p>
                </div>
              </div>
            ) : syllabi.length === 0 ? (
              <Alert>
                <FileText className="w-4 h-4" />
                <AlertDescription>
                  No hay temarios creados para este asistente.
                  <Button
                    variant="link"
                    className="h-auto p-0 ml-1"
                    onClick={() => setCreatorOpen(true)}
                  >
                    Crear el primero
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Temarios Creados</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Orden</TableHead>
                        <TableHead>Estado PDF</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syllabi.map((syllabus) => {
                        const pdfStatus = getPdfStatus(syllabus);
                        return (
                          <TableRow key={syllabus.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{syllabus.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {syllabus.contentMarkdown.length.toLocaleString()} caracteres
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {syllabus.order ? (
                                <Badge variant="outline">#{syllabus.order}</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {pdfStatus.status === "pending" ? (
                                  <Clock className="w-4 h-4 text-orange-500" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                <Badge variant={pdfStatus.variant}>
                                  {pdfStatus.text}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDate(syllabus.createdAtMs)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewPdf(syllabus)}
                                  disabled={!syllabus.pdf?.downloadURL}
                                  title={
                                    syllabus.pdf?.downloadURL
                                      ? "Ver PDF"
                                      : "PDF en generación"
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Creator Modal */}
      <SyllabusCreator
        isOpen={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        assistantId={assistantId}
        assistantName={assistantName}
      />

      {/* Viewer Modal */}
      <SyllabusViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        syllabus={selectedSyllabus}
      />

      <SyllabusListCreator
        isOpen={listCreatorOpen}
        onClose={() => setListCreatorOpen(false)}
        assistantId={assistantId}
        assistantName={assistantName}
      />
    </>
  );
}
