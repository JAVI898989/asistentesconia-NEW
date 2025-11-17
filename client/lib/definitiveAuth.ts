/**
 * CLEAN FIREBASE AUTHENTICATION SYSTEM
 *
 * Sistema de autenticación Firebase limpio y real para producción
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  getIdTokenResult,
  onIdTokenChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

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
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

// Connection state
let connectionState = {
  isConnected: false,
  lastHeartbeat: 0,
  reconnectAttempts: 0,
  userListeners: new Map(),
};

/**
 * Initialize clean authentication system
 */
export async function initializeAuth(): Promise<void> {
  console.log("🚀 Initializing clean auth system...");

  try {
    // Setup persistent auth listener
    setupPersistentAuthListener();

    // Setup connection monitoring
    setupConnectionMonitoring();

    // Setup automatic token refresh
    setupTokenRefresh();

    // Setup heartbeat
    setupHeartbeat();

    console.log("✅ Clean auth system initialized");
  } catch (error) {
    console.error("❌ Failed to initialize auth system:", error);
  }
}

/**
 * Setup persistent authentication listener
 */
function setupPersistentAuthListener(): void {
  console.log("🔐 Setting up persistent auth listener...");

  // Main auth state listener
  onAuthStateChanged(auth, async (user) => {
    console.log("🔄 Auth state changed:", user ? user.email : "No user");

    if (user) {
      await handleUserSignIn(user);
    } else {
      handleUserSignOut();
    }

    // Update connection state
    connectionState.isConnected = !!user;
    connectionState.lastHeartbeat = Date.now();

    // Emit custom event for UI updates
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { user, isConnected: !!user },
      }),
    );
  });

  // Token change listener for automatic refresh
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      try {
        const tokenResult = await getIdTokenResult(user);

        // Store token persistently
        localStorage.setItem("firebase_token", tokenResult.token);
        localStorage.setItem(
          "firebase_token_expires",
          tokenResult.expirationTime,
        );

        console.log("🔑 Token refreshed automatically");
      } catch (error) {
        console.error("❌ Token refresh failed:", error);
      }
    }
  });
}

/**
 * Handle user sign in
 */
async function handleUserSignIn(user: User): Promise<void> {
  console.log("👤 Handling user sign in:", user.email);

  try {
    // Store auth data persistently
    const authData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      lastSignIn: Date.now(),
    };

    localStorage.setItem("persistent_auth", JSON.stringify(authData));

    // Get or create user document
    await createOrUpdateUserDocument(user);

    // Setup real-time user data sync
    setupUserDataSync(user.uid);

    // Setup subscription sync
    setupSubscriptionSync(user.uid);

    // Update connection state
    connectionState.isConnected = true;
    connectionState.lastHeartbeat = Date.now();
    connectionState.reconnectAttempts = 0;

    console.log("✅ User sign in handled successfully");
  } catch (error) {
    console.error("❌ Error handling user sign in:", error);
  }
}

/**
 * Handle user sign out
 */
function handleUserSignOut(): void {
  console.log("👋 Handling user sign out");

  // Clear persistent data
  localStorage.removeItem("persistent_auth");
  localStorage.removeItem("firebase_token");
  localStorage.removeItem("firebase_token_expires");
  localStorage.removeItem("user_data");
  localStorage.removeItem("user_subscription_data");

  // Clear all user listeners
  connectionState.userListeners.forEach((unsubscribe) => {
    try {
      unsubscribe();
    } catch (error) {
      console.warn("Error unsubscribing:", error);
    }
  });
  connectionState.userListeners.clear();

  // Update connection state
  connectionState.isConnected = false;

  console.log("✅ User sign out handled");
}

/**
 * Create or update user document
 */
async function createOrUpdateUserDocument(user: User): Promise<void> {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      subscriptionStatus: "inactive",
      hasAccess: false,
      lastLogin: serverTimestamp(),
      connectedAt: serverTimestamp(),
      ...(userDoc.exists() ? userDoc.data() : {}),
    };

    await setDoc(userDocRef, userData, { merge: true });
    console.log("✅ User document updated");
  } catch (error) {
    console.error("❌ Error updating user document:", error);
  }
}

