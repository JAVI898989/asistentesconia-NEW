/**
 * Centralized Access Control System
 * Manages role-based permissions and payment verification
 */

import { type SimpleAuthUser, fetchUserData } from "./simpleAuth";
import { getUserRole, type UserRole } from "./roles";

export interface UserPermissions {
  canAccessAdmin: boolean;
  canAccessAcademy: boolean;
  canAccessStudentPanel: boolean;
  canUseChat: boolean;
  canAccessTemario: boolean;
  canAccessTests: boolean;
  canAccessFlashcards: boolean;
  canViewPublicInfo: boolean;
}

export interface UserAccessInfo {
  user: SimpleAuthUser | null;
  role: UserRole;
  hasActiveSubscription: boolean;
  permissions: UserPermissions;
  isLoading: boolean;
}

/**
 * Default admin credentials
 */
export const DEFAULT_ADMIN = {
  email: "admin@admin.com",
  password: "administrador123"
};

/**
 * Check if user has active subscription
 */
export async function checkUserSubscription(authUserId: string): Promise<boolean> {
  try {
    if (!authUserId) {
      return false;
    }

    const profile = await fetchUserData(authUserId);
    if (!profile) {
      return false;
    }

    const now = new Date();
    const subscriptionStatus = profile.profile?.subscription_status;
    const subscriptionEnd = profile.profile?.subscription_end_date
      ? new Date(profile.profile.subscription_end_date)
      : null;

    if (subscriptionStatus && ["active", "completed", "trialing"].includes(subscriptionStatus)) {
      if (!subscriptionEnd || subscriptionEnd >= now) {
        return true;
      }
    }

    const latestSubscription = profile.subscriptions?.[0];
    if (latestSubscription && ["active", "completed"].includes(latestSubscription.status)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

/**
 * Get user permissions based on role and subscription
 */
export function getUserPermissions(
  role: UserRole, 
  hasActiveSubscription: boolean,
  isAdmin?: boolean
): UserPermissions {
  // Admin has all permissions
  if (role === "admin" || isAdmin) {
    return {
      canAccessAdmin: true,
      canAccessAcademy: true,
      canAccessStudentPanel: true,
      canUseChat: true,
      canAccessTemario: true,
      canAccessTests: true,
      canAccessFlashcards: true,
      canViewPublicInfo: true,
    };
  }

  // Academy admin permissions
  if (role === "academia") {
    return {
      canAccessAdmin: false,
      canAccessAcademy: true,
      canAccessStudentPanel: false,
      canUseChat: false,
      canAccessTemario: false,
      canAccessTests: false,
      canAccessFlashcards: false,
      canViewPublicInfo: true,
    };
  }

  if (role === "teacher") {
    return {
      canAccessAdmin: false,
      canAccessAcademy: true,
      canAccessStudentPanel: false,
      canUseChat: hasActiveSubscription,
      canAccessTemario: hasActiveSubscription,
      canAccessTests: hasActiveSubscription,
      canAccessFlashcards: hasActiveSubscription,
      canViewPublicInfo: true,
    };
  }

  // Student role permissions (depends on subscription)
  if (role === "student") {
    return {
      canAccessAdmin: false,
      canAccessAcademy: false,
      canAccessStudentPanel: true,
      canUseChat: hasActiveSubscription,
      canAccessTemario: hasActiveSubscription,
      canAccessTests: hasActiveSubscription,
      canAccessFlashcards: hasActiveSubscription,
      canViewPublicInfo: true,
    };
  }

  // Guest permissions (minimal)
  return {
    canAccessAdmin: false,
    canAccessAcademy: false,
    canAccessStudentPanel: false,
    canUseChat: false,
    canAccessTemario: false,
    canAccessTests: false,
    canAccessFlashcards: false,
    canViewPublicInfo: true,
  };
}

/**
 * Check if user can access specific route
 */
export function canAccessRoute(
  path: string, 
  permissions: UserPermissions
): boolean {
  // Admin routes
  if (path.startsWith('/admin')) {
    return permissions.canAccessAdmin;
  }

  // Academy routes
  if (path.startsWith('/academia') || path.startsWith('/panel-academia')) {
    return permissions.canAccessAcademy;
  }

  // Student routes
  if (path.startsWith('/estudiante') || path.startsWith('/alumno')) {
    return permissions.canAccessStudentPanel;
  }

  // Public routes
  const publicRoutes = [
    '/',
    '/login',
    '/asistentes',
    '/academias',
    '/cursos',
    '/como-funciona'
  ];

  return publicRoutes.some(route => 
    path === route || path.startsWith('/asistente/')
  ) || permissions.canViewPublicInfo;
}

/**
 * Get appropriate redirect URL based on user role
 */
export function getDefaultRedirectUrl(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "academia":
      return "/academias";
    case "teacher":
      return "/panel-academia";
    case "student":
      return "/estudiante";
    default:
      return "/";
  }
}

/**
 * Validate and setup default admin user
 */
export async function ensureDefaultAdmin(): Promise<void> {
  try {
    console.log("ℹ️ ensureDefaultAdmin is a no-op under Nhost. Usa AdminInit para crear el usuario inicial.");
  } catch (error) {
    console.error("Error setting up default admin:", error);
  }
}

/**
 * Format role for display
 */
export function formatRole(role: UserRole): string {
  const roleNames = {
    admin: "Administrador",
    academia: "Academia",
    teacher: "Profesor",
    student: "Estudiante",
    guest: "Invitado",
  };
  
  return roleNames[role] || "Desconocido";
}

/**
 * Get role-specific features
 */
export function getRoleFeatures(role: UserRole, hasSubscription: boolean) {
  const features = {
    admin: [
      "Gestión completa del sistema",
      "Administrar usuarios y roles",
      "Configurar asistentes y contenido",
      "Ver todas las estadísticas",
      "Acceso sin restricciones",
    ],
    academia: [
      "Crear grupos de alumnos",
      "Asignar asistentes a alumnos",
      "Añadir profesores/tutores",
      "Ver progreso de alumnos",
      "Gestionar suscripciones de grupo",
    ],
    teacher: [
      "Gestionar clases asignadas",
      "Revisar actividad de alumnos",
      "Acceso a materiales del curso",
      "Coordinación con academias",
    ],
    student: hasSubscription
      ? [
          "Chat con asistente especializado",
          "Acceso completo al temario",
          "Tests y evaluaciones",
          "Flashcards de repaso",
          "Seguimiento de progreso",
          "Motivación y logros",
        ]
      : [
          "Ver información pública del asistente",
          "Descripción y requisitos",
          "Información sobre sueldo",
          "Fechas de examen",
          "Precios y suscripciones",
        ],
    guest: [
      "Ver asistentes públicos",
      "Información general",
      "Registro y login",
    ],
  };
  
  return features[role] || [];
}


