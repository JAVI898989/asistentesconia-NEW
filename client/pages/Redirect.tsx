import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/definitiveAuth";
import { checkIsCurrentUserAdmin } from "@/lib/firebaseData";

export default function Redirect() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirectUser = async () => {
      const user = getCurrentUser();

      if (!user) {
        navigate("/login");
        return;
      }

      console.log("🔄 Usuario autenticado, determinando rol...", {
        email: user.email,
        uid: user.uid
      });

      try {
        // Check if user is admin
        const isAdmin = await checkIsCurrentUserAdmin();
        console.log("🔍 Admin check result:", isAdmin);

        if (isAdmin) {
          console.log("👑 Redirigiendo administrador al panel admin");
          navigate("/admin/dashboard");
          return;
        }

        // Determine user type based on email patterns and user data
        const email = user.email?.toLowerCase() || "";

        // Academia users - multiple patterns for detection
        const academiaPatterns = [
          "academia", "centro", "colegio", "instituto", "escuela",
          "@academia.", "@centro.", "@colegio.", "@instituto.", "@escuela.",
          "director", "coordinador", "profesor"
        ];

        const isAcademia = academiaPatterns.some(pattern => email.includes(pattern));
        console.log("🔍 Academia detection:", {
          email,
          isAcademia,
          matchedPatterns: academiaPatterns.filter(pattern => email.includes(pattern))
        });

        if (isAcademia) {
          console.log("🏫 Redirigiendo academia al panel de academia");
          navigate("/academia-panel");
          return;
        }

        // Check if user has specific roles stored in database (future enhancement)
        // For now, assume all other users are students

        // Default: redirect to student panel
        console.log("🎓 Redirigiendo alumno al panel de alumno");
        navigate("/alumno-panel");

      } catch (error) {
        console.error("❌ Error determinando rol de usuario:", error);
        // Fallback to student panel
        navigate("/alumno-panel");
      } finally {
        setIsLoading(false);
      }
    };

    redirectUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-300 text-lg">
          {isLoading ? "Detectando tipo de usuario..." : "Redirigiendo..."}
        </p>
        <p className="text-slate-400 text-sm mt-2">
          Determinando panel apropiado
        </p>
      </div>
    </div>
  );
}