/**
 * Setup real-time user data synchronization
 */
function setupUserDataSync(userId: string): void {
  console.log("📄 Setting up user data sync for:", userId);

  const userDocRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(
    userDocRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log("🔄 User data updated:", userData);

        // Store locally
        localStorage.setItem("user_data", JSON.stringify(userData));

        // Emit event
        window.dispatchEvent(
          new CustomEvent("userDataChanged", {
            detail: userData,
          }),
        );

        // Update heartbeat
        connectionState.lastHeartbeat = Date.now();
      }
    },
    (error) => {
      console.error("❌ User data sync error:", error);
      handleSyncError(error);
    },
  );

  connectionState.userListeners.set("userData", unsubscribe);
}

/**
 * Setup subscription synchronization
 */
function setupSubscriptionSync(userId: string): void {
  console.log("💳 Setting up subscription sync for:", userId);

  const subscriptionDocRef = doc(db, "subscriptions", userId);

  const unsubscribe = onSnapshot(
    subscriptionDocRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const subscriptionData = docSnapshot.data();
        console.log("🔄 Subscription data updated:", subscriptionData);

        // Store locally
        localStorage.setItem(
          "user_subscription_data",
          JSON.stringify(subscriptionData),
        );

        // Update user document with subscription status
        updateUserSubscriptionStatus(userId, subscriptionData);

        // Emit event
        window.dispatchEvent(
          new CustomEvent("subscriptionChanged", {
            detail: subscriptionData,
          }),
        );
      } else {
        console.log("ℹ️ No subscription found");
        localStorage.removeItem("user_subscription_data");
      }
    },
    (error) => {
      console.error("❌ Subscription sync error:", error);
      handleSyncError(error);
    },
  );

  connectionState.userListeners.set("subscription", unsubscribe);
}

/**
 * Update user subscription status
 */
async function updateUserSubscriptionStatus(
  userId: string,
  subscriptionData: any,
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      subscriptionStatus: subscriptionData.status,
      subscriptionId: subscriptionData.id,
      hasAccess: ["active", "trialing"].includes(subscriptionData.status),
      lastSync: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error updating subscription status:", error);
  }
}

/**
 * Setup connection monitoring
 */
function setupConnectionMonitoring(): void {
  console.log("📡 Setting up connection monitoring...");

  // Check connection every 30 seconds
  setInterval(() => {
    const now = Date.now();
    const timeSinceLastHeartbeat = now - connectionState.lastHeartbeat;

    if (timeSinceLastHeartbeat > 60000) {
      // No heartbeat in 60 seconds
      console.warn("⚠️ Connection health check failed");
      attemptReconnection();
    }
  }, 30000);

  // Network listeners
  window.addEventListener("online", () => {
    console.log("🌐 Network online");
    attemptReconnection();
  });

  window.addEventListener("offline", () => {
    console.log("📴 Network offline");
    connectionState.isConnected = false;
  });
}

/**
 * Attempt reconnection
 */
async function attemptReconnection(): Promise<void> {
  if (connectionState.reconnectAttempts >= 3) {
    console.warn("⚠️ Max reconnection attempts reached");
    return;
  }

  connectionState.reconnectAttempts++;
  console.log(
    `🔄 Attempting reconnection #${connectionState.reconnectAttempts}`,
  );

  try {
    // Try to refresh current user token
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true);
      connectionState.isConnected = true;
      connectionState.lastHeartbeat = Date.now();
      connectionState.reconnectAttempts = 0;
      console.log("✅ Reconnection successful");
    }
  } catch (error) {
    console.error("❌ Reconnection failed:", error);
    // Retry in 5 seconds
    setTimeout(attemptReconnection, 5000);
  }
}

/**
 * Setup automatic token refresh
 */
