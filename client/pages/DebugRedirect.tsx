import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserAcademias, checkIsAdmin } from "@/lib/firebaseData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

export default function DebugRedirect() {
  const [user, setUser] = useState<User | null>(null);
  const [academias, setAcademias] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        addLog(`👤 Usuario detectado: ${user.email}`);
        addLog(`🆔 UID: ${user.uid}`);
        checkUserDetails(user);
      } else {
        addLog("❌ No hay usuario logueado");
      }
    });
    return () => unsubscribe();
  }, []);

  const checkUserDetails = async (user: User) => {
    try {
      addLog("🔍 Iniciando verificación de usuario...");

      // Check academias first
      addLog("📋 Verificando academias...");
      try {
        const userAcademias = await getUserAcademias(user.uid);
        setAcademias(userAcademias);
        addLog(
          `📊 Academias encontradas: ${userAcademias.length} ${
            userAcademias.length > 0
              ? `- Primera: ${userAcademias[0].name} (${userAcademias[0].slug})`
              : ""
          }`,
        );
      } catch (error) {
        addLog(`❌ Error obteniendo academias: ${error}`);
      }

      // Check admin status
      addLog("👑 Verificando permisos de admin...");
      try {
        const adminStatus = await checkIsAdmin(user.uid);
        setIsAdmin(adminStatus);
        addLog(`👑 Es admin: ${adminStatus ? "SÍ" : "NO"}`);
      } catch (error) {
        addLog(`❌ Error verificando admin: ${error}`);
      }

      addLog("✅ Verificación completada");
    } catch (error) {
      addLog(`❌ Error general: ${error}`);
    }
  };

  const simulateRedirection = () => {
    addLog("🔄 Simulando lógica de redirección...");

    if (!user) {
      addLog("➡️ RESULTADO: Redirigir a /login");
      return "/login";
    }

    // Check academias first (priority)
    if (academias && academias.length > 0) {
      const redirect = `/academia/${academias[0].slug}`;
      addLog(`➡️ RESULTADO: Redirigir a ${redirect}`);
      return redirect;
    }

    // Check admin
    if (isAdmin || user.email === "admin@admin.com") {
      addLog("➡️ RESULTADO: Redirigir a /admin");
      return "/admin";
    }

    // Default
    addLog("➡️ RESULTADO: Redirigir a /");
    return "/";
  };

  const goToResult = () => {
    const result = simulateRedirection();
    window.location.href = result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          🔍 Debug de Redirección
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Información del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-3">
              <div>
                <strong>Email:</strong> {user?.email || "No logueado"}
              </div>
              <div>
                <strong>UID:</strong>{" "}
                <span className="font-mono text-sm break-all">
                  {user?.uid || "N/A"}
                </span>
              </div>
              <div>
                <strong>Es Admin:</strong>{" "}
                {isAdmin === null
                  ? "Verificando..."
                  : isAdmin
                    ? "✅ SÍ"
                    : "❌ NO"}
              </div>
              <div>
                <strong>Academias:</strong> {academias.length}
              </div>
            </CardContent>
          </Card>

          {/* Academias */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Academias Asignadas</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              {academias.length === 0 ? (
                <p className="text-slate-400">No hay academias asignadas</p>
              ) : (
                <div className="space-y-2">
                  {academias.map((academia, index) => (
                    <div
                      key={academia.id}
                      className="p-3 bg-slate-700/50 rounded"
                    >
                      <h3 className="font-semibold">{academia.name}</h3>
                      <p className="text-slate-400 text-sm">
                        Slug: {academia.slug}
                      </p>
                      <p className="text-slate-400 text-sm">
                        ID: {academia.id}
                      </p>
                      {index === 0 && (
                        <span className="text-green-400 text-sm">
                          ← Primera academia (redirección)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="bg-slate-800/50 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Acciones de Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={() => checkUserDetails(user!)}
                disabled={!user}
                className="bg-blue-500 hover:bg-blue-600"
              >
                🔄 Recargar Info del Usuario
              </Button>

              <Button
                onClick={simulateRedirection}
                className="bg-purple-500 hover:bg-purple-600"
              >
                🎯 Simular Redirección
              </Button>

              <Button
                onClick={goToResult}
                className="bg-green-500 hover:bg-green-600"
              >
                ➡️ Ir al Resultado
              </Button>

              <Button
                onClick={() => (window.location.href = "/redirect")}
                className="bg-orange-500 hover:bg-orange-600"
              >
                🔄 SmartRedirect Real
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card className="bg-slate-800/50 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Logs de Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 p-4 rounded font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-slate-500">No hay logs aún...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
            <Button
              onClick={() => setLogs([])}
              className="mt-2 bg-red-500 hover:bg-red-600"
              size="sm"
            >
              🗑️ Limpiar Logs
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-200 font-semibold mb-4">
            📋 Instrucciones de Debug:
          </h3>
          <ol className="text-blue-200/80 space-y-2">
            <li>
              1. <strong>Verifica tu información de usuario</strong> - ¿Estás
              logueado correctamente?
            </li>
            <li>
              2. <strong>Revisa las academias asignadas</strong> - ¿Aparece
              alguna academia?
            </li>
            <li>
              3. <strong>Simula la redirección</strong> - ¿A dónde deberías ir
              según la lógica?
            </li>
            <li>
              4. <strong>Compara con la redirección real</strong> - ¿Funciona
              igual que la simulación?
            </li>
            <li>
              5. <strong>Revisa los logs</strong> para ver qué está pasando
              exactamente
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
