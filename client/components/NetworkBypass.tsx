import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NetworkBypass: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately set up offline environment
    const setupOfflineEnvironment = async () => {
      try {
        console.log("🚨 NETWORK BYPASS ACTIVATED");
        console.log("📱 Setting up complete offline environment...");

        // Import offline auth
        const { seedDemoAccounts, loginUserOffline } = await import(
          "@/lib/offlineAuth"
        );

        console.log("📦 Creating demo accounts...");
        // Set up demo accounts
        const accountsCreated = seedDemoAccounts();
        console.log(`✅ ${accountsCreated} demo accounts ready`);

        console.log("🔐 Auto-logging in as admin...");
        // Auto-login as admin
        await loginUserOffline("admin@demo.com", "demo123");
        console.log("✅ Admin session established offline");

        console.log("🎯 Preparing to redirect to admin panel...");
        // Navigate directly to admin panel
        setTimeout(() => {
          console.log("🚀 Redirecting to admin panel...");
          navigate("/admin");
        }, 2000);
      } catch (error) {
        console.error("❌ Bypass setup failed:", error);
        // Fallback: try direct navigation anyway
        setTimeout(() => {
          console.log("🔄 Attempting fallback navigation...");
          navigate("/admin");
        }, 3000);
      }
    };

    setupOfflineEnvironment();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border-2 border-red-300">
        <div className="text-center space-y-4">
          <div className="text-6xl">🚨</div>
          <div className="text-2xl font-bold text-red-700">
            BYPASS DE RED ACTIVADO
          </div>
          <div className="text-gray-600">
            Se detectaron problemas de conectividad.
            <br />
            Activando modo offline automáticamente...
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="text-red-600 font-medium">
              Configurando acceso offline
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-4 space-y-1">
            <div>✅ Configurando cuentas demo offline</div>
            <div>✅ Activando sesión de administrador</div>
            <div>✅ Preparando acceso sin conexión</div>
            <div className="font-semibold mt-2">
              Serás redirigido automáticamente al panel de administrador.
            </div>
          </div>

          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded">
            <div className="text-xs text-green-700">
              <div className="font-semibold mb-1">
                🎯 ¿Qué puedes hacer en modo offline?
              </div>
              <ul className="space-y-1">
                <li>• Gestionar usuarios y academias</li>
                <li>• Acceder a todos los asistentes</li>
                <li>• Administrar cursos y contenido</li>
                <li>• Usar todas las funciones de la app</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkBypass;
