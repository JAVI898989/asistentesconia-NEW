import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "@/lib/stripe";
import {
  getAllProfessionalCourses,
  getAllUserCourseAccess,
  checkCourseAccess,
  ProfessionalCourse,
  UserCourseAccess,
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
  Monitor,
  Stethoscope,
  Scissors,
  Zap,
  Wrench,
  Sparkles,
  Palette,
  Megaphone,
  Video,
  TrendingUp,
  FileText,
  Calculator,
  Globe,
  Heart,
  Users2,
  ChefHat,
  Phone,
  Shield,
  Code,
  Share2,
  Star,
  CreditCard,
  CheckCircle,
  Lock,
  Crown,
  PlayCircle,
} from "lucide-react";
import Header from "@/components/Header";

interface LocalCourse extends ProfessionalCourse {
  icon: React.ComponentType<any>;
  featured: boolean;
}

const PROFESSIONAL_COURSES: LocalCourse[] = [
  {
    id: "programador-desde-cero",
    name: "Programador desde cero",
    description:
      "Aprende programación desde los fundamentos hasta crear aplicaciones completas",
    icon: Monitor,
    image: "💻",
    category: "Tecnología",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 200 },
    featured: true,
  },
  {
    id: "auxiliar-veterinaria",
    name: "Auxiliar de Veterinaria",
    description: "Cuidado y asistencia profesional en clínicas veterinarias",
    icon: Stethoscope,
    image: "🐕",
    category: "Sanidad Animal",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 180 },
    featured: true,
  },
  {
    id: "peluqueria-profesional",
    name: "Peluquería Profesional",
    description: "Técnicas de corte, peinado y estilismo profesional",
    icon: Scissors,
    image: "✂️",
    category: "Belleza",
    difficulty: "easy",
    pricing: { monthly_subscription: 20, one_time_payment: 80 },
    featured: false,
  },
  {
    id: "electricista",
    name: "Electricista",
    description: "Instalaciones eléctricas residenciales e industriales",
    icon: Zap,
    image: "⚡",
    category: "Oficios",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 250 },
    featured: false,
  },
  {
    id: "fontaneria",
    name: "Fontanería",
    description: "Instalaciones de agua, calefacción y saneamiento",
    icon: Wrench,
    image: "🔧",
    category: "Oficios",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 220 },
    featured: false,
  },
  {
    id: "estetica-belleza",
    name: "Estética y Belleza",
    description:
      "Tratamientos faciales, corporales y técnicas de embellecimiento",
    icon: Sparkles,
    image: "✨",
    category: "Belleza",
    difficulty: "easy",
    pricing: { monthly_subscription: 20, one_time_payment: 90 },
    featured: false,
  },
  {
    id: "diseno-grafico",
    name: "Diseño Gráfico",
    description: "Creación de diseños visuales, logos y material publicitario",
    icon: Palette,
    image: "🎨",
    category: "Creatividad",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 190 },
    featured: true,
  },
  {
    id: "community-manager",
    name: "Community Manager",
    description: "Gestión de redes sociales y comunidades online",
    icon: Megaphone,
    image: "📱",
    category: "Marketing",
    difficulty: "easy",
    pricing: { monthly_subscription: 20, one_time_payment: 75 },
    featured: false,
  },
  {
    id: "edicion-video",
    name: "Edición de Vídeo",
    description: "Postproducción audiovisual profesional",
    icon: Video,
    image: "🎬",
    category: "Creatividad",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 210 },
    featured: false,
  },
  {
    id: "marketing-digital",
    name: "Marketing Digital",
    description: "Estrategias de marketing online y publicidad digital",
    icon: TrendingUp,
    image: "📈",
    category: "Marketing",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 180 },
    featured: true,
  },
  {
    id: "asistente-administrativo",
    name: "Asistente Administrativo",
    description: "Gestión de oficina y apoyo administrativo",
    icon: FileText,
    image: "📋",
    category: "Administración",
    difficulty: "easy",
    pricing: { monthly_subscription: 20, one_time_payment: 70 },
    featured: false,
  },
  {
    id: "contabilidad-facturacion",
    name: "Contabilidad y Facturación",
    description: "Gestión contable y fiscal para empresas",
    icon: Calculator,
    image: "🧮",
    category: "Administración",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 200 },
    featured: false,
  },
  {
    id: "ingles-profesionales",
    name: "Inglés para Profesionales",
    description: "Inglés empresarial y comunicación internacional",
    icon: Globe,
    image: "🌍",
    category: "Idiomas",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 160 },
    featured: false,
  },
  {
    id: "auxiliar-enfermeria",
    name: "Auxiliar de Enfermería",
    description: "Cuidados básicos de salud y asistencia sanitaria",
    icon: Heart,
    image: "💊",
    category: "Sanidad",
    difficulty: "hard",
    pricing: { monthly_subscription: 20, one_time_payment: 450 },
    featured: true,
  },
  {
    id: "cuidados-personas-mayores",
    name: "Cuidados para Personas Mayores",
    description: "Atención geriátrica especializada y cuidados domiciliarios",
    icon: Users2,
    image: "👴",
    category: "Sanidad",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 170 },
    featured: false,
  },
  {
    id: "cocina-profesional",
    name: "Cocina Profesional",
    description: "Técnicas culinarias y gestión de cocina",
    icon: ChefHat,
    image: "👨‍🍳",
    category: "Gastronomía",
    difficulty: "medium",
    pricing: { monthly_subscription: 20, one_time_payment: 190 },
    featured: false,
  },
  {
    id: "atencion-cliente",
    name: "Atención al Cliente",
    description: "Servicio al cliente excepcional y resolución de conflictos",
    icon: Phone,
    image: "📞",
    category: "Servicios",
    difficulty: "easy",
    pricing: { monthly_subscription: 20, one_time_payment: 65 },
    featured: false,
  },
  {
    id: "ciberseguridad-basica",
    name: "Ciberseguridad Básica",
    description: "Protección digital y seguridad informática",
    icon: Shield,
    image: "🛡️",
    category: "Tecnología",
    difficulty: "hard",
    pricing: { monthly_subscription: 20, one_time_payment: 400 },
    featured: true,
  },
  {
    id: "programacion-web-fullstack",
    name: "Programación Web Full Stack",
    description: "Desarrollo web completo frontend y backend",
    icon: Code,
    image: "���",
    category: "Tecnología",
    difficulty: "hard",
    pricing: { monthly_subscription: 20, one_time_payment: 500 },
    featured: true,
  },
  {
    id: "gestion-redes-sociales",
    name: "Gestión de Redes Sociales",
    description: "Estrategias y herramientas para redes sociales",
    icon: Share2,
    image: "📲",
    category: "Marketing",
    difficulty: "easy",
    pricing: { monthly_subscription: 20, one_time_payment: 85 },
    featured: false,
  },
];

