import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OfflineWelcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to admin after 3 seconds
    const timer = setTimeout(() => {
      navigate("/admin");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center pt-8">
      <div className="max-w-2xl mx-auto p-8">
        <Card className="border-2 border-orange-300 shadow-xl">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <CardTitle className="text-3xl font-bold text-orange-800">
              ¡Sistema Offline Activado!
            </CardTitle>
            <CardDescription className="text-lg text-orange-600">
              Modo sin conexión - Todas las funciones disponibles
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800 font-semibold mb-2">
                ✅ Sistema Completamente Funcional
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Gestión completa de academias</li>
                <li>• Todos los asistentes disponibles</li>
                <li>• Sistema de cursos profesionales</li>
                <li>• Gestión de usuarios y estudiantes</li>
                <li>• Panel de administración completo</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-800 font-semibold mb-2">
                🔐 Sesión Activa
              </div>
              <div className="text-sm text-blue-700">
                Usuario: <strong>admin@demo.com</strong>
                <br />
                Rol: <strong>Administrador</strong>
                <br />
                Estado: <strong>Autenticado offline</strong>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/admin")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
              >
                🚀 Ir al Panel de Administrador
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => navigate("/academia/academia-demo-admin")}
                  variant="outline"
                  className="text-sm"
                >
                  🏫 Academia
                </Button>
                <Button
                  onClick={() => navigate("/estudiante")}
                  variant="outline"
                  className="text-sm"
                >
                  👨‍🎓 Estudiante
                </Button>
                <Button
                  onClick={() => navigate("/asistentes")}
                  variant="outline"
                  className="text-sm"
                >
                  🤖 Asistentes
                </Button>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                Auto-redirección al panel de admin en:
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                <span className="text-orange-600 font-medium">3 segundos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
