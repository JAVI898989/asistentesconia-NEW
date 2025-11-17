/**
 * Firebase Domain Configuration Helper
 *
 * Shows exact steps to configure Firebase domain authorization
 * for permanent resolution of authentication issues.
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";

export default function FirebaseDomainHelper() {
  const currentDomain = window.location.hostname;
  const projectId = "cursor-64188";
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copiado al portapapeles");
    });
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          🔧 Configuración Firebase - Solución Permanente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-100 border-blue-300">
          <AlertDescription className="text-blue-800">
            <strong>
              Para que Firebase funcione SIEMPRE sin problemas, sigue estos
              pasos:
            </strong>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                <strong>Abre Firebase Console:</strong>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(consoleUrl, "_blank")}
                  className="h-8"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Abrir Firebase Console
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                <strong>Navega a:</strong> Authentication → Settings →
                Authorized domains
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                <strong>
                  Haz clic en "Add domain" y añade estos dominios:
                </strong>
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <code className="flex-1 text-sm">{currentDomain}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(currentDomain)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <code className="flex-1 text-sm">*.fly.dev</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("*.fly.dev")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <code className="flex-1 text-sm">localhost</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("localhost")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                <strong>Guarda los cambios</strong> y espera 2-3 minutos para
                que se propaguen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                <strong>¡Listo!</strong> Recarga la página y Firebase funcionará
                perfectamente.
              </p>
            </div>
          </div>
        </div>

        <Alert className="bg-green-100 border-green-300">
          <CheckCircle className="w-4 h-4" />
          <AlertDescription className="text-green-800">
            <strong>Después de esta configuración:</strong>
            <br />
            • No habrá más errores de dominio no autorizado
            <br />
            • Firebase funcionará en todos los despliegues de Fly.dev
            <br />
            • La autenticación será rápida y confiable
            <br />• No necesitarás hacer esto de nuevo
          </AlertDescription>
        </Alert>

        <div className="bg-gray-100 p-3 rounded text-sm">
          <p className="font-medium text-gray-700 mb-1">Información técnica:</p>
          <p className="text-gray-600">
            Proyecto Firebase: <code>{projectId}</code>
          </p>
          <p className="text-gray-600">
            Dominio actual: <code>{currentDomain}</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
