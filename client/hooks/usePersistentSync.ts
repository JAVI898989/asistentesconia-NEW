/**
 * PERSISTENT SYNC REACT HOOK
 *
 * Hook que mantiene los datos sincronizados en tiempo real
 * y persiste el estado entre recargas de página.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { persistentSync } from "@/lib/persistentSync";
import type { SimpleAuthUser } from "@/lib/simpleAuth";

interface SyncState {
  user: SimpleAuthUser | null;
  userData: any;
  subscriptionData: any;
  isConnected: boolean;
  connectionState: "connected" | "disconnected" | "reconnecting";
  lastSync: number;
  isLoading: boolean;
}

interface PersistentSyncHook {
  syncState: SyncState;
  forceSync: () => Promise<void>;
  getSyncStatus: () => any;
  isOnline: boolean;
}

export function usePersistentSync(): PersistentSyncHook {
  const [syncState, setSyncState] = useState<SyncState>({
    user: null,
    userData: null,
    subscriptionData: null,
    isConnected: false,
    connectionState: "disconnected",
    lastSync: 0,
    isLoading: true,
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const eventListenersRef = useRef<Set<() => void>>(new Set());

  /**
   * Update sync state from persistent storage
   */
  const updateStateFromStorage = useCallback(() => {
    try {
      // Get persisted auth data
      const persistentAuth = localStorage.getItem("persistent_auth");
      const userData = localStorage.getItem("user_data");
      const subscriptionData = localStorage.getItem("user_subscription_data");

      const status = persistentSync.getSyncStatus();

      setSyncState((prev) => ({
        ...prev,
        user: persistentAuth ? JSON.parse(persistentAuth) : null,
        userData: userData ? JSON.parse(userData) : null,
        subscriptionData: subscriptionData
          ? JSON.parse(subscriptionData)
          : null,
        isConnected: status.isConnected,
        connectionState: status.connectionState as any,
        lastSync: status.lastHeartbeat,
        isLoading: false,
      }));
    } catch (error) {
      console.error("❌ Error updating state from storage:", error);
      setSyncState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Setup event listeners for real-time updates
   */
  useEffect(() => {
    console.log("🔄 Setting up persistent sync hook...");

    // Initial state update
    updateStateFromStorage();

    // Listen to custom events from persistent sync
    const handleUserDataChanged = (event: any) => {
      console.log("👤 User data changed:", event.detail);
      setSyncState((prev) => ({
        ...prev,
        userData: event.detail,
        lastSync: Date.now(),
      }));
    };

    const handleSubscriptionChanged = (event: any) => {
      console.log("💳 Subscription changed:", event.detail);
      setSyncState((prev) => ({
        ...prev,
        subscriptionData: event.detail,
        lastSync: Date.now(),
      }));
    };

    const handleAuthStateChanged = (event: any) => {
      console.log("🔐 Auth state changed:", event.detail);
      updateStateFromStorage();
    };

    // Add event listeners
    window.addEventListener("userDataChanged", handleUserDataChanged);
    window.addEventListener("subscriptionChanged", handleSubscriptionChanged);
    window.addEventListener("authStateChanged", handleAuthStateChanged);

    // Store cleanup functions
    const cleanup1 = () =>
      window.removeEventListener("userDataChanged", handleUserDataChanged);
    const cleanup2 = () =>
      window.removeEventListener(
        "subscriptionChanged",
        handleSubscriptionChanged,
      );
    const cleanup3 = () =>
      window.removeEventListener("authStateChanged", handleAuthStateChanged);

    eventListenersRef.current.add(cleanup1);
    eventListenersRef.current.add(cleanup2);
    eventListenersRef.current.add(cleanup3);

    // Listen to storage changes (for cross-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === "user_data" ||
        event.key === "user_subscription_data" ||
        event.key === "persistent_auth"
      ) {
        console.log("💾 Storage changed, updating state...");
        updateStateFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    eventListenersRef.current.add(() =>
      window.removeEventListener("storage", handleStorageChange),
    );

    // Listen to online/offline events
    const handleOnline = () => {
      console.log("🌐 Network online");
      setIsOnline(true);
      updateStateFromStorage();
    };

    const handleOffline = () => {
      console.log("📴 Network offline");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    eventListenersRef.current.add(() =>
      window.removeEventListener("online", handleOnline),
    );
    eventListenersRef.current.add(() =>
      window.removeEventListener("offline", handleOffline),
    );

    // Periodic state updates
    const interval = setInterval(() => {
      const status = persistentSync.getSyncStatus();
      setSyncState((prev) => ({
        ...prev,
        isConnected: status.isConnected,
        connectionState: status.connectionState as any,
        lastSync: status.lastHeartbeat,
      }));
    }, 5000); // Update every 5 seconds

    eventListenersRef.current.add(() => clearInterval(interval));

    // Cleanup on unmount
    return () => {
      eventListenersRef.current.forEach((cleanup) => cleanup());
      eventListenersRef.current.clear();
    };
  }, [updateStateFromStorage]);

  /**
   * Force synchronization
   */
  const forceSync = useCallback(async () => {
    console.log("🔄 Forcing sync from hook...");
    try {
      await persistentSync.forceSync();
      updateStateFromStorage();
    } catch (error) {
      console.error("❌ Force sync failed:", error);
    }
  }, [updateStateFromStorage]);

  /**
   * Get sync status
   */
  const getSyncStatus = useCallback(() => {
    return persistentSync.getSyncStatus();
  }, []);

  return {
    syncState,
    forceSync,
    getSyncStatus,
    isOnline,
  };
}

/**
 * Hook específico para datos de usuario
 */
export function useUserData() {
  const { syncState } = usePersistentSync();
  return {
    user: syncState.user,
    userData: syncState.userData,
    isLoading: syncState.isLoading,
    isConnected: syncState.isConnected,
  };
}

/**
 * Hook específico para datos de suscripción
 */
export function useSubscriptionData() {
  const { syncState } = usePersistentSync();
  return {
    subscription: syncState.subscriptionData,
    hasActiveSubscription:
      syncState.subscriptionData?.status === "active" ||
      syncState.subscriptionData?.status === "trialing",
    isLoading: syncState.isLoading,
    isConnected: syncState.isConnected,
  };
}

/**
 * Hook para estado de conexión
 */
export function useConnectionStatus() {
  const { syncState, isOnline } = usePersistentSync();
  return {
    isConnected: syncState.isConnected,
    connectionState: syncState.connectionState,
    isOnline,
    lastSync: syncState.lastSync,
  };
}

export default usePersistentSync;
