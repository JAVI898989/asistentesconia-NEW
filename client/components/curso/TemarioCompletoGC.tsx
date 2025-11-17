import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BookOpen,
  CheckCircle,
  Lock,
  PlayCircle,
  FileText,
  Target,
  Clock,
  Star,
  Download,
  Users,
  Award,
  Eye,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  LayoutDashboard,
  List,
} from "lucide-react";
import { useGuardiaCivilSyllabus } from "@/hooks/useGuardiaCivilSyllabus";
import BlurredPreview from "@/components/BlurredPreview";
import SyllabusPdfViewer from "@/components/SyllabusPdfViewer";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import TemarioEnhanced from "./TemarioEnhanced";

interface TemarioCompletoGCProps {
  assistantId: string;
  hasAccess: boolean;
  onTopicSelect?: (topicSlug: string) => void;
}

export default function TemarioCompletoGC({
  assistantId,
  hasAccess,
  onTopicSelect,
}: TemarioCompletoGCProps) {
  const { syllabi, loading, error, statistics, refresh } = useGuardiaCivilSyllabus(assistantId);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentStudyTopic, setCurrentStudyTopic] = useState<any>(null);
  const [enhancedView, setEnhancedView] = useState(false);
  // Admin status for conditional deep-linking
  const isAdmin = useIsAdmin();

  // Debug logging
  console.log("📋 TemarioCompletoGC - Assistant ID:", assistantId);
  console.log("📚 TemarioCompletoGC - Syllabi loaded:", syllabi?.length || 0);
  console.log("��� TemarioCompletoGC - Has access:", hasAccess);
  console.log("📊 TemarioCompletoGC - Statistics:", statistics);

  const handleTopicSelect = (topicSlug: string) => {
    setSelectedTopic(topicSlug);
    onTopicSelect?.(topicSlug);
  };

  const handleViewPDF = (topic: any) => {
    if (topic.pdfUrl) {
      window.open(topic.pdfUrl, '_blank');
    }
  };

  const handleStudyTopic = (topic: any) => {
    if (!hasAccess) return;

    // If PDF exists, open study mode with PDF viewer
    if (topic.pdfUrl) {
      setCurrentStudyTopic(topic);
      setStudyMode(true);
    } else {
      // PDF not available - show appropriate message
      // This will be handled in the UI
      console.log("PDF not available for topic:", topic.slug);
    }
  };

  const handleBackToTopics = () => {
    setStudyMode(false);
    setCurrentStudyTopic(null);
  };

  const handleRegeneratePdf = async (topic: any) => {
    // This would trigger PDF regeneration for a specific topic
    console.log('Regenerating PDF for:', topic.slug);
    // Implementation would call the PDF generation service
  };

  const progressPercentage = syllabi?.length && statistics?.completed !== undefined && statistics?.total !== undefined
    ? Math.round((statistics.completed / statistics.total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-slate-400 mb-4">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p className="text-lg">Cargando temario de Guardia Civil...</p>
              <p className="text-sm">
                Obteniendo contenido generado del sistema PERFECTO
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-4">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-lg">Error cargando temario</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={refresh} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Enhanced view mode - show enhanced temario interface
  if (enhancedView) {
    return (
      <div className="space-y-4">
        {/* Enhanced view header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => setEnhancedView(false)} variant="outline" size="sm">
              <List className="w-4 h-4 mr-2" />
              Vista Clásica
            </Button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-green-400" />
                Vista Profesional con Índice Lateral
              </h2>
              <p className="text-slate-400">Navegación avanzada por temas con formato visual mejorado</p>
            </div>
          </div>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Enhanced Temario Component */}
        <TemarioEnhanced
          assistantId={assistantId}
          hasAccess={hasAccess}
          onTopicSelect={onTopicSelect}
        />
      </div>
    );
  }

  // Study mode - show PDF viewer
  if (studyMode && currentStudyTopic) {
    return (
      <div className="space-y-4">
        {/* Study header */}
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToTopics} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al temario
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white">{currentStudyTopic.title}</h2>
            <p className="text-slate-400">{currentStudyTopic.summary}</p>
          </div>
        </div>

        {/* PDF Viewer */}
        <SyllabusPdfViewer
          pdfUrl={currentStudyTopic.pdfUrl || ""}
          version={currentStudyTopic.version || 1}
          title={currentStudyTopic.title}
          onRegeneratePdf={() => handleRegeneratePdf(currentStudyTopic)}
          isAdmin={hasAccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Temario Guardia Civil PERFECTO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">
                Sistema de Generación Avanzado
              </h3>
              <p className="text-slate-300 mb-4">
                Contenido profundo y completo para oposiciones de Guardia Civil,
                generado con IA y quality gates para garantizar calidad profesional.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Temas totales:</span>
                  <span className="text-slate-300">{statistics?.total || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Temas publicados:</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    {statistics?.completed || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tests totales:</span>
                  <span className="text-slate-300">{statistics?.totalTests || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Flashcards totales:</span>
                  <span className="text-slate-300">{statistics?.totalFlashcards || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PDFs generados:</span>
                  <span className="text-slate-300">{statistics?.withPdf || 0}</span>
                </div>
                {(statistics?.averageWordCount || 0) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Promedio palabras:</span>
                    <span className="text-slate-300">{statistics.averageWordCount}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">
                Progreso General
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Completado:</span>
                  <span className="text-green-400 font-semibold">
                    {statistics?.completed || 0} / {statistics?.total || 0}
                  </span>
                </div>
                <Progress value={isNaN(progressPercentage) ? 0 : progressPercentage} className="h-3" />
                <div className="text-center text-slate-300 text-sm">
                  {isNaN(progressPercentage) ? 0 : progressPercentage}% completado
                </div>

                {hasAccess && (
                  <div className="pt-2">
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Acceso completo desbloqueado
                    </Badge>
                  </div>
                )}

                {!hasAccess && (
                  <div className="pt-2">
                    <Badge className="bg-slate-600 text-slate-400">
                      <Lock className="w-3 h-3 mr-1" />
                      Vista previa - Acceso limitado
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics List */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Temas del Curso ({syllabi?.length || 0})
            </h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setEnhancedView(true)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Vista Profesional
              </Button>
              <Button onClick={refresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Enhanced View Promotion */}
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-white">🆕 Nueva Vista Profesional Disponible</h3>
                    <p className="text-sm text-slate-300">
                      Índice lateral, navegación mejorada y formato visual atractivo para una mejor experiencia de estudio.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setEnhancedView(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Probar Vista Profesional
                </Button>
              </div>
            </CardContent>
          </Card>

        {!syllabi || syllabi.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-slate-400 mb-4">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg">No hay contenido generado aún</p>
                <p className="text-sm">
                  {isAdmin
                    ? "El temario de Guardia Civil debe ser generado desde el panel de administración."
                    : "El contenido estará disponible próximamente."
                  }
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  Contenido pendiente de generación
                </Badge>
                {isAdmin && (
                  <Button
                    onClick={() => window.open('/admin/contenido', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir al Panel de Contenido
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          syllabi.map((topic, index) => (
            <BlurredPreview
              key={`${topic.slug}-${index}`}
              isLocked={!hasAccess}
              title="Contenido del tema restringido"
              description="Suscríbete para acceder al contenido completo del tema"
            >
              <Card
                className={`bg-slate-800/50 border-slate-700 transition-all duration-200 ${
                  hasAccess
                    ? "hover:border-blue-500/50 cursor-pointer"
                    : "opacity-75"
                }`}
                onClick={() => hasAccess && handleTopicSelect(topic.slug)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold">
                          {topic.order}
                        </div>
                        <CardTitle className="text-white">
                          {topic.title}
                        </CardTitle>
                        {topic.status === 'published' && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {topic.status === 'generating' && (
                          <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />
                        )}
                        {!hasAccess && (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <p className="text-slate-400 mb-3">{topic.summary}</p>

                      {/* Quality indicators */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(topic.wordCount && !isNaN(topic.wordCount) && topic.wordCount >= 2800) && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            ✓ {topic.wordCount} palabras
                          </Badge>
                        )}
                        {/* Test quality indicators */}
                        {(topic.testsCount && !isNaN(topic.testsCount) && topic.testsCount >= 5) && (
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                            ✓ {topic.testsCount} tests
                          </Badge>
                        )}
                        {(topic.testsCount && !isNaN(topic.testsCount) && topic.testsCount > 0 && topic.testsCount < 5) && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                            ⚠ {topic.testsCount}/5 tests
                          </Badge>
                        )}
                        {(!topic.testsCount || isNaN(topic.testsCount) || topic.testsCount === 0) && (
                          <Badge className="bg-red-500/20 text-red-400 text-xs">
                            ✗ 0/5 tests
                          </Badge>
                        )}
                        {(topic.flashcardsCount && !isNaN(topic.flashcardsCount) && topic.flashcardsCount >= 40) && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                            ✨ {topic.flashcardsCount} flashcards
                          </Badge>
                        )}
                        {/* Additional flashcard quality indicators */}
                        {(topic.flashcardsCount && !isNaN(topic.flashcardsCount) && topic.flashcardsCount > 0 && topic.flashcardsCount < 40) && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                            ⚠ {topic.flashcardsCount}/40 flashcards
                          </Badge>
                        )}
                        {(!topic.flashcardsCount || isNaN(topic.flashcardsCount) || topic.flashcardsCount === 0) && (
                          <Badge className="bg-red-500/20 text-red-400 text-xs">
                            ✗ 0/40 flashcards
                          </Badge>
                        )}
                        {topic.pdfUrl && !topic.pdfReduced && (
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            ✓ PDF generado
                          </Badge>
                        )}
                        {topic.pdfUrl && topic.pdfReduced && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                            📄 PDF resumido
                          </Badge>
                        )}
                        {topic.pdfTooLarge && (
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                            📄 Contenido extenso
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Access indicators */}
                    {hasAccess && (
                      <div className="ml-4">
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acceso completo
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* PDF Preview - Show directly if available */}
                  {topic.pdfUrl && hasAccess && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-slate-300">📄 PDF del Tema</h4>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => window.open(`/asistente/${assistantId}/temario/${topic.slug}`, '_blank')}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs mr-2"
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            Leer
                          </Button>
                          <Button
                            onClick={() => handleStudyTopic(topic)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            <PlayCircle className="w-3 h-3 mr-1" />
                            Estudiar PDF
                          </Button>
                          <Button
                            onClick={() => window.open(topic.pdfUrl, '_blank')}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Descargar
                          </Button>
                        </div>
                      </div>

                      {/* Embedded PDF preview */}
                      <div className="bg-slate-900/50 rounded-lg border border-slate-600 overflow-hidden">
                        <iframe
                          src={`${topic.pdfUrl}#toolbar=0&view=fitH&zoom=page-width&page=1`}
                          className="w-full h-64 border-0"
                          title={`PDF: ${topic.title}`}
                          loading="lazy"
                        />
                      </div>

                      <div className="mt-2 text-xs text-slate-400 text-center">
                        Versión {topic.version || 1} • Haz clic en "Estudiar" para ver completo
                      </div>
                    </div>
                  )}

                  {/* No PDF available */}
                  {!topic.pdfUrl && hasAccess && (
                    <div className={`mb-4 p-4 rounded-lg text-center ${
                      topic.pdfTooLarge
                        ? 'bg-blue-500/10 border border-blue-500/30'
                        : 'bg-orange-500/10 border border-orange-500/30'
                    }`}>
                      <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${
                        topic.pdfTooLarge ? 'text-blue-400' : 'text-orange-400'
                      }`} />
                      <p className={`font-medium ${
                        topic.pdfTooLarge ? 'text-blue-400' : 'text-orange-400'
                      }`}>
                        {topic.pdfTooLarge ? 'Contenido disponible (sin PDF)' : 'PDF no disponible'}
                      </p>
                      <p className={`text-xs mt-1 ${
                        topic.pdfTooLarge ? 'text-blue-300' : 'text-orange-300'
                      }`}>
                        {topic.pdfTooLarge
                          ? 'El contenido es demasiado extenso para generar PDF. El material está disponible en formato texto.'
                          : topic.pdfGenerationFailed
                            ? `Error en generación: ${topic.lastPdfError || 'Error desconocido'}`
                            : 'Este tema aún no tiene PDF generado'
                        }
                      </p>
                      {!topic.pdfTooLarge && (
                        <div className="mt-2 space-y-2">
                          <Button
                            onClick={() => window.open(`/asistente/${assistantId}/temario/${topic.slug}`, '_blank')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-xs w-full"
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            Leer mientras se genera PDF
                          </Button>
                          {isAdmin && (
                            <Button
                              onClick={() => window.open('/admin/contenido', '_blank')}
                              size="sm"
                              variant="outline"
                              className="text-xs w-full"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {topic.pdfGenerationFailed ? 'Reintentar en Panel' : 'Generar en Panel Admin'}
                            </Button>
                          )}
                        </div>
                      )}
                      {topic.pdfTooLarge && (
                        <div className="mt-2 space-y-2">
                          <div className="text-xs text-blue-400">
                            ℹ️ El contenido completo está disponible en formato web y en tests/flashcards
                          </div>
                          <Button
                            onClick={() => window.open(`/asistente/${assistantId}/temario/${topic.slug}`, '_blank')}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-xs w-full"
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            Leer contenido completo
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content preview for non-admin users */}
                  {topic.status === 'published' && hasAccess && topic.contentMarkdown && !topic.pdfUrl && (
                    <div className="mb-4 p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                      <div className="text-slate-300 text-sm line-clamp-3">
                        {topic.contentMarkdown.substring(0, 200).replace(/[#*]/g, '')}...
                      </div>
                    </div>
                  )}

                  {/* Topic Stats */}
                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-slate-400">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {(topic.testsCount && !isNaN(topic.testsCount)) ? topic.testsCount : 0} tests
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {(topic.flashcardsCount && !isNaN(topic.flashcardsCount)) ? topic.flashcardsCount : 0} flashcards
                        </span>
                        {(topic.wordCount && !isNaN(topic.wordCount)) && (
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {topic.wordCount} palabras
                          </span>
                        )}
                        {(topic.pageCount && !isNaN(topic.pageCount)) && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ~{topic.pageCount} páginas
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            topic.status === 'published'
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }
                        >
                          {topic.status === 'published' ? 'Publicado' : 'Generando'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurredPreview>
          ))
        )}
      </div>

      {/* Course Summary */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Sistema Guardia Civil PERFECTO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-3">
                Características del Sistema
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Contenido mínimo 2800+ palabras por tema</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Exactamente 20 tests por tema con explicaciones</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Mínimo 45 flashcards por tema</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>PDFs sin cortes de página en UTF-8</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">
                Quality Gates Automáticos
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Validación automática de contenido</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Regeneración si no cumple estándares</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Estructura pedagógica profesional</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Base legal actualizada y específica</span>
                </li>
              </ul>
            </div>
          </div>

          {!hasAccess && (
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
              <p className="text-slate-400 text-center">
                <Lock className="w-4 h-4 inline mr-2" />
                Obtén acceso completo para desbloquear todo el contenido de Guardia Civil PERFECTO
              </p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
