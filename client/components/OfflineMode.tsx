import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  loginUserOffline,
  registerUserOffline,
  getOfflineStats,
  seedDemoAccounts,
} from "@/lib/offlineAuth";

export const OfflineMode: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    const currentStats = getOfflineStats();
    setStats(currentStats);
  };

  const handleOfflineAuth = async (isLogin: boolean) => {
    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let result;
      if (isLogin) {
        result = await loginUserOffline(email, password);
      } else {
        result = await registerUserOffline(email, password);
      }

      setSuccess(
        `✅ ${isLogin ? "Login" : "Registro"} offline exitoso! UID: ${result.user.uid}`,
      );
      refreshStats();

      // Redirect after successful auth
      setTimeout(() => {
        window.location.href = "/redirect";
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = () => {
    const added = seedDemoAccounts();
    if (added > 0) {
      setSuccess(`✅ Se añadieron ${added} cuentas demo`);
    } else {
      setSuccess("ℹ️ Las cuentas demo ya existían");
    }
    refreshStats();
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-orange-800">
          📱 Modo Offline (Sin Firebase)
        </h3>
        <Button onClick={refreshStats} size="sm" variant="outline">
          🔄 Actualizar
        </Button>
      </div>

      <Alert className="mb-4">
        <AlertDescription>
          <div className="space-y-2">
            <div className="font-semibold text-orange-700">
              🚨 Firebase no disponible
            </div>
            <div className="text-sm">
              Use este modo offline para probar la aplicación sin conexión a
              Firebase. Los datos se almacenan localmente en el navegador.
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-3 rounded border text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.totalUsers || 0}
          </div>
          <div className="text-sm text-gray-600">Usuarios Offline</div>
        </div>
        <div className="bg-white p-3 rounded border text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.isLoggedIn ? "✅" : "❌"}
          </div>
          <div className="text-sm text-gray-600">Sesión Activa</div>
        </div>
        <div className="bg-white p-3 rounded border text-center">
          <Button onClick={handleSeedDemo} size="sm" className="w-full">
            🎭 Cuentas Demo
          </Button>
        </div>
      </div>

      {/* Auth Form */}
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login Offline</TabsTrigger>
          <TabsTrigger value="register">Registro Offline</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="offline-email">Email</Label>
            <Input
              id="offline-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offline-password">Contraseña</Label>
            <Input
              id="offline-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <Button
            onClick={() => handleOfflineAuth(true)}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {loading ? "Procesando..." : "📱 Login Offline"}
          </Button>
        </TabsContent>

        <TabsContent value="register" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="offline-reg-email">Email</Label>
            <Input
              id="offline-reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offline-reg-password">Contraseña</Label>
            <Input
              id="offline-reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <Button
            onClick={() => handleOfflineAuth(false)}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {loading ? "Procesando..." : "📱 Registro Offline"}
          </Button>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mt-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Demo Accounts Info */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <div className="text-sm font-medium text-yellow-800 mb-2">
          🎭 Cuentas demo disponibles:
        </div>
        <div className="text-xs text-yellow-700 space-y-1">
          <div>• admin@demo.com / demo123</div>
          <div>• profesor@demo.com / demo123</div>
          <div>• estudiante@demo.com / demo123</div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;
