import { auth, fetchUserData, type SimpleAuthUser } from "./simpleAuth";

interface SyncStatus {
  isConnected: boolean;
  connectionState: "connected" | "disconnected" | "reconnecting";
  lastHeartbeat: number;
  error?: string;
}

interface StoredAuthData {
  uid: string;
  email: string | null;
  lastSignIn: number;
}

const PERSISTENT_AUTH_KEY = "persistent_auth";
const USER_DATA_KEY = "user_data";
const USER_SUBSCRIPTION_KEY = "user_subscription_data";

class PersistentSyncManager {
  private static instance: PersistentSyncManager;

  private isInitialized = false;
  private authUnsubscribe: (() => void) | null = null;
  private currentUser: SimpleAuthUser | null = null;
  private lastHeartbeat = 0;
  private connectionState: SyncStatus["connectionState"] = "disconnected";

  static getInstance(): PersistentSyncManager {
    if (!PersistentSyncManager.instance) {
      PersistentSyncManager.instance = new PersistentSyncManager();
    }
    return PersistentSyncManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    this.authUnsubscribe = auth.onAuthStateChanged(async (user) => {
      this.currentUser = user;

      if (user) {
        await this.handleSignIn(user);
      } else {
        this.handleSignOut();
      }
    });

    this.restoreCurrentState();
    this.isInitialized = true;
  }

  destroy(): void {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
      this.authUnsubscribe = null;
    }

    this.isInitialized = false;
  }

  async forceSync(): Promise<void> {
    if (!this.currentUser) {
      return;
    }

    await this.syncRemoteState(this.currentUser);
  }

  getSyncStatus(): SyncStatus {
    return {
      isConnected: !!this.currentUser,
      connectionState: this.connectionState,
      lastHeartbeat: this.lastHeartbeat,
    };
  }

  private restoreCurrentState(): void {
    try {
      const cachedAuth = localStorage.getItem(PERSISTENT_AUTH_KEY);
      const cachedUserData = localStorage.getItem(USER_DATA_KEY);
      const cachedSubscription = localStorage.getItem(USER_SUBSCRIPTION_KEY);

      if (cachedAuth) {
        const parsed = JSON.parse(cachedAuth) as StoredAuthData;
        window.dispatchEvent(
          new CustomEvent("authStateChanged", { detail: parsed }),
        );
      }

      if (cachedUserData) {
        window.dispatchEvent(
          new CustomEvent("userDataChanged", {
            detail: JSON.parse(cachedUserData),
          }),
        );
      }

      if (cachedSubscription) {
        window.dispatchEvent(
          new CustomEvent("subscriptionChanged", {
            detail: JSON.parse(cachedSubscription),
          }),
        );
      }
    } catch (error) {
      console.warn("⚠️ No se pudo restaurar el estado persistente de Nhost:", error);
    }
  }

  private async handleSignIn(user: SimpleAuthUser): Promise<void> {
    const authSnapshot: StoredAuthData = {
      uid: user.id,
      email: user.email ?? null,
      lastSignIn: Date.now(),
    };

    localStorage.setItem(PERSISTENT_AUTH_KEY, JSON.stringify(authSnapshot));
    window.dispatchEvent(
      new CustomEvent("authStateChanged", { detail: authSnapshot }),
    );

    await this.syncRemoteState(user);
  }

  private handleSignOut(): void {
    this.connectionState = "disconnected";
    this.lastHeartbeat = Date.now();

    localStorage.removeItem(PERSISTENT_AUTH_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(USER_SUBSCRIPTION_KEY);

    window.dispatchEvent(new CustomEvent("authStateChanged", { detail: null }));
    window.dispatchEvent(new CustomEvent("userDataChanged", { detail: null }));
    window.dispatchEvent(
      new CustomEvent("subscriptionChanged", { detail: null }),
    );
  }

  private async syncRemoteState(user: SimpleAuthUser): Promise<void> {
    try {
      this.connectionState = "reconnecting";
      const profile = await fetchUserData(user.id);

      localStorage.setItem(USER_DATA_KEY, JSON.stringify(profile));
      window.dispatchEvent(
        new CustomEvent("userDataChanged", { detail: profile }),
      );

      const subscription = profile?.subscriptions?.[0] ?? null;
      if (subscription) {
        localStorage.setItem(
          USER_SUBSCRIPTION_KEY,
          JSON.stringify(subscription),
        );
      } else {
        localStorage.removeItem(USER_SUBSCRIPTION_KEY);
      }

      window.dispatchEvent(
        new CustomEvent("subscriptionChanged", { detail: subscription }),
      );

      this.connectionState = "connected";
      this.lastHeartbeat = Date.now();
    } catch (error) {
      console.error("❌ Error sincronizando datos con Nhost:", error);
      this.connectionState = "disconnected";
      this.lastHeartbeat = Date.now();
    }
  }
}

export const persistentSync = PersistentSyncManager.getInstance();
persistentSync.initialize().catch((error) => {
  console.error("❌ No se pudo iniciar persistentSync:", error);
});

(window as any).persistentSync = persistentSync;

export default persistentSync;
