import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  FileText,
  Settings,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Target,
  RotateCcw,
  Wand2
} from "lucide-react";
import {
  useSyllabusTemplates,
  useSyllabusTemplate,
  useSyllabusAdapter,
  useTemplatePreview,
  useSyllabusGeneration
} from "@/hooks/useSyllabusTemplate";

interface SyllabusTemplateManagerProps {
  assistantId: string;
  assistantName: string;
  onSyllabusGenerated?: () => void;
}

function SyllabusTemplateManager({
  assistantId,
  assistantName,
  onSyllabusGenerated
}: SyllabusTemplateManagerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedAdapter, setSelectedAdapter] = useState<string>("none");
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [generatePdfs, setGeneratePdfs] = useState(true);
  const [minRewriteRatio, setMinRewriteRatio] = useState(0.45);

  const { templates, adapters, loading: templatesLoading } = useSyllabusTemplates();
  const { template } = useSyllabusTemplate(selectedTemplate || null);
  const { adapter } = useSyllabusAdapter(selectedAdapter === "none" ? null : selectedAdapter);
  const { preview, loading: previewLoading } = useTemplatePreview(
    selectedTemplate || null,
    selectedAdapter === "none" ? null : selectedAdapter
  );
  const {
    generating,
    progress,
    currentStep,
    result,
    generateSyllabus,
    regenerateTests,
    regenerateFlashcards,
    cleanGenericSyllabi,
  } = useSyllabusGeneration();

  const handleGenerateClick = () => {
    if (!selectedTemplate) return;

    if (adapter && adapter.REGLAS_REESCRITURA.min_rewrite_ratio > minRewriteRatio) {
      alert(`El adaptador requiere mínimo ${adapter.REGLAS_REESCRITURA.min_rewrite_ratio * 100}% de reescritura`);
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmGeneration = async () => {
    setShowConfirmDialog(false);

    const generationResult = await generateSyllabus({
      assistantId,
      templateId: selectedTemplate,
      adapterId: selectedAdapter === "none" ? undefined : selectedAdapter,
      rewriteMinimum: minRewriteRatio,
      generatePdfs,
      generateTests: true,
      generateFlashcards: true,
    });

    if (generationResult.success && onSyllabusGenerated) {
      onSyllabusGenerated();
    }
  };

  const handleCleanGeneric = async () => {
    try {
      const cleaned = await cleanGenericSyllabi(assistantId);
      alert(`Se eliminaron ${cleaned} temarios genéricos`);
      if (onSyllabusGenerated) {
        onSyllabusGenerated();
      }
    } catch (error) {
      alert(`Error al limpiar temarios: ${error.message}`);
    }
  };

  if (templatesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Generador de Temarios por Plantilla
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Cargando plantillas...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Generador de Temarios por Plantilla
          </CardTitle>
          <p className="text-sm text-gray-600">
            Genera temarios adaptados usando plantillas maestras y adaptadores específicos
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Plantilla Maestra</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plantilla..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {template && (
                <p className="text-xs text-gray-500">{template.description}</p>
              )}
            </div>

            {/* Adapter Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Adaptador (Opcional)</label>
              <Select value={selectedAdapter} onValueChange={setSelectedAdapter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin adaptación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Sin adaptación (original)</span>
                    </div>
                  </SelectItem>
                  {adapters.map((adapter) => (
                    <SelectItem key={adapter.id} value={adapter.id}>
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>{adapter.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {adapter && (
                <p className="text-xs text-gray-500">{adapter.description}</p>
              )}
            </div>
          </div>

          {/* Preview Button */}
          {selectedTemplate && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={previewLoading}
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Vista Previa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista Previa del Temario</DialogTitle>
            <DialogDescription>
              {adapter ?
                `Plantilla "${template?.name}" adaptada para "${adapter.name}"` :
                `Plantilla original "${template?.name}"`
              }
            </DialogDescription>
          </DialogHeader>

          {preview && (
            <div className="space-y-4">
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {preview.statistics.totalBlocks}
                  </div>
                  <div className="text-xs text-blue-600">Bloques Totales</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {preview.statistics.totalBlocks - preview.statistics.omittedBlocks}
                  </div>
                  <div className="text-xs text-green-600">Bloques Incluidos</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {preview.statistics.adaptedBlocks}
                  </div>
                  <div className="text-xs text-orange-600">Adaptados</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {preview.statistics.totalHours}h
                  </div>
                  <div className="text-xs text-purple-600">Horas Total</div>
                </div>
              </div>

              {/* Blocks List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {preview.blocks.map((block, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      block.isOmitted
                        ? "bg-red-50 border-red-200"
                        : block.isAdapted
                        ? "bg-orange-50 border-orange-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{block.titulo}</h4>
                        {block.originalSlug && block.originalSlug !== block.slug && (
                          <p className="text-xs text-gray-500">
                            Adaptado de: {block.originalSlug}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {block.isOmitted ? (
                          <Badge variant="destructive">Omitido</Badge>
                        ) : block.isAdapted ? (
                          <Badge variant="secondary">Adaptado</Badge>
                        ) : (
                          <Badge variant="default">Original</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Variables */}
              {adapter && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Variables Adaptadas</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>Rol:</strong> {preview.variables.ROL}</div>
                    <div><strong>Ámbito:</strong> {preview.variables.AMBITO_ACTUACION}</div>
                    <div><strong>Estilo Examen:</strong> {preview.variables.ESTILO_EXAMEN}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generation Options */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Opciones de Generación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generatePdfs}
                    onChange={(e) => setGeneratePdfs(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Generar PDFs</span>
                </label>
                <p className="text-xs text-gray-500">
                  UTF-8, sin cortes de página, 10-15 páginas por tema
                </p>
              </div>

              {adapter && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Ratio Reescritura: {Math.round(minRewriteRatio * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.35"
                    max="0.8"
                    step="0.05"
                    value={minRewriteRatio}
                    onChange={(e) => setMinRewriteRatio(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Mínimo requerido: {Math.round(adapter.REGLAS_REESCRITURA.min_rewrite_ratio * 100)}%
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGenerateClick}
                disabled={!selectedTemplate || generating}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Generar Temario
                {adapter && " (Adaptado)"}
              </Button>

              <Button
                variant="outline"
                onClick={handleCleanGeneric}
                disabled={generating}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar Genéricos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Progress */}
      {generating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 animate-spin" />
              Generando Temario...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentStep}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              Resultado de Generación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {result.statistics.successfulBlocks}
                </div>
                <div className="text-xs text-blue-600">Temarios Creados</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {result.statistics.pdfsGenerated}
                </div>
                <div className="text-xs text-green-600">PDFs Generados</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {result.statistics.totalHours}h
                </div>
                <div className="text-xs text-purple-600">Horas Totales</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {result.statistics.failedBlocks}
                </div>
                <div className="text-xs text-orange-600">Errores</div>
              </div>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <Alert>
                <XCircle className="w-4 h-4" />
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

            {/* Success Actions */}
            {result.success && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => regenerateTests(assistantId, result.syllabusIds[0] || "")}
                  disabled={generating}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Regenerar Tests
                </Button>
                <Button
                  variant="outline"
                  onClick={() => regenerateFlashcards(assistantId, result.syllabusIds[0] || "")}
                  disabled={generating}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Regenerar Flashcards
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Generación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres generar el temario para "{assistantName}"?
              {adapter && (
                <div className="mt-2 p-2 bg-orange-50 rounded text-sm">
                  <strong>Adaptación:</strong> {adapter.name}
                  <br />
                  <strong>Reescritura mínima:</strong> {Math.round(minRewriteRatio * 100)}%
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmGeneration}>
              Confirmar Generación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SyllabusTemplateManager;
