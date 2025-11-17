import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

export const InstantOfflineAccess: React.FC = () => {
  const navigate = useNavigate();

  const handleInstantAccess = async (role: string) => {
    try {
      // Import offline auth dynamically to avoid any network calls
      const { loginUserOffline, seedDemoAccounts } = await import(
        "@/lib/offlineAuth"
      );

      // Ensure demo accounts exist
      seedDemoAccounts();

      let email, password;
      switch (role) {
        case "admin":
          email = "admin@demo.com";
          password = "demo123";
          break;
        case "teacher":
          email = "profesor@demo.com";
          password = "demo123";
          break;
        case "student":
          email = "estudiante@demo.com";
          password = "demo123";
          break;
        default:
          email = "admin@demo.com";
          password = "demo123";
      }

      // Direct offline login
      await loginUserOffline(email, password);
      console.log(`✅ Instant ${role} access successful`);

      // Direct navigation based on role
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
          navigate("/academias");
          break;
        case "student":
          navigate("/panel");
          break;
        default:
          navigate("/redirect");
      }
    } catch (error) {
      console.error("Instant access failed:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6 mb-4">
      <Alert className="mb-4 border-red-400 bg-red-50">
        <AlertDescription>
          <div className="space-y-2">
            <div className="font-bold text-red-800 text-xl">
              🚨 ACCESO DIRECTO - Red No Disponible
            </div>
            <div className="text-red-700">
              Se detectaron problemas de red. Usa estos accesos directos para
              entrar inmediatamente en modo offline:
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid gap-3">
        <Button
          onClick={() => handleInstantAccess("admin")}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3"
        >
          👨‍💼 ACCESO ADMIN (admin@demo.com)
        </Button>

        <Button
          onClick={() => handleInstantAccess("teacher")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
        >
          👨‍🏫 ACCESO PROFESOR (profesor@demo.com)
        </Button>

        <Button
          onClick={() => handleInstantAccess("student")}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
        >
          👨‍🎓 ACCESO ESTUDIANTE (estudiante@demo.com)
        </Button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
        <div className="text-sm text-yellow-800">
          <div className="font-semibold mb-2">💡 Información:</div>
          <ul className="space-y-1 text-xs">
            <li>• Estos accesos funcionan completamente offline</li>
            <li>• No requieren conexión a Firebase</li>
            <li>• Los datos se almacenan localmente</li>
            <li>• Todas las funciones están disponibles</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstantOfflineAccess;
