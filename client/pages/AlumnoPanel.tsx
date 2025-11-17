import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  AcademiaStudent,
  Academia,
  getAcademiaStudent,
  getAcademia,
  updateAcademiaStudent,
} from "@/lib/firebaseData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Star,
  Award,
  Brain,
  FileText,
  BarChart3,
  Calendar,
  User as UserIcon,
  School,
  CheckCircle2,
  PlayCircle,
  Zap,
  Trophy,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";

const ASSISTANT_OPTIONS = [
  { id: "guardia-civil", name: "Guardia Civil", category: "seguridad" },
  { id: "policia-nacional", name: "Policía Nacional", category: "seguridad" },
  { id: "policia-local", name: "Polic��a Local", category: "seguridad" },
  { id: "bomberos", name: "Bomberos", category: "seguridad" },
  {
    id: "auxiliar-administrativo-estado",
    name: "Auxiliar Administrativo del Estado",
    category: "administracion",
  },
  {
    id: "administrativo-estado",
    name: "Administrativo del Estado",
    category: "administracion",
  },
  { id: "auxilio-judicial", name: "Auxilio Judicial", category: "justicia" },
  {
    id: "tramitacion-procesal",
    name: "Tramitación Procesal",
    category: "justicia",
  },
  { id: "gestion-procesal", name: "Gestión Procesal", category: "justicia" },
  {
    id: "profesor-secundaria",
    name: "Profesor de Secundaria",
    category: "educacion",
  },
  {
    id: "profesor-primaria",
    name: "Profesor de Primaria",
    category: "educacion",
  },
  {
    id: "auxiliar-enfermeria",
    name: "Auxiliar de Enfermería",
    category: "sanidad",
  },
  { id: "celador-sanitario", name: "Celador Sanitario", category: "sanidad" },
];

