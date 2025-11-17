import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface AdminCheck {
  isAdmin: boolean;
  source: 'token' | 'firestore' | 'none';
  uid?: string;
  email?: string;
}

/**
 * Check if a token has admin role
 * Supports both single role and roles array from custom claims
 */
export function isAdminToken(token?: any): boolean {
  if (!token) return false;
  
  // Check direct role property
  if (token.role === 'admin') return true;
  
  // Check roles array
  const roles = token.roles || [];
  if (Array.isArray(roles) && roles.includes('admin')) return true;
  
  return false;
}

/**
 * Fetch user role from Firestore (server-side)
 */
export async function fetchUserRoleFromFirestore(uid: string): Promise<string | null> {
  try {
    if (!uid) return null;
    
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    
    // Check direct role property
    if (userData.role === 'admin') return 'admin';
    
    // Check roles array
    const roles = userData.roles || [];
    if (Array.isArray(roles) && roles.includes('admin')) {
      return 'admin';
    }
    
    return userData.role || 'student';
    
  } catch (error) {
    console.error('Error fetching user role from Firestore:', error);
    return null;
  }
}

/**
 * Comprehensive admin check for server-side use
 * Checks both token and Firestore fallback
 */
export async function checkAdminAccess(
  uid?: string, 
  token?: any, 
  email?: string
): Promise<AdminCheck> {
  
  // First check token (fastest)
  if (isAdminToken(token)) {
    console.log('🔑 Admin access granted via token', { uid, email });
    return {
      isAdmin: true,
      source: 'token',
      uid,
      email
    };
  }
  
  // Fallback to Firestore check
  if (uid) {
    try {
      const firestoreRole = await fetchUserRoleFromFirestore(uid);
      if (firestoreRole === 'admin') {
        console.log('🔑 Admin access granted via Firestore', { uid, email });
        return {
          isAdmin: true,
          source: 'firestore',
          uid,
          email
        };
      }
    } catch (error) {
      console.error('Error checking Firestore admin status:', error);
    }
  }
  
  // Legacy email check (temporary fallback)
  const adminEmails = [
    'javier@cursosgratis.ai',
    'info@cursosgratis.ai',
    'jgomez.devfocus@gmail.com',
    'admin@devfocus.es'
  ];
  
  if (email && adminEmails.includes(email)) {
    console.log('🔑 Admin access granted via legacy email check', { uid, email });
    return {
      isAdmin: true,
      source: 'token', // Treat as token for compatibility
      uid,
      email
    };
  }
  
  return {
    isAdmin: false,
    source: 'none',
    uid,
    email
  };
}

/**
 * Middleware helper for Next.js API routes
 * Usage: const adminCheck = await requireAdminOrBypass(req);
 */
export async function requireAdminOrBypass(
  req: any,
  bypassPaywall: boolean = true
): Promise<{ 
  isAdmin: boolean; 
  canAccess: boolean; 
  adminCheck: AdminCheck 
}> {
  
  try {
    // Extract auth info from request
    const authHeader = req.headers.authorization;
    const uid = req.headers['x-user-id'] || req.query.uid;
    const email = req.headers['x-user-email'] || req.query.email;
    
    let token = null;
    
    // Try to decode token from Authorization header
    if (authHeader?.startsWith('Bearer ')) {
      try {
        // In a real implementation, you would verify the JWT token here
        // For now, we'll extract basic info
        const tokenString = authHeader.substring(7);
        // This would normally use Firebase Admin SDK to verify
        // token = await admin.auth().verifyIdToken(tokenString);
      } catch (error) {
        console.warn('Failed to verify token:', error);
      }
    }
    
    const adminCheck = await checkAdminAccess(uid, token, email);
    
    return {
      isAdmin: adminCheck.isAdmin,
      canAccess: adminCheck.isAdmin || !bypassPaywall,
      adminCheck
    };
    
  } catch (error) {
    console.error('Error in requireAdminOrBypass:', error);
    return {
      isAdmin: false,
      canAccess: !bypassPaywall,
      adminCheck: { isAdmin: false, source: 'none' }
    };
  }
}

/**
 * Express middleware for admin bypass
 */
export function adminBypassMiddleware(req: any, res: any, next: any) {
  return requireAdminOrBypass(req).then(({ isAdmin, canAccess, adminCheck }) => {
    // Add admin info to request
    req.adminCheck = adminCheck;
    req.isAdmin = isAdmin;
    req.canAccess = canAccess;
    
    if (isAdmin) {
      console.log(`🔓 Admin bypass activated for ${req.method} ${req.path}`, {
        source: adminCheck.source,
        uid: adminCheck.uid,
        email: adminCheck.email
      });
    }
    
    next();
  }).catch((error) => {
    console.error('Admin bypass middleware error:', error);
    req.isAdmin = false;
    req.canAccess = false;
    req.adminCheck = { isAdmin: false, source: 'none' };
    next();
  });
}
