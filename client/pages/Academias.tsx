import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createAcademiaCheckoutSession } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart,
  Calendar,
  Settings,
  MessageSquare,
  CheckCircle2,
  Award,
  Target,
  TrendingUp,
  FileText,
  Database,
  Shield,
  Clock,
  Globe,
  Star,
  Mail,
  Phone,
  Crown,
  Heart,
} from "lucide-react";
import Header from "@/components/Header";

const ASSISTANT_OPTIONS = [
  { id: "guardia-civil", name: "Guardia Civil", category: "seguridad" },
  { id: "policia-nacional", name: "Policía Nacional", category: "seguridad" },
  { id: "policia-local", name: "Policía Local", category: "seguridad" },
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

interface Academia {
  id: string;
  name: string;
  description: string;
  type: string;
  features: string[];
  mainFeatures: string[];
  completeFeatures: string[];
  pricing: {
    students: string;
    year2: number;
    year5: number;
    year10: number;
  }[];
  badge?: string;
  icon: any;
  color: string;
}

const academias: Academia[] = [
  {
    id: "academia-oposiciones",
    name: "Academia de Oposiciones",
    description:
      "Centros especializados en preparación de oposiciones públicas con gestión completa de profesores y alumnos",
    type: "oposiciones",
    badge: "Más Popular",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-600",
    features: [
      "Chat IA especializado",
      "Gestión de alumnos",
      "Calendario de estudios",
      "Panel administración",
      "Banco de preguntas",
      "Estadísticas avanzadas",
      "Foros moderados",
      "Psicotecnia",
    ],
    mainFeatures: [
      {
        title: "Gestión de Profesores",
        description:
          "Roles de Profesor-Administrador y Profesor-Docente con permisos específicos",
        icon: Users,
      },
      {
        title: "Chat Especializado",
        description:
          "GPT-3.5 configurado para cada tipo de oposición específica",
        icon: MessageSquare,
      },
      {
        title: "Contenidos Especializados",
        description:
          "Temarios oficiales, tests, supuestos prácticos y videos por oposición",
        icon: BookOpen,
      },
      {
        title: "Seguimiento Completo",
        description:
          "Estadísticas de progreso, rankings e informes descargables",
        icon: BarChart,
      },
    ],
    completeFeatures: [
      "Panel de administración completo",
      "Creación masiva de alumnos (CSV/Excel)",
      "Banco de preguntas y simulacros",
      "Módulo de psicotecnia",
      "Foros de dudas moderados",
      "Planes de estudio personalizados",
      "Gestión de profesores con roles específicos",
      "Temarios oficiales por temariado",
      "Chat GPT especializado por oposición",
      "Seguimiento y estadísticas avanzadas",
      "Calendario con fechas clave",
    ],
    pricing: [
      {
        students: "Hasta 100",
        year2: 12,
        year5: 10,
        year10: 8,
      },
      {
        students: ">100",
        year2: 11,
        year5: 9,
        year10: 7,
      },
      {
        students: ">200",
        year2: 10,
        year5: 8,
        year10: 6,
      },
      {
        students: ">500",
        year2: 9,
        year5: 7,
        year10: 5,
      },
      {
        students: ">1000",
        year2: 8,
        year5: 6,
        year10: 4,
      },
    ],
  },
  {
    id: "academia-idiomas",
    name: "Academia de Idiomas",
    description:
      "Solución completa para academias de idiomas con gestión integral de estudiantes y contenidos",
    type: "idiomas",
    icon: Globe,
    color: "from-green-500 to-emerald-600",
    features: [
      "Chat IA multiidioma",
      "Gestión de estudiantes",
      "Niveles y certificaciones",
      "Material interactivo",
      "Seguimiento progreso",
      "Evaluaciones automáticas",
      "Calendario clases",
      "Comunicación familias",
    ],
    mainFeatures: [
      {
        title: "IA Multiidioma",
        description:
          "Asistente especializado en inglés, francés, alemán y otros idiomas",
        icon: Globe,
      },
      {
        title: "Gestión de Niveles",
        description:
          "Organización por niveles A1-C2 con seguimiento personalizado",
        icon: TrendingUp,
      },
      {
        title: "Material Interactivo",
        description: "Contenidos multimedia y ejercicios adaptativos por nivel",
        icon: BookOpen,
      },
      {
        title: "Evaluaciones Automáticas",
        description: "Tests de nivel y seguimiento automático del progreso",
        icon: Target,
      },
    ],
    completeFeatures: [
      "Gestión multinivel (A1-C2)",
      "Chat IA especializado por idioma",
      "Material interactivo multimedia",
      "Evaluaciones automáticas",
      "Seguimiento familiar",
      "Calendario de clases",
      "Certificaciones digitales",
      "Comunicación con familias",
      "Panel de progreso visual",
      "Biblioteca de recursos",
      "Exámenes oficiales simulados",
    ],
    pricing: [
      {
        students: "Hasta 100",
        year2: 12,
        year5: 10,
        year10: 8,
      },
      {
        students: ">100",
        year2: 11,
        year5: 9,
        year10: 7,
      },
      {
        students: ">200",
        year2: 10,
        year5: 8,
        year10: 6,
      },
      {
        students: ">500",
        year2: 9,
        year5: 7,
        year10: 5,
      },
      {
        students: ">1000",
        year2: 8,
        year5: 6,
        year10: 4,
      },
    ],
  },
  {
    id: "academia-eso-bachillerato",
    name: "Academia ESO/Bachillerato",
    description:
      "Plataforma integral para academias de refuerzo escolar con seguimiento familiar y gestión completa",
    type: "escolar",
    icon: Award,
    color: "from-purple-500 to-violet-600",
    features: [
      "Gestión por cursos",
      "Seguimiento familiar",
      "IA educativa",
      "Material curricular",
      "Evaluaciones continuas",
      "Comunicación padres",
      "Calendario académico",
      "Informes progreso",
    ],
    mainFeatures: [
      {
        title: "Gestión por Cursos",
        description:
          "Organización completa de ESO y Bachillerato por asignaturas",
        icon: BookOpen,
      },
      {
        title: "Seguimiento Familiar",
        description: "Portal para padres con acceso al progreso de sus hijos",
        icon: Users,
      },
      {
        title: "IA Educativa",
        description: "Asistente adaptado al currículo oficial español",
        icon: MessageSquare,
      },
      {
        title: "Evaluaciones Continuas",
        description: "Sistema de evaluación continua con informes detallados",
        icon: BarChart,
      },
    ],
    completeFeatures: [
      "Gestión completa ESO/Bachillerato",
      "Portal para padres y familias",
      "IA adaptada al currículo español",
      "Material por asignaturas",
      "Evaluaciones continuas",
      "Calendario académico",
      "Comunicación automatizada",
      "Informes de progreso",
      "Gestión de horarios",
      "Biblioteca de recursos",
      "Seguimiento individualizado",
    ],
    pricing: [
      {
        students: "Hasta 100",
        year2: 12,
        year5: 10,
        year10: 8,
      },
      {
        students: ">100",
        year2: 11,
        year5: 9,
        year10: 7,
      },
      {
        students: ">200",
        year2: 10,
        year5: 8,
        year10: 6,
      },
      {
        students: ">500",
        year2: 9,
        year5: 7,
        year10: 5,
      },
      {
        students: ">1000",
        year2: 8,
        year5: 6,
        year10: 4,
      },
    ],
  },
  {
    id: "academia-universitaria",
    name: "Academia Universitaria",
    description:
      "Solución avanzada para preparación universitaria con acceso completo a contenidos especializados",
    type: "universitaria",
    icon: Star,
    color: "from-orange-500 to-red-600",
    features: [
      "Contenido universitario",
      "Preparación selectividad",
      "IA avanzada",
      "Simulacros oficiales",
      "Orientación vocacional",
      "Estadísticas detalladas",
      "Biblioteca digital",
      "Mentorías personalizadas",
    ],
    mainFeatures: [
      {
        title: "Preparación Selectividad",
        description:
          "Contenidos específicos para EBAU con simulacros oficiales",
        icon: Target,
      },
      {
        title: "IA Universitaria",
        description:
          "Asistente especializado en materias universitarias avanzadas",
        icon: MessageSquare,
      },
      {
        title: "Orientación Vocacional",
        description:
          "Sistema de orientación para elección de carreras universitarias",
        icon: Award,
      },
      {
        title: "Biblioteca Digital",
        description:
          "Acceso a recursos universitarios y material especializado",
        icon: Database,
      },
    ],
    completeFeatures: [
      "Preparación EBAU completa",
      "IA especializada universitaria",
      "Simulacros oficiales",
      "Orientación vocacional",
      "Biblioteca digital avanzada",
      "Mentorías personalizadas",
      "Estadísticas predictivas",
      "Material universitario",
      "Seguimiento vocacional",
      "Recursos especializados",
      "Calendario EBAU actualizado",
    ],
    pricing: [
      {
        students: "Hasta 100",
        year2: 12,
        year5: 10,
        year10: 8,
      },
      {
        students: ">100",
        year2: 11,
        year5: 9,
        year10: 7,
      },
      {
        students: ">200",
        year2: 10,
        year5: 8,
        year10: 6,
      },
      {
        students: ">500",
        year2: 9,
        year5: 7,
        year10: 5,
      },
      {
        students: ">1000",
        year2: 8,
        year5: 6,
        year10: 4,
      },
    ],
  },
];

export default function Academias() {
  const [selectedAcademia, setSelectedAcademia] = useState<Academia | null>(
    null,
  );
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    academiaType: "",
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [contractForm, setContractForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    students: "",
    duration: "2" as "2" | "5" | "10", // Contract duration in years
    billingCycle: "monthly" as "monthly" | "annual",
    academia: "",
    assistantId: "", // Asistente específico que se contrata
  });
  const [showContractForm, setShowContractForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const calculatePrice = (
    students: string,
    duration: "2" | "5" | "10",
    billingCycle: "monthly" | "annual",
  ) => {
    const studentsNum = parseInt(students) || 0;

    // Founder pricing table based on duration
    const founderPricing = {
      "2": { hasta100: 12, "100": 11, "200": 10, "500": 9, "1000": 8 },
      "5": { hasta100: 10, "100": 9, "200": 8, "500": 7, "1000": 6 },
      "10": { hasta100: 8, "100": 7, "200": 6, "500": 5, "1000": 4 },
    };

    let pricePerStudent = founderPricing[duration]["hasta100"]; // Default for up to 100 students

    // Determine price based on student count and duration
    if (studentsNum > 1000) {
      pricePerStudent = founderPricing[duration]["1000"];
    } else if (studentsNum > 500) {
      pricePerStudent = founderPricing[duration]["500"];
    } else if (studentsNum > 200) {
      pricePerStudent = founderPricing[duration]["200"];
    } else if (studentsNum > 100) {
      pricePerStudent = founderPricing[duration]["100"];
    } else {
      pricePerStudent = founderPricing[duration]["hasta100"];
    }

    const monthlyTotal = pricePerStudent * studentsNum;
    const annualTotal = Math.round(pricePerStudent * 10) * studentsNum; // 10 months price (2 free)
    const annualMonthlyEquivalent = Math.round(annualTotal / 12);

    return {
      pricePerStudent,
      monthlyTotal,
      annualTotal,
      annualMonthlyEquivalent,
      studentsNum,
      duration,
      billingCycle,
    };
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se implementaría el envío del formulario
    console.log("Formulario enviado:", contactForm);
    setShowContactForm(false);
    // Reset form
    setContactForm({
      name: "",
      email: "",
      phone: "",
      message: "",
      academiaType: "",
    });
  };

  const handleContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !contractForm.name ||
      !contractForm.email ||
      !contractForm.organization ||
      !contractForm.students ||
      !contractForm.assistantId
    ) {
      alert(
        "Por favor, completa todos los campos obligatorios incluyendo el asistente especializado",
      );
      return;
    }

    const pricing = calculatePrice(
      contractForm.students,
      contractForm.duration,
      contractForm.billingCycle,
    );

    if (!user) {
      // If not authenticated, redirect to login
      alert(
        "Debes iniciar sesión para contratar una academia. Te redirigiremos al login.",
      );
      window.location.href = "/login";
      return;
    }

    setPaymentLoading(true);
    try {
      // For Stripe subscriptions, always send the base monthly price
      // Stripe will handle the billing interval (monthly vs annual)
      const totalPrice = pricing.monthlyTotal;

      const academiaData = {
        academiaId: contractForm.academia.toLowerCase().replace(/\s+/g, "-"),
        academiaName: contractForm.academia,
        totalPrice: totalPrice,
        duration: contractForm.duration,
        billingCycle: contractForm.billingCycle,
        students: pricing.studentsNum,
        pricePerStudent: pricing.pricePerStudent,
        assistantId: contractForm.assistantId, // Asistente específico contratado
        userId: user.uid,
        customerInfo: {
          name: contractForm.name,
          email: contractForm.email,
          phone: contractForm.phone,
          organization: contractForm.organization,
        },
      };

      console.log("🏫 Creating academia checkout session with:", academiaData);
      await createAcademiaCheckoutSession(academiaData);
      console.log(
        "🏫 Academia checkout session created - redirecting to Stripe",
      );
    } catch (error) {
      console.error("🏫 Error creating academia checkout session:", error);
      alert(
        `Error al procesar el pago: ${error instanceof Error ? error.message : "Error desconocido"}`,
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Academias Educativas
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Soluciones completas para centros educativos con gestión integral de
            profesores, alumnos y contenidos
          </p>
        </div>

        {/* Available Assistants Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-400" />
                Todas las Oposiciones Disponibles
              </CardTitle>
              <CardDescription className="text-slate-300">
                Asistentes especializados con IA para cada tipo de oposición.
                Selecciona uno durante la contratación.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Seguridad */}
              <div className="space-y-3">
                <h4 className="text-blue-300 font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Seguridad
                </h4>
                <div className="space-y-2">
                  {ASSISTANT_OPTIONS.filter(
                    (a) => a.category === "seguridad",
                  ).map((assistant) => (
                    <div
                      key={assistant.id}
                      className="text-sm text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      {assistant.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Administración */}
              <div className="space-y-3">
                <h4 className="text-green-300 font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Administración
                </h4>
                <div className="space-y-2">
                  {ASSISTANT_OPTIONS.filter(
                    (a) => a.category === "administracion",
                  ).map((assistant) => (
                    <div
                      key={assistant.id}
                      className="text-sm text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      {assistant.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Justicia */}
              <div className="space-y-3">
                <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Justicia
                </h4>
                <div className="space-y-2">
                  {ASSISTANT_OPTIONS.filter(
                    (a) => a.category === "justicia",
                  ).map((assistant) => (
                    <div
                      key={assistant.id}
                      className="text-sm text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      {assistant.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Educación */}
              <div className="space-y-3">
                <h4 className="text-yellow-300 font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Educación
                </h4>
                <div className="space-y-2">
                  {ASSISTANT_OPTIONS.filter(
                    (a) => a.category === "educacion",
                  ).map((assistant) => (
                    <div
                      key={assistant.id}
                      className="text-sm text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      {assistant.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sanidad */}
              <div className="space-y-3">
                <h4 className="text-red-300 font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Sanidad
                </h4>
                <div className="space-y-2">
                  {ASSISTANT_OPTIONS.filter(
                    (a) => a.category === "sanidad",
                  ).map((assistant) => (
                    <div
                      key={assistant.id}
                      className="text-sm text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      {assistant.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academia Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {academias.map((academia) => {
            const IconComponent = academia.icon;
            return (
              <div
                key={academia.id}
                className="relative bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-all duration-300"
              >
                {/* Badge */}
                {academia.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      {academia.badge}
                    </Badge>
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${academia.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {academia.name}
                      </h3>
                      <p className="text-slate-400 mt-1">
                        {academia.description}
                      </p>
                    </div>
                  </div>

                  {/* Target Info */}
                  <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-slate-300 text-sm">
                      <strong className="text-white">Dirigido a:</strong>{" "}
                      {academia.description}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Qué incluye esta academia:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {academia.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Tables */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      📊 Tabla de Precios
                    </h4>
                    <p className="text-slate-400 text-sm mb-6">
                      Precio por alumno según duración del contrato
                    </p>

                    {/* Tabla Fundadores */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-green-400" />
                        <h5 className="text-lg font-bold text-green-400">
                          Precios FUNDADOR
                        </h5>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-green-300 border-b border-green-500/30">
                              <th className="text-left py-2">
                                Alumnos / Duración
                              </th>
                              <th className="text-center py-2">2 años</th>
                              <th className="text-center py-2">5 años</th>
                              <th className="text-center py-2">10 años</th>
                            </tr>
                          </thead>
                          <tbody>
                            {academia.pricing.map((price, index) => (
                              <tr
                                key={index}
                                className="text-green-200 border-b border-green-500/20"
                              >
                                <td className="py-2 font-medium">
                                  {price.students}
                                </td>
                                <td className="text-center py-2">
                                  {price.year2} €
                                </td>
                                <td className="text-center py-2">
                                  {price.year5} €
                                </td>
                                <td className="text-center py-2">
                                  {price.year10} €
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Tabla No Fundadores */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-blue-400" />
                        <h5 className="text-lg font-bold text-blue-400">
                          Precios NO FUNDADOR
                        </h5>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-blue-300 border-b border-blue-500/30">
                              <th className="text-left py-2">
                                Alumnos / Duración
                              </th>
                              <th className="text-center py-2">2 años</th>
                              <th className="text-center py-2">5 años</th>
                              <th className="text-center py-2">10 años</th>
                            </tr>
                          </thead>
                          <tbody>
                            {academia.pricing.map((price, index) => (
                              <tr
                                key={index}
                                className="text-blue-200 border-b border-blue-500/20"
                              >
                                <td className="py-2 font-medium">
                                  {price.students}
                                </td>
                                <td className="text-center py-2">
                                  {price.year2 * 3} €
                                </td>
                                <td className="text-center py-2">
                                  {price.year5 * 3} €
                                </td>
                                <td className="text-center py-2">
                                  {price.year10 * 3} ��
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-3 text-center">
                      💡 El plan anual incluye 2 meses gratis (equivale a 10
                      meses de precio)
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => {
                      setContractForm((prev) => ({
                        ...prev,
                        academia: academia.name,
                      }));
                      setShowContractForm(true);
                    }}
                    className={`w-full bg-gradient-to-r ${academia.color} hover:scale-105 transition-transform font-semibold text-lg py-6`}
                  >
                    Contratar Este Plan
                  </Button>
                </div>

                {/* Bottom Notice */}
                <div className="px-8 pb-6">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                    <p className="text-yellow-300 text-sm">
                      ⚠️ Este servicio utiliza APIs externas. No nos
                      responsabilizamos de posibles interrupciones de servicios
                      de terceros (OpenAI, Stripe, etc.)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Academia Detail Modal */}
        <Dialog
          open={!!selectedAcademia}
          onOpenChange={() => setSelectedAcademia(null)}
        >
          <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedAcademia && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedAcademia.color} flex items-center justify-center`}
                    >
                      <selectedAcademia.icon className="w-5 h-5 text-white" />
                    </div>
                    {selectedAcademia.name}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-lg">
                    {selectedAcademia.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-8">
                  {/* Main Features */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      🔧 Funcionalidades Principales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedAcademia.mainFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="bg-slate-700/50 p-4 rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <feature.icon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold text-white mb-1">
                                {feature.title}
                              </h4>
                              <p className="text-slate-300 text-sm">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complete Features */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      📋 Funcionalidades Completas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedAcademia.completeFeatures.map(
                        (feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">
                              {feature}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Pricing Detail */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      💰 Tabla de Precios Detallada
                    </h3>

                    {/* Tabla Fundadores */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-green-400" />
                        <h5 className="text-lg font-bold text-green-400">
                          Precios FUNDADOR (Precio por alumno/mes)
                        </h5>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-green-300 border-b border-green-500/30">
                              <th className="text-left py-2">
                                Alumnos / Duración
                              </th>
                              <th className="text-center py-2">2 años</th>
                              <th className="text-center py-2">5 años</th>
                              <th className="text-center py-2">10 años</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedAcademia.pricing.map((price, index) => (
                              <tr
                                key={index}
                                className="text-green-200 border-b border-green-500/20"
                              >
                                <td className="py-2 font-medium">
                                  {price.students}
                                </td>
                                <td className="text-center py-2 font-bold">
                                  {price.year2} €
                                </td>
                                <td className="text-center py-2 font-bold">
                                  {price.year5} €
                                </td>
                                <td className="text-center py-2 font-bold">
                                  {price.year10} €
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Tabla No Fundadores */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-blue-400" />
                        <h5 className="text-lg font-bold text-blue-400">
                          Precios NO FUNDADOR (Precio por alumno/mes)
                        </h5>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-blue-300 border-b border-blue-500/30">
                              <th className="text-left py-2">
                                Alumnos / Duración
                              </th>
                              <th className="text-center py-2">2 años</th>
                              <th className="text-center py-2">5 años</th>
                              <th className="text-center py-2">10 años</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedAcademia.pricing.map((price, index) => (
                              <tr
                                key={index}
                                className="text-blue-200 border-b border-blue-500/20"
                              >
                                <td className="py-2 font-medium">
                                  {price.students}
                                </td>
                                <td className="text-center py-2 font-bold">
                                  {price.year2 * 3} €
                                </td>
                                <td className="text-center py-2 font-bold">
                                  {price.year5 * 3} €
                                </td>
                                <td className="text-center py-2 font-bold">
                                  {price.year10 * 3} €
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4">
                      <p className="text-yellow-300 text-sm text-center">
                        💡 <strong>¡Oportunidad Fundador!</strong> Los precios
                        fundador son limitados y solo para los primeros
                        clientes.
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center">
                    <Button
                      className={`bg-gradient-to-r ${selectedAcademia.color} hover:scale-105 transition-transform px-8 py-4 text-lg font-semibold`}
                      onClick={() => {
                        setContractForm((prev) => ({
                          ...prev,
                          academia: selectedAcademia.name,
                        }));
                        setSelectedAcademia(null);
                        setShowContractForm(true);
                      }}
                    >
                      Contratar Esta Academia
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Contract Form Modal */}
        <Dialog open={showContractForm} onOpenChange={setShowContractForm}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                Contratar Plan: {contractForm.academia}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Completa los datos para contratar tu academia. El precio se
                calculará automáticamente.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleContractSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contract-name" className="text-slate-200">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="contract-name"
                    value={contractForm.name}
                    onChange={(e) =>
                      setContractForm({ ...contractForm, name: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contract-email" className="text-slate-200">
                    Email *
                  </Label>
                  <Input
                    id="contract-email"
                    type="email"
                    value={contractForm.email}
                    onChange={(e) =>
                      setContractForm({
                        ...contractForm,
                        email: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contract-phone" className="text-slate-200">
                    Teléfono
                  </Label>
                  <Input
                    id="contract-phone"
                    value={contractForm.phone}
                    onChange={(e) =>
                      setContractForm({
                        ...contractForm,
                        phone: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="contract-organization"
                    className="text-slate-200"
                  >
                    Nombre de la Academia/Centro *
                  </Label>
                  <Input
                    id="contract-organization"
                    value={contractForm.organization}
                    onChange={(e) =>
                      setContractForm({
                        ...contractForm,
                        organization: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              {/* Plan Details */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-4">
                  Detalles del Plan
                </h4>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label
                      htmlFor="contract-students"
                      className="text-slate-200"
                    >
                      Número de Alumnos *
                    </Label>
                    <Input
                      id="contract-students"
                      type="number"
                      min="1"
                      value={contractForm.students}
                      onChange={(e) =>
                        setContractForm({
                          ...contractForm,
                          students: e.target.value,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Ej: 150"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="contract-duration"
                      className="text-slate-200"
                    >
                      Duración del Contrato *
                    </Label>
                    <select
                      id="contract-duration"
                      value={contractForm.duration}
                      onChange={(e) =>
                        setContractForm({
                          ...contractForm,
                          duration: e.target.value as "2" | "5" | "10",
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                      required
                    >
                      <option value="2">2 años</option>
                      <option value="5">5 años</option>
                      <option value="10">10 años</option>
                    </select>
                  </div>
                  <div>
                    <Label
                      htmlFor="contract-billing"
                      className="text-slate-200"
                    >
                      Tipo de Facturación *
                    </Label>
                    <select
                      id="contract-billing"
                      value={contractForm.billingCycle}
                      onChange={(e) =>
                        setContractForm({
                          ...contractForm,
                          billingCycle: e.target.value as "monthly" | "annual",
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                      required
                    >
                      <option value="monthly">Mensual</option>
                      <option value="annual">Anual (2 meses gratis)</option>
                    </select>
                  </div>
                </div>

                {/* Assistant Selection */}
                <div className="mb-4">
                  <Label
                    htmlFor="contract-assistant"
                    className="text-slate-200"
                  >
                    Asistente Especializado a Contratar *
                  </Label>
                  <select
                    id="contract-assistant"
                    value={contractForm.assistantId}
                    onChange={(e) =>
                      setContractForm({
                        ...contractForm,
                        assistantId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                    required
                  >
                    <option value="">
                      Selecciona un asistente especializado...
                    </option>

                    {/* Categoría Seguridad */}
                    <optgroup label="🛡️ SEGURIDAD Y FUERZAS DEL ORDEN">
                      {ASSISTANT_OPTIONS.filter(
                        (a) => a.category === "seguridad",
                      ).map((assistant) => (
                        <option key={assistant.id} value={assistant.id}>
                          {assistant.name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Categoría Administración */}
                    <optgroup label="📋 ADMINISTRACIÓN PÚBLICA">
                      {ASSISTANT_OPTIONS.filter(
                        (a) => a.category === "administracion",
                      ).map((assistant) => (
                        <option key={assistant.id} value={assistant.id}>
                          {assistant.name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Categoría Justicia */}
                    <optgroup label="⚖️ JUSTICIA Y PROCESAL">
                      {ASSISTANT_OPTIONS.filter(
                        (a) => a.category === "justicia",
                      ).map((assistant) => (
                        <option key={assistant.id} value={assistant.id}>
                          {assistant.name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Categoría Educación */}
                    <optgroup label="📚 EDUCACIÓN Y DOCENCIA">
                      {ASSISTANT_OPTIONS.filter(
                        (a) => a.category === "educacion",
                      ).map((assistant) => (
                        <option key={assistant.id} value={assistant.id}>
                          {assistant.name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Categoría Sanidad */}
                    <optgroup label="🏥 SANIDAD Y SALUD">
                      {ASSISTANT_OPTIONS.filter(
                        (a) => a.category === "sanidad",
                      ).map((assistant) => (
                        <option key={assistant.id} value={assistant.id}>
                          {assistant.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {contractForm.assistantId && (
                    <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-blue-300 text-sm">
                        ⚡ Has seleccionado:{" "}
                        <strong>
                          {
                            ASSISTANT_OPTIONS.find(
                              (a) => a.id === contractForm.assistantId,
                            )?.name
                          }
                        </strong>
                      </p>
                      <p className="text-blue-200 text-xs mt-1">
                        Este asistente especializado estará disponible para
                        todos tus alumnos. Solo los administradores pueden
                        cambiar esta asignación después de la contratación.
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Calculator */}
                {contractForm.students && (
                  <div className="bg-slate-600/50 p-4 rounded-lg">
                    <h5 className="text-white font-semibold mb-3">
                      📊 Cálculo de Precio
                    </h5>
                    {(() => {
                      const pricing = calculatePrice(
                        contractForm.students,
                        contractForm.duration,
                        contractForm.billingCycle,
                      );
                      return (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Alumnos:</span>
                            <span className="text-white font-medium">
                              {pricing.studentsNum}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">
                              Duración del contrato:
                            </span>
                            <span className="text-white font-medium">
                              {pricing.duration} años
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Facturación:</span>
                            <span className="text-white font-medium">
                              {contractForm.billingCycle === "monthly"
                                ? "Mensual"
                                : "Anual"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">
                              Precio FUNDADOR por alumno/mes:
                            </span>
                            <span className="font-medium text-green-400">
                              {pricing.pricePerStudent} €
                            </span>
                          </div>
                          {contractForm.billingCycle === "monthly" ? (
                            <div className="flex justify-between border-t border-slate-500 pt-2">
                              <span className="text-slate-300">
                                Total mensual:
                              </span>
                              <span className="text-yellow-400 font-bold text-lg">
                                {pricing.monthlyTotal.toLocaleString()} €/mes
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between border-t border-slate-500 pt-2">
                                <span className="text-slate-300">
                                  Total anual:
                                </span>
                                <span className="text-yellow-400 font-bold text-lg">
                                  {pricing.annualTotal.toLocaleString()} €/año
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-300">
                                  Equivale a:
                                </span>
                                <span className="text-green-400 font-medium">
                                  {pricing.annualMonthlyEquivalent.toLocaleString()}{" "}
                                  €/mes
                                </span>
                              </div>
                              <div className="bg-green-500/20 border border-green-500/30 rounded p-2 mt-2">
                                <p className="text-green-300 text-xs text-center">
                                  🎉 ¡Plan Anual! Ahorras{" "}
                                  {(
                                    pricing.monthlyTotal * 12 -
                                    pricing.annualTotal
                                  ).toLocaleString()}{" "}
                                  € al año (2 meses gratis)
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Payment Section - Prominent and Always Visible */}
              <div className="border-t border-slate-600 pt-6 mt-6 bg-slate-800/80 backdrop-blur-sm sticky bottom-0 z-10">
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 text-lg shadow-lg"
                    disabled={
                      !contractForm.students ||
                      !contractForm.name ||
                      !contractForm.email ||
                      !contractForm.organization ||
                      !contractForm.assistantId ||
                      paymentLoading
                    }
                  >
                    {paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Procesando Pago...
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5 mr-2" />
                        💳 PAGAR Y CONTRATAR ACADEMIA
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContractForm(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 px-6"
                  >
                    Cancelar
                  </Button>
                </div>

                {/* Button status indicator */}
                <div className="text-center mt-2">
                  {(!contractForm.students ||
                    !contractForm.name ||
                    !contractForm.email ||
                    !contractForm.assistantId ||
                    !contractForm.organization) && (
                    <p className="text-yellow-400 text-xs">
                      ⚠️ Complete todos los campos obligatorios para habilitar
                      el pago
                    </p>
                  )}
                  {contractForm.students &&
                    contractForm.name &&
                    contractForm.email &&
                    contractForm.organization && (
                      <p className="text-green-400 text-xs">
                        ✅ Formulario completo - Listo para pagar
                      </p>
                    )}
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Contact Form Modal */}
        <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Solicitar Información
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Cuéntanos sobre tu academia y nos pondremos en contacto contigo
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-200">
                    Nombre *
                  </Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-200">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-200">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="academiaType" className="text-slate-200">
                  Tipo de Academia
                </Label>
                <Input
                  id="academiaType"
                  value={contactForm.academiaType}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      academiaType: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ej: Oposiciones, Idiomas, ESO/Bach..."
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-slate-200">
                  Mensaje
                </Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={4}
                  placeholder="Cuéntanos sobre tu academia, número de alumnos, necesidades espec��ficas..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Solicitud
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
