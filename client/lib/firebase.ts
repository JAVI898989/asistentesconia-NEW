import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseOptions } from "firebase/app";
import type { AuthError } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBywGWqSpzZ4BRxIoEnIQZhv3ObHvrLIC8",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "cursor-64188.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    "cursor-64188",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "cursor-64188.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    "657742231663",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:657742231663:web:9b6fce322922f3b6e0f59a",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
    "G-WMDEJ4MS3X",
};

const isBrowser = typeof window !== "undefined";

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const TEMP_AUTH_KEY = "tempAuthMode";
const DEMO_USER_KEY = "demoUser";
const DEMO_MODE_KEY = "demoModeActive";

export const safeFirebaseOperation = async <T>(
  operation: () => Promise<T>,
) => {
  try {
    return await operation();
  } catch (error) {
    handleFirebaseError(error);
    throw error;
  }
};

export const handleFirebaseError = (error: any) => {
  const code = error?.code as string | undefined;
  const message = error?.message as string | undefined;

  console.warn("🔥 Firebase error detected", { code, message });

  if (!code) {
    return;
  }

  if (code.includes("auth/network-request-failed")) {
    enableTempAuthMode();
  }
};

const enableTempAuthMode = () => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(TEMP_AUTH_KEY, "true");
  } catch (error) {
    console.warn("Unable to persist temp auth mode", error);
  }
};

export const isTempAuthMode = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(TEMP_AUTH_KEY) === "true";
};

export const clearTempAuth = (): void => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(TEMP_AUTH_KEY);
  } catch (error) {
    console.warn("Failed to clear temp auth mode", error);
  }
};

export const isDemoModeActive = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(DEMO_MODE_KEY) === "true";
};

export const getDemoUser = (): User | null => {
  if (!isBrowser) return null;
  try {
    const stored = localStorage.getItem(DEMO_USER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.uid && parsed?.email) {
        return parsed as User;
      }
    }
  } catch (error) {
    console.warn("Failed to parse demo user", error);
  }

  return {
    uid: "demo-user",
    email: "demo@flare.ai",
    displayName: "Demo User",
  } as unknown as User;
};

export const onAuthStateChangedEnhanced = (
  callback: (user: User | null) => void,
  errorCallback?: (error: AuthError) => void,
) => onAuthStateChanged(auth, callback, errorCallback);

export const loginUserDirect = async (email: string, password: string) => {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  const token = await credentials.user.getIdToken();

  return {
    user: credentials.user,
    token,
  };
};

export const logoutDirect = async () => {
  await signOut(auth);
};

export const getDomainAuthInstructions = () => {
  const currentDomain = isBrowser ? window.location.hostname : "";
  return `Añade el dominio "${currentDomain}" en Firebase Console → Authentication → Settings → Authorized Domains.`;
};
