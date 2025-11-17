import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import AssistantImageManager from '@/components/admin/AssistantImageManager';
import { subscribeToAssistant, type AssistantWithImage } from '@/lib/assistantImageService';

// Mock assistant data for testing
const mockAssistants = [
  {
    id: 'auxiliar-administrativo-estado',
    name: 'Auxiliar Administrativo del Estado',
    description: 'Preparación completa para el cuerpo de Auxiliares Administrativos del Estado',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: 'guardia-civil',
    name: 'Guardia Civil',
    description: 'Asistente especializado en oposiciones de Guardia Civil',
    image: 'https://images.unsplash.com/photo-1561189398-7397fb9e9df4?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: 'mir',
    name: 'Médico Interno Residente (MIR)',
    description: 'Preparación para el MIR - Médico Interno Residente',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=600&fit=crop&crop=center'
  }
];

export default function AssistantImageTest() {
  const [selectedAssistantId, setSelectedAssistantId] = useState('auxiliar-administrativo-estado');
  const [assistantData, setAssistantData] = useState<AssistantWithImage | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Real-time subscription to the selected assistant
  useEffect(() => {
    if (!selectedAssistantId) return;

    console.log(`🔗 Subscribing to assistant: ${selectedAssistantId}`);
    setIsConnected(false);

    const unsubscribe = subscribeToAssistant(
      selectedAssistantId,
      (assistant) => {
        console.log('📡 Real-time update received:', assistant);
        setAssistantData(assistant);
        setIsConnected(true);
      },
      (error) => {
        console.error('❌ Subscription error:', error);
        setIsConnected(false);
      }
    );

    return () => {
      console.log(`🔌 Unsubscribing from assistant: ${selectedAssistantId}`);
      unsubscribe();
    };
  }, [selectedAssistantId]);

  const selectedMockAssistant = mockAssistants.find(a => a.id === selectedAssistantId);
  const displayImageUrl = assistantData?.coverImageUrl || selectedMockAssistant?.image;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Test de Persistencia de Imágenes de Asistentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Conectado en tiempo real
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Desconectado
                  </>
                )}
              </Badge>
              {assistantData?.updatedAtMs && (
                <Badge variant="outline">
                  Última actualización: {new Date(assistantData.updatedAtMs).toLocaleString('es-ES')}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Assistant Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Asistente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assistant-select">Asistente</Label>
                <select
                  id="assistant-select"
                  value={selectedAssistantId}
                  onChange={(e) => setSelectedAssistantId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {mockAssistants.map((assistant) => (
                    <option key={assistant.id} value={assistant.id}>
                      {assistant.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMockAssistant && (
                <div className="space-y-2">
                  <div>
                    <Label>Descripción</Label>
                    <p className="text-sm text-gray-600">{selectedMockAssistant.description}</p>
                  </div>
                  <div>
                    <Label>ID</Label>
                    <p className="text-sm font-mono text-gray-600">{selectedMockAssistant.id}</p>
                  </div>
                </div>
              )}

              {selectedAssistantId && (
                <AssistantImageManager
                  assistantId={selectedAssistantId}
                  assistantName={selectedMockAssistant?.name || 'Asistente'}
                  currentImageUrl={selectedMockAssistant?.image}
                />
              )}
            </CardContent>
          </Card>

          {/* Current Image Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Imagen Actual</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refrescar Página
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Image Display */}
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {displayImageUrl ? (
                    <img
                      src={displayImageUrl}
                      alt={selectedMockAssistant?.name || 'Assistant'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error');
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Sin imagen</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="space-y-2 text-sm">
                  <div>
                    <Label>Tipo de Imagen</Label>
                    <p className="text-gray-600">
                      {assistantData?.coverImageUrl ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Persistente (Firebase Storage)
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Temporal (Unsplash mock)
                        </Badge>
                      )}
                    </p>
                  </div>

                  {assistantData?.coverImageUrl && (
                    <>
                      <div>
                        <Label>URL Persistente</Label>
                        <p className="text-xs text-gray-600 break-all">
                          {assistantData.coverImageUrl}
                        </p>
                      </div>
                      <div>
                        <Label>Ruta en Storage</Label>
                        <p className="text-xs text-gray-600 break-all">
                          {assistantData.coverImagePath}
                        </p>
                      </div>
                    </>
                  )}

                  {selectedMockAssistant?.image && !assistantData?.coverImageUrl && (
                    <div>
                      <Label>URL Mock (Temporal)</Label>
                      <p className="text-xs text-gray-600 break-all">
                        {selectedMockAssistant.image}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones de Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">1</span>
                <p>Selecciona un asistente de la lista</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">2</span>
                <p>Haz clic en "Gestionar Imagen" para abrir el diálogo de subida</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">3</span>
                <p>Sube una nueva imagen (máx. 5MB, formatos: JPG, PNG, WebP)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">4</span>
                <p>Observa cómo la imagen se actualiza en tiempo real (sin refrescar)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">5</span>
                <p>Refresca la página para verificar que la imagen persiste</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">6</span>
                <p>Verifica el historial de imágenes en la pestaña "Historial"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
