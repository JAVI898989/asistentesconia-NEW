import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { createSyllabusBulkFromList } from "@/lib/syllabusService";

interface SyllabusListCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  assistantId: string;
  assistantName: string;
}

export default function SyllabusListCreator({
  isOpen,
  onClose,
  assistantId,
  assistantName,
}: SyllabusListCreatorProps) {
  const [topicsText, setTopicsText] = useState("");
  const [startOrder, setStartOrder] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!topicsText.trim()) {
      toast.error("La lista de temas es obligatoria");
      return;
    }

    setIsSaving(true);
    try {
      const ids = await createSyllabusBulkFromList(assistantId, topicsText, { startOrder });
      toast.success("Temario creado", {
        description: `${ids.length} temas guardados en Firestore (assistant_syllabus).`,
      });
      setTopicsText("");
      setStartOrder(1);
      onClose();
    } catch (e: any) {
      toast.error("Error al crear temario", { description: e?.message || "Inténtalo de nuevo" });
    } finally {
      setIsSaving(false);
    }
  };

  const example = [
    "Tema 1: La Constitución Española de 1978",
    "Tema 2: El Tribunal Constitucional",
    "Tema 3: Las Cortes Generales",
  ].join("\n");

  return (
    <Dialog open={isOpen} onOpenChange={() => (isSaving ? undefined : onClose())}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            Crear Temario desde Lista - {assistantName}
          </DialogTitle>
          <DialogDescription>
            Pega una lista de temas (uno por línea). Se guardarán en Firestore (assistant_syllabus) con sus campos y orden.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Alert>
            <FileText className="w-4 h-4" />
            <AlertDescription>
              Formato recomendado: "Tema 1: Título del tema". Si no incluyes número, usaremos un orden incremental empezando en el valor indicado.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Lista de temas</Label>
            <Textarea
              placeholder={example}
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              className="min-h-[200px]"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Orden inicial</Label>
            <Input
              type="number"
              min={1}
              value={startOrder}
              onChange={(e) => setStartOrder(parseInt(e.target.value || "1", 10))}
              disabled={isSaving}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Crear Temario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
