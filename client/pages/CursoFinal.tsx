import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurredPreview from "@/components/BlurredPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  MessageCircle,
  FileQuestion,
  Trophy,
  ArrowLeft,
  CheckCircle,
  Zap,
  Clock,
  Users,
  Target,
} from "lucide-react";
import Header from "@/components/Header";

export default function CursoFinal() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("temario");
  const [temaSeleccionado, setTemaSeleccionado] = useState<any>(null);

  // FORZAR que siempre empiece sin tema seleccionado
  useEffect(() => {
    setTemaSeleccionado(null);
  }, [courseId]);

  // DATOS FIJOS PARA QUE SIEMPRE FUNCIONE
  const courses = [
    {
      id: "programador-desde-cero",
      name: "Programador desde cero",
      description:
        "Aprende programación desde los fundamentos hasta crear aplicaciones completas",
      image: "💻",
      category: "Tecnología",
      difficulty: "medium",
    },
    {
      id: "auxiliar-veterinaria",
      name: "Auxiliar de Veterinaria",
      description: "Cuidado y asistencia profesional en clínicas veterinarias",
      image: "🐕",
      category: "Sanidad Animal",
      difficulty: "medium",
    },
    {
      id: "peluqueria-profesional",
      name: "Peluquería Profesional",
      description: "Técnicas de corte, peinado y estilismo profesional",
      image: "✂️",
      category: "Belleza",
      difficulty: "easy",
    },
  ];

  // TEMAS FIJOS PARA QUE SIEMPRE SE VEAN
  const temasDefault = [
    {
      id: `${courseId}-tema-1`,
      title: "Introducción y Fundamentos",
      description:
        "Conceptos básicos y fundamentos teóricos del área de estudio",
      estimatedHours: 4,
      questions: 22,
      flashcards: 15,
    },
    {
      id: `${courseId}-tema-2`,
      title: "Técnicas Básicas",
      description:
        "Métodos y técnicas fundamentales para el desarrollo profesional",
      estimatedHours: 6,
      questions: 22,
      flashcards: 15,
    },
    {
      id: `${courseId}-tema-3`,
      title: "Técnicas Avanzadas",
      description: "Métodos especializados y técnicas avanzadas del sector",
      estimatedHours: 8,
      questions: 22,
      flashcards: 15,
    },
    {
      id: `${courseId}-tema-4`,
      title: "Práctica Profesional",
      description: "Aplicación práctica en entornos reales de trabajo",
      estimatedHours: 10,
      questions: 22,
      flashcards: 15,
    },
    {
      id: `${courseId}-tema-5`,
      title: "Proyecto Final",
      description:
        "Desarrollo de un proyecto completo integrando todos los conocimientos",
      estimatedHours: 12,
      questions: 22,
      flashcards: 15,
    },
  ];

  const course = courses.find((c) => c.id === courseId) || courses[0];

  console.log("���� CURSO ACTUAL:", course.name);
  console.log("📚 TEMAS DISPONIBLES:", temasDefault.length);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Curso no encontrado
            </h1>
            <Button onClick={() => navigate("/cursos")}>Volver a cursos</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/cursos")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a cursos
          </Button>

          <div className="flex items-start gap-6">
            <div className="text-6xl">{course.image}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {course.name}
              </h1>
              <p className="text-slate-300 text-lg mb-4">
                {course.description}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-blue-500/20 text-blue-400">
                  {course.category}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {course.difficulty === "easy"
                    ? "Fácil"
                    : course.difficulty === "medium"
                      ? "Medio"
                      : "Avanzado"}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Acceso completo
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="temario" className="text-slate-300">
              <BookOpen className="w-4 h-4 mr-2" />
              Temario
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-slate-300">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-slate-300">
              <FileQuestion className="w-4 h-4 mr-2" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="text-slate-300">
              <Zap className="w-4 h-4 mr-2" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="progreso" className="text-slate-300">
              <Trophy className="w-4 h-4 mr-2" />
              Progreso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="temario" className="mt-6">
            <div className="space-y-6">
              {/* BOTÓN PARA VOLVER A LA VISTA COMPLETA */}
              {temaSeleccionado && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-300 font-semibold">
                        📖 Viendo detalle: {temaSeleccionado.title}
                      </p>
                      <p className="text-yellow-200/70 text-sm">
                        El temario completo está abajo. Haz clic aquí para
                        volver a la vista general.
                      </p>
                    </div>
                    <Button
                      onClick={() => setTemaSeleccionado(null)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
                    >
                      Ver todo el temario
                    </Button>
                  </div>
                </div>
              )}

              {/* SECCIÓN 1: TEMARIO COMPLETO - SIEMPRE VISIBLE */}
              <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-blue-500/30 shadow-lg">
                <CardHeader className="bg-blue-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">
                        📚 TEMARIO COMPLETO - {course.name}
                      </CardTitle>
                      <p className="text-blue-300 font-semibold">
                        {temasDefault.length} temas disponibles
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-300 mt-3">
                    {temaSeleccionado
                      ? "✅ Esta lista SIEMPRE está visible. El detalle del tema aparece abajo."
                      : "👆 Haz clic en cualquier tema para ver su contenido detallado abajo"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {temasDefault.map((tema, index) => (
                      <div
                        key={tema.id}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                          temaSeleccionado?.id === tema.id
                            ? "bg-blue-900/40 border-blue-500 shadow-lg"
                            : "bg-slate-700/30 border-slate-600 hover:border-blue-500/50 hover:bg-slate-700/50"
                        }`}
                        onClick={() => setTemaSeleccionado(tema)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg mb-1">
                              {tema.title}
                            </h3>
                            <p className="text-slate-300 text-sm mb-2">
                              {tema.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <FileQuestion className="w-3 h-3" />
                                {tema.questions} preguntas
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {tema.flashcards} flashcards
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {tema.estimatedHours}h estimadas
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {temaSeleccionado?.id === tema.id ? (
                              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                ✓ Viendo abajo
                              </div>
                            ) : (
                              <div className="bg-slate-600 text-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-500">
                                Ver detalle
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SECCIÓN 2: DETALLE DEL TEMA SELECCIONADO - APARECE DEBAJO */}
              {temaSeleccionado && (
                <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-xl">
                        📖 Contenido del Tema: {temaSeleccionado.title}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTemaSeleccionado(null)}
                        className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        Cerrar detalle
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          📋 Descripción
                        </h3>
                        <p className="text-slate-300">
                          {temaSeleccionado.description}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">
                            📚 Contenido Teórico
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span className="text-slate-300">
                                Fundamentos teóricos esenciales
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span className="text-slate-300">
                                Conceptos clave y terminología
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span className="text-slate-300">
                                Marco conceptual y aplicaciones
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span className="text-slate-300">
                                Principios fundamentales
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">
                            💼 Ejemplos Prácticos
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-slate-300">
                                Caso de estudio real del sector
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-slate-300">
                                Simulación de situación profesional
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-slate-300">
                                Ejercicio guiado paso a paso
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-slate-300">
                                Taller práctico interactivo
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          📊 Estadísticas del Tema
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">
                              {temaSeleccionado.questions}
                            </div>
                            <div className="text-sm text-slate-400">
                              Preguntas
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-400">
                              {temaSeleccionado.flashcards}
                            </div>
                            <div className="text-sm text-slate-400">
                              Flashcards
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-400">
                              {temaSeleccionado.estimatedHours}h
                            </div>
                            <div className="text-sm text-slate-400">
                              Duración
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <FileQuestion className="w-4 h-4 mr-2" />
                          Hacer Test
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Ver Flashcards
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Material de Estudio
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <BlurredPreview
              isLocked={true}
              title="Chat IA Especializado"
              description="Interactúa con un asistente de IA especializado en este curso"
              unlockButtonText="Desbloquear Chat IA"
              blurLevel="medium"
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <p className="text-slate-300">
                    Chat IA especializado - Próximamente
                  </p>
                </CardContent>
              </Card>
            </BlurredPreview>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <BlurredPreview
              isLocked={true}
              title="Tests Interactivos"
              description="Practica con tests especializados del curso y evalúa tu progreso"
              unlockButtonText="Desbloquear Tests"
              blurLevel="medium"
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <p className="text-slate-300">
                    Tests por tema - Próximamente
                  </p>
                </CardContent>
              </Card>
            </BlurredPreview>
          </TabsContent>

          <TabsContent value="flashcards" className="mt-6">
            <BlurredPreview
              isLocked={true}
              title="Flashcards de Estudio"
              description="Repasa conceptos clave con flashcards interactivas del curso"
              unlockButtonText="Desbloquear Flashcards"
              blurLevel="medium"
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <p className="text-slate-300">Flashcards - Próximamente</p>
                </CardContent>
              </Card>
            </BlurredPreview>
          </TabsContent>

          <TabsContent value="progreso" className="mt-6">
            <BlurredPreview
              isLocked={true}
              title="Seguimiento de Progreso"
              description="Monitorea tu avance, logros y estadísticas de aprendizaje"
              unlockButtonText="Desbloquear Progreso"
              blurLevel="medium"
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <p className="text-slate-300">
                    Progreso y motivación - Próximamente
                  </p>
                </CardContent>
              </Card>
            </BlurredPreview>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
