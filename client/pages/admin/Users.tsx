import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Shield,
  Key,
  CheckCircle,
  XCircle,
  Calendar,
  Crown,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  lastLogin: string;
  status: "active" | "inactive";
  subscriptions: string[];
  totalSpent: number;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Simulated data - replace with real Firebase calls
      const mockUsers: User[] = [
        {
          id: "user_1",
          email: "admin@admin.com",
          role: "admin",
          createdAt: "2024-12-01",
          lastLogin: "2025-01-08",
          status: "active",
          subscriptions: ["all"],
          totalSpent: 0,
        },
        {
          id: "user_2",
          email: "javier@example.com",
          role: "admin",
          createdAt: "2024-12-15",
          lastLogin: "2025-01-08",
          status: "active",
          subscriptions: ["all"],
          totalSpent: 0,
        },
        {
          id: "user_3",
          email: "usuario1@email.com",
          role: "user",
          createdAt: "2025-01-01",
          lastLogin: "2025-01-07",
          status: "active",
          subscriptions: ["auxiliar-administrativo-estado", "guardia-civil"],
          totalSpent: 38,
        },
        {
          id: "user_4",
          email: "usuario2@email.com",
          role: "user",
          createdAt: "2025-01-02",
          lastLogin: "2025-01-06",
          status: "active",
          subscriptions: ["mir"],
          totalSpent: 220,
        },
        {
          id: "user_5",
          email: "inactivo@email.com",
          role: "user",
          createdAt: "2024-11-15",
          lastLogin: "2024-12-20",
          status: "inactive",
          subscriptions: [],
          totalSpent: 0,
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleUpdateUserRole = async (
    userId: string,
    newRole: "user" | "admin",
  ) => {
    try {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );
      // TODO: Update in Firebase
      console.log(`Updated user ${userId} role to ${newRole}`);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        setUsers(users.filter((user) => user.id !== userId));
        // TODO: Delete from Firebase
        console.log(`Deleted user ${userId}`);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      // TODO: Send password reset email
      alert(`Email de restablecimiento enviado a ${email}`);
    } catch (error) {
      console.error("Error sending password reset:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const getUserStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-500/20 text-green-400">Activo</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400">Inactivo</Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return role === "admin" ? (
      <Badge className="bg-purple-500/20 text-purple-400">
        <Crown className="w-3 h-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge className="bg-blue-500/20 text-blue-400">Usuario</Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-4"></div>
            <div className="h-96 bg-slate-700 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-slate-400">
              Administrar usuarios, roles y permisos
            </p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400">
            {users.length} usuarios registrados
          </Badge>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              Lista de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Rol</TableHead>
                  <TableHead className="text-slate-300">Estado</TableHead>
                  <TableHead className="text-slate-300">Registrado</TableHead>
                  <TableHead className="text-slate-300">
                    Último Acceso
                  </TableHead>
                  <TableHead className="text-slate-300">
                    Suscripciones
                  </TableHead>
                  <TableHead className="text-slate-300">
                    Total Gastado
                  </TableHead>
                  <TableHead className="text-slate-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">
                      {user.email}
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-slate-300">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {formatDate(user.lastLogin)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-700 text-slate-300">
                        {user.subscriptions.length === 0
                          ? "Ninguna"
                          : user.subscriptions.includes("all")
                            ? "Todas (Admin)"
                            : `${user.subscriptions.length} asistente(s)`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {formatCurrency(user.totalSpent)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(user.email)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Key className="w-3 h-3" />
                        </Button>
                        {user.role !== "admin" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="border-red-600 text-red-400 hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Usuario</DialogTitle>
              <DialogDescription className="text-slate-400">
                Modificar rol y permisos del usuario
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Email</Label>
                  <Input
                    value={selectedUser.email}
                    disabled
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Rol</Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value: "user" | "admin") =>
                      setSelectedUser({ ...selectedUser, role: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">
                    Suscripciones Activas
                  </Label>
                  <div className="mt-2">
                    {selectedUser.subscriptions.length === 0 ? (
                      <Badge className="bg-slate-700 text-slate-400">
                        Sin suscripciones
                      </Badge>
                    ) : selectedUser.subscriptions.includes("all") ? (
                      <Badge className="bg-purple-500/20 text-purple-400">
                        Acceso completo (Admin)
                      </Badge>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.subscriptions.map((sub) => (
                          <Badge
                            key={sub}
                            className="bg-blue-500/20 text-blue-400"
                          >
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-slate-600 text-slate-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedUser) {
                    handleUpdateUserRole(selectedUser.id, selectedUser.role);
                    setEditDialogOpen(false);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
