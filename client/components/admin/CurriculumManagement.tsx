import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
  SortableContext as SortableContextProvider,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FileText,
  Upload,
  Edit,
  Trash2,
  Eye,
  Move,
  Plus,
  Download,
  FileCheck,
  AlertTriangle,
  GripVertical,
} from "lucide-react";
import {
  getCurriculumThemes,
  createCurriculumTheme,
  updateCurriculumTheme,
  deleteCurriculumTheme,
  uploadThemeWithPDF,
  reorderCurriculumThemes,
  type CurriculumTheme,
} from "@/lib/firebaseData";
import { generarTemarioCompleto } from "@/lib/temarioGenerator";
import { useToast } from "@/hooks/use-toast";

interface CurriculumManagementProps {
  assistantId: string;
  assistantName: string;
}

interface ThemeFormData {
  number: number;
  title: string;
  description: string;
  pdfFile?: File;
}

// Sortable theme item component
function SortableThemeItem({
  theme,
  onEdit,
  onDelete,
  onPreview,
}: {
  theme: CurriculumTheme;
  onEdit: (theme: CurriculumTheme) => void;
  onDelete: (theme: CurriculumTheme) => void;
  onPreview: (theme: CurriculumTheme) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: theme.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`border-slate-700 ${isDragging ? "bg-slate-700/50" : ""}`}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-slate-700"
          >
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>
          <Badge className="bg-blue-500/20 text-blue-400">
            Tema {theme.number}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="text-white font-medium">{theme.title}</p>
          <p className="text-xs text-slate-400 mt-1">{theme.description}</p>
        </div>
      </TableCell>
      <TableCell>
        {theme.pdfUrl ? (
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-green-400" />
            <div className="text-sm">
              <p className="text-green-400">{theme.pdfFileName}</p>
              {theme.pdfSize && (
                <p className="text-xs text-slate-400">
                  {formatFileSize(theme.pdfSize)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Sin PDF</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge
          className={
            theme.isActive
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }
        >
          {theme.isActive ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {theme.pdfUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPreview(theme)}
              className="border-blue-600 text-blue-400 hover:bg-blue-700"
            >
              <Eye className="w-3 h-3" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(theme)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  ¿Eliminar tema?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Esta acción eliminará permanentemente el tema "{theme.title}"
                  y su archivo PDF. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-slate-600 text-slate-300">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(theme)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function CurriculumManagement({
  assistantId,
  assistantName,
}: CurriculumManagementProps) {
  const [themes, setThemes] = useState<CurriculumTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CurriculumTheme | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const [generatingComplete, setGeneratingComplete] = useState(false);
  const [formData, setFormData] = useState<ThemeFormData>({
    number: 1,
    title: "",
    description: "",
  });

  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    loadThemes();
  }, [assistantId]);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const curriculumThemes = await getCurriculumThemes(assistantId);
      setThemes(curriculumThemes);
    } catch (error) {
      console.error("Error loading themes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los temas del curriculum",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!formData.pdfFile) {
      toast({
        title: "Error",
        description: "Debe seleccionar un archivo PDF",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Try Firebase Storage first, fallback to demo mode
      try {
        const themeId = await uploadThemeWithPDF(
          assistantId,
          {
            number: formData.number,
            title: formData.title,
            description: formData.description,
            order: themes.length,
          },
          formData.pdfFile,
        );

        if (themeId) {
          toast({
            title: "Éxito",
            description: "Tema y PDF subidos correctamente a Firebase",
          });
          setUploadDialogOpen(false);
          setFormData({ number: themes.length + 1, title: "", description: "" });
          loadThemes();
          return;
        }
      } catch (storageError) {
        console.log("Firebase Storage not available, using demo mode:", storageError);
      }

      // Demo mode fallback - create temporary URL for the PDF
      const pdfUrl = URL.createObjectURL(formData.pdfFile);

      const themeId = await createCurriculumTheme({
        assistantId,
        number: formData.number,
        title: formData.title,
        description: formData.description,
        order: themes.length,
        pdfUrl: pdfUrl,
        pdfFileName: formData.pdfFile.name,
        pdfSize: formData.pdfFile.size,
        isActive: true,
      });

      if (themeId) {
        toast({
          title: "✅ Tema creado en modo demo",
          description: `Tema "${formData.title}" creado exitosamente. PDF disponible para esta sesión.`,
        });
        setUploadDialogOpen(false);
        setFormData({ number: themes.length + 1, title: "", description: "" });
        loadThemes();
      } else {
        throw new Error("Failed to create theme");
      }
    } catch (error) {
      console.error("Error creating theme:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el tema. Verifica que todos los campos están completos.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedTheme || !formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      if (formData.pdfFile) {
        // If there's a new PDF file, try Firebase Storage first, fallback to demo
        try {
          const themeId = await uploadThemeWithPDF(
            assistantId,
            {
              number: formData.number,
              title: formData.title,
              description: formData.description,
              order: selectedTheme.order,
            },
            formData.pdfFile,
          );

          if (themeId) {
            // Delete the old theme
            await deleteCurriculumTheme(selectedTheme.id);

            toast({
              title: "Éxito",
              description: "Tema y PDF actualizados correctamente",
            });
            setEditDialogOpen(false);
            setSelectedTheme(null);
            loadThemes();
            return;
          }
        } catch (storageError) {
          console.log("Firebase Storage not available, using demo mode:", storageError);

          // Demo mode - create temporary URL for the new PDF
          const pdfUrl = URL.createObjectURL(formData.pdfFile);

          const success = await updateCurriculumTheme(selectedTheme.id, {
            number: formData.number,
            title: formData.title,
            description: formData.description,
            pdfUrl: pdfUrl,
            pdfFileName: formData.pdfFile.name,
            pdfSize: formData.pdfFile.size,
          });

          if (success) {
            toast({
              title: "✅ Tema actualizado en modo demo",
              description: `Tema "${formData.title}" actualizado. Nuevo PDF disponible para esta sesión.`,
            });
            setEditDialogOpen(false);
            setSelectedTheme(null);
            loadThemes();
            return;
          }
        }
      } else {
        // Update existing theme without changing PDF
        const success = await updateCurriculumTheme(selectedTheme.id, {
          number: formData.number,
          title: formData.title,
          description: formData.description,
        });

        if (success) {
          toast({
            title: "Éxito",
            description: "Información del tema actualizada correctamente",
          });
          setEditDialogOpen(false);
          setSelectedTheme(null);
          loadThemes();
          return;
        }
      }

      throw new Error("Failed to update theme");
    } catch (error) {
      console.error("Error updating theme:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el tema. Verifica la información.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (theme: CurriculumTheme) => {
    try {
      const success = await deleteCurriculumTheme(theme.id);

      if (success) {
        toast({
          title: "Éxito",
          description: "Tema eliminado correctamente",
        });
        loadThemes();
      } else {
        throw new Error("Failed to delete theme");
      }
    } catch (error) {
      console.error("Error deleting theme:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el tema",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = themes.findIndex((theme) => theme.id === active.id);
      const newIndex = themes.findIndex((theme) => theme.id === over?.id);

      const newThemes = arrayMove(themes, oldIndex, newIndex);
      setThemes(newThemes);

      // Update order in Firebase
      try {
        const themeIds = newThemes.map((theme) => theme.id);
        const success = await reorderCurriculumThemes(assistantId, themeIds);

        if (success) {
          toast({
            title: "Éxito",
            description: "Orden de temas actualizado",
          });
        } else {
          // Revert on failure
          loadThemes();
          throw new Error("Failed to reorder themes");
        }
      } catch (error) {
        console.error("Error reordering themes:", error);
        toast({
          title: "Error",
          description: "Error al reordenar los temas",
          variant: "destructive",
        });
        // Reload to get correct order
        loadThemes();
      }
    }
  };

  const openEditDialog = (theme: CurriculumTheme) => {
    setSelectedTheme(theme);
    setFormData({
      number: theme.number,
      title: theme.title,
      description: theme.description,
    });
    setEditDialogOpen(true);
  };

  const openPreviewDialog = (theme: CurriculumTheme) => {
    setSelectedTheme(theme);
    setPreviewDialogOpen(true);
  };

  const openUploadDialog = () => {
    setFormData({
      number: themes.length + 1,
      title: "",
      description: "",
    });
    setUploadDialogOpen(true);
  };

  const handleGenerateCompleteTemario = async () => {
    if (!confirm("¿Generar automáticamente todo el temario? Esto creará múltiples temas con contenido extenso.")) {
      return;
    }

    try {
      setGeneratingComplete(true);

      let tipoTemario: 'guardia-civil' | 'policia-nacional' | 'auxiliar-administrativo' = 'guardia-civil';

      if (assistantId.includes('policia')) {
        tipoTemario = 'policia-nacional';
      } else if (assistantId.includes('auxiliar-administrativo')) {
        tipoTemario = 'auxiliar-administrativo';
      }

      toast({
        title: "🚀 Generando temario completo",
        description: `Creando todos los temas para ${assistantName}. Esto puede tardar unos momentos...`,
      });

      const resultado = await generarTemarioCompleto(assistantId, tipoTemario);

      if (resultado.creados > 0) {
        toast({
          title: "✅ Temario generado exitosamente",
          description: `Se crearon ${resultado.creados} temas de ${resultado.total} total. Cada tema incluye contenido extenso de +10 páginas.`,
        });
        loadThemes();
      } else {
        toast({
          title: "⚠️ No se pudieron crear los temas",
          description: "Hubo problemas al generar el temario. Revisa la consola para más detalles.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generando temario completo:", error);
      toast({
        title: "Error",
        description: "Error al generar el temario completo",
        variant: "destructive",
      });
    } finally {
      setGeneratingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-64 mb-4"></div>
          <div className="h-96 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Temario - {assistantName}
          </h2>
          <p className="text-slate-400">
            Gestionar temas y archivos PDF del curriculum
          </p>
        </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-500/20 text-blue-400">
              {themes.length} temas
            </Badge>
            <Button
              onClick={handleGenerateCompleteTemario}
              disabled={generatingComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              {generatingComplete ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Temario Completo
                </>
              )}
            </Button>
            <Button
              onClick={openUploadDialog}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Subir Tema Individual
            </Button>
          </div>
      </div>

      {/* Themes Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5" />
            Lista de Temas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {themes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No hay temas
              </h3>
              <p className="text-slate-400 mb-4">
                Comienza subiendo el primer tema del curriculum
              </p>
              <Button
                onClick={openUploadDialog}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Subir Primer Tema
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={themes}
                strategy={verticalListSortingStrategy}
              >
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Tema</TableHead>
                      <TableHead className="text-slate-300">
                        Información
                      </TableHead>
                      <TableHead className="text-slate-300">
                        Archivo PDF
                      </TableHead>
                      <TableHead className="text-slate-300">Estado</TableHead>
                      <TableHead className="text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {themes.map((theme) => (
                      <SortableThemeItem
                        key={theme.id}
                        theme={theme}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                        onPreview={openPreviewDialog}
                      />
                    ))}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Subir Nuevo Tema</DialogTitle>
            <DialogDescription className="text-slate-400">
              Completar información del tema y subir archivo PDF
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Número del Tema</Label>
                <Input
                  type="number"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      number: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Estado</Label>
                <Badge className="bg-green-500/20 text-green-400 mt-2 block w-fit">
                  Activo por defecto
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Título del Tema</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="ej. Tema 1: Fundamentos de programación"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300">Descripción Breve</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descripción del contenido del tema..."
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-slate-300">Archivo PDF</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pdfFile: e.target.files?.[0],
                    })
                  }
                  className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-500 file:text-white
                    hover:file:bg-blue-600"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
              className="border-slate-600 text-slate-300"
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Tema
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Tema</DialogTitle>
            <DialogDescription className="text-slate-400">
              Modificar información del tema y opcionalmente el archivo PDF
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Número del Tema</Label>
                <Input
                  type="number"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      number: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Archivo Actual</Label>
                {selectedTheme?.pdfFileName && (
                  <div className="flex items-center gap-2 mt-2">
                    <FileCheck className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      {selectedTheme.pdfFileName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Título del Tema</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300">Descripción Breve</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-slate-300">
                Reemplazar Archivo PDF (opcional)
              </Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pdfFile: e.target.files?.[0],
                    })
                  }
                  className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-500 file:text-white
                    hover:file:bg-blue-600"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Dejar vacío para mantener el archivo actual
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-slate-600 text-slate-300"
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Vista Previa - {selectedTheme?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Vista previa del archivo PDF
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 bg-white rounded-lg overflow-hidden">
            {selectedTheme?.pdfUrl ? (
              <iframe
                src={selectedTheme.pdfUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4" />
                  <p>No hay archivo PDF disponible</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {selectedTheme?.pdfUrl && (
              <Button
                onClick={() => window.open(selectedTheme.pdfUrl, "_blank")}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Abrir en Nueva Pestaña
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
