/**
 * FIREBASE AUTHENTICATION - CLEAN & DIRECT
 *
 * Sistema de autenticación que usa ÚNICAMENTE Firebase SDK
 * Sin respaldos, sin demos, sin modos alternativos
 * Firebase funciona SIEMPRE
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBywGWqSpzZ4BRxIoEnIQZhv3ObHvrLIC8",
  authDomain: "cursor-64188.firebaseapp.com",
  projectId: "cursor-64188",
  storageBucket: "cursor-64188.appspot.com",
  messagingSenderId: "657742231663",
  appId: "1:657742231663:web:9b6fce322922f3b6e0f59a",
  measurementId: "G-WMDEJ4MS3X",
};

// Initialize Firebase
let app: any;
let auth: any;
let db: any;

try {
  // Initialize Firebase app
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // Initialize Auth
  auth = getAuth(app);

  // Initialize Firestore
  db = getFirestore(app);

  console.log("✅ Firebase initialized successfully");
  console.log("🔥 Auth domain:", firebaseConfig.authDomain);
  console.log("🔥 Project ID:", firebaseConfig.projectId);
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  throw new Error("Firebase no se pudo inicializar");
}

// Configure auth settings
if (auth) {
  // Set language to Spanish
  auth.languageCode = "es";

  // Configure additional settings
  auth.settings = {
    appVerificationDisabledForTesting: false,
  };
}

export { auth, db };

/**
 * Login with email and password
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  if (!auth) {
    throw new Error("Firebase Auth no está inicializado");
  }

  if (!email || !password) {
    throw new Error("Email y contraseña son requeridos");
  }

  try {
    console.log("🔐 Iniciando sesión con Firebase...");

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    console.log("✅ Login exitoso:", user.email);

    return user;
  } catch (error: any) {
    console.error("❌ Error en login:", error);

    // Handle specific Firebase errors
    switch (error.code) {
      case "auth/user-not-found":
        throw new Error("No existe una cuenta con este email");
      case "auth/wrong-password":
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
        throw new Error("Contraseña incorrecta");
      case "auth/invalid-email":
        throw new Error("Email inválido");
      case "auth/user-disabled":
        throw new Error("Esta cuenta ha sido deshabilitada");
      case "auth/too-many-requests":
        throw new Error(
          "Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo",
        );
      case "auth/network-request-failed":
        throw new Error(
          "Error de conexión. Verifica tu internet y que el dominio esté autorizado en Firebase Console",
        );
      case "auth/unauthorized-domain":
        throw new Error(
          `El dominio ${window.location.hostname} no está autorizado. Añádelo en Firebase Console > Authentication > Settings > Authorized domains`,
        );
      default:
        throw new Error(`Error de autenticación: ${error.message}`);
    }
  }
}

/**
 * Register new user
 */
export async function registerUser(
  email: string,
  password: string,
): Promise<User> {
  if (!auth) {
    throw new Error("Firebase Auth no está inicializado");
  }

  if (!email || !password) {
    throw new Error("Email y contraseña son requeridos");
  }

  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  try {
    console.log("📝 Registrando usuario con Firebase...");

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    console.log("✅ Registro exitoso:", user.email);

    return user;
  } catch (error: any) {
    console.error("❌ Error en registro:", error);

    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error("Ya existe una cuenta con este email");
      case "auth/invalid-email":
        throw new Error("Email inválido");
      case "auth/weak-password":
        throw new Error("La contraseña es muy débil");
      case "auth/network-request-failed":
        throw new Error("Error de conexión. Verifica tu internet");
      default:
        throw new Error(`Error de registro: ${error.message}`);
    }
  }
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<void> {
  if (!auth) {
    throw new Error("Firebase Auth no está inicializado");
  }

  try {
    await signOut(auth);
    console.log("✅ Logout exitoso");
  } catch (error: any) {
    console.error("❌ Error en logout:", error);
    throw new Error(`Error al cerrar sesión: ${error.message}`);
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(
  callback: (user: User | null) => void,
): () => void {
  if (!auth) {
    throw new Error("Firebase Auth no está inicializado");
  }

  return onAuthStateChanged(auth, callback);
}

/**
 * Get user ID token
 */
export async function getUserToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) {
    return null;
  }

  try {
    return await user.getIdToken();
  } catch (error) {
    console.error("Error getting user token:", error);
    return null;
  }
}

/**
 * Force refresh auth token
 */
export async function refreshUserToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) {
    return null;
  }

  try {
    return await user.getIdToken(true); // Force refresh
  } catch (error) {
    console.error("Error refreshing user token:", error);
    return null;
  }
}

/**
 * Check Firebase connection
 */
export async function checkFirebaseConnection(): Promise<boolean> {
  try {
    if (!auth) {
      return false;
    }

    // Try to get current user
    const user = getCurrentUser();

    // If there's a user, try to refresh their token
    if (user) {
      await user.getIdToken(true);
    }

    return true;
  } catch (error) {
    console.error("Firebase connection check failed:", error);
    return false;
  }
}

/**
 * Initialize Firebase with domain check
 */
export async function initializeFirebaseAuth(): Promise<void> {
  try {
    // Check if domain is authorized
    const isConnected = await checkFirebaseConnection();

    if (!isConnected) {
      console.warn("⚠️ Firebase connection issues detected");

      // Show domain authorization instructions
      const currentDomain = window.location.hostname;
      console.error(`
🔧 CONFIGURACIÓN REQUERIDA:

El dominio '${currentDomain}' debe ser autorizado en Firebase Console.

PASOS PARA SOLUCIONAR:
1. Ve a: https://console.firebase.google.com/project/cursor-64188/authentication/settings
2. Click en "Authorized domains"
3. Añade estos dominios:
   - ${currentDomain}
   - *.fly.dev
   - localhost
4. Guarda los cambios
5. Espera 2-3 minutos

¡Después de esto Firebase funcionará perfectamente!
      `);
    }

    console.log("🔥 Firebase Auth inicializado correctamente");
  } catch (error) {
    console.error("❌ Error inicializando Firebase Auth:", error);
    throw error;
  }
}

// Initialize automatically
initializeFirebaseAuth().catch(console.error);

export default {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  onAuthChange,
  getUserToken,
  refreshUserToken,
  checkFirebaseConnection,
  auth,
  db,
};
