import { useState, useEffect } from "react";
import {
  auth,
  getDecodedClaims,
  getAccessToken,
  type SimpleAuthUser,
} from "@/lib/simpleAuth";
import { isAdminToken, fetchUserRoleFromFirestore, type UserRole } from "@/lib/roles";

interface AuthState {
  user: SimpleAuthUser | null;
  token: Record<string, any> | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<SimpleAuthUser | null>(null);
  const [token, setToken] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        try {
          const claims = await getDecodedClaims();
          setToken(claims);
        } catch (error) {
          console.warn("⚠️ Error obteniendo los claims de Nhost:", error);
          setToken(null);
        }
      } else {
        setToken(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, token, loading };
}

export function useIsAdmin() {
  const { user, token, loading: authLoading } = useAuth();
  const [databaseRole, setDatabaseRole] = useState<UserRole | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFirestoreRole = async () => {
      if (!user?.uid) {
        setDatabaseRole(undefined);
        setLoading(false);
        return;
      }

      try {
        const role = await fetchUserRoleFromFirestore(user.uid);
        setDatabaseRole(role);
      } catch (error) {
        console.error("Error loading role from database:", error);
        setDatabaseRole(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadFirestoreRole();
    }
    // Soft-timeout to avoid hanging UI if auth never resolves
    const timeout = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(timeout);
  }, [user?.uid, authLoading]);

  // Check admin status by token first, then Firestore
  const isAdminByToken = isAdminToken(token);
  const isAdminByDatabase = databaseRole === "admin";

  // Check admin status by token first, then Firestore
  const isAdmin = isAdminByToken || isAdminByDatabase;

  // Debug information
  useEffect(() => {
    if (!authLoading && !loading && user) {
      console.log("🔍 Admin Status:", {
        uid: user.uid,
        email: user.email,
        tokenRole: token?.role ?? token?.["x-hasura-default-role"],
        tokenRoles: token?.roles || token?.["x-hasura-allowed-roles"],
        databaseRole,
        isAdminByToken,
        isAdminByDatabase,
        finalIsAdmin: isAdmin,
      });
    }
  }, [user, token, databaseRole, isAdminByToken, isAdminByDatabase, isAdmin, authLoading, loading]);

  return {
    isAdmin,
    isAdminByToken,
    isAdminByFirestore: isAdminByDatabase,
    user,
    token,
    firestoreRole: databaseRole,
    loading: authLoading || loading,

    // Helper methods
    refreshToken: async () => {
      if (user) {
        try {
          const freshToken = await getAccessToken({ forceRefresh: true });
          if (!freshToken) {
            setToken(null);
            return null;
          }
          const claims = await getDecodedClaims();
          setToken(claims);
          return claims;
        } catch (error) {
          console.warn("⚠️ Error refrescando el token de Nhost:", error);
          return null;
        }
      }
      return null;
    }
  };
}

// Simple hook that just returns boolean
export function useAdminStatus(): boolean {
  const { isAdmin } = useIsAdmin();
  return isAdmin;
}

// Hook with detailed information for debugging
export function useAdminInfo() {
  const adminInfo = useIsAdmin();

  return {
    ...adminInfo,
    debugInfo: {
      source: adminInfo.isAdminByToken
        ? "token"
        : adminInfo.isAdminByFirestore
          ? "data"
          : "none",
      tokenClaims: adminInfo.token,
    },
  };
}
