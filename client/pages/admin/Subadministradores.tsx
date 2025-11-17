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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Key,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  UserPlus,
  Lock,
  Unlock,
  Crown,
  Activity,
  FileText,
  CreditCard,
  Bot,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: "users" | "payments" | "assistants" | "academies" | "system" | "content";
  level: "read" | "write" | "admin";
}

interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubAdmin {
  id: string;
  email: string;
  name: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
  permissions: string[];
  restrictedSections: string[];
  allowedAssistants: string[];
  allowedAcademies: string[];
  temporaryAccess?: {
    expiresAt: string;
    reason: string;
  };
  loginAttempts: number;
  isLocked: boolean;
  notes?: string;
}

interface ActivityLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: "success" | "failed";
}

export default function Subadministradores() {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("admins");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Dialog states
  const [showCreateAdminDialog, setShowCreateAdminDialog] = useState(false);
  const [showEditAdminDialog, setShowEditAdminDialog] = useState(false);
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  
  const { toast } = useToast();

  // Form states
  const [adminForm, setAdminForm] = useState({
    email: "",
    name: "",
    roleId: "",
    allowedAssistants: [] as string[],
    allowedAcademies: [] as string[],
    temporaryAccess: false,
    expiresAt: "",
    accessReason: "",
    notes: "",
  });

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Simular carga de datos - reemplazar con Firebase
      const mockPermissions: Permission[] = [
        // Usuarios
        { id: "users.view", name: "Ver Usuarios", description: "Ver lista de usuarios", category: "users", level: "read" },
        { id: "users.edit", name: "Editar Usuarios", description: "Modificar datos de usuarios", category: "users", level: "write" },
        { id: "users.delete", name: "Eliminar Usuarios", description: "Eliminar usuarios del sistema", category: "users", level: "admin" },
        { id: "users.suspend", name: "Suspender Usuarios", description: "Suspender/reactivar usuarios", category: "users", level: "write" },
        
        // Pagos
        { id: "payments.view", name: "Ver Pagos", description: "Ver transacciones y pagos", category: "payments", level: "read" },
        { id: "payments.create", name: "Crear Pagos", description: "Crear pagos manuales", category: "payments", level: "write" },
        { id: "payments.refund", name: "Procesar Reembolsos", description: "Autorizar reembolsos", category: "payments", level: "admin" },
        { id: "payments.invoices", name: "Gestionar Facturas", description: "Crear y gestionar facturas", category: "payments", level: "write" },
        
        // Asistentes
        { id: "assistants.view", name: "Ver Asistentes", description: "Ver lista de asistentes", category: "assistants", level: "read" },
        { id: "assistants.edit", name: "Editar Asistentes", description: "Modificar configuración de asistentes", category: "assistants", level: "write" },
        { id: "assistants.pricing", name: "Gestionar Precios", description: "Cambiar precios de asistentes", category: "assistants", level: "admin" },
        { id: "assistants.content", name: "Gestionar Contenido", description: "Subir PDFs, tests, flashcards", category: "assistants", level: "write" },
        
        // Academias
        { id: "academies.view", name: "Ver Academias", description: "Ver lista de academias", category: "academies", level: "read" },
        { id: "academies.edit", name: "Editar Academias", description: "Modificar datos de academias", category: "academies", level: "write" },
        { id: "academies.billing", name: "Facturación Academias", description: "Gestionar pagos de academias", category: "academies", level: "write" },
        
        // Sistema
        { id: "system.settings", name: "Configuración", description: "Acceso a configuración del sistema", category: "system", level: "admin" },
        { id: "system.logs", name: "Ver Logs", description: "Ver logs del sistema", category: "system", level: "read" },
        { id: "system.backup", name: "Copias de Seguridad", description: "Gestionar backups", category: "system", level: "admin" },
        
        // Contenido
        { id: "content.support", name: "Soporte Técnico", description: "Gestionar tickets de soporte", category: "content", level: "write" },
        { id: "content.ai", name: "Generación IA", description: "Usar herramientas de IA", category: "content", level: "write" },
      ];

      const mockRoles: AdminRole[] = [
        {
          id: "support_agent",
          name: "Agente de Soporte",
          description: "Maneja tickets de soporte y consultas básicas",
          permissions: ["users.view", "payments.view", "assistants.view", "content.support"],
          isSystem: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "content_manager",
          name: "Gestor de Contenido",
          description: "Gestiona contenido de asistentes y materiales",
          permissions: ["assistants.view", "assistants.edit", "assistants.content", "content.ai"],
          isSystem: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "billing_manager",
          name: "Gestor de Facturación",
          description: "Gestiona pagos, facturas y temas financieros",
          permissions: ["payments.view", "payments.create", "payments.invoices", "academies.billing", "users.view"],
          isSystem: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "academy_manager",
          name: "Gestor de Academias",
          description: "Gestiona academias y sus usuarios",
          permissions: ["academies.view", "academies.edit", "academies.billing", "users.view", "users.edit"],
          isSystem: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      const mockSubAdmins: SubAdmin[] = [
        {
          id: "admin_1",
          email: "soporte@opositia.com",
          name: "María González",
          roleId: "support_agent",
          roleName: "Agente de Soporte",
          isActive: true,
          lastLogin: "2024-01-16T14:30:00Z",
          createdAt: "2024-01-10T10:00:00Z",
          createdBy: "admin@opositia.com",
          permissions: ["users.view", "payments.view", "assistants.view", "content.support"],
          restrictedSections: [],
          allowedAssistants: [],
          allowedAcademies: [],
          loginAttempts: 0,
          isLocked: false,
          notes: "Responsable del soporte técnico nivel 1",
        },
        {
          id: "admin_2",
          email: "contenido@opositia.com",
          name: "Carlos Ruiz",
          roleId: "content_manager",
          roleName: "Gestor de Contenido",
          isActive: true,
          lastLogin: "2024-01-15T09:15:00Z",
          createdAt: "2024-01-05T15:20:00Z",
          createdBy: "admin@opositia.com",
          permissions: ["assistants.view", "assistants.edit", "assistants.content", "content.ai"],
          restrictedSections: [],
          allowedAssistants: ["guardia-civil", "mir", "policia-nacional"],
          allowedAcademies: [],
          loginAttempts: 0,
          isLocked: false,
          notes: "Especialista en contenido para asistentes de seguridad",
        },
        {
          id: "admin_3",
          email: "facturacion@opositia.com",
          name: "Ana Martín",
          roleId: "billing_manager",
          roleName: "Gestor de Facturación",
          isActive: false,
          lastLogin: "2024-01-12T11:45:00Z",
          createdAt: "2024-01-08T12:30:00Z",
          createdBy: "admin@opositia.com",
          permissions: ["payments.view", "payments.create", "payments.invoices", "academies.billing"],
          restrictedSections: [],
          allowedAssistants: [],
          allowedAcademies: [],
          temporaryAccess: {
            expiresAt: "2024-02-01T00:00:00Z",
            reason: "Acceso temporal para cierre de mes",
          },
          loginAttempts: 3,
          isLocked: true,
          notes: "Cuenta suspendida por múltiples intentos de login",
        },
      ];

      const mockActivityLogs: ActivityLog[] = [
        {
          id: "log_1",
          adminId: "admin_1",
          adminEmail: "soporte@opositia.com",
          action: "user.view",
          resource: "user",
          resourceId: "user_123",
          details: { section: "user_list" },
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0...",
          timestamp: "2024-01-16T14:30:00Z",
          status: "success",
        },
        {
          id: "log_2",
          adminId: "admin_2",
          adminEmail: "contenido@opositia.com",
          action: "assistant.edit",
          resource: "assistant",
          resourceId: "guardia-civil",
          details: { field: "pricing", oldValue: 1800, newValue: 1900 },
          ipAddress: "192.168.1.101",
          userAgent: "Mozilla/5.0...",
          timestamp: "2024-01-16T10:15:00Z",
          status: "success",
        },
        {
          id: "log_3",
          adminId: "admin_3",
          adminEmail: "facturacion@opositia.com",
          action: "login.attempt",
          resource: "auth",
          resourceId: "admin_3",
          details: { reason: "invalid_password" },
          ipAddress: "192.168.1.102",
          userAgent: "Mozilla/5.0...",
          timestamp: "2024-01-15T16:45:00Z",
          status: "failed",
        },
      ];

      setPermissions(mockPermissions);
      setRoles(mockRoles);
      setSubAdmins(mockSubAdmins);
      setActivityLogs(mockActivityLogs);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de administradores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSubAdmin = async () => {
    try {
      const selectedRoleData = roles.find((r) => r.id === adminForm.roleId);
      if (!selectedRoleData) {
        toast({
          title: "Error",
          description: "Debe seleccionar un rol válido",
          variant: "destructive",
        });
        return;
      }

      const newAdmin: SubAdmin = {
        id: `admin_${Date.now()}`,
        email: adminForm.email,
        name: adminForm.name,
        roleId: adminForm.roleId,
        roleName: selectedRoleData.name,
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: "admin@opositia.com", // Obtener del contexto actual
        permissions: selectedRoleData.permissions,
        restrictedSections: [],
        allowedAssistants: adminForm.allowedAssistants,
        allowedAcademies: adminForm.allowedAcademies,
        temporaryAccess: adminForm.temporaryAccess ? {
          expiresAt: adminForm.expiresAt,
          reason: adminForm.accessReason,
        } : undefined,
        loginAttempts: 0,
        isLocked: false,
        notes: adminForm.notes,
      };

      setSubAdmins([newAdmin, ...subAdmins]);
      setShowCreateAdminDialog(false);
      
      // Reset form
      setAdminForm({
        email: "",
        name: "",
        roleId: "",
        allowedAssistants: [],
        allowedAcademies: [],
        temporaryAccess: false,
        expiresAt: "",
        accessReason: "",
        notes: "",
      });

      toast({
        title: "Subadministrador creado",
        description: `Se ha creado el subadministrador ${newAdmin.name}`,
      });
    } catch (error) {
      console.error("Error creating sub-admin:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el subadministrador",
        variant: "destructive",
      });
    }
  };

  const createRole = async () => {
    try {
      const newRole: AdminRole = {
        id: `role_${Date.now()}`,
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRoles([...roles, newRole]);
      setShowCreateRoleDialog(false);
      
      // Reset form
      setRoleForm({
        name: "",
        description: "",
        permissions: [],
      });

      toast({
        title: "Rol creado",
        description: `Se ha creado el rol ${newRole.name}`,
      });
    } catch (error) {
      console.error("Error creating role:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el rol",
        variant: "destructive",
      });
    }
  };

  const toggleAdminStatus = async (adminId: string) => {
    try {
      setSubAdmins(
        subAdmins.map((admin) =>
          admin.id === adminId
            ? { ...admin, isActive: !admin.isActive, isLocked: admin.isActive ? true : false }
            : admin
        )
      );

      const admin = subAdmins.find((a) => a.id === adminId);
      toast({
        title: "Estado actualizado",
        description: `${admin?.name} ha sido ${admin?.isActive ? "desactivado" : "activado"}`,
      });
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const unlockAdmin = async (adminId: string) => {
    try {
      setSubAdmins(
        subAdmins.map((admin) =>
          admin.id === adminId
            ? { ...admin, isLocked: false, loginAttempts: 0 }
            : admin
        )
      );

      const admin = subAdmins.find((a) => a.id === adminId);
      toast({
        title: "Cuenta desbloqueada",
        description: `La cuenta de ${admin?.name} ha sido desbloqueada`,
      });
    } catch (error) {
      console.error("Error unlocking admin:", error);
      toast({
        title: "Error",
        description: "No se pudo desbloquear la cuenta",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (admin: SubAdmin) => {
    if (admin.isLocked) {
      return <Badge className="bg-red-600 text-white">Bloqueado</Badge>;
    }
    if (!admin.isActive) {
      return <Badge className="bg-orange-600 text-white">Inactivo</Badge>;
    }
    if (admin.temporaryAccess) {
      return <Badge className="bg-yellow-600 text-white">Temporal</Badge>;
    }
    return <Badge className="bg-green-600 text-white">Activo</Badge>;
  };

  const getPermissionBadge = (level: Permission["level"]) => {
    const colors = {
      read: "bg-blue-600",
      write: "bg-orange-600",
      admin: "bg-red-600",
    };
    return <Badge className={`${colors[level]} text-white text-xs`}>{level.toUpperCase()}</Badge>;
  };

  const getCategoryIcon = (category: Permission["category"]) => {
    const icons = {
      users: Users,
      payments: CreditCard,
      assistants: Bot,
      academies: Building,
      system: Settings,
      content: FileText,
    };
    const Icon = icons[category];
    return <Icon className="w-4 h-4" />;
  };

  const filteredAdmins = subAdmins.filter((admin) => {
    const matchesSearch =
      searchTerm === "" ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || admin.roleId === filterRole;
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && admin.isActive && !admin.isLocked) ||
      (filterStatus === "inactive" && !admin.isActive) ||
      (filterStatus === "locked" && admin.isLocked);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              Gestión de Subadministradores
            </h1>
            <p className="text-slate-400 mt-1">
              Control granular de permisos y accesos administrativos
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadAdminData}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={() => setShowCreateRoleDialog(true)}
              className="bg-indigo-500 hover:bg-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Rol
            </Button>
            <Button
              onClick={() => setShowCreateAdminDialog(true)}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Admin
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="admins">
              <Users className="w-4 h-4 mr-2" />
              Subadministradores
            </TabsTrigger>
            <TabsTrigger value="roles">
              <Crown className="w-4 h-4 mr-2" />
              Roles y Permisos
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Key className="w-4 h-4 mr-2" />
              Configurar Permisos
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4 mr-2" />
              Logs de Actividad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admins" className="space-y-4">
            {/* Filtros */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar administradores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Filtrar por rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                      <SelectItem value="locked">Bloqueados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Subadministradores */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Administrador</TableHead>
                      <TableHead className="text-white">Rol</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Último Acceso</TableHead>
                      <TableHead className="text-white">Acceso Restringido</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map((admin) => (
                      <TableRow key={admin.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white">
                            <div className="font-semibold">{admin.name}</div>
                            <div className="text-sm text-slate-400">{admin.email}</div>
                            {admin.notes && (
                              <div className="text-xs text-slate-500 mt-1">{admin.notes}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-indigo-600 text-white">{admin.roleName}</Badge>
                          {admin.permissions.length > 0 && (
                            <div className="text-xs text-slate-400 mt-1">
                              {admin.permissions.length} permisos
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(admin)}
                            {admin.loginAttempts > 0 && (
                              <div className="text-xs text-red-400">
                                {admin.loginAttempts} intentos fallidos
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {admin.lastLogin
                            ? new Date(admin.lastLogin).toLocaleDateString()
                            : "Nunca"}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {admin.allowedAssistants.length > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs">
                                {admin.allowedAssistants.length} asistentes
                              </Badge>
                            )}
                            {admin.allowedAcademies.length > 0 && (
                              <Badge className="bg-green-600 text-white text-xs">
                                {admin.allowedAcademies.length} academias
                              </Badge>
                            )}
                            {admin.temporaryAccess && (
                              <Badge className="bg-yellow-600 text-white text-xs">
                                Hasta {new Date(admin.temporaryAccess.expiresAt).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setShowEditAdminDialog(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {admin.isLocked && (
                              <Button
                                onClick={() => unlockAdmin(admin.id)}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Unlock className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() => toggleAdminStatus(admin.id)}
                              size="sm"
                              className={admin.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                            >
                              {admin.isActive ? <Lock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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

          <TabsContent value="roles" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Roles Disponibles</CardTitle>
                <CardDescription className="text-slate-400">
                  Gestiona los roles predefinidos y sus permisos asociados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">{role.name}</h3>
                          {role.isSystem && (
                            <Badge className="bg-blue-600 text-white text-xs">Sistema</Badge>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">{role.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedRole(role);
                            setShowPermissionsDialog(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-white hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!role.isSystem && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-white hover:bg-slate-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permissionId) => {
                        const permission = permissions.find((p) => p.id === permissionId);
                        return permission ? (
                          <div key={permissionId} className="flex items-center gap-1">
                            {getCategoryIcon(permission.category)}
                            <span className="text-white text-sm">{permission.name}</span>
                            {getPermissionBadge(permission.level)}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Permisos del Sistema</CardTitle>
                <CardDescription className="text-slate-400">
                  Configuración granular de permisos disponibles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category as Permission["category"])}
                      <h3 className="text-white font-semibold capitalize">{category}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="p-3 bg-slate-700 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white font-medium">{permission.name}</h4>
                              <p className="text-slate-400 text-sm">{permission.description}</p>
                            </div>
                            {getPermissionBadge(permission.level)}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">{permission.id}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Registro de Actividad</CardTitle>
                <CardDescription className="text-slate-400">
                  Historial de acciones realizadas por los subadministradores
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Administrador</TableHead>
                      <TableHead className="text-white">Acción</TableHead>
                      <TableHead className="text-white">Recurso</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">IP</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700">
                        <TableCell className="text-white">{log.adminEmail}</TableCell>
                        <TableCell>
                          <code className="bg-slate-700 px-2 py-1 rounded text-sm text-white">
                            {log.action}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">
                            <div>{log.resource}</div>
                            <div className="text-sm text-slate-400 font-mono">{log.resourceId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={log.status === "success" ? "bg-green-600" : "bg-red-600"}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 font-mono text-sm">
                          {log.ipAddress}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para crear subadministrador */}
        <Dialog open={showCreateAdminDialog} onOpenChange={setShowCreateAdminDialog}>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nuevo Subadministrador</DialogTitle>
              <DialogDescription className="text-slate-400">
                Asigna un rol y configura los permisos específicos
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email *</Label>
                  <Input
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="admin@opositia.com"
                  />
                </div>
                <div>
                  <Label className="text-white">Nombre *</Label>
                  <Input
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Nombre completo"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Rol *</Label>
                <Select
                  value={adminForm.roleId}
                  onValueChange={(value) => setAdminForm({ ...adminForm, roleId: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Asistentes Permitidos (opcional)</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (!adminForm.allowedAssistants.includes(value)) {
                        setAdminForm({
                          ...adminForm,
                          allowedAssistants: [...adminForm.allowedAssistants, value],
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Añadir asistente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guardia-civil">Guardia Civil</SelectItem>
                      <SelectItem value="mir">MIR</SelectItem>
                      <SelectItem value="policia-nacional">Policía Nacional</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {adminForm.allowedAssistants.map((assistant) => (
                      <Badge
                        key={assistant}
                        className="bg-blue-600 text-white cursor-pointer"
                        onClick={() => {
                          setAdminForm({
                            ...adminForm,
                            allowedAssistants: adminForm.allowedAssistants.filter(
                              (a) => a !== assistant
                            ),
                          });
                        }}
                      >
                        {assistant} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-white">Academias Permitidas (opcional)</Label>
                  <Input
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="IDs de academias separados por comas"
                    onChange={(e) => {
                      setAdminForm({
                        ...adminForm,
                        allowedAcademies: e.target.value.split(",").map((id) => id.trim()).filter(Boolean),
                      });
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={adminForm.temporaryAccess}
                    onCheckedChange={(checked) =>
                      setAdminForm({ ...adminForm, temporaryAccess: checked as boolean })
                    }
                  />
                  <Label className="text-white">Acceso temporal</Label>
                </div>
                
                {adminForm.temporaryAccess && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Fecha de expiración</Label>
                      <Input
                        type="datetime-local"
                        value={adminForm.expiresAt}
                        onChange={(e) => setAdminForm({ ...adminForm, expiresAt: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Motivo del acceso temporal</Label>
                      <Input
                        value={adminForm.accessReason}
                        onChange={(e) => setAdminForm({ ...adminForm, accessReason: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Razón del acceso temporal"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-white">Notas</Label>
                <Textarea
                  value={adminForm.notes}
                  onChange={(e) => setAdminForm({ ...adminForm, notes: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Información adicional sobre este administrador..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setShowCreateAdminDialog(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={createSubAdmin}
                className="bg-purple-500 hover:bg-purple-600"
                disabled={!adminForm.email || !adminForm.name || !adminForm.roleId}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Crear Subadministrador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para crear rol */}
        <Dialog open={showCreateRoleDialog} onOpenChange={setShowCreateRoleDialog}>
          <DialogContent className="max-w-3xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nuevo Rol</DialogTitle>
              <DialogDescription className="text-slate-400">
                Define un nuevo rol con permisos específicos
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Nombre del Rol *</Label>
                  <Input
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Gestor de..."
                  />
                </div>
                <div>
                  <Label className="text-white">Descripción *</Label>
                  <Input
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Descripción del rol"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Permisos</Label>
                <div className="max-h-96 overflow-y-auto space-y-4 border border-slate-600 rounded-lg p-4">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category as Permission["category"])}
                        <h4 className="text-white font-semibold capitalize">{category}</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-2 ml-6">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={roleForm.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setRoleForm({
                                    ...roleForm,
                                    permissions: [...roleForm.permissions, permission.id],
                                  });
                                } else {
                                  setRoleForm({
                                    ...roleForm,
                                    permissions: roleForm.permissions.filter((p) => p !== permission.id),
                                  });
                                }
                              }}
                            />
                            <div className="flex-1">
                              <span className="text-white">{permission.name}</span>
                              <p className="text-slate-400 text-sm">{permission.description}</p>
                            </div>
                            {getPermissionBadge(permission.level)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setShowCreateRoleDialog(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={createRole}
                className="bg-indigo-500 hover:bg-indigo-600"
                disabled={!roleForm.name || !roleForm.description}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Rol
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para ver permisos de rol */}
        <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Permisos del Rol: {selectedRole?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedRole?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedRole && (
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                  const rolePermissions = categoryPermissions.filter((p) =>
                    selectedRole.permissions.includes(p.id)
                  );
                  
                  if (rolePermissions.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category as Permission["category"])}
                        <h4 className="text-white font-semibold capitalize">{category}</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-2 ml-6">
                        {rolePermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                            <div>
                              <span className="text-white">{permission.name}</span>
                              <p className="text-slate-400 text-sm">{permission.description}</p>
                            </div>
                            {getPermissionBadge(permission.level)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
