import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralDashboard from "@/components/ReferralDashboard";
import { useUserReferralCode } from "@/hooks/useReferrals";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Calendar,
  MessageSquare,
  BarChart3,
  Clock,
  Target,
  Star,
  Play,
  FileText,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";

export default function EstudiantePanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Referral code hook
  const { referralCode } = useUserReferralCode(
    user?.uid || null,
    user?.email || null,
    'alumno'
  );

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Cargando panel de estudiante...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <GraduationCap className="w-10 h-10 text-blue-400" />
                Panel de Estudiante
              </h1>
              <p className="text-slate-300 mt-2">
                Bienvenido, {user?.email?.split("@")[0]}
              </p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Star className="w-4 h-4 mr-1" />
              Estudiante Activo
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Cursos Activos</p>
                    <p className="text-white text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Progreso Promedio</p>
                    <p className="text-white text-2xl font-bold">72%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Certificados</p>
                    <p className="text-white text-2xl font-bold">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Horas Estudiadas</p>
                    <p className="text-white text-2xl font-bold">124</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="dashboard" className="text-slate-300">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-slate-300">
              Mis Cursos
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-slate-300">
              Progreso
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-slate-300">
              Referidos
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-slate-300">
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="certificates" className="text-slate-300">
              Certificados
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Play className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white text-sm">Módulo completado</p>
                      <p className="text-slate-400 text-xs">
                        Curso de Programación - Hace 2 horas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white text-sm">
                        Chat con IA utilizado
                      </p>
                      <p className="text-slate-400 text-xs">
                        Auxiliar de Enfermería - Hace 5 horas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white text-sm">Test superado</p>
                      <p className="text-slate-400 text-xs">
                        Puntuación: 85% - Ayer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Próximos Pasos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border border-blue-500/30 bg-blue-500/10 rounded-lg">
                    <p className="text-blue-300 font-medium">
                      Continuar con Programación
                    </p>
                    <p className="text-blue-200 text-sm mt-1">
                      Módulo 5: Arrays y Funciones
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 bg-blue-500 hover:bg-blue-600"
                    >
                      Continuar
                    </Button>
                  </div>
                  <div className="p-3 border border-green-500/30 bg-green-500/10 rounded-lg">
                    <p className="text-green-300 font-medium">
                      Test programado
                    </p>
                    <p className="text-green-200 text-sm mt-1">
                      Auxiliar de Enfermería - Mañana
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 bg-green-500 hover:bg-green-600"
                    >
                      Prepararse
                    </Button>
                  </div>
                  <div className="p-3 border border-purple-500/30 bg-purple-500/10 rounded-lg">
                    <p className="text-purple-300 font-medium">
                      Certificado disponible
                    </p>
                    <p className="text-purple-200 text-sm mt-1">
                      Marketing Digital completado
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 bg-purple-500 hover:bg-purple-600"
                    >
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Course 1 */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">💻</span>
                    Programación desde Cero
                  </CardTitle>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 w-fit">
                    En progreso
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progreso</span>
                      <span className="text-white">65%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-[65%]"></div>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <Play className="w-4 h-4 mr-2" />
                    Continuar
                  </Button>
                </CardContent>
              </Card>

              {/* Course 2 */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">🏥</span>
                    Auxiliar de Enfermería
                  </CardTitle>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 w-fit">
                    Pausado
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progreso</span>
                      <span className="text-white">32%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-[32%]"></div>
                    </div>
                  </div>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600">
                    <Play className="w-4 h-4 mr-2" />
                    Reanudar
                  </Button>
                </CardContent>
              </Card>

              {/* Course 3 */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Marketing Digital
                  </CardTitle>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-fit">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completado
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progreso</span>
                      <span className="text-white">100%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <Trophy className="w-4 h-4 mr-2" />
                    Ver Certificado
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Estadísticas de Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      124
                    </div>
                    <p className="text-slate-400">Horas Estudiadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      47
                    </div>
                    <p className="text-slate-400">Módulos Completados</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      85%
                    </div>
                    <p className="text-slate-400">Puntuación Promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            {user && referralCode ? (
              <ReferralDashboard
                userId={user.uid}
                userEmail={user.email || ''}
                userRole="alumno"
                referralCode={referralCode}
              />
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-300">Cargando sistema de referidos...</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Chat con IA Especializada
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Pregunta cualquier duda sobre tus cursos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                  <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-4">
                    Chat con IA disponible según tu curso activo
                  </p>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Iniciar Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Marketing Digital
                  </CardTitle>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-fit">
                    Certificado Disponible
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Completado el 15 de Diciembre, 2024
                  </p>
                  <p className="text-slate-400 text-sm">
                    Puntuación final: 92%
                  </p>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <FileText className="w-4 h-4 mr-2" />
                    Descargar Certificado
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 opacity-60">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-slate-500" />
                    Programación desde Cero
                  </CardTitle>
                  <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 w-fit">
                    En Progreso (65%)
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-400 text-sm">
                    Certificado disponible al completar 100%
                  </p>
                  <Button disabled className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Pendiente de Completar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
