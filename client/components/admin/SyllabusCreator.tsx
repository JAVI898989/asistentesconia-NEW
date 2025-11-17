import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createSyllabus,
  generateSyllabusContent,
  generateSyllabusPdf,
  type SyllabusGenerationRequest,
} from "@/lib/syllabusService";

interface SyllabusCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  assistantId: string;
  assistantName: string;
}

interface FormData {
  title: string;
  contextBase: string;
  order: string;
}

interface FormErrors {
  title?: string;
  contextBase?: string;
}

export default function SyllabusCreator({
  isOpen,
  onClose,
  assistantId,
  assistantName,
}: SyllabusCreatorProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    contextBase: "",
    order: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [progress, setProgress] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!formData.contextBase.trim()) {
      newErrors.contextBase = "El contexto/temario base es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isGenerating) return;

    setIsGenerating(true);
    setProgress(0);
    setGenerationStep("Iniciando generación...");

    try {
      // Step 1: Generate AI content
      setGenerationStep("Generando contenido con IA...");
      setProgress(20);

      const request: SyllabusGenerationRequest = {
        assistantId,
        title: formData.title.trim(),
        contextBase: formData.contextBase.trim(),
        order: formData.order ? parseInt(formData.order) : undefined,
      };

      const markdownContent = await generateSyllabusContent(request);

      // Step 2: Save to Firestore
      setGenerationStep("Guardando en base de datos...");
      setProgress(50);

      const syllabusId = await createSyllabus({
        assistantId,
        title: formData.title.trim(),
        contentMarkdown: markdownContent,
        order: formData.order ? parseInt(formData.order) : undefined,
      });

      // Step 3: Generate PDF (optional)
      setGenerationStep("Generando PDF...");
      setProgress(75);

      let pdfGenerated = false;
      try {
        await generateSyllabusPdf(syllabusId);
        pdfGenerated = true;
        console.log('📄 PDF generated successfully');
      } catch (pdfError) {
        console.warn('📄 PDF generation failed, but syllabus was created successfully:', pdfError);
        // Don't throw the error - PDF generation is optional
      }

      // Step 4: Complete
      setGenerationStep("¡Completado!");
      setProgress(100);

      if (pdfGenerated) {
        toast.success("Temario creado y PDF listo", {
          description: "El temario ha sido generado exitosamente y está disponible para visualización.",
        });
      } else {
        toast.success("Temario creado", {
          description: "El temario ha sido generado exitosamente. PDF se puede generar después.",
        });
      }

      // Reset form and close
      setFormData({ title: "", contextBase: "", order: "" });
      setErrors({});
      onClose();

    } catch (error) {
      console.error("Error creating syllabus:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";

      toast.error("Error al crear el temario", {
        description: errorMessage,
        action: {
          label: "Reintentar",
          onClick: handleSubmit,
        },
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setGenerationStep("");
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setFormData({ title: "", contextBase: "", order: "" });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Crear Temario (PDF 10-15 págs)
          </DialogTitle>
          <DialogDescription>
            Genera un temario completo para <strong>{assistantName}</strong> usando IA.
            El sistema creará contenido extenso en Markdown y generará un PDF profesional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título del Tema *
            </Label>
            <Input
              id="title"
              placeholder="Ej: Fundamentos de Administración Pública"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              className={`${errors.title ? "border-red-500" : ""} text-base`}
              disabled={isGenerating}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Context/Base Content */}
          <div className="space-y-2">
            <Label htmlFor="contextBase" className="text-sm font-medium">
              Contexto/Temario Base *
            </Label>
            <Textarea
              id="contextBase"
              placeholder="Describe el contexto, puntos clave que debe cubrir el temario, normativas relevantes, etc..."
              value={formData.contextBase}
              onChange={(e) => {
                setFormData({ ...formData, contextBase: e.target.value });
                if (errors.contextBase) setErrors({ ...errors, contextBase: undefined });
              }}
              className={`${errors.contextBase ? "border-red-500" : ""} min-h-[120px] text-base`}
              disabled={isGenerating}
            />
            {errors.contextBase && (
              <p className="text-sm text-red-500">{errors.contextBase}</p>
            )}
          </div>

          {/* Order Field */}
          <div className="space-y-2">
            <Label htmlFor="order" className="text-sm font-medium">
              Orden (Opcional)
            </Label>
            <Input
              id="order"
              type="number"
              placeholder="Ej: 1, 2, 3..."
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              className="text-base"
              disabled={isGenerating}
              min="1"
            />
          </div>

          {/* Progress Section */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">{generationStep}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Info Alert */}
          <Alert>
            <FileText className="w-4 h-4" />
            <AlertDescription>
              <strong>Proceso de generación:</strong> El sistema generará contenido extenso con IA (GPT-4 → GPT-4o-mini como fallback),
              lo guardará en Firestore y creará un PDF de 10-15 páginas. El proceso puede tardar 1-2 minutos.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isGenerating || !formData.title.trim() || !formData.contextBase.trim()}
            className="min-w-[140px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generando...
              </>
            ) : (
              "Generar y Publicar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
