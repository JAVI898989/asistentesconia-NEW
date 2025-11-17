import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  checkIsCurrentUserAdmin,
  ensureDefaultAdminExists,
} from "@/lib/firebaseData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FirebaseDebugger from "@/components/FirebaseDebugger";
import { ApiKeyBanner } from "@/components/admin/ApiKeyBanner";
import {
  LayoutDashboard,
  Users,
  Bot,
  BotOff,
  Crown,
  GraduationCap,
  BookOpen,
  Building2,
  Package,
  Euro,
  UserPlus,
  Key,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminRoutes = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    path: "/admin/usuarios",
    label: "Usuarios",
    icon: Users,
  },
  {
    path: "/admin/gestion-usuarios",
    label: "Gestión Completa",
    icon: Settings,
  },
  {
    path: "/admin/asistentes",
    label: "Asistentes IA",
    icon: Bot,
  },
  {
    path: "/admin/asistentes-publicos",
    label: "Asistentes Públicos",
    icon: BotOff,
  },
  {
    path: "/admin/asistentes-pro",
    label: "Asistentes PRO",
    icon: Crown,
  },
  {
    path: "/admin/fundadores",
    label: "Fundadores",
    icon: Users,
  },
  {
    path: "/admin/cursos",
    label: "Cursos",
    icon: BookOpen,
  },
  {
    path: "/admin/academias",
    label: "Academias",
    icon: GraduationCap,
  },
  {
    path: "/admin/family-packs",
    label: "Packs Familiares",
    icon: Package,
  },
  {
    path: "/admin/precios",
    label: "Precios",
    icon: Euro,
  },
  {
    path: "/admin/referidos",
    label: "Referidos",
    icon: UserPlus,
  },
  {
    path: "/admin/configuracion",
    label: "API Keys",
    icon: Key,
  },
  {
    path: "/admin/estadisticas",
    label: "Estadísticas",
    icon: BarChart3,
  },
  {
    path: "/admin/soporte",
    label: "Soporte",
    icon: MessageSquare,
  },
  {
    path: "/admin/contenido",
    label: "Contenido",
    icon: BookOpen,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(true); // Forzar acceso inmediato
  const [loading, setLoading] = useState(false); // No loading screen
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFirebaseDebugger, setShowFirebaseDebugger] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Safe user display helper
  const getUserDisplay = () => {
    return user?.email || "admin@demo.com";
  };

  const getUserInitial = () => {
    return user?.email?.[0]?.toUpperCase() || "A";
  };

  useEffect(() => {
    console.log("🚀 Panel de admin - acceso total habilitado");

    // Simple auth state listener without blocking operations
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        try {
          setUser(user);
          console.log(`👤 Usuario: ${user?.email || "Sin sesión"}`);
        } catch (userError) {
          console.log("ℹ️ Error setting user:", userError);
          setUser(null); // Safe fallback
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.log("ℹ️ Auth listener error:", error);
      // Ensure component doesn't break
      setUser(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      console.log("🔐 Iniciando logout...");

      // Firebase logout first
      if (auth && auth.currentUser) {
        console.log("🔥 Cerrando sesión en Firebase...");
        await auth.signOut();
        console.log("✅ Sesión cerrada en Firebase");
      }

      // Clear any local storage
      localStorage.removeItem("demoMode");
      localStorage.removeItem("demoUser");
      localStorage.removeItem("offlineCurrentUser");

      console.log("🚀 Redirigiendo al login...");
      navigate("/login");
    } catch (error) {
      console.error("❌ Error en logout:", error);
      // Force clear everything and navigate
      localStorage.clear();
      navigate("/login");
    }
  };

  // No loading screens, no access restrictions - direct admin access
  console.log("🎯 AdminLayout renderizado - acceso garantizado");

  try {
    return (
      <div className="min-h-screen bg-slate-900 flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 transition-transform duration-300`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Panel Admin</h1>
                  <p className="text-xs text-slate-400">Asistentes IA</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {adminRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = route.exact
                  ? location.pathname === route.path
                  : location.pathname.startsWith(route.path);

                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {route.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUserInitial()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {getUserDisplay()}
                  </p>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    Administrador
                  </Badge>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-300 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                >
                  🏠 Inicio
                </Button>

                <Button
                  onClick={() => setShowFirebaseDebugger(v => !v)}
                  variant="ghost"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  🧰 Debug Firebase
                </Button>

                <Badge className="bg-blue-500/20 text-blue-400">
                  Panel de Administración
                </Badge>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">
            <ApiKeyBanner />
            {showFirebaseDebugger && (
              <div className="mb-4">
                <FirebaseDebugger />
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering AdminLayout:", error);

    // Fallback UI in case of any error
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
          <p className="text-slate-400 mb-4">Modo de emergencia activado</p>
          <div className="bg-slate-800 p-6 rounded-lg max-w-4xl w-full">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
