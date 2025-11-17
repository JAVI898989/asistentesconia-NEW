import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/simpleAuth";

export default function AuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      if (user) {
        console.log("✅ User authenticated, redirecting to home");
        navigate("/");
      } else {
        console.log("❌ No user authenticated, redirecting to login");
        navigate("/login");
      }
    };

    // Small delay to ensure auth state is settled
    setTimeout(checkAuth, 100);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verificando autenticación...</p>
      </div>
    </div>
  );
}
