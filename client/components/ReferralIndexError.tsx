import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, AlertTriangle, Clock, CheckCircle, RefreshCw } from "lucide-react";

interface ReferralIndexErrorProps {
  onRetry: () => void;
}

export default function ReferralIndexError({ onRetry }: ReferralIndexErrorProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const [timeUntilNextRetry, setTimeUntilNextRetry] = useState(0);
  const indexUrl = "https://console.firebase.google.com/v1/r/project/cursor-64188/firestore/indexes?create_composite=Ck5wcm9qZWN0cy9jdXJzb3ItNjQxODgvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3JlZmVycmFscy9pbmRleGVzL18QARoSCg5yZWZlcnJlclVzZXJJZBABGg8KC2NyZWF0ZWRBdE1zEAIaDAoIX19uYW1lX18QAg";

  // Auto-retry mechanism
  useEffect(() => {
    if (autoRetryCount < 3) {
      const retryDelay = Math.min(30000, 10000 * Math.pow(2, autoRetryCount)); // 10s, 20s, 30s
      const retryTimer = setTimeout(() => {
        setAutoRetryCount(prev => prev + 1);
        handleRetry();
      }, retryDelay);

      // Countdown timer
      setTimeUntilNextRetry(Math.floor(retryDelay / 1000));
      const countdownTimer = setInterval(() => {
        setTimeUntilNextRetry(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(retryTimer);
        clearInterval(countdownTimer);
      };
    }
  }, [autoRetryCount]);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      await onRetry();
    } catch (error) {
      console.log('Retry failed, index still not ready');
    } finally {
      setIsChecking(false);
    }
  };

  const handleManualRetry = () => {
    setAutoRetryCount(0);
    setTimeUntilNextRetry(0);
    handleRetry();
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="w-5 h-5" />
          Configuración de Base de Datos Requerida
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={isChecking ? "border-blue-200 bg-blue-50" : ""}>
          {isChecking ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
          <AlertDescription>
            {isChecking ? (
              <strong>Comprobando si el índice está listo...</strong>
            ) : (
              <>
                <strong>Sistema de referidos casi listo:</strong> Se requiere crear un índice en la base de datos.
                Esto es normal en la primera configuración y solo toma 1-2 minutos.
              </>
            )}
            {autoRetryCount > 0 && (
              <div className="mt-1 text-sm">
                Comprobación automática #{autoRetryCount}/3
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-3">
            📋 Pasos para activar el sistema:
          </h4>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Crear índice de base de datos</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.open(indexUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Consola Firebase
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Esperar 1-2 minutos</p>
                <p className="text-sm text-gray-600">El índice se creará automáticamente</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Comprobar si está listo</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleManualRetry}
                    disabled={isChecking}
                  >
                    {isChecking ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    {isChecking ? 'Comprobando...' : 'Comprobar ahora'}
                  </Button>

                  {timeUntilNextRetry > 0 && autoRetryCount < 3 && (
                    <span className="text-sm text-gray-600">
                      Auto-comprobación en {timeUntilNextRetry}s
                    </span>
                  )}
                </div>

                {autoRetryCount >= 3 && (
                  <div className="mt-2 text-sm text-gray-600">
                    💡 Si el problema persiste, intenta recargar la página completa
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">¿Qué es esto?</span>
          </div>
          <p className="text-sm text-blue-700">
            Los índices de base de datos permiten consultas rápidas y eficientes.
            Este paso es estándar en aplicaciones web modernas y se hace una sola vez.
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Una vez creado el índice, podrás ver todos tus referidos, beneficios obtenidos y estado de activación.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
