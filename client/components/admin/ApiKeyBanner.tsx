import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Key } from "lucide-react";
import { useUserApiKey } from "@/hooks/useUserApiKey";
import { useNavigate } from "react-router-dom";

export function ApiKeyBanner() {
  const { hasKey, isLoading } = useUserApiKey();
  const navigate = useNavigate();

  if (isLoading) {
    return null;
  }

  if (hasKey) {
    return (
      <Alert className="bg-green-50 border-green-200 mb-4">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span>
              <strong>API Key configurada correctamente.</strong> Todos los consumos se reflejarán en tu cuenta de OpenAI.
            </span>
            <Button
              onClick={() => navigate("/admin/contenido")}
              variant="ghost"
              size="sm"
              className="text-green-700 hover:bg-green-100"
            >
              <Key className="w-4 h-4 mr-2" />
              Ver configuración
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-red-50 border-red-200 mb-4">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="flex items-center justify-between">
          <span>
            <strong>API Key no configurada.</strong> Configura tu API key de OpenAI para generar contenido.
          </span>
          <Button
            onClick={() => navigate("/admin/contenido")}
            variant="ghost"
            size="sm"
            className="text-red-700 hover:bg-red-100"
          >
            <Key className="w-4 h-4 mr-2" />
            Configurar ahora
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
