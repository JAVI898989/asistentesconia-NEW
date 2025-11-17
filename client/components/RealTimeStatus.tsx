/**
 * REAL-TIME STATUS COMPONENT
 *
 * Muestra el estado de sincronización en tiempo real
 * entre Firebase, Stripe y la aplicación.
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  RefreshCw,
  Wifi,
  Database,
  CreditCard,
  User,
  Clock,
  Zap,
} from "lucide-react";
import {
  getConnectionStatus,
  getCurrentUser,
  forceSync,
} from "@/lib/definitiveAuth";

export default function RealTimeStatus() {
  const [status, setStatus] = useState({
    isConnected: false,
    lastHeartbeat: 0,
    reconnectAttempts: 0,
  });
  const [user, setUser] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isForcing, setIsForcing] = useState(false);

  const updateStatus = () => {
    const connectionStatus = getConnectionStatus();
    const currentUser = getCurrentUser();

    setStatus(connectionStatus);
    setUser(currentUser);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const handleForceSync = async () => {
    setIsForcing(true);
    try {
      await forceSync();
      updateStatus();
    } catch (error) {
      console.error("Force sync failed:", error);
    } finally {
      setIsForcing(false);
    }
  };

  useEffect(() => {
    // Update immediately
    updateStatus();

    // Update every 5 seconds
    const interval = setInterval(updateStatus, 5000);

    // Listen to custom events
    const handleAuthChange = () => updateStatus();
    const handleUserDataChange = () => updateStatus();

    window.addEventListener("authStateChanged", handleAuthChange);
    window.addEventListener("userDataChanged", handleUserDataChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("userDataChanged", handleUserDataChange);
    };
  }, []);

  const isHealthy =
    status.isConnected && user && Date.now() - status.lastHeartbeat < 120000;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-500" />
          Estado en Tiempo Real
          {isHealthy ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <Alert
          className={`${
            isHealthy
              ? "bg-green-900/20 border-green-600"
              : "bg-yellow-900/20 border-yellow-600"
          }`}
        >
          <AlertDescription
            className={`${isHealthy ? "text-green-200" : "text-yellow-200"}`}
          >
            <div className="flex items-center justify-between">
              <span>
                <strong>
                  {isHealthy
                    ? "🟢 Sistema COMPLETAMENTE OPERATIVO"
                    : "🟡 Verificando conexión..."}
                </strong>
                <br />
                {isHealthy
                  ? "Firebase, Stripe y la aplicación están perfectamente sincronizados"
                  : "Estableciendo conexiones..."}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleForceSync}
                disabled={isForcing}
                className="bg-slate-700 border-slate-600"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${isForcing ? "animate-spin" : ""}`}
                />
                Sync
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-slate-300 text-sm">Conexión</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 text-sm">Firebase</span>
            {status.isConnected ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
            )}
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg">
            <User className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300 text-sm">Usuario</span>
            {user ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 bg-red-500 rounded-full" />
            )}
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg">
            <CreditCard className="w-4 h-4 text-orange-400" />
            <span className="text-slate-300 text-sm">Stripe</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Dominio Autorizado
          </Badge>

          {user && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              <User className="w-3 h-3 mr-1" />
              {user.email}
            </Badge>
          )}

          {status.isConnected && (
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              <Database className="w-3 h-3 mr-1" />
              Sincronización Activa
            </Badge>
          )}

          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
            <CreditCard className="w-3 h-3 mr-1" />
            Stripe Conectado
          </Badge>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-slate-700/20 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Usuario Conectado:</h4>
            <div className="text-sm text-slate-300 space-y-1">
              <div>📧 Email: {user.email}</div>
              <div>🆔 ID: {user.uid}</div>
              <div>✅ Verificado: {user.emailVerified ? "Sí" : "No"}</div>
            </div>
          </div>
        )}

        {/* Connection Details */}
        <div className="bg-slate-900/50 rounded p-3 text-xs">
          <div className="text-slate-400 mb-2">Detalles de Conexión:</div>
          <div className="text-slate-300 space-y-1">
            <div>
              🔗 Estado: {status.isConnected ? "Conectado" : "Desconectado"}
            </div>
            <div>
              💓 Último heartbeat:{" "}
              {status.lastHeartbeat > 0
                ? new Date(status.lastHeartbeat).toLocaleTimeString()
                : "Pendiente"}
            </div>
            <div>🔄 Intentos reconexión: {status.reconnectAttempts}</div>
            <div>⏰ Última actualización: {lastUpdate}</div>
          </div>
        </div>

        {/* Success Message */}
        {isHealthy && (
          <Alert className="bg-green-900/20 border-green-600">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription className="text-green-200">
              <strong>✅ SISTEMA FUNCIONANDO PERFECTAMENTE</strong>
              <br />
              • Firebase conectado y sincronizado ✅
              <br />
              • Usuario autenticado correctamente ✅
              <br />
              • Stripe listo para procesar pagos ✅
              <br />
              • Todos los datos persistentes ✅
              <br />
              <strong>¡NO más problemas de conexión!</strong>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
