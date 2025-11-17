import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import { updateAssistantImage } from '@/lib/assistantImageService';

interface AssistantImageUploadProps {
  assistantId: string;
  currentImageUrl?: string;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export default function AssistantImageUpload({
  assistantId,
  currentImageUrl,
  onUploadSuccess,
  onUploadError
}: AssistantImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo debe ser menor a 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start upload
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);

    try {
      console.log(`🚀 Starting upload for assistant ${assistantId}`);
      
      const result = await updateAssistantImage(
        file,
        assistantId,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      console.log('✅ Upload successful:', result);
      setSuccess('Imagen actualizada correctamente');
      setPreviewUrl(result.downloadURL);
      
      if (onUploadSuccess) {
        onUploadSuccess(result.downloadURL);
      }

    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      const errorMessage = error.message || 'Error al subir la imagen';
      setError(errorMessage);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const imageUrl = previewUrl || currentImageUrl;

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Current/Preview Image */}
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Assistant cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image load error:', e);
                  // Fallback to placeholder on error
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="text-gray-400 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Sin imagen</p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subiendo imagen...</span>
                <span>{uploadProgress.toFixed(0)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleButtonClick}
            disabled={isUploading}
            className="w-full"
            variant={imageUrl ? "outline" : "default"}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading 
              ? 'Subiendo...' 
              : imageUrl 
                ? 'Cambiar Imagen' 
                : 'Subir Imagen'
            }
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* File Info */}
          <div className="text-xs text-gray-500 text-center">
            Formatos: JPG, PNG, WebP • Máximo: 5MB
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
