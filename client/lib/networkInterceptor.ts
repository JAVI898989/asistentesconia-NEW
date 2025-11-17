// Network interceptor to force offline mode and prevent all NetworkErrors

// Store original fetch
const originalFetch = window.fetch;

// Flag to track if offline mode is active
let offlineModeActive = false;

// Activate offline mode immediately
export const activateOfflineMode = () => {
  offlineModeActive = true;
  console.log("🚨 OFFLINE MODE ACTIVATED - All network calls will be blocked");

  // Override fetch to prevent any network calls
  window.fetch = (...args) => {
    console.log("🚫 FETCH BLOCKED - Offline mode active:", args[0]);
    return Promise.reject(new Error("Network disabled - Offline mode active"));
  };

  // Override XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = class extends originalXHR {
    open(...args: any[]) {
      console.log("🚫 XHR BLOCKED - Offline mode active:", args[1]);
      throw new Error("Network disabled - Offline mode active");
    }
  } as any;

  // Set localStorage flag
  localStorage.setItem("forceOfflineMode", "true");
};

// Check if offline mode should be forced
export const shouldForceOfflineMode = () => {
  return (
    localStorage.getItem("forceOfflineMode") === "true" || offlineModeActive
  );
};

// Initialize offline mode immediately
export const initializeOfflineMode = () => {
  console.log("🔥 INITIALIZING FORCED OFFLINE MODE");
  activateOfflineMode();

  // Auto-setup offline authentication
  setupOfflineAuth();
};

// Setup offline authentication automatically
const setupOfflineAuth = async () => {
  try {
    // Dynamic import to avoid circular dependencies
    const { seedDemoAccounts, loginUserOffline, createDemoAcademiaData } =
      await import("./offlineAuth");

    console.log("📱 Setting up offline authentication...");

    // Create demo accounts and academia
    seedDemoAccounts();
    createDemoAcademiaData();

    // Auto-login as admin
    await loginUserOffline("admin@demo.com", "demo123");

    console.log("✅ Offline authentication setup complete");

    // Auto-redirect to admin panel after setup
    setTimeout(() => {
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/login"
      ) {
        console.log("🚀 Auto-redirecting to admin panel...");
        window.location.href = "/admin";
      }
    }, 1000);
  } catch (error) {
    console.error("❌ Offline auth setup failed:", error);
  }
};

// Restore network functionality (if needed)
export const deactivateOfflineMode = () => {
  console.log("🌐 Restoring network functionality");
  window.fetch = originalFetch;
  localStorage.removeItem("forceOfflineMode");
  offlineModeActive = false;
};

// Auto-initialize on import
console.log(
  "🚨 NETWORK INTERCEPTOR LOADED - Activating offline mode immediately",
);
initializeOfflineMode();
