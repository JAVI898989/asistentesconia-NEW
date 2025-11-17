import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Brain, Loader2, FileText, HelpCircle, CreditCard } from "lucide-react";
import { generateAIContent } from "@/lib/aiContentGeneration";

interface AIContentGeneratorProps {
  assistantId: string;
  assistantName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ContentOptions {
  temario: boolean;
  tests: boolean;
  flashcards: boolean;
}

export default function AIContentGenerator({
  assistantId,
  assistantName,
  isOpen,
  onClose,
}: AIContentGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [contentOptions, setContentOptions] = useState<ContentOptions>({
    temario: false,
    tests: false,
    flashcards: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  // Available themes (1-25)
  const themes = Array.from({ length: 25 }, (_, i) => ({
    id: `tema-${i + 1}`,
    name: `Tema ${i + 1}`,
  }));

  const handleContentOptionChange = (option: keyof ContentOptions, checked: boolean) => {
    setContentOptions(prev => ({
      ...prev,
      [option]: checked,
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(contentOptions).every(v => v);
    setContentOptions({
      temario: !allSelected,
      tests: !allSelected,
      flashcards: !allSelected,
    });
  };

  const canGenerate = selectedTheme && Object.values(contentOptions).some(v => v);

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      const progressCallback = (step: string, progress: number) => {
        setCurrentStep(step);
        setProgress(progress);
      };

      await generateAIContent({
        assistantId,
        assistantName,
        themeId: selectedTheme,
        themeName: themes.find(t => t.id === selectedTheme)?.name || "",
        contentTypes: contentOptions,
        onProgress: progressCallback,
      });

      // Success
      setProgress(100);
      setCurrentStep("¡Contenido generado exitosamente!");

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        setCurrentStep("");
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error("Error generating content:", error);
      setCurrentStep(`❌ Error: ${error.message || 'Error al generar contenido'}`);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        setCurrentStep("");
      }, 5000);
    }
  };

  const resetForm = () => {
    setSelectedTheme("");
    setContentOptions({
      temario: false,
      tests: false,
      flashcards: false,
    });
    setProgress(0);
    setCurrentStep("");
  };

  const handleClose = () => {
    if (!isGenerating) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Generar contenido con IA
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Genera temario, tests y flashcards para <strong>{assistantName}</strong> usando ChatGPT 3.5
          </DialogDescription>
        </DialogHeader>

        {!isGenerating ? (
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-slate-300">
                Seleccionar tema del asistente
              </Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Elige un tema..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {themes.map((theme) => (
                    <SelectItem
                      key={theme.id}
                      value={theme.id}
                      className="text-white hover:bg-slate-600"
                    >
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content Type Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">¿Qué quieres generar?</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs border-slate-600 text-slate-400"
                >
                  {Object.values(contentOptions).every(v => v) ? "Deseleccionar todo" : "Seleccionar todo"}
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="temario"
                    checked={contentOptions.temario}
                    onCheckedChange={(checked) =>
                      handleContentOptionChange("temario", checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="temario"
                      className="text-sm font-medium text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <FileText className="w-4 h-4 inline mr-1" />
                      Temario completo
                    </label>
                    <p className="text-xs text-slate-500">
                      Mínimo 10 páginas con explicaciones detalladas, resumen final y claves para memorizar
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="tests"
                    checked={contentOptions.tests}
                    onCheckedChange={(checked) =>
                      handleContentOptionChange("tests", checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="tests"
                      className="text-sm font-medium text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <HelpCircle className="w-4 h-4 inline mr-1" />
                      Tests (20+ preguntas)
                    </label>
                    <p className="text-xs text-slate-500">
                      Se añadirán a los tests existentes sin borrar contenido anterior
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="flashcards"
                    checked={contentOptions.flashcards}
                    onCheckedChange={(checked) =>
                      handleContentOptionChange("flashcards", checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="flashcards"
                      className="text-sm font-medium text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <CreditCard className="w-4 h-4 inline mr-1" />
                      Flashcards (15+ tarjetas)
                    </label>
                    <p className="text-xs text-slate-500">
                      Se añadirán a las flashcards existentes de forma acumulativa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <div>
                <p className="text-white font-medium">Generando contenido...</p>
                <p className="text-sm text-slate-400">{currentStep}</p>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-slate-500">{progress}% completado</p>
            </div>
          </div>
        )}

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
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generar contenido
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              disabled
              className="border-slate-600 text-slate-400"
            >
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