export default function AlumnoPanel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<AcademiaStudent | null>(null);
  const [academia, setAcademia] = useState<Academia | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Auth and data loading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      loadStudentData();
    }
  }, [id]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const studentData = await getAcademiaStudent(id!);

      if (!studentData) {
        navigate("/404");
        return;
      }

      setStudent(studentData);

      // Load academia data
      const academiaData = await getAcademia(studentData.academiaId);
      setAcademia(academiaData);
    } catch (error) {
      console.error("Error loading student data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAssistantName = (assistantId?: string) => {
    if (!assistantId) return "Sin asistente asignado";
    const assistant = ASSISTANT_OPTIONS.find((a) => a.id === assistantId);
    return assistant?.name || assistantId;
  };

  const getAssistantCategory = (assistantId?: string) => {
    if (!assistantId) return "";
    const assistant = ASSISTANT_OPTIONS.find((a) => a.id === assistantId);
    return assistant?.category || "";
  };

  const isAssistantAvailable = (assistantId?: string) => {
    if (!assistantId || !academia) return false;
    return academia.assistants.includes(assistantId);
  };

  const updateProgress = async (
    newProgress: Partial<AcademiaStudent["progress"]>,
  ) => {
    if (!student) return;

    try {
      const updatedProgress = { ...student.progress, ...newProgress };
      await updateAcademiaStudent(student.id, { progress: updatedProgress });
      setStudent({ ...student, progress: updatedProgress });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando panel del alumno...</div>
      </div>
    );
  }

  if (!student || !academia) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Alumno no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <UserIcon className="w-10 h-10 text-blue-400" />
                {student.name}
              </h1>
              <p className="text-slate-300 mt-2">
                <School className="w-4 h-4 inline mr-2" />
                {academia.name}
              </p>
            </div>
            <Badge
              className={
                student.status === "active"
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-red-500/20 text-red-300 border-red-500/30"
              }
            >
              {student.status === "active" ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Sesiones</p>
                    <p className="text-white text-2xl font-bold">
                      {student.progress.totalSessions}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Temas completados</p>
                    <p className="text-white text-2xl font-bold">
                      {student.progress.completedTopics}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Puntuación media</p>
                    <p className="text-white text-2xl font-bold">
                      {student.progress.averageScore}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Última actividad</p>
                    <p className="text-white text-sm font-medium">
                      {new Date(
                        student.progress.lastActivity,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assistant Status */}
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {getAssistantName(student.assignedAssistant)}
                    </h3>
                    <p className="text-slate-400 text-sm capitalize">
                      {getAssistantCategory(student.assignedAssistant)}
                    </p>
                  </div>
                </div>
                <div>
                  {isAssistantAvailable(student.assignedAssistant) ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Disponible
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      No disponible
                    </Badge>
                  )}
                </div>
              </div>
              {!isAssistantAvailable(student.assignedAssistant) && (
                <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-orange-300 text-sm">
                    ⚠️ Este asistente no está disponible en tu academia.
                    Contacta con tu profesor para solicitar acceso.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="dashboard" className="text-slate-300">
              Panel
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-slate-300">
              Chat
            </TabsTrigger>
            <TabsTrigger value="temario" className="text-slate-300">
              Temario
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-slate-300">
              Tests
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="text-slate-300">
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="progreso" className="text-slate-300">
              Progreso
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Tu Rendimiento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progreso general</span>
                      <span className="text-white font-medium">
                        {student.progress.averageScore}%
                      </span>
                    </div>
                    <Progress
                      value={student.progress.averageScore}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">
                        {student.progress.totalSessions}
                      </p>
                      <p className="text-slate-400 text-sm">Sesiones de chat</p>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">
                        {student.progress.completedTopics}
                      </p>
                      <p className="text-slate-400 text-sm">
                        Temas completados
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <h4 className="text-white font-medium mb-3">
                      Objetivos de la semana
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300 text-sm">
                          Completar 3 sesiones de chat
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300 text-sm">
                          Estudiar 2 temas nuevos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">
                          Hacer 1 test de repaso
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Acceso Rápido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isAssistantAvailable(student.assignedAssistant) ? (
                    <>
                      <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 justify-start"
                        onClick={() => setActiveTab("chat")}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Continuar Chat con{" "}
                        {getAssistantName(student.assignedAssistant)}
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
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                      <p className="text-orange-300 mb-2">
                        Asistente no disponible
                      </p>
                      <p className="text-slate-400 text-sm">
                        El asistente "
                        {getAssistantName(student.assignedAssistant)}" no está
                        incluido en tu academia.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 border-orange-500/30 text-orange-300 hover:bg-orange-500/20"
                        onClick={() =>
                          (window.location.href = `mailto:${academia.adminEmail}?subject=Solicitar acceso a asistente&body=Hola, me gustaría solicitar acceso al asistente ${getAssistantName(student.assignedAssistant)} para mi cuenta.`)
                        }
                      >
                        Contactar profesor
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        Sesión de chat completada
                      </p>
                      <p className="text-slate-400 text-xs">Hace 2 horas</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      +10 pts
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        Tema completado: Constitución Española
                      </p>
                      <p className="text-slate-400 text-xs">Ayer</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      +25 pts
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        Test realizado: Puntuación 85%
                      </p>
                      <p className="text-slate-400 text-xs">Hace 2 días</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      +15 pts
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Chat con {getAssistantName(student.assignedAssistant)}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                {isAssistantAvailable(student.assignedAssistant) ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-white text-lg mb-2">
                        Chat interactivo próximamente
                      </p>
                      <p className="text-slate-400">
                        Aquí podrás chatear con tu asistente especializado
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                      <p className="text-orange-300 text-lg mb-2">
                        Asistente no disponible
                      </p>
                      <p className="text-slate-400">
                        Contacta con tu profesor para obtener acceso
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Temario Tab */}
          <TabsContent value="temario" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Temario de {getAssistantName(student.assignedAssistant)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAssistantAvailable(student.assignedAssistant) ? (
                  <div className="space-y-3">
                    {[
                      "1. Constitución Española",
                      "2. Organización del Estado",
                      "3. Administración Pública",
                      "4. Procedimiento Administrativo",
                      "5. Régimen Local",
                    ].map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-white">{topic}</span>
                        </div>
                        <Badge
                          className={
                            index < 2
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                          }
                        >
                          {index < 2 ? "Completado" : "Pendiente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-300">
                      Temario no disponible - Asistente no incluido en la
                      academia
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Tests y Evaluaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAssistantAvailable(student.assignedAssistant) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h3 className="text-white font-medium mb-2">
                        Test de Constitución
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">
                        25 preguntas • 30 minutos
                      </p>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Empezar Test
                      </Button>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h3 className="text-white font-medium mb-2">
                        Simulacro General
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">
                        100 preguntas • 90 minutos
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Próximamente
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-300">
                      Tests no disponibles - Asistente no incluido en la
                      academia
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Flashcards de Repaso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAssistantAvailable(student.assignedAssistant) ? (
                  <div className="text-center py-8">
                    <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">
                      Sistema de flashcards próximamente
                    </p>
                    <p className="text-slate-400">
                      Repasa conceptos clave de forma rápida y eficiente
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-300">
                      Flashcards no disponibles - Asistente no incluido en la
                      academia
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progreso" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Estadísticas Detalladas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progreso general</span>
                      <span className="text-white font-medium">
                        {student.progress.averageScore}%
                      </span>
                    </div>
                    <Progress
                      value={student.progress.averageScore}
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-400">
                        {student.progress.totalSessions}
                      </p>
                      <p className="text-slate-400 text-sm">Total sesiones</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-400">
                        {student.progress.completedTopics}
                      </p>
                      <p className="text-slate-400 text-sm">
                        Temas completados
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <h4 className="text-white font-medium mb-3">
                      Racha de estudio
                    </h4>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">
                        7 días consecutivos
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Logros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Award className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">Primera sesión</p>
                      <p className="text-slate-400 text-sm">
                        Completaste tu primera sesión de chat
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Star className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">
                        Estudiante dedicado
                      </p>
                      <p className="text-slate-400 text-sm">
                        7 días consecutivos de estudio
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg opacity-50">
                    <Trophy className="w-8 h-8 text-slate-500" />
                    <div>
                      <p className="text-slate-500 font-medium">
                        Maestro del temario
                      </p>
                      <p className="text-slate-500 text-sm">
                        Completa 10 temas del temario
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
