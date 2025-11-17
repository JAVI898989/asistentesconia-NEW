import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Print,
  Copy,
  FileText,
} from "lucide-react";

interface ProtectedPDFViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export function ProtectedPDFViewer({
  pdfUrl,
  title,
  onClose,
}: ProtectedPDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDoc = useRef<any>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        // Importar PDF.js dinámicamente
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        pdfDoc.current = await loadingTask.promise;
        setTotalPages(pdfDoc.current.numPages);
        setIsLoading(false);
        renderPage(1);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const renderPage = async (pageNumber: number) => {
    if (!pdfDoc.current || !canvasRef.current) return;

    const page = await pdfDoc.current.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  useEffect(() => {
    if (!isLoading && pdfDoc.current) {
      renderPage(currentPage);
    }
  }, [currentPage, scale, isLoading]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale * 1.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale / 1.2, 0.5));
  };

  // Función que bloquea acciones no permitidas
  const handleBlockedAction = (action: string) => {
    alert(
      `⚠️ ACCIÓN RESTRINGIDA: No puedes ${action} este contenido. El material está protegido por derechos de autor.`,
    );
  };

  // Prevenir click derecho
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handleBlockedAction("copiar");
  };

  // Prevenir selección de texto
  const handleSelectStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  // Prevenir arrastrar
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header con controles protegidos */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">{title}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Controles de navegación */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 bg-gray-800 rounded-lg text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Controles de zoom */}
          <div className="border-l border-gray-700 pl-2 ml-2 flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="px-2 py-1 bg-gray-800 rounded text-xs">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Botones bloqueados con alertas */}
          <div className="border-l border-gray-700 pl-2 ml-2 flex items-center space-x-2">
            <button
              onClick={() => handleBlockedAction("descargar")}
              className="p-2 hover:bg-red-600 rounded-lg transition-colors opacity-50"
              title="Descarga no permitida"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleBlockedAction("imprimir")}
              className="p-2 hover:bg-red-600 rounded-lg transition-colors opacity-50"
              title="Impresión no permitida"
            >
              <Print className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleBlockedAction("copiar")}
              className="p-2 hover:bg-red-600 rounded-lg transition-colors opacity-50"
              title="Copia no permitida"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Área del PDF protegida */}
      <div className="flex-1 flex items-center justify-center bg-gray-800 overflow-auto">
        {isLoading ? (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4 mx-auto"></div>
            <p>Cargando material protegido...</p>
          </div>
        ) : (
          <div className="max-w-full max-h-full">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full shadow-2xl border border-gray-600"
              onContextMenu={handleContextMenu}
              onSelectStart={handleSelectStart}
              onDragStart={handleDragStart}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitUserDrag: "none",
                KhtmlUserSelect: "none",
              }}
            />
          </div>
        )}
      </div>

      {/* Footer de protección */}
      <div className="bg-gray-900 text-gray-400 p-3 text-center text-sm border-t border-gray-700">
        <div className="flex items-center justify-center space-x-4">
          <span>🔒 Material protegido por derechos de autor</span>
          <span>•</span>
          <span>© 2024 Academia Tecno Pro</span>
          <span>•</span>
          <span>Solo lectura - No copiar, imprimir o descargar</span>
        </div>
      </div>

      {/* Overlay invisible para prevenir inspección */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "transparent",
          zIndex: 10,
        }}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
}

// Hook personalizado para prevenir acciones del navegador
export function usePreventPDFActions() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevenir Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+A, F12, etc.
      if (
        (e.ctrlKey &&
          (e.key === "s" || e.key === "p" || e.key === "c" || e.key === "a")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        alert("⚠️ Esta acción está deshabilitada para proteger el contenido.");
      }
    };

    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
      alert(
        "⚠️ La impresión está deshabilitada para este contenido protegido.",
      );
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, []);
}
