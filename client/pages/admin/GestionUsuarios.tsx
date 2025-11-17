import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  UserManagement,
  PaymentRecord,
  getAllUsers,
  updateUserManagement,
  createUserManagement,
  createPaymentRecord,
  sendPaymentEmailNotification,
  toggleDemoMode,
  checkIsAdmin,
} from "@/lib/firebaseData";
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
  Users,
  Plus,
  Edit3,
  Trash2,
  Eye,
  CreditCard,
  Mail,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Settings,
  UserPlus,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  Crown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GestionUsuarios() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null);
  const [activeTab, setActiveTab] = useState("users");
  const { toast } = useToast();

  // Form state for creating/editing user
  const [userForm, setUserForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "student" as UserManagement["role"],
    permissions: [] as string[],
    academiaIds: [] as string[],
    assistantIds: [] as string[],
    courseIds: [] as string[],
    isDemoMode: false,
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    description: "",
    dueDate: "",
  });

  // Simplified initialization - always allow admin access
  useEffect(() => {
    console.log("🚀 Inicializando página de Gestión de Usuarios");
    setIsAdmin(true);
    setLoading(false);

    // Load users immediately
    loadUsers();

    // Simple auth listener without blocking
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(`👤 Usuario en Gestión: ${user?.email || "Sin sesión"}`);
    });

    return () => unsubscribe();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);

      const isDemoMode = allUsers.some((u) => u.id.includes("demo"));
      toast({
        title: isDemoMode
          ? "🔄 Modo Demo - Usuarios cargados"
          : "Usuarios cargados",
        description: `${allUsers.length} usuarios encontrados`,
      });
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First create user in Firebase Auth if password is provided
      let authUserId = null;
      if (userForm.password) {
        try {
          const { registerUser } = await import("@/lib/firebase");
          const authResult = await registerUser(
            userForm.email,
            userForm.password,
          );
          authUserId = authResult.user.uid;
          console.log(
            `✅ Usuario creado en Firebase Auth con UID: ${authUserId}`,
          );
        } catch (authError: any) {
          console.error("Error creating auth user:", authError);
          toast({
            title: "❌ Error en autenticación",
            description: `No se pudo crear la cuenta: ${authError.message}`,
            variant: "destructive",
          });
          return;
        }
      }

      const userData: Omit<UserManagement, "id" | "createdAt" | "updatedAt"> = {
        email: userForm.email,
        name: userForm.name,
        role: userForm.role,
        permissions: userForm.permissions,
        academiaIds: userForm.academiaIds,
        assistantIds: userForm.assistantIds,
        courseIds: userForm.courseIds,
        isDemoMode: userForm.isDemoMode,
        subscriptionStatus: userForm.isDemoMode ? "demo" : "active",
        lastActivity: new Date().toISOString(),
      };

      const newUserId = await createUserManagement(
        userData,
        authUserId || undefined,
      );

      toast({
        title: "✅ Usuario creado",
        description: `${userForm.email} ha sido creado exitosamente`,
      });

      await loadUsers();
      setShowCreateDialog(false);
      resetForm();

      console.log(`✅ Usuario creado con ID: ${newUserId}`);
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateUserManagement(selectedUser.id, {
        ...userForm,
        subscriptionStatus: userForm.isDemoMode
          ? "demo"
          : selectedUser.subscriptionStatus,
      });

      toast({
        title: "✅ Usuario actualizado",
        description: `${userForm.email} ha sido actualizado`,
      });

      await loadUsers();
      setShowEditDialog(false);
      resetForm();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleToggleDemoMode = async (
    userId: string,
    currentDemoMode: boolean,
  ) => {
    try {
      await updateUserManagement(userId, {
        isDemoMode: !currentDemoMode,
        subscriptionStatus: !currentDemoMode ? "demo" : "active",
      });

      toast({
        title: `${!currentDemoMode ? "🔄 Modo demo activado" : "💳 Modo de pago activado"}`,
        description: `Usuario cambiado a ${!currentDemoMode ? "modo demo" : "modo de pago"}`,
      });

      await loadUsers();
    } catch (error: any) {
      console.error("Error toggling demo mode:", error);
      toast({
        title: "❌ Error",
        description: "No se pudo cambiar el modo",
        variant: "destructive",
      });
    }
  };

  const handleSendPaymentEmail = async (userEmail: string, amount: number) => {
    try {
      const paymentLink = `${window.location.origin}/payment?user=${encodeURIComponent(userEmail)}&amount=${amount}`;

      await sendPaymentEmailNotification(
        userEmail,
        "Gestión de Usuario",
        amount,
        paymentForm.dueDate,
        paymentLink,
      );

      // Create payment record
      await createPaymentRecord({
        academiaId: "", // For user payments
        amount: amount,
        currency: "EUR",
        status: "pending",
        dueDate: paymentForm.dueDate,
        description: paymentForm.description || "Pago de servicios",
        metadata: {
          students: 0,
          duration: 0,
          pricePerStudent: amount,
        },
      });

      toast({
        title: "📧 Email enviado",
        description: `Email de pago enviado a ${userEmail}`,
      });

      setShowPaymentDialog(false);
    } catch (error: any) {
      console.error("Error sending payment email:", error);
      toast({
        title: "❌ Error",
        description: "No se pudo enviar el email de pago",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setUserForm({
      email: "",
      name: "",
      password: "",
      role: "student",
      permissions: [],
      academiaIds: [],
      assistantIds: [],
      courseIds: [],
      isDemoMode: false,
    });
    setSelectedUser(null);
  };

  const openEditDialog = (user: UserManagement) => {
    setSelectedUser(user);
    setUserForm({
      email: user.email,
      name: user.name || "",
      password: "", // Dejar vacío para edición
      role: user.role,
      permissions: user.permissions,
      academiaIds: user.academiaIds,
      assistantIds: user.assistantIds,
      courseIds: user.courseIds,
      isDemoMode: user.isDemoMode,
    });
    setShowEditDialog(true);
  };

  const getRoleIcon = (role: UserManagement["role"]) => {
    switch (role) {
      case "super_admin":
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-400" />;
      case "academia_admin":
        return <Settings className="w-4 h-4 text-purple-400" />;
      case "teacher":
        return <Users className="w-4 h-4 text-green-400" />;
      case "student":
        return <UserPlus className="w-4 h-4 text-gray-400" />;
      default:
        return <UserPlus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleName = (role: UserManagement["role"]) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Administrador";
      case "academia_admin":
        return "Admin Academia";
      case "teacher":
        return "Profesor";
      case "student":
        return "Estudiante";
      default:
        return role;
    }
  };

  // No loading screen - immediate access

  // Admin access always allowed - no restrictions
  console.log("🎯 Página de Gestión de Usuarios - acceso garantizado");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Demo Mode Banner */}
        {users?.some((u) => u.id.includes("demo")) && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-yellow-200 font-semibold">
                  🔄 Modo Demo Activado
                </h3>
                <p className="text-yellow-200/80 text-sm">
                  Hay problemas de conectividad con Firebase. Se muestran datos
                  de ejemplo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              Gestión de Usuarios
            </h1>
            <p className="text-slate-400 mt-1">
              Administra usuarios, permisos, academias y facturación
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={loadUsers}
              disabled={loadingUsers}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loadingUsers ? "animate-spin" : ""}`}
              />
              {loadingUsers ? "Cargando..." : "Actualizar"}
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-slate-400 text-sm">Total Usuarios</p>
                  <p className="text-white text-2xl font-bold">
                    {users?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-slate-400 text-sm">Activos</p>
                  <p className="text-white text-2xl font-bold">
                    {
                      users?.filter((u) => u.subscriptionStatus === "active")
                        ?.length || 0
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ToggleLeft className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-slate-400 text-sm">Modo Demo</p>
                  <p className="text-white text-2xl font-bold">
                    {users?.filter((u) => u.isDemoMode)?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-slate-400 text-sm">Administradores</p>
                  <p className="text-white text-2xl font-bold">
                    {users?.filter((u) => u.role.includes("admin"))?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="users" className="text-slate-300">
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="permissions" className="text-slate-300">
              Permisos
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-slate-300">
              Facturación
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Usuario</TableHead>
                      <TableHead className="text-slate-300">Rol</TableHead>
                      <TableHead className="text-slate-300">
                        Academias
                      </TableHead>
                      <TableHead className="text-slate-300">Estado</TableHead>
                      <TableHead className="text-slate-300">Modo</TableHead>
                      <TableHead className="text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(users || []).map((user) => (
                      <TableRow key={user.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {user.name || user.email}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span className="text-white">
                              {getRoleName(user.role)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">
                            {user.academiaIds?.length || 0} academias
                          </div>
                          <div className="text-slate-400 text-sm">
                            {user.assistantIds?.length || 0} asistentes
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.subscriptionStatus === "active"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : user.subscriptionStatus === "demo"
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                            }
                          >
                            {user.subscriptionStatus === "active"
                              ? "Activo"
                              : user.subscriptionStatus === "demo"
                                ? "Demo"
                                : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleDemoMode(user.id, user.isDemoMode)
                            }
                            className="text-slate-300 hover:bg-slate-700"
                          >
                            {user.isDemoMode ? (
                              <ToggleRight className="w-5 h-5 text-yellow-400" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-600 text-green-300 hover:bg-green-600/20"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPaymentDialog(true);
                              }}
                            >
                              <CreditCard className="w-4 h-4" />
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

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Gestión de Permisos
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configura permisos y accesos por rol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-white">
                  <p>Sistema de permisos en desarrollo...</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Próximamente: gestión granular de permisos por usuario y rol
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Gestión de Facturación
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Envía emails de pago y gestiona facturación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-white">
                  <p>Sistema de facturación automática en desarrollo...</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Próximamente: facturación automática, recordatorios de pago
                    y reporting
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create User Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                Crear Nuevo Usuario
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Configura un nuevo usuario en el sistema
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Email *</Label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Nombre</Label>
                  <Input
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm({ ...userForm, name: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Contraseña *</Label>
                <Input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Rol *</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value: UserManagement["role"]) =>
                      setUserForm({ ...userForm, role: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="academia_admin">
                        Admin Academia
                      </SelectItem>
                      <SelectItem value="teacher">Profesor</SelectItem>
                      <SelectItem value="student">Estudiante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="isDemoMode"
                    checked={userForm.isDemoMode}
                    onChange={(e) =>
                      setUserForm({ ...userForm, isDemoMode: e.target.checked })
                    }
                    className="rounded border-slate-600"
                  />
                  <Label htmlFor="isDemoMode" className="text-slate-200">
                    🔄 Modo Demo (sin pagos)
                  </Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Crear Usuario
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Usuario</DialogTitle>
              <DialogDescription className="text-slate-400">
                Modifica la información del usuario
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Email *</Label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Nombre</Label>
                  <Input
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm({ ...userForm, name: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Nueva Contraseña</Label>
                <Input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Dejar vacío para mantener la actual"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Rol *</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value: UserManagement["role"]) =>
                      setUserForm({ ...userForm, role: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="academia_admin">
                        Admin Academia
                      </SelectItem>
                      <SelectItem value="teacher">Profesor</SelectItem>
                      <SelectItem value="student">Estudiante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="editDemoMode"
                    checked={userForm.isDemoMode}
                    onChange={(e) =>
                      setUserForm({ ...userForm, isDemoMode: e.target.checked })
                    }
                    className="rounded border-slate-600"
                  />
                  <Label htmlFor="editDemoMode" className="text-slate-200">
                    🔄 Modo Demo (sin pagos)
                  </Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Actualizar Usuario
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    resetForm();
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Enviar Email de Pago
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Envía un email con enlace de pago Stripe a {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-200">Importe (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-slate-200">Descripción</Label>
                <Textarea
                  value={paymentForm.description}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      description: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Concepto del pago..."
                />
              </div>

              <div>
                <Label className="text-slate-200">Fecha de vencimiento *</Label>
                <Input
                  type="date"
                  value={paymentForm.dueDate}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, dueDate: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    selectedUser &&
                    handleSendPaymentEmail(
                      selectedUser.email,
                      paymentForm.amount,
                    )
                  }
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={!paymentForm.amount || !paymentForm.dueDate}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Email de Pago
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
