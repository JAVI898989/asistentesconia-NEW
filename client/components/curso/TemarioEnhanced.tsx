import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  Menu,
  X,
  FileText,
  Clock,
  Target,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Download,
  PlayCircle,
  ArrowLeft,
} from "lucide-react";
import { useAssistantSyllabus } from "@/hooks/useAssistantSyllabus";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { recordTopicVisit } from "@/lib/assistantProgress";
import BlurredPreview from "@/components/BlurredPreview";
import "../../styles/temario-enhanced.css";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface TemarioEnhancedProps {
  assistantId: string;
  hasAccess: boolean;
  onTopicSelect?: (topicId: string) => void;
  onTopicsLoaded?: (topics: any[]) => void;
  userId?: string | null;
}

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TopicContentProps {
  content: string;
  title: string;
}

const TopicContent: React.FC<TopicContentProps> = ({ content, title }) => {
  const looksLikeHtml = /<\w+[^>]*>/i.test(content) || content.includes('</');

  if (!looksLikeHtml) {
    return (
      <div className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  const processedContent = content
    .replace(/<div class=\"temario-header\">/g, '<div class="temario-header fade-in">')
    .replace(/<div class=\"objectives-section\">/g, '<div class="objectives-section bounce-in">')
    .replace(/<div class=\"theoretical-development\">/g, '<div class="theoretical-development fade-in">')
    .replace(/<div class=\"visual-elements\">/g, '<div class="visual-elements fade-in">')
    .replace(/<div class=\"practical-examples\">/g, '<div class="practical-examples fade-in">')
    .replace(/<div class=\"key-data-section\">/g, '<div class="key-data-section bounce-in">')
    .replace(/<div class=\"summary-section\">/g, '<div class="summary-section fade-in">');

  return (
    <div className="content-display" dangerouslySetInnerHTML={{ __html: processedContent }} />
  );
};

export default function TemarioEnhanced({
  assistantId,
  hasAccess,
  onTopicSelect,
  onTopicsLoaded,
  userId,
}: TemarioEnhancedProps) {
  const { topics, loading, error, statistics, refresh } = useAssistantSyllabus(assistantId);
  const syllabi = topics;
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTopicData, setSelectedTopicData] = useState<any>(null);
  const [temarioMain, setTemarioMain] = useState<{ contenido: string; temas: any[] } | null>(null);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (syllabi && syllabi.length > 0) {
      onTopicsLoaded?.(syllabi);
    }

    if (syllabi && syllabi.length > 0 && !selectedTopic) {
      const firstTopic = syllabi[0];
      const topicId = firstTopic.topicId || firstTopic.id || firstTopic.slug;
      setSelectedTopic(topicId);
      setSelectedTopicData(firstTopic);
      onTopicSelect?.(topicId);
    }
  }, [syllabi, selectedTopic, onTopicSelect, onTopicsLoaded]);

  useEffect(() => {
    if (selectedTopic && syllabi) {
      const topicData = syllabi.find((topic) => (topic.topicId || topic.id || topic.slug) === selectedTopic);
      setSelectedTopicData(topicData || null);
    }
  }, [selectedTopic, syllabi]);

  useEffect(() => {
    if (!selectedTopicData || !hasAccess || !userId) {
      return;
    }
    const topicId = selectedTopicData.topicId || selectedTopicData.id || selectedTopicData.slug;
    recordTopicVisit({
      assistantId,
      userId,
      topicId,
      title: selectedTopicData.title,
    }).catch((error) => {
      console.error("Error recording topic visit:", error);
    });
  }, [assistantId, hasAccess, selectedTopicData, userId]);

  // Realtime temario main subscription
  useEffect(() => {
    try {
      const mainRef = doc(db, "assistants", assistantId, "temario", "main");
      const unsub = onSnapshot(mainRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          if (data && (data.contenido || (Array.isArray(data.temas) && data.temas.length > 0))) {
            setTemarioMain({ contenido: data.contenido || '', temas: data.temas || [] });
          } else {
            setTemarioMain(null);
          }
        } else {
          setTemarioMain(null);
        }
      }, () => setTemarioMain(null));
      return () => unsub();
    } catch {
      // ignore
    }
  }, [assistantId]);

  const handleTopicSelect = (topicSlug: string) => {
    setSelectedTopic(topicSlug);
    onTopicSelect?.(topicSlug);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getTopicProgress = (topic: any): 'completed' | 'partial' | 'pending' => {
    if (topic.status === 'published' && topic.pdfUrl && topic.testsCount >= 5 && topic.flashcardsCount >= 40) {
      return 'completed';
    } else if (topic.status === 'published' || topic.testsCount > 0 || topic.flashcardsCount > 0) {
      return 'partial';
    }
    return 'pending';
  };

  if (loading) {
    return (
      <div className="temario-enhanced">
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center space-y-4">
            <RefreshCw className="w-12 h-12 mx-auto text-blue-400 animate-spin" />
            <h3 className="text-xl font-semibold text-white">Cargando Temario</h3>
            <p className="text-slate-400">Obteniendo contenido del sistema avanzado...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="temario-enhanced">
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-400" />
            <h3 className="text-xl font-semibold text-white">Error al cargar</h3>
            <p className="text-slate-400">{error}</p>
            <Button onClick={refresh} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!syllabi || syllabi.length === 0) {
    return (
      <div className="temario-enhanced">
        <div className="flex items-center justify-center h-full w-full">
          <div className="empty-state">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3>No hay contenido disponible</h3>
            <p>
              {isAdmin
                ? "El temario debe ser generado desde el panel de administración."
                : "El contenido estará disponible próximamente."
              }
            </p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="temario-enhanced">
      {/* Show main temario if available */}
      {temarioMain && temarioMain.contenido && (
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" /> Temario principal
              </h2>
              <TopicContent title="Temario principal" content={temarioMain.contenido} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sidebar with Topic Index */}
      <div className={`temario-sidebar ${sidebarCollapsed ? 'collapsed' : ''} slide-in-left`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {!sidebarCollapsed && (
          <>
            <div className="sidebar-header">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                Temario {syllabi.length > 0 && syllabi[0].assistantId?.includes('guardia') ? 'Guardia Civil' : 'Completo'}
              </h2>
              <div className="text-sm text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Temas:</span>
                  <span className="text-white">{statistics?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completados:</span>
                  <span className="text-green-400">{statistics?.completed || 0}</span>
                </div>
                {statistics?.total && statistics?.completed && (
                  <Progress 
                    value={(statistics.completed / statistics.total) * 100} 
                    className="h-2 mt-2" 
                  />
                )}
              </div>
            </div>

            <div className="topics-list">
              {syllabi.map((topic, index) => {
                const progress = getTopicProgress(topic);
                const topicKey = topic.topicId || topic.id || topic.slug;
                const isActive = selectedTopic === topicKey;

                return (
                  <BlurredPreview
                    key={`${topicKey}-${index}`}
                    isLocked={!hasAccess}
                    title="Tema restringido"
                    description="Suscríbete para acceder"
                  >
                    <div
                      className={`topic-item ${isActive ? 'active' : ''} ${!hasAccess ? 'opacity-50' : 'cursor-pointer'}`}
                      onClick={() => hasAccess && handleTopicSelect(topicKey)}
                    >
                      <div className="topic-number">
                        {topic.order || index + 1}
                      </div>
                      <div className="topic-title">
                        {topic.title}
                        <div className="flex items-center gap-1 mt-1">
                          {topic.testsCount > 0 && (
                            <Badge className="text-xs bg-blue-500/20 text-blue-400">
                              {topic.testsCount}T
                            </Badge>
                          )}
                          {topic.flashcardsCount > 0 && (
                            <Badge className="text-xs bg-purple-500/20 text-purple-400">
                              {topic.flashcardsCount}F
                            </Badge>
                          )}
                          {topic.pdfUrl && (
                            <Badge className="text-xs bg-green-500/20 text-green-400">
                              PDF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className={`topic-progress ${progress}`} />
                    </div>
                  </BlurredPreview>
                );
              })}
            </div>
          </>
        )}

        {sidebarCollapsed && (
          <div className="topics-list">
            {syllabi.map((topic, index) => {
              const progress = getTopicProgress(topic);
              const topicKey = topic.topicId || topic.id || topic.slug;
              const isActive = selectedTopic === topicKey;

              return (
                <div
                  key={`${topicKey}-${index}`}
                  className={`topic-item collapsed ${isActive ? 'active' : ''} ${!hasAccess ? 'opacity-50' : 'cursor-pointer'}`}
                  onClick={() => hasAccess && handleTopicSelect(topicKey)}
                  title={topic.title}
                >
                  <div className="topic-number">
                    {topic.order || index + 1}
                  </div>
                  <div className={`topic-progress ${progress}`} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="temario-content">
        {selectedTopicData ? (
          <BlurredPreview
            isLocked={!hasAccess}
            title="Contenido del tema restringido"
            description="Suscríbete para acceder al contenido completo del tema"
          >
            <div className="fade-in">
              {/* Content Header */}
              <div className="content-header">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="main-title">
                      Tema {selectedTopicData.order || 1}: {selectedTopicData.title}
                    </h1>
                    <p className="subtitle">
                      {selectedTopicData.summary || "Contenido profesional para oposiciones"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTopicData.pdfUrl && (
                      <Button
                        onClick={() => window.open(selectedTopicData.pdfUrl, '_blank')}
                        className="bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </Button>
                    )}
                    <Button
                      onClick={() => window.open(`/asistente/${assistantId}/temario/${selectedTopicData.slug}`, '_blank')}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Completo
                    </Button>
                  </div>
                </div>

                {/* Topic Statistics */}
                <div className="flex items-center gap-4 mt-4 text-white/80">
                  {selectedTopicData.wordCount && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{selectedTopicData.wordCount} palabras</span>
                    </div>
                  )}
                  {selectedTopicData.testsCount && (
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">{selectedTopicData.testsCount} tests</span>
                    </div>
                  )}
                  {selectedTopicData.flashcardsCount && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">{selectedTopicData.flashcardsCount} flashcards</span>
                    </div>
                  )}
                  {selectedTopicData.pageCount && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">~{selectedTopicData.pageCount} páginas</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Display */}
              {selectedTopicData.contentMarkdown ? (
                <TopicContent 
                  content={selectedTopicData.contentMarkdown} 
                  title={selectedTopicData.title}
                />
              ) : selectedTopicData.content ? (
                <TopicContent 
                  content={selectedTopicData.content} 
                  title={selectedTopicData.title}
                />
              ) : (
                /* PDF Viewer or Placeholder */
                <div className="content-display">
                  {selectedTopicData.pdfUrl ? (
                    <div className="space-y-4">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                              <FileText className="w-5 h-5 text-blue-400" />
                              Documento PDF del Tema
                            </h3>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => window.open(`/asistente/${assistantId}/temario/${selectedTopicData.slug}`, '_blank')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Estudiar
                              </Button>
                              <Button
                                onClick={() => window.open(selectedTopicData.pdfUrl, '_blank')}
                                variant="outline"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar
                              </Button>
                            </div>
                          </div>

                          {/* PDF Embed */}
                          <div className="bg-white rounded-lg overflow-hidden" style={{ height: '70vh' }}>
                            <iframe
                              src={`${selectedTopicData.pdfUrl}#toolbar=1&view=fitH&zoom=page-width`}
                              className="w-full h-full border-0"
                              title={`PDF: ${selectedTopicData.title}`}
                            />
                          </div>

                          <div className="mt-4 text-center text-sm text-slate-400">
                            Versión {selectedTopicData.version || 1} • 
                            Generado el {new Date(selectedTopicData.createdAt?.toDate?.() || selectedTopicData.createdAt).toLocaleDateString('es-ES')}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    /* No Content Available */
                    <div className="empty-state">
                      <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50 text-orange-400" />
                      <h3>Contenido no disponible</h3>
                      <p>
                        Este tema aún no tiene contenido generado o se está procesando.
                      </p>
                      {isAdmin && (
                        <Button
                          onClick={() => window.open('/admin/contenido', '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Generar en Panel Admin
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Topic Navigation */}
              {syllabi.length > 1 && (
                <div className="flex justify-between items-center p-6 bg-slate-800/30 border-t border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const currentIndex = syllabi.findIndex(t => t.slug === selectedTopic);
                      if (currentIndex > 0) {
                        handleTopicSelect(syllabi[currentIndex - 1].slug);
                      }
                    }}
                    disabled={syllabi.findIndex(t => t.slug === selectedTopic) === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tema Anterior
                  </Button>

                  <div className="text-center">
                    <div className="text-sm text-slate-400">
                      Tema {(syllabi.findIndex(t => t.slug === selectedTopic) + 1)} de {syllabi.length}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const currentIndex = syllabi.findIndex(t => t.slug === selectedTopic);
                      if (currentIndex < syllabi.length - 1) {
                        handleTopicSelect(syllabi[currentIndex + 1].slug);
                      }
                    }}
                    disabled={syllabi.findIndex(t => t.slug === selectedTopic) === syllabi.length - 1}
                  >
                    Siguiente Tema
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </BlurredPreview>
        ) : (
          /* No Topic Selected */
          <div className="empty-state">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3>Selecciona un tema</h3>
            <p>
              Elige un tema del índice lateral para ver su contenido.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
