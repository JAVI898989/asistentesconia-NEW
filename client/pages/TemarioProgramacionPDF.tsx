import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import Header from "@/components/Header";
import TemarioProgramacionPDF from "@/components/TemarioProgramacionPDF";

export default function TemarioProgramacionPDFPage() {
  const [showPDF, setShowPDF] = useState(false);

  const handlePrint = () => {
    // Add PDF-specific styles for printing
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        .page-break-before { page-break-before: always; }
        .page-break-after { page-break-after: always; }
        body { font-family: "Times New Roman", serif !important; }
        * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
      }
    `;
    document.head.appendChild(style);

    // Trigger print
    window.print();

    // Remove style after printing
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="no-print">
        <Header />
      </div>

      {!showPDF ? (
        <div className="container mx-auto px-4 py-16 no-print">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Temario de Programación Desde Cero
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Temario completo y profesional para el curso de programación con
                Python. Diseñado para ser exportado como PDF sin errores de
                codificación.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Características del Temario:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">
                      Sin errores de codificación UTF-8
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">Acentos y eñes correctos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">
                      Tipografía monoespaciada para código
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">
                      Bloques no cortados entre páginas
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">
                      Contenido extenso y pedagógico
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm">
                      Ejemplos y ejercicios prácticos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setShowPDF(true)}
                size="lg"
                className="w-full max-w-md bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                <Eye className="w-5 h-5 mr-2" />
                Ver Temario Completo
              </Button>

              <p className="text-sm text-gray-500">
                Una vez que veas el temario, podrás exportarlo como PDF usando
                el botón de descarga
              </p>
            </div>

            <div className="mt-8 text-left bg-blue-50 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Contenido incluido:</h3>
              <ul className="text-sm space-y-1">
                <li>
                  • <strong>6 Módulos completos</strong> (120 horas académicas)
                </li>
                <li>
                  • <strong>Módulo 1:</strong> Fundamentos de la Programación
                  (20h)
                </li>
                <li>
                  • <strong>Módulo 2:</strong> Estructuras de Control (25h)
                </li>
                <li>
                  • <strong>Módulo 3:</strong> Estructuras de Datos (20h)
                </li>
                <li>
                  • <strong>Módulo 4:</strong> Funciones (18h)
                </li>
                <li>
                  • <strong>Módulo 5:</strong> Programación Orientada a Objetos
                  (22h)
                </li>
                <li>
                  • <strong>Módulo 6:</strong> Manejo de Archivos y Proyecto
                  Final (15h)
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="no-print bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={() => setShowPDF(false)}>
                    ← Volver
                  </Button>
                  <h1 className="text-lg font-semibold">
                    Temario de Programación - Vista Previa PDF
                  </h1>
                </div>
                <Button
                  onClick={handlePrint}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </div>

          <TemarioProgramacionPDF forPrint={true} />
        </div>
      )}
    </div>
  );
}
