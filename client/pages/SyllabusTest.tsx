import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Eye, Plus } from "lucide-react";
import SyllabusManager from "@/components/admin/SyllabusManager";
import { useAssistantSyllabi } from "@/hooks/useSyllabus";

export default function SyllabusTest() {
  const [managerOpen, setManagerOpen] = useState(false);
  const testAssistantId = "auxiliar-administrativo-estado";
  const testAssistantName = "Auxiliar Administrativo del Estado";

  const { syllabi, loading, error } = useAssistantSyllabi(testAssistantId);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sistema de Temarios - Prueba
          </h1>
          <p className="text-gray-600 mb-8">
            Prueba del sistema de creación de temarios PDF con IA
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Temarios de {testAssistantName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    {loading ? "Cargando..." : `${syllabi.length} temario${syllabi.length !== 1 ? 's' : ''} disponible${syllabi.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
                <Button onClick={() => setManagerOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Gestionar Temarios
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && syllabi.length === 0 && (
                <Alert>
                  <FileText className="w-4 h-4" />
                  <AlertDescription>
                    No hay temarios creados. Haz clic en "Gestionar Temarios" para crear el primero.
                  </AlertDescription>
                </Alert>
              )}

              {syllabi.length > 0 && (
                <div className="grid gap-4">
                  {syllabi.map((syllabus) => (
                    <Card key={syllabus.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{syllabus.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Creado: {new Date(syllabus.createdAtMs).toLocaleDateString('es-ES')}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {syllabus.contentMarkdown.length.toLocaleString()} caracteres
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {syllabus.pdf?.downloadURL ? (
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 text-sm font-medium">PDF Listo</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Open in new tab for testing
                                    window.open(syllabus.pdf!.downloadURL, '_blank');
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver PDF
                                </Button>
                              </div>
                            ) : (
                              <span className="text-orange-600 text-sm">Generando PDF...</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✅ Implementado:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Generación de contenido con GPT-4/GPT-4o-mini</li>
                  <li>• Estructura de 10-15 páginas garantizada</li>
                  <li>• Almacenamiento en Firestore</li>
                  <li>• Generación de PDF profesional</li>
                  <li>• Subida a Firebase Storage</li>
                  <li>• Visor PDF sin descarga</li>
                  <li>• Actualizaciones en tiempo real</li>
                  <li>• Sistema de versiones</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">📋 Estructura del Temario:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Objetivos de aprendizaje</li>
                  <li>• Resumen ejecutivo</li>
                  <li>• Desarrollo teórico</li>
                  <li>• Ejemplos prácticos</li>
                  <li>• 20 preguntas tipo test</li>
                  <li>• 5 preguntas abiertas</li>
                  <li>• 2 ejercicios paso a paso</li>
                  <li>• Glosario (25+ términos)</li>
                  <li>• Referencias normativas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Syllabus Manager */}
      <SyllabusManager
        isOpen={managerOpen}
        onClose={() => setManagerOpen(false)}
        assistantId={testAssistantId}
        assistantName={testAssistantName}
      />
    </div>
  );
}
