import { fetchUserData } from "./simpleAuth";

export type UserRole =
  | "admin"
  | "academia"
  | "teacher"
  | "student"
  | "guest";

const ADMIN_ROLES = new Set<UserRole>(["admin"]);
const ROLE_ALIASES: Record<string, UserRole> = {
  admin: "admin",
  super_admin: "admin",
  superadmin: "admin",
  academia: "academia",
  academy: "academia",
  profesor: "teacher",
  teacher: "teacher",
  alumno: "student",
  student: "student",
};

const normalizeRole = (raw?: string | null): UserRole | undefined => {
  if (!raw) return undefined;
  const key = raw.toLowerCase();
  return ROLE_ALIASES[key] ?? undefined;
};

const extractRolesFromToken = (token?: any): string[] => {
  if (!token) return [];

  const claim =
    token["https://hasura.io/jwt/claims"] ||
    token["hasura_claims"] ||
    token["claims"] ||
    token;

  const possibleRoles = [
    claim?.role,
    claim?.default_role,
    claim?.["x-hasura-default-role"],
    ...(claim?.roles ?? []),
    ...(claim?.allowedRoles ?? []),
    ...(claim?.["x-hasura-allowed-roles"] ?? []),
  ];

  return possibleRoles
    .flat()
    .filter(Boolean)
    .map((value) => `${value}`);
};

/**
 * Check if a user token has admin role
 * Supports both single role and roles array
 */
export function isAdminToken(token?: any): boolean {
  const roles = extractRolesFromToken(token)
    .map((value) => normalizeRole(value))
    .filter(Boolean) as UserRole[];

  return roles.some((role) => ADMIN_ROLES.has(role));
}

/**
 * Fetch user role from the Postgres profile via Hasura
 * Fallback when custom claims are not available yet
 */
export async function fetchUserRoleFromFirestore(uid: string): Promise<UserRole | undefined> {
  try {
    if (!uid) return undefined;

    const profile = await fetchUserData(uid);
    if (!profile) {
      return undefined;
    }

    const rawRole =
      profile.profile?.role ||
      profile.auth?.default_role ||
      profile.auth?.metadata?.role ||
      profile.auth?.metadata?.defaultRole;

    const normalized = normalizeRole(rawRole);
    if (normalized) {
      return normalized;
    }

    const metadataRoles = profile.auth?.metadata?.roles || [];

    if (Array.isArray(metadataRoles)) {
      for (const value of metadataRoles) {
        const alias = normalizeRole(`${value}`);
        if (alias) {
          return alias;
        }
      }
    }

    return undefined;
  } catch (error) {
    console.error("Error fetching user role from Hasura:", error);
    return undefined;
  }
}

/**
 * Check if a user is admin by any method (token or Firestore)
 */
export async function checkAdminStatus(uid?: string, token?: any): Promise<boolean> {
  // First check token (fastest)
  if (isAdminToken(token)) {
    return true;
  }
  
  // Fallback to Firestore check
  if (uid) {
    const firestoreRole = await fetchUserRoleFromFirestore(uid);
    if (firestoreRole && ADMIN_ROLES.has(firestoreRole)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get user role with fallback chain
 */
export async function getUserRole(uid?: string, token?: any): Promise<UserRole> {
  // Check token first
  const tokenRoles = extractRolesFromToken(token);
  for (const rawRole of tokenRoles) {
    const normalized = normalizeRole(rawRole);
    if (normalized) {
      return normalized;
    }
  }
  
  // Fallback to Firestore
  if (uid) {
    const firestoreRole = await fetchUserRoleFromFirestore(uid);
    if (firestoreRole) return firestoreRole;
  }
  
  return "guest";
}

/**
 * Debug role information
 */
export function debugRoleInfo(uid?: string, token?: any) {
  console.log("🔍 Role Debug Info:", {
    uid,
    tokenRole: token?.role,
    tokenRoles: token?.roles,
    hasToken: !!token,
    hasuraClaims: token?.["https://hasura.io/jwt/claims"],
    isAdminByToken: isAdminToken(token),
  });
}
