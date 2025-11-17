/**
 * Comprehensive Firebase Service
 *
 * This service handles all Firebase operations with robust error handling,
 * automatic retries, offline support, and Stripe synchronization.
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
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";

// Firebase configuration with environment fallbacks
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBywGWqSpzZ4BRxIoEnIQZhv3ObHvrLIC8",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cursor-64188.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cursor-64188",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cursor-64188.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "657742231663",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:657742231663:web:9b6fce322922f3b6e0f59a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WMDEJ4MS3X",
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
  console.error("❌ Firebase initialization error:", error);
}

// Types for better TypeScript support
interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastLogin: string;
  subscriptionStatus?: "active" | "inactive" | "trial";
  stripeCustomerId?: string;
  courses?: string[];
  assistants?: string[];
}

interface Course {
  id: string;
  name: string;
  description: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

interface StripeSubscription {
  id: string;
  customerId: string;
  status: string;
  priceId: string;
  productId: string;
  userId: string;
}

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // ms

// Utility function for retrying operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  attempts: number = RETRY_ATTEMPTS,
  delay: number = RETRY_DELAY,
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);

      if (i === attempts - 1) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error("All retry attempts failed");
}

// Offline data storage
class OfflineStorage {
  private static readonly PREFIX = "firebase_offline_";

  static save(key: string, data: any): void {
    try {
      localStorage.setItem(
        `${this.PREFIX}${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.warn("Failed to save offline data:", error);
    }
  }

  static load(key: string): any {
    try {
      const stored = localStorage.getItem(`${this.PREFIX}${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data;
      }
    } catch (error) {
      console.warn("Failed to load offline data:", error);
    }
    return null;
  }

  static clear(key: string): void {
    localStorage.removeItem(`${this.PREFIX}${key}`);
  }

  static getPendingOperations(): any[] {
    const operations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.PREFIX}pending_`)) {
        const data = this.load(key.replace(this.PREFIX, ""));
        if (data) operations.push(data);
      }
    }
    return operations;
  }
}

// Main Firebase Service Class
export class FirebaseService {
  private static instance: FirebaseService;
  private isOnline: boolean = navigator.onLine;
  private pendingOperations: any[] = [];

  constructor() {
    this.setupOnlineOfflineListeners();
    this.setupPeriodicSync();
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private setupOnlineOfflineListeners(): void {
    window.addEventListener("online", () => {
      console.log("🌐 Connection restored");
      this.isOnline = true;
      this.syncPendingOperations();
    });

    window.addEventListener("offline", () => {
      console.log("📴 Connection lost - switching to offline mode");
      this.isOnline = false;
    });
  }

  private setupPeriodicSync(): void {
    // Sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline) {
        this.syncPendingOperations();
      }
    }, 30000);
  }

  private async syncPendingOperations(): Promise<void> {
    const operations = OfflineStorage.getPendingOperations();

    for (const operation of operations) {
      try {
        await this.executeOperation(operation);
        OfflineStorage.clear(`pending_${operation.id}`);
      } catch (error) {
        console.warn("Failed to sync operation:", operation, error);
      }
    }
  }

  private async executeOperation(operation: any): Promise<any> {
    switch (operation.type) {
      case "setDoc":
        return await setDoc(
          doc(db, operation.collection, operation.id),
          operation.data,
        );
      case "updateDoc":
        return await updateDoc(
          doc(db, operation.collection, operation.id),
          operation.data,
        );
      case "addDoc":
        return await addDoc(
          collection(db, operation.collection),
          operation.data,
        );
      case "deleteDoc":
        return await deleteDoc(doc(db, operation.collection, operation.id));
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  }

  // Authentication Methods
  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: User; userData: UserData }> {
    return retryOperation(async () => {
      try {
        // Try Firebase Auth first
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        // Get or create user data
        const userData =
          (await this.getUserData(user.uid)) ||
          (await this.createUserData(user));

        // Update last login
        await this.updateUserData(user.uid, {
          lastLogin: new Date().toISOString(),
        });

        console.log("✅ Authentication successful");
        return { user, userData };
      } catch (error: any) {
        console.error("Firebase Auth failed:", {
          message: error?.message,
          code: error?.code,
          name: error?.name
        });

        // Try direct API method as fallback
        if (error.code === "auth/network-request-failed") {
          return await this.signInDirect(email, password);
        }

        throw this.handleAuthError(error);
      }
    });
  }

  private async signInDirect(
    email: string,
    password: string,
  ): Promise<{ user: User; userData: UserData }> {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Authentication failed");
    }

    // Create user object
    const user = {
      uid: data.localId,
      email: data.email,
      getIdToken: () => Promise.resolve(data.idToken),
    } as User;

    // Store token locally
    localStorage.setItem("firebaseToken", data.idToken);
    localStorage.setItem("firebaseUserId", data.localId);

    const userData =
      (await this.getUserData(user.uid)) || (await this.createUserData(user));

    return { user, userData };
  }

  async signUp(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<{ user: User; userData: UserData }> {
    return retryOperation(async () => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userData = await this.createUserData(user, displayName);

      // Sync with Stripe
      await this.createStripeCustomer(user.uid, email, displayName);

      return { user, userData };
    });
  }

  async signOut(): Promise<void> {
    await signOut(auth);
    localStorage.removeItem("firebaseToken");
    localStorage.removeItem("firebaseUserId");
    OfflineStorage.clear("currentUser");
  }

  private handleAuthError(error: any): Error {
    const errorMessages: { [key: string]: string } = {
      "auth/user-not-found": "No existe una cuenta con este email",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
      "auth/too-many-requests":
        "Demasiados intentos fallidos. Intenta más tarde",
      "auth/network-request-failed": "Error de conexión. Verifica tu internet",
      "auth/invalid-credential": "Credenciales inválidas",
    };

    return new Error(
      errorMessages[error.code] || error.message || "Error de autenticación",
    );
  }

  // User Data Methods
  async getUserData(uid: string): Promise<UserData | null> {
    try {
      if (!this.isOnline) {
        return OfflineStorage.load(`user_${uid}`);
      }

      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        OfflineStorage.save(`user_${uid}`, data);
        return data;
      }

      return null;
    } catch (error) {
      console.warn("Failed to get user data:", error);
      return OfflineStorage.load(`user_${uid}`);
    }
  }

  async createUserData(user: User, displayName?: string): Promise<UserData> {
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || user.displayName || "",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      subscriptionStatus: "trial",
      courses: [],
      assistants: [],
    };

    await this.saveUserData(userData);
    return userData;
  }

  async updateUserData(uid: string, updates: Partial<UserData>): Promise<void> {
    const operation = {
      id: `user_update_${Date.now()}`,
      type: "updateDoc",
      collection: "users",
      docId: uid,
      data: { ...updates, updatedAt: new Date().toISOString() },
    };

    if (this.isOnline) {
      try {
        await this.executeOperation(operation);

        // Update offline cache
        const currentData = OfflineStorage.load(`user_${uid}`) || {};
        OfflineStorage.save(`user_${uid}`, { ...currentData, ...updates });
      } catch (error) {
        console.warn("Failed to update user data, queuing for later:", error);
        OfflineStorage.save(`pending_${operation.id}`, operation);
      }
    } else {
      OfflineStorage.save(`pending_${operation.id}`, operation);
    }
  }

  async saveUserData(userData: UserData): Promise<void> {
    const operation = {
      id: `user_save_${Date.now()}`,
      type: "setDoc",
      collection: "users",
      docId: userData.uid,
      data: userData,
    };

    if (this.isOnline) {
      try {
        await this.executeOperation(operation);
        OfflineStorage.save(`user_${userData.uid}`, userData);
      } catch (error) {
        console.warn("Failed to save user data, queuing for later:", error);
        OfflineStorage.save(`pending_${operation.id}`, operation);
      }
    } else {
      OfflineStorage.save(`pending_${operation.id}`, operation);
      OfflineStorage.save(`user_${userData.uid}`, userData);
    }
  }

  // Course and Content Methods
  async saveCourse(course: Course): Promise<void> {
    const operation = {
      id: `course_save_${Date.now()}`,
      type: "setDoc",
      collection: "courses",
      docId: course.id,
      data: { ...course, updatedAt: new Date().toISOString() },
    };

    if (this.isOnline) {
      try {
        await this.executeOperation(operation);
        console.log(`✅ Course ${course.name} saved to Firebase`);
      } catch (error) {
        console.warn("Failed to save course, queuing for later:", error);
        OfflineStorage.save(`pending_${operation.id}`, operation);
      }
    } else {
      OfflineStorage.save(`pending_${operation.id}`, operation);
    }

    // Always save to offline storage
    OfflineStorage.save(`course_${course.id}`, course);
  }

  async getCourse(courseId: string): Promise<Course | null> {
    try {
      if (!this.isOnline) {
        return OfflineStorage.load(`course_${courseId}`);
      }

      const courseDoc = await getDoc(doc(db, "courses", courseId));

      if (courseDoc.exists()) {
        const course = courseDoc.data() as Course;
        OfflineStorage.save(`course_${courseId}`, course);
        return course;
      }

      return null;
    } catch (error) {
      console.warn(
        "Failed to get course from Firebase, trying offline:",
        error,
      );
      return OfflineStorage.load(`course_${courseId}`);
    }
  }

  async saveTemario(courseId: string, temario: any): Promise<void> {
    const operation = {
      id: `temario_save_${Date.now()}`,
      type: "setDoc",
      collection: "temarios",
      docId: courseId,
      data: {
        courseId,
        temario,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    if (this.isOnline) {
      try {
        await this.executeOperation(operation);
        console.log(`✅ Temario for course ${courseId} saved to Firebase`);
      } catch (error) {
        console.warn("Failed to save temario, queuing for later:", error);
        OfflineStorage.save(`pending_${operation.id}`, operation);
      }
    } else {
      OfflineStorage.save(`pending_${operation.id}`, operation);
    }

    OfflineStorage.save(`temario_${courseId}`, temario);
  }

  // Stripe Integration Methods
  async createStripeCustomer(
    userId: string,
    email: string,
    name?: string,
  ): Promise<void> {
    try {
      const response = await fetch("/api/stripe/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, name }),
      });

      const { customerId } = await response.json();

      if (customerId) {
        await this.updateUserData(userId, { stripeCustomerId: customerId });
        console.log(`✅ Stripe customer created: ${customerId}`);
      }
    } catch (error) {
      console.warn("Failed to create Stripe customer:", error);
    }
  }

  async syncStripeSubscription(
    subscriptionData: StripeSubscription,
  ): Promise<void> {
    const operation = {
      id: `stripe_sync_${Date.now()}`,
      type: "setDoc",
      collection: "subscriptions",
      docId: subscriptionData.id,
      data: {
        ...subscriptionData,
        syncedAt: new Date().toISOString(),
      },
    };

    if (this.isOnline) {
      try {
        await this.executeOperation(operation);

        // Update user subscription status
        await this.updateUserData(subscriptionData.userId, {
          subscriptionStatus: subscriptionData.status as any,
        });

        console.log(`✅ Stripe subscription synced: ${subscriptionData.id}`);
      } catch (error) {
        console.warn(
          "Failed to sync Stripe subscription, queuing for later:",
          error,
        );
        OfflineStorage.save(`pending_${operation.id}`, operation);
      }
    } else {
      OfflineStorage.save(`pending_${operation.id}`, operation);
    }
  }

  // Health Check and Diagnostics
  async healthCheck(): Promise<{
    firebase: boolean;
    firestore: boolean;
    auth: boolean;
  }> {
    const results = {
      firebase: false,
      firestore: false,
      auth: false,
    };

    try {
      // Test Firebase connection
      if (app) {
        results.firebase = true;
      }

      // Test Firestore connection
      await getDoc(doc(db, "_health", "check"));
      results.firestore = true;
    } catch (error) {
      console.warn("Firestore health check failed:", error);
    }

    try {
      // Test Auth connection
      if (auth && auth.currentUser !== undefined) {
        results.auth = true;
      }
    } catch (error) {
      console.warn("Auth health check failed:", error);
    }

    return results;
  }

  // Auto-save functionality for content creation
  enableAutoSave(courseId: string): void {
    let saveTimeout: NodeJS.Timeout;

    const autoSave = (content: any) => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        this.saveCourse({
          id: courseId,
          name: content.name || "Auto-saved Course",
          description: content.description || "",
          content,
          createdAt: content.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: auth?.currentUser?.uid || "anonymous",
        });
      }, 2000); // Save 2 seconds after last change
    };

    // Store auto-save function globally for access
    (window as any).firebaseAutoSave = autoSave;
  }

  // Public method to execute operations from external components
  async executeOperationPublic(operation: any): Promise<any> {
    return await this.executeOperation(operation);
  }
}

// Export singleton instance
export const firebaseService = FirebaseService.getInstance();

// Export auth and db for backward compatibility
export { auth, db };

// Auto-initialize health monitoring
firebaseService.healthCheck().then((health) => {
  console.log("🏥 Firebase Health Check:", health);
});

// Export for direct use
export default firebaseService;
