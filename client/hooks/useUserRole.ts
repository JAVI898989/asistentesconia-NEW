import { useState, useEffect } from "react";
import { auth, type SimpleAuthUser } from "@/lib/simpleAuth";
import { getUserRole, type UserRole } from "@/lib/roles";
import { 
  checkUserSubscription, 
  getUserPermissions, 
  type UserAccessInfo 
} from "@/lib/accessControl";
import { useIsAdmin } from "./useIsAdmin";

/**
 * Enhanced hook for complete user role and access management
 */
export function useUserRole(): UserAccessInfo {
  const [user, setUser] = useState<SimpleAuthUser | null>(null);
  const [role, setRole] = useState<UserRole>("guest");
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAdmin, token } = useIsAdmin();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (nextUser) => {
      setUser(nextUser);
      setIsLoading(true);

      if (nextUser) {
        try {
          // Get user role
          const userRole = await getUserRole(nextUser.uid, token);
          setRole(userRole);

          // Check subscription status (not needed for admin)
          if (userRole !== "admin" && !isAdmin) {
            const hasSubscription = await checkUserSubscription(nextUser.uid);
            setHasActiveSubscription(hasSubscription);
          } else {
            setHasActiveSubscription(true); // Admin always has access
          }
          
        } catch (error) {
          console.error("Error loading user role and subscription:", error);
          setRole("guest");
          setHasActiveSubscription(false);
        }
      } else {
        setRole("guest");
        setHasActiveSubscription(false);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, [isAdmin, token]);

  // Override role if admin is detected
  const effectiveRole = isAdmin ? "admin" : role;
  const effectiveSubscription = isAdmin ? true : hasActiveSubscription;

  const permissions = getUserPermissions(
    effectiveRole, 
    effectiveSubscription, 
    isAdmin
  );

  return {
    user,
    role: effectiveRole,
    hasActiveSubscription: effectiveSubscription,
    permissions,
    isLoading
  };
}

/**
 * Simple hook that just returns the user role
 */
export function useSimpleUserRole(): { role: UserRole; isLoading: boolean } {
  const { role, isLoading } = useUserRole();
  return { role, isLoading };
}

/**
 * Hook for subscription status only
 */
export function useSubscriptionStatus(): { 
  hasActiveSubscription: boolean; 
  isLoading: boolean;
  isAdmin: boolean;
} {
  const { hasActiveSubscription, isLoading } = useUserRole();
  const { isAdmin } = useIsAdmin();
  
  return { 
    hasActiveSubscription: isAdmin || hasActiveSubscription, 
    isLoading,
    isAdmin 
  };
}

/**
 * Hook for checking specific permissions
 */
export function usePermissions() {
  const { permissions, isLoading } = useUserRole();
  
  return {
    ...permissions,
    isLoading,
    
    // Convenience methods
    canAccess: (feature: keyof typeof permissions) => permissions[feature],
    hasAnyAdminAccess: () => permissions.canAccessAdmin,
    hasContentAccess: () => 
      permissions.canAccessTemario && 
      permissions.canAccessTests && 
      permissions.canAccessFlashcards,
  };
}
