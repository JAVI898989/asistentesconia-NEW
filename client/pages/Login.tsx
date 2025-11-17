import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  loginUser,
  registerUser,
  onAuthChange,
  onConnectionStateChange,
  getConnectionStatus,
} from "@/lib/bulletproofAuth";
import { checkIsCurrentUserAdmin } from "@/lib/firebaseData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DomainAuthHelper from "@/components/DomainAuthHelper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import FirebaseDebugInfo from "@/components/FirebaseDebugInfo";
import FirebaseDomainFix from "@/components/FirebaseDomainFix";
import FirebaseVerification from "@/components/FirebaseVerification";
import DirectLoginTest from "@/components/DirectLoginTest";
import NetworkDiagnostics from "@/components/NetworkDiagnostics";
import OfflineMode from "@/components/OfflineMode";
import FirebaseDomainHelper from "@/components/FirebaseDomainHelper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDomainFix, setShowDomainFix] = useState(false);
  const [connectionState, setConnectionState] = useState(getConnectionStatus());
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribeAuth = onAuthChange(async (user) => {
      if (user) {
        console.log("✅ Usuario autenticado:", user.email);

        try {
          // Check user role and redirect accordingly
          const isAdmin = await checkIsCurrentUserAdmin();
          const email = user.email?.toLowerCase() || "";

          if (isAdmin) {
            console.log("👑 Redirigiendo admin a panel");
            navigate("/admin/dashboard");
          } else if (email.includes("academia") || email.includes("centro") || email.includes("director")) {
            console.log("🏫 Redirigiendo academia a panel");
            navigate("/academia-panel");
          } else {
            console.log("🎓 Redirigiendo alumno a panel");
            navigate("/alumno-panel");
          }
        } catch (error) {
          console.error("Error determinando rol:", error);
          navigate("/");
        }
      }
    });

    // Listen to connection state changes
    const unsubscribeConnection = onConnectionStateChange((state) => {
      setConnectionState(state);
      if (state.error) {
        setError(state.error);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeConnection();
    };
  }, [navigate]);

  const handleSubmit = async (isLogin: boolean) => {
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        console.log("🔐 Iniciando sesión con Firebase...");
        await loginUser(email, password);
      } else {
        console.log("📝 Registrando usuario con Firebase...");
        await registerUser(email, password);
      }

      console.log("✅ Autenticación exitosa");
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      console.error("❌ Error de autenticación:", error);

      let errorMessage = error.message || "Error de autenticación desconocido";

      // Check if it's a domain authorization issue on Fly.dev
      if (window.location.hostname.includes("fly.dev") && (
        error.message?.includes("network-request-failed") ||
        error.message?.includes("unauthorized-domain") ||
        error.message?.includes("conexión") ||
        error.message?.includes("network")
      )) {
        errorMessage = `⚠️ Intento de reconexión automática...

🔧 Sistema en modo de prueba para dominio Fly.dev
• La autenticación puede tardar unos segundos
• El sistema intentará métodos alternativos
• Intenta de nuevo si no funciona automáticamente

📞 Contacta al administrador si persiste`;
      }

      setError(errorMessage);

      // Show domain helper for domain authorization errors
      if (
        error.message?.includes("no está autorizado") ||
        error.message?.includes("unauthorized") ||
        error.message?.includes("dominio") ||
        error.message?.includes("domain")
      ) {
        setShowDomainFix(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Bienvenido
            </h1>
            <p className="text-muted-foreground">
              Accede a tus asistentes con IA
            </p>
          </div>

          {/* Firebase Domain Authorization Helper */}
          <DomainAuthHelper
            show={showDomainFix}
            onClose={() => setShowDomainFix(false)}
          />

          <Card>
            <CardHeader>
              <CardTitle>Autenticación</CardTitle>
              <CardDescription>
                Inicia sesión o crea una cuenta nueva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••��•••"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <>
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                      <FirebaseDebugInfo error={error} />
                    </>
                  )}

                  {showDomainFix && <FirebaseDomainHelper />}

                  <Button
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Iniciar sesión
                  </Button>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-register">Contraseña</Label>
                    <Input
                      id="password-register"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {showDomainFix && <FirebaseDomainHelper />}

                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Crear cuenta
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
