import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import BlurredPreview from "@/components/BlurredPreview";
import {
  ProfessionalCourse,
  UserCourseAccess,
  getAllProfessionalCourses,
  getUserCourseAccess,
  createUserCourseAccess,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Play,
  CreditCard,
  Zap,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Award,
  Star,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import Header from "@/components/Header";

export default function CursosPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const [userCourseAccess, setUserCourseAccess] = useState<
    Record<string, UserCourseAccess>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Auth and data loading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadCoursesData();
    }
  }, [user]);

  const loadCoursesData = async () => {
    try {
      setLoading(true);

      // Load professional courses
      const coursesData = await getAllProfessionalCourses();
      setCourses(coursesData);

      // Load user course access
      if (user) {
        const accessData: Record<string, UserCourseAccess> = {};
        for (const course of coursesData) {
          const access = await getUserCourseAccess(user.uid, course.id);
          if (access) {
            accessData[course.id] = access;
          }
        }
        setUserCourseAccess(accessData);
      }
    } catch (error) {
      console.error("Error loading courses data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubscription = async (
    course: ProfessionalCourse,
    type: "monthly" | "one_time",
  ) => {
    if (!user) {
      alert("Debes estar logueado para suscribirte a un curso");
      return;
    }

    try {
      // Check if user already has access
      const existingAccess = userCourseAccess[course.id];
      if (existingAccess) {
        alert("Ya tienes acceso a este curso");
        return;
      }

      const amount =
        type === "monthly"
          ? course.pricing.monthly_subscription
          : course.pricing.one_time_payment;

      // Create Stripe session (mock for now)
      const stripeSessionId = `stripe_session_${Date.now()}`;

      // Create course access
      const accessId = await createUserCourseAccess({
        userId: user.uid,
        courseId: course.id,
        accessType:
          type === "monthly" ? "monthly_subscription" : "one_time_payment",
        status: "active",
        startDate: new Date().toISOString(),
        endDate:
          type === "monthly"
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
        stripeSessionId,
        paymentAmount: amount,
        progress: {
          completedModules: 0,
          totalProgress: 0,
          lastActivity: new Date().toISOString(),
        },
      });

      // Update local state
      const newAccess: UserCourseAccess = {
        id: accessId,
        userId: user.uid,
        courseId: course.id,
        accessType:
          type === "monthly" ? "monthly_subscription" : "one_time_payment",
        status: "active",
        startDate: new Date().toISOString(),
        endDate:
          type === "monthly"
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
        stripeSessionId,
        paymentAmount: amount,
        progress: {
          completedModules: 0,
          totalProgress: 0,
          lastActivity: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUserCourseAccess((prev) => ({
        ...prev,
        [course.id]: newAccess,
      }));

      alert(`¡Felicidades! Te has suscrito a "${course.name}" por €${amount}`);
    } catch (error) {
      console.error("Error subscribing to course:", error);
      alert("Error al suscribirse al curso. Inténtalo de nuevo.");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "hard":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Fácil";
      case "medium":
        return "Medio";
      case "hard":
        return "Difícil";
      default:
        return "No definido";
    }
  };

  const getMyCourses = () => {
    return courses.filter((course) => userCourseAccess[course.id]);
  };

  const getAvailableCourses = () => {
    return courses.filter((course) => !userCourseAccess[course.id]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando cursos...</div>
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
                <BookOpen className="w-10 h-10 text-blue-400" />
                Panel de Cursos Profesionales
              </h1>
              <p className="text-slate-300 mt-2">
                Accede a cursos especializados con inteligencia artificial
              </p>
            </div>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Zap className="w-4 h-4 mr-1" />
              {courses.length} cursos disponibles
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Mis Cursos</p>
                    <p className="text-white text-2xl font-bold">
                      {getMyCourses().length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Disponibles</p>
                    <p className="text-white text-2xl font-bold">
                      {getAvailableCourses().length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Progreso Promedio</p>
                    <p className="text-white text-2xl font-bold">
                      {getMyCourses().length > 0
                        ? Math.round(
                            getMyCourses().reduce((acc, course) => {
                              const access = userCourseAccess[course.id];
                              return (
                                acc + (access?.progress.totalProgress || 0)
                              );
                            }, 0) / getMyCourses().length,
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Certificados</p>
                    <p className="text-white text-2xl font-bold">
                      {
                        getMyCourses().filter((course) => {
                          const access = userCourseAccess[course.id];
                          return access?.progress.totalProgress === 100;
                        }).length
                      }
                    </p>
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
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="all" className="text-slate-300">
              Todos los Cursos
            </TabsTrigger>
            <TabsTrigger value="my-courses" className="text-slate-300">
              Mis Cursos ({getMyCourses().length})
            </TabsTrigger>
            <TabsTrigger value="available" className="text-slate-300">
              Disponibles ({getAvailableCourses().length})
            </TabsTrigger>
          </TabsList>

          {/* All Courses Tab */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const hasAccess = userCourseAccess[course.id];

                return (
                  <Card
                    key={course.id}
                    className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">{course.image}</div>
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg leading-tight">
                            {course.name}
                          </CardTitle>
                          <Badge
                            className={`mt-1 ${getDifficultyColor(course.difficulty)}`}
                          >
                            {getDifficultyText(course.difficulty)}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 w-fit">
                        <Zap className="w-3 h-3 mr-1" />
                        Curso profesional con IA
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {course.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          Duración estimada: {course.estimatedDuration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <BookOpen className="w-4 h-4" />
                          {course.totalModules} módulos
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Award className="w-4 h-4" />
                          Certificado incluido
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        {hasAccess ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-green-400">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="font-medium">Tienes acceso</span>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                              <p className="text-green-300 text-sm">
                                Progreso: {hasAccess.progress.totalProgress}%
                                completado
                              </p>
                              <p className="text-green-200 text-xs mt-1">
                                Tipo:{" "}
                                {hasAccess.accessType === "monthly_subscription"
                                  ? "Suscripción mensual"
                                  : "Pago único"}
                              </p>
                            </div>
                            <Button
                              className="w-full bg-green-500 hover:bg-green-600"
                              onClick={() => {
                                alert(`Accediendo al curso: ${course.name}`);
                              }}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Entrar al curso
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300 text-sm">
                                  Suscripción mensual
                                </span>
                                <span className="text-blue-400 font-bold">
                                  €20/mes
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300 text-sm">
                                  Pago único
                                </span>
                                <span className="text-green-400 font-bold">
                                  €{course.pricing.one_time_payment}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-blue-500 hover:bg-blue-600"
                                onClick={() =>
                                  handleCourseSubscription(course, "monthly")
                                }
                              >
                                <CreditCard className="w-4 h-4 mr-1" />
                                €20/mes
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-green-500 hover:bg-green-600"
                                onClick={() =>
                                  handleCourseSubscription(course, "one_time")
                                }
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />€
                                {course.pricing.one_time_payment}
                              </Button>
                            </div>

                            <p className="text-xs text-slate-500 text-center">
                              Pago único incluye acceso de por vida
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="my-courses" className="space-y-6">
            {getMyCourses().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getMyCourses().map((course) => {
                  const access = userCourseAccess[course.id];

                  return (
                    <Card
                      key={course.id}
                      className="bg-slate-800/50 border-slate-700"
                    >
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <span className="text-2xl">{course.image}</span>
                          {course.name}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                          <Badge
                            className={getDifficultyColor(course.difficulty)}
                          >
                            {getDifficultyText(course.difficulty)}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <p className="text-blue-300 text-sm font-medium">
                            Progreso: {access?.progress.totalProgress}%
                          </p>
                          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${access?.progress.totalProgress}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-green-500 hover:bg-green-600"
                          onClick={() => {
                            alert(`Continuando curso: ${course.name}`);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continuar curso
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    No tienes cursos activos
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Explora nuestros cursos disponibles para comenzar tu
                    formación
                  </p>
                  <Button
                    className="mt-4 bg-blue-500 hover:bg-blue-600"
                    onClick={() => setActiveTab("available")}
                  >
                    Ver cursos disponibles
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Available Courses Tab */}
          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAvailableCourses().map((course) => (
                <Card
                  key={course.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className="text-2xl">{course.image}</span>
                      {course.name}
                    </CardTitle>
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {getDifficultyText(course.difficulty)}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {course.description}
                    </p>

                    <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">
                          Suscripción mensual
                        </span>
                        <span className="text-blue-400 font-bold">€20/mes</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">
                          Pago único
                        </span>
                        <span className="text-green-400 font-bold">
                          €{course.pricing.one_time_payment}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                        onClick={() =>
                          handleCourseSubscription(course, "monthly")
                        }
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        Mensual
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        onClick={() =>
                          handleCourseSubscription(course, "one_time")
                        }
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Único
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
