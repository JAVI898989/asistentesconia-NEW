/**
 * Firebase Health Monitor Component
 *
 * Displays real-time Firebase connection status and automatically
 * handles connectivity issues.
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  Shield,
  Cloud,
} from "lucide-react";
import { firebaseService } from "@/lib/firebaseService";

interface HealthStatus {
  firebase: boolean;
  firestore: boolean;
  auth: boolean;
  isOnline: boolean;
  lastChecked: string;
}

export default function FirebaseHealthMonitor() {
  const [health, setHealth] = useState<HealthStatus>({
    firebase: false,
    firestore: false,
    auth: false,
    isOnline: navigator.onLine,
    lastChecked: "",
  });
  const [isChecking, setIsChecking] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const healthCheck = await firebaseService.healthCheck();
      setHealth({
        ...healthCheck,
        isOnline: navigator.onLine,
        lastChecked: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error("Health check failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();

    // Setup online/offline listeners
    const handleOnline = () => {
      setHealth((prev) => ({ ...prev, isOnline: true }));
      checkHealth();
    };

    const handleOffline = () => {
      setHealth((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Setup periodic health checks
    let interval: NodeJS.Timeout;
    if (autoSync) {
      interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (interval) clearInterval(interval);
    };
  }, [autoSync]);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge
        className={`${
          status
            ? "bg-green-500/20 text-green-400 border-green-500/50"
            : "bg-red-500/20 text-red-400 border-red-500/50"
        }`}
      >
        {getStatusIcon(status)}
        <span className="ml-2">{label}</span>
      </Badge>
    );
  };

  const overallHealth =
    health.firebase && health.firestore && health.auth && health.isOnline;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Database className="w-5 h-5" />
          Estado de Firebase
          {overallHealth ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
          {health.isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span className="text-slate-300">
            {health.isOnline ? "Conectado" : "Sin conexión"}
          </span>
        </div>

        {/* Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg">
            <Cloud className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 text-sm">Firebase</span>
            {getStatusIcon(health.firebase)}
          </div>
          <div className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300 text-sm">Firestore</span>
            {getStatusIcon(health.firestore)}
          </div>
          <div className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-slate-300 text-sm">Auth</span>
            {getStatusIcon(health.auth)}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {getStatusBadge(health.firebase, "Firebase Core")}
          {getStatusBadge(health.firestore, "Base de Datos")}
          {getStatusBadge(health.auth, "Autenticación")}
          {getStatusBadge(health.isOnline, "Internet")}
        </div>

        {/* Overall Status Alert */}
        {!overallHealth && (
          <Alert className="bg-yellow-900/20 border-yellow-600">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="text-yellow-200">
              <div className="flex items-center justify-between">
                <span>
                  {!health.isOnline
                    ? "Modo offline activado. Los datos se sincronizarán cuando se restaure la conexión."
                    : "Algunos servicios de Firebase no están disponibles. Usando respaldos locales."}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {overallHealth && (
          <Alert className="bg-green-900/20 border-green-600">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription className="text-green-200">
              Todos los servicios funcionan correctamente. Sincronización
              automática activa.
            </AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              disabled={isChecking}
              className="bg-slate-700 border-slate-600"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`}
              />
              Verificar
            </Button>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="rounded"
              />
              Auto-verificación
            </label>
          </div>

          {health.lastChecked && (
            <span className="text-xs text-slate-400">
              Última verificación: {health.lastChecked}
            </span>
          )}
        </div>

        {/* Debug Info */}
        <details className="text-xs text-slate-400">
          <summary className="cursor-pointer hover:text-slate-300">
            Información técnica
          </summary>
          <div className="mt-2 p-2 bg-slate-900/50 rounded font-mono">
            <div>Dominio: {window.location.hostname}</div>
            <div>Protocolo: {window.location.protocol}</div>
            <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
            <div>
              Firebase Project: {import.meta.env.VITE_FIREBASE_PROJECT_ID}
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
