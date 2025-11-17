import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserAcademias,
  checkIsAdmin,
  createUserManagement,
  getAllUsers,
} from "@/lib/firebaseData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";

export default function TestRoles() {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string>("Verificando...");
  const [academias, setAcademias] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await checkUserType(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkUserType = async (user: User) => {
    try {
      console.log(`🔍 Verificando tipo de usuario para: ${user.email}`);

      // Check if super admin
      const isAdmin = await checkIsAdmin(user.uid);
      if (
        isAdmin ||
        user.email === "admin@admin.com" ||
        user.email?.includes("admin")
      ) {
        setUserType("👑 Super Administrador");
        return;
      }

      // Check if academia admin
      const userAcademias = await getUserAcademias(user.uid);
      if (userAcademias.length > 0) {
        setUserType("🏫 Administrador de Academia");
        setAcademias(userAcademias);
        return;
      }

      setUserType("👤 Usuario Normal");
    } catch (error) {
      console.error("Error checking user type:", error);
      setUserType(`❌ Error: ${error}`);
    }
  };

  const loadAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const createTestAcademiaAdmin = async () => {
    if (!testEmail) return;

    try {
      await createUserManagement({
        email: testEmail,
        name: "Admin Academia Test",
        role: "academia_admin",
        permissions: ["manage_students", "view_reports"],
        academiaIds: ["demo-academia-1"],
        assistantIds: ["guardia-civil"],
        courseIds: [],
        subscriptionStatus: "active",
        isDemoMode: false,
        lastActivity: new Date().toISOString(),
      });

      alert(`Usuario administrador de academia creado: ${testEmail}`);
      setTestEmail("");
    } catch (error) {
      console.error("Error creating test user:", error);
      alert("Error al crear usuario de prueba");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          🧪 Prueba de Roles y Redirección
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Información del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-3">
                <div>
                  <Label className="text-slate-400">Email:</Label>
                  <p>{user?.email || "No logueado"}</p>
                </div>
                <div>
                  <Label className="text-slate-400">UID:</Label>
                  <p className="font-mono text-sm break-all">
                    {user?.uid || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-400">Tipo de Usuario:</Label>
                  <p className="text-lg font-semibold">{userType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academias */}
          {academias.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Academias Asignadas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-2">
                  {academias.map((academia) => (
                    <div
                      key={academia.id}
                      className="p-3 bg-slate-700/50 rounded"
                    >
                      <h3 className="font-semibold">{academia.name}</h3>
                      <p className="text-slate-400 text-sm">
                        Slug: {academia.slug}
                      </p>
                      <Button
                        className="mt-2 bg-blue-500 hover:bg-blue-600"
                        size="sm"
                        onClick={() =>
                          window.open(`/academia/${academia.slug}`, "_blank")
                        }
                      >
                        🏫 Abrir Panel de Academia
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Creation */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Crear Usuario de Prueba
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-200">
                  Email del nuevo admin de academia:
                </Label>
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="admin-academia@test.com"
                />
              </div>
              <Button
                onClick={createTestAcademiaAdmin}
                className="bg-green-500 hover:bg-green-600 w-full"
                disabled={!testEmail}
              >
                🏫 Crear Admin de Academia
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Acciones de Prueba</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => window.open("/redirect", "_blank")}
                className="bg-blue-500 hover:bg-blue-600 w-full"
              >
                🔄 Probar Redirección Inteligente
              </Button>

              <Button
                onClick={() => window.open("/admin", "_blank")}
                className="bg-purple-500 hover:bg-purple-600 w-full"
              >
                👑 Panel de Super Admin
              </Button>

              <Button
                onClick={() =>
                  window.open("/academia/academia-demo-madrid", "_blank")
                }
                className="bg-orange-500 hover:bg-orange-600 w-full"
              >
                🏫 Panel de Academia Demo
              </Button>

              <Button
                onClick={loadAllUsers}
                className="bg-gray-500 hover:bg-gray-600 w-full"
              >
                👥 Cargar Todos los Usuarios
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* All Users */}
        {allUsers.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">
                Todos los Usuarios del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 bg-slate-700/50 rounded text-white"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{user.email}</h3>
                        <p className="text-slate-400 text-sm">
                          Rol: {user.role}
                        </p>
                        <p className="text-slate-400 text-sm">
                          Estado: {user.subscriptionStatus}
                          {user.isDemoMode && " (Demo)"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Academias: {user.academiaIds?.length || 0}
                        </p>
                        <p className="text-sm">
                          Asistentes: {user.assistantIds?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <h3 className="text-yellow-200 font-semibold mb-2">
            🧪 Instrucciones de Prueba:
          </h3>
          <ol className="text-yellow-200/80 text-sm space-y-1">
            <li>
              1. <strong>Super Admin:</strong> Si tu email contiene "admin",
              serás redirigido a /admin
            </li>
            <li>
              2. <strong>Admin Academia:</strong> Si tienes academias asignadas,
              serás redirigido a /academia/[slug]
            </li>
            <li>
              3. <strong>Usuario Normal:</strong> Serás redirigido a la página
              principal /
            </li>
            <li>
              4. Usa "Crear Admin de Academia" para probar el flujo de
              redirección
            </li>
            <li>
              5. Haz logout y login de nuevo para probar la redirección
              automática
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