function setupTokenRefresh(): void {
  console.log("🔑 Setting up token refresh...");

  // Refresh token every 50 minutes
  setInterval(
    async () => {
      if (auth.currentUser) {
        try {
          const newToken = await auth.currentUser.getIdToken(true);
          localStorage.setItem("firebase_token", newToken);
          console.log("🔄 Token refreshed");
        } catch (error) {
          console.error("❌ Token refresh failed:", error);
        }
      }
    },
    50 * 60 * 1000,
  ); // 50 minutes
}

/**
 * Setup heartbeat system
 */
function setupHeartbeat(): void {
  console.log("💓 Setting up heartbeat...");

  setInterval(() => {
    if (auth.currentUser && connectionState.isConnected) {
      updateHeartbeat();
    }
  }, 30000); // Every 30 seconds
}

/**
 * Update heartbeat
 */
async function updateHeartbeat(): Promise<void> {
  if (!auth.currentUser) return;

  try {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      lastHeartbeat: serverTimestamp(),
      connectionState: "connected",
    });

    connectionState.lastHeartbeat = Date.now();
  } catch (error) {
    // Heartbeat failures should not spam logs
  }
}

/**
 * Handle sync errors
 */
function handleSyncError(error: any): void {
  console.error("🔥 Sync error:", error);

  if (error.code === "unavailable") {
    setTimeout(attemptReconnection, 2000);
  } else if (error.code === "permission-denied") {
    if (auth.currentUser) {
      auth.currentUser.getIdToken(true);
    }
  }
}

/**
 * Login with user credentials
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  console.log("🔐 Attempting login with:", email);

  if (!email || !password) {
    throw new Error("Email y contraseña son requeridos");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("✅ Login successful");
    return userCredential.user;
  } catch (error: any) {
    console.error("❌ Login failed:", error);

    // Map Firebase errors to user-friendly messages
    const errorMessages: { [key: string]: string } = {
      "auth/user-not-found": "No existe una cuenta con este email",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/invalid-login-credentials": "Email o contraseña incorrectos",
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
      "auth/too-many-requests": "Demasiados intentos. Espera unos minutos",
      "auth/network-request-failed": "Error de conexión. Verifica tu internet",
      "auth/unauthorized-domain": `El dominio ${window.location.hostname} no está autorizado. Configúralo en Firebase Console`,
    };

    throw new Error(errorMessages[error.code] || error.message);
  }
}

/**
 * Register new user
 */
export async function registerUser(
  email: string,
  password: string,
): Promise<User> {
  console.log("📝 Attempting registration with:", email);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("✅ Registration successful");
    return userCredential.user;
  } catch (error: any) {
    console.error("❌ Registration failed:", error);

    const errorMessages: { [key: string]: string } = {
      "auth/email-already-in-use": "Ya existe una cuenta con este email",
      "auth/invalid-email": "Email inválido",
      "auth/weak-password": "La contraseña es muy débil",
      "auth/network-request-failed": "Error de conexión. Verifica tu internet",
    };

    throw new Error(errorMessages[error.code] || error.message);
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log("✅ Logout successful");
  } catch (error: any) {
    console.error("❌ Logout failed:", error);
    throw new Error(`Error al cerrar sesión: ${error.message}`);
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth?.currentUser || null;
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
  return onAuthStateChanged(auth, callback);
}

/**
 * Get connection status
 */
export function getConnectionStatus(): {
  isConnected: boolean;
  lastHeartbeat: number;
  reconnectAttempts: number;
} {
  return {
    isConnected: connectionState.isConnected,
    lastHeartbeat: connectionState.lastHeartbeat,
    reconnectAttempts: connectionState.reconnectAttempts,
  };
}

/**
 * Force synchronization
 */
export async function forceSync(): Promise<void> {
  console.log("🔄 Forcing synchronization...");

  if (auth.currentUser) {
    try {
      // Refresh token
      await auth.currentUser.getIdToken(true);

      // Update user document
      await createOrUpdateUserDocument(auth.currentUser);

      console.log("✅ Force sync completed");
    } catch (error) {
      console.error("❌ Force sync failed:", error);
    }
  }
}

// Auto-initialize
initializeAuth().catch(console.error);

export { auth, db };
