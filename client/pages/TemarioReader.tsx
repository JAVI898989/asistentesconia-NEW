import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  FileText,
  Search,
  Download,
  ExternalLink,
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Printer
} from "lucide-react";
import { useGuardiaCivilSyllabus, useGuardiaCivilTopic } from "@/hooks/useGuardiaCivilSyllabus";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TemarioReaderProps {}

export default function TemarioReader({}: TemarioReaderProps) {
  const { assistantId, topicSlug } = useParams<{ assistantId: string; topicSlug: string }>();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  
  const { topic, loading, error } = useGuardiaCivilTopic(assistantId || null, topicSlug || null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  // Extract table of contents from markdown
  const tableOfContents = useMemo(() => {
    if (!topic?.contentMarkdown) return [];
    
    const toc: TocItem[] = [];
    const lines = topic.contentMarkdown.split('\n');
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = title.toLowerCase()
          .replace(/[^a-z0-9áéíóúñ\s]/gi, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);
        
        toc.push({
          id,
          title,
          level
        });
      }
    });
    
    return toc;
  }, [topic?.contentMarkdown]);

  // Filter content based on search
  const filteredContent = useMemo(() => {
    if (!topic?.contentMarkdown || !searchTerm) {
      return topic?.contentMarkdown || "";
    }

    const lines = topic.contentMarkdown.split('\n');
    const filteredLines = lines.filter(line => 
      line.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filteredLines.join('\n');
  }, [topic?.contentMarkdown, searchTerm]);

  // Scroll tracking for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
      
      // Update current section based on scroll position
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let current = "";
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.textContent || "";
        }
      });
      
      setCurrentSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewPdf = () => {
    if (topic?.pdfUrl) {
      setShowPdfViewer(true);
    }
  };

  const handleDownloadPdf = () => {
    if (topic?.pdfUrl) {
      window.open(topic.pdfUrl, '_blank');
    }
  };

  const handlePrintView = () => {
    const printUrl = `/print/${assistantId}/${topicSlug}`;
    window.open(printUrl, '_blank');
  };

  const goBack = () => {
    navigate(`/asistente/${assistantId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">Cargando contenido...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !topic) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <Alert className="bg-red-500/10 border-red-500/30 max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error || "Tema no encontrado"}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={goBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al temario
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700">
        <Progress value={readingProgress} className="h-1 bg-slate-700" />
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={goBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <span className="text-sm text-slate-400">
              {Math.round(readingProgress)}% leído
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden md:block">
              {currentSection}
            </span>
            {topic.pdfUrl && (
              <>
                <Button onClick={handleViewPdf} variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver PDF
                </Button>
                {isAdmin && (
                  <Button onClick={handleDownloadPdf} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                )}
              </>
            )}
            <Button onClick={handlePrintView} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Vista Impresión
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Topic Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">
                        Tema {topic.order}
                      </Badge>
                      {topic.status === 'published' && (
                        <Badge className="bg-green-500/20 text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Publicado
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-400">
                    <p>{topic.summary}</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Palabras:</span>
                        <span>{topic.wordCount || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tests:</span>
                        <span>{topic.testsCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Flashcards:</span>
                        <span>{topic.flashcardsCount || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Search */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Buscar en el tema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar conceptos..."
                      className="bg-slate-900 border-slate-600"
                    />
                  </CardContent>
                </Card>

                {/* Table of Contents */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Índice del tema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-1">
                      {tableOfContents.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left text-sm hover:text-blue-400 transition-colors ${
                            item.level === 1 ? 'font-semibold text-white' :
                            item.level === 2 ? 'font-medium text-slate-300 pl-4' :
                            'text-slate-400 pl-8'
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  <div 
                    className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-600"
                    id="content"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children, ...props }) => (
                          <h1 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/gi, '').replace(/\s+/g, '-').substring(0, 50)}>
                            {children}
                          </h1>
                        ),
                        h2: ({ children, ...props }) => (
                          <h2 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/gi, '').replace(/\s+/g, '-').substring(0, 50)}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children, ...props }) => (
                          <h3 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/gi, '').replace(/\s+/g, '-').substring(0, 50)}>
                            {children}
                          </h3>
                        ),
                        h4: ({ children, ...props }) => (
                          <h4 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/gi, '').replace(/\s+/g, '-').substring(0, 50)}>
                            {children}
                          </h4>
                        ),
                        h5: ({ children, ...props }) => (
                          <h5 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/gi, '').replace(/\s+/g, '-').substring(0, 50)}>
                            {children}
                          </h5>
                        ),
                        h6: ({ children, ...props }) => (
                          <h6 {...props} id={String(children).toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/gi, '').replace(/\s+/g, '-').substring(0, 50)}>
                            {children}
                          </h6>
                        ),
                      }}
                    >
                      {searchTerm ? filteredContent : topic.contentMarkdown}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* PDF Viewer Modal */}
              {showPdfViewer && topic.pdfUrl && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-slate-800 rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                      <h3 className="text-lg font-semibold">{topic.title} - PDF</h3>
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <Button onClick={handleDownloadPdf} size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </Button>
                        )}
                        <Button onClick={() => setShowPdfViewer(false)} size="sm">
                          Cerrar
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <iframe
                        src={`${topic.pdfUrl}#toolbar=0&view=fitH&zoom=page-width&v=${topic.version || 1}`}
                        className="w-full h-full border-0 rounded"
                        title={`PDF: ${topic.title}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
