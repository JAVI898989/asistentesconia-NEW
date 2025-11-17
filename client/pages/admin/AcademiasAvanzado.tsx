import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  UserPlus,
  UserMinus,
  CreditCard,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Euro,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Bot,
  GraduationCap,
  Crown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Academia {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  website?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  isActive: boolean;
  subscriptionPlan: "basic" | "premium" | "enterprise";
  maxStudents: number;
  maxTeachers: number;
  currentStudents: number;
  currentTeachers: number;
  assignedAssistants: string[];
  customPricing: boolean;
  discountPercentage: number;
  billingEmail?: string;
  taxId?: string;
  contractStartDate: string;
  contractEndDate?: string;
  monthlyFee: number;
  totalRevenue: number;
  paymentMethod: "stripe" | "invoice" | "bank_transfer";
  paymentStatus: "current" | "overdue" | "suspended";
  lastPaymentDate?: string;
  nextBillingDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AcademyUser {
  id: string;
  academyId: string;
  email: string;
  name: string;
  role: "teacher" | "student" | "admin";
  isActive: boolean;
  assignedAssistants: string[];
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
}

interface AcademyInvoice {
  id: string;
  academyId: string;
  academyName: string;
  invoiceNumber: string;
  amount: number;
  period: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "canceled";
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  pdfUrl?: string;
}

interface AcademyStats {
  totalAcademies: number;
  activeAcademies: number;
  totalStudents: number;
  totalTeachers: number;
  monthlyRevenue: number;
  averageStudentsPerAcademy: number;
  topAcademies: Array<{
    id: string;
    name: string;
    students: number;
    revenue: number;
  }>;
}

export default function AcademiasAvanzado() {
  const [academies, setAcademies] = useState<Academia[]>([]);
  const [academyUsers, setAcademyUsers] = useState<AcademyUser[]>([]);
  const [academyInvoices, setAcademyInvoices] = useState<AcademyInvoice[]>([]);
  const [stats, setStats] = useState<AcademyStats>({
    totalAcademies: 0,
    activeAcademies: 0,
    totalStudents: 0,
    totalTeachers: 0,
    monthlyRevenue: 0,
    averageStudentsPerAcademy: 0,
    topAcademies: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("academies");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  
  // Dialog states
  const [showCreateAcademyDialog, setShowCreateAcademyDialog] = useState(false);
  const [showEditAcademyDialog, setShowEditAcademyDialog] = useState(false);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedAcademy, setSelectedAcademy] = useState<Academia | null>(null);
  
  const { toast } = useToast();

  // Form states
  const [academyForm, setAcademyForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "España",
    website: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    subscriptionPlan: "basic" as Academia["subscriptionPlan"],
    maxStudents: 50,
    maxTeachers: 5,
    assignedAssistants: [] as string[],
    customPricing: false,
    discountPercentage: 0,
    billingEmail: "",
    taxId: "",
    contractEndDate: "",
    monthlyFee: 99,
    paymentMethod: "stripe" as Academia["paymentMethod"],
    notes: "",
  });

  const [userForm, setUserForm] = useState({
    email: "",
    name: "",
    role: "student" as AcademyUser["role"],
    assignedAssistants: [] as string[],
  });

  const [invoiceForm, setInvoiceForm] = useState({
    period: "",
    dueDate: "",
    items: [
      { description: "", quantity: 1, unitPrice: 0 }
    ],
  });

  useEffect(() => {
    loadAcademyData();
  }, []);

  const loadAcademyData = async () => {
    try {
      // Simular carga de datos - reemplazar con Firebase
      const mockAcademies: Academia[] = [
        {
          id: "academy_1",
          name: "Academia Oposita Madrid",
          email: "info@oposita.madrid",
          phone: "+34 91 123 45 67",
          address: "Calle Gran Vía, 123",
          city: "Madrid",
          postalCode: "28013",
          country: "España",
          website: "https://www.oposita.madrid",
          contactPerson: "Ana García",
          contactEmail: "ana@oposita.madrid",
          contactPhone: "+34 91 987 65 43",
          isActive: true,
          subscriptionPlan: "premium",
          maxStudents: 200,
          maxTeachers: 15,
          currentStudents: 185,
          currentTeachers: 12,
          assignedAssistants: ["guardia-civil", "policia-nacional", "bombero"],
          customPricing: true,
          discountPercentage: 15,
          billingEmail: "facturacion@oposita.madrid",
          taxId: "B12345678",
          contractStartDate: "2024-01-01",
          contractEndDate: "2024-12-31",
          monthlyFee: 89700, // En centavos
          totalRevenue: 538200,
          paymentMethod: "stripe",
          paymentStatus: "current",
          lastPaymentDate: "2024-01-15T10:30:00Z",
          nextBillingDate: "2024-02-15T10:30:00Z",
          notes: "Cliente premium con descuento especial por volumen",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "academy_2",
          name: "Centro de Estudios Barcelona",
          email: "info@estudiobcn.com",
          phone: "+34 93 456 78 90",
          address: "Passeig de Gràcia, 456",
          city: "Barcelona",
          postalCode: "08007",
          country: "España",
          contactPerson: "Carlos Ruiz",
          contactEmail: "carlos@estudiobcn.com",
          isActive: true,
          subscriptionPlan: "basic",
          maxStudents: 50,
          maxTeachers: 5,
          currentStudents: 45,
          currentTeachers: 4,
          assignedAssistants: ["mir", "enfermeria-eir"],
          customPricing: false,
          discountPercentage: 0,
          billingEmail: "facturacion@estudiobcn.com",
          contractStartDate: "2024-01-10",
          monthlyFee: 9900,
          totalRevenue: 29700,
          paymentMethod: "invoice",
          paymentStatus: "overdue",
          lastPaymentDate: "2023-12-15T10:30:00Z",
          nextBillingDate: "2024-01-10T10:30:00Z",
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        },
      ];

      const mockUsers: AcademyUser[] = [
        {
          id: "user_1",
          academyId: "academy_1",
          email: "profesor1@oposita.madrid",
          name: "Pedro Martínez",
          role: "teacher",
          isActive: true,
          assignedAssistants: ["guardia-civil", "policia-nacional"],
          lastLogin: "2024-01-16T09:30:00Z",
          createdAt: "2024-01-01T00:00:00Z",
          permissions: ["view_students", "manage_content"],
        },
        {
          id: "user_2",
          academyId: "academy_1",
          email: "estudiante1@oposita.madrid",
          name: "Lucía González",
          role: "student",
          isActive: true,
          assignedAssistants: ["guardia-civil"],
          lastLogin: "2024-01-15T14:20:00Z",
          createdAt: "2024-01-05T00:00:00Z",
          permissions: [],
        },
      ];

      const mockInvoices: AcademyInvoice[] = [
        {
          id: "inv_academy_1",
          academyId: "academy_1",
          academyName: "Academia Oposita Madrid",
          invoiceNumber: "FAC-2024-001",
          amount: 89700,
          period: "Enero 2024",
          issueDate: "2024-01-01",
          dueDate: "2024-01-31",
          paidDate: "2024-01-15",
          status: "paid",
          items: [
            {
              description: "Suscripción Premium - 185 estudiantes",
              quantity: 1,
              unitPrice: 89700,
              total: 89700,
            },
          ],
        },
      ];

      const mockStats: AcademyStats = {
        totalAcademies: mockAcademies.length,
        activeAcademies: mockAcademies.filter((a) => a.isActive).length,
        totalStudents: mockAcademies.reduce((sum, a) => sum + a.currentStudents, 0),
        totalTeachers: mockAcademies.reduce((sum, a) => sum + a.currentTeachers, 0),
        monthlyRevenue: mockAcademies
          .filter((a) => a.isActive)
          .reduce((sum, a) => sum + a.monthlyFee, 0),
        averageStudentsPerAcademy: mockAcademies.length > 0 
          ? mockAcademies.reduce((sum, a) => sum + a.currentStudents, 0) / mockAcademies.filter((a) => a.isActive).length
          : 0,
        topAcademies: mockAcademies
          .sort((a, b) => b.totalRevenue - a.totalRevenue)
          .slice(0, 5)
          .map((a) => ({
            id: a.id,
            name: a.name,
            students: a.currentStudents,
            revenue: a.totalRevenue,
          })),
      };

      setAcademies(mockAcademies);
      setAcademyUsers(mockUsers);
      setAcademyInvoices(mockInvoices);
      setStats(mockStats);
    } catch (error) {
      console.error("Error loading academy data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de academias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAcademy = async () => {
    try {
      const newAcademy: Academia = {
        id: `academy_${Date.now()}`,
        ...academyForm,
        isActive: true,
        currentStudents: 0,
        currentTeachers: 0,
        totalRevenue: 0,
        paymentStatus: "current",
        contractStartDate: new Date().toISOString().split('T')[0],
        monthlyFee: academyForm.monthlyFee * 100, // Convertir a centavos
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAcademies([newAcademy, ...academies]);
      setShowCreateAcademyDialog(false);
      
      // Reset form
      setAcademyForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "España",
        website: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
        subscriptionPlan: "basic",
        maxStudents: 50,
        maxTeachers: 5,
        assignedAssistants: [],
        customPricing: false,
        discountPercentage: 0,
        billingEmail: "",
        taxId: "",
        contractEndDate: "",
        monthlyFee: 99,
        paymentMethod: "stripe",
        notes: "",
      });

      toast({
        title: "Academia creada",
        description: `Se ha creado la academia ${newAcademy.name}`,
      });
    } catch (error) {
      console.error("Error creating academy:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la academia",
        variant: "destructive",
      });
    }
  };

  const addUserToAcademy = async () => {
    if (!selectedAcademy) return;

    try {
      const newUser: AcademyUser = {
        id: `user_${Date.now()}`,
        academyId: selectedAcademy.id,
        ...userForm,
        isActive: true,
        createdAt: new Date().toISOString(),
        permissions: userForm.role === "teacher" ? ["view_students", "manage_content"] : [],
      };

      setAcademyUsers([newUser, ...academyUsers]);
      
      // Actualizar contador en la academia
      setAcademies(
        academies.map((a) =>
          a.id === selectedAcademy.id
            ? {
                ...a,
                currentStudents: userForm.role === "student" 
                  ? a.currentStudents + 1 
                  : a.currentStudents,
                currentTeachers: userForm.role === "teacher" 
                  ? a.currentTeachers + 1 
                  : a.currentTeachers,
              }
            : a
        )
      );

      setShowAddUserDialog(false);
      setUserForm({
        email: "",
        name: "",
        role: "student",
        assignedAssistants: [],
      });

      toast({
        title: "Usuario añadido",
        description: `Se ha añadido ${newUser.name} a la academia`,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir el usuario",
        variant: "destructive",
      });
    }
  };

  const toggleAcademyStatus = async (academyId: string) => {
    try {
      setAcademies(
        academies.map((academy) =>
          academy.id === academyId
            ? { 
                ...academy, 
                isActive: !academy.isActive,
                paymentStatus: academy.isActive ? "suspended" : "current",
                updatedAt: new Date().toISOString(),
              }
            : academy
        )
      );

      const academy = academies.find((a) => a.id === academyId);
      toast({
        title: "Estado actualizado",
        description: `${academy?.name} ha sido ${academy?.isActive ? "suspendida" : "activada"}`,
      });
    } catch (error) {
      console.error("Error toggling academy status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (academy: Academia) => {
    if (!academy.isActive) {
      return <Badge className="bg-red-600 text-white">Suspendida</Badge>;
    }
    if (academy.paymentStatus === "overdue") {
      return <Badge className="bg-orange-600 text-white">Pago Vencido</Badge>;
    }
    if (academy.paymentStatus === "current") {
      return <Badge className="bg-green-600 text-white">Activa</Badge>;
    }
    return <Badge className="bg-gray-600 text-white">Suspendida</Badge>;
  };

  const getPlanBadge = (plan: Academia["subscriptionPlan"]) => {
    const colors = {
      basic: "bg-blue-600",
      premium: "bg-purple-600",
      enterprise: "bg-yellow-600",
    };
    return <Badge className={`${colors[plan]} text-white`}>{plan.toUpperCase()}</Badge>;
  };

  const formatAmount = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
    }).format(amount / 100);
  };

  const filteredAcademies = academies.filter((academy) => {
    const matchesSearch =
      searchTerm === "" ||
      academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      academy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      academy.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && academy.isActive) ||
      (filterStatus === "inactive" && !academy.isActive) ||
      (filterStatus === "overdue" && academy.paymentStatus === "overdue");
    const matchesPlan = filterPlan === "all" || academy.subscriptionPlan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const selectedAcademyUsers = academyUsers.filter((user) => 
    selectedAcademy ? user.academyId === selectedAcademy.id : false
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building className="w-8 h-8 text-orange-400" />
              Gestión Avanzada de Academias
            </h1>
            <p className="text-slate-400 mt-1">
              Control completo de academias, usuarios, facturación y asistentes
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadAcademyData}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={() => setShowCreateAcademyDialog(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Academia
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Total Academias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalAcademies}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.activeAcademies}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.totalStudents}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Profesores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{stats.totalTeachers}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Ingresos/Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {formatAmount(stats.monthlyRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {Math.round(stats.averageStudentsPerAcademy)}
                <span className="text-sm text-slate-400 ml-1">est/academia</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="academies">
              <Building className="w-4 h-4 mr-2" />
              Academias
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Facturación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="academies" className="space-y-4">
            {/* Filtros */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar academias..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="active">Activas</SelectItem>
                      <SelectItem value="inactive">Inactivas</SelectItem>
                      <SelectItem value="overdue">Pago Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Academias */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Academia</TableHead>
                      <TableHead className="text-white">Plan</TableHead>
                      <TableHead className="text-white">Usuarios</TableHead>
                      <TableHead className="text-white">Asistentes</TableHead>
                      <TableHead className="text-white">Facturación</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAcademies.map((academy) => (
                      <TableRow key={academy.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white">
                            <div className="font-semibold">{academy.name}</div>
                            <div className="text-sm text-slate-400">{academy.email}</div>
                            <div className="text-sm text-slate-400">
                              {academy.contactPerson} • {academy.city}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getPlanBadge(academy.subscriptionPlan)}
                            {academy.customPricing && (
                              <Badge className="bg-yellow-600 text-white text-xs">
                                -{academy.discountPercentage}%
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              <span>{academy.currentStudents}/{academy.maxStudents}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Users className="w-3 h-3" />
                              <span>{academy.currentTeachers}/{academy.maxTeachers}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {academy.assignedAssistants.slice(0, 2).map((assistant) => (
                              <Badge key={assistant} className="bg-blue-600 text-white text-xs">
                                <Bot className="w-3 h-3 mr-1" />
                                {assistant}
                              </Badge>
                            ))}
                            {academy.assignedAssistants.length > 2 && (
                              <Badge className="bg-gray-600 text-white text-xs">
                                +{academy.assignedAssistants.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">
                            <div className="font-semibold">{formatAmount(academy.monthlyFee)}/mes</div>
                            <div className="text-sm text-slate-400">
                              Total: {formatAmount(academy.totalRevenue)}
                            </div>
                            {academy.nextBillingDate && (
                              <div className="text-xs text-slate-500">
                                Próximo: {new Date(academy.nextBillingDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(academy)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setSelectedAcademy(academy);
                                setShowUsersDialog(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Users className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => toggleAcademyStatus(academy.id)}
                              size="sm"
                              className={academy.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                            >
                              {academy.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Gestión de Usuarios por Academia</CardTitle>
                <CardDescription className="text-slate-400">
                  Selecciona una academia para gestionar sus usuarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedAcademy?.id || ""}
                  onValueChange={(value) => {
                    const academy = academies.find((a) => a.id === value);
                    setSelectedAcademy(academy || null);
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Seleccionar academia" />
                  </SelectTrigger>
                  <SelectContent>
                    {academies.map((academy) => (
                      <SelectItem key={academy.id} value={academy.id}>
                        {academy.name} ({academy.currentStudents + academy.currentTeachers} usuarios)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedAcademy && selectedAcademyUsers.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-semibold">
                        Usuarios de {selectedAcademy.name}
                      </h3>
                      <Button
                        onClick={() => setShowAddUserDialog(true)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Añadir Usuario
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-white">Usuario</TableHead>
                          <TableHead className="text-white">Rol</TableHead>
                          <TableHead className="text-white">Asistentes</TableHead>
                          <TableHead className="text-white">Último Acceso</TableHead>
                          <TableHead className="text-white">Estado</TableHead>
                          <TableHead className="text-white">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAcademyUsers.map((user) => (
                          <TableRow key={user.id} className="border-slate-700">
                            <TableCell>
                              <div className="text-white">
                                <div>{user.name}</div>
                                <div className="text-sm text-slate-400">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={user.role === "teacher" ? "bg-purple-600" : user.role === "admin" ? "bg-red-600" : "bg-blue-600"}>
                                {user.role === "teacher" ? "Profesor" : user.role === "admin" ? "Admin" : "Estudiante"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.assignedAssistants.map((assistant) => (
                                  <Badge key={assistant} className="bg-green-600 text-white text-xs">
                                    {assistant}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-400">
                              {user.lastLogin 
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : "Nunca"}
                            </TableCell>
                            <TableCell>
                              <Badge className={user.isActive ? "bg-green-600" : "bg-red-600"}>
                                {user.isActive ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-600 text-white hover:bg-slate-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  <UserMinus className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Facturación de Academias</CardTitle>
                <CardDescription className="text-slate-400">
                  Gestión de facturas y pagos de academias
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Factura</TableHead>
                      <TableHead className="text-white">Academia</TableHead>
                      <TableHead className="text-white">Período</TableHead>
                      <TableHead className="text-white">Importe</TableHead>
                      <TableHead className="text-white">Vencimiento</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academyInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white font-mono">{invoice.invoiceNumber}</div>
                        </TableCell>
                        <TableCell className="text-white">{invoice.academyName}</TableCell>
                        <TableCell className="text-slate-400">{invoice.period}</TableCell>
                        <TableCell className="text-white font-semibold">
                          {formatAmount(invoice.amount)}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            invoice.status === "paid" ? "bg-green-600" :
                            invoice.status === "overdue" ? "bg-red-600" :
                            invoice.status === "sent" ? "bg-blue-600" :
                            "bg-gray-600"
                          }>
                            {invoice.status === "paid" ? "Pagada" :
                             invoice.status === "overdue" ? "Vencida" :
                             invoice.status === "sent" ? "Enviada" : "Borrador"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Mail className="w-4 h-4" />
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
        </Tabs>

        {/* Dialog para crear academia */}
        <Dialog open={showCreateAcademyDialog} onOpenChange={setShowCreateAcademyDialog}>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nueva Academia</DialogTitle>
              <DialogDescription className="text-slate-400">
                Registra una nueva academia en el sistema
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Nombre de la Academia *</Label>
                  <Input
                    value={academyForm.name}
                    onChange={(e) => setAcademyForm({ ...academyForm, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Academia Ejemplo"
                  />
                </div>
                <div>
                  <Label className="text-white">Email Principal *</Label>
                  <Input
                    type="email"
                    value={academyForm.email}
                    onChange={(e) => setAcademyForm({ ...academyForm, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="info@academia.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Persona de Contacto *</Label>
                  <Input
                    value={academyForm.contactPerson}
                    onChange={(e) => setAcademyForm({ ...academyForm, contactPerson: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Nombre del contacto"
                  />
                </div>
                <div>
                  <Label className="text-white">Email de Contacto *</Label>
                  <Input
                    type="email"
                    value={academyForm.contactEmail}
                    onChange={(e) => setAcademyForm({ ...academyForm, contactEmail: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="contacto@academia.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Plan</Label>
                  <Select
                    value={academyForm.subscriptionPlan}
                    onValueChange={(value) => setAcademyForm({ ...academyForm, subscriptionPlan: value as any })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico (50 estudiantes)</SelectItem>
                      <SelectItem value="premium">Premium (200 estudiantes)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (500+ estudiantes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Máx. Estudiantes</Label>
                  <Input
                    type="number"
                    value={academyForm.maxStudents}
                    onChange={(e) => setAcademyForm({ ...academyForm, maxStudents: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Precio Mensual (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={academyForm.monthlyFee}
                    onChange={(e) => setAcademyForm({ ...academyForm, monthlyFee: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Notas Internas</Label>
                <Textarea
                  value={academyForm.notes}
                  onChange={(e) => setAcademyForm({ ...academyForm, notes: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Información adicional sobre la academia..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setShowCreateAcademyDialog(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={createAcademy}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={!academyForm.name || !academyForm.email || !academyForm.contactPerson || !academyForm.contactEmail}
              >
                <Building className="w-4 h-4 mr-2" />
                Crear Academia
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para añadir usuario */}
        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Añadir Usuario a {selectedAcademy?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Crear un nuevo usuario para esta academia
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email *</Label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
                <div>
                  <Label className="text-white">Nombre *</Label>
                  <Input
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Nombre completo"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Rol</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) => setUserForm({ ...userForm, role: value as any })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setShowAddUserDialog(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={addUserToAcademy}
                className="bg-blue-500 hover:bg-blue-600"
                disabled={!userForm.email || !userForm.name}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Añadir Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
