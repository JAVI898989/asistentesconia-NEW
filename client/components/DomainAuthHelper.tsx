import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Info } from "lucide-react";

interface DomainAuthHelperProps {
  show: boolean;
  onClose: () => void;
}

export default function DomainAuthHelper({ show, onClose }: DomainAuthHelperProps) {
  if (!show) return null;

  const currentDomain = window.location.hostname;
  const isFlyDomain = currentDomain.includes("fly.dev");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Alert className="mt-4 border-orange-200 bg-orange-50">
      <Info className="h-4 w-4 text-orange-600" />
      <AlertDescription>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-orange-800 mb-2">
              🔧 Configuración de Dominio Firebase
            </h4>
            <p className="text-orange-700 text-sm mb-3">
              El dominio <code className="bg-orange-100 px-1 rounded">{currentDomain}</code> necesita 
              ser autorizado en Firebase Console para autenticación completa.
            </p>
          </div>

          {isFlyDomain && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h5 className="font-medium text-blue-800 mb-2">✅ Modo Temporal Activado</h5>
              <p className="text-blue-700 text-sm">
                El sistema está funcionando en modo temporal para dominios Fly.dev. 
                La autenticación debería funcionar automáticamente.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800 mb-2">📋 Pasos para autorizar el dominio:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Ve a <a href="https://console.firebase.google.com/project/cursor-64188/authentication/settings" 
                    target="_blank" rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline inline-flex items-center gap-1">
                    Firebase Console <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Navega a Authentication → Settings → Authorized domains</li>
                <li>Haz clic en "Add domain"</li>
                <li>Añade el dominio: 
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{currentDomain}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(currentDomain)}
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </li>
                {isFlyDomain && (
                  <li>También añade: 
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">*.fly.dev</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("*.fly.dev")}
                        className="h-6 px-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </li>
                )}
                <li>Guarda los cambios y espera 5-10 minutos para la propagación</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3">
              <h5 className="font-medium text-green-800 mb-1">💡 Mientras tanto:</h5>
              <p className="text-green-700 text-sm">
                El sistema seguirá funcionando en modo temporal. Todas las funcionalidades 
                están disponibles, solo con autenticación alternativa.
              </p>
            </div>

            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Entendido
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
