import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  FileText,
  BookOpen,
  Users,
  Settings,
  ArrowRight,
  Shield,
  Database,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

export default function AdminAccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">
              Panel de Administración
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Gestiona asistentes, cursos, temarios y todo el contenido educativo
          </p>
          <Badge className="mt-4 bg-yellow-500/20 text-yellow-400 px-4 py-2">
            👑 Acceso de Administrador
          </Badge>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Asistentes */}
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-blue-400" />
                Gestión de Asistentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Administra asistentes IA, precios, plazas de fundador y temarios
                PDF
              </p>
              <div className="space-y-2 mb-4">
                <Badge className="bg-blue-500/20 text-blue-400">
                  📄 Temarios PDF
                </Badge>
                <Badge className="bg-green-500/20 text-green-400">
                  👑 Plazas Fundador
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  💰 Precios
                </Badge>
              </div>
              <Link to="/admin/asistentes">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-all">
                  <FileText className="w-4 h-4 mr-2" />
                  Gestionar Asistentes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Cursos */}
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-green-400" />
                Gestión de Cursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Administra cursos profesionales, módulos y contenido educativo
              </p>
              <div className="space-y-2 mb-4">
                <Badge className="bg-green-500/20 text-green-400">
                  📚 Módulos
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400">
                  🎓 Certificaciones
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  ⭐ Ratings
                </Badge>
              </div>
              <Link to="/admin/cursos">
                <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:scale-105 transition-all">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Gestionar Cursos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Panel Principal */}
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-purple-400" />
                Panel Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Dashboard principal con estadísticas y configuración general
              </p>
              <div className="space-y-2 mb-4">
                <Badge className="bg-purple-500/20 text-purple-400">
                  📊 Estadísticas
                </Badge>
                <Badge className="bg-orange-500/20 text-orange-400">
                  👥 Usuarios
                </Badge>
                <Badge className="bg-red-500/20 text-red-400">
                  ⚙️ Configuración
                </Badge>
              </div>
              <Link to="/admin">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:scale-105 transition-all">
                  <Settings className="w-4 h-4 mr-2" />
                  Panel Principal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center">
              🎯 Funcionalidades Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Temarios PDF</h3>
                <p className="text-slate-400 text-sm">
                  Gestiona temarios divididos por temas con archivos PDF
                </p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Usuarios</h3>
                <p className="text-slate-400 text-sm">
                  Administra estudiantes, profesores y suscripciones
                </p>
              </div>
              <div className="text-center">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">
                  Plazas Fundador
                </h3>
                <p className="text-slate-400 text-sm">
                  Gestiona límites y precios especiales de fundador
                </p>
              </div>
              <div className="text-center">
                <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Estadísticas</h3>
                <p className="text-slate-400 text-sm">
                  Métricas de uso, ingresos y rendimiento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white text-center">
              📋 Gestión de Temarios PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">1</Badge>
                <div>
                  <h4 className="text-white font-semibold">
                    Accede a Asistentes o Cursos
                  </h4>
                  <p className="text-slate-400">
                    Usa los botones de arriba para gestionar contenido
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">2</Badge>
                <div>
                  <h4 className="text-white font-semibold">
                    Gestiona Temarios
                  </h4>
                  <p className="text-slate-400">
                    Haz clic en el icono 📄 para gestionar temarios por temas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">3</Badge>
                <div>
                  <h4 className="text-white font-semibold">Sube PDFs</h4>
                  <p className="text-slate-400">
                    Sube archivos PDF divididos por temas con título y
                    descripción
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">4</Badge>
                <div>
                  <h4 className="text-white font-semibold">Vista Previa</h4>
                  <p className="text-slate-400">
                    Usa el icono 👁️ para ver cómo se muestra públicamente
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
