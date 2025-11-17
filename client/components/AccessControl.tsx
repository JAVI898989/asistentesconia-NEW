import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { canAccessRoute, getDefaultRedirectUrl } from "@/lib/accessControl";
import { AlertCircle, Lock, Crown, School, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AccessControlProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AccessControl({ children, fallback }: AccessControlProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, permissions, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && user) {
      const currentPath = location.pathname;
      
      // Check if user can access current route
      if (!canAccessRoute(currentPath, permissions)) {
        // Redirect to appropriate panel
        const redirectUrl = getDefaultRedirectUrl(role);
        console.log(`🚫 Access denied to ${currentPath} for role ${role}, redirecting to ${redirectUrl}`);
        navigate(redirectUrl, { replace: true });
      }
    }
  }, [user, role, permissions, isLoading, location.pathname, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Verificando permisos...</div>
      </div>
    );
  }

  // Check access permission
  const hasAccess = canAccessRoute(location.pathname, permissions);

  if (!hasAccess) {
    return fallback || <AccessDeniedScreen role={role} currentPath={location.pathname} />;
  }

  return <>{children}</>;
}

interface AccessDeniedScreenProps {
  role: string;
  currentPath: string;
}

function AccessDeniedScreen({ role, currentPath }: AccessDeniedScreenProps) {
  const navigate = useNavigate();

  const getRoleIcon = () => {
    switch (role) {
      case 'admin':
        return <Crown className="w-16 h-16 text-red-400" />;
      case 'academy':
        return <School className="w-16 h-16 text-purple-400" />;
      case 'student':
        return <GraduationCap className="w-16 h-16 text-blue-400" />;
      default:
        return <Lock className="w-16 h-16 text-slate-400" />;
    }
  };

  const getRoleMessage = () => {
    if (currentPath.startsWith('/admin')) {
      return {
        title: "Acceso de Administrador Requerido",
        description: "Esta sección está reservada para administradores del sistema.",
        suggestion: "Solo los usuarios con rol de administrador pueden acceder al panel de administración."
      };
    }

    if (currentPath.startsWith('/academia')) {
      return {
        title: "Acceso de Academia Requerido", 
        description: "Esta sección está reservada para academias registradas.",
        suggestion: "Necesitas tener rol de academia para gestionar grupos de estudiantes."
      };
    }

    if (currentPath.startsWith('/estudiante') || currentPath.startsWith('/alumno')) {
      return {
        title: "Acceso de Estudiante Requerido",
        description: "Esta sección está reservada para estudiantes registrados.",
        suggestion: "Necesitas tener rol de estudiante para acceder al panel de aprendizaje."
      };
    }

    return {
      title: "Acceso Denegado",
      description: "No tienes permisos para acceder a esta página.",
      suggestion: "Contacta con el administrador si crees que deberías tener acceso."
    };
  };

  const message = getRoleMessage();

  const handleGoToPanel = () => {
    const redirectUrl = getDefaultRedirectUrl(role as any);
    navigate(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {getRoleIcon()}
          </div>
          <CardTitle className="text-white text-2xl">{message.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center">
          <p className="text-slate-300">{message.description}</p>
          
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-medium">Tu rol actual</span>
            </div>
            <Badge 
              className={
                role === 'admin' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                role === 'academy' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                role === 'student' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                'bg-slate-500/20 text-slate-400 border-slate-500/30'
              }
            >
              {role === 'admin' && '👑 Administrador'}
              {role === 'academy' && '🏫 Academia'}
              {role === 'student' && '🎓 Estudiante'}
              {role === 'guest' && '👤 Invitado'}
            </Badge>
          </div>

          <p className="text-slate-400 text-sm">{message.suggestion}</p>

          <div className="space-y-2 pt-4">
            <Button 
              onClick={handleGoToPanel}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Ir a mi panel
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Higher-order component for protecting routes
 */
export function withAccessControl<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function ProtectedComponent(props: P) {
    return (
      <AccessControl fallback={fallback}>
        <Component {...props} />
      </AccessControl>
    );
  };
}

/**
 * Component for inline permission checks
 */
interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const { permissions } = useUserRole();
  
  const hasPermission = (permissions as any)[permission] === true;
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
