import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Academia,
  AcademiaStudent,
  AcademiaTeacher,
  ProfessionalCourse,
  UserCourseAccess,
  getAcademiaBySlug,
  getAcademiaStudents,
  addTeacherToAcademia,
  removeTeacherFromAcademia,
  createAcademiaStudent,
  updateAcademiaStudent,
  deleteAcademiaStudent,
  updateAcademia,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralDashboard from "@/components/ReferralDashboard";
import { useUserReferralCode } from "@/hooks/useReferrals";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  GraduationCap,
  UserPlus,
  Settings,
  BarChart3,
  Calendar,
  Crown,
  School,
  FileText,
  Upload,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  MapPin,
  Star,
  Target,
  Award,
  Globe,
  BookOpen,
  Play,
  CreditCard,
  Zap,
  ShoppingCart,
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

export default function AcademiaPanel() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [academia, setAcademia] = useState<Academia | null>(null);
  const [students, setStudents] = useState<AcademiaStudent[]>([]);
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const [userCourseAccess, setUserCourseAccess] = useState<
    Record<string, UserCourseAccess>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Dialog states
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const [showChangeAssistant, setShowChangeAssistant] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<AcademiaStudent | null>(null);

  // Form states
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    role: "teacher" as "admin" | "teacher",
    assignedAssistants: [] as string[],
    assignedGroups: [] as string[],
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    assignedAssistant: "",
    assignedTeacher: "",
    assignedGroup: "",
  });

  const [newAssistantId, setNewAssistantId] = useState("");

  // Referral code hook
  const { referralCode } = useUserReferralCode(
    user?.uid || null,
    user?.email || null,
    'academia'
  );

  // Auth and data loading with offline support
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check for offline mode first
        const {
          isAuthenticatedOffline,
          getCurrentOfflineUser,
          getDemoAcademiaData,
        } = await import("@/lib/offlineAuth");

        if (isAuthenticatedOffline()) {
          const offlineUser = getCurrentOfflineUser();
          console.log("📱 Loading academia data in offline mode");

          // Create mock user object for offline mode
          const mockUser = {
            uid: offlineUser.uid,
            email: offlineUser.email,
            emailVerified: true,
            displayName: null,
            photoURL: null,
            isOffline: true,
          };
          setUser(mockUser as any);

          // Load demo academia data
          const demoAcademia = getDemoAcademiaData();
          if (
            demoAcademia &&
            (slug === "academia-demo-admin" || slug === demoAcademia.slug)
          ) {
            setAcademia(demoAcademia);

            // Load demo students data
            const demoStudents = [
              {
                id: "student-1",
                academiaId: demoAcademia.id,
                userId: "demo-student-1",
                name: "Juan Pérez",
                email: "juan@demo.com",
                assignedAssistant: "guardia-civil",
                assignedTeacher: "profesor@demo.com",
                assignedGroup: "Grupo A",
                status: "active" as const,
                progress: 75,
                createdAt: new Date().toISOString(),
              },
              {
                id: "student-2",
                academiaId: demoAcademia.id,
                userId: "demo-student-2",
                name: "María García",
                email: "maria@demo.com",
                assignedAssistant: "policia-nacional",
                assignedTeacher: "profesor@demo.com",
                assignedGroup: "Grupo B",
                status: "active" as const,
                progress: 85,
                createdAt: new Date().toISOString(),
              },
            ];

            setStudents(demoStudents);
            console.log("✅ Demo academia and students loaded");
          }

          setLoading(false);
          return;
        }

        // Firebase mode
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          if (!user) {
            navigate("/login");
          }
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [slug, navigate]);

  useEffect(() => {
    if (user && slug && !user.isOffline) {
      loadAcademiaData();
    }
  }, [user, slug]);

  const loadAcademiaData = async () => {
    try {
      setLoading(true);
      const academiaData = await getAcademiaBySlug(slug!);

      if (!academiaData) {
        navigate("/404");
        return;
      }

      // Check if user has access to this academia
      if (academiaData.adminUserId !== user?.uid) {
        navigate("/");
        return;
      }

      setAcademia(academiaData);
      const studentsData = await getAcademiaStudents(academiaData.id);
      setStudents(studentsData);

      // Load professional courses
      const coursesData = await getAllProfessionalCourses();
      setCourses(coursesData);

      // Load user course access for current user
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
      console.error("Error loading academia data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academia) return;

    try {
      await addTeacherToAcademia(academia.id, teacherForm);
      setShowAddTeacher(false);
      setTeacherForm({
        name: "",
        email: "",
        role: "teacher",
        assignedAssistants: [],
        assignedGroups: [],
      });
      await loadAcademiaData(); // Reload data
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("Error al añadir profesor");
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academia || !studentForm.name || !studentForm.email) return;

    // Check capacity
    if (academia.currentStudents >= academia.contractDetails.students) {
      alert("Has alcanzado el límite de alumnos contratados.");
      return;
    }

    try {
      await createAcademiaStudent({
        name: studentForm.name,
        email: studentForm.email,
        academiaId: academia.id,
        academiaSlug: academia.slug,
        assignedAssistant: studentForm.assignedAssistant || undefined,
        assignedTeacher: studentForm.assignedTeacher || undefined,
        assignedGroup: studentForm.assignedGroup || undefined,
        progress: {
          totalSessions: 0,
          completedTopics: 0,
          averageScore: 0,
          lastActivity: new Date().toISOString(),
        },
        status: "active",
      });

      setShowAddStudent(false);
      setStudentForm({
        name: "",
        email: "",
        assignedAssistant: "",
        assignedTeacher: "",
        assignedGroup: "",
      });
      await loadAcademiaData(); // Reload data
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error al añadir alumno");
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este alumno?")) return;

    try {
      await deleteAcademiaStudent(studentId);
      await loadAcademiaData(); // Reload data
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error al eliminar alumno");
    }
  };

  const calculateUsagePercentage = () => {
    if (!academia) return 0;
    return Math.round(
      (academia.currentStudents / academia.contractDetails.students) * 100,
    );
  };

  const getRemainingDays = () => {
    if (!academia) return 0;
    const endDate = new Date(academia.contractDetails.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

      alert(
        `¡Felicidades! Te has suscrito a "${course.name}" por ���${amount}`,
      );
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

  const handleChangeAssistant = async () => {
    if (!academia || !newAssistantId) {
      alert("Por favor selecciona un asistente");
      return;
    }

    if (
      !confirm(
        "¿Estás seguro de que quieres cambiar el asistente especializado? Esto puede afectar el progreso de tus alumnos.",
      )
    ) {
      return;
    }

    try {
      await updateAcademia(academia.id, {
        assistants: [newAssistantId],
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setAcademia({
        ...academia,
        assistants: [newAssistantId],
        updatedAt: new Date().toISOString(),
      });

      setShowChangeAssistant(false);
      setNewAssistantId("");
      alert("Asistente cambiado correctamente");
    } catch (error) {
      console.error("Error changing assistant:", error);
      alert("Error al cambiar el asistente. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando academia...</div>
      </div>
    );
  }

  if (!academia) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Academia no encontrada</div>
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
                <School className="w-10 h-10 text-blue-400" />
                {academia.name}
              </h1>
              <p className="text-slate-300 mt-2">
                Panel de gestión de academia
              </p>
            </div>
            {academia.contractDetails.isFounder && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Crown className="w-4 h-4 mr-1" />
                FUNDADOR
              </Badge>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Alumnos</p>
                    <p className="text-white text-2xl font-bold">
                      {academia.currentStudents}/
                      {academia.contractDetails.students}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Profesores</p>
                    <p className="text-white text-2xl font-bold">
                      {academia.teachers.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Días restantes</p>
                    <p className="text-white text-2xl font-bold">
                      {getRemainingDays()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Uso del plan</p>
                    <p className="text-white text-2xl font-bold">
                      {calculateUsagePercentage()}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capacity warning */}
          {calculateUsagePercentage() > 90 && (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                <p className="text-orange-300">
                  <strong>Advertencia:</strong> Estás cerca del límite de
                  alumnos contratados ({academia.currentStudents}/
                  {academia.contractDetails.students}).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 border-slate-700">
            <TabsTrigger
              key="overview"
              value="overview"
              className="text-slate-300"
            >
              Información
            </TabsTrigger>
            <TabsTrigger
              key="teachers"
              value="teachers"
              className="text-slate-300"
            >
              Profesores
            </TabsTrigger>
            <TabsTrigger
              key="students"
              value="students"
              className="text-slate-300"
            >
              Alumnos
            </TabsTrigger>
            <TabsTrigger
              key="assistants"
              value="assistants"
              className="text-slate-300"
            >
              Asistentes
            </TabsTrigger>
            <TabsTrigger
              key="courses"
              value="courses"
              className="text-slate-300"
            >
              Cursos
            </TabsTrigger>
            <TabsTrigger key="referrals" value="referrals" className="text-slate-300">
              Referidos
            </TabsTrigger>
            <TabsTrigger key="stats" value="stats" className="text-slate-300">
              Estadísticas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Nombre</Label>
                      <p className="text-white font-medium">{academia.name}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Tipo</Label>
                      <p className="text-white font-medium capitalize">
                        {academia.type}
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Organización</Label>
                      <p className="text-white font-medium">
                        {academia.organization}
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Estado</Label>
                      <Badge
                        className={
                          academia.status === "active"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                        }
                      >
                        {academia.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Detalles del Contrato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Duración</Label>
                      <p className="text-white font-medium">
                        {academia.contractDetails.duration} años
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-400">
                        Alumnos contratados
                      </Label>
                      <p className="text-white font-medium">
                        {academia.contractDetails.students}
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-400">
                        Precio por alumno
                      </Label>
                      <p className="text-white font-medium">
                        {academia.contractDetails.pricePerStudent}€/mes
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Facturación</Label>
                      <p className="text-white font-medium">
                        {academia.contractDetails.billingCycle === "monthly"
                          ? "Mensual"
                          : "Anual"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Fecha inicio</Label>
                      <p className="text-white font-medium">
                        {new Date(
                          academia.contractDetails.startDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Fecha fin</Label>
                      <p className="text-white font-medium">
                        {new Date(
                          academia.contractDetails.endDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {academia.contractDetails.isFounder && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-green-400" />
                        <p className="text-green-300 text-sm">
                          <strong>Precio Fundador:</strong> Tienes acceso a
                          precios especiales como fundador.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Gestión de Profesores
              </h2>
              <Button
                onClick={() => setShowAddTeacher(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Añadir Profesor
              </Button>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                {academia.teachers.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      No hay profesores registrados
                    </p>
                    <Button
                      onClick={() => setShowAddTeacher(true)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600"
                    >
                      Añadir primer profesor
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {academia.teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">
                              {teacher.name}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {teacher.email}
                            </p>
                            <Badge
                              className={
                                teacher.role === "admin"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              }
                            >
                              {teacher.role === "admin"
                                ? "Administrador"
                                : "Profesor"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-300 hover:bg-red-600/20"
                            onClick={() =>
                              removeTeacherFromAcademia(academia.id, teacher.id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Gestión de Alumnos ({academia.currentStudents}/
                {academia.contractDetails.students})
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar CSV
                </Button>
                <Button
                  onClick={() => setShowAddStudent(true)}
                  className="bg-green-500 hover:bg-green-600"
                  disabled={
                    academia.currentStudents >=
                    academia.contractDetails.students
                  }
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Añadir Alumno
                </Button>
              </div>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No hay alumnos registrados</p>
                    <Button
                      onClick={() => setShowAddStudent(true)}
                      className="mt-4 bg-green-500 hover:bg-green-600"
                      disabled={
                        academia.currentStudents >=
                        academia.contractDetails.students
                      }
                    >
                      Añadir primer alumno
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">
                              {student.name}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {student.email}
                            </p>
                            {student.assignedAssistant && (
                              <Badge className="mt-1 bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {ASSISTANT_OPTIONS.find(
                                  (a) => a.id === student.assignedAssistant,
                                )?.name || student.assignedAssistant}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => navigate(`/alumno/${student.id}`)}
                          >
                            Ver Panel
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => {
                              setSelectedStudent(student);
                              setStudentForm({
                                name: student.name,
                                email: student.email,
                                assignedAssistant:
                                  student.assignedAssistant || "",
                                assignedTeacher: student.assignedTeacher || "",
                                assignedGroup: student.assignedGroup || "",
                              });
                              setShowEditStudent(true);
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-300 hover:bg-red-600/20"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assistants Tab */}
          <TabsContent value="assistants" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Asistentes Contratados
              </h2>
              <Button
                onClick={() => setShowChangeAssistant(true)}
                className="bg-orange-500 hover:bg-orange-600"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Cambiar Asistente
              </Button>
            </div>

            {/* Current Assistant */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Asistente Especializado Actual
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Este es el asistente especializado que contrataste para tu
                  academia
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {academia.assistants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {academia.assistants.map((assistantId) => {
                      const assistant = ASSISTANT_OPTIONS.find(
                        (a) => a.id === assistantId,
                      );
                      return (
                        <div
                          key={assistantId}
                          className="p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <Star className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium text-lg">
                                {assistant?.name || assistantId}
                              </h3>
                              <p className="text-blue-300 text-sm capitalize font-medium">
                                {assistant?.category || "general"}
                              </p>
                              <Badge className="mt-1 bg-green-500/20 text-green-300 border-green-500/30">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Contratado
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-slate-400">
                            <p>• Disponible para todos los alumnos</p>
                            <p>��� Especializado en {assistant?.category}</p>
                            <p>• Chat con IA avanzada</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      No hay asistentes contratados
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="text-orange-300 font-medium">
                      Información importante
                    </h4>
                    <p className="text-orange-200 text-sm mt-1">
                      El asistente especializado se seleccionó durante la
                      contratación. Solo el administrador de la academia puede
                      cambiar esta asignación. Cambiar el asistente puede
                      afectar el progreso de los alumnos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Cursos Profesionales con IA
              </h2>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Zap className="w-4 h-4 mr-1" />
                {courses.length} cursos disponibles
              </Badge>
            </div>

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
                                  ? "Suscripci��n mensual"
                                  : "Pago único"}
                              </p>
                            </div>
                            <Button
                              className="w-full bg-green-500 hover:bg-green-600"
                              onClick={() => {
                                // TODO: Navigate to course content
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
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                ��
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

            {courses.length === 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    Cargando cursos profesionales...
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Los cursos aparecerán aquí una vez que se carguen desde el
                    servidor
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            {user && referralCode ? (
              <ReferralDashboard
                userId={user.uid}
                userEmail={user.email || ''}
                userRole="academia"
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

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Estadísticas y Rendimiento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Alumnos Activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {students.filter((s) => s.status === "active").length}
                  </div>
                  <p className="text-slate-400 text-sm">
                    de {academia.contractDetails.students} contratados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Progreso Promedio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">
                    {students.length > 0
                      ? Math.round(
                          students.reduce(
                            (acc, s) => acc + s.progress.averageScore,
                            0,
                          ) / students.length,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-slate-400 text-sm">puntuación media</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Sesiones Totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    {students.reduce(
                      (acc, s) => acc + s.progress.totalSessions,
                      0,
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">
                    interacciones registradas
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Teacher Dialog */}
        <Dialog open={showAddTeacher} onOpenChange={setShowAddTeacher}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Añadir Profesor</DialogTitle>
              <DialogDescription className="text-slate-400">
                Añade un nuevo profesor a tu academia
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Nombre *</Label>
                  <Input
                    value={teacherForm.name}
                    onChange={(e) =>
                      setTeacherForm({ ...teacherForm, name: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Email *</Label>
                  <Input
                    type="email"
                    value={teacherForm.email}
                    onChange={(e) =>
                      setTeacherForm({ ...teacherForm, email: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Rol</Label>
                <Select
                  value={teacherForm.role}
                  onValueChange={(value: "admin" | "teacher") =>
                    setTeacherForm({ ...teacherForm, role: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Añadir Profesor
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddTeacher(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Student Dialog */}
        <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Añadir Alumno</DialogTitle>
              <DialogDescription className="text-slate-400">
                Añade un nuevo alumno a tu academia ({academia.currentStudents}/
                {academia.contractDetails.students} plazas ocupadas)
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Nombre *</Label>
                  <Input
                    value={studentForm.name}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, name: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Email *</Label>
                  <Input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, email: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Asistente Asignado</Label>
                <Select
                  value={studentForm.assignedAssistant}
                  onValueChange={(value) =>
                    setStudentForm({ ...studentForm, assignedAssistant: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona un asistente" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {ASSISTANT_OPTIONS.filter((assistant) =>
                      academia.assistants.includes(assistant.id),
                    ).map((assistant) => (
                      <SelectItem key={assistant.id} value={assistant.id}>
                        {assistant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={
                    academia.currentStudents >=
                    academia.contractDetails.students
                  }
                >
                  Añadir Alumno
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddStudent(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Change Assistant Dialog */}
        <Dialog
          open={showChangeAssistant}
          onOpenChange={setShowChangeAssistant}
        >
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Cambiar Asistente Especializado
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                ⚠️ Esta acción cambiará el asistente especializado de toda tu
                academia. Puede afectar el progreso y configuración de tus
                alumnos.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Current Assistant */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <Label className="text-slate-200">Asistente Actual</Label>
                <div className="mt-2">
                  {academia?.assistants.map((assistantId) => {
                    const assistant = ASSISTANT_OPTIONS.find(
                      (a) => a.id === assistantId,
                    );
                    return (
                      <div
                        key={assistantId}
                        className="flex items-center gap-2"
                      >
                        <Star className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">
                          {assistant?.name}
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {assistant?.category}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* New Assistant Selection */}
              <div>
                <Label className="text-slate-200">
                  Nuevo Asistente Especializado *
                </Label>
                <select
                  value={newAssistantId}
                  onChange={(e) => setNewAssistantId(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                  required
                >
                  <option value="">Selecciona un nuevo asistente...</option>
                  {ASSISTANT_OPTIONS.filter(
                    (assistant) => !academia?.assistants.includes(assistant.id),
                  ).map((assistant) => (
                    <option key={assistant.id} value={assistant.id}>
                      {assistant.name} ({assistant.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Warning */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="text-orange-300 font-medium text-sm">
                      Importante
                    </h4>
                    <ul className="text-orange-200 text-xs mt-1 space-y-1">
                      <li key="warning-1">
                        • Los alumnos perderán el progreso con el asistente
                        actual
                      </li>
                      <li key="warning-2">
                        • Las configuraciones específicas se reiniciarán
                      </li>
                      <li key="warning-3">
                        • Esta acción no se puede deshacer fácilmente
                      </li>
                      <li key="warning-4">
                        • Solo el administrador puede realizar este cambio
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleChangeAssistant}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={!newAssistantId}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Cambiar Asistente
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowChangeAssistant(false);
                    setNewAssistantId("");
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
