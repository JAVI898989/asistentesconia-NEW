import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload } from "lucide-react";
import { validatePdfFile, uploadTemarioPdf, logAdminAction } from "@/utils/temarioFlashcardsUtils";

interface Props {
  assistantId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function GcPdfUploader({ assistantId, isOpen, onClose }: Props) {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePdfUpload = async (file: File) => {
    const validation = validatePdfFile(file);
    setErrors(validation.errors);
    if (validation.errors.length === 0) {
      setSelectedPdf(file);
      setPdfPreview(URL.createObjectURL(file));
    }
  };

  const doUpload = async () => {
    if (!selectedPdf) return;
    setIsUploading(true);
    setProgress(10);

    try {
      const topicId = `tema-1-${Date.now()}`;
      const topicName = `Tema 1 - ${new Date().toLocaleDateString('es-ES')}`;
      setProgress(40);
      const result = await uploadTemarioPdf(assistantId, topicId, topicName, selectedPdf);
      if (!result.success) throw new Error(result.error || 'Error subiendo PDF');
      setProgress(100);
      await logAdminAction('admin', 'upload_gc_pdf', assistantId, 'success');
      alert('✅ PDF subido correctamente');
      onClose();
      setSelectedPdf(null);
      setPdfPreview("");
      setErrors([]);
      setIsUploading(false);
      setProgress(0);
    } catch (e: any) {
      await logAdminAction('admin', 'upload_gc_pdf', assistantId, 'error', e?.message || String(e));
      alert(`❌ Error: ${e?.message || e}`);
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Subir temario en PDF - Guardia Civil</DialogTitle>
          <DialogDescription>Selecciona un PDF y súbelo como temario para este asistente</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="gc-pdf">Archivo PDF (máx. 10MB)</Label>
            <Input
              id="gc-pdf"
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePdfUpload(file);
              }}
            />
          </div>

          {selectedPdf && (
            <div className="space-y-2">
              <Label>Archivo seleccionado</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">{selectedPdf.name}</span>
                  <span className="text-xs text-gray-500">({(selectedPdf.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              </div>
            </div>
          )}

          {pdfPreview && (
            <div className="space-y-2">
              <Label>Vista previa del PDF</Label>
              <div className="border rounded-lg p-2 bg-gray-50">
                <iframe src={pdfPreview} className="w-full h-64" title="Vista previa PDF" />
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="text-sm text-red-600">
              {errors.map((e, i) => (<div key={i}>• {e}</div>))}
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Label>Subiendo...</Label>
              <Progress value={progress} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>Cancelar</Button>
          <Button onClick={doUpload} disabled={!selectedPdf || errors.length > 0 || isUploading}>
            <Upload className="w-4 h-4 mr-2" /> Subir PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
