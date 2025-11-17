// Offline authentication system as fallback when Firebase is not reachable

interface OfflineUser {
  uid: string;
  email: string;
  password: string; // Hashed
  createdAt: string;
  lastLogin: string;
}

// Simple hash function (not cryptographically secure, but better than plain text)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

// Get all offline users
const getOfflineUsers = (): OfflineUser[] => {
  const users = localStorage.getItem("offlineUsers");
  return users ? JSON.parse(users) : [];
};

// Save offline users
const saveOfflineUsers = (users: OfflineUser[]): void => {
  localStorage.setItem("offlineUsers", JSON.stringify(users));
};

// Register user offline
export const registerUserOffline = async (
  email: string,
  password: string,
): Promise<any> => {
  console.log("📱 Registering user offline...");

  const users = getOfflineUsers();

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    throw new Error("Ya existe una cuenta con este email (offline)");
  }

  const newUser: OfflineUser = {
    uid: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    password: simpleHash(password),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  users.push(newUser);
  saveOfflineUsers(users);

  // Set current session
  localStorage.setItem(
    "offlineCurrentUser",
    JSON.stringify({
      uid: newUser.uid,
      email: newUser.email,
      isOffline: true,
    }),
  );

  console.log("✅ User registered offline successfully");

  return {
    user: {
      uid: newUser.uid,
      email: newUser.email,
      emailVerified: false,
      displayName: null,
      photoURL: null,
      isOffline: true,
    },
  };
};

// Login user offline
export const loginUserOffline = async (
  email: string,
  password: string,
): Promise<any> => {
  console.log("📱 Attempting offline login...");

  const users = getOfflineUsers();
  const hashedPassword = simpleHash(password);

  const user = users.find(
    (u) => u.email === email && u.password === hashedPassword,
  );

  if (!user) {
    throw new Error("Email o contraseña incorrectos (offline)");
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  saveOfflineUsers(users);

  // Set current session
  localStorage.setItem(
    "offlineCurrentUser",
    JSON.stringify({
      uid: user.uid,
      email: user.email,
      isOffline: true,
    }),
  );

  console.log("✅ Offline login successful");

  return {
    user: {
      uid: user.uid,
      email: user.email,
      emailVerified: false,
      displayName: null,
      photoURL: null,
      isOffline: true,
    },
  };
};

// Get current offline user
export const getCurrentOfflineUser = (): any => {
  const currentUser = localStorage.getItem("offlineCurrentUser");
  return currentUser ? JSON.parse(currentUser) : null;
};

// Check if user is authenticated offline
export const isAuthenticatedOffline = (): boolean => {
  return !!getCurrentOfflineUser();
};

// Logout offline user
export const logoutOffline = (): void => {
  localStorage.removeItem("offlineCurrentUser");
  console.log("📱 Logged out from offline mode");
};

// Get offline user stats
export const getOfflineStats = () => {
  const users = getOfflineUsers();
  const currentUser = getCurrentOfflineUser();

  return {
    totalUsers: users.length,
    isLoggedIn: !!currentUser,
    currentUser: currentUser,
    registeredEmails: users.map((u) => u.email),
  };
};

// Create demo academia data for offline users
export const createDemoAcademiaData = () => {
  const demoAcademia = {
    id: "demo-academia-offline",
    slug: "academia-demo-admin",
    name: "Academia Demo Offline",
    type: "oposiciones",
    adminUserId: "offline-admin",
    adminEmail: "admin@demo.com",
    organization: "Academia Demo Offline - Modo Sin Conexión",
    phone: "+34 900 123 456",
    contractDetails: {
      students: 100,
      duration: 12,
      pricePerStudent: 15,
      totalPrice: 1500,
      billingCycle: "monthly",
      isFounder: true,
      isDemoMode: true,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
    },
    status: "active",
    currentStudents: 25,
    teachers: ["profesor@demo.com"],
    assistants: ["guardia-civil", "policia-nacional", "bomberos"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem("offlineDemoAcademia", JSON.stringify(demoAcademia));
  console.log("📚 Demo academia data created for offline mode");
  return demoAcademia;
};

// Get demo academia data
export const getDemoAcademiaData = () => {
  const data = localStorage.getItem("offlineDemoAcademia");
  return data ? JSON.parse(data) : null;
};

// Seed with demo accounts
export const seedDemoAccounts = () => {
  const users = getOfflineUsers();

  const demoAccounts = [
    { email: "admin@demo.com", password: "demo123" },
    { email: "profesor@demo.com", password: "demo123" },
    { email: "estudiante@demo.com", password: "demo123" },
  ];

  let added = 0;

  for (const demo of demoAccounts) {
    if (!users.find((u) => u.email === demo.email)) {
      const newUser: OfflineUser = {
        uid: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: demo.email,
        password: simpleHash(demo.password),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      users.push(newUser);
      added++;
    }
  }

  if (added > 0) {
    saveOfflineUsers(users);
    console.log(`📱 Added ${added} demo accounts for offline testing`);
  }

  // Also create demo academia data
  createDemoAcademiaData();

  return added;
};
