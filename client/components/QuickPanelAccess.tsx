import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, getDemoUser, isDemoModeActive } from "@/lib/firebase";
import {
  getUserManagement,
  createOrUpdateUserManagementFromAuth,
} from "@/lib/firebaseData";

export default function QuickPanelAccess() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authUnsubscribe: (() => void) | null = null;
    let isMounted = true;

    const checkUser = async () => {
      if (!isMounted) return;

      try {
        if (isDemoModeActive()) {
          const demoUser = getDemoUser();
          if (!isMounted) return;

          setUser(demoUser);

          if (demoUser?.email) {
            try {
              const userManagement = await createOrUpdateUserManagementFromAuth(
                demoUser.uid,
                demoUser.email,
              );
              if (isMounted) {
                setUserRole(userManagement.role);
              }
            } catch (error) {
              if (isMounted) {
                setUserRole("");
              }
            }
          }
          if (isMounted) {
            setLoading(false);
          }
        } else {
          authUnsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!isMounted) return;

            setUser(user);

            if (user?.email) {
              try {
                const userManagement =
                  await createOrUpdateUserManagementFromAuth(
                    user.uid,
                    user.email,
                  );
                if (isMounted) {
                  setUserRole(userManagement.role);
                }
              } catch (error) {
                if (isMounted) {
                  setUserRole("");
                }
              }
            } else {
              if (isMounted) {
                setUserRole("");
              }
            }
            if (isMounted) {
              setLoading(false);
            }
          });
        }
      } catch (error) {
        console.error("Error checking user:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
      if (authUnsubscribe) {
        try {
          authUnsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from auth:", error);
        }
      }
    };
  }, []);

  // Only show for super admins and admins
  if (
    loading ||
    !user ||
    (userRole !== "super_admin" && userRole !== "admin")
  ) {
    return null;
  }

  const panels = [
    {
      title: "👑 Super Admin",
      description: "Panel de administración general",
      path: "/admin",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "🏫 Admin Academia",
      description: "Panel específico de academia",
      path: "/academia/academia-demo-academia",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "👨‍🎓 Estudiante",
      description: "Panel de estudiante",
      path: "/estudiante",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "📚 Cursos",
      description: "Panel de cursos profesionales",
      path: "/cursos",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "🏫 Gestión Academias",
      description: "Vista general de academias",
      path: "/academias",
      color: "bg-teal-500 hover:bg-teal-600",
    },
    {
      title: "🔄 Smart Redirect",
      description: "Test de redirección automática",
      path: "/redirect",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🚀 Acceso Directo a Paneles
          <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
            DEMO
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {panels.map((panel) => (
            <Button
              key={panel.path}
              onClick={() => navigate(panel.path)}
              className={`${panel.color} text-white flex flex-col items-start p-4 h-auto`}
            >
              <span className="font-semibold text-sm">{panel.title}</span>
              <span className="text-xs opacity-90 mt-1">
                {panel.description}
              </span>
            </Button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Estos botones te permiten acceder
            directamente a cualquier panel sin hacer login. Útil para testing y
            demostración.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
