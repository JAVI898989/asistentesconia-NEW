import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { quickNetworkFix, emergencyAuthReset, diagnoseConnection } from '@/lib/simpleAuth';

const FirebaseDebugger: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'good' | 'bad'>('unknown');

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const result = await quickNetworkFix();
      setDiagnostics(result);

      // Simple status assessment
      if (result.includes('❌')) {
        setConnectionStatus('bad');
      } else {
        setConnectionStatus('good');
      }
    } catch (error) {
      setDiagnostics(`❌ Error running diagnostics: ${error}`);
      setConnectionStatus('bad');
    } finally {
      setIsLoading(false);
    }
  };

  const runAdvancedDiagnostics = async () => {
    setIsLoading(true);
    try {
      const result = await diagnoseConnection();
      setDiagnostics(result);
    } catch (error) {
      setDiagnostics(`❌ Advanced diagnostics failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run diagnostics on mount
    runDiagnostics();
  }, []);

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800">✅ Conexión OK</Badge>;
      case 'bad':
        return <Badge className="bg-red-100 text-red-800">❌ Problemas detectados</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">🔍 Verificando...</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🔧 Firebase Connection Debugger
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Esta herramienta ayuda a diagnosticar problemas de conexión con Firebase.
            <strong> Error actual:</strong> auth/network-request-failed
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={runDiagnostics}
            disabled={isLoading}
            variant="outline"
          >
            🔍 Test Rápido
          </Button>

          <Button
            onClick={runAdvancedDiagnostics}
            disabled={isLoading}
            variant="outline"
          >
            🔬 Test Avanzado
          </Button>

          <Button
            onClick={emergencyAuthReset}
            variant="destructive"
          >
            🚨 Reset Emergencia
          </Button>
        </div>

        {diagnostics && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📊 Resultados del Diagnóstico:</h4>
            <pre className="text-sm whitespace-pre-wrap font-mono">{diagnostics}</pre>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">🛠️ Soluciones Recomendadas:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Verificar conexión a internet</li>
            <li>• Desactivar VPN/Proxy temporalmente</li>
            <li>• Probar en ventana de incógnito</li>
            <li>• Verificar firewall/antivirus</li>
            <li>• Recargar la página completamente</li>
            <li>• Contactar soporte si persiste</li>
          </ul>
        </div>

        {connectionStatus === 'bad' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              <strong>⚠️ Problema detectado:</strong> La conexión con Firebase está fallando.
              Prueba las soluciones recomendadas arriba.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FirebaseDebugger;
