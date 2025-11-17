import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Clock, CheckCircle, Upload, Eye } from 'lucide-react';
import AssistantImageUpload from './AssistantImageUpload';
import { 
  subscribeToAssistant, 
  getAssistantMediaHistory,
  type AssistantWithImage,
  type AssistantMediaRecord 
} from '@/lib/assistantImageService';

interface AssistantImageManagerProps {
  assistantId: string;
  assistantName: string;
  currentImageUrl?: string;
}

export default function AssistantImageManager({
  assistantId,
  assistantName,
  currentImageUrl
}: AssistantImageManagerProps) {
  const [assistant, setAssistant] = useState<AssistantWithImage | null>(null);
  const [mediaHistory, setMediaHistory] = useState<AssistantMediaRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Real-time subscription to assistant data
  useEffect(() => {
    const unsubscribe = subscribeToAssistant(
      assistantId,
      (updatedAssistant) => {
        setAssistant(updatedAssistant);
        console.log('📡 Assistant updated in real-time:', updatedAssistant);
      },
      (error) => {
        console.error('❌ Error in assistant subscription:', error);
      }
    );

    return unsubscribe;
  }, [assistantId]);

  // Load media history when dialog opens
  const loadMediaHistory = async () => {
    if (!isOpen) return;
    
    setIsLoadingHistory(true);
    try {
      const history = await getAssistantMediaHistory(assistantId);
      setMediaHistory(history.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0)));
    } catch (error) {
      console.error('❌ Error loading media history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadMediaHistory();
  }, [isOpen, assistantId]);

  const handleUploadSuccess = (url: string) => {
    console.log('✅ Upload successful, image will update via real-time subscription');
    // The real-time subscription will automatically update the assistant data
    loadMediaHistory(); // Refresh history
  };

  const handleUploadError = (error: string) => {
    console.error('❌ Upload error:', error);
  };

  // Use real-time data if available, fallback to props
  const displayImageUrl = assistant?.coverImageUrl || currentImageUrl;
  const lastUpdated = assistant?.updatedAtMs;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ImageIcon className="w-4 h-4" />
          Gestionar Imagen
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Gestión de Imagen - {assistantName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Subir Nueva
            </TabsTrigger>
            <TabsTrigger value="current">
              <Eye className="w-4 h-4 mr-2" />
              Actual
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="w-4 h-4 mr-2" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <div className="flex justify-center">
              <AssistantImageUpload
                assistantId={assistantId}
                currentImageUrl={displayImageUrl}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>
          </TabsContent>

          <TabsContent value="current" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Imagen Actual</CardTitle>
              </CardHeader>
              <CardContent>
                {displayImageUrl ? (
                  <div className="space-y-4">
                    <div className="aspect-video max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={displayImageUrl}
                        alt={assistantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>URL:</span>
                        <a 
                          href={displayImageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline max-w-xs truncate"
                        >
                          {displayImageUrl}
                        </a>
                      </div>
                      {assistant?.coverImagePath && (
                        <div className="flex justify-between">
                          <span>Ruta de Storage:</span>
                          <span className="text-xs text-gray-500 max-w-xs truncate">
                            {assistant.coverImagePath}
                          </span>
                        </div>
                      )}
                      {lastUpdated && (
                        <div className="flex justify-between">
                          <span>Última actualización:</span>
                          <span className="text-xs text-gray-500">
                            {new Date(lastUpdated).toLocaleString('es-ES')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay imagen configurada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial de Imágenes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Cargando historial...</p>
                  </div>
                ) : mediaHistory.length > 0 ? (
                  <div className="space-y-3">
                    {mediaHistory.map((media) => (
                      <div
                        key={media.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={media.downloadURL}
                            alt="Historical image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={media.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {media.status === 'active' ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Activa
                                </>
                              ) : (
                                'Inactiva'
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {media.storagePath}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(media.createdAtMs || 0).toLocaleString('es-ES')}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(media.downloadURL, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Sin historial de imágenes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
