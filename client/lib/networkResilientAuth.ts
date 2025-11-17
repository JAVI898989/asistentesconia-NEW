import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  connectAuthEmulator
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Enhanced Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBywGWqSpzZ4BRxIoEnIQZhv3ObHvrLIC8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cursor-64188.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cursor-64188",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cursor-64188.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "657742231663",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:657742231663:web:9b6fce322922f3b6e0f59a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WMDEJ4MS3X",
};

// Network status tracking
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let connectionQuality = 'unknown';

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    console.log('🌐 Network: ONLINE');
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    console.log('🌐 Network: OFFLINE');
  });
}

// Initialize Firebase with enhanced error handling
let app: any;
let auth: any;
let db: any;
let storage: any;

const initializeFirebaseWithRetry = async (maxAttempts = 3): Promise<void> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔥 Firebase init attempt ${attempt}/${maxAttempts}`);
      
      // Check if already initialized
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      
      // Test connection with a simple operation
      await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        }, reject);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          unsubscribe();
          reject(new Error('Auth state check timeout'));
        }, 10000);
      });
      
      console.log("✅ Firebase initialized and tested successfully");
      return;
      
    } catch (error) {
      console.error(`❌ Firebase init attempt ${attempt} failed:`, error);
      
      if (attempt === maxAttempts) {
        throw new Error(`Firebase initialization failed after ${maxAttempts} attempts: ${error}`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};

// Initialize Firebase
try {
  await initializeFirebaseWithRetry();
} catch (error) {
  console.error("❌ Firebase initialization failed completely:", error);
}

// Enhanced error messages
const getErrorMessage = (errorCode: string): string => {
  const messages: Record<string, string> = {
    "auth/user-not-found": "No existe una cuenta con este email",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/invalid-login-credentials": "Email o contraseña incorrectos",
    "auth/invalid-email": "Email inválido",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
    "auth/too-many-requests": "Demasiados intentos fallidos. Espera 15 minutos",
    "auth/network-request-failed": "Error de conexión. Verifica tu internet y reintenta",
    "auth/email-already-in-use": "Ya existe una cuenta con este email",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
    "auth/timeout": "Conexión muy lenta. Reintenta en unos momentos",
    "auth/unavailable": "Servicio temporalmente no disponible",
  };

  return messages[errorCode] || `Error de autenticación (${errorCode}). Intenta de nuevo`;
};

// Network-resilient login with retry logic
export const loginUserResilient = async (email: string, password: string): Promise<User> => {
  console.log("🔐 Network-resilient login attempt:", email);

  if (!email || !password) {
    throw new Error("Email y contraseña son requeridos");
  }

  if (!auth) {
    throw new Error("Firebase no está inicializado. Recarga la página");
  }

  // Check network status
  if (!isOnline) {
    throw new Error("Sin conexión a internet. Verifica tu red");
  }

  const maxAttempts = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 Login attempt ${attempt}/${maxAttempts}`);
      
      // Create a promise that rejects after timeout
      const loginPromise = signInWithEmailAndPassword(auth, email, password);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('auth/timeout')), 15000)
      );
      
      // Race between login and timeout
      const userCredential = await Promise.race([loginPromise, timeoutPromise]);
      
      console.log("✅ Login successful:", (userCredential as any).user.email);
      return (userCredential as any).user;
      
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Login attempt ${attempt} failed:`, error.code, error.message);
      
      // If it's a network error and we have attempts left, retry
      if ((error.code === 'auth/network-request-failed' || error.message.includes('timeout')) && attempt < maxAttempts) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If it's not a retryable error, break
      if (!['auth/network-request-failed', 'auth/timeout'].includes(error.code)) {
        break;
      }
    }
  }
  
  throw new Error(getErrorMessage(lastError?.code || 'auth/network-request-failed'));
};

// Network diagnostics
export const runNetworkDiagnostics = async (): Promise<string[]> => {
  const results: string[] = [];
  
  // Basic connectivity
  results.push(`🌐 Browser online: ${isOnline ? '✅' : '❌'}`);
  
  // Test Firebase domains
  const testDomains = [
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com',
    `https://${firebaseConfig.authDomain}`
  ];
  
  for (const domain of testDomains) {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000);
      
      await fetch(domain, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      results.push(`🔥 ${domain}: ✅`);
    } catch (error) {
      results.push(`🔥 ${domain}: ❌ ${error}`);
    }
  }
  
  return results;
};

// Quick connection test
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    if (!auth) return false;
    
    // Try to get the current user (should be fast)
    const currentUser = auth.currentUser;
    console.log('🔍 Connection test:', currentUser ? 'Has user' : 'No user');
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
};

// Export original functions as fallbacks
export { loginUser } from './simpleAuth';
export { auth, db, storage };

// Export enhanced functions as defaults
export const login = loginUserResilient;
export const diagnose = runNetworkDiagnostics;
export const testConnection = testFirebaseConnection;
