import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  Trash2,
  RefreshCw
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";
import {
  getUserApiKey,
  saveUserApiKey,
  deleteUserApiKey,
  validateApiKey,
  maskApiKey
} from "@/lib/userApiKeyService";

export function ApiKeyConfiguration() {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para configurar tu API key",
          variant: "destructive"
        });
        return;
      }

      const key = await getUserApiKey(user.uid);
      if (key) {
        setSavedApiKey(key);
        setApiKey(key);
      }
    } catch (error) {
      console.error("Error loading API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey || !apiKey.trim()) {
      toast({
        title: "Error",
        description: "Introduce una API key válida",
        variant: "destructive"
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión",
        variant: "destructive"
      });
      return;
    }

    // Validate format
    if (!await validateApiKey(apiKey.trim())) {
      toast({
        title: "API Key inválida",
        description: "La API key debe comenzar con 'sk-' y tener al menos 40 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveUserApiKey(user.uid, apiKey.trim());
      setSavedApiKey(apiKey.trim());
      setIsValid(true);
      
      toast({
        title: "✅ API Key guardada",
        description: "Tu API key se guardó correctamente. Todos los consumos se cargarán a tu cuenta de OpenAI."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la API key",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    if (!apiKey || !apiKey.trim()) {
      return;
    }

    setIsValidating(true);
    try {
      const valid = await validateApiKey(apiKey.trim(), true); // Test with real API call
      setIsValid(valid);
      
      if (valid) {
        toast({
          title: "✅ API Key válida",
          description: "La API key se validó correctamente con OpenAI"
        });
      } else {
        toast({
          title: "❌ API Key inválida",
          description: "La API key no es válida o no tiene permisos",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo validar la API key",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar tu API key? No podrás generar contenido sin ella.")) {
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setIsSaving(true);
    try {
      await deleteUserApiKey(user.uid);
      setApiKey("");
      setSavedApiKey(null);
      setIsValid(null);
      
      toast({
        title: "API Key eliminada",
        description: "Tu API key se eliminó correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la API key",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600" />
          Configuración de API Key de OpenAI
        </CardTitle>
        <CardDescription>
          Configura tu propia API key de OpenAI. Todos los consumos de generación de contenido (temarios, tests, flashcards, juegos) se cargarán a tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Alert */}
        {savedApiKey ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-900">
              <strong>API Key configurada:</strong> {maskApiKey(savedApiKey)}
              {isValid && (
                <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                  Validada
                </Badge>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>No tienes API key configurada.</strong> La generación de contenido está deshabilitada hasta que configures tu API key de OpenAI.
            </AlertDescription>
          </Alert>
        )}

        {/* How to get API key */}
        <Alert>
          <ExternalLink className="w-4 h-4" />
          <AlertDescription>
            <strong>¿Cómo conseguir tu API key?</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
              <li>Ve a <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></li>
              <li>Inicia sesión o crea una cuenta</li>
              <li>Click en "Create new secret key"</li>
              <li>Copia la key y pégala aquí</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* API Key Input */}
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key de OpenAI</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-proj-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Tu API key se guarda de forma segura en Firebase y solo tú puedes acceder a ella.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading || !apiKey.trim()}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar API Key
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleValidate}
            disabled={isValidating || isLoading || !apiKey.trim()}
            className="flex items-center gap-2"
          >
            {isValidating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Validar
              </>
            )}
          </Button>

          {savedApiKey && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving || isLoading}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          )}
        </div>

        {/* Validation Result */}
        {isValid !== null && (
          <Alert className={isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            {isValid ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription className={isValid ? "text-green-900" : "text-red-900"}>
              {isValid 
                ? "API Key válida. Puedes generar contenido sin problemas."
                : "API Key inválida o sin permisos. Verifica que sea correcta y tenga acceso a la API de Chat Completions."}
            </AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <strong>💡 Información importante:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>El consumo de tokens se cargará a tu cuenta de OpenAI, no a la plataforma</li>
            <li>Puedes ver tu consumo en <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Usage Dashboard</a></li>
            <li>Recomendamos usar GPT-4o-mini para reducir costos (se usa automáticamente)</li>
            <li>Nunca compartas tu API key con nadie</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default ApiKeyConfiguration;
