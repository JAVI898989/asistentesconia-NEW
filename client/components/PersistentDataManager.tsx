/**
 * PERSISTENT DATA MANAGER
 *
 * Componente que mantiene los datos sincronizados y muestra
 * el estado de la conexión en tiempo real.
 */

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CreditCard,
  User,
  Clock,
} from "lucide-react";
import { usePersistentSync } from "@/hooks/usePersistentSync";

interface PersistentDataManagerProps {
  showDetails?: boolean;
  compact?: boolean;
}

export default function PersistentDataManager({
  showDetails = false,
  compact = false,
}: PersistentDataManagerProps) {
  const { syncState, forceSync, getSyncStatus, isOnline } = usePersistentSync();
  const [lastForceSync, setLastForceSync] = useState<string>("");

  const handleForceSync = async () => {
    try {
      await forceSync();
      setLastForceSync(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("❌ Force sync failed:", error);
    }
  };

  const getConnectionIcon = () => {
    if (!isOnline) {
      return <WifiOff className="w-4 h-4 text-red-500" />;
    }

    switch (syncState.connectionState) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "reconnecting":
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getConnectionStatus = () => {
    if (!isOnline) return "Sin conexión a internet";

    switch (syncState.connectionState) {
      case "connected":
        return "Conectado y sincronizado";
      case "reconnecting":
        return "Reconectando...";
      case "disconnected":
        return "Desconectado";
      default:
        return "Estado desconocido";
    }
  };

  const getConnectionBadgeColor = () => {
    if (!isOnline) return "bg-red-500/20 text-red-400 border-red-500/50";

    switch (syncState.connectionState) {
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "reconnecting":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-red-500/20 text-red-400 border-red-500/50";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {getConnectionIcon()}
        <span className="text-xs text-gray-600">{getConnectionStatus()}</span>
        {syncState.connectionState !== "connected" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleForceSync}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
          <Database className="w-5 h-5" />
          Estado de Sincronización
          {getConnectionIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <Alert
          className={`${
            syncState.isConnected && isOnline
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <AlertDescription
            className={`${
              syncState.isConnected && isOnline
                ? "text-green-800"
                : "text-yellow-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>
                <strong>{getConnectionStatus()}</strong>
                {syncState.lastSync > 0 && (
                  <span className="ml-2 text-sm">
                    (Última sincronización:{" "}
                    {new Date(syncState.lastSync).toLocaleTimeString()})
                  </span>
                )}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleForceSync}
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Sincronizar
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getConnectionBadgeColor()}>
            {getConnectionIcon()}
            <span className="ml-2">
              {isOnline ? "Online" : "Offline"} -{" "}
              {syncState.connectionState === "connected"
                ? "Sincronizado"
                : syncState.connectionState}
            </span>
          </Badge>

          {syncState.user && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              <User className="w-3 h-3 mr-1" />
              Usuario autenticado
            </Badge>
          )}

          {syncState.subscriptionData && (
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              <CreditCard className="w-3 h-3 mr-1" />
              Suscripción: {syncState.subscriptionData.status || "Desconocido"}
            </Badge>
          )}
        </div>

        {/* Details */}
        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">Usuario</span>
              </div>
              {syncState.user ? (
                <div className="text-xs text-gray-600">
                  <div>Email: {syncState.user.email}</div>
                  <div>ID: {syncState.user.uid}</div>
                </div>
              ) : (
                <div className="text-xs text-gray-400">No autenticado</div>
              )}
            </div>

            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-green-500" />
                <span className="font-medium text-sm">Datos</span>
              </div>
              {syncState.userData ? (
                <div className="text-xs text-gray-600">
                  <div>
                    Estado: {syncState.userData.subscriptionStatus || "N/A"}
                  </div>
                  <div>
                    Última sync:{" "}
                    {syncState.userData.lastSync
                      ? new Date(
                          syncState.userData.lastSync,
                        ).toLocaleTimeString()
                      : "N/A"}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400">No hay datos</div>
              )}
            </div>

            <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-sm">Suscripción</span>
              </div>
              {syncState.subscriptionData ? (
                <div className="text-xs text-gray-600">
                  <div>Estado: {syncState.subscriptionData.status}</div>
                  <div>ID: {syncState.subscriptionData.id}</div>
                </div>
              ) : (
                <div className="text-xs text-gray-400">Sin suscripción</div>
              )}
            </div>
          </div>
        )}

        {/* Last Force Sync */}
        {lastForceSync && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Última sincronización manual: {lastForceSync}
          </div>
        )}

        {/* Connection Issues Warning */}
        {(!syncState.isConnected || !isOnline) && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="text-yellow-800">
              {!isOnline ? (
                <div>
                  <strong>Sin conexión a internet.</strong> Los datos se
                  sincronizarán automáticamente cuando se restaure la conexión.
                </div>
              ) : (
                <div>
                  <strong>Problemas de conexión con Firebase.</strong>{" "}
                  Intentando reconectar automáticamente...
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {syncState.isConnected && isOnline && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription className="text-green-800">
              <strong>Sistema funcionando perfectamente.</strong> Todos los
              datos están sincronizados en tiempo real.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
