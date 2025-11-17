import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, X, AlertCircle } from "lucide-react";
import type { AssistantSyllabus } from "@/lib/syllabusService";

interface SyllabusViewerProps {
  isOpen: boolean;
  onClose: () => void;
  syllabus: AssistantSyllabus | null;
}

export default function SyllabusViewer({
  isOpen,
  onClose,
  syllabus,
}: SyllabusViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!syllabus) return null;

  const pdfUrl = syllabus.pdf?.downloadURL;
  const hasPdf = Boolean(pdfUrl);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {syllabus.title}
          </DialogTitle>
          <DialogDescription>
            Visualización del PDF - Solo lectura
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          {!hasPdf ? (
            <div className="h-full flex items-center justify-center">
              <Alert className="max-w-md">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  El PDF aún no está disponible. Puede estar siendo generado en este momento.
                  Intenta de nuevo en unos momentos.
                </AlertDescription>
              </Alert>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Error al cargar el PDF: {error}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=90`}
                className="w-full h-full border border-gray-200 rounded-lg"
                title={`PDF: ${syllabus.title}`}
                onLoad={() => setLoading(false)}
                onError={() => setError("No se pudo cargar el PDF")}
                sandbox="allow-same-origin"
                style={{
                  minHeight: '600px',
                }}
              />
              {/* Overlay to prevent right-click downloads */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 1 }}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {syllabus.pdf?.version && (
              <span>Versión {syllabus.pdf.version} • </span>
            )}
            Creado: {new Date(syllabus.createdAtMs).toLocaleDateString('es-ES')}
          </div>
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
