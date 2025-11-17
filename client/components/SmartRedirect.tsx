import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChangedEnhanced } from "@/lib/firebase";
import {
  getUserAcademias,
  checkIsAdmin,
  getUserManagement,
  createOrUpdateUserManagementFromAuth,
  UserManagement,
} from "@/lib/firebaseData";
import {
  getCurrentOfflineUser,
  isAuthenticatedOffline,
} from "@/lib/offlineAuth";
import { useNavigate } from "react-router-dom";

export default function SmartRedirect() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirection = async () => {
      try {
        // Check for offline user first
        if (isAuthenticatedOffline()) {
          const offlineUser = getCurrentOfflineUser();
          console.log("📱 Usuario offline detectado:", offlineUser.email);

          // For offline users, redirect to a simple panel
          if (offlineUser.email.includes("admin")) {
            console.log("📱 Redirigiendo admin offline a panel admin");
            navigate("/admin");
          } else {
            console.log("📱 Redirigiendo usuario offline a panel simple");
            navigate("/panel");
          }
          setLoading(false);
          return;
        }

        const unsubscribe = onAuthStateChangedEnhanced(async (user) => {
          if (!user) {
            console.log("❌ No hay usuario logueado - redirigiendo a login");
            navigate("/login");
            setLoading(false);
            return;
          }

          console.log(`🔍 Verificando tipo de usuario para: ${user.email}`);

          try {
            // PRIORIDAD 1: Crear o obtener UserManagement para obtener rol específico
            console.log(
              "📊 Verificando/creando datos de usuario en UserManagement...",
            );
            let userManagementData = await getUserManagement(user.uid);

            // Si no existe, crear basado en email
            if (!userManagementData && user.email) {
              console.log("🆕 Creando nuevo registro de usuario...");
              userManagementData = await createOrUpdateUserManagementFromAuth(
                user.uid,
                user.email,
              );
            }

            if (userManagementData) {
              console.log(
                `📋 Datos de usuario encontrados:`,
                userManagementData,
              );
              console.log(
                `🎯 Rol detectado: ${userManagementData.role} para email: ${user.email}`,
              );

              // Redirección basada en rol específico
              switch (userManagementData.role) {
                case "super_admin":
                  console.log(
                    "👑 SUPER ADMIN detectado - redirigiendo a /admin",
                  );
                  navigate("/admin");
                  setLoading(false);
                  return;

                case "admin":
                  console.log("🔧 ADMIN detectado - redirigiendo a /admin");
                  navigate("/admin");
                  setLoading(false);
                  return;

                case "academia_admin":
                  console.log(
                    "🏫 ADMIN DE ACADEMIA detectado - verificando academias...",
                  );
                  console.log(`🔍 User ID: ${user.uid}, Email: ${user.email}`);

                  // Get academias from the database
                  console.log("📋 Consultando academias del usuario...");
                  const userAcademias = await getUserAcademias(user.uid);
                  console.log(`📊 Academias encontradas:`, userAcademias);

                  if (userAcademias && userAcademias.length > 0) {
                    const firstAcademia = userAcademias[0];
                    console.log(
                      `🏫 ✅ Redirigiendo a academia: /academia/${firstAcademia.slug}`,
                    );
                    navigate(`/academia/${firstAcademia.slug}`);
                    setLoading(false);
                    return;
                  }

                  // If no academias found, redirect to academias page to create one
                  console.log(
                    "🏫 ⚠️ No academias found for academia_admin, redirecting to /academias",
                  );
                  navigate("/academias");
                  setLoading(false);
                  return;

                case "teacher":
                  console.log(
                    "👨‍🏫 PROFESOR detectado - redirigiendo a academia asignada...",
                  );
                  if (userManagementData.academiaIds.length > 0) {
                    const userAcademias = await getUserAcademias(user.uid);
                    if (userAcademias && userAcademias.length > 0) {
                      const firstAcademia = userAcademias[0];
                      console.log(
                        `🏫 Redirigiendo profesor a: /academia/${firstAcademia.slug}`,
                      );
                      navigate(`/academia/${firstAcademia.slug}`);
                      setLoading(false);
                      return;
                    }
                  }
                  break;

                case "student":
                  console.log(
                    "👨‍🎓 ESTUDIANTE detectado - redirigiendo a panel de estudiante...",
                  );
                  navigate("/estudiante");
                  setLoading(false);
                  return;

                default:
                  console.log(`❓ Rol desconocido: ${userManagementData.role}`);
              }
            }

            // PRIORIDAD 2: Fallback - Verificar academias directamente
            console.log(
              "📋 Verificando academias del usuario como fallback...",
            );
            const userAcademias = await getUserAcademias(user.uid);

            if (userAcademias && userAcademias.length > 0) {
              const firstAcademia = userAcademias[0];
              console.log(
                `🏫 ¡ACADEMIA ENCONTRADA! Redirigiendo a: /academia/${firstAcademia.slug}`,
              );
              navigate(`/academia/${firstAcademia.slug}`);
              setLoading(false);
              return;
            }

            // PRIORIDAD 3: Verificar si es admin por email o BD
            if (user.email === "admin@admin.com") {
              console.log(
                "👑 SUPER ADMIN por email - redirigiendo a panel admin",
              );
              navigate("/admin");
              setLoading(false);
              return;
            }

            try {
              const isAdmin = await checkIsAdmin(user.uid);
              if (isAdmin) {
                console.log("👑 ADMIN EN BD - redirigiendo a panel admin");
                navigate("/admin");
                setLoading(false);
                return;
              }
            } catch (adminCheckError) {
              console.log("⚠️ Error verificando admin en BD:", adminCheckError);
            }

            // PRIORIDAD 4: Usuario normal (estudiante)
            console.log(
              "👤 Usuario normal - redirigiendo a panel de estudiante",
            );
            navigate("/estudiante");
            setLoading(false);
          } catch (error) {
            console.error("❌ Error en verificación de usuario:", error);

            // FALLBACK: Basado en email
            if (user.email === "admin@admin.com") {
              console.log(
                "🔄 FALLBACK: admin@admin.com detected - going to admin",
              );
              navigate("/admin");
            } else if (
              user.email?.includes("academia") ||
              user.email?.includes("test")
            ) {
              console.log(
                "🔄 FALLBACK: academia email detected - going to demo academia",
              );
              navigate("/academia/academia-demo-madrid");
            } else {
              console.log("🔄 FALLBACK: unknown user - going to home");
              navigate("/");
            }
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("❌ Error crítico en smart redirect:", error);
        setLoading(false);
        navigate("/");
      }
    };

    handleRedirection();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">
            🔍 Verificando tipo de usuario...
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Determinando el panel apropiado
          </p>
          <div className="mt-4 text-xs text-slate-500 space-y-1">
            <p>• Analizando rol de usuario...</p>
            <p>• Verificando permisos específicos...</p>
            <p>• Comprobando asignaciones de academia...</p>
            <p>• Determinando panel apropiado...</p>
            <div className="mt-3 text-xs text-slate-400 border-t border-slate-700 pt-3">
              <p>
                <strong>Tipos de panel:</strong>
              </p>
              <p>👑 Super Admin → Panel de Administración</p>
              <p>🏫 Admin Academia → Panel de Academia</p>
              <p>👨‍🏫 Profesor → Panel de Academia</p>
              <p>👨‍🎓 Alumno → Panel de Alumno</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
