import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  MessageCircle,
  FileQuestion,
  Trophy,
  ArrowLeft,
  Target,
  CheckCircle,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import {
  ProfessionalCourse,
  CourseTheme,
  getDemoCourseThemes,
} from "@/lib/firebaseData";
import { getDemoProfessionalCourses } from "@/lib/demoCourses";

export default function CursoIndividualFixed() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("temario");
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [themes, setThemes] = useState<CourseTheme[]>([]);

  useEffect(() => {
    if (!courseId) return;

    console.log("🚀 CARGANDO CURSO:", courseId);

    // Cargar curso inmediatamente
    const courses = getDemoProfessionalCourses();
    const courseData = courses.find((c) => c.id === courseId);

    console.log("📋 Curso encontrado:", courseData?.name);
    setCourse(courseData || null);

    // SIEMPRE generar temas - incluso si no hay courseData
    console.log("🏗️ GENERANDO TEMAS FORZADAMENTE...");
    const themesData = getDemoCourseThemes(courseId);
    console.log("📚 TEMAS GENERADOS:", themesData.length);

    themesData.forEach((theme, i) => {
      console.log(`  ${i + 1}. ${theme.title}`);
      console.log(`     - ${theme.questions?.length || 0} preguntas`);
      console.log(`     - ${theme.flashcards?.length || 0} flashcards`);
    });

    setThemes(themesData);
    console.log("✅ TEMAS ESTABLECIDOS EN STATE");
  }, [courseId]);

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

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">Progreso general</span>
                  <span className="text-blue-400 font-semibold">0%</span>
                </div>
                <Progress value={0} className="h-2" />
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
              {/* Course Overview */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Temario del Curso - {course.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Descripción del Curso
                      </h3>
                      <p className="text-slate-300 mb-4">
                        {course.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Categoría:</span>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {course.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Dificultad:</span>
                          <Badge
                            className={
                              course.difficulty === "easy"
                                ? "bg-green-500/20 text-green-400"
                                : course.difficulty === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }
                          >
                            {course.difficulty === "easy"
                              ? "Fácil"
                              : course.difficulty === "medium"
                                ? "Medio"
                                : "Avanzado"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Módulos:</span>
                          <span className="text-blue-400 font-semibold">
                            {themes.length} temas
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Estadísticas del Curso
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            Temas disponibles:
                          </span>
                          <span className="text-green-400 font-semibold">
                            {themes.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            Preguntas totales:
                          </span>
                          <span className="text-blue-400 font-semibold">
                            {themes.reduce(
                              (acc, theme) =>
                                acc + (theme.questions?.length || 0),
                              0,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            Flashcards totales:
                          </span>
                          <span className="text-purple-400 font-semibold">
                            {themes.reduce(
                              (acc, theme) =>
                                acc + (theme.flashcards?.length || 0),
                              0,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Themes */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  Temas del Curso ({themes.length})
                </h2>

                {/* DEBUG INFO */}
                <div className="bg-red-900/50 p-4 rounded text-white">
                  <p>🔍 DEBUG - Temas en state: {themes.length}</p>
                  <p>🔍 Course ID: {courseId}</p>
                  <p>🔍 Course name: {course?.name || "Sin curso"}</p>
                  {themes.length === 0 && (
                    <p className="text-yellow-300">
                      ⚠️ NO HAY TEMAS - Forzando generación...
                    </p>
                  )}
                </div>

                {themes.length === 0 ? (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-4">
                          🚨 GENERANDO TEMAS AHORA...
                        </h3>
                        <p className="text-slate-300 mb-4">
                          Los temas se están generando. Refresca la página en 2
                          segundos.
                        </p>
                        <Button
                          onClick={() => window.location.reload()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Refrescar Página
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  themes.map((theme, index) => (
                    <Card
                      key={theme.id}
                      className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold">
                                {index + 1}
                              </div>
                              <CardTitle className="text-white">
                                {theme.title}
                              </CardTitle>
                            </div>
                            <p className="text-slate-400">
                              {theme.description}
                            </p>

                            <div className="mt-3 flex items-center gap-4">
                              <span className="text-sm text-slate-500">
                                {theme.questions?.length || 0} preguntas
                              </span>
                              <span className="text-sm text-slate-500">
                                {theme.flashcards?.length || 0} flashcards
                              </span>
                              <span className="text-sm text-slate-500">
                                {theme.estimatedHours || 4}h estimadas
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <p className="text-slate-300">
                  Chat IA especializado - Próximamente
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <p className="text-slate-300">Tests por tema - Próximamente</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <p className="text-slate-300">Flashcards - Próximamente</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progreso" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <p className="text-slate-300">
                  Progreso y motivación - Próximamente
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
