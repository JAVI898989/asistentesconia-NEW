import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageSquare,
  BookOpen,
  Target,
  Zap,
  TrendingUp,
  Star,
  GraduationCap,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Crown,
  Trophy,
  Calendar,
  Clock,
  PlayCircle
} from "lucide-react";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import TemarioCompletoGC from "@/components/curso/TemarioCompletoGC";
import TestPorTemaGC from "@/components/curso/TestPorTemaGC";
import FlashcardsGC from "@/components/curso/FlashcardsGC";
import ProgresoMotivacion from "@/components/curso/ProgresoMotivacion";

interface StudentData {
  progress: {
    totalSessions: number;
    completedTopics: number;
    averageScore: number;
    lastActivity: string;
    currentStreak: number;
  };
  assignedAssistant?: string;
  subscriptionType?: 'monthly' | 'annual' | 'free';
}

export default function StudentPanel() {
  const { user, permissions, hasActiveSubscription, isLoading } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [studentData, setStudentData] = useState<StudentData>({
    progress: {
      totalSessions: 12,
      completedTopics: 8,
      averageScore: 85,
      lastActivity: new Date().toISOString(),
      currentStreak: 7
    },
    assignedAssistant: "guardia-civil",
    subscriptionType: hasActiveSubscription ? 'monthly' : 'free'
  });

  // Redirect if no access to student panel
  useEffect(() => {
    if (!isLoading && !permissions.canAccessStudentPanel) {
      navigate('/');
    }
  }, [permissions.canAccessStudentPanel, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando panel de estudiante...</div>
      </div>
    );
  }

  const canAccessPaidContent = permissions.canUseChat &&
                               permissions.canAccessTemario &&
                               permissions.canAccessTests &&
                               permissions.canAccessFlashcards;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <GraduationCap className="w-10 h-10 text-blue-400" />
                Panel de Estudiante
              </h1>
              <p className="text-slate-300 mt-2">
                Bienvenido, {user?.email?.split("@")[0]}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={
                hasActiveSubscription
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-orange-500/20 text-orange-300 border-orange-500/30"
              }>
                {hasActiveSubscription ? (
                  <>
                    <Crown className="w-4 h-4 mr-1" />
                    Suscripción Activa
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-1" />
                    Sin Suscripción
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Subscription Alert */}
          {!hasActiveSubscription && (
            <Alert className="mb-6 bg-orange-900/20 border-orange-600">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-orange-300">
                <strong>Suscripción requerida:</strong> Para acceder al chat, temario, tests y flashcards necesitas una suscripción activa.
                Solo puedes ver la información pública del asistente.
                <Button
                  className="ml-3 bg-orange-600 hover:bg-orange-700"
                  size="sm"
                  onClick={() => navigate('/checkout')}
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Suscribirse
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-8 h-8 ${canAccessPaidContent ? 'text-blue-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-slate-400 text-sm">Sesiones de Chat</p>
                    <p className="text-white text-2xl font-bold">
                      {canAccessPaidContent ? studentData.progress.totalSessions : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-8 h-8 ${canAccessPaidContent ? 'text-green-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-slate-400 text-sm">Temas Completados</p>
                    <p className="text-white text-2xl font-bold">
                      {canAccessPaidContent ? studentData.progress.completedTopics : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className={`w-8 h-8 ${canAccessPaidContent ? 'text-purple-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-slate-400 text-sm">Puntuación Media</p>
                    <p className="text-white text-2xl font-bold">
                      {canAccessPaidContent ? `${studentData.progress.averageScore}%` : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className={`w-8 h-8 ${canAccessPaidContent ? 'text-orange-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-slate-400 text-sm">Racha Actual</p>
                    <p className="text-white text-2xl font-bold">
                      {canAccessPaidContent ? `${studentData.progress.currentStreak} días` : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="dashboard" className="text-slate-300">
              Panel
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className={`text-slate-300 ${!permissions.canUseChat ? 'opacity-50' : ''}`}
              disabled={!permissions.canUseChat}
            >
              Chat {!permissions.canUseChat && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger
              value="temario"
              className={`text-slate-300 ${!permissions.canAccessTemario ? 'opacity-50' : ''}`}
              disabled={!permissions.canAccessTemario}
            >
              Temario {!permissions.canAccessTemario && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className={`text-slate-300 ${!permissions.canAccessTests ? 'opacity-50' : ''}`}
              disabled={!permissions.canAccessTests}
            >
              Tests {!permissions.canAccessTests && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger
              value="flashcards"
              className={`text-slate-300 ${!permissions.canAccessFlashcards ? 'opacity-50' : ''}`}
              disabled={!permissions.canAccessFlashcards}
            >
              Flashcards {!permissions.canAccessFlashcards && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="progreso" className="text-slate-300">
              Progreso
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assistant Info */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Tu Asistente</CardTitle>
                  <CardDescription className="text-slate-400">
                    Información del asistente especializado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Guardia Civil</h3>
                        <p className="text-slate-400 text-sm">Especializado en oposiciones de seguridad</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Información Pública</h4>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>• Temario oficial actualizado</li>
                          <li>• Requisitos y convocatorias</li>
                          <li>• Salario: 1.100-1.300€/mes</li>
                          <li>• Próxima convocatoria: Primavera 2024</li>
                        </ul>
                      </div>

                      {hasActiveSubscription && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <h4 className="text-green-300 font-medium mb-2">
                            <CheckCircle2 className="w-4 h-4 inline mr-1" />
                            Contenido Premium Desbloqueado
                          </h4>
                          <ul className="space-y-1 text-green-200 text-sm">
                            <li>• Chat interactivo especializado</li>
                            <li>• Temario completo con 27 temas</li>
                            <li>• Tests y simulacros</li>
                            <li>• Flashcards de repaso</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasActiveSubscription ? (
                    <>
                      <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 justify-start"
                        onClick={() => setActiveTab("chat")}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Continuar Chat con Asistente
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start"
                        onClick={() => setActiveTab("temario")}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Estudiar Temario
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start"
                        onClick={() => setActiveTab("tests")}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Hacer Tests
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start"
                        onClick={() => setActiveTab("flashcards")}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Repasar Flashcards
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <Lock className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                      <p className="text-orange-300 mb-4">Suscripción requerida</p>
                      <p className="text-slate-400 text-sm mb-4">
                        Obtén acceso completo al contenido premium
                      </p>
                      <Button
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => navigate('/checkout')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Ver Planes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            {permissions.canUseChat ? (
              <Chat assistantId="guardia-civil" />
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Lock className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-300 text-lg mb-2">Chat Premium</p>
                    <p className="text-slate-400 mb-4">Necesitas una suscripción activa para usar el chat</p>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate('/checkout')}
                    >
                      Activar Suscripción
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Temario Tab */}
          <TabsContent value="temario" className="space-y-6">
            {permissions.canAccessTemario ? (
              <TemarioCompletoGC assistantId="guardia-civil" />
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-300 text-lg mb-2">Temario Premium</p>
                    <p className="text-slate-400 mb-4">Accede a todos los temas y contenido especializado</p>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate('/checkout')}
                    >
                      Desbloquear Temario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            {permissions.canAccessTests ? (
              <TestPorTemaGC assistantId="guardia-civil" />
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Target className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-300 text-lg mb-2">Tests Premium</p>
                    <p className="text-slate-400 mb-4">Practica con tests especializados y simulacros</p>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate('/checkout')}
                    >
                      Activar Tests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="space-y-6">
            {permissions.canAccessFlashcards ? (
              <FlashcardsGC assistantId="guardia-civil" />
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-300 text-lg mb-2">Flashcards Premium</p>
                    <p className="text-slate-400 mb-4">Repasa conceptos clave de forma interactiva</p>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate('/checkout')}
                    >
                      Activar Flashcards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progreso Tab */}
          <TabsContent value="progreso" className="space-y-6">
            {hasActiveSubscription ? (
              <ProgresoMotivacion
                assistantId="guardia-civil"
                progress={{
                  totalSessions: studentData.progress.totalSessions,
                  completedTopics: studentData.progress.completedTopics,
                  averageScore: studentData.progress.averageScore,
                  currentStreak: studentData.progress.currentStreak
                }}
              />
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Progreso y Motivación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-300 text-lg mb-2">Seguimiento Premium</p>
                    <p className="text-slate-400 mb-4">
                      Ve tu progreso detallado, logros y estadísticas
                    </p>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => navigate('/checkout')}
                    >
                      Ver Mi Progreso
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
