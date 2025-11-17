import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  Clock,
  Eye,
  RotateCcw,
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { getCurriculumThemes, type CurriculumTheme } from "@/lib/firebaseData";

interface PublicCurriculumViewerProps {
  assistantId: string;
  assistantName: string;
  isAdmin?: boolean;
}

export default function PublicCurriculumViewer({
  assistantId,
  assistantName,
  isAdmin = false,
}: PublicCurriculumViewerProps) {
  const [themes, setThemes] = useState<CurriculumTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CurriculumTheme | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadThemes();
  }, [assistantId]);

  const loadThemes = async () => {
    try {
      setLoading(true);
      setError(null);

      const curriculumThemes = await getCurriculumThemes(assistantId);

      if (curriculumThemes.length > 0) {
        const activeThemes = curriculumThemes
          .filter((theme) => theme.isActive)
          .sort((a, b) => a.order - b.order);

        setThemes(activeThemes);
      } else {
        setThemes([]);
      }
    } catch (err) {
      console.error("Error loading themes:", err);
      setError("Error al cargar el temario");
      setThemes([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleThemeSelect = (theme: CurriculumTheme) => {
    setSelectedTheme(theme);
  };

  const handleBackToList = () => {
    setSelectedTheme(null);
  };

  const handleGenerateThemes = async () => {
    if (!isAdmin) {
      console.warn("Only admins can generate themes");
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      console.log(`🎯 Admin generating themes for ${assistantName}...`);

      const { generateInitialThemes } = await import("@/lib/assistantThemeGenerator");
      await generateInitialThemes(assistantId, assistantName);

      console.log("✅ Themes generated successfully, reloading...");
      await loadThemes(); // Reload themes after generation
    } catch (err) {
      console.error("Error generating themes:", err);
      setError("Error al generar el temario. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  };

  const renderThemesList = () => (
    <div className="space-y-6">
      {/* Header Information */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              Contenidos del Temario ({themes.length} temas)
            </CardTitle>
            {isAdmin && (
              <div className="text-sm text-slate-400">
                Usa "📘 Generar TODO el Temario para este Asistente (tema por tema)" en el panel de administrador
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Themes Grid - Same layout as in the image */}
      {generating ? (
        <div className="text-center text-slate-400 py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-white mb-2">
            Generando temario inicial...
          </h3>
          <p>
            Se están creando 9 temas básicos para este asistente. Esto puede tomar unos momentos.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-sm font-semibold">
                      Tema {theme.number}:
                    </CardTitle>
                    <p className="text-slate-400 text-xs mt-1">
                      {theme.title}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Clock className="w-3 h-3" />
                  <span>30-45 min</span>
                </div>

                <Button
                  size="sm"
                  className={`w-full text-white ${
                    (theme.content && theme.content.length > 50) || theme.pdfUrl
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-600 cursor-not-allowed"
                  }`}
                  onClick={() => ((theme.content && theme.content.length > 50) || theme.pdfUrl) ? handleThemeSelect(theme) : null}
                  disabled={!(theme.content && theme.content.length > 50) && !theme.pdfUrl}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {((theme.content && theme.content.length > 50) || theme.pdfUrl) ? "Ver contenido" : "En preparación"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderPDFViewer = () => {
    if (!selectedTheme) return null;

    return (
      <div className="space-y-6">
        {/* PDF Header */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">
                  📖 Tema {selectedTheme.number}: {selectedTheme.title}
                </CardTitle>
                <p className="text-slate-400 text-sm mt-1">
                  {selectedTheme.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedTheme.pdfUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedTheme.pdfUrl, "_blank")}
                    className="bg-slate-700 border-slate-600 text-slate-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir en nueva pestaña
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToList}
                  className="bg-slate-700 border-slate-600 text-slate-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Volver al temario
                </Button>
              </div>
            </div>

            {selectedTheme.pdfFileName && (
              <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                <span>📄 {selectedTheme.pdfFileName}</span>
                {selectedTheme.pdfSize && (
                  <span>📊 {formatFileSize(selectedTheme.pdfSize)}</span>
                )}
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Content Viewer */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            <div className="w-full min-h-[80vh] bg-white rounded-lg overflow-hidden">
              {selectedTheme.content && selectedTheme.content.length > 50 ? (
                // Display HTML content generated by AI
                <div
                  className="w-full h-full overflow-auto p-6 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedTheme.content }}
                />
              ) : selectedTheme.pdfUrl ? (
                // Display PDF file
                <iframe
                  src={selectedTheme.pdfUrl}
                  className="w-full h-full border-0 min-h-[80vh]"
                  title={`${selectedTheme.title} - PDF`}
                  allow="fullscreen"
                />
              ) : (
                <div className="flex items-center justify-center h-96 text-slate-400">
                  <div className="text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Contenido en preparación
                    </h3>
                    <p>
                      Este tema está siendo preparado y estará disponible próximamente.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando temario...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Error</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button
            onClick={loadThemes}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Reintentar
          </Button>
        </div>
      );
    }

    // Check if no themes exist at all
    if (themes.length === 0) {
      return (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Temario no disponible aún</h3>
          <p className="text-slate-400 mb-4">
            El administrador está generándolo.
          </p>
        </div>
      );
    }

    return selectedTheme ? renderPDFViewer() : renderThemesList();
  };

  return (
    <Tabs defaultValue="temario" className="w-full">
      <TabsList className="grid w-full grid-cols-1 bg-slate-800 border-slate-700">
        <TabsTrigger
          value="temario"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {selectedTheme ? `Tema ${selectedTheme.number}` : "Temario Oficial"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="temario" className="space-y-6">
        {renderTabContent()}
      </TabsContent>
    </Tabs>
  );
}
