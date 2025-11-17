import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  onAuthChange,
  logoutUser,
  getCurrentUser,
} from "@/lib/simpleAuth";
import { useUserData } from "@/hooks/usePersistentSync";
import {
  getUserManagement,
  createOrUpdateUserManagementFromAuth,
} from "@/lib/firebaseData";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Menu, Sun, Moon } from "lucide-react";
import ReferralWidget from "@/components/ReferralWidget";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Use persistent sync hooks
  const { user, userData, isLoading } = useUserData();

  // Derived state with improved role detection
  const getUserRole = () => {
    // First try to get role from userData
    if (userData?.role) {
      return userData.role;
    }

    // Fallback: detect admin by email pattern
    if (user?.email) {
      const email = user.email.toLowerCase();
      if (email.includes("admin") || email === "javier@test.com") {
        return "admin";
      }
    }

    return "user";
  };

  const userRole = getUserRole();
  const loading = isLoading;

  // Debug logging
  console.log("Header - User:", user?.email);
  console.log("Header - UserData:", userData);
  console.log("Header - Calculated Role:", userRole);

  // Inicializar modo oscuro desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (!isMounted) return;

      try {
        // Listen to Firebase auth state changes
        const unsubscribeAuth = onAuthChange(async (user) => {
          if (!isMounted) return;

          if (user) {
            console.log("✅ Usuario autenticado:", user.email);
            console.log("User authenticated via bulletproof auth");
          } else {
            console.log("No user authenticated");
          }
        });

        // Listen to connection state changes
        // Store unsubscribe function for cleanup
        (window as any)._headerAuthUnsubscribe = unsubscribeAuth;

        // Loading state is managed by useUserData hook, no need to set it here
      } catch (error) {
        console.error("Error in auth initialization:", error);
        // Loading state is managed by useUserData hook, no need to set it here
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      // Cleanup Firebase auth listener
      if ((window as any)._headerAuthUnsubscribe) {
        (window as any)._headerAuthUnsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Clear persistent data
      localStorage.removeItem("persistent_auth");
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_subscription_data");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📚</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Asistentes IA
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-foreground/90 hover:text-blue-400 transition-colors font-medium"
              >
                Inicio
              </Link>
              <Link
                to="/asistentes"
                className="text-foreground/90 hover:text-blue-400 transition-colors font-medium"
              >
                Asistentes
              </Link>
              <Link
                to="/asistentes-pro"
                className="text-foreground/90 hover:text-blue-400 transition-colors font-medium"
              >
                Asistentes PRO
              </Link>
              <Link
                to="/academias"
                className="text-foreground/90 hover:text-blue-400 transition-colors font-medium"
              >
                Academias
              </Link>
              <Link
                to="/cursos"
                className="text-foreground/90 hover:text-blue-400 transition-colors font-medium"
              >
                Cursos
              </Link>
              <Link
                to="/como-funciona"
                className="text-foreground/90 hover:text-blue-400 transition-colors font-medium"
              >
                Cómo Funciona
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Referral Widget - only show if user is logged in and has referral code */}
              {user && userData?.referralCode && (
                <ReferralWidget
                  userId={user.uid}
                  userEmail={user.email || ""}
                  userRole={userData.role || 'alumno'}
                  referralCode={userData.referralCode}
                  showInHeader={true}
                />
              )}

              {/* Botón de modo oscuro/claro */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className={`relative h-12 w-12 rounded-full transition-all duration-300 shadow-lg ${
                  isDarkMode
                    ? "bg-gradient-to-br from-yellow-200 to-orange-200 hover:from-yellow-300 hover:to-orange-300 border-2 border-yellow-400 shadow-yellow-200/50"
                    : "bg-gradient-to-br from-slate-200 to-blue-200 hover:from-slate-300 hover:to-blue-300 border-2 border-slate-400 shadow-slate-200/50"
                }`}
                title={
                  isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                }
              >
                {isDarkMode ? (
                  <Sun className="h-6 w-6 text-yellow-700 transition-all duration-300 drop-shadow-sm" />
                ) : (
                  <Moon className="h-6 w-6 text-slate-800 transition-all duration-300 drop-shadow-sm" />
                )}
              </Button>

              {loading ? (
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                          {getUserInitials(user.email || "U")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.email}</p>
                        <div className="flex gap-2 flex-wrap">
                          {userRole && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                              {userRole === "super_admin" && "👑 Super Admin"}
                              {userRole === "admin" && "🔧 Admin"}
                              {userRole === "academia_admin" &&
                                "🏫 Admin Academia"}
                              {userRole === "teacher" && "👨‍🏫 Profesor"}
                              {userRole === "student" && "👨‍🎓 Estudiante"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Role-Based Panel Access */}
                    <div className="border-t border-b my-1 py-1">
                      <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Mi Panel:
                      </p>

                      {/* Super Admin - Access to all panels */}
                      {(userRole === "super_admin" ||
                        userRole === "admin" ||
                        user?.email?.toLowerCase().includes("admin") ||
                        user?.email === "javier@test.com") && (
                        <>
                          <DropdownMenuItem onClick={() => navigate("/admin")}>
                            <span className="mr-2">👑</span>
                            Panel Administrador
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate("/panel-academia/demo")}
                          >
                            <span className="mr-2">🏫</span>
                            Panel Academia
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate("/estudiante")}
                          >
                            <span className="mr-2">👨��🎓</span>
                            Panel Estudiante
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate("/admin/cursos")}
                          >
                            <span className="mr-2">📚</span>
                            Panel Cursos
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate("/temario-programacion-pdf")
                            }
                          >
                            <span className="mr-2">📄</span>
                            Temario PDF
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* Academia Admin - Only academia panel */}
                      {userRole === "academia_admin" && (
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(
                              `/academia/academia-demo-${user?.email?.split("@")[0]?.toLowerCase()}`,
                            )
                          }
                        >
                          <span className="mr-2">🏫</span>
                          Mi Academia
                        </DropdownMenuItem>
                      )}

                      {/* Teacher - Only assigned academia panel */}
                      {userRole === "teacher" && (
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(
                              `/academia/academia-demo-${user?.email?.split("@")[0]?.toLowerCase()}`,
                            )
                          }
                        >
                          <span className="mr-2">👨‍🏫</span>
                          Mi Academia
                        </DropdownMenuItem>
                      )}

                      {/* Student - Only student panel */}
                      {userRole === "student" && (
                        <DropdownMenuItem
                          onClick={() => navigate("/estudiante")}
                        >
                          <span className="mr-2">👨‍��</span>
                          Mi Panel
                        </DropdownMenuItem>
                      )}

                      {/* Default/Unknown role - Basic access */}
                      {userRole === "user" && (
                        <DropdownMenuItem
                          onClick={() => navigate("/estudiante")}
                        >
                          <span className="mr-2">👨‍🎓</span>
                          Panel Estudiante
                        </DropdownMenuItem>
                      )}

                      {/* Emergency Admin Access - Always available for admin emails */}
                      {user?.email &&
                        (user.email.toLowerCase().includes("admin") ||
                          user.email.includes("javier")) && (
                          <>
                            <div className="border-t my-1"></div>
                            <p className="px-2 py-1 text-xs font-medium text-muted-foreground text-red-600">
                              Acceso de Emergencia:
                            </p>
                            <DropdownMenuItem
                              onClick={() => navigate("/admin")}
                            >
                              <span className="mr-2">⚡</span>
                              Panel Admin (Directo)
                            </DropdownMenuItem>
                          </>
                        )}
                    </div>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
