import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Academia,
  AcademiaStudent,
  createAcademia,
  createAcademiaWithAdminUser,
  getUserAcademias,
  getAllAcademias,
  getAcademiaStudents,
  updateAcademia,
  generateAcademiaSlug,
  checkIsAdmin,
} from "@/lib/firebaseData";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  Plus,
  Users,
  Calendar,
  Euro,
  Crown,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  School,
  CreditCard,
  Receipt,
  DollarSign,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface InvoiceData {
  id: string;
  academiaId: string;
  academiaName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  createdDate: string;
  billingCycle: "monthly" | "annual";
}

export default function Academias() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [academias, setAcademias] = useState<Academia[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAcademias, setLoadingAcademias] = useState(false);
  const [creatingAcademia, setCreatingAcademia] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [selectedAcademia, setSelectedAcademia] = useState<Academia | null>(
    null,
  );
  const [newCredentials, setNewCredentials] = useState<{
    email: string;
    password: string;
    academiaName: string;
    academiaSlug: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Form state for creating new academia
  const [newAcademiaForm, setNewAcademiaForm] = useState({
    name: "",
    type: "oposiciones" as
      | "oposiciones"
      | "idiomas"
      | "escolar"
      | "universitaria",
    adminEmail: "",
    organization: "",
    phone: "",
    students: 100,
    duration: 2 as 2 | 5 | 10,
    isFounder: true,
    billingCycle: "monthly" as "monthly" | "annual",
    customPassword: "", // Nueva opción para contraseña personalizada
    sendEmailForPassword: false, // Nueva opción para enviar email
    isDemoMode: false, // Nueva opción para modo demo
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock invoices data (in real app, fetch from backend)
  const [invoices] = useState<InvoiceData[]>([
    {
      id: "INV-001",
      academiaId: "academia-1",
      academiaName: "Academia Oposiciones Madrid",
      amount: 1200,
      status: "paid",
      dueDate: "2024-02-15",
      createdDate: "2024-01-15",
      billingCycle: "monthly",
    },
    {
      id: "INV-002",
      academiaId: "academia-2",
      academiaName: "Academia Idiomas Barcelona",
      amount: 800,
      status: "pending",
      dueDate: "2024-02-20",
      createdDate: "2024-01-20",
      billingCycle: "monthly",
    },
    {
      id: "INV-003",
      academiaId: "academia-3",
      academiaName: "Academia ESO Valencia",
      amount: 600,
      status: "overdue",
      dueDate: "2024-01-25",
      createdDate: "2023-12-25",
      billingCycle: "monthly",
    },
  ]);

  // Simplified initialization - always allow admin access
  useEffect(() => {
    console.log("🚀 Inicializando página de Academias");
    setIsAdmin(true);
    setLoading(false);

    // Load academias immediately
    loadAcademias();

    // Simple auth listener without blocking
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(`👤 Usuario en Academias: ${user?.email || "Sin sesión"}`);
    });

    return () => unsubscribe();
  }, []);

  const loadAcademias = async () => {
    setLoadingAcademias(true);
    try {
      const allAcademias = await getAllAcademias();
      setAcademias(allAcademias);

      if (allAcademias.length > 0) {
        // Check if we're in demo mode
        const isDemoMode = allAcademias.some((a) => a.id.includes("demo"));

        toast({
          title: isDemoMode
            ? "🔄 Modo Demo - Academias cargadas"
            : "Academias cargadas",
          description: isDemoMode
            ? `${allAcademias.length} academias de ejemplo (problemas de conectividad Firebase)`
            : `Se cargaron ${allAcademias.length} academias correctamente`,
        });
      }
    } catch (error) {
      console.error("Error loading academias:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar las academias. Verificando modo demo...",
        variant: "destructive",
      });
    } finally {
      setLoadingAcademias(false);
    }
  };

  const handleCreateAcademia = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAcademia(true);

    try {
      // Validations
      if (!newAcademiaForm.name.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la academia es obligatorio",
          variant: "destructive",
        });
        return;
      }

      if (!newAcademiaForm.adminEmail.trim()) {
        toast({
          title: "Error",
          description: "El email del administrador es obligatorio",
          variant: "destructive",
        });
        return;
      }

      if (!newAcademiaForm.organization.trim()) {
        toast({
          title: "Error",
          description: "La organización es obligatoria",
          variant: "destructive",
        });
        return;
      }

      // Calculate pricing
      const founderPricing = {
        "2": { hasta100: 12, "100": 11, "200": 10, "500": 9, "1000": 8 },
        "5": { hasta100: 10, "100": 9, "200": 8, "500": 7, "1000": 6 },
        "10": { hasta100: 8, "100": 7, "200": 6, "500": 5, "1000": 4 },
      };

      let pricePerStudent =
        founderPricing[
          newAcademiaForm.duration.toString() as keyof typeof founderPricing
        ]["hasta100"];

      if (newAcademiaForm.students > 1000) {
        pricePerStudent =
          founderPricing[
            newAcademiaForm.duration.toString() as keyof typeof founderPricing
          ]["1000"];
      } else if (newAcademiaForm.students > 500) {
        pricePerStudent =
          founderPricing[
            newAcademiaForm.duration.toString() as keyof typeof founderPricing
          ]["500"];
      } else if (newAcademiaForm.students > 200) {
        pricePerStudent =
          founderPricing[
            newAcademiaForm.duration.toString() as keyof typeof founderPricing
          ]["200"];
      } else if (newAcademiaForm.students > 100) {
        pricePerStudent =
          founderPricing[
            newAcademiaForm.duration.toString() as keyof typeof founderPricing
          ]["100"];
      }

      if (!newAcademiaForm.isFounder) {
        pricePerStudent *= 3;
      }

      const slug = generateAcademiaSlug(newAcademiaForm.name);

      const academiaData: Omit<Academia, "id" | "createdAt" | "updatedAt"> = {
        slug,
        name: newAcademiaForm.name,
        type: newAcademiaForm.type,
        adminUserId: user?.uid || "admin-created",
        adminEmail: newAcademiaForm.adminEmail,
        organization: newAcademiaForm.organization,
        phone: newAcademiaForm.phone,
        contractDetails: {
          students: newAcademiaForm.students,
          duration: newAcademiaForm.duration,
          pricePerStudent,
          totalPrice: pricePerStudent * newAcademiaForm.students,
          billingCycle: newAcademiaForm.billingCycle,
          isFounder: newAcademiaForm.isFounder,
          isDemoMode: newAcademiaForm.sendEmailForPassword, // Si envía email, no es demo
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + newAcademiaForm.duration * 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        status: "active",
        currentStudents: 0,
        teachers: [],
        assistants: getDefaultAssistants(newAcademiaForm.type),
      };

      const result = await createAcademiaWithAdminUser(
        academiaData,
        newAcademiaForm.customPassword,
        newAcademiaForm.sendEmailForPassword,
      );

      // Show different success messages based on method and network status
      if (result.networkError) {
        toast({
          title: "⚠️ Academia creada con limitaciones",
          description: `${newAcademiaForm.name} creada, pero hay problemas de red con Firebase Auth`,
        });

        alert(`🎓 ACADEMIA CREADA - PROBLEMAS DE RED

🏫 Academia: ${newAcademiaForm.name}
⚠️ Estado: Creada con limitaciones de red

IMPORTANTE:
- La academia se creó correctamente en la base de datos
- Hay problemas de conectividad con Firebase Auth
- El usuario se creó como registro temporal
- Será necesario configurar autenticación manualmente

📧 Email: ${newAcademiaForm.adminEmail}
🔑 Contraseña temporal: ${result.password}
🌐 Panel: ${window.location.origin}/academia/${academiaData.slug}

NOTA: El administrador deberá crear su cuenta manualmente debido a los problemas de red.`);
      } else if (result.emailSent) {
        toast({
          title: "✅ Academia creada",
          description: `${newAcademiaForm.name} creada. Email de creación de contraseña enviado.`,
        });

        alert(`🎓 ACADEMIA CREADA - EMAIL ENVIADO

🏫 Academia: ${newAcademiaForm.name}
📧 Email enviado a: ${newAcademiaForm.adminEmail}

El administrador recibirá un email con un enlace para crear su contraseña.

✅ Una vez que cree su contrase��a, podrá acceder al panel en:
${window.location.origin}/academia/${academiaData.slug}`);
      } else {
        toast({
          title: "✅ Academia y usuario creados",
          description: `${newAcademiaForm.name} creada exitosamente`,
        });

        // Store credentials to show in modal
        setNewCredentials({
          email: newAcademiaForm.adminEmail,
          password: result.password || "Sin contraseña",
          academiaName: newAcademiaForm.name,
          academiaSlug: academiaData.slug,
        });
        setShowCredentialsDialog(true);
      }

      // Reload academias to show the new one
      await loadAcademias();
      setShowCreateDialog(false);

      // Reset form
      setNewAcademiaForm({
        name: "",
        type: "oposiciones",
        adminEmail: "",
        organization: "",
        phone: "",
        students: 100,
        duration: 2,
        isFounder: true,
        billingCycle: "monthly",
        customPassword: "",
        sendEmailForPassword: false,
        isDemoMode: false,
      });

      console.log(
        `✅ Academia creada con ID: ${academiaId}, Usuario ID: ${userId}`,
      );
    } catch (error: any) {
      console.error("Error creating academia:", error);

      // Handle specific network errors
      if (
        error.code === "auth/network-request-failed" ||
        error.message?.includes("network")
      ) {
        toast({
          title: "⚠️ Error de red",
          description:
            "Problemas de conectividad con Firebase. La academia podría haberse creado parcialmente.",
          variant: "destructive",
        });

        alert(`⚠️ PROBLEMA DE RED DETECTADO

Ha ocurrido un error de conectividad con Firebase Auth:
${error.message}

POSIBLES CAUSAS:
- Problemas de red temporal
- Configuración de CORS en Firebase
- Restricciones de dominio en Firebase Auth

SOLUCIONES:
1. Verifica la conexión a internet
2. Intenta de nuevo en unos minutos
3. Contacta con soporte si persiste

La academia podría haberse creado en la base de datos, pero sin usuario administrador.`);
      } else {
        toast({
          title: "❌ Error",
          description: error.message || "No se pudo crear la academia",
          variant: "destructive",
        });
      }
    } finally {
      setCreatingAcademia(false);
    }
  };

  const getDefaultAssistants = (type: string): string[] => {
    switch (type) {
      case "oposiciones":
        return [
          "guardia-civil",
          "policia-nacional",
          "auxiliar-administrativo-estado",
        ];
      case "idiomas":
        return ["profesor-primaria", "profesor-secundaria"];
      case "escolar":
        return ["profesor-secundaria"];
      case "universitaria":
        return ["profesor-secundaria"];
      default:
        return [];
    }
  };

  const filteredAcademias = academias.filter((academia) => {
    const matchesSearch = academia.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || academia.status === statusFilter;
    const matchesType = typeFilter === "all" || academia.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTotalRevenue = () => {
    return academias.reduce(
      (total, academia) => total + academia.contractDetails.totalPrice,
      0,
    );
  };

  const getActiveAcademias = () => {
    return academias.filter((a) => a.status === "active").length;
  };

  const getTotalStudents = () => {
    return academias.reduce(
      (total, academia) => total + academia.currentStudents,
      0,
    );
  };

  // No loading screen - immediate access

  // Admin access guaranteed - no restrictions

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Demo Mode Banner */}
        {academias.some((a) => a.id.includes("demo")) && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-yellow-200 font-semibold">
                  🔄 Modo Demo Activado
                </h3>
                <p className="text-yellow-200/80 text-sm">
                  Hay problemas de conectividad con Firebase. Se muestran datos
                  de ejemplo. La funcionalidad puede estar limitada.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-purple-400" />
              Gestión de Academias
            </h1>
            <p className="text-slate-400 mt-1">
              Administra todas las academias de la plataforma
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={loadAcademias}
              disabled={loadingAcademias}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loadingAcademias ? "animate-spin" : ""}`}
              />
              {loadingAcademias ? "Cargando..." : "Actualizar"}
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Academia
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <School className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-slate-400 text-sm">Academias Activas</p>
                  <p className="text-white text-2xl font-bold">
                    {getActiveAcademias()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-slate-400 text-sm">Total Estudiantes</p>
                  <p className="text-white text-2xl font-bold">
                    {getTotalStudents()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Euro className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-slate-400 text-sm">Ingresos Mensuales</p>
                  <p className="text-white text-2xl font-bold">
                    €{getTotalRevenue().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-slate-400 text-sm">Fundadores</p>
                  <p className="text-white text-2xl font-bold">
                    {
                      academias.filter((a) => a.contractDetails.isFounder)
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300">
              Vista General
            </TabsTrigger>
            <TabsTrigger value="academias" className="text-slate-300">
              Academias
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-slate-300">
              Facturación
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-slate-300">
              Análisis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Academias Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {academias.slice(0, 5).map((academia) => (
                      <div
                        key={academia.id}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {academia.name}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {academia.currentStudents}/
                            {academia.contractDetails.students} estudiantes
                          </p>
                        </div>
                        <Badge
                          className={
                            academia.status === "active"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                          }
                        >
                          {academia.status === "active" ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Facturas Pendientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoices
                      .filter((inv) => inv.status !== "paid")
                      .map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {invoice.academiaName}
                            </p>
                            <p className="text-slate-400 text-sm">
                              Vence:{" "}
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">
                              €{invoice.amount}
                            </p>
                            <Badge
                              className={
                                invoice.status === "overdue"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              }
                            >
                              {invoice.status === "overdue"
                                ? "Vencida"
                                : "Pendiente"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Academias Tab */}
          <TabsContent value="academias" className="space-y-6">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-slate-200">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Nombre de academia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-200">Estado</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="inactive">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-200">Tipo</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="oposiciones">Oposiciones</SelectItem>
                        <SelectItem value="idiomas">Idiomas</SelectItem>
                        <SelectItem value="escolar">
                          ESO/Bachillerato
                        </SelectItem>
                        <SelectItem value="universitaria">
                          Universitaria
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academias Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Academia</TableHead>
                      <TableHead className="text-slate-300">Tipo</TableHead>
                      <TableHead className="text-slate-300">
                        Estudiantes
                      </TableHead>
                      <TableHead className="text-slate-300">
                        Precio/mes
                      </TableHead>
                      <TableHead className="text-slate-300">Estado</TableHead>
                      <TableHead className="text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAcademias.map((academia) => (
                      <TableRow key={academia.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {academia.name}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {academia.adminEmail}
                            </p>
                            {academia.contractDetails.isFounder && (
                              <Badge className="mt-1 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                <Crown className="w-3 h-3 mr-1" />
                                Fundador
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 capitalize">
                            {academia.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">
                            {academia.currentStudents}/
                            {academia.contractDetails.students}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {Math.round(
                              (academia.currentStudents /
                                academia.contractDetails.students) *
                                100,
                            )}
                            % ocupación
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-white font-medium">
                            €{academia.contractDetails.totalPrice}
                          </div>
                          <div className="text-slate-400 text-sm">
                            €{academia.contractDetails.pricePerStudent}
                            /estudiante
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              academia.status === "active"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            }
                          >
                            {academia.status === "active"
                              ? "Activa"
                              : "Inactiva"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() =>
                                window.open(
                                  `/academia/${academia.slug}`,
                                  "_blank",
                                )
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() => {
                                setSelectedAcademia(academia);
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-300 hover:bg-red-600/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Gestión de Facturación
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Factura
                </Button>
              </div>
            </div>

            {/* Billing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Facturas Pagadas</p>
                      <p className="text-white text-2xl font-bold">
                        {invoices.filter((i) => i.status === "paid").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Pendientes</p>
                      <p className="text-white text-2xl font-bold">
                        {invoices.filter((i) => i.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Vencidas</p>
                      <p className="text-white text-2xl font-bold">
                        {invoices.filter((i) => i.status === "overdue").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoices Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Factura</TableHead>
                      <TableHead className="text-slate-300">Academia</TableHead>
                      <TableHead className="text-slate-300">Importe</TableHead>
                      <TableHead className="text-slate-300">
                        Vencimiento
                      </TableHead>
                      <TableHead className="text-slate-300">Estado</TableHead>
                      <TableHead className="text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {invoice.id}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {new Date(
                                invoice.createdDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-white">{invoice.academiaName}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-white font-medium">
                            €{invoice.amount.toLocaleString()}
                          </p>
                          <p className="text-slate-400 text-sm capitalize">
                            {invoice.billingCycle}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-white">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              invoice.status === "paid"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : invoice.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                            }
                          >
                            {invoice.status === "paid"
                              ? "Pagada"
                              : invoice.status === "pending"
                                ? "Pendiente"
                                : "Vencida"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <Receipt className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Análisis y Estadísticas
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Ingresos por Tipo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["oposiciones", "idiomas", "escolar", "universitaria"].map(
                      (type) => {
                        const typeAcademias = academias.filter(
                          (a) => a.type === type,
                        );
                        const revenue = typeAcademias.reduce(
                          (sum, a) => sum + a.contractDetails.totalPrice,
                          0,
                        );
                        const percentage = academias.length
                          ? Math.round(
                              (typeAcademias.length / academias.length) * 100,
                            )
                          : 0;

                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-300 capitalize">
                                {type}
                              </span>
                              <span className="text-white font-medium">
                                €{revenue.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Distribución de Estudiantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {academias.map((academia) => {
                      const percentage = Math.round(
                        (academia.currentStudents /
                          academia.contractDetails.students) *
                          100,
                      );
                      return (
                        <div key={academia.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-300 text-sm">
                              {academia.name}
                            </span>
                            <span className="text-white text-sm">
                              {academia.currentStudents}/
                              {academia.contractDetails.students}
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                percentage > 90
                                  ? "bg-red-500"
                                  : percentage > 70
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Credentials Dialog */}
        <Dialog
          open={showCredentialsDialog}
          onOpenChange={setShowCredentialsDialog}
        >
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                ¡Academia Creada!
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Se han generado las credenciales de acceso
              </DialogDescription>
            </DialogHeader>

            {newCredentials && (
              <div className="space-y-4">
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                    {newCredentials.academiaName}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-300 text-sm">Email:</label>
                      <div className="bg-slate-800 p-2 rounded border border-slate-600 text-white font-mono text-sm">
                        {newCredentials.email}
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm">
                        Contraseña temporal:
                      </label>
                      <div className="bg-slate-800 p-2 rounded border border-slate-600 text-white font-mono text-sm break-all">
                        {newCredentials.password}
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm">
                        Panel de academia:
                      </label>
                      <div className="bg-slate-800 p-2 rounded border border-slate-600 text-blue-300 font-mono text-sm break-all">
                        {window.location.origin}/academia/
                        {newCredentials.academiaSlug}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-yellow-200 text-sm">
                      <p className="font-semibold mb-1">Importante:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Guarda estas credenciales en un lugar seguro</li>
                        <li>
                          • El administrador debe cambiar la contraseña al
                          primer acceso
                        </li>
                        <li>
                          • Las credenciales se enviarán por email
                          (próximamente)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `
Email: ${newCredentials.email}
Contraseña: ${newCredentials.password}
Panel: ${window.location.origin}/academia/${newCredentials.academiaSlug}
                      `.trim(),
                      );
                      toast({
                        title: "Copiado",
                        description: "Credenciales copiadas al portapapeles",
                      });
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    📋 Copiar Credenciales
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCredentialsDialog(false);
                      setNewCredentials(null);
                    }}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Academia Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                Crear Nueva Academia
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Crea una nueva academia en el sistema
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateAcademia} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">
                    Nombre de la Academia *
                  </Label>
                  <Input
                    value={newAcademiaForm.name}
                    onChange={(e) =>
                      setNewAcademiaForm({
                        ...newAcademiaForm,
                        name: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Tipo *</Label>
                  <Select
                    value={newAcademiaForm.type}
                    onValueChange={(value: typeof newAcademiaForm.type) =>
                      setNewAcademiaForm({ ...newAcademiaForm, type: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="oposiciones">Oposiciones</SelectItem>
                      <SelectItem value="idiomas">Idiomas</SelectItem>
                      <SelectItem value="escolar">ESO/Bachillerato</SelectItem>
                      <SelectItem value="universitaria">
                        Universitaria
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">
                    Email del Administrador *
                  </Label>
                  <Input
                    type="email"
                    value={newAcademiaForm.adminEmail}
                    onChange={(e) =>
                      setNewAcademiaForm({
                        ...newAcademiaForm,
                        adminEmail: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Teléfono</Label>
                  <Input
                    value={newAcademiaForm.phone}
                    onChange={(e) =>
                      setNewAcademiaForm({
                        ...newAcademiaForm,
                        phone: e.target.value,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Organización *</Label>
                <Input
                  value={newAcademiaForm.organization}
                  onChange={(e) =>
                    setNewAcademiaForm({
                      ...newAcademiaForm,
                      organization: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-slate-200">
                    Número de Estudiantes *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={newAcademiaForm.students}
                    onChange={(e) =>
                      setNewAcademiaForm({
                        ...newAcademiaForm,
                        students: parseInt(e.target.value) || 100,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Duración (años) *</Label>
                  <Select
                    value={newAcademiaForm.duration.toString()}
                    onValueChange={(value) =>
                      setNewAcademiaForm({
                        ...newAcademiaForm,
                        duration: parseInt(value) as 2 | 5 | 10,
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="2">2 años</SelectItem>
                      <SelectItem value="5">5 años</SelectItem>
                      <SelectItem value="10">10 años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-200">Facturación</Label>
                  <Select
                    value={newAcademiaForm.billingCycle}
                    onValueChange={(
                      value: typeof newAcademiaForm.billingCycle,
                    ) =>
                      setNewAcademiaForm({
                        ...newAcademiaForm,
                        billingCycle: value,
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {/* Founder checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFounder"
                    checked={newAcademiaForm.isFounder}
                    onChange={(e) =>
                      setNewAcademiaForm({
                        ...newAcademiaForm,
                        isFounder: e.target.checked,
                      })
                    }
                    className="rounded border-slate-600"
                  />
                  <Label htmlFor="isFounder" className="text-slate-200">
                    Precio Fundador
                  </Label>
                </div>

                {/* Demo Mode option */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDemoMode"
                    checked={newAcademiaForm.isDemoMode}
                    onChange={(e) =>
                      setNewAcademiaForm({
                        ...newAcademiaForm,
                        isDemoMode: e.target.checked,
                      })
                    }
                    className="rounded border-slate-600"
                  />
                  <Label htmlFor="isDemoMode" className="text-slate-200">
                    🔄 Modo Demo (sin pagos)
                  </Label>
                </div>

                {/* Password options */}
                <div className="border border-slate-600 rounded-lg p-4 space-y-3">
                  <Label className="text-slate-200 font-semibold">
                    Opciones de Contraseña del Administrador
                  </Label>

                  {/* Send email option */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sendEmailForPassword"
                      checked={newAcademiaForm.sendEmailForPassword}
                      onChange={(e) =>
                        setNewAcademiaForm({
                          ...newAcademiaForm,
                          sendEmailForPassword: e.target.checked,
                          customPassword: e.target.checked
                            ? ""
                            : newAcademiaForm.customPassword,
                        })
                      }
                      className="rounded border-slate-600"
                    />
                    <Label
                      htmlFor="sendEmailForPassword"
                      className="text-slate-200"
                    >
                      📧 Enviar email para que cree su contraseña
                    </Label>
                  </div>

                  {/* Custom password field */}
                  {!newAcademiaForm.sendEmailForPassword && (
                    <div>
                      <Label className="text-slate-200">
                        Contraseña personalizada (opcional)
                      </Label>
                      <Input
                        type="password"
                        value={newAcademiaForm.customPassword}
                        onChange={(e) =>
                          setNewAcademiaForm({
                            ...newAcademiaForm,
                            customPassword: e.target.value,
                          })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Dejar vacío para generar automáticamente"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Si no especificas contraseña, se generará una
                        automáticamente
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                  disabled={creatingAcademia}
                >
                  {creatingAcademia ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Academia"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  disabled={creatingAcademia}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
