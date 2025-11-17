import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  uploadAssistantImage, 
  deleteAssistantImage, 
  validateImageFile,
  AssistantAvatar,
  getImageWithCacheBusting
} from '@/lib/assistantImageUploadService';
import { toast } from 'sonner';

interface AssistantImageEditorProps {
  assistantId: string;
  assistantName: string;
  currentAvatar?: AssistantAvatar | null;
  onImageUpdated?: (avatar: AssistantAvatar | null) => void;
}

export default function AssistantImageEditor({
  assistantId,
  assistantName,
  currentAvatar,
  onImageUpdated
}: AssistantImageEditorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState(currentAvatar?.alt || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo inválido');
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);
  
  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);
  
  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);
  
  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      const avatar = await uploadAssistantImage(
        assistantId,
        selectedFile,
        altText.trim(),
        (progress) => setUploadProgress(progress)
      );
      
      // Clear selection
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Update parent
      onImageUpdated?.(avatar);
      
      toast.success('Imagen subida correctamente');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Error al subir la imagen');
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!currentAvatar) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      await deleteAssistantImage(assistantId);
      onImageUpdated?.(null);
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar la imagen');
      toast.error('Error al eliminar la imagen');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle reset selection
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAltText(currentAvatar?.alt || '');
    setError(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Current image to display
  const currentImageUrl = currentAvatar ? getImageWithCacheBusting(currentAvatar, true) : null;
  
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Imagen del Asistente
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Image or Preview */}
        <div className="space-y-3">
          <Label>Vista Previa</Label>
          <div className="flex items-center justify-center w-full">
            {previewUrl || currentImageUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl || currentImageUrl!}
                  alt={altText || `Imagen de ${assistantName}`}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity"
                />
                {previewUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                      Nueva imagen
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Dropzone */}
        <div className="space-y-3">
          <Label>Subir Nueva Imagen</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Arrastra una imagen aquí o{' '}
              <span className="font-medium text-blue-600">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, WebP • Máximo 5MB
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
        
        {/* Alt Text */}
        <div className="space-y-2">
          <Label htmlFor="alt-text">Texto Alternativo (ALT)</Label>
          <Input
            id="alt-text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Descripción de la imagen para accesibilidad"
            maxLength={200}
          />
          <p className="text-xs text-gray-500">
            Opcional • Ayuda con la accesibilidad
          </p>
        </div>
        
        {/* Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Subiendo imagen...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
        
        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Success for current image */}
        {currentAvatar && !selectedFile && (
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Imagen guardada • Versión {currentAvatar.version} • {new Date(currentAvatar.updatedAtMs).toLocaleDateString()}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedFile && (
            <>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 min-w-[120px]"
              >
                {isUploading ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isUploading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
          
          {currentAvatar && !selectedFile && (
            <>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Reemplazar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isUploading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Quitar
              </Button>
            </>
          )}
          
          {!currentAvatar && !selectedFile && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Seleccionar Imagen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
