import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createCheckoutSession } from "@/lib/stripe";
import BlurredPreview from "@/components/BlurredPreview";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  BookOpen,
  FileQuestion,
  CreditCard,
  Star,
  Trophy,
  Download,
  Lock,
  CheckCircle,
  PlayCircle,
  Target,
  Award,
  Brain,
  Zap,
  Crown,
  ArrowLeft,
  Clock,
  FileText,
  RotateCcw,
  Maximize,
  Minimize,
} from "lucide-react";
import Header from "@/components/Header";
import ChatEspecializado from "@/components/curso/ChatEspecializado";
import TestPorTema from "@/components/curso/TestPorTema";
import Flashcards from "@/components/curso/Flashcards";
import ProgresoMotivacion from "@/components/curso/ProgresoMotivacion";
import TemaTipoPDF from "@/components/TemaTipoPDF";
import {
  getCourseById,
  getCourseProgress,
  checkCourseAccess,
  checkIsCurrentUserAdmin,
  ProfessionalCourse,
  CourseProgress,
  CourseTheme,
  getCourseThemes,
  updateCourseProgress,
} from "@/lib/firebaseData";

export default function CursoIndividual() {
  const location = useLocation();
  const params = useParams<{ courseId: string }>();

  // Extract courseId from params or manually from pathname
  let courseId = params.courseId;
  if (!courseId && location.pathname.startsWith("/curso/")) {
    courseId = location.pathname.split("/curso/")[1];
  }

  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("temario");
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(
    null,
  );
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [themes, setThemes] = useState<CourseTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<CourseTheme | null>(null);

  // Temario states (copied from AssistantDetail)
  const [selectedTema, setSelectedTema] = useState<string | null>(null);
  const [pdfCache, setPdfCache] = useState<Record<string, string>>({});
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        if (currentUser) {
          const adminStatus = await checkIsCurrentUserAdmin();
          setIsAdmin(adminStatus);

          // Check course access
          const accessStatus = await checkCourseAccess(
            courseId,
            currentUser.uid,
          );
          setHasAccess(accessStatus);
        } else {
          setIsAdmin(false);
          setHasAccess(false);
        }

        // Load course data
        const { getDemoProfessionalCourses } = await import(
          "@/lib/demoCourses"
        );
        const demoCourses = getDemoProfessionalCourses();
        const courseData = demoCourses.find((c) => c.id === courseId);

        console.log("📋 Demo courses available:", demoCourses.length);
        console.log("🎯 Looking for course:", courseId);
        console.log("✅ Course found:", courseData?.name || "NOT FOUND");

        setCourse(courseData || null);

        if (courseData) {
          // Load or generate themes and save to Firebase
          const {
            getDemoCourseThemes,
            saveCourseToFirebase,
            loadCourseFromFirebase,
          } = await import("@/lib/firebaseData");

          console.log("🔄 Loading/generating themes for:", courseData.name);

          try {
            // Try to load from Firebase first
            const firebaseData = await loadCourseFromFirebase(courseId);

            if (firebaseData.themes && firebaseData.themes.length > 0) {
              console.log(
                "📥 Themes loaded from Firebase:",
                firebaseData.themes.length,
              );
              setThemes(firebaseData.themes);
            } else {
              // Generate themes if not in Firebase
              console.log("🏗️ Generating new themes for course");

              // Force generation of complete course content
              const { forceGenerateCourse } = await import(
                "@/lib/courseAutoGenerator"
              );
              const generated = await forceGenerateCourse(courseId);

              if (generated) {
                console.log("🎉 Course generated successfully");
              }

              // Load the generated themes
              const themesData = getDemoCourseThemes(courseId);
              console.log("📚 Generated themes:", themesData.length);

              // Verify themes have content
              themesData.forEach((theme, index) => {
                console.log(`  Tema ${index + 1}: ${theme.title}`);
                console.log(`    - ${theme.questions?.length || 0} preguntas`);
                console.log(
                  `    - ${theme.flashcards?.length || 0} flashcards`,
                );
              });

              setThemes(themesData);
            }
          } catch (error) {
            // Fallback to demo themes if Firebase fails
            console.log("🔄 Firebase unavailable, generating themes locally");
            const themesData = getDemoCourseThemes(courseId);
            console.log("📚 Demo themes loaded:", themesData.length);
            setThemes(themesData);
          }
        }
      } catch (error: any) {
        console.error("❌ Error loading course data:", error);
        setIsAdmin(false);
        setHasAccess(false);
      } finally {
        console.log("✅ Course loading completed");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [courseId]);

  // Load PDF URLs when tema is selected
  useEffect(() => {
    if (selectedTema && courseId) {
      const themeIndex = themes.findIndex((t) => t.id === selectedTema);
      let pdfFile;

      // Different PDF naming for different courses
      if (courseId === "programador-desde-cero") {
        pdfFile = `tema-${themeIndex + 1}.pdf`;
      } else {
        pdfFile = `${selectedTema}.pdf`;
      }

      const pdfUrl = `/pdfs/${pdfFile}`;

      // Always set the PDF URL directly
      setPdfCache((prev) => ({
        ...prev,
        [selectedTema]: pdfUrl,
      }));
    }
  }, [selectedTema, themes, courseId]);

  const loadCourseThemes = async (
    courseId: string,
    progress?: CourseProgress | null,
  ): Promise<CourseTheme[]> => {
    try {
      console.log("🔄 Loading themes for course:", courseId);

      // Load themes from API
      const themes = await getCourseThemes(courseId);
      console.log("📚 Themes received:", themes.length);

      // Update themes with progress data
      const updatedThemes = themes.map((theme) => ({
        ...theme,
        isCompleted: progress?.themesCompleted?.includes(theme.id) || false,
        testScore: progress?.testScores?.[theme.id],
        flashcardsCompleted: progress?.flashcardsCompleted?.[theme.id] || 0,
      }));

      console.log("✅ Themes processed:", updatedThemes.length);
      return updatedThemes;
    } catch (error) {
      console.error("❌ Error loading course themes:", error);
      // Return empty array instead of failing
      return [];
    }
  };

  const handlePayment = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowPaymentDialog(true);
  };

  const handleStripePayment = async (
    paymentType: "subscription" | "onetime",
  ) => {
    if (!course || !user) return;

    try {
      const amount =
        paymentType === "subscription" ? 20 : course.pricing.one_time_payment;

      console.log("���� Creating checkout session:", {
        courseId: course.id,
        userId: user.uid,
        paymentType,
        amount,
        courseName: course.name,
      });

      // Use the same createCheckoutSession as assistants
      const sessionData = {
        assistantId: course.id, // Use course.id as assistantId
        assistantName: `${course.name} - ${paymentType === "subscription" ? "Suscripción Mensual" : "Acceso Vitalicio"}`,
        price: amount,
        billingCycle: paymentType === "subscription" ? "monthly" : "annual", // For one-time payments, use annual
        isFounder: true, // Default to founder pricing
        userId: user.uid,
      };

      console.log("🔥 Creating checkout session with:", sessionData);

      await createCheckoutSession(sessionData);
      console.log(
        "🔥 Checkout session created successfully - should redirect to Stripe",
      );
    } catch (error) {
      console.error("🔥 Error creating checkout session:", error);
      alert(
        `Error al procesar el pago: ${error instanceof Error ? error.message : "Error desconocido"}`,
      );
    }
  };

  const handleScoreUpdate = (themeId: string, score: number) => {
    // Update local state
    setThemes((prev) =>
      prev.map((theme) =>
        theme.id === themeId ? { ...theme, testScore: score } : theme,
      ),
    );

    // Update course progress
    if (courseProgress) {
      const updatedProgress = {
        ...courseProgress,
        testScores: {
          ...courseProgress.testScores,
          [themeId]: score,
        },
        lastActivity: new Date().toISOString(),
      };
      setCourseProgress(updatedProgress);
    }
  };

  const handleFlashcardProgressUpdate = (
    themeId: string,
    completed: number,
  ) => {
    // Update local state
    setThemes((prev) =>
      prev.map((theme) =>
        theme.id === themeId
          ? { ...theme, flashcardsCompleted: completed }
          : theme,
      ),
    );

    // Update course progress
    if (courseProgress) {
      const updatedProgress = {
        ...courseProgress,
        flashcardsCompleted: {
          ...courseProgress.flashcardsCompleted,
          [themeId]: completed,
        },
        lastActivity: new Date().toISOString(),
      };
      setCourseProgress(updatedProgress);
    }
  };

  const calculateOverallProgress = () => {
    if (themes.length === 0) return 0;
    const completedThemes = themes.filter(
      (theme) => theme.testScore && theme.testScore >= 8,
    ).length;
    return Math.round((completedThemes / themes.length) * 100);
  };

  const canAccessContent = hasAccess || isAdmin;

  // Temario rendering function (copied from AssistantDetail)
  const renderTemario = () => {
    // Use course themes instead of assistant temario
    const currentTemario = {
      totalTopics: themes.length,
      estimatedStudyTime: course?.estimatedDuration || "Estimando...",
      lastUpdated: course?.updatedAt
        ? new Date(course.updatedAt).toLocaleDateString()
        : "Reciente",
      topics: themes.map((theme, index) => ({
        id: theme.id,
        title: theme.name,
        description: theme.description || "Contenido del tema",
        duration: theme.estimatedTime || "30-45 min",
        pdfFile: `tema-${index + 1}.pdf`, // placeholder
      })),
    };

    if (!currentTemario || themes.length === 0) {
      return (
        <div className="text-center text-slate-400 py-8">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No hay temario disponible para este curso</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Información del Temario */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              📚 Temario Oficial - {course?.name || "Curso"}
            </CardTitle>
            {currentTemario && (
              <div className="text-sm text-slate-400">
                <p>
                  📚 {currentTemario.totalTopics} temas • ⏱️ Tiempo estimado:{" "}
                  {currentTemario.estimatedStudyTime}
                </p>
                <p>🔄 Última actualización: {currentTemario.lastUpdated}</p>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Botones de Temas */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              📚 Contenidos del Temario ({currentTemario.totalTopics} temas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTemario.topics?.map((tema, index) => (
                <div
                  key={tema.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedTema === tema.id
                      ? "bg-blue-900/40 border-blue-500 shadow-lg"
                      : "bg-slate-700/30 border-slate-600 hover:border-blue-500/50 hover:bg-slate-700/50"
                  }`}
                  onClick={() => setSelectedTema(tema.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📖</div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        Tema {index + 1}: {tema.title}
                      </h3>
                      <p className="text-slate-400 text-xs mb-2">
                        {tema.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {tema.duration}
                        </Badge>
                        {selectedTema === tema.id && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            ✓ Viendo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedTema !== tema.id && (
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTema(tema.id);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver contenido
                    </Button>
                  )}
                </div>
              )) || (
                <div className="text-center text-slate-400 py-8">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Los temas del temario se están cargando...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visor de PDF mejorado con pantalla completa */}
        {selectedTema ? (
          <div
            className={`${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}
          >
            <Card
              className={`${isFullscreen ? "h-full rounded-none" : "bg-slate-800/50"} border-slate-700`}
            >
              <CardHeader className={`${isFullscreen ? "py-2" : ""} no-print`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">
                    📖{" "}
                    {
                      currentTemario.topics?.find((t) => t.id === selectedTema)
                        ?.title
                    }
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="bg-slate-700 border-slate-600 text-slate-300"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-4 h-4 mr-2" />
                      ) : (
                        <Maximize className="w-4 h-4 mr-2" />
                      )}
                      {isFullscreen ? "Salir" : "Pantalla completa"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTema(null);
                        setIsFullscreen(false);
                      }}
                      className="bg-slate-700 border-slate-600 text-slate-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  </div>
                </div>
                {!isFullscreen && (
                  <p className="text-slate-400 text-sm">
                    Duración estimada:{" "}
                    {
                      currentTemario.topics?.find((t) => t.id === selectedTema)
                        ?.duration
                    }
                  </p>
                )}
              </CardHeader>
              <CardContent className={isFullscreen ? "p-2 h-full pb-4" : ""}>
                {/* Visor de contenido tipo PDF */}
                <div
                  className={`w-full relative ${
                    isFullscreen
                      ? "h-[calc(100vh-120px)] overflow-y-auto"
                      : "h-[600px] overflow-y-auto"
                  } bg-white rounded-lg border border-slate-300`}
                >
                  {(() => {
                    const selectedTheme = currentTemario.topics?.find(
                      (t) => t.id === selectedTema,
                    );
                    const themeIndex =
                      currentTemario.topics?.findIndex(
                        (t) => t.id === selectedTema,
                      ) || 0;

                    if (!selectedTheme) {
                      return (
                        <div className="p-8 text-center">
                          <p className="text-gray-500">Tema no encontrado</p>
                        </div>
                      );
                    }

                    return (
                      <TemaTipoPDF
                        courseId={courseId || ""}
                        themeIndex={themeIndex}
                        themeTitle={selectedTheme.title}
                        themeDescription={
                          selectedTheme.description || "Contenido del tema"
                        }
                        forPrint={false}
                      />
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Selecciona un tema para comenzar
              </h3>
              <p className="text-slate-400 mb-6">
                Haz clic en cualquiera de los temas de arriba para ver su
                contenido completo en formato PDF
              </p>
              <div className="flex justify-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400">
                  📱 Responsive
                </Badge>
                <Badge className="bg-green-500/20 text-green-400">
                  ��� Pantalla completa
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  �� PDFs reales
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-300">Cargando curso...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Curso no encontrado
            </h1>
            <Button onClick={() => navigate("/cursos")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a cursos
            </Button>
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
                {canAccessContent && (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Acceso completo
                  </Badge>
                )}
                {isAdmin && (
                  <Badge className="bg-purple-500/20 text-purple-400">
                    <Crown className="w-3 h-3 mr-1" />
                    Administrador
                  </Badge>
                )}
              </div>

              {canAccessContent && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">Progreso general</span>
                    <span className="text-blue-400 font-semibold">
                      {calculateOverallProgress()}%
                    </span>
                  </div>
                  <Progress
                    value={calculateOverallProgress()}
                    className="h-2"
                  />
                </div>
              )}
            </div>

            {/* Payment Cards - Always shown */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Opciones de Acceso
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Obtén acceso completo a este curso profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Monthly Subscription Card */}
                <Card className="bg-slate-700/50 border-slate-600 hover:border-green-500/50 border transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-400 flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Suscripción Mensual
                      </h3>
                      <Badge className="bg-green-500/20 text-green-400">
                        Recomendado
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">
                      Acceso completo mientras mantengas tu suscripción activa
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">
                        20€/mes
                      </span>
                      {!user ? (
                        <Button
                          onClick={() => navigate("/login")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Iniciar sesión
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleStripePayment("subscription")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Suscribirme
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* One-time Payment Card */}
                <Card className="bg-slate-700/50 border-slate-600 hover:border-blue-500/50 border transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-blue-400 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Pago Único
                      </h3>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        Acceso de por vida
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">
                      Pago único para acceso permanente a este curso específico
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-400">
                        {course.pricing.one_time_payment}€
                      </span>
                      {!user ? (
                        <Button
                          onClick={() => navigate("/login")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Iniciar sesión
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleStripePayment("onetime")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Comprar ahora
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {!hasAccess && user && (
                  <Alert className="bg-yellow-900/20 border-yellow-600">
                    <AlertDescription className="text-yellow-200">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>
                          Selecciona una opción de pago para desbloquear el
                          contenido completo del curso.
                        </span>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {!user && (
                  <Alert className="bg-purple-900/20 border-purple-600">
                    <AlertDescription className="text-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>
                            Inicia sesión para acceder a las opciones de pago
                          </span>
                        </div>
                        <p className="text-xs text-purple-300">
                          ¿No tienes cuenta? También puedes registrarte
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700">
            <TabsTrigger
              key="temario"
              value="temario"
              className="text-slate-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Temario
            </TabsTrigger>
            <TabsTrigger
              key="chat"
              value="chat"
              className="text-slate-300"
              disabled={!canAccessContent}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger
              key="tests"
              value="tests"
              className="text-slate-300"
              disabled={!canAccessContent}
            >
              <FileQuestion className="w-4 h-4 mr-2" />
              Tests
            </TabsTrigger>
            <TabsTrigger
              key="flashcards"
              value="flashcards"
              className="text-slate-300"
              disabled={!canAccessContent}
            >
              <Zap className="w-4 h-4 mr-2" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger
              key="progreso"
              value="progreso"
              className="text-slate-300"
              disabled={!canAccessContent}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Progreso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="temario" className="mt-6">
            <BlurredPreview
              isLocked={!canAccessContent}
              title="Temario Oficial del Curso"
              description="Accede al contenido completo del temario con todos los PDFs y materiales"
              onUnlock={handlePayment}
              unlockButtonText="Desbloquear Temario"
              blurLevel="light"
            >
              {renderTemario()}
            </BlurredPreview>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <BlurredPreview
              isLocked={!canAccessContent}
              title="Chat IA Especializado"
              description="Interactúa con un asistente de IA especializado en este curso"
              onUnlock={handlePayment}
              unlockButtonText="Desbloquear Chat IA"
              blurLevel="medium"
            >
              <ChatEspecializado course={course} hasAccess={canAccessContent} />
            </BlurredPreview>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <BlurredPreview
              isLocked={!canAccessContent}
              title="Tests Interactivos"
              description="Practica con tests especializados del curso y evalúa tu progreso"
              onUnlock={handlePayment}
              unlockButtonText="Desbloquear Tests"
              blurLevel="medium"
            >
              <TestPorTema
                course={course}
                themes={themes}
                hasAccess={canAccessContent}
                onScoreUpdate={handleScoreUpdate}
              />
            </BlurredPreview>
          </TabsContent>

          <TabsContent value="flashcards" className="mt-6">
            <BlurredPreview
              isLocked={!canAccessContent}
              title="Flashcards de Estudio"
              description="Repasa conceptos clave con flashcards interactivas del curso"
              onUnlock={handlePayment}
              unlockButtonText="Desbloquear Flashcards"
              blurLevel="medium"
            >
              <Flashcards
                course={course}
                themes={themes}
                hasAccess={canAccessContent}
                onProgressUpdate={handleFlashcardProgressUpdate}
              />
            </BlurredPreview>
          </TabsContent>

          <TabsContent value="progreso" className="mt-6">
            <BlurredPreview
              isLocked={!canAccessContent}
              title="Seguimiento de Progreso"
              description="Monitorea tu avance, logros y estadísticas de aprendizaje"
              onUnlock={handlePayment}
              unlockButtonText="Desbloquear Progreso"
              blurLevel="medium"
            >
              <ProgresoMotivacion
                course={course}
                progress={courseProgress}
                hasAccess={canAccessContent}
              />
            </BlurredPreview>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {course.image} {course.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Elige tu método de acceso preferido para este curso profesional
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Monthly Subscription */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-green-400">
                    Suscripción Mensual
                  </h3>
                  <Badge className="bg-green-500/20 text-green-400">
                    Recomendado
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Acceso completo mientras mantengas tu suscripción activa
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">
                    20��/mes
                  </span>
                  <Button
                    onClick={() => handleStripePayment("subscription")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Suscribirme
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* One-time Payment */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-400">Pago Único</h3>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    Acceso de por vida
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Pago único para acceso permanente a este curso específico
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-400">
                    {course.pricing.one_time_payment}€
                  </span>
                  <Button
                    onClick={() => handleStripePayment("onetime")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Comprar ahora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
