import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import StudentPanel from "@/components/panels/StudentPanel";
import AcademyPanel from "@/components/panels/AcademyPanel";
import { getDefaultRedirectUrl } from "@/lib/accessControl";

/**
 * Component that automatically redirects users to their appropriate panel
 * based on their role and permissions
 */
export default function RoleBasedRouter() {
  const { user, role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Determinando panel apropiado...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to the appropriate panel based on role
  const redirectUrl = getDefaultRedirectUrl(role);
  return <Navigate to={redirectUrl} replace />;
}

/**
 * Student Panel Route Component
 */
export function StudentPanelRoute() {
  const { permissions, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando panel de estudiante...</div>
      </div>
    );
  }

  if (!permissions.canAccessStudentPanel) {
    return <Navigate to="/" replace />;
  }

  return <StudentPanel />;
}

/**
 * Academy Panel Route Component
 */
export function AcademyPanelRoute() {
  const { permissions, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando panel de academia...</div>
      </div>
    );
  }

  if (!permissions.canAccessAcademy) {
    return <Navigate to="/" replace />;
  }

  return <AcademyPanel />;
}
