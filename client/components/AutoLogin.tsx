import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AutoLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        console.log("🚀 PERFORMING AUTOMATIC LOGIN...");

        // Import offline auth
        const { seedDemoAccounts, loginUserOffline } = await import(
          "@/lib/offlineAuth"
        );

        // Setup demo accounts
        seedDemoAccounts();

        // Auto-login as admin
        await loginUserOffline("admin@demo.com", "demo123");

        console.log("✅ AUTO-LOGIN SUCCESSFUL - Redirecting to admin...");

        // Direct navigation to admin
        navigate("/admin");
      } catch (error) {
        console.error("❌ Auto-login failed:", error);
        // Fallback: navigate to admin anyway
        navigate("/admin");
      }
    };

    // Execute immediately
    performAutoLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">⚡</div>
        <div className="text-3xl font-bold mb-2">AUTO-LOGIN ACTIVADO</div>
        <div className="text-xl mb-4">
          Accediendo automáticamente como administrador...
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
};

export default AutoLogin;
