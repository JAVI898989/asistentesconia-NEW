import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Eye } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface EmbeddedPdfViewerProps {
  pdfUrl: string;
  title: string;
  version?: number;
  className?: string;
  height?: string;
  showControls?: boolean;
}

export default function EmbeddedPdfViewer({
  pdfUrl,
  title,
  version = 1,
  className = "",
  height = "600px",
  showControls = true
}: EmbeddedPdfViewerProps) {
  const isAdmin = useIsAdmin();

  // Construct PDF URL with viewer parameters and cache-busting
  const viewerUrl = `${pdfUrl}#toolbar=0&view=fitH&zoom=page-width&v=${version}`;

  const handleDownload = () => {
    if (isAdmin) {
      // Admin can download directly
      window.open(pdfUrl, '_blank');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(viewerUrl, '_blank');
  };

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 overflow-hidden ${className}`}>
      {/* Controls header */}
      {showControls && (
        <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/90">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">{title}</span>
            <span className="text-xs text-slate-500">v{version}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenInNewTab}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Abrir
            </Button>
            
            {isAdmin && (
              <Button
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Descargar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* PDF iframe */}
      <div style={{ height }} className="w-full">
        <iframe
          src={viewerUrl}
          className="w-full h-full border-0"
          title={`PDF: ${title}`}
          loading="lazy"
          style={{
            backgroundColor: '#1e293b' // Slate background for loading
          }}
        />
      </div>

      {/* Loading overlay for better UX */}
      <div 
        className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 pointer-events-none"
        style={{
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm">Cargando PDF...</p>
        </div>
      </div>

      {/* Footer info for students */}
      {!isAdmin && (
        <div className="p-2 bg-slate-900/50 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            PDF disponible para lectura • Versión {version}
          </p>
        </div>
      )}
    </div>
  );
}
