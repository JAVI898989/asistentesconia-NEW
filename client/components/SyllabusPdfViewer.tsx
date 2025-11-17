import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertTriangle, Download, Eye } from "lucide-react";

interface SyllabusPdfViewerProps {
  pdfUrl: string;
  version?: number;
  title?: string;
  onRegeneratePdf?: () => void;
  isAdmin?: boolean;
}

export default function SyllabusPdfViewer({ 
  pdfUrl, 
  version = 1, 
  title = "Documento PDF",
  onRegeneratePdf,
  isAdmin = false
}: SyllabusPdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!pdfUrl) {
    return (
      <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center bg-slate-50 rounded-xl border">
        <div className="text-center p-8">
          <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">PDF no disponible</h3>
          <p className="text-slate-500 mb-4">
            Este tema aún no tiene un PDF generado.
          </p>
          {isAdmin && onRegeneratePdf && (
            <Button onClick={onRegeneratePdf} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generar PDF ahora
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Add PDF viewer parameters for better display
  const pdfSrc = `${pdfUrl}#toolbar=0&view=fitH&zoom=page-width&v=${version}`;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload by changing key
    const iframe = document.querySelector(`iframe[src="${pdfSrc}"]`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-600">Versión {version}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(pdfUrl, '_blank')}
            className="text-slate-600"
          >
            <Download className="w-4 h-4 mr-1" />
            Descargar
          </Button>
          {isAdmin && onRegeneratePdf && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegeneratePdf}
              className="text-blue-600"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Regenerar
            </Button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="w-full h-[calc(100vh-220px)] flex items-center justify-center bg-slate-50 rounded-xl border">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
            <p className="text-slate-600">Cargando PDF...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>Error al cargar el PDF. Verifica que el archivo existe y es accesible.</span>
              <Button onClick={handleRetry} size="sm" variant="outline" className="ml-4">
                <RefreshCw className="w-4 h-4 mr-1" />
                Reintentar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* PDF Viewer */}
      <div className={`w-full h-[calc(100vh-220px)] rounded-xl overflow-hidden border shadow-sm ${isLoading || hasError ? 'hidden' : ''}`}>
        <iframe
          key={`pdf-${version}-${Date.now()}`} // Force reload on version change
          src={pdfSrc}
          className="w-full h-full"
          loading="eager"
          referrerPolicy="no-referrer"
          allow="clipboard-write"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
          }}
          title={`PDF: ${title}`}
        />
      </div>
    </div>
  );
}