export default function CursosProfesionales() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<LocalCourse | null>(
    null,
  );
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [userCourseAccess, setUserCourseAccess] = useState<
    Record<string, boolean>
  >({});
  const [courses, setCourses] = useState<LocalCourse[]>(PROFESSIONAL_COURSES);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user && user.uid) {
        // Load user course access
        try {
          const userAccess = await getAllUserCourseAccess(user.uid);
          const accessMap: Record<string, boolean> = {};

          userAccess.forEach((access) => {
            if (access.status === "active") {
              accessMap[access.courseId] = true;
            }
          });

          setUserCourseAccess(accessMap);
        } catch (error) {
          console.error("Error loading user course access:", error);
        }
      } else {
        // Clear access if no user
        setUserCourseAccess({});
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Fácil";
      case "medium":
        return "Medio";
      case "hard":
        return "Avanzado";
      default:
        return "Desconocido";
    }
  };

  const handleCourseClick = (course: LocalCourse) => {
    // Allow everyone to enter the course page, access control is handled inside
    navigate(`/curso/${course.id}`);
  };

  const handleSubscription = async () => {
    if (!selectedCourse || !user) {
      navigate("/login");
      return;
    }

    try {
      console.log("🚀 Creating subscription checkout session:", {
        courseId: selectedCourse.id,
        userId: user.uid,
        paymentType: "subscription",
        amount: 20,
      });

      // Use the same createCheckoutSession as assistants
      const sessionData = {
        assistantId: selectedCourse.id, // Use course.id as assistantId
        assistantName: `${selectedCourse.name} - Suscripción Mensual`,
        price: 20,
        billingCycle: "monthly" as const,
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

  const handleOneTimePayment = async () => {
    if (!selectedCourse || !user) {
      navigate("/login");
      return;
    }

    try {
      console.log("🚀 Creating one-time payment checkout session:", {
        courseId: selectedCourse.id,
        userId: user.uid,
        paymentType: "onetime",
        amount: selectedCourse.pricing.one_time_payment,
      });

      // Use the same createCheckoutSession as assistants
      const sessionData = {
        assistantId: selectedCourse.id, // Use course.id as assistantId
        assistantName: `${selectedCourse.name} - Acceso Vitalicio`,
        price: selectedCourse.pricing.one_time_payment,
        billingCycle: "annual" as const, // For one-time payments, use annual
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

  const featuredCourses = courses.filter((course) => course.featured);
  const allCourses = courses;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-300">Cargando cursos profesionales...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            Cursos Profesionales con IA
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Aprende nuevas habilidades profesionales con la ayuda de
            inteligencia artificial. Más de 20 cursos especializados para
            impulsar tu carrera.
          </p>
        </div>

        {/* Featured Courses */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Cursos Destacados</h2>
            <Badge className="bg-yellow-500/20 text-yellow-400">
              Populares
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCourses.map((course) => (
              <Card
                key={course.id}
                className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl">{course.image}</div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg leading-tight">
                        {course.name}
                      </CardTitle>
                      <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Curso profesional con IA
                      </Badge>
                    </div>
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </div>
                  <CardDescription className="text-slate-400">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {getDifficultyText(course.difficulty)}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {course.category}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Suscripción mensual:
                      </span>
                      <span className="text-green-400 font-semibold">
                        {course.pricing.monthly_subscription}€/mes
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Pago único:</span>
                      <span className="text-blue-400 font-semibold">
                        {course.pricing.one_time_payment}€
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleCourseClick(course)}
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Ver Curso
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowPaymentDialog(true);
                        }}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        20€/mes
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowPaymentDialog(true);
                        }}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {course.pricing.one_time_payment}€
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Courses */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Todos los Cursos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allCourses.map((course) => (
              <Card
                key={course.id}
                className="bg-slate-800/30 border-slate-700 hover:border-slate-600 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl">{course.image}</div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-base leading-tight">
                        {course.name}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge
                      className={`${getDifficultyColor(course.difficulty)} text-xs`}
                    >
                      {getDifficultyText(course.difficulty)}
                    </Badge>
                    {course.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                        ⭐
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="text-xs text-slate-500 mb-3">
                    Desde {course.pricing.one_time_payment}€ o{" "}
                    {course.pricing.monthly_subscription}€/mes
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleCourseClick(course)}
                      size="sm"
                      className="w-full bg-slate-700 hover:bg-slate-600"
                    >
                      Ver Curso
                    </Button>
                    <div className="grid grid-cols-2 gap-1">
                      <Button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowPaymentDialog(true);
                        }}
                        size="sm"
                        className="bg-green-600/80 hover:bg-green-600 text-xs p-1"
                      >
                        20€/mes
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowPaymentDialog(true);
                        }}
                        size="sm"
                        className="bg-blue-600/80 hover:bg-blue-600 text-xs p-1"
                      >
                        {course.pricing.one_time_payment}€
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCourse?.image} {selectedCourse?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {!user
                ? "Inicia sesión para acceder a las opciones de pago"
                : "Elige tu método de acceso preferido"}
            </DialogDescription>
          </DialogHeader>

          {!user && (
            <Alert className="bg-purple-900/20 border-purple-600">
              <AlertDescription className="text-purple-200">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>
                    Necesitas una cuenta para comprar cursos. ¿No tienes cuenta?
                    También puedes registrarte.
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Monthly Subscription Option */}
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
                  Acceso completo mientras mantengas la suscripción
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">
                    {selectedCourse?.pricing.monthly_subscription}€
                    <span className="text-sm">/mes</span>
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
                      onClick={handleSubscription}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Suscribirme
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* One-time Payment Option */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-400">Pago Único</h3>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    Acceso de por vida
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Pago único y acceso permanente al curso
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-400">
                    {selectedCourse?.pricing.one_time_payment}€
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
                      onClick={handleOneTimePayment}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Comprar ahora
                    </Button>
                  )}
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
