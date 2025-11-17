import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink, X } from "lucide-react";
import { isTempAuthMode, clearTempAuth, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const TempAuthWarning: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    // First check if temp mode is active
    const tempMode = isTempAuthMode();

    if (!tempMode) {
      setIsVisible(false);
      setIsChecking(false);
      return;
    }

    // If temp mode is active, verify if Firebase is actually working now
    const checkFirebaseConnection = async () => {
      try {
        // Try to create an auth state listener to test connection
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            // If we get here without error, Firebase is working
            console.log(
              "✅ Firebase connection successful, clearing temp mode",
            );
            clearTempAuth();
            setIsVisible(false);
            unsubscribe();
          },
          (error) => {
            // If there's still an auth error, keep temp mode
            console.log("❌ Firebase still has issues, keeping temp mode");
            setIsVisible(true);
          },
        );

        // Set timeout to avoid infinite waiting
        setTimeout(() => {
          setIsVisible(tempMode);
          setIsChecking(false);
        }, 2000);
      } catch (error) {
        console.log("❌ Firebase connection failed, showing temp warning");
        setIsVisible(true);
        setIsChecking(false);
      }
    };

    checkFirebaseConnection();
  }, []);

  if (isChecking) {
    return (
      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <div className="text-blue-700">
            🔄 Verificando conexión Firebase...
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!isVisible) return null;

  const currentDomain = window.location.hostname;
  const projectId = "cursor-64188"; // From Firebase config

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleClearAuth = () => {
    clearTempAuth();
    setIsVisible(false);
    window.location.reload();
  };

  const handleTestConnection = async () => {
    try {
      console.log("🔄 Probando conexión Firebase...");
      setIsChecking(true);

      // Test Firebase connection
      const testPromise = new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            unsubscribe();
            resolve(user);
          },
          (error) => {
            unsubscribe();
            reject(error);
          },
        );
      });

      await Promise.race([
        testPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 3000),
        ),
      ]);

      console.log(
        "✅ Firebase funciona correctamente, removiendo modo temporal",
      );
      clearTempAuth();
      setIsVisible(false);
      window.location.reload();
    } catch (error) {
      console.log("❌ Firebase aún tiene problemas:", error);
      setIsChecking(false);
    }
  };

  return (
    <Alert className="bg-yellow-50 border-yellow-200 mb-4">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex-1">
        <div className="space-y-3">
          <div className="font-semibold text-yellow-800">
            ⚠️ MODO TEMPORAL ACTIVO - Solo para Testing
          </div>

          <div className="text-sm text-yellow-700">
            <p className="mb-2">
              El dominio{" "}
              <code className="bg-yellow-100 px-1 py-0.5 rounded">
                {currentDomain}
              </code>{" "}
              no está autorizado en Firebase Console. Estás usando autenticación
              temporal.
            </p>

            <div className="bg-yellow-100 p-3 rounded text-xs space-y-2">
              <div className="font-medium">✅ Para autorizar este dominio:</div>
              <div className="space-y-1">
                <div>
                  1. Ve a{" "}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                  >
                    Firebase Console <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  2. Selecciona proyecto: <code>{projectId}</code>
                </div>
                <div>
                  3. Ve a Authentication → Settings → Authorized domains
                </div>
                <div>
                  4. Añade: <code>{currentDomain}</code>
                </div>
                <div>
                  5. También añade: <code>*.fly.dev</code>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isChecking}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              🔄 Probar Conexión
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              <X className="w-3 h-3 mr-1" />
              Ocultar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearAuth}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              Limpiar Auth Temporal
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Abrir Firebase Console
              </a>
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TempAuthWarning;
